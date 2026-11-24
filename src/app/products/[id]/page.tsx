"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS } from "@/lib/constants/products";
import { useI18nStore } from "@/store/useI18nStore";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { formatCurrency } from "@/lib/utils";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18nStore();
  const { setDimensions, setMaterial, setShelfCount, setDoorType } =
    useConfiguratorStore();

  const product = PRODUCTS.find((p) => p.id === params.id) || PRODUCTS[0];

  const handleCustomize = () => {
    setDimensions(product.dimensions);
    setMaterial(product.defaultMaterial);
    setShelfCount(product.defaultShelves);
    setDoorType(product.defaultDoors);
    router.push("/configurator");
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 w-full">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tüm Koleksiyona Dön</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Product Gallery (Left) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-stone-200 bg-stone-100 shadow-soft-lg">
            <img
              src={product.image}
              alt={product.nameKey}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick thumbnails / details */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="aspect-[16/10] rounded-xl overflow-hidden border border-stone-200 bg-stone-100 opacity-90 hover:opacity-100 transition-opacity"
              >
                <img
                  src={product.image}
                  alt={`Detail ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Specs & CTA (Right) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs font-bold text-wood-700 uppercase tracking-wider mb-1">
              Fanus Modüler Mimari Seri
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {product.nameKey}
            </h1>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              {product.descriptionKey}
            </p>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
            <span className="text-xs text-stone-500 font-medium block">
              {t.products.startingFrom}
            </span>
            <div className="text-3xl font-black text-wood-900">
              {formatCurrency(product.basePrice, language)}
            </div>
            <span className="text-[11px] text-stone-400 block">
              KDV dahil • Ücretsiz adrese teslim ve montaj
            </span>
          </div>

          {/* Primary CTA: Design Your Own in 3D */}
          <button
            onClick={handleCustomize}
            className="w-full py-4 px-6 bg-wood-800 hover:bg-wood-900 text-white font-extrabold text-sm rounded-xl shadow-soft-md hover:shadow-soft-lg flex items-center justify-center gap-2.5 transition-all group active:scale-[0.99]"
          >
            <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>{t.common.designYourOwn} (3D)</span>
          </button>

          {/* Technical Specifications */}
          <div className="border-t border-stone-200 pt-6 space-y-4">
            <h3 className="font-extrabold text-stone-900 text-base">
              {t.products.specifications}
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.products.dimensionsStandard}:</span>
                <span className="font-bold text-stone-900">
                  {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth} cm
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.products.materialsAvailable}:</span>
                <span className="font-bold text-stone-900">
                  Meşe, Ceviz, Kayın, Lake (6 Seçenek)
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.products.productionTime}:</span>
                <span className="font-bold text-stone-900">
                  {t.products.productionTimeVal}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">{t.products.warranty}:</span>
                <span className="font-bold text-stone-900">
                  {t.products.warrantyVal}
                </span>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="p-4 rounded-xl bg-wood-50/60 border border-wood-200/80 space-y-2">
            <div className="text-xs font-bold text-wood-900">
              {t.products.includedComponents}
            </div>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {product.features.map((feat, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wood-700 flex-shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
