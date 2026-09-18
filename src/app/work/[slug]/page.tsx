import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/arrow-icon";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Button } from "@/components/button";
import { CaseStudyPage } from "@/components/case-study-page";
import { PageGlow } from "@/components/page-glow";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import {
  CASE_STUDIES,
  findCaseStudy,
  findCaseStudyPage,
  otherCaseStudies,
} from "@/content/case-studies";
import { NAV } from "@/content/copy";
import { CASE_STUDY_PAGE } from "@/content/work";
import { ROUTES } from "@/lib/types";

/**
 * Next 16 hands a dynamic segment's `params` over as a promise.
 * Spelled out rather than the generated `PageProps<'/work/[slug]'>`
 * helper, because that type only exists after a build or `next dev`
 * has written `.next/types`, and CI runs `typecheck` before `build`.
 */
type CaseStudyRouteProps = {
  params: Promise<{ slug: string }>;
};

/**
 * One route per case study, prerendered at build from the same list
 * the cards render (decision-log #39). Adding a study to
 * `src/content/case-studies/` adds its route; nothing here changes.
 */
export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }));
}

/**
 * A segment no module declares is a 404, answered before any render.
 * With the default (`true`) an unknown slug would be rendered on
 * demand on the server first — a request-time function for a page that
 * cannot exist, on a site whose only server surface is `/api/qualify`
 * (#8). `false` keeps every case study route static and sends
 * `/work/does-not-exist` straight to the site's own `not-found.tsx`.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CaseStudyRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  if (study === undefined) notFound();
  return { title: study.title, description: study.description };
}

/**
 * `/work/[slug]` — a case study's own route (decision-log **#39**,
 * 2026-09-12; **#43**, 2026-09-18).
 *
 * **A study with a page renders it; a study without one renders the
 * placeholder below.** The page is `CaseStudyPage`, the owner's own
 * composition on the design system, fed by the study's `page` content
 * (`findCaseStudyPage`); today Mascot has one and the other three do
 * not, and they are untouched until the owner supplies their material.
 * The placeholder is what every study rendered from #39 until #43:
 * nav, footer, the study's metadata, the dark surface, its name and
 * summary, and body copy saying the detail is coming. No narrative,
 * results, metrics, client names or quotes are invented to stand in
 * (Rule 4.3).
 *
 * Two exits, both navigation rather than conversion CTAs: back to
 * `/work`, and out to the study's published page (`sourceHref`, the
 * Behance case study the home cards used to open directly). The second
 * is what keeps the card reroute (#39) from being a dead end while the
 * room is empty — the published page is one hop away, not gone — and
 * it renders only when a study has one.
 *
 * `findCaseStudy` answers an unknown slug with `undefined` and the
 * route answers that with `notFound()`, which reaches the root
 * `not-found.tsx` — the site 404 on its light paper surface, not a
 * crashed page and not an empty shell. `dynamicParams = false` above
 * means that path is never taken for a prerendered build; it stays as
 * the type narrowing and as the guard should the flag ever flip.
 *
 * **Everything `/pricing` solved is reproduced, not re-derived** — see
 * `src/app/work/page.tsx` for the full account: nav and footer mounted
 * by the page, never the layout; `ScrollVideo` not mounted (#17); the
 * `ink` ground under the fixed gold glow (#35); no text shadow; and the
 * zero-height `sticky top-0` wordmark wrapper, load-bearing, first
 * child, no padding above it. The one difference is `min-h-dvh` on the
 * band: with so little content the footer would otherwise sit halfway
 * up a tall viewport, and the band the template will fill is at least
 * a screen. Every href is root-relative — `NAV.home`, `ROUTES.work` —
 * so all of them resolve from this route (build-note 22).
 *
 * Entrance is the hero's load-time `rise-in` at 0 / 120 / 200 / 280ms,
 * inline delays (unit 27), because all of it is above the fold.
 *
 * Server component; the page prerenders to static HTML and #8 holds.
 */
export default async function CaseStudyRoute({ params }: CaseStudyRouteProps) {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  if (study === undefined) notFound();

  const page = findCaseStudyPage(slug);
  if (page !== undefined) {
    return (
      <CaseStudyPage
        study={study}
        page={page}
        others={otherCaseStudies(slug)}
      />
    );
  }

  return (
    <>
      {/* The viewport-fixed gold glow (#35). The band below is
          transparent so it shows through — the page's ground is the
          layout's `ink`. */}
      <PageGlow />
      <SiteNav />
      <main className="grow">
        <section
          aria-labelledby="case-study-headline"
          className="relative flex min-h-dvh w-full flex-col"
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
          <div className="w-full px-6 pt-32 pb-24 sm:px-8 sm:pt-40 sm:pb-28 lg:px-16 lg:pt-48 lg:pb-32">
            {/* The route back to the grid, in the footer anchors' mono
                micro-label voice with the shared arrow reversed — the
                rail's "previous" control does the same. Navigation, so
                it reads as navigation and not as a CTA. */}
            <a
              href={ROUTES.work}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.14em] text-white/60 uppercase transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:animate-rise-in"
            >
              <ArrowIcon className="size-4 rotate-180" />
              {CASE_STUDY_PAGE.back}
            </a>
            <SectionHeading
              as="h1"
              eyebrow={CASE_STUDY_PAGE.eyebrow}
              className="mt-6 max-w-3xl motion-safe:animate-rise-in"
            >
              <span id="case-study-headline">{study.name}</span>
            </SectionHeading>
            <p
              className="mt-8 max-w-2xl text-base leading-relaxed text-white/70 motion-safe:animate-rise-in md:text-lg"
              style={{ animationDelay: "120ms" }}
            >
              {study.summary}
            </p>
            {/* The placeholder's one line, at full-strength white behind
                the system's gold list marker — the `/pricing` term's
                treatment, because this is a disclosure ("not here yet")
                and not a decorative aside. */}
            <p
              className="mt-6 flex max-w-2xl gap-3 text-base leading-relaxed text-white motion-safe:animate-rise-in"
              style={{ animationDelay: "200ms" }}
            >
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
              />
              <span>{CASE_STUDY_PAGE.pending}</span>
            </p>
            {study.sourceHref !== undefined && (
              <div
                className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-rise-in"
                style={{ animationDelay: "280ms" }}
              >
                {/* Ghost, not the white advance: leaving the site to
                    read the published page is the de-emphasized action
                    (§Interaction vocabulary), exactly as the rail's
                    View all card reasons. Opens in a new tab as the
                    cards did when they carried this link. */}
                <Button
                  variant="ghost"
                  arrow
                  href={study.sourceHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  {CASE_STUDY_PAGE.source}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
