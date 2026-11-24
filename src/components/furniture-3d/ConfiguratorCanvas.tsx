"use client";

import React, { useRef, useEffect, Suspense } from "react";
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
 * Showroom Floor and Wall restored to original room dimensions and proportions:
 * Floor: 18x18 plane at y = -0.002
 * Back Wall: 18x8 plane at y = 4.0, z = -3.5
 */
function ShowroomEnvironment() {
  const [wallTex, floorTex] = useTexture([
    "/wall_b.webp",
    "/floor_z.webp",
  ]);

  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
  wallTex.repeat.set(16, 8);

  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(12, 12);

  return (
    <>
      {/* Floor - original 18x18 dimensions with warm wood parquet */}
      <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial
          map={floorTex}
          roughness={0.65}
          metalness={0.02}
        />
      </mesh>

      {/* Back Wall - original 18x8 dimensions at z = -3.5 with subtle ribbed texture */}
      <mesh position={[0, 4.0, -3.5]} receiveShadow>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial
          map={wallTex}
          roughness={0.92}
          metalness={0.01}
        />
      </mesh>
    </>
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
    <div className="w-full h-full relative select-none bg-[#ded7cb]">
      <Canvas
        shadows
        camera={{ position: [2.4, 1.45, 2.7], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="canvas-3d-cursor"
      >
        <CameraController is2D={is2D} isTVStand={isTV} />

        {/* Studio HDR environment lighting */}
        <Suspense fallback={null}>
          <Environment files="/studio.hdr" />
        </Suspense>

        {/* Directional light for subtle grounding shadows under the furniture */}
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
        {/* Fill lights */}
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

        {/* 1.80m Human Scale Figure with 180 cm label and no floor shadow */}
        {showHumanScale && !isExploded && (
          <Suspense fallback={null}>
            <HumanScaleFigure position={humanPosition} visible={true} />
          </Suspense>
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

        {/* Ground Contact Shadows for furniture */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.45}
          scale={7.0}
          blur={1.8}
          far={3.0}
          resolution={512}
          color="#221b14"
        />

        {/* Restored Showroom Floor & Wall */}
        <Suspense fallback={null}>
          <ShowroomEnvironment />
        </Suspense>
      </Canvas>
    </div>
  );
};
