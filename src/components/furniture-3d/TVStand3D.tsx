"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WoodMaterial, HandleStyle, LegStyle, FinishType } from "@/types/furniture";
import { TVDoorType, TVUpperType } from "@/store/useTVStandStore";
import { getProceduralMaterial } from "./woodTextures";

interface TVStand3DProps {
  width: number;        // cm
  height: number;       // cm – TV console base height
  depth: number;        // cm
  upperHeight: number;  // cm – upper cabinet section height
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
}

const T = 0.018; // 18mm structural panel thickness (meters)
const BACK_T = 0.008; // 8mm back panel
const GAP = 0.004; // subtle gap between panel joints

export const TVStand3D: React.FC<TVStand3DProps> = ({
  width,
  height,
  depth,
  upperHeight,
  upperSection,
  upperDoors,
  openShelvesCount,
  sidePanels,
  backPanel,
  tvNiche,
  material,
  finish,
  handleStyle,
  legStyle,
  explodedView,
}) => {
  // Convert cm → meters
  const W = width / 100;
  const H = height / 100;
  const D = depth / 100;
  const UH = upperHeight / 100;

  const hasUpper = upperSection !== "none";

  // ---- Materials ----
  const woodMat = useMemo(() => getProceduralMaterial(material, finish), [material, finish]);

  const glassMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#c8dde8",
    metalness: 0.0,
    roughness: 0.08,
    transmission: 0.78,
    thickness: 0.006,
    transparent: true,
    opacity: 0.38,
    side: THREE.DoubleSide,
  }), []);

  const hardwareMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: handleStyle === "round-knob" ? "#c5a84a" : "#1a1a1a",
    metalness: 0.88,
    roughness: 0.22,
  }), [handleStyle]);

  const legMat = useMemo(() => {
    if (legStyle === "wood-tapered") return woodMat;
    return new THREE.MeshStandardMaterial({ color: "#1c1c1c", metalness: 0.72, roughness: 0.32 });
  }, [legStyle, woodMat]);

  // ---- Explode animation ----
  const explodeFactor = useRef(0);
  const baseGroupRef = useRef<THREE.Group>(null);
  const upperGroupRef = useRef<THREE.Group>(null);
  const legsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const target = explodedView ? 1 : 0;
    explodeFactor.current = THREE.MathUtils.damp(explodeFactor.current, target, 5, delta);
    const ef = explodeFactor.current;

    if (baseGroupRef.current) {
      baseGroupRef.current.position.y = 0 - ef * 0.15;
    }
    if (upperGroupRef.current && hasUpper) {
      upperGroupRef.current.position.y = H + ef * 0.25;
    }
    if (legsRef.current) {
      legsRef.current.position.y = -ef * 0.18;
    }
  });

  // ---- Leg / base height ----
  const legH = legStyle === "none" ? 0.04 : legStyle === "metal-plinth" ? 0.08 : 0.12;
  const groundY = legH; // base console sits at this Y
  const totalBaseTop = groundY + H;

  // Internal dimensions of TV console base
  const iW = W - 2 * T;
  const iD = D - T;

  // ---- Shelf positions inside base ----
  const baseShelfPositions = useMemo(() => {
    // 1 internal divider shelf in TV console base
    return [0]; // center divider for AV equipment storage
  }, []);

  // ---- Upper section open shelf positions ----
  const upperShelfPositions = useMemo(() => {
    if (!hasUpper || openShelvesCount <= 0) return [];
    const spacing = (UH - 2 * T) / (openShelvesCount + 1);
    return Array.from({ length: openShelvesCount }, (_, i) => -(UH / 2 - T) + (i + 1) * spacing);
  }, [hasUpper, openShelvesCount, UH]);

  return (
    <group position={[0, 0, 0]}>
      {/* ===== LEGS / BASE FEET ===== */}
      <group ref={legsRef} position={[0, 0, 0]}>
        {legStyle === "none" && (
          /* Flush plinth base strip */
          <mesh position={[0, legH / 2, 0]} castShadow receiveShadow material={woodMat}>
            <boxGeometry args={[W - 0.04, legH, D - 0.04]} />
          </mesh>
        )}
        {legStyle === "wood-tapered" && (
          <>
            {([ [-W / 2 + 0.07, -D / 2 + 0.06], [W / 2 - 0.07, -D / 2 + 0.06],
                [-W / 2 + 0.07,  D / 2 - 0.06], [W / 2 - 0.07,  D / 2 - 0.06],
            ] as [number, number][]).map(([x, z], i) => (
              <group key={i} position={[x, legH / 2, z]}>
                <mesh castShadow receiveShadow material={legMat}>
                  <cylinderGeometry args={[0.016, 0.01, legH, 16]} />
                </mesh>
              </group>
            ))}
          </>
        )}
        {legStyle === "metal-plinth" && (
          <mesh position={[0, legH / 2, 0]} castShadow receiveShadow material={legMat}>
            <boxGeometry args={[W - 0.06, legH, D - 0.06]} />
          </mesh>
        )}
        {legStyle === "hairpin-black" && (
          <>
            {([ [-W / 2 + 0.07, -D / 2 + 0.06], [W / 2 - 0.07, -D / 2 + 0.06],
                [-W / 2 + 0.07,  D / 2 - 0.06], [W / 2 - 0.07,  D / 2 - 0.06],
            ] as [number, number][]).map(([x, z], i) => (
              <mesh key={i} position={[x, legH / 2, z]} castShadow material={legMat}>
                <cylinderGeometry args={[0.005, 0.005, legH, 8]} />
              </mesh>
            ))}
          </>
        )}
      </group>

      {/* ===== TV CONSOLE BASE ===== */}
      <group ref={baseGroupRef} position={[0, groundY, 0]}>
        {/* Left side panel */}
        <mesh position={[-W / 2 + T / 2, H / 2, 0]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[T, H, D]} />
        </mesh>
        {/* Right side panel */}
        <mesh position={[W / 2 - T / 2, H / 2, 0]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[T, H, D]} />
        </mesh>
        {/* Top panel */}
        <mesh position={[0, H - T / 2, 0]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[iW, T, D]} />
        </mesh>
        {/* Bottom panel */}
        <mesh position={[0, T / 2, 0]} castShadow receiveShadow material={woodMat}>
          <boxGeometry args={[iW, T, D]} />
        </mesh>
        {/* Back panel */}
        {backPanel && (
          <mesh position={[0, H / 2, -D / 2 + BACK_T / 2 + 0.004]} castShadow receiveShadow material={woodMat}>
            <boxGeometry args={[iW, H - 2 * T - GAP, BACK_T]} />
          </mesh>
        )}

        {/* Internal center divider shelf */}
        {baseShelfPositions.map((yOff, idx) => (
          <mesh key={`bshelf-${idx}`} position={[0, H / 2 + yOff, 0.004]} castShadow receiveShadow material={woodMat}>
            <boxGeometry args={[iW - 0.002, T, iD - 0.012]} />
          </mesh>
        ))}

        {/* TV Niche recess indicator (decorative back inset ledge) */}
        {tvNiche && (
          <mesh position={[0, H - T - 0.025, D / 2 - 0.015]} castShadow receiveShadow material={woodMat}>
            <boxGeometry args={[W * 0.5, 0.05, 0.03]} />
          </mesh>
        )}

        {/* Side decorative panels */}
        {sidePanels && (
          <>
            <mesh position={[-W / 2 - 0.005, H / 2, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[T, H + 0.01, D + 0.01]} />
            </mesh>
            <mesh position={[W / 2 + 0.005, H / 2, 0]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[T, H + 0.01, D + 0.01]} />
            </mesh>
          </>
        )}
      </group>

      {/* ===== UPPER SECTION ===== */}
      {hasUpper && (
        <group ref={upperGroupRef} position={[0, totalBaseTop, 0]}>
          {/* Upper carcass */}
          {/* Left side */}
          <mesh position={[-W / 2 + T / 2, UH / 2, 0]} castShadow receiveShadow material={woodMat}>
            <boxGeometry args={[T, UH, D]} />
          </mesh>
          {/* Right side */}
          <mesh position={[W / 2 - T / 2, UH / 2, 0]} castShadow receiveShadow material={woodMat}>
            <boxGeometry args={[T, UH, D]} />
          </mesh>
          {/* Top */}
          <mesh position={[0, UH - T / 2, 0]} castShadow receiveShadow material={woodMat}>
            <boxGeometry args={[iW, T, D]} />
          </mesh>
          {/* Bottom (rests on TV console top) */}
          <mesh position={[0, T / 2, 0]} castShadow receiveShadow material={woodMat}>
            <boxGeometry args={[iW, T, D]} />
          </mesh>
          {/* Back panel */}
          {backPanel && (
            <mesh position={[0, UH / 2, -D / 2 + BACK_T / 2 + 0.004]} castShadow receiveShadow material={woodMat}>
              <boxGeometry args={[iW, UH - 2 * T - GAP, BACK_T]} />
            </mesh>
          )}

          {/* Open shelves */}
          {(upperSection === "open-shelves" || upperSection === "mixed") &&
            upperShelfPositions.map((yPos, idx) => (
              <mesh key={`ushelf-${idx}`} position={[0, UH / 2 + yPos, 0.004]} castShadow receiveShadow material={woodMat}>
                <boxGeometry args={[iW - 0.002, T, iD - 0.012]} />
              </mesh>
            ))
          }

          {/* Cabinet section doors */}
          {(upperSection === "cabinets" || upperSection === "mixed") && upperDoors !== "none" && (
            <UpperDoors
              W={W}
              UH={UH}
              upperSection={upperSection}
              doorType={upperDoors}
              handleStyle={handleStyle}
              D={D}
              woodMat={woodMat}
              glassMat={glassMat}
              hardwareMat={hardwareMat}
              openShelvesCount={openShelvesCount}
              upperShelfPositions={upperShelfPositions}
            />
          )}
        </group>
      )}
    </group>
  );
};

// --- Upper door sub-component ---
interface UpperDoorsProps {
  W: number;
  UH: number;
  upperSection: TVUpperType;
  doorType: TVDoorType;
  handleStyle: HandleStyle;
  D: number;
  woodMat: THREE.Material;
  glassMat: THREE.Material;
  hardwareMat: THREE.Material;
  openShelvesCount: number;
  upperShelfPositions: number[];
}

const UpperDoors: React.FC<UpperDoorsProps> = ({
  W, UH, upperSection, doorType, handleStyle, D,
  woodMat, glassMat, hardwareMat,
}) => {
  const iW = W - 2 * T;

  // For "mixed" layout: doors only cover the upper 55% (cabinets), lower 45% is open shelves
  const doorH = upperSection === "mixed" ? UH * 0.55 : UH - 2 * T - 0.004;
  const doorY = upperSection === "mixed" ? UH - doorH / 2 - T : UH / 2;

  const doorMat = doorType === "glass" ? glassMat : woodMat;
  const doorZ = D / 2 + T / 2 + 0.002;

  // Two doors side by side
  const halfW = iW / 2 - 0.002;

  return (
    <group position={[0, 0, 0]}>
      {/* Left door */}
      <group position={[-halfW / 2 - 0.001, doorY, doorZ]}>
        <mesh castShadow receiveShadow material={doorMat}>
          <boxGeometry args={[halfW, doorH, T]} />
        </mesh>
        {handleStyle !== "none" && (
          <TVHandle
            style={handleStyle}
            position={[halfW / 2 - 0.04, 0, T / 2 + 0.012]}
            material={hardwareMat}
          />
        )}
      </group>

      {/* Right door */}
      <group position={[halfW / 2 + 0.001, doorY, doorZ]}>
        <mesh castShadow receiveShadow material={doorMat}>
          <boxGeometry args={[halfW, doorH, T]} />
        </mesh>
        {handleStyle !== "none" && (
          <TVHandle
            style={handleStyle}
            position={[-halfW / 2 + 0.04, 0, T / 2 + 0.012]}
            material={hardwareMat}
          />
        )}
      </group>
    </group>
  );
};

// --- Handle sub-component ---
const TVHandle: React.FC<{ style: HandleStyle; position: [number, number, number]; material: THREE.Material }> = ({
  style, position, material,
}) => {
  if (style === "none") return null;

  if (style === "round-knob") {
    return (
      <group position={position}>
        <mesh castShadow material={material} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.013, 0.009, 0.020, 16]} />
        </mesh>
      </group>
    );
  }

  if (style === "edge-pull") {
    return (
      <group position={position}>
        <mesh castShadow material={material}>
          <boxGeometry args={[0.07, 0.011, 0.014]} />
        </mesh>
      </group>
    );
  }

  // minimal-bar (default)
  return (
    <group position={position}>
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.005, 0.005, 0.12, 16]} />
      </mesh>
      <mesh position={[0, 0.038, -0.009]} material={material} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.018, 12]} />
      </mesh>
      <mesh position={[0, -0.038, -0.009]} material={material} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.018, 12]} />
      </mesh>
    </group>
  );
};
