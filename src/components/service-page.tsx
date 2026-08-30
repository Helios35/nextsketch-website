import { BrandWordmark } from "@/components/brand-wordmark";
import { ModalTrigger } from "@/components/modal-trigger";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { ServiceBlockVisual } from "@/components/service-block-visual";
import { ServiceCta } from "@/components/service-cta";
import { ServiceProcess } from "@/components/service-process";
import { FINAL_CTA, LANDING, NAV } from "@/content/copy";
import { SERVICES_CTA } from "@/content/services";
import type { ServicePageContent } from "@/lib/types";

/**
 * Presentation marker, not copy: the qualification promise the close
 * turns on takes the gold payoff treatment (docs/04-ux-spec.md
 * §Typography). The same phrase `FinalCtaSection` accents on `/`, on
 * the same string. Degrades to an unaccented headline if the canonical
 * copy changes.
 */
const CLOSE_ACCENT_PHRASE = "right fit";

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
const BODY_CLASS = "text-base leading-relaxed text-white/70 md:text-lg";

/**
 * A service route, whole — decision-log **#30** (2026-08-28). Both
 * pages are this component plus their own metadata; the routes are thin
 * for the reason `/pricing` is thin.
 *
 * **Four blocks, owner-specified (2026-08-28):** hero → the anchored
 * topic blocks → how it works → close. Nothing else. No proof band, no
 * FAQ, no testimonials, and **no price and no pricing link** — three of
 * those have no approved content, and the close's link to `/pricing`
 * was removed by the owner (2026-08-28) so the close carries one
 * action. `/pricing` is still reached from the nav bar's featured
 * button and the footer, on every page.
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
 * where a card surface is used at all it is **solid `#0a0a0c`** rather
 * than §Surfaces' translucent-plus-blur (there is nothing behind it to
 * blur), and headings carry **no text shadow** (they sit on plain ink,
 * where §Typography bans it).
 *
 * **The "what you get" band is alternating split rows (owner
 * direction, 2026-08-28, third revision, against a supplied
 * reference).** It has now been a stack of glass cards and a flat
 * multi-column band; both are scrapped. Each block is a two-column row
 * — the text on one side, a `<ServiceBlockVisual>` tile cluster on the
 * other — and **the sides alternate down the page**, which is the
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
 * and body become the panel display scale and the `white/70` body step;
 * its `rounded-xl` and `bg-muted` become squared on `ink`. What the
 * reference actually contributed is the split, the alternation and the
 * fading tile cluster — the rest lives in `service-block-visual.tsx`,
 * which records the visual half's own refusals (third-party logos
 * above all).
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
 * `<ServiceCta>`, the §Interaction-vocabulary gold underlined text
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
 * `120 + j·70ms`, and the tile cluster assembles row by row
 * (`120 + r·90 + n·60ms`) so the visual builds rather than appears —
 * the §Motion-inventory list rhythm (120 + i·80ms), tightened because
 * these rows are shorter than a card. The **`target:` treatment** is
 * the one new interaction, and it earns its place: the rows are tall,
 * so arriving from a service card has to say *which* one you arrived
 * at. The block's **index goes gold** and the cluster's emphasized
 * tile takes a gold hairline, both at the 150ms micro-transition
 * tempo — the Process accordion's open-row treatment doing identical
 * "you are here" work, and gold stays scarce because only those two
 * elements take it. Pure CSS, so it holds with no JS and adds no
 * transform for reduced motion to suppress.
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
          <div className={MEASURE}>
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
        </div>
      </section>

      {/* "What you get" — alternating split rows. See the doc block
          above for what the reference contributed and what it did not.
          Each block is a real <section id>, so `globals.css`'s
          `section[id] { scroll-margin-top: 5rem }` clears the fixed bar
          on a deep link with no extra CSS. */}
      <div className="w-full bg-ink px-6 pb-24 sm:px-8 sm:pb-28 lg:px-16 lg:pb-32">
        <div className={`${MEASURE} flex flex-col gap-24 md:gap-32`}>
          {page.blocks.map((block, i) => {
            /* Sides alternate (owner direction): the visual leads on
               odd rows and follows on even ones. The text is always
               **first in the DOM**, so the reading order and the
               single-column stack put the substance before the
               decoration; `lg:order-*` does the swapping, which is
               presentation only and leaves assistive tech alone. */
            const visualLeads = i % 2 === 1;

            return (
              <section
                key={block.id}
                id={block.id}
                aria-labelledby={`${block.id}-heading`}
                /* `group` + `target:` is the deep-link answer: the rows
                   are tall, so arriving needs to *say* which one you
                   arrived at. The index turns gold and the emphasized
                   tile's hairline follows it, which is the Process
                   accordion's open-row treatment (§Motion inventory)
                   doing the same "you are here" work. CSS only, so it
                   survives no-JS and reduced motion. */
                className="group grid items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                <div className={visualLeads ? "lg:order-2" : "lg:order-1"}>
                  <ScrollReveal>
                    <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55 transition-colors duration-150 group-target:text-gold">
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rotate-45 bg-gold"
                      />
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    {/* Panel display scale (§Typography), not the
                        section scale: these sit under the page's own
                        <h1>, and the reference's column heading is the
                        same weight relative to its body. */}
                    <h2
                      id={`${block.id}-heading`}
                      className="mt-5 max-w-lg text-2xl font-medium tracking-tight text-balance text-white md:text-3xl"
                    >
                      {block.name}
                    </h2>
                    <p className={`mt-4 max-w-lg ${BODY_CLASS}`}>
                      {block.description}
                    </p>
                  </ScrollReveal>
                  {/* The deliverables. Owner-owed (Rule 4.3): a block
                      with no approved bullets renders no list *and no
                      frame*, so the row simply ends at its description.
                      They live in `src/content/service-pages.ts`. */}
                  {block.included.length > 0 && (
                    <ul className="mt-8 max-w-lg space-y-4">
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
                                (§Interaction vocabulary: "a small gold
                                diamond"). The reference's lucide
                                glyphs are not reproduced — icons here
                                are inline SVG only and this marker is
                                settled vocabulary. */}
                            <span
                              aria-hidden="true"
                              className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold"
                            />
                            <span className="text-base leading-relaxed text-white/70">
                              {item}
                            </span>
                          </ScrollReveal>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* The home page's service-card CTA, exactly
                      (owner direction, 2026-08-28): `<ServiceCta>`, the
                      §Interaction-vocabulary gold underlined text link.
                      A service's CTA now looks the same wherever a
                      visitor meets it — the card that sent them here
                      and the block they landed on. This replaces the
                      reference's outline button, which was the shared
                      <Button> at `ghost`; same seam, same `need`, same
                      Rule 3.1 label, different affordance. */}
                  <div className="mt-10">
                    <ServiceCta
                      label={SERVICES_CTA}
                      need={block.need}
                      service={block.name}
                    />
                  </div>
                </div>
                <div className={visualLeads ? "lg:order-1" : "lg:order-2"}>
                  <ServiceBlockVisual block={block.id} />
                </div>
              </section>
            );
          })}
        </div>
      </div>
      <ServiceProcess />

      <section
        aria-labelledby="service-close-headline"
        className="w-full bg-ink px-6 pb-28 sm:px-8 sm:pb-32 lg:px-16 lg:pb-44"
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
                    <span className="text-gold">{CLOSE_ACCENT_PHRASE}</span>
                    {closeHeadline.slice(
                      closeAccentStart + CLOSE_ACCENT_PHRASE.length,
                    )}
                  </>
                )}
              </span>
            </SectionHeading>
          </ScrollReveal>
          {/* The CTA repeated, and nothing beside it. The close carried
            a gold text link to `/pricing` labelled `PRICING.headline`;
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
