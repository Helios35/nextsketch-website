import { BrandWordmark } from "@/components/brand-wordmark";
import { ModalTrigger } from "@/components/modal-trigger";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServiceCta } from "@/components/service-cta";
import { ServiceProcess } from "@/components/service-process";
import { FINAL_CTA, LANDING, NAV } from "@/content/copy";
import { PRICING } from "@/content/pricing";
import { SERVICE_PAGE_INCLUDED_LABEL } from "@/content/service-pages";
import { SERVICES_CTA } from "@/content/services";
import { ROUTES, type ServicePageContent } from "@/lib/types";

/**
 * Presentation marker, not copy: the qualification promise the close
 * turns on takes the gold payoff treatment (docs/04-ux-spec.md
 * §Typography). The same phrase `FinalCtaSection` accents on `/`, on
 * the same string. Degrades to an unaccented headline if the canonical
 * copy changes.
 */
const CLOSE_ACCENT_PHRASE = "right fit";

/** Shared measure for a block's supporting paragraph. */
const BODY_CLASS = "text-base leading-relaxed text-white/70 md:text-lg";

/**
 * A service route, whole — decision-log **#30** (2026-08-28). Both
 * pages are this component plus their own metadata; the routes are thin
 * for the reason `/pricing` is thin.
 *
 * **Four blocks, owner-specified (2026-08-28):** hero → the anchored
 * topic blocks → how it works → close. Nothing else. No proof band, no
 * FAQ, no testimonials, and **no price on the page** — three of those
 * have no approved content and the fourth is `/pricing`'s job, which
 * the close links to rather than restates.
 *
 * **The wordmark handoff is `/pricing`'s, reproduced exactly, and the
 * brief says so in as many words.** A page with no hero has to render
 * its own above-the-fold lockup, because `site-nav.tsx` renders an
 * empty slot until 80px of scroll so the two never double up. The
 * zero-height `sticky top-0` wrapper is **load-bearing and must not be
 * simplified**: `h-0` keeps it out of the flow so the lockup still
 * paints at the hero's exact 24px offset, and `sticky` pins it for the
 * intro band's full height. A plain `absolute` copy of `hero.tsx`'s
 * treatment scrolls out at 52px while the nav's does not arrive until
 * 80px, leaving a 28px window with no logo anywhere on screen —
 * `hero.tsx` gets away with `absolute` only because its stage is sticky
 * across 160vh of runway. Pure CSS, so no-JS behaves the same. It must
 * stay the section's **first child with no top padding above it**; the
 * padding lives on the content block, or the lockup starts 128px low.
 * The gutter padding sits on the anchor, not the `<header>`, so the
 * lockup keeps that 24px offset while the hit area clears the binding
 * 44px minimum. It links to `NAV.home`, reachable because the fixed bar
 * is `pointer-events-none` except on its own controls (#26).
 *
 * **`ScrollVideo` is not mounted** (#17): the backdrop's scroll range is
 * measured from the home page's hero-plus-opaque region, and nothing
 * here touches that contract. Two consequences, both handled rather
 * than inherited — the same pair the Work band and `/pricing` handle:
 * cards are **solid `#0a0a0c`** rather than §Surfaces' translucent-plus
 * blur (there is nothing behind them to blur), and headings carry **no
 * text shadow** (they sit on plain ink, where §Typography bans it).
 *
 * **Every href is root-relative.** A bare `#work` on a service route
 * resolves to nothing, and the brief calls this the trap the unit
 * multiplies. Nothing here writes a hash: `NAV.home` and `ROUTES` are
 * finished paths, block anchors are same-document, and inbound links
 * come from `serviceBlockHref`.
 *
 * **Conversion goes through the existing seam.** The hero and close use
 * `<ModalTrigger>`; each block uses `<ServiceCta>` — the gold underlined
 * text link of §Interaction vocabulary, which is what a service's CTA
 * already looks like on the home page's cards. Both carry the block's
 * `need` through the modal provider that is already in the layout. No
 * new mapping, no second modal entry point, no new CTA strings: the
 * hero and close are `LANDING.cta` / `FINAL_CTA.cta` and the blocks are
 * `SERVICES_CTA`, all three from the Rule 3.1 exhaustive set.
 *
 * Server component throughout. The CTAs bring their own client
 * boundary, so the pages prerender to static HTML. The hero entrance is
 * the load-time `rise-in` (motion-safe, reduced-motion parity), not a
 * scroll trigger, because it is above the fold on arrival; everything
 * below uses the shared `ScrollReveal` at the hero stagger.
 */
export function ServicePage({ page }: { page: ServicePageContent }) {
  /**
   * The `<h1>` falls back to the canonical name until the owner's
   * one-line promise lands (Rule 4.3 — canonical vocabulary rather than
   * a drafted placeholder heading). The accent is matched against the
   * string exactly as every section's `ACCENT_PHRASE` is, so an
   * unmatched phrase renders the heading un-accented instead of
   * breaking it.
   */
  const headline = page.headline ?? page.name;
  const accent = page.accentPhrase;
  const accentStart =
    accent === undefined ? -1 : headline.indexOf(accent);

  const closeHeadline = FINAL_CTA.headline;
  const closeAccentStart = closeHeadline.indexOf(CLOSE_ACCENT_PHRASE);

  return (
    <>
      <section
        aria-labelledby="service-headline"
        className="relative flex w-full flex-col bg-ink"
      >
        {/* Load-bearing. See the doc block — do not flatten the h-0
            sticky wrapper, and do not add padding above it. */}
        <div className="sticky top-0 z-10 h-0">
          <header>
            <a
              href={NAV.home}
              className="pointer-events-auto inline-flex px-6 py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-8 lg:px-16"
            >
              <BrandWordmark className="h-7 w-auto" />
            </a>
          </header>
        </div>
        <div className="w-full px-6 pt-32 pb-16 sm:px-8 sm:pt-40 lg:px-16 lg:pt-48 lg:pb-20">
          <SectionHeading
            as="h1"
            eyebrow={page.eyebrow}
            className="motion-safe:animate-rise-in"
          >
            <span id="service-headline">
              {accent === undefined || accentStart === -1 ? (
                headline
              ) : (
                <>
                  {headline.slice(0, accentStart)}
                  <span className="text-gold">{accent}</span>
                  {headline.slice(accentStart + accent.length)}
                </>
              )}
            </span>
          </SectionHeading>
          {/* Absent on the grouped route, which has no approved
              group-level description (Rule 4.3). */}
          {page.intro !== undefined && (
            <p
              className={`mt-8 max-w-2xl motion-safe:animate-rise-in [animation-delay:120ms] ${BODY_CLASS}`}
            >
              {page.intro}
            </p>
          )}
          <div className="mt-10 motion-safe:animate-rise-in [animation-delay:200ms]">
            <ModalTrigger variant="inverse" arrow need={page.need}>
              {LANDING.cta}
            </ModalTrigger>
          </div>
        </div>
      </section>

      {/* The anchored topic blocks. Each is a real <section id>, so
          `globals.css`'s `section[id] { scroll-margin-top: 5rem }`
          clears the fixed bar on a deep link with no extra CSS. */}
      <div className="w-full bg-ink px-6 sm:px-8 lg:px-16">
        <div className="grid gap-4">
          {page.blocks.map((block, i) => (
            <ScrollReveal key={block.id} delay={i === 0 ? 0 : 120}>
              <section
                id={block.id}
                aria-labelledby={`${block.id}-heading`}
                className="border border-white/15 bg-[#0a0a0c] p-6 transition-colors duration-150 hover:border-white/30 md:p-8 lg:p-10"
              >
                <div className="lg:flex lg:gap-12">
                  <div className="lg:w-1/2">
                    <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rotate-45 bg-gold"
                      />
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    {/* Panel display scale (§Typography), not the
                        section scale: this heading sits inside a card,
                        under the page's own <h1>. */}
                    <h2
                      id={`${block.id}-heading`}
                      className="mt-6 text-2xl font-medium tracking-tight text-balance text-white md:text-3xl"
                    >
                      {block.name}
                    </h2>
                    <p className={`mt-4 max-w-2xl ${BODY_CLASS}`}>
                      {block.description}
                    </p>
                    <div className="mt-8">
                      <ServiceCta
                        label={SERVICES_CTA}
                        need={block.need}
                        service={block.name}
                      />
                    </div>
                  </div>
                  {/* "What you get" — the pricing card's `Included`
                      list, reused. Owner-owed (Rule 4.3): a block with
                      no approved bullets renders no list *and no
                      frame*, so the card collapses to one column rather
                      than showing an empty half. Approved bullets drop
                      into `src/content/service-pages.ts` and nowhere
                      else. */}
                  {block.included.length > 0 && (
                    <div className="mt-10 lg:mt-0 lg:w-1/2">
                      <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55">
                        {SERVICE_PAGE_INCLUDED_LABEL}
                      </p>
                      <ul className="mt-4 space-y-3">
                        {block.included.map((item) => (
                          <li key={item} className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                            />
                            <span className="text-base leading-relaxed text-white/70">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ServiceProcess />

      <section
        aria-labelledby="service-close-headline"
        className="w-full bg-ink px-6 pb-28 sm:px-8 sm:pb-32 lg:px-16 lg:pb-44"
      >
        <ScrollReveal>
          <SectionHeading
            as="h2"
            eyebrow={FINAL_CTA.eyebrow}
            className="max-w-3xl"
          >
            <span id="service-close-headline">
              {closeAccentStart === -1 ? (
                closeHeadline
              ) : (
                <>
                  {closeHeadline.slice(0, closeAccentStart)}
                  <span className="text-gold">{CLOSE_ACCENT_PHRASE}</span>
                  {closeHeadline.slice(
                    closeAccentStart + CLOSE_ACCENT_PHRASE.length,
                  )}
                </>
              )}
            </span>
          </SectionHeading>
        </ScrollReveal>
        {/* The CTA repeated, and the one line to `/pricing`. The line is
            `PRICING.headline` itself rather than an authored connector:
            it is approved copy that says exactly what is on the other
            end, so the link's accessible name is its own destination and
            nothing is invented (Rule 4.3). */}
        <ScrollReveal
          delay={120}
          className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8"
        >
          <ModalTrigger variant="inverse" arrow need={page.need}>
            {FINAL_CTA.cta}
          </ModalTrigger>
          <a
            href={ROUTES.pricing}
            className="inline-flex min-h-11 items-center text-base font-medium text-gold underline underline-offset-4 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          >
            {PRICING.headline}
          </a>
        </ScrollReveal>
      </section>
    </>
  );
}
