"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTrace from "../components/SectionTrace";
import { Reveal } from "../components/Reveal";

type FAQItem = {
  q: string;
  a: string;
};

type FAQCategory = {
  label: string;
  icon: string;
  items: FAQItem[];
};

const faqData: FAQCategory[] = [
  {
    label: "Solar & Battery",
    icon: "☀️",
    items: [
      {
        q: "How long does a solar install take?",
        a: "Most residential solar installations are completed in 1–2 days. Day one covers panel mounting, inverter installation, and wiring. Day two (if required) handles commissioning, metering paperwork, and any switchboard work. We aim to leave the system generating power before we pack up.",
      },
      {
        q: "What size system do I need?",
        a: "System size depends on your household's daily energy consumption, how much of the day the home is occupied, and your roof's orientation and available space. We review three months of your power bills during the quote process and recommend a system sized to your actual usage — not just the largest one that fits.",
      },
      {
        q: "Do you handle the Energex approval?",
        a: "Yes — we manage the entire DNSP (Energex) approval process end-to-end. This includes the technical application, any required protection settings, and notifying your retailer once the system is approved and connected. You don't need to contact Energex at any point.",
      },
      {
        q: "What's the difference between a hybrid inverter and a battery-ready inverter?",
        a: "A hybrid inverter has battery management built in — connect a battery now or later without changing the inverter. A battery-ready inverter is a standard solar inverter marketed as 'upgradeable', but adding a battery usually requires a separate battery inverter or a full inverter swap. If battery storage is part of your plan, a true hybrid inverter is the better long-term choice.",
      },
    ],
  },
  {
    label: "Electrical",
    icon: "⚡",
    items: [
      {
        q: "Do I need a switchboard upgrade for solar?",
        a: "Often yes. Older rewirable-fuse switchboards can't safely support a solar system and require replacement before a grid connection can be approved. Modern switchboards also need a dedicated solar circuit breaker and, in many cases, a bi-directional meter socket. We assess your existing board during the quote and include any required upgrade in the total price — no surprise invoices.",
      },
      {
        q: "What is a Form 4 Certificate of Test?",
        a: "A Form 4 is Queensland's Certificate of Test — the compliance document a licensed electrician must complete and sign after completing electrical installation work. It confirms the work meets AS/NZS 3000 wiring rules and Queensland electrical safety regulations. We issue a Form 4 for every job we complete, and you should always ask for one if your previous electrician didn't provide one.",
      },
      {
        q: "How often should I test my safety switches?",
        a: "Every three months. Press the 'Test' button on each RCD (safety switch) in your switchboard. The circuit should trip immediately. If it doesn't trip, or if the button is stiff and hasn't been pressed in years, call us — a faulty RCD provides no protection. Queensland law requires landlords to ensure RCDs are tested at the start of each tenancy.",
      },
      {
        q: "Can you do after-hours emergency callouts?",
        a: "Yes. After-hours emergency work is charged at $180/hr (labour) plus a $150 callout fee. If you have a loss of power, a burning smell from your switchboard, or any situation that poses an immediate safety risk, call us directly — don't wait until business hours.",
      },
    ],
  },
  {
    label: "EV Charging",
    icon: "🔌",
    items: [
      {
        q: "What's the best home EV charger?",
        a: "It depends on your vehicle. Tesla owners generally get the best experience with the Tesla Wall Connector — it integrates with the car's scheduling and load management features. For non-Tesla EVs (and some Tesla owners who want flexibility), the Zappi by myenergi is excellent: it can prioritise solar-generated power for charging, reducing your grid draw significantly. We'll recommend the right unit for your car, tariff, and solar setup.",
      },
      {
        q: "Do I need 3-phase power for an EV charger?",
        a: "Not always. Most home EV chargers work on single-phase 32A circuits, delivering 7–8 kW — enough to fully charge most EVs overnight. 3-phase is worth considering if you have a vehicle capable of 11–22 kW AC charging (e.g. some European models), or if you want to install two chargers without overloading a single phase. We'll assess your existing supply and advise what's actually needed.",
      },
      {
        q: "How long does EV charger installation take?",
        a: "A straightforward single charger installation — garage wall mount, new circuit from the switchboard, and commissioning — typically takes half a day. More complex jobs involving cable runs through roof spaces, sub-board installation, or 3-phase upgrades may take a full day. We provide a firm timeframe before we start.",
      },
    ],
  },
  {
    label: "Air Conditioning",
    icon: "❄️",
    items: [
      {
        q: "What size AC do I need?",
        a: "AC capacity (in kW) depends on room size, ceiling height, insulation, window area and orientation, and local climate. A rule-of-thumb guess is almost always wrong — an undersized unit runs constantly and never reaches temperature; an oversized unit short-cycles, wears out faster, and fails to dehumidify. We calculate the correct capacity using a proper heat-load assessment before recommending any system.",
      },
      {
        q: "What's ARCtick and why does it matter?",
        a: "ARCtick is the Australian Refrigeration Council's licensing scheme for anyone who handles refrigerants. Under Australian law, refrigerant handling — including installation, commissioning, and decommissioning of air conditioning systems — must be performed by an ARCtick-licensed technician. Always ask for the licence number. We hold current ARCtick licences for all AC work we perform.",
      },
      {
        q: "Split system vs ducted — which is right for me?",
        a: "Split systems are ideal for single rooms or open-plan spaces: lower upfront cost, easy to install in existing homes, and independent temperature control per unit. Ducted systems condition the whole home from a central unit with concealed ductwork — better aesthetics and whole-home zoning, but higher cost and best suited to new builds or major renovations where duct runs can be planned in. For most existing homes needing 1–3 rooms cooled, split systems win on value. For 4+ rooms or new builds, ducted is worth the investment.",
      },
    ],
  },
  {
    label: "Pricing & Bookings",
    icon: "📋",
    items: [
      {
        q: "How do you price jobs?",
        a: "Labour is charged at $120/hr with materials supplied at cost — no markup on parts. For solar and larger electrical projects we provide a fixed-price quote after a site assessment or detailed discussion of your requirements. Quote turnaround is within 24 hours for residential work. There are no hidden fees: the price on the quote is the price on the invoice.",
      },
      {
        q: "What areas do you service?",
        a: "We service the full Sunshine Coast — from Noosa and Noosaville in the north down to Caloundra in the south, including Buderim, Maroochydore, Mooloolaba, Sippy Downs, Coolum, and surrounds. For larger solar or commercial projects we'll travel further — contact us to discuss.",
      },
      {
        q: "How do I get a quote?",
        a: "Use the instant estimate tool on our website for a ballpark figure within seconds, or submit the contact form for a detailed quote. We aim to have a formal written quote back to you within 24 hours of receiving your enquiry. For urgent work, call us directly and we'll prioritise your job.",
      },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.2s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        color: open ? "#F5A623" : "#6B6B6B",
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <Reveal delay={index * 50}>
      <div
        className="card-gradient"
        style={{ borderRadius: "2px", marginBottom: "2px" }}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
          aria-expanded={isOpen}
        >
          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: isOpen ? "#F0EDE8" : "#C8C4BE",
              transition: "color 0.2s",
              lineHeight: 1.4,
            }}
          >
            {item.q}
          </span>
          <ChevronIcon open={isOpen} />
        </button>

        {/* Animated answer panel */}
        <div
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 0.35s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              style={{
                padding: "0 1.5rem 1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                paddingTop: "1rem",
              }}
            >
              {/* Gold accent line */}
              <span
                style={{
                  display: "inline-block",
                  width: "24px",
                  height: "2px",
                  background: "#F5A623",
                  borderRadius: "1px",
                  marginBottom: "0.75rem",
                  opacity: 0.6,
                }}
              />
              <p
                style={{
                  color: "#8A8680",
                  fontSize: "0.875rem",
                  lineHeight: 1.7,
                }}
              >
                {item.a}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function FAQCategory({ category }: { category: FAQCategory }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div>
      {/* Category header */}
      <div className="flex items-center gap-3 mb-4">
        <span
          style={{
            fontSize: "1.25rem",
            lineHeight: 1,
          }}
        >
          {category.icon}
        </span>
        <h2
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#F5A623",
          }}
        >
          {category.label}
        </h2>
        <span
          style={{
            flex: 1,
            height: "1px",
            background: "rgba(255,255,255,0.06)",
          }}
        />
      </div>

      {/* Items */}
      <div style={{ marginBottom: "0.125rem" }}>
        {category.items.map((item, i) => (
          <AccordionItem
            key={i}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => toggle(i)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
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
                Common Questions
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">Questions we</span>
              <br />
              <span className="text-gradient">get asked most.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              Straightforward answers on solar, electrical, EV charging, and air conditioning — no jargon, no runaround.
            </p>
            <SectionTrace className="mt-8" />
          </div>
        </section>

        {/* ── FAQ Accordion ── */}
        <section className="max-w-4xl mx-auto px-6 py-20">
          <div className="space-y-12">
            {faqData.map((category) => (
              <Reveal key={category.label} delay={0}>
                <FAQCategory category={category} />
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
                Still have a question?
              </h2>
              <p className="text-[#6B6B6B] text-sm max-w-md">
                Get in touch and we&apos;ll give you a straight answer within 24 hours — or pick up the phone and ask us directly.
              </p>
            </div>
            <Link
              href="/contact"
              className="btn-glow relative shrink-0 inline-flex items-center gap-3 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]/40" />
              Contact Us
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
