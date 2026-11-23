"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { scrollToHash } from "@/lib/lenis";
import { hoverSpring, reducedFade, spring } from "@/lib/motion";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { RollButton } from "./RollButton";

function onAnchorClick(e: MouseEvent<HTMLAnchorElement>, href: string, after?: () => void) {
  if (href.startsWith("#") && scrollToHash(href)) e.preventDefault();
  after?.();
}

export function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const hero = document.getElementById("hero");
    const navHeight = headerRef.current?.offsetHeight ?? 96;
    const threshold = (hero?.offsetHeight ?? window.innerHeight) - navHeight;
    setPastHero(y > threshold);
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...spring, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/* Frosted backdrop, fades in once the hero is scrolled past */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: pastHero || open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="absolute inset-0 bg-[rgba(249,248,246,0.8)] backdrop-blur-[10px]"
      />

      <div className="relative flex h-[72px] items-center justify-between px-6 lg:grid lg:h-24 lg:grid-cols-[1fr_auto_1fr] lg:px-[72px]">
        <Logo
          name={site.brand}
          href="#hero"
          aria-label={`${site.brand}, back to top`}
          onClick={(e) => onAnchorClick(e, "#hero")}
          className="justify-self-start"
        />

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center">
            {site.nav.map((link) => (
              <li key={link.label}>
                <NavLink label={link.label} href={link.href} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <RollButton href={site.cta.href}>{site.cta.label}</RollButton>
          <MenuButton open={open} onToggle={() => setOpen((v) => !v)} className="lg:hidden" />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
            transition={reduced ? reducedFade : { type: "spring", duration: 0.5, bounce: 0 }}
            className="absolute inset-x-4 top-full rounded-[28px] bg-white p-2 shadow-float lg:hidden"
          >
            <ul>
              {site.nav.map((link, i) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => onAnchorClick(e, link.href, () => setOpen(false))}
                    className="type-display flex items-center justify-between rounded-[20px] px-4 py-3 text-[32px] leading-9 text-ink transition-colors hover:bg-black/[0.03]"
                  >
                    {link.label}
                    <span className="type-label text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

const dotVariants = {
  rest: { opacity: 0, filter: "blur(4px)" },
  hover: { opacity: 1, filter: "blur(0px)" },
};

function NavLink({ label, href }: { label: string; href: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.a
      href={href}
      onClick={(e) => onAnchorClick(e, href)}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      className="relative flex h-10 items-center px-5 text-[14px] leading-5 text-ink outline-none"
    >
      {label}
      <motion.span
        aria-hidden
        variants={dotVariants}
        transition={reduced ? reducedFade : hoverSpring}
        className="absolute left-1/2 top-[42px] size-1 -translate-x-1/2 rounded-full bg-ink"
      />
    </motion.a>
  );
}

function MenuButton({
  open,
  onToggle,
  className,
}: {
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-float",
        className,
      )}
    >
      <motion.span
        aria-hidden
        className="absolute h-[1.5px] w-4 rounded-full bg-ink"
        initial={false}
        animate={open ? { y: 0, rotate: 45 } : { y: -3, rotate: 0 }}
        transition={hoverSpring}
      />
      <motion.span
        aria-hidden
        className="absolute h-[1.5px] w-4 rounded-full bg-ink"
        initial={false}
        animate={open ? { y: 0, rotate: -45 } : { y: 3, rotate: 0 }}
        transition={hoverSpring}
      />
    </button>
  );
}
