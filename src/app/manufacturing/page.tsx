"use client";

import React from "react";
import { useI18nStore } from "@/store/useI18nStore";
import { ManufacturingSection } from "@/components/home/ManufacturingSection";
import {
  Factory,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { FadeIn, ImageReveal, HoverElevate } from "@/components/ui/motion";

export default function ManufacturingPage() {
  const { t } = useI18nStore();

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <section className="bg-charcoal-950 text-white py-16 sm:py-24 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-wood-900/80 border border-wood-700/60 text-wood-300 text-xs font-semibold tracking-woodcoder-tag uppercase">
              <Factory className="w-3.5 h-3.5" />
              <span>Endüstriyel Üretim Tesisimiz</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t.manufacturing.title}
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed font-normal">
              {t.manufacturing.subtitle} Fanus WoodTech, 4.500 m² kapalı alanda faaliyet gösteren CNC işleme merkezleri ve otomasyon hatlarıyla kişiye özel mobilyayı seri üretim hassasiyetiyle buluşturur.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Standards Cards */}
      <ManufacturingSection />

      {/* CNC & Engineering Deep-Dive */}
      <section className="py-16 sm:py-24 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn direction="right" className="space-y-5">
              <span className="text-xs font-semibold text-wood-700 tracking-woodcoder-tag uppercase">
                Dijitalden Tezgaha Sıfır Kayıp
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                Parametrik 3D Tasarımdan 5 Eksenli CNC İşlemeye
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                Konfigüratör üzerinde belirlediğiniz her milimetrik genişlik, raf aralığı veya kulp deliği konumu, sipariş anında otomatik G-kodlarına dönüştürülür. İnsan hatasına yer bırakmayan entegre yazılım mimarimiz, parçaların birbirine kusursuz şekilde geçmesini sağlar.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-stone-700 font-medium">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>±0.2mm Kesim ve Delik Toleransı</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Optimum Plaka Yerleşimi ile Minimum Ahşap Firesi</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Lazer Barkodlu Takip ve Otomatik Paketleme</span>
                </div>
              </div>

              <div className="pt-4">
                <HoverElevate yOffset={-3} className="inline-block">
                  <Link
                    href="/configurator"
                    className="px-6 py-3.5 bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs rounded-xl shadow-soft-sm inline-flex items-center gap-2 transition-all active:scale-95"
                  >
                    <span>3D Tasarımı Başlat</span>
                  </Link>
                </HoverElevate>
              </div>
            </FadeIn>

            <FadeIn direction="left" delay={0.2}>
              <ImageReveal className="rounded-3xl border border-stone-200 shadow-soft-xl bg-white p-2 group">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                    alt="Industrial Woodworking Facility"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </ImageReveal>
            </FadeIn>
          </div>
        </div>
      </section>
    </main>
  );
}
