"use client";

/**
 * StorageBedCanvas.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Three.js Canvas for StorageBed3D assembly video & interactive viewer.
 * Provides camera tracking per step and full orbit controls.
 */

import React, { useRef, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, useTexture } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { StorageBed3D, StorageBed3DProps } from "./StorageBed3D";
import { ASSEMBLY_STEPS } from "@/lib/constants/assemblySteps";

function CameraStepController({
  step,
  resetTrigger,
}: {
  step: number;
  resetTrigger?: number;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const targetPos = useRef(new THREE.Vector3(2.5, 1.4, 2.8));
  const targetLook = useRef(new THREE.Vector3(0, 0.45, 0));
  const isTransitioning = useRef(false);

  useEffect(() => {
    const stepConfig = ASSEMBLY_STEPS.find((s) => s.step === step);
    if (stepConfig) {
      targetPos.current.set(...stepConfig.camera.position);
      targetLook.current.set(...stepConfig.camera.target);
      isTransitioning.current = true;
    }
  }, [step]);

  useEffect(() => {
    if (resetTrigger && resetTrigger > 0) {
      targetPos.current.set(2.5, 1.4, 2.8);
      targetLook.current.set(0, 0.45, 0);
      isTransitioning.current = true;
    }
  }, [resetTrigger]);

  useFrame((_, delta) => {
    if (isTransitioning.current && controlsRef.current) {
      camera.position.lerp(targetPos.current, 3.5 * delta);
      controlsRef.current.target.lerp(targetLook.current, 3.5 * delta);
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPos.current) < 0.03) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      minDistance={1.0}
      maxDistance={7.5}
      minPolarAngle={Math.PI / 16}
      maxPolarAngle={Math.PI / 2 + 0.02}
      enableDamping
      dampingFactor={0.06}
      target={[0, 0.45, 0]}
    />
  );
}

function ShowroomEnvironment() {
  const [wallTex, floorTex] = useTexture(["/wall_b.webp", "/floor_z.webp"]);

  wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
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

interface StorageBedCanvasProps extends StorageBed3DProps {
  assemblyStep?: number;
  resetCameraTrigger?: number;
}

export const StorageBedCanvas: React.FC<StorageBedCanvasProps> = ({
  assemblyStep = 12,
  resetCameraTrigger = 0,
  ...bedProps
}) => {
  return (
    <div className="w-full h-full relative select-none bg-[#ded7cb]">
      <Canvas
        shadows
        camera={{ position: [2.5, 1.4, 2.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="canvas-3d-cursor"
      >
        <CameraStepController step={assemblyStep} resetTrigger={resetCameraTrigger} />

        <Suspense fallback={null}>
          <Environment files="/studio.hdr" />
        </Suspense>

        <directionalLight
          castShadow
          position={[4.5, 7.5, 4.0]}
          intensity={1.15}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.5}
          shadow-camera-far={18}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-4, 3, 2]} intensity={0.32} color="#edf4fc" />
        <directionalLight position={[0, -1, 3]} intensity={0.16} color="#faf5ea" />

        <Suspense fallback={null}>
          <StorageBed3D assemblyStep={assemblyStep} {...bedProps} />
        </Suspense>

        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.42}
          scale={8}
          blur={2.0}
          far={3.5}
          resolution={512}
          color="#221b14"
        />

        <Suspense fallback={null}>
          <ShowroomEnvironment />
        </Suspense>
      </Canvas>
    </div>
  );
};
