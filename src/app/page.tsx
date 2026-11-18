
import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedEquipmentSection } from "@/components/home/featured-equipment/featured-equipment-section";
import { CategoriesSection } from "@/components/home/categories/categories-section";
import { WhyChooseUsSection } from "@/components/home/why-choose-us/why-choose-us-section";
import { CustomerReviewsSection } from "@/components/home/customer-reviews/customer-reviews-section";
import { HowItWorksSection } from "@/components/home/how-it-works/how-it-works-section";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        <HeroSection />
        <CategoriesSection />
        <FeaturedEquipmentSection />
        <WhyChooseUsSection />
        <CustomerReviewsSection />
        <HowItWorksSection />
      </main>
    </>
  );
}
