import { FeaturesSection } from "@/components/landing/features-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { LandingShell } from "@/components/landing/landing-shell";
import { TemplatesSection } from "@/components/landing/templates-section";

export function LandingPage() {
  return (
    <LandingShell>
      <main className="flex-1 overflow-x-hidden bg-white text-slate-900">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TemplatesSection />
        <FinalCtaSection />
      </main>
    </LandingShell>
  );
}
