import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { NOT_FOUND } from "@/content/copy";

/**
 * Custom 404 per the sitemap (docs/03-site-architecture.md): the
 * root not-found handles every unmatched URL and routes visitors
 * back to the page. Rendered dark on the `background` ground in
 * `foreground` text like every other route (decision-log #47: the site
 * is dark only, so the 404 no longer carries its own light surface).
 */
export default function NotFound() {
  return (
    <main className="flex grow items-center bg-background text-foreground">
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
