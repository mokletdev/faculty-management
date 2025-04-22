import FAQSection from "@/components/landing-page/sections/faq";
import HeroSection from "@/components/landing-page/sections/hero";
import IntroductionSection from "@/components/landing-page/sections/introduction";
import WhySection from "@/components/landing-page/sections/why";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center text-black">
      <HeroSection />
      <WhySection />
      <IntroductionSection />
      <FAQSection />
    </main>
  );
}
