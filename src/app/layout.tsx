import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { cn } from "@/lib/cn";
import { GA_ID } from "@/lib/analytics";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site";
import { organizationSchema, websiteSchema } from "@/lib/structured-data";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "Radicas · %s",
  },
  description: siteDescription,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    siteName: "Radicas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(geist.variable, geistMono.variable)}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationSchema, websiteSchema]) }}
        />
        {/* Iubenda Cookie Solution (consent banner + Google Consent Mode v2).
            Must load before GA so the "denied" consent default is set first. */}
        <Script
          src="https://embeds.iubenda.com/widgets/35cba34f-d14a-410d-855a-f3733b839c35.js"
          strategy="beforeInteractive"
          suppressHydrationWarning
        />
        {children}
      </body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
