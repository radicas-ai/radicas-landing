// Proposal 2 — redesign per the build brief. Lives at /v2 so it can be compared
// against the current landing (/) without replacing it. Reuses the strong
// existing modules and adds the brief's new sections (trust band, FAQ, expanded
// footer) plus a rebuilt two-column hero with the framed vendor-ledger artifact.
import { NavV2 } from "@/components/v2/NavV2";
import { HeroV2 } from "@/components/v2/HeroV2";
import { FooterV2 } from "@/components/v2/FooterV2";
import { TrustBand } from "@/components/v2/TrustBand";
import { ControlPlane } from "@/components/sections/ControlPlane";
import { WhatTheLayerDoes } from "@/components/sections/WhatTheLayerDoes";
import { AskInPlainLanguage } from "@/components/sections/AskInPlainLanguage";
import { Team } from "@/components/sections/Team";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function ProposalTwo() {
  return (
    <>
      <NavV2 />
      <main>
        <HeroV2 />
        <ControlPlane />
        <WhatTheLayerDoes />
        <TrustBand />
        <AskInPlainLanguage />
        <Team />
        <ContactCTA />
      </main>
      <FooterV2 />
    </>
  );
}
