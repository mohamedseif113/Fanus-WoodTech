"use client";

import React from "react";
import { useGLTF } from "@react-three/drei";

interface HumanScaleFigureProps {
  position?: [number, number, number];
  visible?: boolean;
}

export const HumanScaleFigure: React.FC<HumanScaleFigureProps> = ({
  position = [-1.4, 0, 0.2],
  visible = true,
}) => {
  const { scene } = useGLTF("/woodman2.glb");

  if (!visible) return null;

  return (
    <group position={position}>
      <primitive
        object={scene.clone(true)}
        scale={[0.95, 0.95, 0.95]}
        castShadow
      />
    </group>
  );
};

useGLTF.preload("/woodman2.glb");
