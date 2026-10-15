import Image from "next/image";
import { Parallax } from "@/components/parallax";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { ABOUT } from "@/content/copy";

/**
 * The deliberateness claim the section exists to land takes the coral
 * payoff treatment, `text-brand` (docs/04-ux-spec.md §Typography: at
 * most a couple of accent words inside a linen display heading;
 * decision-log #47). Matched without the trailing period so the
 * sentence's full stop stays linen. The phrase lives in src/content
 * beside the headline it is matched against (build-note 34, check 11);
 * the heading degrades to unaccented if the two stop matching.
 */
const ACCENT_PHRASE = ABOUT.accentPhrase;

/**
 * About (#about) — the person behind it, solo
 * (docs/03-site-architecture.md row 7). Rebuilt in place to the
 * hero-derived design system (Redesign Unit 02): the old contained
 * rounded ink panel was redundant on an all-ink page, so the section
 * now sits flat on the full-width band with the shared gutter rhythm,
 * the mono "(05)" eyebrow, and the coral payoff phrase. Entrances are
 * the shared ScrollReveal at the hero stagger (0 / 120+i·80 / 200ms);
 * the portrait carries the section's single whisper parallax. The
 * photo is the owner-supplied portrait (delivered 2026-07-06),
 * shipped under the taxonomy asset name it replaced
 * (docs/06-taxonomy.md §7) in the layout-final 3/4 crop — the square
 * source center-crops via object-cover. The portrait sits in a
 * hairline frame on a placeholder tile (`border` hairline, `muted`
 * fill, fin's card radius `rounded-xl`; decision-log #47, #48) under
 * the image-band bottom scrim in `background` (docs/04-ux-spec.md
 * §Surfaces) so it carries the same grade as the page's footage:
 * untreated, it read as an outlier (owner feedback, 2026-07-07). The
 * flat `background/40` layer is deliberately omitted: it exists for
 * text legibility over full-bleed backdrops, and no text rides this
 * image (a judgment call generalized from the hero recipe per
 * 04-ux-spec §How to build a new section).
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
            <SectionHeading index="05" eyebrow={ABOUT.eyebrow}>
              <span id="about-headline">
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
          <div className="mt-8 space-y-6">
            {ABOUT.body.map((paragraph, i) => (
              <ScrollReveal key={paragraph} delay={120 + i * 80}>
                <p className="max-w-prose text-base leading-relaxed text-foreground md:text-lg">
                  {paragraph}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
        {/*
          Grid-item placement lives on the ScrollReveal because it is
          the element the grid actually positions; the framed portrait
          fills it.
        */}
        <ScrollReveal
          delay={200}
          className="w-full self-center md:max-w-sm md:justify-self-end"
        >
          <Parallax speed={0.06}>
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="/placeholders/placeholder-about-01.jpg"
                alt={ABOUT.portraitAlt}
                width={1600}
                height={1600}
                sizes="(min-width: 768px) 24rem, 100vw"
                className="aspect-3/4 w-full object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent"
              />
            </div>
          </Parallax>
        </ScrollReveal>
      </div>
    </section>
  );
}
