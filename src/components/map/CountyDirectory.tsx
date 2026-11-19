"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { County, Destination, ThemeTag } from "@/lib/types";
import { EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";

const themeLabels: Record<ThemeTag, string> = {
  wildlife: "Wildlife",
  beach: "Beach",
  adventure: "Adventure",
  culture: "Culture",
  mountains: "Mountains",
  conservation: "Conservation",
  birding: "Birding",
  marine: "Marine",
  forest: "Forest",
  community: "Community",
  heritage: "Heritage",
};

export function CountyDirectory({
  counties,
  destinations,
  limit,
}: {
  counties: County[];
  destinations: Destination[];
  limit?: number;
}) {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<ThemeTag | "">("");
  const [region, setRegion] = useState("");

  const regions = useMemo(() => Array.from(new Set(counties.map((c) => c.region))).sort(), [counties]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return counties.filter((c) => {
      if (theme && !c.themes.includes(theme)) return false;
      if (region && c.region !== region) return false;
      if (!q) return true;
      const names = c.destinationSlugs.map((s) => destinations.find((d) => d.slug === s)?.name ?? "");
      return [c.name, c.region, c.summary, ...c.alsoFeatured, ...names].join(" ").toLowerCase().includes(q);
    });
  }, [counties, destinations, query, theme, region]);

  const shown = limit && !query && !theme && !region ? results.slice(0, limit) : results;
  const clear = () => {
    setQuery("");
    setTheme("");
    setRegion("");
  };
  const input = "h-11 rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm min-w-0 max-w-full focus:border-green focus:outline-none";

  return (
    <div>
      <div className="grid gap-2.5 sm:grid-cols-[1fr_auto_auto]" role="search">
        <div className="w-full min-w-0">
          <label htmlFor="cd-q" className="sr-only">Find destinations in Kenya</label>
          <input
            id="cd-q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by county name, town or park..."
            className={`${input} w-full`}
          />
        </div>
        <div className="w-full min-w-0 sm:w-44">
          <label htmlFor="cd-region" className="sr-only">Region</label>
          <select id="cd-region" value={region} onChange={(e) => setRegion(e.target.value)} className={`${input} w-full appearance-none pr-8 bg-ivory`}>
            <option value="">All regions</option>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="w-full min-w-0 sm:w-44">
          <label htmlFor="cd-theme" className="sr-only">Interest</label>
          <select id="cd-theme" value={theme} onChange={(e) => setTheme(e.target.value as ThemeTag | "")} className={`${input} w-full appearance-none pr-8 bg-ivory`}>
            <option value="">All interests</option>
            {(Object.keys(themeLabels) as ThemeTag[]).map((t) => <option key={t} value={t}>{themeLabels[t]}</option>)}
          </select>
        </div>
      </div>

      <p className="mt-2.5 text-xs sm:text-[13px] text-charcoal/70" role="status">
        {results.length} {results.length === 1 ? "county" : "counties"} found
      </p>

      {shown.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No counties match your search."
            hint="Try a different place name or clear the filters."
            action={<Button variant="secondary" onClick={clear}>Clear filters</Button>}
          />
        </div>
      ) : (
        <ul className="mt-5 sm:mt-6 grid gap-px border border-charcoal/15 bg-charcoal/15 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => (
            <li key={c.slug} className="bg-ivory p-4 sm:p-5">
              <h3 className="text-xl sm:text-2xl text-green font-display">
                <Link href={`/counties/${c.slug}`} className="underline-offset-4 hover:underline">
                  {c.name}
                </Link>
              </h3>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">{c.region}</p>
              <p className="mt-2 text-sm text-charcoal/80">{c.summary}</p>
              <ul className="mt-3 space-y-1 text-[13px] text-charcoal/85">
                {c.destinationSlugs.map((s) => {
                  const d = destinations.find((x) => x.slug === s);
                  return d ? (
                    <li key={s}>
                      <Link className="underline-offset-4 hover:underline" href={`/destinations/${s}`}>{d.name}</Link>
                    </li>
                  ) : null;
                })}
                {c.alsoFeatured.map((a) => <li key={a} className="text-charcoal/65">{a}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
