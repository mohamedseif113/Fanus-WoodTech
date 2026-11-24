"use client";

import React, { useState } from "react";
import {
  RotateCcw,
  Layers,
  Camera,
  Ruler,
} from "lucide-react";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";
import { PresetView } from "@/types/furniture";

interface ViewportToolbarProps {
  showDimensions: boolean;
  onToggleDimensions: () => void;
}

export const ViewportToolbar: React.FC<ViewportToolbarProps> = ({
  showDimensions,
  onToggleDimensions,
}) => {
  const { t } = useI18nStore();
  const {
    explodedView,
    toggleExplodedView,
    cameraPreset,
    setCameraPreset,
  } = useConfiguratorStore();

  const [screenshotTaken, setScreenshotTaken] = useState(false);

  const presets: { id: PresetView; label: string }[] = [
    { id: "perspective", label: t.configurator.presetPerspective },
    { id: "front", label: t.configurator.presetFront },
    { id: "side", label: t.configurator.presetSide },
    { id: "top", label: t.configurator.presetTop },
  ];

  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `fanus-woodtech-${Date.now()}.png`;
      a.click();
      setScreenshotTaken(true);
      setTimeout(() => setScreenshotTaken(false), 2000);
    } catch (e) {
      console.error("Screenshot error:", e);
    }
  };

  return (
    <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between pointer-events-none gap-2 z-10">
      {/* LEFT: Camera Presets */}
      <div className="pointer-events-auto flex items-center bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-soft-md border border-stone-200/80">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => setCameraPreset(p.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              cameraPreset === p.id
                ? "bg-wood-700 text-white shadow-sm"
                : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* RIGHT: Actions (Exploded View, Dimensions, Screenshot, Reset) */}
      <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-xl p-1 shadow-soft-md border border-stone-200/80">
        {/* Exploded View Toggle */}
        <button
          onClick={toggleExplodedView}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            explodedView
              ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-300"
              : "text-stone-700 hover:text-stone-900 hover:bg-stone-100"
          }`}
          title={t.configurator.explodedView}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.configurator.explodedView}</span>
          {explodedView && (
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          )}
        </button>

        {/* Dimension Lines Toggle */}
        <button
          onClick={onToggleDimensions}
          className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
            showDimensions
              ? "bg-stone-200 text-stone-900"
              : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
          }`}
          title="Ölçü Çizgileri"
        >
          <Ruler className="w-4 h-4" />
        </button>

        {/* Take Screenshot */}
        <button
          onClick={handleScreenshot}
          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all relative"
          title="Ekran Görüntüsü İndir"
        >
          <Camera className="w-4 h-4" />
          {screenshotTaken && (
            <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-charcoal-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
              {t.common.copied}
            </span>
          )}
        </button>

        {/* Reset Camera View */}
        <button
          onClick={() => setCameraPreset("perspective")}
          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all"
          title={t.configurator.resetCamera}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
