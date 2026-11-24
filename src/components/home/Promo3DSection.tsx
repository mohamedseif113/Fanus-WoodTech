"use client";

import React from "react";
import Link from "next/link";
import { useI18nStore } from "@/store/useI18nStore";
import {
  Rotate3D,
  Layers,
  Sparkles,
  ArrowRight,
  Maximize2,
  Check,
} from "lucide-react";

export const Promo3DSection: React.FC = () => {
  const { t } = useI18nStore();

  return (
    <section className="py-16 sm:py-24 bg-charcoal-950 text-white overflow-hidden relative border-b border-stone-800">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-wood-800/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wood-900/80 border border-wood-700/60 text-wood-300 text-xs font-bold tracking-wide">
              <Rotate3D className="w-3.5 h-3.5" />
              <span>{t.promo3D.tag}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {t.promo3D.title}
            </h2>

            <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
              {t.promo3D.subtitle}
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-stone-300">
              {[
                t.promo3D.feature1,
                t.promo3D.feature2,
                t.promo3D.feature3,
                t.promo3D.feature4,
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-wood-600/30 text-wood-400 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Link
                href="/configurator"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-wood-600 hover:bg-wood-500 text-white font-extrabold text-sm rounded-xl shadow-soft-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>{t.promo3D.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Visual Interactive Teaser */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-stone-800 bg-stone-900/60 p-4 shadow-2xl">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative group">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                  alt="3D Furniture Studio"
                  className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/20 to-transparent" />

                {/* Exploded View Indicator Badge */}
                <div className="absolute top-4 left-4 bg-amber-500/90 text-charcoal-950 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md">
                  <Layers className="w-4 h-4" />
                  <span>İnteraktif Patlatılmış Görünüm</span>
                </div>

                {/* Bottom interactive card */}
                <div className="absolute bottom-4 left-4 right-4 bg-stone-900/90 backdrop-blur-md p-4 rounded-xl border border-stone-700 text-white flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">Gerçek Zamanlı Parametrik Geometri</div>
                    <div className="text-[11px] text-stone-400">18mm E1 Gövde • 360° Döndürme • Anlık Fiyat</div>
                  </div>
                  <Link
                    href="/configurator"
                    className="p-2 bg-wood-700 hover:bg-wood-600 rounded-lg text-white"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
