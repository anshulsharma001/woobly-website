import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Services } from "@/components/services/Services";
import { publicFileExists } from "@/lib/assets";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export default function Home() {
  const items = services.map((service) => ({
    ...service,
    hasImage: publicFileExists(service.image),
  }));

  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <Hero hasArt={publicFileExists(site.heroArt)} />
        <Services items={items} />
      </main>
    </>
  );
}
