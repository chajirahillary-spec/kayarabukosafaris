"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Compass, RefreshCw } from "lucide-react";
import {
  EDITORIAL_IMAGES,
  SAVED_FIREBASE_IMAGE_OVERRIDES,
} from "@/data/content";
import { useVisualEdit } from "@/components/visual-editor/VisualEditProvider";

export interface HeroSlide {
  src: string;
  alt: string;
  location: string;
  highlight: string;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    src:
      SAVED_FIREBASE_IMAGE_OVERRIDES["hero.0"] ||
      EDITORIAL_IMAGES.heroForestCommunity,
    alt: "Kenyan community storytellers sharing living cultural traditions and heritage",
    location: "Living Cultural Heritage",
    highlight: "Communities, Stories & Traditions",
  },
  {
    src:
      SAVED_FIREBASE_IMAGE_OVERRIDES["hero.1"] ||
      EDITORIAL_IMAGES.heroIndigenousForest,
    alt: "Lush indigenous forest canopy in Arabuko-Sokoke and Kenya's coastal forests",
    location: "Arabuko-Sokoke & Sacred Kaya Forests",
    highlight: "Indigenous Forest Conservation",
  },
  {
    src:
      SAVED_FIREBASE_IMAGE_OVERRIDES["hero.2"] ||
      EDITORIAL_IMAGES.heroSwahiliDhow,
    alt: "Traditional wooden dhow sailing along Kenya's historic Swahili Coast",
    location: "The Swahili Coast & Mijikenda Heritage",
    highlight: "Maritime Culture & Coastal Ecosystems",
  },
  {
    src:
      SAVED_FIREBASE_IMAGE_OVERRIDES["hero.3"] ||
      EDITORIAL_IMAGES.heroHighlandCanopy,
    alt: "Misty montane forest canopy and water catchments in the Aberdare Ranges",
    location: "Highland Forests & Catchments",
    highlight: "Biodiversity & Natural Heritage",
  },
  {
    src:
      SAVED_FIREBASE_IMAGE_OVERRIDES["hero.4"] ||
      EDITORIAL_IMAGES.heroNorthernHorizons,
    alt: "Expansive Kenyan landscapes where communities and ecosystems coexist",
    location: "Rangelands & Community Conservancies",
    highlight: "People & Nature in Balance",
  },
];

interface HeroSlideshowProps {
  intervalMs?: number;
  slides?: HeroSlide[];
}

export function HeroSlideshow({
  intervalMs = 6500,
  slides = HERO_SLIDES,
}: HeroSlideshowProps) {
  const { editMode, resolveImageSrc, openImageEditor } = useVisualEdit();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [parallaxY, setParallaxY] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  // Lightweight GPU-friendly parallax depth on scroll
  useEffect(() => {
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < 950) {
          setParallaxY(Math.round(y * 0.24));
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const baseSlides = slides.length > 0 ? slides : HERO_SLIDES;
  const activeSlides = baseSlides.map((s, idx) => ({
    ...s,
    src: resolveImageSrc(`hero.${idx}`, s.src) || s.src,
  }));

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length
    );
  }, [activeSlides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [nextSlide, intervalMs, isPaused]);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        touchStartXRef.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        if (touchStartXRef.current === null) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
        const delta = endX - touchStartXRef.current;
        touchStartXRef.current = null;
        if (Math.abs(delta) > 42) {
          if (delta < 0) nextSlide();
          else prevSlide();
        }
      }}
      aria-label="KayArabuko Cultural, Community and Conservation Photography"
    >
      {/* Background Slides with Scroll Parallax Depth + Ken Burns Slow Zoom + 1200ms Cross-Dissolve */}
      {activeSlides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={`${slide.src}-${idx}`}
            style={{
              transform: `translate3d(0, ${parallaxY}px, 0)`,
            }}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out will-change-transform ${
              isActive
                ? "opacity-100 z-[1]"
                : "opacity-0 z-0 pointer-events-none"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={idx === 0}
              unoptimized
              sizes="100vw"
              className={`object-cover object-center transition-transform duration-[8000ms] ease-out ${
                isActive ? "scale-[1.07]" : "scale-100"
              }`}
            />
          </div>
        );
      })}

      {/* Editorial Atmospheric Overlays for High Typography Contrast */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-forest/95 via-forest/80 to-forest/45 pointer-events-none" />
      <div className="absolute inset-0 z-[2] bg-gradient-to-t from-forest/95 via-transparent to-black/35 pointer-events-none" />

      {/* Visual Quick-Edit Trigger for Hero Slideshow */}
      {editMode && (
        <button
          type="button"
          data-ve-ignore="true"
          onClick={() =>
            openImageEditor({
              slotKey: `hero.${currentIndex}`,
              label: `Hero Slide ${currentIndex + 1} — ${currentSlide.location}`,
              currentSrc: currentSlide.src,
              defaultSrc: HERO_SLIDES[currentIndex]?.src || currentSlide.src,
            })
          }
          className="cursor-pointer absolute top-14 right-4 sm:right-6 z-30 inline-flex items-center gap-2 rounded-ka border-2 border-gold bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-forest shadow-xl hover:bg-gold-light transition-colors"
        >
          <RefreshCw className="h-4 w-4 text-forest" />
          <span>Replace Hero Image (Slide {currentIndex + 1})</span>
        </button>
      )}

      {/* Keyed Editorial Context Tag (Bottom Right) — Crossfades & Slides on Slide Change */}
      <div
        key={`caption-${currentIndex}`}
        className="animate-panel-enter absolute bottom-6 right-6 z-[3] hidden md:flex items-center gap-2.5 rounded-ka bg-forest/85 backdrop-blur-md px-4 py-2 text-xs text-cream/90 border border-gold/35 shadow-lg"
      >
        <Compass className="h-3.5 w-3.5 text-gold shrink-0" />
        <span className="font-semibold text-ivory">{currentSlide.location}</span>
        <span className="text-cream/40">·</span>
        <span className="text-gold-light text-[11px]">
          {currentSlide.highlight}
        </span>
      </div>

      {/* Manual Slide Navigation & Animated Progress Indicator Pills (Bottom Left) */}
      <div className="absolute bottom-6 left-4 sm:left-6 lg:left-8 z-[3] flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous photograph"
            className="cursor-pointer rounded-ka bg-forest/75 hover:bg-forest text-cream hover:text-gold hover:-translate-y-0.5 p-1.5 transition-all duration-200 border border-gold/25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next photograph"
            className="cursor-pointer rounded-ka bg-forest/75 hover:bg-forest text-cream hover:text-gold hover:-translate-y-0.5 p-1.5 transition-all duration-200 border border-gold/25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Slide Indicator Pills with Timed Gold Fill Bar */}
        <div className="flex items-center gap-1.5 pl-1">
          {activeSlides.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`View slide ${i + 1}`}
                className={`cursor-pointer relative h-1.5 overflow-hidden transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-9 bg-cream/25"
                    : "w-2 bg-cream/40 hover:bg-cream/75"
                }`}
              >
                {isActive && (
                  <span
                    key={`progress-${currentIndex}-${isPaused ? "paused" : "play"}`}
                    className="absolute inset-0 origin-left rounded-full bg-gold"
                    style={{
                      animation: isPaused
                        ? "none"
                        : `ka-slide-progress ${intervalMs}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
