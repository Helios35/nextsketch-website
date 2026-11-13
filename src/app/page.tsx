import { AboutSection } from "@/components/about-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Hero } from "@/components/hero";
import { ManifestoSection } from "@/components/manifesto-section";
import { ProcessSection } from "@/components/process-section";
import { ProofBand } from "@/components/proof-band";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

/**
 * The single scrolling page (Redesign Unit 02, decision-log #13):
 * hero → Manifesto → Services → Process → About → Final CTA → footer,
 * every section rebuilt to the hero-derived design system
 * (docs/04-ux-spec.md), restyled to fin's Zen Linen dark theme
 * (decision-log #47). The hero opens with the owner's looping
 * footage — the only video on the site (decision-log #46, 2026-10-05);
 * the scroll-scrubbed backdrop that used to sit behind the lower
 * sections is retired, so they sit on the page's `background`, the
 * same one the footer uses. Nav and footer mount here, not in the
 * layout, so the 404 renders without them (it is dark too since #47).
 * The held sections (Fit, FAQ, Testimonials) stay dormant per
 * decision-log #13.
 *
 * **Work is dormant again since #78** (2026-11-13): the "Work in
 * production" band that #16 put under the hero did not help a buyer
 * decide, so it came off the page, and its nav item with it. Its files
 * (`work-section.tsx`, `work-rail.tsx`, `src/content/work.ts`,
 * `public/work/`) stay on disk, unused, for the case studies to come.
 *
 * Decision-log #58 adds three bands, not sections: the audience line
 * inside the hero, the proof band directly under the hero, and the
 * waitlist band inside Services. Since #78 the proof band is followed
 * by Manifesto, which takes index (01).
 */
export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="top" className="grow">
        <Hero />
        <ProofBand />
        <ManifestoSection />
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
