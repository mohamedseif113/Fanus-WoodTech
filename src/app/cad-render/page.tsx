"use client";

/**
 * /cad-render
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time 1920x1080 30 FPS GPU Recording & Frame Capture Page for CAD PoC.
 * Renders the CADScrewInstallationScene in authentic CAD Edged Faces mode.
 */

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  CADScrewInstallationScene,
  CADCameraController,
} from "@/components/furniture-3d/CADScrewInstallationScene";

declare global {
  interface Window {
    renderCADFrame?: (progress: number, camRotY?: number) => void;
    isCADRenderReady?: boolean;
  }
}

export default function CADRenderPage() {
  const [progress, setProgress] = useState<number>(0.0);
  const [camRotY, setCamRotY] = useState<number>(0.0);

  useEffect(() => {
    window.renderCADFrame = (p, rot = 0) => {
      setProgress(p);
      setCamRotY(rot);
    };

    const timer = setTimeout(() => {
      window.isCADRenderReady = true;
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const bracketProgress = Math.min(1.0, progress / 0.35);
  const screwProgress = Math.max(0.0, Math.min(1.0, (progress - 0.35) / 0.65));

  // Determine stage title for the HUD
  let stageTitle = "1. Metal Köşe Sacı Hizalama (Corner Bracket Alignment)";
  if (progress >= 0.35 && progress < 0.85) {
    stageTitle = "2. 3.9 x 19 Akıllı Vida Sıkma (Screw Driving & Tightening)";
  } else if (progress >= 0.85) {
    stageTitle = "3. Tam Kilitli Rijit Birleşim (Fully Fastened Structural Joint)";
  }

  // Camera coordinates with subtle orbital rotation
  const camDist = 0.36;
  const baseAngle = 0.88 + camRotY;
  const camX = camDist * Math.sin(baseAngle);
  const camZ = camDist * Math.cos(baseAngle);
  const camY = 0.20;

  return (
    <div
      id="cad-render-root"
      style={{
        position: "fixed",
        inset: 0,
        width: "1920px",
        height: "1080px",
        background: "#1c1d22",
        overflow: "hidden",
        zIndex: 99999,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ── 3D Viewport ─────────────────────────────────────────────────────── */}
      <Canvas
        camera={{
          position: [camX, camY, camZ],
          fov: 30,
          near: 0.01,
          far: 20,
        }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <color attach="background" args={["#1c1d22"]} />

        <directionalLight
          position={[0.5, 0.8, 0.5]}
          intensity={1.2}
        />
        <directionalLight position={[-0.4, 0.3, -0.3]} intensity={0.4} color="#94a3b8" />
        <ambientLight intensity={0.8} />

        <CADCameraController />

        <CADScrewInstallationScene
          screwProgress={screwProgress}
          bracketProgress={bracketProgress}
          showDimensions={true}
          showEdges={true}
        />
      </Canvas>

      {/* ── CAD Viewport Standard HUD (Matches Reference Video) ──────────────── */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          left: "32px",
          fontFamily: "ui-monospace, monospace",
          fontSize: "15px",
          color: "#94a3b8",
          background: "rgba(0, 0, 0, 0.75)",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <span style={{ color: "#f59e0b" }}>[+]</span>
        <span style={{ color: "#e2e8f0" }}>[Perspective]</span>
        <span style={{ color: "#e2e8f0" }}>[Standard]</span>
        <span style={{ color: "#10b981", fontWeight: "bold" }}>[Edged Faces]</span>
      </div>

      {/* ── Top-Right Technical Assembly Overlay ─────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          right: "32px",
          background: "rgba(15, 23, 42, 0.90)",
          backdropFilter: "blur(8px)",
          padding: "16px 24px",
          borderRadius: "10px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          color: "#ffffff",
          textAlign: "right",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: "13px",
            color: "#38bdf8",
            fontWeight: "bold",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          TEK KİŞİLİK YATAY BAZA • AŞAMA 3 MONTAJ DETAYI
        </div>
        <div style={{ fontSize: "20px", fontWeight: "bold", color: "#f8fafc" }}>
          {stageTitle}
        </div>
        <div
          style={{
            fontSize: "14px",
            color: "#94a3b8",
            marginTop: "6px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "16px",
          }}
        >
          <span>
            Delik Aralığı: <strong style={{ color: "#f1f5f9" }}>85 mm</strong>
          </span>
          <span>
            Kenar Mesafesi: <strong style={{ color: "#f1f5f9" }}>18 mm</strong>
          </span>
          <span>
            Taban: <strong style={{ color: "#f1f5f9" }}>20 mm</strong>
          </span>
          <span>
            Vida: <strong style={{ color: "#34d399" }}>3.9 x 19 (-5)</strong>
          </span>
        </div>
      </div>

      {/* ── Bottom Technical Progress Indicator ─────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "28px",
          left: "32px",
          right: "32px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(6px)",
          padding: "12px 20px",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: "13px",
            fontWeight: "bold",
            color: "#38bdf8",
            whiteSpace: "nowrap",
          }}
        >
          MONTAJ İLERLEMESİ
        </span>

        {/* Progress track */}
        <div
          style={{
            flex: 1,
            height: "8px",
            background: "#334155",
            borderRadius: "4px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #0284c7, #38bdf8)",
              transition: "width 0.05s linear",
            }}
          />
        </div>

        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#f8fafc",
          }}
        >
          {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  );
}
