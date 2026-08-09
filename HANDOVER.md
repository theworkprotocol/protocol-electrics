# Handover log

Session-end notes, newest first. Convention: dated entry, under 5 lines — what happened, what's blocked, what needs Blake.

## 2026-08-09 (later — THE SPLIT)
Extracted **protocol-engine** (`~/protocol-engine`, new repo): enquiry API, price book, quote draft→approve→send (approve = only send path), rate limiting, config-driven branding — second business = config file. Site+engine run with Monique offline; she's now an event subscriber (Telegram pings + approve_quote). Full E2E verified locally ($698 fan-swap auto-draft → approval → engine emailed it). Boundary documented in all three CLAUDE.md files.
**Blocked:** lifeos + PE commits are LOCAL-ONLY — pushing before the engine is deployed breaks prod. Engine has no GitHub remote yet.
**Needs Blake:** create GitHub repo `protocol-engine` + Vercel project + env vars (list in session notes), add ENGINE_* env to both existing Vercel projects, then say "push" — plus a REAL LEAD waiting: Jeffrey Hinton, Mount Coolum, 6 downlights, wants a callback.

## 2026-08-09
Voice settled (Cartesia "Aila", no live pricing on calls — written quotes only, Haiku brain). Life OS: cost engine + margin guard (green line $2,962/wk placeholder), growth ladder (S1 Launch), quote presentation (protocolelectrics.com.au/quote/[token]), auto-prepared quotes from clear enquiries. PE: agent-bookability Phases 1+2 shipped — JSON-LD graph, llms.txt, /enquire no-JS form + /api/enquire rail, honeypot, Monique-side rate limit (429), customer confirmation emails; production Agent Test passed end-to-end ($547 auto-quote).
**Blocked:** customer confirmation emails only deliver to Blake until the domain is verified in Resend (sandbox sender).
**Needs Blake:** real cost table (margins run on placeholders); Resend domain DNS records; Twilio AU number when ready; 7FS price CSV when bought.
