import type { Metadata } from "next";
import { BrandWordmark } from "@/components/brand-wordmark";
import { PricingTiers } from "@/components/pricing-tiers";
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
const ACCENT_PHRASE = "upfront";

/**
 * `/pricing` — the site's one standalone route (decision-log #23,
 * 2026-08-25), now carrying the four tiers (**#25**). Pricing was owed
 * as a *section* under #16; the owner superseded that with a nav item
 * plus a separate page. A static route is not a backend, so #8 still
 * holds: `/api/qualify` remains the entire server-side footprint, and
 * **this page takes no payment and sells nothing directly. It
 * qualifies.**
 *
 * Nav and footer mount here rather than in `src/app/layout.tsx`, the
 * same way `page.tsx` does it, so the 404 keeps its own light paper
 * surface. `QualificationModalProvider` is already in the layout, so
 * every tier CTA reaches the modal without a second provider.
 *
 * `ScrollVideo` is deliberately **not** mounted: the cinematic backdrop
 * belongs to the home page, and its scroll range is measured from that
 * page's hero-plus-opaque region (decision-log #17). Nothing here
 * touches that contract.
 *
 * **The wordmark (Unit 22, unchanged).** The home page's above-the-fold
 * lockup belongs to the hero, not the nav — `site-nav.tsx` renders an
 * empty slot until 80px of scroll so the two never double up. This page
 * has no hero, so it renders that lockup itself, on the same gutter
 * ladder at the same `h-7` size, and the nav's takes over at the same
 * threshold exactly as on `/`. The nav is untouched and stays
 * route-agnostic.
 *
 * The zero-height sticky wrapper is load-bearing and predates the
 * tiers. The hero's lockup is `absolute` inside a stage sticky across
 * 160vh of runway, so it holds the top of the viewport long past the
 * 80px handoff. Reproduced as a plain `absolute` here, it would scroll
 * out at 52px while the nav's does not arrive until 80px — a 28px
 * window with no logo on screen. `h-0` keeps the wrapper out of the
 * flow (the lockup still paints at the hero's exact 24px offset) and
 * sticky pins it for the intro band's full height, so the handoff is
 * covered. Pure CSS, so no-JS behaves the same. It must stay the
 * section's **first child with no top padding above it** — the padding
 * lives on the content block, or the lockup would start 128px low.
 *
 * Not a link, deliberately: the fixed nav bar spans the top band at
 * `z-40` and would swallow every click on it, so a linked lockup here
 * would be a link that cannot be clicked. Going home is carried by the
 * nav's own wordmark past 80px, the footer's, and the menu.
 *
 * Server component throughout — the tier CTAs are the only interactive
 * parts and bring their own client boundary. The intro entrance is the
 * hero's load-time `rise-in` (motion-safe, reduced-motion parity), not
 * a scroll trigger, because this content is above the fold on arrival.
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
          className="relative flex w-full flex-col bg-ink"
        >
          <div className="sticky top-0 z-10 h-0">
            <header className="px-6 py-6 sm:px-8 lg:px-16">
              <BrandWordmark className="h-7 w-auto" />
            </header>
          </div>
          <div className="w-full px-6 pt-32 pb-16 sm:px-8 sm:pt-40 lg:px-16 lg:pt-48 lg:pb-20">
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
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 motion-safe:animate-rise-in md:text-lg [animation-delay:120ms]">
              {PRICING.intro}
            </p>
            {/* The commitment, at full-strength white against the /70
                intro and behind the system's gold list marker. It is
                deliberately not a muted footnote and not the gold-italic
                aside: a term that hides is the surprise invoice Brand
                Philosophy §6 rejects, and the aside is the hero's
                decorative device, not a disclosure treatment. */}
            <p className="mt-6 flex max-w-2xl gap-3 text-base leading-relaxed text-white motion-safe:animate-rise-in [animation-delay:200ms]">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
              />
              <span>{PRICING.term}</span>
            </p>
          </div>
        </section>
        <PricingTiers />
      </main>
      <SiteFooter />
    </>
  );
}
