"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * False on the server and during hydration, true immediately after.
 * Lets motion components render their static branch for SSR/no-JS
 * and swap to the animated branch only client-side.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
