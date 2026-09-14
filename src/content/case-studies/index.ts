import type { CaseStudy, WorkItem } from "@/lib/types";
import { AGENTIC_PLATFORM } from "./agentic-platform";
import { MASCOT } from "./mascot";
import { PARCELL } from "./parcell";
import { SAAS_PLATFORM } from "./saas-platform";

/**
 * Every case study, in display order — the one list the home proof
 * band, the `/work` grid and the static params of `/work/[slug]` all
 * read (decision-log #39, #41). A study is on every surface or on none.
 *
 * **One module per study, deliberately (#41).** Adding a case study is
 * adding a file beside these and one line in this array: no page edit,
 * no route edit, no component edit. There is no CMS and there is not
 * going to be one — the repo is the content store, which is what keeps
 * the banned-terms gate and Rule 4.1's approval trail working. Imagery
 * lives under `/public/work/` (Taxonomy §7); anything heavy enough to
 * bloat the repo is hosted externally and referenced by URL, the way
 * the scroll footage already is.
 *
 * The order is the owner's (2026-08-24) and is the rail's order, so the
 * band's "(01)" is the grid's "(01)".
 */
export const CASE_STUDIES = [
  MASCOT,
  SAAS_PLATFORM,
  AGENTIC_PLATFORM,
  PARCELL,
] as const satisfies readonly CaseStudy[];

/**
 * Two modules declaring one slug would prerender one route and leave
 * the second study unreachable without a word said — `find` returns the
 * first match. The build evaluates this module to collect the static
 * params, so a collision fails `next build` loudly instead.
 */
const slugs = new Set<string>(CASE_STUDIES.map((study) => study.slug));
if (slugs.size !== CASE_STUDIES.length) {
  throw new Error(
    "case-studies: two modules declare the same slug; every case study needs its own route segment.",
  );
}

/**
 * The card's view of a study — the `WorkItem` fields and nothing else.
 *
 * A card is a client component, and every prop handed to one is
 * serialised into the page's payload. Since the template (#42) a study
 * carries its whole page — the blocks, the rows, the alts — and passing
 * the study itself to `<WorkCard>` shipped all four studies' long-form
 * copy inside the home page, the grid and every case study route
 * (adversarial review, build-note 30). The rail, the grid and the
 * "Other projects" band read this projection instead, so the payload
 * carries what a card shows and the copy stays on the server.
 */
export const toWorkItem = (study: CaseStudy): WorkItem => {
  const { id, slug, name, summary, sourceHref } = study;
  if (study.image === undefined) return { id, slug, name, summary, sourceHref };
  const { image, alt, focal, tone } = study;
  return { id, slug, name, summary, sourceHref, image, alt, focal, tone };
};

/**
 * The work inventory the home band and the `/work` grid render — the
 * case study list projected to what a card shows, in the owner's
 * order (2026-08-24). It lives here, beside the list, rather than in
 * `src/content/work.ts`, so that the client-side rail's import of that
 * file's string constants does not drag every study's page copy into
 * the client bundle: this module has a deliberate side effect (the
 * slug collision throw below), so a bundler cannot tree-shake the list
 * out of any client graph it enters. It never enters one.
 */
export const WORK_ITEMS: readonly WorkItem[] = CASE_STUDIES.map(toWorkItem);

/**
 * Slug → case study, or `undefined` for a segment no module declares.
 * `/work/[slug]` answers `undefined` with `notFound()`, which is how
 * `/work/does-not-exist` reaches the site 404 rather than an empty page.
 */
export const findCaseStudy = (slug: string): CaseStudy | undefined =>
  CASE_STUDIES.find((study) => study.slug === slug);

/**
 * The studies a case study route shows as "Other projects" (decision-log
 * #42): the next `count` in display order after the given one, wrapping
 * around, never the study itself. Each comes with its position in the
 * list so its card keeps the number it carries on the band and the
 * grid — "(02)" is the same project everywhere.
 *
 * With one study there are no others and the band does not render;
 * with two there is one. Content-side rather than in the template so
 * the template knows nothing about the list.
 */
export const otherCaseStudies = (
  slug: string,
  count = 2,
): readonly { study: CaseStudy; index: number }[] => {
  const at = CASE_STUDIES.findIndex((study) => study.slug === slug);
  if (at === -1) return [];
  const others: { study: CaseStudy; index: number }[] = [];
  for (let step = 1; step <= count && step < CASE_STUDIES.length; step++) {
    const index = (at + step) % CASE_STUDIES.length;
    others.push({ study: CASE_STUDIES[index], index });
  }
  return others;
};
