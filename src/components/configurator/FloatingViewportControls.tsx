"use client";

import React, { useState } from "react";
import {
  Menu,
  Share2,
  Save,
  ShoppingCart,
  Undo2,
  Redo2,
  Check,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useI18nStore } from "@/store/useI18nStore";
import { formatCurrency } from "@/lib/utils";

interface FloatingViewportControlsProps {
  totalPrice: number;
  onOpenMenu: () => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenHelp: () => void;
  onToggle2D: () => void;
  is2D: boolean;
  onOpenAR: () => void;
}

export const FloatingViewportControls: React.FC<FloatingViewportControlsProps> = ({
  totalPrice,
  onOpenMenu,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenHelp,
  onToggle2D,
  is2D,
  onOpenAR,
}) => {
  const { language } = useI18nStore();
  const { getTotalCount, setIsOpen } = useCartStore();
  const cartCount = getTotalCount();

  const [copiedShare, setCopiedShare] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Strikethrough original price (simulating ~8% catalogue benchmark)
  const originalPrice = Math.round(totalPrice * 1.085);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2200);
    }
  };

  const handleSaveClick = () => {
    onSave();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  return (
    <div className="absolute inset-0 pointer-events-none p-3 sm:p-5 flex flex-col justify-between z-10">
      {/* ================= TOP ROW ================= */}
      <div className="flex items-start justify-between w-full">
        {/* TOP LEFT: Menu, Share, Save */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Menu button */}
          <button
            type="button"
            onClick={onOpenMenu}
            className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200/90 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            title="Ürün & Ayarlar Menüsü"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200/90 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
            title="Tasarımı Paylaş"
          >
            {copiedShare ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <Share2 className="w-5 h-5" />
            )}
            {copiedShare && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                Kopyalandı!
              </span>
            )}
          </button>

          {/* Save button */}
          <button
            type="button"
            onClick={handleSaveClick}
            className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200/90 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
            title="Tasarımı Kaydet"
          >
            {savedSuccess ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {savedSuccess && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow whitespace-nowrap">
                Kaydedildi!
              </span>
            )}
          </button>
        </div>

        {/* TOP RIGHT: Price Card & Cart Button */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Price display card */}
          <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 rounded-2xl px-4 py-2 shadow-md text-right select-none">
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="text-base sm:text-lg font-black text-stone-950 tracking-tight">
                {formatCurrency(totalPrice, language)}
              </span>
              <span className="text-[11px] text-stone-400 line-through">
                {formatCurrency(originalPrice, language)}
              </span>
            </div>
            <div className="text-[10px] text-stone-500 font-semibold tracking-tight">
              {language === "tr" ? "KDV & Kargo Dahil" : "Inc VAT&Shipping"}
            </div>
          </div>

          {/* Shopping cart button */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-200/90 shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 relative"
            title="Sepeti Görüntüle"
          >
            <ShoppingCart className="w-5 h-5 text-stone-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-wood-950 font-extrabold text-[10px] flex items-center justify-center border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div className="flex items-end justify-between w-full">
        {/* BOTTOM LEFT: Undo & Redo */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Undo */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              disabled={!canUndo}
              onClick={onUndo}
              className={`w-11 h-11 rounded-full bg-white/95 border border-stone-200/90 shadow-md flex items-center justify-center transition-all ${
                canUndo
                  ? "text-stone-700 hover:text-stone-950 hover:scale-105 active:scale-95"
                  : "text-stone-300 opacity-60 cursor-not-allowed"
              }`}
              title="Geri Al (Undo)"
            >
              <Undo2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-stone-500 select-none">
              Undo
            </span>
          </div>

          {/* Redo */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              disabled={!canRedo}
              onClick={onRedo}
              className={`w-11 h-11 rounded-full bg-white/95 border border-stone-200/90 shadow-md flex items-center justify-center transition-all ${
                canRedo
                  ? "text-stone-700 hover:text-stone-950 hover:scale-105 active:scale-95"
                  : "text-stone-300 opacity-60 cursor-not-allowed"
              }`}
              title="Yinele (Redo)"
            >
              <Redo2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] font-bold text-stone-500 select-none">
              Redo
            </span>
          </div>
        </div>

        {/* BOTTOM CENTER: Help Button */}
        <div className="pointer-events-auto mb-1">
          <button
            type="button"
            onClick={onOpenHelp}
            className="w-12 h-12 rounded-full bg-[#3498a7] hover:bg-[#2d8795] text-white font-extrabold text-xs shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-white/80"
            title="Konfigüratör Rehberi & Yardım"
          >
            Help
          </button>
        </div>

        {/* BOTTOM RIGHT: 2D & AR Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* 2D Toggle */}
          <button
            type="button"
            onClick={onToggle2D}
            className={`w-11 h-11 rounded-full border shadow-md flex items-center justify-center font-bold text-xs transition-all hover:scale-105 active:scale-95 ${
              is2D
                ? "bg-[#3498a7] text-white border-[#3498a7]"
                : "bg-white/95 text-stone-800 border-stone-200/90 hover:bg-white"
            }`}
            title={is2D ? "3D Perspektife Dön" : "2D Düzlem Görünümüne Geç"}
          >
            2D
          </button>

          {/* AR Toggle */}
          <button
            type="button"
            onClick={onOpenAR}
            className="w-11 h-11 rounded-full bg-white/95 hover:bg-white text-stone-800 border border-stone-200/90 shadow-md flex items-center justify-center font-bold text-xs transition-all hover:scale-105 active:scale-95"
            title="Artırılmış Gerçeklik (AR) ile Odanda Gör"
          >
            AR
          </button>
        </div>
      </div>
    </div>
  );
};
