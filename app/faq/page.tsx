"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionTrace from "../components/SectionTrace";
import { Reveal } from "../components/Reveal";
import { faqData, type FAQItem, type FAQCategory } from "./data";


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
              Straightforward answers on electrical, EV charging, and air conditioning — no jargon, no runaround.
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
