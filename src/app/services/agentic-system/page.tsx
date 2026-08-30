import type { Metadata } from "next";
import { ServicePage } from "@/components/service-page";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SERVICE_PAGES } from "@/content/service-pages";

const PAGE = SERVICE_PAGES["agentic-system"];

export const metadata: Metadata = {
  title: PAGE.title,
  description: PAGE.description,
};

/**
 * `/services/agentic-system` — decision-log **#30** (2026-08-28). The
 * site's second service route, and the only one whose segment is a
 * `ServiceSlug`: this page *is* the Agentic System service.
 *
 * Its two anchored blocks are the **two depths** `/pricing` sells that
 * service at, which Taxonomy §1 records as positioning rather than an
 * implementation note and names this unit as the consumer of: **AI
 * Workflow Integration** (agents and custom tools dropped into
 * processes the business already runs) and **Internal Tool** (a full
 * product with a real interface and agents behind it). Both preselect
 * `agentic` in the modal (#29) — the modal asks what a visitor needs,
 * not how deep they want to go, and the depth is what the two price
 * points express.
 *
 * **No price on this page.** The two blocks name the two depths; the
 * close links to `/pricing`, which is where the figures live and stays
 * untouched by this unit.
 *
 * Structure, surface and every solved trap live in `<ServicePage>`.
 * Nav and footer mount here, not in the layout, so the 404 keeps its
 * own light paper surface.
 *
 * Server component — prerendered to static HTML. Decision #8 holds.
 */
export default function AgenticSystemServices() {
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
