# NextSketch MVP — Direction (Re-Lock)

**Date:** 2026-06-22 · **Status:** Locked
**Purpose:** Confirming the locked direction for the NextSketch MVP after the 2026-06-14 pivot and the Sprint 03 doc audit — so the next build sprint starts from an agreed base. This is the plan, not a question list.

> The doc stack (`docs/00–08` + `decision-log.md`) now matches the live build. This one-pager is the agreed scope base; the working plan (in the workspace) carries the sequence, shortcuts, and open items.

## What we're building

A **single dark cinematic landing hero** that is itself the proof of capability — fast, product-like, in **Space Grotesk + JetBrains Mono** — with a **two-door qualification modal** as the only structured lead path. The modal opens to a low-friction **quick door** (name, email, what you need); the full four-question **qualifier** is one click away; the **off-ramp** turns "still exploring" visitors away honestly while offering an optional "stay in touch" capture.

Behind it runs a **durable lead pipeline**: every captured lead is written to the **Google Sheet** (the system of record), mirrored to a best-effort **Asana** task, and answered by an instant **auto-reply** plus a real-time **alert** to Nathan. The site **never reports success unless the lead is truly stored** — no fake success, no lost leads. **That honesty is the product.** There is **no database and no backend beyond the one lead endpoint — by design, for good.**

## In / Out

**In (live / as-built):**
- Single dark hero screen — wordmark, headline, supporting line, a capability strip naming the four services, one CTA.
- Two-door modal — quick door (primary) + four-question qualifier + capturing off-ramp.
- Lead pipeline — `POST /api/qualify` → Google Sheet (gates success) + best-effort Asana + Resend auto-reply & alert.
- Anti-bot honeypot + minimum-time guard; custom 404; analytics; banned-terms build gate.

**Out — deferred (returns later, preserved not deleted):**
- The eleven-section scrolling page (process, work, services cards, about, testimonials, FAQ, footer/nav). *Out because the single hero proves the bet without it* — its code is dormant, its copy preserved, and it comes back as its own scope lock post-launch.
- The light theme + handwritten sketch accents + stat strip; the Webflow→Vercel domain cutover (parked); rate limiting (only if abuse appears).

**Out — for good (cut):**
- Calendly / "book a call" / contact page · pricing · e-commerce · CMS · client portal.
- Any database, login, or second backend (the one lead route is the entire server). CRM / nurture sequences. Blog / newsletter.

## What this means for the build

The next sprint does **not** start with new features. It starts by **proving capture live**: set the lead-pipeline env vars in Vercel and run the both-doors smoke test — that closes the open go-live gate. Then launch-readiness (approve the draft email/modal copy, supply a self-hosted hero image + OG image, verify the Resend sending domain). The domain cutover is parked and owner-executed. "Live" means the production Vercel deployment passing that smoke test — not the `nextsketch.com` cutover.

## What happens next

1. I close the go-live gate: confirm the four Vercel env vars and run the production smoke test (both doors, off-ramp, forced-failure).
2. We run launch-readiness (copy approval + assets + sending-domain verification).
3. The domain cutover and any multi-section revival are separate, later, and each gets its own confirmation.

**If this matches your thinking, we're moving** — the next sprint sequences from here.
