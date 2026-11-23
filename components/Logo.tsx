import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** 8-petal flower / asterisk mark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="12"
          cy="6.2"
          rx="2.4"
          ry="5.2"
          transform={`rotate(${i * 45} 12 12)`}
        />
      ))}
    </svg>
  );
}

type LogoProps = ComponentProps<"a"> & { name: string };

export function Logo({ name, className, ...props }: LogoProps) {
  return (
    <a className={cn("group inline-flex items-center gap-2 text-ink", className)} {...props}>
      <LogoMark className="size-6 shrink-0 text-accent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45" />
      <span className="type-display text-[26px] leading-none lowercase">{name}</span>
    </a>
  );
}
