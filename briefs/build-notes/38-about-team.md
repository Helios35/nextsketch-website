# Build Note 38: About becomes the team (adhoc)

**Date:** 2026-10-15 · **Branch:** `adhoc/about-team` · **Base:** `main` @ `4ed9db0` (Brief 2 merged as PR #45)
**Status:** COMPLETE, pushed, no PR (Nate opens it). About shows Nate and Julie as avatars that turn on click, Enter or Space and show each person's name and title beneath; the copy is Part B verbatim; the team is a list in content; the portrait is retired; nothing else on the page moved. All four gates green.
**Follows:** build-note 37. **Decisions:** **#63** and **#64** appended. Next free row **#65**, next build note **39**.
**Brief:** "Adhoc Unit: About becomes the team" (Nate, 2026-10-15; Brief 3 of 3), with two avatar clips from Nate's marketing assets folder. Interaction reference: the owner's digital card (natedigitalcard.vercel.app).

---

## Pre-flight

**Gaps found before building:**

1. **`claude/site-content-running-notes.md` §5 and §6i**, which the brief cites for the owner call, are in neither the repo nor the reference folder (the gap build-notes 36 and 37 recorded). Built from the brief alone.
2. **The avatars arrived as video, not stills:** `Nate-team-preview.mp4` and `Julie-team-preview.mp4`. Two consequences. **#46's one-video rule** ("the site carries exactly one video", Taxonomy §7) cannot hold as written, so #63 narrows it (builder call 1). **No poster was delivered**, and reduced-motion and no-JS visitors need a still, so the builder cut one from each file (builder call 2).
3. **Nate's clip is heavy:** 8.6 MB for a tile that renders at most 244px wide (builder call 3).
4. **The digital card was studied for its interaction only.** Nothing from it ships: no asset, no code, no copy. (In session Nate asked that the attached files be used, not the card; they are the only media in this unit.) What it showed: a two-faced card that flips 180° about the vertical axis in 0.7s on an expo-out curve, a muted looping portrait clip on its front face that pauses while flipped and never plays under reduced motion, and a mono "↻ Tap" hint.
5. **The motion rules and the brief pull apart.** #47 caps every transition at 200ms and says state is shown by colour, never by a transform. A turn the owner asked for is both a transform and, at a readable speed, longer than 200ms. The brief allows it if it is recorded as an exemption, so it is (#64).
6. **"Shows the person's name and title beneath it"** rules out the card's back-face reveal (the name would be on the avatar, not beneath it). Built as a full revolution that comes back to the face, with the caption appearing beneath.

**Before-captures** (`main` @ `4ed9db0`, `next start` on :3101, headless Chrome, reduced motion so every frame is still): `/` full page plus every section and the footer at 360, 768, 1280 and 1920, with a layout fingerprint per section (every descendant's box and paint properties). Kept outside the repo.

## What shipped

- **About is the team.** Headline "A small, senior-led team. On purpose." (coral on "On purpose", unchanged), the new intro, a row of two avatars, then the four body paragraphs. The slot (05, after Process), `#about`, the nav label "About" and the eyebrow "Who you work with" are unchanged. No line in the section says or implies one person.
- **Each avatar turns** a full revolution on click, Enter or Space and reveals the name and title beneath it; a second press turns it back and hides them. Keyboard and screen reader behaviour come from a native disclosure button.
- **The clips loop** muted while the row is on screen, and pause when it leaves.
- **The team is a list in content**, so adding a person is a content edit (closes build-note 34's F13 for About: the portrait path is gone and the clip and poster paths live in content beside the person).
- **The portrait retires:** `public/placeholders/placeholder-about-01.jpg` is deleted (nothing else used it) and `ABOUT.portraitAlt` with it. `public/placeholders/` stays, holding only its `.gitkeep`, as the Taxonomy §7 convention's home.
- **The biography exemption holds:** paragraph 1 is byte-identical, `I started in industrial design` appears once in `src/content/copy.ts`, and the gate's single `ALLOWED` entry passes its ratification check. §3.4 is not amended.

## The team-list shape

`ABOUT.team` in `src/content/copy.ts`, checked against `TeamMember` (`src/lib/types.ts`) with `satisfies`, every field required:

```ts
{
  id: "nate",                       // kebab-case; names the files below
  name: "Nate",                     // shown beneath the avatar once it turns
  title: "Founder",
  alt: "Nate, Founder of NextSketch", // the avatar's accessible name
  video: "/team/nate.mp4",          // the delivered clip, byte-identical
  poster: "/team/nate-poster.jpg",  // its first frame
}
```

**To add a person:** append a row in the order the row should show them, and add `/public/team/{id}.mp4` and `/public/team/{id}-poster.jpg`. `AboutSection` maps the list into a two-column grid, so a third person wraps to a second row. No component changes.

## Components added, changed and removed

| File | Change |
|---|---|
| `src/components/team-avatar.tsx` | **New.** `TeamAvatar`: the disclosure button, the two-faced tile, the turn, the caption, the clip. A local `TurnIcon` (single use, so not extracted). |
| `src/lib/use-loop-video.ts` | **New.** `useLoopVideo(ref, { whileVisible })`: the hero's playback contract, extracted unchanged, plus an optional IntersectionObserver that plays only on screen. |
| `src/components/hero-loop.tsx` | The playback effect moved into `useLoopVideo` verbatim; `HeroLoop` now calls `useLoopVideo(videoRef)`. Markup unchanged. Its doc block now points at the hook and no longer calls itself the only video. |
| `src/components/about-section.tsx` | Rewritten around the team row (layout below). |
| `src/content/copy.ts` | `ABOUT`: new `headline`, `intro`, `team`; body paragraphs 3 and 4; `portraitAlt` removed; doc block rewritten. Paragraphs 1 and 2 untouched. |
| `src/lib/types.ts` | `TeamMember`. |
| `public/team/` | **New:** `nate.mp4`, `nate-poster.jpg`, `julie.mp4`, `julie-poster.jpg`. |
| `public/placeholders/placeholder-about-01.jpg` | **Deleted.** |

**Layout.** Below `lg`, one column in Part B's order: headline and intro, the team row (capped at `max-w-lg`), then the story. From `lg`, `3fr / 2fr`: the story sits under the intro in the left column, and the team takes the right column, spanning both rows, centred against them and right-aligned, where the portrait sat. The section's single whisper `Parallax` moved from the portrait to the team row. Entrances keep the hero stagger: heading 0, intro 120ms, team 200ms, paragraphs 200 + i·80ms. Measured tile widths: **148px** at 360, **244px** at 768, **206px** at 1280, **244px** at 1920.

## Assets

| Path | Source | Bytes | Format | SHA-256 (first 12) |
|---|---|---|---|---|
| `public/team/nate.mp4` | `Nate-team-preview.mp4`, byte-identical | 8,603,504 | 1440×1440, 5.04s, H.264, video only, faststart, about 13.6 Mbps | `7e641cc45627` |
| `public/team/julie.mp4` | `Julie-team-preview.mp4`, byte-identical | 311,834 | 720×720, 10s, H.264, video only, faststart, about 0.25 Mbps | `c236e71e648b` |
| `public/team/nate-poster.jpg` | frame 0 of the clip, builder-cut | 55,733 | 720×720 JPEG (mozjpeg q82) | |
| `public/team/julie-poster.jpg` | frame 0 of the clip, builder-cut | 25,472 | 720×720 JPEG (mozjpeg q82) | |

Both clips are built to loop: the last frame differs from the first by a mean of 1.38 and 1.34 (of 255), the same as any two adjacent frames, so the native `loop` attribute is the whole mechanism (the #46 precedent). Frame 0 was drawn to a canvas in headless Chrome and resized with `sharp`, so each poster is exactly where its loop starts. Names follow Taxonomy §7 and §8 (`/public/team/{id}.*`, kebab-case); the delivered names are source names only.

## How the turn works

- **Structure.** The `<button>` is the perspective box (`perspective-distant`, 1200px). Inside it, a square `transform-3d` rotor holds two `backface-hidden` faces: the front (the clip, the bottom scrim, the turn mark) and the back (`rotate-y-180`, a `card` face with `BrandMark` at a third of its height).
- **Motion.** Open sets the rotor to `rotate-y-360`, close back to `rotate-y-0`, and a `transform` transition carries it: **700ms** on `--ease-out`, `motion-safe` only. So it turns forward on open and back on close, and at rest it is always face-on. Measured: computed `transition` is `transform … 0.7s cubic-bezier(0.16, 1, 0.3, 1)`; mid-turn the rotor reads `matrix3d(0.75, …, 0.66, …)`; paused at fixed points of the transition, the strip runs face → edge → mark → edge → face.
- **The caption** (name, then the mono title) is always rendered so its space is held: `invisible` while closed, so opening moves nothing (the About section's height measured identical before and after opening at all four widths). On open it rises in with the shared 200ms `rise-in` (not exempt), held 250ms by an inline delay so the name lands as the face comes back round.
- **Keyboard and screen readers.** A native `<button type="button">` with `aria-expanded` and `aria-controls` pointing at the caption. Its accessible name comes from the front face (`role="img"`, `aria-label` = the person's `alt`). The accessibility tree reads `button "Nate, Founder of NextSketch" expanded=false` and `button "Julie, Client Partner at NextSketch"`. The hidden caption is out of the tree until opened. The focus ring is the site's (`outline-2 outline-offset-2 outline-ring`) on the tile's `rounded-xl`.
- **Reduced motion.** The base-layer block zeroes every transition, and the turn is `motion-safe` besides, so a press shows the caption at once with no turn (measured 16ms after a click: `transitionDuration: 0s`, rotor at identity, caption visible at opacity 1, no running animation in About). `useLoopVideo` never calls `play()` (zero calls, hero included); the posters stay, and with `preload="none"` nothing of the clips downloads.
- **No JS.** The caption is hidden only after hydration (`useMounted`, the `ScrollReveal` contract), so the server HTML shows every name and title, renders no `aria-expanded`, and leaves the button inert. The posters show.
- **Playback.** `useLoopVideo(videoRef, { whileVisible: true })`: an IntersectionObserver plays each clip as it comes on screen and pauses it as it leaves (measured: both paused after scrolling back to the top). Everything else is the hero's contract: `play()` from an effect, never `autoPlay`; a refused `play()` is caught, so the poster stays; a clip the browser paused while the page was hidden restarts when it is visible again; a mid-session flip to reduced motion pauses and re-arms the poster.

## Where coral is used

Only the headline's payoff phrase "On purpose", as before, and the brand mark's lead on the back face, which is the logo's own coral (#49; UX spec §Accent rules allows the lead wherever the mark is drawn). The caption, the turn mark, the hover and the focus ring carry none. The coral glow behind each person is in the delivered footage.

## Builder calls (each comes back to Nate)

1. **The avatars are video, which narrows #46's one-video rule** (recorded in #63): the hero loop stays the only video that plays from load and the only footage behind text; the avatars are the only other clips. The alternative, a still per person, would mean asking for stills.
2. **The two posters are builder-cut** from frame 0 of each clip at 720×720. Recommendation: keep them, or send stills to replace them under the same names.
3. **Nate's clip weight.** At about 13.6 Mbps it is roughly 55 times Julie's bitrate for the same on-screen size. It ships as delivered, but it downloads only once About is on screen (measured: at load only the two posters are fetched, 56 KB and 26 KB; once the row is on screen, 312 KB for Julie and 8.6 MB for Nate). **Recommendation:** a re-export at 720×720 near Julie's bitrate (she plays at that size without visible loss), dropped in at the same path. Nothing in code changes.
4. **Toggle, not one-way.** A second press turns the avatar back and hides the caption, as the card flips back. The alternative is a caption that stays once shown.
5. **Names wait for the turn**, as the brief reads; a visitor who never clicks sees faces without names. The accessible names always carry them, and no-JS visitors see them.
6. **The turn hint is an icon only:** two chasing arcs in the tile's corner, the card's "↻" without its "Tap" label, because the label would be copy Part B does not carry. Measured against the tile behind it: 4.49:1 and 5.43:1, above the 3:1 floor for marks.
7. **The back face carries the brand mark**, after the card's logo back. Without a back face the tile would vanish for half the turn, or show a mirrored face. A plain `card` back is the quieter alternative.
8. **Tempo:** 700ms (the card's flip) and a 250ms caption hold, on the site's one easing, `--ease-out`, rather than the card's own curve (the one-easing rule). Both are in #64.
9. **The two-column split moved from `md` to `lg`.** At 768 the right column is 256px, which leaves two avatars about 116px wide. Below `lg` the order is Part B's: intro, team, story.
10. **#64 is its own row.** The brief named only #63; its motion guardrail asks for the exemption to be recorded, and #62 is the precedent for a motion exemption standing as its own row.
11. **The intro may close an open item.** "You work with the same people from the first call to launch, and after" carries the "we stay" promise #20 left unplaced. It is left open in the log for Nate to close.

## Deviations from the brief

- **One more decision row than listed** (#64, call 10).
- **Docs beyond the Spec Updates list:** `02-prd.md` F7 (it still said "about me", solo), `07-technical-spec.md` (the tree named the portrait placeholder) and `00-project-setup.md` (the motion exemption list). The decision log's numbering preamble and its open items were updated as every unit does. Rows #46 and #20 were not annotated, because the log is append-only for this unit; #63 says what it narrows.
- **`HeroLoop` was touched** to share its playback rather than fork it ("Reuse before you build"). The hero is unchanged: pixel-identical at all four widths under reduced motion, with one `play()` call at load with motion on and none under reduced motion.

## Verification

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm run build` | clean, six routes, `/` static |
| `npm run banned-terms` | clean (57 files); the `ALLOWED` entry matches exactly once |
| About at 360, 768, 1280, 1920 | both avatars render, tiles 148 / 244 / 206 / 244px; screenshots at rest, mid-turn and open, with motion and reduced |
| Click, Enter, Space | click opens; Enter opens, Space closes, Tab moves to the next avatar, Space opens it (dispatched key events, headless Chrome) |
| Screen reader names | accessibility tree: two buttons named by the `alt` lines, with `expanded` state; captions enter the tree only when open |
| Reduced motion | no turn, caption instant, zero `play()` calls, posters only |
| No JS | every name and title in the HTML, no `invisible`, no `aria-expanded` |
| Nothing else on `/` changed | hero, proof band, Work, Why, Services, Process and footer identical to `main` at all four widths (Work at 1280 and 1920 within the known 1/255 dither, fingerprint equal). Final CTA's pixels differ only because About's new height moves it by a fractional pixel, which re-snaps text antialiasing; its layout fingerprint is equal at every width |
| Other routes | `/pricing`, both service routes and the 404: rendered text and every class attribute identical to `main` |
| Console | only the known local noise (`/_vercel/insights/script.js` 404, the Apollo pixel 400) |

**Not verified:** Safari and iOS (headless Chrome only). WebKit has a history of video layers ignoring `backface-visibility`, which would show the clip, mirrored, through the back face mid-turn. Worth one look on an iPhone before merge.

## Out of scope, noted

- `src/content/email.ts`: the lead auto-replies promise a reply "from the person who'd actually do the work", signed by Nathan. They are not on the page, but they lean solo. Other copy is out of this unit.
- Build-note 34's F13 has two items outside About (`transition-[translate]` against `transition-transform`, the legacy `bg-gradient-to-t` name). The avatars reuse the portrait's scrim class as it was.
