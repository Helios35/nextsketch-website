import { BrandMark } from "@/components/brand-wordmark";
import { DiagramStage } from "@/components/diagram-stage";
import {
  DiagramFrame,
  DiagramSvg,
  ON_PAGE_CANVAS,
  diagramGrid,
  type Rect,
} from "@/components/diagram";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PROCESS_MAP } from "@/content/diagrams";

/**
 * The Why section's visual (decision-log #60): a process being mapped,
 * which is what #55's body copy says NextSketch does first: "we trace
 * how a request moves from inbox to done and mark every step someone
 * repeats by hand."
 *
 * One request (the dot) moves along six steps. It holds at each, and
 * longest at the three done by hand, which the map marks in coral as
 * the spots where an agent goes, each with an empty agent slot beside
 * it. Pricing the job is a judgement call and stays with a person:
 * that the map also says where an agent would only add noise is the
 * other half of the copy beside it.
 *
 * Two drawings: a column of steps under 42rem of width, a row from it.
 * Coral is the map's marks (the three diamonds and the legend's) and
 * the mark's own lead in each agent slot, nothing else.
 *
 * `role="img"`, named by `PROCESS_MAP.label`: the steps are read once,
 * as a sentence. Under reduced motion the request rests at the first
 * step and nothing moves.
 */

const GRID = diagramGrid("2xl", { w: 320, h: 584 }, { w: 900, h: 256 });

const STEPS = PROCESS_MAP.steps;

/* Narrow drawing: the line runs down at x 44, a step every 76. */
const TALL_X = 44;
const tallY = (i: number) => 96 + i * 76;
/* Wide drawing: the line runs across at y 72, a step every 144. */
const WIDE_Y = 72;
const wideX = (i: number) => 90 + i * 144;

const TALL_LINE = `M${TALL_X},${tallY(0)} L${TALL_X},${tallY(STEPS.length - 1)}`;
const WIDE_LINE = `M${wideX(0)},${WIDE_Y} L${wideX(STEPS.length - 1)},${WIDE_Y}`;

const boxAt = (i: number) =>
  GRID.place(
    [66, tallY(i) - 31, 236, 62] as Rect,
    [wideX(i) - 67, 94, 134, 92] as Rect,
  );

const slotAt = (i: number) =>
  GRID.place(
    [290, tallY(i) - 11, 22, 22] as Rect,
    [wideX(i) + 53, 84, 24, 24] as Rect,
  );

const HEADER = GRID.place([20, 16, 280, 0], [24, 14, 852, 0]);
const LEGEND = GRID.place([20, 524, 280, 0], [24, 218, 852, 0]);

const MONO =
  "font-mono text-[0.5625rem] leading-none tracking-[0.12em] whitespace-nowrap uppercase @3xl:text-[0.625rem]";
const NAME =
  "text-xs leading-snug font-medium text-balance text-foreground @3xl:text-[0.8125rem]";

/** A step's mark on the line: coral diamond if by hand, a ring if not. */
function StepMark({ x, y, byHand }: { x: number; y: number; byHand: boolean }) {
  return byHand ? (
    <rect
      x={x - 5}
      y={y - 5}
      width={10}
      height={10}
      transform={`rotate(45 ${x} ${y})`}
      className="fill-brand"
    />
  ) : (
    <circle
      cx={x}
      cy={y}
      r={4.5}
      strokeWidth={1.25}
      vectorEffect="non-scaling-stroke"
      className="fill-card stroke-muted-foreground"
    />
  );
}

function Lines({ mode }: { mode: "tall" | "wide" }) {
  const tall = mode === "tall";
  const line = tall ? TALL_LINE : WIDE_LINE;
  const start = tall ? { x: TALL_X, y: tallY(0) } : { x: wideX(0), y: WIDE_Y };
  return (
    <DiagramSvg grid={GRID} mode={mode}>
      <path
        d={line}
        fill="none"
        strokeWidth={1.25}
        vectorEffect="non-scaling-stroke"
        className="stroke-muted-foreground/80 [stroke-dasharray:3_4] motion-safe:animate-diagram-dash"
      />
      {/* Each step's tie from the line to its box. */}
      {STEPS.map((_, i) => (
        <path
          key={i}
          d={
            tall
              ? `M${TALL_X},${tallY(i)} L66,${tallY(i)}`
              : `M${wideX(i)},${WIDE_Y} L${wideX(i)},94`
          }
          fill="none"
          strokeWidth={1.25}
          vectorEffect="non-scaling-stroke"
          className="stroke-muted-foreground/80"
        />
      ))}
      {STEPS.map((step, i) => (
        <StepMark
          key={step.name}
          x={tall ? TALL_X : wideX(i)}
          y={tall ? tallY(i) : WIDE_Y}
          byHand={step.byHand}
        />
      ))}
      {/* The request. It travels and holds under motion; under reduced
          motion it rests at the first step instead. */}
      <circle
        r={4}
        className="diagram-packet fill-foreground motion-safe:animate-diagram-trace"
        style={{ offsetPath: `path("${line}")` }}
      />
      <circle
        cx={start.x}
        cy={start.y}
        r={4}
        className="hidden fill-foreground motion-reduce:inline"
      />
    </DiagramSvg>
  );
}

export function ProcessMapDiagram() {
  return (
    <div role="img" aria-label={PROCESS_MAP.label}>
      <div aria-hidden="true">
        <ScrollReveal>
          <DiagramFrame surface="page">
            <DiagramStage
              tall={GRID.tall}
              wide={GRID.wide}
              breakpoint="2xl"
              capTall
            >
              <Lines mode="tall" />
              <Lines mode="wide" />

              <div
                className={`${HEADER.className} flex flex-col gap-2 @2xl:flex-row @2xl:justify-between`}
                style={HEADER.style}
              >
                <span className={`${MONO} ${ON_PAGE_CANVAS} text-foreground`}>
                  {PROCESS_MAP.title}
                </span>
                <span
                  className={`${MONO} ${ON_PAGE_CANVAS} text-muted-foreground`}
                >
                  {PROCESS_MAP.route}
                </span>
              </div>

              {STEPS.map((step, i) => {
                const box = boxAt(i);
                return (
                  <div
                    key={step.name}
                    className={box.className}
                    style={box.style}
                  >
                    <ScrollReveal delay={120 + i * 60} className="size-full">
                      <div className="flex size-full flex-col justify-between rounded-md border border-border bg-secondary px-2.5 py-2 @2xl:py-2.5">
                        <span className="flex items-center justify-between gap-2">
                          <span className={`${MONO} text-muted-foreground`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={`${MONO} text-muted-foreground`}>
                            {step.tag}
                            {"detail" in step && (
                              <span className="@2xl:hidden">
                                {" "}
                                · {step.detail}
                              </span>
                            )}
                          </span>
                        </span>
                        <span className={NAME}>{step.name}</span>
                        {"detail" in step ? (
                          <span
                            className={`${MONO} hidden text-muted-foreground @2xl:block`}
                          >
                            {step.detail}
                          </span>
                        ) : (
                          <span
                            aria-hidden="true"
                            className="hidden h-[0.5625rem] @2xl:block"
                          />
                        )}
                      </div>
                    </ScrollReveal>
                  </div>
                );
              })}

              {/* The empty agent slots beside the steps done by hand. */}
              {STEPS.map((step, i) => {
                if (!step.byHand) return null;
                const slot = slotAt(i);
                return (
                  <div
                    key={step.name}
                    className={slot.className}
                    style={slot.style}
                  >
                    <span className="flex size-full items-center justify-center rounded-md border border-dashed border-muted-foreground bg-card">
                      <BrandMark className="h-[58%] w-auto" />
                    </span>
                  </div>
                );
              })}

              <div
                className={`${LEGEND.className} flex flex-col gap-2.5 @2xl:flex-row @2xl:gap-8`}
                style={LEGEND.style}
              >
                <span
                  className={`${MONO} ${ON_PAGE_CANVAS} flex items-center gap-2 text-muted-foreground`}
                >
                  <span className="size-2 shrink-0 rounded-full bg-foreground" />
                  {PROCESS_MAP.legend.request}
                </span>
                <span
                  className={`${MONO} ${ON_PAGE_CANVAS} flex items-center gap-2 text-muted-foreground`}
                >
                  <span className="size-2 shrink-0 rotate-45 bg-brand" />
                  {PROCESS_MAP.legend.byHand}
                </span>
              </div>
            </DiagramStage>
          </DiagramFrame>
        </ScrollReveal>
      </div>
    </div>
  );
}
