"use client";

/**
 * StorageBed3D.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * TEK KİŞİLİK YATAY BAZA – Single Horizontal Storage Bed Base
 * Phase 1: Assembled static model (no animation, no exploded view yet).
 *
 * SOURCE OF DIMENSIONS
 * ─────────────────────
 * The uploaded PDF (TEK_KİŞİLİK_YATAY_BAZA_.pdf) is a compressed technical
 * assembly drawing. Its content streams are FlateDecode-compressed and cannot
 * be decoded without a full PDF renderer.
 *
 * All dimensions used here are therefore PROVISIONAL and are based on:
 *   – Standard Turkish single-bed industry dimensions (90 × 190 cm mattress footprint)
 *   – Typical horizontal Baza (storage divan) construction proportions
 *   – Visual proportions inferred from the product name and category
 *
 * Every provisional value is annotated with ⚠️ PROVISIONAL in comments.
 * They MUST be replaced with verified manufacturer dimensions once the
 * technical drawings are decoded in a later phase.
 *
 * STRUCTURAL ELEMENTS MODELLED
 * ─────────────────────────────
 * ✅ Two upholstered long side panels (fabric-wrapped)
 * ✅ Upholstered headboard panel
 * ✅ Upholstered footboard panel
 * ✅ Main perimeter wooden frame (box base)
 * ✅ Internal cross-support bars (3×)
 * ✅ Wooden slatted deck (12 slats)
 * ✅ Four corner legs
 * ✅ Gas-lift hinge rod (storage lifting mechanism indicator)
 * ✅ Two metal hinge brackets (front lift points)
 *
 * NOT MODELLED (pending verified drawings or Phase 2)
 * ✗ Mattress / upholstery stitching detail
 * ✗ Drawer mechanism (not present on horizontal baza)
 * ✗ Exploded/animation state
 */

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WoodMaterial, FinishType } from "@/types/furniture";
import { getProceduralMaterial } from "./woodTextures";

// ─── Fixed structural constants (all in METERS) ──────────────────────────────
// ⚠️ ALL PROVISIONAL — replace with verified manufacturer values in Phase 2

// Frame geometry
const PANEL_T  = 0.022; // ⚠️ PROVISIONAL — 22 mm structural panel thickness
const LEG_H    = 0.08;  // ⚠️ PROVISIONAL — 8 cm metal leg height (cylindrical)
const LEG_R    = 0.025; // ⚠️ PROVISIONAL — 25 mm leg radius
const SLAT_T   = 0.012; // ⚠️ PROVISIONAL — 12 mm slat thickness
const SLAT_W   = 0.08;  // ⚠️ PROVISIONAL — 80 mm slat width
const SLAT_GAP = 0.04;  // ⚠️ PROVISIONAL — 40 mm gap between slats
const SLAT_CNT = 12;    // ⚠️ PROVISIONAL — 12 slats
const XBAR_CNT = 3;     // ⚠️ PROVISIONAL — 3 internal cross-support bars

// Upholstered side-panel height (above frame top surface, decorative border)
const SIDE_PANEL_H = 0.14; // ⚠️ PROVISIONAL — 14 cm upholstered side rail height

// ─── Upholstery material colours ─────────────────────────────────────────────
export type UpholsteryColor = "dove-grey" | "charcoal" | "ivory" | "sand" | "navy";

const UPHOLSTERY_COLORS: Record<UpholsteryColor, { color: string; roughness: number }> = {
  "dove-grey":  { color: "#b0aaa6", roughness: 0.82 },
  "charcoal":   { color: "#3c3c3e", roughness: 0.80 },
  "ivory":      { color: "#e8e3d8", roughness: 0.84 },
  "sand":       { color: "#c9b89a", roughness: 0.83 },
  "navy":       { color: "#2a3550", roughness: 0.81 },
};

// ─── Props interface ──────────────────────────────────────────────────────────
export interface StorageBedDimensions {
  /** Total outer width in cm  ⚠️ PROVISIONAL default: 100 */
  width: number;
  /** Total outer length in cm ⚠️ PROVISIONAL default: 200 */
  length: number;
  /** Total height from floor in cm including legs ⚠️ PROVISIONAL default: 40 */
  height: number;
  /** Headboard height in cm ⚠️ PROVISIONAL default: 56 */
  headboardHeight: number;
  /** Footboard height in cm ⚠️ PROVISIONAL default: 30 */
  footboardHeight: number;
}

export interface StorageBed3DProps {
  /** Overall dimensions – all configurable */
  dimensions?: Partial<StorageBedDimensions>;
  /** Wood material for the structural frame slats and internal frame */
  frameMaterial?: WoodMaterial;
  /** Wood finish for the frame */
  frameFinish?: FinishType;
  /** Upholstery fabric colour for the side panels, head, and footboard */
  upholsteryColor?: UpholsteryColor;
  /** Show the gas-lift mechanism indicator rod */
  showLiftMechanism?: boolean;
  /** Reserved for Phase 2 — currently ignored */
  explodedView?: boolean;
}

// ─── Default dimension values (⚠️ ALL PROVISIONAL) ───────────────────────────
const DEFAULT_DIMENSIONS: StorageBedDimensions = {
  width:           100, // ⚠️ PROVISIONAL
  length:          200, // ⚠️ PROVISIONAL
  height:           40, // ⚠️ PROVISIONAL
  headboardHeight:  56, // ⚠️ PROVISIONAL
  footboardHeight:  30, // ⚠️ PROVISIONAL
};

// ─── Component ────────────────────────────────────────────────────────────────
export const StorageBed3D: React.FC<StorageBed3DProps> = ({
  dimensions: dimOverrides = {},
  frameMaterial = "oak",
  frameFinish   = "satin",
  upholsteryColor = "dove-grey",
  showLiftMechanism = true,
  explodedView = false, // reserved
}) => {
  void explodedView; // suppressed – Phase 2 only

  // Merge dimension overrides with defaults (all in cm → convert to meters)
  const dims: StorageBedDimensions = { ...DEFAULT_DIMENSIONS, ...dimOverrides };
  const W  = dims.width           / 100;
  const L  = dims.length          / 100;
  const H  = dims.height          / 100;
  const HH = dims.headboardHeight / 100;
  const FH = dims.footboardHeight / 100;

  // ── Materials ──────────────────────────────────────────────────────────────
  const woodMat = useMemo(
    () => getProceduralMaterial(frameMaterial, frameFinish),
    [frameMaterial, frameFinish]
  );

  const uphPalette  = UPHOLSTERY_COLORS[upholsteryColor];
  const upholsteryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color:    new THREE.Color(uphPalette.color),
        roughness: uphPalette.roughness,
        metalness: 0.0,
      }),
    [uphPalette]
  );

  const metalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color:     new THREE.Color("#6b6b6b"),
        metalness: 0.85,
        roughness: 0.28,
      }),
    []
  );

  const hingeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color:     new THREE.Color("#4a4a4a"),
        metalness: 0.90,
        roughness: 0.22,
      }),
    []
  );

  // ── Derived geometry ───────────────────────────────────────────────────────
  const frameBoxH = H - LEG_H; // height of the structural box frame above legs

  // Slat positions (evenly distributed inside frame)
  const slatPositions = useMemo(() => {
    const totalSlatW = SLAT_CNT * SLAT_W + (SLAT_CNT - 1) * SLAT_GAP;
    const startX = -totalSlatW / 2 + SLAT_W / 2;
    return Array.from({ length: SLAT_CNT }, (_, i) => startX + i * (SLAT_W + SLAT_GAP));
  }, []);

  // Cross-bar positions (evenly distributed along length)
  const crossBarPositions = useMemo(() => {
    const spacing = (L - 2 * PANEL_T) / (XBAR_CNT + 1);
    return Array.from({ length: XBAR_CNT }, (_, i) => -(L / 2 - PANEL_T) + (i + 1) * spacing);
  }, [L]);

  // Phase 2 animation hook placeholder
  const groupRef = useRef<THREE.Group>(null);
  useFrame(() => { /* explode animation – Phase 2 */ });

  // Y position of top surface of base (floor → legs → frame box top)
  const baseTopY = LEG_H + frameBoxH;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>

      {/* ═══════════════════════════════════════════════════════════════
          LEGS (4× cylindrical metal, one at each corner)
          ⚠️ PROVISIONAL — 25 mm radius, 8 cm height
      ═══════════════════════════════════════════════════════════════ */}
      {([
        [-W / 2 + LEG_R + 0.01,  -L / 2 + LEG_R + 0.01],
        [ W / 2 - LEG_R - 0.01,  -L / 2 + LEG_R + 0.01],
        [-W / 2 + LEG_R + 0.01,   L / 2 - LEG_R - 0.01],
        [ W / 2 - LEG_R - 0.01,   L / 2 - LEG_R - 0.01],
      ] as [number, number][]).map(([x, z], i) => (
        <group key={`leg-${i}`} position={[x, LEG_H / 2, z]}>
          <mesh castShadow receiveShadow material={metalMat}>
            <cylinderGeometry args={[LEG_R, LEG_R * 1.1, LEG_H, 16]} />
          </mesh>
          {/* Foot pad */}
          <mesh position={[0, -LEG_H / 2 + 0.008, 0]} material={metalMat}>
            <cylinderGeometry args={[LEG_R * 1.3, LEG_R * 1.3, 0.016, 16]} />
          </mesh>
        </group>
      ))}

      {/* ═══════════════════════════════════════════════════════════════
          STRUCTURAL FRAME BOX (perimeter wooden frame above legs)
          Bottom panel + two long sides + two short ends
          ⚠️ PROVISIONAL — 22 mm panel thickness
      ═══════════════════════════════════════════════════════════════ */}
      <group position={[0, LEG_H, 0]}>
        {/* Bottom panel (storage floor) */}
        <mesh position={[0, PANEL_T / 2, 0]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[W - 2 * PANEL_T, PANEL_T, L - 2 * PANEL_T]} />
        </mesh>

        {/* Long side frame rail – left */}
        <mesh
          position={[-W / 2 + PANEL_T / 2, frameBoxH / 2, 0]}
          castShadow receiveShadow material={woodMat}
        >
          <boxGeometry args={[PANEL_T, frameBoxH, L]} />
        </mesh>

        {/* Long side frame rail – right */}
        <mesh
          position={[W / 2 - PANEL_T / 2, frameBoxH / 2, 0]}
          castShadow receiveShadow material={woodMat}
        >
          <boxGeometry args={[PANEL_T, frameBoxH, L]} />
        </mesh>

        {/* Short end frame rail – head (back) */}
        <mesh
          position={[0, frameBoxH / 2, -L / 2 + PANEL_T / 2]}
          castShadow receiveShadow material={woodMat}
        >
          <boxGeometry args={[W, frameBoxH, PANEL_T]} />
        </mesh>

        {/* Short end frame rail – foot (front) */}
        <mesh
          position={[0, frameBoxH / 2, L / 2 - PANEL_T / 2]}
          castShadow receiveShadow material={woodMat}
        >
          <boxGeometry args={[W, frameBoxH, PANEL_T]} />
        </mesh>

        {/* ── Cross-support bars (3×) ⚠️ PROVISIONAL ── */}
        {crossBarPositions.map((z, i) => (
          <mesh
            key={`xbar-${i}`}
            position={[0, frameBoxH / 2, z]}
            castShadow receiveShadow material={woodMat}
          >
            <boxGeometry args={[W - 2 * PANEL_T, PANEL_T * 0.75, PANEL_T]} />
          </mesh>
        ))}

        {/* ── Wooden slatted deck ⚠️ PROVISIONAL — 12 slats ── */}
        {slatPositions.map((x, i) => (
          <mesh
            key={`slat-${i}`}
            position={[x, frameBoxH - SLAT_T / 2, 0]}
            castShadow receiveShadow material={woodMat}
          >
            <boxGeometry args={[SLAT_W, SLAT_T, L - 2 * PANEL_T - 0.02]} />
          </mesh>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          UPHOLSTERED SIDE PANELS
          Fabric-wrapped decorative border panels on both long sides,
          sitting above the frame box, surrounding the slatted deck.
          ⚠️ PROVISIONAL height: 14 cm
      ═══════════════════════════════════════════════════════════════ */}
      {/* Left upholstered side panel */}
      <mesh
        position={[-W / 2 - 0.01, baseTopY + SIDE_PANEL_H / 2, 0]}
        castShadow receiveShadow material={upholsteryMat}
      >
        <boxGeometry args={[0.025, SIDE_PANEL_H, L]} />
      </mesh>

      {/* Right upholstered side panel */}
      <mesh
        position={[W / 2 + 0.01, baseTopY + SIDE_PANEL_H / 2, 0]}
        castShadow receiveShadow material={upholsteryMat}
      >
        <boxGeometry args={[0.025, SIDE_PANEL_H, L]} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════
          HEADBOARD
          Upholstered panel at the head (−Z end) of the bed.
          ⚠️ PROVISIONAL height: 56 cm, thickness: 7 cm
      ═══════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, -L / 2 - 0.035]}>
        {/* Structural backing */}
        <mesh position={[0, HH / 2, 0.02]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[W, HH, 0.025]} />
        </mesh>
        {/* Upholstered front face */}
        <mesh position={[0, HH / 2, 0.045]} castShadow receiveShadow material={upholsteryMat}>
          <boxGeometry args={[W, HH, 0.040]} />
        </mesh>
        {/* Rounded top edge cap (subtle) */}
        <mesh position={[0, HH, 0.035]} castShadow material={upholsteryMat}>
          <boxGeometry args={[W, 0.02, 0.07]} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTBOARD
          Lower upholstered panel at the foot (+Z end).
          ⚠️ PROVISIONAL height: 30 cm, thickness: 5 cm
      ═══════════════════════════════════════════════════════════════ */}
      <group position={[0, 0, L / 2 + 0.025]}>
        <mesh position={[0, FH / 2, -0.015]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[W, FH, 0.020]} />
        </mesh>
        <mesh position={[0, FH / 2, 0.010]} castShadow receiveShadow material={upholsteryMat}>
          <boxGeometry args={[W, FH, 0.030]} />
        </mesh>
        <mesh position={[0, FH, 0.0]} castShadow material={upholsteryMat}>
          <boxGeometry args={[W, 0.015, 0.05]} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════
          GAS-LIFT STORAGE MECHANISM
          Horizontal rod along the width indicates the pivot axis of the
          lift mechanism. Two bracket arms attach it to the frame.
          ⚠️ PROVISIONAL — position and dimensions inferred from typical
          horizontal baza assemblies; exact spec requires verified PDF.
      ═══════════════════════════════════════════════════════════════ */}
      {showLiftMechanism && (
        <group position={[0, LEG_H + frameBoxH * 0.65, L / 2 - PANEL_T - 0.08]}>
          {/* Main pivot rod – runs across full width */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow material={hingeMat}>
            <cylinderGeometry args={[0.008, 0.008, W - 0.06, 12]} />
          </mesh>

          {/* Left hinge bracket */}
          <group position={[-W / 2 + 0.07, 0, 0]}>
            <mesh castShadow material={hingeMat}>
              <boxGeometry args={[0.025, 0.09, 0.012]} />
            </mesh>
            {/* Bracket pin */}
            <mesh position={[0, -0.038, 0]} rotation={[0, 0, Math.PI / 2]} material={metalMat}>
              <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
            </mesh>
          </group>

          {/* Right hinge bracket */}
          <group position={[W / 2 - 0.07, 0, 0]}>
            <mesh castShadow material={hingeMat}>
              <boxGeometry args={[0.025, 0.09, 0.012]} />
            </mesh>
            <mesh position={[0, -0.038, 0]} rotation={[0, 0, Math.PI / 2]} material={metalMat}>
              <cylinderGeometry args={[0.005, 0.005, 0.03, 8]} />
            </mesh>
          </group>

          {/* Gas strut indicator (diagonal arm, simplified) */}
          <mesh
            position={[0, 0.06, -0.12]}
            rotation={[Math.PI / 5, 0, 0]}
            castShadow material={metalMat}
          >
            <cylinderGeometry args={[0.005, 0.005, 0.26, 8]} />
          </mesh>
        </group>
      )}

    </group>
  );
};
