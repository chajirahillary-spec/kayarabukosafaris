"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { safaris } from "@/data/safaris";
import { counties } from "@/data/counties";
import { stories, experiences } from "@/data/content";

import { Search, X } from "lucide-react";

interface SearchResultItem {
  id: string;
  title: string;
  category: "Safari" | "Destination" | "County" | "Story" | "Experience";
  subtitle: string;
  url: string;
}

export function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  let results: SearchResultItem[] = [];

  if (q.length > 0) {
    // Safaris
    safaris.forEach((s) => {
      if (
        s.title.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.wildlife.some((w) => w.toLowerCase().includes(q))
      ) {
        results.push({
          id: `safari-${s.slug}`,
          title: s.title,
          category: "Safari",
          subtitle: `${s.days} Days · From $${s.fromPriceUsd}`,
          url: `/safaris/${s.slug}`,
        });
      }
    });

    // Destinations
    destinations.forEach((d) => {
      if (
        d.name.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q) ||
        d.knownFor.some((k) => k.toLowerCase().includes(q))
      ) {
        results.push({
          id: `dest-${d.slug}`,
          title: d.name,
          category: "Destination",
          subtitle: d.tagline,
          url: `/destinations/${d.slug}`,
        });
      }
    });

    // Counties
    counties.forEach((c) => {
      if (c.name.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)) {
        results.push({
          id: `county-${c.slug}`,
          title: `${c.name} County`,
          category: "County",
          subtitle: c.region,
          url: `/counties/${c.slug}`,
        });
      }
    });

    // Stories
    stories.forEach((st) => {
      if (st.title.toLowerCase().includes(q) || st.excerpt.toLowerCase().includes(q)) {
        results.push({
          id: `story-${st.slug}`,
          title: st.title,
          category: "Story",
          subtitle: `${st.readMinutes} min read`,
          url: `/stories/${st.slug}`,
        });
      }
    });

    // Experiences
    experiences.forEach((exp) => {
      if (exp.title.toLowerCase().includes(q) || exp.blurb.toLowerCase().includes(q)) {
        results.push({
          id: `exp-${exp.slug}`,
          title: exp.title,
          category: "Experience",
          subtitle: exp.persona,
          url: `/experiences/${exp.slug}`,
        });
      }
    });
  }

  const popularSearches = [
    { label: "Maasai Mara", url: "/destinations/maasai-mara" },
    { label: "Amboseli Elephants", url: "/destinations/amboseli" },
    { label: "5-Day Mara & Nakuru", url: "/safaris/5-day-maasai-mara-and-lake-nakuru-safari" },
    { label: "Diani Beach & Safari", url: "/safaris/7-day-kenya-safari-and-diani-beach" },
    { label: "Wildebeest Migration Guide", url: "/stories/best-time-to-visit-maasai-mara" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Safari Search"
      className="fixed inset-0 z-50 flex items-start justify-center bg-charcoal/70 p-4 pt-16 sm:pt-24"
    >
      <div className="w-full max-w-2xl rounded-ka border border-gold/50 bg-ivory shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-charcoal/15 px-4 py-3 bg-cream/40">
          <Search className="h-5 w-5 text-gold mr-3 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search safaris, wildlife, destinations, counties, stories..."
            className="flex-1 bg-transparent text-sm sm:text-base text-charcoal outline-none placeholder:text-charcoal/50"
          />
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 rounded border border-charcoal/20 px-2 py-1 text-xs uppercase font-semibold text-charcoal/70 hover:text-charcoal"
          >
            <X className="h-3.5 w-3.5" />
            <span>Esc</span>
          </button>
        </div>

        {/* Results or Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {q.length === 0 ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60 mb-2">
                Popular Discoveries
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((pop) => (
                  <Link
                    key={pop.label}
                    href={pop.url}
                    onClick={onClose}
                    className="rounded-ka border border-charcoal/15 bg-ivory px-3 py-1.5 text-xs text-green hover:border-gold hover:bg-cream transition-colors"
                  >
                    {pop.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-charcoal/70">
              No results found for &ldquo;{query}&rdquo;. Try searching &ldquo;Mara&rdquo;, &ldquo;Rhino&rdquo;, &ldquo;Amboseli&rdquo;, or &ldquo;Beach&rdquo;.
            </div>
          ) : (
            <ul className="divide-y divide-charcoal/10">
              {results.slice(0, 10).map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.url}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-ka hover:bg-cream/50 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-green text-sm block">
                        {item.title}
                      </span>
                      <span className="text-xs text-charcoal/70">{item.subtitle}</span>
                    </div>
                    <span className="rounded bg-cream px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider text-green">
                      {item.category}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
