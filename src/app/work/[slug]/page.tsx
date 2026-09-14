import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/case-study-page";
import { PageGlow } from "@/components/page-glow";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import {
  CASE_STUDIES,
  findCaseStudy,
  otherCaseStudies,
} from "@/content/case-studies";

/**
 * Next 16 hands a dynamic segment's `params` over as a promise.
 * Spelled out rather than the generated `PageProps<'/work/[slug]'>`
 * helper, because that type only exists after a build or `next dev`
 * has written `.next/types`, and CI runs `typecheck` before `build`.
 */
type CaseStudyRouteProps = {
  params: Promise<{ slug: string }>;
};

/**
 * One route per case study, prerendered at build from the same list
 * the cards render (decision-log #39). Adding a study to
 * `src/content/case-studies/` adds its route; nothing here changes.
 */
export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }));
}

/**
 * A segment no module declares is a 404, answered before any render.
 * With the default (`true`) an unknown slug would be rendered on
 * demand on the server first — a request-time function for a page that
 * cannot exist, on a site whose only server surface is `/api/qualify`
 * (#8). `false` keeps every case study route static and sends
 * `/work/does-not-exist` straight to the site's own `not-found.tsx`.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: CaseStudyRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  if (study === undefined) notFound();
  return { title: study.title, description: study.description };
}

/**
 * `/work/[slug]` — a case study's own route (decision-log **#39**,
 * 2026-09-12; the template, **#42**, 2026-09-14). The route is thin
 * for the reason `pricing/page.tsx` and the service routes are thin:
 * metadata, the chrome, and one component. Structure, every solved
 * trap and the reference's composition live in `<CaseStudyPage>`,
 * which renders whatever the study's module declares.
 *
 * Nav and footer mount here rather than in `src/app/layout.tsx`, the
 * same way every route does it, so the 404 keeps its own light paper
 * surface. `QualificationModalProvider` is already in the layout, so
 * the close's CTA reaches the modal without a second provider. The
 * viewport-fixed gold glow (#35) rides every route without the
 * footage, this one included (#39).
 *
 * `findCaseStudy` answers an unknown slug with `undefined` and the
 * route answers that with `notFound()`, which reaches the root
 * `not-found.tsx` — the site 404 on its light paper surface. With
 * `dynamicParams = false` that path is never taken for a prerendered
 * build; it stays as the type narrowing and as the guard should the
 * flag ever flip. "Other projects" is `otherCaseStudies`: the next two
 * studies in display order, computed content-side so the template
 * knows nothing about the list.
 *
 * Server component; the page prerenders to static HTML and #8 holds.
 */
export default async function CaseStudyRoute({
  params,
}: CaseStudyRouteProps) {
  const { slug } = await params;
  const study = findCaseStudy(slug);
  if (study === undefined) notFound();

  return (
    <>
      {/* The viewport-fixed gold glow (#35). The bands below are
          transparent so it shows through — the page's ground is the
          layout's `ink`. */}
      <PageGlow />
      <SiteNav />
      <main className="grow">
        <CaseStudyPage study={study} others={otherCaseStudies(study.slug)} />
      </main>
      <SiteFooter />
    </>
  );
}
