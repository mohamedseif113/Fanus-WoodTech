"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, getProductContent } from "@/lib/constants/products";
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
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCw,
  Ruler,
  Layers,
  Check,
  Eye,
  ArrowRight,
} from "lucide-react";
import { FadeIn, HoverElevate } from "@/components/ui/motion";

const AVAILABLE_MATERIALS: {
  id: WoodMaterial;
  nameTr: string;
  nameEn: string;
  color: string;
  isDark?: boolean;
}[] = [
  { id: "walnut", nameTr: "Amerikan Ceviz", nameEn: "American Walnut", color: "#61402b", isDark: true },
  { id: "oak", nameTr: "Doğal Meşe", nameEn: "Natural Oak", color: "#c89d66" },
  { id: "anthracite", nameTr: "Antrasit Lake", nameEn: "Anthracite Lacquer", color: "#323538", isDark: true },
  { id: "white", nameTr: "Mat Beyaz", nameEn: "Matte White", color: "#f5f5f5" },
  { id: "beech", nameTr: "Açık Kayın", nameEn: "Light Beech", color: "#deb887" },
  { id: "black", nameTr: "Mat Siyah", nameEn: "Matte Black", color: "#1c1c1c", isDark: true },
];

const AVAILABLE_FINISHES: {
  id: FinishType;
  labelTr: string;
  labelEn: string;
}[] = [
  { id: "matte", labelTr: "İpeksi Mat", labelEn: "Silky Matte" },
  { id: "satin", labelTr: "Saten Yarı Mat", labelEn: "Satin Semi-Matte" },
  { id: "gloss", labelTr: "Parlak Lake", labelEn: "Gloss Lacquer" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18nStore();
  const isEn = language === "en";

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

  // Localized product content (name, description, features)
  const productContent = useMemo(() => {
    return getProductContent(product, language);
  }, [product, language]);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<WoodMaterial>(
    product.defaultMaterial || "walnut"
  );
  const [selectedFinish, setSelectedFinish] = useState<FinishType>("satin");
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
    return [
      product.image,
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    ];
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

  // Related products from collection
  const relatedProducts = useMemo(() => {
    return PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  }, [product]);

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
      name: productContent.name,
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

    addItem(config, productContent.name, product.categoryKey);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2500);
  };

  const selectedMaterialObj = AVAILABLE_MATERIALS.find((m) => m.id === selectedMaterial);
  const selectedFinishObj = AVAILABLE_FINISHES.find((f) => f.id === selectedFinish);

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 w-full">
      {/* Navigation Breadcrumb */}
      <FadeIn className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isEn ? "Back to All Collection" : "Tüm Koleksiyona Dön"}</span>
        </Link>
        <span className="text-xs font-semibold text-stone-400">
          {isEn ? "Product ID:" : "Ürün Kodu:"}{" "}
          <span className="font-mono text-stone-700">{product.id}</span>
        </span>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Regular Product Image Gallery (No 3D Viewer) */}
        <FadeIn direction="right" className="lg:col-span-7 space-y-4">
          {/* Main Hero Photo with Zoom on Hover */}
          <div className="relative rounded-3xl border border-stone-200/90 bg-white shadow-soft-lg overflow-hidden aspect-[4/3] sm:aspect-[16/11] group">
            <img
              src={galleryImages[activeImageIndex] || product.image}
              alt={productContent.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Image counter pill */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-stone-800 border border-stone-200 shadow-soft-sm">
              {isEn
                ? `Photo ${activeImageIndex + 1} of ${galleryImages.length}`
                : `Görsel ${activeImageIndex + 1} / ${galleryImages.length}`}
            </div>
            {/* Dimensions overlay badge */}
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-bold text-stone-900 border border-stone-200 shadow-soft-sm">
              {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
            </div>
          </div>

          {/* Interactive Multi-Angle Gallery Thumbnails */}
          <div className="grid grid-cols-3 gap-3">
            {galleryImages.map((img, i) => (
              <HoverElevate key={i} yOffset={-2}>
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(i)}
                  className={`w-full aspect-[16/10] rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIndex === i
                      ? "border-[#3498a7] ring-2 ring-[#3498a7]/20 shadow-sm"
                      : "border-stone-200 opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${productContent.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </HoverElevate>
            ))}
          </div>

          {/* Dimension Metric Cards */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 text-center">
              <span className="text-[11px] text-stone-500 font-medium block">
                {isEn ? "Width" : "Genişlik"}
              </span>
              <span className="text-base font-extrabold text-stone-900">
                {product.dimensions.width} cm
              </span>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 text-center">
              <span className="text-[11px] text-stone-500 font-medium block">
                {isEn ? "Height" : "Yükseklik"}
              </span>
              <span className="text-base font-extrabold text-stone-900">
                {product.dimensions.height} cm
              </span>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 text-center">
              <span className="text-[11px] text-stone-500 font-medium block">
                {isEn ? "Depth" : "Derinlik"}
              </span>
              <span className="text-base font-extrabold text-stone-900">
                {product.dimensions.depth} cm
              </span>
            </div>
          </div>
        </FadeIn>

        {/* Right Column: Product Information, Customization, Pricing & Actions */}
        <FadeIn direction="left" delay={0.1} className="lg:col-span-5 space-y-6">
          {/* Header & Description */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[#196b77] bg-[#e5f5f7] px-2.5 py-0.5 rounded-full border border-[#3498a7]/30 tracking-woodcoder-tag uppercase">
                {product.categoryKey === "bookshelves"
                  ? isEn ? "Modular Bookshelf Series" : "Modüler Kitaplık Serisi"
                  : isEn ? "Fanus Architectural Series" : "Fanus Mimari Seri"}
              </span>
              <span className="text-xs text-stone-400 font-medium">
                • {isEn ? "100% Solid & E1 Panels" : "100% Masif & E1 Ahşap"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {productContent.name}
            </h1>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed font-normal">
              {productContent.description}
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
                  {isEn ? "Made to Order • In Stock" : "Stokta Hazır Üretim"}
                </span>
              </div>
            </div>
            <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/80 flex items-center justify-between">
              <span>{isEn ? "VAT Included" : "KDV Dahil"}</span>
              <span>{isEn ? "Free Delivery & Assembly" : "Ücretsiz Teslimat & Montaj"}</span>
            </div>
          </div>

          {/* Material & Wood Customization Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-900">
                {isEn ? "Wood & Panel Material:" : "Ahşap & Yüzey Malzemesi:"}
              </label>
              <span className="text-xs font-semibold text-[#196b77]">
                {isEn ? selectedMaterialObj?.nameEn : selectedMaterialObj?.nameTr}
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
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all min-h-[44px] ${
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
                      {isEn ? mat.nameEn : mat.nameTr}
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
                {isEn ? "Topcoat & Finish:" : "Cila & Bitiş Tipi:"}
              </label>
              <span className="text-xs font-medium text-stone-500">
                {isEn ? selectedFinishObj?.labelEn : selectedFinishObj?.labelTr}
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
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all min-h-[44px] ${
                      isSelected
                        ? "border-[#3498a7] bg-[#3498a7] text-white shadow-sm"
                        : "border-stone-200 text-stone-700 bg-white hover:bg-stone-50"
                    }`}
                  >
                    {isEn ? fin.labelEn : fin.labelTr}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* 3D Configurator CTA */}
            <HoverElevate yOffset={-3}>
              <button
                type="button"
                onClick={handleCustomizeIn3D}
                className="w-full py-4 px-6 bg-[#3498a7] hover:bg-[#287e8b] text-white font-bold text-sm rounded-2xl shadow-soft-md hover:shadow-soft-lg flex items-center justify-center gap-2.5 transition-all group active:scale-[0.99] min-h-[48px]"
              >
                <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>
                  {isEn
                    ? "Customize in 3D Configurator"
                    : "3D Stüdyoda Özelleştir (Konfigüratör)"}
                </span>
              </button>
            </HoverElevate>

            {/* Direct Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-3.5 px-6 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] min-h-[46px] ${
                isAddedToCart
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white bg-white"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {isAddedToCart
                  ? isEn ? "Added to Cart ✓" : "Sepete Eklendi ✓"
                  : isEn ? "Add to Cart with Selected Specs" : "Bu Ölçü ve Malzemede Sepete Ekle"}
              </span>
            </button>
          </div>

          {/* Key Modular Features */}
          <div className="p-4 rounded-2xl bg-wood-50/70 border border-wood-200/80 space-y-2.5">
            <div className="text-xs font-bold text-wood-900 tracking-tight flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-wood-700" />
              <span>
                {isEn ? "Modular Components & Engineering" : "Modüler Bileşenler & Donanım"}
              </span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700">
              {productContent.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">{feat}</span>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">
                  {isEn
                    ? "18mm E1 Certified High-Density Structural Panels"
                    : "18mm E1 Sertifikalı Yoğun Gövde Panelleri"}
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="font-medium">
                  {isEn
                    ? "Modular Adjustable Heavy-Duty Shelf Pins"
                    : "Modüler Ayarlanabilir Ağır Hizmet Raf Taşıyıcıları"}
                </span>
              </li>
            </ul>
          </div>

          {/* Technical Specifications */}
          <div className="border-t border-stone-200 pt-5 space-y-3">
            <h3 className="font-extrabold text-stone-900 text-sm tracking-tight flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-stone-600" />
              <span>
                {isEn ? "Technical Specifications" : "Teknik Özellikler & Detaylar"}
              </span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">
                  {isEn ? "Dimensions:" : "Standart Ölçüler:"}
                </span>
                <span className="font-bold text-stone-900">
                  {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">
                  {isEn ? "Shelving Module:" : "Raf Adedi & Modül:"}
                </span>
                <span className="font-bold text-stone-900">
                  {product.defaultShelves}{" "}
                  {isEn ? "Tier Modular Shelving" : "Kademeli Eşit Açık Raf"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">
                  {isEn ? "Door Configuration:" : "Kapak Yapısı:"}
                </span>
                <span className="font-bold text-stone-900">
                  {product.defaultDoors === "none"
                    ? isEn ? "Open Architecture (Doorless)" : "Açık Mimarisi (Kapaksız)"
                    : isEn ? "Modular Wooden Doors" : "Modüler Ahşap Kapak"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">
                  {isEn ? "Load Capacity:" : "Taşıma Kapasitesi:"}
                </span>
                <span className="font-bold text-stone-900">
                  {isEn ? "35 kg per shelf (210 kg total)" : "Raf başına 35 kg (Toplam 210 kg)"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">
                  {isEn ? "Production Time:" : "Üretim Süresi:"}
                </span>
                <span className="font-bold text-stone-900">
                  {isEn ? "7 - 10 Business Days" : "7 - 10 İş Günü"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500 font-normal">
                  {isEn ? "Warranty:" : "Fanus Garantisi:"}
                </span>
                <span className="font-bold text-stone-900">
                  {isEn ? "5-Year Official Manufacturer Warranty" : "5 Yıl Resmi Üretici Garantisi"}
                </span>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-500 text-center">
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-[#3498a7]" />
              <span className="font-bold text-stone-800">
                {isEn ? "Free Delivery" : "Ücretsiz Teslim"}
              </span>
              <span>{isEn ? "Nationwide" : "Tüm Türkiye"}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#3498a7]" />
              <span className="font-bold text-stone-800">
                {isEn ? "5-Yr Warranty" : "5 Yıl Garanti"}
              </span>
              <span>{isEn ? "Timber & Hardware" : "Masif & Mekanizma"}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-col items-center gap-1">
              <RotateCw className="w-4 h-4 text-[#3498a7]" />
              <span className="font-bold text-stone-800">
                {isEn ? "Modular" : "Modüler Uyum"}
              </span>
              <span>{isEn ? "Expandable" : "Genişletilebilir"}</span>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Related Products Section */}
      <section className="mt-16 sm:mt-24 pt-12 border-t border-stone-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-semibold text-wood-700 tracking-woodcoder-tag uppercase mb-1">
              {isEn ? "Complementary Designs" : "Tamamlayıcı Modeller"}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {isEn ? "Related Modular Designs" : "Benzer Modüler Tasarımlar"}
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-wood-800 hover:text-wood-950 flex items-center gap-1 group transition-colors"
          >
            <span>{isEn ? "View All" : "Tümünü Gör"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map((relProd) => {
            const relContent = getProductContent(relProd, language);
            return (
              <HoverElevate key={relProd.id} yOffset={-4}>
                <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col h-full group">
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={relProd.image}
                      alt={relContent.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-bold text-stone-900 border border-stone-200">
                      {relProd.dimensions.width}x{relProd.dimensions.height}x{relProd.dimensions.depth} cm
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm group-hover:text-wood-800 transition-colors">
                        {relContent.name}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1">
                        {relContent.description}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-stone-900">
                        {formatCurrency(relProd.basePrice, language)}
                      </span>
                      <Link
                        href={`/products/${relProd.id}`}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isEn ? "View" : "İncele"}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </HoverElevate>
            );
          })}
        </div>
      </section>
    </main>
  );
}
