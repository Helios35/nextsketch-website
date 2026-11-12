"use client";

import { useSyncExternalStore } from "react";

/**
 * "Once per visitor" for the free guide card (decision-log #76). One
 * key in this browser's `localStorage` says the card is done for this
 * visitor, and why:
 *
 *   • `closed`     — they closed it (the ×, or Esc);
 *   • `downloaded` — they got the guide;
 *   • `form`       — they sent the form (the modal's step 1 saved a
 *                    lead), so they already left a way to reach them.
 *
 * Any of the three keeps the card from showing again, on every page and
 * every later visit, until the visitor clears their site data. It is a
 * dismissal flag, not tracking: nothing about the visitor is stored, it
 * never leaves the browser, and no cookie is set (the site still needs
 * no cookie banner, docs/07-technical-spec.md).
 *
 * Where storage is unavailable (a blocked or private context throws), a
 * module variable stands in, so the card still stays closed for the
 * rest of that page's life.
 */
const KEY = "nextsketch:guide-offer";
const EVENT = "nextsketch:guide-offer";

export type GuideOfferMark = "closed" | "downloaded" | "form";

/** Before hydration there is no storage to read: treated as "not yet". */
export const GUIDE_OFFER_PENDING = "pending";

let memory: string | null = null;

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY) ?? memory;
  } catch {
    return memory;
  }
}

function subscribe(onChange: () => void): () => void {
  // `storage` carries a mark made in another tab; the custom event one
  // made in this one.
  window.addEventListener("storage", onChange);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(EVENT, onChange);
  };
}

/** Record that the card is done for this visitor (see the marks above). */
export function markGuideOffer(mark: GuideOfferMark): void {
  memory = mark;
  try {
    window.localStorage.setItem(KEY, mark);
  } catch {
    // Storage refused: the module variable above still holds the mark.
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * The mark this browser holds: `null` while the card may still show,
 * `GUIDE_OFFER_PENDING` on the server and during hydration (so the card
 * never renders server-side), else the mark.
 */
export function useGuideOfferMark(): string | null {
  return useSyncExternalStore(subscribe, read, () => GUIDE_OFFER_PENDING);
}
