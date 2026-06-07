import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Reveal } from "../components/Reveal";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent electrical, solar, EV charger, and air conditioning pricing on the Sunshine Coast. Standard rate $120/hr. Free written quotes within 24 hours.",
  openGraph: {
    title: "Pricing | Protocol Electrics",
    url: "https://www.protocolelectrics.com.au/pricing",
  },
};

const labourRates = [
  { label: "Standard Rate", value: "$120", unit: "/ hr" },
  { label: "After Hours", value: "$180", unit: "/ hr" },
  { label: "Callout Fee", value: "$150", unit: "after-hours only" },
  { label: "Quote Turnaround", value: "24", unit: "hrs" },
];

const serviceCards = [
  {
    title: "Solar & Battery",
    icon: "☀️",
    items: [
      { service: "6.6kW system supply & install", price: "from $5,500" },
      { service: "10kW system supply & install", price: "from $8,500" },
      { service: "Battery storage (Powerwall 3)", price: "from $14,000 installed" },
      { service: "Inverter replacement", price: "from $1,800" },
    ],
    note: "STC rebates applied at point of sale — prices shown are after rebate",
  },
  {
    title: "Electrical Contracting",
    icon: "⚡",
    items: [
      { service: "Switchboard upgrade", price: "from $1,200" },
      { service: "Safety switch installation", price: "from $280" },
      { service: "Power point / light installation", price: "from $180" },
      { service: "After-hours emergency callout", price: "$150 + $180/hr" },
    ],
    note: "All work certified with Form 4 Certificate of Test",
  },
  {
    title: "EV Charging",
    icon: "🔌",
    items: [
      { service: "Single EV charger install", price: "from $800" },
      { service: "Dual EV charger install", price: "from $1,400" },
      { service: "Sub-board installation (if required)", price: "from $600" },
    ],
    note: "AS 61851 compliant installation, load management included",
  },
  {
    title: "Air Conditioning",
    icon: "❄️",
    items: [
      { service: "Split system supply & install (2.5kW)", price: "from $1,400" },
      { service: "Split system supply & install (7.1kW)", price: "from $2,200" },
      { service: "Ducted system", price: "Site inspection required" },
    ],
    note: "ARCtick certified. All brands available.",
  },
];

export default function PricingPage() {
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
                Transparent Pricing
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">No surprises.</span>
              <br />
              <span className="text-gradient">Just fair pricing.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              We quote every job in writing before we start. What you see is what you pay.
            </p>
          </div>
        </section>

        {/* ── Labour rates strip ── */}
        <section className="border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0D1B2A]/40" />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
              {labourRates.map((rate) => (
                <Reveal key={rate.label}>
                  <div className="flex flex-col items-start px-6 py-10 gap-1">
                    <span className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] mb-2">
                      {rate.label}
                    </span>
                    <div className="flex items-end gap-1.5">
                      <span className="text-3xl md:text-4xl font-bold text-[#F5A623] leading-none">
                        {rate.value}
                      </span>
                      <span className="text-sm text-[#6B6B6B] mb-1">{rate.unit}</span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Service pricing cards ── */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
            {serviceCards.map((card, i) => (
              <Reveal key={card.title} delay={i * 70}>
                <div className="card-gradient group p-8 md:p-10 h-full flex flex-col">
                  {/* Card header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-sm border border-white/8 flex items-center justify-center text-lg group-hover:border-[#F5A623]/30 transition-colors shrink-0">
                      {card.icon}
                    </div>
                    <h2 className="text-lg font-bold text-[#F0EDE8]">{card.title}</h2>
                  </div>

                  {/* Gold accent line */}
                  <div className="h-px w-full bg-gradient-to-r from-[#F5A623]/40 via-[#F5A623]/15 to-transparent mb-6" />

                  {/* Service list */}
                  <ul className="space-y-3 flex-1 mb-6">
                    {card.items.map((item) => (
                      <li key={item.service} className="flex items-start justify-between gap-4">
                        <span className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                          <span className="w-1 h-1 rounded-full bg-[#F5A623]/50 shrink-0 mt-2" />
                          {item.service}
                        </span>
                        <span className="text-sm font-medium text-[#F0EDE8] shrink-0 text-right">
                          {item.price}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Note */}
                  <p className="text-xs italic text-[#6B6B6B]/70 border-t border-white/5 pt-4 mb-6">
                    {card.note}
                  </p>

                  {/* CTA */}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#F5A623] hover:text-[#FFD580] transition-colors group/link"
                  >
                    Get a quote
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1"
                      fill="none"
                      viewBox="0 0 16 16"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Disclaimer strip ── */}
        <Reveal>
          <section className="border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <p className="text-xs text-[#6B6B6B] text-center leading-relaxed max-w-3xl mx-auto">
                All prices are indicative and include GST. Final pricing depends on site conditions, materials, and scope.
                We&apos;ll confirm everything in writing before starting. No hidden fees.
              </p>
            </div>
          </section>
        </Reveal>

        {/* ── CTA section ── */}
        <section className="relative overflow-hidden border-t border-white/5">
          <div className="animate-pulse-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-[#F5A623]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-[#F0EDE8] mb-3">
                Get your job priced in 24 hours
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md">
                Written quote. No obligations. We confirm scope, materials, and cost before any work begins.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="btn-glow relative inline-flex items-center gap-3 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]/40" />
                Request a Quote
              </Link>
              <Link
                href="/book"
                className="text-sm text-[#6B6B6B] hover:text-[#F0EDE8] transition-colors underline underline-offset-4"
              >
                or use the instant estimator
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
