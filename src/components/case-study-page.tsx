import { ArrowIcon } from "@/components/arrow-icon";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Button } from "@/components/button";
import { CaseStudyImage } from "@/components/case-study-image";
import { CaseStudyLink } from "@/components/case-study-link";
import { CloseBand } from "@/components/close-band";
import { Parallax } from "@/components/parallax";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { WorkCard } from "@/components/work-rail";
import { toWorkItem } from "@/content/case-studies";
import { NAV } from "@/content/copy";
import { CASE_STUDY_PAGE, WORK_VIEW_ALL } from "@/content/work";
import { ROUTES } from "@/lib/types";
import type { CaseStudy, CaseStudyBlock } from "@/lib/types";

/** The binding gutter ladder (§Layout) — every band on this page. */
const GUTTERS = "px-6 sm:px-8 lg:px-16";

/** Body copy at the site's reading step. */
const BODY_CLASS = "text-base leading-relaxed text-white/70 md:text-lg";

/** The mono micro-label with the gold diamond marker (§Interaction vocabulary). */
const LABEL_CLASS =
  "flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] text-white/55 uppercase";

/**
 * `sizes` hints for the two frame widths, so the real images are never
 * under-fetched: a full-width frame spans the viewport less the
 * gutters; a pair frame is half of that less the gap.
 */
const FULL_SIZES =
  "(min-width: 1024px) calc(100vw - 8rem), (min-width: 640px) calc(100vw - 4rem), calc(100vw - 3rem)";
const PAIR_SIZES =
  "(min-width: 1024px) calc(50vw - 4.5rem), (min-width: 768px) calc(50vw - 2.5rem), calc(100vw - 3rem)";

/** One other study for the closing band, with its list position. */
export interface OtherCaseStudy {
  readonly study: CaseStudy;
  readonly index: number;
}

interface CaseStudyPageProps {
  study: CaseStudy;
  /** The studies shown as "Other projects"; an empty list hides the band. */
  others: readonly OtherCaseStudy[];
}

/**
 * The case study template — one component every `/work/<slug>` route
 * renders from its content module (decision-log **#42**, 2026-09-14).
 * A case study is a module; adding one is adding a file and its
 * images, never touching this.
 *
 * **Composition is the owner's reference (a Framer portfolio case
 * study, 2026-09-14), reproduced as structure and refused as style** —
 * the posture PR #27 took with the gallery reference and unit 26 with
 * the service references. What the reference contributed, top to
 * bottom: a hero that splits into a title row and a two-column row
 * (an off-site link left; the one-line intro and three hairline
 * label/value rows right), a full-width image, then labelled text
 * blocks (label left, a statement and a paragraph right) interleaved
 * with two-up and full-width image frames, then an "Other projects"
 * pair with a link to the archive. What it did not contribute, and
 * what this system supplies instead:
 *
 * - **Type.** The reference sets its title at 120px in Manrope with a
 *   product logo beneath it. Here the title is `SectionHeading`'s
 *   `hero` scale in Space Grotesk — the one place on the site besides
 *   `/` where the top-of-page display scale is earned, since the name
 *   *is* the page — and there is no logo (nothing owner-supplied to
 *   show; Rule 4.3). Statements take the panel scale
 *   (`text-2xl md:text-3xl`), body the `white/70` reading step, labels
 *   the mono micro-label — the three type roles, nothing new.
 * - **The label pill.** The reference marks each block with a rounded
 *   pill carrying a sparkle glyph. Here it is the mono micro-label
 *   behind the gold diamond marker, the same device the service
 *   blocks and the work cards carry. No pill, no glyph, no new icon.
 * - **Surfaces.** Rounded, borderless image frames become the squared
 *   hairline ink frame (`case-study-image.tsx`). The reference's
 *   violet glows — one top-right, two more mid-page — are not
 *   reproduced: gold is the only accent (#14), the page-background
 *   glow is the one `PageGlow` every route without the footage carries
 *   (#35, #39), and #35 permits no second light.
 * - **The link.** "visit website", a text link with an up-right arrow
 *   and a stacked-label hover swap, becomes `<CaseStudyLink>`: the
 *   §Interaction-vocabulary gold text link, the shared arrow turned to
 *   point out, colour-shift-and-nudge on hover. **It renders only for
 *   a live project** (`liveHref`, owner rule; #43), which none is, so
 *   today the slot carries only the published-page link (`sourceHref`,
 *   "View on Behance") where a study has one.
 * - **Motion.** The reference fades its hero pieces and cards up on
 *   load and does nothing on scroll (measured). Here the hero takes
 *   the load-time `rise-in` at 0 / 120 / 200 / 280ms with inline
 *   delays (unit 27), every block below the fold enters through
 *   `<ScrollReveal>` on the hero stagger (0 / 120 / 200 + i·80ms), and
 *   **each image band rides one whisper `<Parallax>`** — the About
 *   portrait's construction exactly: the drift wraps the whole frame
 *   (or the pair's grid), so the image inside is never scaled past its
 *   frame, and a band carries one instance, which is §Motion's "at
 *   most one per section". It is the one addition beyond the
 *   reference, flagged in build-note 30, and one wrapper per band to
 *   delete. No keyframe added, `globals.css` untouched, reduced motion
 *   sees no transform.
 * - **The site chrome the reference ends on** — a FAQ, a contact card
 *   and a "book a call" — is not reproduced. FAQ is retired (#13, #30),
 *   the phrase is a Rule 3.2 banned term, and the site's one conversion
 *   path is the modal: the page ends on `<CloseBand>`, the service
 *   routes' close extracted verbatim, with the study's `need`
 *   preselected — the card-to-modal seam the brief required, nothing
 *   reinvented, no new CTA phrase.
 * - **"Other projects"** renders the next two studies in display order
 *   as the home band's card in its `tile` variant, numbered as they
 *   are on the band and the grid, with the band's own "View all"
 *   control beside the heading (`WORK_VIEW_ALL`, the same object the
 *   rail's trailing card reads). Nothing new was drawn for it.
 *
 * **Layout is the page's own gutters, full-bleed, not the service
 * routes' `max-w-6xl` measure.** The reference runs edge to edge with
 * small margins and its images are the point; `/pricing` and `/work`
 * are full-bleed on the gutter ladder and this route follows them, so
 * the archive and the study share one width. Frames are `16/9`
 * full-width (the card's screenshot frame, so the same asset serves
 * both) and `4/3` in pairs (the service mocks' box) — a slot can
 * override either.
 *
 * **On a phone the hero stacks title, intro, details, then the links**,
 * which is the reference's mobile order; the two hero columns swap
 * with `order-*` so the DOM keeps the desktop reading order.
 *
 * **Every href is root-relative.** `NAV.home`, `ROUTES.work`,
 * `WORK_VIEW_ALL.href` and `workHref` (inside the cards) are finished
 * paths; nothing here writes a hash.
 *
 * The wordmark handoff is `/pricing`'s zero-height sticky wrapper,
 * load-bearing and unchanged from unit 24 (see `src/app/work/page.tsx`
 * for the full account). `ScrollVideo` is not mounted (#17). Every
 * string comes from the study's module or `CASE_STUDY_PAGE`; nothing
 * here is a literal. Server component; the frames, the reveals, the
 * cards and the close bring their own client boundaries.
 */
export function CaseStudyPage({ study, others }: CaseStudyPageProps) {
  /*
   * Placeholder frames are named `placeholder-work-<nn>` in page order
   * (Taxonomy §7), the hero image being 01. Each block is paired with
   * the number its first frame takes, so a pair takes two consecutive
   * numbers and the next block picks up after it.
   */
  const blocks = study.blocks.reduce<
    { block: CaseStudyBlock; first: number }[]
  >((numbered, block) => {
    const previous = numbered[numbered.length - 1];
    const first =
      previous === undefined ? 2 : previous.first + frameCount(previous.block);
    numbered.push({ block, first });
    return numbered;
  }, []);

  const intro = study.intro ?? study.summary;
  const hasLinks =
    study.liveHref !== undefined || study.sourceHref !== undefined;

  return (
    <>
      <section
        aria-labelledby="case-study-headline"
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
        <div className={`w-full ${GUTTERS} pt-32 sm:pt-40 lg:pt-48`}>
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
            size="hero"
            eyebrow={CASE_STUDY_PAGE.eyebrow}
            className="mt-6 max-w-5xl motion-safe:animate-rise-in"
          >
            <span id="case-study-headline">{study.name}</span>
          </SectionHeading>

          {/* The reference's two-column row: the off-site link left,
              the intro and the details right. On a phone the details
              come first and the link last (the reference's own mobile
              order); `order-*` swaps the columns visually while the DOM
              keeps the desktop reading order. With no link to show the
              intro still sits in the second column. */}
          <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[2fr_3fr] lg:gap-16">
            {hasLinks && (
              <div
                className="order-2 flex flex-col items-start gap-1 motion-safe:animate-rise-in lg:order-1"
                style={{ animationDelay: "280ms" }}
              >
                {/* Live projects only (#43). None is, so this renders
                    nowhere today; the rule lives on `liveHref`. */}
                {study.liveHref !== undefined && (
                  <CaseStudyLink href={study.liveHref}>
                    {CASE_STUDY_PAGE.visit}
                  </CaseStudyLink>
                )}
                {study.sourceHref !== undefined && (
                  <CaseStudyLink href={study.sourceHref}>
                    {CASE_STUDY_PAGE.source}
                  </CaseStudyLink>
                )}
              </div>
            )}
            <div className="order-1 lg:order-2 lg:col-start-2">
              <p
                className={`max-w-2xl ${BODY_CLASS} motion-safe:animate-rise-in`}
                style={{ animationDelay: "120ms" }}
              >
                {intro}
              </p>
              {/* The reference's three hairline rows: label left, value
                  right. A description list, on the strip's `white/10`
                  hairline ladder, the mono micro-label for the term and
                  full-strength white for the value. Rows are content:
                  a study declares as many as the facts support and no
                  duration, date or client is invented to fill one
                  (Rule 4.3). */}
              {study.meta.length > 0 && (
                <div
                  className="mt-8 motion-safe:animate-rise-in"
                  style={{ animationDelay: "200ms" }}
                >
                  {/* The list has no visible heading, so it gets the
                      `sr-only` one the `/work` grid and the pricing
                      tiers use for the same situation. */}
                  <h2 className="sr-only">{CASE_STUDY_PAGE.metaHeading}</h2>
                  <dl className="border-t border-white/10">
                    {study.meta.map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-baseline justify-between gap-6 border-b border-white/10 py-4"
                      >
                        <dt className="font-mono text-[0.7rem] tracking-[0.14em] text-white/55 uppercase">
                          {label}
                        </dt>
                        <dd className="text-right text-base text-white">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* The hero image: the reference's full-width frame under
              the details. Below the fold on arrival, so it enters on
              scroll like every block, not on load. The whisper drift
              wraps the whole frame (the About portrait's order:
              reveal, then parallax, then the frame). */}
          <ScrollReveal className="mt-16 lg:mt-20">
            <Parallax>
              <CaseStudyImage
                image={study.hero}
                ratio="16/9"
                sizes={FULL_SIZES}
                index={1}
              />
            </Parallax>
          </ScrollReveal>
        </div>
      </section>

      {/* The blocks, in the order the module declares them. Image
          blocks sit `gap-4` apart — the grid's own gap — and a text
          block brings its own vertical air, so the page reads as the
          reference does: text, then imagery close together, then air,
          then text. */}
      <div className={`flex flex-col gap-4 ${GUTTERS}`}>
        {blocks.map(({ block, first }, i) => (
          <Block key={i} block={block} first={first} />
        ))}
      </div>

      {others.length > 0 && (
        <section
          aria-labelledby="case-study-others-heading"
          className={`w-full ${GUTTERS} pt-24 sm:pt-28 lg:pt-36`}
        >
          {/* The reference's header row: eyebrow and heading left, the
              archive link right. The link is the band's own "View all"
              control — `WORK_VIEW_ALL`, the object the rail's trailing
              card reads — so the label and the destination cannot
              drift from it. */}
          <div className="flex flex-wrap items-end justify-between gap-8">
            <ScrollReveal>
              <SectionHeading as="h2" eyebrow={CASE_STUDY_PAGE.othersEyebrow}>
                <span id="case-study-others-heading">
                  {CASE_STUDY_PAGE.othersHeading}
                </span>
              </SectionHeading>
            </ScrollReveal>
            {WORK_VIEW_ALL.href !== undefined && (
              <ScrollReveal delay={120}>
                <Button variant="ghost" arrow href={WORK_VIEW_ALL.href}>
                  {WORK_VIEW_ALL.label}
                </Button>
              </ScrollReveal>
            )}
          </div>
          {/* The home band's card in its tile variant, two up — the
              same component the grid renders, numbered as it is there,
              so a visitor meets the same card everywhere. The card is
              a client component, so it is handed the card's projection
              of the study, not the study: every prop crosses into the
              page payload, and a study now carries its whole page. */}
          <ul className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2">
            {others.map(({ study: other, index }, k) => (
              <li key={other.id}>
                <ScrollReveal delay={120 + k * 80} className="h-full">
                  <WorkCard
                    item={toWorkItem(other)}
                    index={index}
                    variant="tile"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>
      )}

      <CloseBand
        headingId="case-study-close-headline"
        need={study.need}
        className="pt-24 sm:pt-28 lg:pt-36"
      />
    </>
  );
}

/** How many image frames a block renders, for the placeholder numbering. */
function frameCount(block: CaseStudyBlock): number {
  if (block.type === "image") return 1;
  if (block.type === "pair") return 2;
  return 0;
}

/**
 * One block of the composition. A `text` block is the reference's
 * labelled block: the mono label with the gold diamond in the left
 * column, the statement at panel scale and the body in the right — the
 * label is the block's heading, since "The challenge" is what the
 * block is about and the statement is its lede. An `image` block is one
 * full-width frame; a `pair` is two `4/3` frames side by side, stacking
 * below `md`. Each image band rides one `<Parallax>` — outside the
 * frame, around the whole band, so a pair drifts as one and nothing
 * inside a frame is ever scaled past it. A new kind of block is a new
 * member of `CaseStudyBlock` and a new branch here, never a fork of the
 * page.
 */
function Block({ block, first }: { block: CaseStudyBlock; first: number }) {
  if (block.type === "text") {
    return (
      <section className="grid gap-6 py-20 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:py-28">
        <ScrollReveal>
          <h2 className={LABEL_CLASS}>
            <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-gold" />
            {block.label}
          </h2>
        </ScrollReveal>
        <div>
          <ScrollReveal delay={120}>
            <p className="max-w-3xl text-2xl font-medium tracking-tight text-balance text-white md:text-3xl">
              {block.statement}
            </p>
          </ScrollReveal>
          {block.body.map((paragraph, j) => (
            <ScrollReveal key={paragraph} delay={200 + j * 80}>
              <p className={`mt-6 max-w-2xl ${BODY_CLASS}`}>{paragraph}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>
    );
  }
  if (block.type === "pair") {
    return (
      <Parallax>
        <div className="grid gap-4 md:grid-cols-2">
          {block.images.map((image, k) => (
            <ScrollReveal key={k} delay={k * 80}>
              <CaseStudyImage
                image={image}
                ratio="4/3"
                sizes={PAIR_SIZES}
                index={first + k}
              />
            </ScrollReveal>
          ))}
        </div>
      </Parallax>
    );
  }
  return (
    <ScrollReveal>
      <Parallax>
        <CaseStudyImage
          image={block.image}
          ratio="16/9"
          sizes={FULL_SIZES}
          index={first}
        />
      </Parallax>
    </ScrollReveal>
  );
}
