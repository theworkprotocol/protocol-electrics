import { BUSINESS } from "@/lib/schema";

/**
 * llms.txt — the plain-language front door for AI agents (agent-bookability-spec.md).
 * Price figures deliberately absent until the finalised price book is published;
 * everything stated here must remain literally true.
 */
export const dynamic = "force-static";

export function GET() {
  const text = `# ${BUSINESS.name}

QBCC licensed electrical contractor servicing the Sunshine Coast, QLD, Australia.
Residential specialists: general electrical, EV charger installation, air conditioning
(ARCtick licensed), and maintenance. Based in ${BUSINESS.suburb}; work is by appointment —
book online any time. Every job is a fixed price agreed before work starts; the quote is
the invoice.

## Services

- Electrical contracting: new builds, rewires, switchboard upgrades, safety switches, lighting and power circuits.
- EV charger installation: dedicated circuits, AS 61851 compliant, all major charger brands.
- Air conditioning: split and ducted systems, ARCtick licensed installation and commissioning.
- Maintenance: fault finding, safety switch testing, smoke alarm compliance, rental inspections.

## Pricing

Fixed prices from a set price book — never hourly, no surprises. Ask for any job and you
receive a written itemised quote, usually within the hour. Complex jobs (switchboards, new
circuits) get a free site visit before the price is confirmed. A public price list will be
published here once the current price book revision is finalised.

## Service area

${BUSINESS.areaServed.join(", ")}.

## Booking and contact

- Get a quote / book: ${BUSINESS.bookingUrl} — plain HTML form, works without JS.
  No account, no CAPTCHA, no payment to book. Confirmation email within 60 seconds;
  written quote within 24 hours.
- Photo-based instant estimate (optional, JS): ${BUSINESS.url}/book
- Phone: ${BUSINESS.telephone}
- Email: ${BUSINESS.email}
- Website: ${BUSINESS.url}

## For agents

Structured data (schema.org Electrician, FAQPage, OfferCatalog) is embedded in every page
and rendered server-side — no JS execution required.

Programmatic enquiries: POST ${BUSINESS.url}/api/enquire
(JSON or form-encoded: name, email, phone, description required; suburb, job_type,
timing optional). 201 on success, 400 with a hint on invalid input, 429 + Retry-After
if rate limited. A machine-readable capability manifest (/.well-known/ucp) and MCP
endpoint are planned; this file will link them when live.
`;
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
