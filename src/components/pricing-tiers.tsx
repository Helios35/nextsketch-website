import { ModalTrigger } from "@/components/modal-trigger";
import {
  PRICING,
  PRICING_CTA,
  PRICING_CTA_CUSTOM,
  PRICING_NEED,
  PRICING_TIERS,
} from "@/content/pricing";

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
 * `#0a0a0c`, not the spec's `#0a0a0c/95 + backdrop-blur-xl`. That
 * recipe exists so a card reads over the moving backdrop; `/pricing`
 * mounts no video, so there is nothing behind the card to blur. This is
 * the Work band's precedent (build-note 20), applied for the same
 * reason. Surface colour is unchanged, so these read as one family with
 * the Services cards.
 *
 * **The CTA is pinned to the bottom** with `mt-auto`, where the
 * reference puts it above the feature list. Four cards whose copy and
 * list lengths differ would otherwise scatter their buttons down the
 * grid; the Services cards solve this the same way, and it is the one
 * place the reference's ordering was overridden.
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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PRICING_TIERS.map((tier) => (
          /* flex-col + mt-auto on the CTA row so the four CTAs line up
             across cards whose copy and lists run to different lengths. */
          <div
            key={tier.slug}
            className="flex h-full flex-col border border-white/15 bg-[#0a0a0c] p-6 transition-colors duration-150 hover:border-white/30 md:p-8"
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
              <p className="mt-2 text-3xl leading-[1.05] font-medium tracking-tight text-white">
                {tier.upfront}
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

            {/* Owner-owed (Rule 4.3): a tier with no approved bullets
                renders no list rather than an invented one. */}
            {tier.features.length > 0 && (
              <div className="mt-8">
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
              </div>
            )}

            <div className="mt-auto pt-8">
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
