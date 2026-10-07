import { HeroSection } from "@/components/landing/HeroSection";
import { MarketPreview } from "@/components/landing/MarketPreview";
import { MarketsSection } from "@/components/landing/MarketsSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SecuritySection } from "@/components/landing/SecuritySection";
import { CertificateSection } from "@/components/landing/CertificateSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050912] text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Market Preview */}
      <MarketPreview />

      {/* Markets */}
      <MarketsSection />

      {/* Services */}
      <ServicesSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Security & Control */}
      <SecuritySection />

      {/* Corporate Certificate */}
      <CertificateSection />

      {/* Frequently Asked Questions */}
      <FAQSection />

      {/* Final Call To Action */}
      <FinalCTA />
    </main>
  );
}