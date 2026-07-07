import { Parallax } from "@/components/parallax";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { MANIFESTO } from "@/content/copy";

/**
 * Presentation marker, not copy: the reframe phrase the section
 * exists to land takes the gold payoff treatment (docs/04-ux-spec.md
 * §Typography — at most a couple of accent words inside a white
 * display heading). Degrades to an unaccented headline if the
 * canonical copy changes.
 */
const ACCENT_PHRASE = "actually need";

/**
 * Manifesto (#why) — reframe the problem. Rebuilt in place to the
 * hero-derived design system (Redesign Unit 02): a full-width ink
 * band on the shared gutter rhythm, the mono "(01)" eyebrow, a
 * display statement with the gold payoff phrase, and the body offset
 * right in the two-column editorial rhythm. Entrances are the shared
 * ScrollReveal at the hero stagger (0 / 120 / 200ms); the body block
 * carries the shared whisper parallax.
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
          index="01"
          eyebrow={MANIFESTO.eyebrow}
          className="max-w-4xl [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]"
        >
          <span id="why-headline">
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
      <Parallax className="lg:ml-auto lg:max-w-4xl">
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-2 md:gap-12">
          {MANIFESTO.body.map((paragraph, i) => (
            <ScrollReveal key={paragraph} delay={120 + i * 80}>
              <p className="text-base leading-relaxed text-white/70 md:text-lg">
                {paragraph}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </Parallax>
    </section>
  );
}
