import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Archivo_Black } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cn } from "@/lib/cn";
import { GA_ID } from "@/lib/analytics";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo-black" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Radicas — the layer underneath",
  description:
    "The runtime control plane for enterprise AI. See every vendor, model, and agent — what it costs, and whether it's in policy. Ask in plain language, wherever you already work.",
  keywords: ["FinOps for AI", "AI cost management", "AI governance", "agent observability", "MCP"],
  openGraph: {
    title: "Radicas — the layer underneath",
    description:
      "The runtime control plane for enterprise AI. See what's running, know what it costs, prove it's in policy.",
    url: siteUrl,
    siteName: "Radicas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Radicas — the layer underneath",
    description: "The runtime control plane for enterprise AI.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("dark", geist.variable, geistMono.variable, archivoBlack.variable)}
    >
      <body>
        {/* Iubenda Cookie Solution (consent banner + Google Consent Mode v2).
            Must load before GA so the "denied" consent default is set first. */}
        <Script
          src="https://embeds.iubenda.com/widgets/35cba34f-d14a-410d-855a-f3733b839c35.js"
          strategy="beforeInteractive"
        />
        {children}
      </body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
