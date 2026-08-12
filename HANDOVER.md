# Handover log

Session-end notes, newest first. Convention: dated entry, under 5 lines — what happened, what's blocked, what needs Blake.

## 2026-08-09 (later — THE SPLIT)
Extracted **protocol-engine** (`~/protocol-engine`, new repo): enquiry API, price book, quote draft→approve→send (approve = only send path), rate limiting, config-driven branding — second business = config file. Site+engine run with Monique offline; she's now an event subscriber (Telegram pings + approve_quote). Full E2E verified locally ($698 fan-swap auto-draft → approval → engine emailed it). Boundary documented in all three CLAUDE.md files.
**Blocked:** lifeos + PE commits are LOCAL-ONLY — pushing before the engine is deployed breaks prod. Engine has no GitHub remote yet.
**Needs Blake:** create GitHub repo `protocol-engine` + Vercel project + env vars (list in session notes), add ENGINE_* env to both existing Vercel projects, then say "push".
("Jeffrey Hinton" was Blake's own Vapi voice test — row wiped; voice→enquiry path confirmed end to end. Permission baseline + secrets hook applied to all three repos, per-touch .env approvals.)

## 2026-08-09
Voice settled (Cartesia "Aila", no live pricing on calls — written quotes only, Haiku brain). Life OS: cost engine + margin guard (green line $2,962/wk placeholder), growth ladder (S1 Launch), quote presentation (protocolelectrics.com.au/quote/[token]), auto-prepared quotes from clear enquiries. PE: agent-bookability Phases 1+2 shipped — JSON-LD graph, llms.txt, /enquire no-JS form + /api/enquire rail, honeypot, Monique-side rate limit (429), customer confirmation emails; production Agent Test passed end-to-end ($547 auto-quote).
**Blocked:** customer confirmation emails only deliver to Blake until the domain is verified in Resend (sandbox sender).
**Needs Blake:** real cost table (margins run on placeholders); Resend domain DNS records; Twilio AU number when ready; 7FS price CSV when bought.

## 2026-08-09 (later — DNS + email session)
Nameservers on Vercel DNS; Resend records live (send MX/SPF, root DKIM, DMARC) — Blake ran the four adds in Terminal after a settings deny blocked vercel CLI here. Fixed: `vercel dns *` now ask, deploys + all rm/remove subcommands hard-denied. Sender flipped to admin@protocolelectrics.com.au (env-overridable FROM_EMAIL); real-path test confirmation sent to Blake's Gmail OK. Google Workspace: verification TXT live, MX pending (admin console down).
**Blocked:** owner notifications bounce until Google MX land — set OWNER_EMAIL=blake.k.hh@gmail.com in Vercel env as interim.
**Needs Blake:** Google MX records when console loads; then revert OWNER_EMAIL + point ENQUIRY_REPLY_TO at admin@.

## 2026-08-09 (email loop closed)
Email fully live and verified end-to-end: Google Workspace MX + root SPF up, admin@protocolelectrics.com.au is a working mailbox. Sender = admin@ (FROM_EMAIL env-overridable), ENQUIRY_REPLY_TO = admin@; OWNER_EMAIL deleted from Vercel so the code default (admin@) governs. Live-site enquiry submitted, owner notification landed in admin@. protocol-engine pushed to github.com/theworkprotocol/protocol-engine (private, 2 commits, no secrets tracked).
**Blocked:** nothing on email.
**Needs Blake:** deploy protocol-engine (Next.js preset, all defaults); then set ENGINE_URL + matching ENGINE_SECRET in the PE Vercel project — currently zero ENGINE_* vars there, so the site still falls back to email.

## 2026-08-09 (Supabase RLS lockdown)
Supabase flagged RLS-disabled/exposed columns on life-os-syd. Audited: Life OS **and** protocol-engine share one database (identical DATABASE_URL, ap-southeast-2 pooler) and both connect **server-side only** — drizzle + `postgres` pkg, no @supabase/supabase-js, zero anon-key or NEXT_PUBLIC refs in either repo. Connection role is `postgres` with BYPASSRLS=true, so RLS cannot break them. Enabled RLS on all 15 public tables (content_items, cost_model, goals, growth_ladder, hook_hits, integrations, jobs, messages, price_book, profile_facts, projects, quotes, reminders, roster_periods, transactions) with **no policies** — PostgREST anon/authenticated now get zero rows; not FORCED, so app access is unchanged. Verified post-change: 15/15 RLS on, 0 forced, 0 policies, app reads still work (transactions 38 rows, price_book 17).
**Blocked:** nothing.
**Needs Blake:** re-run Supabase's linter to confirm the warnings clear; if any future feature needs browser-side Supabase access it will need explicit RLS policies first.
