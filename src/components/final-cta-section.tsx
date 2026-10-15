import { ModalTrigger } from "@/components/modal-trigger";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { FINAL_CTA } from "@/content/copy";

/**
 * The qualification promise the close turns on takes the coral payoff
 * treatment, `text-brand` (docs/04-ux-spec.md §Typography: at most a
 * couple of accent words inside a linen Playfair display heading;
 * decision-log #47). The phrase lives in src/content beside the
 * headline it is matched against (build-note 34, check 11); the
 * heading degrades to unaccented if the two stop matching.
 */
const ACCENT_PHRASE = FINAL_CTA.accentPhrase;

/**
 * Final CTA (#start) — convert (docs/03-site-architecture.md row 11).
 * Rebuilt in place to the hero-derived design system (Redesign Unit
 * 02): the contained rounded ink panel and the margin sketch arrow
 * are retired; this is now a flat closing band on the shared gutter
 * rhythm whose whole job is the divided-arrow advance. Bottom-weighted
 * (extra bottom padding before the footer) to echo the hero's
 * weight-low posture. Entrances are the shared ScrollReveal at the
 * hero stagger (0 / 120 / 200ms).
 *
 * The button opens the qualification modal via <ModalTrigger>, which
 * degrades to the mailto escape hatch without JS — the E3 path
 * (docs/05-business-rules.md) that was this CTA's interim behavior
 * in unit 05.
 */
export function FinalCtaSection() {
  const headline = FINAL_CTA.headline;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <section
      id="start"
      aria-labelledby="start-headline"
      className="w-full px-6 pt-24 pb-28 sm:px-8 sm:pt-28 sm:pb-32 lg:px-16 lg:pt-36 lg:pb-44"
    >
      <ScrollReveal>
        <SectionHeading
          index="06"
          eyebrow={FINAL_CTA.eyebrow}
          className="max-w-3xl"
        >
          <span id="start-headline">
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
      <ScrollReveal delay={120}>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground md:text-lg">
          {FINAL_CTA.body}
        </p>
      </ScrollReveal>
      <ScrollReveal delay={200} className="mt-10">
        <ModalTrigger variant="inverse" arrow>
          {FINAL_CTA.cta}
        </ModalTrigger>
      </ScrollReveal>
    </section>
  );
}
