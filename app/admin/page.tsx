"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Enquiry, EnquiryStatus } from "@/lib/store";

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
  quoted: "Quoted",
  booked: "Booked",
  completed: "Completed",
  declined: "Declined",
};

const STATUS_STYLE: Record<EnquiryStatus, string> = {
  new: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  reviewed: "text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/20",
  quoted: "text-[#F5A623] bg-[#F5A623]/10 border-[#F5A623]/20",
  booked: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  completed: "text-[#6B6B6B] bg-white/5 border-white/10",
  declined: "text-red-400/60 bg-red-400/5 border-red-400/10",
};

const SERVICE_ICONS: Record<string, string> = {
  "Solar Installation": "☀️",
  "EV Charger Installation": "🔌",
  "Air Conditioning": "❄️",
  "Electrical Contracting": "⚡",
  "Maintenance": "🔧",
  "Other / Not Sure": "◎",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export default function AdminDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");
  const [filter, setFilter] = useState<EnquiryStatus | "all">("all");

  useEffect(() => {
    fetch("/api/admin/enquiries")
      .then((r) => r.json())
      .then((data) => {
        setEnquiries(data);
        setLoading(false);
      });
  }, []);

  function openEnquiry(e: Enquiry) {
    setSelected(e);
    setNotes(e.adminNotes || "");
  }

  async function updateStatus(id: string, status: EnquiryStatus) {
    const res = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const updated = await res.json();
    setEnquiries((prev) => prev.map((e) => (e.id === id ? updated : e)));
    if (selected?.id === id) setSelected(updated);
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    const res = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, adminNotes: notes }),
    });
    const updated = await res.json();
    setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setSelected(updated);
    setSaving(false);
  }

  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === "new").length,
    quoted: enquiries.filter((e) => e.status === "quoted").length,
    booked: enquiries.filter((e) => e.status === "booked").length,
  };

  const filtered =
    filter === "all" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="shrink-0 border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-[#F0EDE8] tracking-wide">Dashboard</h1>
          <p className="text-xs text-[#6B6B6B]">
            {new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <Link
          href="/admin/assistant"
          className="flex items-center gap-2 px-4 py-2 bg-[#F5A623]/10 border border-[#F5A623]/20 text-[#F5A623] text-xs font-medium rounded-sm hover:bg-[#F5A623]/15 transition-colors"
        >
          <span>◈</span>
          Open AI Assistant
        </Link>
      </div>

      {/* Stats strip */}
      <div className="shrink-0 border-b border-white/5 grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
        {[
          { label: "Total Enquiries", value: stats.total, color: "text-[#F0EDE8]" },
          { label: "New", value: stats.new, color: "text-[#F5A623]" },
          { label: "Quoted", value: stats.quoted, color: "text-purple-400" },
          { label: "Booked", value: stats.booked, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="px-6 py-4 flex items-center gap-3">
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-[#6B6B6B] leading-tight">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Body: list + detail */}
      <div className="flex-1 flex overflow-hidden">
        {/* Enquiry list */}
        <div className="w-full md:w-80 shrink-0 border-r border-white/5 flex flex-col overflow-hidden">
          {/* Filter bar */}
          <div className="shrink-0 px-4 py-3 border-b border-white/5 flex gap-1.5 overflow-x-auto">
            {(["all", "new", "reviewed", "quoted", "booked", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-2.5 py-1 text-xs rounded-full border transition-all ${
                  filter === f
                    ? "bg-[#F5A623]/10 border-[#F5A623]/30 text-[#F5A623]"
                    : "border-white/8 text-[#6B6B6B] hover:text-[#F0EDE8] hover:border-white/15"
                }`}
              >
                {f === "all" ? "All" : STATUS_LABELS[f]}
                {f === "new" && stats.new > 0 && (
                  <span className="ml-1.5 bg-[#F5A623] text-[#0A0A0A] text-[9px] font-bold px-1 rounded-full">
                    {stats.new}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-24 text-xs text-[#6B6B6B]">
                Loading…
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-24 text-xs text-[#6B6B6B]">
                No enquiries
              </div>
            ) : (
              filtered.map((e) => (
                <button
                  key={e.id}
                  onClick={() => openEnquiry(e)}
                  className={`w-full text-left px-4 py-4 border-b border-white/5 hover:bg-white/2 transition-colors ${
                    selected?.id === e.id ? "bg-[#F5A623]/5 border-l-2 border-l-[#F5A623]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-sm font-semibold text-[#F0EDE8] truncate">{e.name}</span>
                    <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${STATUS_STYLE[e.status]}`}>
                      {STATUS_LABELS[e.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs">{SERVICE_ICONS[e.service] || "◎"}</span>
                    <span className="text-xs text-[#6B6B6B] truncate">{e.service || "Not specified"}</span>
                  </div>
                  {e.estimate && (
                    <p className="text-xs text-[#F5A623]/70 font-medium">
                      A${e.estimate.totalCost.min.toLocaleString()}–{e.estimate.totalCost.max.toLocaleString()}
                    </p>
                  )}
                  <p className="text-[10px] text-[#6B6B6B]/50 mt-1">{timeAgo(e.createdAt)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail panel */}
        <div className="hidden md:block flex-1 overflow-y-auto">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-12 h-12 rounded-sm border border-white/8 flex items-center justify-center text-2xl mb-4">
                ▦
              </div>
              <p className="text-sm text-[#6B6B6B]">Select an enquiry to view details</p>
            </div>
          ) : (
            <div className="p-8 max-w-2xl space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#F0EDE8] mb-0.5">{selected.name}</h2>
                  <p className="text-xs text-[#6B6B6B]">
                    {selected.email}
                    {selected.phone && ` · ${selected.phone}`}
                  </p>
                  <p className="text-xs text-[#6B6B6B]/50 mt-1">{new Date(selected.createdAt).toLocaleString("en-AU")}</p>
                </div>

                {/* Current status badge */}
                <span className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border ${STATUS_STYLE[selected.status]}`}>
                  {STATUS_LABELS[selected.status]}
                </span>
              </div>

              {/* Service + description */}
              <div className="border border-white/5 rounded-sm divide-y divide-white/5">
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-1">Service</p>
                  <p className="text-sm text-[#F0EDE8] flex items-center gap-2">
                    <span>{SERVICE_ICONS[selected.service] || "◎"}</span>
                    {selected.service || "Not specified"}
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Job Description</p>
                  <p className="text-sm text-[#F0EDE8] leading-relaxed">{selected.description}</p>
                </div>
              </div>

              {/* AI Estimate */}
              {selected.estimate && (
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">AI Estimate</p>
                  <div className="border border-[#F5A623]/15 rounded-sm divide-y divide-white/5">
                    <div className="px-5 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#F5A623] font-medium mb-0.5">{selected.estimate.jobType}</p>
                        <p className="text-xs text-[#6B6B6B]">{selected.estimate.timeframe}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[#F5A623]">
                          A${selected.estimate.totalCost.min.toLocaleString()}
                          <span className="text-sm text-[#6B6B6B]">–{selected.estimate.totalCost.max.toLocaleString()}</span>
                        </p>
                        <p className="text-[10px] text-[#6B6B6B]">
                          {selected.estimate.labourHours.min}–{selected.estimate.labourHours.max}hrs labour · {selected.estimate.confidence} confidence
                        </p>
                      </div>
                    </div>
                    <div className="px-5 py-3">
                      <p className="text-xs text-[#6B6B6B] leading-relaxed">{selected.estimate.summary}</p>
                    </div>
                    {selected.estimate.clarifyingQuestions.length > 0 && (
                      <div className="px-5 py-3">
                        <p className="text-[10px] font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Open questions</p>
                        <ul className="space-y-1">
                          {selected.estimate.clarifyingQuestions.map((q, i) => (
                            <li key={i} className="text-xs text-[#6B6B6B] flex gap-2">
                              <span className="text-[#F5A623]/50 shrink-0">→</span>{q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pipeline */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-3">Pipeline</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map((s) => {
                    const isActive = selected.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(selected.id, s)}
                        disabled={isActive}
                        className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                          isActive
                            ? STATUS_STYLE[s] + " opacity-100 cursor-default"
                            : "border-white/8 text-[#6B6B6B] hover:border-white/20 hover:text-[#F0EDE8]"
                        }`}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin notes */}
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-[#6B6B6B] mb-2">Your Notes</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Add notes about this job — confirmed price, scheduling, site observations…"
                  className="w-full bg-[#0D1B2A]/40 border border-white/8 focus:border-[#F5A623]/30 text-[#F0EDE8] text-sm px-4 py-3 rounded-sm outline-none transition-all resize-none placeholder:text-[#6B6B6B]/30"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-[#6B6B6B]/40">
                    {notes !== selected.adminNotes ? "Unsaved changes" : "Saved"}
                  </p>
                  <button
                    onClick={saveNotes}
                    disabled={saving || notes === selected.adminNotes}
                    className="px-4 py-1.5 bg-[#F5A623] text-[#0A0A0A] text-xs font-bold rounded-sm hover:bg-[#FFD580] disabled:opacity-40 transition-colors"
                  >
                    {saving ? "Saving…" : "Save Notes"}
                  </button>
                </div>
              </div>

              {/* Quick action: open in assistant */}
              <div className="border border-white/5 rounded-sm px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-[#F0EDE8] mb-0.5">Need help with this job?</p>
                  <p className="text-xs text-[#6B6B6B]">Ask the AI assistant to draft a quote, suggest pricing, or answer questions.</p>
                </div>
                <Link
                  href="/admin/assistant"
                  className="shrink-0 flex items-center gap-2 px-4 py-2 border border-[#F5A623]/20 text-[#F5A623] text-xs font-medium rounded-sm hover:bg-[#F5A623]/8 transition-colors"
                >
                  <span>◈</span>
                  Open Assistant
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
