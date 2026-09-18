import type { CaseStudy, CaseStudyPageContent } from "@/lib/types";
import { AGENTIC_PLATFORM } from "./agentic-platform";
import { MASCOT, MASCOT_PAGE } from "./mascot";
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
 * Slug → case study, or `undefined` for a segment no module declares.
 * `/work/[slug]` answers `undefined` with `notFound()`, which is how
 * `/work/does-not-exist` reaches the site 404 rather than an empty page.
 */
export const findCaseStudy = (slug: string): CaseStudy | undefined =>
  CASE_STUDIES.find((study) => study.slug === slug);

/**
 * The studies that have a full page (decision-log #43), keyed by slug.
 * A study's page content lives beside its card content in its own
 * module (#41) and is registered here by that module's own `slug`, so
 * a page can only ever belong to a study that exists.
 *
 * Kept apart from `CASE_STUDIES` on purpose: that list is handed to
 * the home rail and the `/work` grid, both client components, so
 * everything on it is serialised into every page's payload. A study's
 * page content is several kilobytes of copy and geometry that only its
 * own route needs, and putting it on the list would ship it with the
 * home page. Three of the four studies have no page yet and render the
 * placeholder route until the owner supplies their material.
 */
const CASE_STUDY_PAGES: ReadonlyMap<string, CaseStudyPageContent> = new Map([
  [MASCOT.slug, MASCOT_PAGE],
]);

/** Slug → the study's page content, or `undefined` for a study without one. */
export const findCaseStudyPage = (
  slug: string,
): CaseStudyPageContent | undefined => CASE_STUDY_PAGES.get(slug);

/**
 * Every study but this one, in list order: the "Other projects" band
 * on a case study page (#43). Never itself, never reordered.
 */
export const otherCaseStudies = (slug: string): readonly CaseStudy[] =>
  CASE_STUDIES.filter((study) => study.slug !== slug);
