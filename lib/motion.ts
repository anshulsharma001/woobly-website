import type { Transition } from "motion/react";

/** Signature spring — used everywhere unless stated otherwise. */
export const spring = {
  type: "spring",
  duration: 1.5,
  bounce: 0,
} as const satisfies Transition;

/** Short spring for hover micro-interactions (text roll, nav dot, tooltip). */
export const hoverSpring = {
  type: "spring",
  duration: 0.4,
  bounce: 0,
} as const satisfies Transition;

/** Reduced-motion fallback: keep a quick fade, never animate blur. */
export const reducedFade = {
  duration: 0.2,
  ease: "easeOut",
  filter: { duration: 0 },
} as const satisfies Transition;
