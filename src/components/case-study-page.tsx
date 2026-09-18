import type { CSSProperties } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Button } from "@/components/button";
import { CaseStudyLink } from "@/components/case-study-link";
import { CaseStudyRenderImage } from "@/components/case-study-render";
import { CloseBand } from "@/components/close-band";
import { PageGlow } from "@/components/page-glow";
import { Parallax } from "@/components/parallax";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { WorkGrid } from "@/components/work-grid";
import { CASE_STUDIES } from "@/content/case-studies";
import { NAV } from "@/content/copy";
import { SERVICES, SERVICE_NEED } from "@/content/services";
import {
  CASE_STUDY_PAGE,
  PLATFORM_BADGES,
  WORK_INTRO,
  WORK_VIEW_ALL,
} from "@/content/work";
import { ROUTES } from "@/lib/types";
import type {
  CaseStudy,
  CaseStudyPageContent,
  CaseStudyRender,
  RenderAnnotation,
} from "@/lib/types";

/** The binding gutter ladder (§Layout), on every band of this page. */
const GUTTERS = "px-6 sm:px-8 lg:px-16";

/**
 * The content measure the service routes settled on (owner direction,
 * 2026-08-30; `service-page.tsx` records why), generalized to this
 * page as a judgment call: the bands stay full-width on the gutter
 * ladder and their content stops at the same two edges. Without it the
 * panel's two-column row spreads across a wide viewport, the render
 * against one gutter and the copy against the other, which is the
 * failure the measure was introduced to stop. The consequence is that
 * the "Other projects" tiles stop at the measure while `/work`'s grid
 * runs to the gutters. The wordmark lockup stays outside it, on the
 * viewport gutter, for the 80px handoff.
 */
const MEASURE = "mx-auto w-full max-w-6xl";

/** Body copy at the site's reading step. */
const BODY = "text-base leading-relaxed text-white/70 md:text-lg";

/** The mono micro-label (§Typography), laid out to take the marker. */
const LABEL =
  "flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] text-white/55 uppercase";

/** The gold diamond, the system's list and label marker. */
const DIAMOND = "h-1.5 w-1.5 shrink-0 rotate-45 bg-gold";

/**
 * A chip (decision-log #44): this system's "pill" is squared. The
 * hairline ink surface (`white/15` on the `white/[0.03]` fill: the
 * input, the frame) at the mono micro-label's face, with the selection
 * tab's `white/90` so it reads as a value rather than a caption. No
 * rounding, no fill colour, no icon: §Interaction vocabulary ends "no
 * pills", and this is the badge that vocabulary allows. Not
 * interactive, so the 44px rule does not bind it.
 */
const CHIP =
  "inline-flex items-center border border-white/15 bg-white/[0.03] px-2.5 py-1 font-mono text-[0.7rem] tracking-[0.14em] text-white/90 uppercase";

/** Panel-scale heading (§Typography), the service rows' `<h2>` exactly. */
const PANEL_HEADING =
  "text-2xl font-medium tracking-tight text-balance text-white md:text-3xl";

/**
 * The owner's stagger: the left device sits lower than the right by
 * this share of its own width (`pt-[30%]` on its column, a fifth of
 * the box's height). The class and this number must agree.
 */
const STAGGER = 30;

/**
 * `sizes` hints, one per slot, describing the **visible box** each
 * render is laid out in (`CaseStudyRenderImage` scales them for the
 * canvas). Each names the widest the box can be at that breakpoint, so
 * the browser never under-fetches; `next/image` caps at the file's
 * width, which is where most of these land.
 */
const HERO_SIZES = "(min-width: 864px) 24rem, calc(50vw - 2.5rem)";
const POPOUT_SIZES = "(min-width: 864px) 14rem, calc(29vw - 1.5rem)";
const PANEL_SIZES = "(min-width: 640px) 26rem, calc(100vw - 6rem)";
const SCREEN_SIZES = "(min-width: 1280px) 11rem, (min-width: 640px) 30vw, 45vw";
const HARDWARE_SIZES =
  "(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 70vw";
const WIDE_SIZES = "(min-width: 768px) 42rem, calc(100vw - 3rem)";
/**
 * The other-projects tiles sit inside the measure, so from `xl:` a tile
 * is a third of 72rem less the gaps (about 373px), not a third of the
 * viewport as on `/work`; the grid's own ladder would over-fetch there.
 */
const TILE_SIZES =
  "(min-width: 1280px) 24rem, (min-width: 768px) 50vw, 100vw";

interface CaseStudyPageProps {
  study: CaseStudy;
  page: CaseStudyPageContent;
  /** The other studies, in list order, for the "Other projects" band. */
  others: readonly CaseStudy[];
}

/**
 * A case study's page (decision-log **#43**, 2026-09-18): the owner's
 * own example for Mascot, built on the design system. The composition
 * is his, top to bottom; every surface, face, alpha stop, control and
 * tempo is this system's, and the copy is content. Where his example
 * is a white raised card, this is the site's elevated card; where it
 * bakes hardware labels into a bitmap, this rebuilds them in the mono
 * face; where his inspiration counts screens and modules in big
 * numerals, this shows the screens, because a number nobody approved
 * is Rule 4.3.
 *
 * **Chrome is `/pricing`'s, reproduced, not re-derived** (the account
 * is in `src/app/work/page.tsx`): nav and footer mounted here, the
 * `ink` ground under the fixed gold glow (#35, #39), no `ScrollVideo`
 * (#17), no text shadow, solid `surface` where a card is used, and the
 * zero-height `sticky top-0` wordmark wrapper, load-bearing, first
 * child, no padding above it. Every href is root-relative. Bands are
 * full-width on the gutter ladder with their content on the service
 * routes' measure (`MEASURE`, a flagged judgment call).
 *
 * **The renders are cut-outs, not screenshots.** Each is laid out by
 * its own visible bounding box (`CaseStudyRenderImage`), on the page,
 * at its own proportions, with no frame, no fade and no crop. The hero
 * pair sinks into the panel: the panel comes after them in the DOM,
 * sits above them (`z-10`) and pulls up over their lower part, so its
 * edge cuts across them the way the owner's card does, and the mascot
 * render (`z-20`, a sibling of the left device's box, never inside it)
 * steps out over that edge. Nothing on the row or the columns carries
 * a transform or a z-index of its own: a stacking context there would
 * trap the mascot under the panel for the length of the entrance and
 * release it after, a visible pop. The mascot rides the page's one
 * `Parallax` at the shared whisper, drifting against a device that
 * does not move, which is what reads as stepping out.
 *
 * **Motion is the shipped vocabulary and nothing else.** The header,
 * headline and hero renders enter on the load-time `rise-in` at 0 /
 * 120 / 200 / 280ms, inline delays (unit 27), because they are above
 * the fold; every band below reveals through `ScrollReveal` at the
 * hero stagger, the panel's bullets at the service rows' `120 +
 * j·70ms`, callouts and screens at `120 + i·80ms`. The panel
 * surface itself is never inside a reveal (its content
 * is), so its edge is on the server render and the overlap reads on
 * arrival. No keyframe was added; `globals.css` is untouched. Reduced
 * motion and no-JS get the static page.
 *
 * **Conversion is the existing seam:** the page ends on `CloseBand`,
 * the service routes' close, with the study's service carried into the
 * modal. Every other control is navigation ("All work", "View on
 * Behance", "View all") and reads as navigation.
 *
 * Server component; the reveals, the drift and the tiles bring their
 * own client boundaries, so the route prerenders to static HTML.
 */
export function CaseStudyPage({ study, page, others }: CaseStudyPageProps) {
  const service = SERVICES.find((entry) => entry.slug === page.service);
  const need = SERVICE_NEED[page.service];
  const accent = page.accentPhrase;
  const accentStart = accent === undefined ? -1 : page.headline.indexOf(accent);
  const [leftRender, rightRender] = page.hero.renders;
  const popout = page.hero.popout;
  const statement = page.panel.heading ?? study.summary;
  /* The pop-out's `top` is a share of the left device's box height,
     but CSS resolves `top` against the column's height, which is the
     box plus the stagger padding above it (a share of the width). So
     the share is converted through the box's own ratio. */
  const leftBox = leftRender.window ?? {
    x0: 0,
    y0: 0,
    x1: leftRender.width - 1,
    y1: leftRender.height - 1,
  };
  const leftRatio =
    (leftBox.y1 - leftBox.y0 + 1) / (leftBox.x1 - leftBox.x0 + 1);
  const popoutTop =
    popout === undefined
      ? 0
      : ((STAGGER + popout.top * leftRatio) / (STAGGER + 100 * leftRatio)) *
        100;

  return (
    <>
      {/* The viewport-fixed gold glow (#35). Every band below is
          transparent so it shows through; the page's ground is the
          layout's `ink`. */}
      <PageGlow />
      <SiteNav />
      <main className="grow">
        <section
          aria-labelledby="case-study-headline"
          className="relative flex w-full flex-col"
        >
          {/* Load-bearing. See `src/app/work/page.tsx`: do not flatten
              the h-0 sticky wrapper, and do not add padding above it. */}
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

          <div className={`w-full ${GUTTERS} pt-32 sm:pt-40 lg:pt-48`}>
            <div className={MEASURE}>
              {/* The route back to the grid, in the footer anchors' mono
                voice with the shared arrow reversed. Navigation, so it
                reads as navigation and not as a CTA. */}
              <a
                href={ROUTES.work}
                className="inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-[0.14em] text-white/60 uppercase transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-safe:animate-rise-in"
              >
                <ArrowIcon className="size-4 rotate-180" />
                {CASE_STUDY_PAGE.back}
              </a>

              {/* The header row, the owner's lockup: the study's name at
                the panel scale over its one-line summary and the
                chips, with the off-site links pinned right from `sm:`
                (the §Layout two-column row). The name is not the
                `<h1>`; the headline below is, and it carries the name. */}
              <div
                className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between motion-safe:animate-rise-in"
                style={{ animationDelay: "120ms" }}
              >
                <div>
                  <p className={LABEL}>{CASE_STUDY_PAGE.eyebrow}</p>
                  <p className={`mt-3 ${PANEL_HEADING}`}>{study.name}</p>
                  <p className={`mt-2 max-w-xl ${BODY}`}>{study.summary}</p>
                  {/* The service the work was, then its platforms
                    (decision-log #44): the owner's two example chips
                    in the site's own vocabulary, Taxonomy §1's service
                    name and the fixed badge set. */}
                  <ul
                    role="list"
                    aria-label={CASE_STUDY_PAGE.chipsLabel}
                    className="mt-5 flex flex-wrap gap-2"
                  >
                    {service !== undefined && (
                      <li className={CHIP}>{service.name}</li>
                    )}
                    {page.badges.map((badge) => (
                      <li key={badge} className={CHIP}>
                        {PLATFORM_BADGES[badge]}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* "Visit website" renders only for a live project (owner
                  rule, #44); "View on Behance" whenever the study has a
                  published page. Both leave the site, so both take the
                  gold text link with the outward arrow. */}
                {(page.liveHref !== undefined ||
                  study.sourceHref !== undefined) && (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:justify-end">
                    {page.liveHref !== undefined && (
                      <CaseStudyLink
                        href={page.liveHref}
                        hint={CASE_STUDY_PAGE.newTab}
                      >
                        {CASE_STUDY_PAGE.visit}
                      </CaseStudyLink>
                    )}
                    {study.sourceHref !== undefined && (
                      <CaseStudyLink
                        href={study.sourceHref}
                        hint={CASE_STUDY_PAGE.newTab}
                      >
                        {CASE_STUDY_PAGE.source}
                      </CaseStudyLink>
                    )}
                  </div>
                )}
              </div>

              {/* The headline: the owner's line at the hero scale,
                centred, one gold payoff phrase (§Typography). The only
                `<h1>`. */}
              <div
                className="mx-auto mt-16 max-w-5xl sm:mt-20 lg:mt-24 motion-safe:animate-rise-in"
                style={{ animationDelay: "200ms" }}
              >
                <SectionHeading as="h1" size="hero" align="center">
                  <span id="case-study-headline">
                    {accent === undefined || accentStart === -1 ? (
                      page.headline
                    ) : (
                      <>
                        {page.headline.slice(0, accentStart)}
                        <span className="text-gold">{accent}</span>
                        {page.headline.slice(accentStart + accent.length)}
                      </>
                    )}
                  </span>
                </SectionHeading>
              </div>
            </div>
          </div>
        </section>

        {/* The hero pair and the panel. See the doc block for the
            layering. The row is capped at two 24rem boxes plus the gap,
            and every offset below is a share of a box's width, so the
            composition holds from 360px up and the cut lands at the
            same place on the device at every width: the left device
            sits a fifth of its height lower than the right (the
            owner's stagger), and the panel's edge crosses it just
            under the mascot's screen. The margin steps at the row's
            cap, not at a breakpoint, because a percentage margin
            resolves against the measure, not the row: below 864px the
            row is the measure, so the share is exact; from 864px the
            row is capped at 50rem and the value is that geometry in
            rem (a first cut stepped at `md:` and `lg:` and let the
            edge drift down the devices between 800 and 1023px). */}
        <div className={`w-full ${GUTTERS} pt-16 sm:pt-20 lg:pt-24`}>
          <div className={MEASURE}>
            <div className="mx-auto grid w-full max-w-[50rem] grid-cols-2 gap-4 sm:gap-8">
              <div className="relative pt-[30%]">
                <div
                  className="motion-safe:animate-rise-in"
                  style={{ animationDelay: "200ms" }}
                >
                  <CaseStudyRenderImage
                    render={leftRender}
                    sizes={HERO_SIZES}
                    priority
                  />
                </div>
                {popout !== undefined && (
                  /* A sibling of the windowed box, not a child: the box
                   clips to its window. Placed and sized as shares of
                   the box (below), so the head registers on the
                   mascot drawn on the screen at every width; the
                   lower orbs reach past the panel's edge. `z-20` puts
                   it above the panel; the wrapper's own entrance
                   animation is on this element, so no ancestor forms
                   a stacking context around it. */
                  <div
                    className="absolute z-20 motion-safe:animate-rise-in"
                    style={{
                      left: `${popout.left}%`,
                      top: `${popoutTop.toFixed(2)}%`,
                      width: `${popout.width}%`,
                      animationDelay: "280ms",
                    }}
                  >
                    <Parallax speed={0.06} maxShift={20}>
                      <CaseStudyRenderImage
                        render={popout.render}
                        sizes={POPOUT_SIZES}
                        priority
                      />
                    </Parallax>
                  </div>
                )}
              </div>
              <div
                className="motion-safe:animate-rise-in"
                style={{ animationDelay: "280ms" }}
              >
                <CaseStudyRenderImage
                  render={rightRender}
                  sizes={HERO_SIZES}
                  priority
                />
              </div>
            </div>

            {/* The panel: the owner's white card as the site's elevated
              card (§Surfaces): the row recipe's `white/15` hairline and
              solid `surface`, squared, plus the one depth token the
              spec allows on an elevated card, `--shadow-modal`, so the
              seam the devices sink into reads as a raised edge on ink
              rather than a 4% lift. The panel interior padding step
              (§Layout), and the top padding clears the mascot's
              overhang. */}
            <section
              aria-labelledby="case-study-panel-heading"
              className="relative z-10 -mt-[43%] border border-white/15 bg-surface px-6 pt-[calc(22%_+_3rem)] pb-12 [box-shadow:var(--shadow-modal)] min-[864px]:-mt-[20.8rem] min-[864px]:pt-52 md:px-10 md:pb-16"
            >
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
                <ScrollReveal className="mx-auto w-full max-w-[26rem] min-w-0 lg:mx-0">
                  <CaseStudyRenderImage
                    render={page.panel.render}
                    sizes={PANEL_SIZES}
                  />
                </ScrollReveal>
                <div className="min-w-0">
                  <ScrollReveal delay={120}>
                    <p className={LABEL}>
                      <span aria-hidden="true" className={DIAMOND} />
                      {page.panel.eyebrow}
                    </p>
                    {/* The ratified one-line description of the product,
                      at the panel scale: the inspiration's concept
                      heading, said with approved words. */}
                    <h2
                      id="case-study-panel-heading"
                      className={`mt-5 max-w-lg ${PANEL_HEADING}`}
                    >
                      {statement}
                    </h2>
                    <p className={`mt-4 max-w-lg ${BODY}`}>{page.panel.body}</p>
                  </ScrollReveal>
                  {/* The inspiration's check-bulleted points, on the
                    system's list marker, at the service rows' list
                    rhythm. */}
                  <ul role="list" className="mt-8 max-w-lg space-y-4">
                    {page.panel.bullets.map((item, j) => (
                      <li key={item}>
                        <ScrollReveal
                          delay={120 + j * 70}
                          className="flex gap-4"
                        >
                          <span
                            aria-hidden="true"
                            className={`mt-2.5 ${DIAMOND}`}
                          />
                          <span className="text-base leading-relaxed text-white/70">
                            {item}
                          </span>
                        </ScrollReveal>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {page.panel.question !== undefined && (
                /* The owner's question, in the slot he drew it in
                 (centred under the render row), answered with the one
                 approved line about the screens and the screens
                 themselves. The six-up row waits for `xl:`, where a
                 cell is under the files' own width; three across holds
                 through `lg:`. */
                <div className="mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-16">
                  <ScrollReveal className="mx-auto max-w-3xl">
                    <SectionHeading as="h3" align="center">
                      {page.panel.question.heading}
                    </SectionHeading>
                    {/* The proof band's own line unless the study says
                      otherwise: the one approved sentence about the
                      screens, on the band that shows them. */}
                    <p className={`mx-auto mt-6 max-w-2xl text-center ${BODY}`}>
                      {page.panel.question.body ?? WORK_INTRO}
                    </p>
                  </ScrollReveal>
                  <ul
                    role="list"
                    className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:mt-16 xl:grid-cols-6"
                  >
                    {page.panel.question.screens.map((item, i) => (
                      <li key={item.render.src}>
                        <ScrollReveal delay={120 + (i % 6) * 80}>
                          <CaseStudyRenderImage
                            render={item.render}
                            sizes={SCREEN_SIZES}
                          />
                          <p className={`mt-4 justify-center ${LABEL}`}>
                            {item.caption}
                          </p>
                        </ScrollReveal>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        </div>

        {page.hardware !== undefined && (
          <section
            aria-labelledby="case-study-hardware-heading"
            className={`w-full ${GUTTERS} pt-24 sm:pt-28 lg:pt-36`}
          >
            <div className={MEASURE}>
              <ScrollReveal className="mx-auto max-w-3xl">
                <SectionHeading
                  as="h2"
                  eyebrow={page.hardware.eyebrow}
                  align="center"
                >
                  <span id="case-study-hardware-heading">
                    {page.hardware.heading}
                  </span>
                </SectionHeading>
                <p className={`mx-auto mt-6 max-w-2xl text-center ${BODY}`}>
                  {page.hardware.body}
                </p>
              </ScrollReveal>
              <AnnotatedRender
                render={page.hardware.render}
                annotations={page.hardware.annotations}
              />
              {page.hardware.back !== undefined && (
                <ScrollReveal className="mx-auto mt-16 w-full max-w-2xl md:mt-24">
                  <CaseStudyRenderImage
                    render={page.hardware.back.render}
                    sizes={WIDE_SIZES}
                  />
                  <p className={`mt-6 justify-center ${LABEL}`}>
                    <span aria-hidden="true" className={DIAMOND} />
                    {page.hardware.back.caption}
                  </p>
                </ScrollReveal>
              )}
            </div>
          </section>
        )}

        {/* Owns its top air, so a study with no hardware band does not
            butt this against the panel. */}
        <section
          aria-labelledby="case-study-closing-heading"
          className={`w-full ${GUTTERS} pt-24 pb-24 sm:pt-28 sm:pb-28 lg:pt-36 lg:pb-32`}
        >
          <div className={MEASURE}>
            <ScrollReveal className="mx-auto max-w-3xl">
              <SectionHeading
                as="h2"
                eyebrow={page.closing.eyebrow}
                align="center"
              >
                <span id="case-study-closing-heading">
                  {page.closing.heading}
                </span>
              </SectionHeading>
              <p className={`mx-auto mt-6 max-w-2xl text-center ${BODY}`}>
                {page.closing.body}
              </p>
            </ScrollReveal>
            <ScrollReveal
              delay={120}
              className="mx-auto mt-12 w-full max-w-2xl md:mt-16"
            >
              <CaseStudyRenderImage
                render={page.closing.render}
                sizes={WIDE_SIZES}
              />
            </ScrollReveal>
          </div>
        </section>

        {others.length > 0 && (
          /* The grid, extended with a visible heading, the archive
             control and the studies' own numbers rather than forked
             (decision-log #43). The tiles are the band's card, so a
             study looks the same here as on `/` and `/work`. Three
             tiles on the count ladder leave one alone on its row from
             `md:` to `xl:`, the ladder's documented honest degradation. */
          <WorkGrid
            items={others}
            headingId="case-study-others-heading"
            eager={false}
            numbering={(item) =>
              CASE_STUDIES.findIndex((entry) => entry.slug === item.slug)
            }
            sizes={TILE_SIZES}
            className={`w-full ${GUTTERS} pt-24 pb-8 sm:pt-28 lg:pt-32 lg:pb-12`}
            contentClassName={MEASURE}
            heading={
              <ScrollReveal className="mb-12 md:mb-16">
                <SectionHeading
                  as="h2"
                  eyebrow={CASE_STUDY_PAGE.othersEyebrow}
                  className="max-w-3xl"
                >
                  <span id="case-study-others-heading">
                    {CASE_STUDY_PAGE.othersHeading}
                  </span>
                </SectionHeading>
              </ScrollReveal>
            }
          >
            {WORK_VIEW_ALL.href !== undefined && (
              /* Ghost, not the white advance: browsing to the archive
                 is the de-emphasized action, as the rail's trailing
                 card reasons. */
              <ScrollReveal delay={120} className="mt-10">
                <Button variant="ghost" arrow href={WORK_VIEW_ALL.href}>
                  {WORK_VIEW_ALL.label}
                </Button>
              </ScrollReveal>
            )}
          </WorkGrid>
        )}

        <CloseBand
          headingId="case-study-close-headline"
          need={need}
          className="pt-24 sm:pt-28 lg:pt-36"
          contentClassName={MEASURE}
        />
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * Where a callout sits on the annotation stage, per side, as class
 * literals (Tailwind compiles only what it can read). The feature's
 * place in the render's box rides two custom properties, `--x` and
 * `--y` (percent), and the stage geometry is fixed per layout: from
 * `lg:` the render takes 42% of the stage, so its left edge is at 29%
 * and a feature at `x` sits at `29% + x·0.42%`; from `sm:` it takes 50%
 * from 25%; below, 70% from 15%. A side label runs from the stage edge
 * to the feature; a top or bottom label hangs off it on a short stem.
 */
const WIDE_POSITION: Record<RenderAnnotation["side"], string> = {
  left: "lg:left-0 lg:top-[calc(var(--y)_*_1%)] lg:w-[calc(29%_+_var(--x)_*_0.42%)] lg:-translate-y-1/2",
  right:
    "lg:right-0 lg:top-[calc(var(--y)_*_1%)] lg:w-[calc(71%_-_var(--x)_*_0.42%)] lg:-translate-y-1/2",
  top: "lg:left-[calc(29%_+_var(--x)_*_0.42%)] lg:bottom-[calc(100%_-_var(--y)_*_1%)] lg:-translate-x-1/2",
  bottom:
    "lg:left-[calc(29%_+_var(--x)_*_0.42%)] lg:top-[calc(var(--y)_*_1%)] lg:-translate-x-1/2",
};
const WIDE_FLOW: Record<RenderAnnotation["side"], string> = {
  left: "lg:w-full lg:flex-row",
  right: "lg:w-full lg:flex-row-reverse",
  top: "lg:flex-col",
  bottom: "lg:flex-col-reverse",
};
const NARROW_POSITION =
  "left-[calc(15%_+_var(--x)_*_0.7%)] top-[calc(var(--y)_*_1%)] -translate-x-1/2 -translate-y-1/2 sm:left-[calc(25%_+_var(--x)_*_0.5%)]";

/**
 * The hardware render with its callouts (decision-log #43): the owner's
 * labelled reference rebuilt on the plain render, so the labels are the
 * system's mono micro-labels on `white/15` hairline leaders ending in
 * the gold marker, in the site's own type, crisp at any size, and one
 * list to assistive tech. The labels are the owner's words.
 *
 * One `<ol>`, rendered once. From `lg:` each item is placed on the
 * stage at its feature and reveals in turn after the render, so the
 * labels land on it rather than appearing with it. Below `lg:` the
 * items are the list under the render, numbered, and the render
 * carries the same numbers as small squared tags at the features (a
 * tag on its own hairline surface, not bare text over imagery).
 */
function AnnotatedRender({
  render,
  annotations,
}: {
  render: CaseStudyRender;
  annotations: readonly RenderAnnotation[];
}) {
  return (
    <div className="mt-16 md:mt-24 lg:mt-28">
      {/* Vertical room for the top and bottom callouts' stems. */}
      <div className="mx-auto w-full max-w-4xl lg:py-20">
        <div className="relative">
          {/* The stage: the render and, below `lg:`, its numbered tags.
              Its height is the render's, so a tag's `top` is a share of
              the render and nothing else. */}
          <div className="relative">
            <ScrollReveal className="mx-auto w-[70%] sm:w-1/2 lg:w-[42%]">
              <CaseStudyRenderImage render={render} sizes={HARDWARE_SIZES} />
            </ScrollReveal>
            {annotations.map((annotation, i) => (
              <Tag key={annotation.label} annotation={annotation} index={i} />
            ))}
          </div>
          {/* The list: under the render below `lg:`; from `lg:` it lies
              over the stage, edge to edge, and each item sits at its
              feature. */}
          <ol
            role="list"
            className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 lg:absolute lg:inset-0 lg:mt-0 lg:block lg:max-w-none"
          >
            {annotations.map((annotation, i) => (
              <Callout
                key={annotation.label}
                annotation={annotation}
                index={i}
              />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/** A callout's numbered tag on the render, below `lg:` only. */
function Tag({
  annotation,
  index,
}: {
  annotation: RenderAnnotation;
  index: number;
}) {
  const vars = { "--x": annotation.x, "--y": annotation.y } as CSSProperties;
  return (
    <span
      aria-hidden="true"
      className={`absolute grid size-6 place-items-center border border-white/15 bg-surface font-mono text-[0.7rem] tracking-[0.14em] text-white/90 lg:hidden ${NARROW_POSITION}`}
      style={vars}
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

/** One callout: a list item, placed on the stage from `lg:` up. */
function Callout({
  annotation,
  index,
}: {
  annotation: RenderAnnotation;
  index: number;
}) {
  const { label, x, y, side } = annotation;
  const vars = { "--x": x, "--y": y } as CSSProperties;
  const horizontal = side === "left" || side === "right";
  /* The marker overlaps the leader's end by half its width so its
     centre, not its edge, sits on the feature. */
  const markerClass = {
    left: "lg:-mr-[3px]",
    right: "lg:-ml-[3px]",
    top: "lg:-mb-[3px]",
    bottom: "lg:-mt-[3px]",
  }[side];

  return (
    <li className={`lg:absolute ${WIDE_POSITION[side]}`} style={vars}>
      <ScrollReveal
        delay={120 + index * 80}
        className={`flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase ${WIDE_FLOW[side]}`}
      >
        <span className="text-gold lg:hidden">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-white/90 lg:shrink-0 lg:whitespace-nowrap">
          {label}
        </span>
        <span
          aria-hidden="true"
          className={`hidden bg-white/15 lg:block ${horizontal ? "h-px grow" : "h-10 w-px"}`}
        />
        <span
          aria-hidden="true"
          className={`hidden lg:block ${DIAMOND} ${markerClass}`}
        />
      </ScrollReveal>
    </li>
  );
}
