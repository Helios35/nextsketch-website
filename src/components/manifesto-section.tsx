import { Parallax } from "@/components/parallax";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { MANIFESTO } from "@/content/copy";

/**
 * The reframe phrase the section exists to land takes the coral payoff
 * treatment, `text-brand` (docs/04-ux-spec.md §Typography: at most a
 * couple of accent words inside a linen display heading; decision-log
 * #47). The phrase lives in src/content beside the headline it is
 * matched against (build-note 34, check 11); the heading degrades to
 * unaccented if the two stop matching.
 */
const ACCENT_PHRASE = MANIFESTO.accentPhrase;

/**
 * Manifesto (#why) — reframe the problem. Rebuilt in place to the
 * hero-derived design system (Redesign Unit 02): a full-width band on
 * `background` with the shared gutter rhythm, the mono "(02)" eyebrow,
 * a Playfair display statement with the coral payoff phrase (no text
 * shadow: it sits on plain `background`, decision-log #47), and the
 * body offset right in the two-column editorial rhythm. Entrances are
 * the shared ScrollReveal at the hero stagger (0 / 120 / 200ms); the
 * body block carries the shared whisper parallax.
 */
export function ManifestoSection() {
  const headline = MANIFESTO.headline;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <section
      id="why"
      aria-labelledby="why-headline"
      className="w-full px-6 py-24 sm:px-8 sm:py-28 lg:px-16 lg:py-36"
    >
      <ScrollReveal>
        <SectionHeading
          index="02"
          eyebrow={MANIFESTO.eyebrow}
          className="max-w-4xl"
        >
          <span id="why-headline">
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
      <Parallax className="lg:ml-auto lg:max-w-4xl">
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
          {MANIFESTO.body.map((paragraph, i) => (
            <ScrollReveal key={paragraph} delay={120 + i * 80}>
              <p className="text-base leading-relaxed text-foreground md:text-lg">
                {paragraph}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Parallax>
    </section>
  );
}
