import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Reveal } from "../components/Reveal";

export const metadata: Metadata = {
  title: "Service Areas",
  description:
    "Protocol Electrics services the full Sunshine Coast — from Noosa in the north to Caloundra in the south. Electrician, solar installer, EV charger, and air conditioning across all major suburbs.",
  openGraph: {
    title: "Service Areas | Protocol Electrics",
    description:
      "Protocol Electrics services the full Sunshine Coast — from Noosa in the north to Caloundra in the south.",
    url: "https://www.protocolelectrics.com.au/locations",
  },
};

const suburbs = [
  { slug: "noosa", name: "Noosa", region: "Noosa Heads & Noosaville", icon: "🌊" },
  { slug: "buderim", name: "Buderim", region: "Buderim & Mountain Creek", icon: "☀️" },
  { slug: "maroochydore", name: "Maroochydore", region: "Maroochydore & Alexandra Headland", icon: "⚡" },
  { slug: "mooloolaba", name: "Mooloolaba", region: "Mooloolaba & Kawana", icon: "🔌" },
  { slug: "sippy-downs", name: "Sippy Downs", region: "Sippy Downs & Palmview", icon: "🏗️" },
  { slug: "coolum-beach", name: "Coolum Beach", region: "Coolum Beach & Peregian", icon: "❄️" },
];

export default function LocationsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ── Header ── */}
        <section className="relative border-b border-white/5 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_-20%,_rgba(13,27,42,0.95)_0%,_#0A0A0A_65%)]" />
          <div className="animate-pulse-glow absolute top-0 right-0 w-[500px] h-[400px] bg-[#F5A623]/3 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                Service Areas
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">Sunshine Coast,</span>
              <br />
              <span className="text-gradient">covered end to end.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              From Noosa in the north to Caloundra in the south. We&apos;re local, licensed, and in your area.
            </p>
          </div>
        </section>

        {/* ── Suburb cards ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {suburbs.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70}>
                <Link href={`/locations/${s.slug}`} className="block h-full">
                  <div className="card-gradient group p-8 h-full hover:bg-white/3 transition-colors">
                    <div className="w-11 h-11 rounded-sm border border-white/8 flex items-center justify-center text-xl mb-5 group-hover:border-[#F5A623]/30 transition-colors">
                      {s.icon}
                    </div>
                    <h2 className="text-lg font-bold text-[#F0EDE8] mb-1 group-hover:text-gradient transition-all">
                      {s.name}
                    </h2>
                    <p className="text-xs text-[#6B6B6B] mb-4">{s.region}</p>
                    <span className="text-xs text-[#F5A623]/70 tracking-wide flex items-center gap-1.5">
                      View services
                      <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden border-t border-white/5">
          <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#F5A623]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#F0EDE8] mb-3">
                Don&apos;t see your suburb?
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md">
                We cover all of the Sunshine Coast and surrounding areas. Get in touch and we&apos;ll let you know if we can help.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-glow relative shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]/40" />
              Get in Touch
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
