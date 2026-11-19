import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { stories } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...stories.map((s) => ({
      url: `${site.url}/stories/${s.slug}`,
      lastModified: new Date(s.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${site.url}/legal/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${site.url}/legal/responsible-tourism-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    },
  ];

  return routes;
}
