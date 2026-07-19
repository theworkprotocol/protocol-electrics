import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Reveal } from "./components/Reveal";
import { StatCounter } from "./components/StatCounter";
import BrandStrip from "./components/BrandStrip";

export const metadata: Metadata = {
  title: "Protocol Electrics | Sunshine Coast Electrician",
  description:
    "Premium residential electrical contracting on the Sunshine Coast, QLD. Electrical, solar, EV charger installation, and air conditioning. QBCC licensed. 10 years experience.",
  openGraph: {
    title: "Protocol Electrics | Sunshine Coast Electrician",
    description:
      "Premium residential electrical contracting on the Sunshine Coast, QLD. Electrical, solar, EV charger installation, and air conditioning. QBCC licensed. 10 years experience.",
    url: "https://www.protocolelectrics.com.au",
  },
};

const services = [
  {
    title: "Electrical Contracting",
    description: "Full-scope residential electrical — from new builds to rewires. Wired right, certified, first time.",
    icon: "⚡",
    tag: "Core Service",
  },
  {
    title: "Solar Installation",
    description: "CEC-accredited solar PV and battery systems, engineered for Sunshine Coast conditions.",
    icon: "☀️",
    tag: "High Demand",
  },
  {
    title: "EV Charger Installation",
    description: "Dedicated home charging circuits with clean install and full AS 61851 compliance.",
    icon: "🔌",
    tag: "Growing Fast",
  },
  {
    title: "Maintenance",
    description: "Reactive fault-finding and scheduled maintenance. Fast response, no runaround.",
    icon: "🔧",
    tag: "Always On",
  },
];

const stats = [
  { value: "10", suffix: "yrs", label: "In the Trade" },
  { value: "100", suffix: "%", label: "Quality Guaranteed" },
  { value: "0", suffix: "", label: "Shortcuts Taken" },
];

const process = [
  { step: "01", title: "Describe your job", body: "Fill in the booking form. The more detail, the better the estimate." },
  { step: "02", title: "Instant AI estimate", body: "Our estimator gives you a ballpark immediately — no waiting around." },
  { step: "03", title: "Confirmed quote", body: "We review and come back with a fixed, itemised quote within 24 hours." },
  { step: "04", title: "Work gets done", body: "Scheduled, completed to standard, and signed off with a Form 4." },
];

const testimonials = [
  {
    quote: "The solar install was immaculate — panels aligned perfectly, conduit runs hidden, and the inverter wiring is clean enough to photograph. They handled all the STC rebate paperwork too, which made a real difference. Couldn't be happier with how the system has been performing.",
    name: "James T.",
    location: "Buderim",
    service: "Solar Installation",
  },
  {
    quote: "I needed my switchboard upgraded before settlement and was worried about timing. They arrived on time, worked cleanly — not a speck of dust left behind — and had the Form 4 certificate in my hands the same afternoon. Genuinely impressive from start to finish.",
    name: "Michelle R.",
    location: "Noosa",
    service: "Switchboard Upgrade",
  },
  {
    quote: "We had a Tesla Wall Connector installed in our garage and the cable routing is absolutely invisible. They ran it inside the wall cavity and terminated it perfectly. You'd never know it wasn't part of the original build. Fast, tidy, and zero fuss.",
    name: "David & Sarah K.",
    location: "Mooloolaba",
    service: "EV Charger Installation",
  },
  {
    quote: "Three other sparks quoted the AC install but said it'd be a two-day job. Protocol had it done in a single morning, commissioned it on-site, and it cooled the room first go. No return visits, no dramas. That's the way a trade job should go.",
    name: "Tom W.",
    location: "Maroochydore",
    service: "Split System A/C",
  },
  {
    quote: "Half the house lost power on a Sunday and I expected to wait days. They were at my door within two hours, found a failed circuit breaker causing intermittent faults, and had everything restored before dinner. Fast diagnosis, no guesswork, honest pricing.",
    name: "Karen B.",
    location: "Sippy Downs",
    service: "Fault Finding",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">

        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,_rgba(13,27,42,0.9)_0%,_transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_100%_50%,_rgba(245,166,35,0.04)_0%,_transparent_70%)]" />
          <div className="animate-pulse-glow absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#F5A623]/4 rounded-full blur-[100px] pointer-events-none" />
          <div className="animate-pulse-glow delay-300 absolute bottom-1/3 left-1/3 w-[300px] h-[300px] bg-[#0D1B2A]/80 rounded-full blur-[80px] pointer-events-none" />

          {/* Circuit trace — animated current flowing through the board */}
          <svg
            className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-[560px] h-[560px] pointer-events-none hidden lg:block opacity-70"
            viewBox="0 0 560 560"
            fill="none"
            aria-hidden="true"
          >
            {/* Static faint traces */}
            <g stroke="rgba(245,166,35,0.12)" strokeWidth="1.5">
              <path d="M 40,120 H 240 L 300,180 V 300 L 360,360 H 520" />
              <path d="M 40,240 H 180 L 240,300 V 420 L 300,480 H 460" />
              <path d="M 120,40 V 160 L 180,220 H 320 L 380,160 V 40" />
            </g>
            {/* Animated flowing current */}
            <g stroke="rgba(245,166,35,0.55)" strokeWidth="1.5" className="circuit-path">
              <path d="M 40,120 H 240 L 300,180 V 300 L 360,360 H 520" />
            </g>
            <g stroke="rgba(245,166,35,0.3)" strokeWidth="1.5" className="circuit-path" style={{ animationDelay: "0.7s" }}>
              <path d="M 40,240 H 180 L 240,300 V 420 L 300,480 H 460" />
            </g>
            {/* Junction nodes */}
            <circle className="circuit-node" cx="300" cy="180" r="4" fill="#F5A623" />
            <circle className="circuit-node" cx="240" cy="300" r="4" fill="#F5A623" />
            <circle className="circuit-node" cx="360" cy="360" r="4" fill="#F5A623" />
            {/* Node rings */}
            <circle cx="300" cy="180" r="9" stroke="rgba(245,166,35,0.2)" strokeWidth="1" />
            <circle cx="240" cy="300" r="9" stroke="rgba(245,166,35,0.2)" strokeWidth="1" />
            <circle cx="360" cy="360" r="9" stroke="rgba(245,166,35,0.2)" strokeWidth="1" />
          </svg>

          <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
            <div className="max-w-4xl">
              <div className="animate-fade-in inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                  Sunshine Coast, QLD · Premium Residential
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold leading-[0.95] tracking-tight mb-8">
                <span className="line-mask"><span className="text-[#F0EDE8]">Precision</span></span>
                <span className="line-mask"><span className="text-gradient">Electrical</span></span>
                <span className="line-mask"><span className="text-[#F0EDE8]">Work.</span></span>
              </h1>

              <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-[#6B6B6B] leading-relaxed max-w-xl mb-10">
                High-end electrical contracting, solar, and EV installs for Sunshine Coast homeowners who won&apos;t settle for second best. Describe your job — even upload a photo — and get an AI-powered estimate on the spot.
              </p>

              <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row sm:items-center gap-4">
                <Link
                  href="/book"
                  className="btn-glow relative inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
                >
                  <span className="text-base">⚡</span>
                  Get an Instant Estimate
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/8 text-[#F0EDE8] font-medium text-sm tracking-wide hover:border-white/20 hover:bg-white/3 transition-all rounded-sm"
                >
                  View Services
                  <span className="text-[#6B6B6B]">→</span>
                </Link>
              </div>
              <p className="animate-fade-in-up delay-300 mt-4 text-xs text-[#6B6B6B]/70 tracking-wide">
                Takes about 60 seconds · No obligation · Confirmed quote within 24 hours
              </p>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
        </section>

        {/* ── Stats ── */}
        <section className="relative border-y border-white/5">
          <div className="absolute inset-0 bg-[#0D1B2A]/40" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-3 divide-x divide-white/5">
              {stats.map((s) => (
                <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Brand Strip ── */}
        <BrandStrip />

        {/* ── Services ── */}
        <section className="relative max-w-7xl mx-auto px-6 py-28">
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#F5A623]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">What We Do</span>
            </div>
          </Reveal>
          <div className="flex items-end justify-between mb-12 gap-4">
            <Reveal delay={60}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F0EDE8] leading-tight max-w-sm">
                Built around<br />your project.
              </h2>
            </Reveal>
            <Reveal delay={120}>
              <Link href="/services" className="hidden md:flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                All services <span>→</span>
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="card-gradient group p-8 md:p-10 h-full">
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] border border-white/8 px-2 py-1 rounded-full">
                      {s.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F0EDE8] mb-3 group-hover:text-gradient transition-all">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">{s.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-[#F5A623] opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <span>→</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-6 md:hidden text-right">
            <Link href="/services" className="text-sm text-[#F5A623] hover:text-[#FFD580] transition-colors">
              All services →
            </Link>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="relative border-y border-white/5 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A]" />

          <div className="relative max-w-7xl mx-auto px-6 py-28">
            <Reveal>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-[#F5A623]" />
                <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">The Process</span>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#F0EDE8] leading-tight mb-16 max-w-sm">
                Simple from<br />start to finish.
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-white/5">
              {process.map((p, i) => (
                <Reveal key={p.step} delay={i * 100}>
                  <div className="card-gradient p-8 group h-full">
                    <div className="text-xs font-bold text-[#F5A623]/40 tracking-widest mb-4 font-mono">{p.step}</div>
                    <div className="w-6 h-px bg-[#F5A623]/30 mb-4 group-hover:w-12 group-hover:bg-[#F5A623] transition-all duration-300" />
                    <h3 className="text-base font-bold text-[#F0EDE8] mb-2">{p.title}</h3>
                    <p className="text-xs text-[#6B6B6B] leading-relaxed">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className="relative max-w-7xl mx-auto px-6 py-28">
          {/* Section label */}
          <Reveal>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-[#F5A623]" />
              <span className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">What clients say</span>
              </span>
            </div>
          </Reveal>

          {/* Heading */}
          <Reveal delay={60}>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-4 max-w-2xl">
              <span className="text-[#F0EDE8]">Trusted by </span>
              <span className="text-gradient">Sunshine Coast</span>
              <span className="text-[#F0EDE8]"> homeowners.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-[#6B6B6B] text-base mb-14 max-w-md">
              A reputation built one clean install at a time. Here&apos;s what our clients have to say.
            </p>
          </Reveal>

          {/* Cards grid — 3 col desktop, 2 tablet, 1 mobile; 5th card centred on last row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 90}>
                <div className={`card-gradient group p-8 h-full flex flex-col${i === 4 ? " lg:col-start-2" : ""}`}>
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-5">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="text-[#F5A623] text-base leading-none">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-[#6B6B6B] leading-relaxed flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Footer */}
                  <div className="flex items-end justify-between gap-4 pt-5 border-t border-white/5">
                    <div>
                      <p className="text-sm font-semibold text-[#F0EDE8]">{t.name}</p>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">{t.location}</p>
                    </div>
                    <span className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] border border-white/8 px-2 py-1 rounded-full whitespace-nowrap">
                      {t.service}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Aggregate stats row */}
          <Reveal delay={200}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 border border-white/5 rounded-sm py-7 px-8 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#F5A623]">5.0</span>
                <div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="text-[#F5A623] text-sm leading-none">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-[#6B6B6B] tracking-wide uppercase">Average rating</p>
                </div>
              </div>
              <div className="w-px h-10 bg-white/5 hidden sm:block" />
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#F5A623]">100%</span>
                <div>
                  <p className="text-sm font-semibold text-[#F0EDE8]">Would recommend</p>
                  <p className="text-xs text-[#6B6B6B] tracking-wide uppercase">To friends &amp; family</p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Service areas ── */}
        <section className="relative border-y border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-[#0D1B2A]/30" />
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-px bg-[#F5A623]" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">Service Areas</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#F0EDE8]">
                    Local to the whole Sunshine Coast.
                  </h2>
                </div>
                <Link
                  href="/locations"
                  className="shrink-0 text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors flex items-center gap-2"
                >
                  All service areas
                  <span>→</span>
                </Link>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "Noosa", slug: "noosa" },
                  { name: "Buderim", slug: "buderim" },
                  { name: "Maroochydore", slug: "maroochydore" },
                  { name: "Mooloolaba", slug: "mooloolaba" },
                  { name: "Sippy Downs", slug: "sippy-downs" },
                  { name: "Coolum Beach", slug: "coolum-beach" },
                ].map((s) => (
                  <Link
                    key={s.slug}
                    href={`/locations/${s.slug}`}
                    className="px-5 py-2.5 border border-white/8 rounded-full text-sm text-[#6B6B6B] hover:text-[#F0EDE8] hover:border-[#F5A623]/40 transition-all"
                  >
                    {s.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,_rgba(13,27,42,0.8)_0%,_#0A0A0A_70%)]" />
          <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#F5A623]/5 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                  Free instant estimate
                </span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-[#F0EDE8]">Ready to start</span>
                <br />
                <span className="text-gradient">your project?</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="text-[#6B6B6B] text-lg max-w-md mx-auto mb-10">
                Describe your job, upload a photo, and get an AI-generated estimate in seconds.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <Link
                href="/book"
                className="btn-glow relative inline-flex items-center gap-3 px-10 py-5 bg-[#F5A623] text-[#0A0A0A] font-bold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
              >
                <span className="w-2 h-2 rounded-full bg-[#0A0A0A]/30" />
                Get Instant Estimate
              </Link>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
