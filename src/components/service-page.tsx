import { BrandWordmark } from "@/components/brand-wordmark";
import { Button } from "@/components/button";
import { CapabilityStrip } from "@/components/capability-strip";
import { ModalTrigger } from "@/components/modal-trigger";
import { PageGlow } from "@/components/page-glow";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { hasBlockVisual, ServiceBlockVisual } from "@/components/service-block-visual";
import { ServiceCta } from "@/components/service-cta";
import { ServiceProcess } from "@/components/service-process";
import { FINAL_CTA, LANDING, NAV } from "@/content/copy";
import { SERVICE_PAGE_LABELS } from "@/content/service-pages";
import { SERVICES_CTA } from "@/content/services";
import type { ServicePageContent } from "@/lib/types";

/**
 * The qualification promise the close turns on takes the coral payoff
 * treatment (docs/04-ux-spec.md §Typography, decision-log #47): the
 * same phrase `FinalCtaSection` accents on `/`, on the same string and
 * from the same content field. The phrase lives in src/content beside
 * the headline it is matched against (build-note 34, check 11); the
 * heading degrades to unaccented if the two stop matching.
 */
const CLOSE_ACCENT_PHRASE = FINAL_CTA.accentPhrase;

/**
 * Content measure for the service routes (owner direction, 2026-08-30).
 *
 * The bands stay full-width and keep the binding gutter ladder
 * (`px-6 → sm:px-8 → lg:px-16`, §Layout); this centres their **content**
 * so every row stops at the same edge. Without it the two-column rows
 * spread to the full viewport on a wide screen: the `max-w-lg` text
 * column hugged the left gutter while the `max-w-md` visual centred
 * itself in a very wide track, so no two rows lined up and nothing
 * agreed with the band above it.
 *
 * `max-w-6xl` is the value `<Container>` already uses, so no new measure
 * is invented. It sits on an inner wrapper rather than on the band
 * itself because `box-sizing: border-box` would otherwise subtract the
 * gutters from the measure and shrink the content at `lg:` by 128px.
 *
 * **The hero lockup is deliberately outside it.** It has to stay on the
 * viewport gutter, because the nav bar's wordmark is there and the two
 * must land in the same place across the 80px handoff. Centring it with
 * the content would reintroduce the jump the zero-height sticky wrapper
 * exists to prevent.
 */
const MEASURE = "mx-auto w-full max-w-6xl";

/** Shared measure for a block's supporting paragraph. */
const BODY_CLASS = "text-base leading-relaxed text-foreground md:text-lg";

/**
 * One list card in the agentic page's offer band (#57): "What you get"
 * or "What the monthly covers". The site's card recipe with the
 * How-it-works card title and the deliverables list's coral diamonds,
 * so nothing here is new vocabulary.
 */
function OfferList({
  title,
  items,
  delay,
}: {
  title: string;
  items: readonly string[];
  delay: number;
}) {
  return (
    <ScrollReveal delay={delay} className="h-full">
      <div className="h-full rounded-xl border border-border bg-card p-6 transition-colors duration-150 hover:border-muted-foreground/50 md:p-8">
        <h2 className="font-sans text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {title}
        </h2>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-brand"
              />
              <span className="text-base leading-relaxed text-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </ScrollReveal>
  );
}

/**
 * A service route, whole — decision-log **#30** (2026-08-28), one
 * offering per route since **#53**. Both pages are this component plus
 * their own metadata; the routes are thin for the reason `/pricing` is
 * thin.
 *
 * **The blocks, owner-specified (2026-08-28), extended by #53 and
 * #57:** hero → the anchored topic blocks → (the agentic page only)
 * what you get and what the monthly covers → how it works → close. No
 * proof band, no FAQ, no testimonials. **The price is on the page now**
 * (#53, #56): one line in the hero, under the intro, in the `/pricing`
 * term line's treatment, read from the same figures `/pricing` reads.
 * The close's link to `/pricing` stays removed (owner, 2026-08-28), so
 * the close carries one action; `/pricing` is still the hero's second
 * button, the nav bar's featured button and a footer link.
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
 * `hero.tsx` got away with `absolute` only while its stage was sticky
 * across 160vh of runway (retired by #46; build-note 32 records what
 * that means for the home page). Pure CSS, so no-JS behaves the same.
 * It must stay the section's **first child with no top padding above it**; the
 * padding lives on the content block, or the lockup starts 128px low.
 * The gutter padding sits on the anchor, not the `<header>`, so the
 * lockup keeps that 24px offset while the hit area clears the binding
 * 44px minimum. It links to `NAV.home`, reachable because the fixed bar
 * is `pointer-events-none` except on its own controls (#26).
 *
 * **No footage is mounted** (the scroll-synced backdrop was the home
 * page's alone, and #46 retired it). Two consequences, both handled
 * rather than inherited — the same pair the Work band and `/pricing` handle:
 * where a card surface is used at all it is **solid `card`** rather
 * than §Surfaces' translucent-plus-blur (there is nothing behind it to
 * blur), and headings carry **no text shadow** (they sit on plain
 * `background`, where §Typography bans it).
 *
 * **The "what you get" band is alternating split rows (owner
 * direction, 2026-08-28, third revision, against a supplied
 * reference).** It has now been a stack of glass cards and a flat
 * multi-column band; both are scrapped. Each block is a two-column row
 * — the text on one side, the block's `<ServiceBlockVisual>` diagram
 * on the other (decision-log #60; a wireframe mock until then) — and
 * **the sides alternate down the page**, which is the
 * rhythm the owner asked for and what stops five rows reading as one
 * table. The text is always **first in the DOM** and `lg:order-*` does
 * the swapping, so the single-column stack and the reading order both
 * put the substance before the decoration.
 *
 * The reference is shadcn and **none of its dependencies ship**:
 * `Card`, `Button`, `lucide-react`, `@radix-ui/react-slot`,
 * `class-variance-authority`, a `cn()` helper and a `/components/ui`
 * directory. Nothing new was installed. Its outline button becomes the
 * shared `<Button>` at `ghost` through `<ModalTrigger>`; its heading
 * and body become the panel-scale row title (Inter semibold) and the
 * `foreground` body step; its `rounded-xl` is now this system's own
 * card radius (decision-log #48) and its `bg-muted` becomes `card`
 * (#47). What the
 * reference actually contributed is the split, the alternation and the
 * fading tile cluster (since retired with the wireframes, #60); the
 * visual half is `service-block-visual.tsx` and the diagram language
 * it draws in, `diagram.tsx`.
 *
 * The deliverables list stays on the text side, which the reference
 * does not have. Dropping it would leave the section that is *called*
 * "what you get" saying only what each service is.
 *
 * **Every href is root-relative.** A bare `#work` on a service route
 * resolves to nothing, and the brief calls this the trap the unit
 * multiplies. Nothing here writes a hash: `NAV.home` and `ROUTES` are
 * finished paths, block anchors are same-document, and inbound links
 * come from `serviceBlockHref`.
 *
 * **Conversion goes through the existing seam.** The hero and close are
 * `<ModalTrigger>` at the `inverse` advance variant; each block is
 * `<ServiceCta>`, the §Interaction-vocabulary coral underlined text
 * link — **the same CTA the home page's service cards carry** (owner
 * direction, 2026-08-28), so a service's CTA looks identical on the
 * card that sends a visitor here and on the block they land on. Both
 * components share one modal provider, already in the layout, and both
 * carry the block's `need`. No new mapping, no second modal entry
 * point, no new CTA strings: the hero and close are `LANDING.cta` /
 * `FINAL_CTA.cta` and the blocks are `SERVICES_CTA`, all three from the
 * Rule 3.1 exhaustive set.
 *
 * **Motion is the shipped vocabulary and nothing else** (§Motion: CSS
 * keyframes only, `motion-safe:` gated, reduced-motion parity, no
 * `motion/react`). No keyframe was added — `globals.css` is untouched.
 * The hero entrance is the load-time `rise-in`, not a scroll trigger,
 * because it is above the fold on arrival. In the "what you get" band
 * each row's text reveals as one block, its deliverables land at
 * `120 + j·70ms`, and the diagram reveals with its frame and then its
 * parts (`diagram.tsx`) — the §Motion-inventory list rhythm
 * (120 + i·80ms), tightened because these rows are shorter than a
 * card. The diagrams' own ambient motion is #62's. The **`target:` treatment** is
 * the one new interaction, and it earns its place: the rows are tall,
 * so arriving from a service card has to say *which* one you arrived
 * at. The block's **index goes coral** (#47) at the 150ms
 * micro-transition tempo — the Process accordion's open-row treatment
 * doing identical "you are here" work, and coral stays scarce because
 * only the index takes it (the app cluster's emphasized tile took a
 * coral hairline too, until the cluster was deleted on 2026-10-15).
 * Pure CSS, so it holds with no JS and adds no transform for reduced
 * motion to suppress.
 *
 * **A block with no visual renders no visual cell at all** (owner
 * direction, 2026-10-15: no empty or stand-in frame reaches
 * production). From `lg:` its "What we map first" panel takes the half
 * the visual would have had, so the card is not half empty; it does
 * not alternate, and below `lg:` it stacks as every row does. Since
 * #60 every block has a diagram, so no row takes this path today; it
 * stays for a block added before its diagram is drawn.
 *
 * Server component throughout. The CTAs bring their own client
 * boundary, so the pages prerender to static HTML.
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
  const accentStart = accent === undefined ? -1 : headline.indexOf(accent);

  const closeHeadline = FINAL_CTA.headline;
  const closeAccentStart = closeHeadline.indexOf(CLOSE_ACCENT_PHRASE);

  return (
    <>
      {/* The viewport-fixed coral glow (#35, recoloured by #47). The
          section and band backgrounds below are transparent so it shows
          through: the page's ground is the layout's `background`. */}
      <PageGlow />
      <section
        aria-labelledby="service-headline"
        className="relative flex w-full flex-col"
      >
        {/* Load-bearing. See the doc block — do not flatten the h-0
            sticky wrapper, and do not add padding above it. */}
        <div className="sticky top-0 z-10 h-0">
          <header>
            <a
              href={NAV.home}
              className="pointer-events-auto inline-flex px-6 py-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-8 lg:px-16"
            >
              <BrandWordmark className="h-7 w-auto" />
            </a>
          </header>
        </div>
        {/* The ribbon. The first thing under the nav band — the
            reference puts it flush at the page top, which here is where
            the fixed bar and the page's own lockup live, so it takes
            the slot directly beneath them. It sits ON THE PAGE MEASURE,
            not full-bleed (owner direction, 2026-08-31: it should not
            run to the screen edges as it auto-scrolls), so its hairline
            borders stop at the same two edges as every band below. It
            is the landing hero's strip, not a copy of it:
            `CapabilityStrip` was extracted from `hero.tsx` for this and
            both surfaces now render the same component. More copies
            than the default because these lists are shorter (three
            labels and two), and four would run out of track and show
            the loop seam. */}
        <div className="mt-24 w-full px-6 motion-safe:animate-rise-in sm:mt-28 sm:px-8 lg:mt-32 lg:px-16">
          <div className={MEASURE}>
            <CapabilityStrip
              items={page.strip}
              label={LANDING.capabilitiesLabel}
              copies={10}
            />
          </div>
        </div>
        <div className="w-full px-6 pt-16 pb-16 sm:px-8 sm:pt-20 lg:px-16 lg:pt-24 lg:pb-20">
          <div className={MEASURE}>
            {/* Single column. The hero carried a tilted wireframe in a
                second column behind a `lg:border-l` rule; the owner
                removed both (2026-08-30), so the heading, description
                and actions run at the page measure with nothing beside
                them. `service-hero-visual.tsx` went with it — recoverable
                from git if the illustration is ever wanted back. */}
            <div>
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
                      <span className="text-brand">{accent}</span>
                      {headline.slice(accentStart + accent.length)}
                    </>
                  )}
                </span>
              </SectionHeading>
              {/* The lead line (#53): what the offering is, in the
                    buyer words its card's subtitle uses, a step above
                    the body in weight and size. */}
              {page.leadLine !== undefined && (
                <p
                  className="mt-8 max-w-2xl text-lg leading-relaxed font-medium text-foreground motion-safe:animate-rise-in md:text-xl"
                  style={{ animationDelay: "120ms" }}
                >
                  {page.leadLine}
                </p>
              )}
              {/* Each field renders nothing when absent (Rule 4.3). */}
              {page.intro !== undefined && (
                <p
                  className={`${page.leadLine !== undefined ? "mt-4" : "mt-8"} max-w-2xl motion-safe:animate-rise-in ${BODY_CLASS}`}
                  style={{ animationDelay: "120ms" }}
                >
                  {page.intro}
                </p>
              )}
              {/* The published price (#53, #56), in the treatment
                  `/pricing` gives its term: the coral list marker
                  beside a medium-weight line, so the figure and its
                  commitment read as one stated fact, not a footnote. */}
              {page.price !== undefined && (
                <p
                  className="mt-6 flex max-w-2xl gap-3 text-base leading-relaxed text-foreground motion-safe:animate-rise-in"
                  style={{ animationDelay: "200ms" }}
                >
                  <span
                    aria-hidden="true"
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-brand"
                  />
                  <span className="font-medium">{page.price}</span>
                </p>
              )}
              {/* Primary plus Pricing (owner direction, 2026-08-30):
                    the reference's filled-plus-outlined pair, in this
                    system's terms. The second is the shared `<Button>`
                    at `ghost` (the hairline `secondary` fill, not the
                    stone advance fill; same default size, so the two
                    match in height), and it reads `NAV.featured`,
                    the same object the nav bar's Pricing button reads,
                    so label and href cannot drift from it (#26). */}
              <div
                className="mt-10 flex flex-wrap items-center gap-3 motion-safe:animate-rise-in"
                style={{ animationDelay: "200ms" }}
              >
                <ModalTrigger variant="inverse" arrow need={page.need}>
                  {LANDING.cta}
                </ModalTrigger>
                <Button variant="ghost" href={NAV.featured.href}>
                  {NAV.featured.label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* "What you get" — alternating split rows. See the doc block
          above for what the reference contributed and what it did not.
          Each block is a real <section id>, so `globals.css`'s
          `section[id] { scroll-margin-top: 5rem }` clears the fixed bar
          on a deep link with no extra CSS. */}
      <div className="w-full px-6 pb-24 sm:px-8 sm:pb-28 lg:px-16 lg:pb-32">
        <div className={`${MEASURE} flex flex-col gap-24 md:gap-32`}>
          {page.blocks.map((block, i) => {
            /* Sides alternate (owner direction): the visual leads on
               odd rows and follows on even ones. The text is always
               **first in the DOM**, so the reading order and the
               single-column stack put the substance before the
               decoration; `lg:order-*` does the swapping, which is
               presentation only and leaves assistive tech alone. A
               block with no visual does not alternate (see the doc
               block). */
            const visual = hasBlockVisual(block.id);
            const visualLeads = i % 2 === 1;
            /* No visual but a map line (the agentic examples until
               their diagrams landed, #60): from `lg:` the "What we map first" panel
               takes the half the visual would have, so the card is not
               half empty. The text column turns `lg:contents` so its
               parts become cells of the row's grid, in reading order
               (name, map, CTA). Below `lg:` the row stacks as before. */
            const mapHalf = !visual && block.mapFirst !== undefined;

            return (
              <section
                key={block.id}
                id={block.id}
                aria-labelledby={`${block.id}-heading`}
                /* `group` + `target:` is the deep-link answer: the rows
                   are tall, so arriving needs to *say* which one you
                   arrived at. The index turns coral, which is the
                   Process accordion's open-row treatment (§Motion
                   inventory) doing the same "you are here" work. CSS
                   only, so it survives no-JS and reduced motion. */
                /* Each row is a card (owner direction, 2026-08-31), so
                   the text and its visual read as one unit from desktop
                   to the stacked mobile column. The recipe is the
                   site's card, exactly: the §How-it-works and pricing
                   cards' `border` hairline, `card` fill, fin's
                   `rounded-xl` (decision-log #48) and padding, solid
                   rather than glass for the reason the sibling process
                   band gives: no footage is mounted here. */
                className={`group grid items-center gap-12 rounded-xl border border-border bg-card p-6 transition-colors duration-150 hover:border-muted-foreground/50 md:p-8 ${visual ? "lg:grid-cols-2 lg:gap-16" : mapHalf ? "lg:grid-cols-2 lg:gap-x-16 lg:gap-y-10" : ""}`}
              >
                {/* `min-w-0` on both columns is the bento tiles' own
                    load-bearing device, one level up: a grid item's
                    automatic minimum is its content's min-content, and
                    the mocks' fixed-pixel chrome (capped by the shell's
                    `max-w-md`, 448px) was forcing the stacked mobile
                    track to 448 — the page rendered 497px wide at a
                    375px viewport and mobile Chrome zoomed out to hide
                    it (pre-existing; unit 26's scrollWidth check could
                    not see it through the auto-zoom). With it, the
                    track shrinks, the mocks' own overflow-hidden stages
                    clip, and the shared fade dissolves the clip. */}
                <div
                  className={`min-w-0 ${visual ? (visualLeads ? "lg:order-2" : "lg:order-1") : mapHalf ? "lg:contents" : ""}`}
                >
                  <ScrollReveal
                    className={mapHalf ? "lg:col-start-1 lg:row-start-1 lg:self-end" : undefined}
                  >
                    <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground transition-colors duration-150 group-target:text-brand">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rotate-45 bg-brand"
                      />
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    {/* The row-title treatment at panel scale
                        (§Typography: Inter semibold, decision-log #47),
                        not the serif section scale: these sit under the
                        page's own <h1>, and the reference's column
                        heading is the same weight relative to its body. */}
                    <h2
                      id={`${block.id}-heading`}
                      className="mt-5 max-w-lg font-sans text-2xl font-semibold tracking-tight text-balance text-foreground md:text-3xl"
                    >
                      {block.name}
                    </h2>
                    <p className={`mt-4 max-w-lg ${BODY_CLASS}`}>
                      {block.description}
                    </p>
                  </ScrollReveal>
                  {/* "What we map first" (#57): the agentic examples'
                      process-mapping step, in §Surfaces' sub-panel
                      recipe (a `secondary` panel inside the card), so
                      the map reads as its own part of each job. Beside
                      the text from `lg:` when the row has no visual. */}
                  {block.mapFirst !== undefined && (
                    <ScrollReveal
                      delay={120}
                      className={mapHalf ? "lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center" : undefined}
                    >
                      <div
                        className={`mt-6 max-w-lg rounded-lg border border-border bg-secondary p-5 ${mapHalf ? "lg:mt-0" : ""}`}
                      >
                        <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted-foreground">
                          {SERVICE_PAGE_LABELS.mapFirst}
                        </p>
                        <p className="mt-2 text-base leading-relaxed text-foreground">
                          {block.mapFirst}
                        </p>
                      </div>
                    </ScrollReveal>
                  )}
                  {/* The deliverables (owner copy since #53). A block
                      with no bullets, like the agentic examples,
                      renders no list *and no frame* (Rule 4.3), so the
                      row ends at its description and its panel. They
                      live in `src/content/service-pages.ts`. */}
                  {block.included.length > 0 && (
                    <ul
                      className={`mt-8 max-w-lg space-y-4 ${mapHalf ? "lg:col-start-1" : ""}`}
                    >
                      {block.included.map((item, j) => (
                        <li key={item}>
                          {/* The §Motion-inventory list rhythm
                              (120 + i·80ms), tightened because these
                              rows are shorter than a card. The reveal
                              is the shared `rise-in` keyframe; JS only
                              triggers it, and reduced motion gets
                              instant visibility. */}
                          <ScrollReveal
                            delay={120 + j * 70}
                            className="flex gap-4"
                          >
                            {/* The system's list marker
                                (§Interaction vocabulary: the small
                                diamond, coral since decision-log #47).
                                The reference's lucide
                                glyphs are not reproduced — icons here
                                are inline SVG only and this marker is
                                settled vocabulary. */}
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-brand"
                            />
                            <span className="text-base leading-relaxed text-foreground">
                              {item}
                            </span>
                          </ScrollReveal>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* The home page's service-card CTA, exactly
                      (owner direction, 2026-08-28): `<ServiceCta>`, the
                      §Interaction-vocabulary coral underlined text link.
                      A service's CTA now looks the same wherever a
                      visitor meets it — the card that sent them here
                      and the block they landed on. This replaces the
                      reference's outline button, which was the shared
                      <Button> at `ghost`; same seam, same `need`, same
                      Rule 3.1 label, different affordance. */}
                  <div
                    className={mapHalf ? "mt-10 lg:col-start-1 lg:mt-0 lg:self-start" : "mt-10"}
                  >
                    <ServiceCta
                      label={SERVICES_CTA}
                      need={block.need}
                      service={block.name}
                    />
                  </div>
                </div>
                {visual && (
                  <div
                    className={`min-w-0 ${visualLeads ? "lg:order-1" : "lg:order-2"}`}
                  >
                    <ServiceBlockVisual block={block.id} />
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* What you get and what the monthly covers (#57): the agentic
          page's two lists, side by side from md, before How it works.
          The product page carries its deliverables in its blocks. */}
      {page.offer !== undefined && (
        <div className="w-full px-6 pb-24 sm:px-8 sm:pb-28 lg:px-16 lg:pb-32">
          <div className={`${MEASURE} grid gap-4 md:grid-cols-2`}>
            <OfferList
              title={SERVICE_PAGE_LABELS.included}
              items={page.offer.included}
              delay={0}
            />
            <OfferList
              title={SERVICE_PAGE_LABELS.monthlyCovers}
              items={page.offer.monthlyCovers}
              delay={120}
            />
          </div>
        </div>
      )}
      <ServiceProcess />

      <section
        aria-labelledby="service-close-headline"
        className="w-full px-6 pb-28 sm:px-8 sm:pb-32 lg:px-16 lg:pb-44"
      >
        <div className={MEASURE}>
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
                    <span className="text-brand">{CLOSE_ACCENT_PHRASE}</span>
                    {closeHeadline.slice(
                      closeAccentStart + CLOSE_ACCENT_PHRASE.length,
                    )}
                  </>
                )}
              </span>
            </SectionHeading>
          </ScrollReveal>
          {/* The CTA repeated, and nothing beside it. The close carried
            an accented text link to `/pricing` labelled `PRICING.headline`;
            the owner removed it (2026-08-28), so the close is the one
            action again. `/pricing` is still reached from the nav bar's
            featured button and the footer on every page. */}
          <ScrollReveal delay={120} className="mt-10">
            <ModalTrigger variant="inverse" arrow need={page.need}>
              {FINAL_CTA.cta}
            </ModalTrigger>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
