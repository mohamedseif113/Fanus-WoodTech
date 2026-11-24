"use client";

import React from "react";
import { Text } from "@react-three/drei";
import { CabinetDimensions } from "@/types/furniture";

interface DimensionGuidesProps {
  dimensions: CabinetDimensions;
  legHeight?: number;
  visible?: boolean;
}

export const DimensionGuides: React.FC<DimensionGuidesProps> = ({
  dimensions,
  legHeight = 0.15,
  visible = true,
}) => {
  if (!visible) return null;

  const W = dimensions.width / 100;
  const H = dimensions.height / 100;
  const D = dimensions.depth / 100;

  const cabinetCenterY = (H + legHeight) / 2;
  const offset = 0.12; // distance from cabinet face

  return (
    <group position={[0, cabinetCenterY, 0]}>
      {/* WIDTH GUIDE (Top) */}
      <group position={[0, H / 2 + offset, D / 2]}>
        {/* Horizontal dimension line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[W, 0.003, 0.003]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Left end-cap */}
        <mesh position={[-W / 2, 0, 0]}>
          <boxGeometry args={[0.003, 0.04, 0.003]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Right end-cap */}
        <mesh position={[W / 2, 0, 0]}>
          <boxGeometry args={[0.003, 0.04, 0.003]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Label */}
        <Text
          position={[0, 0.045, 0]}
          fontSize={0.065}
          color="#1a1918"
          anchorX="center"
          anchorY="middle"
        >
          {`${dimensions.width} cm`}
        </Text>
      </group>

      {/* HEIGHT GUIDE (Right Side) */}
      <group position={[W / 2 + offset, 0, D / 2]}>
        {/* Vertical dimension line */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.003, H, 0.003]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Top end-cap */}
        <mesh position={[0, H / 2, 0]}>
          <boxGeometry args={[0.04, 0.003, 0.003]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Bottom end-cap */}
        <mesh position={[0, -H / 2, 0]}>
          <boxGeometry args={[0.04, 0.003, 0.003]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Label */}
        <Text
          position={[0.05, 0, 0]}
          fontSize={0.065}
          color="#1a1918"
          anchorX="left"
          anchorY="middle"
          rotation={[0, 0, -Math.PI / 2]}
        >
          {`${dimensions.height} cm`}
        </Text>
      </group>

      {/* DEPTH GUIDE (Floor right side) */}
      <group position={[W / 2 + offset, -H / 2, 0]}>
        {/* Depth line along Z */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.003, 0.003, D]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Front end-cap */}
        <mesh position={[0, 0, D / 2]}>
          <boxGeometry args={[0.04, 0.003, 0.003]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Back end-cap */}
        <mesh position={[0, 0, -D / 2]}>
          <boxGeometry args={[0.04, 0.003, 0.003]} />
          <meshBasicMaterial color="#b5814d" />
        </mesh>
        {/* Label */}
        <Text
          position={[0.05, 0, 0]}
          fontSize={0.055}
          color="#1a1918"
          anchorX="left"
          anchorY="middle"
          rotation={[0, -Math.PI / 2, 0]}
        >
          {`${dimensions.depth} cm`}
        </Text>
      </group>
    </group>
  );
};
