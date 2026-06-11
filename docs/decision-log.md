# Decision Log — NextSketch Website Rebuild

Running record of non-obvious calls and their rationale. Newest last. Sprint-scoped decisions live in the sprint plan; only decisions that outlive a sprint get promoted here.

| # | Date | Decision | Rationale / authorization |
|---|------|----------|---------------------------|
| 1 | 2026-06-11 | Fonts: **Inter + Caveat** approved. UX Spec Review Note 1 closed. | Owner approval during foundation unit. |
| 2 | 2026-06-11 | Repo `Helios35/nextsketch-website` flipped to **private**; brand `.docx` stay gitignored as defense in depth. | Doc stack contains internal strategy/messaging. Owner approval. |
| 3 | 2026-06-11 | Drafted copy **approved as canonical**: `SITE` title/description, `MODAL_OFF_RAMP` body + closing, `MODAL_SUCCESS.headline`, `MODAL_FAILURE`. | Owner approval at Sprint 01 planning; closes foundation build-notes deviations 4–5. |
| 4 | 2026-06-11 | Footer socials: **LinkedIn, X/Twitter, Instagram**. PRD Review Note 2 closed. URLs owed by owner before launch. | Owner call at Sprint 01 planning. |
| 5 | 2026-06-11 | Stat strip ships; **placeholder numbers** until owner supplies real stats before launch. PRD Review Note 1 closed (content still owed). | Owner call at Sprint 01 planning. |
| 6 | 2026-06-11 | **Lead API deferred to Sprint 02** (with Resend account + Vercel setup, owner-owned). Modal interim submit = failure-fallback → email escape hatch. | Accounts don't exist; visual build doesn't depend on them. Owner call at Sprint 01 planning. |

**Still open (owner):** testimonial quote re-approvals (placeholder until then) · real stat numbers · social URLs · Resend account · Vercel project · DNS cutover (MX records untouched).
