import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

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
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" translate="no" className="notranslate" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans min-h-screen flex flex-col bg-[#faf8f5] text-[#1a1918] antialiased notranslate`}
        translate="no"
        suppressHydrationWarning
      >
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}
