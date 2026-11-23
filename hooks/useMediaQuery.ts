import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe media query. Returns `undefined` on the server and during
 * hydration, then the real value — so callers can wait before animating.
 */
export function useMediaQuery(query: string): boolean | undefined {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore<boolean | undefined>(
    subscribe,
    () => window.matchMedia(query).matches,
    () => undefined,
  );
}

export const usePrefersReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");

/** Matches the site's mobile breakpoint (< 810px). */
export const useIsMobile = () => useMediaQuery("(max-width: 809.98px)");
