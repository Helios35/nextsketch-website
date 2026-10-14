"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import { Button } from "@/components/button";
import {
  WORK_LINK,
  WORK_PLACEHOLDER_LABEL,
  WORK_RAIL,
  WORK_VIEW_ALL,
} from "@/content/work";
import type { WorkItem } from "@/lib/types";
import { useMounted } from "@/lib/use-mounted";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

interface WorkRailProps {
  items: readonly WorkItem[];
  /** Server-rendered heading block, laid out beside the rail controls. */
  children: ReactNode;
}

/**
 * Horizontal work rail — the adapted reference gallery (owner-supplied
 * shadcn "gallery4" component, 2026-08-24). The reference contributed
 * *composition* only: a heading row with the advance controls pinned
 * right, a horizontally scrolling card rail that bleeds off the right
 * gutter, and pagination beneath. Every token, face, shape and control
 * here is this system's — the reference's own vocabulary is replaced
 * wholesale, per docs/04-ux-spec.md:
 *
 * - **No new dependencies.** The reference needs embla-carousel-react,
 *   lucide-react, radix Slot and cva; this project ships zero UI
 *   libraries. The rail is native CSS scroll-snap (which also gives
 *   the reference's mobile `dragFree` momentum for free), the icon is
 *   the shared <ArrowIcon> (§Interaction vocabulary: "Icons are inline
 *   SVG, never lucide-react"), and JS only *enhances* — it never
 *   drives the scroll.
 * - **fin's card radius.** The squared-corner rule is retired
 *   (decision-log #48): cards take `rounded-xl` and clip their
 *   screenshot frame (`overflow-hidden`), so the image shares the
 *   card's corners.
 * - **A segmented coral meter, not dots.** §Interaction vocabulary
 *   specifies the pagination affordance literally: `h-[3px] w-7`
 *   bars, `gap-1.5`, filled `bg-brand`, both `rounded-full`
 *   (decision-log #47, #48), and it ends "No dots." The rest bars
 *   are `muted-foreground` at 70% (about 3.25:1 on `background`):
 *   each is the only visible mark of a real button, so it holds
 *   fin's 3:1 floor for marks, which `muted` (1.3:1) did not.
 *   Each bar is wrapped in a 44px target (§Layout).
 * - **Cards are panels, not image-overlay tiles.** The reference
 *   overlays its title and body on the image behind a gradient; these
 *   cards are screenshots of real products and the screenshot *is* the
 *   proof, so it keeps its own 16/9 frame and the copy sits below it
 *   in the Services-card surface (`card` fill, `border` hairline
 *   lifting to `muted-foreground/50` on hover, mono index with the
 *   coral diamond marker, `mt-auto` CTA row), so the two card grids on
 *   the page read as one family.
 *
 * The elevated fill is solid `card`, the same as the Services cards.
 * Glass (`card/95 backdrop-blur-xl`) is for a surface that floats over
 * something, and this section is an opaque `background` band (owner
 * direction: footer-dark), so there is nothing behind the card to
 * blur. `card` sits one step above `background` and the `border`
 * hairline is what separates the two (§Surfaces, decision-log #47).
 *
 * Motion: hover treatments are the shared 150ms micro-transition and
 * the image's `scale-105` lift is `motion-safe`-gated. No keyframes
 * are added — the entrance is the shared <ScrollReveal> in the parent.
 *
 * No-JS / reduced-motion parity: the rail is a plain overflow-x
 * scroller, so it scrolls natively with no JS at all and every card is
 * reachable. The controls are pure enhancement and mount only once
 * hydrated (their row keeps a reserved height, so nothing shifts);
 * programmatic scrolling drops to `behavior: "auto"` under reduced
 * motion, matching the `globals.css` gate on smooth anchor scrolling.
 */
export function WorkRail({ items, children }: WorkRailProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  /** Scroll offsets that land each card on the left gutter. */
  const targetsRef = useRef<number[]>([]);

  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  /** False when every card already fits — the controls are then noise. */
  const [scrollable, setScrollable] = useState(false);

  const mounted = useMounted();
  const reduceMotion = usePrefersReducedMotion();

  /**
   * Snap targets are measured, never assumed: card width is viewport-
   * relative and the gutter steps at two breakpoints, so the only
   * reliable source is layout itself. A card's target is its offset
   * inside the scroller minus the track's own left padding — the
   * padding is what places card one on the gutter at scrollLeft 0, and
   * `scroll-px-*` mirrors it so native snapping agrees with these
   * numbers.
   */
  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (scroller === null || track === null) return;
    const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    targetsRef.current = Array.from(track.children).map(
      (child) => (child as HTMLElement).offsetLeft - padLeft,
    );
    setScrollable(scroller.scrollWidth > scroller.clientWidth + 1);
  }, []);

  const sync = useCallback(() => {
    const scroller = scrollerRef.current;
    if (scroller === null) return;
    const { scrollLeft, clientWidth, scrollWidth } = scroller;
    const maxScroll = scrollWidth - clientWidth;
    const start = scrollLeft <= 1;
    const end = scrollLeft >= maxScroll - 1;
    setAtStart(start);
    setAtEnd(end);
    const targets = targetsRef.current;
    if (targets.length === 0) return;
    // At the far end the trailing cards can never reach the gutter, so
    // nearest-target would keep reporting an earlier card as current.
    // Pin the meter to the last card instead — that is what the
    // visitor is actually looking at.
    if (end) {
      setActive(targets.length - 1);
      return;
    }
    let nearest = 0;
    let best = Infinity;
    targets.forEach((target, i) => {
      const distance = Math.abs(scrollLeft - target);
      if (distance < best) {
        best = distance;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (scroller === null || track === null) return;

    const remeasure = () => {
      measure();
      sync();
    };
    remeasure();

    scroller.addEventListener("scroll", sync, { passive: true });
    // The card width is a vw clamp and the gutter steps at breakpoints,
    // so a resize moves every target. ResizeObserver rather than a
    // window listener: the rail also reflows when the font loads.
    const observer = new ResizeObserver(remeasure);
    observer.observe(scroller);
    observer.observe(track);
    return () => {
      scroller.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [measure, sync]);

  const scrollToCard = (index: number) => {
    const scroller = scrollerRef.current;
    const targets = targetsRef.current;
    if (scroller === null || targets.length === 0) return;
    const clamped = Math.min(Math.max(index, 0), targets.length - 1);
    scroller.scrollTo({
      left: targets[clamped],
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  /** Icon control: the secondary/ghost button vocabulary at icon size
   *  (§Interaction; `rounded-md`, decision-log #47, #48). */
  const control =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border " +
    "border-border bg-secondary text-foreground transition-colors duration-150 " +
    "hover:bg-accent " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
    "disabled:pointer-events-none disabled:opacity-50";

  const showControls = mounted && scrollable;

  /**
   * Meter positions, which are the rail's snap positions — the work
   * cards plus the trailing View all card. Derived from the same list
   * the track renders so the two can't drift: a bar count short of the
   * card count would leave the last position with nothing lit, since
   * `sync` pins `active` to the final target at the scroll end.
   */
  const slides = [
    ...items.map((item, i) => ({
      key: item.id,
      label: WORK_RAIL.goTo.replace("{n}", String(i + 1)),
    })),
    { key: "view-all", label: WORK_RAIL.goToViewAll },
  ];

  return (
    <>
      {/* Heading left, advance controls right — the reference's row.
          min-h-11 reserves the control height before hydration so the
          controls appearing never shifts the rail. */}
      <div className="flex items-end justify-between gap-8 px-6 sm:px-8 lg:px-16">
        {children}
        <div className="hidden min-h-11 shrink-0 gap-2 md:flex">
          {showControls && (
            <>
              <button
                type="button"
                onClick={() => scrollToCard(active - 1)}
                disabled={atStart}
                aria-label={WORK_RAIL.previous}
                className={control}
              >
                <ArrowIcon className="size-5 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => scrollToCard(active + 1)}
                disabled={atEnd}
                aria-label={WORK_RAIL.next}
                className={control}
              >
                <ArrowIcon className="size-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* The rail bleeds off the right gutter: the scroller is
          full-width and the gutters live on the track's padding, so
          card one aligns to the heading and the last card runs to the
          edge. `scroll-px-*` mirrors that padding so native snap
          positions match the measured targets. */}
      <div
        ref={scrollerRef}
        role="group"
        aria-label={WORK_RAIL.label}
        tabIndex={0}
        className="relative mt-14 snap-x snap-mandatory overflow-x-auto scroll-px-6 pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:scroll-px-8 md:mt-20 lg:scroll-px-16 [&::-webkit-scrollbar]:hidden"
      >
        <ul
          ref={trackRef}
          className="flex w-max gap-4 px-6 sm:px-8 lg:px-16"
        >
          {items.map((item, i) => (
            <li
              key={item.id}
              className="w-[82vw] shrink-0 snap-start sm:w-[24rem] lg:w-[26rem]"
            >
              <WorkCard item={item} index={i} />
            </li>
          ))}
          {/* The trailing slide closes the rail with the archive link
              rather than a screenshot. It is a real snap position, so
              it carries a meter bar of its own (see `slides`). */}
          <li className="w-[82vw] shrink-0 snap-start sm:w-[24rem] lg:w-[26rem]">
            <ViewAllCard />
          </li>
        </ul>
      </div>

      {/* Pagination — the segmented meter of §Interaction vocabulary
          ("No dots."), made interactive: each 3px bar sits inside a
          44px target. */}
      {showControls && (
        <div className="mt-8 flex justify-center gap-1.5 px-6 sm:px-8 lg:px-16">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={slide.label}
              aria-current={i === active}
              className="group/bar inline-flex min-h-11 min-w-7 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span
                className={`h-[3px] w-7 rounded-full transition-colors duration-150 ${
                  i === active
                    ? "bg-brand"
                    : "bg-muted-foreground/70 group-hover/bar:bg-muted-foreground"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

/**
 * The grading mask, per screenshot key (owner direction 2026-08-24:
 * the screenshots arrive in four unrelated palettes — light
 * periwinkle, white, near-black, white/violet — and read as four loose
 * stickers on the dark band). It is the §Surfaces image-band recipe
 * applied for visual consistency rather than text legibility, so it is
 * split by tone instead of applied flat.
 *
 * Measured on the shipped sources rather than eyeballed. Mean
 * luminance over the unscrimmed top of each frame: 0.57 (kids device),
 * 0.92 (dashboard), 0.40 (CAD tool), 0.76 (phone mockups). Only the
 * dashboard is a real outlier, so one base grade carries the set and
 * `bright` holds that single card back harder — which lands all four
 * inside a 0.18 band, against 0.52 raw.
 *
 * A stronger `contrast` pull would equalize further, but only by
 * washing UI detail toward grey, and the screenshots are the section's
 * whole proof — so the pull stays mild and the residual spread is
 * accepted deliberately.
 *
 * There is no "dark" variant, despite the CAD tool reading as dark: it
 * is bimodal — a near-black app inside a light grey canvas — so
 * lifting it blows that canvas out and makes it the second-brightest
 * card in the rail. It takes the base grade like everything else. A
 * genuinely near-black screenshot would need its own variant; none of
 * the current set is one.
 *
 * Static maps, not interpolation: Tailwind only compiles class
 * literals (the ACCENT_CLASS precedent in sketch-accent.tsx).
 *
 * Hover clears the mask entirely — full colour, no grade — so the work
 * itself is the reward for engaging. Colour and filter shifts run at
 * the system's micro-transition tempo; only the scale lift is
 * `motion-safe`-gated, since a value change is not motion.
 */
const CLEAR =
  "group-hover/card:saturate-100 group-hover/card:contrast-100 group-hover/card:brightness-100";

const IMAGE_TONE: Record<"light" | "bright", string> = {
  /** The base grade — mid-toned and mixed screenshots alike. */
  light: `saturate-[0.85] contrast-[0.95] brightness-[0.95] ${CLEAR}`,
  /** Near-white screenshot: pulled down harder so it doesn't glare. */
  bright: `saturate-[0.85] contrast-[0.92] brightness-[0.86] ${CLEAR}`,
};

const OVERLAY_TONE: Record<"light" | "bright", string> = {
  light: "bg-background/45 group-hover/card:bg-background/5",
  bright: "bg-background/50 group-hover/card:bg-background/5",
};

/**
 * The rail's trailing card: one control to the full archive instead of
 * a screenshot (owner direction 2026-08-24). It takes the same
 * surface, width and stretched height as a work card, so it closes the
 * set rather than reading as an afterthought, and the button sits
 * centred in it.
 *
 * Ghost, not the stone (`primary`) divided-arrow advance: that surface
 * is the page's conversion affordance (the hero CTA and #start), and
 * browsing to an archive is exactly the de-emphasized action ghost exists for
 * (§Interaction vocabulary). It keeps the advance button scarce, the
 * same way coral is kept scarce.
 *
 * The destination is owner-owed, so with no `href` the control renders
 * as a genuinely disabled button in the system's documented disabled
 * state (§Interaction vocabulary: `opacity-50`, pointer-events off),
 * honest about not being wired rather than an anchor pointing nowhere,
 * and inert to keyboard and pointer alike. The card also drops its
 * hover border in that state, since nothing there responds. Setting
 * `href` in src/content/work.ts is the only change needed to make it
 * live.
 */
function ViewAllCard() {
  const { label, href } = WORK_VIEW_ALL;
  const surface =
    "flex h-full items-center justify-center rounded-xl border border-border " +
    "bg-card p-6 md:p-8";

  if (href === undefined) {
    return (
      <div className={surface}>
        <Button variant="ghost" arrow disabled className="opacity-50">
          {label}
        </Button>
      </div>
    );
  }
  return (
    <div
      className={`${surface} transition-colors duration-150 hover:border-muted-foreground/50`}
    >
      <Button variant="ghost" arrow href={href}>
        {label}
      </Button>
    </div>
  );
}

/**
 * One work card. Linking is per-item: a project with a public URL is a
 * real anchor carrying the coral link affordance and the arrow nudge; a
 * project without one renders the identical card as a plain container,
 * never a dead link. The whole card is the click target when it links,
 * so the coral row is presentational (`aria-hidden`) rather than a
 * nested second link.
 */
function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const linked = item.href !== undefined;
  const tone = item.tone ?? "light";

  const body = (
    <>
      {/* Fixed 16/9 frame, independent of the screenshot's real size —
          every card matches (owner requirement, 2026-08-24). */}
      <div className="relative aspect-video overflow-hidden border-b border-border bg-secondary">
        {item.image !== undefined ? (
          <Image
            src={item.image}
            alt={item.alt}
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 24rem, 82vw"
            className={`h-full w-full object-cover transition-[scale,filter] duration-150 motion-safe:group-hover/card:scale-105 ${IMAGE_TONE[tone]} ${
              item.focal === "top" ? "object-top" : "object-center"
            }`}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
            {WORK_PLACEHOLDER_LABEL}
          </span>
        )}
        {/* Flat grade, weighted by the screenshot's key (IMAGE_TONE). */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-colors duration-150 ${OVERLAY_TONE[tone]}`}
        />
        {/* The §Surfaces bottom scrim, confined to the lower two
            thirds: it dissolves the image's bottom edge into the card
            instead of stopping at a hard line above the copy. It fades
            to `card`, the fill below it, not to `background`, which
            would leave a darker band where the image meets the card. A
            full-height `via-background/25` was tried first and
            compounded with the flat layer into a muddy middle. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card/90 to-transparent"
        />
      </div>
      <div className="flex grow flex-col p-6 md:p-8">
        <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-brand" />
          {String(index + 1).padStart(2, "0")}
        </p>
        {/* One line of title over two of body, fixed (owner
            requirement, 2026-08-24) — the clamps are a guarantee, not
            the mechanism: the copy in src/content/work.ts is written
            to sit inside both at the narrowest card width, so neither
            ellipsis should ever appear. They exist so a later copy
            edit can lengthen a card without silently pushing the rail
            out of alignment. */}
        <h3 className="mt-6 line-clamp-1 font-sans text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {item.name}
        </h3>
        <p className="mt-3 line-clamp-2 text-base leading-relaxed text-foreground">
          {item.summary}
        </p>
        {linked && (
          <span
            aria-hidden="true"
            className="mt-auto inline-flex items-center gap-2 pt-6 text-base font-medium text-brand underline underline-offset-4 transition-colors duration-150 group-hover/card:text-foreground"
          >
            {WORK_LINK}
            <span className="transition-[translate] duration-150 motion-safe:group-hover/card:translate-x-0.5">
              <ArrowIcon className="size-4" />
            </span>
          </span>
        )}
      </div>
    </>
  );

  const surface =
    "group/card flex h-full flex-col overflow-hidden rounded-xl border " +
    "border-border bg-card transition-colors duration-150 " +
    "hover:border-muted-foreground/50";

  if (!linked) {
    return <div className={surface}>{body}</div>;
  }
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${item.name} — ${WORK_LINK}`}
      className={`${surface} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
    >
      {body}
    </a>
  );
}
