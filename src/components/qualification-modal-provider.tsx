"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { QualificationModal } from "@/components/qualification-modal";
import type { ProjectType } from "@/lib/schema";

interface QualificationModalContextValue {
  /**
   * `need` preselects that project type in the quick door's "What do
   * you need?" selector — how the service cards carry their card's
   * service into the form. Omitted, the modal opens with nothing
   * selected, exactly as every other CTA does.
   */
  openModal: (need?: ProjectType) => void;
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
  /** Preselection for the next open; cleared by the unmount on close. */
  const [need, setNeed] = useState<ProjectType | undefined>(undefined);
  const value = useMemo(
    () => ({
      openModal: (need?: ProjectType) => {
        setNeed(need);
        setOpen(true);
      },
    }),
    [],
  );

  return (
    <QualificationModalContext.Provider value={value}>
      {children}
      {open && (
        <QualificationModal
          initialNeed={need}
          onClose={() => setOpen(false)}
        />
      )}
    </QualificationModalContext.Provider>
  );
}
