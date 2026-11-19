"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MediaService } from "@/lib/firebase/mediaService";
import { site } from "@/data/site";
import { useVisualEdit } from "@/components/visual-editor/VisualEditProvider";
import { Camera } from "lucide-react";

export const DEFAULT_LIGHT_LOGO = "/images/kayarabuko-logo-transparent.png";
export const DEFAULT_DARK_LOGO = "/images/kayarabuko-logo-light.png";

export function BrandLogo({
  inverse = false,
  className = "",
  showWordmark = false,
  size = "default",
}: {
  inverse?: boolean;
  className?: string;
  showWordmark?: boolean;
  size?: "default" | "lg";
}) {
  const { editMode, imageOverrides, openImageEditor } = useVisualEdit();
  const defaultSrc = inverse ? DEFAULT_DARK_LOGO : DEFAULT_LIGHT_LOGO;
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    MediaService.getBrandMedia().then((brand) => {
      if (!brand) return;
      if (inverse && brand.logoDarkUrl) {
        setCustomLogoUrl(brand.logoDarkUrl);
      } else if (
        !inverse &&
        brand.logoUrl &&
        !brand.logoUrl.includes("fe1c982e-1803-48f6-999e-8bca8b906167")
      ) {
        setCustomLogoUrl(brand.logoUrl);
      }
    });
  }, [inverse]);

  const overrideLogo = imageOverrides["brand.kayarabuko.logo"];
  const activeSrc =
    overrideLogo && overrideLogo !== "__RESET__"
      ? overrideLogo
      : customLogoUrl || defaultSrc;

  const heightClasses =
    size === "lg"
      ? "h-14 sm:h-16 md:h-[70px]"
      : "h-11 sm:h-13 md:h-[58px]";

  return (
    <span
      data-ve-image-slot="brand.kayarabuko.logo"
      data-ve-image-src={activeSrc}
      data-ve-image-label="KayArabuko Main Brand Logo"
      onClick={(e) => {
        if (!editMode) return;
        e.preventDefault();
        e.stopPropagation();
        openImageEditor({
          slotKey: "brand.kayarabuko.logo",
          label: "KayArabuko Main Brand Logo",
          currentSrc: activeSrc,
          defaultSrc,
        });
      }}
      title={
        editMode ? "Click to replace or upload KayArabuko Brand Logo" : undefined
      }
      className={`group/ve-logo inline-flex items-center shrink-0 rounded-ka transition-all ${
        editMode
          ? "cursor-pointer p-1 outline-2 outline-dashed outline-gold bg-gold/10 hover:bg-gold/20 hover:outline-solid"
          : ""
      } ${className}`}
    >
      {!imgError && (
        <span className="relative flex items-center justify-center bg-transparent transition-transform duration-300">
          <Image
            key={activeSrc}
            src={activeSrc}
            alt="KayArabuko — Explore. Conserve. Empower."
            width={220}
            height={65}
            priority
            unoptimized
            onError={() => setImgError(true)}
            className={`${heightClasses} w-auto object-contain select-none`}
          />
        </span>
      )}

      {(showWordmark || imgError) && (
        <span
          className={`block shrink-0 leading-none whitespace-nowrap ${
            inverse ? "text-ivory" : "text-green"
          }`}
        >
          <span className="font-display block text-xl sm:text-2xl font-semibold tracking-wide">
            KayArabuko
          </span>
          <span
            className={`mt-0.5 block text-[7.5px] sm:text-[8.5px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.24em] ${
              inverse ? "text-gold-light" : "text-gold"
            }`}
          >
            Explore · Conserve · Empower
          </span>
        </span>
      )}

      {editMode && (
        <span className="pointer-events-none ml-2 inline-flex items-center gap-1 rounded-ka border border-gold bg-forest px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-light shadow-md group-hover/ve-logo:bg-gold group-hover/ve-logo:text-forest transition-colors">
          <Camera className="h-3 w-3 shrink-0" />
          <span>Replace Logo</span>
        </span>
      )}
    </span>
  );
}

/**
 * Interactive Kaya Experience Ltd Logo that supports one-click replacement and upload
 * across all website sections (#about, #team, #contact, and Footer).
 */
export function KayaExperienceLogo({
  variant = "dark",
  className = "h-12 w-auto",
  alt = "Kaya Experience Ltd Official Logo",
  width = 200,
  height = 54,
}: {
  /** "light" renders the light-gold/ivory default SVG on dark backgrounds; "dark" renders the forest-green default SVG on light backgrounds */
  variant?: "light" | "dark";
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}) {
  const { editMode, imageOverrides, openImageEditor } = useVisualEdit();

  const defaultSrc =
    variant === "light"
      ? site.kayaExperienceLogoLightUrl
      : site.kayaExperienceLogoUrl;

  const overrideLogo = imageOverrides["brand.kayaExperience.logo"];
  const activeSrc =
    overrideLogo && overrideLogo !== "__RESET__" ? overrideLogo : defaultSrc;

  return (
    <span
      data-ve-image-slot="brand.kayaExperience.logo"
      data-ve-image-src={activeSrc}
      data-ve-image-label="Kaya Experience Ltd Official Logo"
      onClick={(e) => {
        if (!editMode) return;
        e.preventDefault();
        e.stopPropagation();
        openImageEditor({
          slotKey: "brand.kayaExperience.logo",
          label: "Kaya Experience Ltd Official Logo",
          currentSrc: activeSrc,
          defaultSrc,
        });
      }}
      title={
        editMode
          ? "Click to replace or upload Kaya Experience Ltd Logo"
          : undefined
      }
      className={`group/ve-kaya-logo relative inline-flex items-center justify-center rounded-ka transition-all ${
        editMode
          ? "cursor-pointer p-1.5 outline-2 outline-dashed outline-gold bg-gold/15 hover:bg-gold/25 hover:outline-solid shadow-sm"
          : ""
      }`}
    >
      <Image
        key={activeSrc}
        src={activeSrc}
        alt={alt}
        width={width}
        height={height}
        unoptimized
        className={`${className} object-contain select-none`}
      />

      {editMode && (
        <span className="pointer-events-none ml-2 inline-flex items-center gap-1 rounded-ka border border-gold bg-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gold-light shadow-md group-hover/ve-kaya-logo:bg-gold group-hover/ve-kaya-logo:text-forest transition-colors">
          <Camera className="h-3 w-3 shrink-0" />
          <span>Replace Logo</span>
        </span>
      )}
    </span>
  );
}

/**
 * Interactive Accreditation, Rating & Partner Emblem (Magical Kenya, KWS, TripAdvisor, Google Reviews)
 * that supports one-click replacement and upload in Visual Quick-Edit Mode.
 */
export function PartnerBadgeLogo({
  slotKey,
  defaultSrc,
  label,
  className = "h-12 w-auto",
  width = 210,
  height = 62,
}: {
  slotKey:
    | "brand.magicalKenya.logo"
    | "brand.kws.logo"
    | "brand.tripadvisor.badge"
    | "brand.googleReviews.badge";
  defaultSrc: string;
  label: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  const { editMode, imageOverrides, openImageEditor } = useVisualEdit();
  const overrideUrl = imageOverrides[slotKey];
  const activeSrc =
    overrideUrl && overrideUrl !== "__RESET__" ? overrideUrl : defaultSrc;

  return (
    <span
      data-ve-image-slot={slotKey}
      data-ve-image-src={activeSrc}
      data-ve-image-label={label}
      onClick={(e) => {
        if (!editMode) return;
        e.preventDefault();
        e.stopPropagation();
        openImageEditor({
          slotKey,
          label,
          currentSrc: activeSrc,
          defaultSrc,
        });
      }}
      title={editMode ? `Click to replace or upload ${label}` : label}
      className={`group/ve-partner relative inline-flex items-center justify-center rounded-ka transition-all ${
        editMode
          ? "cursor-pointer p-1 outline-2 outline-dashed outline-gold bg-gold/15 hover:bg-gold/25 hover:outline-solid shadow-sm"
          : ""
      }`}
    >
      <Image
        key={activeSrc}
        src={activeSrc}
        alt={label}
        width={width}
        height={height}
        unoptimized
        className={`${className} object-contain select-none`}
      />

      {editMode && (
        <span className="pointer-events-none ml-1.5 inline-flex items-center gap-1 rounded-ka border border-gold bg-forest px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-light shadow group-hover/ve-partner:bg-gold group-hover/ve-partner:text-forest transition-colors">
          <Camera className="h-2.5 w-2.5 shrink-0" />
          <span>Replace</span>
        </span>
      )}
    </span>
  );
}
