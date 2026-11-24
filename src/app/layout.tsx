import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: "Fanus WoodTech 3D – İnteraktif Mobilya Stüdyosu & 3D Konfigüratör",
  description:
    "Mekanınıza özel ahşap dolap ve vitrin sistemlerini milimetrik 3D konfigüratör ile tasarlayın, canlı fiyatlandırın ve CNC üretim standartlarında sipariş verin.",
  keywords: [
    "3D furniture configurator",
    "ahşap mobilya tasarımı",
    "modüler vitrin",
    "interaktif 3D dolap",
    "CNC mobilya üretimi",
    "Fanus WoodTech",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1a1918] antialiased">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
