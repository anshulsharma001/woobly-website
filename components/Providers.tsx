"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { SmoothScroll } from "./SmoothScroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // "user" honours prefers-reduced-motion: transforms snap, fades remain.
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      {children}
    </MotionConfig>
  );
}
