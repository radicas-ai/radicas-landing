import { Backed } from "@/components/landing/Backed";
import { Contact } from "@/components/landing/Contact";
import { Framework } from "@/components/landing/Framework";
import { FunctionProvider } from "@/components/landing/FunctionContext";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Nav } from "@/components/landing/Nav";
import { Platform } from "@/components/landing/Platform";
import { Process } from "@/components/landing/Process";
import { RadicasAi } from "@/components/landing/RadicasAi";

export default function Home() {
  return (
    <FunctionProvider>
      <Nav />
      <main>
        <Hero />
        <Backed />
        <Process />
        <RadicasAi />
        <Platform />
        <Framework />
        <HowItWorks />
        <Contact />
      </main>
    </FunctionProvider>
  );
}
