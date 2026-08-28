import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { PROCESS } from "@/content/copy";

/**
 * Presentation marker, not copy: the retention promise the headline
 * builds to takes the gold payoff treatment (docs/04-ux-spec.md
 * §Typography). The period rides along so the final beat lands as one
 * gold unit after three white ones — the same phrase `ProcessSection`
 * accents on `/`, so the two surfaces land the same word. Degrades to
 * an unaccented headline if the canonical copy changes.
 */
const ACCENT_PHRASE = "Stay.";

/**
 * "How it works" on the service routes (decision-log **#30**) — the
 * four canonical phases (Taxonomy §2) as a numbered card grid.
 *
 * **Why this is not `<ProcessSection>`.** That component is the home
 * page's interactive centerpiece: a native `<details name>` exclusive
 * accordion, `#process` in the nav, index `(04)` in the page's section
 * rhythm. Reusing it here would put a second element with `id="process"`
 * on a route that also links to `/#process`, and would import the home
 * page's section numbering onto a page that has none. The **content is
 * reused, the component is not** — this reads the same `PROCESS.phases`,
 * the same headline and the same gold-italic aside, so a phase edit
 * still lands in one place (`src/content/copy.ts`).
 *
 * **Layout is adapted from an owner-supplied reference** (2026-08-28),
 * which contributed **layout only** — the posture PR #27 took with the
 * gallery reference and build-note 23 took with the pricing reference.
 * What it contributed: a titled block above a numbered card row, with
 * the numeral **outside and above** each card rather than inside it as
 * a mono tag. What it did not:
 *
 * - **Its visual mock inside each card.** Those are product
 *   screenshots of the reference's own app. We have no such asset for a
 *   phase, and inventing one is Rule 4.3.
 * - **Three steps.** The process is four phases and has been since
 *   Taxonomy §2; the grid takes four columns, not three.
 * - **Its rounded cards, pill eyebrow and grey card fill.** Squared is
 *   the shape of the brand, the eyebrow is the mono micro-label, and
 *   the fill is this system's glass card.
 *
 * The numeral is `phase.order` at display scale on the white alpha
 * ladder, `aria-hidden` because it is the reference's visual scaffold
 * and the reading order already carries the sequence. On `/` the same
 * number is announced, because there it is the accordion row's only
 * position marker.
 *
 * **Cards are solid `#0a0a0c`, not §Surfaces' translucent-plus-blur.**
 * That recipe exists so a card reads over the moving backdrop; the
 * service routes mount no `ScrollVideo` (#17), so there is nothing
 * behind the card to blur. Same call, same reason, as the Work band
 * (build-note 20) and the `/pricing` tiers (23). **No text shadow on
 * the heading** for the matching reason: it sits on plain ink, where
 * §Typography bans it.
 *
 * Server component. Entrances are the shared `ScrollReveal` at the hero
 * stagger (heading 0ms, cards 120 + i·80ms).
 */
export function ServiceProcess() {
  const headline = PROCESS.headline;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <section
      aria-labelledby="service-process-headline"
      className="w-full bg-ink px-6 py-24 sm:px-8 sm:py-28 lg:px-16 lg:py-32"
    >
      <ScrollReveal>
        <SectionHeading as="h2" eyebrow={PROCESS.eyebrow} className="max-w-4xl">
          <span id="service-process-headline">
            {phraseStart === -1 ? (
              headline
            ) : (
              <>
                {headline.slice(0, phraseStart)}
                <span className="text-gold">{ACCENT_PHRASE}</span>
                {headline.slice(phraseStart + ACCENT_PHRASE.length)}
              </>
            )}
          </span>
        </SectionHeading>
      </ScrollReveal>
      <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 xl:grid-cols-4">
        {PROCESS.phases.map((phase, i) => (
          <ScrollReveal
            key={phase.slug}
            delay={120 + i * 80}
            className="h-full"
          >
            {/* flex-col + grow on the card so the four cards match
                height across a row whose phase copy runs to different
                lengths, while the numeral above stays on its own line. */}
            <div className="flex h-full flex-col">
              <p
                aria-hidden="true"
                className="text-5xl leading-[1.05] font-medium tracking-tight text-white/20 md:text-6xl"
              >
                {phase.order}
              </p>
              <div className="mt-5 flex grow flex-col border border-white/15 bg-[#0a0a0c] p-6 transition-colors duration-150 hover:border-white/30 md:p-8">
                <h3 className="text-xl font-medium tracking-tight text-white md:text-2xl">
                  {phase.name}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/70">
                  {phase.description}
                </p>
                {/* The one sanctioned italic (§Color), on the one phase
                    it belongs to — carried across from `/` so the
                    differentiator is not dropped on the pages a search
                    visitor lands on first. */}
                {phase.slug === "validate" && (
                  <p className="mt-5 text-gold italic">{PROCESS.annotation}</p>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
