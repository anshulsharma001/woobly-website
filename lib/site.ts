/**
 * Site-wide copy & settings. Edit here — components read from this file.
 */
export const site = {
  brand: "woobly",
  /** Placeholder — replace with the studio's real inbox. */
  email: "hello@yourbrand.com",
  /** IANA time zone for the live clock in the hero. */
  timeZone: "Asia/Kolkata",
  cta: {
    label: "Book a call",
    href: "mailto:hello@yourbrand.com?subject=Book%20a%20call",
  },
  heroArt: "/images/hero-art.png",
  tagline: [
    "Designing brands, products, and campaigns",
    "built for a digital-first world.",
  ],
  nav: [
    { label: "Works", href: "#works" },
    { label: "About", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Services", href: "#services" },
    { label: "Blog", href: "#blog" },
    { label: "Pages", href: "#pages" },
  ],
} as const;
