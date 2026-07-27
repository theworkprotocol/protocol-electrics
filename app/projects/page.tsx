import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTrace from "../components/SectionTrace";
import { Reveal } from "../components/Reveal";
import { StatCounterCompact } from "../components/StatCounter";

export const metadata: Metadata = {
  title: "What We Can Do",
  description:
    "Example scopes of residential electrical, EV charger, and air conditioning work on the Sunshine Coast — what's included and the standard it's done to.",
  openGraph: {
    title: "What We Can Do | Protocol Electrics",
    description:
      "Example scopes of residential electrical, EV charger, and air conditioning work on the Sunshine Coast — what's included and the standard it's done to.",
    url: "https://www.protocolelectrics.com.au/projects",
  },
};

const projects = [
  {
    title: "Switchboard Upgrade + Safety Switches",
    scope: "Typical scope · half to full day",
    category: "Electrical Contracting",
    description:
      "Ageing rewirable fuse boards replaced with a modern Clipsal switchboard. Circuits upgraded with RCD protection and smoke alarms brought to QLD compliance — signed off with a Form 4 Certificate of Test.",
    specs: ["Clipsal switchboard", "Type 1 RCD protection", "Smoke alarm compliance", "Form 4 sign-off", "All circuits labelled & tested"],
    tag: "Electrical",
    icon: "⚡",
  },
  {
    title: "Dual EV Charger Install",
    scope: "Typical scope · 1 day install",
    category: "EV Charging",
    description:
      "One or two wall connectors installed with a dedicated sub-board where needed. Clean cable routing through the wall cavity — no visible conduit runs — and load management configured for peak household demand.",
    specs: ["Tesla Wall Connector / Zappi", "Dedicated 3-phase sub-board", "Concealed cable routing", "Load management enabled", "AS 61851 compliant"],
    tag: "EV Charging",
    icon: "🔌",
  },
  {
    title: "Ducted AC — New Build",
    scope: "Typical scope · new build or major reno",
    category: "Air Conditioning",
    description:
      "Ducted systems supplied and installed for new builds and major renovations. All electrical supply work, commissioning, and handover included, with per-room zoning on a smart controller.",
    specs: ["Daikin 14kW ducted", "4 zones with smart control", "Full electrical supply", "Commissioning & handover", "ARCtick certified install"],
    tag: "Air Conditioning",
    icon: "❄️",
  },
  {
    title: "Rental Property — Full Maintenance",
    scope: "Typical scope · scheduled annually",
    category: "Maintenance",
    description:
      "Annual electrical inspections for homeowners, landlords, and property managers. Safety switch testing, smoke alarm compliance, and fault-finding — with written reports for your records.",
    specs: ["Whole-home inspection", "Safety switch testing", "Smoke alarm compliance", "Fault-finding included", "Written inspection report"],
    tag: "Maintenance",
    icon: "🔧",
  },
];

const tagColours: Record<string, string> = {
  "Electrical": "text-blue-400 border-blue-400/20 bg-blue-400/5",
  "EV Charging": "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  "Air Conditioning": "text-sky-400 border-sky-400/20 bg-sky-400/5",
  "Maintenance": "text-[#6B6B6B] border-white/10 bg-white/3",
};

export default function ProjectsPage() {
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
                What We Can Do
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">The standard</span>
              <br />
              <span className="text-gradient">we build to.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              Example scopes of the residential work we specialise in — what's included, how it's done, and the standard you can expect. Every job quoted as a fixed price.
            </p>
            <SectionTrace className="mt-8" />
          </div>
        </section>

        {/* ── Projects grid ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 70}>
              <div className="card-gradient group p-8 md:p-10 h-full">
                {/* Top row */}
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div className="w-11 h-11 rounded-sm border border-white/8 flex items-center justify-center text-xl group-hover:border-[#F5A623]/30 transition-colors">
                    {p.icon}
                  </div>
                  <span className={`text-xs font-medium tracking-widest uppercase px-2.5 py-1 rounded-full border ${tagColours[p.tag]}`}>
                    {p.tag}
                  </span>
                </div>

                {/* Title + location */}
                <h2 className="text-lg font-bold text-[#F0EDE8] mb-1 group-hover:text-gradient transition-all">
                  {p.title}
                </h2>
                <p className="text-xs text-[#F5A623]/70 tracking-wide mb-4 flex items-center gap-1.5">
                  <span className="inline-block w-3 h-px bg-[#F5A623]/40" />
                  {p.scope}
                </p>

                {/* Description */}
                <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">{p.description}</p>

                {/* Specs */}
                <ul className="space-y-1.5 border-t border-white/5 pt-5">
                  {p.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2.5 text-xs text-[#6B6B6B]">
                      <span className="w-1 h-1 rounded-full bg-[#F5A623]/50 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0D1B2A]/40" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
              {[
                { value: "10", suffix: "", label: "Years Experience" },
                { value: "24", suffix: "hr", label: "Quote Turnaround" },
                { value: "100", suffix: "%", label: "Fixed-Price Quotes" },
                { value: "100", suffix: "%", label: "Residential Focus" },
              ].map((s) => (
                <StatCounterCompact key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden border-t border-white/5">
          <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#F5A623]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#F0EDE8] mb-3">
                Want work like this at your place?
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md">
                Get an instant estimate on your job and we&apos;ll have a fixed-price quote back to you within 24 hours.
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
