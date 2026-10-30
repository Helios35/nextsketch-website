import { LevelMark } from "@/components/level-mark";
import { LevelsBand } from "@/components/levels-band";
import { OfferTab } from "@/components/offer-tab";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCta } from "@/components/service-cta";
import { WaitlistBand } from "@/components/waitlist-band";
import { levelsLabel, OFFER_LEVELS } from "@/content/levels";
import {
  SERVICE_NEED,
  SERVICE_PAGE_HREF,
  SERVICES,
  SERVICES_ACCENT_PHRASE,
  SERVICES_CTA,
  SERVICES_EYEBROW,
  SERVICES_HEADLINE,
} from "@/content/services";
import type { Service } from "@/lib/types";

/**
 * The promise the section exists to land takes the coral payoff
 * treatment, `text-brand` (docs/04-ux-spec.md §Typography: at most a
 * couple of accent words inside a linen display heading; decision-log
 * #47). The phrase lives in src/content beside the headline it is
 * matched against (build-note 34, check 11); the heading degrades to
 * unaccented if the two stop matching.
 */
const ACCENT_PHRASE = SERVICES_ACCENT_PHRASE;

/**
 * Services (#services) — the two offerings (decision-log #53;
 * docs/03-site-architecture.md row 6), agentic first, each card naming
 * the offering, what it is, its levels (#69), what it does, and (on
 * the agentic card) the four example jobs its page shows (#57). No
 * price: prices live on `/pricing` only (#73). The
 * waitlist band sits under the cards (#58). Rebuilt in place to the
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
        {/* The five levels of AI (#69), above the cards they map onto. */}
        <LevelsBand />
        {/* Two cards since #53: side by side from md. The 4-up `xl`
            step left with the other two services. The cards do not
            open on hover (#69, amended): what each level means lives
            in the band above and on the service routes. */}
        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2">
          {/* Widened to `Service`: `as const satisfies` narrows each entry
              to its own literal type, so `examples` would not exist on
              the card that omits it. */}
          {SERVICES.map((service: Service, i) => (
            <ScrollReveal
              key={service.slug}
              delay={120 + i * 80}
              className="h-full"
            >
              {/* flex-col + mt-auto on the CTA row so the two CTAs
                  line up across cards whose copy runs to different
                  lengths. `relative` holds the offer tab (#67) and the
                  name link's stretched hit area (#70). */}
              <div className="relative flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors duration-150 hover:border-muted-foreground/50 md:p-8">
                <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                  {/* Click-through: a rotated mark paints above the
                      card's stretched link (#70), so it would eat a click. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none h-1.5 w-1.5 rotate-45 bg-brand"
                  />
                  {String(i + 1).padStart(2, "0")}
                </p>
                {/* One line at every breakpoint (owner direction
                    2026-08-04). nowrap is the guarantee. Measured for
                    the #53 names in Inter semibold with tight tracking:
                    the longer, "Agentic System Integration", sets at
                    224px at 18px against a 264px column at 360, and at
                    249px at 20px against a 280px column at 768, the two
                    narrowest cards. The `xl:text-lg` step back down
                    existed for the retired 4-up grid and went with it. */}
                {/* **The whole card opens the service route (#70,
                    superseding #30's name-only link).** The name is
                    still the one link, so a screen reader hears the
                    offering's name as the link and nothing doubles up,
                    but its `::after` is stretched over the card
                    (`after:absolute after:inset-0`, the card is the
                    nearest positioned box), so a click anywhere on the
                    card follows it. The Build With Us CTA sits above
                    that layer (`relative z-10`) and still opens the
                    modal on this offering. Because the hit area is the
                    link's own, hovering anywhere on the card is hovering
                    the link, so the name takes its coral there; and the
                    focus ring moves from the name to the card's edge,
                    the size of what Enter opens. Root-relative by
                    construction: `SERVICE_PAGE_HREF` builds every href
                    through `serviceBlockHref`.

                    Deliberately not the §Interaction-vocabulary coral
                    text link: coral on the card heading would put a
                    second coral element above the coral CTA and spend
                    the page's one accent twice per card. It rests as
                    the linen (`foreground`) heading it already was
                    under a `muted-foreground` hairline underline, and
                    takes coral (`brand`, decision-log #47) only on
                    hover and focus. An underline adds no width, so the
                    measured one-line nowrap guarantee above still
                    holds. */}
                <h3 className="mt-6 font-sans text-lg font-semibold tracking-tight whitespace-nowrap text-foreground md:text-xl">
                  <a
                    href={SERVICE_PAGE_HREF[service.slug]}
                    className="underline decoration-muted-foreground underline-offset-4 transition-colors duration-150 after:absolute after:inset-0 after:rounded-xl hover:text-brand hover:decoration-brand focus-visible:text-brand focus-visible:decoration-brand focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
                  >
                    {service.name}
                  </a>
                </h3>
                {/* What the offering is, in buyer words: secondary text
                    under the name, the step the system keeps for it. */}
                <p className="mt-2 text-base font-medium text-muted-foreground">
                  {service.subtitle}
                </p>
                {/* The levels this offering covers (#69): each level's
                    mark, then "Levels 2 and 3". */}
                <p className="mt-4 flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {OFFER_LEVELS[service.slug].map((level) => (
                      <LevelMark key={level} level={level} />
                    ))}
                  </span>
                  {levelsLabel(service.slug)}
                </p>
                <p className="mt-4 text-base leading-relaxed text-foreground">
                  {service.description}
                </p>
                {/* The four example jobs, previewed (#57). A list, so
                    the system's coral list diamond marks each. */}
                {service.examples !== undefined && (
                  <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2.5">
                    {service.examples.map((example) => (
                      <li
                        key={example}
                        className="flex items-center gap-2.5 text-sm text-muted-foreground"
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none h-1.5 w-1.5 shrink-0 rotate-45 bg-brand"
                        />
                        {example}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-auto pt-6">
                  {/* Above the card's stretched link (#70), so it still
                      opens the modal with this offering picked. */}
                  <span className="relative z-10 inline-flex">
                    <ServiceCta
                      label={SERVICES_CTA}
                      need={SERVICE_NEED[service.slug]}
                      service={service.name}
                    />
                  </span>
                </div>
                {/* The offering's own colour (#67), on the card's top
                    hairline above the index; coral keeps the index, the
                    diamonds and the CTA. */}
                <OfferTab offer={service.slug} className="left-6 md:left-8" />
              </div>
            </ScrollReveal>
          ))}
        </div>
        <WaitlistBand />
      </div>
    </section>
  );
}
