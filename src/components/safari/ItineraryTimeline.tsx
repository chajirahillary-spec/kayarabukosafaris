import type { ItineraryDay } from "@/lib/types";

/**
 * Expandable itinerary using native <details> — accessible, keyboard-friendly
 * and zero client JavaScript. First day is open by default.
 */
export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  return (
    <ol className="relative space-y-4 border-l border-gold/60 pl-6 sm:pl-8">
      {days.map((d, i) => (
        <li key={d.day} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[2.2rem] top-5 flex h-7 w-7 items-center justify-center bg-green text-[11px] font-semibold text-gold-light sm:-left-[2.7rem]"
          >
            {d.day}
          </span>
          <details open={i === 0} className="group border border-charcoal/15 bg-ivory">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 sm:p-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Day {d.day}
                </p>
                <p className="font-display mt-1 text-2xl text-green">{d.title}</p>
                <p className="mt-1 text-[13px] text-charcoal/70">
                  {d.from} <span aria-hidden="true">→</span>
                  <span className="sr-only"> to </span> {d.to}
                </p>
              </div>
              <span aria-hidden="true" className="text-2xl text-gold transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="space-y-4 border-t border-charcoal/10 p-4 text-sm leading-relaxed sm:p-5">
              <p>{d.summary}</p>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-green">Activities</dt>
                  <dd className="text-charcoal/80">{d.activities.join(" · ")}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-green">Meals</dt>
                  <dd className="text-charcoal/80">{d.meals.length ? d.meals.join(", ") : "—"}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-green">Accommodation</dt>
                  <dd className="text-charcoal/80">{d.accommodation}</dd>
                </div>
                {(d.distanceKm || d.travelTime) && (
                  <div>
                    <dt className="font-semibold text-green">Distance &amp; travel time</dt>
                    <dd className="text-charcoal/80">
                      {[d.distanceKm ? `about ${d.distanceKm} km` : null, d.travelTime]
                        .filter(Boolean)
                        .join(" · ")}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </details>
        </li>
      ))}
    </ol>
  );
}
