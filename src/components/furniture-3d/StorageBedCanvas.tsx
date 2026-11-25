"use client";

/**
 * StorageBedCanvas.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dedicated Three.js canvas for the StorageBed3D preview.
 * Uses the same showroom environment, lighting and camera conventions
 * as ConfiguratorCanvas – no new dependencies introduced.
 *
 * Phase 1: Read-only static preview.
 * Phase 2: Will add interactive configurator panel.
 */

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { StorageBed3D, StorageBed3DProps } from "./StorageBed3D";

// ── Reuse the same showroom floor + wall as ConfiguratorCanvas ────────────────
function ShowroomEnvironment() {
  const [wallTex, floorTex] = useTexture(["/wall_b.webp", "/floor_z.webp"]);

  wallTex.wrapS  = wallTex.wrapT  = THREE.RepeatWrapping;
  wallTex.repeat.set(16, 8);
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.repeat.set(12, 12);

  return (
    <>
      <mesh position={[0, -0.002, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial map={floorTex} roughness={0.65} metalness={0.02} />
      </mesh>
      <mesh position={[0, 4.0, -4.5]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial map={wallTex} roughness={0.92} metalness={0.01} />
      </mesh>
    </>
  );
}

// ── Canvas component ──────────────────────────────────────────────────────────
interface StorageBedCanvasProps extends StorageBed3DProps {
  /** Camera starts in a 3/4 perspective view matching the bed's proportions */
  initialCameraPosition?: [number, number, number];
}

export const StorageBedCanvas: React.FC<StorageBedCanvasProps> = ({
  initialCameraPosition = [2.6, 1.6, 3.4],
  ...bedProps
}) => {
  return (
    <div className="w-full h-full relative select-none bg-[#ded7cb]">
      <Canvas
        shadows
        camera={{ position: initialCameraPosition, fov: 42 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="canvas-3d-cursor"
      >
        <OrbitControls
          makeDefault
          minDistance={1.5}
          maxDistance={8.0}
          minPolarAngle={Math.PI / 16}
          maxPolarAngle={Math.PI / 2 + 0.02}
          enableDamping
          dampingFactor={0.06}
          target={[0, 0.55, 0]}
        />

        {/* Studio HDR – same file as the main configurator */}
        <Suspense fallback={null}>
          <Environment files="/studio.hdr" />
        </Suspense>

        {/* Key light – matches ConfiguratorCanvas shadow settings */}
        <directionalLight
          castShadow
          position={[4.5, 7.5, 4.0]}
          intensity={1.1}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={18}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0001}
        />
        {/* Fill lights */}
        <directionalLight position={[-4, 3, 2]}  intensity={0.28} color="#edf4fc" />
        <directionalLight position={[0, -1, 3]}  intensity={0.14} color="#faf5ea" />

        {/* The bed model – centred, sitting on floor */}
        <Suspense fallback={null}>
          <StorageBed3D {...bedProps} />
        </Suspense>

        {/* Ground contact shadow for the bed */}
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.42}
          scale={8}
          blur={2.0}
          far={3.5}
          resolution={512}
          color="#221b14"
        />

        {/* Showroom floor + back wall */}
        <Suspense fallback={null}>
          <ShowroomEnvironment />
        </Suspense>
      </Canvas>
    </div>
  );
};
