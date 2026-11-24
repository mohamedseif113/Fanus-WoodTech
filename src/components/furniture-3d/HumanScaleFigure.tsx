"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

interface HumanScaleFigureProps {
  position?: [number, number, number];
  visible?: boolean;
}

/**
 * A stylized 1.80m tall scale figure matching the Woodcoder reference,
 * providing real-world architectural proportions alongside furniture.
 */
export const HumanScaleFigure: React.FC<HumanScaleFigureProps> = ({
  position = [-1.4, 0, 0.2],
  visible = true,
}) => {
  // Materials matching the reference screenshot:
  // Turquoise overalls (#4aa89c), light skin/shirt, dark shoes
  const turquoiseMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#3ba89c", roughness: 0.6 }),
    []
  );
  const skinMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#dcb293", roughness: 0.7 }),
    []
  );
  const shirtMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#6fc2b4", roughness: 0.6 }),
    []
  );
  const shoesMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#475569", roughness: 0.8 }),
    []
  );
  const hairMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#6d4c41", roughness: 0.8 }),
    []
  );

  if (!visible) return null;

  return (
    <group position={position}>
      {/* 1.80 m Floating Label */}
      <group position={[0, 1.95, 0]}>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[0.36, 0.12]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
        <Text
          fontSize={0.07}
          color="#0f766e"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          1.80 m
        </Text>
      </group>

      {/* Head */}
      <mesh position={[0, 1.68, 0]} castShadow material={skinMat}>
        <sphereGeometry args={[0.11, 24, 24]} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 1.73, -0.02]} material={hairMat}>
        <sphereGeometry args={[0.115, 20, 16]} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.55, 0]} castShadow material={skinMat}>
        <cylinderGeometry args={[0.05, 0.055, 0.08, 16]} />
      </mesh>

      {/* Upper Torso (Shirt) */}
      <mesh position={[0, 1.38, 0]} castShadow material={shirtMat}>
        <boxGeometry args={[0.34, 0.28, 0.18]} />
      </mesh>

      {/* Overalls / Body */}
      <mesh position={[0, 1.15, 0]} castShadow material={turquoiseMat}>
        <boxGeometry args={[0.32, 0.35, 0.19]} />
      </mesh>

      {/* Left Arm */}
      <group position={[-0.22, 1.45, 0]}>
        {/* Shoulder & Bicep */}
        <mesh position={[0, -0.16, 0]} castShadow material={shirtMat}>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 12]} />
        </mesh>
        {/* Forearm */}
        <mesh position={[0, -0.42, 0]} castShadow material={skinMat}>
          <cylinderGeometry args={[0.038, 0.032, 0.26, 12]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group position={[0.22, 1.45, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow material={shirtMat}>
          <cylinderGeometry args={[0.045, 0.04, 0.28, 12]} />
        </mesh>
        <mesh position={[0, -0.42, 0]} castShadow material={skinMat}>
          <cylinderGeometry args={[0.038, 0.032, 0.26, 12]} />
        </mesh>
      </group>

      {/* Legs (Overalls pants) */}
      {/* Left Leg */}
      <mesh position={[-0.09, 0.52, 0]} castShadow material={turquoiseMat}>
        <cylinderGeometry args={[0.075, 0.065, 0.92, 16]} />
      </mesh>
      {/* Right Leg */}
      <mesh position={[0.09, 0.52, 0]} castShadow material={turquoiseMat}>
        <cylinderGeometry args={[0.075, 0.065, 0.92, 16]} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.09, 0.03, 0.03]} castShadow material={shoesMat}>
        <boxGeometry args={[0.11, 0.06, 0.22]} />
      </mesh>
      <mesh position={[0.09, 0.03, 0.03]} castShadow material={shoesMat}>
        <boxGeometry args={[0.11, 0.06, 0.22]} />
      </mesh>
    </group>
  );
};
