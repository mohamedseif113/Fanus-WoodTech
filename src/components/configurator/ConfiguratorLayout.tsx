"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Loader2, X, QrCode, Tv, Box, HelpCircle } from "lucide-react";
import { FloatingViewportControls } from "./FloatingViewportControls";
import { ProductToolsBar, ConfigCategory } from "./ProductToolsBar";
import { BottomConfigurationPanel } from "./BottomConfigurationPanel";
import { SavedDesignsModal } from "./SavedDesignsModal";
import { useTVStandStore } from "@/store/useTVStandStore";
import { useConfiguratorStore } from "@/store/useConfiguratorStore";
import { useI18nStore } from "@/store/useI18nStore";

// Dynamically import Three.js Canvas with SSR disabled
const ConfiguratorCanvas = dynamic(
  () =>
    import("@/components/furniture-3d/ConfiguratorCanvas").then(
      (mod) => mod.ConfiguratorCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#ded7cb] gap-3">
        <Loader2 className="w-8 h-8 text-[#3498a7] animate-spin" />
        <span className="text-xs font-semibold text-stone-700">
          3D Showroom & Model Yükleniyor...
        </span>
      </div>
    ),
  }
);

interface StateSnapshot {
  dimensions: { width: number; height: number; depth: number; upperHeight?: number };
  material: string;
  finish: string;
}

export const ConfiguratorLayout: React.FC = () => {
  const { language } = useI18nStore();
  const tvStore = useTVStandStore();
  const cabinetStore = useConfiguratorStore();
  const searchParams = useSearchParams();

  const [activeModel, setActiveModel] = useState<"tv-stand" | "cabinet">("tv-stand");
  const [activeCategory, setActiveCategory] = useState<ConfigCategory>("dimensions");
  const [is2D, setIs2D] = useState(false);
  const [showDimensions] = useState(false);

  // Sync activeModel & pre-load product from URL search params (e.g. ?model=cabinet&product=fanus-bookshelf-loft)
  useEffect(() => {
    const modelParam = searchParams.get("model");
    const productParam = searchParams.get("product");

    if (
      modelParam === "cabinet" ||
      productParam === "fanus-bookshelf-loft" ||
      productParam?.includes("loft") ||
      productParam?.includes("bookshelf")
    ) {
      setActiveModel("cabinet");
      if (productParam === "fanus-bookshelf-loft" || productParam?.includes("loft")) {
        cabinetStore.setDimensions({ width: 100, height: 200, depth: 32 });
        cabinetStore.setMaterial("walnut");
        cabinetStore.setShelfCount(5);
        cabinetStore.setDoorType("none");
        cabinetStore.setLegStyle("metal-plinth");
        cabinetStore.setFinish("satin");
      }
    } else if (modelParam === "tv-stand") {
      setActiveModel("tv-stand");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Modals state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  // Undo / Redo History Stack
  const isTV = activeModel === "tv-stand";
  const [history, setHistory] = useState<StateSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isInternalUpdate = useRef(false);

  // Initialize initial history snapshot
  useEffect(() => {
    const initialSnapshot: StateSnapshot = isTV
      ? {
          dimensions: { ...tvStore.dimensions },
          material: tvStore.material,
          finish: tvStore.finish,
        }
      : {
          dimensions: { ...cabinetStore.dimensions },
          material: cabinetStore.material,
          finish: cabinetStore.finish,
        };
    setHistory([initialSnapshot]);
    setHistoryIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModel]);

  // Track state changes to record history
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const currentSnapshot: StateSnapshot = isTV
      ? {
          dimensions: { ...tvStore.dimensions },
          material: tvStore.material,
          finish: tvStore.finish,
        }
      : {
          dimensions: { ...cabinetStore.dimensions },
          material: cabinetStore.material,
          finish: cabinetStore.finish,
        };

    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      // Avoid duplicate consecutive snapshots
      const last = upToCurrent[upToCurrent.length - 1];
      if (
        last &&
        last.dimensions.width === currentSnapshot.dimensions.width &&
        last.dimensions.height === currentSnapshot.dimensions.height &&
        last.dimensions.depth === currentSnapshot.dimensions.depth &&
        last.material === currentSnapshot.material &&
        last.finish === currentSnapshot.finish
      ) {
        return prev;
      }
      const updated = [...upToCurrent, currentSnapshot].slice(-25); // cap 25 steps
      setHistoryIndex(updated.length - 1);
      return updated;
    });
  }, [
    isTV,
    historyIndex,
    tvStore.dimensions,
    tvStore.material,
    tvStore.finish,
    cabinetStore.dimensions,
    cabinetStore.material,
    cabinetStore.finish,
  ]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      const snap = history[targetIndex];
      isInternalUpdate.current = true;
      if (isTV) {
        tvStore.setWidth(snap.dimensions.width);
        tvStore.setHeight(snap.dimensions.height);
        tvStore.setDepth(snap.dimensions.depth);
        if (snap.dimensions.upperHeight) tvStore.setUpperHeight(snap.dimensions.upperHeight);
        tvStore.setMaterial(snap.material as typeof tvStore.material);
        tvStore.setFinish(snap.finish as typeof tvStore.finish);
      } else {
        cabinetStore.setWidth(snap.dimensions.width);
        cabinetStore.setHeight(snap.dimensions.height);
        cabinetStore.setDepth(snap.dimensions.depth);
        cabinetStore.setMaterial(snap.material as typeof cabinetStore.material);
        cabinetStore.setFinish(snap.finish as typeof cabinetStore.finish);
      }
      setHistoryIndex(targetIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      const snap = history[targetIndex];
      isInternalUpdate.current = true;
      if (isTV) {
        tvStore.setWidth(snap.dimensions.width);
        tvStore.setHeight(snap.dimensions.height);
        tvStore.setDepth(snap.dimensions.depth);
        if (snap.dimensions.upperHeight) tvStore.setUpperHeight(snap.dimensions.upperHeight);
        tvStore.setMaterial(snap.material as typeof tvStore.material);
        tvStore.setFinish(snap.finish as typeof tvStore.finish);
      } else {
        cabinetStore.setWidth(snap.dimensions.width);
        cabinetStore.setHeight(snap.dimensions.height);
        cabinetStore.setDepth(snap.dimensions.depth);
        cabinetStore.setMaterial(snap.material as typeof cabinetStore.material);
        cabinetStore.setFinish(snap.finish as typeof cabinetStore.finish);
      }
      setHistoryIndex(targetIndex);
    }
  };

  const currentPrice = isTV
    ? tvStore.priceBreakdown.totalPrice
    : cabinetStore.priceBreakdown.totalPrice;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-68px)] min-h-[680px] overflow-hidden bg-[#ded7cb] relative">
      {/* ========================================================= */}
      {/* SECTION A & B: 3D VIEWPORT (~58-62% height) + FLOATING CONTROLS */}
      {/* ========================================================= */}
      <div className="relative w-full h-[58vh] min-h-[360px] flex-shrink-0">
        {/* Floating Viewport Controls overlaid exactly per screenshot */}
        <FloatingViewportControls
          totalPrice={currentPrice}
          onOpenMenu={() => setIsMenuOpen(true)}
          onSave={() => setIsSavedModalOpen(true)}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          onOpenHelp={() => setIsHelpOpen(true)}
          onToggle2D={() => setIs2D(!is2D)}
          is2D={is2D}
          onOpenAR={() => setIsAROpen(true)}
        />

        {/* 3D Scene Viewport */}
        <ConfiguratorCanvas
          showDimensions={showDimensions}
          activeModel={activeModel}
          is2D={is2D}
          showHumanScale={true}
        />
      </div>

      {/* ========================================================= */}
      {/* SECTION C: HORIZONTAL PRODUCT TOOLS BAR (Directly below canvas) */}
      {/* ========================================================= */}
      <div className="w-full z-10 -mt-2 sm:-mt-3">
        <ProductToolsBar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          productType={activeModel}
        />
      </div>

      {/* ========================================================= */}
      {/* SECTION D: BOTTOM CONFIGURATION PANEL (Replaces left sidebar) */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col justify-end overflow-hidden z-10">
        <BottomConfigurationPanel
          activeCategory={activeCategory}
          productType={activeModel}
        />
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: MENU / PRODUCT SWITCHER MODAL */}
      {/* ========================================================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-extrabold text-stone-900 text-sm">
                Ürün Seçimi & Menü
              </h3>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setActiveModel("tv-stand");
                  setIsMenuOpen(false);
                }}
                className={`w-full p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  activeModel === "tv-stand"
                    ? "border-[#3498a7] bg-[#e5f5f7] text-[#196b77] font-bold"
                    : "border-stone-200 hover:border-stone-400 text-stone-700"
                }`}
              >
                <Tv className="w-5 h-5 text-[#3498a7]" />
                <div className="text-left">
                  <div className="text-xs font-bold">TV Duvar Ünitesi</div>
                  <div className="text-[10px] text-stone-500">
                    Parametrik TV Konsolu & Duvar Dolapları
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveModel("cabinet");
                  setIsMenuOpen(false);
                }}
                className={`w-full p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  activeModel === "cabinet"
                    ? "border-[#3498a7] bg-[#e5f5f7] text-[#196b77] font-bold"
                    : "border-stone-200 hover:border-stone-400 text-stone-700"
                }`}
              >
                <Box className="w-5 h-5 text-[#3498a7]" />
                <div className="text-left">
                  <div className="text-xs font-bold">Modüler Vitrin Dolabı</div>
                  <div className="text-[10px] text-stone-500">
                    Özel Ölçülü Kitaplık & Saklama Dolabı
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: HELP GUIDE MODAL */}
      {/* ========================================================= */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#3498a7]" />
                <h3 className="font-extrabold text-stone-900 text-sm">
                  {language === "tr" ? "3D Konfigüratör Rehberi" : "Configurator Guide"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#e5f5f7] text-[#196b77] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </div>
                <div>
                  <strong className="text-stone-900">3D Döndürme & Yakınlaştırma:</strong>{" "}
                  Modeli 360° döndürmek için sol tıkla sürükleyin, yakınlaştırmak için tekerleği kaydırın.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#e5f5f7] text-[#196b77] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </div>
                <div>
                  <strong className="text-stone-900">Boyutları Ayarlama:</strong> Alt
                  paneldeki kaydırıcı veya eksi/artı butonlarıyla genişlik, yükseklik ve derinliği gerçek zamanlı değiştirin.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#e5f5f7] text-[#196b77] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </div>
                <div>
                  <strong className="text-stone-900">Ölçek Referansı:</strong> Yanındaki 1.80m
                  boyutundaki figür mobilyanızın gerçek mekanınızdaki ölçeğini görmenizi sağlar.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#e5f5f7] text-[#196b77] font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  4
                </div>
                <div>
                  <strong className="text-stone-900">Canlı Fiyatlandırma:</strong> Sağ üstteki
                  fiyat KDV ve ücretsiz adrese teslimat dahil anlık güncellenir.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsHelpOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#3498a7] text-white font-bold text-xs shadow-sm"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: AR SIMULATOR MODAL */}
      {/* ========================================================= */}
      {isAROpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-100">
              <span className="font-extrabold text-stone-900 text-sm">
                Artırılmış Gerçeklik (AR)
              </span>
              <button
                type="button"
                onClick={() => setIsAROpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl flex flex-col items-center gap-3">
              <div className="w-36 h-36 bg-white border border-stone-300 rounded-xl flex items-center justify-center shadow-inner">
                <QrCode className="w-28 h-28 text-stone-800" />
              </div>
              <p className="text-xs text-stone-600 leading-snug">
                Mobil cihazınızın kamerasıyla QR kodu taratarak mobilyayı kendi odanızda gerçek boyutlarıyla görüntüleyin.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAROpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#3498a7] text-white font-bold text-xs shadow-sm"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: SAVED DESIGNS MODAL */}
      {/* ========================================================= */}
      <SavedDesignsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
      />
    </div>
  );
};
