import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { ControlPlane } from "@/components/sections/ControlPlane";
import { WhatTheLayerDoes } from "@/components/sections/WhatTheLayerDoes";
import { AskInPlainLanguage } from "@/components/sections/AskInPlainLanguage";
import { Team } from "@/components/sections/Team";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ControlPlane />
        <WhatTheLayerDoes />
        <AskInPlainLanguage />
        <Team />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
