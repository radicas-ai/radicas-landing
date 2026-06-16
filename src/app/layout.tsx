import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo_Black } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cn } from "@/lib/cn";
import { GA_ID } from "@/lib/analytics";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivo-black" });

const siteUrl = "https://radicas.ai";

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
      <body>{children}</body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
