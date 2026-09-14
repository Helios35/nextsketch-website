import type { CaseStudy } from "@/lib/types";
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
 * Slug → case study, or `undefined` for a segment no module declares.
 * `/work/[slug]` answers `undefined` with `notFound()`, which is how
 * `/work/does-not-exist` reaches the site 404 rather than an empty page.
 */
export const findCaseStudy = (slug: string): CaseStudy | undefined =>
  CASE_STUDIES.find((study) => study.slug === slug);
