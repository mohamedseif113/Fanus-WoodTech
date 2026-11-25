/**
 * /storage-bed-preview
 * ─────────────────────────────────────────────────────────────────────────────
 * Phase 1 preview route for the TEK KİŞİLİK YATAY BAZA 3D model.
 *
 * ROUTE:  http://localhost:3000/storage-bed-preview
 *
 * This is a minimal read-only preview page.
 * It does NOT replace or modify the existing /configurator route.
 * Phase 2 will evolve this into a full interactive configurator page.
 *
 * CHANGE LOG
 * ─────────────
 * 2026-11-25  Phase 1 – initial static preview (assembled model only)
 */

import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import StorageBedPreviewClient from "./StorageBedPreviewClient";

export const metadata: Metadata = {
  title: "Tek Kişilik Yatay Baza – 3D Önizleme | Fanus WoodTech",
  description:
    "TEK KİŞİLİK YATAY BAZA depolama bazası için Phase 1 3D model önizlemesi. " +
    "Boyutlar ve malzemeler henüz üretici onayı beklemektedir.",
};

export default function StorageBedPreviewPage() {
  return (
    <main className="flex-1 flex flex-col">
      <Suspense
        fallback={
          <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ded7cb] gap-3">
            <Loader2 className="w-8 h-8 text-[#3498a7] animate-spin" />
            <span className="text-xs font-semibold text-stone-700">
              Baza 3D Modeli Yükleniyor...
            </span>
          </div>
        }
      >
        <StorageBedPreviewClient />
      </Suspense>
    </main>
  );
}
