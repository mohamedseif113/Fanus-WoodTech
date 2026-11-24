"use client";

import React from "react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";
import { Maximize, MoveVertical, Box } from "lucide-react";

export const DimensionsTab: React.FC = () => {
  const { t } = useI18nStore();
  const { dimensions, setWidth, setHeight, setDepth, setDimensions } =
    useConfiguratorStore();

  const presets = [
    { label: "Kompakt (90x160)", w: 90, h: 160, d: 35 },
    { label: "Standart (120x180)", w: 120, h: 180, d: 40 },
    { label: "Geniş (180x200)", w: 180, h: 200, d: 45 },
    { label: "Maksimum (220x220)", w: 220, h: 220, d: 50 },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div>
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-2">
          Hızlı Ölçü Ön Tanımları
        </label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => setDimensions({ width: p.w, height: p.h, depth: p.d })}
              className={`p-2 text-left rounded-lg border text-xs font-medium transition-all ${
                dimensions.width === p.w &&
                dimensions.height === p.h &&
                dimensions.depth === p.d
                  ? "border-wood-600 bg-wood-50 text-wood-900 font-semibold"
                  : "border-stone-200 hover:border-stone-300 text-stone-700 bg-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* WIDTH */}
      <div className="bg-stone-50/70 p-3.5 rounded-xl border border-stone-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize className="w-4 h-4 text-wood-700" />
            <span className="text-sm font-semibold text-stone-900">
              {t.common.width}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-stone-200">
            <input
              type="number"
              min={60}
              max={240}
              value={dimensions.width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-14 text-sm font-bold text-right text-stone-900 outline-none"
            />
            <span className="text-xs text-stone-500 font-medium">cm</span>
          </div>
        </div>
        <input
          type="range"
          min={60}
          max={240}
          step={5}
          value={dimensions.width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-full accent-wood-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-400">
          <span>Min: 60 cm</span>
          <span>Max: 240 cm</span>
        </div>
      </div>

      {/* HEIGHT */}
      <div className="bg-stone-50/70 p-3.5 rounded-xl border border-stone-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MoveVertical className="w-4 h-4 text-wood-700" />
            <span className="text-sm font-semibold text-stone-900">
              {t.common.height}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-stone-200">
            <input
              type="number"
              min={80}
              max={240}
              value={dimensions.height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-14 text-sm font-bold text-right text-stone-900 outline-none"
            />
            <span className="text-xs text-stone-500 font-medium">cm</span>
          </div>
        </div>
        <input
          type="range"
          min={80}
          max={240}
          step={5}
          value={dimensions.height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className="w-full accent-wood-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-400">
          <span>Min: 80 cm</span>
          <span>Max: 240 cm</span>
        </div>
      </div>

      {/* DEPTH */}
      <div className="bg-stone-50/70 p-3.5 rounded-xl border border-stone-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-wood-700" />
            <span className="text-sm font-semibold text-stone-900">
              {t.common.depth}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-stone-200">
            <input
              type="number"
              min={25}
              max={80}
              value={dimensions.depth}
              onChange={(e) => setDepth(Number(e.target.value))}
              className="w-14 text-sm font-bold text-right text-stone-900 outline-none"
            />
            <span className="text-xs text-stone-500 font-medium">cm</span>
          </div>
        </div>
        <input
          type="range"
          min={25}
          max={80}
          step={2}
          value={dimensions.depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          className="w-full accent-wood-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-400">
          <span>Min: 25 cm</span>
          <span>Max: 80 cm</span>
        </div>
      </div>

      {/* Engineering Note */}
      <div className="p-3 bg-amber-50/80 border border-amber-200/60 rounded-xl text-xs text-amber-900 flex items-start gap-2">
        <span className="font-bold text-amber-700">ⓘ</span>
        <span>
          Tüm paneller 18mm endüstriyel E1 sınıfı MDF/masif gövde standartlarına göre milimetrik hesaplanmaktadır.
        </span>
      </div>
    </div>
  );
};
