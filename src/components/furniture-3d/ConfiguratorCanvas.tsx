"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, useTexture } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { Cabinet3D } from "./Cabinet3D";
import { TVStand3D } from "./TVStand3D";
import { DimensionGuides } from "./DimensionGuides";
import { HumanScaleFigure } from "./HumanScaleFigure";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useTVStandStore } from "@/store/useTVStandStore";

interface CameraControllerProps {
  is2D: boolean;
  isTVStand: boolean;
}

function CameraController({ is2D, isTVStand }: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetPos = useRef(new THREE.Vector3(0, 0.75, 2.9));
  const targetLook = useRef(new THREE.Vector3(0, isTVStand ? 0.65 : 0.95, 0));
  const isTransitioning = useRef(false);

  useEffect(() => {
    if (is2D) {
      // Straight front elevation
      targetPos.current.set(0, isTVStand ? 0.65 : 0.95, 3.4);
      targetLook.current.set(0, isTVStand ? 0.65 : 0.95, 0);
    } else {
      // Perspective showroom view
      targetPos.current.set(2.4, 1.45, 2.7);
      targetLook.current.set(0, isTVStand ? 0.65 : 0.95, 0);
    }
    isTransitioning.current = true;
  }, [is2D, isTVStand]);

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
      enableRotate={!is2D}
      minDistance={1.2}
      maxDistance={6.8}
      minPolarAngle={Math.PI / 16}
      maxPolarAngle={Math.PI / 2 + 0.02}
      enableDamping
      dampingFactor={0.06}
      target={[0, isTVStand ? 0.65 : 0.95, 0]}
    />
  );
}

/**
 * Woodcoder-matching showroom: BoxGeometry room with real wood floor
 * and ribbed wall textures, plus studio HDR environment lighting.
 * Face order for BoxGeometry material array:
 *   [+x right, -x left, +y top(ceiling), -y bottom(floor), +z front, -z back]
 * Woodcoder mapping: [wall_a, wall_a, wall_b, floor_z, wall_b, wall_b]
 */
function ShowroomEnvironment() {
  const [wallTexA, wallTexB, floorTex] = useTexture([
    "/wall_a.webp",
    "/wall_b.webp",
    "/floor_z.webp",
  ]);

  // Configure repeat and wrapping
  [wallTexA, wallTexB].forEach((tex) => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(50, 50);
  });
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(20, 20);

  // Room box: 40×15×40 Three.js units, viewed from inside (BackSide)
  // Positioned so floor (bottom face, y=-7.5 in local space) sits at world y=0
  return (
    <mesh position={[0, 7.5, 0]} receiveShadow>
      <boxGeometry args={[40, 15, 40]} />
      {/* +x right wall  → wall_a */}
      <meshStandardMaterial attach="material-0" map={wallTexA} side={THREE.BackSide} roughness={0.9} metalness={0} />
      {/* -x left wall   → wall_a */}
      <meshStandardMaterial attach="material-1" map={wallTexA} side={THREE.BackSide} roughness={0.9} metalness={0} />
      {/* +y ceiling      → wall_b */}
      <meshStandardMaterial attach="material-2" map={wallTexB} side={THREE.BackSide} roughness={0.9} metalness={0} />
      {/* -y floor        → floor_z */}
      <meshStandardMaterial attach="material-3" map={floorTex} side={THREE.BackSide} roughness={0.6} metalness={0.02} />
      {/* +z front wall   → wall_b */}
      <meshStandardMaterial attach="material-4" map={wallTexB} side={THREE.BackSide} roughness={0.9} metalness={0} />
      {/* -z back wall    → wall_b */}
      <meshStandardMaterial attach="material-5" map={wallTexB} side={THREE.BackSide} roughness={0.9} metalness={0} />
    </mesh>
  );
}

interface ConfiguratorCanvasProps {
  showDimensions?: boolean;
  activeModel?: "tv-stand" | "cabinet";
  is2D?: boolean;
  showHumanScale?: boolean;
}

export const ConfiguratorCanvas: React.FC<ConfiguratorCanvasProps> = ({
  showDimensions = false,
  activeModel = "tv-stand",
  is2D = false,
  showHumanScale = true,
}) => {
  const cabinetState = useConfiguratorStore();
  const tvState = useTVStandStore();

  const isTV = activeModel === "tv-stand";
  const isExploded = isTV ? tvState.explodedView : cabinetState.explodedView;

  const currentW = isTV ? tvState.dimensions.width / 100 : cabinetState.dimensions.width / 100;
  const humanPosition: [number, number, number] = [-currentW / 2 - 0.52, 0, 0.0];

  const tvTotalHeight =
    tvState.dimensions.height +
    (tvState.upperSection !== "none" ? tvState.dimensions.upperHeight : 0);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        camera={{ position: [2.4, 1.45, 2.7], fov: 45, far: 100 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        className="canvas-3d-cursor"
      >
        <CameraController is2D={is2D} isTVStand={isTV} />

        {/* Studio HDR environment lighting — matches Woodcoder studio.hdr */}
        <Environment files="/studio.hdr" />

        {/* Key directional light for shadow casting (Environment alone doesn't cast shadows) */}
        <directionalLight
          castShadow
          position={[4.5, 7.5, 4.0]}
          intensity={1.1}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={16}
          shadow-camera-left={-3.2}
          shadow-camera-right={3.2}
          shadow-camera-top={3.2}
          shadow-camera-bottom={-3.2}
          shadow-bias={-0.0001}
        />
        {/* Soft fill lights */}
        <directionalLight position={[-4, 3, 2]} intensity={0.28} color="#edf4fc" />
        <directionalLight position={[0, -1, 3]} intensity={0.14} color="#faf5ea" />

        {/* 3D Furniture Models */}
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

        {/* 1.80m Human Scale Figure — real Woodcoder woodman2.glb */}
        {showHumanScale && !isExploded && (
          <HumanScaleFigure position={humanPosition} visible={true} />
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
          opacity={0.45}
          scale={7.0}
          blur={1.8}
          far={3.0}
          resolution={512}
          color="#221b14"
        />

        {/* Woodcoder-matching showroom: textured box room */}
        <ShowroomEnvironment />
      </Canvas>
    </div>
  );
};
