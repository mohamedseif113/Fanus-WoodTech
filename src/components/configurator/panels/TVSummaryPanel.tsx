"use client";

import React, { useState } from "react";
import { useTVStandStore } from "@/store/useTVStandStore";
import { useCartStore } from "@/store/useCartStore";
import { useI18nStore } from "@/store/useI18nStore";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Bookmark, Check, Copy, Shield, Truck } from "lucide-react";

export const TVSummaryPanel: React.FC = () => {
  const { t, language } = useI18nStore();
  const {
    designName,
    dimensions,
    material,
    finish,
    upperSection,
    upperDoors,
    handleStyle,
    legStyle,
    priceBreakdown,
    saveCurrentDesign,
    getCurrentConfiguration,
  } = useTVStandStore();

  const { addItem } = useCartStore();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    const config = getCurrentConfiguration();
    addItem(config, designName, "TV Units");
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleSave = () => {
    saveCurrentDesign();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopySpecs = () => {
    const specs = [
      `Ürün: ${designName}`,
      `Ölçüler: ${dimensions.width}W × ${dimensions.height}H (Konsol) × ${dimensions.depth}D cm`,
      upperSection !== "none" ? `Üst Bölüm: ${dimensions.upperHeight}H cm (${upperSection})` : "",
      `Malzeme: ${material} (${finish})`,
      `Üst Kapak: ${upperDoors}`,
      `Donanım: Kulp: ${handleStyle}, Ayak: ${legStyle}`,
      `Tahmini Fiyat: ${formatCurrency(priceBreakdown.totalPrice, language)}`,
    ]
      .filter(Boolean)
      .join("\n");

    navigator.clipboard.writeText(specs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Price Itemization Card */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 space-y-2.5">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
          Maliyet Analizi
        </div>

        <div className="flex justify-between text-xs text-stone-700">
          <span>{t.configurator.basePrice}</span>
          <span className="font-semibold">{formatCurrency(priceBreakdown.basePrice, language)}</span>
        </div>

        <div className="flex justify-between text-xs text-stone-700">
          <span>{t.configurator.materialCost}</span>
          <span className="font-semibold">+{formatCurrency(priceBreakdown.materialCost, language)}</span>
        </div>

        {priceBreakdown.upperSectionCost > 0 && (
          <div className="flex justify-between text-xs text-stone-700">
            <span>Üst Modül & Raf Sistemi</span>
            <span className="font-semibold">+{formatCurrency(priceBreakdown.upperSectionCost, language)}</span>
          </div>
        )}

        {priceBreakdown.doorsCost > 0 && (
          <div className="flex justify-between text-xs text-stone-700">
            <span>{t.configurator.doorsCost}</span>
            <span className="font-semibold">+{formatCurrency(priceBreakdown.doorsCost, language)}</span>
          </div>
        )}

        <div className="flex justify-between text-xs text-stone-700">
          <span>{t.configurator.hardwareCost}</span>
          <span className="font-semibold">+{formatCurrency(priceBreakdown.hardwareCost, language)}</span>
        </div>

        <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
          <span className="text-xs font-extrabold text-stone-900">{t.common.total}</span>
          <span className="text-lg font-black text-wood-950">
            {formatCurrency(priceBreakdown.totalPrice, language)}
          </span>
        </div>
      </div>

      {/* Specifications pills */}
      <div className="p-3 bg-white rounded-xl border border-stone-200/80 space-y-1.5 text-[11px] text-stone-600">
        <div className="flex justify-between">
          <span className="text-stone-400">Ölçüler:</span>
          <span className="font-bold text-stone-800">
            {dimensions.width} × {dimensions.height} × {dimensions.depth} cm
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Üst Modül:</span>
          <span className="font-bold text-stone-800">{upperSection}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-400">Malzeme:</span>
          <span className="font-bold text-stone-800">{material} ({finish})</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-wood-800 hover:bg-wood-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98]"
        >
          {addedToCart ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Sepete Eklendi!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>{t.common.addToCart}</span>
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-stone-200 hover:border-wood-500 bg-white text-stone-700 hover:text-wood-900 text-xs font-semibold transition-all"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
            <span>{saved ? "Kaydedildi" : t.configurator.saveDesign}</span>
          </button>

          <button
            onClick={handleCopySpecs}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-stone-200 hover:border-stone-300 bg-white text-stone-700 text-xs font-semibold transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.common.copied : t.configurator.copySpecs}</span>
          </button>
        </div>
      </div>

      {/* Guarantee & Shipping Badges */}
      <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-stone-500">
        <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
          <Truck className="w-3.5 h-3.5 text-wood-600 flex-shrink-0" />
          <span>{t.common.freeShipping}</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 bg-stone-50 rounded-lg">
          <Shield className="w-3.5 h-3.5 text-wood-600 flex-shrink-0" />
          <span>5 Yıl Üretici Garantisi</span>
        </div>
      </div>
    </div>
  );
};
