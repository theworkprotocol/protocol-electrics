import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Reveal } from "../components/Reveal";
import { StatCounterCompact } from "../components/StatCounter";

const projects = [
  {
    title: "10kW Solar + Powerwall 3",
    location: "Buderim, QLD",
    category: "Solar & Battery",
    description:
      "Full roof survey, 10kW SolarEdge system with optimisers on a north-west split roof, paired with a Tesla Powerwall 3. Energex DNSP approval handled end-to-end. Client hit self-sufficiency over 85% in the first month.",
    specs: ["10kW SolarEdge inverter", "25 × 400W panels", "Powerwall 3 (13.5kWh)", "Battery backup circuit", "Monitoring app commissioned"],
    tag: "Solar & Battery",
    icon: "☀️",
  },
  {
    title: "Switchboard Upgrade + Safety Switches",
    location: "Maroochydore, QLD",
    category: "Electrical Contracting",
    description:
      "Ageing rewirable fuse board replaced with a modern Clipsal switchboard. Four circuits upgraded with Type 1 RCDs, smoke alarms brought to QLD compliance. Signed off with a Form 4 Certificate of Test same day.",
    specs: ["Clipsal switchboard", "Type 1 RCD protection", "Smoke alarm compliance", "Form 4 same-day sign-off", "All circuits labelled & tested"],
    tag: "Electrical",
    icon: "⚡",
  },
  {
    title: "Dual EV Charger Install",
    location: "Noosa Heads, QLD",
    category: "EV Charging",
    description:
      "Two Tesla Wall Connectors installed in a double garage with a dedicated 3-phase sub-board. Clean cable routing through the wall cavity, no visible conduit runs. Load management configured to share capacity during peak household demand.",
    specs: ["2 × Tesla Wall Connector", "Dedicated 3-phase sub-board", "Concealed cable routing", "Load management enabled", "AS 61851 compliant"],
    tag: "EV Charging",
    icon: "🔌",
  },
  {
    title: "Ducted AC — New Build",
    location: "Sippy Downs, QLD",
    category: "Air Conditioning",
    description:
      "Daikin ducted system supplied and installed across a newly built 4-bedroom home. All electrical supply work, commissioning, and handover included. System zoned per room with a smart controller.",
    specs: ["Daikin 14kW ducted", "4 zones with smart control", "Full electrical supply", "Commissioning & handover", "ARCtick certified install"],
    tag: "Air Conditioning",
    icon: "❄️",
  },
  {
    title: "6.6kW Solar Retrofit",
    location: "Coolum Beach, QLD",
    category: "Solar & Battery",
    description:
      "Replacement of a failed 10-year-old inverter with a modern Fronius Primo. Array re-tested, STC claim reprocessed, monitoring restored. Client back generating inside 48 hours of contact.",
    specs: ["Fronius Primo 6.0 inverter", "Existing 24-panel array reused", "AS/NZS 5033 compliance check", "STC documentation handled", "48-hour turnaround"],
    tag: "Solar & Battery",
    icon: "☀️",
  },
  {
    title: "Rental Property — Full Maintenance",
    location: "Mooloolaba, QLD",
    category: "Maintenance",
    description:
      "Annual electrical inspection for a property manager across three Mooloolaba units. Safety switch testing, smoke alarm compliance, and two fault-finds resolved. Inspection reports provided for landlord records.",
    specs: ["3-unit inspection", "Safety switch testing", "Smoke alarm compliance", "Fault-finding × 2", "Written inspection report"],
    tag: "Maintenance",
    icon: "🔧",
  },
];

const tagColours: Record<string, string> = {
  "Solar & Battery": "text-amber-400 border-amber-400/20 bg-amber-400/5",
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
                Recent Projects
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">Work that</span>
              <br />
              <span className="text-gradient">speaks for itself.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              A selection of recent installs across the Sunshine Coast. Every job here was done to spec, on time, and signed off properly.
            </p>
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
                  {p.location}
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
                { value: "100", suffix: "+", label: "Jobs Completed" },
                { value: "10", suffix: "", label: "Years Experience" },
                { value: "24", suffix: "hr", label: "Quote Turnaround" },
                { value: "0", suffix: "", label: "Callbacks" },
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
                Want your project on this list?
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md">
                Get an instant estimate on your job and we&apos;ll have a confirmed quote back to you within 24 hours.
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
