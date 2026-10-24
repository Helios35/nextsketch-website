# Build Note 40: Asha joins the team (adhoc)

**Date:** 2026-10-23 · **Branch:** `adhoc/asha-team` · **Base:** `main` @ `928b4bf` (PR #47 merged)
**Status:** COMPLETE, committed and pushed, no PR (Nate opens it). Asha, NextSketch's AI Content Creator, is About's third card, after Nate and Julie: her looping clip on the front, her name and title beneath, and a click, Enter or Space that flips it to her description. She is labeled as AI in her title, her accessible name and the first words of her description. From 1024px the three cards sit in one row, and from 1280px the row widens so they are 368px (Nate, after review, before merge); below 1024 they stack. All four gates green.
**Follows:** build-note 39. **Decision:** **#66** appended. Next free row **#67**, next build note **41**.
**Brief:** "Adhoc Unit: Asha joins the team" (Nate, 2026-10-23, replacing the unshipped 2026-10-21 draft), with `Asha Team Avatar.mp4` handed over directly.

---

## Pre-flight

- Clean tree on `main` @ `928b4bf`; traced from `ABOUT.team` in `src/content/copy.ts`.
- **Before-captures** (`main`, `next start`, headless Chrome, reduced motion so every frame is still): `/` full page and every section plus the footer at 360, 768, **1024**, 1280 and 1920 (the brief's four widths plus 1024, where the row changes), each with a layout fingerprint (every descendant's box and paint properties). Kept outside the repo.
- **A 1px sweep of every card back on `main`** (320 to 1920px), since the brief asks that Asha's description fit "as Nate's and Julie's do". They do not everywhere: see *How the descriptions fit* below. Build-note 38 measured 12 widths and missed these ranges.

**Gaps and findings before building:**

1. **The clip is HEVC (H.265)**, where Nate's and Julie's are H.264. It is not heavy (721 KB against their 8.6 and 6.8 MB), so the brief's weight guardrail does not apply; the codec is a reach question, not a weight one (builder call 2).
2. **It is not faststart** (the `moov` index sits after the media data). At 721 KB this costs one extra range request when playback starts; nothing more.
3. **It carries a signed C2PA content credential** (a `uuid` box): created 2026-10-19 by BytePlus ModelArk, model `dreamina-seedance-2-5`, digital source type `trainedAlgorithmicMedia`, that is, AI-generated. Installing the file byte-identical keeps it, which backs outcome 2 in the file itself. Any re-encode drops it unless re-signed.
4. **The loop closes with a small step.** Last frame against frame 0 differs by 3.47/255 (mean absolute RGB), where no two adjacent frames in the clip differ by more than 1.63 (median 0.34); Julie's seam is 0.80. The figure sits about 6 source pixels to one side between the two frames, about 1.2 CSS px on the 283px desktop card, 1.5 on the 368px one and 1.9 on the 448px stacked one. Shipped as delivered (builder call 3).
5. **The back's largest type step already overflowed on `main`**, for Nate and Julie, on 432 to 474px phones. Asha's back overflowed the same way at 432 to 450px. Fixing it for her is a change to the shared card (builder call 1).

## What shipped

- **Asha is the third card**, after Nate and Julie: a third row in `ABOUT.team`. Same `TeamAvatar`, same loop while on screen, same flip, same caption, her `bio` on the back. Nothing forked; the card needed no change to take her.
- **She is clearly AI.** Title "AI Content Creator", shown under the card at every width and in the server HTML; accessible name "Asha, AI Content Creator at NextSketch"; description opening "An AI, not a person." The file itself carries the C2PA credential (above).
- **One team row from 1024px** (`lg:grid-cols-3`), three cards of about 283px, and **368px from 1280** (`xl:max-w-6xl`, Nate's call on builder call 5); stacked below 1024, as before.
- **The back's `text-2xl` step moved from `@sm` to `@md`** so every back except Julie's two narrow ranges fits (builder call 1).

## The copy (Part B, verbatim)

| Field | Value |
|---|---|
| `id` | `asha` |
| `name` | Asha |
| `title` | AI Content Creator |
| `alt` | Asha, AI Content Creator at NextSketch |
| `bio` | An AI, not a person. She hosts our YouTube Shorts, short breakdowns of how agentic systems and AI products get mapped, built and kept running. Every video is made in-house with AI. One more way we use what we sell. (214 characters) |
| `video` | `/team/asha.mp4` |
| `poster` | `/team/asha-poster.jpg` |

No em dashes (#19); the banned-terms gate is clean.

## Components and files changed

| File | Change |
|---|---|
| `src/content/copy.ts` | `ABOUT.team`: Asha's row, after Julie's. The doc block names her and says she is always labeled as AI; the team field's note gives the three-across card width. |
| `src/components/about-section.tsx` | The team grid: `lg:grid-cols-2` → **`lg:grid-cols-3`**; then, after review, **`xl:max-w-6xl`** on the row's wrapper beside `lg:max-w-4xl`. The doc block updated (three in one row, about 283px from 1024 and 368px from 1280; a fourth member would wrap). |
| `src/components/team-avatar.tsx` | The bio's `@sm:text-2xl @sm:leading-normal` → **`@md:text-2xl @md:leading-normal`** (its own commit). The doc block updated, with why. |
| `public/team/asha.mp4` | **New.** The delivered clip, byte-identical. |
| `public/team/asha-poster.jpg` | **New.** Frame 0, 960×960. |

## The layout change: three across

The smallest change that puts three in one row: one grid token. The row keeps its `max-w-4xl` cap (896px) and `lg:gap-6`; at 1024 the section's content box is exactly 896px (1024 less the `lg:px-16` gutters), so each card is (896 − 48) / 3 = **282.67px**, and the cap holds it there at every wider width. With a classic 15 to 17px scrollbar at 1024 the card is about 277px; it stays on the same type step either way.

| Viewport | Layout | Card width |
|---|---|---|
| 320 / 360 / 390 / 430 | stacked | 272 / 312 / 342 / 382px |
| 512 to 1023 | stacked | 448px |
| 1024 to 1279 | **one row of three** | 282.67px (was 436px, two across) |
| 1280 / 1920 | **one row of three** | **368px** (`xl:max-w-6xl`, after review) |

The row's centre sits on the section's centre at every width (measured offset 0). Under 1024 nothing changed except that the stack is one card longer. **Why the first cut did not widen the row:** a cap that let the row grow with the viewport would walk the cards through the `@2xs` and `@xs` type steps between 1024 and 1280, where Julie's back is tightest; the fixed 283px sits safely on one step. The brief asked for the smallest change, so `xl:max-w-6xl` was offered rather than built.

**Widened from 1280 (Nate, after review, before merge).** `xl:max-w-6xl` (1152px) sits beside `lg:max-w-4xl` on the row's wrapper. At 1280 the section's content box is exactly 1152px (1280 less the `lg:px-16` gutters), so each card is (1152 − 48) / 3 = **368px** at once, and the cap holds it there at every wider width: the cards step from 283 to 368px with no width in between, so they never pass through a type step on the way. At 368px every back is 18px Inter (`@xs`), with the narrow padding (`@sm` opens it at 384), 66, 76 and 57% of the room. The 1px re-sweep after the change matched the one before it at every width from 320 to 1279. With a classic scrollbar at 1280 the content box is about 1135px and the cards about 362px, still on the same step.

**Is 283px too small at 1024 to 1279?** Judged not: it is the size of a 320 to 360px phone card, which the owner accepted. The back is 14px Inter, 7 or 8 lines, 72 to 82% of the room; faces in the clips are roughly 60px wide. From 1280 the cards are 368px, about the size of a 416px phone's.

## Assets

| Path | Source | Bytes | Format | SHA-256 (first 12) |
|---|---|---|---|---|
| `public/team/asha.mp4` | `Asha Team Avatar.mp4`, byte-identical | 721,399 | 1440×1440, 5.04s (121 frames at 24fps), **HEVC (`hvc1`)**, video only, `moov` at the end, about 1.14 Mbps, C2PA credential | `52e52c718d80` |
| `public/team/asha-poster.jpg` | frame 0 of the clip, builder-cut | 45,818 | 960×960 JPEG (mozjpeg q84) | |

Names per Taxonomy §7 and §8 (`/public/team/{id}.*`, kebab-case); the delivered name is a source name only. **The poster is made the way Nate's and Julie's were:** frame 0 drawn to a canvas in headless Chrome at its native 1440px and resized to 960 with `sharp`, so the poster is exactly where the loop starts. Frame 0 is a clean frame (eyes open, settled; she blinks partway through the clip, checked on a frame strip). The clip's frame size and length match the other two (1440×1440, 5.04s, 121 frames).

## How the descriptions fit

Measured with every card flipped (reduced motion, so the back shows at once), resizing the viewport 1px at a time from 320 to 1920 and reading each back: the `bio`'s box against the face's padding box, and its distance to the flip mark's top edge.

| Viewport | Card | Type | Nate | Julie | Asha |
|---|---|---|---|---|---|
| 320 | 272px | 14px | 8 lines, 86% | 8, 86% | 8, 86% |
| 360 | 312px | 16px | 8, 83% | 8, 83% | 7, 72% |
| 390 | 342px | 18px | 8, 83% | 8, 83% | 7, 73% |
| 440 | 392px | 18px (24px before) | 7, 66% | 8, 75% | 6, 56% |
| 768 | 448px | 24px | 8, 78% | 9, 88% | 8, 78% |
| 1024 to 1279 | 283px | 14px | 8, 82% | 8, 82% | 7, 72% |
| 1280 / 1920 | 368px | 18px | 7, 66% | 8, 76% | 6, 57% |

**Asha's back fits at every width from 320 to 1920:** inside the padding, 48 to 91% of the room, never closer than 21px to the mark. Nate's likewise. **Julie's runs 2 to 6px into the padding at 336 to 340px and 368 to 370px** (just after the `@2xs` and `@xs` steps; 101 to 103% of the room), still 8px or more clear of the mark. That is pre-existing, and her copy is out of this unit (builder call 4).

**The type-step move (builder call 1), before and after.** On `main`, at 432 to 474px phones (384 to 426px cards), `text-2xl` from `@sm` set Nate's and Julie's `bio` at 24px in 9 or 10 lines, up to 118% of the room: the last line sat up to 9px below the flip mark's top edge and the first within 4px of the card's top. Asha's did the same at 432 to 450px (up to 107%). With `text-2xl` from `@md` (448px), those cards take `text-lg` (18px): 6 to 8 lines, 51 to 77%. The 448px stacked card (512 to 1023) keeps 24px as before. Nothing else about the back changed, and nothing at rest.

## Verification

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm run build` | clean, six routes, `/` static |
| `npm run banned-terms` | clean (57 files) |
| About at 360, 768, 1024, 1280, 1920 | three cards; stacked at 360 and 768 (312, 448px), **one row from 1024** (282.67px; 368px at 1280 and 1920), centred; every caption reads "Nate / Founder / Lead Architect", "Julie / Client Partner", "Asha / AI Content Creator"; captured at rest and flipped |
| Card backs | the 1px sweep above: Asha fits at every width. **Re-swept after the widening:** 320 to 1279 identical to the sweep before it, number for number; 1280 to 1920 all three fit, 57 to 76% of the room, 48px or more clear of the mark |
| The widening, on its own | captures against the build before it: 360, 768 and 1024 pixel-identical everywhere, About included, with equal fingerprints; at 1280 and 1920 About grows 1082 → 1167px, every other section keeps its fingerprint, and the only pixels that move are one line of the final CTA's body (re-snapped by its new fractional offset, y 6495.92 → 6581.25 at 1280), a few footer glyph pixels (at most 8/255) and, at 1920, Work's screenshots (at most 1/255, the per-run re-encode). Click, Enter, Space, the accessibility tree, reduced motion, the refused clip and no JS re-run: results as below, unchanged |
| Click, Enter, Space | Tab from Julie's card lands on Asha's; Enter flips it (`aria-pressed` true), Space flips it back, a click flips it; after flipping back the card is flat again (no 3D context at rest) |
| The flip | one `transform` transition, `0.7s cubic-bezier(0.16, 1, 0.3, 1)`; paused at 0 to 700ms the frames run face, edge, back; settled at `matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, …)` |
| Screen reader | accessibility tree: `button "Asha, AI Content Creator at NextSketch"`, described by her `bio` ("An AI, not a person. She hosts our YouTube Shorts…"), `pressed=false`; Nate and Julie unchanged |
| Playback | motion on at 1280: all three clips at `readyState` 4, playing, advancing 1.0s per second; Chrome 155 and Edge 156 (Windows, headless) both decode Asha's HEVC (`canPlayType` "probably") |
| A browser that cannot decode the clip | the request for `asha.mp4` answered with bytes no decoder takes: media error 4, the poster stays, no exception (`useLoopVideo` catches the refused `play()`) |
| Reduced motion | zero `play()` calls (all three), every clip at `readyState` 0, only the three posters fetched; a click shows Asha's back at once (`transitionDuration: 0s`, rotor at 180°) |
| No JS | all three names and titles in the server HTML, three posters, no `aria-pressed` |
| Nothing else on `/` changed | hero, proof band, Why, Services and Process pixel-identical with equal layout fingerprints at all five widths. **Work**: layout fingerprints equal; pixels differ by at most 7/255, only inside its `next/image` screenshots, which the optimizer re-encodes per server run (two runs of one build are byte-identical; Work's code is untouched). **Final CTA and the footer**: layout fingerprints equal; glyph pixels differ because About's new height moves them by a fraction of a pixel (e.g. y 6649.25 → 6495.92 at 1280), which re-snaps text antialiasing (build-note 38's finding). About itself: 1575 → 1992px tall at 360, 1775 → 2328 at 768 (one more stacked card), 1300 → 1147 at 1024 and 1235 → 1082 from 1280 (smaller cards; 1167 once the row widened) |
| Console | no exceptions in any run |

**Not verified:** Safari and iOS, Firefox, Linux (headless Chrome and Edge on Windows only). Safari decodes HEVC natively; Firefox and Chrome need platform or hardware HEVC support, and without it her card shows the poster with no loop, as measured above. The video's sharpness at rest was not re-measured: the flat-at-rest card is unchanged from build-note 38.

## Builder calls (each comes back to Nate)

1. **The back's `text-2xl` step moves from `@sm` (384px) to `@md` (448px)**, in `team-avatar.tsx`, as its own commit (`b5a3d04`), so it can be dropped alone. Without it Asha's description overflows the back at 432 to 450px, which the brief rules out, and her copy ships verbatim, so the card was the only place to fix it. It touches Nate's and Julie's backs only on 432 to 495px phones, where they now read at 18px instead of 24px, and fixes their overflow there (432 to 474px on `main`). Recommendation: keep.
2. **The clip ships as delivered, HEVC.** It plays in Chrome and Edge here and in Safari; where HEVC cannot be decoded, the poster stays. **Recommendation:** an H.264 export of the same footage (1440×1440 or 960×960, faststart), dropped in at `/team/asha.mp4`; nothing in code changes. Transcoding here was not done: there is no encoder on this machine, it would drop the C2PA credential, and the brief asks that nothing change how she looks without your say.
3. **The loop's small step** (about 6 source px at the seam) ships as delivered. A re-export that ends on frame 0 would fix it with call 2.
4. **Julie's two narrow ranges** (336 to 340px, 368 to 370px; 2 to 6px into the padding, clear of the mark) are left alone: pre-existing, and her description is out of scope. Fix options: trim her `bio` by a few words, or nudge the `@2xs` and `@xs` steps (which would touch all three backs at those widths).
5. **The row widens from 1280** (`xl:max-w-6xl`, 368px cards). The first cut kept `max-w-4xl`, so every desktop card was 283px, and offered this; **Nate approved it after review** (2026-10-23), and it is built and verified (see *The layout change*). Closed.
6. **The poster is frame 0**, like the other two. Replace it with an owner still under the same name if wanted.

## Deviations from the brief

- **A component change** (builder call 1). The brief framed adding her as content plus assets with at most a small grid change; the grid change is one token as asked, and the type step is one more token, in the shared card, because the brief's own fit check could not otherwise pass.
- **Docs beyond the Spec Updates list:** `02-prd.md` F7 and `03-site-architecture.md` (both said "Nate and Julie for now"); the decision log's numbering preamble and its open items, as every unit does. The UX spec's §About team also records the type step and the 1px fit measurements, and its card-width line.
- **Before and after captures at five widths**, adding 1024 to the brief's four.

## Out of scope, noted

- **The section's text now sits above a card for an AI.** The intro says "You work with the same people from the first call to launch, and after", the body "you work with the people who learn your business", and the eyebrow reads "Who you work with". Asha's card says plainly that she is an AI, so nothing implies she is a person, but the framing above her is about people a client works with, and she hosts the Shorts. Other About copy was out of this unit; worth a look.
- The `TeamMember` doc comment in `src/lib/types.ts` still speaks of "the person"; developer notes, left as they were.
