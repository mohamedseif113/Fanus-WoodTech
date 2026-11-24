import {
  CabinetDimensions,
  WoodMaterial,
  DoorConfiguration,
  HandleStyle,
  LegStyle,
  FinishType,
  PriceBreakdown,
} from "@/types/furniture";

export interface PricingParameters {
  dimensions: CabinetDimensions;
  shelfCount: number;
  material: WoodMaterial;
  doorType: DoorConfiguration;
  handleStyle: HandleStyle;
  legStyle: LegStyle;
  finish: FinishType;
  backPanel: boolean;
}

// Material cost per square meter of panel (TRY base rates)
const MATERIAL_M2_RATE: Record<WoodMaterial, number> = {
  oak: 2800,        // Natural Oak Veneer
  walnut: 3400,     // American Walnut Veneer
  beech: 2200,      // Natural Light Beech
  white: 1800,      // Matte White Lacquered MDF
  black: 1950,      // Matte Black Lacquered MDF
  anthracite: 2100, // Anthracite Lacquered MDF
};

// Finish multiplier for lacquer/topcoat
const FINISH_MULTIPLIER: Record<FinishType, number> = {
  matte: 1.0,
  satin: 1.08,
  gloss: 1.18,
};

// Hardware pricing
const HANDLE_COSTS: Record<HandleStyle, number> = {
  "minimal-bar": 120, // per handle
  "round-knob": 95,
  "edge-pull": 140,
  none: 60, // push-to-open latch mechanism
};

const LEG_COSTS: Record<LegStyle, number> = {
  "wood-tapered": 480, // set of 4
  "metal-plinth": 650, // welded steel frame base
  "hairpin-black": 420, // set of 4
  none: 120, // leveler glides
};

/**
 * Calculates estimated manufacturing price based on engineering formula:
 * Area calculation of 18mm structural panels + hardware + finish.
 */
export function calculateFurniturePrice(params: PricingParameters): PriceBreakdown {
  const { dimensions, shelfCount, material, doorType, handleStyle, legStyle, finish, backPanel } = params;

  // Convert dimensions to meters
  const w = dimensions.width / 100;
  const h = dimensions.height / 100;
  const d = dimensions.depth / 100;

  // Structural panel area (in square meters)
  // 2 Side panels:
  const sidesArea = 2 * (h * d);
  // Top and bottom panels:
  const topBottomArea = 2 * (w * d);
  // Back panel (8mm grooved board):
  const backArea = backPanel ? w * h * 0.6 : 0; // lighter material factor
  // Fixed base carcass area
  const carcassArea = sidesArea + topBottomArea + backArea;

  // Shelves area:
  const shelvesArea = shelfCount * (w * d);

  // Door area:
  let doorArea = 0;
  let hingeCount = 0;
  let handleCount = 0;

  if (doorType === "two-doors") {
    doorArea = w * h;
    hingeCount = 4; // 2 hinges per door
    handleCount = 2;
  } else if (doorType === "four-doors") {
    doorArea = w * h;
    hingeCount = 8; // 2 hinges per door * 4
    handleCount = 4;
  } else if (doorType === "half-doors") {
    doorArea = w * (h * 0.45);
    hingeCount = 4;
    handleCount = 2;
  }

  const baseRate = 1800; // Base manufacturing overhead & CNC setup
  const m2Rate = MATERIAL_M2_RATE[material] || 2200;
  const finishMult = FINISH_MULTIPLIER[finish] || 1.0;

  // Cost items
  const basePrice = Math.round(baseRate + carcassArea * 1200);
  const materialCost = Math.round((carcassArea * (m2Rate - 1200) + carcassArea * m2Rate * (finishMult - 1)));
  const shelfCost = Math.round(shelvesArea * m2Rate * finishMult + shelfCount * 85); // includes shelf pins & machining
  const doorCost = Math.round(doorArea * m2Rate * finishMult + hingeCount * 90); // soft-close hinges included
  const hardwareCost = Math.round(
    (handleCount > 0 ? handleCount * HANDLE_COSTS[handleStyle] : 0) +
    LEG_COSTS[legStyle] +
    (backPanel ? 250 : 0)
  );

  const totalPrice = basePrice + Math.max(0, materialCost) + shelfCost + doorCost + hardwareCost;

  return {
    basePrice,
    materialCost: Math.max(0, materialCost),
    shelfCost,
    doorCost,
    hardwareCost,
    totalPrice: Math.round(totalPrice),
  };
}
