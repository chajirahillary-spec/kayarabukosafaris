import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Badge({
  children,
  tone = "cream",
}: {
  children: ReactNode;
  tone?: "cream" | "green" | "gold";
}) {
  const tones = {
    cream: "bg-cream text-green",
    green: "bg-green text-ivory",
    gold: "border border-gold text-charcoal",
  } as const;
  return (
    <span
      className={`inline-block rounded-ka px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.1em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  inverse = false,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  inverse?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && (
        <p
          className={`mb-2 sm:mb-3 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] ${
            inverse ? "text-gold-light" : "text-gold"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={`text-3xl sm:text-4xl lg:text-5xl leading-[1.08] sm:leading-[1.05] font-display ${inverse ? "text-ivory" : "text-green"}`}
      >
        {title}
      </Tag>
      {intro && (
        <p className={`mt-4 text-base leading-relaxed ${inverse ? "text-cream" : "text-charcoal/80"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-charcoal/70">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-charcoal">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="underline-offset-4 hover:underline">
                  {item.name}
                </Link>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: ReactNode;
}) {
  return (
    <div className="border border-dashed border-gold/60 bg-cream/40 px-6 py-14 text-center">
      <h3 className="text-3xl text-green">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-charcoal/80">{hint}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
