import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-ka px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-green text-ivory hover:bg-forest hover:text-gold-light",
  secondary: "border border-gold bg-transparent text-green hover:bg-cream",
  ghost: "text-green underline-offset-4 hover:underline px-0",
  light: "bg-ivory text-green hover:bg-cream",
};

export function buttonClass(variant: Variant = "primary", extra = ""): string {
  return `${base} ${variants[variant]} ${extra}`.trim();
}

interface LinkButtonProps extends Omit<ComponentProps<typeof Link>, "className"> {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

export function LinkButton({ variant = "primary", className, children, ...rest }: LinkButtonProps) {
  return (
    <Link className={buttonClass(variant, className)} {...rest}>
      {children}
    </Link>
  );
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />;
}
