import type { JSX } from "react";
import {
  DocumentEntryDiagram,
  EmailTriageDiagram,
  QuotingIntakeDiagram,
} from "@/components/agentic-diagrams";
import {
  BuildFromScratchDiagram,
  FinishStartedDiagram,
} from "@/components/product-diagrams";
import { ProductTeamDiagram } from "@/components/product-team-diagram";
import { WeeklyReportingDiagram } from "@/components/weekly-reporting-diagram";
import type { ServiceBlockId } from "@/lib/types";

/**
 * The visual half of a service row: one diagram per block, in the
 * site's diagram language (decision-log **#60**, owner call
 * 2026-10-15; the primitives and the rules they follow are in
 * `diagram.tsx`).
 *
 * **The wireframe set of #30 retires here.** The five purpose-built,
 * skeleton-only mocks (and the two that were left by #53: the New
 * Product bento, the Product Completion editor, the Product Support
 * timeline) are gone, and with them the shared `VisualFade` and the
 * fin chart steps they used as interface chrome (#31). Build-note 34's
 * open wireframe items close with them: F9's second coral mark on the
 * timeline's date scale, and the coral area fill under the bento's
 * chart. Git keeps all of it.
 *
 * **Each diagram shows its job** (the visuals brief, 2026-10-15):
 *
 * - The agentic page's four example jobs (#57), each a before and an
 *   after with the agent between them: a crowded inbox sorted, a few
 *   flagged and the rest drafted; numbers in four tools pulled into one
 *   delivered report; a customer's request drafted into a quote and
 *   routed; a pile of documents entered into accounting with nothing
 *   retyped.
 * - AI Product Development's three ways in (#53): a product taking
 *   shape with agents inside it; a half-built product assessed and
 *   completed; a live product watched and improved.
 *
 * **They say things now** (#61): labels, sample names, sample numbers
 * and generic tool names, all in `src/content/diagrams.ts` and all about
 * the job beside them. Rule 4.3 still binds everything outside them.
 *
 * Every diagram names itself to assistive tech (`role="img"`, or
 * `role="group"` around its controls), so this wrapper adds nothing.
 */
const VISUALS: Record<ServiceBlockId, (() => JSX.Element) | null> = {
  "new-product": BuildFromScratchDiagram,
  "product-completion": FinishStartedDiagram,
  "product-support": ProductTeamDiagram,
  "email-triage": EmailTriageDiagram,
  "weekly-reporting": WeeklyReportingDiagram,
  "quoting-and-intake": QuotingIntakeDiagram,
  "document-and-data-entry": DocumentEntryDiagram,
};

/**
 * Whether a block has a visual, so its row knows to split in two. Every
 * block has one since #60; the map stays total over `ServiceBlockId`
 * and nullable, so a new block cannot ship without a decision about
 * its visual and cannot silently inherit another's.
 */
export function hasBlockVisual(block: ServiceBlockId): boolean {
  return VISUALS[block] !== null;
}

export function ServiceBlockVisual({ block }: { block: ServiceBlockId }) {
  const Visual = VISUALS[block];
  if (Visual === null) return null;
  return <Visual />;
}
