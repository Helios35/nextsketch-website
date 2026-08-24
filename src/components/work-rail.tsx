"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowIcon } from "@/components/arrow-icon";
import {
  WORK_LINK,
  WORK_PLACEHOLDER_LABEL,
  WORK_RAIL,
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
 * - **Squared, not `rounded-xl`.** `rounded-none` is the shape of the
 *   brand (§How to build a new section, rule 1).
 * - **A segmented gold meter, not dots.** §Interaction vocabulary
 *   specifies the pagination affordance literally — `h-[3px] w-7`
 *   bars, `gap-1.5`, filled `bg-gold`, rest `bg-white/15` — and ends
 *   "No dots." Each bar is wrapped in a 44px target (§Layout).
 * - **Cards are glass panels, not image-overlay tiles.** The reference
 *   overlays its title and body on the image behind a gradient; these
 *   cards are screenshots of real products and the screenshot *is* the
 *   proof, so it keeps its own 16/9 frame and the copy sits below it
 *   in the Services-card surface (hairline `white/15` → `white/30` on
 *   hover, mono index with the gold diamond marker, `mt-auto` CTA row)
 *   — so the two card grids on the page read as one family.
 *
 * The elevated fill is solid `#0a0a0c` rather than the spec's
 * `#0a0a0c/95 backdrop-blur-xl`: that recipe exists so a card reads
 * over the moving video backdrop, and this section is the one opaque
 * band on the page (owner direction — footer-dark), so there is
 * nothing behind the card to blur. The surface color is unchanged, so
 * it still matches the Services cards optically and still honors
 * "never pure #000 for an elevated surface" (§Surfaces).
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

  /** Icon control — the ghost vocabulary at icon size (§Interaction). */
  const control =
    "inline-flex min-h-11 min-w-11 items-center justify-center border " +
    "border-white/30 text-white transition-colors duration-150 " +
    "hover:border-white/60 hover:bg-white/[0.06] " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white " +
    "disabled:pointer-events-none disabled:opacity-40";

  const showControls = mounted && scrollable;

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
        className="relative mt-14 snap-x snap-mandatory overflow-x-auto scroll-px-6 pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:scroll-px-8 md:mt-20 lg:scroll-px-16 [&::-webkit-scrollbar]:hidden"
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
        </ul>
      </div>

      {/* Pagination — the segmented meter of §Interaction vocabulary
          ("No dots."), made interactive: each 3px bar sits inside a
          44px target. */}
      {showControls && (
        <div className="mt-8 flex justify-center gap-1.5 px-6 sm:px-8 lg:px-16">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToCard(i)}
              aria-label={WORK_RAIL.goTo.replace("{n}", String(i + 1))}
              aria-current={i === active}
              className="group/bar inline-flex min-h-11 min-w-7 items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              <span
                className={`h-[3px] w-7 transition-colors duration-150 ${
                  i === active
                    ? "bg-gold"
                    : "bg-white/15 group-hover/bar:bg-white/40"
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
 * stickers on the ink band). It is the §Surfaces image-band recipe
 * applied for visual consistency rather than text legibility, so it is
 * split by tone instead of applied flat.
 *
 * Measured on the real sources: raw luminance runs 0.99 (the white
 * dashboard) down to 0.11 (the CAD tool). A single overlay multiplies,
 * so it drags all four down together and leaves that ratio untouched —
 * which is why "light" and "dark" carry different masks. A gentle
 * `contrast` pull does equalize, but it does so by washing UI detail
 * toward grey, and the screenshots are the section's whole proof, so
 * it is kept mild and the remaining spread is accepted.
 *
 * Static maps, not interpolation: Tailwind only compiles class
 * literals (the ACCENT_CLASS precedent in sketch-accent.tsx).
 *
 * Hover clears the mask entirely — full colour, no grade — so the work
 * itself is the reward for engaging. Colour and filter shifts run at
 * the system's micro-transition tempo; only the scale lift is
 * `motion-safe`-gated, since a value change is not motion.
 */
const IMAGE_TONE: Record<"light" | "dark", string> = {
  /** White or pale ground: desaturate, ease contrast, hold it back. */
  light:
    "saturate-[0.78] contrast-[0.95] brightness-[0.95] " +
    "group-hover/card:saturate-100 group-hover/card:contrast-100 group-hover/card:brightness-100",
  /** Already near-black: barely touch it, lift it just off the floor. */
  dark:
    "saturate-[0.9] brightness-[1.18] " +
    "group-hover/card:saturate-100 group-hover/card:brightness-100",
};

const OVERLAY_TONE: Record<"light" | "dark", string> = {
  light: "bg-ink/45 group-hover/card:bg-ink/5",
  dark: "bg-ink/10 group-hover/card:bg-transparent",
};

/**
 * One work card. Linking is per-item: a project with a public URL is a
 * real anchor carrying the gold link affordance and the arrow nudge; a
 * project without one renders the identical card as a plain container,
 * never a dead link. The whole card is the click target when it links,
 * so the gold row is presentational (`aria-hidden`) rather than a
 * nested second link.
 */
function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const linked = item.href !== undefined;
  const tone = item.tone ?? "light";

  const body = (
    <>
      {/* Fixed 16/9 frame, independent of the screenshot's real size —
          every card matches (owner requirement, 2026-08-24). */}
      <div className="relative aspect-video overflow-hidden border-b border-white/10 bg-white/[0.03]">
        {item.image !== undefined ? (
          <Image
            src={item.image}
            alt={item.alt}
            width={1600}
            height={900}
            sizes="(min-width: 1024px) 26rem, (min-width: 640px) 24rem, 82vw"
            className={`h-full w-full object-cover transition-[scale,filter] duration-300 motion-safe:group-hover/card:scale-105 ${IMAGE_TONE[tone]} ${
              item.focal === "top" ? "object-top" : "object-center"
            }`}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-mono text-xs tracking-[0.14em] text-white/40 uppercase">
            {WORK_PLACEHOLDER_LABEL}
          </span>
        )}
        {/* Flat grade, weighted by the screenshot's key (IMAGE_TONE). */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 transition-colors duration-300 ${OVERLAY_TONE[tone]}`}
        />
        {/* The §Surfaces bottom scrim, confined to the lower two
            thirds: it dissolves the image's bottom edge into the card
            instead of stopping at a hard line above the copy. A
            full-height `via-ink/25` was tried first and compounded
            with the flat layer into a muddy middle. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/90 to-transparent"
        />
      </div>
      <div className="flex grow flex-col p-6 md:p-8">
        <p className="flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.14em] text-white/55 uppercase">
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-gold" />
          {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-6 text-lg font-medium text-white md:text-xl">
          {item.name}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-white/70">
          {item.summary}
        </p>
        {linked && (
          <span
            aria-hidden="true"
            className="mt-auto inline-flex items-center gap-2 pt-6 text-base font-medium text-gold underline underline-offset-4 transition-colors duration-150 group-hover/card:text-white"
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
    "group/card flex h-full flex-col border border-white/15 bg-[#0a0a0c] " +
    "transition-colors duration-150 hover:border-white/30";

  if (!linked) {
    return <div className={surface}>{body}</div>;
  }
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`${item.name} — ${WORK_LINK}`}
      className={`${surface} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
    >
      {body}
    </a>
  );
}
