import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { SERVICES, SERVICES_EYEBROW, SERVICES_HEADLINE } from "@/content/services";

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
      className="w-full border-t border-white/10 px-6 py-24 sm:px-8 sm:py-28 lg:px-16 lg:py-36"
    >
      <div>
        <ScrollReveal>
          <SectionHeading
            index="02"
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
              <div className="h-full border border-white/15 bg-[#0a0a0c]/95 p-6 backdrop-blur-xl transition-colors duration-150 hover:border-white/30 md:p-8">
                <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rotate-45 bg-gold"
                  />
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-6 text-lg font-medium text-white md:text-xl">
                  {service.name}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-white/70">
                  {service.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
