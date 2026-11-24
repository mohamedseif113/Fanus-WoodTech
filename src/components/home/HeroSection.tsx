"use client";

import React from "react";
import Link from "next/link";
import { useI18nStore } from "@/store/useI18nStore";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  CheckCircle2,
  Cpu,
  MoveRight,
} from "lucide-react";

export const HeroSection: React.FC = () => {
  const { t } = useI18nStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EB] to-[#FAF8F5] pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-stone-200/80">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-wood-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Engineering Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-wood-100/80 border border-wood-200/80 text-wood-900 text-xs font-bold tracking-wide shadow-soft-sm">
              <Cpu className="w-3.5 h-3.5 text-wood-700" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
              <span>{t.hero.title1}</span>{" "}
              <span className="relative inline-block text-wood-800">
                {t.hero.titleHighlight}
                <span className="absolute bottom-1 left-0 w-full h-3 bg-wood-200/60 -z-10 rounded-sm" />
              </span>{" "}
              <span>{t.hero.title2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal">
              {t.hero.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/configurator"
                className="px-7 py-4 bg-wood-800 hover:bg-wood-900 text-white font-extrabold text-sm rounded-xl shadow-soft-md hover:shadow-soft-lg flex items-center gap-2.5 transition-all group active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>{t.hero.ctaPrimary}</span>
                <MoveRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products"
                className="px-6 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm rounded-xl transition-all shadow-sm"
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="pt-8 border-t border-stone-300/70 grid grid-cols-2 gap-4 text-xs font-semibold text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-wood-700 flex-shrink-0" />
                <span>{t.hero.featurePrecision}</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-wood-700 flex-shrink-0" />
                <span>{t.hero.feature3D}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-wood-700 flex-shrink-0" />
                <span>{t.hero.featureWarranty}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-wood-700 flex-shrink-0" />
                <span>{t.hero.featureDelivery}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Visual Showcase Card with 3D Configurator CTA */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-soft-xl bg-white p-2">
              <div className="relative h-[420px] rounded-2xl overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80"
                  alt="Fanus WoodTech 3D Furniture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-black/10" />

                {/* Floating Interactive 3D Card Pill */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/60 shadow-soft-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-bold text-stone-900">
                    WebGL 3D Canlı Motor
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                  <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                    Öne Çıkan Vitrin Modülü
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-extrabold text-lg text-white">
                        Fanus Master Vitrin Dolabı
                      </h3>
                      <p className="text-xs text-stone-300">
                        120 x 180 x 40 cm • Doğal Meşe
                      </p>
                    </div>
                    <Link
                      href="/configurator"
                      className="px-3 py-2 bg-white text-stone-900 font-bold text-xs rounded-xl shadow-soft-sm hover:bg-wood-100 transition-all flex items-center gap-1.5"
                    >
                      <span>3D Özelleştir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
