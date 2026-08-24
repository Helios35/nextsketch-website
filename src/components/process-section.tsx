import { PlusIcon } from "@/components/plus-icon";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { PROCESS } from "@/content/copy";

/**
 * Presentation marker, not copy: the retention promise the headline
 * builds to takes the gold payoff treatment (docs/04-ux-spec.md
 * §Typography — at most a couple of accent words inside a white
 * display heading). The period rides along so the final beat lands
 * as one gold unit after three white ones. Degrades to an unaccented
 * headline if the canonical copy changes.
 */
const ACCENT_PHRASE = "Stay.";

/**
 * Process (#process) — the interactive centerpiece, rebuilt in place
 * to the hero-derived design system (Redesign Unit 02): a full-width
 * ink band on the shared gutter rhythm, the mono "(04)" eyebrow, and
 * hairline-divided phase rows on the white alpha ladder. The native
 * <details name> exclusive accordion is canonical (build-note 03) and
 * survives the redesign untouched — works without JS (Business Rules
 * E3), keyboard-accessible by default, Strategy open on load. What
 * changed is the skin: the retired <SketchAccent> circle draw-on
 * becomes the open row's phase number turning gold (the system's one
 * accent doing the same "you are here" work), and the handwritten
 * rose margin note becomes the gold-italic aside — the one sanctioned
 * italic (docs/04-ux-spec.md §Color). Entrances swap Reveal for the
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
          className="max-w-4xl [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]"
        >
          <span id="process-headline">
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
      {/* The closing hairline lives on the container: `last:` on the
          <details> would fire on every row (each is the sole child of
          its ScrollReveal wrapper) and double the dividers. */}
      <div className="mt-14 border-b border-white/10 md:mt-20">
        {PROCESS.phases.map((phase, i) => (
          <ScrollReveal key={phase.slug} delay={120 + i * 80}>
            <details
              name="process-phase"
              open={i === 0}
              className="group border-t border-white/10"
            >
              <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:gap-8 md:py-8 [&::-webkit-details-marker]:hidden">
                <span className="inline-flex w-10 shrink-0 justify-center font-mono text-sm tracking-[0.14em] text-white/55 transition-colors duration-150 group-open:text-gold md:w-14 md:text-base">
                  {phase.order}
                </span>
                <span className="grow text-2xl font-medium tracking-tight text-white md:text-4xl">
                  {phase.name}
                </span>
                <span className="flex shrink-0 self-center text-white/40">
                  <PlusIcon />
                </span>
              </summary>
              <div className="pb-8 pl-15 md:pb-10 md:pl-22">
                <p className="max-w-prose text-base leading-relaxed text-white/70 md:text-lg">
                  {phase.description}
                </p>
                {phase.slug === "validate" && (
                  <p className="mt-5 text-gold italic">{PROCESS.annotation}</p>
                )}
              </div>
            </details>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
