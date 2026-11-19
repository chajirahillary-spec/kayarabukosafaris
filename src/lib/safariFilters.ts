import { safaris } from "@/data/safaris";
import { destinations } from "@/data/destinations";
import type { Safari, SafariStyle } from "@/lib/types";

export interface SafariFilters {
  q?: string;
  destination?: string;
  county?: string;
  style?: string;
  tier?: string;
  transport?: string;
  difficulty?: string;
  duration?: string; // "1-3" | "4-6" | "7+"
  maxPrice?: number;
  departure?: string;
  group?: string;
  sort?: string;
}

export type SearchParamsInput = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v || undefined;

export function parseSafariFilters(sp: SearchParamsInput): SafariFilters {
  const max = Number(one(sp.maxPrice));
  return {
    q: one(sp.q),
    destination: one(sp.destination),
    county: one(sp.county),
    style: one(sp.style),
    tier: one(sp.tier),
    transport: one(sp.transport),
    difficulty: one(sp.difficulty),
    duration: one(sp.duration),
    maxPrice: Number.isFinite(max) && max > 0 ? max : undefined,
    departure: one(sp.departure),
    group: one(sp.group),
    sort: one(sp.sort),
  };
}

function matchesDuration(days: number, range?: string): boolean {
  if (!range) return true;
  if (range === "1-3") return days <= 3;
  if (range === "4-6") return days >= 4 && days <= 6;
  if (range === "7+") return days >= 7;
  return true;
}

export function filterSafaris(f: SafariFilters): Safari[] {
  const q = f.q?.trim().toLowerCase();
  const list = safaris.filter((s) => {
    if (f.destination && !s.destinationSlugs.includes(f.destination)) return false;
    if (f.county && !s.countySlugs.includes(f.county)) return false;
    if (f.style && !s.styles.includes(f.style as SafariStyle)) return false;
    if (f.tier && s.tier !== f.tier) return false;
    if (f.transport && s.transport !== f.transport) return false;
    if (f.difficulty && s.difficulty !== f.difficulty) return false;
    if (!matchesDuration(s.days, f.duration)) return false;
    if (f.maxPrice && s.fromPriceUsd > f.maxPrice) return false;
    if (f.departure && !s.departureFrom.toLowerCase().includes(f.departure.toLowerCase())) return false;
    if (f.group && !s.groupTypes.includes(f.group as Safari["groupTypes"][number])) return false;
    if (q) {
      const hay = [
        s.title,
        s.shortDescription,
        ...s.destinationSlugs.map((d) => destinations.find((x) => x.slug === d)?.name ?? ""),
        ...s.wildlife,
        ...s.activities,
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const sorted = [...list];
  switch (f.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.fromPriceUsd - b.fromPriceUsd);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.fromPriceUsd - a.fromPriceUsd);
      break;
    case "duration":
      sorted.sort((a, b) => a.days - b.days);
      break;
    case "rating":
      sorted.sort((a, b) => (b.rating?.score ?? 0) - (a.rating?.score ?? 0));
      break;
    case "newest":
      sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
      break;
    case "popular":
    default:
      sorted.sort((a, b) => b.popularity - a.popularity);
  }
  return sorted;
}
