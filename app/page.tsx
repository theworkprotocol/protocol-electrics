import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Reveal } from "./components/Reveal";
import { StatCounter } from "./components/StatCounter";

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

          <div className="relative max-w-7xl mx-auto px-6 py-24 w-full">
            <div className="max-w-4xl">
              <div className="animate-fade-in inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                  Sunshine Coast, QLD · Premium Residential
                </span>
              </div>

              <h1 className="animate-fade-in-up delay-100 text-6xl md:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
                <span className="block text-[#F0EDE8]">Precision</span>
                <span className="block text-gradient">Electrical</span>
                <span className="block text-[#F0EDE8]">Work.</span>
              </h1>

              <p className="animate-fade-in-up delay-200 text-lg md:text-xl text-[#6B6B6B] leading-relaxed max-w-xl mb-10">
                High-end electrical contracting, solar, and EV installs for Sunshine Coast homeowners who won&apos;t settle for second best.
              </p>

              <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/book"
                  className="btn-glow relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]/40" />
                  Book a Job
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/8 text-[#F0EDE8] font-medium text-sm tracking-wide hover:border-white/20 hover:bg-white/3 transition-all rounded-sm"
                >
                  View Services
                  <span className="text-[#6B6B6B]">→</span>
                </Link>
              </div>
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
