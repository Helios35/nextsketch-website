# Build Note 32 — Hero loop video; the scroll-driven video retired (adhoc)

**Date:** 2026-10-05 · **Branch:** `adhoc/hero-loop-video` · **Base:** `main` @ `4af91b2`
**Status:** COMPLETE, with three items back to Nate (see "Judgment calls"). All four gates green; verified in headless Chrome 154 and Edge 154 against a production build of `main`.
**Follows:** build-notes 18 (the scroll video) and 20 (the cadence contract). **Decision:** #46 (this unit's row); supersedes #15's scroll treatment and #17 in full.
**Brief:** `brief-hero-loop-video` (owner call 2026-10-05). Assets supplied with it: `hero-loop.mp4`, `hero-loop-poster.jpg`.

---

## Pre-flight gap list

Surfaced before any code changed. The brief was written against production without the repo, and it says to trust the code where they differ.

1. **The footage was never hosted externally.** All eight retired files (`hero-orbit.mp4`, `backdrop-{strategist,builder,partner}.mp4`, and a poster each, about 12.3 MB) were committed in `public/` and served by Vercel as static files. The brief's guardrail allows committing video when the current footage already lives in the repo, and it does, so the loop goes in `public/` too. 10.9 MB is far inside GitHub's limits (warning at 50 MB, hard stop at 100 MB). **Not a stop.**
2. **`/work` and `/work/<slug>` do not exist on `main`.** They live only on the unmerged `adhoc/case-study-grid` and `adhoc/case-study-template` branches. On `main` both URLs render the 404, which is what was checked for video requests.
3. **#15 is a row this unit changes too.** The brief names #17, but #15 is the decision that created the scroll-scrubbed hero orbit and the backdrop sequence. #46 says it supersedes both, and each row got a one-line supersession note.
4. **The log tail is #45 and the build-note tail is 31.** #39–#44 and notes 29–30 are held by the unmerged case-study branches (the log's own preamble). This unit is **#46** and **note 32**.
5. **Production could not be loaded.** Production deployments are behind Vercel SSO, and `nextsketch.vercel.app` is someone else's site (title "NextSketch.", no video). GitHub's deployment record puts production at `4af91b2`, which is `main`, so every "matches production" check below is against a local production build of `main` at that commit.
6. **Nothing else reads the runway or the backdrop.** `Parallax` measures its own box against the viewport, `ScrollReveal` is an IntersectionObserver, the marquee and the hero's `rise-in` are CSS on load, and `SiteNav`'s 80px threshold is absolute `scrollY`. Only `HeroOrbit`, `ScrollVideo` and the Work band's `data-backdrop-hidden` attribute (read by `ScrollVideo` alone; no CSS selects it) were tied to the runway or the backdrop.
7. **Removing the runway opens a 28px window with no logo.** Predicted from the repo's own comment in `pricing/page.tsx`, then measured. See judgment call 1.

## The asset

Probed before install by reading the MP4 boxes. It matches the brief to the byte:

| Property | Value |
|---|---|
| Container | `ftyp`, then `moov` at byte 32, then `mdat`: **faststart** |
| Tracks | one: `vide` / `avc1` (H.264), **no audio track** |
| Frame | 1920×1080, 672 samples over 28.000s = **24.000 fps** |
| Size | 10,913,242 bytes |
| Poster | JPEG 1920×1080, 79,647 bytes |

Both files were copied into `public/` unmodified: SHA-256 `392ed4e2…a5fbfa` (video) and `b05dc68b…c8a9b5` (poster) match the delivered files.

## What shipped

| File | Change |
|---|---|
| `src/components/hero-loop.tsx` | **New name** (git rename of `hero-orbit.tsx`, contents rewritten). `HeroLoop`: one `<video muted loop playsInline preload="metadata" poster>` under the unchanged overlays; an effect calls `play()` |
| `src/components/hero.tsx` | Mounts `HeroLoop`. The section loses `data-hero-runway`; the stage loses `data-hero-stage` and goes from `sticky top-0` to `relative` (it still has to be the containing block for the absolute footage and header). Header block, strip, headline, CTA and supporting line untouched |
| `src/app/page.tsx` | `ScrollVideo` mount and import removed; doc block rewritten |
| `src/app/globals.css` | The `[data-hero-runway] { min-height: 260vh }` rule and its comment removed |
| `src/components/work-section.tsx` | `data-backdrop-hidden` removed; doc block updated |
| `src/content/copy.ts` | `LANDING.backgroundVideo` → `/hero-loop.mp4`, `backgroundPoster` → `/hero-loop-poster.jpg`; doc block updated |
| `public/` | `+ hero-loop.mp4`, `+ hero-loop-poster.jpg` |

**Removed:** `src/components/scroll-video.tsx`, `src/lib/video-scrub.ts`, `src/components/hero-orbit.tsx` (as renamed above), and the eight footage files: `public/hero-orbit.mp4`, `public/hero-orbit-poster.jpg`, and `public/backdrop-{strategist,builder,partner}.mp4` with their `-poster.jpg`. Git history keeps them. Nothing was deleted from external hosting, because nothing was hosted there.

**Comment-only edits**, to clear stale references to the retired code. Rendered output is unchanged (see Checks): `layout.tsx`, `pricing/page.tsx`, `capability-strip.tsx`, `service-page.tsx`, `service-process.tsx`, `services-section.tsx`, `work-rail.tsx`, `page-glow.tsx`.

**Names.** `HeroLoop` / `hero-loop.tsx` after the asset it plays. The asset names are the owner's, unchanged, and fit Taxonomy §7's shipped-asset convention (kebab-case in `/public/`). `LANDING.backgroundVideo` / `backgroundPoster` keep their keys.

### How playback works

- **`play()` from an effect, not the `autoPlay` attribute.** This keeps the motion gate ahead of any motion. The server HTML is the poster, no-JS visitors keep it (the same static fallback the scrubbed orbit gave), and reduced-motion visitors never get a `play()` call.
- **The hydration pass.** `usePrefersReducedMotion` returns its server snapshot (`false`) while hydrating. On its own, the first build therefore called `play()` for a reduced-motion visitor and cancelled it 7ms later with `pause` + `load` (instrumented: `play@368, pause, load@375`). No frame played, but it was a `play()` call and a second request. The effect now also reads the media query directly. Re-measured: zero `play`/`pause`/`load` calls and one metadata request.
- **Refusal.** `play()` returns a promise. A refused autoplay (iOS Low Power Mode, a data saver) rejects it with `NotAllowedError`; the rejection is caught deliberately, so the poster stays and nothing is logged.
- **The seam is the file's.** Native `loop`, no fade or crossfade in code (brief).
- **Mid-session reduced-motion flip:** cleanup pauses and calls `load()`, which re-arms the poster (the `HeroOrbit` precedent).

## Checks

**Gates:** `npm run lint` ✓ · `npm run typecheck` ✓ · `npm run build` ✓ (Next 16.2.9, same six routes as `main`) · `npm run banned-terms` ✓ (56 files).

**Method.** A headless-Chrome driver over the DevTools protocol (a scratch script outside the repo; no dependency added) loaded production builds of `main` and of this branch, served with `next start`. It is used instead of the in-app browser pane because a hidden pane suspends `requestAnimationFrame`, and because only the protocol can emulate `prefers-reduced-motion` and a refused `play()`.

**Hero matches production at every width.** Every box was compared to the hundredth of a pixel against `main` at scroll 0 (after the `rise-in` entrance settles). These were **identical** at 360, 768, 1280 and 1920: the stage, the header, the wordmark, the capability strip, the `<h1>`, the CTA, the supporting line, and the footage wrapper with its three children (`video`, `ink/40` overlay, scrim). The only change is the section's own height, as intended: 2028 → 780, 2662 → 1024, 2080 → 800 and 2808 → 1080.

**Lower sections are unchanged apart from their surface.** For each section (Work, Why, Services, Process, About, Start) and for the footer, these were identical to `main` at all four widths: offset from the hero's end, height, padding and order. At 768 two offsets read 1px low; that is `main`'s rounding, since 260vh × 1024 = 2662.4px. The heights are identical.

**The other routes render identically.** The prerendered HTML of `/pricing`, `/services/product`, `/services/agentic-system`, `/_not-found` and `/_global-error` is identical to `main`'s once build hashes are normalized out. On `/`, the HTML diff (scripts excluded) is exactly:
- the backdrop's wrapper, its three `<video>`s and two overlays, removed;
- the runway and stage attributes removed, and the stage's `sticky top-0` replaced by `relative`;
- the hero `<video>` swapped (`hero-orbit` → `hero-loop`, `loop` added);
- `data-backdrop-hidden` removed from Work.

**Playback.** Measured with `requestVideoFrameCallback` on every presented frame, over two full loops (61s):

| Check | Result |
|---|---|
| Starts on its own | `paused: false` within the settle window at 360/768/1280/1920; one `play()` at hydration (~350ms) |
| Cadence | 1,462 frames, 23.96 fps effective, median 41.7ms between frames, p99 45.9ms |
| Restarts | two, at 28.4s and 56.4s of wall time |
| Black flash at the seam | **none**: mean luminance 38.0 on the last frame (27.958s) → 37.8 on frame 0, minimum 37.2 across the seam window |
| Stall at the seam | **one held frame**: 83.4ms and 91.6ms between the last frame and frame 0 (against the 41.7ms cadence), plus one `waiting` event per restart. That is Chrome's native loop seek; the brief puts restart handling out of reach of code |
| Scroll never changes it | scrolled to 400, 2000, 0, 5000, 800, 3000, 0 and 1500 during playback; every jump advanced the clip by 0.25–0.27s across 250ms of wall time, i.e. real time, and no seek fired outside the two restarts |

**The poster paints at once.** The poster request starts 12ms into navigation, initiated by the `<video>` element in the HTML, and finishes before first contentful paint (488ms in headless). The MP4 request starts at 243ms.

**Reduced motion** (`prefers-reduced-motion: reduce` emulated, desktop and mobile): `paused`, `currentTime 0`, `played.length 0`, zero `play` calls, one metadata request, poster showing, console clean.

**Autoplay refused** (`play()` made to reject with `NotAllowedError` before any page script, mobile 360): `paused`, `currentTime 0`, poster showing, **no exception and no console entry**.

**No video anywhere else.** `/pricing`, `/services/product`, `/services/agentic-system`, `/work`, `/work/mascot` and an unknown path: zero `<video>` elements and zero `.mp4` requests after scrolling each page to its foot. `/work` and `/work/mascot` are 404s on `main` (gap 2).

**Second engine.** Headless Edge 154 (Chromium) also plays and loops: `paused: false`, `loop`, `muted`, no exceptions.

**Console.** The only entries on `/` in every run are the pre-existing local-environment ones, identical on `main`: Vercel Analytics' script 404s outside Vercel, and the Apollo pixel's 400.

**Grep.** `src/`, `scripts/`, `public/` and `README.md` contain no reference to `ScrollVideo`, `scroll-video`, `video-scrub`, `HeroOrbit`, `hero-orbit`, the `backdrop-*` files, `data-backdrop-hidden` or the runway/stage attributes. The two remaining doc mentions of the component names are in `04-ux-spec.md`'s RETIRED inventory rows and RETIRED section, which is that doc's convention for recording what is gone so it cannot be mistaken for current. The decision log and earlier build notes keep their history (append-only; not edited).

**Not verified here:** real iOS Safari (including Low Power Mode), Android Chrome, desktop Safari and Firefox. This environment has only Chromium engines. The refusal path was exercised by making `play()` reject exactly as those browsers do. The muted + `playsInline` + effect-`play()` combination is the standard pattern iOS allows without a gesture.

### Fix after the first push: the loop froze after the page was hidden

**Owner report, same day:** "the video runs then goes away", seen in the Claude desktop preview pane on `next dev`.

**Cause, measured.** The clip has no audio track, so Chromium treats its playback as video-only and pauses it while the page is hidden. In the pane, it was paused at 6.8s and again at 20.6s with `visibilityState: hidden`, and it stayed paused after the pane was visible again. Our code did not cause either pause: no `pause()` or `load()` call was logged, and the time was not reset.

**It is not a Chrome bug.** In headless Chrome 154, a hidden tab pauses the clip and resumes it 1.5s after the tab is shown again. The pane does the pause without the resume. Nothing obliges every engine to resume a script-started video, so the loop should not depend on it.

**Change.** `HeroLoop` now calls `play()` again on `visibilitychange` and on `pageshow` (a back/forward-cache restore), whenever the page is visible and the clip is paused. Calling `play()` on a playing video does nothing. The listeners are registered only on the motion-safe path and removed in the cleanup, so reduced motion is unaffected.

**Verified** in headless Chrome against `next dev`, plus lint and typecheck:

| Case | Before | After |
|---|---|---|
| Page hidden, paused by script with no native resume (the pane's behaviour), then shown | still paused at 4.6s | playing again: 4.71s → 6.23s → 9.23s |
| Normal Chrome hide and show | resumes | unchanged |
| Reduced motion | poster only, nothing played | unchanged |
| Back navigation | plays | unchanged |

## Deviations from the brief

1. **Decision log: beyond "append plus footer", three small in-place edits.** (a) The numbering preamble said "the next new row is #46"; left alone, the next agent would collide, so it now says #47 (and "#45–#46"). (b) and (c) one-line supersession notes appended to #15 and #17. The log's own rule is that a superseded row "stays in place and says so", and #45 did the same for #25 and #38. None renumbers, rewords or re-litigates a row. Each is a one-line revert if unwanted.
2. **Comments in `pricing/page.tsx` and three service-route files were edited.** The brief's grep check requires it and the brief bars pricing changes. These are comment-only, and the built HTML of all three routes is identical to `main`'s.
3. **`page.tsx`'s doc block** called Work a dormant held section; since it was being rewritten anyway, the stale clause was corrected (Work was reactivated by #16).

## Judgment calls back to Nate

1. **The wordmark window (recommend fixing; held).** The nav's handoff still fires at the same place, 81px of scroll (measured identical to `main` at every width). What changed is the hero's side. Its lockup is `absolute` inside the stage, and the stage was pinned across the runway, so on `main` the lockup sat at 24–52px under the nav bar the whole time. Unpinned, it scrolls out with the hero: it is fully off-screen from **52px**, and the nav's lockup does not arrive until **81px**. **Between 52 and 80px no logo is on screen**, measured at 360/768/1280/1920 and confirmed by screenshot at 66px. This is exactly the defect `pricing/page.tsx` documents and fixes with a zero-height `sticky top-0` wrapper, and the reduced-motion path on `main` already behaved this way. **Recommendation:** apply that wrapper to the hero's header block (a few lines in `hero.tsx`; the lockup keeps its 24px offset and the nav is untouched). Not made, because the brief puts the header block off limits and says to stop and report. **`03-site-architecture.md` §Navigation** still says the bar's lockup "takes over at 80px without a jump or a blink". That is untrue for `/` until this lands, and true again once it does, so it was left unedited and flagged here.
2. **The mobile hero height (recommend `min-h-svh`; not made).** The hero is `min-h-dvh`. On `main` it sat inside a 260vh runway (`vh` is the large viewport, stable on mobile), so its dynamic height never moved anything. Now its height is the page's first-scroll geometry. When a mobile browser's URL bar collapses on the first scroll, `dvh` grows by the toolbar's height and everything below the hero should shift by that much mid-scroll. The reduced-motion path has always done this. Emulation cannot collapse a URL bar, so this is reasoned from the CSS, not measured. **Recommendation:** `min-h-svh` on the stage. It is exactly the visible height on load (bar expanded), the bottom-anchored headline and CTA stay where they are, and it never resizes. It is a one-class hero layout change, so it is Nate's call.
3. **The lower sections on plain ink (no section reads badly; two leftovers flagged).** Screenshots before/after at 1280 and 360 for every section. Contrast only improves: white headings, gold payoffs and `white/70` body copy now sit on flat black instead of moving footage. What the footage supplied was **separation and progression**. With the 2026-07-06 "no divider hairlines between sections" call, Work runs into Why, and Start runs into the footer, as one black surface separated by padding. That matches how `/pricing` and the service routes already read, so the recommendation is to accept it. A hairline between sections would reopen the 2026-07-06 owner call, and no background was added (brief). Two pieces of over-footage styling remain and are inert, so they were left as shipped (no type or colour change allowed):
   - the Why, Services, Process, About and Start headings keep the over-imagery `text-shadow`, a black shadow on black, so invisible, and §Typography would now drop it;
   - the Services cards keep `surface/95 + backdrop-blur-xl`, one RGB step from the solid `surface` §Surfaces now prescribes.

   Recommended as a later cleanup, recorded in the log's open items.

**Also reported, no action needed:**

- **Anything else timed to the runway or scrub:** none found (gap 6).
- **How Work enters:** it now follows the hero directly. Its `ScrollReveal` entrance is unchanged; it fires on intersection, not on the runway.
- **Hosting:** the convention takes the file (gap 1).
- **Deep links** land on their sections, now 1.6 viewports higher in the document. Measured for `/#work`, `/#services` and `/#about`: each lands exactly 80px (the `scroll-margin-top`) above the section.

## Recommendations (not built)

- **The two fixes in judgment calls 1 and 2.**
- **Pausing the loop while the hero is off-screen** would save decode work for visitors reading the lower sections. It was not built: the brief says the video loops indefinitely and #46 says nothing is scroll-linked to video.
- **Caching.** Vercel serves `public/` with `max-age=0, must-revalidate`, as it served the old footage, so returning visitors revalidate the 10.9 MB file (a cheap 304) rather than re-downloading it. A long-lived cache header, or a hashed filename, is a separate call. So is the brief's own out-of-scope mobile encode.

## Spec updates

- `docs/decision-log.md`: **#46** appended at the real tail. #15 and #17 carry supersession notes. The preamble now says next is #47. "Still open" gains the three items above.
- `docs/04-ux-spec.md` → **v3.5**: the scroll-motion paragraph, the motion inventory (Hero loop CURRENT; Site video backdrop and Hero orbit RETIRED), a new §Hero loop, §Scroll-synced background video marked RETIRED, the hero, redesign-sections and Work bullets, §Surfaces' fill note, and the `/pricing` and `/services/*` paragraphs.
- `docs/06-taxonomy.md` → **v2.5**: §7 asset inventory.
- `docs/07-technical-spec.md` → **v2.2**: the project tree.
- `docs/03-site-architecture.md`: untouched. It does not describe the backdrop or the runway; its handoff line is flagged in judgment call 1.
- `docs/02-prd.md`: open question 4 already reads "closed (Unit 03 … hero orbit footage)", a historical record, left as it was.

## Still open, unchanged by this unit

The brief's out-of-scope list stands: a smaller or mobile-specific encode, a pause control, the unused office-meeting video, and the paperwork debt it names — the em-dash gate, the `custom` slug mismatch, and "missing rows #25 and #26". Those two rows are in the log, reconstructed by unit 24 on 2026-08-28, so that item may already be closed. It was not checked further.
