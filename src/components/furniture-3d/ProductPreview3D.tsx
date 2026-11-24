"use client";

import React, { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
  CabinetDimensions,
  WoodMaterial,
  DoorConfiguration,
  FinishType,
} from "@/types/furniture";
import { Cabinet3D } from "./Cabinet3D";
import { TVStand3D } from "./TVStand3D";
import { RotateCcw } from "lucide-react";

interface ProductPreview3DProps {
  dimensions: CabinetDimensions;
  material: WoodMaterial;
  shelfCount: number;
  doorType: DoorConfiguration;
  finish: FinishType;
  isTV?: boolean;
}

export const ProductPreview3D: React.FC<ProductPreview3DProps> = ({
  dimensions,
  material,
  shelfCount,
  doorType,
  finish,
  isTV = false,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const targetY = (dimensions.height / 100) * 0.45;

  return (
    <div className="w-full h-full min-h-[420px] relative select-none rounded-2xl overflow-hidden bg-gradient-to-b from-[#f9f7f4] via-[#f3efe8] to-[#e9e3d8]">
      <Canvas
        shadows
        camera={{ position: [1.8, 1.35, 2.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="canvas-3d-cursor"
      >
        <OrbitControls
          ref={controlsRef}
          makeDefault
          minDistance={0.9}
          maxDistance={4.5}
          minPolarAngle={Math.PI / 16}
          maxPolarAngle={Math.PI / 2 + 0.04}
          enableDamping
          dampingFactor={0.06}
          target={[0, targetY, 0]}
        />

        {/* Studio Lighting */}
        <ambientLight intensity={0.7} color="#ffffff" />
        <directionalLight
          castShadow
          position={[3.5, 6.0, 3.0]}
          intensity={1.2}
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-3, 2, 2]} intensity={0.3} color="#edf4fc" />
        <directionalLight position={[0, -1, 2]} intensity={0.15} color="#faf5ea" />

        <Suspense fallback={null}>
          <Environment files="/studio.hdr" />
        </Suspense>

        {/* 3D Furniture Model */}
        {isTV ? (
          <TVStand3D
            width={dimensions.width}
            height={dimensions.height}
            depth={dimensions.depth}
            upperHeight={60}
            upperSection="open-shelves"
            upperDoors="none"
            openShelvesCount={3}
            sidePanels={true}
            backPanel={true}
            tvNiche={true}
            material={material}
            finish={finish}
            handleStyle="minimal-bar"
            legStyle="metal-plinth"
            explodedView={false}
          />
        ) : (
          <Cabinet3D
            dimensions={dimensions}
            shelfCount={shelfCount}
            material={material}
            doorType={doorType}
            handleStyle="none"
            legStyle="metal-plinth"
            finish={finish}
            backPanel={true}
            explodedView={false}
          />
        )}

        {/* Soft contact shadows under the furniture */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.42}
          scale={5.0}
          blur={1.6}
          far={2.5}
          resolution={512}
          color="#221b14"
        />
      </Canvas>

      {/* Floating 360 Hint and Reset Control */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold text-stone-700 border border-stone-200/80 shadow-sm pointer-events-none flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>360° Etkileşimli 3D Model</span>
      </div>

      <button
        onClick={resetCamera}
        className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white text-stone-700 hover:text-stone-900 rounded-xl border border-stone-200 shadow-sm transition-all active:scale-95"
        title="Görünümü Sıfırla"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
};
