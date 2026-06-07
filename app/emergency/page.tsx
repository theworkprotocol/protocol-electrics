import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Reveal } from "../components/Reveal";

export const metadata: Metadata = {
  title: "Emergency Electrician Sunshine Coast",
  description:
    "24/7 emergency electrician on the Sunshine Coast. Sparking outlets, power loss, switchboard faults. Licensed, fast response. Call now.",
  openGraph: {
    title: "Emergency Electrician | Protocol Electrics",
    description:
      "24/7 emergency electrician on the Sunshine Coast. Licensed, fast response.",
    url: "https://www.protocolelectrics.com.au/emergency",
  },
};

const emergencies = [
  {
    icon: "⚡",
    title: "Sparking or burning smell",
    description: "Shut off power at the main switch and call immediately",
  },
  {
    icon: "💧",
    title: "Water near electrics",
    description:
      "Flooding, leaks near switchboard or power points — serious risk",
  },
  {
    icon: "🔴",
    title: "Total power loss",
    description: "Not a blown fuse — no power to the whole property",
  },
  {
    icon: "⚠️",
    title: "Switchboard tripping repeatedly",
    description: "A circuit that won't stay on needs urgent investigation",
  },
  {
    icon: "🔥",
    title: "Hot power points or switches",
    description: "Overheating outlets are a fire risk — don't ignore them",
  },
  {
    icon: "⚡",
    title: "Electric shock",
    description:
      "If anyone has received a shock, call 000 first, then us",
  },
];

const steps = [
  {
    num: "01",
    text: "If there's risk of fire or injury — call 000 first",
  },
  {
    num: "02",
    text: "Turn off power at the main switch if safe to do so",
  },
  {
    num: "03",
    text: "Don't use the affected circuits or equipment",
  },
  {
    num: "04",
    text: "Call us — we'll advise over the phone and dispatch if needed",
  },
];

const pricing = [
  {
    label: "After-hours callout",
    value: "$150",
    note: null,
  },
  {
    label: "After-hours labour",
    value: "$180/hr",
    note: null,
  },
  {
    label: "Standard hours labour",
    value: "$120/hr",
    note: "Mon–Fri 7am–5pm",
  },
];

export default function EmergencyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ── Header ── */}
        <section className="relative border-b border-white/5 overflow-hidden">
          {/* Red-tinted dot grid */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(220, 38, 38, 0.12) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Dark red radial overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_-20%,_rgba(80,10,10,0.9)_0%,_#0A0A0A_65%)]" />
          {/* Red ambient glow */}
          <div
            className="animate-pulse-glow absolute top-0 right-0 w-[500px] h-[400px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "rgba(220, 38, 38, 0.07)" }}
          />

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
              style={{
                background:
                  "linear-gradient(90deg, rgba(220,38,38,0.12) 0%, rgba(220,38,38,0.25) 50%, rgba(220,38,38,0.12) 100%)",
                backgroundSize: "200% auto",
                border: "1px solid rgba(220,38,38,0.25)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#DC2626" }}
              />
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: "#F87171" }}
              >
                24/7 Emergency Callout
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">Electrical emergency?</span>
              <br />
              <span className="text-gradient">We&apos;re on call.</span>
            </h1>

            <p className="text-[#6B6B6B] text-lg max-w-xl mb-8">
              Licensed emergency electrician on the Sunshine Coast. Fast
              response, safe resolution.
            </p>

            {/* Phone CTA */}
            <a
              href="tel:0428653509"
              className="btn-glow relative inline-flex items-center gap-3 px-8 py-4 font-bold text-lg tracking-wide rounded-sm z-0 transition-all"
              style={{
                background: "#0A0A0A",
                color: "#F0EDE8",
                border: "2px solid #DC2626",
                boxShadow: "0 0 24px rgba(220,38,38,0.35)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#DC2626" }}
              />
              Call Now — 0428 653 509
            </a>
          </div>
        </section>

        {/* ── What counts as an emergency ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <Reveal>
            <div className="mb-12">
              <p className="text-xs font-medium tracking-widest uppercase text-[#F5A623] mb-3">
                Know the signs
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F0EDE8]">
                What counts as an emergency
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {emergencies.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <div className="card-gradient group p-8 h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-sm border border-white/8 flex items-center justify-center text-xl shrink-0 group-hover:border-red-500/30 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#F0EDE8] mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── What to do right now ── */}
        <section className="border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0D1B2A]/40" />
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <Reveal>
              <div className="mb-12">
                <p className="text-xs font-medium tracking-widest uppercase text-[#F5A623] mb-3">
                  Act now
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#F0EDE8]">
                  What to do right now
                </h2>
              </div>
            </Reveal>

            <div className="max-w-2xl space-y-0">
              {steps.map((step, i) => (
                <Reveal key={step.num} delay={i * 80}>
                  <div className="flex items-start gap-6 py-6 border-b border-white/5 last:border-0">
                    <span
                      className="text-2xl font-bold tabular-nums shrink-0 mt-0.5"
                      style={{ color: "rgba(220,38,38,0.7)" }}
                    >
                      {step.num}
                    </span>
                    <p className="text-[#F0EDE8] text-lg leading-snug">
                      {step.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing strip ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <Reveal>
            <div className="mb-12">
              <p className="text-xs font-medium tracking-widest uppercase text-[#F5A623] mb-3">
                Transparent pricing
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#F0EDE8]">
                No surprises
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mb-6">
            {pricing.map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div className="card-gradient p-8 h-full">
                  <p className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] mb-3">
                    {item.label}
                  </p>
                  <p className="text-4xl font-bold text-[#F0EDE8] mb-1">
                    {item.value}
                  </p>
                  {item.note && (
                    <p className="text-xs text-[#6B6B6B] mt-2">{item.note}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={240}>
            <p className="text-sm text-[#6B6B6B] flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#F5A623]/50 shrink-0" />
              All pricing confirmed before we start. No surprise bills.
            </p>
          </Reveal>
        </section>

        {/* ── Final CTA ── */}
        <section className="relative overflow-hidden border-t border-white/5">
          <div
            className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full blur-[80px] pointer-events-none"
            style={{ background: "rgba(220,38,38,0.06)" }}
          />
          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <Reveal>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h2 className="text-3xl font-bold text-[#F0EDE8] mb-3">
                    Need us right now?
                  </h2>
                  <p className="text-[#6B6B6B] text-sm max-w-md">
                    We&apos;ll advise over the phone and dispatch if needed. Available
                    24/7 for genuine electrical emergencies.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                  {/* Primary — call */}
                  <a
                    href="tel:0428653509"
                    className="btn-glow relative inline-flex items-center gap-3 px-8 py-4 font-semibold text-sm tracking-wide rounded-sm z-0 transition-all"
                    style={{
                      background: "#0A0A0A",
                      color: "#F0EDE8",
                      border: "2px solid #DC2626",
                      boxShadow: "0 0 20px rgba(220,38,38,0.3)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "#DC2626" }}
                    />
                    Call Now
                  </a>

                  {/* Secondary — contact form */}
                  <Link
                    href="/contact"
                    className="btn-glow relative inline-flex items-center gap-3 px-8 py-4 bg-transparent text-[#6B6B6B] font-semibold text-sm tracking-wide border border-white/10 hover:border-white/20 hover:text-[#F0EDE8] transition-colors rounded-sm z-0"
                  >
                    Send a message instead
                  </Link>
                </div>
              </div>

              <p className="mt-8 text-xs text-[#6B6B6B] text-center md:text-left">
                If it&apos;s life-threatening, call{" "}
                <span className="text-[#F0EDE8] font-semibold">000</span> first.
              </p>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
