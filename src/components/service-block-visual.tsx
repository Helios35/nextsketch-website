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

/** A skeleton line. Width and tone come from the caller. */
function Bar({ className }: { className: string }) {
  return <span className={`block h-1.5 ${className}`} />;
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
 * Product Completion — a developer environment.                       *
 * An explorer tree beside a tabbed editor. Replaces the framed window  *
 * mock, which had a box around it and too little detail (owner,        *
 * 2026-08-30). Structure adapted from an owner-supplied editor         *
 * screenshot; **this block only** — nothing else on either route       *
 * changes.                                                            *
 *                                                                      *
 * **No outer frame, on purpose.** A border around it makes it read as  *
 * a screenshot pasted on the page; the internal chrome (the explorer   *
 * rule, the tab strip, the gutter) is what says "editor", and the      *
 * shared `VisualFade` dissolves the edges instead.                     *
 *                                                                      *
 * Rule 4.3 as everywhere else: no filename, no code, no numeral, no    *
 * logo. The reference's syntax colours map onto the #31 chrome set —   *
 * `lavender` for keywords and component files, `sage` for strings,     *
 * `rose` for values and stylesheets, the white alpha ladder for        *
 * identifiers and punctuation, `white/12` for comments. `gold` appears *
 * once, on the active tab, and nowhere else.                           *
 * ------------------------------------------------------------------ */

/** Disclosure caret for a tree row. Inline SVG, per §Interaction vocabulary. */
function Caret({ open = false }: { open?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`size-2.5 shrink-0 text-white/35 ${open ? "rotate-90" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M4.5 2 L8 6 L4.5 10" />
    </svg>
  );
}

/** Close affordance on a tab. */
function TabClose() {
  return (
    <svg
      viewBox="0 0 12 12"
      className="size-2.5 shrink-0 text-white/25"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <path d="M3 3 L9 9 M9 3 L3 9" />
    </svg>
  );
}

/**
 * The explorer tree. `depth` is the indent step, `kind` decides the
 * mark: a hollow square is a folder, a filled one is a file tinted by
 * type. `active` is the open file, the one row with a fill behind it.
 */
const TREE: readonly {
  depth: 0 | 1 | 2 | 3;
  folder?: boolean;
  open?: boolean;
  tone?: string;
  w: string;
  active?: boolean;
}[] = [
  { depth: 0, folder: true, w: "w-20" },
  { depth: 0, folder: true, w: "w-12" },
  { depth: 0, folder: true, open: true, w: "w-8" },
  { depth: 1, folder: true, w: "w-12" },
  { depth: 1, folder: true, open: true, w: "w-11" },
  { depth: 2, tone: "bg-rose/70", w: "w-14" },
  { depth: 1, folder: true, open: true, w: "w-16" },
  { depth: 2, tone: "bg-lavender/70", w: "w-12" },
  { depth: 2, tone: "bg-lavender/70", w: "w-14", active: true },
  { depth: 2, tone: "bg-lavender/70", w: "w-16" },
  { depth: 2, tone: "bg-lavender/70", w: "w-11" },
  { depth: 1, folder: true, w: "w-10" },
  { depth: 1, folder: true, w: "w-11" },
  { depth: 1, tone: "bg-gold/70", w: "w-13" },
  { depth: 1, tone: "bg-lavender/70", w: "w-12" },
  { depth: 1, folder: true, w: "w-14" },
  { depth: 1, folder: true, w: "w-8" },
  { depth: 1, folder: true, w: "w-16" },
];

const INDENT: Record<0 | 1 | 2 | 3, string> = {
  0: "pl-0",
  1: "pl-3",
  2: "pl-6",
  3: "pl-9",
};

/** Editor tabs. The first is active. */
const TABS: readonly { tone: string; w: string }[] = [
  { tone: "bg-lavender/70", w: "w-12" },
  { tone: "bg-gold/70", w: "w-11" },
  { tone: "bg-white/30", w: "w-14" },
  { tone: "bg-sage/70", w: "w-10" },
];

/**
 * Syntax-coloured code. Each line is a run of tokens; the tail thins to
 * a stub and stops, which is the "got you 70% there and disappeared"
 * metaphor the previous mock carried and this one keeps.
 */
const CODE: readonly {
  indent: 0 | 1 | 2 | 3;
  tokens: { w: string; tone: string }[];
  caret?: boolean;
}[] = [
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-lavender/70" },
      { w: "w-8", tone: "bg-white/30" },
      { w: "w-6", tone: "bg-lavender/70" },
      { w: "w-12", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-lavender/70" },
      { w: "w-4", tone: "bg-white/20" },
      { w: "w-9", tone: "bg-white/30" },
      { w: "w-14", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-lavender/70" },
      { w: "w-7", tone: "bg-white/30" },
      { w: "w-16", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 0,
    tokens: [
      { w: "w-10", tone: "bg-lavender/70" },
      { w: "w-12", tone: "bg-white/30" },
      { w: "w-10", tone: "bg-sage/60" },
    ],
  },
  { indent: 0, tokens: [] },
  {
    indent: 0,
    tokens: [
      { w: "w-8", tone: "bg-lavender/70" },
      { w: "w-9", tone: "bg-rose/60" },
      { w: "w-3", tone: "bg-white/20" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-3", tone: "bg-white/20" }] },
  {
    indent: 2,
    tokens: [
      { w: "w-4", tone: "bg-white/30" },
      { w: "w-3", tone: "bg-rose/60" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-8", tone: "bg-white/30" },
      { w: "w-10", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-6", tone: "bg-white/30" },
      { w: "w-20", tone: "bg-sage/60" },
    ],
  },
  {
    indent: 2,
    tokens: [
      { w: "w-9", tone: "bg-white/30" },
      { w: "w-16", tone: "bg-sage/60" },
      { w: "w-3", tone: "bg-white/20" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-24", tone: "bg-white/12" }] },
  { indent: 1, tokens: [{ w: "w-3", tone: "bg-white/20" }] },
  {
    indent: 0,
    tokens: [
      { w: "w-6", tone: "bg-lavender/70" },
      { w: "w-4", tone: "bg-white/20" },
    ],
  },
  { indent: 1, tokens: [{ w: "w-5", tone: "bg-white/25" }] },
  /* Where it was abandoned: the caret, parked on an empty line. It is a
     CODE entry rather than a trailing element so the gutter and the code
     column hold the same number of items and stay aligned. */
  { indent: 1, tokens: [], caret: true },
];

function ProductCompletionVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="flex h-full min-w-0">
          {/* Explorer. */}
          <div className="flex w-[36%] min-w-0 shrink-0 flex-col border-r border-white/10 py-3">
            <ScrollReveal delay={120}>
              <span className="flex items-center justify-between px-3 pb-2.5">
                <Bar className="h-2 w-14 bg-white/45" />
                <span className="size-2.5 rounded-none border border-white/25" />
              </span>
            </ScrollReveal>
            <div className="flex min-h-0 grow flex-col justify-between">
              {TREE.map((row, i) => (
                <ScrollReveal key={i} delay={170 + i * 22}>
                  <span
                    className={`flex items-center gap-1.5 py-[3px] pr-2 ${
                      row.active ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span
                      className={`flex items-center gap-1.5 ${INDENT[row.depth]} pl-2`}
                    >
                      {row.folder ? (
                        <>
                          <Caret open={row.open} />
                          <span className="size-2.5 shrink-0 border border-white/30" />
                        </>
                      ) : (
                        <>
                          <span className="size-2.5 shrink-0" />
                          <span className={`size-2 shrink-0 ${row.tone}`} />
                        </>
                      )}
                      <Bar
                        className={`${row.w} ${
                          row.active
                            ? "bg-white/60"
                            : row.folder
                              ? "bg-white/30"
                              : "bg-white/25"
                        }`}
                      />
                    </span>
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Editor. */}
          <div className="flex min-w-0 grow flex-col">
            {/* Tab strip. The active tab is the one gold element. */}
            <ScrollReveal delay={260}>
              <span className="flex items-stretch border-b border-white/10">
                {TABS.map((tab, i) => (
                  <span
                    key={i}
                    className={`flex items-center gap-2 border-r border-white/[0.07] px-2.5 py-2.5 ${
                      i === 0 ? "border-t border-t-gold bg-white/[0.04]" : ""
                    }`}
                  >
                    <span className={`size-2.5 shrink-0 ${tab.tone}`} />
                    <Bar
                      className={`${tab.w} ${i === 0 ? "bg-white/55" : "bg-white/25"}`}
                    />
                    <TabClose />
                  </span>
                ))}
              </span>
            </ScrollReveal>

            {/* Gutter and code. */}
            <div className="flex min-h-0 grow pt-2.5">
              <span className="flex w-7 shrink-0 flex-col items-end justify-between pr-2">
                {CODE.map((_, i) => (
                  <span key={i} className="h-1.5 w-2.5 bg-white/15" />
                ))}
              </span>
              <div className="flex min-w-0 grow flex-col justify-between pr-3">
                {CODE.map((line, i) => (
                  <ScrollReveal key={i} delay={310 + i * 42}>
                    <span
                      className={`flex h-1.5 items-center gap-1.5 ${INDENT[line.indent]}`}
                    >
                      {line.tokens.map((t, j) => (
                        <span
                          key={j}
                          className={`block h-1.5 ${t.w} ${t.tone}`}
                        />
                      ))}
                      {line.caret === true && (
                        <span className="block h-3 w-0.5 bg-gold" />
                      )}
                    </span>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
        <VisualFade />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Product Support — a project timeline.                               *
 * A rail, a header, tabs, a date scale and a Gantt body with task      *
 * cards, a today line and a dependency link. Replaces the framed ops   *
 * panel (owner, 2026-08-30); **this block only**.                     *
 *                                                                      *
 * It suits the §05 line better than the ops panel did: "the product is *
 * live. Now it needs to grow." A plan with work still ahead of the     *
 * today line is what a retainer looks like.                            *
 *                                                                      *
 * Frameless, like 01 and 02 — a border makes it read as a screenshot.  *
 * Rule 4.3 as everywhere: no title, no date, no name, no numeral, no   *
 * avatar photo. `gold` appears once, on the today line.                *
 * ------------------------------------------------------------------ */

/** Overlapping squares, the system's stand-in for an avatar stack. */
function AvatarStack() {
  return (
    <span className="flex shrink-0 items-center">
      {["bg-lavender/45", "bg-sage/45", "bg-rose/45"].map((tone, i) => (
        <span
          key={i}
          className={`size-3 shrink-0 border border-white/20 ${tone} ${
            i > 0 ? "-ml-1" : ""
          }`}
        />
      ))}
    </span>
  );
}

/** The row-overflow affordance: three stacked marks. */
function Kebab() {
  return (
    <span className="flex shrink-0 flex-col gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-[2px] bg-white/30" />
      ))}
    </span>
  );
}

/**
 * A squared progress gauge. The reference uses a donut; round is not in
 * this system's vocabulary, so it is a square whose leading edges carry
 * the tint — the same device the bento's stat tile uses.
 */
function Gauge({ tone }: { tone: string }) {
  return (
    <span
      className={`size-4 shrink-0 border-2 border-white/12 ${tone}`}
      aria-hidden="true"
    />
  );
}

/** One task bar on the timeline. */
function TaskCard({
  at,
  delay,
  gauge,
  selected = false,
}: {
  at: string;
  delay: number;
  gauge: string;
  selected?: boolean;
}) {
  return (
    <ScrollReveal delay={delay} className={`absolute ${at}`}>
      <span
        className={`flex items-center gap-2 border px-2 py-2 ${
          selected
            ? "border-white/45 bg-[#101013] shadow-[var(--shadow-modal)]"
            : "border-white/15 bg-[#0a0a0c]"
        }`}
      >
        <Gauge tone={gauge} />
        <span className="min-w-0 grow space-y-1.5">
          <Bar
            className={selected ? "w-full bg-white/55" : "w-full bg-white/35"}
          />
          <span className="flex items-center gap-1.5">
            <span className="size-2 shrink-0 border border-white/20" />
            <Bar className="w-2/3 bg-white/15" />
          </span>
        </span>
        <AvatarStack />
        <Kebab />
      </span>
    </ScrollReveal>
  );
}

/** Sidebar rail items; index 1 is the open section, index 3 carries a count. */
const RAIL: readonly { w: string; active?: boolean; badge?: boolean }[] = [
  { w: "w-12" },
  { w: "w-10", active: true },
  { w: "w-11" },
  { w: "w-12", badge: true },
  { w: "w-14" },
  { w: "w-8" },
  { w: "w-9" },
];

function ProductSupportVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="flex h-full min-w-0">
          {/* Rail. */}
          <div className="flex w-[22%] min-w-0 shrink-0 flex-col border-r border-white/10 py-3">
            <ScrollReveal delay={120}>
              <span className="flex items-center gap-1.5 px-3 pb-4">
                <span className="size-3 shrink-0 border border-white/30" />
                <Bar className="w-10 bg-white/45" />
              </span>
            </ScrollReveal>
            <div className="flex min-h-0 grow flex-col justify-start gap-[7px]">
              {RAIL.map((item, i) => (
                <ScrollReveal key={i} delay={160 + i * 28}>
                  <span
                    className={`flex items-center gap-2 px-3 py-1.5 ${
                      item.active === true ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span
                      className={`size-2.5 shrink-0 border ${
                        item.active === true
                          ? "border-white/45"
                          : "border-white/25"
                      }`}
                    />
                    <Bar
                      className={`${item.w} ${
                        item.active === true ? "bg-white/55" : "bg-white/25"
                      }`}
                    />
                    {item.badge === true && (
                      <span className="ml-auto size-2.5 shrink-0 bg-rose/70" />
                    )}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Main. */}
          <div className="flex min-w-0 grow flex-col">
            {/* Header: breadcrumb, title, actions. */}
            <ScrollReveal delay={200}>
              <span className="flex items-start justify-between gap-3 border-b border-white/10 px-3 py-3">
                <span className="min-w-0 space-y-2">
                  <span className="flex items-center gap-1.5">
                    <Bar className="w-8 bg-white/20" />
                    <span className="size-1 shrink-0 rotate-45 bg-white/20" />
                    <Bar className="w-7 bg-white/20" />
                    <span className="size-1 shrink-0 rotate-45 bg-white/20" />
                    <Bar className="w-9 bg-white/20" />
                  </span>
                  <Bar className="h-2.5 w-28 bg-white/60" />
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <Kebab />
                  <span className="size-2.5 border border-white/25" />
                  <span className="relative">
                    <span className="block size-2.5 border border-white/25" />
                    <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-rose/80" />
                  </span>
                  <AvatarStack />
                  <span className="h-4 w-8 border border-white/20" />
                </span>
              </span>
            </ScrollReveal>

            {/* Tabs. */}
            <ScrollReveal delay={250}>
              <span className="flex items-stretch gap-4 border-b border-white/10 px-3">
                {["w-10", "w-9", "w-7", "w-12", "w-9"].map((w, i) => (
                  <span
                    key={i}
                    className={`py-2.5 ${
                      i === 0 ? "border-b border-white/70" : ""
                    }`}
                  >
                    <Bar
                      className={`${w} ${i === 0 ? "bg-white/60" : "bg-white/22"}`}
                    />
                  </span>
                ))}
              </span>
            </ScrollReveal>

            {/* Date scale. */}
            <ScrollReveal delay={295}>
              <span className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                {Array.from({ length: 12 }, (_, i) => (
                  <Bar
                    key={i}
                    className={`w-4 ${i === 7 ? "bg-gold/80" : "bg-white/20"}`}
                  />
                ))}
              </span>
            </ScrollReveal>

            {/* Timeline body. */}
            <div className="relative min-h-0 grow">
              {/* Column rules, with the non-working columns hatched. The
                  repeating-linear-gradient hatch is the placeholder
                  tile's own device, reused rather than invented. */}
              <span className="absolute inset-0 flex">
                {Array.from({ length: 12 }, (_, i) => (
                  <span
                    key={i}
                    className={`h-full grow border-r border-white/[0.06] ${
                      i === 5 || i === 6 || i === 11
                        ? "bg-[repeating-linear-gradient(135deg,currentColor_0_1px,transparent_1px_7px)] text-white/[0.05]"
                        : ""
                    }`}
                  />
                ))}
              </span>

              {/* Today. The one gold element on the plane. */}
              <span className="absolute top-0 bottom-0 left-[62%] w-0.5 bg-gold" />

              {/* Dependency link: one task waiting on another. */}
              <svg
                viewBox="0 0 200 120"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                fill="none"
              >
                <path
                  d="M150 34 C176 34 176 62 150 62 L120 62"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="text-lavender/60"
                />
              </svg>

              {/* Phase rules. */}
              <ScrollReveal
                delay={330}
                className="absolute top-[3%] right-[4%] left-[3%]"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rotate-45 bg-sage/80" />
                  <Bar className="w-10 shrink-0 bg-white/40" />
                  <span className="h-px grow bg-white/20" />
                </span>
              </ScrollReveal>
              <ScrollReveal
                delay={520}
                className="absolute top-[70%] right-[4%] left-[3%]"
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 shrink-0 rotate-45 bg-rose/80" />
                  <Bar className="w-14 shrink-0 bg-white/40" />
                  <span className="h-px grow bg-white/20" />
                </span>
              </ScrollReveal>

              {/* Selected row band, behind its card. */}
              <span className="absolute top-[26%] right-0 left-0 h-[16%] bg-white/[0.04]" />

              <TaskCard
                at="top-[12%] left-[6%] w-[52%]"
                delay={370}
                gauge="border-t-sage/80 border-r-sage/80"
              />
              <TaskCard
                at="top-[28%] left-[22%] w-[54%]"
                delay={420}
                gauge="border-t-lavender/80 border-r-lavender/80"
                selected
              />
              <TaskCard
                at="top-[45%] left-[12%] w-[50%]"
                delay={465}
                gauge="border-t-white/45 border-r-white/45"
              />
              <TaskCard
                at="top-[58%] left-[34%] w-[52%]"
                delay={505}
                gauge="border-t-rose/80 border-r-rose/80"
              />
              <TaskCard
                at="top-[80%] left-[46%] w-[50%]"
                delay={560}
                gauge="border-t-sage/80 border-r-sage/80"
              />
            </div>
          </div>
        </div>
        <VisualFade />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Internal Tool — an analytics panel.                                 *
 * A status summary beside a trend chart with a read-out on one point.  *
 * Replaces the framed dashboard mock (owner, 2026-08-30); **this block *
 * only** — nothing else on either route changes.                      *
 *                                                                      *
 * It is the right subject for the tier: "a real tool that you own",    *
 * something a team logs into to see what their agents did.            *
 *                                                                      *
 * Frameless like 01, 02 and 03. Rule 4.3 as everywhere: no label, no   *
 * count, no date, no axis value. The reference's two series map onto   *
 * `lavender` and `rose`, its status marks onto the #31 chrome set, and *
 * `gold` appears once — on the read-out point, which is the one thing  *
 * the whole composition points at.                                     *
 * ------------------------------------------------------------------ */

/** Status rows in the summary panel. */
const STATUS: readonly { tone: string; w: string; pill: string }[] = [
  { tone: "bg-lavender/80", w: "w-12", pill: "w-6" },
  { tone: "bg-sage/80", w: "w-10", pill: "w-2" },
  { tone: "bg-rose/80", w: "w-16", pill: "w-4" },
];

function InternalToolVisual() {
  return (
    <div className={SHELL}>
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div className="flex h-full min-w-0 gap-3 p-3">
          {/* Summary. A bordered sub-panel is chrome, not the outer box
              the owner asked to lose — the composition itself has no
              frame. */}
          <div className="flex w-[34%] min-w-0 shrink-0 flex-col border border-white/15 p-3">
            <ScrollReveal delay={120}>
              <Bar className="h-2 w-16 bg-white/50" />
            </ScrollReveal>
            <div className="mt-4 space-y-2">
              {STATUS.map((row, i) => (
                <ScrollReveal key={i} delay={170 + i * 55}>
                  {/* §Surfaces' sub-panel recipe for a data row. */}
                  <span className="flex items-center gap-2.5 border border-white/12 bg-white/[0.02] px-2.5 py-2">
                    <span className={`size-2 shrink-0 rotate-45 ${row.tone}`} />
                    <Bar className={`${row.w} bg-white/35`} />
                    <span className="ml-auto flex h-4 shrink-0 items-center border border-white/15 px-1.5">
                      <span className={`block h-1.5 ${row.pill} bg-white/30`} />
                    </span>
                  </span>
                </ScrollReveal>
              ))}
            </div>
            {/* The read-out note, with its own mark. */}
            <ScrollReveal delay={345} className="mt-auto">
              <span className="flex gap-2 pt-3">
                <span className="mt-0.5 size-3 shrink-0 rotate-45 border border-white/25" />
                <span className="min-w-0 grow space-y-1.5">
                  <Bar className="w-full bg-white/20" />
                  <Bar className="w-4/5 bg-white/20" />
                  <Bar className="w-3/5 bg-white/12" />
                </span>
              </span>
            </ScrollReveal>
          </div>

          {/* Trend. */}
          <div className="flex min-w-0 grow flex-col">
            <ScrollReveal delay={200}>
              <span className="flex items-center justify-between gap-3">
                <Bar className="h-2 w-24 bg-white/50" />
                {/* Range selector. Squared, not the reference's pill. */}
                <span className="flex shrink-0 items-stretch border border-white/15">
                  {["w-10", "w-8", "w-7"].map((w, i) => (
                    <span
                      key={i}
                      className={`flex items-center px-2 py-1.5 ${
                        i === 1 ? "bg-white/[0.08]" : ""
                      }`}
                    >
                      <span
                        className={`block h-1.5 ${w} ${
                          i === 1 ? "bg-white/55" : "bg-white/25"
                        }`}
                      />
                    </span>
                  ))}
                </span>
              </span>
            </ScrollReveal>

            {/* Plot. */}
            <ScrollReveal delay={260} className="mt-4 flex min-h-0 grow">
              <span className="flex w-5 shrink-0 flex-col justify-between py-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-1.5 w-4 bg-white/20" />
                ))}
              </span>
              <span className="relative min-w-0 grow">
                <svg
                  viewBox="0 0 200 100"
                  preserveAspectRatio="none"
                  className="h-full w-full"
                  fill="none"
                >
                  {[40, 80, 120, 160].map((x) => (
                    <line
                      key={x}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="100"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-white/[0.08]"
                    />
                  ))}
                  <path
                    d="M0 28 C14 60 26 78 40 72 C54 66 58 34 72 32 C86 30 92 18 104 22 C116 26 122 58 136 60 C150 62 156 44 170 42 C184 40 192 28 200 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-lavender/75"
                  />
                  <path
                    d="M0 78 C12 70 20 52 32 48 C44 44 48 22 60 20 C72 18 78 46 90 52 C102 58 108 44 120 40 C132 36 138 72 150 76 C162 80 168 40 180 36 C192 32 196 58 200 62"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-rose/75"
                  />
                </svg>

                {/* The read-out point. Gold, and the only gold here. The
                    reference glows; §Surfaces bans that, so presence
                    comes from a hairline halo instead. */}
                <span className="absolute top-[18%] left-[52%] flex size-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/30">
                  <span className="size-2 rotate-45 bg-gold" />
                </span>

                {/* Its read-out card. */}
                <span className="absolute top-[2%] left-[56%] space-y-1.5 border border-white/20 bg-[#101013] px-2.5 py-2">
                  <Bar className="w-14 bg-white/45" />
                  <Bar className="w-12 bg-white/25" />
                </span>
              </span>
            </ScrollReveal>

            {/* Scale. */}
            <ScrollReveal delay={330}>
              <span className="mt-2.5 flex items-center justify-between pl-5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Bar key={i} className="w-6 bg-white/20" />
                ))}
              </span>
            </ScrollReveal>
          </div>
        </div>
        <VisualFade />
      </div>
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
