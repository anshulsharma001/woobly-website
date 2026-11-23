"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { spring } from "@/lib/motion";

type SplitTextProps = {
  lines: readonly string[];
  /** Seconds before the first character starts. */
  delay?: number;
  /** Seconds between characters. */
  stagger?: number;
  className?: string;
};

/** lines → words → characters, each character tagged with a global index for staggering. */
function tokenize(lines: readonly string[]) {
  let index = 0;
  return lines.map((line) =>
    line.split(" ").map((word) => Array.from(word).map((char) => ({ char, index: index++ }))),
  );
}

/**
 * Per-character rise-in. Characters are inline-block inside nowrap word
 * wrappers, so words still wrap naturally.
 */
export function SplitText({ lines, delay = 0, stagger = 0.012, className }: SplitTextProps) {
  const tokens = tokenize(lines);

  return (
    <p className={className}>
      <span className="sr-only">{lines.join(" ")}</span>
      {tokens.map((words, li) => (
        <span key={li} aria-hidden className="block">
          {words.map((chars, wi) => (
            <Fragment key={wi}>
              {wi > 0 && " "}
              <span className="inline-block whitespace-nowrap">
                {chars.map(({ char, index }) => (
                  <motion.span
                    key={index}
                    className="inline-block"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: delay + index * stagger }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </Fragment>
          ))}
        </span>
      ))}
    </p>
  );
}
