"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ViewportToolbar } from "@/components/furniture-3d/ViewportToolbar";
import { ConfiguratorSidebar } from "@/components/configurator/ConfiguratorSidebar";
import { Loader2 } from "lucide-react";

// Dynamically import the 3D canvas with SSR disabled to prevent WebGL hydration issues
const ConfiguratorCanvas = dynamic(
  () =>
    import("@/components/furniture-3d/ConfiguratorCanvas").then(
      (mod) => mod.ConfiguratorCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 gap-3">
        <Loader2 className="w-8 h-8 text-wood-700 animate-spin" />
        <span className="text-xs font-semibold text-stone-600">
          3D Stüdyo & Geometri Yükleniyor...
        </span>
      </div>
    ),
  }
);

export const ConfiguratorLayout: React.FC = () => {
  const [showDimensions, setShowDimensions] = useState(true);

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-68px)] min-h-[600px] overflow-hidden bg-stone-100">
      {/* 3D VIEWPORT (LEFT / CENTER) */}
      <div className="flex-1 relative h-[50vh] lg:h-full overflow-hidden">
        {/* Floating Toolbar */}
        <ViewportToolbar
          showDimensions={showDimensions}
          onToggleDimensions={() => setShowDimensions(!showDimensions)}
        />

        {/* 3D Scene */}
        <ConfiguratorCanvas showDimensions={showDimensions} />

        {/* Bottom subtle interaction hint */}
        <div className="absolute bottom-4 left-4 pointer-events-none hidden sm:flex items-center gap-2 bg-white/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-stone-200 text-[11px] text-stone-600 shadow-sm">
          <span>Döndürmek için sürükleyin</span>
          <span>•</span>
          <span>Yakınlaştırmak için kaydırın</span>
        </div>
      </div>

      {/* CONFIGURATION SIDEBAR (RIGHT) */}
      <ConfiguratorSidebar />
    </div>
  );
};
