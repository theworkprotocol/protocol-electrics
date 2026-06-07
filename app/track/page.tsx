"use client";

import { useState, FormEvent } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Reveal } from "../components/Reveal";
import type { EnquiryStatus } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrackResult {
  id: string;
  name: string;
  service: string;
  status: EnquiryStatus;
  createdAt: string;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  EnquiryStatus,
  {
    label: string;
    message: string;
    description: string;
    badgeClass: string;
    dotClass: string;
  }
> = {
  new: {
    label: "Received",
    message: "We've received your enquiry",
    description:
      "Your enquiry is in our queue. We review all new enquiries within one business day and will be in touch shortly.",
    badgeClass: "text-blue-400 border-blue-400/20 bg-blue-400/8",
    dotClass: "bg-blue-400",
  },
  reviewed: {
    label: "Under Review",
    message: "We're reviewing your enquiry",
    description:
      "Our team is looking over the details of your job. We'll reach out if we need any further information before preparing your quote.",
    badgeClass: "text-sky-400 border-sky-400/20 bg-sky-400/8",
    dotClass: "bg-sky-400",
  },
  quoted: {
    label: "Quote Ready",
    message: "Your quote is ready — check your email",
    description:
      "We've sent a detailed quote to your email address. Review it at your convenience and reply to confirm or ask any questions.",
    badgeClass: "text-amber-400 border-amber-400/20 bg-amber-400/8",
    dotClass: "bg-amber-400",
  },
  booked: {
    label: "Scheduled",
    message: "Your job is scheduled",
    description:
      "Your job is confirmed and in our calendar. You'll receive a reminder before the scheduled date. We look forward to seeing you.",
    badgeClass: "text-emerald-400 border-emerald-400/20 bg-emerald-400/8",
    dotClass: "bg-emerald-400",
  },
  completed: {
    label: "Completed",
    message: "Job completed",
    description:
      "Your job has been completed and signed off. Thank you for choosing Protocol Electrics — we hope to work with you again.",
    badgeClass: "text-[#6B6B6B] border-white/10 bg-white/3",
    dotClass: "bg-[#6B6B6B]",
  },
  declined: {
    label: "Cancelled",
    message: "Enquiry cancelled",
    description:
      "This enquiry has been cancelled. If you believe this is an error or would like to re-submit, please get in touch with us directly.",
    badgeClass: "text-red-400/80 border-red-400/15 bg-red-400/5",
    dotClass: "bg-red-400/70",
  },
};

// ─── Date formatter ───────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TrackPage() {
  const [ref, setRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = ref.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/track?ref=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(
          res.status === 404
            ? "No job found with that reference. Please double-check the number from your confirmation email."
            : data.error ?? "Something went wrong. Please try again."
        );
        return;
      }

      setResult(data as TrackResult);
    } catch {
      setError("Unable to reach the server. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setResult(null);
    setError(null);
    setRef("");
  }

  const statusCfg = result ? STATUS_CONFIG[result.status] : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16 min-h-screen">

        {/* ── Header ── */}
        <section className="relative border-b border-white/5 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_-20%,_rgba(13,27,42,0.95)_0%,_#0A0A0A_65%)]" />
          <div className="animate-pulse-glow absolute top-0 right-0 w-[500px] h-[400px] bg-[#F5A623]/3 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                Job Tracker
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">Track your</span>
              <br />
              <span className="text-gradient">job.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              Enter your reference number from your booking confirmation.
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="max-w-2xl mx-auto px-6 py-20">
          {!result ? (
            /* ── Search form ── */
            <Reveal>
              <div className="card-gradient rounded-sm p-8 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="ref-input"
                      className="block text-xs font-medium tracking-widest uppercase text-[#6B6B6B] mb-3"
                    >
                      Reference Number
                    </label>
                    <input
                      id="ref-input"
                      type="text"
                      value={ref}
                      onChange={(e) =>
                        setRef(e.target.value.toUpperCase().slice(0, 9))
                      }
                      placeholder="PE-XXXXXX"
                      maxLength={9}
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full bg-white/3 border border-white/8 rounded-sm px-4 py-3 text-[#F0EDE8] text-base font-mono tracking-widest placeholder:text-[#6B6B6B]/50 focus:outline-none focus:border-[#F5A623]/40 focus:bg-white/5 transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 px-4 py-3 rounded-sm border border-red-400/15 bg-red-400/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400/70 mt-1.5 shrink-0" />
                      <p className="text-sm text-red-400/80 leading-relaxed">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || ref.trim().length < 9}
                    className="btn-glow relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-semibold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] rounded-full animate-spin" />
                        Looking up…
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]/40" />
                        Find Job
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-xs text-[#6B6B6B] text-center">
                  Your reference number was included in your booking confirmation email.
                </p>
              </div>
            </Reveal>
          ) : (
            /* ── Result card ── */
            <Reveal>
              <div className="card-gradient rounded-sm p-8 md:p-10 space-y-8">

                {/* Reference */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] mb-1">
                      Reference
                    </p>
                    <p className="text-2xl font-bold font-mono text-[#F5A623] tracking-wider">
                      {result.id}
                    </p>
                  </div>
                  {statusCfg && (
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase px-3 py-1.5 rounded-full border ${statusCfg.badgeClass}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass} animate-pulse`} />
                      {statusCfg.label}
                    </span>
                  )}
                </div>

                <div className="border-t border-white/5" />

                {/* Job details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] mb-1">
                      Name
                    </p>
                    <p className="text-[#F0EDE8] font-medium">{result.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] mb-1">
                      Service
                    </p>
                    <p className="text-[#F0EDE8] font-medium">{result.service}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B] mb-1">
                      Date Submitted
                    </p>
                    <p className="text-[#F0EDE8] font-medium">{formatDate(result.createdAt)}</p>
                  </div>
                </div>

                <div className="border-t border-white/5" />

                {/* Status panel */}
                {statusCfg && (
                  <div className="space-y-3">
                    <p className="text-xs font-medium tracking-widest uppercase text-[#6B6B6B]">
                      Status
                    </p>
                    <p className="text-xl font-bold text-[#F0EDE8]">
                      {statusCfg.message}
                    </p>
                    <p className="text-sm text-[#6B6B6B] leading-relaxed">
                      {statusCfg.description}
                    </p>
                  </div>
                )}

                <div className="border-t border-white/5" />

                {/* Reset */}
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors"
                >
                  <span className="text-xs">←</span>
                  Track another job
                </button>
              </div>
            </Reveal>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}
