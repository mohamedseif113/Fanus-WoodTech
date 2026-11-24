"use client";

import React from "react";
import Link from "next/link";
import { useI18nStore } from "@/store/useI18nStore";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { PRODUCTS } from "@/lib/constants/products";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const FeaturedProducts: React.FC = () => {
  const router = useRouter();
  const { t, language } = useI18nStore();
  const { setDimensions, setMaterial, setShelfCount, setDoorType } =
    useConfiguratorStore();

  const handleCustomizeProduct = (product: (typeof PRODUCTS)[0]) => {
    setDimensions(product.dimensions);
    setMaterial(product.defaultMaterial);
    setShelfCount(product.defaultShelves);
    setDoorType(product.defaultDoors);
    router.push("/configurator");
  };

  return (
    <section className="py-16 sm:py-20 bg-stone-50/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-wood-700 uppercase tracking-wider mb-1">
              Öne Çıkan Tasarımlar
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.products.title}
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-wood-800 hover:text-wood-950 flex items-center gap-1 group"
          >
            <span>{t.common.exploreCatalog}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-soft-sm hover:shadow-soft-lg transition-all flex flex-col group"
            >
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img
                  src={prod.image}
                  alt={prod.nameKey}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-stone-900 border border-stone-200">
                  {prod.dimensions.width}x{prod.dimensions.height}x{prod.dimensions.depth} cm
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-wood-800 transition-colors">
                    {prod.nameKey}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {prod.descriptionKey}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">
                      {t.products.startingFrom}
                    </span>
                    <span className="text-base font-black text-stone-900">
                      {formatCurrency(prod.basePrice, language)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCustomizeProduct(prod)}
                    className="px-3.5 py-2 bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs rounded-xl shadow-soft-sm flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.products.customizeIn3D}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
