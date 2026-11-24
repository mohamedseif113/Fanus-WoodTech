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
  const [activeModel, setActiveModel] = useState<"tv-stand" | "cabinet">("tv-stand");

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-68px)] min-h-[650px] overflow-hidden bg-stone-100">
      {/* 1. CONFIGURATION SIDEBAR (LEFT on desktop - Woodcoder pattern) */}
      <ConfiguratorSidebar
        activeModel={activeModel}
        onModelChange={setActiveModel}
      />

      {/* 2. 3D VIEWPORT (RIGHT on desktop - fills remaining width) */}
      <main className="flex-1 relative h-[50vh] lg:h-full overflow-hidden bg-stone-100 order-first lg:order-last">
        {/* Floating Top/Bottom Toolbar */}
        <ViewportToolbar
          showDimensions={showDimensions}
          onToggleDimensions={() => setShowDimensions(!showDimensions)}
          activeModel={activeModel}
        />

        {/* 3D Scene Canvas */}
        <ConfiguratorCanvas
          showDimensions={showDimensions}
          activeModel={activeModel}
        />

        {/* Bottom subtle interaction hint (Woodcoder style) */}
        <div className="absolute bottom-4 left-4 pointer-events-none hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-stone-200/90 text-[11px] text-stone-600 shadow-soft-sm font-medium">
          <span>Döndürmek için sürükleyin</span>
          <span className="text-stone-300">•</span>
          <span>Yakınlaştırmak için kaydırın</span>
          <span className="text-stone-300">•</span>
          <span>Kaydırmak için sağ tık</span>
        </div>
      </main>
    </div>
  );
};
