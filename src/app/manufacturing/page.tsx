"use client";

import React from "react";
import { useI18nStore } from "@/store/useI18nStore";
import { ManufacturingSection } from "@/components/home/ManufacturingSection";
import { Factory, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ManufacturingPage() {
  const { t } = useI18nStore();

  return (
    <main className="flex-1 flex flex-col">
      {/* Header */}
      <section className="bg-charcoal-950 text-white py-16 sm:py-20 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-wood-900/80 border border-wood-700/60 text-wood-300 text-xs font-bold">
            <Factory className="w-3.5 h-3.5" />
            <span>Endüstriyel Üretim Tesisimiz</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {t.manufacturing.title}
          </h1>
          <p className="text-sm sm:text-base text-stone-300 max-w-2xl leading-relaxed">
            {t.manufacturing.subtitle} Fanus WoodTech, 4.500 m² kapalı alanda faaliyet gösteren CNC işleme merkezleri ve otomasyon hatlarıyla kişiye özel mobilyayı seri üretim hassasiyetiyle buluşturur.
          </p>
        </div>
      </section>

      {/* Standards Cards */}
      <ManufacturingSection />

      {/* CNC & Engineering Deep-Dive */}
      <section className="py-16 bg-stone-50 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-wood-700 uppercase tracking-wider">
                Dijitalden Tezgaha Sıfır Kayıp
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                Parametrik 3D Tasarımdan 5 Eksenli CNC İşlemeye
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Konfigüratör üzerinde belirlediğiniz her milimetrik genişlik, raf aralığı veya kulp deliği konumu, sipariş anında otomatik G-kodlarına dönüştürülür. İnsan hatasına yer bırakmayan entegre yazılım mimarimiz, parçaların birbirine kusursuz şekilde geçmesini sağlar.
              </p>

              <div className="space-y-2 pt-2 text-xs text-stone-700 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>±0.2mm Kesim ve Delik Toleransı</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Optimum Plaka Yerleşimi ile Minimum Ahşap Firesi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Lazer Barkodlu Takip ve Barkod ile Paketleme</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/configurator"
                  className="px-6 py-3.5 bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs rounded-xl shadow-soft-sm inline-flex items-center gap-2 transition-all"
                >
                  <span>3D Tasarımı Başlat</span>
                </Link>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-stone-200 shadow-soft-xl bg-white p-2">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80"
                  alt="Industrial Woodworking Facility"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
