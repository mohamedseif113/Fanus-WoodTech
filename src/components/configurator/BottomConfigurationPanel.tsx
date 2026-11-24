"use client";

import React, { useState } from "react";
import { Minus, Plus, Check, ShoppingBag } from "lucide-react";
import { ConfigCategory } from "./ProductToolsBar";
import { useTVStandStore, TVUpperType, TVDoorType } from "@/store/useTVStandStore";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useCartStore } from "@/store/useCartStore";
import { useI18nStore } from "@/store/useI18nStore";
import { WoodMaterial, FinishType, HandleStyle, LegStyle } from "@/types/furniture";

interface BottomConfigurationPanelProps {
  activeCategory: ConfigCategory;
  productType?: "tv-stand" | "cabinet";
}

export const BottomConfigurationPanel: React.FC<BottomConfigurationPanelProps> = ({
  activeCategory,
  productType = "tv-stand",
}) => {
  const { t } = useI18nStore();
  const tvStore = useTVStandStore();
  const cabinetStore = useConfiguratorStore();
  const { addItem } = useCartStore();

  const isTV = productType === "tv-stand";

  // Sub-tabs for each category
  const [dimensionTab, setDimensionTab] = useState<"height" | "width" | "depth" | "style">("height");
  const [moduleTab, setModuleTab] = useState<"upper" | "shelves" | "panels" | "niche">("upper");
  const [materialTab, setMaterialTab] = useState<"wood" | "finish">("wood");
  const [doorTab, setDoorTab] = useState<"type" | "glass">("type");
  const [hardwareTab, setHardwareTab] = useState<"handle" | "legs">("handle");

  const [showTooltip, setShowTooltip] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Active dimension values
  const currentWidth = isTV ? tvStore.dimensions.width : cabinetStore.dimensions.width;
  const currentHeight = isTV ? tvStore.dimensions.height : cabinetStore.dimensions.height;
  const currentDepth = isTV ? tvStore.dimensions.depth : cabinetStore.dimensions.depth;
  const currentUpperHeight = isTV ? tvStore.dimensions.upperHeight : 60;

  // Handlers for dimension change
  const handleWidthChange = (val: number) => {
    if (isTV) tvStore.setWidth(val);
    else cabinetStore.setWidth(val);
  };
  const handleHeightChange = (val: number) => {
    if (isTV) tvStore.setHeight(val);
    else cabinetStore.setHeight(val);
  };
  const handleDepthChange = (val: number) => {
    if (isTV) tvStore.setDepth(val);
    else cabinetStore.setDepth(val);
  };
  const handleUpperHeightChange = (val: number) => {
    if (isTV) tvStore.setUpperHeight(val);
  };

  const handleAddToCart = () => {
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

  // Materials list
  const materials: { id: WoodMaterial; label: string; color: string; border?: string }[] = [
    { id: "oak", label: t.configurator.oak, color: "#c49a6c" },
    { id: "walnut", label: t.configurator.walnut, color: "#5a3d28" },
    { id: "beech", label: t.configurator.beech, color: "#d9b99b" },
    { id: "white", label: t.configurator.white, color: "#f8f8f6", border: "#dcdcd9" },
    { id: "black", label: t.configurator.black, color: "#1e1e1e" },
    { id: "anthracite", label: t.configurator.anthracite, color: "#363d42" },
  ];

  const finishes: { id: FinishType; label: string; desc: string }[] = [
    { id: "matte", label: t.configurator.finishMatte, desc: "Ultra Mat" },
    { id: "satin", label: t.configurator.finishSatin, desc: "Saten İpeksi" },
    { id: "gloss", label: t.configurator.finishGloss, desc: "Piyano Parlak" },
  ];

  // Active materials
  const activeMaterial = isTV ? tvStore.material : cabinetStore.material;
  const activeFinish = isTV ? tvStore.finish : cabinetStore.finish;

  // Render Category: DIMENSIONS (Matching exact Woodcoder screenshot!)
  const renderDimensions = () => {
    let label = "Overall height";
    const sublabel = "▲";
    let overallVal = `${currentHeight} CM`;
    let sliderVal = currentHeight;
    let min = 30;
    let max = 80;
    let step = 2;
    let onChange = handleHeightChange;

    if (dimensionTab === "height") {
      label = "Overall height";
      overallVal = isTV
        ? `${tvStore.dimensions.height + (tvStore.upperSection !== "none" ? tvStore.dimensions.upperHeight : 0)} CM`
        : `${currentHeight} CM`;
      sliderVal = currentHeight;
      min = isTV ? 30 : 80;
      max = isTV ? 80 : 240;
      step = 2;
      onChange = handleHeightChange;
    } else if (dimensionTab === "width") {
      label = "Overall width";
      overallVal = `${currentWidth} CM`;
      sliderVal = currentWidth;
      min = isTV ? 100 : 60;
      max = isTV ? 300 : 240;
      step = 5;
      onChange = handleWidthChange;
    } else if (dimensionTab === "depth") {
      label = "Overall depth";
      overallVal = `${currentDepth} CM`;
      sliderVal = currentDepth;
      min = isTV ? 25 : 25;
      max = isTV ? 55 : 80;
      step = 2;
      onChange = handleDepthChange;
    } else if (dimensionTab === "style") {
      label = isTV ? "Upper module height" : "Internal shelves";
      overallVal = isTV ? `${currentUpperHeight} CM` : `${cabinetStore.shelfCount} Raf`;
      sliderVal = isTV ? currentUpperHeight : cabinetStore.shelfCount;
      min = isTV ? 30 : 0;
      max = isTV ? 100 : 8;
      step = isTV ? 5 : 1;
      onChange = isTV ? handleUpperHeightChange : (v) => cabinetStore.setShelfCount(v);
    }

    // Calculate percentage for custom slider background
    const pct = Math.max(0, Math.min(100, ((sliderVal - min) / (max - min)) * 100));

    return (
      <div className="space-y-4">
        {/* Sub-tabs pills (Height, Width, Depth, Style) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "height", label: "Height" },
            { id: "width", label: "Width" },
            { id: "depth", label: "Depth" },
            { id: "style", label: isTV ? "Upper Height" : "Shelves" },
          ].map((tab) => {
            const isActive = dimensionTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDimensionTab(tab.id as typeof dimensionTab)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isActive
                    ? "bg-[#3498a7] text-white shadow-[#3498a7]/20"
                    : "bg-white text-stone-700 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dimension Header Row: Overall label on left, ? on right */}
        <div className="flex items-center justify-between text-xs font-medium text-stone-600 relative">
          <div className="flex items-center gap-1.5 font-semibold text-stone-700">
            <span>{label}</span>
            <span className="text-[#3498a7]">{sublabel}</span>
            <span className="font-extrabold text-stone-900">{overallVal}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowTooltip(!showTooltip)}
            className="w-5 h-5 rounded-full bg-[#3498a7] text-white text-[10px] font-bold flex items-center justify-center hover:opacity-90 shadow-sm"
            title="Ölçü Bilgisi"
          >
            ?
          </button>

          {showTooltip && (
            <div className="absolute right-0 top-7 bg-stone-900 text-white text-[11px] p-2.5 rounded-xl shadow-xl z-30 max-w-xs animate-in fade-in">
              Milimetrik CNC üretim toleranslarına uygun olarak belirlenen net dış ölçülerdir.
            </div>
          )}
        </div>

        {/* Center Current Value Display */}
        <div className="text-center">
          <span className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
            {sliderVal} CM
          </span>
        </div>

        {/* Slider Row with Circular Minus & Plus Buttons */}
        <div className="flex items-center gap-3 sm:gap-5 max-w-3xl mx-auto">
          {/* Minus Button */}
          <button
            type="button"
            disabled={sliderVal <= min}
            onClick={() => onChange(Math.max(min, sliderVal - step))}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-400 shadow-sm flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 active:scale-95"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Slider input with filled teal track */}
          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={sliderVal}
              onChange={(e) => onChange(Number(e.target.value))}
              style={{
                background: `linear-gradient(to right, #3498a7 0%, #3498a7 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
              }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#3498a7]"
            />
          </div>

          {/* Plus Button */}
          <button
            type="button"
            disabled={sliderVal >= max}
            onClick={() => onChange(Math.min(max, sliderVal + step))}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-stone-200 text-stone-700 hover:text-stone-950 hover:border-stone-400 shadow-sm flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Render Category: MODULES
  const renderModules = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "upper", label: "Upper Section" },
            { id: "shelves", label: "Open Shelves" },
            { id: "panels", label: "Side Panels" },
            { id: "niche", label: "Cable Niche" },
          ].map((tab) => {
            const isActive = moduleTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setModuleTab(tab.id as typeof moduleTab)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isActive
                    ? "bg-[#3498a7] text-white shadow-[#3498a7]/20"
                    : "bg-white text-stone-700 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content depending on sub-tab */}
        {moduleTab === "upper" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-w-2xl mx-auto">
            {(
              [
                { id: "none", label: "None", desc: "Sadece alçak konsol" },
                { id: "cabinets", label: "Cabinets", desc: "Kapalı üst dolaplar" },
                { id: "open-shelves", label: "Shelves", desc: "Açık yüzen raflar" },
                { id: "mixed", label: "Mixed", desc: "Dolap + açık raf" },
              ] as { id: TVUpperType; label: string; desc: string }[]
            ).map((opt) => {
              const isSelected = tvStore.upperSection === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => tvStore.setUpperSection(opt.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "bg-[#e5f5f7] border-[#3498a7] text-[#196b77] font-bold shadow-sm"
                      : "bg-white border-stone-200 hover:border-stone-300 text-stone-700"
                  }`}
                >
                  <div className="text-xs font-extrabold">{opt.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        )}

        {moduleTab === "shelves" && (
          <div className="flex items-center justify-center gap-3 py-2">
            <span className="text-xs font-bold text-stone-700">Açık Raf Sayısı:</span>
            {[1, 2, 3, 4, 5].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => tvStore.setOpenShelvesCount(cnt)}
                className={`w-9 h-9 rounded-full font-bold text-xs border transition-all ${
                  tvStore.openShelvesCount === cnt
                    ? "bg-[#3498a7] text-white border-[#3498a7] shadow-sm"
                    : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        )}

        {moduleTab === "panels" && (
          <div className="flex items-center justify-center gap-4 py-2">
            <button
              type="button"
              onClick={() => tvStore.setSidePanels(!tvStore.sidePanels)}
              className={`px-5 py-2 rounded-xl border text-xs font-bold transition-all ${
                tvStore.sidePanels
                  ? "bg-[#3498a7] text-white border-[#3498a7] shadow-sm"
                  : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
              }`}
            >
              Yan Dekoratif Paneller: {tvStore.sidePanels ? "Açık (Mevcut)" : "Kapalı"}
            </button>
            <button
              type="button"
              onClick={() => tvStore.setBackPanel(!tvStore.backPanel)}
              className={`px-5 py-2 rounded-xl border text-xs font-bold transition-all ${
                tvStore.backPanel
                  ? "bg-[#3498a7] text-white border-[#3498a7] shadow-sm"
                  : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
              }`}
            >
              Arkalık Paneli: {tvStore.backPanel ? "Mevcut" : "Açık Gövde"}
            </button>
          </div>
        )}

        {moduleTab === "niche" && (
          <div className="flex items-center justify-center py-2">
            <button
              type="button"
              onClick={() => tvStore.setTvNiche(!tvStore.tvNiche)}
              className={`px-6 py-2 rounded-xl border text-xs font-bold transition-all ${
                tvStore.tvNiche
                  ? "bg-[#3498a7] text-white border-[#3498a7] shadow-sm"
                  : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
              }`}
            >
              Gizli Kablo Kanalı & TV Nişi: {tvStore.tvNiche ? "Aktif" : "Pasif"}
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render Category: MATERIALS
  const renderMaterials = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "wood", label: "Wood & Colors" },
            { id: "finish", label: "Surface Finish" },
          ].map((tab) => {
            const isActive = materialTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMaterialTab(tab.id as typeof materialTab)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isActive
                    ? "bg-[#3498a7] text-white shadow-[#3498a7]/20"
                    : "bg-white text-stone-700 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {materialTab === "wood" ? (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 max-w-3xl mx-auto pt-1">
            {materials.map((m) => {
              const isSelected = activeMaterial === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    if (isTV) tvStore.setMaterial(m.id);
                    else cabinetStore.setMaterial(m.id);
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? "border-[#3498a7] bg-[#e5f5f7] shadow-sm scale-105"
                      : "border-stone-200 hover:border-stone-400 bg-white"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center"
                    style={{
                      backgroundColor: m.color,
                      border: m.border ? `1px solid ${m.border}` : "1px solid rgba(0,0,0,0.1)",
                    }}
                  >
                    {isSelected && (
                      <Check className={`w-4 h-4 ${m.id === "white" ? "text-stone-900" : "text-white"}`} />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-stone-800 text-center truncate w-full">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto pt-1">
            {finishes.map((f) => {
              const isSelected = activeFinish === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    if (isTV) tvStore.setFinish(f.id);
                    else cabinetStore.setFinish(f.id);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-[#3498a7] bg-[#e5f5f7] text-[#196b77] font-bold shadow-sm"
                      : "border-stone-200 hover:border-stone-400 bg-white text-stone-700"
                  }`}
                >
                  <div className="text-xs font-extrabold">{f.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{f.desc}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Render Category: DOORS
  const renderDoors = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "type", label: "Door Style" },
            { id: "glass", label: "Glass / Solid" },
          ].map((tab) => {
            const isActive = doorTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDoorTab(tab.id as typeof doorTab)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isActive
                    ? "bg-[#3498a7] text-white shadow-[#3498a7]/20"
                    : "bg-white text-stone-700 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {doorTab === "type" ? (
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-1">
            {(
              [
                { id: "none", label: "No Doors", desc: "Tamamen açık ünite" },
                { id: "solid", label: "Solid Wood", desc: "Ahşap gövde kapaklar" },
                { id: "glass", label: "Glass Doors", desc: "Füme cam alüminyum profil" },
              ] as { id: TVDoorType; label: string; desc: string }[]
            ).map((opt) => {
              const isSelected = tvStore.upperDoors === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => tvStore.setUpperDoors(opt.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-[#3498a7] bg-[#e5f5f7] text-[#196b77] font-bold shadow-sm"
                      : "border-stone-200 hover:border-stone-400 bg-white text-stone-700"
                  }`}
                >
                  <div className="text-xs font-extrabold">{opt.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{opt.desc}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-stone-600">
            Füme temperli cam ve alüminyum profil kapak seçenekleri için üst modül seçimini doğrulayınız.
          </div>
        )}
      </div>
    );
  };

  // Render Category: HARDWARE
  const renderHardware = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: "handle", label: "Handle Style" },
            { id: "legs", label: "Base & Legs" },
          ].map((tab) => {
            const isActive = hardwareTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setHardwareTab(tab.id as typeof hardwareTab)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isActive
                    ? "bg-[#3498a7] text-white shadow-[#3498a7]/20"
                    : "bg-white text-stone-700 border border-stone-200 hover:border-stone-400"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {hardwareTab === "handle" ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-w-2xl mx-auto">
            {(
              [
                { id: "minimal-bar", label: t.configurator.handleMinimalBar },
                { id: "round-knob", label: t.configurator.handleRoundKnob },
                { id: "edge-pull", label: t.configurator.handleEdgePull },
                { id: "none", label: t.configurator.handleNone },
              ] as { id: HandleStyle; label: string }[]
            ).map((h) => {
              const isSelected = (isTV ? tvStore.handleStyle : cabinetStore.handleStyle) === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    if (isTV) tvStore.setHandleStyle(h.id);
                    else cabinetStore.setHandleStyle(h.id);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-[#3498a7] bg-[#e5f5f7] text-[#196b77] font-bold shadow-sm"
                      : "border-stone-200 hover:border-stone-400 bg-white text-stone-700"
                  }`}
                >
                  <div className="text-xs font-bold">{h.label}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-w-2xl mx-auto">
            {(
              [
                { id: "none", label: t.configurator.legNone },
                { id: "wood-tapered", label: t.configurator.legWoodTapered },
                { id: "metal-plinth", label: t.configurator.legMetalPlinth },
                { id: "hairpin-black", label: t.configurator.legHairpinBlack },
              ] as { id: LegStyle; label: string }[]
            ).map((l) => {
              const isSelected = (isTV ? tvStore.legStyle : cabinetStore.legStyle) === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    if (isTV) tvStore.setLegStyle(l.id);
                    else cabinetStore.setLegStyle(l.id);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isSelected
                      ? "border-[#3498a7] bg-[#e5f5f7] text-[#196b77] font-bold shadow-sm"
                      : "border-stone-200 hover:border-stone-400 bg-white text-stone-700"
                  }`}
                >
                  <div className="text-xs font-bold">{l.label}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-white rounded-t-3xl border-t border-stone-200/90 shadow-soft-xl px-4 sm:px-8 pt-4 pb-5 select-none transition-all">
      <div className="max-w-4xl mx-auto">
        {activeCategory === "dimensions" && renderDimensions()}
        {activeCategory === "modules" && renderModules()}
        {activeCategory === "materials" && renderMaterials()}
        {activeCategory === "doors" && renderDoors()}
        {activeCategory === "hardware" && renderHardware()}
      </div>

      {/* Quick Add to Cart Bar at bottom center */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between max-w-4xl mx-auto">
        <div className="text-xs text-stone-500 font-medium">
          Tüm parçalar 18mm E1 standardında hassas CNC ile işlenmektedir.
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#3498a7] hover:bg-[#2b8390] text-white text-xs font-bold shadow-sm transition-all active:scale-95"
        >
          {addedToCart ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Sepete Eklendi!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.common.addToCart}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
