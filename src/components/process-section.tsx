import { PlusIcon } from "@/components/plus-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { PROCESS } from "@/content/copy";

/**
 * Presentation marker, not copy: the retention promise the headline
 * builds to takes the coral payoff treatment, `text-brand`
 * (docs/04-ux-spec.md §Typography: at most a couple of accent words
 * inside a linen display heading; decision-log #47). The period rides
 * along so the final beat lands as one coral unit after three linen
 * ones. Degrades to an unaccented headline if the canonical copy
 * changes.
 */
const ACCENT_PHRASE = "Stay.";

/**
 * Process (#process) — the interactive centerpiece, rebuilt in place
 * to the hero-derived design system (Redesign Unit 02): a full-width
 * band on `background` with the shared gutter rhythm, the mono "(04)"
 * eyebrow, and phase rows divided by `border` hairlines, titled in
 * Inter semibold (decision-log #47). The native
 * <details name> exclusive accordion is canonical (build-note 03) and
 * survives the redesign untouched — works without JS (Business Rules
 * E3), keyboard-accessible by default, Strategy open on load. What
 * changed is the skin: the retired <SketchAccent> circle draw-on
 * becomes the open row's phase number turning coral, `text-brand` (the
 * system's one accent doing the same "you are here" work), and the
 * handwritten rose margin note becomes the coral Playfair-italic
 * aside, the one sanctioned italic (docs/04-ux-spec.md §Color,
 * §Typography). Entrances swap Reveal for the
 * shared ScrollReveal at the hero stagger (heading 0ms, rows
 * 120 + i·80ms); no Parallax here — the interaction is the moment.
 */
export function ProcessSection() {
  const headline = PROCESS.headline;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <section
      id="process"
      aria-labelledby="process-headline"
      className="w-full px-6 py-24 sm:px-8 sm:py-28 lg:px-16 lg:py-36"
    >
      <ScrollReveal>
        <SectionHeading
          index="04"
          eyebrow={PROCESS.eyebrow}
          className="max-w-4xl"
        >
          <span id="process-headline">
            {phraseStart === -1 ? (
              headline
            ) : (
              <>
                {headline.slice(0, phraseStart)}
                <span className="text-brand">{ACCENT_PHRASE}</span>
                {headline.slice(phraseStart + ACCENT_PHRASE.length)}
              </>
            )}
          </span>
        </SectionHeading>
      </ScrollReveal>
      {/* The closing hairline lives on the container: `last:` on the
          <details> would fire on every row (each is the sole child of
          its ScrollReveal wrapper) and double the dividers. */}
      <div className="mt-14 border-b border-border md:mt-20">
        {PROCESS.phases.map((phase, i) => (
          <ScrollReveal key={phase.slug} delay={120 + i * 80}>
            <details
              name="process-phase"
              open={i === 0}
              className="group border-t border-border"
            >
              <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:gap-8 md:py-8 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex w-10 shrink-0 justify-center font-mono text-sm tracking-[0.14em] text-muted-foreground transition-colors duration-150 group-open:text-brand md:w-14 md:text-base">
                  {phase.order}
                </span>
                <span className="grow font-sans text-2xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {phase.name}
                </span>
                <span className="flex shrink-0 self-center text-muted-foreground">
                  <PlusIcon />
                </span>
              </summary>
              <div className="pb-8 pl-15 md:pb-10 md:pl-22">
                <p className="max-w-prose text-base leading-relaxed text-foreground md:text-lg">
                  {phase.description}
                </p>
                {phase.slug === "validate" && (
                  <p className="mt-5 font-serif text-brand italic">{PROCESS.annotation}</p>
                )}
              </div>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
