import { Navigation } from "@/components/navigation";
import { HeroSection2 } from "@/components/hero-section";
import { ProblemSection2 } from "@/components/problem-section";
import { HowItWorks2 } from "@/components/how-it-works";
import { BenefitsSection2 } from "@/components/benefits-section";
import { PricingSection2 } from "@/components/pricing-section";
import { FAQSection } from "@/components/faq-section";
import { CTASection2 } from "@/components/cta-section";
import { Footer2 } from "@/components/footer";
import AnalyzingSection from "@/components/analyzing-section";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection2 />
      <ProblemSection2 />
      <HowItWorks2 />
      <BenefitsSection2 />
      <AnalyzingSection/>
      <PricingSection2 />
      {/* <FAQSection /> */}
      <CTASection2 />
      <Footer2 />
    </div>
  );
};

export default Index;
