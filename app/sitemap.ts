import type { MetadataRoute } from "next";
import { practitioners } from "@/lib/practitioners";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.wellnessweekendak.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${baseUrl}/images/hero.png`],
    },
    {
      url: `${baseUrl}/join`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/vendors`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/affiliates/apply`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...practitioners.map((p) => ({
      url: `${baseUrl}/practitioners/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/guidelines`,
      lastModified: new Date("2026-05-03"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
