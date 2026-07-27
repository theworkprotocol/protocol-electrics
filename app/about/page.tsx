import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTrace from "../components/SectionTrace";
import { Reveal } from "../components/Reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ten years in the trade. QBCC licensed, CEC accredited, ARCtick certified. Protocol Electrics is a small, focused electrical contracting business on the Sunshine Coast built on doing every job properly.",
  openGraph: {
    title: "About | Protocol Electrics",
    description:
      "Ten years in the trade. QBCC licensed, CEC accredited, ARCtick certified. Protocol Electrics is a small, focused electrical contracting business on the Sunshine Coast built on doing every job properly.",
    url: "https://www.protocolelectrics.com.au/about",
  },
};

const credentials = [
  { label: "Experience", value: "10 Years in the Trade" },
  { label: "Licence", value: "QBCC Licensed Electrical Contractor" },
  { label: "Solar", value: "CEC Accredited Solar Installer" },
  { label: "AC & Refrigeration", value: "ARCtick Licensed" },
  { label: "Location", value: "Sunshine Coast, QLD" },
];

const values = [
  {
    title: "Small by design.",
    description:
      "Protocol Electrics isn't trying to be the biggest electrical firm around. Staying small means every job gets the attention it deserves — no passing work down to someone who doesn't care as much.",
  },
  {
    title: "Specialists, not generalists.",
    description:
      "A decade of hands-on experience focused on the work that matters most: solar, air conditioning, and maintenance. Deep knowledge beats broad averages every time.",
  },
  {
    title: "Done right or not done.",
    description:
      "No shortcuts. No half-measures. If a job can't be done to the standard it should be, we'll say so. That honesty is the reason clients come back.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ── Header ── */}
        <section className="relative border-b border-white/5 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(13,27,42,0.95)_0%,_#0A0A0A_65%)]" />
          <div className="animate-pulse-glow absolute bottom-0 right-1/3 w-[400px] h-[300px] bg-[#F5A623]/4 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                About
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">Built on ten years</span>
              <br />
              <span className="text-gradient">of doing it properly.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              Protocol Electrics exists because good electrical work shouldn&apos;t be hard to find.
            </p>
            <SectionTrace className="mt-8" />
          </div>
        </section>

        {/* ── Story + Credentials ── */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-start">
          <Reveal className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#F5A623]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
                The Story
              </span>
            </div>
            <p className="text-[#F0EDE8] text-lg leading-relaxed">
              After ten years working in the trade, the pattern was obvious — most electrical businesses either grew too fast and lost quality, or stayed small but didn&apos;t take their work seriously enough.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed">
              Protocol Electrics was started to prove there&apos;s a third way. A tight, focused operation that specialises in the work that genuinely improves people&apos;s lives — solar, climate control, and reliable maintenance — and does every single job to a standard the client can depend on for years.
            </p>
            <p className="text-[#6B6B6B] leading-relaxed">
              No army of subcontractors. No sales targets. Just skilled work, done right.
            </p>
          </Reveal>

          {/* Credentials panel */}
          <Reveal delay={120} className="border border-white/5 divide-y divide-white/5 rounded-sm overflow-hidden">
            {credentials.map((c, i) => (
              <div
                key={i}
                className="px-6 py-5 flex items-center justify-between gap-4 hover:bg-white/2 transition-colors"
              >
                <span className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B]">
                  {c.label}
                </span>
                <span className="text-sm text-[#F0EDE8] text-right font-medium">{c.value}</span>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ── Photo gallery ── */}
        <section className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#F5A623]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
                The Work, Up Close
              </span>
            </div>
            <p className="text-[#6B6B6B] text-sm max-w-2xl leading-relaxed mb-12">
              Real jobs, real finishes. No stock photos — everything here is our own work on the Sunshine Coast.
            </p>

            {/*
              PHOTO PLACEHOLDERS — to swap in real photos:
              1. Drop images into /public/photos/ (e.g. about-1.jpg)
              2. Replace each placeholder div with:
                 <Image src="/photos/about-1.jpg" alt="..." fill className="object-cover" />
                 (add `import Image from "next/image"` at the top and `relative` to the wrapper)
            */}
            <div className="grid sm:grid-cols-3 gap-px bg-white/5">
              {[
                { label: "On the tools", hint: "Portrait / at work" },
                { label: "Recent install", hint: "Finished switchboard or solar" },
                { label: "Clean finishes", hint: "Detail shot of your best work" },
              ].map((p, i) => (
                <Reveal key={p.label} delay={i * 90}>
                  <div className="aspect-[4/3] bg-[#0D0D0D] border border-dashed border-white/10 flex flex-col items-center justify-center gap-3 group hover:border-[#F5A623]/30 transition-colors">
                    <div className="w-12 h-12 rounded-sm border border-white/8 flex items-center justify-center text-xl text-[#6B6B6B] group-hover:border-[#F5A623]/30 transition-colors">
                      📷
                    </div>
                    <div className="text-center px-4">
                      <p className="text-sm font-semibold text-[#F0EDE8]">{p.label}</p>
                      <p className="text-xs text-[#6B6B6B] mt-1">{p.hint}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0D1B2A]/30" />
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <div className="flex items-center gap-3 mb-12">
              <span className="w-8 h-px bg-[#F5A623]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
                How We Work
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-white/5">
              {values.map((v, i) => (
                <Reveal key={i} delay={i * 90}>
                <div className="card-gradient p-8 h-full">
                  <span className="text-xs font-bold text-[#F5A623]/50 tracking-widest mb-4 block font-mono">
                    0{i + 1}
                  </span>
                  <div className="w-6 h-px bg-[#F5A623]/30 mb-5" />
                  <h3 className="text-lg font-bold text-[#F0EDE8] mb-3">{v.title}</h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{v.description}</p>
                </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Specialisms ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-px bg-[#F5A623]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
              Where We Specialise
            </span>
          </div>
          <p className="text-[#6B6B6B] text-sm max-w-2xl leading-relaxed mb-12">
            Ten years in the trade teaches you where your skills are sharpest. These are the areas where Protocol Electrics consistently delivers the best outcomes for clients.
          </p>

          <div className="grid sm:grid-cols-3 gap-px bg-white/5">
            {[
              { icon: "☀️", title: "Solar & Battery", sub: "PV systems designed to last and perform on the Sunshine Coast" },
              { icon: "❄️", title: "Air Conditioning", sub: "Installation done cleanly, commissioned properly, ARCtick certified" },
              { icon: "🔧", title: "Maintenance", sub: "Reliable, responsive, no-nonsense fault-finding and upkeep" },
            ].map((s) => (
              <div key={s.title} className="card-gradient group p-8">
                <div className="w-11 h-11 rounded-sm border border-white/8 flex items-center justify-center text-xl mb-5 group-hover:border-[#F5A623]/30 transition-colors">
                  {s.icon}
                </div>
                <h3 className="text-base font-semibold text-[#F0EDE8] mb-2 group-hover:text-gradient transition-all">
                  {s.title}
                </h3>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">{s.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0D1B2A]/60" />
          <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#F5A623]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#F0EDE8] mb-3">
                Work with someone who cares about the finish.
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md">
                Get in touch and tell us what you need. We&apos;ll give you a straight answer and a fair quote.
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
