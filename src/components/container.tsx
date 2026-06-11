import type { ReactNode } from "react";
import type { SectionId } from "@/lib/types";

interface ContainerProps {
  /** Optional so the page frame can render empty anchored slots. */
  children?: ReactNode;
  className?: string;
  /** Renders a <section> when an anchor id is supplied. */
  id?: SectionId;
}

/** Shared max-width wrapper; sections anchor to it via Taxonomy §6 ids. */
export function Container({ children, className, id }: ContainerProps) {
  const cls = ["mx-auto w-full max-w-6xl px-6 md:px-8", className]
    .filter(Boolean)
    .join(" ");

  if (id !== undefined) {
    return (
      <section id={id} className={cls}>
        {children}
      </section>
    );
  }
  return <div className={cls}>{children}</div>;
}
