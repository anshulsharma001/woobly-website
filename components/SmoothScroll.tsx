"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { cancelFrame, frame } from "motion/react";
import { setLenis } from "@/lib/lenis";

/**
 * Global Lenis smooth scroll, driven by Framer Motion's frame loop so
 * scroll-linked motion values and Lenis update in the same frame.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.2, autoRaf: false });
    setLenis(lenis);

    const update = (data: { timestamp: number }) => lenis.raf(data.timestamp);
    frame.update(update, true);

    return () => {
      cancelFrame(update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
