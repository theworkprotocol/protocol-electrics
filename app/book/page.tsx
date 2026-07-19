"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { Estimate } from "../api/estimate/route";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedImage {
  id: string;
  base64: string;
  mediaType: string;
  preview: string;
  name: string;
}

interface Prediction {
  jobType: string;
  imageObservations: string[];
  scopePreview: string;
  complexity: "simple" | "moderate" | "complex";
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SERVICE_OPTIONS = [
  { label: "Electrical", icon: "⚡" },
  { label: "Solar", icon: "☀️" },
  { label: "EV Charger", icon: "🔌" },
  { label: "Air Con", icon: "❄️" },
  { label: "Maintenance", icon: "🔧" },
  { label: "Not Sure", icon: "◎" },
];

const COMPLEXITY_STYLE = {
  simple: "text-emerald-400 border-emerald-400/20 bg-emerald-400/8",
  moderate: "text-amber-400 border-amber-400/20 bg-amber-400/8",
  complex: "text-red-400 border-red-400/20 bg-red-400/8",
};

const PREFERRED_TIMES = [
  "ASAP — flexible",
  "This week",
  "Next week",
  "Within the month",
  "Just need a quote for now",
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Describe", "Estimate", "Details", "Confirmed"];
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  done
                    ? "bg-[#F5A623] text-[#0A0A0A]"
                    : active
                    ? "border-2 border-[#F5A623] text-[#F5A623]"
                    : "border border-white/10 text-[#6B6B6B]/40"
                }`}
              >
                {done ? "✓" : n}
              </div>
              <span
                className={`text-[10px] tracking-widest uppercase font-semibold ${
                  active ? "text-[#F5A623]" : done ? "text-[#6B6B6B]" : "text-[#6B6B6B]/30"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-px mx-2 mb-5 transition-all duration-500 ${
                  done ? "bg-[#F5A623]/60" : "bg-white/8"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ImageThumbnail({
  img,
  observation,
  onRemove,
}: {
  img: UploadedImage;
  observation?: string;
  onRemove: () => void;
}) {
  return (
    <div className="relative group rounded-sm overflow-hidden border border-white/8 hover:border-[#F5A623]/30 transition-colors">
      <img
        src={img.preview}
        alt={img.name}
        className="w-full h-24 object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      {observation && (
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <p className="text-[9px] text-[#F5A623]/80 leading-snug line-clamp-2">{observation}</p>
        </div>
      )}
      <button
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#0A0A0A]/80 border border-white/20 text-[#F0EDE8] text-xs flex items-center justify-center hover:bg-red-500/80 hover:border-red-400/50 transition-colors"
      >
        ×
      </button>
    </div>
  );
}

function EstimateCard({ estimate }: { estimate: Estimate }) {
  const confidenceBg = {
    high: "bg-emerald-400/10 border-emerald-400/20 text-emerald-400",
    medium: "bg-amber-400/10 border-amber-400/20 text-amber-400",
    low: "bg-red-400/10 border-red-400/20 text-red-400",
  };

  return (
    <div className="relative border border-[#F5A623]/25 bg-[#0D1B2A] rounded-sm overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-[#F5A623]/60 to-transparent" />
      <div className="divide-y divide-white/5">
        <div className="px-6 py-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#F5A623] mb-1.5">Instant Estimate</p>
            <h3 className="text-base font-bold text-[#F0EDE8]">{estimate.jobType}</h3>
            <p className="text-xs text-[#6B6B6B] mt-0.5">{estimate.timeframe}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-[#F5A623]">
              A${estimate.totalCost.min.toLocaleString()}
              <span className="text-base text-[#6B6B6B]">–{estimate.totalCost.max.toLocaleString()}</span>
            </p>
            <p className="text-xs text-[#6B6B6B]">exc. GST</p>
          </div>
        </div>

        <div className="px-6 py-4 flex items-start justify-between gap-4">
          <p className="text-sm text-[#6B6B6B] leading-relaxed flex-1">{estimate.summary}</p>
          <span className={`shrink-0 text-xs font-semibold capitalize px-2.5 py-1 rounded-full border ${confidenceBg[estimate.confidence]}`}>
            {estimate.confidence} confidence
          </span>
        </div>

        <div className="px-6 py-4 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Labour</p>
            <p className="text-sm font-semibold text-[#F0EDE8]">{estimate.labourHours.min}–{estimate.labourHours.max} hrs</p>
            <p className="text-xs text-[#6B6B6B]">A${estimate.labourCost.min.toLocaleString()}–{estimate.labourCost.max.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Key Materials</p>
            <ul className="space-y-1">
              {estimate.materials.slice(0, 4).map((m, i) => (
                <li key={i} className="text-xs text-[#6B6B6B] flex justify-between gap-2">
                  <span>{m.item}</span>
                  <span className="text-[#F0EDE8] shrink-0 font-medium">{m.cost}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {estimate.clarifyingQuestions.length > 0 && (
          <div className="px-6 py-4">
            <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">We may ask you</p>
            <ul className="space-y-1.5">
              {estimate.clarifyingQuestions.map((q, i) => (
                <li key={i} className="flex gap-2 text-xs text-[#6B6B6B]">
                  <span className="text-[#F5A623] shrink-0">→</span>{q}
                </li>
              ))}
            </ul>
          </div>
        )}

        {estimate.notes && (
          <div className="px-6 py-3 bg-[#0A0A0A]/40">
            <p className="text-xs text-[#6B6B6B]/60 leading-relaxed">{estimate.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BookPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [predicting, setPredicting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Step 2
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [estimateError, setEstimateError] = useState("");

  // Step 3
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [extraNotes, setExtraNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Step 4
  const [jobRef, setJobRef] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const predictTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Image helpers ──────────────────────────────────────────────────────────

  // Downscale + re-encode to JPEG so payloads stay small.
  // Vercel rejects request bodies over ~4.5MB, so raw phone photos
  // (3-8MB, +33% as base64) must be compressed client-side.
  function processFile(file: File): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) { reject(new Error("Not an image")); return; }
      if (file.size > 20 * 1024 * 1024) { reject(new Error("Image too large (max 20MB)")); return; }

      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX_EDGE = 1600;
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Could not process image")); return; }
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        const base64 = dataUrl.split(",")[1];
        resolve({
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          base64,
          mediaType: "image/jpeg",
          preview: dataUrl,
          name: file.name,
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Could not read image — try a JPG or PNG"));
      };
      img.src = objectUrl;
    });
  }

  async function addImages(files: FileList | File[]) {
    const toAdd = Array.from(files).slice(0, 4 - images.length);
    const processed = await Promise.all(toAdd.map(processFile).map((p) => p.catch(() => null)));
    const valid = processed.filter(Boolean) as UploadedImage[];
    setImages((prev) => [...prev, ...valid]);
  }

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  // ── Prediction ─────────────────────────────────────────────────────────────

  const runPredict = useCallback(
    async (desc: string, imgs: UploadedImage[]) => {
      if (desc.trim().length < 8 && imgs.length === 0) return;
      setPredicting(true);
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: desc,
            service,
            images: imgs.map((i) => ({ base64: i.base64, mediaType: i.mediaType })),
          }),
        });
        if (res.ok) setPrediction(await res.json());
      } catch {
        // silently fail — prediction is supplementary
      } finally {
        setPredicting(false);
      }
    },
    [service]
  );

  // Debounce prediction on text change
  useEffect(() => {
    if (predictTimer.current) clearTimeout(predictTimer.current);
    predictTimer.current = setTimeout(() => runPredict(description, images), 900);
    return () => { if (predictTimer.current) clearTimeout(predictTimer.current); };
  }, [description, images, runPredict]);

  // Immediate prediction on image add (after debounce clears)
  useEffect(() => {
    if (images.length > 0) runPredict(description, images);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  // ── Step 2: Get estimate ───────────────────────────────────────────────────

  async function getEstimate() {
    if (description.trim().length < 15) {
      setEstimateError("Add more detail so we can estimate accurately.");
      return;
    }
    setEstimateError("");
    setEstimating(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description,
          service,
          images: images.map((i) => ({ base64: i.base64, mediaType: i.mediaType })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setEstimate(data);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setEstimateError(err instanceof Error ? err.message : "Could not generate estimate.");
    } finally {
      setEstimating(false);
    }
  }

  // ── Step 4: Submit booking ─────────────────────────────────────────────────

  async function submitBooking() {
    setSubmitting(true);
    const ref = `PE-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone,
          service: service || estimate?.jobType || "Not specified",
          description: `${description}\n\nSuburb: ${suburb}\nPreferred time: ${preferredTime}${extraNotes ? `\nAdditional notes: ${extraNotes}` : ""}`,
          estimate,
        }),
      });
    } catch {
      // continue to success even if save fails
    }
    setJobRef(ref);
    setSubmitting(false);
    setStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Drag & drop ────────────────────────────────────────────────────────────

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) addImages(e.dataTransfer.files);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  const inputClass =
    "w-full bg-[#0D1B2A]/60 border border-white/8 focus:border-[#F5A623]/40 focus:bg-[#0D1B2A] text-[#F0EDE8] text-sm px-4 py-3 rounded-sm outline-none transition-all placeholder:text-[#6B6B6B]/40";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ── Header ── */}
        <section className="relative border-b border-white/5 overflow-hidden">
          <div className="dot-grid absolute inset-0 opacity-40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(13,27,42,0.95)_0%,_#0A0A0A_60%)]" />
          <div className="animate-pulse-glow absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F5A623]/4 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-6 py-16 text-center">
            <div className="inline-flex items-center gap-2 badge-shimmer rounded-full px-4 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
              <span className="text-xs font-medium tracking-widest uppercase text-[#F5A623]">
                Free instant estimate
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="text-[#F0EDE8]">Book a </span>
              <span className="text-gradient">Job</span>
            </h1>
            <p className="text-[#6B6B6B] max-w-md mx-auto">
              Describe your project, upload a photo, and get an AI-generated estimate in seconds.
            </p>
          </div>
        </section>

        {/* ── Wizard ── */}
        <section className="max-w-3xl mx-auto px-6 py-16">
          <StepIndicator step={step} />

          {/* ── STEP 1: Describe ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">
                  What type of job is it?
                </p>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_OPTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => setService(service === s.label ? "" : s.label)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-sm transition-all ${
                        service === s.label
                          ? "bg-[#F5A623]/10 border-[#F5A623]/40 text-[#F5A623]"
                          : "border-white/8 text-[#6B6B6B] hover:border-white/20 hover:text-[#F0EDE8]"
                      }`}
                    >
                      <span>{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">
                  Describe your job
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us what you need — the more detail the better. Property type, what's currently there, what you want. Or just drop a photo below and we'll figure it out."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Image upload */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B]">
                    Photos <span className="text-[#6B6B6B]/40 normal-case font-normal tracking-normal">(optional — up to 4)</span>
                  </label>
                  {images.length > 0 && (
                    <span className="text-xs text-[#6B6B6B]/50">{images.length}/4 uploaded</span>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {images.map((img, i) => (
                      <ImageThumbnail
                        key={img.id}
                        img={img}
                        observation={prediction?.imageObservations?.[i]}
                        onRemove={() => removeImage(img.id)}
                      />
                    ))}
                  </div>
                )}

                {images.length < 4 && (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? "border-[#F5A623]/60 bg-[#F5A623]/5"
                        : "border-white/10 hover:border-[#F5A623]/30 hover:bg-white/2"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && addImages(e.target.files)}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-sm border flex items-center justify-center text-lg transition-colors ${
                        dragOver ? "border-[#F5A623]/40 text-[#F5A623]" : "border-white/10 text-[#6B6B6B]"
                      }`}>
                        ↑
                      </div>
                      <p className="text-sm text-[#6B6B6B]">
                        {dragOver ? "Drop it here" : "Drag & drop photos, or click to browse"}
                      </p>
                      <p className="text-xs text-[#6B6B6B]/40">
                        JPG, PNG, WEBP · Up to 4 photos · AI will analyse what it sees
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* AI prediction */}
              {(predicting || prediction) && (
                <div className={`border rounded-sm px-5 py-4 transition-all duration-300 ${
                  predicting
                    ? "border-white/8 bg-white/2"
                    : "border-[#F5A623]/15 bg-[#F5A623]/3"
                }`}>
                  {predicting ? (
                    <div className="flex items-center gap-3">
                      <span className="w-3.5 h-3.5 rounded-full border border-[#F5A623]/60 border-t-transparent animate-spin" />
                      <p className="text-xs text-[#6B6B6B]">Analysing your job…</p>
                    </div>
                  ) : prediction ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-semibold tracking-widest uppercase text-[#6B6B6B]/50">Detected</span>
                          <span className="text-sm font-bold text-[#F5A623]">{prediction.jobType}</span>
                        </div>
                        <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border ${COMPLEXITY_STYLE[prediction.complexity]}`}>
                          {prediction.complexity}
                        </span>
                      </div>

                      {prediction.imageObservations.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B6B6B]/50">From your photos</p>
                          {prediction.imageObservations.map((obs, i) => (
                            <p key={i} className="text-xs text-[#6B6B6B] flex gap-2">
                              <span className="text-[#F5A623]/50 shrink-0">◎</span>{obs}
                            </p>
                          ))}
                        </div>
                      )}

                      <p className="text-xs text-[#6B6B6B] leading-relaxed border-t border-white/5 pt-3">{prediction.scopePreview}</p>
                    </div>
                  ) : null}
                </div>
              )}

              {estimateError && (
                <p className="text-xs text-red-400">{estimateError}</p>
              )}

              <button
                onClick={getEstimate}
                disabled={estimating || description.trim().length < 15}
                className="btn-glow relative w-full py-4 bg-[#F5A623] text-[#0A0A0A] font-bold text-sm tracking-wide hover:bg-[#FFD580] disabled:opacity-40 transition-colors rounded-sm z-0"
              >
                {estimating ? (
                  <span className="flex items-center justify-center gap-2.5">
                    <span className="w-4 h-4 rounded-full border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] animate-spin" />
                    Generating estimate…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Get Instant Estimate
                    <span className="text-[#0A0A0A]/60">→</span>
                  </span>
                )}
              </button>
            </div>
          )}

          {/* ── STEP 2: Estimate ── */}
          {step === 2 && estimate && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-1">Based on your description{images.length > 0 ? " and photos" : ""}</p>
                <h2 className="text-2xl font-bold text-[#F0EDE8]">Here&apos;s your estimate</h2>
              </div>

              {images.length > 0 && prediction?.imageObservations && prediction.imageObservations.length > 0 && (
                <div className="border border-white/8 rounded-sm px-5 py-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">What we saw in your photos</p>
                  {prediction.imageObservations.map((obs, i) => (
                    <p key={i} className="text-xs text-[#6B6B6B] flex gap-2 mt-1">
                      <span className="text-[#F5A623]/50 shrink-0">◎</span>{obs}
                    </p>
                  ))}
                </div>
              )}

              <EstimateCard estimate={estimate} />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="btn-glow relative flex-1 py-4 bg-[#F5A623] text-[#0A0A0A] font-bold text-sm tracking-wide hover:bg-[#FFD580] transition-colors rounded-sm z-0"
                >
                  Book this job →
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 border border-white/8 text-[#6B6B6B] text-sm hover:text-[#F0EDE8] hover:border-white/20 transition-all rounded-sm"
                >
                  ← Edit description
                </button>
              </div>

              <p className="text-xs text-[#6B6B6B]/40 text-center">
                This estimate is AI-generated. We&apos;ll confirm the exact price within 24 hours.
              </p>
            </div>
          )}

          {/* ── STEP 3: Details ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-1">Almost there</p>
                <h2 className="text-2xl font-bold text-[#F0EDE8]">Your details</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Name *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Phone *</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="04xx xxx xxx" className={inputClass} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Email *</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Suburb</label>
                  <input type="text" value={suburb} onChange={(e) => setSuburb(e.target.value)} placeholder="e.g. Buderim, Noosa, Mooloolaba" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">When do you need this done?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PREFERRED_TIMES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setPreferredTime(t)}
                      className={`px-3 py-2.5 text-xs rounded-sm border text-left transition-all ${
                        preferredTime === t
                          ? "bg-[#F5A623]/10 border-[#F5A623]/40 text-[#F5A623]"
                          : "border-white/8 text-[#6B6B6B] hover:border-white/20 hover:text-[#F0EDE8]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">
                  Anything else? <span className="text-[#6B6B6B]/40 normal-case font-normal tracking-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={extraNotes}
                  onChange={(e) => setExtraNotes(e.target.value)}
                  placeholder="Access notes, parking, tenant situation, any other details…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Estimate summary */}
              {estimate && (
                <div className="border border-white/5 rounded-sm px-5 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-[#6B6B6B] mb-0.5">{estimate.jobType}</p>
                    <p className="text-sm font-bold text-[#F5A623]">A${estimate.totalCost.min.toLocaleString()}–{estimate.totalCost.max.toLocaleString()} <span className="text-xs font-normal text-[#6B6B6B]">exc. GST</span></p>
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs text-[#6B6B6B] hover:text-[#F5A623] transition-colors">
                    Review estimate
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={submitBooking}
                  disabled={submitting || !name || !email || !phone}
                  className="btn-glow relative flex-1 py-4 bg-[#F5A623] text-[#0A0A0A] font-bold text-sm tracking-wide hover:bg-[#FFD580] disabled:opacity-40 transition-colors rounded-sm z-0"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <span className="w-4 h-4 rounded-full border-2 border-[#0A0A0A]/30 border-t-[#0A0A0A] animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    "Confirm Booking Request →"
                  )}
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 border border-white/8 text-[#6B6B6B] text-sm hover:text-[#F0EDE8] hover:border-white/20 transition-all rounded-sm"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Confirmed ── */}
          {step === 4 && (
            <div className="text-center space-y-6">
              {/* Success icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border border-[#F5A623]/30 bg-[#F5A623]/8 flex items-center justify-center text-2xl">
                    ✓
                  </div>
                  <div className="absolute inset-0 rounded-full bg-[#F5A623]/10 animate-ping" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#F5A623] mb-2">Booking Request Received</p>
                <h2 className="text-3xl font-bold text-[#F0EDE8] mb-1">You&apos;re on the list.</h2>
                <p className="text-[#6B6B6B]">We&apos;ll be in touch within 24 hours with a confirmed quote.</p>
              </div>

              {jobRef && (
                <div className="inline-block border border-white/8 rounded-sm px-6 py-3">
                  <p className="text-xs text-[#6B6B6B] mb-1">Job Reference</p>
                  <p className="text-lg font-bold text-[#F5A623] font-mono tracking-wider">{jobRef}</p>
                </div>
              )}

              <div className="border border-white/5 rounded-sm divide-y divide-white/5 text-left max-w-sm mx-auto">
                {[
                  { n: "01", text: "We review your job and photos" },
                  { n: "02", text: "You get a confirmed fixed quote within 24 hrs" },
                  { n: "03", text: "Approve it and we lock in a time" },
                  { n: "04", text: "Job done, Form 4 provided" },
                ].map((s) => (
                  <div key={s.n} className="px-5 py-3.5 flex items-center gap-4">
                    <span className="text-xs font-bold text-[#F5A623]/50 font-mono shrink-0">{s.n}</span>
                    <span className="text-sm text-[#6B6B6B]">{s.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setStep(1); setDescription(""); setImages([]); setEstimate(null); setPrediction(null); setService(""); setName(""); setEmail(""); setPhone(""); setSuburb(""); setPreferredTime(""); }}
                className="text-sm text-[#6B6B6B] hover:text-[#F5A623] transition-colors"
              >
                Submit another job →
              </button>
            </div>
          )}
        </section>

      </main>
      <Footer />
    </>
  );
}
