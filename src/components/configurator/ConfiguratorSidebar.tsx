"use client";

import React, { useState } from "react";
import { useTVStandStore } from "@/store/useTVStandStore";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useCartStore } from "@/store/useCartStore";
import { useI18nStore } from "@/store/useI18nStore";
import { formatCurrency } from "@/lib/utils";
import {
  Ruler,
  Layers,
  Palette,
  DoorClosed,
  Receipt,
  Bookmark,
  ShoppingBag,
  Check,
  ChevronRight,
  Tv,
  Box,
} from "lucide-react";

import { AccordionSection } from "./panels/SidebarAccordion";
import { TVDimensionsPanel } from "./panels/TVDimensionsPanel";
import { TVModulesPanel } from "./panels/TVModulesPanel";
import { TVMaterialsPanel } from "./panels/TVMaterialsPanel";
import { TVHardwarePanel } from "./panels/TVHardwarePanel";
import { TVSummaryPanel } from "./panels/TVSummaryPanel";

import { DimensionsTab } from "./tabs/DimensionsTab";
import { LayoutShelvesTab } from "./tabs/LayoutShelvesTab";
import { MaterialsTab } from "./tabs/MaterialsTab";
import { DoorsHardwareTab } from "./tabs/DoorsHardwareTab";
import { SummaryTab } from "./tabs/SummaryTab";
import { SavedDesignsModal } from "./SavedDesignsModal";

interface ConfiguratorSidebarProps {
  activeModel: "tv-stand" | "cabinet";
  onModelChange: (model: "tv-stand" | "cabinet") => void;
}

export const ConfiguratorSidebar: React.FC<ConfiguratorSidebarProps> = ({
  activeModel,
  onModelChange,
}) => {
  const { t, language } = useI18nStore();
  const tvStore = useTVStandStore();
  const cabinetStore = useConfiguratorStore();
  const { addItem } = useCartStore();

  // Accordion state for TV stand
  const [openSection, setOpenSection] = useState<string>("dimensions");
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Active tab for Cabinet model fallback
  const [cabinetTab, setCabinetTab] = useState<"dimensions" | "layout" | "materials" | "doors" | "summary">("dimensions");

  const isTV = activeModel === "tv-stand";
  const totalPrice = isTV
    ? tvStore.priceBreakdown.totalPrice
    : cabinetStore.priceBreakdown.totalPrice;

  const handleToggle = (id: string) => {
    setOpenSection((prev) => (prev === id ? "" : id));
  };

  const handleQuickAddToCart = () => {
    if (isTV) {
      const config = tvStore.getCurrentConfiguration();
      addItem(config, tvStore.designName, "TV Units");
    } else {
      const config = cabinetStore.getCurrentConfiguration();
      addItem(config, cabinetStore.designName, "Display Cabinets");
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  return (
    <>
      <aside className="w-full lg:w-[400px] xl:w-[440px] bg-white border-r border-stone-200 flex flex-col h-full shadow-soft-md z-20 flex-shrink-0">
        {/* TOP HEADER: Breadcrumbs & Product Switcher */}
        <div className="p-4 border-b border-stone-200/90 bg-stone-50/70 space-y-3">
          {/* Breadcrumb path like Woodcoder */}
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
            <span>Oturma Odası</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
            <span className="text-stone-700 font-semibold">
              {isTV ? "TV Duvar Ünitesi" : "Vitrin Dolabı"}
            </span>
          </div>

          {/* Model Switcher Pill Group */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl">
            <button
              onClick={() => onModelChange("tv-stand")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                isTV
                  ? "bg-white text-wood-950 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{t.configurator.tvStandModel}</span>
            </button>
            <button
              onClick={() => onModelChange("cabinet")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all ${
                !isTV
                  ? "bg-white text-wood-950 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>{t.configurator.cabinetModel}</span>
            </button>
          </div>

          {/* Title & Saved Designs Shortcut */}
          <div className="flex items-center justify-between pt-0.5">
            <div>
              <h1 className="text-base font-extrabold text-stone-950 leading-tight">
                {isTV ? tvStore.designName : cabinetStore.designName}
              </h1>
              <span className="text-[11px] text-stone-500">
                {isTV ? "Parametrik Duvar Ünitesi" : "Modüler Ahşap Vitrin"}
              </span>
            </div>

            <button
              onClick={() => setIsSavedModalOpen(true)}
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-wood-600 text-stone-700 hover:text-wood-900 transition-all shadow-sm"
              title={t.configurator.loadDesign}
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ACCORDION CONTENT (TV Stand) */}
        {isTV ? (
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            {/* 1. ÖLÇÜLER */}
            <AccordionSection
              id="dimensions"
              title={t.configurator.accordionDimensions}
              icon={<Ruler className="w-4 h-4" />}
              badge={`${tvStore.dimensions.width}×${tvStore.dimensions.height} cm`}
              isOpen={openSection === "dimensions"}
              onToggle={() => handleToggle("dimensions")}
            >
              <TVDimensionsPanel />
            </AccordionSection>

            {/* 2. MODÜLLER & YERLEŞİM */}
            <AccordionSection
              id="modules"
              title={t.configurator.accordionModules}
              icon={<Layers className="w-4 h-4" />}
              badge={tvStore.upperSection}
              isOpen={openSection === "modules"}
              onToggle={() => handleToggle("modules")}
            >
              <TVModulesPanel />
            </AccordionSection>

            {/* 3. MALZEMELER & RENKLER */}
            <AccordionSection
              id="materials"
              title={t.configurator.accordionMaterials}
              icon={<Palette className="w-4 h-4" />}
              badge={tvStore.material}
              isOpen={openSection === "materials"}
              onToggle={() => handleToggle("materials")}
            >
              <TVMaterialsPanel />
            </AccordionSection>

            {/* 4. KAPAKLAR & DONANIM */}
            <AccordionSection
              id="hardware"
              title={t.configurator.accordionHardware}
              icon={<DoorClosed className="w-4 h-4" />}
              badge={tvStore.legStyle}
              isOpen={openSection === "hardware"}
              onToggle={() => handleToggle("hardware")}
            >
              <TVHardwarePanel />
            </AccordionSection>

            {/* 5. ÖZET & SİPARİŞ */}
            <AccordionSection
              id="summary"
              title={t.configurator.accordionSummary}
              icon={<Receipt className="w-4 h-4" />}
              badge={formatCurrency(totalPrice, language)}
              isOpen={openSection === "summary"}
              onToggle={() => handleToggle("summary")}
            >
              <TVSummaryPanel />
            </AccordionSection>
          </div>
        ) : (
          /* CABINET MODEL CONTROLS */
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center border-b border-stone-200 bg-white overflow-x-auto no-scrollbar px-2 pt-2">
              {[
                { id: "dimensions", label: t.configurator.dimensionsTab, icon: <Ruler className="w-3.5 h-3.5" /> },
                { id: "layout", label: t.configurator.layoutTab, icon: <Layers className="w-3.5 h-3.5" /> },
                { id: "materials", label: t.configurator.materialsTab, icon: <Palette className="w-3.5 h-3.5" /> },
                { id: "doors", label: t.configurator.doorsTab, icon: <DoorClosed className="w-3.5 h-3.5" /> },
                { id: "summary", label: t.configurator.summaryTab, icon: <Receipt className="w-3.5 h-3.5" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setCabinetTab(tab.id as typeof cabinetTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                    cabinetTab === tab.id
                      ? "border-wood-700 text-wood-900 bg-wood-50/40"
                      : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {cabinetTab === "dimensions" && <DimensionsTab />}
              {cabinetTab === "layout" && <LayoutShelvesTab />}
              {cabinetTab === "materials" && <MaterialsTab />}
              {cabinetTab === "doors" && <DoorsHardwareTab />}
              {cabinetTab === "summary" && (
                <SummaryTab onOpenSaveModal={() => setIsSavedModalOpen(true)} />
              )}
            </div>
          </div>
        )}

        {/* STICKY BOTTOM BAR (Woodcoder Pattern) */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/90 backdrop-blur-sm flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-stone-500 font-medium block">
              {t.common.estimatedPrice}
            </span>
            <span className="text-base font-black text-wood-950">
              {formatCurrency(totalPrice, language)}
            </span>
          </div>

          <button
            onClick={handleQuickAddToCart}
            className="flex-1 max-w-[210px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-wood-800 hover:bg-wood-900 text-white font-bold text-xs shadow-md transition-all active:scale-[0.98]"
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
        </div>
      </aside>

      {/* Saved Designs Dialog */}
      <SavedDesignsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
      />
    </>
  );
};
