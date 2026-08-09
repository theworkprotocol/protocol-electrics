"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { EnquiryFields } from "@/lib/email";
import { clientIpFrom, submitEnquiry, validateEnquiry } from "@/lib/enquiry";

/**
 * Plain-form submission — works with JavaScript disabled (Next renders server
 * actions as real form POSTs). Honeypot hits get a convincing thank-you and
 * are silently dropped, per spec.
 */
export async function submitEnquiryAction(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  // Honeypot: humans and legitimate agents never see this field.
  if (get("website")) redirect("/enquire/thanks");

  const fields: EnquiryFields = {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    suburb: get("suburb"),
    jobType: get("job_type"),
    description: get("description"),
    timing: get("timing"),
  };

  const invalid = validateEnquiry(fields);
  if (invalid) redirect(`/enquire?error=${invalid}`);

  const ip = clientIpFrom((await headers()).get("x-forwarded-for"));
  const result = await submitEnquiry(fields, ip);
  if (!result.ok) redirect("/enquire?error=rate");

  redirect("/enquire/thanks");
}
