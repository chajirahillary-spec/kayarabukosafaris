"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export type RevealVariant =
  | "fade-up"
  | "fade-left"
  | "fade-right"
  | "scale-in"
  | "blur-up"
  | "image-curtain";

interface ScrollRevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  threshold?: number;
}

/**
 * Lightweight, GPU-accelerated scroll-reveal wrapper powered by IntersectionObserver.
 * Supports editorial fade, scale, blur-up, and clip-path curtain reveals.
 */
export function ScrollReveal({
  children,
  variant = "fade-up",
  delayMs = 0,
  durationMs = 780,
  className = "",
  threshold = 0.12,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const hiddenTransform: Record<RevealVariant, string> = {
    "fade-up": "translate3d(0, 30px, 0)",
    "fade-left": "translate3d(-30px, 0, 0)",
    "fade-right": "translate3d(30px, 0, 0)",
    "scale-in": "scale(0.95) translate3d(0, 18px, 0)",
    "blur-up": "translate3d(0, 24px, 0) scale(0.985)",
    "image-curtain": "translate3d(0, 18px, 0) scale(1.03)",
  };

  const style: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translate3d(0, 0, 0) scale(1)"
      : hiddenTransform[variant],
    filter:
      variant === "blur-up"
        ? isVisible
          ? "blur(0px)"
          : "blur(6px)"
        : undefined,
    clipPath:
      variant === "image-curtain"
        ? isVisible
          ? "inset(0% 0% 0% 0% round 8px)"
          : "inset(12% 2% 12% 2% round 8px)"
        : undefined,
    transitionProperty: "opacity, transform, filter, clip-path",
    transitionDuration: `${durationMs}ms`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${delayMs}ms`,
    willChange: isVisible ? "auto" : "opacity, transform",
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
