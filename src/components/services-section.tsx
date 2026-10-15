import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCta } from "@/components/service-cta";
import {
  SERVICE_NEED,
  SERVICE_PAGE_HREF,
  SERVICES,
  SERVICES_CTA,
  SERVICES_EYEBROW,
  SERVICES_HEADLINE,
} from "@/content/services";

/**
 * Presentation marker, not copy: the promise the section exists to
 * land takes the coral payoff treatment, `text-brand`
 * (docs/04-ux-spec.md §Typography: at most a couple of accent words
 * inside a linen display heading; decision-log #47). Degrades to an
 * unaccented headline if the canonical copy changes.
 */
const ACCENT_PHRASE = "actually works";

/**
 * Services (#services) — name the four engagements
 * (docs/03-site-architecture.md row 6). Rebuilt in place to the
 * hero-derived design system (Redesign Unit 02): a transparent band,
 * built to sit over the site's fixed scroll-synced video backdrop
 * (owner direction 2026-07-06). That backdrop is retired
 * (decision-log #46, 2026-10-05), so the band now sits on the page's
 * `background`. The two leftovers #46 shipped and build-note 32
 * flagged are settled by the rebrand (decision-log #47): the display
 * heading drops the over-imagery text shadow, and the four engagements
 * are solid `card` panels with a `border` hairline at fin's card
 * radius, `rounded-xl` (decision-log #48), since the glass blur had
 * nothing behind it to blur. This replaces the paper-era accent-block cards
 * (accent bg + paired -ink text + sketch arrow); the per-service
 * `accent` field is orphaned by the redesign and deliberately unread.
 */
export function ServicesSection() {
  const headline = SERVICES_HEADLINE;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <section
      id="services"
      aria-labelledby="services-headline"
      className="w-full px-6 py-24 sm:px-8 sm:py-28 lg:px-16 lg:py-36"
    >
      <div>
        <ScrollReveal>
          <SectionHeading
            index="03"
            eyebrow={SERVICES_EYEBROW}
            className="max-w-4xl"
          >
            <span id="services-headline">
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
        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service, i) => (
            <ScrollReveal
              key={service.slug}
              delay={120 + i * 80}
              className="h-full"
            >
              {/* flex-col + mt-auto on the CTA row so the four CTAs
                  line up across cards whose copy runs to different
                  lengths. */}
              <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors duration-150 hover:border-muted-foreground/50 md:p-8">
                <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rotate-45 bg-brand"
                  />
                  {String(i + 1).padStart(2, "0")}
                </p>
                {/* One line at every breakpoint (owner direction
                    2026-08-04). nowrap is the guarantee; the xl step
                    back down to text-lg is what keeps that guarantee
                    from becoming an overflow. The 4-up grid starts at
                    xl, where cards are at their narrowest. Measured in
                    the retired Space Grotesk, the longest name cleared
                    the card by under 4px at 20px, which the swap-in
                    font fallback would have eaten, and by ~24px at
                    18px. Inter semibold with tight tracking
                    (decision-log #47) sets it about 5% narrower
                    (164.9px against 173.7px at 18px), so the margin
                    only grew. 1- and 2-up layouts have room to spare
                    and keep the larger size. */}
                {/* The name is the card's second affordance
                    (decision-log #30): the CTA below still opens the
                    modal on this service, and the name now opens the
                    service route at this service's block. Root-relative
                    by construction — `SERVICE_PAGE_HREF` builds every
                    href through `serviceBlockHref`, so nothing here is
                    a hand-written hash.

                    Deliberately not the §Interaction-vocabulary coral
                    text link: coral on the card heading would put a
                    second coral element above the coral CTA and spend
                    the page's one accent twice per card. It rests as
                    the linen (`foreground`) heading it already was
                    under a `muted-foreground` hairline underline, and
                    takes coral (`brand`, decision-log #47) only on
                    hover and focus, where the accent is doing "you are
                    here" work. An underline adds no width, so the
                    measured one-line nowrap guarantee above still
                    holds. */}
                <h3 className="mt-6 font-sans text-lg font-semibold tracking-tight whitespace-nowrap text-foreground md:text-xl xl:text-lg">
                  <a
                    href={SERVICE_PAGE_HREF[service.slug]}
                    className="underline decoration-muted-foreground underline-offset-4 transition-colors duration-150 hover:text-brand hover:decoration-brand focus-visible:text-brand focus-visible:decoration-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {service.name}
                  </a>
                </h3>
                <p className="mt-3 text-base leading-relaxed text-foreground">
                  {service.description}
                </p>
                <div className="mt-auto pt-6">
                  <ServiceCta
                    label={SERVICES_CTA}
                    need={SERVICE_NEED[service.slug]}
                    service={service.name}
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
