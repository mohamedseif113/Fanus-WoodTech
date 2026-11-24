"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Cabinet3D } from "./Cabinet3D";
import { TVStand3D } from "./TVStand3D";
import { DimensionGuides } from "./DimensionGuides";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useTVStandStore } from "@/store/useTVStandStore";

interface CameraControllerProps {
  preset: string;
  isTVStand?: boolean;
}

const PRESET_COORDINATES_CABINET: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  perspective: { pos: [2.3, 1.5, 2.6], target: [0, 1.0, 0] },
  front: { pos: [0, 1.0, 3.2], target: [0, 1.0, 0] },
  side: { pos: [3.2, 1.0, 0], target: [0, 1.0, 0] },
  top: { pos: [0, 3.6, 0.05], target: [0, 1.0, 0] },
};

const PRESET_COORDINATES_TV: Record<string, { pos: [number, number, number]; target: [number, number, number] }> = {
  perspective: { pos: [2.2, 1.4, 2.7], target: [0, 0.65, 0] },
  front: { pos: [0, 0.7, 3.2], target: [0, 0.65, 0] },
  side: { pos: [3.2, 0.7, 0], target: [0, 0.65, 0] },
  top: { pos: [0, 3.8, 0.05], target: [0, 0.65, 0] },
};

function CameraController({ preset, isTVStand }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const coords = isTVStand ? PRESET_COORDINATES_TV : PRESET_COORDINATES_CABINET;
  const targetPos = useRef(new THREE.Vector3(...(coords[preset] || coords.perspective).pos));
  const targetLook = useRef(new THREE.Vector3(...(coords[preset] || coords.perspective).target));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const p = coords[preset] || coords.perspective;
    targetPos.current.set(...p.pos);
    targetLook.current.set(...p.target);
    isTransitioning.current = true;
  }, [preset, coords]);

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
      minDistance={1.1}
      maxDistance={6.5}
      minPolarAngle={Math.PI / 16}
      maxPolarAngle={Math.PI / 2 + 0.04}
      enableDamping
      dampingFactor={0.06}
      target={isTVStand ? [0, 0.65, 0] : [0, 1.0, 0]}
    />
  );
}

interface ConfiguratorCanvasProps {
  showDimensions?: boolean;
  activeModel?: "tv-stand" | "cabinet";
}

export const ConfiguratorCanvas: React.FC<ConfiguratorCanvasProps> = ({
  showDimensions = true,
  activeModel = "tv-stand",
}) => {
  const cabinetState = useConfiguratorStore();
  const tvState = useTVStandStore();

  const isTV = activeModel === "tv-stand";
  const preset = isTV ? tvState.cameraPreset : cabinetState.cameraPreset;
  const isExploded = isTV ? tvState.explodedView : cabinetState.explodedView;

  const tvTotalHeight =
    tvState.dimensions.height +
    (tvState.upperSection !== "none" ? tvState.dimensions.upperHeight : 0);

  return (
    <div className="w-full h-full relative select-none bg-gradient-to-b from-[#f9f7f4] via-[#f3efe8] to-[#e9e3d8]">
      <Canvas
        shadows
        camera={{ position: [2.2, 1.4, 2.7], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="canvas-3d-cursor"
      >
        <CameraController preset={preset} isTVStand={isTV} />

        {/* Studio Lighting */}
        <ambientLight intensity={0.68} />
        <directionalLight
          castShadow
          position={[4.5, 7.5, 3.5]}
          intensity={1.25}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={15}
          shadow-camera-left={-2.8}
          shadow-camera-right={2.8}
          shadow-camera-top={2.8}
          shadow-camera-bottom={-2.8}
          shadow-bias={-0.0001}
        />
        {/* Fill lights */}
        <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#e6effa" />
        <directionalLight position={[0, -2, 2]} intensity={0.15} color="#faf3e8" />

        {/* Model rendering */}
        {isTV ? (
          <TVStand3D
            width={tvState.dimensions.width}
            height={tvState.dimensions.height}
            depth={tvState.dimensions.depth}
            upperHeight={tvState.dimensions.upperHeight}
            upperSection={tvState.upperSection}
            upperDoors={tvState.upperDoors}
            openShelvesCount={tvState.openShelvesCount}
            sidePanels={tvState.sidePanels}
            backPanel={tvState.backPanel}
            tvNiche={tvState.tvNiche}
            material={tvState.material}
            finish={tvState.finish}
            handleStyle={tvState.handleStyle}
            legStyle={tvState.legStyle}
            explodedView={tvState.explodedView}
          />
        ) : (
          <Cabinet3D
            dimensions={cabinetState.dimensions}
            shelfCount={cabinetState.shelfCount}
            material={cabinetState.material}
            doorType={cabinetState.doorType}
            handleStyle={cabinetState.handleStyle}
            legStyle={cabinetState.legStyle}
            finish={cabinetState.finish}
            backPanel={cabinetState.backPanel}
            explodedView={cabinetState.explodedView}
          />
        )}

        {/* 3D Dimension Guides */}
        {!isExploded && showDimensions && (
          <DimensionGuides
            dimensions={
              isTV
                ? {
                    width: tvState.dimensions.width,
                    height: tvTotalHeight,
                    depth: tvState.dimensions.depth,
                  }
                : cabinetState.dimensions
            }
            visible={showDimensions}
          />
        )}

        {/* Ground Contact Shadows */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.42}
          scale={5.8}
          blur={1.8}
          far={3.0}
          resolution={512}
          color="#241b12"
        />

        {/* Circular studio platform */}
        <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.2, 64]} />
          <meshStandardMaterial color="#ede7db" roughness={0.9} metalness={0.05} />
        </mesh>
      </Canvas>
    </div>
  );
};
