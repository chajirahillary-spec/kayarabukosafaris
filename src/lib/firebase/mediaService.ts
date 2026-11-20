import { getFirebaseDb, getFirebaseStorage, orgPaths } from "./client";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DEFAULT_ORG_ID } from "./config";
import { getAdminRequestHeaders } from "./adminAuth";
import {
  EDITORIAL_IMAGES,
  SAVED_FIREBASE_IMAGE_OVERRIDES,
  accommodationOptions,
  arabukoSokokeSpotlight,
  brandPillars,
  communityProfiles,
  conservationThemes,
  customerReviewsList,
  ecosystemHighlights,
  excursionsList,
  initialActivityGallery,
  initialPublishedPosters,
  kayaRootsProgram,
  kidFriendlyAccommodationHighlight,
  regionFeatures,
  safariPackagesList,
  stories,
  teamMembers,
  transferServicesList,
  visitExperiences,
} from "@/data/content";
import { HERO_SLIDES } from "@/components/home/HeroSlideshow";
import type { ActivityGalleryItem, PublishedPoster } from "@/lib/types";

export interface BrandMediaSettings {
  logoUrl?: string;
  logoDarkUrl?: string;
  posterUrl?: string;
  heroBannerUrl?: string;
  updatedAt?: string;
}

export interface GalleryMediaItem {
  id: string;
  url: string;
  caption: string;
  category: "wildlife" | "landscapes" | "culture" | "camps" | "vehicles";
  destinationSlug?: string;
  featured?: boolean;
  altText?: string;
}

export interface EditableImageSlot {
  key: string;
  section: string;
  label: string;
  defaultUrl: string;
}

export const SITE_IMAGE_SLOTS: EditableImageSlot[] = [
  // Brand & Logos
  {
    key: "brand.kayaExperience.logo",
    section: "Brand & Logos",
    label: "Kaya Experience Ltd Official Logo",
    defaultUrl: "/images/kaya-experience-logo.svg",
  },
  {
    key: "brand.kayarabuko.logo",
    section: "Brand & Logos",
    label: "KayArabuko Main Brand Logo",
    defaultUrl: "/images/kayarabuko-logo-transparent.png",
  },
  {
    key: "brand.magicalKenya.logo",
    section: "Brand & Logos",
    label: "Magical Kenya Official Destination Emblem",
    defaultUrl: "/images/magical-kenya-logo.svg",
  },
  {
    key: "brand.kws.logo",
    section: "Brand & Logos",
    label: "KWS (Kenya Wildlife Service) Conservation Emblem",
    defaultUrl: "/images/kws-logo.svg",
  },
  {
    key: "brand.tripadvisor.badge",
    section: "Brand & Logos",
    label: "TripAdvisor Travellers' Choice Rating Badge",
    defaultUrl: "/images/tripadvisor-badge.svg",
  },
  {
    key: "brand.googleReviews.badge",
    section: "Brand & Logos",
    label: "Google Reviews Verified 5-Star Rating Badge",
    defaultUrl: "/images/google-reviews-badge.svg",
  },

  // Section 01: Hero Slideshow
  ...HERO_SLIDES.map((s, idx) => ({
    key: `hero.${idx}`,
    section: "Section 01: Hero Slideshow",
    label: `Hero Slide ${idx + 1} — ${s.location}`,
    defaultUrl: s.src,
  })),

  // Section 02: Introduction
  {
    key: "intro.people",
    section: "Section 02: Introduction",
    label: "Intro Primary Photo (Communities & Heritage)",
    defaultUrl: EDITORIAL_IMAGES.introPeople,
  },
  {
    key: "intro.forest",
    section: "Section 02: Introduction",
    label: "Intro Secondary Photo (Forests & Ecosystems)",
    defaultUrl: EDITORIAL_IMAGES.introForest,
  },

  // Section 03: Three Pillars
  ...brandPillars.map((p) => ({
    key: `pillar.${p.id}`,
    section: "Section 03: Three Core Pillars",
    label: `Pillar ${p.number}: ${p.title}`,
    defaultUrl: p.image.src || EDITORIAL_IMAGES.pillarExplore,
  })),

  // Section 04: Cultures & Communities
  ...communityProfiles.map((c) => ({
    key: `community.${c.slug}`,
    section: "Section 04: Cultures & Communities",
    label: `${c.name} (${c.region})`,
    defaultUrl: c.image.src || EDITORIAL_IMAGES.maasai,
  })),

  // Section 05: Conservation Spotlight, Themes & Landscapes
  {
    key: "conservation.spotlight",
    section: "Section 05: Conservation & Ecosystems",
    label: "Arabuko-Sokoke Forest Spotlight Photo",
    defaultUrl:
      arabukoSokokeSpotlight.image.src || EDITORIAL_IMAGES.arabukoForest,
  },
  ...conservationThemes.map((t) => ({
    key: `conservation.theme.${t.slug}`,
    section: "Section 05: Conservation & Ecosystems",
    label: `Theme: ${t.title}`,
    defaultUrl: t.image.src || EDITORIAL_IMAGES.arabukoForest,
  })),
  ...ecosystemHighlights.map((e) => ({
    key: `ecosystem.${e.slug}`,
    section: "Section 05: Conservation Landscapes (6 Cards)",
    label: `Landscape: ${e.name} (${e.region})`,
    defaultUrl: e.image?.src || EDITORIAL_IMAGES.arabukoForest,
  })),

  // Section 06: Explore Kenya Regions
  ...regionFeatures.map((r) => ({
    key: `region.${r.slug}`,
    section: "Section 06: Explore Kenya Regions",
    label: r.name,
    defaultUrl: r.image.src || EDITORIAL_IMAGES.regionCoast,
  })),

  // Section 07: Visits & Experiences
  ...visitExperiences.map((v) => ({
    key: `experience.${v.slug}`,
    section: "Section 07: Visits & Experiences",
    label: v.title,
    defaultUrl: v.image.src || EDITORIAL_IMAGES.maasai,
  })),

  // Section 07A: Multi-Day Safari Packages
  ...safariPackagesList.map((pkg) => ({
    key: pkg.image.slotKey || `safari.pkg.${pkg.slug}`,
    section: "Section 07A: Multi-Day Safari Packages",
    label: `${pkg.durationLabel}: ${pkg.title}`,
    defaultUrl: pkg.image.src || EDITORIAL_IMAGES.wildlifeEcosystems,
  })),

  // Section 07B: Excursions & One-Day Visits
  ...excursionsList.map((ex) => ({
    key: `excursion.${ex.slug}`,
    section: "Section 07B: Excursions & Day Trips",
    label: `Excursion: ${ex.title}`,
    defaultUrl: ex.image.src || EDITORIAL_IMAGES.arabukoForest,
  })),

  // Section 07B2: Airport, SGR Train Station & Coastal Transfers
  ...transferServicesList.map((tr) => ({
    key: tr.image.slotKey || `transfer.${tr.slug}`,
    section: "Section 07B2: Airport & SGR Transfers",
    label: `Transfer: ${tr.title}`,
    defaultUrl: tr.image.src || EDITORIAL_IMAGES.regionCoast,
  })),

  // Section 07C: Accommodation (Villas, Cottages, Hotels & Lodgings)
  ...accommodationOptions.map((acc) => ({
    key: `accommodation.${acc.slug}`,
    section: "Section 07C: Accommodation & Stays",
    label: `${acc.category}: ${acc.title}`,
    defaultUrl: acc.image.src || EDITORIAL_IMAGES.regionCoast,
  })),
  {
    key: kidFriendlyAccommodationHighlight.slotKey,
    section: "Section 07C: Accommodation & Stays",
    label: "Kid-Friendly Accommodations (Kids' Pools & Nannies On Call)",
    defaultUrl:
      kidFriendlyAccommodationHighlight.image.src ||
      EDITORIAL_IMAGES.regionCoast,
  },

  // Section 07D: Kaya Roots Africa (Dr. Milcah Wambua)
  {
    key: "kayaroots.main",
    section: "Section 07D: Kaya Roots Africa",
    label: "Kaya Roots Africa — Cassava & Farmer Empowerment Photo",
    defaultUrl: kayaRootsProgram.image.src || EDITORIAL_IMAGES.pillarEmpower,
  },

  // Section 08: Stories
  ...stories.map((st) => ({
    key: `story.${st.slug}`,
    section: "Section 08: Stories & Insights",
    label: st.title,
    defaultUrl: st.image.src || EDITORIAL_IMAGES.mijikenda,
  })),

  // Section 09: About & Meet Our Team
  ...teamMembers.map((tm) => ({
    key: `team.${tm.slug}`,
    section: "Section 09B: Meet Our Team",
    label: `Team: ${tm.name} (${tm.role})`,
    defaultUrl: tm.image.src || EDITORIAL_IMAGES.introPeople,
  })),

  // Section 09B2: Customer Reviews & Guest Photos
  ...customerReviewsList.map((rev) => ({
    key: rev.image?.slotKey || `review.photo.${rev.id}`,
    section: "Section 09B2: Customer Reviews & Guest Photos",
    label: `Reviewer Photo: ${rev.guestName} (${rev.guestOrigin})`,
    defaultUrl: rev.image?.src || EDITORIAL_IMAGES.swahili,
  })),

  // Section 09C: Published Posters
  ...initialPublishedPosters.map((po) => ({
    key: `poster.${po.id}`,
    section: "Section 09C: Published Posters",
    label: `Poster: ${po.title}`,
    defaultUrl: po.image.src || EDITORIAL_IMAGES.arabukoForest,
  })),

  // Section 09D: Safari & Activity Gallery
  ...initialActivityGallery.map((ag) => ({
    key: `activity.${ag.id}`,
    section: "Section 09D: Tours & Travels Gallery",
    label: `Tours Gallery: ${ag.title} (${ag.location})`,
    defaultUrl: ag.image.src || EDITORIAL_IMAGES.arabukoForest,
  })),

  // Section 09: About
  {
    key: "about.heritage",
    section: "Section 09: About KayArabuko",
    label: "About Left Photo (Cultural Heritage)",
    defaultUrl: EDITORIAL_IMAGES.swahili,
  },
  {
    key: "about.forest",
    section: "Section 09: About KayArabuko",
    label: "About Right Photo (Arabuko-Sokoke Canopy)",
    defaultUrl: EDITORIAL_IMAGES.arabukoForest,
  },
];

const LOCAL_OVERRIDES_KEY = "kayarabuko_site_images_v1";
const LOCAL_TEXT_OVERRIDES_KEY = "kayarabuko_site_texts_v1";
const LOCAL_DELETED_SECTIONS_KEY = "kayarabuko_deleted_sections_v1";

export type SiteImageOverrides = Record<string, string>;
export type SiteTextOverrides = Record<string, string>;

export interface StorageLibraryImage {
  id: string;
  url: string;
  label: string;
  slotKey?: string;
  category: string;
  updatedAt?: string;
}

export function sanitizePublicLabel(
  raw: string | undefined | null,
  fallback: string = "Website Photograph"
): string {
  if (!raw) return fallback;
  const trimmed = raw.trim();
  if (!trimmed) return fallback;

  // Strip internal slot/poster prefixes or UUID strings
  if (/^poster\.poster-\d+-(\d+)$/i.test(trimmed)) {
    const match = trimmed.match(/^poster\.poster-\d+-(\d+)$/i);
    const num = match ? Number(match[1]) + 1 : 1;
    return `Published Poster ${String(num).padStart(2, "0")}`;
  }
  if (/^poster-\d+-(\d+)$/i.test(trimmed)) {
    const match = trimmed.match(/^poster-\d+-(\d+)$/i);
    const num = match ? Number(match[1]) + 1 : 1;
    return `Published Poster ${String(num).padStart(2, "0")}`;
  }
  if (/[0-9a-f]{4,}[\s_-]+[0-9a-f]{4,}/i.test(trimmed)) {
    return fallback;
  }
  if (trimmed.includes("::")) {
    return fallback;
  }
  if (/^[a-z]+\.[a-z0-9._-]+$/i.test(trimmed)) {
    return trimmed
      .replace(/^poster\.poster-\d+-?/i, "Published Poster ")
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return trimmed;
}

export function getInitialFirebaseStorageLibrary(): StorageLibraryImage[] {
  const seenUrls = new Set<string>();
  const list: StorageLibraryImage[] = [];

  for (const slot of SITE_IMAGE_SLOTS) {
    const url = SAVED_FIREBASE_IMAGE_OVERRIDES[slot.key] || slot.defaultUrl;
    if (url && url.includes("firebasestorage.googleapis.com") && !seenUrls.has(url)) {
      seenUrls.add(url);
      list.push({
        id: `slot-${slot.key}`,
        url,
        label: sanitizePublicLabel(slot.label, "Website Photograph"),
        slotKey: slot.key,
        category: slot.section,
      });
    }
  }

  for (const [slotKey, url] of Object.entries(SAVED_FIREBASE_IMAGE_OVERRIDES)) {
    if (url && url.includes("firebasestorage.googleapis.com") && !seenUrls.has(url)) {
      seenUrls.add(url);
      list.push({
        id: `override-${slotKey}`,
        url,
        label: sanitizePublicLabel(slotKey, "Published Poster"),
        slotKey,
        category: slotKey.startsWith("poster.")
          ? "Section 09C: Published Posters"
          : "Uploaded Media",
      });
    }
  }

  return list;
}

export function isFirebaseStorageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("blob.vercel-storage.com") ||
    (url.includes("firebasestorage.googleapis.com") &&
      url.includes("legaprimed.firebasestorage.app"))
  );
}

export class MediaService {
  /**
   * Retrieves brand media (logo, dark logo, poster, hero banner) from Firestore.
   * Path: organizations/{orgId}/settings/brand
   */
  static async getBrandMedia(
    orgId: string = DEFAULT_ORG_ID
  ): Promise<BrandMediaSettings | null> {
    const db = getFirebaseDb();
    if (!db) return null;
    try {
      const docRef = doc(db, `${orgPaths.root(orgId)}/settings`, "brand");
      const snap = await Promise.race([
        getDoc(docRef),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
      ]);
      if (snap && snap.exists()) {
        return snap.data() as BrandMediaSettings;
      }
    } catch (err) {
      console.warn("Could not fetch brand media from Firestore:", err);
    }
    return null;
  }

  /**
   * Saves logo and brand media URLs into Firestore (with 3s timeout so it never hangs).
   */
  static async saveBrandMedia(
    media: BrandMediaSettings,
    orgId: string = DEFAULT_ORG_ID
  ): Promise<boolean> {
    const db = getFirebaseDb();
    if (!db) return false;
    try {
      const docRef = doc(db, `${orgPaths.root(orgId)}/settings`, "brand");
      await Promise.race([
        setDoc(
          docRef,
          { ...media, updatedAt: new Date().toISOString() },
          { merge: true }
        ),
        new Promise((resolve) => setTimeout(resolve, 3000)),
      ]);
      return true;
    } catch (err) {
      console.error("Error saving brand media to Firestore:", err);
      return false;
    }
  }

  /**
   * Retrieves section-by-section website image overrides from `/api/media/site-images`
   * (Firestore + server disk JSON) and merges with browser localStorage.
   */
  static async getSiteImageOverrides(): Promise<SiteImageOverrides> {
    let localData: SiteImageOverrides = { ...SAVED_FIREBASE_IMAGE_OVERRIDES };
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(LOCAL_OVERRIDES_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as SiteImageOverrides;
          localData = { ...SAVED_FIREBASE_IMAGE_OVERRIDES, ...parsed };
        }
      } catch {
        // Ignore storage read error
      }
    }

    try {
      const res = await fetch("/api/media/site-images", {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const remote = (data.overrides || {}) as SiteImageOverrides;
        const merged: SiteImageOverrides = {
          ...SAVED_FIREBASE_IMAGE_OVERRIDES,
          ...localData,
          ...remote,
        };

        // Rescue any data:image/... base64 strings that were in localData before the fix
        let hasBase64ToRescue = false;
        for (const [k, v] of Object.entries(localData)) {
          if (typeof v === "string" && v.startsWith("data:image/")) {
            merged[k] = v;
            hasBase64ToRescue = true;
          }
        }

        if (
          hasBase64ToRescue &&
          Object.keys(getAdminRequestHeaders()).length > 0
        ) {
          return await this.saveSiteImageOverrides(merged);
        }

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(
              LOCAL_OVERRIDES_KEY,
              JSON.stringify(merged)
            );
          } catch {
            // Ignore localStorage quota warning
          }
        }
        return merged;
      }
    } catch (err) {
      console.warn("Could not fetch /api/media/site-images:", err);
    }
    return localData;
  }

  /**
   * Saves section-by-section website image overrides via `/api/media/site-images`
   * (uploading any remaining data: URLs to Firebase Storage, writing to disk & Firestore)
   * and updates localStorage with the resulting Firebase Storage URLs.
   */
  static async saveSiteImageOverrides(
    overrides: SiteImageOverrides
  ): Promise<SiteImageOverrides> {
    const res = await fetch("/api/media/site-images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminRequestHeaders(),
      },
      body: JSON.stringify({ overrides, replaceAll: true }),
    });
    const data = await res.json();
    const savedOverrides = (data.overrides || overrides) as SiteImageOverrides;

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          LOCAL_OVERRIDES_KEY,
          JSON.stringify(savedOverrides)
        );
      } catch {
        // Ignore localStorage error
      }
    }

    return savedOverrides;
  }

  /**
   * Uploads a local File object to Firebase Storage (`kayarabuko_website/...`) via `/api/media/upload`,
   * immediately persists the slot override to disk & Firestore, and returns the Firebase Storage URL.
   */
  static async uploadWebsiteImage(file: File, slotKey: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("slotKey", slotKey);

    const response = await fetch("/api/media/upload", {
      method: "POST",
      headers: {
        ...getAdminRequestHeaders(),
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok || !data.url) {
      throw new Error(
        data.error || "Failed to upload image."
      );
    }

    // Update localStorage immediately so even an instant refresh keeps the new URL
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(LOCAL_OVERRIDES_KEY);
        const existing = raw ? (JSON.parse(raw) as SiteImageOverrides) : {};
        existing[slotKey] = data.url;
        window.localStorage.setItem(
          LOCAL_OVERRIDES_KEY,
          JSON.stringify(existing)
        );
      } catch {
        // Ignore localStorage error
      }
    }

    return data.url as string;
  }

  /**
   * Ensures a given URL (external HTTP link or data:image base64 URL) is uploaded to Firebase Storage
   * (`legaprimed.firebasestorage.app`), persisted to disk & Firestore, and returns the Storage URL.
   */
  static async ensureInFirebaseStorage(
    sourceUrl: string,
    slotKey: string
  ): Promise<string> {
    const clean = sourceUrl.trim();
    if (!clean) {
      throw new Error("Image URL is empty.");
    }

    const res = await fetch("/api/media/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminRequestHeaders(),
      },
      body: JSON.stringify({ sourceUrl: clean, slotKey }),
    });
    const data = await res.json();
    if (!res.ok || !data.url) {
      throw new Error(
        data.error || "Could not upload image."
      );
    }

    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(LOCAL_OVERRIDES_KEY);
        const existing = raw ? (JSON.parse(raw) as SiteImageOverrides) : {};
        existing[slotKey] = data.url;
        window.localStorage.setItem(
          LOCAL_OVERRIDES_KEY,
          JSON.stringify(existing)
        );
      } catch {
        // Ignore localStorage error
      }
    }

    return data.url as string;
  }

  /**
   * Uploads/mirrors a single slot's image to Firebase Storage and saves it to Firestore & disk.
   * Returns the permanent Firebase Storage download URL and updated overrides map.
   */
  static async saveSingleSlotToFirebase(
    slotKey: string,
    candidateUrl: string,
    currentOverrides: SiteImageOverrides
  ): Promise<{ storageUrl: string; updatedOverrides: SiteImageOverrides }> {
    const storageUrl = await this.ensureInFirebaseStorage(
      candidateUrl,
      slotKey
    );
    const updatedOverrides: SiteImageOverrides = {
      ...currentOverrides,
      [slotKey]: storageUrl,
    };
    return { storageUrl, updatedOverrides };
  }

  /**
   * Retrieves all gallery image links from Firestore.
   * Path: organizations/{orgId}/gallery
   */
  static async getGalleryMedia(
    orgId: string = DEFAULT_ORG_ID
  ): Promise<GalleryMediaItem[]> {
    const db = getFirebaseDb();
    if (!db) return [];
    try {
      const colRef = collection(db, orgPaths.gallery(orgId));
      const snap = await getDocs(colRef);
      const items: GalleryMediaItem[] = [];
      snap.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as GalleryMediaItem);
      });
      return items;
    } catch (err) {
      console.warn("Could not fetch gallery media from Firestore:", err);
      return [];
    }
  }

  /**
   * Saves an image reference with its storage download URL to Firestore.
   */
  static async saveGalleryItem(
    item: GalleryMediaItem,
    orgId: string = DEFAULT_ORG_ID
  ): Promise<boolean> {
    const db = getFirebaseDb();
    if (!db) return false;
    try {
      const docRef = doc(db, orgPaths.gallery(orgId), item.id);
      await setDoc(docRef, item, { merge: true });
      return true;
    } catch (err) {
      console.error("Error saving gallery item to Firestore:", err);
      return false;
    }
  }

  /**
   * Retrieves published posters list from `/api/media/posters` (server disk + Firestore).
   */
  static async getPublishedPosters(): Promise<PublishedPoster[]> {
    try {
      const res = await fetch("/api/media/posters", {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.posters) && data.posters.length > 0) {
          return data.posters as PublishedPoster[];
        }
      }
    } catch (err) {
      console.warn("Could not fetch published posters:", err);
    }
    return initialPublishedPosters;
  }

  /**
   * Saves published posters list via `/api/media/posters` (server disk + Firestore).
   */
  static async savePublishedPosters(
    posters: PublishedPoster[]
  ): Promise<PublishedPoster[]> {
    const db = getFirebaseDb();
    if (db) {
      try {
        const docRef = doc(
          db,
          `organizations/${DEFAULT_ORG_ID}/settings`,
          "posters"
        );
        await setDoc(
          docRef,
          {
            updatedAt: new Date().toISOString(),
            postersJson: JSON.stringify(posters),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn("Client Firestore setDoc posters warning:", e);
      }
    }

    const res = await fetch("/api/media/posters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminRequestHeaders(),
      },
      body: JSON.stringify({ posters }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to save published posters.");
    }
    return (data.posters || posters) as PublishedPoster[];
  }

  /**
   * Retrieves Safari & Activity Gallery items from `/api/media/activity-gallery` (server disk + Firestore).
   */
  static async getActivityGallery(): Promise<ActivityGalleryItem[]> {
    try {
      const res = await fetch("/api/media/activity-gallery", {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          return data.items as ActivityGalleryItem[];
        }
      }
    } catch (err) {
      console.warn("Could not fetch activity gallery:", err);
    }
    return initialActivityGallery;
  }

  /**
   * Saves Safari & Activity Gallery items via `/api/media/activity-gallery` (server disk + Firestore).
   */
  static async saveActivityGallery(
    items: ActivityGalleryItem[]
  ): Promise<ActivityGalleryItem[]> {
    const db = getFirebaseDb();
    if (db) {
      try {
        const docRef = doc(
          db,
          `organizations/${DEFAULT_ORG_ID}/settings`,
          "activityGallery"
        );
        await setDoc(
          docRef,
          {
            updatedAt: new Date().toISOString(),
            itemsJson: JSON.stringify(items),
          },
          { merge: true }
        );
      } catch (e) {
        console.warn("Client Firestore setDoc activityGallery warning:", e);
      }
    }

    const res = await fetch("/api/media/activity-gallery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminRequestHeaders(),
      },
      body: JSON.stringify({ items }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to save activity gallery.");
    }
    return (data.items || items) as ActivityGalleryItem[];
  }

  /**
   * Retrieves visual quick-edit text overrides from `/api/media/site-content` (Firestore + server disk)
   * and merges with browser localStorage.
   */
  static async getSiteTextOverrides(): Promise<SiteTextOverrides> {
    let localTexts: SiteTextOverrides = {};
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(LOCAL_TEXT_OVERRIDES_KEY);
        if (raw) {
          localTexts = JSON.parse(raw) as SiteTextOverrides;
        }
      } catch {
        // Ignore storage read error
      }
    }

    try {
      const res = await fetch("/api/media/site-content", {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const remote = (data.texts || {}) as SiteTextOverrides;
        const merged: SiteTextOverrides = { ...localTexts, ...remote };
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(
              LOCAL_TEXT_OVERRIDES_KEY,
              JSON.stringify(merged)
            );
          } catch {
            // Ignore quota error
          }
        }
        return merged;
      }
    } catch (err) {
      console.warn("Could not fetch /api/media/site-content:", err);
    }
    return localTexts;
  }

  /**
   * Saves visual quick-edit text overrides to `/api/media/site-content` (Firestore + server disk).
   */
  static async saveSiteTextOverrides(
    texts: SiteTextOverrides,
    replaceAll: boolean = false
  ): Promise<SiteTextOverrides> {
    const res = await fetch("/api/media/site-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminRequestHeaders(),
      },
      body: JSON.stringify({ texts, replaceAll }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to save text edits.");
    }
    const saved = (data.texts || texts) as SiteTextOverrides;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          LOCAL_TEXT_OVERRIDES_KEY,
          JSON.stringify(saved)
        );
      } catch {
        // Ignore localStorage error
      }
    }
    return saved;
  }

  /**
   * Retrieves the list of deleted website section IDs (and card/block keys) from `/api/media/site-content`
   * (Firestore + server disk + localStorage).
   */
  static async getSiteDeletedSections(): Promise<string[]> {
    let localDeleted: string[] = [];
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(LOCAL_DELETED_SECTIONS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            localDeleted = (parsed as string[]).filter(
              (id) => id !== "card::team::2" && id !== "gallery"
            );
          }
        }
      } catch {
        // Ignore storage read error
      }
    }

    try {
      const res = await fetch("/api/media/site-content", {
        method: "GET",
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const remote = Array.isArray(data.deletedSections)
          ? (data.deletedSections as string[]).filter(
              (id) => id !== "card::team::2" && id !== "gallery"
            )
          : localDeleted;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(
              LOCAL_DELETED_SECTIONS_KEY,
              JSON.stringify(remote)
            );
          } catch {
            // Ignore quota error
          }
        }
        return remote;
      }
    } catch (err) {
      console.warn("Could not fetch deletedSections:", err);
    }
    return localDeleted;
  }

  /**
   * Saves the list of deleted website section IDs (and card/block keys) to `/api/media/site-content`
   * (Firestore + server disk + localStorage).
   */
  static async saveSiteDeletedSections(
    deletedSections: string[]
  ): Promise<string[]> {
    const res = await fetch("/api/media/site-content", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAdminRequestHeaders(),
      },
      body: JSON.stringify({ deletedSections }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.error || "Failed to save deleted sections."
      );
    }
    const saved = Array.isArray(data.deletedSections)
      ? (data.deletedSections as string[])
      : deletedSections;

    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          LOCAL_DELETED_SECTIONS_KEY,
          JSON.stringify(saved)
        );
      } catch {
        // Ignore localStorage error
      }
    }
    return saved;
  }

  /**
   * Retrieves all images uploaded to Firebase Storage (from `/api/media/storage-library`
   * merged with `getInitialFirebaseStorageLibrary()`), so the user can select any existing
   * Firebase Storage image or upload a new one from their computer.
   */
  static async getFirebaseStorageLibrary(): Promise<StorageLibraryImage[]> {
    const initial = getInitialFirebaseStorageLibrary();
    const adminHeaders = getAdminRequestHeaders();
    if (Object.keys(adminHeaders).length === 0) {
      return initial;
    }
    try {
      const res = await fetch("/api/media/storage-library", {
        method: "GET",
        headers: adminHeaders,
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        const remote = Array.isArray(data.images)
          ? (data.images as StorageLibraryImage[])
          : [];
        if (remote.length > 0) {
          const seen = new Set<string>();
          const combined: StorageLibraryImage[] = [];
          for (const item of [...initial, ...remote]) {
            if (item.url && !seen.has(item.url)) {
              seen.add(item.url);
              combined.push(item);
            }
          }
          return combined;
        }
      }
    } catch (err) {
      console.warn("Could not fetch /api/media/storage-library:", err);
    }
    return initial;
  }
}
