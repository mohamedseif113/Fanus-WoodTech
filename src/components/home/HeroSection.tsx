"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { easeOutCubic, HoverElevate } from "@/components/ui/motion";

export const HeroSection: React.FC = () => {
  const { t } = useI18nStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EB] to-[#FAF8F5] pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-stone-200/80">
      {/* Decorative ambient background blur with subtle pulse */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-wood-200/40 rounded-full blur-3xl pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT: Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Engineering Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOutCubic }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wood-100/90 border border-wood-200/90 text-wood-950 text-xs font-semibold tracking-woodcoder-tag uppercase shadow-soft-sm"
            >
              <Cpu className="w-3.5 h-3.5 text-wood-700" />
              <span>{t.hero.badge}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: easeOutCubic }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1]"
            >
              <span>{t.hero.title1}</span>{" "}
              <span className="relative inline-block text-wood-800">
                {t.hero.titleHighlight}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.45, ease: easeOutCubic }}
                  className="absolute bottom-1 left-0 w-full h-3 bg-wood-200/70 -z-10 rounded-sm origin-left"
                />
              </span>{" "}
              <span>{t.hero.title2}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: easeOutCubic }}
              className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl font-normal"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: easeOutCubic }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <HoverElevate yOffset={-3}>
                <Link
                  href="/configurator"
                  className="px-7 py-4 bg-wood-800 hover:bg-wood-900 text-white font-bold text-sm rounded-xl shadow-soft-md hover:shadow-soft-lg flex items-center gap-2.5 transition-all group active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                  <span>{t.hero.ctaPrimary}</span>
                  <MoveRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </Link>
              </HoverElevate>

              <HoverElevate yOffset={-2}>
                <Link
                  href="/products"
                  className="px-6 py-4 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-semibold text-sm rounded-xl transition-all shadow-sm"
                >
                  {t.hero.ctaSecondary}
                </Link>
              </HoverElevate>
            </motion.div>

            {/* Feature Highlights Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="pt-8 border-t border-stone-300/70 grid grid-cols-2 gap-4 text-xs font-medium text-stone-700"
            >
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
            </motion.div>
          </div>

          {/* RIGHT: Visual Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.2, ease: easeOutCubic }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-soft-xl bg-white p-2 group">
              <div className="relative h-[420px] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80"
                  alt="Fanus WoodTech 3D Furniture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-black/10" />

                {/* Floating Interactive 3D Card Pill */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/60 shadow-soft-md flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold text-stone-900">
                    WebGL 3D Canlı Motor
                  </span>
                </motion.div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                  <div className="text-[11px] font-semibold text-amber-300 tracking-woodcoder-tag uppercase">
                    Öne Çıkan Vitrin Modülü
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-bold text-lg text-white">
                        Fanus Master Vitrin Dolabı
                      </h3>
                      <p className="text-xs text-stone-300">
                        120 x 180 x 40 cm • Doğal Meşe
                      </p>
                    </div>
                    <Link
                      href="/configurator"
                      className="px-3.5 py-2 bg-white text-stone-900 font-bold text-xs rounded-xl shadow-soft-sm hover:bg-wood-100 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span>3D Özelleştir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
