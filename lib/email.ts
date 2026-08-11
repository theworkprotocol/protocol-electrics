import { Resend } from "resend";
import type { Enquiry } from "@/lib/store";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const OWNER_EMAIL = process.env.OWNER_EMAIL || "admin@protocolelectrics.com.au";
// Verified domain sender (Resend DNS live 9 Aug 2026). Env-overridable.
const FROM_EMAIL = process.env.FROM_EMAIL || "Protocol Electrics <admin@protocolelectrics.com.au>";
const ADMIN_URL = "https://www.protocolelectrics.com.au/admin";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(amount);
}

function buildHtml(enquiry: Enquiry): string {
  const { name, email, phone, service, description, estimate, id, createdAt } = enquiry;

  const submittedAt = new Date(createdAt).toLocaleString("en-AU", {
    timeZone: "Australia/Brisbane",
    dateStyle: "full",
    timeStyle: "short",
  });

  const estimateSection = estimate
    ? `
    <tr>
      <td style="padding: 0 0 28px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="background:#161616; border:1px solid #F5A623; border-radius:8px; overflow:hidden;">
          <tr>
            <td style="padding:16px 20px; background:#F5A623;">
              <span style="font-family:sans-serif; font-size:13px; font-weight:700;
                color:#0A0A0A; text-transform:uppercase; letter-spacing:1px;">
                AI Estimate
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:0 0 12px 0;">
                    <span style="font-family:sans-serif; font-size:12px; color:#888;
                      text-transform:uppercase; letter-spacing:0.5px;">Job Type</span><br>
                    <span style="font-family:sans-serif; font-size:15px; color:#F5F5F5;">
                      ${estimate.jobType}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px 0;">
                    <span style="font-family:sans-serif; font-size:12px; color:#888;
                      text-transform:uppercase; letter-spacing:0.5px;">Estimated Cost Range</span><br>
                    <span style="font-family:sans-serif; font-size:18px; font-weight:700; color:#F5A623;">
                      ${formatCurrency(estimate.totalCost.min)} – ${formatCurrency(estimate.totalCost.max)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px 0;">
                    <span style="font-family:sans-serif; font-size:12px; color:#888;
                      text-transform:uppercase; letter-spacing:0.5px;">Labour</span><br>
                    <span style="font-family:sans-serif; font-size:15px; color:#F5F5F5;">
                      ${estimate.labourHours.min}–${estimate.labourHours.max} hrs
                      &nbsp;|&nbsp;
                      ${formatCurrency(estimate.labourCost.min)} – ${formatCurrency(estimate.labourCost.max)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px 0;">
                    <span style="font-family:sans-serif; font-size:12px; color:#888;
                      text-transform:uppercase; letter-spacing:0.5px;">Confidence</span><br>
                    <span style="font-family:sans-serif; font-size:15px; color:#F5F5F5;">
                      ${estimate.confidence}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px 0;">
                    <span style="font-family:sans-serif; font-size:12px; color:#888;
                      text-transform:uppercase; letter-spacing:0.5px;">Timeframe</span><br>
                    <span style="font-family:sans-serif; font-size:15px; color:#F5F5F5;">
                      ${estimate.timeframe}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span style="font-family:sans-serif; font-size:12px; color:#888;
                      text-transform:uppercase; letter-spacing:0.5px;">Summary</span><br>
                    <span style="font-family:sans-serif; font-size:14px; color:#CCCCCC; line-height:1.5;">
                      ${estimate.summary}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request</title>
</head>
<body style="margin:0; padding:0; background:#0A0A0A; font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#0A0A0A; min-height:100vh; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#111111; border-top:3px solid #F5A623;
                  border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:28px 32px;">
                    <span style="font-family:sans-serif; font-size:11px; font-weight:700;
                      color:#F5A623; text-transform:uppercase; letter-spacing:2px;">
                      Protocol Electrics
                    </span><br>
                    <span style="font-family:sans-serif; font-size:24px; font-weight:700;
                      color:#F5F5F5; line-height:1.3;">
                      New Booking Request
                    </span><br>
                    <span style="font-family:sans-serif; font-size:13px; color:#888;">
                      ${submittedAt} &nbsp;·&nbsp; ID: ${id}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer Details -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#111111; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px; border-bottom:1px solid #222;">
                    <span style="font-family:sans-serif; font-size:11px; font-weight:700;
                      color:#F5A623; text-transform:uppercase; letter-spacing:1px;">
                      Customer
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="50%" style="padding:0 0 14px 0; vertical-align:top;">
                          <span style="font-family:sans-serif; font-size:12px; color:#888;
                            text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">
                            Name
                          </span>
                          <span style="font-family:sans-serif; font-size:16px; font-weight:600; color:#F5F5F5;">
                            ${name}
                          </span>
                        </td>
                        <td width="50%" style="padding:0 0 14px 0; vertical-align:top;">
                          <span style="font-family:sans-serif; font-size:12px; color:#888;
                            text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">
                            Phone
                          </span>
                          <span style="font-family:sans-serif; font-size:16px; color:#F5F5F5;">
                            ${phone || "Not provided"}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding:0 0 14px 0;">
                          <span style="font-family:sans-serif; font-size:12px; color:#888;
                            text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">
                            Email
                          </span>
                          <a href="mailto:${email}"
                            style="font-family:sans-serif; font-size:15px; color:#F5A623; text-decoration:none;">
                            ${email}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2">
                          <span style="font-family:sans-serif; font-size:12px; color:#888;
                            text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">
                            Service Requested
                          </span>
                          <span style="font-family:sans-serif; font-size:16px; font-weight:600; color:#F5F5F5;">
                            ${service || "Not specified"}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Job Description -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                style="background:#111111; border-radius:8px; overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px; border-bottom:1px solid #222;">
                    <span style="font-family:sans-serif; font-size:11px; font-weight:700;
                      color:#F5A623; text-transform:uppercase; letter-spacing:1px;">
                      Job Description
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px;">
                    <p style="font-family:sans-serif; font-size:15px; color:#CCCCCC;
                      line-height:1.6; margin:0; white-space:pre-wrap;">
                      ${description}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- AI Estimate (conditional) -->
          ${estimateSection}

          <!-- CTA -->
          <tr>
            <td style="padding:0 0 40px 0;" align="center">
              <a href="${ADMIN_URL}"
                style="display:inline-block; padding:14px 32px; background:#F5A623;
                  color:#0A0A0A; font-family:sans-serif; font-size:15px; font-weight:700;
                  text-decoration:none; border-radius:6px; letter-spacing:0.5px;">
                View in Admin Dashboard →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:0; border-top:1px solid #222;">
              <p style="font-family:sans-serif; font-size:12px; color:#555;
                text-align:center; margin:20px 0 0 0; line-height:1.6;">
                Protocol Electrics &nbsp;·&nbsp; Sunshine Coast, QLD, Australia<br>
                This notification was sent automatically when a booking was submitted.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendEnquiryNotification(enquiry: Enquiry): Promise<void> {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping notification email.");
    return;
  }

  const subject = `New Booking Request — ${enquiry.estimate?.jobType || enquiry.service || "General Enquiry"} — ${enquiry.name}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject,
    html: buildHtml(enquiry),
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

// ---------- Customer-facing confirmation (agent-bookability-spec.md, Phase 2) ----------

/** Where customer replies land until admin@ has a real mailbox — the ONE place to swap. */
export const ENQUIRY_REPLY_TO = process.env.ENQUIRY_REPLY_TO || "blake.k.hh@gmail.com";
/** Stated everywhere a promise is made: form, thanks page, confirmation email. */
export const RESPONSE_PROMISE = "within 24 hours";

export interface EnquiryFields {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  jobType: string;
  description: string;
  timing: string;
}

const row = (label: string, value: string) =>
  value
    ? `<tr><td style="padding:6px 0; color:#6B6B6B; font-size:13px; width:130px;">${label}</td>
       <td style="padding:6px 0; color:#F0EDE8; font-size:14px;">${value}</td></tr>`
    : "";

/**
 * Echo every submitted detail back to the customer within 60s — the structured
 * confirmation agents (and humans) need to trust the enquiry landed.
 */
export async function sendCustomerConfirmation(f: EnquiryFields): Promise<void> {
  if (!resend) {
    console.log("[email] RESEND_API_KEY not set — skipping customer confirmation.");
    return;
  }
  const html = `
<body style="margin:0; background:#0A0A0A; font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; margin:0 auto; padding:32px 20px;">
    <tr><td style="padding-bottom:24px;">
      <span style="color:#F0EDE8; font-size:20px; font-weight:bold;">Protocol</span>
      <span style="color:#F5A623; font-size:20px; font-weight:bold;"> Electrics</span>
    </td></tr>
    <tr><td style="color:#F0EDE8; font-size:16px; padding-bottom:12px;">
      Thanks ${f.name.split(" ")[0]} — your enquiry is in.
    </td></tr>
    <tr><td style="color:#6B6B6B; font-size:14px; line-height:1.6; padding-bottom:20px;">
      Blake will come back to you <strong style="color:#F5A623;">${RESPONSE_PROMISE}</strong> with a
      written fixed-price quote or a couple of quick questions. Here's what you sent:
    </td></tr>
    <tr><td style="background:#111111; border:1px solid #262626; border-radius:8px; padding:16px 20px;">
      <table cellpadding="0" cellspacing="0" width="100%">
        ${row("Job", f.jobType)}
        ${row("Suburb", f.suburb)}
        ${row("Timing", f.timing)}
        ${row("Details", f.description)}
        ${row("Phone", f.phone)}
        ${row("Email", f.email)}
      </table>
    </td></tr>
    <tr><td style="color:#6B6B6B; font-size:13px; line-height:1.6; padding-top:20px;">
      Need us sooner? Call or text <a href="tel:0428653509" style="color:#F5A623;">0428 653 509</a>.<br/>
      Protocol Electrics · QBCC licensed · Sunshine Coast, QLD
    </td></tr>
  </table>
</body>`.trim();

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: f.email,
    replyTo: ENQUIRY_REPLY_TO,
    subject: "Your enquiry is in — Protocol Electrics",
    html,
  });
  if (error) throw new Error(`Resend error: ${JSON.stringify(error)}`);
}

/** Last-resort owner email if Monique's pipeline is unreachable — an enquiry is never lost. */
export async function sendEnquiryFallback(f: EnquiryFields): Promise<void> {
  if (!resend) return;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: OWNER_EMAIL,
    subject: `⚠️ Enquiry (pipeline unreachable) — ${f.jobType} — ${f.name}`,
    html: `<pre style="font-size:14px;">${JSON.stringify(f, null, 2)}</pre>`,
  });
}
