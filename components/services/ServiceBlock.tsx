import Link from "next/link";
import { ServiceArt } from "./ServiceArt";
import type { ServiceItem } from "./types";

type ServiceBlockProps = {
  service: ServiceItem;
  index: number;
  active: boolean;
};

export function ServiceBlock({ service, index, active }: ServiceBlockProps) {
  return (
    <Link
      href={`/services/${service.slug}`}
      data-service-index={index}
      className="flex min-h-svh flex-col items-center justify-center pb-16 pt-[236px] text-center md:h-screen md:min-h-0 md:items-start md:py-0 md:text-left"
    >
      <div
        className="service-block-content flex flex-col items-center transition-[opacity,filter] duration-500 ease-out md:items-start"
        style={{ opacity: active ? 1 : 0.5, filter: active ? "blur(0px)" : "blur(4px)" }}
      >
        <h2 className="type-display text-[40px] leading-[44px] text-ink md:text-[clamp(40px,4.45vw,64px)] md:leading-[1.0625]">
          <span className="block">{service.title[0]}</span>
          <span className="block">{service.title[1]}</span>
        </h2>
        <p className="mt-4 max-w-[440px] text-[16px] leading-6 text-ink-2">{service.description}</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-white px-3 py-1.5 text-[14px] leading-5 text-ink shadow-float"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: illustration sits under the text (opacity only — no blur on images) */}
      <div
        aria-hidden
        className="mt-10 aspect-square w-[320px] max-w-full transition-opacity duration-500 ease-out md:hidden"
        style={{ opacity: active ? 1 : 0.5 }}
      >
        <ServiceArt src={service.image} hasImage={service.hasImage} sizes="320px" className="size-full" />
      </div>
    </Link>
  );
}
