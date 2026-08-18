import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Bump when the landing copy actually changes — not on every deploy. */
const lastContentChange = "2026-08-18";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: lastContentChange,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
