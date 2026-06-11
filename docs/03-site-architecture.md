# Site Architecture — NextSketch Website Rebuild

**Version:** 1.0 · **Date:** 2026-06-11 · **Status:** Active
**Answers:** How is it structured?
**References:** `02-prd.md` (what) · `04-ux-spec.md` (how each section looks) · `05-business-rules.md` (modal logic)

---

## Sitemap

```
/            — the page (all sections)
/404         — custom not-found
[modal]      — qualification modal (overlay, no route — or /start as a
               shallow route if deep-linking is wanted; builder's call,
               record in build-notes)
```

No other routes. Old Webflow routes (/projects, /about-us, /contact-us, /projects/*) get permanent redirects to `/` (see `08-runbook.md` §Redirects).

## Navigation structure

Sticky top nav, shrinks on scroll:
- Logo (placeholder) → scrolls to top
- Anchor links: Process · Work · Services · About · FAQ
- Button: **Start a Conversation** → opens modal

Footer nav: same anchors + hello@nextsketch.com (mailto) + legal line. No newsletter link, no blog (cut per decision). Socials pending PRD Review Note 2.

## Page structure — section order

| # | Section | ID | Job | Canonical copy source |
|---|---------|----|----|----------------------|
| 1 | Nav | — | Orient + persistent CTA | Business Rules §3 |
| 2 | Hero | `#top` | The promise in 3 seconds | Messaging Kit §05 Hero, Headline Option A: "From idea to production. And we stay." + subheadline |
| 3 | Manifesto | `#why` | Reframe the problem | "Most firms build what you ask for…" + body copy |
| 4 | Process | `#process` | Show the workflow + differentiator | "Strategy. Build. Validate. Stay." four-phase table |
| 5 | Selected work | `#work` | Visual credibility (placeholders) | Placeholder spec in `06-taxonomy.md` |
| 6 | Services | `#services` | Name the four engagements | Messaging Kit §05 Services table |
| 7 | About | `#about` | The person behind it (solo) | New copy, voice per Brand Philosophy §8 |
| 8 | Testimonials | `#voices` | Secondary reassurance — never the lead | Placeholder pending approved rewrites |
| 9 | Who it's for | `#fit` | Qualify + self-filter | "Built for founders and business owners who are ready to move." |
| 10 | FAQ | `#faq` | Objection handling | Six Q&As verbatim from Messaging Kit §05 |
| 11 | Final CTA | `#start` | Convert | "Ready to build? Let's figure out if we're the right fit." → modal |
| 12 | Footer | — | Escape hatch + housekeeping | hello@nextsketch.com visible |

## User flows

**Founder with an idea:** Hero → Process → Services (New Products) → FAQ → modal → qualified path → submit.
**Stuck at 70%:** Hero → Manifesto (validates frustration) → Services (Rescue & Completion) → Testimonials → modal → qualified path.
**SMB upgrader:** Hero → Services (Agentic Systems) → Who it's for → modal → qualified path.
**Still exploring:** any entry → modal → off-ramp screen ("come back when you're ready") → exit with email visible.
**Modal abandoner:** closes modal → footer/modal email escape hatch (mailto) remains available.

## Access rules

Everything public. No auth, no gated content, no roles.
