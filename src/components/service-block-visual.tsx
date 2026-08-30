import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { VisualFade } from "@/components/visual-fade";
import type { ServiceBlockId } from "@/lib/types";

/**
 * The decorative half of a "what you get" row (decision-log **#30**) —
 * one purpose-built wireframe per block.
 *
 * **Five visuals, not five shuffles (owner feedback, 2026-08-28).** The
 * first cut gave every block the same tile cluster with the marks
 * reordered, which read as one visual repeated five times. The owner
 * named what four of them should be: a product UI for New Product, a
 * developer workspace for Product Completion, a dashboard UI for
 * Internal Tool, the tile cluster kept for AI Workflow Integration, and
 * a free choice for Product Support (a live-product ops panel: that
 * service is "the product is live, now it needs to grow"). "Not apps"
 * was said twice, so no mock is a grid of equal squares.
 *
 * **They are wireframes, and that is a Rule 4.3 requirement, not a
 * style choice.** Not one contains a readable string, a numeral, a
 * metric, a logo or a product name. A mock showing a chart with an
 * axis, a dashboard with figures, or a row of integration logos would
 * assert things nobody has approved, on the two pages a search visitor
 * lands on first — which is what Rule 4.3 and decision **#5** (the
 * retired stat strip's invented numbers) exist to stop. Skeleton bars
 * assert nothing, and every visual is `aria-hidden` so it says nothing
 * to assistive tech either.
 *
 * **Colour — a narrow supersession of decision #14 (owner direction,
 * 2026-08-28).** #14 orphaned every accent but gold, and the unit-26
 * brief repeats it: "Do not read the per-service `accent` field… those
 * values are dead data." The owner asked for these mocks to carry
 * colour "in the same colour range as our palette (reds greens and
 * others)", which is `rose`, `sage` and `lavender`. That is honoured
 * **narrowly, the way #26 narrowly superseded "no CTA in the nav"**:
 *
 * - The colours appear **only as interface chrome inside a decorative
 *   wireframe** — syntax highlighting, status dots, an avatar chip.
 *   They are what makes a mock read as a real screen instead of grey
 *   bars.
 * - They are **never a brand accent and never per-service**. No block
 *   owns a colour, the `accent` field in `src/content/services.ts` is
 *   still unread and still dead, and the retired accent-block card
 *   vocabulary stays retired.
 * - **`gold` remains the only emphasis.** Each mock spends it at full
 *   strength on the element that is the point of it — the primary
 *   action, the active tab, the current release, the active nav item,
 *   the centre tile. The others sit at 45–85% alpha, which was tuned
 *   in-browser rather than guessed: below ~70% a 1.25px stroke on a
 *   near-black tile reads grey, and above ~85% they start competing
 *   with gold. They are chrome, and they stay under it.
 * - **No new token.** #14's "no new tokens" clause is untouched: these
 *   are the four that already exist in `globals.css`.
 *
 * **Adapted from an owner-supplied shadcn reference, layout only** —
 * the posture PR #27 took with the gallery and build-note 23 with the
 * pricing module. It contributed the split row, the alternation, the
 * tile cluster kept below, and the fade that dissolves a visual into
 * the page. It did **not** contribute any of its dependencies (`Card`,
 * `Button`, `lucide-react`, `@radix-ui/react-slot`,
 * `class-variance-authority`, a `cn()` helper, a `/components/ui`
 * directory — **none installed**), its third-party product logos, its
 * `rounded-xl`, or its shadcn token palette.
 *
 * **One box, one fade (owner direction).** All five sit in the same
 * `4/3` frame so the rows line up down the page, and all five carry the
 * cluster's radial fade rather than the earlier bottom scrim, so each
 * dissolves into the page from every edge instead of only the bottom.
 *
 * Server component. Entrances are the shared `ScrollReveal` at the
 * §Motion-inventory list rhythm, so each mock assembles region by
 * region rather than appearing; no keyframe was added and
 * `globals.css` is untouched.
 */

/**
 * Shared outer box — every mock occupies the same footprint.
 *
 * It **fills its column from `lg:` up**, where the row is two-up, so the
 * mock's outer edge meets the page measure exactly as the text column's
 * does on the other side (owner direction, 2026-08-30). Centred inside
 * the track it was inset from that edge by ~48px, which is precisely
 * the row-to-row inconsistency the measure was added to remove. Below
 * `lg:` the row is stacked and the cap comes back, so a mock never
 * blows up to the full band width on a tablet.
 */
const SHELL = "relative mx-auto w-full max-w-md lg:max-w-none";

/** The shared aspect box. Squared, hairline, solid — no blur, since
 *  no `ScrollVideo` is mounted here (#17) and there is nothing behind
 *  a mock to blur. */
const FRAME =
  "relative flex aspect-[4/3] flex-col overflow-hidden border border-white/15 bg-[#0a0a0c]";

/** A skeleton line. Width and tone come from the caller. */
function Bar({ className }: { className: string }) {
  return <span className={`block h-1.5 ${className}`} />;
}

/** The profile chip every mock's chrome carries (owner direction). */
function Profile() {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <span className="h-1.5 w-7 bg-white/15" />
      <span className="size-5 border border-white/20 bg-lavender/55" />
    </span>
  );
}

/** A status dot in the interface-chrome palette. */
function Dot({ tone }: { tone: string }) {
  return <span className={`size-1.5 shrink-0 rotate-45 ${tone}`} />;
}

/* ------------------------------------------------------------------ *
 * New Product — a product dashboard, as a bento mosaic.               *
 * Replaces the single window mock, which read as a generic skeleton    *
 * box (owner, 2026-08-30). Structure adapted from an owner-supplied    *
 * dashboard reference; **this block only** — the other four visuals    *
 * and the shared `Fade` / `FRAME` are untouched.                      *
 *                                                                      *
 * Rule 4.3 is unchanged and is why every figure, label and logo in     *
 * that reference is a bar here: a dashboard printing invented balances  *
 * and brand marks is exactly the claim decision #5 retired the stat     *
 * strip over. Chrome tints are the #31 set; `gold` appears once, on     *
 * the area chart, and nowhere else.                                    *
 * ------------------------------------------------------------------ */

/**
 * One tile in the mosaic. The mosaic is deliberately **not** wrapped in
 * `FRAME`: a bento cropped by a hard outer border reads as a
 * screenshot, which is the thing being replaced. Each tile carries its
 * own hairline instead and the grid dissolves at the box edge.
 *
 * `min-w-0` and `overflow-hidden` are load-bearing, not tidy-up. A grid
 * item defaults to `min-width: auto`, so a fixed-width bar inside a
 * narrow column pushes the track wider, the grid wider, and the page
 * wider — a horizontal scrollbar on a phone, from a decorative mock.
 * With these the content clips instead, which the fade hides anyway.
 */
function MosaicTile({
  delay,
  className = "",
  children,
}: {
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <ScrollReveal delay={delay} className="min-h-0 min-w-0">
      <div
        className={`flex h-full min-w-0 flex-col overflow-hidden border border-white/15 bg-[#0a0a0c] ${className}`}
      >
        {children}
      </div>
    </ScrollReveal>
  );
}

/** Ranked rows: a filled bar of decreasing width beside a value bar. */
const RANKED: readonly { w: string; tone: string }[] = [
  { w: "w-full", tone: "bg-lavender/70" },
  { w: "w-4/5", tone: "bg-sage/70" },
  { w: "w-3/5", tone: "bg-rose/70" },
  { w: "w-2/5", tone: "bg-white/25" },
];

/** List rows: a tinted mark beside a label. */
const LIST_ROWS: readonly string[] = [
  "bg-rose/70",
  "bg-sage/70",
  "bg-lavender/70",
  "bg-white/25",
];

function NewProductVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="grid h-full grid-cols-[1.15fr_1.2fr_0.8fr] gap-2.5">
          {/* Left column. */}
          <div className="grid min-h-0 min-w-0 grid-rows-[1.05fr_1fr] gap-2.5">
            {/* Headline figure over an area chart. The chart is the one
                gold element in the whole mosaic; everything else is
                chrome or the white alpha ladder. */}
            <MosaicTile delay={120} className="p-3.5">
              <Bar className="w-16 bg-white/35" />
              <span className="mt-3 block h-4 w-3/4 bg-white/85" />
              <span className="mt-2.5 flex items-center gap-2">
                <Dot tone="bg-sage/80" />
                <Bar className="w-20 bg-white/20" />
              </span>
              <div className="-mx-3.5 -mb-3.5 mt-auto h-1/2">
                <svg
                  viewBox="0 0 200 70"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                >
                  <defs>
                    <linearGradient id="np-area" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--color-gold)"
                        stopOpacity="0.32"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-gold)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 58 L18 52 L34 54 L52 44 L70 46 L88 34 L104 37 L122 26 L140 22 L158 14 L176 12 L200 4 L200 70 L0 70 Z"
                    fill="url(#np-area)"
                  />
                  <path
                    d="M0 58 L18 52 L34 54 L52 44 L70 46 L88 34 L104 37 L122 26 L140 22 L158 14 L176 12 L200 4"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </MosaicTile>

            {/* Two-series line chart over a gridded plot. */}
            <MosaicTile delay={190} className="p-3.5">
              <Bar className="w-20 bg-white/35" />
              <span className="mt-2.5 flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-4 bg-rose/80" />
                  <Bar className="w-8 bg-white/20" />
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-4 bg-white/45" />
                  <Bar className="w-8 bg-white/20" />
                </span>
              </span>
              <div className="mt-auto flex grow items-stretch gap-2 pt-3">
                <span className="flex w-4 shrink-0 flex-col justify-between py-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span key={i} className="h-1 w-3 bg-white/15" />
                  ))}
                </span>
                <span className="relative grow">
                  <svg
                    viewBox="0 0 200 80"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                  >
                    {[4, 22, 40, 58, 76].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="200"
                        y2={y}
                        stroke="currentColor"
                        strokeWidth="1"
                        className="text-white/10"
                      />
                    ))}
                    <path
                      d="M0 76 L30 70 L60 52 L90 40 L120 26 L150 18 L200 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/45"
                    />
                    <path
                      d="M0 78 L30 76 L60 72 L90 66 L120 62 L150 58 L200 54 L200 80 L0 80 Z"
                      fill="currentColor"
                      className="text-rose/25"
                    />
                    <path
                      d="M0 78 L30 76 L60 72 L90 66 L120 62 L150 58 L200 54"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-rose/80"
                    />
                  </svg>
                </span>
              </div>
            </MosaicTile>
          </div>

          {/* Middle column. */}
          <div className="grid min-h-0 min-w-0 grid-rows-[0.85fr_1.25fr_0.9fr] gap-2.5">
            {/* Goal card with a progress track. */}
            <MosaicTile delay={250} className="p-3.5">
              <span className="flex items-center gap-2.5">
                <span className="size-7 shrink-0 border border-white/20 bg-white/5" />
                <span className="space-y-1.5">
                  <Bar className="w-24 bg-white/35" />
                  <Bar className="w-14 bg-white/20" />
                </span>
              </span>
              <span className="mt-auto block h-2 w-full bg-white/[0.07]">
                <span className="block h-full w-[62%] bg-sage/75" />
              </span>
              <span className="mt-2.5 flex items-center gap-2">
                <Dot tone="bg-sage/80" />
                <Bar className="w-16 bg-white/20" />
              </span>
            </MosaicTile>

            {/* Ranked category bars. */}
            <MosaicTile delay={310} className="p-3.5">
              <Bar className="w-28 bg-white/35" />
              <div className="mt-auto space-y-2.5">
                {RANKED.map((row, i) => (
                  <span key={i} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 items-center gap-2 px-2 ${row.w} ${row.tone}`}
                    >
                      <span className="size-1.5 shrink-0 rotate-45 bg-ink/40" />
                      <span className="h-1.5 w-8 bg-ink/30" />
                    </span>
                    <Bar className="w-10 shrink-0 bg-white/25" />
                  </span>
                ))}
              </div>
            </MosaicTile>

            {/* Three-figure stat row beside a squared gauge. */}
            <MosaicTile delay={370} className="p-3.5">
              <span className="flex items-start justify-between">
                <Bar className="h-2.5 w-20 bg-white/45" />
                <span className="flex size-9 shrink-0 items-center justify-center border-2 border-white/12 border-t-sage/80 border-r-sage/80">
                  <span className="size-3 bg-white/15" />
                </span>
              </span>
              <div className="mt-auto grid grid-cols-3 gap-2">
                {["bg-white/70", "bg-white/70", "bg-sage/80"].map((tone, i) => (
                  <span key={i} className="space-y-2">
                    <Bar className="w-10 bg-white/20" />
                    <span className={`block h-2.5 w-12 ${tone}`} />
                  </span>
                ))}
              </div>
            </MosaicTile>
          </div>

          {/* Right column. */}
          <div className="grid min-h-0 min-w-0 grid-rows-[1.1fr_1fr] gap-2.5">
            {/* Scheduled list: a mark and a two-line row, hairline divided. */}
            <MosaicTile delay={430}>
              <span className="border-b border-white/10 px-3.5 py-3">
                <Bar className="w-20 bg-white/40" />
              </span>
              <div className="flex grow flex-col justify-around">
                {LIST_ROWS.map((tone, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-2.5 border-b border-white/[0.07] px-3.5 py-2.5 last:border-b-0"
                  >
                    <span
                      className={`size-5 shrink-0 border border-white/15 ${tone}`}
                    />
                    <span className="space-y-1.5">
                      <Bar className="w-12 bg-white/30" />
                      <Bar className="w-8 bg-white/15" />
                    </span>
                  </span>
                ))}
              </div>
            </MosaicTile>

            {/* Activity list: a mark and a single line. */}
            <MosaicTile delay={490}>
              <span className="border-b border-white/10 px-3.5 py-3">
                <Bar className="w-16 bg-white/40" />
              </span>
              <div className="flex grow flex-col justify-around px-3.5">
                {LIST_ROWS.map((tone, i) => (
                  <span key={i} className="flex items-center gap-2.5">
                    <span className={`size-1.5 shrink-0 rotate-45 ${tone}`} />
                    <Bar className="w-16 bg-white/30" />
                  </span>
                ))}
              </div>
            </MosaicTile>
          </div>
        </div>
        <VisualFade />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Completion — a developer workspace.                         *
 * Tabs, a gutter, syntax-coloured code that thins out and stops, and  *
 * a parked caret: "got you 70% there and disappeared."                *
 * ------------------------------------------------------------------ */

/**
 * Each line is its own run of coloured tokens. The colours are the
 * editor's, not the brand's — keywords, strings, comments — and the
 * tail deliberately thins to nothing, which is the whole metaphor.
 */
const CODE_LINES: readonly (readonly { w: string; tone: string }[])[] = [
  [
    { w: "w-8", tone: "bg-lavender/80" },
    { w: "w-14", tone: "bg-white/25" },
    { w: "w-6", tone: "bg-sage/75" },
  ],
  [
    { w: "w-4", tone: "bg-white/10" },
    { w: "w-10", tone: "bg-lavender/80" },
    { w: "w-20", tone: "bg-sage/75" },
  ],
  [
    { w: "w-4", tone: "bg-white/10" },
    { w: "w-12", tone: "bg-white/20" },
    { w: "w-8", tone: "bg-rose/75" },
  ],
  [
    { w: "w-8", tone: "bg-white/10" },
    { w: "w-9", tone: "bg-lavender/80" },
    { w: "w-14", tone: "bg-white/20" },
  ],
  [
    { w: "w-8", tone: "bg-white/10" },
    { w: "w-16", tone: "bg-sage/75" },
  ],
  /* The comment the last firm left behind, then the stub. */
  [{ w: "w-24", tone: "bg-white/12" }],
  [
    { w: "w-4", tone: "bg-white/10" },
    { w: "w-6", tone: "bg-white/15" },
  ],
];

function ProductCompletionVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={FRAME}>
          {/* Tab strip. The first tab is active, marked by the gold
              underline the Process accordion uses for "you are here". */}
          <div className="flex items-stretch border-b border-white/10 pr-4">
            <span className="flex items-center gap-2 border-b border-gold px-4 py-3">
              <span className="size-1.5 rotate-45 bg-gold" />
              <span className="h-1.5 w-10 bg-white/30" />
            </span>
            <span className="flex items-center gap-2 px-4 py-3">
              <Dot tone="bg-sage/80" />
              <span className="h-1.5 w-8 bg-white/10" />
            </span>
            <span className="flex items-center gap-2 px-4 py-3">
              <Dot tone="bg-lavender/80" />
              <span className="h-1.5 w-7 bg-white/10" />
            </span>
            <span className="grow" />
            <span className="flex items-center">
              <Profile />
            </span>
          </div>
          <div className="flex grow">
            {/* Line-number gutter. Ticks, never numerals: a numeral is
                content and this mock carries none. */}
            <div className="flex flex-col gap-[11px] border-r border-white/10 px-3 py-4">
              {CODE_LINES.map((_, i) => (
                <span key={i} className="h-1.5 w-2 bg-white/15" />
              ))}
              <span className="h-1.5 w-2 bg-white/[0.06]" />
              <span className="h-1.5 w-2 bg-white/[0.06]" />
            </div>
            <div className="grow px-4 py-4">
              {CODE_LINES.map((line, i) => (
                <ScrollReveal key={i} delay={200 + i * 55}>
                  <span
                    className={`mb-[11px] flex items-center gap-2 ${
                      i === 0 ? "" : i < 5 ? "pl-4" : "pl-0"
                    }`}
                  >
                    {line.map((token, t) => (
                      <span
                        key={t}
                        className={`block h-1.5 ${token.w} ${token.tone}`}
                      />
                    ))}
                  </span>
                </ScrollReveal>
              ))}
              {/* The caret, parked where the last firm stopped. */}
              <ScrollReveal delay={200 + CODE_LINES.length * 55}>
                <span className="block h-3 w-0.5 bg-gold" />
              </ScrollReveal>
            </div>
          </div>
          {/* Status bar. */}
          <div className="flex items-center gap-3 border-t border-white/10 px-4 py-2.5">
            <Dot tone="bg-sage/85" />
            <span className="h-1.5 w-10 bg-white/12" />
            <Dot tone="bg-rose/85" />
            <span className="h-1.5 w-6 bg-white/12" />
            <span className="grow" />
            <span className="h-1.5 w-8 bg-white/12" />
          </div>
          <VisualFade />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Support — a live-product ops panel.                         *
 * Uptime ticks and a release timeline: "the product is live. Now it   *
 * needs to grow." No axis, no scale, no figures.                      *
 * ------------------------------------------------------------------ */

/** Mostly healthy, one bad patch, the newest two current. */
const TICKS: readonly string[] = [
  "bg-sage/75",
  "bg-sage/75",
  "bg-sage/75",
  "bg-rose/80",
  "bg-sage/75",
  "bg-sage/75",
  "bg-sage/75",
  "bg-sage/75",
  "bg-rose/80",
  "bg-sage/75",
  "bg-sage/75",
  "bg-sage/75",
  "bg-gold",
  "bg-gold",
];

const TICK_HEIGHTS = ["h-7", "h-9", "h-8", "h-10"];

function ProductSupportVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={FRAME}>
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <Dot tone="bg-sage/80" />
            <span className="h-1.5 w-16 bg-white/25" />
            <span className="grow" />
            <Profile />
          </div>
          <div className="grow space-y-5 px-5 py-5">
            {/* Uptime strip. Heights vary so it reads as a record
                rather than a pattern; no scale, no labels. */}
            <ScrollReveal delay={200}>
              <span className="flex items-end gap-1.5">
                {TICKS.map((tone, i) => (
                  <span
                    key={i}
                    className={`w-2 ${tone} ${TICK_HEIGHTS[i % 4]}`}
                  />
                ))}
              </span>
            </ScrollReveal>
            {/* Release timeline: evenly spaced markers on a hairline,
                the newest one filled. "We stay." */}
            <ScrollReveal delay={300}>
              <span className="flex items-center justify-between border-t border-white/15">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`-mt-[3px] size-1.5 rotate-45 ${
                      i === 4 ? "bg-gold" : "bg-white/25"
                    }`}
                  />
                ))}
              </span>
            </ScrollReveal>
            {/* Event log. */}
            <ScrollReveal delay={380} className="space-y-2.5">
              {[
                { tone: "bg-sage/85", w: "w-full" },
                { tone: "bg-lavender/85", w: "w-10/12" },
                { tone: "bg-rose/85", w: "w-8/12" },
                { tone: "bg-sage/85", w: "w-9/12" },
              ].map((row, i) => (
                <span key={i} className="flex items-center gap-2.5">
                  <Dot tone={row.tone} />
                  <span className={`block h-1.5 ${row.w} bg-white/10`} />
                </span>
              ))}
            </ScrollReveal>
          </div>
          <VisualFade />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Internal Tool — a dashboard UI.                                     *
 * Sidebar, top bar and a data table: "a real tool that you own."      *
 * Deliberately denser than the New Product window so the two never    *
 * read as one mock.                                                   *
 * ------------------------------------------------------------------ */
const TABLE_ROWS: readonly string[] = [
  "bg-sage/85",
  "bg-gold",
  "bg-rose/85",
  "bg-lavender/85",
  "bg-sage/85",
];

function InternalToolVisual() {
  return (
    <div className={SHELL}>
      <ScrollReveal delay={120}>
        <div className={`${FRAME} flex-row`}>
          {/* Sidebar. The active item is the gold one. */}
          <div className="w-16 shrink-0 space-y-3 border-r border-white/10 px-3 py-4">
            <span className="block size-4 border border-white/20 bg-white/5" />
            <span className="mt-5 block h-1.5 w-9 bg-gold" />
            <span className="block h-1.5 w-7 bg-white/15" />
            <span className="block h-1.5 w-8 bg-white/15" />
            <span className="block h-1.5 w-6 bg-white/15" />
            <span className="block h-1.5 w-8 bg-white/15" />
          </div>
          <div className="flex grow flex-col">
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="h-1.5 w-14 bg-white/25" />
              <span className="h-4 w-10 border border-white/15" />
              <span className="grow" />
              <Profile />
            </div>
            {/* Table. A header row, then rows of cells — the shape of a
                tool a team logs into, with nothing written in it. */}
            <div className="grow px-4 py-3.5">
              <ScrollReveal delay={200}>
                <span className="mb-3 grid grid-cols-[2fr_1fr_1fr] gap-3 border-b border-white/10 pb-2">
                  <span className="h-1.5 bg-white/25" />
                  <span className="h-1.5 bg-white/25" />
                  <span className="h-1.5 bg-white/25" />
                </span>
              </ScrollReveal>
              {TABLE_ROWS.map((tone, r) => (
                <ScrollReveal key={r} delay={260 + r * 55}>
                  <span className="mb-3 grid grid-cols-[2fr_1fr_1fr] items-center gap-3">
                    <span className="h-1.5 bg-white/12" />
                    <span className="h-1.5 bg-white/12" />
                    {/* The run marker: agents behind a real interface. */}
                    <span className="flex items-center gap-1.5">
                      <Dot tone={tone} />
                      <span className="h-1.5 grow bg-white/12" />
                    </span>
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>
          <VisualFade />
        </div>
      </ScrollReveal>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * AI Workflow Integration — the tile cluster. KEPT (owner direction). *
 * The reference's own shape, and the one block it actually suits:     *
 * agents dropped into the processes a business already runs.          *
 * ------------------------------------------------------------------ */

/**
 * 24px viewBox, `currentColor` — the ArrowIcon contract, at 1.75 rather
 * than the hairline 1.25. Measured, not guessed: `sage` and `lavender`
 * are deliberately desaturated pastels, and at 1.25px on a near-black
 * tile they resolve to grey no matter what alpha they carry. The extra
 * half-pixel is what lets the colour register at all.
 */
const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
} as const;

const MARKS = {
  /** The system's own marker, at tile scale. */
  diamond: (
    <path d="M12 4 20 12 12 20 4 12Z" fill="currentColor" stroke="none" />
  ),
  /** A squared frame inside a frame — a system with an edge. */
  frame: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" {...STROKE} />
      <rect x="8.5" y="8.5" width="7" height="7" {...STROKE} />
    </>
  ),
  /** Four cells — a process made of steps. */
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" {...STROKE} />
      <rect x="13.5" y="3.5" width="7" height="7" {...STROKE} />
      <rect x="3.5" y="13.5" width="7" height="7" {...STROKE} />
      <rect x="13.5" y="13.5" width="7" height="7" {...STROKE} />
    </>
  ),
  /** Layers — the stack the work already runs on. */
  stack: (
    <>
      <path d="M3.5 6.5h17" {...STROKE} />
      <path d="M3.5 12h17" {...STROKE} />
      <path d="M3.5 17.5h17" {...STROKE} />
    </>
  ),
  /** A hub with spokes — the agent, sitting inside the process. */
  hub: (
    <>
      <rect x="9" y="9" width="6" height="6" {...STROKE} />
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" {...STROKE} />
    </>
  ),
  /** One line becoming two — work routed. */
  branch: (
    <>
      <path d="M3.5 12h6" {...STROKE} />
      <path d="M9.5 12 15 6.5h5.5" {...STROKE} />
      <path d="M9.5 12 15 17.5h5.5" {...STROKE} />
    </>
  ),
  /** A step line — the day to day, over time. */
  step: <path d="M3.5 17.5h4.5V12h4.5V7h4.5v10.5h3.5" {...STROKE} />,
  /** A field of points — the volume the work runs at. */
  field: (
    <>
      {[6, 12, 18].map((y) =>
        [6, 12, 18].map((x) => (
          <rect
            key={`${x}-${y}`}
            x={x - 1}
            y={y - 1}
            width="2"
            height="2"
            fill="currentColor"
          />
        )),
      )}
    </>
  ),
} as const;

type MarkKey = keyof typeof MARKS;

/**
 * Cluster order: two, then three, then two. Index 3 is the centre and
 * takes gold. The rest are tinted from the interface-chrome palette,
 * which is what the reference's own tiles did with product logos —
 * without asserting a single integration.
 */
const CLUSTER: readonly { mark: MarkKey; tone: string }[] = [
  { mark: "field", tone: "text-white/45" },
  { mark: "stack", tone: "text-sage/85" },
  { mark: "branch", tone: "text-lavender/85" },
  { mark: "hub", tone: "text-gold" },
  { mark: "step", tone: "text-rose/85" },
  { mark: "grid", tone: "text-white/45" },
  { mark: "diamond", tone: "text-sage/70" },
];

const EMPHASIS_INDEX = 3;

const ROWS: readonly (readonly number[])[] = [
  [0, 1],
  [2, 3, 4],
  [5, 6],
];

function Tile({
  mark,
  tone,
  emphasis,
  delay,
}: {
  mark: MarkKey;
  tone: string;
  emphasis: boolean;
  delay: number;
}) {
  /* The emphasized tile is the reference's highlighted card in this
     system's terms: a brighter hairline, the shared depth token, and
     the one gold mark. `group-target:` carries the deep-link "you are
     here" onto it, so the visual answers the anchor as the index does. */
  const surface = emphasis
    ? "border-white/45 shadow-[var(--shadow-modal)] group-target:border-gold/60"
    : "border-white/15";

  return (
    <ScrollReveal delay={delay}>
      <div
        className={`flex size-16 items-center justify-center border bg-[#0a0a0c] transition-colors duration-150 md:size-[74px] ${surface} ${tone}`}
      >
        <svg viewBox="0 0 24 24" className="size-7 md:size-8">
          {MARKS[mark]}
        </svg>
      </div>
    </ScrollReveal>
  );
}

function WorkflowVisual() {
  return (
    <div className={SHELL}>
      {/* Same 4/3 box as the framed mocks, so all five rows line up.
          Frameless on purpose: this one is a cluster, not a screen. */}
      <div className="flex aspect-[4/3] items-center justify-center">
        {/* **The fade rides the cluster's own box, not the 4/3 frame.**
            This is load-bearing and it regressed once: `inset-0` on the
            outer frame scales the gradient's radius to 448x336, and the
            cluster is only ~240px across, so every tile landed inside
            the clear zone and the dissolve vanished while the CSS still
            looked correct. The framed mocks fill their frame, so theirs
            can sit on it; this one cannot. Values are the original
            circle stops, unchanged. */}
        <div className="relative mx-auto w-fit">
          <VisualFade />
          {ROWS.map((row, r) => (
            <div
              key={r}
              className="mx-auto flex w-fit justify-center gap-2 py-1"
            >
              {row.map((i) => (
                <Tile
                  key={i}
                  mark={CLUSTER[i].mark}
                  tone={CLUSTER[i].tone}
                  emphasis={i === EMPHASIS_INDEX}
                  delay={120 + r * 90 + row.indexOf(i) * 60}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Block -> its visual. Total over `ServiceBlockId`, so a new block
 * cannot ship without one and cannot silently inherit another's.
 */
const VISUALS: Record<ServiceBlockId, () => React.JSX.Element> = {
  "new-product": NewProductVisual,
  "product-completion": ProductCompletionVisual,
  "product-support": ProductSupportVisual,
  "ai-workflow-integration": WorkflowVisual,
  "internal-tool": InternalToolVisual,
};

export function ServiceBlockVisual({ block }: { block: ServiceBlockId }) {
  const Visual = VISUALS[block];

  return (
    /* Decorative in full: every mock is skeleton matter carrying no
       readable content, so it is removed from the accessibility tree
       rather than given labels that would read as a feature list. */
    <div aria-hidden="true">
      <Visual />
    </div>
  );
}
