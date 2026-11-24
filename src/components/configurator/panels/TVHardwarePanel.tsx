"use client";

import React from "react";
import { useTVStandStore, TVDoorType } from "@/store/useTVStandStore";
import { useI18nStore } from "@/store/useI18nStore";
import { HandleStyle, LegStyle } from "@/types/furniture";
import { DoorClosed, Check } from "lucide-react";

export const TVHardwarePanel: React.FC = () => {
  const { t } = useI18nStore();
  const {
    upperSection,
    upperDoors,
    setUpperDoors,
    handleStyle,
    setHandleStyle,
    legStyle,
    setLegStyle,
  } = useTVStandStore();

  const doorOptions: { id: TVDoorType; label: string; desc: string }[] = [
    { id: "none", label: t.configurator.noDoors, desc: "Açık bölmeler & raf yerleşimi" },
    { id: "solid", label: t.configurator.doorSolid, desc: "Seçili ahşap/lake dokulu gövde kapak" },
    { id: "glass", label: t.configurator.doorGlass, desc: "Alüminyum profilli füme temperli cam" },
  ];

  const handleOptions: { id: HandleStyle; label: string }[] = [
    { id: "minimal-bar", label: t.configurator.handleMinimalBar },
    { id: "round-knob", label: t.configurator.handleRoundKnob },
    { id: "edge-pull", label: t.configurator.handleEdgePull },
    { id: "none", label: t.configurator.handleNone },
  ];

  const legOptions: { id: LegStyle; label: string; desc: string }[] = [
    { id: "none", label: t.configurator.legNone, desc: "Yere sıfır gizli pabuç baza (Modern)" },
    { id: "wood-tapered", label: t.configurator.legWoodTapered, desc: "12cm masif ahşap konik ayaklar" },
    { id: "metal-plinth", label: t.configurator.legMetalPlinth, desc: "8cm siyah elektrostatik metal baza" },
    { id: "hairpin-black", label: t.configurator.legHairpinBlack, desc: "12cm endüstriyel tel çelik ayak" },
  ];

  return (
    <div className="space-y-5">
      {/* Upper Doors (active when upper cabinets or mixed layout is selected) */}
      {(upperSection === "cabinets" || upperSection === "mixed") && (
        <div>
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <DoorClosed className="w-3.5 h-3.5 text-wood-600" />
            {t.configurator.upperDoors}
          </label>
          <div className="space-y-1.5">
            {doorOptions.map((opt) => {
              const isSelected = upperDoors === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setUpperDoors(opt.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-wood-700 bg-wood-50/50 shadow-sm"
                      : "border-stone-200 hover:border-stone-300 bg-white"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-stone-900">{opt.label}</div>
                    <div className="text-[10px] text-stone-500">{opt.desc}</div>
                  </div>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-wood-700 text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Handle Style */}
      <div className="pt-2 border-t border-stone-100">
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
          {t.configurator.handleStyle}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {handleOptions.map((h) => {
            const isSelected = handleStyle === h.id;
            return (
              <button
                key={h.id}
                onClick={() => setHandleStyle(h.id)}
                className={`p-2.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? "border-wood-700 bg-wood-50/50 font-bold text-wood-950 shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-white text-stone-700"
                }`}
              >
                <div className="text-xs font-semibold">{h.label}</div>
                {isSelected && (
                  <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-wood-700 text-white flex items-center justify-center">
                    <Check className="w-2 h-2" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leg & Base System */}
      <div className="pt-2 border-t border-stone-100">
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
          {t.configurator.legStyle}
        </label>
        <div className="space-y-1.5">
          {legOptions.map((leg) => {
            const isSelected = legStyle === leg.id;
            return (
              <button
                key={leg.id}
                onClick={() => setLegStyle(leg.id)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? "border-wood-700 bg-wood-50/50 shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-stone-900">{leg.label}</div>
                  <div className="text-[10px] text-stone-500">{leg.desc}</div>
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-wood-700 text-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
