# Build Note 25 — Service Name Alignment & CTA Preselect Fix (adhoc Unit 25)

**Date:** 2026-08-28 · **Branch:** `adhoc/service-name-alignment` · **Base:** `main` @ `a4589c3`
**Status:** Committed and pushed; **no PR opened by the builder** (owner policy — Nate opens it). Adhoc, outside the brief set. Follows PR #32 / build-notes 23 and 24.

## The gap this closes

The site called the same four things by different names in three places, and two buttons sent visitors to the wrong answer.

A visitor read "Ongoing Partnership" on a services card, clicked it, and was asked to choose **"Product support"** — the same thing under a name they had not seen. The hero strip above had called it "Ongoing Product Partnership", and Taxonomy §1 recorded a third variant. The divergence was **flagged in `services.ts` on 2026-08-04 and left unreconciled for three and a half weeks**, in a comment that said out loud it was two owner calls waiting to be made.

Worse, two pricing tier CTAs preselected the wrong project type — and the doc block above the mapping **argued the wrong one was deliberate and told the reader not to correct it**.

## The vocabulary

The quick door's labels are the reference, because the quick door is the only surface a visitor reaches *after* choosing. A name it does not use is a name that disappears mid-conversion.

| Display name | Slug (was) | Payload value | Card | Hero strip | `/pricing` | Modal |
|---|---|---|---|---|---|---|
| New Product | `new-product` (unchanged) | `new_product` | ✓ | ✓ | ✓ (tier `custom`) | ✓ |
| Product Completion | `product-completion` (`rescue`) | `rescue` | ✓ | ✓ | ✓ (tier `rescue`) | ✓ |
| Product Support | `product-support` (`partnership`) | `partnership` | ✓ | ✓ | — no tier | ✓ |
| Agentic System | `agentic-system` (`agentic`) | `agentic` | ✓ | ✓ | ✓ ×2 (`workflow`, `tool`) | ✓ |

**Three vocabularies, and only one of them renamed.** Display names are what a visitor reads; slugs are kebab-case (§8) and now match the names one-for-one; **payload values are a contract and did not move** — which is why `product-support` still stores as `partnership`. `PROJECT_TYPE_VALUES`, the modal and the `/api/qualify` payload shape are untouched, so **no lead data migrates**.

## Every surface swept

The brief warned there were more than the obvious two. There are nine, plus the docs:

| # | Surface | Where | Outcome |
|---|---|---|---|
| 1 | Services card `<h3>` | `content/services.ts` → `SERVICES[].name` | renamed |
| 2 | Card CTA accessible name | `service-cta.tsx` `aria-label` | followed for free — it interpolates `service.name` |
| 3 | Hero capability strip | `content/copy.ts` → `LANDING.capabilities` | renamed (#28, a Rule 4.1 edit) |
| 4 | Pricing tier `<h3>` | `content/pricing.ts` → `PRICING_TIERS[].name` | 2 of 4 renamed |
| 5 | **Pricing term sentence** | `content/pricing.ts` → `PRICING.term` | renamed — see deviation 1 |
| 6 | `ServiceSlug` union | `lib/types.ts` | renamed |
| 7 | `SERVICE_NEED` | `content/services.ts` | rekeyed, meaning preserved |
| 8 | `PRICING_NEED` | `content/pricing.ts` | 2 values corrected, doc block replaced |
| 9 | Quick-door selector + modal Q1 | `content/modal.ts` | **untouched** — the reference |
| — | `06-taxonomy.md` §1, §9 · `05-business-rules.md` §4.1 · `decision-log.md` | docs | reconciled |

`02-prd.md` F6, `04-ux-spec.md` §Capability strip and `scope-lock-mvp.md` all cite "the four canonical services (Taxonomy §1)" **by pointer with no names inline**, so they self-updated. That is the payoff of the pointer convention and worth keeping.

## The preselect correction

`tool` preselected `new_product` and `custom` preselected `partnership`. Both now:

```ts
export const PRICING_NEED: Record<PricingTierSlug, ProjectType> = {
  workflow: "agentic",
  tool: "agentic",      // was new_product
  rescue: "rescue",
  custom: "new_product", // was partnership
};
```

**The doc block above it was replaced, not just its values.** It previously read that `custom → partnership` "is the mapping a reader is most likely to assume is a mistake and is not" — a comment that pre-emptively warns the next reader off a correction, which is exactly what kept the bug alive. Decision-log **#25 recorded the old mapping as as-built only and explicitly declined to ratify that reasoning** (unit 24), which is what left this straightforwardly correctable rather than a reversal of a logged owner call.

**The top two tiers share `agentic` on purpose**, and that is now in Taxonomy §1 rather than only in a code comment, because unit 26 depends on it: *AI Workflow Integration* is agents and custom tools dropped into processes the business already runs — workflow level, no product wrapped around them. *Internal Tool* is a full product with a real interface and agents behind it, owned by the client and logged into by their team. The modal asks what a visitor needs, not how deep they want to go; the depth is what the two price points express.

## The eight preselect paths, verified

All eight on a **clean page load each** (see the verification note below), reading the actually-checked `input[name="quick_needs"]`:

| Source | Preselects | Modal shows |
|---|---|---|
| Card — New Product | `new_product` | New product |
| Card — Product Completion | `rescue` | Product completion |
| Card — Agentic System | `agentic` | Agentic system |
| Card — Product Support | `partnership` | Product support |
| Tier — AI Workflow Integration | `agentic` | Agentic system |
| Tier — Internal Tool | `agentic` | Agentic system ← **corrected** |
| Tier — Product Completion | `rescue` | Product completion |
| Tier — New Product | `new_product` | New product ← **corrected** |

### A verification trap worth recording

The first three attempts at this produced **confidently wrong results**, and the next agent to verify modal wiring will hit the same thing:

1. The `<dialog>` **stays mounted after close** and only toggles `.open`. A `querySelectorAll('dialog').length === 0` guard therefore never fires, and reading the checkboxes of a closed dialog returns the **previous** open's state.
2. A synthetic `element.click()` opens the modal on a **freshly loaded page** but does **not** reopen it after a close in the same page session.

Together those produce four identical readings that look like a real result. Two of my early passes reported "all four preselect `new_product`" and "all four preselect `partnership`" — both artifacts, neither a bug in the code. **The reliable protocol is one fresh page load per path**, which is what the table above used.

## Slug rename

```ts
export type ServiceSlug =
  | "new-product" | "product-completion" | "product-support" | "agentic-system";
```

Renamed **with** the display names so a slug is never a fossil of a retired one — `rescue`, `agentic` and `partnership` were the 2026-06 names and had outlived them by two renames. These are what unit 26's routes get built on, so they are the display names slugified and nothing else. The union is a total map key, so **the compiler found every consumer**; `SERVICE_NEED` was rekeyed, not re-derived, and every card preselects exactly what it preselected before.

`ServiceSlug` never appeared in a URL, a DOM id or a payload — only as a React `key` and a `SERVICE_NEED` index — so the rename is internal.

## Deviations — flagged, not silently resolved

1. **`PRICING.term` was edited, and the brief said the term sentence was untouched.** It is a *rendered* string that names the tier by name: "…**Save Your Project** is the exception: it starts as a two month trial…". Leaving it would have left the page pointing at a tier name no card carries, breaking outcome 1 ("one vocabulary, everywhere a visitor can read it") on the very page the rename is most visible. **Two words substituted, nothing else in the sentence touched.** One-line revert if you disagree.
2. **The New Product tier's description now reads oddly against its name.** It opens "Scope that does not fit the tiers above", which was natural under "Custom Product" and less so under this one. **Not fixed** — the brief is explicit that a rename is not permission to reword canonical copy (Rule 4.1), so it is flagged in the file and here. It is a copy decision.
3. **The pricing tier slugs were not renamed**, so `custom` now carries "New Product" and `rescue` carries "Product Completion" — both fossils. The brief carved out `custom` by name; `rescue` is the same shape and is carved out with it. Recorded in the tier doc block and Taxonomy §9.
4. **The modal's Q1 labels are a fifth variant** ("New product from scratch", "Stuck at 70% — rescue or finish", "Agentic systems for my product or operations", "My live product needs a partner"). Untouched — the brief bars modal edits and names only the quick-door labels as the reference. They are question-shaped rather than name-shaped, so they do not read as a competing vocabulary, but they are the one place a fifth wording survives.
5. **`05-business-rules.md` §4.1 was edited beyond the brief's spec-updates list**, which named only Taxonomy §1 and the decision log. §4.1 is the register of Rule 4.1 edits to canonical copy, and #28 is one — leaving it out would have made the register incomplete the moment it was written. Revert if you would rather it lived only in #28.

## Docs

- **`06-taxonomy.md` (v2.2 → v2.3)** — §1 rewritten: the four names, their slugs and their payload values in one table, the three-vocabulary distinction stated, and the 2026-08-04 divergence recorded as closed. New **"Two kinds of agentic system"** subsection carrying the depth distinction (#29). §9 gains three deprecation rows: the retired service names, the retired slugs, and the two retired tier names — each with its old-data handling, all "display only, no migration".
- **`05-business-rules.md` §4.1** — a third Rule 4.1 edit recorded, with the same "do not correct this back" warning the hero headline carries under #18.
- **`decision-log.md`** — rows **#27** (one vocabulary + slug rename + two tier renames), **#28** (the capability strip as a Rule 4.1 edit, kept separate on the brief's instruction), **#29** (the preselect correction + the agentic-depth positioning). The numbering note now reads **#1–#29, next row #30**.

## Verification

- **`npm run typecheck`, `npm run lint`, `npm run build`, `npm run banned-terms` — all green.** Gate clean at 37 files.
- **Built output greps clean for every retired name** — 0 files each for "New Products from Scratch", "Rescue & Completion" (and its `&amp;` form), "Agentic Systems Integration", "Ongoing Product Partnership", "Agentic Systems", "Ongoing Partnership", "Save Your Project", "Custom Product". All four new names present.
- **All eight preselect paths verified**, one fresh page load each — table above.
- **Card headings hold one line at 375 · 768 · 1024 · 1280 · 1440 · 1920.** Zero overflow at every width, `maxLines: 1` everywhere, and no horizontal document overflow at 375. At **1280** — the `xl` 4-up, where cards are narrowest at 206px inner — the worst case is **Product Completion at 173.7px, clearing by 32.3px**. The retired long names cleared by under 4px at 20px type, which is why the `xl` step down to 18px exists; that step is now carrying far more slack than it needs, but it was left alone as out of scope.
- **Hero capability strip** renders the four new names in the marquee (screenshot taken at 1280).
- **Console clean of app errors.** The only errors are `400`s from the Apollo visitor pixel rejecting `localhost` — pre-existing, build-notes 19 and 22 record the same. No React, hydration or network errors from app code.
- `NSOS-Transfer/` untouched and still untracked.
