import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wellnessweekendak.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [`${baseUrl}/images/hero.png`],
    },
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
  ];
}
