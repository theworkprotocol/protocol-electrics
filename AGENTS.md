<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Agent bookability

`agent-bookability-spec.md` (repo root) is the standing spec for making this site findable/bookable by AI agents — phased work, hard requirements (no CAPTCHA, no login, no payment walls on booking paths, honest structured data). Consult it before touching enquiry/booking flows, robots, sitemap, or structured data.

# Service boundary (since 2026-08-09)

This site is pure presentation. **protocol-engine** (`~/protocol-engine`) owns the business: enquiry intake, price book, quote drafting/approval/sending, rate limiting, customer emails. This site calls it with `ENGINE_URL` + `X-Engine-Secret` and must keep working if Monique (LIFEOS) is fully offline — she only subscribes to engine events. Never hardcode prices; never send a quote from this repo; enquiries that can't reach the engine fall back to the owner email, never the void.
<!-- END:nextjs-agent-rules -->
