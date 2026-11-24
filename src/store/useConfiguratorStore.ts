"use client";

import { create } from "zustand";
import {
  CabinetDimensions,
  WoodMaterial,
  DoorConfiguration,
  HandleStyle,
  LegStyle,
  FinishType,
  PresetView,
  PriceBreakdown,
  FurnitureConfiguration,
} from "@/types/furniture";
import { calculateFurniturePrice } from "@/services/pricing";

interface ConfiguratorState {
  // Furniture configuration
  designName: string;
  dimensions: CabinetDimensions;
  shelfCount: number;
  material: WoodMaterial;
  doorType: DoorConfiguration;
  handleStyle: HandleStyle;
  legStyle: LegStyle;
  finish: FinishType;
  backPanel: boolean;

  // 3D Viewport state
  explodedView: boolean;
  cameraPreset: PresetView;

  // Real-time Pricing
  priceBreakdown: PriceBreakdown;

  // Persistence
  savedDesigns: FurnitureConfiguration[];

  // Actions
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setDepth: (depth: number) => void;
  setDimensions: (dims: Partial<CabinetDimensions>) => void;
  setShelfCount: (count: number) => void;
  setMaterial: (material: WoodMaterial) => void;
  setDoorType: (doorType: DoorConfiguration) => void;
  setHandleStyle: (handle: HandleStyle) => void;
  setLegStyle: (leg: LegStyle) => void;
  setFinish: (finish: FinishType) => void;
  setBackPanel: (enabled: boolean) => void;
  setExplodedView: (enabled: boolean) => void;
  toggleExplodedView: () => void;
  setCameraPreset: (preset: PresetView) => void;
  resetConfiguration: () => void;
  saveCurrentDesign: (name?: string) => FurnitureConfiguration;
  loadDesign: (config: FurnitureConfiguration) => void;
  deleteSavedDesign: (id: string) => void;
  initSavedDesigns: () => void;
  getCurrentConfiguration: () => FurnitureConfiguration;
}

const DEFAULT_DIMENSIONS: CabinetDimensions = {
  width: 120,
  height: 180,
  depth: 40,
};

const DEFAULT_STATE = {
  designName: "Modüler Ahşap Vitrin Dolabı",
  dimensions: DEFAULT_DIMENSIONS,
  shelfCount: 3,
  material: "oak" as WoodMaterial,
  doorType: "two-doors" as DoorConfiguration,
  handleStyle: "minimal-bar" as HandleStyle,
  legStyle: "wood-tapered" as LegStyle,
  finish: "satin" as FinishType,
  backPanel: true,
  explodedView: false,
  cameraPreset: "perspective" as PresetView,
};

function getCalculatedPrice(state: {
  dimensions: CabinetDimensions;
  shelfCount: number;
  material: WoodMaterial;
  doorType: DoorConfiguration;
  handleStyle: HandleStyle;
  legStyle: LegStyle;
  finish: FinishType;
  backPanel: boolean;
}): PriceBreakdown {
  return calculateFurniturePrice({
    dimensions: state.dimensions,
    shelfCount: state.shelfCount,
    material: state.material,
    doorType: state.doorType,
    handleStyle: state.handleStyle,
    legStyle: state.legStyle,
    finish: state.finish,
    backPanel: state.backPanel,
  });
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  ...DEFAULT_STATE,
  priceBreakdown: getCalculatedPrice(DEFAULT_STATE),
  savedDesigns: [],

  setWidth: (width: number) => {
    const clamped = Math.min(240, Math.max(60, width));
    const newDims = { ...get().dimensions, width: clamped };
    const priceBreakdown = getCalculatedPrice({ ...get(), dimensions: newDims });
    set({ dimensions: newDims, priceBreakdown });
  },

  setHeight: (height: number) => {
    const clamped = Math.min(240, Math.max(80, height));
    const newDims = { ...get().dimensions, height: clamped };
    const priceBreakdown = getCalculatedPrice({ ...get(), dimensions: newDims });
    set({ dimensions: newDims, priceBreakdown });
  },

  setDepth: (depth: number) => {
    const clamped = Math.min(80, Math.max(25, depth));
    const newDims = { ...get().dimensions, depth: clamped };
    const priceBreakdown = getCalculatedPrice({ ...get(), dimensions: newDims });
    set({ dimensions: newDims, priceBreakdown });
  },

  setDimensions: (dims: Partial<CabinetDimensions>) => {
    const current = get().dimensions;
    const newDims = {
      width: dims.width !== undefined ? Math.min(240, Math.max(60, dims.width)) : current.width,
      height: dims.height !== undefined ? Math.min(240, Math.max(80, dims.height)) : current.height,
      depth: dims.depth !== undefined ? Math.min(80, Math.max(25, dims.depth)) : current.depth,
    };
    const priceBreakdown = getCalculatedPrice({ ...get(), dimensions: newDims });
    set({ dimensions: newDims, priceBreakdown });
  },

  setShelfCount: (count: number) => {
    const clamped = Math.min(8, Math.max(0, count));
    const priceBreakdown = getCalculatedPrice({ ...get(), shelfCount: clamped });
    set({ shelfCount: clamped, priceBreakdown });
  },

  setMaterial: (material: WoodMaterial) => {
    const priceBreakdown = getCalculatedPrice({ ...get(), material });
    set({ material, priceBreakdown });
  },

  setDoorType: (doorType: DoorConfiguration) => {
    const priceBreakdown = getCalculatedPrice({ ...get(), doorType });
    set({ doorType, priceBreakdown });
  },

  setHandleStyle: (handleStyle: HandleStyle) => {
    const priceBreakdown = getCalculatedPrice({ ...get(), handleStyle });
    set({ handleStyle, priceBreakdown });
  },

  setLegStyle: (legStyle: LegStyle) => {
    const priceBreakdown = getCalculatedPrice({ ...get(), legStyle });
    set({ legStyle, priceBreakdown });
  },

  setFinish: (finish: FinishType) => {
    const priceBreakdown = getCalculatedPrice({ ...get(), finish });
    set({ finish, priceBreakdown });
  },

  setBackPanel: (backPanel: boolean) => {
    const priceBreakdown = getCalculatedPrice({ ...get(), backPanel });
    set({ backPanel, priceBreakdown });
  },

  setExplodedView: (explodedView: boolean) => {
    set({ explodedView });
  },

  toggleExplodedView: () => {
    set({ explodedView: !get().explodedView });
  },

  setCameraPreset: (cameraPreset: PresetView) => {
    set({ cameraPreset });
  },

  resetConfiguration: () => {
    set({
      ...DEFAULT_STATE,
      priceBreakdown: getCalculatedPrice(DEFAULT_STATE),
    });
  },

  getCurrentConfiguration: (): FurnitureConfiguration => {
    const s = get();
    return {
      id: `fanus-config-${Date.now()}`,
      name: s.designName,
      dimensions: { ...s.dimensions },
      shelfCount: s.shelfCount,
      material: s.material,
      doorType: s.doorType,
      handleStyle: s.handleStyle,
      legStyle: s.legStyle,
      finish: s.finish,
      backPanel: s.backPanel,
      priceBreakdown: { ...s.priceBreakdown },
      createdAt: new Date().toISOString(),
    };
  },

  saveCurrentDesign: (name?: string) => {
    const config = get().getCurrentConfiguration();
    if (name) config.name = name;
    const updated = [config, ...get().savedDesigns.filter((d) => d.id !== config.id)];
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fanus_saved_designs", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save design to localStorage:", e);
      }
    }
    set({ savedDesigns: updated });
    return config;
  },

  loadDesign: (config: FurnitureConfiguration) => {
    const priceBreakdown = getCalculatedPrice(config);
    set({
      designName: config.name,
      dimensions: { ...config.dimensions },
      shelfCount: config.shelfCount,
      material: config.material,
      doorType: config.doorType,
      handleStyle: config.handleStyle,
      legStyle: config.legStyle,
      finish: config.finish,
      backPanel: config.backPanel,
      priceBreakdown,
      explodedView: false,
    });
  },

  deleteSavedDesign: (id: string) => {
    const updated = get().savedDesigns.filter((d) => d.id !== id);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fanus_saved_designs", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to delete design from localStorage:", e);
      }
    }
    set({ savedDesigns: updated });
  },

  initSavedDesigns: () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("fanus_saved_designs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            set({ savedDesigns: parsed });
          }
        }
      } catch (e) {
        console.error("Failed to load saved designs:", e);
      }
    }
  },
}));
