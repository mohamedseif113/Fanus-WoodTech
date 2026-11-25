"use client";

/**
 * StorageBed3D.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * TEK KİŞİLİK YATAY BAZA – Single Horizontal Storage Bed Base
 * 12-Step Assembly Animation & Interactive 3D Model
 *
 * Implements the 12 assembly stages from the original technical PDF:
 *   1. Metal Baza Açma Aparatının Montajı (Handles -16 onto profile -21)
 *   2. Baza Montajı (4 Leme) (Perimeter metal frame & corner brackets -8)
 *   3. Baş Ucu - Ayak Ucu - Yan Tahta Montajı (Wooden box frame & corner plates)
 *   4. Baza Alt Bağlantı Montajı (Metal cross tie bars -M1)
 *   5. Baza Stoperlerinin Montajı (Bed base stoppers -B1)
 *   6. Ayak Montajı (4 Legs & screws -14)
 *   7. Bazanın İçerisine Zemin Matının Yerleşimi (2 Floor panels)
 *   8. Latanın Bazaya Montajı (12 Wooden curved slats with caps -9)
 *   9. Baza Bariyer ve Makasın Montajı (Scissor lift mechanisms & gas pistons)
 *  10. Köşe Tutucuların Montajı (Mattress corner retainer loops -E1)
 *  11. Bazanın Bariyer ve Makas Kısmına Montajı (Upper slatted frame mounted to mechanism)
 *  12. Bazanın Bitmiş Görüntüsü (Fully assembled bed with gas lift opening/closing)
 */

import React, { useMemo } from "react";
import * as THREE from "three";
import { WoodMaterial, FinishType } from "@/types/furniture";
import { getProceduralMaterial } from "./woodTextures";

// Structural constants (in meters)
const PANEL_T = 0.022; // 22 mm panel thickness
const LEG_H = 0.09;    // 9 cm foot height
const SLAT_T = 0.012;  // 12 mm slat thickness
const SLAT_W = 0.075;  // 75 mm slat width
const SLAT_CNT = 12;   // 12 curved slats

export type UpholsteryColor = "dove-grey" | "charcoal" | "ivory" | "sand" | "navy";

const UPHOLSTERY_COLORS: Record<UpholsteryColor, { color: string; roughness: number }> = {
  "dove-grey": { color: "#b0aaa6", roughness: 0.82 },
  "charcoal": { color: "#3c3c3e", roughness: 0.80 },
  "ivory": { color: "#e8e3d8", roughness: 0.84 },
  "sand": { color: "#c9b89a", roughness: 0.83 },
  "navy": { color: "#2a3550", roughness: 0.81 },
};

export interface StorageBedDimensions {
  width: number;
  length: number;
  height: number;
  headboardHeight: number;
  footboardHeight: number;
}

export interface StorageBed3DProps {
  dimensions?: Partial<StorageBedDimensions>;
  frameMaterial?: WoodMaterial;
  frameFinish?: FinishType;
  upholsteryColor?: UpholsteryColor;
  showLiftMechanism?: boolean;
  explodedView?: boolean;
  assemblyStep?: number; // 1 to 12. If undefined or 12, full model is shown.
  stepProgress?: number; // 0.0 to 1.0 animation within the step
  openRatio?: number;    // 0.0 to 1.0 opening angle for gas lift mechanism
}

const DEFAULT_DIMENSIONS: StorageBedDimensions = {
  width: 100,
  length: 200,
  height: 40,
  headboardHeight: 56,
  footboardHeight: 30,
};

export const StorageBed3D: React.FC<StorageBed3DProps> = ({
  dimensions: dimOverrides = {},
  frameMaterial = "oak",
  frameFinish = "satin",
  upholsteryColor = "dove-grey",
  showLiftMechanism = true,
  assemblyStep = 12,
  stepProgress = 1.0,
  openRatio = 0.0,
}) => {
  const dims: StorageBedDimensions = { ...DEFAULT_DIMENSIONS, ...dimOverrides };
  const W = dims.width / 100;
  const L = dims.length / 100;
  const H = dims.height / 100;
  const HH = dims.headboardHeight / 100;
  const FH = dims.footboardHeight / 100;

  // Materials
  const woodMat = useMemo(
    () => getProceduralMaterial(frameMaterial, frameFinish),
    [frameMaterial, frameFinish]
  );

  const uphPalette = UPHOLSTERY_COLORS[upholsteryColor];
  const upholsteryMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(uphPalette.color),
        roughness: uphPalette.roughness,
        metalness: 0.0,
      }),
    [uphPalette]
  );

  const steelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4a4f54"),
        metalness: 0.88,
        roughness: 0.25,
      }),
    []
  );

  const chromeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d5d8dc"),
        metalness: 0.95,
        roughness: 0.15,
      }),
    []
  );

  const redAccentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d32f2f"),
        roughness: 0.4,
        metalness: 0.1,
      }),
    []
  );

  const blackPlasticMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#212121"),
        roughness: 0.5,
        metalness: 0.1,
      }),
    []
  );

  const brassBoltMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#d4af37"),
        metalness: 0.85,
        roughness: 0.28,
      }),
    []
  );

  const legFootMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#2c3e50"),
        metalness: 0.6,
        roughness: 0.35,
      }),
    []
  );

  const frameBoxH = H - LEG_H;
  const baseTopY = LEG_H + frameBoxH;

  // Assembly step visibility flags
  const step = assemblyStep;
  const p = Math.max(0, Math.min(1, stepProgress));

  // Determine which components are active based on the step
  // Step 1: Handle Assembly
  const isStep1Isolated = step === 1;
  // Step 2: Metal Base Assembly
  const isStep2Isolated = step === 2;

  // Box components visible in steps 3 to 12
  const showBoxFrame = !isStep1Isolated && !isStep2Isolated && step >= 3;
  // Cross tie bars in steps 4 to 12
  const showTieBars = !isStep1Isolated && !isStep2Isolated && step >= 4;
  // Bed base stoppers in steps 5 to 12
  const showStoppers = !isStep1Isolated && !isStep2Isolated && step >= 5;
  // Legs in steps 6 to 12
  const showLegs = !isStep1Isolated && !isStep2Isolated && step >= 6;
  // Floor mats in steps 7 to 12
  const showFloorPanels = !isStep1Isolated && !isStep2Isolated && step >= 7;
  // Slats attached in steps 8 to 12 (or in step 8 isolated)
  const showSlats = step === 8 || step >= 11;
  // Mechanism in steps 9 to 12
  const showMechanism = showLiftMechanism && !isStep1Isolated && !isStep2Isolated && step >= 9;
  // Mattress holders in steps 10 to 12
  const showMattressHolders = step === 10 || step >= 11;
  // Upper frame mounted on bed in steps 11 and 12
  const showUpperFrameOnBed = step >= 11;

  // Slat positions along length
  const slatSpacing = (L - 0.2) / (SLAT_CNT - 1);
  const slatPositions = useMemo(() => {
    return Array.from({ length: SLAT_CNT }, (_, i) => -L / 2 + 0.1 + i * slatSpacing);
  }, [L, slatSpacing]);

  // Dynamic lift angle for step 11 and 12 (or manual openRatio)
  const maxLiftAngle = 0.52; // ~30 degrees
  const currentLiftAngle = (step === 11 ? (1 - p * 0.4) : (step === 12 ? openRatio : 0)) * maxLiftAngle;

  return (
    <group position={[0, 0, 0]}>

      {/* =========================================================================
          STEP 1 (ISOLATED): METAL BAZA AÇMA APARATININ MONTAJI
          Handle Assembly on Metal Profile (-21)
          ========================================================================= */}
      {isStep1Isolated && (
        <group position={[0, 0.45, 0]}>
          {/* Main long profile bar -21 */}
          <mesh castShadow receiveShadow material={steelMat} position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, L * 0.85]} />
          </mesh>

          {/* Two handles (-16) gliding into place */}
          {[-0.35, 0.35].map((zOffset, idx) => {
            const handleFlyY = (1 - p) * 0.28;
            return (
              <group key={`step1-handle-${idx}`} position={[0, 0.02 + handleFlyY, zOffset]}>
                {/* U-Shaped Pull Handle (-16) */}
                <mesh castShadow material={redAccentMat} position={[0.035, 0.05, 0]}>
                  <boxGeometry args={[0.02, 0.08, 0.14]} />
                </mesh>
                <mesh castShadow material={redAccentMat} position={[0.025, 0.01, 0]}>
                  <boxGeometry args={[0.04, 0.02, 0.16]} />
                </mesh>
                {/* 2 Screws (-13) per handle */}
                {[-0.05, 0.05].map((sz, sidx) => (
                  <mesh
                    key={`s1-screw-${sidx}`}
                    position={[0.05 + (1 - p) * 0.08, 0.01, sz]}
                    rotation={[0, 0, Math.PI / 2]}
                    material={chromeMat}
                  >
                    <cylinderGeometry args={[0.004, 0.004, 0.025, 8]} />
                  </mesh>
                ))}
              </group>
            );
          })}
        </group>
      )}

      {/* =========================================================================
          STEP 2 (ISOLATED): BAZA MONTAJI (4 LEME)
          Perimeter Metal Frame & Corner Brackets Assembly
          ========================================================================= */}
      {isStep2Isolated && (
        <group position={[0, 0.5, 0]}>
          {/* Side rails expanding into place */}
          <mesh
            castShadow
            material={steelMat}
            position={[-W / 2 + 0.05 - (1 - p) * 0.25, 0, 0]}
          >
            <boxGeometry args={[0.035, 0.035, L - 0.1]} />
          </mesh>
          <mesh
            castShadow
            material={steelMat}
            position={[W / 2 - 0.05 + (1 - p) * 0.25, 0, 0]}
          >
            <boxGeometry args={[0.035, 0.035, L - 0.1]} />
          </mesh>
          {/* End rails */}
          <mesh
            castShadow
            material={steelMat}
            position={[0, 0, -L / 2 + 0.05 - (1 - p) * 0.25]}
          >
            <boxGeometry args={[W - 0.1, 0.035, 0.035]} />
          </mesh>
          <mesh
            castShadow
            material={steelMat}
            position={[0, 0, L / 2 - 0.05 + (1 - p) * 0.25]}
          >
            <boxGeometry args={[W - 0.1, 0.035, 0.035]} />
          </mesh>
          {/* Center support spine */}
          <mesh castShadow material={steelMat} position={[0, 0, 0]}>
            <boxGeometry args={[0.035, 0.035, L - 0.1]} />
          </mesh>
          {/* 4 Corner brackets (-8) */}
          {[
            [-W / 2 + 0.06, -L / 2 + 0.06],
            [W / 2 - 0.06, -L / 2 + 0.06],
            [-W / 2 + 0.06, L / 2 - 0.06],
            [W / 2 - 0.06, L / 2 - 0.06],
          ].map(([cx, cz], cidx) => (
            <group key={`corner-${cidx}`} position={[cx, 0, cz]}>
              <mesh castShadow material={chromeMat}>
                <boxGeometry args={[0.06, 0.04, 0.06]} />
              </mesh>
              {/* Corner bolts (-3) */}
              <mesh position={[0, 0.03, 0]} material={brassBoltMat}>
                <cylinderGeometry args={[0.006, 0.006, 0.015, 8]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {/* =========================================================================
          STEP 8 (ISOLATED SLATS DEMO)
          When user inspects step 8 specifically
          ========================================================================= */}
      {step === 8 && (
        <group position={[0, 0.55, 0]}>
          {/* Metal perimeter frame */}
          <mesh castShadow material={steelMat} position={[-W / 2 + 0.06, 0, 0]}>
            <boxGeometry args={[0.03, 0.03, L - 0.1]} />
          </mesh>
          <mesh castShadow material={steelMat} position={[W / 2 - 0.06, 0, 0]}>
            <boxGeometry args={[0.03, 0.03, L - 0.1]} />
          </mesh>
          <mesh castShadow material={steelMat} position={[0, 0, -L / 2 + 0.06]}>
            <boxGeometry args={[W - 0.1, 0.03, 0.03]} />
          </mesh>
          <mesh castShadow material={steelMat} position={[0, 0, L / 2 - 0.06]}>
            <boxGeometry args={[W - 0.1, 0.03, 0.03]} />
          </mesh>
          <mesh castShadow material={steelMat} position={[0, 0, 0]}>
            <boxGeometry args={[0.03, 0.03, L - 0.1]} />
          </mesh>

          {/* 12 Slats snapping in */}
          {slatPositions.map((zPos, idx) => {
            const slatDrop = (1 - p) * (0.15 + (idx % 3) * 0.06);
            return (
              <group key={`iso-slat-${idx}`} position={[0, slatDrop, zPos]}>
                {/* Curved wooden slat */}
                <mesh castShadow receiveShadow material={woodMat} position={[0, 0.02, 0]}>
                  <boxGeometry args={[W - 0.16, SLAT_T, SLAT_W]} />
                </mesh>
                {/* Left and right plastic holder caps (-9) */}
                <mesh position={[-W / 2 + 0.07, 0.02, 0]} material={redAccentMat}>
                  <boxGeometry args={[0.03, 0.02, SLAT_W + 0.01]} />
                </mesh>
                <mesh position={[W / 2 - 0.07, 0.02, 0]} material={redAccentMat}>
                  <boxGeometry args={[0.03, 0.02, SLAT_W + 0.01]} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* =========================================================================
          MAIN WOODEN BOX FRAME (Steps 3 to 12)
          ========================================================================= */}
      {showBoxFrame && (
        <group position={[0, LEG_H, 0]}>
          {/* Step 3 animation offset */}
          {(() => {
            const animDist = step === 3 ? (1 - p) * 0.35 : 0;
            return (
              <>
                {/* Left side board */}
                <group position={[-W / 2 + PANEL_T / 2 - animDist, frameBoxH / 2, 0]}>
                  <mesh castShadow receiveShadow material={woodMat}>
                    <boxGeometry args={[PANEL_T, frameBoxH, L]} />
                  </mesh>
                  {/* Upholstered outer layer */}
                  <mesh position={[-0.015, 0, 0]} material={upholsteryMat}>
                    <boxGeometry args={[0.01, frameBoxH + 0.02, L + 0.01]} />
                  </mesh>
                </group>

                {/* Right side board */}
                <group position={[W / 2 - PANEL_T / 2 + animDist, frameBoxH / 2, 0]}>
                  <mesh castShadow receiveShadow material={woodMat}>
                    <boxGeometry args={[PANEL_T, frameBoxH, L]} />
                  </mesh>
                  <mesh position={[0.015, 0, 0]} material={upholsteryMat}>
                    <boxGeometry args={[0.01, frameBoxH + 0.02, L + 0.01]} />
                  </mesh>
                </group>

                {/* Headboard panel (Head end board) */}
                <group position={[0, HH / 2 - LEG_H, -L / 2 + PANEL_T / 2 - animDist]}>
                  <mesh castShadow receiveShadow material={woodMat}>
                    <boxGeometry args={[W, HH, PANEL_T]} />
                  </mesh>
                  <mesh position={[0, 0, -0.02]} material={upholsteryMat}>
                    <boxGeometry args={[W + 0.02, HH, 0.035]} />
                  </mesh>
                </group>

                {/* Footboard panel (Foot end board) */}
                <group position={[0, FH / 2 - LEG_H, L / 2 - PANEL_T / 2 + animDist]}>
                  <mesh castShadow receiveShadow material={woodMat}>
                    <boxGeometry args={[W, FH, PANEL_T]} />
                  </mesh>
                  <mesh position={[0, 0, 0.02]} material={upholsteryMat}>
                    <boxGeometry args={[W + 0.02, FH, 0.03]} />
                  </mesh>
                </group>

                {/* 4 Corner Angle Brackets joining boards (Step 3) */}
                {[
                  [-W / 2 + 0.04, -L / 2 + 0.04],
                  [W / 2 - 0.04, -L / 2 + 0.04],
                  [-W / 2 + 0.04, L / 2 - 0.04],
                  [W / 2 - 0.04, L / 2 - 0.04],
                ].map(([bx, bz], bidx) => (
                  <mesh
                    key={`box-bracket-${bidx}`}
                    position={[bx, frameBoxH / 2, bz]}
                    material={steelMat}
                  >
                    <boxGeometry args={[0.03, frameBoxH * 0.7, 0.03]} />
                  </mesh>
                ))}
              </>
            );
          })()}

          {/* =========================================================================
              STEP 4: CROSS-SUPPORT TIE BARS (-M1) (Steps 4 to 12)
              ========================================================================= */}
          {showTieBars &&
            [ -0.4, 0, 0.4 ].map((zPos, idx) => {
              const tieBarDrop = step === 4 ? (1 - p) * 0.3 : 0;
              return (
                <group key={`tiebar-${idx}`} position={[0, 0.025 + tieBarDrop, zPos]}>
                  {/* Metal tie rod */}
                  <mesh castShadow material={steelMat}>
                    <boxGeometry args={[W - 2 * PANEL_T, 0.02, 0.02]} />
                  </mesh>
                  {/* End mounting plates with screws (-5) */}
                  <mesh position={[-W / 2 + PANEL_T + 0.015, 0, 0]} material={chromeMat}>
                    <boxGeometry args={[0.03, 0.025, 0.05]} />
                  </mesh>
                  <mesh position={[W / 2 - PANEL_T - 0.015, 0, 0]} material={chromeMat}>
                    <boxGeometry args={[0.03, 0.025, 0.05]} />
                  </mesh>
                </group>
              );
            })}

          {/* =========================================================================
              STEP 5: BED BASE STOPPERS (-B1) (Steps 5 to 12)
              ========================================================================= */}
          {showStoppers && (
            <group position={[0, frameBoxH - 0.02, 0]}>
              {[
                [-W / 2 + PANEL_T + 0.01, -0.4],
                [-W / 2 + PANEL_T + 0.01, 0.4],
                [W / 2 - PANEL_T - 0.01, -0.4],
                [W / 2 - PANEL_T - 0.01, 0.4],
              ].map(([sx, sz], sidx) => {
                const stopperSlide = step === 5 ? (1 - p) * 0.15 : 0;
                return (
                  <mesh
                    key={`stopper-${sidx}`}
                    position={[sx, -stopperSlide, sz]}
                    material={redAccentMat}
                    castShadow
                  >
                    <boxGeometry args={[0.02, 0.04, 0.05]} />
                  </mesh>
                );
              })}
            </group>
          )}

          {/* =========================================================================
              STEP 7: BOTTOM FLOOR PANELS (ZEMİN MATI) (Steps 7 to 12)
              ========================================================================= */}
          {showFloorPanels && (
            <group position={[0, 0.04, 0]}>
              {/* Front floor mat */}
              {(() => {
                const floorDrop = step === 7 ? (1 - p) * 0.45 : 0;
                return (
                  <>
                    <mesh
                      castShadow
                      receiveShadow
                      material={woodMat}
                      position={[0, floorDrop, -L / 4 + 0.02]}
                    >
                      <boxGeometry args={[W - 2 * PANEL_T - 0.02, 0.012, L / 2 - 0.04]} />
                    </mesh>
                    <mesh
                      castShadow
                      receiveShadow
                      material={woodMat}
                      position={[0, floorDrop, L / 4 - 0.02]}
                    >
                      <boxGeometry args={[W - 2 * PANEL_T - 0.02, 0.012, L / 2 - 0.04]} />
                    </mesh>
                  </>
                );
              })()}
            </group>
          )}

          {/* =========================================================================
              STEP 9: SCISSOR LIFT MECHANISM & GAS PISTONS (Steps 9 to 12)
              ========================================================================= */}
          {showMechanism && (
            <group position={[0, frameBoxH * 0.6, 0]}>
              {/* Left & Right scissor assemblies attached to inner side boards */}
              {[-1, 1].map((side) => {
                const mechFly = step === 9 ? (1 - p) * (side * 0.25) : 0;
                const posX = side * (W / 2 - PANEL_T - 0.02) + mechFly;
                return (
                  <group key={`mech-side-${side}`} position={[posX, 0, 0]}>
                    {/* Barrier frame F1-F2 (ladder bar) */}
                    <mesh castShadow material={steelMat} position={[0, -0.05, 0]}>
                      <boxGeometry args={[0.015, 0.03, L * 0.6]} />
                    </mesh>
                    {/* Scissor linkage arms (T1-T2) */}
                    <mesh
                      position={[0, 0.05, -0.2]}
                      rotation={[0, 0, side * 0.15]}
                      material={chromeMat}
                    >
                      <boxGeometry args={[0.01, 0.2, 0.02]} />
                    </mesh>
                    <mesh
                      position={[0, 0.05, 0.2]}
                      rotation={[0, 0, -side * 0.15]}
                      material={chromeMat}
                    >
                      <boxGeometry args={[0.01, 0.2, 0.02]} />
                    </mesh>
                    {/* Gas lift piston (Amortisör) with safety stopper */}
                    <group position={[0, 0, 0]} rotation={[0.4, 0, 0]}>
                      {/* Cylinder */}
                      <mesh castShadow material={blackPlasticMat} position={[0, 0.05, 0]}>
                        <cylinderGeometry args={[0.014, 0.014, 0.22, 16]} />
                      </mesh>
                      {/* Chrome piston rod */}
                      <mesh castShadow material={chromeMat} position={[0, -0.07, 0]}>
                        <cylinderGeometry args={[0.007, 0.007, 0.16, 16]} />
                      </mesh>
                      {/* Red safety lock stopper */}
                      <mesh position={[0, 0.02, 0]} material={redAccentMat}>
                        <cylinderGeometry args={[0.018, 0.018, 0.025, 12]} />
                      </mesh>
                    </group>
                  </group>
                );
              })}
            </group>
          )}
        </group>
      )}

      {/* =========================================================================
          STEP 6: 4 FEET / LEGS (Steps 6 to 12)
          ========================================================================= */}
      {showLegs && (
        <group position={[0, 0, 0]}>
          {[
            [-W / 2 + 0.09, -L / 2 + 0.09],
            [W / 2 - 0.09, -L / 2 + 0.09],
            [-W / 2 + 0.09, L / 2 - 0.09],
            [W / 2 - 0.09, L / 2 - 0.09],
          ].map(([lx, lz], lidx) => {
            const legRise = step === 6 ? -(1 - p) * 0.25 : 0;
            return (
              <group key={`foot-${lidx}`} position={[lx, LEG_H / 2 + legRise, lz]}>
                {/* Triangular corner bracket foot base */}
                <mesh castShadow receiveShadow material={legFootMat}>
                  <cylinderGeometry args={[0.025, 0.018, LEG_H, 16]} />
                </mesh>
                {/* Triangular mounting flange */}
                <mesh position={[0, LEG_H / 2 - 0.005, 0]} material={steelMat}>
                  <boxGeometry args={[0.09, 0.01, 0.09]} />
                </mesh>
                {/* Screws (-14) */}
                <mesh position={[0.025, LEG_H / 2, 0.025]} material={chromeMat}>
                  <cylinderGeometry args={[0.003, 0.003, 0.015, 8]} />
                </mesh>
              </group>
            );
          })}
        </group>
      )}

      {/* =========================================================================
          STEP 11 & 12: MOUNTED SLATTED DECK ON SCISSOR MECHANISM (With Opening Action)
          ========================================================================= */}
      {showUpperFrameOnBed && (
        <group
          position={[0, baseTopY, -L / 2 + 0.08]}
          rotation={[currentLiftAngle, 0, 0]}
        >
          <group position={[0, 0, L / 2 - 0.08]}>
            {/* Step 11 descending animation */}
            {(() => {
              const deckDrop = step === 11 ? (1 - p) * 0.45 : 0;
              return (
                <group position={[0, deckDrop, 0]}>
                  {/* Metal rectangular perimeter frame */}
                  <mesh castShadow material={steelMat} position={[-W / 2 + 0.06, 0, 0]}>
                    <boxGeometry args={[0.035, 0.035, L - 0.12]} />
                  </mesh>
                  <mesh castShadow material={steelMat} position={[W / 2 - 0.06, 0, 0]}>
                    <boxGeometry args={[0.035, 0.035, L - 0.12]} />
                  </mesh>
                  <mesh castShadow material={steelMat} position={[0, 0, -L / 2 + 0.07]}>
                    <boxGeometry args={[W - 0.12, 0.035, 0.035]} />
                  </mesh>
                  <mesh castShadow material={steelMat} position={[0, 0, L / 2 - 0.07]}>
                    <boxGeometry args={[W - 0.12, 0.035, 0.035]} />
                  </mesh>
                  {/* Longitudinal center support rail */}
                  <mesh castShadow material={steelMat} position={[0, 0, 0]}>
                    <boxGeometry args={[0.035, 0.035, L - 0.12]} />
                  </mesh>

                  {/* 12 Curved Slats with Caps (L-1 & -9) */}
                  {showSlats &&
                    slatPositions.map((zPos, sidx) => (
                      <group key={`deck-slat-${sidx}`} position={[0, 0.02, zPos]}>
                        <mesh castShadow receiveShadow material={woodMat}>
                          <boxGeometry args={[W - 0.18, SLAT_T, SLAT_W]} />
                        </mesh>
                        <mesh position={[-W / 2 + 0.07, 0, 0]} material={redAccentMat}>
                          <boxGeometry args={[0.03, 0.02, SLAT_W + 0.01]} />
                        </mesh>
                        <mesh position={[W / 2 - 0.07, 0, 0]} material={redAccentMat}>
                          <boxGeometry args={[0.03, 0.02, SLAT_W + 0.01]} />
                        </mesh>
                      </group>
                    ))}

                  {/* 2 Pull Handles (-16) on the front rail */}
                  {[-0.32, 0.32].map((hz, hidx) => (
                    <group key={`deck-handle-${hidx}`} position={[0, 0.03, L / 2 - 0.08]}>
                      <mesh
                        castShadow
                        material={redAccentMat}
                        position={[hz, 0.04, 0.02]}
                        rotation={[-0.2, 0, 0]}
                      >
                        <boxGeometry args={[0.14, 0.07, 0.02]} />
                      </mesh>
                    </group>
                  ))}

                  {/* STEP 10: MATTRESS CORNER RETAINER LOOPS (-E1) */}
                  {showMattressHolders && (
                    <>
                      {/* Left and right wire loops on foot end */}
                      {[-W / 2 + 0.12, W / 2 - 0.12].map((ex, eidx) => {
                        const loopFly = step === 10 ? (1 - p) * 0.2 : 0;
                        return (
                          <group
                            key={`retainer-${eidx}`}
                            position={[ex, 0.06 + loopFly, L / 2 - 0.1]}
                          >
                            <mesh castShadow material={redAccentMat}>
                              <boxGeometry args={[0.08, 0.09, 0.008]} />
                            </mesh>
                          </group>
                        );
                      })}
                    </>
                  )}

                  {/* Step 11 connection bolts (-7) & nuts (-4) attaching to scissor arm */}
                  {step === 11 && (
                    <>
                      {[-W / 2 + 0.06, W / 2 - 0.06].map((bx, bidx) => (
                        <group key={`s11-bolt-${bidx}`} position={[bx, 0.04, 0]}>
                          <mesh material={brassBoltMat}>
                            <cylinderGeometry args={[0.007, 0.007, 0.05, 8]} />
                          </mesh>
                        </group>
                      ))}
                    </>
                  )}
                </group>
              );
            })()}
          </group>
        </group>
      )}

    </group>
  );
};
