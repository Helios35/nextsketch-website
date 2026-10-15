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
 * `/services/product` — decision-log **#30** (2026-08-28): the page for
 * **AI Product Development** since **#53** (2026-10-15), one offer with
 * three ways in. Build from scratch, finish what someone started and
 * ongoing product team are anchored blocks on the anchors the retired
 * services gave them (`#new-product`, `#product-completion`,
 * `#product-support`), so an old shared link still lands on its block.
 *
 * Four thin routes were the unit-26 brief's shape; two grouped pages
 * are the owner's (2026-08-28). Structure, surface and every solved
 * trap live in `<ServicePage>` — this file is the route, its metadata,
 * and the chrome, which is exactly what `pricing/page.tsx` is.
 *
 * Nav and footer mount here rather than in `src/app/layout.tsx`, the
 * same way `page.tsx` and `pricing/page.tsx` do it, so the 404 keeps
 * its own bare surface (dark since decision-log #47; it was the one
 * light paper page before). `QualificationModalProvider` is already
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
