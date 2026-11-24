export type WoodMaterial = "oak" | "walnut" | "white" | "black" | "anthracite" | "beech";

export type DoorConfiguration = "none" | "two-doors" | "four-doors" | "half-doors";

export type HandleStyle = "minimal-bar" | "round-knob" | "edge-pull" | "none";

export type LegStyle = "wood-tapered" | "metal-plinth" | "hairpin-black" | "none";

export type FinishType = "matte" | "satin" | "gloss";

export type PresetView = "perspective" | "front" | "side" | "top";

export interface CabinetDimensions {
  width: number;  // cm: 60 - 240
  height: number; // cm: 80 - 240
  depth: number;  // cm: 25 - 80
}

export interface MaterialOption {
  id: WoodMaterial;
  nameKey: string;
  color: string;
  roughness: number;
  metalness: number;
  textureType: "wood" | "lacquer";
  priceMultiplier: number;
}

export interface PriceBreakdown {
  basePrice: number;
  materialCost: number;
  shelfCost: number;
  doorCost: number;
  hardwareCost: number;
  totalPrice: number;
}

export interface FurnitureConfiguration {
  id: string;
  name: string;
  dimensions: CabinetDimensions;
  shelfCount: number; // 0 - 8
  material: WoodMaterial;
  doorType: DoorConfiguration;
  handleStyle: HandleStyle;
  legStyle: LegStyle;
  finish: FinishType;
  backPanel: boolean;
  priceBreakdown: PriceBreakdown;
  createdAt?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  configuration: FurnitureConfiguration | any;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface ProductTranslation {
  name: string;
  description: string;
  features: string[];
}

export interface Product {
  id: string;
  nameKey: string;
  categoryKey: string;
  descriptionKey: string;
  basePrice: number;
  image: string;
  dimensions: CabinetDimensions;
  defaultMaterial: WoodMaterial;
  defaultShelves: number;
  defaultDoors: DoorConfiguration;
  features: string[];
  translations?: {
    tr: ProductTranslation;
    en: ProductTranslation;
  };
}

export interface Category {
  id: string;
  nameKey: string;
  descriptionKey: string;
  iconName: string;
  image: string;
  productCount: number;
}
