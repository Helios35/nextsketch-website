"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { QualificationModal } from "@/components/qualification-modal";

interface QualificationModalContextValue {
  openModal: () => void;
}

const QualificationModalContext =
  createContext<QualificationModalContextValue | null>(null);

/** Open the qualification modal from any CTA under the provider. */
export function useQualificationModal(): QualificationModalContextValue {
  const value = useContext(QualificationModalContext);
  if (value === null) {
    throw new Error(
      "useQualificationModal requires <QualificationModalProvider>",
    );
  }
  return value;
}

/**
 * Mounts the qualification modal once at the layout level
 * (docs/07-technical-spec.md §Project structure) and exposes
 * openModal to every CTA. The modal mounts only while open, so each
 * open starts a fresh flow — E2's "no cooldown, always fresh" by
 * construction — and the no-JS page carries no dialog markup at all
 * (CTAs degrade to mailto, E3).
 */
export function QualificationModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ openModal: () => setOpen(true) }), []);

  return (
    <QualificationModalContext.Provider value={value}>
      {children}
      {open && <QualificationModal onClose={() => setOpen(false)} />}
    </QualificationModalContext.Provider>
  );
}
