/**
 * Notify Monique (Blake's personal assistant platform) when a quote/enquiry lands.
 * Fire-and-forget: a failure here must never break the customer's submission.
 */

interface EnquiryLike {
  name: string;
  email?: string;
  phone?: string;
  service?: string;
  description?: string;
  estimate?: {
    jobType?: string;
    summary?: string;
    confidence?: string;
    totalCost?: { min: number; max: number };
  } | null;
}

export async function notifyMonique(enquiry: EnquiryLike): Promise<void> {
  const url = process.env.MONIQUE_HOOK_URL;
  const secret = process.env.MONIQUE_HOOK_SECRET;
  if (!url || !secret) return; // not configured — silently skip

  const total = enquiry.estimate?.totalCost;
  const midpoint = total ? Math.round((total.min + total.max) / 2) : undefined;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Hook-Secret": secret },
    body: JSON.stringify({
      source: "estimator",
      client_name: enquiry.name,
      contact: [enquiry.email, enquiry.phone].filter(Boolean).join(" · "),
      job_type: enquiry.estimate?.jobType ?? enquiry.service ?? "unspecified",
      estimated_amount: midpoint,
      details: {
        description: enquiry.description?.slice(0, 500),
        estimate_summary: enquiry.estimate?.summary?.slice(0, 300),
        estimate_range: total ? `$${total.min}–$${total.max}` : undefined,
        confidence: enquiry.estimate?.confidence,
      },
    }),
  });
  if (!res.ok) {
    console.error("[monique] quote notify failed:", res.status, await res.text().catch(() => ""));
  }
}
