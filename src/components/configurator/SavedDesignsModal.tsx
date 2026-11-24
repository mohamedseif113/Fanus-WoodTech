"use client";

import React, { useState } from "react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";
import { formatCurrency } from "@/lib/utils";
import { X, Trash2, ArrowUpRight, Bookmark, Check } from "lucide-react";
import { FurnitureConfiguration } from "@/types/furniture";

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SavedDesignsModal: React.FC<SavedDesignsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, language } = useI18nStore();
  const {
    savedDesigns,
    saveCurrentDesign,
    loadDesign,
    deleteSavedDesign,
  } = useConfiguratorStore();

  const [designNameInput, setDesignNameInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const name = designNameInput.trim() || `Tasarım #${savedDesigns.length + 1}`;
    saveCurrentDesign(name);
    setDesignNameInput("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleLoad = (design: FurnitureConfiguration) => {
    loadDesign(design);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-soft-xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-wood-700" />
            <h3 className="font-bold text-stone-900 text-base">
              {t.configurator.loadDesignModalTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Quick Save New Design Form */}
          <form onSubmit={handleSave} className="flex gap-2">
            <input
              type="text"
              placeholder="Tasarımınıza bir isim verin..."
              value={designNameInput}
              onChange={(e) => setDesignNameInput(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-wood-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-wood-700 hover:bg-wood-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Kaydedildi</span>
                </>
              ) : (
                <span>Mevcut Tasarımı Kaydet</span>
              )}
            </button>
          </form>

          {/* List of Saved Designs */}
          <div className="space-y-2.5">
            {savedDesigns.length === 0 ? (
              <div className="text-center py-8 text-stone-400 text-xs">
                {t.configurator.savedDesignsEmpty}
              </div>
            ) : (
              savedDesigns.map((design) => (
                <div
                  key={design.id}
                  className="p-3.5 rounded-xl border border-stone-200 hover:border-wood-300 bg-stone-50/50 hover:bg-wood-50/30 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-stone-900 text-sm truncate">
                      {design.name}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {design.dimensions.width}x{design.dimensions.height}x{design.dimensions.depth} cm • {design.material.toUpperCase()} • {design.shelfCount} Raf
                    </div>
                    <div className="text-xs font-semibold text-wood-900 mt-1">
                      {formatCurrency(design.priceBreakdown.totalPrice, language)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLoad(design)}
                      className="px-3 py-1.5 bg-white border border-stone-300 hover:border-wood-600 text-stone-800 text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1 transition-all"
                    >
                      <span>{t.configurator.load}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSavedDesign(design.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Tasarımı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
