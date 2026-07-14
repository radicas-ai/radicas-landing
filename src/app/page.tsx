// The v2 proposal, promoted to the root landing. The original v1 sections
// (Hero, ControlPlane, ThreeGuarantees, Trust) remain in the tree, unimported.
import { NavV2 } from "@/components/v2/NavV2";
import { HeroV2 } from "@/components/v2/HeroV2";
import { FooterV2 } from "@/components/v2/FooterV2";
import { Enables } from "@/components/v2/Enables";
import { TrustBand } from "@/components/v2/TrustBand";
import { WhatsNext } from "@/components/v2/WhatsNext";
import { TeamV2 } from "@/components/v2/TeamV2";
import { WhatTheLayerDoes } from "@/components/sections/WhatTheLayerDoes";
import { AskInPlainLanguage } from "@/components/sections/AskInPlainLanguage";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <NavV2 />
      <main>
        <HeroV2 />
        <Enables />
        <WhatTheLayerDoes eyebrow="the platform" heading="One platform to understand your AI spend." />
        <AskInPlainLanguage
          eyebrow="ask radicas"
          heading="Why did costs spike? Just ask."
          body={
            <>
              Ask questions about your AI spend in natural language. Radicas returns the answer, the
              supporting data, and the visualization — so you can investigate costs, understand
              trends, and uncover what&apos;s driving spend in seconds.
            </>
          }
        />
        <TrustBand />
        <WhatsNext />
        <TeamV2 />
        <ContactCTA
          heading="Don't let AI become your fastest-growing unmanaged expense."
          body={
            <>
              Understand every vendor, every agent, and every euro — and start managing AI like the
              investment it is, before costs compound.
            </>
          }
        />
      </main>
      <FooterV2 />
    </>
  );
}
