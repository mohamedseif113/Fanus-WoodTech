"use client";

/**
 * StorageBedPreviewClient.tsx
 * Client component for the /storage-bed-preview route.
 * Keeps the page.tsx server-only (for metadata), following Next.js App Router patterns.
 */

import React, { useState } from "react";
import { StorageBedCanvas } from "@/components/furniture-3d/StorageBedCanvas";
import type { UpholsteryColor } from "@/components/furniture-3d/StorageBed3D";
import type { WoodMaterial, FinishType } from "@/types/furniture";

const UPHOLSTERY_OPTIONS: { label: string; value: UpholsteryColor; swatch: string }[] = [
  { label: "Güvercin Gri",  value: "dove-grey", swatch: "#b0aaa6" },
  { label: "Antrasit",      value: "charcoal",  swatch: "#3c3c3e" },
  { label: "Fildişi",       value: "ivory",     swatch: "#e8e3d8" },
  { label: "Kum",           value: "sand",      swatch: "#c9b89a" },
  { label: "Lacivert",      value: "navy",      swatch: "#2a3550" },
];

const FRAME_OPTIONS: { label: string; value: WoodMaterial; swatch: string }[] = [
  { label: "Meşe",    value: "oak",       swatch: "#c89d66" },
  { label: "Ceviz",   value: "walnut",    swatch: "#5d3e2b" },
  { label: "Kayın",   value: "beech",     swatch: "#dfbe99" },
  { label: "Beyaz",   value: "white",     swatch: "#f4f3ef" },
  { label: "Siyah",   value: "black",     swatch: "#1a1918" },
];

const FINISH_OPTIONS: { label: string; value: FinishType }[] = [
  { label: "Mat",      value: "matte" },
  { label: "Saten",    value: "satin" },
  { label: "Parlak",   value: "gloss"  },
];

export default function StorageBedPreviewClient() {
  const [upholstery,  setUpholstery]  = useState<UpholsteryColor>("dove-grey");
  const [frameMat,    setFrameMat]    = useState<WoodMaterial>("oak");
  const [frameFinish, setFrameFinish] = useState<FinishType>("satin");
  const [showMech,    setShowMech]    = useState(true);

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-64px)] bg-[#ded7cb]">

      {/* ── 3D Canvas ─────────────────────────────────────────────────────── */}
      <div className="flex-1 relative">
        <StorageBedCanvas
          upholsteryColor={upholstery}
          frameMaterial={frameMat}
          frameFinish={frameFinish}
          showLiftMechanism={showMech}
        />

        {/* Provisional dimensions watermark */}
        <div className="absolute bottom-3 left-3 bg-amber-50/90 border border-amber-300 text-amber-800 text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-sm max-w-xs">
          ⚠️ Boyutlar geçicidir — üretici onayı bekleniyor (Phase 1)
        </div>
      </div>

      {/* ── Control Panel ─────────────────────────────────────────────────── */}
      <aside className="w-full lg:w-72 bg-stone-50 border-l border-stone-200 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-stone-200">
          <h1 className="text-base font-bold text-stone-800">
            Tek Kişilik Yatay Baza
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Phase 1 — 3D Önizleme</p>
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 text-[10px] text-amber-700 leading-snug">
            Boyutlar geçicidir: G 100 cm × D 200 cm × Y 40 cm (⚠️ PROVISIONAL)
          </div>
        </div>

        {/* Upholstery */}
        <div className="p-4 border-b border-stone-100">
          <h2 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
            Döşeme Rengi
          </h2>
          <div className="flex flex-wrap gap-2">
            {UPHOLSTERY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                title={opt.label}
                onClick={() => setUpholstery(opt.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  upholstery === opt.value
                    ? "border-[#3498a7] scale-110 shadow-md"
                    : "border-transparent hover:border-stone-300"
                }`}
                style={{ backgroundColor: opt.swatch }}
              />
            ))}
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">
            {UPHOLSTERY_OPTIONS.find((o) => o.value === upholstery)?.label}
          </p>
        </div>

        {/* Frame material */}
        <div className="p-4 border-b border-stone-100">
          <h2 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
            Çerçeve Malzeme
          </h2>
          <div className="flex flex-wrap gap-2">
            {FRAME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                title={opt.label}
                onClick={() => setFrameMat(opt.value)}
                className={`w-8 h-8 rounded-md border-2 transition-all ${
                  frameMat === opt.value
                    ? "border-[#3498a7] scale-110 shadow-md"
                    : "border-transparent hover:border-stone-300"
                }`}
                style={{ backgroundColor: opt.swatch }}
              />
            ))}
          </div>
          <p className="text-[11px] text-stone-500 mt-1.5">
            {FRAME_OPTIONS.find((o) => o.value === frameMat)?.label}
          </p>
        </div>

        {/* Frame finish */}
        <div className="p-4 border-b border-stone-100">
          <h2 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
            Çerçeve Yüzey
          </h2>
          <div className="flex gap-2">
            {FINISH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFrameFinish(opt.value)}
                className={`flex-1 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  frameFinish === opt.value
                    ? "bg-[#3498a7] text-white border-[#3498a7]"
                    : "bg-white text-stone-600 border-stone-200 hover:border-[#3498a7]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Show lift mechanism */}
        <div className="p-4 border-b border-stone-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-10 h-5 rounded-full transition-colors relative ${
                showMech ? "bg-[#3498a7]" : "bg-stone-300"
              }`}
              onClick={() => setShowMech(!showMech)}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  showMech ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-xs font-medium text-stone-700">
              Kaldırma Mekanizması
            </span>
          </label>
        </div>

        {/* Provisional spec table */}
        <div className="p-4">
          <h2 className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-2">
            Geçici Boyutlar ⚠️
          </h2>
          <table className="w-full text-[11px] text-stone-600">
            <tbody>
              {[
                ["Genişlik", "100 cm"],
                ["Uzunluk", "200 cm"],
                ["Toplam Yükseklik", "40 cm"],
                ["Başlık Yüksekliği", "56 cm"],
                ["Ayak Yüksekliği", "30 cm"],
                ["Panel Kalınlığı", "22 mm"],
                ["Şerit Sayısı", "12"],
                ["Enine Destek Çubuğu", "3"],
              ].map(([label, value]) => (
                <tr key={label} className="border-b border-stone-100 last:border-0">
                  <td className="py-1 text-stone-500">{label}</td>
                  <td className="py-1 font-semibold text-right">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[9px] text-amber-600 mt-2 leading-tight">
            ⚠️ Tüm değerler geçici prototip değerleridir.
            Üretici doğrulaması henüz yapılmamıştır.
          </p>
        </div>
      </aside>
    </div>
  );
}
