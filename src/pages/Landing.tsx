import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/landing/Navbar";
import { BackgroundVideo } from "@/components/landing/BackgroundVideo";
import { LogoMarquee } from "@/components/landing/LogoMarquee";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background video behind everything */}
      <BackgroundVideo />

      {/* Hero content */}
      <section className="relative z-10 flex min-h-screen flex-col overflow-visible">
        <Navbar />

        {/* Blurred overlay shape, centered behind content */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[527px] w-[984px] -translate-x-1/2 -translate-y-1/2 bg-gray-950 opacity-90 blur-[82px]" />

        <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full liquid-glass px-4 py-1.5 text-xs font-medium text-foreground/80">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Orchestrated &amp; governed on the UiPath Platform
          </div>

          <h1 className="font-display text-[clamp(64px,13vw,220px)] font-normal leading-[1.02] tracking-[-0.024em]">
            <span className="text-foreground">Power </span>
            <span className="gradient-text">AP</span>
          </h1>

          <p className="mt-[9px] max-w-md text-lg leading-8 text-hero-sub opacity-80">
            The most capable agentic accounts payable ever deployed — ingest,
            validate, and reconcile every invoice end-to-end, with humans in
            charge at every decision.
          </p>

          <div className="mt-[25px] flex items-center gap-3">
            <Link to="/app">
              <Button variant="heroSecondary" className="px-[29px] py-[24px]">
                Open the Console
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <LogoMarquee />
      </section>
    </div>
  );
}
