import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { stories, experiences } from "@/data/content";
import { destinations } from "@/data/destinations";
import { safaris } from "@/data/safaris";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = site.url.replace(/\/$/, "");

  const staticPages = [
    "",
    "/about",
    "/safaris",
    "/destinations",
    "/experiences",
    "/gallery",
    "/conservation",
    "/people-and-culture",
    "/counties",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
    priority: route === "" ? 1.0 : 0.9,
  }));

  const safariPages = safaris.map((s) => ({
    url: `${baseUrl}/safaris/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const destinationPages = destinations.map((d) => ({
    url: `${baseUrl}/destinations/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const experiencePages = experiences.map((e) => ({
    url: `${baseUrl}/experiences/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const storyPages = stories.map((s) => ({
    url: `${baseUrl}/stories/${s.slug}`,
    lastModified: new Date(s.publishedAt || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const legalPages = [
    "/legal/privacy-policy",
    "/legal/responsible-tourism-policy",
    "/legal/terms-and-conditions",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  }));

  return [
    ...staticPages,
    ...safariPages,
    ...destinationPages,
    ...experiencePages,
    ...storyPages,
    ...legalPages,
  ];
}
