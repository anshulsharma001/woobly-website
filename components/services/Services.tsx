"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll } from "motion/react";
import { ServiceBlock } from "./ServiceBlock";
import { ServiceDial } from "./ServiceDial";
import { ServiceIllustrations } from "./ServiceIllustrations";
import type { ServiceItem } from "./types";

export function Services({ items }: { items: ServiceItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Active block = the one crossing the viewport's horizontal midline.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const blocks = section.querySelectorAll<HTMLElement>("[data-service-index]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.serviceIndex);
          if (!Number.isNaN(index)) setActive(index);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, [items.length]);

  const ids = items.map((item) => item.id);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Services"
      // clip (not hidden) so position: sticky keeps working; stops the dial's
      // circle and the bleeding illustrations from spilling outside the section
      className="relative overflow-clip"
    >
      {/* Mobile: horizontal dial pinned under the navbar (takes no layout space) */}
      <div className="pointer-events-none sticky top-[72px] z-20 -mb-[148px] h-[148px] overflow-hidden bg-linear-to-b from-bg from-80% to-bg/0 md:hidden">
        <ServiceDial ids={ids} active={active} progress={scrollYProgress} orientation="horizontal" />
      </div>

      <div className="mx-2 px-4 lg:px-8">
        <div className="mx-auto grid max-w-[1296px] md:grid-cols-[140px_80px_minmax(0,1fr)_40px_160px] xl:grid-cols-[206px_minmax(24px,230fr)_minmax(0,540px)_minmax(24px,114fr)_206px]">
          {/* Left: sticky rotating dial */}
          <div className="hidden md:col-start-1 md:row-start-1 md:block">
            <div className="sticky top-0 h-screen">
              <ServiceDial ids={ids} active={active} progress={scrollYProgress} orientation="vertical" />
            </div>
          </div>

          {/* Centre: one 100vh block per service */}
          <div className="md:col-start-3 md:row-start-1">
            {items.map((service, i) => (
              <ServiceBlock key={service.id} service={service} index={i} active={i === active} />
            ))}
          </div>

          {/* Right: sticky illustrations */}
          <div aria-hidden className="pointer-events-none hidden md:col-start-5 md:row-start-1 md:block">
            <ServiceIllustrations items={items} active={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
