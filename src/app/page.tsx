import { Hero } from "@/components/hero";

/**
 * The single page — the landing hero is the entire site for now
 * (owner-directed, 2026-06-14). The qualification modal opens from the
 * hero CTA via the layout-level provider.
 */
export default function Home() {
  return (
    <main className="grow">
      <Hero />
    </main>
  );
}
