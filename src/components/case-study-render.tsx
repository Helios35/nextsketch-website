import Image from "next/image";
import type { CaseStudyRender } from "@/lib/types";

interface RenderProps {
  render: CaseStudyRender;
  /**
   * The `sizes` hint for the **visible box**, not the file: the
   * component scales it up by the window's share of the canvas, so the
   * browser fetches for the pixels it will actually paint.
   */
  sizes: string;
  /** Preload: the page's largest above-the-fold render and nothing else. */
  priority?: boolean;
  className?: string;
}

/**
 * A cut-out render laid out by its visible bounding box (decision-log
 * #43). The owner's renders are transparent PNGs with wide empty
 * margins, sometimes half the canvas; this box is exactly the opaque
 * region (`render.window`, measured from the file), so the product sits
 * where the layout says and at the size the layout gives it, with no
 * dead space around it and no pixel of it cut off.
 *
 * How: the box carries the window's aspect ratio and clips; the image
 * inside is positioned at the canvas's own proportions, offset so the
 * window lands on the box. Every value is a percentage of the box, so
 * the geometry holds at any width. The image is never stretched (the
 * canvas keeps its ratio, only its transparent margins fall outside
 * the box) and never cropped (the window is the opaque bounding box,
 * verified from the alpha channel and recorded in build-note 30).
 *
 * The image optimizer never enlarges a file: a srcset candidate wider
 * than the canvas is served at the canvas's own width, so a render is
 * as sharp as the file the owner supplied and no sharper (the srcset
 * itself lists every candidate width, as it does for any `sizes`
 * image). The `sizes` hint is multiplied by the canvas-to-window
 * ratio here, because the painted image is that much wider than the
 * box the caller describes. A render without a `window` is the whole
 * canvas at the canvas's ratio.
 *
 * Server component; no wrapper, no frame, no fade (the render is the
 * product itself on the page, the way the owner's example places it).
 */
export function CaseStudyRenderImage({
  render,
  sizes,
  priority = false,
  className,
}: RenderProps) {
  const { src, alt, width, height } = render;
  const box = render.window ?? {
    x0: 0,
    y0: 0,
    x1: width - 1,
    y1: height - 1,
  };
  const boxWidth = box.x1 - box.x0 + 1;
  const boxHeight = box.y1 - box.y0 + 1;
  const scaleX = width / boxWidth;
  const scaleY = height / boxHeight;

  return (
    <div
      className={["relative overflow-hidden", className]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: `${boxWidth} / ${boxHeight}` }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={scaleSizes(sizes, scaleX)}
        priority={priority}
        className="absolute max-w-none"
        style={{
          width: `${(scaleX * 100).toFixed(3)}%`,
          height: `${(scaleY * 100).toFixed(3)}%`,
          left: `${((-box.x0 / boxWidth) * 100).toFixed(3)}%`,
          top: `${((-box.y0 / boxHeight) * 100).toFixed(3)}%`,
        }}
      />
    </div>
  );
}

/**
 * Scales every length in a `sizes` hint by the canvas-to-window ratio.
 * A hint is a comma-separated list of `[media] length` entries; each
 * length becomes `calc(length * ratio)` (a nested `calc()` is valid
 * inside `sizes`), which lets the caller describe the box while the
 * browser fetches for the painted image. Whole-canvas renders pass
 * through untouched.
 *
 * The media condition is the entry's leading parenthesised group, found
 * by matching its parentheses, never by the last space: a length like
 * `calc(100vw - 6rem)` has spaces of its own, and a first cut that
 * split on the last one turned it into `100vw - calc(6rem) * ratio`,
 * a hint smaller than the box on every phone (review, 2026-09-18).
 * A condition joined with `and` is not something this page writes and
 * is not handled.
 */
export function scaleSizes(sizes: string, ratio: number): string {
  if (ratio === 1) return sizes;
  const factor = ratio.toFixed(3);
  return sizes
    .split(",")
    .map((entry) => {
      const trimmed = entry.trim();
      let media = "";
      let length = trimmed;
      if (trimmed.startsWith("(")) {
        let depth = 0;
        let end = 0;
        for (; end < trimmed.length; end++) {
          const char = trimmed[end];
          if (char === "(") depth += 1;
          if (char === ")") {
            depth -= 1;
            if (depth === 0) {
              end += 1;
              break;
            }
          }
        }
        media = `${trimmed.slice(0, end)} `;
        length = trimmed.slice(end).trim();
      }
      return `${media}calc(${length} * ${factor})`;
    })
    .join(", ");
}
