"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { hoverSpring, reducedFade } from "@/lib/motion";
import { cn } from "@/lib/utils";

const outgoing: Variants = {
  rest: { y: "0%", opacity: 1, filter: "blur(0px)" },
  hover: { y: "-100%", opacity: 0, filter: "blur(10px)" },
};

const incoming: Variants = {
  rest: { y: "100%", opacity: 0, filter: "blur(10px)" },
  hover: { y: "0%", opacity: 1, filter: "blur(0px)" },
};

type RollButtonProps = {
  href: string;
  children: string;
  className?: string;
};

/** Black pill whose label rolls up with a blur on hover. */
export function RollButton({ href, children, className }: RollButtonProps) {
  const reduced = useReducedMotion();
  const transition = reduced ? reducedFade : hoverSpring;

  return (
    <motion.a
      href={href}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className={cn(
        "relative inline-flex h-10 shrink-0 items-center rounded-full bg-ink px-5 text-[14px] font-medium leading-5 whitespace-nowrap text-white shadow-button",
        "outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        className,
      )}
    >
      <span className="relative block overflow-hidden">
        <motion.span className="block" variants={outgoing} transition={transition}>
          {children}
        </motion.span>
        <motion.span
          aria-hidden
          className="absolute inset-0 block"
          variants={incoming}
          transition={transition}
        >
          {children}
        </motion.span>
      </span>
    </motion.a>
  );
}
