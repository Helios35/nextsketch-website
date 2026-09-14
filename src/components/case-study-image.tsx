import Image from "next/image";
import { Placeholder } from "@/components/placeholder";
import { CASE_STUDY_PAGE } from "@/content/work";
import type { CaseStudyImage as CaseStudyImageContent } from "@/lib/types";

const RATIO_CLASS: Record<
  NonNullable<CaseStudyImageContent["ratio"]>,
  string
> = {
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

interface CaseStudyImageProps {
  image: CaseStudyImageContent;
  /** The block's default when the content does not set one. */
  ratio: NonNullable<CaseStudyImageContent["ratio"]>;
  /** `sizes` hint for the real image — how wide this frame can be. */
  sizes: string;
  /** 1-based position on the page, for the placeholder's taxonomy name. */
  index: number;
}

/**
 * One image frame on a case study route — the hero image, a full-width
 * image block, or either half of a pair (decision-log #42).
 *
 * **The frame is the site's hairline ink frame**, squared, on the
 * `white/[0.03]` fill: the About portrait's frame and the work card's
 * screenshot box, not a new surface. The reference's frames are
 * rounded and borderless; this system's are neither. The ratio is the
 * frame's, not the asset's — a fixed `aspect-*` box the real image
 * fills and crops to via `object-cover`, so it swaps in for the
 * placeholder with zero layout shift, the Taxonomy §7 contract the
 * cards already keep. **The image fills the frame exactly** — nothing
 * inside is larger than the frame, so nothing is cropped beyond the
 * ratio itself. (A first cut put the parallax wrapper *inside* the
 * frame, 96px taller than it, and `object-cover` dutifully scaled the
 * asset to that wrapper: a third of a phone-width screenshot lost off
 * the sides. Adversarial review caught it; the drift now lives on the
 * frame's parent, the About portrait's construction.)
 *
 * **The frame does not move itself.** The whisper drift is the
 * block's: `case-study-page.tsx` wraps each band's frame or pair in
 * one shared `<Parallax>` — the About portrait's treatment, one per
 * band — and this component knows nothing about it. That is what
 * keeps the drift a judgment call the owner can remove in one place
 * (build-note 30), and what keeps the cap's ±48px from ever exposing
 * a fill: the whole frame moves, border and all.
 *
 * **No grade, no scrim.** The cards grade their screenshots because
 * four unrelated palettes had to sit inside one rail; these frames
 * hold owner-supplied imagery chosen for this page, and the reference
 * shows its images clean. Nothing rides these images, so §Surfaces'
 * legibility overlay has no job here either.
 *
 * **A frame with no `src` is the layout-final placeholder** —
 * `<Placeholder surface="ink" fill>`, the taxonomy §7 device — so
 * layout and motion are signed off on boxes before a single real asset
 * lands (owner direction, 2026-09-14). In `fill` mode the placeholder
 * paints no fill of its own; the frame's single `white/[0.03]` is the
 * surface, exactly as it is behind a real image. The placeholder
 * carries the real image's `alt`: the content module describes what
 * the image will show, so the accessibility pass is not deferred to
 * the day the file arrives.
 *
 * Server component.
 */
export function CaseStudyImage({
  image,
  ratio,
  sizes,
  index,
}: CaseStudyImageProps) {
  return (
    <div
      className={`relative overflow-hidden border border-white/15 bg-white/[0.03] ${RATIO_CLASS[image.ratio ?? ratio]}`}
    >
      {image.src !== undefined ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <Placeholder
          section="work"
          index={index}
          surface="ink"
          fill
          label={CASE_STUDY_PAGE.imagePending}
          alt={image.alt}
        />
      )}
    </div>
  );
}
