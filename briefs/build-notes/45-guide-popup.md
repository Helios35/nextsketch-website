# Build Note 45: Free guide pop-up (adhoc)

**Date:** 2026-11-12 · **Branch:** `adhoc/guide-popup` · **Base:** `main` @ `5cf1ba5`
**Status:** COMPLETE, waiting on Nate's review. A small indigo card offers "The Small Business Guide to AI" for a name and an email after a scroll, on every page but `/pricing`, once per visitor. All four gates green. No PR: Nate opens it.
**Decision:** **#76**. Next free row **#77**, next build note **46**.
**Brief:** "Adhoc Unit: Free guide pop-up" (Nate, 2026-11-11 and 2026-11-12), with the guide PDF and `guide-cover-asha.png` attached.

---

## Pre-flight

- Clean tree on `main` @ `5cf1ba5`, branch cut from it.
- Traced `src/app/layout.tsx`, `qualification-modal.tsx`, `qualification-modal-provider.tsx`, `waitlist-band.tsx` (the closest existing second door), `src/app/api/qualify/route.ts`, `src/lib/{schema,qualify,lead-delivery,lead-format,lead-notify}.ts` and `scripts/inbound-leads.gs`.
- **The three things the brief asked for before code:**
  1. **Where the card mounts:** `GuideOffer` in `src/app/layout.tsx`, inside `QualificationModalProvider` (so it can read whether the form is open) and first in the document (so the first Tab on a page reaches it). It renders nothing until it is due.
  2. **How a guide lead reaches the Sheet, Nate's alert and the visitor:** a fourth payload kind, `kind: "guide"`, through the modal's own seam (`submitQualification` → `POST /api/qualify` → `deliverLead`): the Sheet row gates success, an Asana task is best-effort, and `after()` sends Nate's alert plus the guide email in place of the auto-reply.
  3. **Whether the Sheet or Apps Script has to change:** **no.** The script appends any body with the same twelve keys, and a guide lead is those twelve keys with new values (`lead_type: guide`, `signal: [Guide lead]`). Verified by running the repo's `scripts/inbound-leads.gs` in Node against an in-memory sheet (below). Nothing to bring back.
- **Before-screenshots:** `/`, both service routes and `/pricing` (the last one extra) at 360, 768, 1280 and 1920, full page, reduced motion, from a production build of `main` (`.claude/guide-popup-shots/before/`, gitignored).

## What shipped

- **The card** (`src/components/guide-offer.tsx`): the cover, "Free guide", the heading, the body, Name and Email side by side, "Download the guide", the small print and a × (named "Close"). The thank-you replaces the form; the failure line sits above the button.
- **The lead** (`kind: "guide"`): name (one field, 1 to 100 characters), email, the honeypot and the 3-second guard, re-validated by the same Zod union in the browser and on the server.
- **The emails:** Nate's alert under `[Guide lead] <name>`, and one email to the visitor, "Your copy of The Small Business Guide to AI", with a link to the PDF and no attachment. The visitor gets no auto-reply.
- **The download:** only after the server says the Sheet row is written (`ok: true`), saved as "The Small Business Guide to AI.pdf".
- **The files:** `public/guides/small-business-guide-to-ai.pdf` and `public/guides/small-business-guide-to-ai-cover.png`.
- **Tokens:** `guide` and `guide-foreground`, `shadow-guide`, `guide-in` (`globals.css`).
- **Docs:** `02` to `08`, row #76, this note.

## Where the card mounts, and how "once per visitor" works

- **Mount:** once, in the root layout, inside the modal provider, before the page. It is a client component and never renders on the server, so a visitor without JavaScript never sees it, and no page's server HTML changed apart from one empty `sr-only` live region.
- **When it shows:** once the visitor scrolls **half a viewport** down a page that is not `/pricing`. Never on load. Once it has shown, it follows the visitor to other routes (it does not wait for a second scroll), except `/pricing`, where it is always hidden.
- **When it hides without ending:** while the modal is open (it returns if the modal closes unsent), and while another form on the page is on screen (only the home waitlist band today), unless the visitor is typing in the card or it is showing an outcome. It stays mounted while hidden, so nothing typed is lost.
- **Once per visitor:** one `localStorage` key, `nextsketch:guide-offer`, set to `closed` (the × or Esc), `downloaded` (the guide was saved) or `form` (the modal's step 1 saved a lead). Any of the three keeps the card away on every page and every later visit in that browser. A failed save sets nothing, so the card can be tried again. If storage is blocked, a module variable holds the flag for the rest of the page's life. No cookie is set and nothing about the visitor is stored.
- **The form:** `qualification-modal.tsx` gains one line: a saved step 1 calls `markGuideOffer("form")`. Its rules, flow and look are unchanged.

## The lead kind and the signal label

| | Value |
|---|---|
| Payload | `kind: "guide"`, `name`, `email`, `_hp`, `_t` |
| `lead_type` | `guide` |
| Signal (Rule 2.5) | **`[Guide lead]`** |
| Sheet row | Captured At, `guide`, `[Guide lead]`, the name, the email; every other column empty, Lead ID included |
| Asana | a task `[Guide lead] <name>`, notes: captured, name, email, "Guide: The Small Business Guide to AI" |
| Alert subject | `[Guide lead] <name>` |

The label is not `[Lead — guide]` because new copy carries no em dash (#19). It still starts with a bracket and says "lead", and `lead_type: guide` sorts it in the Sheet either way. If you'd rather keep the `[Lead — …]` family, it is one string (`GUIDE_SIGNAL` in `lead-format.ts`).

## The Sheet, the script, and what Nate has to do

- **No Sheet or Apps Script change.** Proved against the real script: one row, `["…","guide","[Guide lead]","Jane Doe","jane@example.test","","","","","","",""]`.
- **Nothing to deploy outside the site.** The guide email goes through the same Resend setup as the auto-reply, so it reaches an outside address only once `LEAD_FROM_EMAIL` is a verified sender (the interim `onboarding@resend.dev` may only deliver to the account's own address). That is the same condition the auto-reply already has; if the modal's auto-reply reaches visitors today, so will this.

## The files

| Path | Bytes | What |
|---|---|---|
| `public/guides/small-business-guide-to-ai.pdf` | 5,325,535 | The delivered PDF, **byte-identical** (SHA-256 `b79d283d…a736ca14`), 13 pages. Its own title metadata is "The Small Business Guide to AI"; the character name appears nowhere in the file |
| `public/guides/small-business-guide-to-ai-cover.png` | 244,404 | The delivered cover (849,361 bytes, 1024px), **resized to 512px** with Lanczos, nothing else changed. `next/image` serves it to the card as WebP: 1,928 bytes at 1x, 8,436 at 2x and 3x |

- **Download name:** the card's download is an `<a download="The Small Business Guide to AI.pdf">`; the email's link opens the same file, which `next.config.ts` serves with `Content-Disposition: inline; filename="The Small Business Guide to AI.pdf"`, so saving it from the browser gives the same name. Measured: Chrome's download is named exactly that, and the bytes match.
- **The character name** is in no public path, no download name and no rendered string.
- **The cover on the card** is cropped to the book by its `5/7` frame (`object-cover`); the file is the whole square. It is decorative (`alt=""`): the heading beside it says what it is.

## Contrast, and which colour shipped

**Indigo shipped.** `guide` points at `chart-2` (`#698EDD`), the site's existing indigo; plum was not needed. Measured from the rendered card (computed colours on the flat fill), in the idle, hover, focus, failure and success states:

| Pair | Ratio | Floor |
|---|---|---|
| Every word on the card (eyebrow, heading, body, captions, small print, failure line and its link, thank-you): `#141414` on `#698EDD` | **5.71** | 4.5 |
| The × and every focus outline on the card: `#141414` on `#698EDD` | 5.71 | 3 |
| Field and button fill `#222222` against the card | 4.94 | 3 |
| Button fill on hover `#363636` against the card | 3.75 | 3 |
| Typed text and button label `#E8E3DA` on `#222222` | 12.45 | 4.5 |
| Button label on hover, on `#363636` | 9.46 | 4.5 |
| The × on its hover fill (`#6082C8`) | 4.85 | 3 |
| Cover frame's black edge against the card | 6.51 | 3 |
| *Avoided:* linen · the stone ring · `muted-foreground` · coral on indigo | 2.52 · 2.06 · 1.07 · 1.07 | fail |
| *Fallback, not used:* `#141414` on plum `#B077C2` | 5.49 | |

So the card re-points two tokens for itself: `--ring` and `--muted-foreground` become `guide-foreground`. That keeps the shared caption and `INPUT_CLASS` as they are (no fork) and makes every focus outline on the card dark. It is the one place the site's focus colour is not the stone ring, recorded in the UX spec. Coral is not on the card; the failure line's link is underlined dark text.

## Every DRAFT line

Part B ships word for word, except:

1. **The email's sign-off: "Nate, NextSketch"** (Part B: "Nate, Next Sketch"). The brand is one word in all copy (Rule 3.3, Taxonomy §8); "Next Sketch" is the legal line only. The guide's own cover says "A Next Sketch guide", which this unit doesn't touch.
2. **The greeting uses the first word of the name** ("Hi Jane," for "Jane Doe"). Part B wrote `Hi {name}`; the card asks one Name field, and the modal's auto-reply greets a first name. It also keeps a stranger's full input out of an email we send.
3. **The alert's "Guide" label** ("Guide: The Small Business Guide to AI"), the one new line in Nate's alert.
4. **The signal label `[Guide lead]`** (above).
5. **Formatting only:** the email body is split into paragraphs at its sentences (greeting and link, the checklist, the reply line, the sign-off). The plain-text version writes the link as "Download the guide (https://…)." The live region says "Free guide. The Small Business Guide to AI", the eyebrow and heading joined.

## Builder calls (yes or change)

1. **An Asana task per guide lead.** "Saved like any other lead", and leads get a task. Fifty guide leads would be fifty tasks; if that's noise, it's one line (`lead-delivery.ts`), the way the waitlist skips Asana.
2. **The trigger is half a viewport of scroll** (about 370px on a phone, 450px at 1280×900).
3. **Once shown, it follows the visitor across routes** instead of waiting for a new scroll on each page.
4. **It steps aside while the waitlist band's form is on screen.** The brief asked that it cover no form. On a phone a 349px card would otherwise sit over the band's field as it scrolled past.
5. **Sending the modal's step 1 ends the card for good**, not only for that visit.
6. **Esc closes it when focus is in the card or nowhere**, never while the nav menu or another control has focus, so closing the menu with Esc doesn't also dismiss the offer for good.
7. **First in the document,** so the first Tab after it appears lands on its ×, then Name, Email and the button. It never takes focus by itself.
8. **The thank-you stays until closed** (no auto-dismiss: timed content is an accessibility problem). If the browser blocks the download, the email's link is the fallback; the card adds no second link because Part B has none.
9. **The PDF is public at its URL.** The card is the ask, not a lock: anyone with the link can open it. It is served `noindex` so search engines don't hand it out. Real gating (a signed link) would need server work the brief didn't ask for.
10. **The email's link uses the host the visitor submitted from** (`new URL(request.url).origin`), so it is right on any domain the site is served on without a new env var.
11. **The 404 never shows the card,** because the page doesn't scroll.
12. **Phone footprint:** 336×349px at 360×740, 44% of the screen (400px with the failure line, 221px for the thank-you). It never reaches the nav bar (its top is 379px; the bar ends at 69px) and is capped below the bar on short screens. A smaller phone version (for example, fields hidden until the visitor taps the button) would cut it to about 170px, but it would no longer show the fields up front as the brief describes. Your call if 44% is too much.

## Deviations from the brief

- The sign-off and the greeting (DRAFT 1 and 2).
- The card steps aside for other forms on screen (call 4), beyond "never opens on top of the form".
- The focus outline on the card is dark, not the site's one ring colour (needed for 3:1 on indigo).
- The before-screenshots include `/pricing` as well.

## Verification (builder)

Run against a production build (`next start`) with two local stand-ins instead of Google and Resend: the repo's own `scripts/inbound-leads.gs` run in Node against an in-memory sheet as `LEADS_SHEET_WEBHOOK_URL`, and a recorder for Resend (`RESEND_BASE_URL`). Asana was unset locally, so the task was not exercised live (its notes are built by the same pure function the Sheet row uses). Headless Chrome over CDP.

| Check | Result |
|---|---|
| Every page but `/pricing` at 360, 768, 1280, 1920: not on load, appears after a scroll | Pass. First seen at the trigger on `/`, `/services/product`, `/services/agentic-system` at all four widths |
| Covers no nav or form, scrolling the whole page in 120px steps | Pass at every width on all three routes (the card steps aside for the waitlist band, and returns after the band's form is gone) |
| `/pricing` | Never mounts, at all four widths |
| Close, reload | Stays gone (`closed`) |
| Download, reload | Stays gone (`downloaded`) |
| Name and email, submit | One Sheet row through the real script, marked `guide` / `[Guide lead]`; Nate's alert `[Guide lead] Jane Doe`; exactly one email to the visitor with a working link (200, inline, clean name, same bytes, `noindex`); Chrome saved "The Small Business Guide to AI.pdf", byte-identical |
| Forced capture failure (webhook 500) | No download; name and email kept in the fields; the Part B failure line with a mailto carrying both; no row, no email; not marked done; a retry after recovery saves one row |
| Spam guards | A sub-3s submit and a filled honeypot are refused in the card with nothing sent; direct POSTs with a honeypot, `_t` 1200, no name or a bad email are all 400 and reach nothing |
| The form | Still refuses step 1 with no offer ("Pick at least one."); the product route's CTA still preselects `new_product`; the card hides while the modal is open and returns if it closes unsent; a saved step 1 writes `[Lead — quick]` as before, sends the usual auto-reply and alert, and ends the card |
| Reduced motion | No animation (`animation-name: none`); the card simply appears |
| Full motion | `guide-in`, 200ms, from the bottom edge: slides up 24px and grows from 96% |
| Keyboard | Appearing does not move focus; the first four Tabs reach ×, Name, Email, Download; focus outlines dark on the card; Esc closes from inside and with nothing focused, not from the nav menu |
| Screen reader (Chrome accessibility tree) | A `complementary` landmark named "The Small Business Guide to AI"; fields named by their labels (reported as "NAME" and "EMAIL", the uppercase caption, as the modal's are); buttons "Close" and "Download the guide"; the live region announces it; the thank-you takes focus as a `status` |
| Contrast | Table above: every text and mark passes in every state |
| Nothing else moves | All 16 full-page screenshots (`/`, both service routes, `/pricing` × 4 widths) of the branch with the card hidden are **pixel-identical** to `main` |
| Cover at a phone's pixel ratio | Sharp at 390px and 3x (served at 256px) |
| Gates | `npm run lint`, `npm run typecheck`, `npm run build`, `npm run banned-terms` (59 files) all green |
| Copy | No em or en dash in any new copy line; no banned term |

**Not verified here:** the live Google Sheet, Asana and Resend (stand-ins above); a real phone's keyboard pushing the card (iOS Safari); a real screen reader (VoiceOver/NVDA) beyond Chrome's accessibility tree.

## Files

- **New:** `src/components/guide-offer.tsx`, `src/content/guide.ts`, `src/lib/guide-offer.ts`, `public/guides/` (two files), this note.
- **Changed:** `src/app/layout.tsx` (mount), `src/app/globals.css` (tokens, shadow, keyframe), `next.config.ts` (the PDF's headers), `src/app/api/qualify/route.ts` (the origin), `src/lib/schema.ts`, `lead-format.ts`, `lead-delivery.ts`, `lead-notify.ts`, `src/content/email.ts`, `qualification-modal-provider.tsx` (`isOpen`), `qualification-modal.tsx` (one line).
- **Docs:** `02-prd.md` (F3, F13), `03-site-architecture.md`, `04-ux-spec.md` (4.11), `05-business-rules.md` (2.9: Rule 1.8, §2.4, §2.5, §2.7, §2.8, §3.1, §4.4, E4, E5), `06-taxonomy.md` (3.7: §3, §4, §5, §7, §8), `07-technical-spec.md` (2.8), `08-runbook.md` (2.3: smoke step 3b), `decision-log.md` (#76, preamble, open items).
- **Untouched:** `scripts/inbound-leads.gs`.
