export type Service = {
  /** Two-digit marker shown on the dial. */
  id: string;
  slug: string;
  /** Rendered as two lines. */
  title: readonly [string, string];
  description: string;
  tags: readonly string[];
  /** Path under /public. A sphere placeholder renders if the file is missing. */
  image: string;
};

export const services: Service[] = [
  {
    id: "01",
    slug: "brand-identity-strategy",
    title: ["Brand Identity", "& Strategy"],
    description:
      "Sharp positioning and a visual identity built to scale, so your brand looks and sounds like itself at every touchpoint.",
    tags: ["Positioning", "Visual Identity", "Design System"],
    image: "/images/services/service-1.png",
  },
  {
    id: "02",
    slug: "digital-marketing-growth",
    title: ["Digital Marketing", "& Growth"],
    description:
      "Performance campaigns that turn attention into revenue, measured, tested and refined at every step of the funnel.",
    tags: ["Conversion Rate Optimization", "Analytics", "A/B Testing"],
    image: "/images/services/service-2.png",
  },
  {
    id: "03",
    slug: "social-media-content-marketing",
    title: ["Social Media &", "Content Marketing"],
    description:
      "Thumb-stopping content and always-on social programs that build community and keep your brand in the conversation.",
    tags: ["Content Strategy", "Creative Production", "Campaign Management"],
    image: "/images/services/service-3.png",
  },
  {
    id: "04",
    slug: "ui-ux-product-design",
    title: ["UI/UX &", "Product Design"],
    description:
      "Research-led interfaces that feel effortless, from the first wireframe to a polished product that grows with your users.",
    tags: ["User Research", "Interface Design", "Product Scaling"],
    image: "/images/services/service-4.png",
  },
  {
    id: "05",
    slug: "website-design-development",
    title: ["Website Design", "& Development"],
    description:
      "Fast, accessible websites engineered for performance and search, on a modern stack your team will enjoy using.",
    tags: ["UI Development", "Performance", "SEO Setup"],
    image: "/images/services/service-5.png",
  },
];
