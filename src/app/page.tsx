import { AboutSection } from "@/components/about-section";
import { Container } from "@/components/container";
import { FaqSection } from "@/components/faq-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { FitSection } from "@/components/fit-section";
import { HeroSection } from "@/components/hero-section";
import { ManifestoSection } from "@/components/manifesto-section";
import { ProcessSection } from "@/components/process-section";
import { ServicesSection } from "@/components/services-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { WorkSection } from "@/components/work-section";

/**
 * The single page — every Taxonomy §6 anchor in canonical order per
 * docs/03-site-architecture.md §Page structure. Each Container below
 * is an anchored slot, filled in place by units 03–05 without
 * touching this frame.
 *
 * Tonal bands (unit 08, working-drawing direction): the page scrolls
 * through rooms — gridded paper (hero) → paper → white sheet
 * (process) → paper → ink (about) → paper → ink close (#start) into
 * the ink footer. Band classes live here so the rhythm of the whole
 * sheet is legible in one place.
 */
export default function Home() {
  return (
    <main className="grow">
      {/* Unit 03 — Hero (incl. placeholder stat strip) */}
      <Container id="top" band="grid-paper wash-gold">
        <HeroSection />
      </Container>
      {/* Unit 03 — Manifesto */}
      <Container id="why">
        <ManifestoSection />
      </Container>
      {/* Unit 03 — Process */}
      <Container id="process" band="border-y border-ink/5 bg-paper-bright">
        <ProcessSection />
      </Container>
      {/* Unit 04 — Selected work */}
      <Container id="work">
        <WorkSection />
      </Container>
      {/* Unit 04 — Services */}
      <Container id="services">
        <ServicesSection />
      </Container>
      {/* Unit 04 — About */}
      <Container id="about" band="grid-ink bg-ink text-white">
        <AboutSection />
      </Container>
      {/* Unit 04 — Testimonials (placeholder blocks) */}
      <Container id="voices">
        <TestimonialsSection />
      </Container>
      {/* Unit 05 — Who it's for */}
      <Container id="fit">
        <FitSection />
      </Container>
      {/* Unit 05 — FAQ */}
      <Container id="faq">
        <FaqSection />
      </Container>
      {/* Unit 05 — Final CTA */}
      <Container id="start" band="grid-ink wash-gold-ink bg-ink text-white">
        <FinalCtaSection />
      </Container>
    </main>
  );
}
