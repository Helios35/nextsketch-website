import { Placeholder } from "@/components/placeholder";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ABOUT } from "@/content/copy";

/**
 * About (#about) — the person behind it, solo
 * (docs/03-site-architecture.md row 7). A full-bleed ink band (unit
 * 08: the Container band variant revisits the contained-panel call of
 * build-notes 04 deviation 3 — this is the owner-initiated revisit
 * that note reserved). The portrait is a pinned sheet: a paper mat
 * holding the layout-final placeholder — real photography is
 * owner-owed at launch-readiness and swaps in by taxonomy name.
 */
export function AboutSection() {
  return (
    <div className="py-24 md:py-36">
      <Reveal>
        <div className="grid gap-12 md:grid-cols-[3fr_2fr] md:gap-16">
          <div>
            <SectionHeading>{ABOUT.headline}</SectionHeading>
            <div className="mt-8 space-y-6">
              {ABOUT.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="max-w-prose text-lg leading-relaxed text-white/80"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="self-center md:max-w-sm md:justify-self-end">
            <div className="rotate-[0.8deg] rounded-lg bg-paper p-3 shadow-sheet-lg">
              <Placeholder section="about" index={1} ratio="3/4" art />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
