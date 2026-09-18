import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { WorkCard } from "@/components/work-rail";
import { WORK_PAGE } from "@/content/work";
import type { WorkItem } from "@/lib/types";

/**
 * The column ladder for a given tile count, and the image `sizes` hint
 * that matches it.
 *
 * A grid of screenshots has one honest failure: a single tile stranded
 * on its own row. That is not a breakpoint problem, it is arithmetic —
 * four tiles split cleanly into two columns or four and never into
 * three — so the ladder is chosen from the count as well as the
 * viewport. The rules, widest first:
 *
 * - `2xl` (1536+): four columns when the count divides by four. At
 *   1536 a tile is 340px, which still holds the copy block's measured
 *   two-line summaries (the rail's narrowest card is 307px).
 * - `xl` (1280+): three columns when there are at least three and the
 *   count does not leave one over (`count % 3 !== 1`). Three start at
 *   `xl`, not `lg`, because at 1024 a third of the track is 288px and
 *   the copy no longer fits.
 * - `md` (768+): two columns; a tile is 344px at 768.
 * - Below `md`: one column. Two at `sm` would put a tile at 280px,
 *   under the width the summaries were written to.
 *
 * With four studies today that is 1 / 2 / 2 / 4 — no orphan at any
 * width. Some counts cannot avoid one at two *and* three columns
 * (seven, say); the last tile then stands alone at the same size as
 * its neighbours, which is the honest degradation, not a stretched or
 * centred one. One study renders as one tile at the width it would
 * have among more, for the same reason.
 *
 * Every class is a literal, assembled from named pieces and never
 * interpolated, because Tailwind compiles only what it can read.
 * `sizes` comes from the same ladder so the srcset choice can never
 * under-fetch: each step names the widest cell that breakpoint can
 * produce.
 */
function ladder(count: number): { columns: string; sizes: string } {
  const four = count >= 4 && count % 4 === 0;
  const three = count >= 3 && count % 3 !== 1;
  const columns = [
    "md:grid-cols-2",
    three ? "xl:grid-cols-3" : null,
    four ? "2xl:grid-cols-4" : null,
  ]
    .filter(Boolean)
    .join(" ");
  const sizes = [
    four ? "(min-width: 1536px) 25vw" : null,
    three ? "(min-width: 1280px) 33vw" : null,
    "(min-width: 768px) 50vw",
    "100vw",
  ]
    .filter(Boolean)
    .join(", ");
  return { columns, sizes };
}

interface WorkGridProps {
  items: readonly WorkItem[];
  /**
   * The id of the element that names the grid's landmark. Defaults to
   * the `/work` page's own; a page that mounts a second grid passes a
   * different one so the two never share an id.
   */
  headingId?: string;
  /**
   * A visible heading block rendered in place of the `sr-only` one.
   * Must contain the element `headingId` points at. The case study
   * page's "Other projects" band is the caller (decision-log #43): the
   * grid is the same grid, with a heading the visitor can see.
   */
  heading?: ReactNode;
  /**
   * Whether the first two screenshots load eagerly. True on `/work`,
   * where the grid opens above the fold; false where it closes a page.
   */
  eager?: boolean;
  /**
   * The number a tile shows, from its item and its position (0-based).
   * Defaults to the position, which on `/work` is the band's order. The
   * case study page passes each study's place in the full list, so a
   * study is (03) here as it is on the band and the grid.
   */
  numbering?: (item: WorkItem, position: number) => number;
  /** Rendered after the list, inside the landmark: the archive control. */
  children?: ReactNode;
  /**
   * The band's own classes, whole. The default is exactly the string
   * `/work` has always rendered; a caller that needs other padding
   * passes the full ladder, gutters included.
   */
  className?: string;
  /**
   * Overrides the ladder's `sizes` hint: a caller whose grid sits inside
   * a measure narrower than the viewport passes the widths its cells
   * really reach, so wide screens do not fetch for a third of 1920px.
   */
  sizes?: string;
  /**
   * Wraps the heading, the list and the trailing slot in one element
   * with these classes: the case study page's content measure, so the
   * tiles stop at the same edges as the bands above them. Unset, there
   * is no wrapper and `/work`'s DOM is exactly what it was.
   */
  contentClassName?: string;
}

/**
 * The case study grid on `/work` (decision-log #39): every study in
 * content, as the home band's card in its `tile` variant. The tile is
 * `<WorkCard>` from `work-rail.tsx` — the same component, one file, no
 * fork — so the rail and the grid can only ever drift together.
 *
 * **Extended with props for the case study page (decision-log #43),
 * not forked:** a visible heading, its id, whether the first row loads
 * eagerly, each tile's number from its item, a trailing slot, the
 * band's own classes, a content wrapper (the measure) and a `sizes`
 * override. `/work` passes none of them and renders exactly what it
 * did.
 *
 * The surface is the `/pricing` tier grid's: a landmark region under an
 * `sr-only` heading (the page's `<h1>` names the page, not the grid),
 * the band's gutter ladder, `gap-4` between squared cards on solid
 * `surface`. No masonry, no filtering, no sorting — not until there
 * are enough studies to need them, and nothing new is installed for a
 * grid CSS already does.
 *
 * Each tile is a real anchor to `/work/<slug>` with the card's own
 * visible focus ring, so the grid is keyboard-complete and works with
 * scripting off. Entrance is the shared `<ScrollReveal>` on the
 * Services-card rhythm, staggered across the row (`120 + column·80ms`)
 * rather than down the whole list, so a later row cascades the way the
 * first did. The first two screenshots load eagerly: they are the
 * page's largest above-the-fold paint at every width.
 *
 * Server component; the tiles bring their own client boundary.
 */
export function WorkGrid({
  items,
  headingId = "work-grid-heading",
  heading,
  eager = true,
  numbering = (_item, position) => position,
  children,
  className = "w-full px-6 pb-24 sm:px-8 lg:px-16 lg:pb-32",
  contentClassName,
  sizes: sizesOverride,
}: WorkGridProps) {
  const { columns, sizes: ladderSizes } = ladder(items.length);
  const sizes = sizesOverride ?? ladderSizes;

  const content = (
    <>
      {heading ?? (
        <h2 id={headingId} className="sr-only">
          {WORK_PAGE.gridHeading}
        </h2>
      )}
      <ul className={`grid gap-4 ${columns}`}>
        {items.map((item, i) => (
          <li key={item.id}>
            <ScrollReveal delay={120 + (i % 4) * 80} className="h-full">
              <WorkCard
                item={item}
                index={numbering(item, i)}
                variant="tile"
                sizes={sizes}
                priority={eager && i < 2}
              />
            </ScrollReveal>
          </li>
        ))}
      </ul>
      {children}
    </>
  );

  return (
    <section aria-labelledby={headingId} className={className}>
      {contentClassName === undefined ? (
        content
      ) : (
        <div className={contentClassName}>{content}</div>
      )}
    </section>
  );
}
