import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import About from "@/components/landing/About";
import HowItWorks from "@/components/landing/HowItWorks";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white selection:bg-blue-200 selection:text-blue-900">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        <About />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}