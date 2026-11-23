"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import Image, { getImageProps } from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useIsMobile, useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { spring } from "@/lib/motion";

const SIZES = "(max-width: 809px) 150vw, 100vw";

/** Shown when /public/images/hero-art.png is missing: three soft blobs in a U-shaped arc. */
function HeroArtFallback() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-[4%] top-[2%] aspect-square w-[36%] rounded-full bg-[radial-gradient(closest-side,#8B7CF6,transparent)] opacity-30 blur-[60px]" />
      <div className="absolute left-1/2 top-[44%] aspect-square w-[30%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,#4F7CFF,transparent)] opacity-30 blur-[60px]" />
      <div className="absolute right-[4%] top-[4%] aspect-square w-[36%] rounded-full bg-[radial-gradient(closest-side,#F5B97A,transparent)] opacity-30 blur-[60px]" />
    </div>
  );
}

type HeroArtProps = { src: string; hasImage: boolean };

export function HeroArt({ src, hasImage }: HeroArtProps) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  // Both are undefined until after hydration — wait so the right variant runs.
  const ready = reduced !== undefined && isMobile !== undefined;
  // No blur animation on mobile (large image) or for reduced motion.
  const skipBlur = reduced === true || isMobile === true;

  const [failed, setFailed] = useState(false);
  const [settled, setSettled] = useState(false);

  // Mask wipe: one motion value drives the --reveal CSS variable, which moves
  // the gradient stops from (50,50,50,50)% to (0,10,90,100)% — see globals.css.
  const maskRef = useRef<HTMLDivElement>(null);
  const reveal = useMotionValue(0);
  useMotionValueEvent(reveal, "change", (v) => {
    maskRef.current?.style.setProperty("--reveal", String(v));
  });

  useEffect(() => {
    if (!ready) return;
    const controls = animate(reveal, 1, reduced ? { duration: 0 } : { ...spring, delay: 0.2 });
    return () => controls.stop();
  }, [ready, reduced, reveal]);

  // Glass hover: pointer position over the art (0–1), softened with a slow spring
  const frameRef = useRef<HTMLDivElement>(null);
  const glass = useGlassPointer(frameRef, finePointer === true, reduced === true);
  const tilt = reduced ? 0 : 1;
  const rotateY = useTransform(glass.x, [0, 1], [-2.5 * tilt, 2.5 * tilt]);
  const rotateX = useTransform(glass.y, [0, 1], [1.8 * tilt, -1.8 * tilt]);
  const shiftX = useTransform(glass.x, [0, 1], [12 * tilt, -12 * tilt]);
  const shiftY = useTransform(glass.y, [0, 1], [8 * tilt, -8 * tilt]);

  const showImage = hasImage && !failed;

  return (
    <div
      ref={frameRef}
      aria-hidden
      // Mobile: a 4:3 frame under the headline so the whole arc fits.
      // Desktop: full-bleed behind everything.
      className="pointer-events-none absolute -inset-x-[22%] top-[33%] aspect-[4/3] md:inset-0 md:aspect-auto"
    >
      {/* Hover tilt + drift, kept separate from the intro animation */}
      <motion.div
        className="absolute inset-0"
        style={{
          rotateX,
          rotateY,
          x: shiftX,
          y: shiftY,
          transformPerspective: 1400,
          willChange: finePointer ? "transform" : undefined,
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ willChange: settled ? "auto" : "transform, opacity, filter" }}
          initial={{ opacity: 0, scale: 1.2, rotate: 5, filter: "blur(10px)" }}
          animate={ready ? { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" } : undefined}
          transition={{
            ...spring,
            delay: 0.2,
            ...(skipBlur ? { filter: { duration: 0 } } : {}),
          }}
          onAnimationComplete={() => setSettled(true)}
        >
          <div ref={maskRef} className="hero-art-mask absolute inset-0">
            {showImage ? (
              <>
                {/* Soft glow / shadow layer */}
                <div className="absolute inset-0 opacity-40 blur-[10px]">
                  <Image src={src} alt="" fill sizes={SIZES} className="object-cover" />
                </div>
                <Image
                  src={src}
                  alt=""
                  fill
                  priority
                  sizes={SIZES}
                  className="object-cover"
                  onError={() => setFailed(true)}
                />
                {finePointer && <GlassSheen src={src} x={glass.x} y={glass.y} strength={glass.strength} />}
              </>
            ) : (
              <HeroArtFallback />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Glass hover ─────────────────────────────────────────────────────────

/**
 * Tracks the mouse over `ref` (window-level, so it still works under the fixed
 * navbar and while scrolling). Returns springy 0–1 coordinates and a 0–1
 * hover strength that eases in on enter and out on leave.
 */
function useGlassPointer(ref: RefObject<HTMLElement | null>, enabled: boolean, reduced: boolean) {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const rawStrength = useMotionValue(0);
  const follow = reduced ? { stiffness: 400, damping: 40 } : { stiffness: 55, damping: 18, mass: 1 };
  const x = useSpring(rawX, follow);
  const y = useSpring(rawY, follow);
  const strength = useSpring(rawStrength, { stiffness: 70, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    let clientX = -1;
    let clientY = -1;
    let inside = false;

    const update = () => {
      if (clientX < 0) return;
      const r = el.getBoundingClientRect();
      const nx = (clientX - r.left) / r.width;
      const ny = (clientY - r.top) / r.height;
      const nowInside = nx >= 0 && nx <= 1 && ny >= 0 && ny <= 1;
      if (nowInside) {
        rawX.set(nx);
        rawY.set(ny);
      }
      if (nowInside !== inside) {
        inside = nowInside;
        rawStrength.set(nowInside ? 1 : 0);
        if (!nowInside) {
          // Settle back to rest
          rawX.set(0.5);
          rawY.set(0.5);
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      clientX = e.clientX;
      clientY = e.clientY;
      update();
    };
    const onLeaveWindow = () => {
      inside = false;
      rawStrength.set(0);
      rawX.set(0.5);
      rawY.set(0.5);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", update, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", update);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [ref, enabled, rawX, rawY, rawStrength]);

  return { x, y, strength };
}

type GlassSheenProps = {
  src: string;
  x: MotionValue<number>;
  y: MotionValue<number>;
  strength: MotionValue<number>;
};

/**
 * Light playing over the glass discs: a specular highlight and an iridescent
 * glint band that follow the pointer. Masked by the artwork's own alpha, so
 * only the discs catch the light — never the background.
 */
function GlassSheen({ src, x, y, strength }: GlassSheenProps) {
  // Same optimised image the page already uses, as a mask
  const maskUrl = getImageProps({ src, alt: "", width: 1080, height: 810 }).props.src;
  const mask = `url("${maskUrl}")`;

  const highlightX = useTransform(x, (v) => `${(v - 0.5) * 100}%`);
  const highlightY = useTransform(y, (v) => `${(v - 0.5) * 100}%`);
  const bandX = useTransform(x, [0, 1], ["-22%", "22%"]);
  const bandY = useTransform(y, [0, 1], ["-8%", "8%"]);

  const container: CSSProperties = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    mixBlendMode: "screen",
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskSize: "cover",
    maskSize: "cover",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };

  return (
    <motion.div style={{ ...container, opacity: strength }}>
      {/* Specular highlight under the pointer */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          x: highlightX,
          y: highlightY,
          background:
            "radial-gradient(circle 380px at 50% 50%, rgb(255 255 255 / 0.34), rgb(255 255 255 / 0.1) 40%, transparent 72%)",
        }}
      />
      {/* Iridescent glint band sliding across the glass */}
      <motion.div
        style={{
          position: "absolute",
          inset: "-50%",
          x: bandX,
          y: bandY,
          background:
            "linear-gradient(115deg, transparent 42%, rgb(139 124 246 / 0.2) 46%, rgb(255 255 255 / 0.42) 48.6%, rgb(245 185 122 / 0.24) 51.2%, rgb(79 124 255 / 0.16) 53.5%, transparent 57%)",
        }}
      />
    </motion.div>
  );
}
