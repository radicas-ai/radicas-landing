import { Nav } from "@/components/ui/Nav";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/sections/Hero";
import { ControlPlane } from "@/components/sections/ControlPlane";
import { ThreeGuarantees } from "@/components/sections/ThreeGuarantees";
import { WhatTheLayerDoes } from "@/components/sections/WhatTheLayerDoes";
import { Trust } from "@/components/sections/Trust";
import { AskInPlainLanguage } from "@/components/sections/AskInPlainLanguage";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ControlPlane />
        <ThreeGuarantees />
        <WhatTheLayerDoes />
        <Trust />
        <AskInPlainLanguage />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
