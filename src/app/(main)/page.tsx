import HeroSection from "@/components/landing-page/sections/hero";
import { auth } from "@/server/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center text-white">
      <HeroSection />
    </main>
  );
}
