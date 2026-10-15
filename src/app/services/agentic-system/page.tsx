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
 * `/services/agentic-system` — decision-log **#30** (2026-08-28): the
 * page for **Agentic System Integration**, the lead offering since
 * **#53** (2026-10-15).
 *
 * Its four anchored blocks are **example jobs** (#57): email triage,
 * weekly reporting, quoting and intake, and document and data entry,
 * each saying what the agent does and what we map first. Then what's
 * included and what the monthly covers, and the price in the hero.
 * Every CTA preselects `agentic`. The two depths of #29 (AI Workflow
 * Integration, Internal Tool) and their anchors retired with #53; a
 * link to either anchor still opens this page, at the top.
 *
 * Structure, surface and every solved trap live in `<ServicePage>`.
 * Nav and footer mount here, not in the layout, so the 404 keeps its
 * own bare surface (dark since decision-log #47; it was the one light
 * paper page before).
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
