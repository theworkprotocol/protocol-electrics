import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * Customer-facing written quote — the page Blake forwards after Monique
 * prepares it. Data lives in Monique (the pricing brain); this page is pure
 * Protocol Electrics presentation. Tokenized link, never indexed.
 */

export const metadata: Metadata = {
  title: "Your Quote — Protocol Electrics",
  robots: { index: false, follow: false },
};

interface PublicQuote {
  client_first_name: string;
  job_type: string;
  lines: { label: string; qty: number; pricing: string; cents: number }[];
  total_cents: number;
  needs_site_visit: boolean;
  disclaimer: string;
  prepared_at: string;
  valid_until: string;
  expired: boolean;
}

async function fetchQuote(token: string): Promise<PublicQuote | null> {
  const engineUrl = process.env.ENGINE_URL;
  if (!engineUrl) return null;
  try {
    const res = await fetch(`${engineUrl}/api/public/quote/${token}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as PublicQuote;
  } catch {
    return null;
  }
}

const aud = (cents: number) => `$${(cents / 100).toLocaleString("en-AU")}`;
const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-AU", {
    timeZone: "Australia/Brisbane",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default async function QuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const quote = await fetchQuote(token);
  if (!quote) notFound();

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-5 py-10 text-neutral-100 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <header className="mb-10 flex flex-wrap items-baseline justify-between gap-2">
          <span className="font-display text-lg font-semibold tracking-tight">
            <span className="wordmark-neon">Protocol</span>{" "}
            <span className="text-[#F5A623]">Electrics</span>
          </span>
          <span className="text-xs text-[#6B6B6B]">{longDate(quote.prepared_at)}</span>
        </header>

        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#F5A623]">
          Electrical quote
        </p>
        <h1 className="font-display mb-2 text-3xl font-semibold tracking-tight">
          {quote.client_first_name}, here&apos;s your price.
        </h1>
        <p className="mb-10 text-sm text-[#8A8A8A]">
          {quote.job_type} · Sunshine Coast · fixed price from our set price book — the quote is the invoice.
        </p>

        <div className="overflow-hidden rounded-2xl border border-neutral-800">
          {quote.lines.map((l, i) => (
            <div
              key={i}
              className="flex items-baseline justify-between gap-4 border-b border-neutral-800/70 bg-neutral-900/40 px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-neutral-100">
                  {l.label}
                  {l.qty > 1 && <span className="text-[#8A8A8A]"> × {l.qty}</span>}
                </p>
                {l.pricing !== aud(l.cents) && (
                  <p className="mt-0.5 text-xs text-[#6B6B6B]">{l.pricing}</p>
                )}
              </div>
              <span className="shrink-0 font-mono text-sm text-neutral-200">{aud(l.cents)}</span>
            </div>
          ))}
          <div className="flex items-baseline justify-between bg-neutral-900 px-5 py-5">
            <p className="text-sm font-medium text-neutral-300">
              {quote.needs_site_visit ? "Estimated total (from)" : "Total"}
              <span className="ml-2 text-xs text-[#6B6B6B]">inc GST</span>
            </p>
            <span className="font-display text-2xl font-semibold text-[#F5A623]">
              {aud(quote.total_cents)}
            </span>
          </div>
        </div>

        {quote.needs_site_visit && (
          <p className="mt-4 rounded-xl border border-[#F5A623]/25 bg-[#F5A623]/8 px-4 py-3 text-sm text-neutral-300">
            This one needs eyes on it — the price above is a from-price, and Blake will confirm the
            exact number with a <span className="text-[#F5A623]">free site visit</span> before any
            work starts.
          </p>
        )}

        <p className="mt-4 text-xs leading-relaxed text-[#6B6B6B]">{quote.disclaimer}</p>

        {quote.expired ? (
          <div className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-4 text-sm text-neutral-400">
            This quote has expired — prices may have moved. Call Blake for a fresh one.
          </div>
        ) : (
          <p className="mt-8 text-sm text-neutral-300">
            Happy with it? Reply to Blake&apos;s message or tap below and it&apos;s locked in —
            valid until <span className="text-neutral-100">{longDate(quote.valid_until)}</span>.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="tel:0428653509"
            className="rounded-xl bg-[#F5A623] px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#C4831A]"
          >
            Call Blake — 0428 653 509
          </a>
          <a
            href="sms:0428653509"
            className="rounded-xl border border-neutral-700 px-6 py-3 text-sm font-medium text-neutral-200 transition-colors hover:border-[#F5A623] hover:text-[#F5A623]"
          >
            Text back
          </a>
        </div>

        <footer className="mt-14 border-t border-neutral-800/70 pt-5 text-xs text-[#6B6B6B]">
          Protocol Electrics · Licensed electrician · Sunshine Coast, QLD ·{" "}
          <a href="mailto:admin@protocolelectrics.com.au" className="hover:text-[#F5A623]">
            admin@protocolelectrics.com.au
          </a>
        </footer>
      </div>
    </main>
  );
}
