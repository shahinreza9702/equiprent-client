
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedEquipmentSection } from "@/components/home/featured-equipment/featured-equipment-section";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <FeaturedEquipmentSection />
      </main>
    </>
  );
}
