"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18nStore } from "@/store/useI18nStore";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { PRODUCTS, CATEGORIES } from "@/lib/constants/products";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  Sparkles,
  ArrowUpDown,
  Eye,
  Loader2,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverElevate } from "@/components/ui/motion";

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const { t, language } = useI18nStore();
  const { setDimensions, setMaterial, setShelfCount, setDoorType } =
    useConfiguratorStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "name">("popular");

  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryKey === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameKey.toLowerCase().includes(q) ||
          p.descriptionKey.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.nameKey.localeCompare(b.nameKey));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCustomizeProduct = (product: (typeof PRODUCTS)[0]) => {
    setDimensions(product.dimensions);
    setMaterial(product.defaultMaterial);
    setShelfCount(product.defaultShelves);
    setDoorType(product.defaultDoors);
    router.push("/configurator");
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full">
      {/* Header */}
      <FadeIn className="mb-10 space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
          {t.products.title}
        </h1>
        <p className="text-sm text-stone-600 max-w-2xl leading-relaxed font-normal">
          {t.products.subtitle}
        </p>
      </FadeIn>

      {/* Filter & Search Bar */}
      <FadeIn delay={0.1} className="bg-white p-4 rounded-2xl border border-stone-200 shadow-soft-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.products.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-wood-500 font-sans"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-wood-800 text-white shadow-sm"
                : "bg-stone-100 text-stone-700 hover:bg-stone-200"
            }`}
          >
            {t.categories.all}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? "bg-wood-800 text-white shadow-sm"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {t.categories[c.nameKey as keyof typeof t.categories] || c.id}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "popular" | "price-asc" | "price-desc" | "name")}
            className="text-xs font-semibold text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-wood-500 font-sans"
          >
            <option value="popular">{t.products.sortPopular}</option>
            <option value="price-asc">{t.products.sortPriceAsc}</option>
            <option value="price-desc">{t.products.sortPriceDesc}</option>
            <option value="name">{t.products.sortNameAsc}</option>
          </select>
        </div>
      </FadeIn>

      {/* Results Count */}
      <div className="text-xs text-stone-500 mb-6 font-medium">
        Toplam <span className="font-bold text-stone-800">{filteredProducts.length}</span> {t.products.foundProducts}
      </div>

      {/* Products Stagger Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((prod) => (
          <StaggerItem key={prod.id}>
            <HoverElevate yOffset={-6} className="h-full">
              <div className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-soft-sm hover:shadow-soft-lg transition-all duration-300 flex flex-col group h-full">
                {/* Image */}
                <div className="aspect-[16/11] w-full overflow-hidden relative">
                  <img
                    src={prod.image}
                    alt={prod.nameKey}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-stone-900 border border-stone-200 shadow-soft-sm">
                    {prod.dimensions.width}x{prod.dimensions.height}x{prod.dimensions.depth} cm
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <Link href={`/products/${prod.id}`}>
                      <h3 className="font-extrabold text-stone-900 text-lg group-hover:text-wood-800 transition-colors tracking-tight">
                        {prod.nameKey}
                      </h3>
                    </Link>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed font-normal">
                      {prod.descriptionKey}
                    </p>

                    {/* Features pills */}
                    <div className="flex flex-wrap gap-1 pt-2">
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

                  {/* Price & Action */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-medium">
                        {t.products.startingFrom}
                      </span>
                      <span className="text-base font-extrabold text-stone-900">
                        {formatCurrency(prod.basePrice, language)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${prod.id}`}
                        className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition-all active:scale-95"
                        title={t.common.viewDetails}
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

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
              </div>
            </HoverElevate>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-wood-700 animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
