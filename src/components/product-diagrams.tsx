import type { ReactNode } from "react";
import { BrandMark } from "@/components/brand-wordmark";
import {
  D_LABEL,
  D_TEXT,
  DiagramSvg,
  Flow,
  ON_CANVAS,
  Place,
  ProductWindow,
  ROW_GRID,
  RowDiagram,
} from "@/components/diagram";
import { BUILD_FROM_SCRATCH, FINISH_STARTED } from "@/content/diagrams";

/**
 * Two of AI Product Development's three ways in (decision-log #53),
 * drawn in the diagram language of #60. They replace the New Product
 * bento and the Product Completion editor of #30, which retire with
 * the rest of the wireframe set; the third way in, the ongoing product
 * team, has a control and lives in `product-team-diagram.tsx`.
 *
 * Both draw a product's window on the canvas, one 4/3 drawing at every
 * width (the frame the wireframes held, so the rows keep their height).
 * Server components: the only motion is ambient (#62), all CSS.
 *
 * **Coral, once per diagram:** today's marker on the build's timeline,
 * and the launch at the end of the finishing bar. The marks' leads in
 * the agent chips are the logo's own.
 */

const G = ROW_GRID;

/** A solid module in a product window: a mono title row over its body. */
function Module({
  title,
  aside,
  dashed = false,
  muted = false,
  children,
}: {
  title: string;
  aside?: ReactNode;
  dashed?: boolean;
  muted?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className={`flex size-full min-w-0 flex-col overflow-hidden rounded-sm ${dashed ? "" : "border border-border bg-secondary"}`}
    >
      <span className="flex shrink-0 items-center justify-between gap-1.5 px-1.5 pt-1.5 @md:px-2 @md:pt-2">
        <span
          className={`${D_LABEL} truncate ${muted ? "text-muted-foreground" : "text-foreground"}`}
        >
          {title}
        </span>
        {aside !== undefined && (
          <span className="hidden shrink-0 @sm:inline-flex">{aside}</span>
        )}
      </span>
      <span className="flex min-h-0 flex-1 flex-col justify-center gap-1.5 px-1.5 pb-1.5 @md:px-2 @md:pb-2">
        {children}
      </span>
    </div>
  );
}

/** A skeleton line: content the drawing does not need to spell out. */
function Line({ w, tone = "bg-accent" }: { w: string; tone?: string }) {
  return <span className={`block h-1 shrink-0 rounded-full ${tone} ${w}`} />;
}

/** The agent, small, inside a product: the mark in a chip. */
function AgentChip() {
  return (
    <span className="flex size-full items-center justify-center rounded-sm border border-muted-foreground bg-card">
      <BrandMark className="h-[62%] w-auto" />
    </span>
  );
}

/** A dashed outline drawn in the SVG layer: a part still being built. */
function Outline({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={3}
      fill="none"
      strokeWidth={1.25}
      vectorEffect="non-scaling-stroke"
      className="stroke-muted-foreground/80 [stroke-dasharray:3_4] motion-safe:animate-diagram-dash"
    />
  );
}

/* ------------------------------------------------------------------ *
 * Build from scratch: a product taking shape, with agents inside it.   *
 * ------------------------------------------------------------------ */

const BUILD = {
  window: G.place([14, 14, 372, 214]),
  chrome: G.place([14, 14, 372, 22]),
  sidebar: G.place([22, 44, 56, 176]),
  topbar: G.place([86, 44, 292, 20]),
  requests: G.place([86, 72, 150, 148]),
  reports: G.place([244, 72, 134, 70]),
  replies: G.place([244, 150, 134, 70]),
  agentA: G.place([210, 78, 20, 20]),
  agentB: G.place([352, 156, 20, 20]),
  timeline: G.place([14, 238, 372, 50]),
};

/** Where the build stands: three quarters through Build, week 5 of 8. */
const TODAY = "43.75%";

export function BuildFromScratchDiagram() {
  const c = BUILD_FROM_SCRATCH;
  return (
    <RowDiagram label={c.label}>
      <ProductWindow
        at={BUILD.window}
        chrome={BUILD.chrome}
        title={c.window}
        note={c.progress}
      />

      <Place
        at={BUILD.sidebar}
        className="flex flex-col gap-2 rounded-sm border border-border bg-secondary p-1.5 @md:p-2"
      >
        <span className="size-2.5 rounded-sm border border-muted-foreground" />
        <Line w="w-4/5" tone="bg-muted-foreground" />
        <Line w="w-3/5" />
        <Line w="w-2/3" />
        <Line w="w-1/2" />
      </Place>
      <Place
        at={BUILD.topbar}
        className="flex items-center gap-2 rounded-sm border border-border bg-secondary px-1.5"
      >
        <Line w="w-1/3" />
        <span className="ml-auto size-2 shrink-0 rounded-full border border-muted-foreground" />
      </Place>

      <Place at={BUILD.requests}>
        <Module title={c.modules.list}>
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="flex w-[74%] items-center gap-1.5">
              <span className="size-1.5 shrink-0 rounded-full bg-muted-foreground" />
              <Line w={["w-full", "w-4/5", "w-11/12", "w-3/4"][i]} />
            </span>
          ))}
          <span
            className={`${D_LABEL} hidden truncate text-muted-foreground @sm:block`}
          >
            {c.agents[0]}
          </span>
        </Module>
      </Place>
      <Place at={BUILD.reports}>
        <Module
          title={c.modules.chart}
          dashed
          muted
          aside={
            <span
              className={`${D_LABEL} hidden text-muted-foreground @sm:inline`}
            >
              {c.building}
            </span>
          }
        >
          <span className="flex h-4 items-end gap-1">
            {[50, 80, 65, 100].map((h) => (
              <span
                key={h}
                className="w-2 rounded-t-sm border border-b-0 border-dashed border-muted-foreground/80"
                style={{ height: `${h}%` }}
              />
            ))}
          </span>
        </Module>
      </Place>
      <Place at={BUILD.replies}>
        <Module title={c.modules.assistant}>
          <Line w="w-[74%]" tone="bg-muted-foreground" />
          <Line w="w-1/2" />
          <span
            className={`${D_LABEL} hidden truncate text-muted-foreground @sm:block`}
          >
            {c.agents[1]}
          </span>
        </Module>
      </Place>

      <DiagramSvg grid={G}>
        <Outline x={244} y={72} w={134} h={70} />
        {/* The agents at work, each down its own lane: one through the
            requests it sorts, one through the replies it drafts. */}
        <Flow d="M220,98 L220,212" dashed duration={2.4} />
        <Flow d="M362,176 L362,212" duration={1.6} offset={0.8} />
      </DiagramSvg>

      <Place at={BUILD.agentA}>
        <AgentChip />
      </Place>
      <Place at={BUILD.agentB}>
        <AgentChip />
      </Place>

      <Place at={BUILD.timeline} className="flex flex-col justify-center gap-2">
        <span className="grid grid-cols-4">
          {c.phases.map((phase, i) => (
            <span
              key={phase}
              className={`${D_LABEL} ${ON_CANVAS} ${i === 1 ? "text-foreground" : "text-muted-foreground"}`}
            >
              {phase}
            </span>
          ))}
        </span>
        <span className="relative block h-1.5 rounded-full bg-muted">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-muted-foreground"
            style={{ width: TODAY }}
          />
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className="absolute inset-y-0 w-px bg-background"
              style={{ left: `${i * 25}%` }}
            />
          ))}
          <span
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-brand"
            style={{ left: TODAY }}
          />
        </span>
        <span className="relative block h-2.5">
          <span
            className={`${D_LABEL} ${ON_CANVAS} absolute -translate-x-1/2 text-brand`}
            style={{ left: TODAY }}
          >
            {c.today}
          </span>
        </span>
      </Place>
    </RowDiagram>
  );
}

/* ------------------------------------------------------------------ *
 * Finish what someone started: a half-built product, assessed and      *
 * completed.                                                           *
 * ------------------------------------------------------------------ */

const FINISH = {
  window: G.place([14, 14, 226, 214]),
  chrome: G.place([14, 14, 226, 22]),
  signIn: G.place([22, 44, 101, 86]),
  payments: G.place([131, 44, 101, 86]),
  admin: G.place([22, 138, 101, 82]),
  tests: G.place([131, 138, 101, 82]),
  assessment: G.place([262, 14, 124, 214]),
  assessmentHead: G.place([262, 14, 124, 22]),
  assessmentRows: G.place([262, 36, 124, 192]),
  progress: G.place([14, 238, 372, 50]),
};

/** The middle of assessment row k, in canvas units (five rows over 192). */
const rowY = (k: number) => 36 + (192 * (k + 0.5)) / 5;

type Verdict = (typeof FINISH_STARTED.assessment.items)[number]["state"];

/** A verdict's glyph: a check to keep, a bang to fix, a query if missing. */
function VerdictGlyph({ state }: { state: Verdict }) {
  const path =
    state === "keep"
      ? "M2.5 6.2 5 8.5l4.5-5"
      : state === "fix"
        ? "M6 2.5v4.2M6 9v.4"
        : "M4.3 4.4a1.8 1.8 0 1 1 2.6 1.6c-.6.3-.9.7-.9 1.3M6 9.2v.3";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`size-2.5 shrink-0 ${state === "missing" ? "text-muted-foreground" : "text-foreground"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

export function FinishStartedDiagram() {
  const c = FINISH_STARTED;
  return (
    <RowDiagram label={c.label}>
      <ProductWindow
        at={FINISH.window}
        chrome={FINISH.chrome}
        title={c.window}
      />

      <Place at={FINISH.signIn}>
        <Module title={c.modules.signIn} aside={<VerdictGlyph state="keep" />}>
          <Line w="w-full" tone="bg-muted-foreground" />
          <Line w="w-full" />
          <span className="block h-2.5 w-1/2 rounded-sm bg-accent" />
        </Module>
      </Place>
      <Place at={FINISH.payments}>
        <Module title={c.modules.payments} aside={<VerdictGlyph state="fix" />}>
          <Line w="w-full" tone="bg-muted-foreground" />
          <span className="block h-1 w-4/5 rounded-full border-t border-dashed border-muted-foreground/80" />
          <Line w="w-2/3" />
        </Module>
      </Place>
      <Place at={FINISH.admin}>
        <Module
          title={c.modules.admin}
          aside={<VerdictGlyph state="missing" />}
          dashed
          muted
        />
      </Place>
      <Place at={FINISH.tests}>
        <Module
          title={c.modules.tests}
          aside={<VerdictGlyph state="missing" />}
          dashed
          muted
        />
      </Place>

      <Place
        at={FINISH.assessment}
        className="rounded-md border border-border bg-card"
      />
      <Place
        at={FINISH.assessmentHead}
        className={`${D_LABEL} flex items-center border-b border-border px-2 text-foreground @md:px-2.5`}
      >
        {c.assessment.title}
      </Place>
      <Place at={FINISH.assessmentRows} className="flex flex-col">
        {c.assessment.items.map((item) => (
          <span
            key={item.area}
            className="flex flex-1 items-center justify-between gap-1.5 px-2 @md:px-2.5"
          >
            <span className={`${D_TEXT} truncate text-foreground`}>
              {item.area}
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <VerdictGlyph state={item.state} />
              <span
                className={`${D_LABEL} hidden @sm:inline ${item.state === "missing" ? "text-muted-foreground" : "text-foreground"}`}
              >
                {item.verdict}
              </span>
            </span>
          </span>
        ))}
      </Place>

      <DiagramSvg grid={G}>
        <Outline x={22} y={138} w={101} h={82} />
        <Outline x={131} y={138} w={101} h={82} />
        {/* The assessment's calls, carried into the work: fix the
            payments, build the tests. */}
        <Flow
          d={`M262,${rowY(2)} C246,${rowY(2)} 248,87 232,87`}
          duration={2.2}
        />
        <Flow
          d={`M262,${rowY(4)} C246,${rowY(4)} 248,179 232,179`}
          dashed
          duration={2.6}
          offset={0.7}
        />
      </DiagramSvg>

      <Place
        at={FINISH.progress}
        className="flex flex-col justify-center gap-2"
      >
        <span className="flex items-center justify-between gap-2">
          <span className={`${D_LABEL} ${ON_CANVAS} text-foreground`}>
            {c.built}
          </span>
          <span className={`${D_LABEL} ${ON_CANVAS} text-brand`}>
            {c.launch}
          </span>
        </span>
        <span className="relative flex h-1.5">
          <span className="h-full w-[70%] rounded-l-full bg-muted-foreground" />
          <span className="h-full flex-1 rounded-r-full border border-l-0 border-dashed border-muted-foreground/80" />
          <span className="absolute top-1/2 right-0 size-2.5 translate-x-1/2 -translate-y-1/2 rotate-45 bg-brand" />
        </span>
      </Place>
    </RowDiagram>
  );
}
