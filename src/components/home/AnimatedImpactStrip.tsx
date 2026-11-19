"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, ShieldCheck, Star, Users } from "lucide-react";

interface ImpactStat {
  id: string;
  target: number;
  decimals?: number;
  suffix: string;
  label: string;
  sublabel: string;
  icon: typeof Compass;
}

const IMPACT_STATS: ImpactStat[] = [
  {
    id: "stat-years",
    target: 10,
    suffix: "+ Yrs",
    label: "Coastal & Safari Road Mastery",
    sublabel: "Experienced Watamu drivers & multilingual tour guides",
    icon: ShieldCheck,
  },
  {
    id: "stat-communities",
    target: 40,
    suffix: "+",
    label: "Indigenous Communities & Cultures",
    sublabel: "Living heritage from the Swahili Coast to the Rift & North",
    icon: Users,
  },
  {
    id: "stat-circuits",
    target: 6,
    suffix: "+ Circuits",
    label: "Tailored Multi-Day Safari Packages",
    sublabel: "2D/1N to 7D/6N safaris with airport & SGR transfer add-ons",
    icon: Compass,
  },
  {
    id: "stat-rating",
    target: 5.0,
    decimals: 1,
    suffix: " ★",
    label: "Top-Rated Guest Experience",
    sublabel: "Verified reviews on TripAdvisor & Google Reviews",
    icon: Star,
  },
];

export function AnimatedImpactStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            const duration = 1450;
            const start = performance.now();

            const tick = (now: number) => {
              const elapsed = now - start;
              const t = Math.min(1, elapsed / duration);
              // Cubic ease-out
              const eased = 1 - Math.pow(1 - t, 3);
              setProgress(eased);
              if (t < 1) {
                requestAnimationFrame(tick);
              }
            };
            requestAnimationFrame(tick);
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="mt-14 rounded-ka border-2 border-gold/55 bg-forest p-6 sm:p-8 text-ivory shadow-xl ka-topo-dark-bg"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gold/25">
        {IMPACT_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          const currentVal = (stat.target * progress).toFixed(
            stat.decimals || 0
          );
          return (
            <div
              key={stat.id}
              className={`flex items-start gap-3.5 ${
                idx > 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""
              }`}
            >
              <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold bg-gold/20 text-gold-light shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-gold-light">
                  {currentVal}
                  {stat.suffix}
                </p>
                <p className="mt-1 text-xs sm:text-sm font-bold text-white">
                  {stat.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-cream/90">
                  {stat.sublabel}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
