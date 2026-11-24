"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18nStore } from "@/store/useI18nStore";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { PRODUCTS } from "@/lib/constants/products";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, ArrowRight } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverElevate } from "@/components/ui/motion";

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
    <section className="py-16 sm:py-24 bg-stone-50/60 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="text-xs font-semibold text-wood-700 tracking-woodcoder-tag uppercase mb-1.5">
              Öne Çıkan Tasarımlar
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              {t.products.title}
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-wood-800 hover:text-wood-950 flex items-center gap-1 group transition-colors"
          >
            <span>{t.common.exploreCatalog}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.slice(0, 3).map((prod) => (
            <StaggerItem key={prod.id}>
              <HoverElevate yOffset={-6}>
                <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-soft-sm hover:shadow-soft-lg transition-all duration-300 flex flex-col group h-full">
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={prod.image}
                      alt={prod.nameKey}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-stone-900 border border-stone-200 shadow-soft-sm">
                      {prod.dimensions.width}x{prod.dimensions.height}x{prod.dimensions.depth} cm
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-wood-800 transition-colors tracking-tight">
                        {prod.nameKey}
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-1.5 leading-relaxed font-normal">
                        {prod.descriptionKey}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-3">
                        {prod.features.slice(0, 2).map((f, i) => (
                          <span
                            key={i}
                            className="bg-stone-50 border border-stone-200 text-stone-600 text-[10px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-medium">
                          {t.products.startingFrom}
                        </span>
                        <span className="text-base font-extrabold text-stone-900">
                          {formatCurrency(prod.basePrice, language)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleCustomizeProduct(prod)}
                        className="px-3.5 py-2 bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs rounded-xl shadow-soft-sm flex items-center gap-1.5 transition-all active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>{t.products.customizeIn3D}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </HoverElevate>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};
