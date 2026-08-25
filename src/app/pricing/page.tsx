import type { Metadata } from "next";
import { BrandWordmark } from "@/components/brand-wordmark";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { PRICING } from "@/content/pricing";

export const metadata: Metadata = {
  title: PRICING.title,
  description: PRICING.description,
};

/**
 * Presentation marker, not copy: the promise the page exists to make
 * takes the gold payoff treatment (docs/04-ux-spec.md §Typography — at
 * most a couple of accent words inside a white display heading).
 * Degrades to an unaccented headline if the copy changes.
 */
const ACCENT_PHRASE = "publish";

/**
 * `/pricing` — the site's one standalone route (decision-log #23,
 * 2026-08-25). Pricing was owed as a *section* under #16; the owner
 * superseded that with a nav item plus a separate page. A static route
 * is not a backend, so #8 still holds: `/api/qualify` remains the
 * entire server-side footprint.
 *
 * **Unit 22 ships this layout-final and empty.** Nav, footer, page
 * metadata, the ink surface, and heading-plus-body copy saying the
 * detail is coming — no prices, no tiers, no feature bullets, because
 * those are Unit 23's and inventing them is exactly what Rule 4.3
 * forbids. Copy lives in `src/content/pricing.ts` like every other
 * string on the site.
 *
 * Nav and footer mount here rather than in `src/app/layout.tsx`, the
 * same way `page.tsx` does it, so the 404 keeps its own light paper
 * surface. `QualificationModalProvider` is already in the layout, so
 * the modal works on this route without a second provider.
 *
 * `ScrollVideo` is deliberately **not** mounted: the cinematic backdrop
 * belongs to the home page, and its scroll range is measured from that
 * page's hero-plus-opaque region (decision-log #17). Nothing here
 * touches that contract.
 *
 * **The wordmark.** The home page's above-the-fold lockup belongs to
 * the hero, not the nav — `site-nav.tsx` deliberately renders an empty
 * slot until 80px of scroll so the two never double up. This page has
 * no hero, so it renders that lockup itself, on the same gutter ladder
 * at the same `h-7` size, and the nav's takes over at the same
 * threshold exactly as it does on `/`. The nav is untouched and stays
 * route-agnostic.
 *
 * The zero-height sticky wrapper is the one place this departs from a
 * literal copy of `hero.tsx`, and it is load-bearing. The hero's
 * lockup is `absolute` inside a stage that is sticky for 160vh of
 * runway, so it holds the top of the viewport long past the 80px
 * handoff. Reproduced as a plain `absolute` here, the lockup would
 * scroll out at 52px while the nav's does not arrive until 80px — a
 * 28px window with no logo on screen at all, which is the blink this
 * page exists to avoid. `h-0` keeps the wrapper out of the flow (the
 * lockup still paints at the hero's exact 24px offset), and sticky
 * pins it for the section's full viewport, so the handoff is covered.
 * Pure CSS, so no-JS visitors get the same behavior.
 *
 * Not a link, deliberately: the fixed nav bar spans the top band at
 * `z-40` and would swallow every click on it, so a linked lockup here
 * would be a link that cannot be clicked. Going home is carried by the
 * nav's own wordmark past 80px, the footer's, and the menu.
 *
 * Server component — the nav and the footer bring their own
 * interactivity, and the entrance is the hero's load-time `rise-in`
 * (motion-safe, reduced-motion parity), not a scroll trigger, because
 * this content is above the fold on arrival.
 */
export default function Pricing() {
  const headline = PRICING.headline;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <>
      <SiteNav />
      <main className="grow">
        <section
          aria-labelledby="pricing-headline"
          className="relative flex min-h-dvh w-full flex-col bg-ink"
        >
          <div className="sticky top-0 z-10 h-0">
            <header className="px-6 py-6 sm:px-8 lg:px-16">
              <BrandWordmark className="h-7 w-auto" />
            </header>
          </div>
          <div className="mt-auto w-full px-6 pb-16 sm:px-8 sm:pb-24 lg:px-16 lg:pb-28">
            <SectionHeading
              as="h1"
              eyebrow={PRICING.eyebrow}
              className="motion-safe:animate-rise-in"
            >
              <span id="pricing-headline">
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
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/70 motion-safe:animate-rise-in md:text-lg [animation-delay:120ms]">
              {PRICING.body}
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
