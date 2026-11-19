"use client";

import { destinations } from "@/data/destinations";
import { safariStyleLabels } from "@/data/safaris";
import { Search, ChevronDown } from "lucide-react";
import { MonthPicker } from "./MonthPicker";

const searchStyles = [
  "wildlife",
  "adventure",
  "photography",
  "honeymoon",
  "family",
  "cultural",
  "conservation",
  "beach-and-safari",
];

export function SafariSearchBar() {
  return (
    <div className="w-full">
      <form
        action="/safaris"
        method="get"
        role="search"
        aria-label="Find a safari"
        className="rounded-ka border border-gold/40 bg-ivory p-4 sm:p-5 lg:p-6 shadow-xl shadow-forest/10"
      >
        {/* Subtle mobile header badge */}
        <div className="mb-3 flex items-center justify-between border-b border-charcoal/10 pb-2 sm:hidden">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
            Safari Finder
          </span>
          <span className="text-[11px] text-charcoal/60">Kenya Expeditions</span>
        </div>

        {/* Responsive Grid:
            Mobile (<640px): 1 column vertical stack
            Tablet (640px - 1023px): 2 columns + full width button
            Desktop (>=1024px): 4 flexible columns + action button
        */}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.85fr_1.15fr_auto] lg:items-end">
          {/* Destination */}
          <div className="w-full min-w-0">
            <label
              htmlFor="s-dest"
              className="mb-1.5 block text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-green"
            >
              Where do you want to go?
            </label>
            <div className="relative">
              <select
                id="s-dest"
                name="destination"
                defaultValue=""
                className="h-11 sm:h-12 w-full min-w-0 appearance-none rounded-ka border border-charcoal/20 bg-cream/20 px-3.5 pr-8 text-xs sm:text-sm text-charcoal focus:border-green focus:bg-ivory focus:outline-none transition-colors"
              >
                <option value="">Anywhere in Kenya</option>
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5">
                <ChevronDown className="h-4 w-4 text-charcoal/50" />
              </div>
            </div>
          </div>

          {/* Travel Date */}
          <div className="w-full min-w-0">
            <label
              htmlFor="s-when"
              className="mb-1.5 block text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-green"
            >
              When travelling?
            </label>
            <MonthPicker id="s-when" name="when" placeholder="Select travel month" />
          </div>

          {/* Travellers */}
          <div className="w-full min-w-0">
            <label
              htmlFor="s-trav"
              className="mb-1.5 block text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-green"
            >
              Travellers
            </label>
            <div className="relative">
              <select
                id="s-trav"
                name="travellers"
                defaultValue="2"
                className="h-11 sm:h-12 w-full min-w-0 appearance-none rounded-ka border border-charcoal/20 bg-cream/20 px-3.5 pr-8 text-xs sm:text-sm text-charcoal focus:border-green focus:bg-ivory focus:outline-none transition-colors"
              >
                <option value="1">1 Solo Traveler</option>
                <option value="2">2 Guests (Couple / Pair)</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests (Family / Group)</option>
                <option value="6">6 Guests (Full 4x4 Cruiser)</option>
                <option value="8">8+ Guests (Large Group)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5">
                <ChevronDown className="h-4 w-4 text-charcoal/50" />
              </div>
            </div>
          </div>

          {/* Experience Style */}
          <div className="w-full min-w-0">
            <label
              htmlFor="s-exp"
              className="mb-1.5 block text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] text-green"
            >
              Safari style
            </label>
            <div className="relative">
              <select
                id="s-exp"
                name="style"
                defaultValue=""
                className="h-11 sm:h-12 w-full min-w-0 appearance-none rounded-ka border border-charcoal/20 bg-cream/20 px-3.5 pr-8 text-xs sm:text-sm text-charcoal focus:border-green focus:bg-ivory focus:outline-none transition-colors"
              >
                <option value="">Any experience style</option>
                {searchStyles.map((s) => (
                  <option key={s} value={s}>
                    {safariStyleLabels[s]}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5">
                <ChevronDown className="h-4 w-4 text-charcoal/50" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="w-full sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              className="flex h-11 sm:h-12 w-full items-center justify-center gap-2 rounded-ka bg-green px-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-ivory hover:bg-forest hover:text-gold-light transition-colors shadow-xs"
            >
              <Search className="h-4 w-4 text-ivory" />
              <span className="whitespace-nowrap">Find my safari</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
