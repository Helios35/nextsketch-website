import type { ReactNode } from "react";
import type { SectionId } from "@/lib/types";

interface ContainerProps {
  /** Optional so the page frame can render empty anchored slots. */
  children?: ReactNode;
  className?: string;
  /** Renders a <section> when an anchor id is supplied. */
  id?: SectionId;
  /**
   * Full-bleed band classes (unit 08): when set, the <section> spans
   * the viewport and carries these classes (background, texture,
   * text color) while children stay in the shared max-width column.
   * Revisits the contained-panel call of build-notes 04 deviation 3
   * with no margin hacks — the band is the section element itself,
   * so anchors and scroll margins are untouched.
   */
  band?: string;
}

const INNER = "mx-auto w-full max-w-6xl px-6 md:px-8";

/** Shared max-width wrapper; sections anchor to it via Taxonomy §6 ids. */
export function Container({ children, className, id, band }: ContainerProps) {
  const cls = [INNER, className].filter(Boolean).join(" ");

  if (id !== undefined) {
    if (band !== undefined) {
      return (
        <section id={id} className={band}>
          <div className={cls}>{children}</div>
        </section>
      );
    }
    return (
      <section id={id} className={cls}>
        {children}
      </section>
    );
  }
  return <div className={cls}>{children}</div>;
}
