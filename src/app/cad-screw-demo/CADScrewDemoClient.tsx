"use client";

/**
 * CADScrewDemoClient.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive Technical CAD Assembly Viewer & Demonstration for
 * Corner Joint Screw Installation (TEK KİŞİLİK YATAY BAZA - Stage 3).
 */

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  CADScrewInstallationScene,
  CADCameraController,
} from "@/components/furniture-3d/CADScrewInstallationScene";
import {
  CADBoreholeReferenceScene,
  CADBoreholeCameraController,
} from "@/components/furniture-3d/CADBoreholeReferenceScene";
import {
  Play,
  Pause,
  RotateCcw,
  Ruler,
  Layers,
  CheckCircle2,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function CADScrewDemoClient() {
  const [activeTab, setActiveTab] = useState<"screw" | "borehole">("borehole");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0.0); // 0.0 to 1.0
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showEdges, setShowEdges] = useState<boolean>(true);

  // Multi-phase derivation:
  // 0.0 - 0.35: Bracket moves into position
  // 0.35 - 1.0: Screws drive into the holes while rotating
  const bracketProgress = Math.min(1.0, progress / 0.35);
  const screwProgress = Math.max(0.0, Math.min(1.0, (progress - 0.35) / 0.65));

  // Animation loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const duration = 5000 / playbackSpeed; // 5 seconds per cycle

    const updateLoop = () => {
      const now = Date.now();
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setProgress((prev) => {
        const next = prev + dt / duration;
        if (next >= 1.0) {
          // Pause slightly at completion then loop
          return 0.0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    lastTimeRef.current = Date.now();
    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleSeek = (val: number) => {
    setIsPlaying(false);
    setProgress(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-screen w-screen bg-[#141517] text-slate-100 overflow-hidden font-sans select-none">
      {/* ── Top CAD Navigation Bar ─────────────────────────────────────────── */}
      <header className="h-14 border-b border-zinc-800 bg-[#1c1d21] px-5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/storage-bed-preview"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors bg-amber-400/10 px-3 py-1.5 rounded-md border border-amber-400/20"
          >
            ← 12-Step Bed Overview
          </Link>
          <div className="h-4 w-px bg-zinc-700" />
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              CAD Assembly Proof of Concept — Screw Installation
            </h1>
            <p className="text-[11px] text-zinc-400">
              TEK KİŞİLİK YATAY BAZA • Stage 3 Corner Joint (Hole Spacing: 18 mm, 85 mm, 20 mm)
            </p>
          </div>
        </div>

        {/* View Controls & Toggles */}
        <div className="flex items-center gap-3">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-700/80">
            <button
              onClick={() => setActiveTab("borehole")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === "borehole"
                  ? "bg-amber-500 text-zinc-950 shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              YouTube 0:22 Referans (4,5 & 6,5 cm)
            </button>
            <button
              onClick={() => setActiveTab("screw")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === "screw"
                  ? "bg-blue-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Köşe Sacı & Vida (Stage 3)
            </button>
          </div>

          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
              showDimensions
                ? "bg-blue-600/20 text-blue-300 border-blue-500/40"
                : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
            }`}
            title="Toggle 3D Dimension Lines"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Dimensions ({showDimensions ? "ON" : "OFF"})</span>
          </button>

          <button
            onClick={() => setShowEdges(!showEdges)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
              showEdges
                ? "bg-emerald-600/20 text-emerald-300 border-emerald-500/40"
                : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-white"
            }`}
            title="Toggle Edged Faces (Wireframe Edges)"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Edged Faces ({showEdges ? "ON" : "OFF"})</span>
          </button>
        </div>
      </header>

      {/* ── Main Viewport Area ─────────────────────────────────────────────── */}
      <div className="flex-1 relative flex">
        {/* Left 3D Canvas */}
        <div className="flex-1 relative bg-[#1c1d21]">
          {/* Authentic CAD Viewport HUD overlay (matching reference image) */}
          <div className="absolute top-4 left-4 z-10 font-mono text-[11px] text-zinc-400 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded border border-zinc-700/60 pointer-events-none select-none">
            <span className="text-amber-400">[+]</span>{" "}
            <span className="text-zinc-200">[Perspective]</span>{" "}
            <span className="text-zinc-200">[Standard]</span>{" "}
            <span className="text-emerald-400">[Edged Faces]</span>
          </div>

          {/* Assembly Stage Sub-Header Badge */}
          <div className="absolute top-4 right-4 z-10 bg-black/75 backdrop-blur-md px-4 py-2 rounded-lg border border-zinc-700 text-right pointer-events-none">
            {activeTab === "borehole" ? (
              <>
                <div className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                  YouTube 0:22 / 2:05 Visual Reference Reproduction
                </div>
                <div className="text-sm font-bold text-white">
                  Notched Corner, Borehole & Flange Fitting
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Dimensions: 4,5 cm • 6,5 cm • 4-Hole Metal Flange & Latch
                </div>
              </>
            ) : (
              <>
                <div className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                  Stage 3 Technical Close-Up
                </div>
                <div className="text-sm font-bold text-white">
                  {progress < 0.35
                    ? "1. Corner Bracket Alignment"
                    : progress < 0.85
                    ? "2. Screw Driving & Rotation (3.9x19)"
                    : "3. Fully Clamped Structural Joint"}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Pitch: 85 mm • Offset: 18 mm • Bottom: 20 mm
                </div>
              </>
            )}
          </div>

          {/* Three.js Canvas */}
          <Canvas
            camera={{
              position: activeTab === "borehole" ? [0.18, 0.28, 0.32] : [0.28, 0.20, 0.28],
              fov: 30,
              near: 0.01,
              far: 20,
            }}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Dark Slate CAD Environment Background */}
            <color attach="background" args={["#1c1d22"]} />

            {/* Crisp Engineering Directional Lighting */}
            <directionalLight position={[0.5, 0.8, 0.5]} intensity={1.2} />
            <directionalLight position={[-0.4, 0.3, -0.3]} intensity={0.4} color="#94a3b8" />
            <ambientLight intensity={0.8} />

            {/* Close-Up Camera Orbit Controls */}
            {activeTab === "borehole" ? (
              <>
                <CADBoreholeCameraController />
                <CADBoreholeReferenceScene
                  showDimensions={showDimensions}
                  showEdges={showEdges}
                />
              </>
            ) : (
              <>
                <CADCameraController />
                <CADScrewInstallationScene
                  screwProgress={screwProgress}
                  bracketProgress={bracketProgress}
                  showDimensions={showDimensions}
                  showEdges={showEdges}
                />
              </>
            )}
          </Canvas>

          {/* Interactive Bottom Scrub & Animation Bar */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 w-11/12 max-w-2xl bg-black/85 backdrop-blur-md rounded-xl p-3 border border-zinc-700/80 shadow-2xl flex flex-col gap-2.5">
            {/* Timeline Progress Slider */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-zinc-400 w-10">
                {Math.round(progress * 100)}%
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.005}
                value={progress}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-[11px] font-mono text-zinc-400 w-16 text-right">
                {screwProgress > 0 ? `${(screwProgress * 19).toFixed(1)}mm` : "0.0mm"}
              </span>
            </div>

            {/* Playback Controls & Stage Phase Buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? "Pause" : "Play Animation"}</span>
                </button>
                <button
                  onClick={() => {
                    setProgress(0);
                    setIsPlaying(true);
                  }}
                  className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition"
                  title="Replay from beginning"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSeek(0.1)}
                  className={`px-2.5 py-1 text-[11px] rounded transition ${
                    progress < 0.35 ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  Bracket
                </button>
                <button
                  onClick={() => handleSeek(0.5)}
                  className={`px-2.5 py-1 text-[11px] rounded transition ${
                    progress >= 0.35 && progress < 0.85
                      ? "bg-zinc-700 text-white"
                      : "text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  Screw Rotation
                </button>
                <button
                  onClick={() => handleSeek(1.0)}
                  className={`px-2.5 py-1 text-[11px] rounded transition ${
                    progress >= 0.85 ? "bg-zinc-700 text-white" : "text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  Fastened
                </button>
              </div>

              {/* Playback Speed */}
              <div className="flex items-center gap-1">
                {[0.5, 1.0, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 text-[10px] rounded font-mono ${
                      playbackSpeed === spd
                        ? "bg-amber-400/20 text-amber-300 border border-amber-400/40"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Engineering Data Sidebar */}
        <div className="w-80 border-l border-zinc-800 bg-[#16171a] p-5 flex flex-col gap-4 overflow-y-auto">
          <div className="pb-3 border-b border-zinc-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              {activeTab === "borehole" ? "Reference 0:22 Specifications" : "Technical Specifications"}
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              {activeTab === "borehole"
                ? "Exact corner notch, borehole callouts & connector hardware from YouTube reference video at 0:22."
                : "Exact manufacturer assembly parameters sourced from the Turkish engineering drawing."}
            </p>
          </div>

          {activeTab === "borehole" ? (
            <>
              {/* Reference Notch Card */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3.5 space-y-2">
                <div className="text-xs font-semibold text-amber-400 flex items-center justify-between">
                  <span>Corner Notch Geometry</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-amber-500/10 rounded border border-amber-500/20">
                    YouTube 0:22
                  </span>
                </div>
                <div className="text-sm font-bold text-white">4,5 cm x 6,5 cm Cutout</div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  Precision milled corner recess with circular borehole and chamfered edge for profile engagement.
                </div>
              </div>

              {/* Hardware Table */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3.5 space-y-2.5">
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                  <span>Connection Hardware</span>
                  <span className="font-mono text-[10px] text-zinc-400">CAD Hardware</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Horizontal Offset:</span>
                    <span className="font-mono font-bold text-amber-400">4,5 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Vertical Offset:</span>
                    <span className="font-mono font-bold text-amber-400">6,5 cm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Connector Flange:</span>
                    <span className="font-mono font-bold text-white">4 Screw + Center Bore</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Latch Fitting:</span>
                    <span className="font-mono font-bold text-white">Dual-Screw Bracket</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Viewport Mode:</span>
                    <span className="font-mono font-bold text-emerald-400">Edged Faces</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Hardware Callout Card */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3.5 space-y-2">
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                  <span>Fastener Specification</span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                    Callout -5
                  </span>
                </div>
                <div className="text-sm font-bold text-white">3.9 x 19 Şapkalı Akıllı Vida</div>
                <div className="text-xs text-zinc-400 leading-relaxed">
                  Self-drilling pan-head wood/metal screw. 19 mm thread penetration into 18 mm chipboard.
                </div>
              </div>

              {/* Dimension Specifications Table */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3.5 space-y-2.5">
                <div className="text-xs font-semibold text-amber-400 flex items-center justify-between">
                  <span>Drill Pattern Dimensions</span>
                  <span className="font-mono text-[10px] text-zinc-400">Page 3 PDF</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Edge Distance:</span>
                    <span className="font-mono font-bold text-white">18 mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Hole Pitch (Center):</span>
                    <span className="font-mono font-bold text-white">85 mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Bottom Clearance:</span>
                    <span className="font-mono font-bold text-white">20 mm</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800/60">
                    <span className="text-zinc-400">Bracket Height:</span>
                    <span className="font-mono font-bold text-white">150 mm</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-400">Board Thickness:</span>
                    <span className="font-mono font-bold text-white">18 mm Sunta</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Reference Alignment Verification */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-3.5 space-y-2">
            <div className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CAD Aesthetic Highlights</span>
            </div>
            <ul className="text-xs text-zinc-400 space-y-1.5 list-disc pl-4">
              <li>
                <strong className="text-zinc-300">Edged Faces Viewport:</strong> Clean geometry with
                dark visible silhouettes.
              </li>
              <li>
                <strong className="text-zinc-300">Axial Screw Motion:</strong> True rotational
                driving along normal vector.
              </li>
              <li>
                <strong className="text-zinc-300">3D Technical Callouts:</strong> Dimension leader
                lines with arrowheads and badges.
              </li>
              <li>
                <strong className="text-zinc-300">Recessed Pilot Holes:</strong> Realistic bore
                cavity on board.
              </li>
            </ul>
          </div>

          {/* Video Download / Render Link */}
          <div className="mt-auto pt-4 border-t border-zinc-800">
            <a
              href="/cad-screw-installation.mp4"
              download
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded border border-zinc-700 transition"
            >
              <span>Download 1080p CAD Video</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
