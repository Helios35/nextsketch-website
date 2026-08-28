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
 * land takes the gold payoff treatment (docs/04-ux-spec.md
 * §Typography — at most a couple of accent words inside a white
 * display heading). Degrades to an unaccented headline if the
 * canonical copy changes.
 */
const ACCENT_PHRASE = "actually works";

/**
 * Services (#services) — name the four engagements
 * (docs/03-site-architecture.md row 6). Rebuilt in place to the
 * hero-derived design system (Redesign Unit 02): a transparent band
 * over the site's fixed scroll-synced video backdrop (owner
 * direction 2026-07-06 — the footage backs the whole page, so the
 * band mounts no video of its own). The display heading carries the
 * licensed over-imagery text shadow (docs/04-ux-spec.md §Typography —
 * shadows are banned on plain ink, licensed over footage). The four
 * engagements are elevated-glass cards (§Surfaces: translucent
 * #0a0a0c + backdrop blur, never opaque black) so they read over the
 * moving video. This replaces the paper-era accent-block cards
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
            className="max-w-4xl [text-shadow:0_2px_30px_rgba(0,0,0,0.5)]"
          >
            <span id="services-headline">
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
          {SERVICES.map((service, i) => (
            <ScrollReveal
              key={service.slug}
              delay={120 + i * 80}
              className="h-full"
            >
              {/* flex-col + mt-auto on the CTA row so the four CTAs
                  line up across cards whose copy runs to different
                  lengths. */}
              <div className="flex h-full flex-col border border-white/15 bg-[#0a0a0c]/95 p-6 backdrop-blur-xl transition-colors duration-150 hover:border-white/30 md:p-8">
                <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rotate-45 bg-gold"
                  />
                  {String(i + 1).padStart(2, "0")}
                </p>
                {/* One line at every breakpoint (owner direction
                    2026-08-04). nowrap is the guarantee; the xl step
                    back down to text-lg is what keeps that guarantee
                    from becoming an overflow. The 4-up grid starts at
                    xl, where cards are at their narrowest — at 20px
                    the longest name cleared the card by under 4px,
                    which the swap-in font fallback would have eaten.
                    At 18px it clears by ~24px. 1- and 2-up layouts
                    have room to spare and keep the larger size. */}
                {/* The name is the card's second affordance
                    (decision-log #30): the CTA below still opens the
                    modal on this service, and the name now opens the
                    service route at this service's block. Root-relative
                    by construction — `SERVICE_PAGE_HREF` builds every
                    href through `serviceBlockHref`, so nothing here is
                    a hand-written hash.

                    Deliberately not the §Interaction-vocabulary gold
                    text link: gold on the card heading would put a
                    second gold element above the gold CTA and spend the
                    page's one accent twice per card. It rests as the
                    white heading it already was under a white/25
                    hairline underline, and takes gold only on hover and
                    focus, where the accent is doing "you are here"
                    work. An underline adds no width, so the measured
                    one-line nowrap guarantee above still holds. */}
                <h3 className="mt-6 text-lg font-medium whitespace-nowrap text-white md:text-xl xl:text-lg">
                  <a
                    href={SERVICE_PAGE_HREF[service.slug]}
                    className="underline decoration-white/25 underline-offset-4 transition-colors duration-150 hover:text-gold hover:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {service.name}
                  </a>
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/70">
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
