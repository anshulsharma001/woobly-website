import type { Metadata, Viewport } from "next";
import { Fraunces, Geist_Mono, Inter } from "next/font/google";
import { GrainOverlay } from "@/components/GrainOverlay";
import { Providers } from "@/components/Providers";
import { site } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.brand} — Creative studio`,
  description:
    "Designing brands, products, and campaigns built for a digital-first world.",
};

export const viewport: Viewport = {
  themeColor: "#F9F8F6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="relative min-h-screen bg-bg font-sans text-ink">
        <GrainOverlay />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
