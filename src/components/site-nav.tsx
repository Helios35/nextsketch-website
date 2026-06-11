"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { NAV, SITE } from "@/content/copy";

/** Scroll depth (px) past which the nav turns solid and shrinks. */
const SHRINK_SCROLL_Y = 80;

function BurgerIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M2 5h16M2 10h16M2 15h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 4l12 12M16 4L4 16" />
    </svg>
  );
}

/**
 * Sticky top nav per docs/03-site-architecture.md §Navigation and
 * docs/04-ux-spec.md §Component specs: transparent over the hero,
 * solid paper with a hairline border and reduced height after 80px
 * of scroll. The shrink is plain CSS transitions gated by
 * motion-safe (no <Reveal>/<SketchAccent> needed). Mobile: hamburger
 * opens a full-screen overlay with the anchors and the CTA.
 *
 * The CTA anchors to #start until the qualification modal lands
 * (unit 06 swaps the action — sprint plan, locked interim behavior).
 * Server render is the static branch (not scrolled, menu closed), so
 * the no-JS page keeps working anchor links (Business Rules E3).
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SHRINK_SCROLL_Y);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const toggle = toggleRef.current;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      toggle?.focus();
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={[
        "sticky top-0 z-40 border-b",
        "motion-safe:transition-colors motion-safe:duration-300",
        scrolled
          ? "border-ink/10 bg-paper"
          : "border-transparent bg-transparent",
      ].join(" ")}
    >
      <Container>
        <nav
          aria-label={NAV.label}
          className={[
            "flex items-center justify-between gap-6",
            "motion-safe:transition-[padding] motion-safe:duration-300",
            scrolled ? "py-3" : "py-5",
          ].join(" ")}
        >
          <a href="#top" className="text-lg font-bold tracking-tight">
            {SITE.name}
          </a>
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.items.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="text-sm font-medium underline-offset-4 hover:underline"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Button href="#start">{NAV.cta}</Button>
          </div>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-label={NAV.menu.open}
            onClick={() => setOpen(true)}
            className="inline-flex min-h-11 min-w-11 items-center justify-center md:hidden"
          >
            <BurgerIcon />
          </button>
        </nav>
      </Container>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper px-6 md:hidden">
          <div className="flex items-center justify-between py-5">
            <a
              href="#top"
              onClick={closeMenu}
              className="text-lg font-bold tracking-tight"
            >
              {SITE.name}
            </a>
            <button
              ref={closeRef}
              type="button"
              aria-label={NAV.menu.close}
              onClick={closeMenu}
              className="inline-flex min-h-11 min-w-11 items-center justify-center"
            >
              <CloseIcon />
            </button>
          </div>
          <ul className="flex grow flex-col justify-center gap-2">
            {NAV.items.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={closeMenu}
                  className="block py-3 text-3xl font-semibold tracking-tight"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pb-10">
            <Button href="#start" onClick={closeMenu} className="w-full">
              {NAV.cta}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
