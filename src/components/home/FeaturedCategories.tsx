"use client";

import React from "react";
import Link from "next/link";
import { useI18nStore } from "@/store/useI18nStore";
import { CATEGORIES } from "@/lib/constants/products";
import { ArrowUpRight } from "lucide-react";

export const FeaturedCategories: React.FC = () => {
  const { t } = useI18nStore();

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold text-wood-700 uppercase tracking-wider mb-1">
              {t.categories.subtitle}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              {t.categories.title}
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-wood-800 hover:text-wood-950 flex items-center gap-1 group"
          >
            <span>Tüm Kategorileri Görüntüle</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.slice(0, 4).map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="group relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50 hover:shadow-soft-lg transition-all"
            >
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={cat.image}
                  alt={cat.nameKey}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <h3 className="font-bold text-base text-white">
                      {t.categories[cat.nameKey as keyof typeof t.categories] || cat.nameKey}
                    </h3>
                    <p className="text-[11px] text-stone-300">
                      {cat.productCount} Temel Model
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-wood-700 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
