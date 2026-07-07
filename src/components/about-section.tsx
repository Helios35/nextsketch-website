import Image from "next/image";
import { Parallax } from "@/components/parallax";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { ABOUT } from "@/content/copy";

/**
 * Presentation marker, not copy: the deliberateness claim the section
 * exists to land takes the gold payoff treatment (docs/04-ux-spec.md
 * §Typography — at most a couple of accent words inside a white
 * display heading). Matched without the trailing period so the
 * sentence's full stop stays white. Degrades to an unaccented
 * headline if the canonical copy changes.
 */
const ACCENT_PHRASE = "On purpose";

/**
 * About (#about) — the person behind it, solo
 * (docs/03-site-architecture.md row 7). Rebuilt in place to the
 * hero-derived design system (Redesign Unit 02): the old contained
 * rounded ink panel was redundant on an all-ink page, so the section
 * now sits flat on the full-width band with the shared gutter rhythm,
 * the mono "(04)" eyebrow, and the gold payoff phrase. Entrances are
 * the shared ScrollReveal at the hero stagger (0 / 120+i·80 / 200ms);
 * the portrait carries the section's single whisper parallax. The
 * photo is the owner-supplied portrait (delivered 2026-07-06),
 * shipped under the taxonomy asset name it replaced
 * (docs/06-taxonomy.md §7) in the layout-final 3/4 crop — the square
 * source center-crops via object-cover.
 */
export function AboutSection() {
  const headline = ABOUT.headline;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <section
      id="about"
      aria-labelledby="about-headline"
      className="w-full px-6 py-24 sm:px-8 sm:py-28 lg:px-16 lg:py-36"
    >
      <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:gap-16">
        <div>
          <ScrollReveal>
            <SectionHeading
              index="04"
              eyebrow={ABOUT.eyebrow}
              className="[text-shadow:0_2px_30px_rgba(0,0,0,0.5)]"
            >
              <span id="about-headline">
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
          <div className="mt-8 space-y-6">
            {ABOUT.body.map((paragraph, i) => (
              <ScrollReveal key={paragraph} delay={120 + i * 80}>
                <p className="max-w-prose text-base leading-relaxed text-white/70 md:text-lg">
                  {paragraph}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
        {/*
          Grid-item placement lives on the ScrollReveal because it is
          the element the grid actually positions; the wrapped
          Placeholder fills it.
        */}
        <ScrollReveal
          delay={200}
          className="w-full self-center md:max-w-sm md:justify-self-end"
        >
          <Parallax speed={0.06}>
            <Image
              src="/placeholders/placeholder-about-01.jpg"
              alt={ABOUT.portraitAlt}
              width={1600}
              height={1600}
              sizes="(min-width: 768px) 24rem, 100vw"
              className="aspect-[3/4] w-full border border-white/15 object-cover"
            />
          </Parallax>
        </ScrollReveal>
      </div>
    </section>
  );
}
