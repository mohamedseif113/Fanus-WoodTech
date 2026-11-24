"use client";

import React from "react";
import Link from "next/link";
import { useI18nStore } from "@/store/useI18nStore";
import { CATEGORIES } from "@/lib/constants/products";
import { ArrowRight, Sparkles } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverElevate } from "@/components/ui/motion";

export default function CategoriesPage() {
  const { t, language } = useI18nStore();
  const isEn = language === "en";

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
      <FadeIn className="mb-12 space-y-2">
        <div className="text-xs font-semibold text-wood-700 tracking-woodcoder-tag uppercase">
          {isEn ? "Modular Living Spaces" : "Modüler Yaşam Alanları"}
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
          {t.categories.title}
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed font-normal">
          {t.categories.subtitle}
        </p>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CATEGORIES.map((c) => {
          const name = t.categories[c.nameKey as keyof typeof t.categories] || c.id;
          const desc = t.categories[c.descriptionKey as keyof typeof t.categories] || "";

          return (
            <StaggerItem key={c.id}>
              <HoverElevate yOffset={-6} className="h-full">
                <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-soft-sm hover:shadow-soft-lg transition-all duration-300 flex flex-col group h-full">
                  <div className="aspect-[16/10] w-full overflow-hidden relative">
                    <img
                      src={c.image}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3.5 left-4 text-white">
                      <span className="text-[11px] font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                        {c.productCount} {isEn ? "Base Designs" : "Temel Tasarım"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-xl font-extrabold text-stone-900 group-hover:text-wood-800 transition-colors tracking-tight">
                        {name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed font-normal">
                        {desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                      <Link
                        href={`/products?category=${c.id}`}
                        className="text-xs font-bold text-stone-700 hover:text-stone-900 flex items-center gap-1 group/link transition-colors min-h-[36px]"
                      >
                        <span>{isEn ? "Explore Models" : "Modelleri İncele"}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>

                      <Link
                        href="/configurator"
                        className="px-3.5 py-1.5 bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95 min-h-[36px]"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>{isEn ? "Design in 3D" : "3D Tasarla"}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </HoverElevate>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </main>
  );
}
