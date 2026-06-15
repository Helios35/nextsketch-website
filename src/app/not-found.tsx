import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { NOT_FOUND } from "@/content/copy";

/**
 * Custom 404 per the sitemap (docs/03-site-architecture.md): the
 * root not-found handles every unmatched URL and routes visitors
 * back to the page. Rendered on its own light paper surface since the
 * layout body is now the dark landing theme.
 */
export default function NotFound() {
  return (
    <main className="flex grow items-center bg-paper text-ink">
      <Container className="py-24">
        <SectionHeading as="h1" eyebrow={NOT_FOUND.eyebrow}>
          {NOT_FOUND.headline}
        </SectionHeading>
        <p className="mt-6 max-w-xl text-lg leading-relaxed">
          {NOT_FOUND.body}
        </p>
        <Button href="/" variant="secondary" className="mt-10">
          {NOT_FOUND.cta}
        </Button>
      </Container>
    </main>
  );
}
