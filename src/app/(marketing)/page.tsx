import { HeroSection } from "@/features/landing-page/HeroSection";
import { SocialProofBar } from "@/features/landing-page/SocialProofBar";
import { FeaturesGrid } from "@/features/landing-page/FeaturesGrid";
import { HowItWorks } from "@/features/landing-page/HowItWorks";
import { StatsSection } from "@/features/landing-page/StatsSection";
import { TestimonialsSection } from "@/features/landing-page/TestimonialsSection";
import { PricingSection } from "@/features/landing-page/PricingSection";
import { FaqSection } from "@/features/landing-page/FaqSection";
import { FooterCta } from "@/features/landing-page/FooterCta";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProofBar />
      <FeaturesGrid />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <PricingSection />
      <FaqSection />
      <FooterCta />
    </>
  );
}
