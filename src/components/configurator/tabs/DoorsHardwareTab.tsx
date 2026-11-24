"use client";

import React from "react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";
import { DoorConfiguration, HandleStyle, LegStyle } from "@/types/furniture";
import { Check } from "lucide-react";

export const DoorsHardwareTab: React.FC = () => {
  const { t } = useI18nStore();
  const {
    doorType,
    setDoorType,
    handleStyle,
    setHandleStyle,
    legStyle,
    setLegStyle,
  } = useConfiguratorStore();

  const doorOptions: { id: DoorConfiguration; label: string; desc: string }[] = [
    {
      id: "none",
      label: t.configurator.noDoors,
      desc: "Tamamen açık raflı modern vitrin düzeni",
    },
    {
      id: "two-doors",
      label: t.configurator.twoDoors,
      desc: "Boydan boya 2 kanatlı klasik zarif kapak",
    },
    {
      id: "four-doors",
      label: t.configurator.fourDoors,
      desc: "Üst ve alt olmak üzere 4 bağımsız kapak",
    },
    {
      id: "half-doors",
      label: t.configurator.halfDoors,
      desc: "Alt kısım kapaklı gizli depolama, üst kısım açık",
    },
  ];

  const handleOptions: { id: HandleStyle; label: string }[] = [
    { id: "minimal-bar", label: t.configurator.handleMinimalBar },
    { id: "round-knob", label: t.configurator.handleRoundKnob },
    { id: "edge-pull", label: t.configurator.handleEdgePull },
    { id: "none", label: t.configurator.handleNone },
  ];

  const legOptions: { id: LegStyle; label: string; desc: string }[] = [
    {
      id: "wood-tapered",
      label: t.configurator.legWoodTapered,
      desc: "Pirinç yüksüklü 15cm masif konik ayak",
    },
    {
      id: "metal-plinth",
      label: t.configurator.legMetalPlinth,
      desc: "Elektrostatik siyah boyalı çelik kutu baza",
    },
    {
      id: "hairpin-black",
      label: t.configurator.legHairpinBlack,
      desc: "Endüstriyel loft tarzı 3 kollu tel ayak",
    },
    {
      id: "none",
      label: t.configurator.legNone,
      desc: "Zemine sıfır gizli ayarlanabilir pabuçlar",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Door Configuration */}
      <div>
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">
          {t.configurator.doorConfiguration}
        </label>
        <div className="space-y-2">
          {doorOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setDoorType(opt.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                doorType === opt.id
                  ? "border-wood-600 bg-wood-50 text-wood-900 font-semibold shadow-sm"
                  : "border-stone-200 hover:border-stone-300 bg-white text-stone-700"
              }`}
            >
              <div>
                <div className="text-xs font-bold">{opt.label}</div>
                <div className="text-[11px] text-stone-500">{opt.desc}</div>
              </div>
              {doorType === opt.id && (
                <div className="w-5 h-5 rounded-full bg-wood-700 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Handles (only if doors enabled) */}
      {doorType !== "none" && (
        <div className="pt-2 border-t border-stone-200/80">
          <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">
            {t.configurator.handleStyle}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {handleOptions.map((h) => (
              <button
                key={h.id}
                onClick={() => setHandleStyle(h.id)}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs ${
                  handleStyle === h.id
                    ? "border-wood-600 bg-wood-50 text-wood-900 font-bold shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-white text-stone-700"
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Legs & Base */}
      <div className="pt-2 border-t border-stone-200/80">
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">
          {t.configurator.legStyle}
        </label>
        <div className="space-y-2">
          {legOptions.map((l) => (
            <button
              key={l.id}
              onClick={() => setLegStyle(l.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                legStyle === l.id
                  ? "border-wood-600 bg-wood-50 text-wood-900 font-semibold shadow-sm"
                  : "border-stone-200 hover:border-stone-300 bg-white text-stone-700"
              }`}
            >
              <div>
                <div className="text-xs font-bold">{l.label}</div>
                <div className="text-[11px] text-stone-500">{l.desc}</div>
              </div>
              {legStyle === l.id && (
                <div className="w-5 h-5 rounded-full bg-wood-700 text-white flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
