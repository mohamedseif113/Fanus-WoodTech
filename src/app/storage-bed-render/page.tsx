"use client";

/**
 * /storage-bed-render
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time 1920x1080 30 FPS GPU Recording & Frame Capture Page.
 * Renders the 3D storage bed and composites 1080p instructional graphics.
 */

import React, { useState, useEffect, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { StorageBed3D } from "@/components/furniture-3d/StorageBed3D";
import { ASSEMBLY_STEPS } from "@/lib/constants/assemblySteps";

declare global {
  interface Window {
    renderAssemblyFrame?: (
      step: number,
      progress: number,
      openRatio: number,
      camRotY?: number,
      expRatio?: number
    ) => void;
    startAutomatedRecording?: () => Promise<string>;
    isRenderReady?: boolean;
  }
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
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial map={floorTex} roughness={0.65} metalness={0.02} />
      </mesh>
      <mesh position={[0, 4.0, -4.5]} receiveShadow>
        <planeGeometry args={[22, 10]} />
        <meshStandardMaterial map={wallTex} roughness={0.92} metalness={0.01} />
      </mesh>
    </>
  );
}

function RenderCameraController({
  step,
  camRotY = 0,
}: {
  step: number;
  camRotY: number;
}) {
  const { camera } = useThree();
  const stepConfig = ASSEMBLY_STEPS.find((s) => s.step === step) || ASSEMBLY_STEPS[11];

  useFrame(() => {
    const basePos = stepConfig.camera.position;
    const target = stepConfig.camera.target;

    const dx = basePos[0] - target[0];
    const dz = basePos[2] - target[2];
    const radius = Math.sqrt(dx * dx + dz * dz);
    const baseAngle = Math.atan2(dx, dz);
    const currentAngle = baseAngle + camRotY;

    camera.position.set(
      target[0] + radius * Math.sin(currentAngle),
      basePos[1],
      target[2] + radius * Math.cos(currentAngle)
    );
    camera.lookAt(target[0], target[1], target[2]);
  });

  return null;
}

export default function StorageBedRenderPage() {
  const [step, setStep] = useState<number>(1);
  const [progress, setProgress] = useState<number>(1.0);
  const [openRatio, setOpenRatio] = useState<number>(0.0);
  const [camRotY, setCamRotY] = useState<number>(0.0);
  const [expRatio, setExpRatio] = useState<number>(0.0);

  useEffect(() => {
    window.renderAssemblyFrame = (s, p, open, rot = 0, exp = 0) => {
      setStep(s === 0 ? 1 : s === 13 ? 12 : s);
      setProgress(p);
      setOpenRatio(open);
      setCamRotY(rot);
      setExpRatio(exp);
    };

    window.startAutomatedRecording = () => {
      return new Promise<string>((resolve, reject) => {
        try {
          const webglCanvas = document.querySelector("#render-root canvas") as HTMLCanvasElement;
          if (!webglCanvas) {
            reject(new Error("Canvas not found"));
            return;
          }

          const compCanvas = document.createElement("canvas");
          compCanvas.width = 1920;
          compCanvas.height = 1080;
          const ctx = compCanvas.getContext("2d");
          if (!ctx) {
            reject(new Error("2D context not available"));
            return;
          }

          const stream = compCanvas.captureStream(30);
          const recorder = new MediaRecorder(stream, {
            mimeType: "video/webm;codecs=vp9",
            videoBitsPerSecond: 18000000,
          });

          const chunks: Blob[] = [];
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
          };

          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: "video/webm" });
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.readAsDataURL(blob);
          };

          recorder.start(100);

          const fps = 30;
          const totalFrames = 780; // 26 seconds @ 30 FPS
          let frame = 0;

          const renderInterval = setInterval(() => {
            if (frame >= totalFrames) {
              clearInterval(renderInterval);
              setTimeout(() => recorder.stop(), 400);
              return;
            }

            const timeSec = frame / fps;
            let currentStep = 1;
            let currentProgress = 1.0;
            let currentOpen = 0.0;
            let currentRot = 0.0;
            let isIntro = false;
            let isOutro = false;

            if (timeSec < 2.0) {
              isIntro = true;
              currentStep = 1;
              currentProgress = 0;
              currentRot = timeSec * 0.1;
            } else if (timeSec < 23.6) {
              const stepIdx = Math.floor((timeSec - 2.0) / 1.8);
              currentStep = Math.min(12, Math.max(1, stepIdx + 1));
              const stepT = ((timeSec - 2.0) % 1.8) / 1.8;
              currentProgress = Math.min(1.0, stepT * 1.35);
              currentRot = stepT * 0.15;
            } else if (timeSec < 24.8) {
              currentStep = 12;
              const t = (timeSec - 23.6) / 1.2;
              currentProgress = 1.0;
              currentOpen = Math.sin(t * (Math.PI / 2)) * 0.88;
              currentRot = 0.15 + t * 0.3;
            } else {
              isOutro = true;
              currentStep = 12;
              const t = (timeSec - 24.8) / 1.2;
              currentProgress = 1.0;
              currentOpen = (1 - t) * 0.88;
              currentRot = 0.45 + t * 0.25;
            }

            // Update React state
            setStep(currentStep);
            setProgress(currentProgress);
            setOpenRatio(currentOpen);
            setCamRotY(currentRot);

            // Draw WebGL frame onto compositor
            ctx.drawImage(webglCanvas, 0, 0, 1920, 1080);

            // Draw Top Header
            ctx.fillStyle = "rgba(17, 24, 39, 0.90)";
            ctx.fillRect(0, 0, 1920, 68);
            ctx.fillStyle = "#3498a7";
            ctx.font = "bold 20px system-ui, sans-serif";
            ctx.fillText("FANUS WOODTECH", 48, 42);
            ctx.fillStyle = "#6b7280";
            ctx.fillText("|", 265, 42);
            ctx.fillStyle = "#e5e7eb";
            ctx.font = "600 17px system-ui, sans-serif";
            ctx.fillText("TEK KİŞİLİK YATAY BAZA • 3D MONTAJ KILAVUZU", 285, 42);

            ctx.fillStyle = "#9ca3af";
            ctx.font = "bold 14px system-ui, sans-serif";
            ctx.textAlign = "right";
            ctx.fillText("ORİJİNAL TEKNİK ŞEMA (12 AŞAMA)", 1872, 42);
            ctx.textAlign = "left";

            const stepData =
              ASSEMBLY_STEPS.find((s) => s.step === currentStep) || ASSEMBLY_STEPS[0];

            if (isIntro) {
              // Draw Intro Screen
              ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
              ctx.fillRect(0, 0, 1920, 1080);

              ctx.fillStyle = "#38bdf8";
              ctx.font = "bold 16px system-ui, sans-serif";
              ctx.textAlign = "center";
              ctx.fillText("RESMİ MONTAJ KILAVUZU • 3D ASSEMBLY MANUAL", 960, 480);

              ctx.fillStyle = "#ffffff";
              ctx.font = "900 52px system-ui, sans-serif";
              ctx.fillText("TEK KİŞİLİK YATAY AÇILIR BAZA", 960, 550);

              ctx.fillStyle = "#cbd5e1";
              ctx.font = "500 24px system-ui, sans-serif";
              ctx.fillText("12 Aşamalı Adım Adım 3D Kurulum Rehberi", 960, 605);
              ctx.textAlign = "left";
            } else if (isOutro) {
              // Draw Outro Screen
              ctx.fillStyle = "rgba(17, 24, 39, 0.92)";
              ctx.beginPath();
              ctx.roundRect(640, 840, 640, 140, 18);
              ctx.fill();
              ctx.strokeStyle = "rgba(52, 152, 167, 0.6)";
              ctx.lineWidth = 2;
              ctx.stroke();

              ctx.fillStyle = "#10b981";
              ctx.beginPath();
              ctx.arc(710, 910, 32, 0, Math.PI * 2);
              ctx.fill();

              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 32px system-ui, sans-serif";
              ctx.fillText("✓", 700, 922);

              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 24px system-ui, sans-serif";
              ctx.fillText("MONTAJ BAŞARIYLA TAMAMLANDI", 765, 898);

              ctx.fillStyle = "#9ca3af";
              ctx.font = "500 15px system-ui, sans-serif";
              ctx.fillText("Fanus WoodTech • Tek Kişilik Yatay Baza kullanıma hazır.", 765, 930);
            } else {
              // Draw Step Overlay Card
              ctx.fillStyle = "rgba(17, 24, 39, 0.92)";
              ctx.beginPath();
              ctx.roundRect(48, 770, 620, 260, 18);
              ctx.fill();
              ctx.strokeStyle = "rgba(75, 85, 99, 0.6)";
              ctx.lineWidth = 1.5;
              ctx.stroke();

              // Step Pill
              ctx.fillStyle = "#3498a7";
              ctx.beginPath();
              ctx.roundRect(72, 794, 130, 28, 14);
              ctx.fill();

              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 13px system-ui, sans-serif";
              ctx.fillText(`AŞAMA ${currentStep} / 12`, 88, 813);

              ctx.fillStyle = "#9ca3af";
              ctx.font = "600 13px system-ui, sans-serif";
              ctx.fillText(stepData.titleEn, 218, 813);

              // Title
              ctx.fillStyle = "#f3f4f6";
              ctx.font = "bold 20px system-ui, sans-serif";
              ctx.fillText(stepData.titleTr, 72, 855);

              // Description
              ctx.fillStyle = "#d1d5db";
              ctx.font = "400 14px system-ui, sans-serif";
              const words = stepData.descriptionTr.split(" ");
              let line = "";
              let lineY = 885;
              for (const word of words) {
                const testLine = line + word + " ";
                if (testLine.length > 58) {
                  ctx.fillText(line, 72, lineY);
                  line = word + " ";
                  lineY += 22;
                } else {
                  line = testLine;
                }
              }
              ctx.fillText(line, 72, lineY);

              // Hardware Tag
              if (stepData.hardware.length > 0) {
                ctx.fillStyle = "rgba(245, 158, 11, 0.2)";
                ctx.beginPath();
                ctx.roundRect(72, 970, 320, 30, 6);
                ctx.fill();
                ctx.strokeStyle = "rgba(245, 158, 11, 0.5)";
                ctx.stroke();

                ctx.fillStyle = "#fbbf24";
                ctx.font = "bold 12px system-ui, sans-serif";
                ctx.fillText(`🔧  ${stepData.hardware.join(" • ")}`, 82, 990);
              }

              // Step indicator dots
              ctx.fillStyle = "rgba(17, 24, 39, 0.85)";
              ctx.beginPath();
              ctx.roundRect(1540, 980, 332, 44, 12);
              ctx.fill();

              for (let i = 1; i <= 12; i++) {
                ctx.fillStyle =
                  i === currentStep
                    ? "#3498a7"
                    : i < currentStep
                    ? "#10b981"
                    : "rgba(107, 114, 128, 0.6)";
                const dotW = i === currentStep ? 24 : 8;
                ctx.beginPath();
                ctx.roundRect(1556 + (i - 1) * 26, 996, dotW, 8, 4);
                ctx.fill();
              }
            }

            frame++;
          }, 1000 / fps);
        } catch (err) {
          reject(err);
        }
      });
    };

    const timer = setTimeout(() => {
      window.isRenderReady = true;
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="render-root"
      style={{
        position: "fixed",
        inset: 0,
        width: "1920px",
        height: "1080px",
        overflow: "hidden",
        backgroundColor: "#ded7cb",
        userSelect: "none",
        zIndex: 99999,
      }}
    >
      <Canvas
        shadows
        camera={{ position: [2.5, 1.4, 2.8], fov: 42 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <RenderCameraController step={step} camRotY={camRotY} />

        <Suspense fallback={null}>
          <Environment files="/studio.hdr" />
        </Suspense>

        <directionalLight
          castShadow
          position={[4.5, 7.5, 4.0]}
          intensity={1.2}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={18}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-bias={-0.0001}
        />
        <directionalLight position={[-4, 3, 2]} intensity={0.35} color="#edf4fc" />
        <directionalLight position={[0, -1, 3]} intensity={0.18} color="#faf5ea" />

        <Suspense fallback={null}>
          <StorageBed3D
            assemblyStep={step}
            stepProgress={progress}
            openRatio={openRatio}
            explodedRatio={expRatio}
            upholsteryColor="dove-grey"
            frameMaterial="oak"
            frameFinish="satin"
          />
        </Suspense>

        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.44}
          scale={8.5}
          blur={2.0}
          far={3.5}
          resolution={1024}
          color="#221b14"
        />

        <Suspense fallback={null}>
          <ShowroomEnvironment />
        </Suspense>
      </Canvas>
    </div>
  );
}
