import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "3D Stüdyo & Konfigüratör – Fanus WoodTech 3D",
  description:
    "Gelişmiş Three.js 3D konfigüratör ile kendi mobilyanızı tasarlayın, patlatılmış görünümde parçaları inceleyin ve canlı fiyatlandırma alın.",
};

export default function ConfiguratorPage() {
  return (
    <main className="flex-1 flex flex-col">
      <Suspense
        fallback={
          <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ded7cb] gap-3">
            <Loader2 className="w-8 h-8 text-[#3498a7] animate-spin" />
            <span className="text-xs font-semibold text-stone-700">
              3D Konfigüratör Yükleniyor...
            </span>
          </div>
        }
      >
        <ConfiguratorLayout />
      </Suspense>
    </main>
  );
}
