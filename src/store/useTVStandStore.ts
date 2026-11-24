"use client";

import { create } from "zustand";
import { WoodMaterial, HandleStyle, LegStyle, FinishType, PresetView } from "@/types/furniture";

export type TVDoorType = "none" | "solid" | "glass";
export type TVUpperType = "none" | "cabinets" | "open-shelves" | "mixed";

export interface TVStandDimensions {
  width: number;   // cm: 100-300
  height: number;  // cm: 40-80 (TV console base height)
  depth: number;   // cm: 25-50
  upperHeight: number; // cm: 40-80 (upper cabinet section height)
}

export interface TVStandPriceBreakdown {
  basePrice: number;
  materialCost: number;
  upperSectionCost: number;
  doorsCost: number;
  hardwareCost: number;
  totalPrice: number;
}

export interface TVStandConfiguration {
  id: string;
  name: string;
  dimensions: TVStandDimensions;
  upperSection: TVUpperType;
  upperDoors: TVDoorType;
  openShelvesCount: number;
  sidePanels: boolean;
  backPanel: boolean;
  tvNiche: boolean;
  material: WoodMaterial;
  finish: FinishType;
  handleStyle: HandleStyle;
  legStyle: LegStyle;
  priceBreakdown: TVStandPriceBreakdown;
  createdAt?: string;
}

// --- Pricing ---
const MATERIAL_M2_RATE: Record<WoodMaterial, number> = {
  oak: 2800,
  walnut: 3400,
  beech: 2200,
  white: 1800,
  black: 1950,
  anthracite: 2100,
};

const FINISH_MULT: Record<FinishType, number> = { matte: 1.0, satin: 1.08, gloss: 1.18 };
const HANDLE_COST: Record<HandleStyle, number> = { "minimal-bar": 120, "round-knob": 95, "edge-pull": 140, none: 60 };
const LEG_COST: Record<LegStyle, number> = { "wood-tapered": 480, "metal-plinth": 650, "hairpin-black": 420, none: 120 };

function calcTVPrice(s: Omit<TVStandState, "priceBreakdown" | "savedDesigns" | keyof TVStandActions>): TVStandPriceBreakdown {
  const w = s.dimensions.width / 100;
  const h = s.dimensions.height / 100;
  const d = s.dimensions.depth / 100;
  const uh = s.dimensions.upperHeight / 100;
  const m2Rate = MATERIAL_M2_RATE[s.material] ?? 2200;
  const finishM = FINISH_MULT[s.finish] ?? 1.0;

  // Base console carcass panels (2 sides + top + bottom + optional back)
  const sideArea = 2 * (h * d);
  const topBotArea = 2 * (w * d);
  const backArea = s.backPanel ? w * h * 0.6 : 0;
  const carcassArea = sideArea + topBotArea + backArea;

  const basePrice = Math.round(2200 + carcassArea * 1200);
  const materialCost = Math.max(0, Math.round(carcassArea * (m2Rate - 1200) + carcassArea * m2Rate * (finishM - 1)));

  // Upper section
  let upperCost = 0;
  if (s.upperSection !== "none") {
    const upperCarcassArea = 2 * (uh * d) + 2 * (w * d);
    upperCost += Math.round(upperCarcassArea * m2Rate * finishM);
    if (s.upperSection === "cabinets" || s.upperSection === "mixed") {
      const doorPanelArea = w * uh * (s.upperSection === "mixed" ? 0.6 : 1.0);
      upperCost += Math.round(doorPanelArea * m2Rate * finishM);
      if (s.upperDoors === "glass") upperCost += Math.round(doorPanelArea * 1200); // glass surcharge
    }
    // Open shelves cost
    if (s.upperSection === "open-shelves" || s.upperSection === "mixed") {
      upperCost += s.openShelvesCount * Math.round(w * d * m2Rate * finishM + 85);
    }
  }

  // Door & hinge cost (TV base section)
  let doorsCost = 0;
  // TV stand typically has 2 lower doors for cable/AV equipment
  if (s.upperDoors !== "none" && s.upperSection !== "none") {
    const hingeCount = 4;
    doorsCost = Math.round(hingeCount * 90);
  }

  // Hardware
  const handleCount = s.upperSection !== "none" && s.upperDoors !== "none" ? 2 : 0;
  const hardwareCost = Math.round(
    (handleCount > 0 ? handleCount * HANDLE_COST[s.handleStyle] : 0) +
    LEG_COST[s.legStyle] +
    (s.backPanel ? 250 : 0) +
    (s.sidePanels ? Math.round(2 * (h * 0.3) * m2Rate * finishM) : 0) +
    (s.tvNiche ? 350 : 0)
  );

  const totalPrice = basePrice + materialCost + upperCost + doorsCost + hardwareCost;

  return { basePrice, materialCost, upperSectionCost: upperCost, doorsCost, hardwareCost, totalPrice: Math.round(totalPrice) };
}

// --- Store interfaces ---
interface TVStandActions {
  setWidth: (v: number) => void;
  setHeight: (v: number) => void;
  setDepth: (v: number) => void;
  setUpperHeight: (v: number) => void;
  setUpperSection: (v: TVUpperType) => void;
  setUpperDoors: (v: TVDoorType) => void;
  setOpenShelvesCount: (v: number) => void;
  setSidePanels: (v: boolean) => void;
  setBackPanel: (v: boolean) => void;
  setTvNiche: (v: boolean) => void;
  setMaterial: (v: WoodMaterial) => void;
  setFinish: (v: FinishType) => void;
  setHandleStyle: (v: HandleStyle) => void;
  setLegStyle: (v: LegStyle) => void;
  setExplodedView: (v: boolean) => void;
  toggleExplodedView: () => void;
  setCameraPreset: (v: PresetView) => void;
  resetConfiguration: () => void;
  saveCurrentDesign: (name?: string) => TVStandConfiguration;
  loadDesign: (config: TVStandConfiguration) => void;
  deleteSavedDesign: (id: string) => void;
  initSavedDesigns: () => void;
  getCurrentConfiguration: () => TVStandConfiguration;
  setDesignName: (name: string) => void;
}

interface TVStandState {
  designName: string;
  dimensions: TVStandDimensions;
  upperSection: TVUpperType;
  upperDoors: TVDoorType;
  openShelvesCount: number;
  sidePanels: boolean;
  backPanel: boolean;
  tvNiche: boolean;
  material: WoodMaterial;
  finish: FinishType;
  handleStyle: HandleStyle;
  legStyle: LegStyle;
  explodedView: boolean;
  cameraPreset: PresetView;
  priceBreakdown: TVStandPriceBreakdown;
  savedDesigns: TVStandConfiguration[];
}

const DEFAULT: Omit<TVStandState, "priceBreakdown" | "savedDesigns"> = {
  designName: "TV Duvar Ünitesi",
  dimensions: { width: 180, height: 50, depth: 40, upperHeight: 60 },
  upperSection: "mixed",
  upperDoors: "solid",
  openShelvesCount: 2,
  sidePanels: true,
  backPanel: true,
  tvNiche: false,
  material: "oak",
  finish: "satin",
  handleStyle: "minimal-bar",
  legStyle: "none",
  explodedView: false,
  cameraPreset: "perspective",
};

type StoreState = TVStandState & TVStandActions;

export const useTVStandStore = create<StoreState>((set, get) => {
  const recalc = (patch: Partial<TVStandState>) => {
    const merged = { ...get(), ...patch };
    return { ...patch, priceBreakdown: calcTVPrice(merged) };
  };

  return {
    ...DEFAULT,
    priceBreakdown: calcTVPrice(DEFAULT as TVStandState),
    savedDesigns: [],

    setDesignName: (name) => set({ designName: name }),

    setWidth: (v) => set(recalc({ dimensions: { ...get().dimensions, width: Math.min(300, Math.max(100, v)) } })),
    setHeight: (v) => set(recalc({ dimensions: { ...get().dimensions, height: Math.min(80, Math.max(30, v)) } })),
    setDepth: (v) => set(recalc({ dimensions: { ...get().dimensions, depth: Math.min(55, Math.max(25, v)) } })),
    setUpperHeight: (v) => set(recalc({ dimensions: { ...get().dimensions, upperHeight: Math.min(100, Math.max(30, v)) } })),
    setUpperSection: (v) => set(recalc({ upperSection: v })),
    setUpperDoors: (v) => set(recalc({ upperDoors: v })),
    setOpenShelvesCount: (v) => set(recalc({ openShelvesCount: Math.min(5, Math.max(0, v)) })),
    setSidePanels: (v) => set(recalc({ sidePanels: v })),
    setBackPanel: (v) => set(recalc({ backPanel: v })),
    setTvNiche: (v) => set(recalc({ tvNiche: v })),
    setMaterial: (v) => set(recalc({ material: v })),
    setFinish: (v) => set(recalc({ finish: v })),
    setHandleStyle: (v) => set(recalc({ handleStyle: v })),
    setLegStyle: (v) => set(recalc({ legStyle: v })),
    setExplodedView: (v) => set({ explodedView: v }),
    toggleExplodedView: () => set({ explodedView: !get().explodedView }),
    setCameraPreset: (v) => set({ cameraPreset: v }),

    resetConfiguration: () => set({ ...DEFAULT, priceBreakdown: calcTVPrice(DEFAULT as TVStandState) }),

    getCurrentConfiguration: (): TVStandConfiguration => {
      const s = get();
      return {
        id: `tvstand-${Date.now()}`,
        name: s.designName,
        dimensions: { ...s.dimensions },
        upperSection: s.upperSection,
        upperDoors: s.upperDoors,
        openShelvesCount: s.openShelvesCount,
        sidePanels: s.sidePanels,
        backPanel: s.backPanel,
        tvNiche: s.tvNiche,
        material: s.material,
        finish: s.finish,
        handleStyle: s.handleStyle,
        legStyle: s.legStyle,
        priceBreakdown: { ...s.priceBreakdown },
        createdAt: new Date().toISOString(),
      };
    },

    saveCurrentDesign: (name?: string): TVStandConfiguration => {
      const config = get().getCurrentConfiguration();
      if (name) config.name = name;
      const updated = [config, ...get().savedDesigns.filter((d) => d.id !== config.id)];
      if (typeof window !== "undefined") {
        try { localStorage.setItem("fanus_tv_designs", JSON.stringify(updated)); } catch { /* noop */ }
      }
      set({ savedDesigns: updated });
      return config;
    },

    loadDesign: (config: TVStandConfiguration) => {
      set({
        designName: config.name,
        dimensions: { ...config.dimensions },
        upperSection: config.upperSection,
        upperDoors: config.upperDoors,
        openShelvesCount: config.openShelvesCount,
        sidePanels: config.sidePanels,
        backPanel: config.backPanel,
        tvNiche: config.tvNiche,
        material: config.material,
        finish: config.finish,
        handleStyle: config.handleStyle,
        legStyle: config.legStyle,
        priceBreakdown: calcTVPrice(config as unknown as TVStandState),
        explodedView: false,
      });
    },

    deleteSavedDesign: (id: string) => {
      const updated = get().savedDesigns.filter((d) => d.id !== id);
      if (typeof window !== "undefined") {
        try { localStorage.setItem("fanus_tv_designs", JSON.stringify(updated)); } catch { /* noop */ }
      }
      set({ savedDesigns: updated });
    },

    initSavedDesigns: () => {
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("fanus_tv_designs");
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) set({ savedDesigns: parsed });
          }
        } catch { /* noop */ }
      }
    },
  };
});
