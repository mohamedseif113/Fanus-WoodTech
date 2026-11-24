"use client";

import React, { useState } from "react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";
import { formatCurrency } from "@/lib/utils";
import {
  Ruler,
  Layers,
  Palette,
  DoorClosed,
  Receipt,
  Bookmark,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { DimensionsTab } from "./tabs/DimensionsTab";
import { LayoutShelvesTab } from "./tabs/LayoutShelvesTab";
import { MaterialsTab } from "./tabs/MaterialsTab";
import { DoorsHardwareTab } from "./tabs/DoorsHardwareTab";
import { SummaryTab } from "./tabs/SummaryTab";
import { SavedDesignsModal } from "./SavedDesignsModal";

type ActiveTab = "dimensions" | "layout" | "materials" | "doors" | "summary";

export const ConfiguratorSidebar: React.FC = () => {
  const { t, language } = useI18nStore();
  const { designName, priceBreakdown, initSavedDesigns } = useConfiguratorStore();
  const [activeTab, setActiveTab] = useState<ActiveTab>("dimensions");
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(true);

  React.useEffect(() => {
    initSavedDesigns();
  }, [initSavedDesigns]);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "dimensions",
      label: t.configurator.dimensionsTab,
      icon: <Ruler className="w-4 h-4" />,
    },
    {
      id: "layout",
      label: t.configurator.layoutTab,
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: "materials",
      label: t.configurator.materialsTab,
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: "doors",
      label: t.configurator.doorsTab,
      icon: <DoorClosed className="w-4 h-4" />,
    },
    {
      id: "summary",
      label: t.configurator.summaryTab,
      icon: <Receipt className="w-4 h-4" />,
    },
  ];

  return (
    <>
      <aside className="w-full lg:w-[420px] xl:w-[460px] bg-white border-l border-stone-200/90 flex flex-col h-full shadow-soft-lg z-20">
        {/* Top Header */}
        <div className="p-4 border-b border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-wood-700 tracking-wider uppercase">
              {t.configurator.title}
            </div>
            <h2 className="text-base font-extrabold text-stone-900 leading-tight">
              {designName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Total Badge */}
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block font-medium">
                {t.common.estimatedPrice}
              </span>
              <span className="text-sm font-black text-wood-900">
                {formatCurrency(priceBreakdown.totalPrice, language)}
              </span>
            </div>

            {/* Saved Designs Modal Trigger */}
            <button
              onClick={() => setIsSavedModalOpen(true)}
              className="p-2 rounded-xl bg-white border border-stone-200 hover:border-wood-500 text-stone-700 hover:text-wood-800 transition-all shadow-sm"
              title={t.configurator.loadDesign}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Mobile accordion toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-stone-200 text-stone-700"
            >
              {isMobileOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center border-b border-stone-200 bg-white overflow-x-auto no-scrollbar px-2 pt-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileOpen(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? "border-wood-700 text-wood-900 bg-wood-50/40"
                    : "border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Body */}
        {isMobileOpen && (
          <div className="flex-1 overflow-y-auto p-4 md:p-5">
            {activeTab === "dimensions" && <DimensionsTab />}
            {activeTab === "layout" && <LayoutShelvesTab />}
            {activeTab === "materials" && <MaterialsTab />}
            {activeTab === "doors" && <DoorsHardwareTab />}
            {activeTab === "summary" && (
              <SummaryTab onOpenSaveModal={() => setIsSavedModalOpen(true)} />
            )}
          </div>
        )}
      </aside>

      {/* Saved Designs Dialog */}
      <SavedDesignsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
      />
    </>
  );
};
