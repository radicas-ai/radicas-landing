import { siteUrl } from "@/lib/site";

/** Founder LinkedIn profiles — keep in sync with TEAM in components/v2/TeamV2.tsx. */
const founderProfiles = [
  "https://www.linkedin.com/in/marihum-pernia/",
  "https://www.linkedin.com/in/francesco-fio/",
  "https://www.linkedin.com/in/meike-bingemann/",
];

// "Radicas" collides with a common Spanish/Portuguese verb form and several
// near-homonym AI companies, so we state the entity explicitly rather than
// leaving Google to disambiguate it. Add the LinkedIn company page URL to
// sameAs as soon as it exists — it is the strongest signal available here.
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Radicas",
  url: siteUrl,
  // Google prefers a raster logo; swap this for a square PNG when one exists.
  logo: `${siteUrl}/brand/logo_white.svg`,
  description:
    "Radicas is the financial layer for AI: discover every AI vendor, model and agent, normalize their cost, and attribute it to the teams and products that drive it.",
  foundingDate: "2026",
  sameAs: founderProfiles,
  founder: [
    { "@type": "Person", name: "Marihum Pernia", jobTitle: "Co-Founder & CEO", sameAs: founderProfiles[0] },
    { "@type": "Person", name: "Francesco Fiore", jobTitle: "Co-Founder & CTO", sameAs: founderProfiles[1] },
    { "@type": "Person", name: "Meike Bingemann", jobTitle: "Co-Founder & COO", sameAs: founderProfiles[2] },
  ],
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Radicas",
  url: siteUrl,
  publisher: { "@id": `${siteUrl}/#organization` },
} as const;
