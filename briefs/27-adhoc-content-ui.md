# Adhoc 27 — Content & UI Updates + the Stagger Fix

**Owner (build):** AI coding agent, working adhoc
**Owner (decisions):** Nate
**Base:** `main` @ `e404a9c` (PR #34, unit 26 merged)
**Mode:** **Adhoc.** One item is specified below and is the only thing pre-decided. Everything else in this unit comes from Nate in session. Do not infer scope from the open items in build-note 26 and start working on them unbriefed.

---

## The hard stop

**After the specified work below is done, stop and come back to Nate.** Report what changed, show him the timing difference, and wait for his instruction. Do not continue into the content or UI updates until he gives them, and do not treat "it obviously needs X next" as an instruction.

---

## Before touching anything

Clean working tree. Confirm `main` is at `e404a9c` or later. Read `briefs/build-notes/26-service-routes.md` first — it is long, and the section titled "The illustration assembles on load" is where the bug below is diagnosed in full.

## Reuse, do not rebuild

Everything this unit needs already exists. If you find yourself creating a component, a keyframe, or a utility, stop and ask.

---

## Specified work — the entrance stagger on `/` and `/pricing`

### The problem

The site's load-time entrance animation is supposed to step in: heading, then intro, then the line under it, at 0 / 120 / 200ms. **It has never staggered on either page.** Everything lands at once.

The cause is documented in build-note 26 and was measured, not guessed: `motion-safe:animate-rise-in` compiles to the CSS `animation` **shorthand**, which resets `animation-delay` to `0s`, and the `motion-safe:` variant sorts *after* the plain `[animation-delay:…]` utility in the stylesheet. The utility loses every time. Every element using that pairing computes `0s`.

`ScrollReveal` is unaffected and always has been — it sets `animationDelay` inline, which is exactly the fix. The service routes were moved to the inline form in unit 26 and now compute 0.12s / 0.2s correctly.

The two pages still carrying the broken form were out of scope for unit 26 and were flagged rather than fixed. This unit fixes them.

### Where it is

Four elements across two files: `src/app/pricing/page.tsx` and `src/components/hero.tsx`. Grep `animation-delay` to confirm the set before you start — if it turns up more than four outside the service-page components, surface that rather than quietly widening the change.

### The outcome

1. **Every one of those elements actually delays.** Measured in the browser with `getComputedStyle`, not assumed from the source. The documented 0 / 120 / 200ms sequence is what computes.
2. **Reduced motion still suppresses it.** The `motion-safe:` gate is the thing that does that and it must survive the fix. Verify with reduced motion on — no entrance, no delay artifact, content visible at rest.
3. **Nothing else about the two pages moves.** Not the durations, not the easing, not the order, not the copy, not the layout. This is a fix to timing that was always specified and never worked.
4. **No new keyframe.** `globals.css` stays untouched, as it did in unit 26.

### Scope guardrails

- **Only those elements.** Do not sweep the codebase for other animation-shorthand collisions and fix them too. If you find one, name it and leave it.
- Do not touch `ScrollReveal` — it is already correct and is the pattern being copied.
- Do not touch the service routes. They were fixed in unit 26.
- Do not "improve" the timing values while you are in there. 0 / 120 / 200 is the documented sequence.

### Show your work

This changes what two shipped pages look like on load, and Nate has never seen them behave correctly. When you come back, give him:

- The computed delay for each of the four elements, before and after.
- A plain description of what he will now see on `/` and on `/pricing` that he did not see before.

---

## Everything else in this unit

**Nate's, in session.** Content and UI updates he will give you directly. Nothing is pre-decided and nothing should be started ahead of him.

The rules below hold for whatever he asks for.

## Rules that hold regardless

- **Root-relative hrefs, always.** `sectionHref` and `serviceBlockHref` exist for this. Never hand-write a hash.
- **No invented content (Rule 4.3).** Where there is no approved copy, render nothing. Draft what is missing, put it in the build notes, and stop.
- **Canonical copy is not yours to reword.** Messaging Kit §05 descriptions, `PROCESS.phases`, `FINAL_CTA` — editing any of these is an owner decision with a log row (Rule 4.1).
- **No em dashes in rendered strings** (#19). Doc blocks are exempt. Note that `PROCESS.phases` already carries two, inherited and flagged in build-note 26 — do not silently fix them either.
- **Rule 3.2 banned terms and Rule 3.1's exhaustive CTA set both bind.** No new CTA strings.
- **Gold is the emphasis accent, once per surface.** The chrome-colour carve-out from #31 is scoped to the inside of a mock and nowhere else. The per-service `accent` field stays dead data.
- **No new dependencies.** Zero, per build-note 23. Inline SVG, never `lucide-react`. Components flat in `src/components/`.
- **No new keyframes in `globals.css`** without raising it first.
- **One fade, one file.** Every graphic on the service routes imports `src/components/visual-fade.tsx`. Do not add a second local one.
- **No backend.** Decision #8: `POST /api/qualify` is the entire server-side footprint.
- **The wordmark handoff at 80px is load-bearing** and breaks silently. Any change to a page's top band gets probed at scrollY 0 / 78 / 82 / 300 against `/pricing`.

## Do not touch

Pricing content — prices, tier names, descriptions, notes, feature bullets. The modal, `PROJECT_TYPE_VALUES`, or the `/api/qualify` payload. The nav's six items and featured button (#22, #24, #26). Decision #19's scope.

## When it lands

- `npm run typecheck`, `npm run lint`, `npm run build`, `npm run banned-terms` all green.
- No console errors from the site. (The four Apollo/Vercel 400s on localhost are pre-existing and site-wide — unit 19.)
- No horizontal overflow at 375 / 1080 / 1800.
- Every link works *from* the page it is on, not just from `/`.
- Docs reconciled to whatever actually changed, and a decision row for any non-obvious call.
- Build note `briefs/build-notes/27-adhoc-content-ui.md`: the measured before/after delays, everything Nate directed in session, every judgment call, and anything owner-owed with a draft for it.

## Judgment calls

Anything ambiguous comes back to Nate with a recommendation. Do not silently resolve it. Do not expand scope because something adjacent looks broken — name it and leave it.

## References

- `briefs/build-notes/26-service-routes.md` — the bug's diagnosis, and the pattern for the fix
- `docs/decision-log.md` #8, #13, #14, #17, #19, #22–#32
- `docs/05-business-rules.md` §3.1, §3.2, §3.3, §4.1, §4.3
- `docs/04-ux-spec.md` — the design system, including §Orphaned colors as amended by #31
- `src/components/scroll-reveal.tsx` — the inline-delay pattern that already works
