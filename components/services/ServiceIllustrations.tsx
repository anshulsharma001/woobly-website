"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { ServiceArt } from "./ServiceArt";
import type { ServiceItem } from "./types";

const variants: Variants = {
  active: { y: 0, scale: 1, opacity: 1 },
  upcoming: { y: 64, scale: 0.8, opacity: 0 },
  past: { y: -64, scale: 0.8, opacity: 0 },
};

type ServiceIllustrationsProps = {
  items: ServiceItem[];
  active: number;
};

/**
 * Sticky stack of service sculptures, centred on the column's right edge so
 * roughly half of each object bleeds off-screen.
 */
export function ServiceIllustrations({ items, active }: ServiceIllustrationsProps) {
  return (
    <div className="sticky top-0 h-screen">
      {items.map((service, i) => {
        const state = i === active ? "active" : i > active ? "upcoming" : "past";
        return (
          <motion.div
            key={service.id}
            className="absolute left-full top-1/2 size-[clamp(360px,41.67vw,600px)] -translate-x-1/2 -translate-y-1/2"
            style={{ willChange: "transform, opacity" }}
            variants={variants}
            initial={false}
            animate={state}
            transition={{ type: "spring", duration: 0.6, bounce: 0 }}
          >
            {/* Slow idle float on the active piece */}
            <div className={cn("size-full", i === active && "motion-safe:animate-float")}>
              <ServiceArt
                src={service.image}
                hasImage={service.hasImage}
                sizes="(min-width: 1440px) 600px, 42vw"
                className="size-full"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
