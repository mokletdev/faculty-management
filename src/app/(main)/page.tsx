import FAQSection from "@/components/landing-page/sections/faq";
import HeroSection from "@/components/landing-page/sections/hero";
import IntroductionSection from "@/components/landing-page/sections/introduction";
import WhySection from "@/components/landing-page/sections/why";

export default async function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-12 text-black">
      <HeroSection />
      <WhySection />
      <IntroductionSection />
      <FAQSection />
    </main>
  );
}
