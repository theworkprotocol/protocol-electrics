import {
  sendCustomerConfirmation,
  sendEnquiryFallback,
  type EnquiryFields,
} from "@/lib/email";

/**
 * The one enquiry pipeline behind /enquire (form), /api/enquire (JSON rail),
 * and eventually anything else that takes a lead. Validation is server-side
 * only — the spec forbids relying on client-side checks. Monique is the system
 * of record (quote pipeline + Telegram + auto-prepared quotes); if she is
 * unreachable the enquiry falls back to an owner email, never into the void.
 */

/** Mirrors the price-book families — categories only, never prices. */
export const JOB_TYPES = [
  "Power points & switches",
  "Lighting & downlights",
  "Ceiling fans",
  "Smoke alarms",
  "Safety switch / switchboard",
  "EV charger",
  "Air conditioning",
  "Oven / cooktop connection",
  "Fault finding & repairs",
  "Rental compliance",
  "Something else",
] as const;

export const TIMING_OPTIONS = [
  "ASAP — flexible",
  "This week",
  "Next week",
  "Within the month",
  "Just need a quote for now",
] as const;

export type EnquiryError = "missing" | "email" | "phone";

export function validateEnquiry(f: EnquiryFields): EnquiryError | null {
  if (!f.name.trim() || !f.email.trim() || !f.phone.trim() || !f.description.trim())
    return "missing";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) return "email";
  const digits = f.phone.replace(/[\s()+-]/g, "");
  if (!/^\d{8,15}$/.test(digits)) return "phone";
  return null;
}

export type SubmitResult =
  | { ok: true }
  | { ok: false; rateLimited: true; retryAfterSeconds: number };

export async function submitEnquiry(f: EnquiryFields, clientIp: string): Promise<SubmitResult> {
  // protocol-engine is the pipeline: it stores, rate-limits, auto-drafts,
  // confirms to the customer, and fans events out (Monique subscribes for
  // pings). Monique being offline changes nothing here.
  const url = process.env.ENGINE_URL;
  const secret = process.env.ENGINE_SECRET;

  let delivered = false;
  if (url && secret) {
    try {
      const res = await fetch(`${url}/api/enquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Engine-Secret": secret,
          "X-Client-IP": clientIp,
        },
        body: JSON.stringify({
          source: "enquire-form",
          name: f.name.trim(),
          email: f.email.trim(),
          phone: f.phone.trim(),
          suburb: f.suburb,
          job_type: f.jobType || "unspecified",
          description: f.description.slice(0, 1000),
          timing: f.timing,
        }),
      });
      if (res.status === 429) {
        const retry = parseInt(res.headers.get("Retry-After") ?? "60", 10);
        return { ok: false, rateLimited: true, retryAfterSeconds: retry };
      }
      delivered = res.ok;
    } catch (e) {
      console.error("[enquiry] engine unreachable", e);
    }
  }

  // Engine down → the enquiry still reaches Blake and the customer still
  // gets confirmed, from here. Never the void.
  if (!delivered) {
    await sendEnquiryFallback(f).catch((e) =>
      console.error("[enquiry] fallback email failed — enquiry logged here only", e, f),
    );
    await sendCustomerConfirmation(f).catch((e) =>
      console.error("[enquiry] customer confirmation failed", e),
    );
  }

  return { ok: true };
}

/** First hop of x-forwarded-for is the client on Vercel. */
export function clientIpFrom(headerValue: string | null): string {
  return headerValue?.split(",")[0]?.trim() || "unknown";
}
