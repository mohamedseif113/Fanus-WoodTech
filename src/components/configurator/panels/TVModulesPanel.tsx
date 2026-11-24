"use client";

import React from "react";
import { useTVStandStore, TVUpperType } from "@/store/useTVStandStore";
import { useI18nStore } from "@/store/useI18nStore";
import { Check } from "lucide-react";

export const TVModulesPanel: React.FC = () => {
  const { t } = useI18nStore();
  const {
    upperSection,
    setUpperSection,
    openShelvesCount,
    setOpenShelvesCount,
    sidePanels,
    setSidePanels,
    backPanel,
    setBackPanel,
    tvNiche,
    setTvNiche,
  } = useTVStandStore();

  const upperOptions: { id: TVUpperType; label: string; desc: string }[] = [
    { id: "none", label: t.configurator.upperNone, desc: "Sadece alçak TV konsolu" },
    { id: "cabinets", label: t.configurator.upperCabinets, desc: "Duvara monteli kapalı dolaplar" },
    { id: "open-shelves", label: t.configurator.upperShelves, desc: "Açık yüzen mimari raflar" },
    { id: "mixed", label: t.configurator.upperMixed, desc: "Üst dolap + alt açık sergileme rafı" },
  ];

  return (
    <div className="space-y-4">
      {/* Upper Module Selector */}
      <div>
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
          {t.configurator.upperSection}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {upperOptions.map((opt) => {
            const isSelected = upperSection === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setUpperSection(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "border-wood-700 bg-wood-50/50 shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                {isSelected && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-wood-700 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
                <div className="text-xs font-bold text-stone-900">{opt.label}</div>
                <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Open Shelves Count Slider (if applicable) */}
      {(upperSection === "open-shelves" || upperSection === "mixed") && (
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
            <span>{t.configurator.openShelvesCount}</span>
            <span className="text-xs font-extrabold text-wood-800 px-2 py-0.5 bg-white rounded border border-stone-200">
              {openShelvesCount} Adet
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={openShelvesCount}
            onChange={(e) => setOpenShelvesCount(Number(e.target.value))}
            className="w-full accent-wood-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-stone-400">
            <span>1 Raf</span>
            <span>5 Raf</span>
          </div>
        </div>
      )}

      {/* Structural Toggles */}
      <div className="space-y-2 pt-2 border-t border-stone-100">
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
          Gövde & Detay Seçenekleri
        </label>

        {/* Side Decorative Panels */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50">
          <div>
            <div className="text-xs font-bold text-stone-800">{t.configurator.sidePanels}</div>
            <div className="text-[10px] text-stone-500">Konsol yanlarına estetik kalınlaştırma panelleri</div>
          </div>
          <button
            type="button"
            onClick={() => setSidePanels(!sidePanels)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              sidePanels ? "bg-wood-700" : "bg-stone-200"
            }`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                sidePanels ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Back Panel */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50">
          <div>
            <div className="text-xs font-bold text-stone-800">{t.configurator.backPanelToggle}</div>
            <div className="text-[10px] text-stone-500">8mm oluklu mukavim arka kapama</div>
          </div>
          <button
            type="button"
            onClick={() => setBackPanel(!backPanel)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              backPanel ? "bg-wood-700" : "bg-stone-200"
            }`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                backPanel ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* TV Niche / Cable Channel */}
        <div className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50">
          <div>
            <div className="text-xs font-bold text-stone-800">{t.configurator.tvNiche}</div>
            <div className="text-[10px] text-stone-500">Gizli kablo geçiş kanalı & priz yuvası</div>
          </div>
          <button
            type="button"
            onClick={() => setTvNiche(!tvNiche)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              tvNiche ? "bg-wood-700" : "bg-stone-200"
            }`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                tvNiche ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
