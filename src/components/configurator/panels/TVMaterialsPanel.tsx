"use client";

import React from "react";
import { useTVStandStore } from "@/store/useTVStandStore";
import { useI18nStore } from "@/store/useI18nStore";
import { WoodMaterial, FinishType } from "@/types/furniture";
import { Check, Sparkles } from "lucide-react";

export const TVMaterialsPanel: React.FC = () => {
  const { t } = useI18nStore();
  const { material, setMaterial, finish, setFinish } = useTVStandStore();

  const materials: { id: WoodMaterial; label: string; sub: string; color: string; border?: string }[] = [
    { id: "oak", label: t.configurator.oak, sub: "Doğal Meşe Kaplama", color: "#c49a6c" },
    { id: "walnut", label: t.configurator.walnut, sub: "Amerikan Ceviz Kaplama", color: "#5a3d28" },
    { id: "beech", label: t.configurator.beech, sub: "Açık Doğal Kayın", color: "#d9b99b" },
    { id: "white", label: t.configurator.white, sub: "Mat Lake MDF", color: "#f8f8f6", border: "#e5e5e5" },
    { id: "black", label: t.configurator.black, sub: "Mat Siyah Lake MDF", color: "#1e1e1e" },
    { id: "anthracite", label: t.configurator.anthracite, sub: "Antrasit Lake MDF", color: "#363d42" },
  ];

  const finishes: { id: FinishType; label: string; desc: string }[] = [
    { id: "matte", label: t.configurator.finishMatte, desc: "0 parlaklık, doğal ahşap dokunuşu" },
    { id: "satin", label: t.configurator.finishSatin, desc: "İpeksi hafif ışıltı, kolay temizlenir" },
    { id: "gloss", label: t.configurator.finishGloss, desc: "Piyano parlaklık, derin yansımalar" },
  ];

  return (
    <div className="space-y-5">
      {/* Material Grid Swatches */}
      <div>
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2.5">
          {t.configurator.materials}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {materials.map((m) => {
            const isSelected = material === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMaterial(m.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 relative ${
                  isSelected
                    ? "border-wood-700 bg-wood-50/50 ring-1 ring-wood-700/30 shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                {/* Visual Swatch Circle */}
                <div
                  className="w-8 h-8 rounded-full shadow-inner flex-shrink-0 relative overflow-hidden"
                  style={{
                    backgroundColor: m.color,
                    border: m.border ? `1px solid ${m.border}` : "1px solid rgba(0,0,0,0.1)",
                  }}
                >
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className={`w-4 h-4 ${m.id === "white" ? "text-stone-900" : "text-white"}`} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-stone-900 truncate">{m.label}</div>
                  <div className="text-[10px] text-stone-500 truncate">{m.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface Finish */}
      <div className="pt-2 border-t border-stone-100">
        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-wood-600" />
          {t.configurator.finishType}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {finishes.map((f) => {
            const isSelected = finish === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFinish(f.id)}
                className={`p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? "border-wood-700 bg-wood-50/70 text-wood-950 font-bold shadow-sm"
                    : "border-stone-200 hover:border-stone-300 bg-white text-stone-700"
                }`}
              >
                <div className="text-xs font-bold">{f.label}</div>
                <div className="text-[9px] text-stone-500 mt-0.5 leading-tight">{f.desc}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
