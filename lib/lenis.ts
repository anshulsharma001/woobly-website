import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Smooth-scrolls to an in-page anchor like "#services". Returns false if the target doesn't exist. */
export function scrollToHash(hash: string): boolean {
  if (hash.length < 2) return false;
  let target: HTMLElement | null = null;
  try {
    target = document.querySelector<HTMLElement>(hash);
  } catch {
    return false;
  }
  if (!target) return false;

  if (instance) {
    instance.scrollTo(target);
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }
  return true;
}
