import { Backed } from "@/components/landing/Backed";
import { Contact } from "@/components/landing/Contact";
import { Framework } from "@/components/landing/Framework";
import { Functions } from "@/components/landing/Functions";
import { Hero } from "@/components/landing/Hero";
import { Integrations } from "@/components/landing/Integrations";
import { Nav } from "@/components/landing/Nav";
import { Platform } from "@/components/landing/Platform";
import { Process } from "@/components/landing/Process";
import { RadicasAi } from "@/components/landing/RadicasAi";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Backed />
        <Process />
        <Functions />
        <Platform />
        <RadicasAi />
        <Framework />
        <Integrations />
        <Contact />
      </main>
    </>
  );
}
