import { ModalTrigger } from "@/components/modal-trigger";
import {
  PRICING,
  PRICING_CTA,
  PRICING_CTA_CUSTOM,
  PRICING_NEED,
  PRICING_TIERS,
} from "@/content/pricing";
import type { PricingTier } from "@/lib/types";

/**
 * The four pricing tiers (`/pricing`) — decision-log #25.
 *
 * Composition is adapted from an owner-supplied pricing-module
 * reference, which contributed **layout only**, the same posture PR #27
 * took with the gallery reference: a titled block above a 4-up card
 * grid, each card running name -> description -> price -> included
 * list -> CTA. Its own vocabulary was refused wholesale.
 *
 * **Zero new dependencies.** The reference imports `lucide-react`,
 * `@radix-ui/react-slot`, `class-variance-authority` and
 * `react-aria-components`, plus shadcn `Card`/`Button`/`Switch` and a
 * `cn()` helper this repo does not have. None of it ships. The list
 * marker is the §Interaction-vocabulary gold diamond, not a lucide
 * `Check` ("Icons are inline SVG, never `lucide-react`"); the button is
 * the shared `<Button>` through `<ModalTrigger>`; class composition is
 * the repo's array join.
 *
 * **What else was refused, and why:**
 *
 * - **The monthly/annual billing toggle.** The reference's centrepiece.
 *   There is no such choice here: the model is a scoped upfront figure
 *   plus a $298 retainer required for the first year (#25). A toggle
 *   would invent an annual plan that does not exist and imply the
 *   commitment is optional from day one, which is the exact "surprise
 *   invoice" Brand Philosophy §6 rejects.
 * - **The `recommended` tier** — its badge, its `ring`, its `scale`
 *   emphasis. There is no recommended tier (owner call), and marking
 *   one would need a second accent, which decision #14 forbids. Gold is
 *   the only accent on this page as everywhere else.
 * - **`included: false` features with a strikethrough X.** A
 *   what-you-do-not-get column is the comparison-table gimmickry the
 *   unit's guardrails ban, and the exclusions would be invented
 *   (Rule 4.3). Each tier lists what it includes, or lists nothing.
 * - **Seat counts** (`Up to 3 users`). We do not sell seats.
 * - **`rounded-xl` / `rounded-lg` / `rounded-full`, `hover:shadow-md`,
 *   and the shadcn token palette** (`bg-background`,
 *   `text-muted-foreground`, `text-primary`). Squared is the shape of
 *   the brand, and the default Tailwind palette is cleared in
 *   `globals.css` so only brand tokens compile.
 *
 * **Surface.** Cards are the elevated glass of §Surfaces at **solid**
 * `surface`, not the spec's `surface/95 + backdrop-blur-xl`. That
 * recipe exists so a card reads over the moving backdrop; `/pricing`
 * mounts no video, so there is nothing behind the card to blur. This is
 * the Work band's precedent (build-note 20), applied for the same
 * reason. Surface colour is unchanged, so these read as one family with
 * the Services cards.
 *
 * **The CTA sits last**, where the reference puts it above the feature
 * list. It is the one place the reference's ordering was overridden.
 *
 * **Every band starts on the same line across the row — CSS subgrid.**
 * The four descriptions run three to five lines, so a plain flex column
 * staggers `Upfront` and `Ongoing` down the row and only the
 * `mt-auto` CTA lines up (owner feedback, 2026-08-25). Each card is
 * therefore a **six-row subgrid** — name, description, upfront,
 * ongoing, included, CTA — sharing its neighbours' row tracks, so each
 * band's track is the tallest across the row and every card's bands
 * start together. Content-driven, so it survives a copy edit, a font
 * swap and every breakpoint; a `min-h` in pixels or `lh` survives none
 * of those, and clamping would truncate a price description.
 *
 * Two things were measured in-browser rather than assumed, because both
 * decide the markup:
 *
 * 1. **A subgrid cannot reliably override the row gap it inherits.**
 *    Setting `row-gap: 0` on the subgrid produced inconsistent gaps
 *    (20px then 40px against a 40px parent), not zero. So the **parent**
 *    carries `gap-x-4 gap-y-0` and the row separation is a uniform
 *    `mb-4` on the cards — uniform because a `last:mb-0` would inflate
 *    the final row's track for its siblings and leave that one card
 *    taller than the rest.
 * 2. **Identical padding on every card preserves alignment.** A
 *    subgrid's tracks are positioned inside its own content box, so
 *    padding shifts them; all four cards carry the same `p-6 md:p-8`,
 *    so they shift identically and stay aligned with each other.
 *
 * The `Included` row is rendered even when a tier has no approved
 * bullets: every card must span the same six rows or the subgrids stop
 * lining up. Empty, its track collapses to nothing.
 *
 * Alignment is per grid row, which is what matters visually — the four
 * cards at `xl`, each visible pair at `md`. `mt-auto` is gone; the CTA
 * no longer needs pinning because its row is shared.
 *
 * Server component — `<ModalTrigger>` is the only interactive part, and
 * it carries each tier's `need` so the modal opens with that tier
 * already selected (the `SERVICE_NEED` pattern, `PRICING_NEED` here).
 */
export function PricingTiers() {
  return (
    <section
      aria-labelledby="pricing-tiers-heading"
      className="w-full bg-ink px-6 pb-24 sm:px-8 lg:px-16 lg:pb-32"
    >
      <h2 id="pricing-tiers-heading" className="sr-only">
        {PRICING.tiersHeading}
      </h2>
      <div className="grid gap-x-4 gap-y-0 md:grid-cols-2 xl:grid-cols-4">
        {/* Widened to PricingTier: `as const satisfies` narrows each entry
            to its own literal type, so `upfrontWas` would not exist on the
            two tiers that omit it. The component reads the interface, not
            the content's literals, which is the right coupling anyway. */}
        {PRICING_TIERS.map((tier: PricingTier) => (
          /* Six-row subgrid: the row tracks are the parent's, so every
             card's bands start on the same line as its neighbours'. The
             mb-4 is the row separation the parent's zeroed row-gap no
             longer provides, and is uniform on purpose. */
          <div
            key={tier.slug}
            className="row-span-6 mb-4 grid grid-rows-subgrid border border-white/15 bg-surface p-6 transition-colors duration-150 hover:border-white/30 md:p-8 xl:mb-0"
          >
            <h3 className="text-lg font-medium text-white md:text-xl">
              {tier.name}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-white/70">
              {tier.description}
            </p>

            {/* Price block. The upfront figure is the display heading
                scale; the retainer sits under a hairline as a second,
                quieter figure — the commitment is stated on every card
                rather than once in a footnote (#25). */}
            <div className="mt-8">
              <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55">
                {PRICING.upfrontLabel}
              </p>
              {/* The struck former price sits to the right of the figure,
                  baseline-aligned and at the white/55 caption stop (not
                  /40 — it is real text and must clear AA contrast on
                  ink, the same call the footer's legal line records).
                  Gold is not used: it is the scarce payoff accent, and
                  the figure a visitor actually pays is the white one. */}
              <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
                <span className="text-3xl leading-[1.05] font-medium tracking-tight text-white">
                  {tier.upfront}
                </span>
                {tier.upfrontWas !== undefined && (
                  <s className="text-base leading-[1.05] text-white/55 line-through">
                    <span className="sr-only">{PRICING.upfrontWasLabel} </span>
                    {tier.upfrontWas}
                  </s>
                )}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {tier.upfrontNote}
              </p>
            </div>
            <div className="mt-6 border-t border-white/10 pt-6">
              <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55">
                {PRICING.ongoingLabel}
              </p>
              <p className="mt-2 text-xl font-medium text-gold">
                {tier.ongoing}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {tier.ongoingNote}
              </p>
            </div>

            {/* Row five. Always rendered, even empty: the six-row spans
                must match across cards or the subgrids stop aligning.
                Owner-owed (Rule 4.3) — a tier with no approved bullets
                shows no list rather than an invented one, and its cell
                collapses to nothing. */}
            <div className={tier.features.length > 0 ? "mt-8" : undefined}>
              {tier.features.length > 0 && (
                <>
                  <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55">
                    {PRICING.featuresLabel}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                        />
                        <span className="text-base leading-relaxed text-white/70">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="mt-8">
              <ModalTrigger
                variant="ghost"
                need={PRICING_NEED[tier.slug]}
                className="w-full"
              >
                {tier.slug === "custom" ? PRICING_CTA_CUSTOM : PRICING_CTA}
              </ModalTrigger>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-2xl text-base leading-relaxed text-white/55">
        {PRICING.footnote}
      </p>
    </section>
  );
}
