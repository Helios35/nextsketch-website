import type { Metadata } from "next";
import { BrandWordmark } from "@/components/brand-wordmark";
import { PageGlow } from "@/components/page-glow";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { WorkGrid } from "@/components/work-grid";
import { CASE_STUDIES } from "@/content/case-studies";
import { NAV } from "@/content/copy";
import { WORK_PAGE } from "@/content/work";

export const metadata: Metadata = {
  title: WORK_PAGE.title,
  description: WORK_PAGE.description,
};

/**
 * Presentation marker, not copy: the proof the page exists to land
 * takes the gold payoff treatment (docs/04-ux-spec.md §Typography — at
 * most a couple of accent words inside a white display heading). The
 * same phrase `WorkSection` accents on `/`, on the same string, since
 * the page reuses the band's headline. Degrades to an unaccented
 * headline if the copy changes.
 */
const ACCENT_PHRASE = "Real Products";

/**
 * `/work` — the case study grid (decision-log **#39**, 2026-09-12).
 * The home page's proof band shows the work; this is the page behind
 * its "View all". Every study in `src/content/case-studies/` renders
 * here as the band's own card in its `tile` variant, and every tile
 * lands on that study's `/work/<slug>` route.
 *
 * **`/work` and `#work` are a character apart and mean different
 * things (#40).** The nav's Work item is still `/#work`, the band on
 * the home page; this page is reached from the band's control, not
 * from the nav, and it is not a nav item. Do not "fix" either.
 *
 * A static route is not a backend, so #8 still holds: this page
 * prerenders to HTML, sells nothing, and `/api/qualify` remains the
 * entire server-side footprint. No CMS (#41): the content is the repo.
 *
 * **Everything `/pricing` solved is reproduced, not re-derived.** Nav
 * and footer mount here rather than in `src/app/layout.tsx`, so the
 * 404 keeps its own light paper surface. `ScrollVideo` is deliberately
 * **not** mounted: the backdrop belongs to the home page and its scroll
 * range is measured from that page's hero-plus-opaque region (#17). The
 * page ground is the layout's `ink` under the viewport-fixed gold glow
 * (`page-glow.tsx`, #35), the same chrome every route without the
 * footage now carries, so the bands below are transparent to let it
 * through. Headings take **no text shadow** (plain ink, where
 * §Typography bans it) and cards are solid `surface` (nothing behind
 * them to blur) — the Work band's pair of consequences.
 *
 * **The wordmark.** `site-nav.tsx` renders an empty slot until 80px of
 * scroll so the two never double up; a page with no hero renders the
 * above-the-fold lockup itself, on the same gutter at the same `h-7`.
 * The zero-height `sticky top-0` wrapper is load-bearing and must not
 * be simplified: `h-0` keeps it out of the flow so the lockup paints at
 * the hero's exact 24px offset, and sticky pins it for the intro band's
 * full height so the handoff is covered. A plain `absolute` copy
 * scrolls out at 52px while the nav's does not arrive until 80px — a
 * 28px window with no logo on screen (build-note 22). It must stay the
 * section's **first child with no top padding above it**; the padding
 * lives on the content block. It links to `NAV.home`, reachable
 * because the fixed bar is `pointer-events-none` except on its own
 * controls (#26).
 *
 * The intro band reuses the band's eyebrow, headline and supporting
 * line through `WORK_PAGE` rather than drafting a second set (Rule 4.1;
 * a page-specific line is an owner call). Entrance is the hero's
 * load-time `rise-in` at 0 / 120ms, inline delays (unit 27), because
 * the band is above the fold on arrival.
 *
 * Server component throughout; the tiles bring their own client
 * boundary, so the page prerenders to static HTML.
 */
export default function Work() {
  const headline = WORK_PAGE.headline;
  const phraseStart = headline.indexOf(ACCENT_PHRASE);

  return (
    <>
      {/* The viewport-fixed gold glow (#35). The bands below are
          transparent so it shows through — the page's ground is the
          layout's `ink`. */}
      <PageGlow />
      <SiteNav />
      <main className="grow">
        <section
          aria-labelledby="work-page-headline"
          className="relative flex w-full flex-col"
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
              eyebrow={WORK_PAGE.eyebrow}
              className="max-w-3xl motion-safe:animate-rise-in"
            >
              <span id="work-page-headline">
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
            <p
              className="mt-8 max-w-xl text-base leading-relaxed text-white/70 motion-safe:animate-rise-in md:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              {WORK_PAGE.intro}
            </p>
          </div>
        </section>
        <WorkGrid items={CASE_STUDIES} />
      </main>
      <SiteFooter />
    </>
  );
}
