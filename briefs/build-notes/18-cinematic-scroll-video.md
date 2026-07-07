# Build Note 18 — Cinematic Scroll Video (Unit 03: hero orbit + persona backdrop sequence)

**Date:** 2026-07-07 · **Branch:** `feature/cinematic-scroll-video` · **Brief:** owner-directed chat instruction (2026-07-07) — no written workspace brief; the instruction supersedes Unit 02's "don't touch the hero" guardrail for exactly the hero *background* (the owner-owed asset swap) and the site backdrop.
**Status:** Pushed for owner review — **no PR opened** (owner policy: Nate opens the PR after he verifies).

## What shipped

The award-site "3D scroll" treatment (reference: Lando Norris / OFF+BRAND, Awwwards SOTY 2025), built entirely inside the shipped Unit 02 motion architecture:

1. **Hero orbit (the money shot).** The interim Unsplash still is gone. The hero section is now a **260vh runway** whose content sits on a sticky one-viewport stage (`data-hero-stage`); the owner's orbit clip (camera circling Nate in a black void, warm gold rim light, drifting dust) is scroll-scrubbed across the runway — **scroll position is the camera angle**, exactly the Lando-helmet interaction. Content (wordmark, capability strip, headline, CTA) stays pinned and legible through the full 360°.
2. **Persona backdrop sequence.** The single consulting-video backdrop became a **three-clip cinematic sequence** — *Strategist → Builder → Partner* — segmented evenly across the below-hero scroll range, each clip's timeline scrubbed within its segment, crossfading at the seams (8% of sequence progress). Sequence progress starts where the hero starts revealing the backdrop, so no footage is spent unseen. Narrative mapping onto the page: Strategist ≈ Manifesto/Services (the problem, what we build), Builder ≈ Process (how we work), Partner ≈ About/Final CTA (who you work with, start the conversation).
3. **Shared scrub engine.** The Unit 02 scrub loop was extracted to `src/lib/video-scrub.ts` (rAF lerp of `currentTime` toward a progress target, seek-gated per build-note 17) and is now the one engine behind both `HeroOrbit` and the reworked `ScrollVideo`. No element ever `play()`s; footage freezes the instant scrolling stops.

Hero *composition*, qualification modal, and lead pipeline untouched (diff confirms — the hero edit is background + pinning structure only; `hero-cta.tsx`, `qualification-modal*.tsx`, `src/lib/lead-*`, `src/app/api/qualify` have zero hunks).

## Asset pipeline (Higgsfield MCP, owner-directed)

- **Identity:** four photos from the workspace redesign folder (Nate 1/3/12/16 — frontal, arms-crossed denim-shirt, neutral frontal, right profile) uploaded and combined into the reusable character Element **`nate-nextsketch`** (`d86642f9-64ab-4df3-95dd-74b912a6478c`), passed as the identity reference on **every** generation.
- **Model/settings:** Seedance 2.0 (`seedance_2_0`), `mode: std`, 1080p, 16:9, 8s, `generate_audio: false`, `bitrate_mode: high`. One clip per brief scene; wardrobe locked in every prompt (denim collar shirt buttoned near the top, dark undershirt barely visible, black jeans). Higgsfield's "IN THE DARK" preset suggestion was declined — the owner's art direction is literal.
- **Grade:** black-void / warm-gold lighting matching the brand `gold`; the **subtle green / saturated-red accents live in the generated holographic-UI footage only** (owner-directed) — no new UI color tokens; the design system stays gold-only (decision-log #14).
- **Encode (build-note 17 recipe, scratchpad-local ffmpeg-static):** H.264, keyframe every 4 frames (`-g 4 -sc_threshold 0`), audio stripped, `+faststart`, yuv420p. Hero kept at 1920×1080 CRF 23 (**3.4 MB**); backdrops scaled to 1280×720 CRF 24 (**2.4–3.5 MB each**); every clip carries a first-frame JPEG poster (36–71 KB). Total video payload ≈ 12 MB across four clips — but all clips ship `preload="metadata"`: the scrub effects upgrade to auto only where they run (hero immediately when motion-safe; backdrops once the visitor scrolls within a viewport of the reveal), so the hero owns the initial bandwidth and reduced-motion visitors fetch posters + metadata only, never the 12 MB.
- `public/consulting-video.mp4` **removed** (superseded; recoverable from git history).

## Judgment calls (owner review)

1. **Runway length 260vh** (`globals.css` `[data-hero-runway]`) — ~1.6 viewports of scroll plays the full 360°. One value to tune. It lives in CSS, not JS, gated on `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)` — present before first paint so deep-links/scroll restoration measure the final layout (review finding, below); no-JS / reduced-motion / pre-2023 browsers get the one-viewport hero.
2. **Crossfade width 0.08** (`CROSSFADE`, `scroll-video.tsx`) — one constant to tune.
3. **Backdrop segment mapping is even thirds** of the below-hero range (robust to section-height changes), not anchored to section boundaries — the narrative alignment above is approximate by design.
4. **Backdrops shipped at 720p** (under `ink/40` + scrim they read identically; matches the Unit 02 720p precedent and keeps payload sane); the hero — the visible money shot — kept 1080p.
5. **Asset names** `hero-orbit.mp4` / `backdrop-{persona}.mp4`: these are real brand assets, not placeholders, so the Taxonomy §7 `placeholder-*` convention deliberately does not apply; kebab-case per §8.
6. `LANDING.backgroundImage` → `backgroundVideo` + `backgroundPoster` (config-not-copy, same as before; banned-terms unaffected).

## Spec updates

`docs/04-ux-spec.md` bumped to **v3.1**: scroll-motion architecture adds `HeroOrbit` + the shared engine; §Scroll-synced background video rewritten to the three-clip sequence as-built; Motion-inventory rows updated; the hero's "interim Unsplash placeholder — owner-owed" note is **closed** (the swap is delivered).

## Verification

- **Gates:** `lint` ✓ · `tsc --noEmit` ✓ · `next build` ✓ (Next 16.2.9) · `banned-terms` ✓ (27 files).
- **Browser (desktop 1280×800-class):** orbit scrubs 0 → 1.99 → 4.02 → 6.03 → 8.04s at 0/25/50/75/100% runway with the stage pinned at `top: 0` throughout; `video.paused === true` at every reading (never plays). Backdrop sequence: Strategist scrubs through its third; Builder crossfades in at the ⅓ seam (opacity 0.73 mid-seam while its timeline starts); Partner at the ⅔ seam; final clip lands on its last frame exactly at page bottom; covered clips skip scrubbing. Console clean.
- **Mobile (375×812):** no horizontal overflow; stage pins; scrub advances; content legible over the footage.
- **Reduced-motion / no-JS by construction:** the runway is applied only by JS behind `usePrefersReducedMotion`, so both paths keep the one-viewport hero; the hero `<video poster>` and the sequence's first frame render statically under the same `ink/40` + scrim overlays; server HTML fully visible; nothing ever auto-plays.
- **Adversarial review:** four lenses (correctness, a11y/reduced-motion, performance, spec compliance), 16 agents, every finding adversarially verified against the running site — results and fixes below.

## Adversarial review (verified findings) & fixes

Nine findings survived adversarial verification (two refuted); all addressed:

- **HIGH — the scrub rAF loop could never terminate** (`video-scrub.ts`): a `currentTime` write restarts a real seek even at the same position, so the converged-frame write re-armed the loop — verified empirically (225 redundant `seeked` events per 3s while the page sat idle; sustained decoder/rAF churn defeating the "freezes when scrolling stops" contract). Fixed with a `lastWritten` fixed point: the landed state writes once and truly idles.
- **HIGH — backdrop preload starved the hero clip**: three `preload="auto"` backdrops (~8.5 MB) were discovered before the hero clip in the SSR HTML and split its bandwidth four ways on constrained networks, freezing the flagship scrub mid-orbit. Fixed: backdrops ship `preload="metadata"` + posters and upgrade to auto only when the visitor nears the reveal.
- **MEDIUM — post-hydration 260vh injection broke hash deep-links / scroll restoration** (verified empirically: `/#services` entry left Services 160vh below the fold on WebKit; layout-shift entries of value 1.0): the runway moved from a JS effect to pre-paint CSS gated on `@media (scripting: enabled) and (prefers-reduced-motion: no-preference)` — same parity contract, zero shift. (Two findings, a11y + performance lenses, one root cause.)
- **MEDIUM — reduced-motion visitors downloaded all ~12 MB** for four permanently static frames: fixed by the same `preload="metadata"` + effect-gated upgrade (the reduced-motion path never upgrades).
- **MEDIUM — doc drift**: taxonomy §7, PRD open question 4, and the decision-log "Still open" list all still recorded the hero background swap as open/owner-owed after this unit closed it. All three reconciled (taxonomy §7 rewritten to the shipped brand assets; PRD Q4 closed; still-open list trimmed).
- **LOW — mid-session Reduce-Motion flip left an arbitrary mid-clip frame** instead of the documented poster/first-frame fallback: cleanups now `load()` the hero (re-arms the poster) and reset the backdrops' `currentTime` to 0.
- **LOW — per-scroll-event layout reads**: the hero element/runway travel are now measured once (re-measured on resize), progress guards skip redundant work, and opacity writes only fire on change. (Document height stays a per-event read — the Process accordion changes it without a resize.)
- **LOW — decision-log #15 was detached from the GFM table** by a blank line (would render as a raw pipe paragraph): joined to the table.

Refuted (2): a claimed stale-backdrop race after runway expansion (scroll events re-invoke the update; and moot once the runway moved to pre-paint CSS) and a claimed double-decode pipeline at crossfade seams (the incoming clip's target clamps to 0 through the first half of each seam, so its scrubber idles).

**Post-fix verification:** gates re-run green (`lint` · `tsc` · `next build` · `banned-terms`); browser re-checked — orbit scrub exact at 0/25/50/75/100% runway, seams crossfade, `/#services` deep-link lands on Services with the runway present pre-paint, idle CPU clean (no `seeked` events while stationary), reduced-motion emulation shows posters with no video fetch beyond metadata.

## Realism regeneration (owner feedback, 2026-07-07 — same day)

Owner review verdict: lighting / camera / scenes spot-on, **person not realistic enough**. All four clips regenerated with the same settings and the same `nate-nextsketch` Element, prompts rewritten for hyper-photorealism (live-action / cinema-camera language, real-skin texture direction, explicit anti-CGI constraints). Two rounds were needed for the hero:

- **Round 2** (jobs `9e3e7eba` orbit · `4e26ece1` strategist · `d72e0113` builder · `6fa743d3` partner): realism excellent on all four — but the orbit **lost the 360°** (the realism-portrait language biased it into a slow front push-in; caught by frame-tracing 0–7s before install). Backdrops accepted and shipped.
- **Round 3** (job `fe4bb8b7`, orbit only): prompt restructured to lead with the camera path spelled out phase-by-phase (front at 0s → right profile at 2s → directly behind at 4s → left profile at 6s → front at 8s, constant radius, never zooming). Full 360° confirmed by frame-tracing **and** hyper-real. Shipped.

Higgsfield's "3D RENDER" preset suggestion (ironically triggered by the anti-CGI phrasing) was declined on all regenerations; the previous round's "IN THE DARK" decline stands. Shipped encodes (same recipe): hero 2.5 MB · strategist 3.6 MB · builder 3.3 MB · partner 2.6 MB; posters re-extracted. No code changed — assets swapped in place under the same names; scrub re-verified in the browser after the swap (orbit 0→8.04s exact at runway quarters, paused throughout).

## Kling 3.0 regeneration (owner feedback round 2, 2026-07-07 — likeness + approachability)

Owner verdict on the Seedance clips: everything perfect except the person's look — and the expression read too serious/intimidating; directive to regenerate on **Kling 3.0** with an approachable, pleasant look. Two findings from execution:

1. **Kling 3.0 text-to-video cannot hold the Element identity.** Its media inputs are start/end frames only; the `nate-nextsketch` Element degrades to a text description (`kling_element_ids`), and all four straight text-to-video takes produced *different men* (caught by frame-checks before install; jobs `a606b13f`/`8043f901`/`c37206ef`/`7e6dff8d`, discarded).
2. **The working pipeline is keyframe-first:** identity-locked hyper-photoreal stills via **Nano Banana 2** (Elements-compatible; jobs `98d3e865` orbit · `aa1ca95d` strategist · `2a4dfbcc` builder · `627cee2f` partner v2 — the first partner still had a stray phone-to-ear and was re-rolled) → each still fed to **Kling 3.0 as `start_image`** with the motion prompt (image-to-video). Identity, wardrobe, and the warm approachable expression hold through the motion; the orbit keeps the phase-by-phase 360° path (front → profile → back at 4s → profile → front, frame-traced).

Shipped Kling jobs: orbit `5daf266f` (**mode `pro` = 1920×1080** — Kling's `std` outputs 720p, so pro delivers the owner's 1080p on the money shot; backdrops `9f95571e`/`7143078a`/`263622aa` in std/720p, matching their shipped resolution). Same encode recipe; hero 4.8 MB, backdrops ~2.8 MB. Assets swapped in place again — no code changes; scrub re-verified post-swap (orbit exact at runway quarters; backdrop seek instrumentation confirms clips advance correctly through their bands). Expression across all four is now warm/approachable per directive.

## Open for Nate

1. Approve the four clips (or ask for re-rolls — the identity Element `nate-nextsketch` is reusable; each re-roll is one `generate_video` call away).
2. Tune the two feel constants if desired: runway 260vh, crossfade 0.08.
3. The OG/social-share image remains open (decision-log); the hero-orbit poster frame is a candidate.
4. **Open the PR when verified** — branch pushed, no PR per policy.
