import { site } from "@/data/site";
import {
  communityProfiles,
  conservationThemes,
  visitExperiences,
} from "@/data/content";
import type { Destination, Faq, Safari, Story } from "@/lib/types";
import { countyNames } from "@/data/counties";

const abs = (path: string): string => new URL(path, site.url).toString();

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    slogan: site.tagline,
    url: site.url,
    logo: site.logoUrl,
    areaServed: {
      "@type": "Country",
      name: "Kenya",
    },
    description: site.supporting,
    knowsAbout: [
      "Kenyan cultural heritage",
      "Indigenous communities in Kenya",
      "Maasai, Samburu, Turkana, Mijikenda and Swahili traditions",
      "Forest conservation in Kenya",
      "Arabuko-Sokoke Forest",
      "Community-based tourism and conservation",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    alternateName: "KayArabuko — Explore. Conserve. Empower.",
    url: site.url,
    description: site.supporting,
    about: [
      ...communityProfiles.map((c) => ({
        "@type": "Thing",
        name: c.name,
        description: c.introduction,
      })),
      ...conservationThemes.map((t) => ({
        "@type": "Thing",
        name: t.title,
        description: t.description,
      })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cultural, Community & Conservation Visits",
      itemListElement: visitExperiences.map((v, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "TouristTrip",
          name: v.title,
          description: v.description,
          touristType: v.pillar,
        },
      })),
    },
  };
}

export function breadcrumbSchema(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.href),
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function destinationSchema(d: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.name,
    description: d.summary,
    url: abs(`/#explore`),
    geo: {
      "@type": "GeoCoordinates",
      latitude: d.coords.lat,
      longitude: d.coords.lng,
    },
    containedInPlace: {
      "@type": "Place",
      name: `${countyNames(d.countySlugs)}, Kenya`,
    },
  };
}

export function safariSchema(s: Safari) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: s.title,
    description: s.shortDescription,
    url: abs(`/#experiences`),
    provider: { "@type": "Organization", name: site.name },
  };
}

export function articleSchema(s: Story) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.title,
    description: s.excerpt,
    datePublished: s.publishedAt,
    image: s.image.src ? [s.image.src] : undefined,
    author: { "@type": "Organization", name: s.author },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: abs(`/stories/${s.slug}`),
  };
}
