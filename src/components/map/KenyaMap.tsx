"use client";

import Link from "next/link";
import { useState } from "react";
import type { Destination } from "@/lib/types";
import { countyNames } from "@/data/counties";

// Map bounds (degrees). Outline is a simplified national border for orientation only.
const LNG0 = 33.8;
const LNG1 = 42.0;
const LAT0 = 4.9;
const LAT1 = -4.9;
const W = 400;
const H = 480;

const px = (lng: number) => ((lng - LNG0) / (LNG1 - LNG0)) * W;
const py = (lat: number) => ((LAT0 - lat) / (LAT0 - LAT1)) * H;

const OUTLINE: [number, number][] = [
  [34.0, 4.2], [35.95, 4.62], [36.85, 4.45], [38.0, 3.6], [39.05, 3.52],
  [39.8, 3.95], [40.99, 4.0], [41.9, 3.98], [41.0, 2.8], [40.99, -0.9],
  [41.56, -1.68], [40.9, -2.3], [40.1, -3.2], [39.65, -4.05], [39.2, -4.68],
  [37.7, -3.4], [37.5, -3.0], [36.8, -2.55], [35.0, -1.2], [34.05, -1.0],
  [33.95, -0.1], [34.1, 0.55], [34.5, 1.0], [34.6, 1.4], [34.95, 1.7],
  [34.8, 2.4], [34.4, 3.4],
];

const outlinePath =
  OUTLINE.map(([lng, lat], i) => `${i === 0 ? "M" : "L"}${px(lng).toFixed(1)},${py(lat).toFixed(1)}`).join(" ") +
  " Z";

const typeLabel: Record<Destination["type"], string> = {
  "national-park": "National park",
  reserve: "National reserve",
  lake: "Lake",
  mountain: "Mountain",
  coast: "Coast",
  forest: "Forest",
  conservancy: "Conservancy",
  heritage: "Heritage",
};

export function KenyaMap({ destinations }: { destinations: Destination[] }) {
  const [activeSlug, setActiveSlug] = useState<string>("maasai-mara");
  const active = destinations.find((d) => d.slug === activeSlug) ?? destinations[0];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
      <div className="mx-auto w-full max-w-[420px]">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label="Simplified map of Kenya showing safari destinations">
            <path d={outlinePath} fill="#F6E4C8" stroke="#0B4B2E" strokeWidth={1.5} strokeLinejoin="round" />
          </svg>
          {destinations.map((d) => {
            const selected = d.slug === active.slug;
            return (
              <button
                key={d.slug}
                type="button"
                onClick={() => setActiveSlug(d.slug)}
                aria-label={d.name}
                aria-pressed={selected}
                style={{ left: `${(px(d.coords.lng) / W) * 100}%`, top: `${(py(d.coords.lat) / H) * 100}%` }}
                className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <span
                  className={`block rounded-full border-2 transition-all ${
                    selected ? "h-4 w-4 border-forest bg-gold" : "h-2.5 w-2.5 border-ivory bg-green"
                  }`}
                />
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-[12px] text-charcoal/70">
          Simplified outline for orientation. Pin positions are approximate; county boundary layer to be added.
        </p>
      </div>

      <div className="w-full min-w-0">
        <div aria-live="polite" className="rounded-ka border border-gold/50 bg-ivory p-4 sm:p-6 shadow-xs">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-gold">
            {typeLabel[active.type]} · {active.countySlugs.length > 1 ? "Region / Counties" : "County"}: {countyNames(active.countySlugs)}
          </p>
          <h3 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl lg:text-4xl text-green font-display">{active.name}</h3>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/85">{active.tagline}.</p>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-charcoal/75 line-clamp-3">{active.summary}</p>
          <Link
            href={`/destinations/${active.slug}`}
            className="mt-4 sm:mt-5 inline-block text-xs sm:text-[13px] font-semibold uppercase tracking-[0.12em] text-green underline decoration-gold decoration-2 underline-offset-8"
          >
            Explore {active.name} →
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal/60 mb-2">
            Select destination pin:
          </p>
          <ul className="flex flex-wrap gap-1.5 sm:gap-2 max-h-48 sm:max-h-none overflow-y-auto pr-1" aria-label="Select a destination">
            {destinations.map((d) => (
              <li key={d.slug}>
                <button
                  type="button"
                  onClick={() => setActiveSlug(d.slug)}
                  aria-pressed={d.slug === active.slug}
                  className={`h-8 sm:h-9 rounded-ka border px-2.5 sm:px-3 text-[11px] sm:text-[12px] font-semibold transition-colors ${
                    d.slug === active.slug
                      ? "border-green bg-green text-ivory font-bold shadow-xs"
                      : "border-charcoal/25 bg-ivory/80 text-charcoal hover:border-gold"
                  }`}
                >
                  {d.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
