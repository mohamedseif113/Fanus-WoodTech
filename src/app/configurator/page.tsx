import { ConfiguratorLayout } from "@/components/configurator/ConfiguratorLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "3D Stüdyo & Konfigüratör – Fanus WoodTech 3D",
  description:
    "Gelişmiş Three.js 3D konfigüratör ile kendi mobilyanızı tasarlayın, patlatılmış görünümde parçaları inceleyin ve canlı fiyatlandırma alın.",
};

export default function ConfiguratorPage() {
  return (
    <main className="flex-1 flex flex-col">
      <ConfiguratorLayout />
    </main>
  );
}
