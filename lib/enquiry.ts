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
  const url = process.env.MONIQUE_HOOK_URL;
  const secret = process.env.MONIQUE_HOOK_SECRET;

  let delivered = false;
  if (url && secret) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Hook-Secret": secret,
          "X-Client-IP": clientIp,
        },
        body: JSON.stringify({
          source: "enquire-form",
          client_name: f.name.trim(),
          contact: [f.email.trim(), f.phone.trim()].filter(Boolean).join(" · "),
          job_type: f.jobType || "unspecified",
          details: {
            description: f.description.slice(0, 1000),
            suburb: f.suburb,
            preferred_timing: f.timing,
          },
        }),
      });
      if (res.status === 429) {
        const retry = parseInt(res.headers.get("Retry-After") ?? "60", 10);
        return { ok: false, rateLimited: true, retryAfterSeconds: retry };
      }
      delivered = res.ok;
    } catch (e) {
      console.error("[enquiry] Monique unreachable", e);
    }
  }

  if (!delivered) {
    await sendEnquiryFallback(f).catch((e) =>
      console.error("[enquiry] fallback email failed — enquiry logged here only", e, f),
    );
  }

  // Confirmation must never block or break the submission.
  await sendCustomerConfirmation(f).catch((e) =>
    console.error("[enquiry] customer confirmation failed", e),
  );

  return { ok: true };
}

/** First hop of x-forwarded-for is the client on Vercel. */
export function clientIpFrom(headerValue: string | null): string {
  return headerValue?.split(",")[0]?.trim() || "unknown";
}
