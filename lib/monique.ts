/**
 * Feed an estimator enquiry into protocol-engine (historically this went to
 * Monique directly — she now subscribes to the engine's events instead).
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
  const url = process.env.ENGINE_URL;
  const secret = process.env.ENGINE_SECRET;
  if (!url || !secret) return; // not configured — silently skip

  const total = enquiry.estimate?.totalCost;

  const res = await fetch(`${url}/api/enquiry`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Engine-Secret": secret },
    body: JSON.stringify({
      source: "estimator",
      name: enquiry.name,
      email: enquiry.email ?? "",
      phone: enquiry.phone ?? "",
      job_type: enquiry.estimate?.jobType ?? enquiry.service ?? "unspecified",
      description: enquiry.description?.slice(0, 500) ?? "",
      details: {
        estimate_summary: enquiry.estimate?.summary?.slice(0, 300),
        estimate_range: total ? `$${total.min}–$${total.max}` : undefined,
        estimate_confidence: enquiry.estimate?.confidence,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`engine responded ${res.status}`);
  }
}
