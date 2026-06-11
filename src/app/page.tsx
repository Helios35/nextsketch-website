import { Container } from "@/components/container";
import { SITE } from "@/content/copy";

/**
 * Bare shell — proves tokens and fonts load. Real sections are
 * downstream units (see briefs/01-kickoff-foundation.md).
 */
export default function Home() {
  return (
    <main className="flex grow items-center">
      <Container>
        <p className="text-4xl font-bold tracking-tight">{SITE.name}</p>
      </Container>
    </main>
  );
}
