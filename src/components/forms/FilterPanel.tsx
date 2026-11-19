import Link from "next/link";
import { destinations } from "@/data/destinations";
import { counties } from "@/data/counties";
import { safariStyleLabels } from "@/data/safaris";
import type { SafariFilters } from "@/lib/safariFilters";
import { buttonClass } from "@/components/ui/Button";

const field = "h-11 w-full rounded-ka border border-charcoal/25 bg-ivory px-3 text-sm";
const label = "mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-green";

function Select({
  id,
  name,
  value,
  options,
  anyLabel,
}: {
  id: string;
  name: string;
  value?: string;
  options: { value: string; label: string }[];
  anyLabel: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={label}>{anyLabel.replace(/^Any /, "")}</label>
      <select id={id} name={name} defaultValue={value ?? ""} className={field}>
        <option value="">{anyLabel}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

const coverageCounties = counties.filter((c) => c.destinationSlugs.length > 0);

export function FilterPanel({ filters }: { filters: SafariFilters }) {
  return (
    <form action="/safaris" method="get" className="space-y-4" aria-label="Filter safaris">
      <div>
        <label htmlFor="f-q" className={label}>Search</label>
        <input id="f-q" name="q" type="search" defaultValue={filters.q ?? ""} placeholder="e.g. elephants, Mara" className={field} />
      </div>
      <Select id="f-dest" name="destination" value={filters.destination} anyLabel="Any destination"
        options={destinations.map((d) => ({ value: d.slug, label: d.name }))} />
      <Select id="f-county" name="county" value={filters.county} anyLabel="Any county"
        options={coverageCounties.map((c) => ({ value: c.slug, label: c.name }))} />
      <Select id="f-style" name="style" value={filters.style} anyLabel="Any safari style"
        options={Object.entries(safariStyleLabels).map(([value, l]) => ({ value, label: l }))} />
      <Select id="f-dur" name="duration" value={filters.duration} anyLabel="Any duration"
        options={[{ value: "1-3", label: "1–3 days" }, { value: "4-6", label: "4–6 days" }, { value: "7+", label: "7+ days" }]} />
      <Select id="f-acc" name="tier" value={filters.tier} anyLabel="Any accommodation"
        options={[{ value: "budget", label: "Budget" }, { value: "mid-range", label: "Mid-range" }, { value: "luxury", label: "Luxury" }]} />
      <Select id="f-trans" name="transport" value={filters.transport} anyLabel="Any transport"
        options={[{ value: "safari-van", label: "Safari van" }, { value: "land-cruiser", label: "Private Land Cruiser" }, { value: "fly-in", label: "Fly-in" }]} />
      <Select id="f-group" name="group" value={filters.group} anyLabel="Any group type"
        options={[{ value: "private", label: "Private" }, { value: "shared", label: "Shared" }, { value: "family", label: "Family" }, { value: "couple", label: "Couple" }]} />
      <Select id="f-diff" name="difficulty" value={filters.difficulty} anyLabel="Any difficulty"
        options={[{ value: "easy", label: "Easy" }, { value: "moderate", label: "Moderate" }, { value: "demanding", label: "Demanding" }]} />
      <div>
        <label htmlFor="f-dep" className={label}>Departure location</label>
        <input id="f-dep" name="departure" defaultValue={filters.departure ?? ""} placeholder="e.g. Nairobi" className={field} />
      </div>
      <div>
        <label htmlFor="f-price" className={label}>Max price per person (USD)</label>
        <input id="f-price" name="maxPrice" type="number" min={0} step={50} inputMode="numeric" defaultValue={filters.maxPrice ?? ""} className={field} />
      </div>
      <div>
        <label htmlFor="f-sort" className={label}>Sort by</label>
        <select id="f-sort" name="sort" defaultValue={filters.sort ?? "popular"} className={field}>
          <option value="popular">Most popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="duration">Duration</option>
          <option value="rating">Rating</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" className={buttonClass("primary", "flex-1")}>Apply filters</button>
        <Link href="/safaris" className={buttonClass("secondary")}>Clear</Link>
      </div>
    </form>
  );
}
