"use client";

import React from "react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";
import { Plus, Minus, ShieldCheck } from "lucide-react";

export const LayoutShelvesTab: React.FC = () => {
  const { t } = useI18nStore();
  const {
    dimensions,
    shelfCount,
    setShelfCount,
    backPanel,
    setBackPanel,
  } = useConfiguratorStore();

  const internalHeight = dimensions.height - 3.6; // minus top & bottom 1.8cm
  const spacing = Math.round(internalHeight / (shelfCount + 1));

  return (
    <div className="space-y-6">
      {/* Shelves Count Controls */}
      <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-stone-900 block">
              {t.configurator.shelvesCount}
            </span>
            <span className="text-xs text-stone-500">
              {t.configurator.shelvesRange}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShelfCount(shelfCount - 1)}
              disabled={shelfCount <= 0}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-lg font-bold text-stone-900 w-6 text-center">
              {shelfCount}
            </span>
            <button
              onClick={() => setShelfCount(shelfCount + 1)}
              disabled={shelfCount >= 8}
              className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick shelf buttons */}
        <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-stone-200/60">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].slice(0, 5).map((num) => (
            <button
              key={num}
              onClick={() => setShelfCount(num)}
              className={`py-1.5 text-xs font-semibold rounded-md border transition-all ${
                shelfCount === num
                  ? "bg-wood-700 text-white border-wood-700"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              {num} {num === 0 ? "Raf" : "Raf"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[5, 6, 7, 8].map((num) => (
            <button
              key={num}
              onClick={() => setShelfCount(num)}
              className={`py-1.5 text-xs font-semibold rounded-md border transition-all ${
                shelfCount === num
                  ? "bg-wood-700 text-white border-wood-700"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              {num} Raf
            </button>
          ))}
        </div>

        {/* Spacing Info */}
        <div className="bg-white p-3 rounded-lg border border-stone-200/60 text-xs text-stone-600 flex justify-between items-center">
          <span>Her Bölme Net Boşluğu:</span>
          <span className="font-bold text-stone-900">~{spacing} cm</span>
        </div>
      </div>

      {/* Back Panel Configuration */}
      <div className="bg-stone-50/70 p-4 rounded-xl border border-stone-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-wood-700" />
            <div>
              <span className="text-sm font-semibold text-stone-900 block">
                {t.configurator.backPanelToggle}
              </span>
              <span className="text-xs text-stone-500">
                8mm kanallı arka kapama paneli
              </span>
            </div>
          </div>
          <button
            onClick={() => setBackPanel(!backPanel)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
              backPanel ? "bg-wood-700" : "bg-stone-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                backPanel ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
        <div className="text-xs text-stone-500">
          {backPanel
            ? "Arkalık panel takılı. Gövde rijitliği ve toz koruması sağlar."
            : "Açık arka vitrin mimarisi. Duvar rengini sergilemek veya oda bölücü olarak kullanmak için uygundur."}
        </div>
      </div>
    </div>
  );
};
