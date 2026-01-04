import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Generator from "@/components/Generator";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <HowItWorks />
      <Generator />
      <Features />
    </main>
  );
}
