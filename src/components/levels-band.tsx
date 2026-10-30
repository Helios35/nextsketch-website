import { DiagramFrame, ON_PAGE_CANVAS } from "@/components/diagram";
import { LevelMark } from "@/components/level-mark";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  LEVEL_WORDS,
  LEVELS_BAND,
  levelOf,
  levelsLabel,
  OFFER_LEVELS,
} from "@/content/levels";
import { SERVICES } from "@/content/services";
import type { LevelNumber, ServiceSlug } from "@/lib/types";

/**
 * The five levels of AI, in the Services section above the two cards
 * — decision-log **#69**. A visitor who arrives from a post asking
 * "Where does your business sit?" finds every level here, sees Level 1
 * as where most businesses stop (not sold), and sees which offering
 * covers which levels.
 *
 * **Drawn in the diagram language (#60), built as content.** The frame
 * is `DiagramFrame`'s: four corner brackets round a `card` panel on the
 * dot-grid canvas. Inside, the levels are real lists and headings, not
 * a `role="img"` drawing, because the level names and lines are what
 * the section exists to say and assistive tech should read each one.
 *
 * - **Three groups, in level order:** Level 1 alone, then Levels 2 and 3
 *   under Agentic System Integration, then 4 and 5 under AI Product
 *   Development. Each group is captioned by its offering's colour line
 *   (the offer tab's form, #67) and name, or for Level 1 by a dashed
 *   line, "Not sold" and the doc's "Where most businesses stop".
 * - **A staircase from `lg:`:** the five steps share a baseline and rise
 *   left to right (`STEP_HEIGHT`), the doc's picture of climbing. Below
 *   `lg:` the groups stack and the two levels in a group sit side by
 *   side from `sm:`.
 * - **Level 1 is the outlier** (the doc's visual note): a dashed, hollow
 *   step (a `card` panel the colour of the canvas rather than a
 *   `secondary` one), dimmer text, and a dashed line between it and
 *   Level 2.
 * - **Coral, once:** "We start here" over Level 2, the band's one
 *   emphasis (the one-emphasis-per-diagram rule, #60). Every other mark
 *   is a level colour or an offer colour, and those identify only.
 *
 * Text set straight on the canvas takes `ON_PAGE_CANVAS`, so no grid
 * dot sits under a letter. Server component; no motion beyond the
 * shared `rise-in` reveal.
 */

const MONO = "font-mono text-[0.7rem] tracking-[0.14em] uppercase";

/* Each step's height from `lg:`, so the five share a baseline and rise
   by 2rem a level. The lowest still holds Level 1's text at 1024px. */
const STEP_HEIGHT: Record<LevelNumber, string> = {
  1: "lg:min-h-44",
  2: "lg:min-h-52",
  3: "lg:min-h-60",
  4: "lg:min-h-68",
  5: "lg:min-h-76",
};

const OFFER_LINE: Record<ServiceSlug, string> = {
  "agentic-system": "bg-offer-agentic-system",
  product: "bg-offer-product",
};

function Step({ level, start }: { level: LevelNumber; start?: boolean }) {
  const { name, line } = levelOf(level);
  const outlier = level === 1;
  return (
    <li className={`flex flex-col justify-end ${STEP_HEIGHT[level]}`}>
      {start === true && (
        <p className={`${MONO} ${ON_PAGE_CANVAS} mb-2 text-brand`}>
          {LEVELS_BAND.start}
        </p>
      )}
      <div
        className={`flex flex-1 flex-col rounded-md border p-4 ${outlier ? "border-dashed border-muted-foreground/70 bg-card" : "border-border bg-secondary"}`}
      >
        <p className={`${MONO} flex items-center gap-2 text-muted-foreground`}>
          <LevelMark level={level} className="size-4" />
          {LEVEL_WORDS.level} {level}
        </p>
        <h4
          className={`mt-3 text-base leading-snug font-semibold ${outlier ? "text-muted-foreground" : "text-foreground"}`}
        >
          {name}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {line}
        </p>
      </div>
    </li>
  );
}

function Caption({ offer }: { offer?: ServiceSlug }) {
  const service =
    offer === undefined ? undefined : SERVICES.find((s) => s.slug === offer);
  return (
    /* `lg:min-h-20`: every caption the same height, so the five steps
       above them keep one baseline even where "Where most businesses
       stop" wraps to two lines in Level 1's narrow column. */
    <div className="flex flex-col gap-1.5 lg:order-last lg:min-h-20 lg:pt-4">
      <p className={`${MONO} flex items-center gap-3`}>
        {offer === undefined ? (
          <span
            aria-hidden="true"
            className="w-10 shrink-0 border-t border-dashed border-muted-foreground"
          />
        ) : (
          <span
            aria-hidden="true"
            className={`h-0.5 w-10 shrink-0 rounded-full ${OFFER_LINE[offer]}`}
          />
        )}
        <span
          className={`${ON_PAGE_CANVAS} ${offer === undefined ? "text-muted-foreground" : "text-foreground"}`}
        >
          {service?.name ?? LEVELS_BAND.notSold}
        </span>
      </p>
      <p className={`${ON_PAGE_CANVAS} text-sm text-muted-foreground`}>
        {offer === undefined ? LEVELS_BAND.stop : levelsLabel(offer)}
      </p>
    </div>
  );
}

function Group({ offer }: { offer?: ServiceSlug }) {
  const levels: readonly LevelNumber[] =
    offer === undefined ? [1] : OFFER_LEVELS[offer];
  const service =
    offer === undefined ? undefined : SERVICES.find((s) => s.slug === offer);
  const label =
    offer === undefined || service === undefined
      ? LEVELS_BAND.stopGroup
      : `${service.name}: ${levelsLabel(offer)}`;
  /* Level 1 | dashed line | 2 and 3 | 4 and 5. The dashed line between
     Level 1 and Level 2 is the doc's; the two offerings sit apart by
     space alone. */
  const edge =
    offer === undefined
      ? "lg:pr-5"
      : offer === "agentic-system"
        ? "border-t border-dashed border-muted-foreground/70 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pr-2.5 lg:pl-5"
        : "lg:pl-2.5";
  return (
    <div role="group" aria-label={label} className={`flex flex-col gap-4 ${edge}`}>
      <Caption offer={offer} />
      <ul
        className={`grid gap-3 lg:items-end ${levels.length > 1 ? "sm:grid-cols-2" : ""}`}
      >
        {levels.map((level) => (
          <Step key={level} level={level} start={level === 2} />
        ))}
      </ul>
    </div>
  );
}

export function LevelsBand() {
  return (
    <div className="mt-14 md:mt-20">
      <ScrollReveal>
        <p className={`${MONO} text-muted-foreground`}>{LEVELS_BAND.eyebrow}</p>
        <h3 className="mt-3 font-sans text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          {LEVELS_BAND.headline}
        </h3>
        <p className="mt-2 text-base leading-relaxed text-muted-foreground">
          {LEVELS_BAND.subline}
        </p>
      </ScrollReveal>
      <ScrollReveal delay={120} className="mt-8">
        <DiagramFrame surface="page">
          <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[1fr_2fr_2fr] lg:items-end lg:gap-0 lg:p-8">
            <Group />
            <Group offer="agentic-system" />
            <Group offer="product" />
          </div>
        </DiagramFrame>
      </ScrollReveal>
    </div>
  );
}
