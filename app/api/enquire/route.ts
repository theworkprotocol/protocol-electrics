import { NextRequest, NextResponse } from "next/server";
import type { EnquiryFields } from "@/lib/email";
import { clientIpFrom, submitEnquiry, validateEnquiry } from "@/lib/enquiry";

/**
 * Programmatic enquiry rail — for agents that POST rather than drive the form.
 * Accepts JSON or form-encoded. Same pipeline, honest status codes; this
 * endpoint is what Phase 4's UCP manifest will point at as the REST transport.
 */
export async function POST(request: NextRequest) {
  let raw: Record<string, unknown>;
  const type = request.headers.get("content-type") ?? "";
  try {
    raw = type.includes("json")
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return NextResponse.json({ error: "unreadable body" }, { status: 400 });
  }

  const s = (k: string) => String(raw[k] ?? "").trim();

  // Honeypot: pretend success, drop silently.
  if (s("website")) return NextResponse.json({ received: true }, { status: 201 });

  const fields: EnquiryFields = {
    name: s("name"),
    email: s("email"),
    phone: s("phone"),
    suburb: s("suburb"),
    jobType: s("job_type") || s("jobType"),
    description: s("description"),
    timing: s("timing"),
  };

  const invalid = validateEnquiry(fields);
  if (invalid) {
    return NextResponse.json(
      { error: invalid, hint: "required: name, email, phone, description" },
      { status: 400 },
    );
  }

  const ip = clientIpFrom(request.headers.get("x-forwarded-for"));
  const result = await submitEnquiry(fields, ip);
  if (!result.ok) {
    return NextResponse.json(
      { error: "rate_limited", retry_after_seconds: result.retryAfterSeconds },
      { status: 429, headers: { "Retry-After": String(result.retryAfterSeconds) } },
    );
  }

  return NextResponse.json(
    { received: true, next: "Written fixed-price quote within 24 hours; confirmation email sent." },
    { status: 201 },
  );
}
