# Build Note 21 — Doc Reconciliation (Conversion Sections)

**Date:** 2026-08-24 · **Branch:** `docs/conversion-sections-reconcile`
**Status:** Committed and pushed; **no PR** (owner policy — Nate opens it). Documentation unit. **Zero rendered diff** — the site is byte-identical to `main`.

## The gap this closes

PR #27 shipped correctly; the paperwork did not follow it. Three things were out of sync:

1. Four settled owner decisions were unrecorded, and `src/content/copy.ts` and `services.ts` said so out loud in comments reading *"flagged, not yet written."*
2. §3.4 still banned a phrase the shipped About copy contains, so the rule and the build gate disagreed on paper even though the gate passed.
3. The decision log cited `build-note 20` twice, but `briefs/build-notes/` stopped at 19 — a citation pointing at nothing.

The risk was concrete, not cosmetic: Rule 4.1 told any agent that Messaging Kit §05 is canonical for the hero, and three docs still quoted the retired headline as live. An agent doing the honest thing would have "corrected" the owner's copy back to Option A.

## What shipped

- **`docs/decision-log.md`** — rows **#18–#21** appended, plus the "Still open (owner)" footer maintained in place.
- **`docs/05-business-rules.md`** — §3.4, §4.1, §4.3 reconciled.
- **`docs/01-vision.md`**, **`docs/03-site-architecture.md`**, **`docs/04-ux-spec.md`** — retired hero headline and retired payoff pair removed as live claims.
- **`briefs/build-notes/20-work-proof-band.md`** — new; the as-built record for PR #27, reconstructed from the merged diff.
- **`briefs/build-notes/21-doc-reconcile.md`** — this note.
- **`src/content/copy.ts`**, **`src/content/services.ts`** — three stale comments now cite decision numbers. **Comment text only.**

## The four decisions recorded

| # | Decision |
|---|---|
| 18 | Hero headline → "From idea to production. Gain a real partner.", superseding locked Option A; gold payoff words move to "production" / "partner" |
| 19 | No em dashes in rendered site copy — standing rule, doc blocks exempt, not mechanically enforced |
| 20 | About body is owner-authored biography; §3.4 gains its first exemption, scoped and count-asserted |
| 21 | `#work` takes the first nav slot — ratifying what shipped as the builder's judgment call |

All four are recorded as final owner calls. None re-opens a settled question.

## Found in the grep sweep, beyond the brief's list

The brief named five docs and said to trust the grep over its own list. Three further items surfaced:

1. **`docs/03-site-architecture.md`, the Selected Work table row** still read *"Names/summaries/screenshots/URLs owner-owed (Rule 4.3)."* Stale — the content landed in PR #27. Updated, and the nav-slot ratification (#21) noted in the same row.
2. **`docs/05-business-rules.md` §4.3** described the Work grid as RETIRED — already listed in the brief, but the *reason* it needed changing turned out to be broader than "decision #16 reactivated it": the section is no longer in a placeholder posture at all, so the rule needed to say what the principle still governs there rather than just flipping a status tag.
3. **`src/content/services.ts` carried a fourth flagged comment** (service names shortened to card forms, 2026-08-04, diverging from Taxonomy §1 and `LANDING.capabilities`). **Left untouched** — it predates PR #27, is a separate open owner call, and this unit's mandate was the three comments PR #27 created.

## Deliberately not changed

- **`briefs/build-notes/01`, `03`, `08`** quote Option A and the retired headline. These are **historical as-built records** of what shipped at the time. Rewriting them would falsify history, and the decision log's own convention is to record superseded material as superseded rather than delete it. Note 20 and decision #18 are where the supersession lives.
- **`src/components/hero-section.tsx`** and the dormant **`HERO.headline`** in `copy.ts` still carry the old line. Dormant code, preserved by the same convention; `LANDING.headline` is what the live hero reads. Decision #18 says so explicitly.
- **`docs/01-vision.md` line 13** and **`docs/concept-website-rebuild.md`** use "industrial design" to describe *the old company being replaced*. That is historical positioning context, not a current service claim, and §3.4 as amended permits it. (`docs/` is not scanned by the gate in any case — only `src/content/` and built output.)
- **`scripts/check-banned-terms.mjs`** — untouched, per the brief. Its `ALLOWED` entry and ratification pass are correct as shipped.
- **`NSOS-Transfer/`** — untouched and still untracked.

## Deviations / judgment calls for the reviewer

1. **The footer gained three items beyond the brief's instruction.** The brief specified removing delivered Work content and keeping Pricing. I also added the Messaging Kit reconciliation (#18 creates it, and it is owner-owned outside the repo), the "we stay" relocation call (#20 creates it), and the em-dash gate recommendation (#19 creates it). Rationale: the footer's job is to reflect reality, and these are real open owner calls created by the very rows this unit added. **Revert any of the three if you'd rather they lived only in the build note.**
2. **§3.4 was rewritten structurally, not patched.** The brief asked it to distinguish a retired service claim from biography with a pointer to enforcement. Doing that in one line left the rule ambiguous about *how* an exemption is granted, so it now names the mechanism — one exact phrase, one named file, an asserted count — and states that the gate is the source of truth if the two ever disagree. That is a slightly stronger claim than the brief asked for; it is how the gate actually behaves.
3. **The brand-casing question is untouched and still open.** `WORK_INTRO` renders "Next Sketch" (two words), the owner's exact wording, against Taxonomy §8's binding "NextSketch". Resolving it would mean changing shipped copy, which this unit may not do. Flagged in note 20's deviations and left for the owner.
4. **Build note 20 is reconstructed, not contemporaneous.** It is written from the merged diff after the fact, and says so in its header. It is an accurate as-built record, but it was not written by the builder during the unit, which is the normal practice.

## Recommendation, not built

**Add an em-dash scan to `check-banned-terms.mjs`.** Decision #19 is now a standing rule with nothing enforcing it — the next copy edit can reintroduce an em dash silently, and the rule will quietly become false. Deliberately out of scope here (script change, separate owner call), and carried in note 20's recommendations too so it does not get lost.

## Verification

- `lint`, `typecheck`, `build`, `banned-terms` — all green.
- `git diff --stat` vs `main`: docs, two new build notes, and comment-only source changes. **No rendered output touched.**
- Grep confirms zero remaining live references to the retired headline or the retired payoff pair; the only survivors are the historical build notes and dormant code named above.
- Both `build-note 20` citations now resolve.
- The four new rows follow the existing table's column shape and continue its numbering.
