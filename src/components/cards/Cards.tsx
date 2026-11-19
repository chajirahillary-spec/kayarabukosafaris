import Link from "next/link";
import type { Destination, Experience, Safari, Story } from "@/lib/types";
import { countyNames } from "@/data/counties";
import { safariStyleLabels } from "@/data/safaris";
import { SiteImage } from "@/components/ui/SiteImage";
import { Badge } from "@/components/ui/primitives";
import { PriceDisplay, Rating } from "@/components/ui/commerce";
import { destinationBySlug } from "@/data/destinations";

const cardBase =
  "group flex h-full flex-col border border-charcoal/15 bg-ivory transition-shadow hover:shadow-md";

export function destinationCountyLabel(d: Destination): string {
  return `${d.countySlugs.length > 1 ? "Region / Counties" : "County"}: ${countyNames(d.countySlugs)}`;
}

export function DestinationCard({ destination: d }: { destination: Destination }) {
  return (
    <article className={cardBase}>
      <div className="w-full overflow-hidden">
        <SiteImage image={d.image} className="aspect-[4/3] w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
          {destinationCountyLabel(d)}
        </p>
        <h3 className="mt-1.5 sm:mt-2 text-2xl sm:text-3xl font-display text-green">
          <Link href={`/destinations/${d.slug}`} className="after:absolute after:inset-0 relative">
            {d.name}
          </Link>
        </h3>
        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-charcoal/80">{d.tagline}.</p>
        <dl className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-[13px]">
          <div>
            <dt className="font-semibold text-charcoal">Signature experience</dt>
            <dd className="text-charcoal/80">{d.signatureExperience}</dd>
          </div>
          <div>
            <dt className="font-semibold text-charcoal">Best known for</dt>
            <dd className="text-charcoal/80">{d.knownFor.slice(0, 3).join(" · ")}</dd>
          </div>
        </dl>
        <p className="mt-auto pt-4 sm:pt-5 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.12em] text-green">
          Explore destination <span aria-hidden="true">→</span>
        </p>
      </div>
    </article>
  );
}

export function SafariCard({ safari: s }: { safari: Safari }) {
  const place = s.destinationSlugs
    .map((slug) => destinationBySlug(slug)?.name)
    .filter(Boolean)
    .join(" · ");
  return (
    <article className={`${cardBase} relative`}>
      <div className="w-full overflow-hidden">
        <SiteImage image={s.image} className="aspect-[3/2] w-full object-cover" tone="forest" />
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Badge tone="green">{s.days} days</Badge>
          <Badge>{safariStyleLabels[s.styles[0]]}</Badge>
          {s.isSeed && <Badge tone="gold">Sample itinerary</Badge>}
        </div>
        <h3 className="mt-2.5 sm:mt-3 text-xl sm:text-2xl font-display leading-tight text-green">
          <Link href={`/safaris/${s.slug}`} className="after:absolute after:inset-0">
            {s.title}
          </Link>
        </h3>
        <p className="mt-1 text-xs sm:text-[13px] text-charcoal/70">{place}</p>
        {s.rating && (
          <div className="mt-2">
            <Rating score={s.rating.score} count={s.rating.count} />
          </div>
        )}
        <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-charcoal/80">{s.shortDescription}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4 sm:pt-5">
          <PriceDisplay amountUsd={s.fromPriceUsd} />
          <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.12em] text-green">
            View safari →
          </span>
        </div>
      </div>
    </article>
  );
}

export function ExperienceCard({ experience: e }: { experience: Experience }) {
  return (
    <article className="group relative overflow-hidden bg-forest text-ivory rounded-ka">
      <SiteImage image={e.image} className="aspect-[4/5] w-full object-cover" tone="forest" />
      <div className="absolute inset-x-0 bottom-0 bg-forest/90 p-4 sm:p-5">
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-light">
          {e.persona}
        </p>
        <h3 className="mt-1 text-2xl sm:text-3xl font-display">
          <Link href={`/experiences/${e.slug}`} className="after:absolute after:inset-0">
            {e.title}
          </Link>
        </h3>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-cream/85 line-clamp-2">{e.blurb}</p>
      </div>
    </article>
  );
}

export function StoryCard({ story: s }: { story: Story }) {
  return (
    <article className="group relative flex flex-col">
      <div className="w-full overflow-hidden rounded-ka">
        <SiteImage image={s.image} className="aspect-[3/2] w-full object-cover" tone="cream" />
      </div>
      <p className="mt-3 sm:mt-4 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">
        {s.readMinutes} min read
      </p>
      <h3 className="mt-1 text-xl sm:text-2xl font-display text-green">
        <Link href={`/stories/${s.slug}`} className="after:absolute after:inset-0">
          {s.title}
        </Link>
      </h3>
      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-charcoal/80 leading-relaxed line-clamp-3">{s.excerpt}</p>
    </article>
  );
}
