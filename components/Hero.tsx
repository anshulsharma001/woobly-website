"use client";

import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { site } from "@/lib/site";
import { CopyEmail } from "./CopyEmail";
import { EditorToolbar } from "./EditorToolbar";
import { HeroArt } from "./HeroArt";
import { LiveClock } from "./LiveClock";
import { SplitText } from "./SplitText";

const rise = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { ...spring, delay: 0.8 },
};

export function Hero({ hasArt }: { hasArt: boolean }) {
  return (
    <section
      id="hero"
      aria-label="Intro"
      className="relative h-svh min-h-[640px] md:h-screen md:min-h-[720px]"
    >
      <div className="absolute inset-2 isolate overflow-hidden rounded-[32px] bg-bg md:rounded-[40px]">
        <HeroArt src={site.heroArt} hasImage={hasArt} />

        {/* Headline + toolbar */}
        <div className="relative z-10 flex flex-col items-center px-4 pt-[112px] text-center md:pt-[142px]">
          <h1 className="type-display text-[clamp(34px,11.5vw,44px)] leading-[1.09] text-ink md:text-[72px] md:leading-[76px]">
            <motion.span className="block" {...rise} transition={{ ...spring, delay: 0.05 }}>
              We make
            </motion.span>
            <motion.span
              className="relative inline-block whitespace-nowrap px-2.5"
              {...rise}
              transition={{ ...spring, delay: 0.1 }}
            >
              {/* Selection box: fades in as if the line just got selected */}
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-xl bg-selection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.6, ease: "easeOut" }}
              />
              <span className="relative">Creative Things.</span>
            </motion.span>
          </h1>

          <EditorToolbar className="mt-[11px] origin-top max-md:scale-[0.85] max-[399px]:hidden" />
        </div>

        {/* Bottom bar */}
        <div className="absolute inset-x-6 bottom-6 z-10 flex flex-col items-center gap-4 md:inset-x-16 md:bottom-8 md:grid md:grid-cols-[1fr_auto_1fr] md:items-end">
          <motion.div className="hidden md:block md:justify-self-start" {...fade}>
            <LiveClock timeZone={site.timeZone} />
          </motion.div>

          <SplitText
            lines={site.tagline}
            delay={1}
            stagger={0.012}
            className="text-center text-[16px] leading-6 text-ink-2"
          />

          <motion.div className="md:justify-self-end" {...fade}>
            <CopyEmail email={site.email} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
