"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { PRODUCTS } from "@/lib/constants/products";
import { useI18nStore } from "@/store/useI18nStore";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import {
  WoodMaterial,
  FinishType,
  FurnitureConfiguration,
} from "@/types/furniture";
import { calculateFurniturePrice } from "@/services/pricing";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Box,
  Image as ImageIcon,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCw,
  Ruler,
  Layers,
  Check,
  Loader2,
} from "lucide-react";
import { FadeIn, HoverElevate } from "@/components/ui/motion";

// Dynamic import of 3D Preview
const ProductPreview3D = dynamic(
  () =>
    import("@/components/furniture-3d/ProductPreview3D").then(
      (mod) => mod.ProductPreview3D
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] flex flex-col items-center justify-center bg-stone-100/80 rounded-3xl gap-3">
        <Loader2 className="w-8 h-8 text-[#3498a7] animate-spin" />
        <span className="text-xs font-semibold text-stone-600">
          3D Model Hazırlanıyor...
        </span>
      </div>
    ),
  }
);

const AVAILABLE_MATERIALS: {
  id: WoodMaterial;
  name: string;
  color: string;
  isDark?: boolean;
}[] = [
  { id: "walnut", name: "Amerikan Ceviz", color: "#61402b", isDark: true },
  { id: "oak", name: "Doğal Meşe", color: "#c89d66" },
  { id: "anthracite", name: "Antrasit Lake", color: "#323538", isDark: true },
  { id: "white", name: "Mat Beyaz", color: "#f5f5f5" },
  { id: "beech", name: "Açık Kayın", color: "#deb887" },
  { id: "black", name: "Mat Siyah", color: "#1c1c1c", isDark: true },
];

const AVAILABLE_FINISHES: { id: FinishType; label: string; desc: string }[] = [
  { id: "matte", label: "İpeksi Mat", desc: "Doğal ahşap dokusu, parlama yapmaz" },
  { id: "satin", label: "Saten Yarı Mat", desc: "Zarif hafif pürüzsüz parlaklık" },
  { id: "gloss", label: "Parlak Lake", desc: "Yansıtıcı şık lake koruma" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18nStore();
  const {
    setDimensions,
    setMaterial,
    setShelfCount,
    setDoorType,
    setLegStyle,
    setFinish,
  } = useConfiguratorStore();
  const { addItem } = useCartStore();

  // Robust product resolution supporting exact IDs, slugified names, and aliases
  const rawId = Array.isArray(params?.id) ? params.id[0] : params?.id || "";
  const decodedId = decodeURIComponent(rawId).toLowerCase().trim();

  const product = useMemo(() => {
    return (
      PRODUCTS.find((p) => {
        const pId = p.id.toLowerCase();
        const pName = p.nameKey.toLowerCase();
        const pSlug = pName.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return (
          pId === decodedId ||
          pName === decodedId ||
          pSlug === decodedId ||
          (decodedId.includes("loft") && (pId.includes("loft") || pName.includes("loft"))) ||
          (decodedId.includes("kitaplik") && (pId.includes("bookshelf") || pName.includes("kitaplık")))
        );
      }) ||
      (decodedId.includes("loft") ? PRODUCTS.find((p) => p.id === "fanus-bookshelf-loft") : null) ||
      PRODUCTS.find((p) => p.id === decodedId) ||
      PRODUCTS[0]
    );
  }, [decodedId]);

  // Gallery and 3D preview state
  const [viewMode, setViewMode] = useState<"3d" | "photo">("3d");
  const [selectedMaterial, setSelectedMaterial] = useState<WoodMaterial>(
    product.defaultMaterial || "walnut"
  );
  const [selectedFinish, setSelectedFinish] = useState<FinishType>("satin");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  // High-res gallery images
  const galleryImages = useMemo(() => {
    if (product.id === "fanus-bookshelf-loft") {
      return [
        "https://images.unsplash.com/photo-1594653303664-83955e81d77a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      ];
    }
    return [product.image, product.image, product.image];
  }, [product]);

  // Real-time price calculation based on chosen material and finish
  const priceBreakdown = useMemo(() => {
    return calculateFurniturePrice({
      dimensions: product.dimensions,
      shelfCount: product.defaultShelves,
      material: selectedMaterial,
      doorType: product.defaultDoors,
      handleStyle: "none",
      legStyle: "metal-plinth",
      finish: selectedFinish,
      backPanel: true,
    });
  }, [product, selectedMaterial, selectedFinish]);

  // Navigate to full 3D Configurator with product pre-configured
  const handleCustomizeIn3D = () => {
    const isTV = product.categoryKey === "tv-units";
    const targetModel = isTV ? "tv-stand" : "cabinet";

    setDimensions(product.dimensions);
    setMaterial(selectedMaterial);
    setShelfCount(product.defaultShelves);
    setDoorType(product.defaultDoors);
    setLegStyle("metal-plinth");
    setFinish(selectedFinish);

    router.push(`/configurator?model=${targetModel}&product=${product.id}`);
  };

  // Direct add to cart from product page
  const handleAddToCart = () => {
    const config: FurnitureConfiguration = {
      id: `config-${Date.now()}-${product.id}`,
      name: product.nameKey,
      dimensions: product.dimensions,
      shelfCount: product.defaultShelves,
      material: selectedMaterial,
      doorType: product.defaultDoors,
      handleStyle: "none",
      legStyle: "metal-plinth",
      finish: selectedFinish,
      backPanel: true,
      priceBreakdown,
    };

    addItem(config, product.nameKey, product.categoryKey);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  const isTV = product.categoryKey === "tv-units";

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 w-full">
      {/* Navigation Breadcrumb */}
      <FadeIn className="mb-6 flex items-center justify-between">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Koleksiyona Dön</span>
        </Link>
        <span className="text-xs font-semibold text-stone-400">
          Ürün Kodu: <span className="font-mono text-stone-700">{product.id}</span>
        </span>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: 3D Viewport & Photo Gallery */}
        <FadeIn direction="right" className="lg:col-span-7 space-y-4">
          {/* Main Visual Display */}
          <div className="relative rounded-3xl border border-stone-200/90 bg-white shadow-soft-lg overflow-hidden min-h-[460px] flex flex-col">
            {/* View Mode Switcher (3D vs Photo) */}
            <div className="absolute top-4 right-4 z-10 bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-stone-200 shadow-soft-sm flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === "3d"
                    ? "bg-[#3498a7] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Canlı Model</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("photo")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === "photo"
                    ? "bg-[#3498a7] text-white shadow-sm"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Fotoğraf</span>
              </button>
            </div>

            {/* Viewport Content */}
            <div className="w-full h-full min-h-[460px] flex-1">
              {viewMode === "3d" ? (
                <ProductPreview3D
                  dimensions={product.dimensions}
                  material={selectedMaterial}
                  shelfCount={product.defaultShelves}
                  doorType={product.defaultDoors}
                  finish={selectedFinish}
                  isTV={isTV}
                />
              ) : (
                <div className="w-full h-full min-h-[460px] relative group overflow-hidden bg-stone-100">
                  <img
                    src={galleryImages[activeImageIndex]}
                    alt={product.nameKey}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-stone-800 border border-stone-200">
                    Görsel {activeImageIndex + 1} / {galleryImages.length}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {galleryImages.map((img, i) => (
              <HoverElevate key={i} yOffset={-2}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(i);
                    setViewMode("photo");
                  }}
                  className={`w-full aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    viewMode === "photo" && activeImageIndex === i
                      ? "border-[#3498a7] ring-2 ring-[#3498a7]/20 shadow-sm"
                      : "border-stone-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </HoverElevate>
            ))}
            {/* Quick 3D button thumbnail */}
            <HoverElevate yOffset={-2}>
              <button
                type="button"
                onClick={() => setViewMode("3d")}
                className={`w-full aspect-[16/10] rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                  viewMode === "3d"
                    ? "border-[#3498a7] bg-[#e5f5f7] text-[#196b77] shadow-sm font-bold"
                    : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 font-medium"
                }`}
              >
                <Box className="w-4 h-4 text-[#3498a7]" />
                <span className="text-[10px]">3D Görünüm</span>
              </button>
            </HoverElevate>
          </div>

          {/* Modular Dimensions Pill Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 text-center">
              <span className="text-[11px] text-stone-500 font-medium block">Genişlik</span>
              <span className="text-base font-extrabold text-stone-900">{product.dimensions.width} cm</span>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 text-center">
              <span className="text-[11px] text-stone-500 font-medium block">Yükseklik</span>
              <span className="text-base font-extrabold text-stone-900">{product.dimensions.height} cm</span>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 text-center">
              <span className="text-[11px] text-stone-500 font-medium block">Derinlik</span>
              <span className="text-base font-extrabold text-stone-900">{product.dimensions.depth} cm</span>
            </div>
          </div>
        </FadeIn>

        {/* Right Column: Product Information, Customization, Pricing & Actions */}
        <FadeIn direction="left" delay={0.1} className="lg:col-span-5 space-y-6">
          {/* Header & Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[#196b77] bg-[#e5f5f7] px-2.5 py-0.5 rounded-full border border-[#3498a7]/30 tracking-woodcoder-tag uppercase">
                {product.categoryKey === "bookshelves" ? "Modüler Kitaplık Serisi" : "Fanus Mimari Seri"}
              </span>
              <span className="text-xs text-stone-400 font-medium">• 100% Masif & E1 Ahşap</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {product.nameKey}
            </h1>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed font-normal">
              {product.descriptionKey}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-3xl bg-stone-50/90 border border-stone-200/90 space-y-2 shadow-soft-sm">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-stone-500 font-medium block">
                  {t.products.startingFrom}
                </span>
                <div className="text-3xl font-black text-stone-900 tracking-tight">
                  {formatCurrency(priceBreakdown.totalPrice, language)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                  Stokta Hazır Üretim
                </span>
              </div>
            </div>
            <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/80 flex items-center justify-between">
              <span>KDV Dahil</span>
              <span>Ücretsiz Adrese Teslimat & Montaj</span>
            </div>
          </div>

          {/* Material & Wood Customization Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900">
                Ahşap & Yüzey Malzemesi:
              </label>
              <span className="text-xs font-semibold text-[#196b77]">
                {AVAILABLE_MATERIALS.find((m) => m.id === selectedMaterial)?.name}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_MATERIALS.map((mat) => {
                const isSelected = selectedMaterial === mat.id;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => setSelectedMaterial(mat.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      isSelected
                        ? "border-[#3498a7] bg-[#e5f5f7] shadow-sm ring-1 ring-[#3498a7]"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-stone-300 shadow-inner flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: mat.color }}
                    >
                      {isSelected && (
                        <Check className={`w-3 h-3 ${mat.isDark ? "text-white" : "text-stone-900"}`} />
                      )}
                    </span>
                    <span className="text-xs font-bold text-stone-800 truncate">
                      {mat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Finish Type Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900">
                Cila & Bitiş Tipi:
              </label>
              <span className="text-xs font-medium text-stone-500">
                {AVAILABLE_FINISHES.find((f) => f.id === selectedFinish)?.label}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {AVAILABLE_FINISHES.map((fin) => {
                const isSelected = selectedFinish === fin.id;
                return (
                  <button
                    key={fin.id}
                    type="button"
                    onClick={() => setSelectedFinish(fin.id)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? "border-[#3498a7] bg-[#3498a7] text-white shadow-sm"
                        : "border-stone-200 text-stone-700 bg-white hover:bg-stone-50"
                    }`}
                  >
                    {fin.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* 3D Configurator Button */}
            <HoverElevate yOffset={-3}>
              <button
                type="button"
                onClick={handleCustomizeIn3D}
                className="w-full py-4 px-6 bg-[#3498a7] hover:bg-[#287e8b] text-white font-bold text-sm rounded-2xl shadow-soft-md hover:shadow-soft-lg flex items-center justify-center gap-2.5 transition-all group active:scale-[0.99]"
              >
                <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>3D Stüdyoda Özelleştir (Konfigüratör)</span>
              </button>
            </HoverElevate>

            {/* Direct Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] ${
                isAddedToCart
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white bg-white"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isAddedToCart ? "Sepete Eklendi ✓" : "Bu Ölçü ve Malzemede Sepete Ekle"}</span>
            </button>
          </div>

          {/* Key Modular Features */}
          <div className="p-4 rounded-2xl bg-wood-50/70 border border-wood-200/80 space-y-2.5">
            <div className="text-xs font-bold text-wood-900 tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-wood-700" />
              <span>Modüler Bileşenler & Donanım</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">18mm E1 Sertifikalı Yoğun Gövde Panelleri</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">Modüler Ayarlanabilir Ağır Hizmet Raf Taşıyıcıları</span>
              </li>
            </ul>
          </div>

          {/* Technical Specifications Accordion / Table */}
          <div className="border-t border-stone-200 pt-5 space-y-3">
            <h3 className="font-extrabold text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-stone-600" />
              <span>Teknik Özellikler & Detaylar</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">Standart Ölçüler:</span>
                <span className="font-bold text-stone-900">
                  {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">Raf Adedi & Modül:</span>
                <span className="font-bold text-stone-900">
                  {product.defaultShelves} Kademeli Eşit Açık Raf
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">Kapak Yapısı:</span>
                <span className="font-bold text-stone-900">
                  {product.defaultDoors === "none" ? "Açık Mimarisi (Kapaksız)" : "Modüler Ahşap Kapak"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">Taşıma Kapasitesi:</span>
                <span className="font-bold text-stone-900">Raf başına 35 kg (Toplam 210 kg)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">Üretim Süresi:</span>
                <span className="font-bold text-stone-900">7 - 10 İş Günü</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">Fanus Garantisi:</span>
                <span className="font-bold text-stone-900">5 Yıl Resmi Üretici Garantisi</span>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-500 text-center">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#3498a7]" />
              <span className="font-bold text-stone-800">Ücretsiz Teslim</span>
              <span>Tüm Türkiye</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#3498a7]" />
              <span className="font-bold text-stone-800">5 Yıl Garanti</span>
              <span>Masif & Mekanizma</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center gap-1">
              <RotateCw className="w-4 h-4 text-[#3498a7]" />
              <span className="font-bold text-stone-800">Modüler Uyum</span>
              <span>Genişletilebilir</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
