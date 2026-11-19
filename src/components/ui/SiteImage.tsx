"use client";

import { useState } from "react";
import Image from "next/image";
import type { ImageRef } from "@/lib/types";
import { useVisualEdit } from "@/components/visual-editor/VisualEditProvider";
import {
  SITE_IMAGE_SLOTS,
  isFirebaseStorageUrl,
  sanitizePublicLabel,
} from "@/lib/firebase/mediaService";
import { Camera, RefreshCw } from "lucide-react";

interface SiteImageProps {
  image: ImageRef;
  /** Optional explicit slot key. */
  slotKey?: string;
  /** Tailwind classes sizing the wrapper (needs a height/aspect). */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Tone of the placeholder panel. */
  tone?: "green" | "forest" | "cream";
  /** Object fit mode (defaults to cover). */
  fit?: "cover" | "contain";
}

const tones = {
  green: "bg-green text-cream",
  forest: "bg-forest text-cream",
  cream: "bg-cream text-green",
} as const;

export function SiteImage({
  image,
  slotKey,
  className = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority = false,
  tone = "green",
  fit = "cover",
}: SiteImageProps) {
  const { editMode, resolveImageSrc, openImageEditor } = useVisualEdit();
  const [loaded, setLoaded] = useState(false);

  // Determine effective slotKey from prop, ImageRef.slotKey, or matching defaultUrl in SITE_IMAGE_SLOTS
  const effectiveSlotKey =
    slotKey ||
    image.slotKey ||
    SITE_IMAGE_SLOTS.find((s) => s.defaultUrl === image.src)?.key;

  const candidateSrc = resolveImageSrc(effectiveSlotKey, image.src);
  const resolvedSrc =
    candidateSrc &&
    (isFirebaseStorageUrl(candidateSrc) ||
      candidateSrc.startsWith("/") ||
      candidateSrc.startsWith("https://images.unsplash.com"))
      ? candidateSrc
      : undefined;

  const cleanLabel = sanitizePublicLabel(
    image.alt || effectiveSlotKey,
    "Website Photograph"
  );

  const hasPosition =
    className.includes("absolute") || className.includes("fixed");
  const basePos = hasPosition ? "" : "relative";

  return (
    <div
      data-ve-image-slot={effectiveSlotKey || "custom.image"}
      data-ve-image-src={resolvedSrc || ""}
      data-ve-image-label={cleanLabel}
      onClick={(e) => {
        if (!editMode) return;
        e.preventDefault();
        e.stopPropagation();
        const key = effectiveSlotKey || "custom.image";
        const slotMeta = SITE_IMAGE_SLOTS.find((s) => s.key === key);
        openImageEditor({
          slotKey: key,
          label: cleanLabel,
          currentSrc: resolvedSrc || slotMeta?.defaultUrl || "",
          defaultSrc: slotMeta?.defaultUrl || resolvedSrc || "",
        });
      }}
      className={`${basePos} group/ve-img overflow-hidden ${
        editMode ? "cursor-pointer" : ""
      } ${className}`.trim()}
    >
      {resolvedSrc ? (
        <>
          {!loaded && (
            <div
              aria-hidden="true"
              className="ka-img-shimmer pointer-events-none absolute inset-0 z-0"
            />
          )}
          <Image
            src={resolvedSrc}
            alt={cleanLabel}
            fill
            unoptimized
            sizes={sizes}
            priority={priority}
            onLoad={() => setLoaded(true)}
            className={`${
              fit === "contain" ? "object-contain" : "object-cover"
            } transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      ) : (
        <div
          role="img"
          aria-label={cleanLabel}
          className={`flex h-full w-full items-end justify-start p-3 ${tones[tone]}`}
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] opacity-70">
            Photograph
          </span>
        </div>
      )}

      {editMode && (
        <>
          {/* Hover "Replace Image" Overlay */}
          <div className="ve-replace-overlay pointer-events-none absolute inset-0 z-25 flex flex-col items-center justify-center gap-1.5 bg-forest/75 p-3 text-center opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover/ve-img:opacity-100">
            <span className="inline-flex items-center gap-2 rounded-ka border-2 border-gold bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-forest shadow-xl">
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Replace Image</span>
            </span>
            <span className="rounded-ka bg-forest/90 px-2.5 py-1 text-[10px] font-semibold text-gold-light">
              Select from Media Library or Upload from Computer
            </span>
          </div>

          {/* Corner Indicator Pill */}
          <span className="pointer-events-none absolute bottom-2 right-2 z-20 inline-flex items-center gap-1.5 rounded-ka border border-gold bg-forest/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-light shadow-md transition-opacity group-hover/ve-img:opacity-0">
            <Camera className="h-3 w-3 text-gold" />
            <span>Replace Image</span>
          </span>
        </>
      )}
    </div>
  );
}
