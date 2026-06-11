import { Container } from "@/components/container";

/**
 * The single page — every Taxonomy §6 anchor in canonical order per
 * docs/03-site-architecture.md §Page structure. Each Container below
 * is an empty, anchored slot: units 03–05 fill them in place without
 * touching this frame. The min-height keeps anchor navigation
 * observable until real sections land; section units replace it.
 */
export default function Home() {
  return (
    <main className="grow">
      {/* Unit 03 — Hero (incl. placeholder stat strip) */}
      <Container id="top" className="min-h-40" />
      {/* Unit 03 — Manifesto */}
      <Container id="why" className="min-h-40" />
      {/* Unit 03 — Process */}
      <Container id="process" className="min-h-40" />
      {/* Unit 04 — Selected work */}
      <Container id="work" className="min-h-40" />
      {/* Unit 04 — Services */}
      <Container id="services" className="min-h-40" />
      {/* Unit 04 — About */}
      <Container id="about" className="min-h-40" />
      {/* Unit 04 — Testimonials (placeholder blocks) */}
      <Container id="voices" className="min-h-40" />
      {/* Unit 05 — Who it's for */}
      <Container id="fit" className="min-h-40" />
      {/* Unit 05 — FAQ */}
      <Container id="faq" className="min-h-40" />
      {/* Unit 05 — Final CTA */}
      <Container id="start" className="min-h-40" />
    </main>
  );
}
