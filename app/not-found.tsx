import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SectionTrace from "./components/SectionTrace";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="animate-pulse-glow absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#F5A623]/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-lg w-full text-center space-y-6">
          <p className="font-mono text-xs tracking-widest uppercase text-[#F5A623]">
            Fault code 404
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-[#F0EDE8]">
            Circuit <span className="text-gradient">not found.</span>
          </h1>
          <p className="text-[#6B6B6B] leading-relaxed">
            This page doesn&apos;t exist — the wire leads nowhere. Let&apos;s get you back to a live circuit.
          </p>
          <div className="flex justify-center">
            <SectionTrace className="max-w-xs" />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/"
              className="btn-glow relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
            >
              Back to Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-[#6B6B6B] hover:text-[#F0EDE8] hover:border-white/20 font-semibold text-sm tracking-wide transition-colors rounded-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
