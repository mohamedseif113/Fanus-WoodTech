"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  CabinetDimensions,
  WoodMaterial,
  DoorConfiguration,
  HandleStyle,
  LegStyle,
  FinishType,
} from "@/types/furniture";
import { getProceduralMaterial } from "./woodTextures";

interface Cabinet3DProps {
  dimensions: CabinetDimensions;
  shelfCount: number;
  material: WoodMaterial;
  doorType: DoorConfiguration;
  handleStyle: HandleStyle;
  legStyle: LegStyle;
  finish: FinishType;
  backPanel: boolean;
  explodedView: boolean;
  showDimensions?: boolean;
}

const T = 0.018; // 18mm panel thickness in meters
const BACK_T = 0.008; // 8mm back panel thickness
const LEG_HEIGHT = 0.15; // 15cm leg height

export const Cabinet3D: React.FC<Cabinet3DProps> = ({
  dimensions,
  shelfCount,
  material,
  doorType,
  handleStyle,
  legStyle,
  finish,
  backPanel,
  explodedView,
}) => {
  // Dimension in meters
  const W = dimensions.width / 100;
  const H = dimensions.height / 100;
  const D = dimensions.depth / 100;

  // Internal measurements
  const internalWidth = W - 2 * T;
  const internalHeight = H - 2 * T;
  const internalDepth = D - T;

  // Animated explode factor (0.0 = normal, 1.0 = fully exploded)
  const explodeFactor = useRef(0);

  // Panel group references for explosion animation
  const leftPanelRef = useRef<THREE.Group>(null);
  const rightPanelRef = useRef<THREE.Group>(null);
  const topPanelRef = useRef<THREE.Group>(null);
  const bottomPanelRef = useRef<THREE.Group>(null);
  const backPanelRef = useRef<THREE.Group>(null);
  const shelvesGroupRef = useRef<THREE.Group>(null);
  const doorsGroupRef = useRef<THREE.Group>(null);
  const legsGroupRef = useRef<THREE.Group>(null);

  // Materials
  const woodMaterial = useMemo(() => {
    return getProceduralMaterial(material, finish);
  }, [material, finish]);

  const hardwareMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: handleStyle === "round-knob" ? "#d4af37" : "#222222", // Brass or matte black
      metalness: 0.85,
      roughness: 0.25,
    });
  }, [handleStyle]);

  const legMaterial = useMemo(() => {
    if (legStyle === "wood-tapered") {
      return woodMaterial;
    }
    return new THREE.MeshStandardMaterial({
      color: "#1c1c1c",
      metalness: 0.7,
      roughness: 0.35,
    });
  }, [legStyle, woodMaterial]);

  // Dynamic shelf heights
  const shelfPositions = useMemo(() => {
    if (shelfCount <= 0) return [];
    const spacing = internalHeight / (shelfCount + 1);
    const positions: number[] = [];
    for (let i = 1; i <= shelfCount; i++) {
      positions.push(-internalHeight / 2 + i * spacing);
    }
    return positions;
  }, [shelfCount, internalHeight]);

  // Smooth frame loop for exploded view animation
  useFrame((_, delta) => {
    const target = explodedView ? 1 : 0;
    // Smooth damping
    explodeFactor.current = THREE.MathUtils.damp(explodeFactor.current, target, 5, delta);
    const ef = explodeFactor.current;

    const explodeDistX = 0.35 * ef;
    const explodeDistY = 0.35 * ef;
    const explodeDistZ = 0.40 * ef;

    if (leftPanelRef.current) {
      leftPanelRef.current.position.x = -W / 2 + T / 2 - explodeDistX;
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.position.x = W / 2 - T / 2 + explodeDistX;
    }
    if (topPanelRef.current) {
      topPanelRef.current.position.y = H / 2 - T / 2 + explodeDistY;
    }
    if (bottomPanelRef.current) {
      bottomPanelRef.current.position.y = -H / 2 + T / 2 - explodeDistY;
    }
    if (backPanelRef.current) {
      backPanelRef.current.position.z = -D / 2 + BACK_T / 2 - explodeDistZ;
    }
    if (doorsGroupRef.current) {
      doorsGroupRef.current.position.z = D / 2 + T / 2 + 0.005 + explodeDistZ * 1.2;
    }
    if (shelvesGroupRef.current) {
      shelvesGroupRef.current.position.z = explodeDistZ * 0.4;
    }
    if (legsGroupRef.current) {
      legsGroupRef.current.position.y = -H / 2 - (legStyle === "none" ? 0.01 : LEG_HEIGHT) / 2 - explodeDistY * 0.8;
    }
  });

  const cabinetCenterY = (H + (legStyle === "none" ? 0.02 : LEG_HEIGHT)) / 2;

  return (
    <group position={[0, cabinetCenterY, 0]}>
      {/* LEFT SIDE PANEL */}
      <group ref={leftPanelRef} position={[-W / 2 + T / 2, 0, 0]}>
        <mesh castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[T, H, D]} />
        </mesh>
      </group>

      {/* RIGHT SIDE PANEL */}
      <group ref={rightPanelRef} position={[W / 2 - T / 2, 0, 0]}>
        <mesh castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[T, H, D]} />
        </mesh>
      </group>

      {/* TOP PANEL */}
      <group ref={topPanelRef} position={[0, H / 2 - T / 2, 0]}>
        <mesh castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[internalWidth, T, D]} />
        </mesh>
      </group>

      {/* BOTTOM PANEL */}
      <group ref={bottomPanelRef} position={[0, -H / 2 + T / 2, 0]}>
        <mesh castShadow receiveShadow material={woodMaterial}>
          <boxGeometry args={[internalWidth, T, D]} />
        </mesh>
      </group>

      {/* BACK PANEL */}
      {backPanel && (
        <group ref={backPanelRef} position={[0, 0, -D / 2 + BACK_T / 2 + 0.004]}>
          <mesh castShadow receiveShadow material={woodMaterial}>
            <boxGeometry args={[internalWidth, internalHeight, BACK_T]} />
          </mesh>
        </group>
      )}

      {/* INTERNAL SHELVES */}
      <group ref={shelvesGroupRef} position={[0, 0, 0]}>
        {shelfPositions.map((yPos, idx) => (
          <mesh
            key={`shelf-${idx}`}
            position={[0, yPos, 0.005]}
            castShadow
            receiveShadow
            material={woodMaterial}
          >
            <boxGeometry args={[internalWidth - 0.002, T, internalDepth - 0.015]} />
          </mesh>
        ))}
      </group>

      {/* DOORS & HANDLES */}
      {doorType !== "none" && (
        <group ref={doorsGroupRef} position={[0, 0, D / 2 + T / 2 + 0.002]}>
          {/* TWO DOORS (FULL HEIGHT) */}
          {doorType === "two-doors" && (
            <>
              {/* Left Door */}
              <group position={[-W / 4 - 0.001, 0, 0]}>
                <mesh castShadow receiveShadow material={woodMaterial}>
                  <boxGeometry args={[W / 2 - 0.004, H - 0.006, T]} />
                </mesh>
                {/* Left Handle */}
                <Handle
                  style={handleStyle}
                  position={[W / 4 - 0.04, 0, T / 2 + 0.012]}
                  material={hardwareMaterial}
                />
              </group>

              {/* Right Door */}
              <group position={[W / 4 + 0.001, 0, 0]}>
                <mesh castShadow receiveShadow material={woodMaterial}>
                  <boxGeometry args={[W / 2 - 0.004, H - 0.006, T]} />
                </mesh>
                {/* Right Handle */}
                <Handle
                  style={handleStyle}
                  position={[-W / 4 + 0.04, 0, T / 2 + 0.012]}
                  material={hardwareMaterial}
                />
              </group>
            </>
          )}

          {/* FOUR DOORS (UPPER & LOWER) */}
          {doorType === "four-doors" && (
            <>
              {/* Upper Left */}
              <group position={[-W / 4 - 0.001, H / 4 + 0.002, 0]}>
                <mesh castShadow receiveShadow material={woodMaterial}>
                  <boxGeometry args={[W / 2 - 0.004, H / 2 - 0.006, T]} />
                </mesh>
                <Handle
                  style={handleStyle}
                  position={[W / 4 - 0.04, -H / 8 + 0.06, T / 2 + 0.012]}
                  material={hardwareMaterial}
                />
              </group>

              {/* Upper Right */}
              <group position={[W / 4 + 0.001, H / 4 + 0.002, 0]}>
                <mesh castShadow receiveShadow material={woodMaterial}>
                  <boxGeometry args={[W / 2 - 0.004, H / 2 - 0.006, T]} />
                </mesh>
                <Handle
                  style={handleStyle}
                  position={[-W / 4 + 0.04, -H / 8 + 0.06, T / 2 + 0.012]}
                  material={hardwareMaterial}
                />
              </group>

              {/* Lower Left */}
              <group position={[-W / 4 - 0.001, -H / 4 - 0.002, 0]}>
                <mesh castShadow receiveShadow material={woodMaterial}>
                  <boxGeometry args={[W / 2 - 0.004, H / 2 - 0.006, T]} />
                </mesh>
                <Handle
                  style={handleStyle}
                  position={[W / 4 - 0.04, H / 8 - 0.06, T / 2 + 0.012]}
                  material={hardwareMaterial}
                />
              </group>

              {/* Lower Right */}
              <group position={[W / 4 + 0.001, -H / 4 - 0.002, 0]}>
                <mesh castShadow receiveShadow material={woodMaterial}>
                  <boxGeometry args={[W / 2 - 0.004, H / 2 - 0.006, T]} />
                </mesh>
                <Handle
                  style={handleStyle}
                  position={[-W / 4 + 0.04, H / 8 - 0.06, T / 2 + 0.012]}
                  material={hardwareMaterial}
                />
              </group>
            </>
          )}

          {/* HALF DOORS (LOWER 45%) */}
          {doorType === "half-doors" && (
            <>
              {/* Lower Left */}
              <group position={[-W / 4 - 0.001, -H / 2 + (H * 0.45) / 2 + 0.002, 0]}>
                <mesh castShadow receiveShadow material={woodMaterial}>
                  <boxGeometry args={[W / 2 - 0.004, H * 0.45 - 0.004, T]} />
                </mesh>
                <Handle
                  style={handleStyle}
                  position={[W / 4 - 0.04, (H * 0.45) / 2 - 0.08, T / 2 + 0.012]}
                  material={hardwareMaterial}
                />
              </group>

              {/* Lower Right */}
              <group position={[W / 4 + 0.001, -H / 2 + (H * 0.45) / 2 + 0.002, 0]}>
                <mesh castShadow receiveShadow material={woodMaterial}>
                  <boxGeometry args={[W / 2 - 0.004, H * 0.45 - 0.004, T]} />
                </mesh>
                <Handle
                  style={handleStyle}
                  position={[-W / 4 + 0.04, (H * 0.45) / 2 - 0.08, T / 2 + 0.012]}
                  material={hardwareMaterial}
                />
              </group>
            </>
          )}
        </group>
      )}

      {/* LEGS / BASE */}
      <group
        ref={legsGroupRef}
        position={[0, -H / 2 - (legStyle === "none" ? 0.01 : LEG_HEIGHT) / 2, 0]}
      >
        {legStyle === "wood-tapered" && (
          <>
            {/* 4 Tapered Wood Legs with brass feet */}
            {[
              [-W / 2 + 0.08, -D / 2 + 0.06],
              [W / 2 - 0.08, -D / 2 + 0.06],
              [-W / 2 + 0.08, D / 2 - 0.06],
              [W / 2 - 0.08, D / 2 - 0.06],
            ].map(([x, z], i) => (
              <group key={`leg-${i}`} position={[x, 0, z]}>
                <mesh castShadow receiveShadow material={legMaterial}>
                  <cylinderGeometry args={[0.018, 0.012, LEG_HEIGHT, 16]} />
                </mesh>
                {/* Brass foot ferrule */}
                <mesh position={[0, -LEG_HEIGHT / 2 + 0.015, 0]} material={hardwareMaterial}>
                  <cylinderGeometry args={[0.013, 0.012, 0.03, 16]} />
                </mesh>
              </group>
            ))}
          </>
        )}

        {legStyle === "metal-plinth" && (
          <group position={[0, 0, 0]}>
            {/* Welded steel perimeter box frame */}
            <mesh castShadow receiveShadow material={legMaterial}>
              <boxGeometry args={[W - 0.08, LEG_HEIGHT, D - 0.08]} />
            </mesh>
          </group>
        )}

        {legStyle === "hairpin-black" && (
          <>
            {[
              [-W / 2 + 0.07, -D / 2 + 0.06],
              [W / 2 - 0.07, -D / 2 + 0.06],
              [-W / 2 + 0.07, D / 2 - 0.06],
              [W / 2 - 0.07, D / 2 - 0.06],
            ].map(([x, z], i) => (
              <group key={`hairpin-${i}`} position={[x, 0, z]}>
                <mesh castShadow material={legMaterial}>
                  <cylinderGeometry args={[0.005, 0.005, LEG_HEIGHT, 8]} />
                </mesh>
              </group>
            ))}
          </>
        )}

        {legStyle === "none" && (
          <>
            {/* Sleek low glides */}
            {[
              [-W / 2 + 0.05, -D / 2 + 0.05],
              [W / 2 - 0.05, -D / 2 + 0.05],
              [-W / 2 + 0.05, D / 2 - 0.05],
              [W / 2 - 0.05, D / 2 - 0.05],
            ].map(([x, z], i) => (
              <mesh key={`glide-${i}`} position={[x, 0, z]} material={hardwareMaterial}>
                <cylinderGeometry args={[0.02, 0.02, 0.015, 16]} />
              </mesh>
            ))}
          </>
        )}
      </group>
    </group>
  );
};

// Component helper for different door handle types
const Handle: React.FC<{
  style: HandleStyle;
  position: [number, number, number];
  material: THREE.Material;
}> = ({ style, position, material }) => {
  if (style === "none") return null;

  if (style === "round-knob") {
    return (
      <group position={position}>
        <mesh castShadow material={material} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.009, 0.022, 16]} />
        </mesh>
      </group>
    );
  }

  if (style === "edge-pull") {
    return (
      <group position={position}>
        <mesh castShadow material={material}>
          <boxGeometry args={[0.08, 0.012, 0.015]} />
        </mesh>
      </group>
    );
  }

  // minimal-bar (default)
  return (
    <group position={position}>
      {/* Main bar */}
      <mesh castShadow material={material}>
        <cylinderGeometry args={[0.006, 0.006, 0.14, 16]} />
      </mesh>
      {/* Upper stand-off */}
      <mesh position={[0, 0.045, -0.01]} material={material} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.02, 12]} />
      </mesh>
      {/* Lower stand-off */}
      <mesh position={[0, -0.045, -0.01]} material={material} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.02, 12]} />
      </mesh>
    </group>
  );
};
