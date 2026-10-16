# Build Note 38: About becomes the team (adhoc)

**Date:** 2026-10-15 · **Branch:** `adhoc/about-team` · **Base:** `main` @ `4ed9db0` (Brief 2 merged as PR #45)
**Status:** COMPLETE, committed on the branch, no PR (Nate opens it). About is the team: the text first, then Nate and Julie as two large, centred, two-sided cards (side by side on desktop, stacked on tablets and phones), each with its name and title always beneath it; a click, Enter or Space flips a card to a line on who the person is. The section introduces no one. The team is a list in content; the portrait is retired; nothing else on the page moved. All four gates green.
**Follows:** build-note 37. **Decisions:** **#63** and **#64** appended, each amended the same day at Nate's direction before merge; **#20** carries a retirement note. Next free row **#65**, next build note **39**.
**Brief:** "Adhoc Unit: About becomes the team" (Nate, 2026-10-15; Brief 3 of 3), with two avatar clips from Nate's marketing assets folder, then Nate's in-session follow-ups (below). Interaction reference: the owner's digital card (natedigitalcard.vercel.app).

---

## Pre-flight

**Gaps found before building:**

1. **`claude/site-content-running-notes.md` §5 and §6i**, which the brief cites for the owner call, are in neither the repo nor the reference folder (the gap build-notes 36 and 37 recorded). Built from the brief and Nate's session direction.
2. **The avatars arrived as video, not stills:** `Nate-team-preview.mp4` and `Julie-team-preview.mp4`. Two consequences. **#46's one-video rule** ("the site carries exactly one video", Taxonomy §7) cannot hold as written, so #63 narrows it (builder call 1). **No poster was delivered**, and reduced-motion and no-JS visitors need a still, so the builder cut one from each file (builder call 2).
3. **Nate's clip is heavy:** 8.6 MB for a card that renders at most 436px wide (builder call 3).
4. **The digital card was studied for its interaction only.** Nothing from it ships: no asset, no code, no copy. (In session Nate asked that the attached files be used, not the card; they are the only media in this unit.) What it showed: a two-faced card that flips 180° about the vertical axis in 0.7s on an expo-out curve, a muted looping portrait clip on its front face, and a mono "↻ Tap" hint.
5. **The motion rules and the brief pull apart.** #47 caps every transition at 200ms and says state is shown by colour, never by a transform. A flip at a readable speed is both a transform and longer than 200ms. The brief allows it if recorded as an exemption, so it is (#64).

**Before-captures** (`main` @ `4ed9db0`, `next start`, headless Chrome, reduced motion so every frame is still): `/` full page plus every section and the footer at 360, 768, 1280 and 1920, with a layout fingerprint per section (every descendant's box and paint properties). Kept outside the repo.

## Owner follow-ups (2026-10-15, in session, before merge)

The first cut put the team in the right-hand column from `lg`, kept Nathan's biography as body paragraphs 1 and 2, and turned each avatar a full revolution (back face: the brand mark) to reveal the name and title beneath. Nate then asked for:

1. **The text above the avatars, and the avatars inline with each other.** Built as one column at every width: headline, intro, two body paragraphs, then the two cards side by side.
2. **No text about Nate:** "It should not introduce and speak about me directly." Of the section's five paragraphs, the first (the intro), fourth and fifth stay as they were; the second and third (Nathan's biography) are removed.
3. **The flip carries the description:** clicking flips the card to a back face saying who the person is, brief enough to fit the card. Julie's from her LinkedIn profile.
4. **Nate's title is "Founder / Lead Architect".** Julie's stays "Client Partner".
5. **Then: the titles always there.** The name and title under each card are always visible, no longer revealed by the click; the click only flips the card.
6. **The avatars larger and centred.** The row is centred in the section and capped at `max-w-4xl`, so the cards grow from 276px to 436px at desktop widths (340px at 768); on a phone they already fill the column, two side by side, at 148px. The text keeps its left alignment.
7. **Then: longer descriptions** "to fill the back of the card when flipped". Built as two lengths per person, because the phone card (148px) holds about 100 characters at a readable size: `bio` (about 250 characters) fills every card 276px or wider, and the original line stays as `bioShort` on phones. (Retired by 8.)
8. **Then, before the push: stack on tablets and phones** ("the avatars just get small... that needs to be corrected"). Below 1024px the cards stack, one per row, up to 448px; from 1024px they sit side by side as before. With no card under 272px any more, the phone-only `bioShort` retired the same session, and the back's type now follows the card's own width (a container query) rather than the screen's.
9. **Descriptions approved.** Nate approved both `bio` lines as drafted, before the push.

Consequences recorded as same-day amendments on #63 and #64 (the two-offerings unit's precedent for pre-merge follow-ups), plus a retirement note on #20:

- **The #20 biography exemption retires.** Its sanctioned phrase lived in the removed paragraph, so the gate's ratification pass would have failed it as stale. `ALLOWED` in `scripts/check-banned-terms.mjs` is now empty (the mechanism and its shape stay documented for a future entry); §3.4 of `05-business-rules.md` is amended to say so. Proven: with the list empty, the old phrase appended to `src/content/copy.ts` fails the gate (`BANNED TERM "industrial design" in src\content\copy.ts`), and the clean tree passes.
- **Julie's profile** blocked the built-in browser (sign-in wall) and a direct fetch (HTTP 999), so at Nate's direction it was read in his own Chrome, read only: headline, current role and experience. Nothing was clicked or changed there, and the tab was closed.

## What shipped

- **About is the team.** Headline "A small, senior-led team. On purpose." (coral on "On purpose", unchanged), the intro, the two "we" paragraphs, then the team row. The slot (05, after Process), `#about`, the nav label "About" and the eyebrow "Who you work with" are unchanged. No line in the section introduces a person or implies one person.
- **Each card flips** a half turn on click, Enter or Space to its back, which carries the person's `bio`; a second press flips it back. Each person's name and title are always shown beneath their card.
- **The clips loop** muted while the row is on screen, and pause when it leaves.
- **The team is a list in content**, so adding a person is a content edit (closes build-note 34's F13 for About: the portrait path is gone and the clip and poster paths live in content beside the person).
- **The portrait retires:** `public/placeholders/placeholder-about-01.jpg` is deleted (nothing else used it), with `ABOUT.portraitAlt`. `public/placeholders/` stays, holding only its `.gitkeep`, as the Taxonomy §7 convention's home.

## The team-list shape

`ABOUT.team` in `src/content/copy.ts`, checked against `TeamMember` (`src/lib/types.ts`) with `satisfies`, every field required:

```ts
{
  id: "julie",                      // kebab-case; names the files below
  name: "Julie",                    // always shown beneath the card, with the title
  title: "Client Partner",
  alt: "Julie, Client Partner at NextSketch", // the card's accessible name
  bio: "Comes from digital product management, customer innovation and experience design, shaping roadmaps and the experiences people actually use. A co-founder herself, she is your partner from the first call to launch, keeping the work clear and moving.",
  video: "/team/julie.mp4",         // the delivered clip, byte-identical
  poster: "/team/julie-poster.jpg", // its first frame
}
```

**To add a person:** append a row in the order the row should show them, keep the `bio` near 250 characters, and add `/public/team/{id}.mp4` and `/public/team/{id}-poster.jpg`. `AboutSection` maps the list into a two-column grid, so a third person wraps to a second row. No component changes.

**The copy now in the section** (`ABOUT`): `headline`, `intro`, and `body` = Part B's third and fourth paragraphs, verbatim. **The four card descriptions are approved by Nate as drafted** (2026-10-15). **Still a builder DRAFT:** Nate's `alt` (below).

| Person | Title (owner) | `alt` | `bio` |
|---|---|---|---|
| Nate | Founder / Lead Architect | Nate, Founder and Lead Architect of NextSketch (DRAFT: "and" reads aloud cleanly where "/" does not) | Trained in physical product design, where everything had to survive tooling, cost and a real person's hands. Then digital, then agents. Now architects the agentic systems and products we build, held to the same bar: it ships and someone uses it. (approved, 245 characters, from his 2026-08-24 biography) |
| Julie | Client Partner | Julie, Client Partner at NextSketch (Part B) | Comes from digital product management, customer innovation and experience design, shaping roadmaps and the experiences people actually use. A co-founder herself, she is your partner from the first call to launch, keeping the work clear and moving. (approved, 247 characters, from her LinkedIn experience: Digital Product Manager, Customer Innovation Manager with product roadmapping, Experience Design Manager, and a co-founder of her own venture) |

Julie's employer and her venture are deliberately not named on the site: she works there now, and naming it on NextSketch's page could read as an affiliation. Nate's line avoids the retired-brand terms §3.4 bans by name, and says where he trained, not what NextSketch sells.

## Components added, changed and removed

| File | Change |
|---|---|
| `src/components/team-avatar.tsx` | **New.** `TeamAvatar`: the disclosure button, the two-faced card, the flip, the caption, the clip. A local `TurnIcon` (the flip mark; single use, so not extracted). |
| `src/lib/use-loop-video.ts` | **New.** `useLoopVideo(ref, { whileVisible })`: the hero's playback contract, extracted unchanged, plus an optional IntersectionObserver that plays only on screen. |
| `src/components/hero-loop.tsx` | The playback effect moved into `useLoopVideo` verbatim; `HeroLoop` now calls `useLoopVideo(videoRef)`. Markup unchanged. Its doc block now points at the hook and no longer calls itself the only video. |
| `src/components/about-section.tsx` | Rewritten: one column, text first, the team row beneath. |
| `src/content/copy.ts` | `ABOUT`: new `headline`, `intro`, `team`; `body` is Part B's paragraphs 3 and 4; the biography paragraphs and `portraitAlt` removed; doc block rewritten. |
| `src/lib/types.ts` | `TeamMember` (with `bio`). |
| `scripts/check-banned-terms.mjs` | `ALLOWED` emptied; its doc block records why and keeps the entry shape. |
| `public/team/` | **New:** `nate.mp4`, `nate-poster.jpg`, `julie.mp4`, `julie-poster.jpg`. |
| `public/placeholders/placeholder-about-01.jpg` | **Deleted.** |

**Layout.** One column, in reading order: the heading, then the intro and both paragraphs (`max-w-prose`, `space-y-6`), then the team row `mt-12 → md:mt-16` beneath, centred in the section. **From `lg:` the two cards sit side by side** (the row capped at `max-w-4xl`, gap 6); **below `lg:` they stack**, one per row (the column capped at `max-w-md`, gap 10 to clear each caption). The section's single whisper `Parallax` moved from the portrait to the team row. Entrances keep the hero stagger: heading 0, paragraphs 120 + i·80ms, team 200ms. Measured card widths: **272px** at 320, **312px** at 360, **342px** at 390, **382px** at 430, **448px** from 512 to 1023 (stacked), **436px** from 1024 (side by side); the row's centre on the section's centre at every width.

## Assets

| Path | Source | Bytes | Format | SHA-256 (first 12) |
|---|---|---|---|---|
| `public/team/nate.mp4` | `Nate-team-preview.mp4`, byte-identical | 8,603,504 | 1440×1440, 5.04s, H.264, video only, faststart, about 13.6 Mbps | `7e641cc45627` |
| `public/team/julie.mp4` | `Julie-team-preview.mp4`, byte-identical | 311,834 | 720×720, 10s, H.264, video only, faststart, about 0.25 Mbps | `c236e71e648b` |
| `public/team/nate-poster.jpg` | frame 0 of the clip, builder-cut | 55,733 | 720×720 JPEG (mozjpeg q82) | |
| `public/team/julie-poster.jpg` | frame 0 of the clip, builder-cut | 25,472 | 720×720 JPEG (mozjpeg q82) | |

Both clips are built to loop: the last frame differs from the first by a mean of 1.38 and 1.34 (of 255), the same as any two adjacent frames, so the native `loop` attribute is the whole mechanism (the #46 precedent). Frame 0 was drawn to a canvas in headless Chrome and resized with `sharp`, so each poster is exactly where its loop starts. Names follow Taxonomy §7 and §8 (`/public/team/{id}.*`, kebab-case); the delivered names are source names only.

## How the flip works

- **Structure.** The `<button>` is the perspective box (`perspective-distant`, 1200px). Inside it, a square `transform-3d` rotor holds two `backface-hidden` faces: the front (the clip, the bottom scrim, the flip mark) and the back (`rotate-y-180`, a `card` face with the `bio` and the same flip mark).
- **Motion.** Open sets the rotor to `rotate-y-180`, close back to `rotate-y-0`, and a `transform` transition carries it: **700ms** on `--ease-out`, `motion-safe` only. Measured: computed `transition` is `transform … 0.7s cubic-bezier(0.16, 1, 0.3, 1)`; settled open, the rotor reads `matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, …)`; paused at fixed points of the transition, the frames run face → edge → back, readable once settled.
- **The back.** The `bio` in Inter `foreground`, written to fill it, vertically centred, padded clear of the flip mark. **Its type follows the card's own width** through a container query (the card's root is an `@container`, the diagrams' pattern): `text-sm leading-relaxed` under 18rem, `text-base` from `@2xs`, `text-lg` from `@xs`, `text-2xl` at `leading-normal` from `@sm` (24rem), where the padding opens from `px-5 pt-5 pb-10` to `px-8 pt-8 pb-12`. **Measured fit** (12 widths, 320 to 1920): 8 lines at 14px on the 272px card (86% of the room), 8 at 16px on 312px (83%), 8 at 18px on 342px (83%), 7 at 18px on 382px (64%), 8 and 9 at 24px on the 448px stacked card (78% and 88%) and on the 436px desktop card (81% and 91%). Nothing overflows or touches the mark at any width.
- **The caption** (name, then the mono title) is plain server-rendered text under the card, always visible and outside the button, so flipping moves nothing (About's height measured identical before and after flipping at all four widths).
- **Keyboard and screen readers.** A native toggle `<button type="button">`, as the digital card's flip is, with `aria-label` (the `alt`), `aria-describedby` (the `bio` on the back) and `aria-pressed` (which way it faces). The accessibility tree reads `button "Nate, Founder and Lead Architect of NextSketch"`, described by the `bio` ("Trained in physical product design, where everything had to survive tooling…"), with its pressed state; Julie's likewise. A button's contents are presentational, so nothing inside it is read twice. The focus ring is the site's (`outline-2 outline-offset-2 outline-ring`) on the card's `rounded-xl`.
- **Reduced motion.** The base-layer block zeroes every transition, and the flip is `motion-safe` besides, so a press shows the back at once (measured 16ms after a click: `transitionDuration: 0s`, rotor at 180°, no running animation in About). `useLoopVideo` never calls `play()` (zero calls, hero included); the posters stay, and with `preload="none"` nothing of the clips downloads.
- **No JS.** The server HTML shows every name and title, renders no `aria-pressed` (set only after hydration, `useMounted`), and leaves the button inert. The posters show. A no-JS visitor cannot flip a card, so sees no `bio` (it is in the HTML, on the hidden back face).
- **Playback.** `useLoopVideo(videoRef, { whileVisible: true })`: an IntersectionObserver plays each clip as it comes on screen and pauses it as it leaves (measured: both paused after scrolling back to the top). Everything else is the hero's contract: `play()` from an effect, never `autoPlay`; a refused `play()` is caught, so the poster stays; a clip the browser paused while the page was hidden restarts when it is visible again; a mid-session flip to reduced motion pauses and re-arms the poster. The clip keeps playing while its card shows the back (the digital card pauses it; here the front is simply out of view).

## Where coral is used

Only the headline's payoff phrase "On purpose", as before. The cards, the caption, the flip mark, the hover and the focus ring carry none. (The first cut's brand mark on the back face, and its coral lead, retired with the follow-ups.) The coral glow behind each person is in the delivered footage.

## Builder calls (each comes back to Nate)

1. **The avatars are video, which narrows #46's one-video rule** (recorded in #63): the hero loop stays the only video that plays from load and the only footage behind text; the avatars are the only other clips. The alternative, a still per person, would mean asking for stills.
2. **The two posters are builder-cut** from frame 0 of each clip at 720×720. Keep them, or send stills to replace them under the same names.
3. **Clip weight and size.** Julie's clip is 720px square, so on a 2x screen the 448px tablet card and the 436px desktop card show it slightly upscaled; a 1080px export would be sharp there. **Nate's clip weight:** At about 13.6 Mbps it is roughly 55 times Julie's bitrate for the same on-screen size. It ships as delivered, and downloads only once About is on screen (measured: at load only the two posters are fetched, 56 KB and 26 KB; once the row is on screen, 312 KB for Julie and 8.6 MB for Nate). **Recommendation:** a re-export at 720×720 near Julie's bitrate, dropped in at the same path. Nothing in code changes.
4. **Nate's `alt`** is a DRAFT (table above): "and" in place of the title's "/" so it reads aloud cleanly. The four descriptions were approved by Nate as drafted on 2026-10-15.
5. **Toggle, not one-way.** A second press flips the card back, as the digital card flips back.
6. **The flip hint is an icon only:** two chasing arcs in each face's corner, the card's "↻" without its "Tap" label, because the label would be copy no one has written. Measured on the front against the tile behind it: 4.49:1 and 5.43:1, above the 3:1 floor for marks.
7. **Tempo:** 700ms (the card's flip) on the site's one easing, `--ease-out`, rather than the card's own curve (the one-easing rule). In #64.
8. **#64 is its own row.** The brief named only #63; its motion guardrail asks for the exemption to be recorded, and #62 is the precedent for a motion exemption standing as its own row.
9. **The intro may close an open item.** "You work with the same people from the first call to launch, and after" carries the "we stay" promise #20 left unplaced. It stays open in the log for Nate to close.

## Deviations from the brief

- **The follow-ups above override the brief** where they meet it: Part B's paragraphs 1 and 2 are gone, so outcome 5 ("the biography exemption still holds") is reversed by the owner, and the reveal is a flip to a back face rather than a turn.
- **One more decision row than listed** (#64, call 8).
- **Docs beyond the Spec Updates list:** `02-prd.md` F7 (it still said "about me", solo), `07-technical-spec.md` (the tree named the portrait placeholder) and `00-project-setup.md` (the motion exemption list). §3.4 of `05-business-rules.md` changed because the exemption did. The decision log's numbering preamble and its open items were updated as every unit does; #20 carries a retirement note in place, the log's convention for a superseded row. #46 was not annotated; #63 says what it narrows.
- **`HeroLoop` was touched** to share its playback rather than fork it ("Reuse before you build"). The hero is unchanged: pixel-identical at all four widths under reduced motion, with one `play()` call at load with motion on and none under reduced motion.

## Verification

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm run build` | clean, six routes, `/` static |
| `npm run banned-terms` | clean (57 files) with `ALLOWED` empty; the retired phrase fails when planted |
| About at 320 to 1920 | text first; the cards stacked below 1024 and side by side from it, centred at every width; cards 272 / 312 / 342 / 382 / 448 / 436px; names and titles visible at rest and flipped; screenshots at rest and flipped, with motion and reduced |
| Card backs | at 12 widths from 320 to 1920 the `bio` fits inside its padding, clear of the flip mark, filling 64 to 91% of the room |
| Click, Enter, Space | click flips; Enter and Space each toggle; Tab moves to the next card (dispatched key events, headless Chrome) |
| Screen reader | accessibility tree: two buttons named by the `alt` lines, described by the `bio` lines, with `pressed` state; the names and titles are plain text beside them |
| Reduced motion | no flip, the back instant, zero `play()` calls, posters only |
| No JS | every name and title in the HTML and visible, no `aria-pressed`; no flip, so no `bio` on screen |
| Nothing else on `/` changed | hero, proof band, Work, Why, Services, Process and footer identical to `main` at all four widths (Work at 1920 within the known 1/255 dither, fingerprint equal). Final CTA's pixels differ at 360, 1280 and 1920 only because About's new height moves it by a fractional pixel, which re-snaps text antialiasing; its layout fingerprint is equal at every width, and at 768 it is pixel-identical |
| Other routes | `/pricing`, both service routes and the 404: rendered text and every class attribute identical to `main` (first cut; the follow-ups touched only About, `copy.ts`'s `ABOUT` and the gate) |
| Console | only the known local noise (`/_vercel/insights/script.js` 404, the Apollo pixel 400) |

**Not verified:** Safari and iOS (headless Chrome only). WebKit has a history of video layers ignoring `backface-visibility`, which would show the clip, mirrored, through the back face while a card rests flipped. Worth one look on an iPhone before merge; if it shows, pausing and hiding the clip while flipped is the fix.

## Out of scope, noted

- `src/content/email.ts`: the lead auto-replies promise a reply "from the person who'd actually do the work", signed by Nathan. They are not on the page, but they lean solo. Other copy is out of this unit.
- Build-note 34's F13 has two items outside About (`transition-[translate]` against `transition-transform`, the legacy `bg-gradient-to-t` name). The cards reuse the portrait's scrim class as it was.
