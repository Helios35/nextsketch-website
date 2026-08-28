# Build Note 24 — Decision-Log Reconcile & Pricing As-Built

**Date:** 2026-08-28 · **Branch:** `adhoc/decision-reconcile` · **Base:** `main` @ `ff9e875`
**Status:** Committed and pushed; **no PR** (owner policy — Nate opens it). Documentation unit. **Zero rendered diff** — nothing under `src/` is in the diff, so the site is byte-identical to `main`.

## The gap this closes

The paperwork was behind the code for the second time in three weeks — the same failure PR #27 created and PR #28 cleaned up. Three holes, all closed here:

1. **The log ended at #24 while seven source files cited #25 and #26.** The pricing tier structure and the `NAV.featured` bar button were undocumented owner calls living only in code comments, and **no new row could be written** because nobody knew what number it got. Units 25 and 26 both need one.
2. **The pricing page had no build note.** Notes stopped at 22. PRs #30 and #31 shipped a whole route's worth of content, a new component, two new types and a new `Button` variant with no as-built record, and unit 26 builds four more routes against that pattern.
3. **The "Still open (owner)" footer was stale.** It said `/pricing` ships layout-final and empty and that a later unit fills it. That unit shipped 2026-08-25.

## The two rows, and what they were reconstructed from

Neither is a new decision. Both were made and shipped on 2026-08-25; this records them at the number the code already points at, and both carry **their real dates, not today's**.

| # | Subject | Reconstructed from |
|---|---|---|
| 25 | The pricing tier structure, the term, and the tier names | The doc blocks in `src/content/pricing.ts` and `src/lib/types.ts` (the most complete source, and unusually detailed), the eight commit messages in PR #30, PR #30's body, and PR #31's diff |
| 26 | The `NAV.featured` Pricing button in the bar | The doc blocks in `src/components/site-nav.tsx` and `src/content/copy.ts`, commits `e54ef30` / `e5a09f3` / `39df6d4`, and PR #30's reviewer notes |

**Nothing was invented.** Where the code states its reasoning, the row carries that reasoning; the rationale column of each row says out loud that it was reconstructed on 2026-08-28 and from what. Two things the rows record that the citing comments alone would not have given, both taken from the commit messages rather than guessed: that the term was **cut from twelve months to three mid-build**, and that Save Your Project's exemption was a **judgment call resolving two owner instructions that collide on that one card**.

**The brief said five source files cite #25/#26. There are seven** — it missed `src/app/pricing/page.tsx` and `src/content/copy.ts`. All seven were checked hit by hit.

## The numbering is now stated, not derived

The log's own intro paragraph gained a **Numbering** note: numbers run in one unbroken sequence, are never renumbered or reused, a superseded row stays in place and says so, the log runs **#1–#26 with no gaps, and the next new row is #27**. It also records that #25/#26 were written after the fact at numbers the code was already citing, and that a reconstructed row carries the date of the call rather than the date of the record.

The next agent does not have to re-derive any of that, which is the point.

## What the footer sweep changed

**Resolved and moved out:** the pricing-content item. The four tiers, their figures and the monthly term shipped in PRs #30/#31 and are now #25. It moves to a new **"Resolved (2026-08-28, unit 24)"** line that names what shipped and states that `/pricing` is no longer layout-final and empty. The original "Resolved this session" line (Sprint 03) is preserved **byte-identical** below it — it is a historical record, not a live claim.

**Stayed open, unchanged:** the no-JS nav fallback (#22), the Messaging Kit §05 reconcile (#18), the "we stay" relocation (#20), Asana, draft copy approval, the off-ramp's name+email question, Resend domain verification, the DNS cutover, the production smoke test, the OG image.

**Four items added**, all created by the rows this unit wrote and all real owner calls:

1. **Tier feature bullets** — the one part of the pricing content still owed. Empty on all four cards (Rule 4.3).
2. **A line saying what the $298 actually buys.** The page states the price and the term but never the deliverable. Carried in PR #30's own outstanding list and never closed.
3. **The struck former prices ($5,000 / $10,000) are a standing discount claim.** Fine if those are genuine prior or list prices, but a discount that never expires stops reading as one.
4. **The tier-slug question.** `workflow` · `tool` · `rescue` · `custom` do not map one-for-one onto Taxonomy §1's service slugs, and `src/lib/types.ts:141` cites `06-taxonomy.md` for a tier table that document does not carry. **Recorded, deliberately not resolved** — it is unit 25's subject.

**The em-dash item was expanded in place** with the count and the file breakdown, and nothing was edited.

## The em-dash finding — counted, recorded, untouched

Decision #19 binds every rendered string in `src/content/`. Measured 2026-08-28 with block comments and whole-line `//` comments stripped, so only rendered strings are counted:

| File | Lines | Occurrences | Where |
|---|---|---|---|
| `modal.ts` | 13 | 13 | live |
| `email.ts` | 11 | 11 | transactional |
| `copy.ts` | 8 | 8 | `SITE.title`, `SITE.description`, `NOT_FOUND.body`, two `PROCESS` phase descriptions (live); `HERO.subheadline`, `TESTIMONIALS.placeholderLabel`, `FIT.body` (dormant) |
| `faq.ts` | 3 | 3 | dormant |
| `pricing.ts` | 0 | 0 | — |
| `services.ts` | 0 | 0 | — |
| `work.ts` | 0 | 0 | — |
| **Total** | **35** | **35** | **18 live · 11 transactional · 6 dormant** |

One em dash per line, so lines and occurrences are the same number.

Two things worth recording about the count itself:

- **It is unchanged by PRs #30 and #31.** The same script run against the tree at `0340544` (before the pricing work) returns the identical 35. The pricing work introduced **zero** em dashes into rendered copy, which is #19 being honoured by the one unit that had the most new strings to write.
- **Build-note 22 reported 36.** Its scan counted one line that the stricter comment-strip used here excludes. 35 is the number, and it is the number an actual `check-banned-terms.mjs` scan would catch on day one.

**Nothing was changed.** That is shipped, owner-approved copy, Rule 4.1 makes editing it an owner decision, and whether #19 gets enforced or narrowed is not this unit's call.

## Docs corrected beyond the decision log

The brief named `docs/decision-log.md` as the whole surface and told me to grep for anything else describing `/pricing` as empty or layout-final. The grep found more than that — claims that #25 and #26 make false outright. The rule I applied: **fix what #25/#26 falsify; flag what an earlier decision falsified and an earlier unit missed.**

**`docs/04-ux-spec.md` (v3.2 → v3.3):**

- §`/pricing` was headed **"layout-final placeholder"** and closed with **"The page carries no prices, tiers or feature bullets."** Both replaced with the tier grid as-built.
- The same section said the lockup **"is not a link"** and explained why one would be unclickable. It is a link now (#26 made it reachable) — leaving that would have told the next agent to *remove* a link the owner asked for.
- The intro band is no longer the bottom-anchored `min-h-dvh` the spec described.
- §Nav ended **"and no CTA"**, and the §Live-components entry said **"no nav CTA"**. Both falsified by #26. §Nav gains two bullets — the featured button, and the `pointer-events-none` bar — and its heading now cites #22 *and* #26.

**`docs/01-vision.md`:** the Non-goals line read **"No pricing display, no e-commerce, no client portal, no CMS…"** tagged **CURRENT**. The site publishes four tiers and their figures. The clause is tagged **CHANGED** with a one-sentence note citing #23/#25, and the note says explicitly that the page still sells nothing and takes no payment, so **#8 is untouched**. The rest of the line is unchanged.

**Revert any of these if you would rather they lived only in this note.** They are the note-21 and note-22 precedent — the footer's and the spec's job is to reflect reality — but they are beyond the brief's named surface and are flagged rather than slipped in.

## Deliberately not changed

- **Rows #1–#24.** Not renumbered, not reworded, not improved. Row #23's "Unit 22 ships the route layout-final and empty" is a true statement about what Unit 22 shipped and stays as written; the *footer* is where the current status lives.
- **The "Resolved this session" line.** Preserved byte-identical, verified by diff. It says "pending review/merge" about a Sprint 03 branch that merged long ago, which is stale — but it is explicitly a record of that session, and rewriting it would falsify history. **Flagged, not touched.**
- **Everything under `src/`.** Not a comment, not a typo. Including the two stale lines below, which is the frustrating part.
- **The em-dash copy**, the tier feature bullets, the `custom` tier slug, and `scripts/check-banned-terms.mjs`. All out of scope by name.

## Found in the sweep, not fixed

- **`src/components/pricing-tiers.tsx:33` says the retainer is "required for the first year (#25)".** The term was cut to three months in commit `96a4f34`; the content module, the rendered page and row #25 all say three months. This comment is the only thing left in the repo saying twelve, **and it cites #25 while contradicting it.** It is exactly the class of defect this unit exists to remove, and this unit may not touch `src/`. **Recommend unit 25 fix it in passing** — it is a two-word comment edit in a file that unit is already opening.
- **`src/lib/types.ts:141` cites `docs/06-taxonomy.md` for tier slugs that document does not carry.** A citation pointing at nothing, the same shape as the `build-note 20` citation note 21 repaired. Recorded in the footer; resolving it means deciding whether the taxonomy grows a tier table or the citation is dropped, which is unit 25's.
- **`docs/01-vision.md` Non-goals still says "Not a multi-page site — one page plus the modal. CURRENT."** Falsified by #23 in Unit 22, not by anything in the pricing work. Pre-existing drift, one line above a line I did change. **Flagged rather than fixed**, per the rule above — but it is a one-clause fix if you want it.
- **The "five sections" drift** (#16 made it six) is still in `01-vision.md` and parts of `02-prd.md` / `03-site-architecture.md`. Flagged by note 22, still true, still nobody's unit.

## Verification

- **`npm run typecheck`, `npm run lint`, `npm run build`, `npm run banned-terms` — all green.** This unit should not have moved them, and it did not.
- **`git diff --name-only` contains no file under `src/`.** Three docs and two new build notes, nothing else.
- **All seven files citing #25/#26 checked hit by hit** — every citation now resolves to a real row, and the row says what the comment claims it says, with the single exception of `pricing-tiers.tsx:33` above, which is recorded rather than fixed because the guardrail forbids the edit.
- **The em-dash count was produced by an actual scan**, not an estimate: block comments and whole-line `//` comments blanked, then em dashes counted per file. The same scan against `0340544` returns the same 35, confirming the pricing work added none.
- **Rows #1–#24 are untouched** — `git diff -U0` on the log shows exactly one deleted line, the old "Still open (owner)" footer.
- The log runs **#1–#26 with no gaps**, and the next row is #27.
- `NSOS-Transfer/` untouched and still untracked. `briefs/24`, `briefs/25` and `briefs/26` stay untracked per decision #10 — only build notes go in the repo.
