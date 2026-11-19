import type { Faq } from "@/lib/types";

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PriceDisplay({
  amountUsd,
  size = "md",
}: {
  amountUsd: number;
  size?: "md" | "lg";
}) {
  return (
    <p className="leading-none">
      <span className="block text-[11px] uppercase tracking-[0.14em] text-charcoal/70">From</span>
      <span className={`font-display text-green ${size === "lg" ? "text-4xl" : "text-2xl"}`}>
        {formatUsd(amountUsd)}
      </span>
      <span className="ml-1 text-[12px] text-charcoal/70">per person</span>
    </p>
  );
}

export function Rating({ score, count }: { score: number; count: number }) {
  return (
    <p className="text-sm text-charcoal">
      <span className="font-semibold">{score.toFixed(1)}</span>
      <span className="sr-only"> out of 5 stars</span>
      <span className="text-charcoal/70"> · {count} verified reviews</span>
    </p>
  );
}

/** Native <details>: keyboard accessible with zero client JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-charcoal/15 border-y border-charcoal/15">
      {faqs.map((f) => (
        <details key={f.question} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-green">
            {f.question}
            <span aria-hidden="true" className="text-gold transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl leading-relaxed text-charcoal/85">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
