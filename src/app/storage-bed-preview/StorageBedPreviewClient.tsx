"use client";

/**
 * StorageBedPreviewClient.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive 12-Step Assembly Viewer and Controller for:
 * TEK KİŞİLİK YATAY BAZA
 */

import React, { useState, useEffect, useRef } from "react";
import { StorageBedCanvas } from "@/components/furniture-3d/StorageBedCanvas";
import type { UpholsteryColor } from "@/components/furniture-3d/StorageBed3D";
import type { WoodMaterial, FinishType } from "@/types/furniture";
import { ASSEMBLY_STEPS } from "@/lib/constants/assemblySteps";
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Layers,
  Wrench,
  CheckCircle2,
} from "lucide-react";

const UPHOLSTERY_OPTIONS: { label: string; value: UpholsteryColor; swatch: string }[] = [
  { label: "Güvercin Gri", value: "dove-grey", swatch: "#b0aaa6" },
  { label: "Antrasit", value: "charcoal", swatch: "#3c3c3e" },
  { label: "Fildişi", value: "ivory", swatch: "#e8e3d8" },
  { label: "Kum", value: "sand", swatch: "#c9b89a" },
  { label: "Lacivert", value: "navy", swatch: "#2a3550" },
];

const FRAME_OPTIONS: { label: string; value: WoodMaterial; swatch: string }[] = [
  { label: "Meşe", value: "oak", swatch: "#c89d66" },
  { label: "Ceviz", value: "walnut", swatch: "#5d3e2b" },
  { label: "Kayın", value: "beech", swatch: "#dfbe99" },
  { label: "Beyaz", value: "white", swatch: "#f4f3ef" },
  { label: "Siyah", value: "black", swatch: "#1a1918" },
];

export default function StorageBedPreviewClient() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [stepProgress, setStepProgress] = useState<number>(1.0);
  const [openRatio, setOpenRatio] = useState<number>(0.0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [explodedView, setExplodedView] = useState<boolean>(false);
  const [explodedRatio, setExplodedRatio] = useState<number>(0.85);
  const [resetCameraTrigger, setResetCameraTrigger] = useState<number>(0);

  const [upholstery, setUpholstery] = useState<UpholsteryColor>("dove-grey");
  const [frameMat, setFrameMat] = useState<WoodMaterial>("oak");
  const [frameFinish] = useState<FinishType>("satin");

  const activeStepData = ASSEMBLY_STEPS.find((s) => s.step === currentStep) || ASSEMBLY_STEPS[0];

  // Auto-play animation loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const stepDuration = 3200 / playbackSpeed; // ~3.2s per step

    const updatePlay = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setStepProgress((prev) => {
        const next = prev + delta / stepDuration;
        if (next >= 1.0) {
          // Transition to next step
          setCurrentStep((curr) => {
            if (curr >= 12) {
              // Loop back or open/close demo in step 12
              return 1;
            }
            return curr + 1;
          });
          return 0.0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(updatePlay);
    };

    lastTimeRef.current = Date.now();
    animFrameRef.current = requestAnimationFrame(updatePlay);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // In step 12, animate open/close if playing
  useEffect(() => {
    if (currentStep === 12) {
      const interval = setInterval(() => {
        setOpenRatio((prev) => (prev > 0.5 ? 0.0 : 0.85));
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setOpenRatio(0.0);
    }
  }, [currentStep]);

  const handleNextStep = () => {
    setIsPlaying(false);
    setCurrentStep((s) => Math.min(12, s + 1));
    setStepProgress(1.0);
  };

  const handlePrevStep = () => {
    setIsPlaying(false);
    setCurrentStep((s) => Math.max(1, s - 1));
    setStepProgress(1.0);
  };

  const handleSelectStep = (s: number) => {
    setIsPlaying(false);
    setCurrentStep(s);
    setStepProgress(1.0);
  };

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-64px)] bg-[#ded7cb] overflow-hidden">

      {/* ── 3D Viewport ────────────────────────────────────────────────────── */}
      <div className="flex-1 relative flex flex-col">
        <div className="flex-1 relative">
          <StorageBedCanvas
            assemblyStep={explodedView ? 12 : currentStep}
            stepProgress={stepProgress}
            openRatio={openRatio}
            explodedView={explodedView}
            explodedRatio={explodedView ? explodedRatio : 0}
            resetCameraTrigger={resetCameraTrigger}
            upholsteryColor={upholstery}
            frameMaterial={frameMat}
            frameFinish={frameFinish}
          />

          {/* Top-Right Quick Viewport Controls: Exploded View & Camera Reset */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => {
                setExplodedView(!explodedView);
                if (!explodedView) setCurrentStep(12);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xl backdrop-blur-md border ${
                explodedView
                  ? "bg-amber-500 text-stone-900 border-amber-400 ring-2 ring-amber-400/50 scale-105"
                  : "bg-stone-900/85 hover:bg-stone-800 text-stone-200 border-stone-700/80"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{explodedView ? "Patlatılmış Görünüm (Açık)" : "Patlatılmış Görünüm (Exploded View)"}</span>
            </button>

            <button
              onClick={() => setResetCameraTrigger((t) => t + 1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-900/85 hover:bg-stone-800 text-stone-200 border border-stone-700/80 shadow-xl backdrop-blur-md transition-all"
              title="Kamerayı Varsayılan Açıya Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Kamera Sıfırla</span>
            </button>
          </div>

          {/* Exploded Ratio Slider Overlay (Visible when exploded view active) */}
          {explodedView && (
            <div className="absolute top-16 right-4 z-10 w-72 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 rounded-xl p-3 shadow-2xl text-white">
              <div className="flex justify-between items-center text-xs font-bold text-amber-400 mb-1.5">
                <span>Parça Ayrılma Mesafesi</span>
                <span className="font-mono">{Math.round(explodedRatio * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.02"
                value={explodedRatio}
                onChange={(e) => setExplodedRatio(parseFloat(e.target.value))}
                className="w-full h-2 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Yakın</span>
                <span>Maksimum Patlatma</span>
              </div>
            </div>
          )}

          {/* Cinematic Top-Left Step Overlay Badge */}
          <div className="absolute top-4 left-4 max-w-md bg-stone-900/90 backdrop-blur-md border border-stone-700/60 p-4 rounded-xl shadow-2xl text-white pointer-events-none transition-all">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#3498a7] text-white tracking-wide uppercase">
                Aşama {currentStep} / 12
              </span>
              <span className="text-xs text-stone-400 font-medium">
                {activeStepData.titleEn}
              </span>
            </div>

            <h2 className="text-sm md:text-base font-bold text-stone-100 leading-snug">
              {activeStepData.titleTr}
            </h2>

            <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
              {activeStepData.descriptionTr}
            </p>

            {/* Hardware badge list */}
            {activeStepData.hardware.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {activeStepData.hardware.map((hw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded"
                  >
                    <Wrench className="w-2.5 h-2.5" />
                    {hw}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Watermark notice & CAD Switch */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2">
            <div className="bg-stone-900/80 backdrop-blur border border-stone-700 text-stone-300 text-[10px] font-medium px-3 py-1.5 rounded-lg shadow-sm">
              TEK KİŞİLİK YATAY BAZA • 12 Aşamalı 3D Montaj Kılavuzu
            </div>
            <a
              href="/cad-screw-demo"
              className="bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transition-all animate-pulse"
            >
              <span>🔬 CAD Style Screw Demo (PoC) →</span>
            </a>
          </div>
        </div>

        {/* ── Bottom Control Timeline ────────────────────────────────────────── */}
        <div className="bg-stone-900/95 border-t border-stone-800 p-3 flex flex-col md:flex-row items-center justify-between gap-3 text-white">
          {/* Play/Pause & Step Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStep <= 1}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 transition-colors"
              title="Önceki Aşama"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  setIsPlaying(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3498a7] hover:bg-[#2b7f8c] font-semibold text-xs tracking-wide transition-all shadow-lg shadow-[#3498a7]/20"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" /> Duraklat
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Oynat
                </>
              )}
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStep >= 12}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40 transition-colors"
              title="Sonraki Aşama"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleSelectStep(1)}
              className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors"
              title="Başa Dön"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* 12-Step Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl py-1">
            {ASSEMBLY_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => handleSelectStep(s.step)}
                className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${
                  currentStep === s.step
                    ? "bg-[#3498a7] text-white scale-110 shadow-md ring-2 ring-[#3498a7]/50"
                    : currentStep > s.step
                    ? "bg-stone-700 text-stone-300 hover:bg-stone-600"
                    : "bg-stone-800 text-stone-500 hover:bg-stone-700"
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <span>Hız:</span>
            {[1.0, 1.5, 2.0].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  playbackSpeed === spd
                    ? "bg-stone-700 text-white border border-stone-600"
                    : "hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Details Sidebar ─────────────────────────────────────────── */}
      <aside className="w-full lg:w-80 bg-stone-900 border-l border-stone-800 flex flex-col text-stone-200 overflow-y-auto">
        <div className="p-4 border-b border-stone-800">
          <div className="flex items-center gap-2 text-[#3498a7] mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              Montaj Kılavuzu
            </span>
          </div>
          <h1 className="text-base font-bold text-white">Tek Kişilik Yatay Baza</h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Orijinal Teknik Şema (12 Aşama)
          </p>
        </div>

        {/* Current Step Overview */}
        <div className="p-4 border-b border-stone-800 bg-stone-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
              Mevcut Aşama
            </span>
            <span className="text-xs text-stone-400">Adım {currentStep}/12</span>
          </div>

          <h3 className="text-sm font-semibold text-white">
            {activeStepData.titleTr}
          </h3>

          <div className="mt-3 space-y-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">
                Gerekli Parçalar:
              </span>
              <ul className="mt-1 space-y-1">
                {activeStepData.components.map((comp, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-stone-300 flex items-start gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">
                Bağlantı Elemanları:
              </span>
              <ul className="mt-1 space-y-1">
                {activeStepData.hardware.map((hw, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-amber-300 flex items-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{hw}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Mechanism Lift Control in Steps 11 & 12 */}
        {currentStep >= 11 && (
          <div className="p-4 border-b border-stone-800 bg-[#3498a7]/10">
            <label className="text-xs font-bold text-[#3498a7] uppercase tracking-wide block mb-2">
              Gazlı Amortisör / Kapak Açıklığı
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={openRatio}
              onChange={(e) => setOpenRatio(parseFloat(e.target.value))}
              className="w-full accent-[#3498a7] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Kapalı (0°)</span>
              <span>Açık (30°)</span>
            </div>
          </div>
        )}

        {/* Color & Material Customizer */}
        <div className="p-4 border-b border-stone-800 space-y-3">
          <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wide">
            Kumaş ve Ahşap Seçenekleri
          </h3>

          <div>
            <span className="text-[11px] text-stone-400 block mb-1.5">
              Döşeme Rengi:
            </span>
            <div className="flex gap-2">
              {UPHOLSTERY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  title={opt.label}
                  onClick={() => setUpholstery(opt.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    upholstery === opt.value
                      ? "border-[#3498a7] scale-110 shadow-md ring-1 ring-white/50"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: opt.swatch }}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-stone-400 block mb-1.5">
              Ahşap Gövde:
            </span>
            <div className="flex gap-2">
              {FRAME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  title={opt.label}
                  onClick={() => setFrameMat(opt.value)}
                  className={`w-7 h-7 rounded-md border-2 transition-all ${
                    frameMat === opt.value
                      ? "border-[#3498a7] scale-110 shadow-md ring-1 ring-white/50"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: opt.swatch }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Video Download Section */}
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-br from-stone-800 to-stone-850 border border-stone-700/80 rounded-xl p-3.5 text-center shadow-lg">
            <span className="text-xs font-bold text-white block">
              1080p Montaj Videosu
            </span>
            <span className="text-[11px] text-stone-400 mt-0.5 block">
              12 Aşamalı Tam Montaj + 360° Vitrin
            </span>
            <a
              href="/storage-bed-assembly.mp4"
              download="storage-bed-assembly-1080p.mp4"
              className="mt-2.5 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#3498a7] hover:bg-[#2c818e] text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-[#3498a7]/20"
            >
              <span>📥 MP4 Videoyu İndir (1080p)</span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
