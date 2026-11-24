"use client";

import React from "react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";
import { WoodMaterial, FinishType } from "@/types/furniture";
import { Check } from "lucide-react";

interface MaterialItem {
  id: WoodMaterial;
  nameKey: string;
  sub: string;
  bgClass: string;
  borderClass: string;
  type: "wood" | "lacquer";
}

const MATERIALS: MaterialItem[] = [
  {
    id: "oak",
    nameKey: "oak",
    sub: "Doğal Meşe Kaplama",
    bgClass: "bg-[#c89d66]",
    borderClass: "border-[#b08754]",
    type: "wood",
  },
  {
    id: "walnut",
    nameKey: "walnut",
    sub: "Amerikan Ceviz Ağacı",
    bgClass: "bg-[#5d3e2b]",
    borderClass: "border-[#4a3021]",
    type: "wood",
  },
  {
    id: "beech",
    nameKey: "beech",
    sub: "Açık İskandinav Kayın",
    bgClass: "bg-[#dfbe99]",
    borderClass: "border-[#caa67f]",
    type: "wood",
  },
  {
    id: "white",
    nameKey: "white",
    sub: "Pürüzsüz Beyaz Lake",
    bgClass: "bg-[#f4f3ef]",
    borderClass: "border-[#d8d6ce]",
    type: "lacquer",
  },
  {
    id: "black",
    nameKey: "black",
    sub: "Derin Siyah Lake",
    bgClass: "bg-[#1a1918]",
    borderClass: "border-[#333333]",
    type: "lacquer",
  },
  {
    id: "anthracite",
    nameKey: "anthracite",
    sub: "Mimari Antrasit Lake",
    bgClass: "bg-[#2d3136]",
    borderClass: "border-[#444a52]",
    type: "lacquer",
  },
];

export const MaterialsTab: React.FC = () => {
  const { t } = useI18nStore();
  const { material, setMaterial, finish, setFinish } = useConfiguratorStore();

  const finishes: { id: FinishType; label: string; desc: string }[] = [
    {
      id: "matte",
      label: t.configurator.finishMatte,
      desc: "Doğal dokulu ve parlamayan yüzey",
    },
    {
      id: "satin",
      label: t.configurator.finishSatin,
      desc: "İpeksi hafif ışıltılı dayanıklı cila",
    },
    {
      id: "gloss",
      label: t.configurator.finishGloss,
      desc: "Derinlik katan reflektif parlak katman",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Materials Grid */}
      <div>
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">
          {t.configurator.materials}
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {MATERIALS.map((m) => {
            const isSelected = material === m.id;
            const displayName =
              t.configurator[m.nameKey as keyof typeof t.configurator] || m.sub;

            return (
              <button
                key={m.id}
                onClick={() => setMaterial(m.id)}
                className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-wood-600 bg-wood-50/70 shadow-sm ring-1 ring-wood-500"
                    : "border-stone-200 hover:border-stone-300 bg-white"
                }`}
              >
                {/* Color preview circle */}
                <div
                  className={`w-9 h-9 rounded-lg shadow-inner flex items-center justify-center flex-shrink-0 ${m.bgClass} ${m.borderClass} border`}
                >
                  {isSelected && (
                    <Check
                      className={`w-4 h-4 ${
                        m.id === "white" || m.id === "beech"
                          ? "text-stone-900"
                          : "text-white"
                      }`}
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-900 truncate">
                    {displayName}
                  </div>
                  <div className="text-[10px] text-stone-500 capitalize">
                    {m.type === "wood" ? "Ahşap Kaplama" : "Lake Boya"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Surface Finish Options */}
      <div className="pt-2 border-t border-stone-200/80">
        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">
          {t.configurator.finishType}
        </label>
        <div className="space-y-2">
          {finishes.map((f) => (
            <button
              key={f.id}
              onClick={() => setFinish(f.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                finish === f.id
                  ? "border-wood-600 bg-wood-50 text-wood-900 font-semibold shadow-sm"
                  : "border-stone-200 hover:border-stone-300 bg-white text-stone-700"
              }`}
            >
              <div>
                <div className="text-xs font-bold">{f.label}</div>
                <div className="text-[11px] text-stone-500">{f.desc}</div>
              </div>
              {finish === f.id && (
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
