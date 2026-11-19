"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Story } from "@/lib/types";
import { storyCategories } from "@/data/content";
import { SiteImage } from "@/components/ui/SiteImage";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { X, ArrowUpRight, Clock } from "lucide-react";

interface StoryReaderModalProps {
  story: Story | null;
  onClose: () => void;
  onEnquireTopic: (topic: string, storyTitle: string) => void;
}

export function StoryReaderModal({
  story,
  onClose,
  onEnquireTopic,
}: StoryReaderModalProps) {
  useEffect(() => {
    if (!story) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [story, onClose]);

  if (!story) return null;

  const categoryName =
    storyCategories.find((c) => c.slug === story.categorySlug)?.name ||
    story.categorySlug;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="story-reader-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal/80 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Editorial Reader Container with Smooth Modal Scale Entrance */}
      <article className="animate-modal-enter relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-ka border border-gold/30 bg-ivory text-charcoal shadow-2xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-charcoal/15 bg-cream/40 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            <span>{categoryName}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 text-charcoal/70">
              <Clock className="h-3 w-3" />
              {story.readMinutes} min read
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-ka border border-charcoal/20 bg-ivory px-3 py-1.5 text-xs font-semibold text-charcoal hover:border-gold hover:text-green transition-colors"
            aria-label="Close article reader"
          >
            <span>Close</span>
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Scrollable Article Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-10 sm:py-8">
          <h2
            id="story-reader-title"
            className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.08] text-green"
          >
            {story.title}
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-charcoal/65">
            By {story.author} ·{" "}
            <time dateTime={story.publishedAt}>{story.publishedAt}</time>
          </p>

          <div className="mt-6 overflow-hidden rounded-ka border border-charcoal/10">
            <SiteImage
              image={story.image}
              slotKey={`story.${story.slug}`}
              className="aspect-[16/9] w-full"
              sizes="(min-width: 768px) 720px, 100vw"
              tone="forest"
            />
          </div>

          <p className="mt-6 border-l-2 border-gold pl-4 font-serif text-lg sm:text-xl italic leading-relaxed text-forest">
            {story.excerpt}
          </p>

          <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-charcoal/90">
            {story.body.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Editorial Footer Callout inside Reader */}
          <div className="mt-8 rounded-ka border border-gold/35 bg-cream/45 p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
              Explore. Conserve. Empower.
            </p>
            <h3 className="mt-1 font-display text-2xl text-green">
              Experience This Story in Person
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-charcoal/80 leading-relaxed">
              Interested in learning more or arranging a respectful cultural or
              conservation visit connected to this story?
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <WhatsAppButton
                label="Inquire on WhatsApp"
                context={{
                  areaOfInterest: story.relatedTopic || categoryName,
                  message: `I was reading "${story.title}" and would love to arrange an experience.`,
                }}
              />
              <Link
                href={`/stories/${story.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-charcoal/25 bg-ivory px-4 py-2.5 text-xs font-semibold text-charcoal hover:border-gold hover:text-green transition-colors"
              >
                <span>Open Standalone Article</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
