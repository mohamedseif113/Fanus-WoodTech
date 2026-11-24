"use client";

import React, { useState } from "react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";
import { useCartStore } from "@/store/useCartStore";
import { formatCurrency } from "@/lib/utils";
import {
  ShoppingCart,
  BookmarkPlus,
  Copy,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

interface SummaryTabProps {
  onOpenSaveModal: () => void;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ onOpenSaveModal }) => {
  const { t, language } = useI18nStore();
  const {
    dimensions,
    shelfCount,
    material,
    doorType,
    handleStyle,
    legStyle,
    finish,
    backPanel,
    priceBreakdown,
    resetConfiguration,
    getCurrentConfiguration,
  } = useConfiguratorStore();

  const { addItem } = useCartStore();
  const [copied, setCopied] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);

  const handleAddToCart = () => {
    const config = getCurrentConfiguration();
    addItem(config, "Fanus Özel 3D Vitrin Dolabı", "Display Cabinets");
    setCartSuccess(true);
    setTimeout(() => setCartSuccess(false), 2500);
  };

  const handleCopySpecs = () => {
    const specs = `FANUS WOODTECH 3D - TASARIM DÖKÜMÜ:
------------------------------------------
Genişlik: ${dimensions.width} cm
Yükseklik: ${dimensions.height} cm
Derinlik: ${dimensions.depth} cm
İç Raf Sayısı: ${shelfCount} Adet
Gövde & Kapak: ${material.toUpperCase()} (${finish.toUpperCase()})
Kapak Tipi: ${doorType}
Kulp: ${handleStyle}
Ayak / Baza: ${legStyle}
Arkalık Paneli: ${backPanel ? "Mevcut (8mm)" : "Açık"}
Tahmini Fiyat: ${formatCurrency(priceBreakdown.totalPrice, language)}
------------------------------------------`;

    navigator.clipboard.writeText(specs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Price Breakdown Card */}
      <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200/80 space-y-3">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
          Maliyet & Fiyat Dökümü
        </h4>

        <div className="space-y-2 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>{t.configurator.basePrice}:</span>
            <span className="font-semibold text-stone-800">
              {formatCurrency(priceBreakdown.basePrice, language)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>{t.configurator.materialCost}:</span>
            <span className="font-semibold text-stone-800">
              +{formatCurrency(priceBreakdown.materialCost, language)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>{t.configurator.shelvesCost} ({shelfCount} Adet):</span>
            <span className="font-semibold text-stone-800">
              +{formatCurrency(priceBreakdown.shelfCost, language)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>{t.configurator.doorsCost}:</span>
            <span className="font-semibold text-stone-800">
              +{formatCurrency(priceBreakdown.doorCost, language)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>{t.configurator.hardwareCost}:</span>
            <span className="font-semibold text-stone-800">
              +{formatCurrency(priceBreakdown.hardwareCost, language)}
            </span>
          </div>

          <div className="pt-3 border-t border-stone-300/80 flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-stone-900 block">
                {t.configurator.totalEstimated}
              </span>
              <span className="text-[10px] text-stone-500">KDV Dahil</span>
            </div>
            <span className="text-xl font-extrabold text-wood-900">
              {formatCurrency(priceBreakdown.totalPrice, language)}
            </span>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="pt-2 text-[11px] text-stone-500 flex items-start gap-1.5 border-t border-stone-200/60">
          <AlertCircle className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
          <span>{t.common.demoNotice}</span>
        </div>
      </div>

      {/* Configuration Specs Summary */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200 text-xs space-y-2">
        <div className="font-bold text-stone-900 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-wood-700" />
          <span>Özet Spesifikasyon</span>
        </div>
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2 text-stone-600">
          <div>
            Ölçü: <span className="font-semibold text-stone-800">{dimensions.width}x{dimensions.height}x{dimensions.depth} cm</span>
          </div>
          <div>
            Raflar: <span className="font-semibold text-stone-800">{shelfCount} Adet</span>
          </div>
          <div>
            Malzeme: <span className="font-semibold text-stone-800 capitalize">{material}</span>
          </div>
          <div>
            Kapak: <span className="font-semibold text-stone-800 capitalize">{doorType}</span>
          </div>
          <div>
            Kulp: <span className="font-semibold text-stone-800 capitalize">{handleStyle}</span>
          </div>
          <div>
            Ayak: <span className="font-semibold text-stone-800 capitalize">{legStyle}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        {/* ADD TO CART */}
        <button
          onClick={handleAddToCart}
          className="w-full py-3.5 px-4 bg-wood-800 hover:bg-wood-900 text-white font-bold rounded-xl shadow-soft-md flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          {cartSuccess ? (
            <>
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{t.configurator.addedToCartSuccess}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>{t.common.addToCart}</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          {/* SAVE DESIGN */}
          <button
            onClick={onOpenSaveModal}
            className="py-2.5 px-3 border border-stone-300 hover:border-stone-400 bg-white text-stone-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <BookmarkPlus className="w-4 h-4 text-wood-700" />
            <span>{t.configurator.saveDesign}</span>
          </button>

          {/* COPY SPECS */}
          <button
            onClick={handleCopySpecs}
            className="py-2.5 px-3 border border-stone-300 hover:border-stone-400 bg-white text-stone-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
          >
            <Copy className="w-4 h-4 text-wood-700" />
            <span>{copied ? t.common.copied : t.configurator.copySpecs}</span>
          </button>
        </div>

        {/* RESET CONFIGURATION */}
        <button
          onClick={resetConfiguration}
          className="w-full py-2 text-stone-500 hover:text-stone-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.configurator.resetDesign}</span>
        </button>
      </div>
    </div>
  );
};
