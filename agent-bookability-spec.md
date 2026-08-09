# Agent Bookability Spec — Protocol Electrics

**Purpose:** Make protocolelectrics.com.au findable, comparable, and bookable by AI agents (Google's agentic Search, browser agents, MCP clients) as well as humans.
**Owner:** Blake · **Status:** Draft v1 — August 2026
**How to use:** Referenced from AGENTS.md. Run Claude Code in plan mode per phase ("Read agent-bookability-spec.md and plan Phase N"). Approve the plan, then execute. Phases are independent and ordered by ROI.

> **Stack note (added on import, 2026-08-09):** the original draft assumed a static site + ServiceM8 + Make.com. The real stack is Next.js on Vercel, with **Monique (Life OS)** as the pricing/quote/booking brain — her `price_book` is the single source of truth for all published prices, and her APIs replace ServiceM8/Make in every phase below. Xero arrives December.

## Business context

- Residential electrical contractor, Sunshine Coast QLD. Services: general residential, solar, battery, split-system AC.
- Stack: Next.js site (navy/gold), Monique/Life OS (pricing book, quotes, jobs, calendar), Xero (from Dec), Google Workspace, Claude Code.
- The pricing book is the source of truth for all published prices.

## Global hard requirements (every phase — never violate)

AI agents operate under hard behavioural limits. Browser agents will not solve CAPTCHAs, create accounts, or enter passwords, and they pause for human confirmation at payment steps. Any of these on the booking path ends the booking. Therefore:

- **No CAPTCHA** anywhere on enquiry or booking flows. Spam control = honeypot field + server-side rate limiting + server-side validation. Never client-side-only validation.
- **No account creation or login** required to enquire or book. Guest flow only.
- **No payment required to book.** Default is invoice-after / pay-on-completion. Quote visits are free to book.
- **Semantic, labelled HTML forms.** Real `<form>`, `<label for>`, `<input>`/`<select>`/`<textarea>` with correct type and autocomplete attributes. No custom JS-only widgets on the critical path.
- **No popup gauntlet** on the booking path: no newsletter modals, no chat-widget interstitials, no cookie walls blocking interaction (non-blocking banner only).
- **Instant structured confirmation:** every enquiry/booking triggers an email within 60 seconds containing all submitted details, plus a .ics calendar attachment for booked slots.
- **Data honesty:** published prices match the pricing book; no AggregateRating markup until real reviews exist; availability shown is real availability. Agents (and Google) penalise fabricated structured data.

## Phase 1 — Machine-readable site (code)

**Goal:** an agent can determine who we are, what we do, where, when, and what it costs — without JS execution.

Tasks:
- JSON-LD in `<head>` of every page:
  - `@type: "Electrician"` (LocalBusiness subtype) with name, url, telephone, email, address, geo, areaServed (Sunshine Coast suburbs list), openingHoursSpecification, sameAs (GBP, socials).
  - `hasOfferCatalog`: each service as Offer → Service with name, description, and real price/priceRange in AUD from the pricing book.
  - FAQPage markup on the FAQ page.
- Published pricing page: price ranges per common job type, phrased as customers/agents ask them ("power point installation cost", "switchboard upgrade cost Sunshine Coast").
- `llms.txt` at site root: one-paragraph business summary, services + price ranges, service area, booking URL, contact, link to `/.well-known/ucp` (Phase 4).
- `sitemap.xml` + `robots.txt` permitting reputable AI crawlers.
- Performance: pages render core content without JS; Lighthouse ≥ 90 on mobile.

Acceptance:
- Google Rich Results Test passes on all pages with zero errors.
- `curl` of any page returns name, services, prices, area, and booking URL in the raw HTML.
- `llms.txt` resolves and is current.

## Phase 2 — Agent-proof booking path (code)

**Goal:** an agent (or human) goes from landing page to confirmed enquiry/booking with zero walls.

Tasks:
- Rebuild enquiry form per global hard requirements. Fields: name, phone, email, suburb, job type (select, mirroring pricing-book categories), description, preferred timing. Honeypot field + server-side rate limit (per-IP, sliding window).
- Server-side handler → Monique enquiry hook → quote pipeline + confirmation email (all details echoed, response-time promise stated).
- Booked slots (Phase 3) additionally receive .ics attachment.
- Clear next-step copy on the confirmation screen ("You'll hear from us by X").

Acceptance:
- Form submits successfully with JS disabled (progressive enhancement OK, not required).
- Honeypot submissions are silently dropped; rate limit returns 429 with Retry-After.
- Confirmation email lands < 60s with all submitted data.
- **The Agent Test (below) completes an enquiry end-to-end without human intervention.**

## Phase 3 — Live availability (code + calendar config)

**Goal:** agents can see and select real slots.

Tasks:
- Public "book a quote visit" flow backed by Monique's calendar availability (buffer rules so shown slots are honest).
- No payment step; guest booking; confirmation + .ics per Phase 2.
- Never expose raw calendar/busy details — only offered slots.

Acceptance:
- A booked slot appears in the calendar within 1 minute.
- Slots shown = slots actually available (spot-check weekly).
- Agent Test can select a slot and receive .ics confirmation.

## Phase 4 — MCP server + UCP manifest (code)

**Goal:** native agent integration; future-proofing + content asset. Near-zero booking volume expected in 2026 — build cheap, keep honest.

Tasks:
- Remote MCP server (streamable HTTP) exposing three tools:
  - `get_services()` → services, descriptions, price ranges (reads pricing book; single source of truth).
  - `check_availability(date_range, job_type)` → real slots.
  - `request_booking(details)` → creates a **pending** booking request for Blake's approval. Human confirms before it's final. Never auto-confirm in v1.
- HTTPS; per-client rate limiting; strict input validation; never echo other customers' PII; log all tool calls.
- `/.well-known/ucp` manifest: organization block + service capabilities with prices + supported transports (REST, MCP). Keep in lockstep with pricing book.
- Publish MCP endpoint + short integration docs on the site and in llms.txt; submit to MCP registries.
- Document the build → theworkprotocol content ("I made my electrical business bookable by AI agents").

Acceptance:
- Claude (chat, custom connector) can list services, check availability, and lodge a pending booking.
- Malformed/flood requests rejected cleanly; nothing auto-confirms.
- UCP manifest validates as JSON and matches live pricing.

## Non-code workstreams (Cowork / manual — out of scope for Claude Code)

- **Google Business Profile:** complete every field — services, service area, hours, photos, Q&A; attach booking link. (Google's agentic Search books through GBP + booking provider; this is the highest-volume rail.)
- **Review engine:** job completed → review request SMS/email → weekly summary. Respond to every review.
- **Voice agent:** live (Vapi receptionist). Google's agent now *calls* home-repair businesses on customers' behalf — the phone is an agent channel; AU number pending.
- **Directory hygiene:** consistent name/address/phone across GBP, directories, socials.

## The Agent Test (recurring QA — monthly)

Run Claude in Chrome (fresh profile, no logins) against the live site: *"Find an electrician on the Sunshine Coast to install three power points, compare pricing, and book a quote visit at [address]."*
Log: was Protocol found → could it price the job → where did the flow stall → did confirmation arrive. Every stall becomes a ticket. Repeat with other browser agents as available. This is the ground-truth metric for the entire spec.

## Out of scope (v1)

Payments via agent rails (AP2/ACP), auto-confirmed MCP bookings, multi-language, commercial services pages. Revisit each quarter — the rails are moving fast.
