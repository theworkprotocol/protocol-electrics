"use client";

import { useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Estimate } from "../api/estimate/route";

const serviceOptions = [
  "Electrical Contracting",
  "Solar Installation",
  "Air Conditioning",
  "EV Charger Installation",
  "Maintenance",
  "Other / Not Sure",
];

const confidenceColour: Record<string, string> = {
  high: "text-emerald-400",
  medium: "text-amber-400",
  low: "text-red-400",
};

const confidenceBg: Record<string, string> = {
  high: "bg-emerald-400/10 border-emerald-400/20",
  medium: "bg-amber-400/10 border-amber-400/20",
  low: "bg-red-400/10 border-red-400/20",
};

function EstimateCard({ estimate }: { estimate: Estimate }) {
  return (
    <div className="relative mt-6 border border-[#F5A623]/25 bg-[#0D1B2A] rounded-sm overflow-hidden">
      {/* Top accent bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#F5A623]/60 to-transparent" />

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-[#F5A623]/5 rounded-full blur-[40px] pointer-events-none" />

      <div className="relative divide-y divide-white/5">
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F5A623] mb-1.5">
              Instant Estimate
            </p>
            <h3 className="text-base font-bold text-[#F0EDE8]">{estimate.jobType}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-[#F5A623]">
              A${estimate.totalCost.min.toLocaleString()}
              <span className="text-base text-[#6B6B6B]"> – {estimate.totalCost.max.toLocaleString()}</span>
            </p>
            <p className="text-xs text-[#6B6B6B] mt-0.5">exc. GST · {estimate.timeframe}</p>
          </div>
        </div>

        {/* Summary + confidence */}
        <div className="px-6 py-4 flex items-start justify-between gap-4">
          <p className="text-sm text-[#6B6B6B] leading-relaxed flex-1">{estimate.summary}</p>
          <span className={`shrink-0 text-xs font-semibold capitalize px-2.5 py-1 rounded-full border ${confidenceBg[estimate.confidence]} ${confidenceColour[estimate.confidence]}`}>
            {estimate.confidence} confidence
          </span>
        </div>

        {/* Labour + Materials */}
        <div className="px-6 py-4 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">Labour</p>
            <p className="text-sm font-semibold text-[#F0EDE8] mb-1">
              {estimate.labourHours.min}–{estimate.labourHours.max} hours
            </p>
            <p className="text-xs text-[#6B6B6B]">
              A${estimate.labourCost.min.toLocaleString()} – A${estimate.labourCost.max.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">Key Materials</p>
            <ul className="space-y-1.5">
              {estimate.materials.slice(0, 4).map((m, i) => (
                <li key={i} className="text-xs text-[#6B6B6B] flex justify-between gap-2">
                  <span>{m.item}</span>
                  <span className="text-[#F0EDE8] shrink-0 font-medium">{m.cost}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Clarifying questions */}
        {estimate.clarifyingQuestions.length > 0 && (
          <div className="px-6 py-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">
              To sharpen this estimate
            </p>
            <ul className="space-y-2">
              {estimate.clarifyingQuestions.map((q, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-[#6B6B6B]">
                  <span className="text-[#F5A623] shrink-0 mt-0.5">→</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {estimate.notes && (
          <div className="px-6 py-4">
            <p className="text-xs text-[#6B6B6B]/70 leading-relaxed">{estimate.notes}</p>
          </div>
        )}

        {/* Footer disclaimer */}
        <div className="px-6 py-3 bg-[#0A0A0A]/60">
          <p className="text-xs text-[#6B6B6B]/50 leading-relaxed">
            AI-generated estimate for guidance only. Submit the form and we&apos;ll confirm with an accurate fixed quote after reviewing your project.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState("");
  const estimateRef = useRef<HTMLDivElement>(null);

  async function getEstimate() {
    if (description.trim().length < 15) {
      setEstimateError("Add more detail about your project to get an estimate.");
      return;
    }
    setEstimateError("");
    setEstimating(true);
    setEstimate(null);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, service: selectedService }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setEstimate(data);
      setTimeout(() => estimateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setEstimateError(err instanceof Error ? err.message : "Could not generate estimate.");
    } finally {
      setEstimating(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service: selectedService, description, estimate }),
      });
    } catch {
      // Still show success — don't block the user if save fails
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  const inputClass =
    "w-full bg-[#0D1B2A]/60 border border-white/8 focus:border-[#F5A623]/40 focus:bg-[#0D1B2A] text-[#F0EDE8] text-sm px-4 py-3 rounded-sm outline-none transition-all placeholder:text-[#6B6B6B]/50";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ── Header ── */}
        <section className="relative border-b border-white/5 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(13,27,42,0.95)_0%,_#0A0A0A_65%)]" />
          <div className="animate-pulse-glow absolute -top-10 right-1/4 w-[400px] h-[300px] bg-[#F5A623]/4 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-24">
            <div className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                Free instant estimate
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-2xl mb-4">
              <span className="text-[#F0EDE8]">Let&apos;s talk about</span>
              <br />
              <span className="text-gradient">your project.</span>
            </h1>
            <p className="text-[#6B6B6B] text-lg max-w-xl">
              Describe your job and get an instant AI estimate — then submit for a confirmed fixed quote.
            </p>
          </div>
        </section>

        {/* ── Form + Info ── */}
        <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-[1fr_380px] gap-16 items-start">

          {/* Left: form */}
          <div>
            {submitted ? (
              <div className="card-gradient p-8 rounded-sm text-center">
                <div className="w-10 h-10 rounded-full border border-[#F5A623]/30 flex items-center justify-center mx-auto mb-5">
                  <span className="text-[#F5A623] text-lg">✓</span>
                </div>
                <h2 className="text-xl font-bold text-[#F0EDE8] mb-2">Message received.</h2>
                <p className="text-[#6B6B6B] text-sm">
                  We&apos;ll be in touch within 24 hours with a confirmed quote.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="04xx xxx xxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">
                    Service
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select a service</option>
                    {serviceOptions.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">
                    Describe your project
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="The more detail the better — property type, what you need done, any existing setup. This powers the instant estimate."
                    className={`${inputClass} resize-none`}
                  />
                  {estimateError && (
                    <p className="text-xs text-red-400 mt-1.5">{estimateError}</p>
                  )}
                </div>

                {/* Estimate button */}
                <button
                  type="button"
                  onClick={getEstimate}
                  disabled={estimating}
                  className="w-full px-6 py-3.5 border border-[#F5A623]/40 text-[#F5A623] text-sm font-medium tracking-wide hover:bg-[#F5A623]/8 hover:border-[#F5A623]/70 disabled:opacity-50 transition-all rounded-sm"
                >
                  {estimating ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full border border-[#F5A623] border-t-transparent animate-spin" />
                      Generating estimate…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-base">⚡</span>
                      Get Instant Estimate
                    </span>
                  )}
                </button>

                {/* Estimate result */}
                {estimate && (
                  <div ref={estimateRef}>
                    <EstimateCard estimate={estimate} />
                  </div>
                )}

                <div className="h-px bg-white/5 my-2" />

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-glow relative w-full sm:w-auto px-8 py-4 bg-[#F5A623] text-[#0A0A0A] font-bold text-sm tracking-wide hover:bg-[#FFD580] disabled:opacity-60 transition-colors rounded-sm z-0"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full border border-[#0A0A0A]/40 border-t-transparent animate-spin" />
                      Sending…
                    </span>
                  ) : (
                    "Send for Confirmed Quote →"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right: info panel */}
          <div className="space-y-8 md:sticky md:top-24">

            {/* How it works */}
            <div className="card-gradient p-6 rounded-sm">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#F5A623] mb-5">
                How it works
              </p>
              <ol className="space-y-4">
                {[
                  { n: "01", text: "Describe your job and hit \"Get Instant Estimate\" for an AI-generated ballpark." },
                  { n: "02", text: "Submit the form — we review and come back with a fixed, itemised quote." },
                  { n: "03", text: "Approve the quote and we schedule the work at a time that suits you." },
                  { n: "04", text: "Job completed, signed off with a Form 4 Certificate of Test." },
                ].map((s) => (
                  <li key={s.n} className="flex gap-4 text-sm text-[#6B6B6B] leading-relaxed">
                    <span className="shrink-0 font-bold text-[#F5A623] font-mono text-xs mt-0.5">{s.n}</span>
                    {s.text}
                  </li>
                ))}
              </ol>
            </div>

            {/* Response time */}
            <div className="border border-white/5 p-6 rounded-sm">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">
                Response time
              </p>
              <p className="text-[#F0EDE8] text-sm leading-relaxed">
                Confirmed quotes within{" "}
                <span className="text-[#F5A623] font-semibold">24 hours</span>.
                For urgent work, reach out directly.
              </p>
            </div>

            {/* Credentials */}
            <div className="border border-white/5 divide-y divide-white/5 rounded-sm overflow-hidden">
              {[
                { label: "Licence", value: "QBCC Licensed" },
                { label: "Solar", value: "CEC Accredited" },
                { label: "AC & Refrigeration", value: "ARCtick Licensed" },
                { label: "Area", value: "Sunshine Coast, QLD" },
              ].map((c) => (
                <div key={c.label} className="px-5 py-3.5 flex items-center justify-between gap-4">
                  <span className="text-xs text-[#6B6B6B]">{c.label}</span>
                  <span className="text-xs font-semibold text-[#F0EDE8]">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
