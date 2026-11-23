"use client";

import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

/** Degrees between markers. */
const STEP = 30;

const CONFIG = {
  // Desktop: centre off-screen left, active marker at 3 o'clock, wheel turns counter-clockwise.
  vertical: { diameter: 1120, anchor: 0, dir: 1, labelOffset: 48, labelRotate: 0 },
  // Mobile: centre above, active marker at 6 o'clock, wheel turns clockwise so
  // upcoming markers arrive from the right.
  horizontal: { diameter: 720, anchor: 90, dir: -1, labelOffset: 36, labelRotate: -90 },
} as const;

/** Distance from the top of the mobile band to the bottom of the circle. */
const HORIZONTAL_LINE_Y = 56;

type ServiceDialProps = {
  ids: readonly string[];
  active: number;
  /** Section scroll progress, 0 → 1. */
  progress: MotionValue<number>;
  orientation: keyof typeof CONFIG;
  className?: string;
};

export function ServiceDial({ ids, active, progress, orientation, className }: ServiceDialProps) {
  const c = CONFIG[orientation];
  const r = c.diameter / 2;

  // e.g. desktop: [0, 1] → [0°, -120°], smoothed with a spring
  const target = useTransform(progress, [0, 1], [0, -c.dir * STEP * (ids.length - 1)]);
  const rotate = useSpring(target, { stiffness: 120, damping: 30 });

  const position =
    orientation === "vertical"
      ? { right: 0, top: "50%", marginTop: -r }
      : { left: "50%", marginLeft: -r, top: HORIZONTAL_LINE_Y - c.diameter };

  return (
    <div aria-hidden className={cn("absolute inset-0", className)}>
      <motion.div
        className="absolute rounded-full border border-hairline"
        style={{ width: c.diameter, height: c.diameter, ...position, rotate, willChange: "transform" }}
      >
        {ids.map((id, i) => {
          const isActive = i === active;
          return (
            // Pivot at the circle's centre, rotated to the marker's angle
            <div
              key={id}
              className="absolute left-1/2 top-1/2 size-0"
              style={{ transform: `rotate(${c.anchor + c.dir * STEP * i}deg)` }}
            >
              {/* Point on the circle's line */}
              <div className="absolute top-0 size-0" style={{ left: r - 0.5 }}>
                <motion.span
                  className="absolute left-0 top-0 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent/20 bg-bg"
                  initial={false}
                  animate={{ scale: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
                  transition={{ type: "spring", duration: 0.6, bounce: 0.3 }}
                >
                  <span className="size-[11px] rounded-full bg-accent" />
                </motion.span>
                <span
                  className={cn(
                    "type-display absolute top-0 whitespace-nowrap text-[32px] leading-none transition-colors duration-500",
                    isActive ? "text-ink" : "text-ink-3",
                  )}
                  style={{
                    left: c.labelOffset,
                    transform: `translate(-50%, -50%) rotate(${c.labelRotate}deg)`,
                  }}
                >
                  {id}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
