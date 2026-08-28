import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SERVICE_PAGES } from "@/content/service-pages";

const PAGE = SERVICE_PAGES.product;

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
};

/**
 * `/services/product` — decision-log **#30** (2026-08-28). One of the
 * site's two service routes, carrying **New Product**, **Product
 * Completion** and **Product Support** as anchored blocks, so a visitor
 * who clicks a service card lands on that service rather than at the
 * top of a page about three of them.
 *
 * Four thin routes were the unit-26 brief's shape; two grouped pages
 * are the owner's (2026-08-28). Structure, surface and every solved
 * trap live in `<ServicePage>` — this file is the route, its metadata,
 * and the chrome, which is exactly what `pricing/page.tsx` is.
 *
 * Nav and footer mount here rather than in `src/app/layout.tsx`, the
 * same way `page.tsx` and `pricing/page.tsx` do it, so the 404 keeps
 * its own light paper surface. `QualificationModalProvider` is already
 * in the layout, so every CTA on the page reaches the modal without a
 * second provider.
 *
 * There is deliberately **no `/services` index route** (brief): the
 * home page's `#services` section is the hub.
 *
 * Server component — prerendered to static HTML. Decision #8 holds:
 * `/api/qualify` is still the entire server-side footprint.
 */
export default function ProductServices() {
  return (
    <>
      <SiteNav />
      <main className="grow">
        <ServicePage page={PAGE} />
      </main>
      <SiteFooter />
    </>
  );
}
