import { Suspense } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Generator from "@/components/Generator";
import HowItWorks from "@/components/HowItWorks";
import Feedback from "@/components/Feedback";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />
      <HowItWorks />
      <Suspense fallback={<div className="py-12 text-center">Loading Generator...</div>}>
        <Generator />
      </Suspense>
      <Features />
      <Feedback />
    </main>
  );
}
