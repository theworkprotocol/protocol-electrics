import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTrace from "../components/SectionTrace";
import { Reveal } from "../components/Reveal";
import BrandStrip from "../components/BrandStrip";

export const metadata: Metadata = {
  title: "Electrical Services",
  description:
    "Electrical contracting, solar installation, EV charger installation, air conditioning, and maintenance on the Sunshine Coast. QBCC licensed, CEC accredited, ARCtick certified.",
  openGraph: {
    title: "Electrical Services | Protocol Electrics",
    description:
      "Electrical contracting, solar installation, EV charger installation, air conditioning, and maintenance on the Sunshine Coast. QBCC licensed, CEC accredited, ARCtick certified.",
    url: "https://www.protocolelectrics.com.au/services",
  },
};

const services = [
  {
    title: "Electrical Contracting",
    description:
      "Full-scope residential electrical from new builds to rewires. Every install is clean, correct, and signed off with a Form 4 Certificate of Test.",
    detail: [
      "New builds & extensions",
      "Full & partial rewires",
      "Switchboard upgrades",
      "Safety switch (RCD) installation",
      "Lighting & power circuits",
      "AS/NZS 3017 Testing & Inspection",
    ],
    icon: "⚡",
    tag: "Core Service",
  },
  {
    title: "Solar Installation",
    description:
      "CEC-accredited solar PV and battery systems engineered for Sunshine Coast conditions. We design for long-term performance, not just the lowest panel count.",
    detail: [
      "Residential solar PV systems",
      "Battery storage (Powerwall, BYD, etc.)",
      "Inverter upgrades & replacements",
      "System performance checks",
      "DNSP (Energex) applications handled",
      "STC rebate processing",
    ],
    icon: "☀️",
    tag: "High Demand",
  },
  {
    title: "EV Charger Installation",
    description:
      "Dedicated home charging circuits installed cleanly and correctly. Fully AS 61851 compliant, with proper circuit protection and tidy cable management.",
    detail: [
      "Home EV charger installation",
      "Dedicated circuit & switchboard work",
      "Smart charger commissioning",
      "Load management setup",
      "Future-proofed wiring for upgrades",
      "All major charger brands supported",
    ],
    icon: "🔌",
    tag: "Growing Fast",
  },
  {
    title: "Air Conditioning",
    description:
      "ARCtick licensed installation and commissioning of split systems and ducted AC. Installed to manufacturer spec, working from day one.",
    detail: [
      "Split system installation",
      "Ducted system installation",
      "Multi-head systems",
      "Electrical supply & circuit work",
      "Commissioning & handover",
      "Warranty-compliant installation",
    ],
    icon: "❄️",
    tag: "Popular",
  },
  {
    title: "Maintenance",
    description:
      "Reactive fault-finding and scheduled maintenance to keep your property safe and compliant. Fast response, no runaround — just the fix.",
    detail: [
      "Fault finding & emergency repairs",
      "Safety switch testing",
      "Smoke alarm compliance",
      "Rental property inspections",
      "Scheduled preventative maintenance",
      "Switchboard health checks",
    ],
    icon: "🔧",
    tag: "Always On",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ── Header ── */}
        <section className="relative border-b border-white/5 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(13,27,42,0.95)_0%,_#0A0A0A_65%)]" />
          <div className="animate-pulse-glow absolute -top-20 left-1/3 w-[400px] h-[400px] bg-[#F5A623]/4 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                Services
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">What we do,</span>
              <br />
              <span className="text-gradient">how we do it.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              Every service is delivered to the same standard — the highest one.
            </p>
            <SectionTrace className="mt-8" />
          </div>
        </section>

        {/* ── Services list ── */}
        <section className="max-w-7xl mx-auto px-6 py-20 space-y-px">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 60}>
            <div
              className="group relative border border-white/5 hover:border-[#F5A623]/20 bg-[#0A0A0A] hover:bg-[#0f1318] transition-all duration-300 p-8 md:p-12"
            >
              {/* Left accent line on hover */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#F5A623] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="shrink-0 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-sm border border-white/8 flex items-center justify-center text-2xl group-hover:border-[#F5A623]/30 transition-colors">
                    {s.icon}
                  </div>
                  <span className="text-xs font-bold text-[#6B6B6B]/60 tracking-widest font-mono">
                    0{i + 1}
                  </span>
                </div>

                <div className="flex-1 grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-xl font-bold text-[#F0EDE8] group-hover:text-gradient transition-all">
                        {s.title}
                      </h2>
                      <span className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] border border-white/8 px-2 py-0.5 rounded-full group-hover:border-[#F5A623]/20 group-hover:text-[#F5A623]/70 transition-colors">
                        {s.tag}
                      </span>
                    </div>
                    <p className="text-[#6B6B6B] text-sm leading-relaxed">{s.description}</p>
                  </div>

                  <ul className="space-y-2.5">
                    {s.detail.map((d) => (
                      <li key={d} className="flex items-center gap-3 text-sm text-[#6B6B6B]">
                        <span className="w-1 h-1 rounded-full bg-[#F5A623]/60 shrink-0 group-hover:bg-[#F5A623] transition-colors" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            </Reveal>
          ))}
        </section>

        {/* ── Brand Strip ── */}
        <BrandStrip />

        {/* ── CTA ── */}
        <section className="relative border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-[#0D1B2A]/60" />
          <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#F5A623]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#F0EDE8] mb-3">
                Not sure which service you need?
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md">
                Tell us about your project and we&apos;ll advise on the best approach and give you a straight quote.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-glow relative shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]/40" />
              Get an Estimate
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
