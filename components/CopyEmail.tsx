"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { hoverSpring, reducedFade } from "@/lib/motion";
import { cn } from "@/lib/utils";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts / older browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

type CopyEmailProps = { email: string; className?: string };

export function CopyEmail({ email, className }: CopyEmailProps) {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();

  const at = email.indexOf("@");
  const local = email.slice(0, at + 1);
  const domain = email.slice(at + 1);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    if (!(await copyText(email))) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={onCopy}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="type-label cursor-pointer rounded-sm outline-offset-4"
      >
        <span className="sr-only">Copy email address: </span>
        <span className="text-ink-2">{local}</span>
        <span className="text-ink">{domain}</span>
      </button>

      <AnimatePresence>
        {(hovered || copied) && (
          <motion.span
            aria-hidden
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            transition={reduced ? reducedFade : hoverSpring}
            className="pointer-events-none absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium leading-4 tracking-[-0.01em] text-white shadow-button"
          >
            {copied ? "Copied!" : "Click to copy"}
          </motion.span>
        )}
      </AnimatePresence>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
