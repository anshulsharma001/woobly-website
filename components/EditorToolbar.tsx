"use client";

import { motion } from "motion/react";
import { Bold, ChevronDown, Italic, Type, Underline, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Divider() {
  return <span className="mx-1 h-4 w-px shrink-0 bg-hairline" />;
}

function ToolIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid size-7 place-items-center rounded-md text-ink-3 transition-colors hover:bg-black/[0.04] hover:text-ink">
      <Icon className="size-4" strokeWidth={2.25} />
    </span>
  );
}

/** Decorative "design tool" toolbar floating under the selected headline. */
export function EditorToolbar({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", duration: 0.75, bounce: 0.2, delay: 0.4 }}
      className={cn(
        "flex select-none items-center rounded-xl bg-white p-1 shadow-float",
        className,
      )}
    >
      <span className="flex h-7 items-center gap-1 rounded-md pl-2 pr-1.5 text-[14px] font-medium leading-5 text-ink transition-colors hover:bg-black/[0.04]">
        Heading 1
        <ChevronDown className="size-3.5 text-ink-3" strokeWidth={2.25} />
      </span>
      <Divider />
      <ToolIcon icon={Bold} />
      <ToolIcon icon={Italic} />
      <ToolIcon icon={Underline} />
      <Divider />
      <span className="flex h-7 items-center gap-0.5 rounded-md px-1.5 text-ink transition-colors hover:bg-black/[0.04]">
        <Type className="size-4" strokeWidth={2.25} />
        <ChevronDown className="size-3.5 text-ink-3" strokeWidth={2.25} />
      </span>
    </motion.div>
  );
}
