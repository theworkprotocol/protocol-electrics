"use client";

import { useState, useEffect, useCallback } from "react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

function generateRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "Q-";
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function formatAUD(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(amount);
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function plusDaysISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function newItem(): LineItem {
  return {
    id: Math.random().toString(36).slice(2),
    description: "",
    quantity: 1,
    unit: "lot",
    unitPrice: 0,
  };
}

const QUICK_ADD = [
  { label: "Labour (1hr)", description: "Labour", quantity: 1, unit: "hr", unitPrice: 120 },
  { label: "After-hours labour (1hr)", description: "After-hours labour", quantity: 1, unit: "hr", unitPrice: 180 },
  { label: "Callout fee", description: "After-hours callout fee", quantity: 1, unit: "each", unitPrice: 150 },
  { label: "Materials (allowance)", description: "Materials & consumables", quantity: 1, unit: "lot", unitPrice: 0 },
];

const DEFAULT_NOTES =
  "Quote valid for 30 days. Payment due within 14 days of job completion. All work carried out by QBCC licensed contractors.";

const INPUT_CLS =
  "bg-[#0A0A0A] border border-white/10 text-[#F0EDE8] px-3 py-2 rounded-sm text-sm focus:border-[#F5A623]/50 outline-none w-full transition-colors";
const LABEL_CLS = "text-xs text-[#6B6B6B] uppercase tracking-widest font-semibold mb-1 block";

export default function QuoteBuilder() {
  // Customer details
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobAddress, setJobAddress] = useState("");
  const [quoteRef, setQuoteRef] = useState("");
  const [quoteDate, setQuoteDate] = useState(todayISO());
  const [validUntil, setValidUntil] = useState(plusDaysISO(30));

  // Line items
  const [lineItems, setLineItems] = useState<LineItem[]>([newItem()]);

  // Notes
  const [notes, setNotes] = useState(DEFAULT_NOTES);

  // Generate reference on mount
  useEffect(() => {
    setQuoteRef(generateRef());
  }, []);

  // Derived totals
  const subtotal = lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const gst = subtotal * 0.1;
  const total = subtotal + gst;

  // Line item helpers
  const updateItem = useCallback(
    (id: string, field: keyof LineItem, value: string | number) => {
      setLineItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addItem = useCallback(() => {
    setLineItems((prev) => [...prev, newItem()]);
  }, []);

  const quickAdd = useCallback(
    (preset: (typeof QUICK_ADD)[number]) => {
      setLineItems((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2),
          description: preset.description,
          quantity: preset.quantity,
          unit: preset.unit,
          unitPrice: preset.unitPrice,
        },
      ]);
    },
    []
  );

  const formatDateDisplay = (iso: string) => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <>
      {/* Print CSS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: #070709 !important; }
          @page { margin: 15mm; size: A4; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="h-full flex flex-col lg:flex-row overflow-auto lg:overflow-hidden">
        {/* ── LEFT PANEL: Builder Form ── */}
        <div className="no-print w-full lg:w-[480px] lg:shrink-0 border-r border-white/5 overflow-y-auto">
          {/* Page header */}
          <div className="sticky top-0 z-10 bg-[#070709] border-b border-white/5 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-[#F0EDE8] tracking-wide">Quote Builder</h1>
              <p className="text-xs text-[#6B6B6B]">Fill in details — preview updates live</p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-[#F5A623] text-[#0A0A0A] text-xs font-bold rounded-sm hover:bg-[#FFD580] transition-colors"
            >
              <span>⎙</span>
              Print / Save PDF
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Details */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-[#F5A623]/20" />
                <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
                  Customer Details
                </span>
                <div className="h-px flex-1 bg-[#F5A623]/20" />
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={LABEL_CLS}>Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Smith"
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0400 000 000"
                      className={INPUT_CLS}
                    />
                  </div>
                </div>

                <div>
                  <label className={LABEL_CLS}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={INPUT_CLS}
                  />
                </div>

                <div>
                  <label className={LABEL_CLS}>Job Address</label>
                  <input
                    type="text"
                    value={jobAddress}
                    onChange={(e) => setJobAddress(e.target.value)}
                    placeholder="123 Main St, Noosa Heads QLD 4567"
                    className={INPUT_CLS}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={LABEL_CLS}>Quote Ref</label>
                    <input
                      type="text"
                      value={quoteRef}
                      onChange={(e) => setQuoteRef(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Date Issued</label>
                    <input
                      type="date"
                      value={quoteDate}
                      onChange={(e) => setQuoteDate(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLS}>Valid Until</label>
                    <input
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Line Items */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-[#F5A623]/20" />
                <span className="text-xs font-semibold tracking-widest uppercase text-[#F5A623]">
                  Line Items
                </span>
                <div className="h-px flex-1 bg-[#F5A623]/20" />
              </div>

              {/* Quick-add buttons */}
              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_ADD.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => quickAdd(preset)}
                    className="px-2.5 py-1.5 text-xs border border-white/10 text-[#6B6B6B] rounded-sm hover:border-[#F5A623]/30 hover:text-[#F5A623] transition-all"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              {/* Line item rows */}
              <div className="space-y-2">
                {/* Header */}
                <div className="hidden sm:grid grid-cols-[1fr_56px_48px_80px_72px_32px] gap-2 px-1">
                  {["Description", "Qty", "Unit", "Price", "Total", ""].map((h) => (
                    <span key={h} className="text-[10px] text-[#6B6B6B] uppercase tracking-widest font-semibold">
                      {h}
                    </span>
                  ))}
                </div>

                {lineItems.map((item) => {
                  const lineTotal = item.quantity * item.unitPrice;
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1fr_56px_48px_80px_72px_32px] gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        placeholder="Description"
                        className={INPUT_CLS}
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                        className={INPUT_CLS + " text-center px-1"}
                      />
                      <input
                        type="text"
                        value={item.unit}
                        onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                        placeholder="lot"
                        className={INPUT_CLS + " text-center px-1"}
                      />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                        className={INPUT_CLS + " text-right px-2"}
                      />
                      <div className="bg-[#0A0A0A] border border-white/5 text-[#F5A623]/80 px-2 py-2 rounded-sm text-xs text-right font-medium tabular-nums">
                        {formatAUD(lineTotal)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center justify-center w-8 h-8 text-[#6B6B6B] hover:text-red-400 hover:bg-red-400/8 rounded-sm transition-all text-sm"
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addItem}
                className="mt-3 w-full py-2 border border-dashed border-white/10 text-[#6B6B6B] text-xs hover:border-[#F5A623]/30 hover:text-[#F5A623] rounded-sm transition-all"
              >
                + Add line item
              </button>
            </section>

            {/* Totals */}
            <section>
              <div className="border border-white/8 rounded-sm divide-y divide-white/5">
                {[
                  { label: "Subtotal", value: subtotal, muted: true },
                  { label: "GST (10%)", value: gst, muted: true },
                ].map(({ label, value, muted }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5">
                    <span className={`text-xs ${muted ? "text-[#6B6B6B]" : "text-[#F0EDE8] font-bold"}`}>
                      {label}
                    </span>
                    <span className={`text-sm tabular-nums ${muted ? "text-[#F0EDE8]" : "text-[#F5A623] font-bold"}`}>
                      {formatAUD(value)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 bg-[#F5A623]/5">
                  <span className="text-sm font-bold text-[#F0EDE8]">Total (inc. GST)</span>
                  <span className="text-lg font-bold text-[#F5A623] tabular-nums">{formatAUD(total)}</span>
                </div>
              </div>
            </section>

            {/* Notes */}
            <section>
              <label className={LABEL_CLS}>Notes & Terms</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="bg-[#0A0A0A] border border-white/10 text-[#F0EDE8] px-3 py-2 rounded-sm text-sm focus:border-[#F5A623]/50 outline-none w-full transition-colors resize-none"
              />
            </section>

            {/* Bottom print button */}
            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-[#F5A623] text-[#0A0A0A] text-sm font-bold rounded-sm hover:bg-[#FFD580] transition-colors"
            >
              ⎙ Print / Save PDF
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL: Live Preview / Print Target ── */}
        <div className="flex-1 overflow-y-auto bg-[#070709] p-6 lg:p-10">
          <div
            id="quote-document"
            className="max-w-[750px] mx-auto bg-[#0D0D0D] border border-white/8 rounded-sm overflow-hidden"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            {/* Document header */}
            <div className="px-10 pt-10 pb-6 bg-gradient-to-br from-[#111] to-[#0A0A0A]">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <h2
                    className="text-2xl font-bold tracking-tight mb-0.5"
                    style={{ color: "#F0EDE8", letterSpacing: "-0.02em" }}
                  >
                    Protocol{" "}
                    <span style={{ color: "#F5A623" }}>Electrics</span>
                  </h2>
                  <p className="text-xs text-[#6B6B6B] tracking-widest uppercase">
                    Electrical Contractor
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-1.5">ABN: XX XXX XXX XXX</p>
                  <p className="text-xs text-[#6B6B6B]">Sunshine Coast, QLD</p>
                </div>

                <div className="text-right">
                  <div
                    className="inline-block px-4 py-1.5 rounded-sm mb-3 text-xs font-bold tracking-widest uppercase"
                    style={{
                      background: "rgba(245,166,35,0.12)",
                      border: "1px solid rgba(245,166,35,0.3)",
                      color: "#F5A623",
                    }}
                  >
                    QUOTE
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-[#6B6B6B]">
                      Ref:{" "}
                      <span className="text-[#F0EDE8] font-semibold">
                        {quoteRef || "Q-XXXXXX"}
                      </span>
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      Issued:{" "}
                      <span className="text-[#F0EDE8]">{formatDateDisplay(quoteDate)}</span>
                    </p>
                    <p className="text-xs text-[#6B6B6B]">
                      Valid until:{" "}
                      <span className="text-[#F0EDE8]">{formatDateDisplay(validUntil)}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Gold divider */}
              <div
                className="h-px w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #F5A623 0%, rgba(245,166,35,0.4) 60%, transparent 100%)",
                }}
              />
            </div>

            {/* Customer block */}
            <div className="px-10 py-6 border-b border-white/5">
              <p
                className="text-[10px] font-semibold tracking-widest uppercase mb-3"
                style={{ color: "#6B6B6B" }}
              >
                Prepared For
              </p>
              <p className="text-base font-semibold text-[#F0EDE8]">
                {customerName || <span className="text-[#6B6B6B]/40 italic">Customer Name</span>}
              </p>
              {email && <p className="text-sm text-[#6B6B6B] mt-0.5">{email}</p>}
              {phone && <p className="text-sm text-[#6B6B6B]">{phone}</p>}
              {jobAddress && (
                <p className="text-sm text-[#6B6B6B] mt-1">
                  <span className="text-[#6B6B6B]/50 text-xs uppercase tracking-wider mr-1">
                    Site:
                  </span>
                  {jobAddress}
                </p>
              )}
            </div>

            {/* Line items table */}
            <div className="px-10 py-6 border-b border-white/5">
              <p
                className="text-[10px] font-semibold tracking-widest uppercase mb-4"
                style={{ color: "#6B6B6B" }}
              >
                Scope of Works
              </p>

              {/* Table header */}
              <div
                className="grid gap-2 px-3 py-2 rounded-sm mb-1"
                style={{
                  gridTemplateColumns: "1fr 48px 48px 80px 80px",
                  background: "rgba(245,166,35,0.06)",
                }}
              >
                {["Description", "Qty", "Unit", "Unit Price", "Total"].map((h) => (
                  <span
                    key={h}
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "#6B6B6B" }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Table rows */}
              <div className="divide-y divide-white/4">
                {lineItems.map((item, idx) => {
                  const lineTotal = item.quantity * item.unitPrice;
                  const isEven = idx % 2 === 0;
                  return (
                    <div
                      key={item.id}
                      className="grid gap-2 px-3 py-2.5"
                      style={{
                        gridTemplateColumns: "1fr 48px 48px 80px 80px",
                        background: isEven ? "transparent" : "rgba(255,255,255,0.015)",
                      }}
                    >
                      <span className="text-sm text-[#F0EDE8]">
                        {item.description || (
                          <span style={{ color: "rgba(107,107,107,0.4)", fontStyle: "italic" }}>
                            Item description
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-[#6B6B6B] text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <span className="text-sm text-[#6B6B6B] text-center">{item.unit}</span>
                      <span className="text-sm text-[#6B6B6B] text-right tabular-nums">
                        {formatAUD(item.unitPrice)}
                      </span>
                      <span className="text-sm text-[#F0EDE8] text-right font-medium tabular-nums">
                        {formatAUD(lineTotal)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Totals block */}
            <div className="px-10 py-6 border-b border-white/5 flex justify-end">
              <div className="w-64 space-y-0">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-[#6B6B6B]">Subtotal</span>
                  <span className="text-sm text-[#F0EDE8] tabular-nums">{formatAUD(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-[#6B6B6B]">GST (10%)</span>
                  <span className="text-sm text-[#F0EDE8] tabular-nums">{formatAUD(gst)}</span>
                </div>
                <div
                  className="flex items-center justify-between py-3 px-3 mt-1 rounded-sm"
                  style={{ background: "rgba(245,166,35,0.08)", border: "1px solid rgba(245,166,35,0.15)" }}
                >
                  <span className="text-sm font-bold text-[#F0EDE8]">Total (inc. GST)</span>
                  <span className="text-xl font-bold tabular-nums" style={{ color: "#F5A623" }}>
                    {formatAUD(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {notes && (
              <div className="px-10 py-6 border-b border-white/5">
                <p
                  className="text-[10px] font-semibold tracking-widest uppercase mb-2"
                  style={{ color: "#6B6B6B" }}
                >
                  Terms & Conditions
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#6B6B6B" }}>
                  {notes}
                </p>
              </div>
            )}

            {/* Footer */}
            <div
              className="px-10 py-5 flex items-center justify-between gap-4"
              style={{ background: "rgba(245,166,35,0.04)", borderTop: "1px solid rgba(245,166,35,0.12)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#F5A623" }} />
                <span
                  className="text-[10px] font-semibold tracking-widest uppercase"
                  style={{ color: "#F5A623" }}
                >
                  Protocol Electrics
                </span>
              </div>
              <p
                className="text-[10px] text-center leading-relaxed"
                style={{ color: "rgba(107,107,107,0.7)" }}
              >
                QBCC Licence No. XXXXXXX · CEC Accredited Installer · ARCtick Licensed
                <br />
                protocolelectrics.com.au
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
