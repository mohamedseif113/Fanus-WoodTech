"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { useGLTF, Text, Billboard } from "@react-three/drei";

interface HumanScaleFigureProps {
  position?: [number, number, number];
  visible?: boolean;
}

export const HumanScaleFigure: React.FC<HumanScaleFigureProps> = ({
  position = [-1.4, 0, 0.2],
  visible = true,
}) => {
  const { scene } = useGLTF("/woodman2.glb");

  // Clone scene and completely disable shadow casting to remove any floor shadow projection
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
    return clone;
  }, [scene]);

  if (!visible) return null;

  return (
    <group position={position}>
      {/* Height Label in centimeters directly above the character */}
      <Billboard position={[0, 1.88, 0]} follow={true}>
        <mesh position={[0, 0, -0.005]}>
          <planeGeometry args={[0.34, 0.11]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        <Text
          fontSize={0.065}
          color="#0f766e"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          180 cm
        </Text>
      </Billboard>

      {/* 3D Human Scale Model (Woodcoder woodman2) - natural lighting without floor shadow */}
      <primitive
        object={clonedScene}
        scale={[0.95, 0.95, 0.95]}
        castShadow={false}
      />
    </group>
  );
};

useGLTF.preload("/woodman2.glb");
