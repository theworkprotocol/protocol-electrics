import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { BUSINESS } from "@/lib/schema";
import { RESPONSE_PROMISE } from "@/lib/email";
import { JOB_TYPES, TIMING_OPTIONS } from "@/lib/enquiry";
import { submitEnquiryAction } from "./actions";

/**
 * The canonical booking/enquiry path (agent-bookability-spec.md, Phase 2):
 * one semantic server-rendered form. No CAPTCHA, no account, no payment,
 * no JS required — spam control is the honeypot + Monique's rate limit.
 */

export const metadata: Metadata = {
  title: "Get a Quote",
  description:
    "Tell us the job and get a written fixed-price quote within 24 hours. No account, no callout surprises — the quote is the invoice.",
  openGraph: {
    title: "Get a Quote | Protocol Electrics",
    url: "https://www.protocolelectrics.com.au/enquire",
  },
};

const ERRORS: Record<string, string> = {
  missing: "Name, email, phone and a short description are required — everything else is optional.",
  email: "That email address doesn't look right — mind checking it?",
  phone: "That phone number doesn't look right — mind checking it?",
  rate: "That's a few enquiries in quick succession — give it ten minutes and try again, or just call us.",
};

const field =
  "w-full rounded-sm border border-white/10 bg-[#111111] px-4 py-3 text-sm text-[#F0EDE8] placeholder-[#4A4A4A] focus:border-[#F5A623]/50 focus:outline-none";
const labelCls = "mb-1.5 block text-xs font-medium tracking-widest uppercase text-[#6B6B6B]";

export default async function EnquirePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16">
        <section className="relative border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(13,27,42,0.95)_0%,_#0A0A0A_65%)]" />
          <div className="relative max-w-3xl mx-auto px-6 py-16">
            <p className="mb-3 text-xs font-medium tracking-widest uppercase text-[#F5A623]">
              Get a quote
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-[#F0EDE8] mb-4">
              Tell us the job. <span className="text-gradient">We&apos;ll price it properly.</span>
            </h1>
            <p className="text-[#6B6B6B] max-w-xl">
              A written fixed-price quote {RESPONSE_PROMISE} — no account, no callout surprises,
              and the quote is the invoice. Prefer photos and an instant estimate? Try the{" "}
              <a href="/book" className="text-[#F5A623] underline-offset-2 hover:underline">
                AI estimator
              </a>
              .
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-6 py-12">
          {error && (
            <p
              role="alert"
              className="mb-6 rounded-sm border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-3 text-sm text-[#F5A623]"
            >
              {ERRORS[error] ?? ERRORS.missing}
            </p>
          )}

          <form action={submitEnquiryAction} className="space-y-6">
            {/* Honeypot — off-screen; humans and legitimate agents never fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelCls}>Name *</label>
                <input id="name" name="name" type="text" required autoComplete="name" className={field} placeholder="Sarah Smith" />
              </div>
              <div>
                <label htmlFor="phone" className={labelCls}>Phone *</label>
                <input id="phone" name="phone" type="tel" required autoComplete="tel" className={field} placeholder="0400 000 000" />
              </div>
              <div>
                <label htmlFor="email" className={labelCls}>Email *</label>
                <input id="email" name="email" type="email" required autoComplete="email" className={field} placeholder="you@email.com" />
              </div>
              <div>
                <label htmlFor="suburb" className={labelCls}>Suburb</label>
                <input id="suburb" name="suburb" type="text" autoComplete="address-level2" list="service-suburbs" className={field} placeholder="Buderim" />
                <datalist id="service-suburbs">
                  {BUSINESS.areaServed.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              <div>
                <label htmlFor="job_type" className={labelCls}>Job type</label>
                <select id="job_type" name="job_type" className={field} defaultValue="">
                  <option value="" disabled>Choose the closest…</option>
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="timing" className={labelCls}>When do you need it?</label>
                <select id="timing" name="timing" className={field} defaultValue={TIMING_OPTIONS[0]}>
                  {TIMING_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className={labelCls}>What needs doing? *</label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className={field}
                placeholder="e.g. Three new power points in the living room, double GPOs, brick walls."
              />
              <p className="mt-1.5 text-xs text-[#4A4A4A]">
                Quantities help us quote fast — &quot;3 power points&quot; beats &quot;some power points&quot;.
              </p>
            </div>

            <button
              type="submit"
              className="rounded-sm bg-[#F5A623] px-8 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-[#C4831A]"
            >
              Send enquiry — quote {RESPONSE_PROMISE}
            </button>
            <p className="text-xs text-[#4A4A4A]">
              No account needed. We only use these details to price and arrange your job.
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
