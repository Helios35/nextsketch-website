import { AboutSection } from "@/components/about-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Hero } from "@/components/hero";
import { ManifestoSection } from "@/components/manifesto-section";
import { ProcessSection } from "@/components/process-section";
import { ScrollVideo } from "@/components/scroll-video";
import { ServicesSection } from "@/components/services-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

/**
 * The single scrolling page (Redesign Unit 02, decision-log #13):
 * hero → Manifesto → Services → Process → About → Final CTA → footer,
 * every section rebuilt to the hero-derived design system
 * (docs/04-ux-spec.md v3.0). The hero stays first and untouched — it
 * is the design source of truth. The owner-supplied footage is the
 * site's fixed scroll-synced backdrop (owner direction 2026-07-06);
 * sections sit transparent over it. Nav and footer mount here, not in
 * the layout, so the 404 keeps its own light surface. The held
 * sections (Fit, Work, FAQ, Testimonials) stay dormant per
 * decision-log #13.
 */
export default function Home() {
  return (
    <>
      <ScrollVideo src="/consulting-video.mp4" />
      <SiteNav />
      <main id="top" className="grow">
        <Hero />
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
