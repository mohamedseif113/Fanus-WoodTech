import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Promo3DSection } from "@/components/home/Promo3DSection";
import { ManufacturingSection } from "@/components/home/ManufacturingSection";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <HowItWorks />
      <Promo3DSection />
      <ManufacturingSection />
    </main>
  );
}
