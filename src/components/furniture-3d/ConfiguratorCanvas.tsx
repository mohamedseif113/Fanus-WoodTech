"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Cabinet3D } from "./Cabinet3D";
import { DimensionGuides } from "./DimensionGuides";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";

interface CameraControllerProps {
  preset: string;
}

const PRESET_COORDINATES: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  perspective: { pos: [2.3, 1.5, 2.6], target: [0, 1.0, 0] },
  front: { pos: [0, 1.0, 3.2], target: [0, 1.0, 0] },
  side: { pos: [3.2, 1.0, 0], target: [0, 1.0, 0] },
  top: { pos: [0, 3.6, 0.05], target: [0, 1.0, 0] },
};

function CameraController({ preset }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const targetPos = useRef(new THREE.Vector3(...PRESET_COORDINATES.perspective.pos));
  const targetLook = useRef(new THREE.Vector3(...PRESET_COORDINATES.perspective.target));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const p = PRESET_COORDINATES[preset] || PRESET_COORDINATES.perspective;
    targetPos.current.set(...p.pos);
    targetLook.current.set(...p.target);
    isTransitioning.current = true;
  }, [preset]);

  useFrame((_, delta) => {
    if (isTransitioning.current && controlsRef.current) {
      camera.position.lerp(targetPos.current, 4 * delta);
      controlsRef.current.target.lerp(targetLook.current, 4 * delta);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPos.current) < 0.02) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={1.2}
      maxDistance={6.0}
      minPolarAngle={Math.PI / 12}
      maxPolarAngle={Math.PI / 2 + 0.05} // don't go below floor
      enableDamping
      dampingFactor={0.06}
      target={[0, 1.0, 0]}
    />
  );
}

interface ConfiguratorCanvasProps {
  showDimensions?: boolean;
}

export const ConfiguratorCanvas: React.FC<ConfiguratorCanvasProps> = ({
  showDimensions = true,
}) => {
  const {
    dimensions,
    shelfCount,
    material,
    doorType,
    handleStyle,
    legStyle,
    finish,
    backPanel,
    explodedView,
    cameraPreset,
  } = useConfiguratorStore();

  return (
    <div className="w-full h-full relative select-none bg-gradient-to-b from-[#f9f7f4] via-[#f3efe8] to-[#e9e3d8]">
      <Canvas
        shadows
        camera={{ position: [2.3, 1.5, 2.6], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="canvas-3d-cursor"
      >
        <CameraController preset={cameraPreset} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.65} />
        <directionalLight
          castShadow
          position={[4, 7, 3]}
          intensity={1.2}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={15}
          shadow-camera-left={-2.5}
          shadow-camera-right={2.5}
          shadow-camera-top={2.5}
          shadow-camera-bottom={-2.5}
          shadow-bias={-0.0001}
        />
        {/* Soft fill light from left */}
        <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#e6effa" />
        {/* Warm under-fill */}
        <directionalLight position={[0, -2, 2]} intensity={0.15} color="#faf3e8" />

        {/* 3D Cabinet Model */}
        <Cabinet3D
          dimensions={dimensions}
          shelfCount={shelfCount}
          material={material}
          doorType={doorType}
          handleStyle={handleStyle}
          legStyle={legStyle}
          finish={finish}
          backPanel={backPanel}
          explodedView={explodedView}
        />

        {/* 3D Dimension Guides */}
        {!explodedView && showDimensions && (
          <DimensionGuides dimensions={dimensions} visible={showDimensions} />
        )}

        {/* Realistic Ground Contact Shadows */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.4}
          scale={5.5}
          blur={1.8}
          far={3.0}
          resolution={512}
          color="#241b12"
        />

        {/* Subtle ground circular platform */}
        <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[2.8, 64]} />
          <meshStandardMaterial
            color="#ede7db"
            roughness={0.9}
            metalness={0.05}
          />
        </mesh>
      </Canvas>
    </div>
  );
};
