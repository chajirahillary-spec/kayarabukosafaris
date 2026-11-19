import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { verifyAdminApiRequest } from "@/lib/firebase/adminApiGuard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET =
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
  "legaprimed.firebasestorage.app";

export interface StorageLibraryImage {
  id: string;
  url: string;
  label: string;
  slotKey?: string;
  category: string;
  updatedAt?: string;
}

function inferCategoryFromSlot(slotOrName: string): string {
  const s = slotOrName.toLowerCase();
  if (s.includes("hero") || s.includes("intro")) return "Hero & Introduction";
  if (s.includes("pillar") || s.includes("community") || s.includes("maasai") || s.includes("samburu") || s.includes("turkana") || s.includes("mijikenda") || s.includes("swahili")) {
    return "Cultures & Pillars";
  }
  if (s.includes("conservation") || s.includes("ecosystem") || s.includes("arabuko") || s.includes("mangrove")) {
    return "Conservation & Forests";
  }
  if (s.includes("region") || s.includes("experience") || s.includes("excursion") || s.includes("accommodation") || s.includes("kayaroots")) {
    return "Regions, Trips & Stays";
  }
  if (s.includes("story") || s.includes("about") || s.includes("team")) {
    return "Stories, About & Team";
  }
  if (s.includes("poster")) {
    return "Published Posters";
  }
  if (s.includes("activity") || s.includes("gallery")) {
    return "Safari & Activity Gallery";
  }
  return "Uploaded Media";
}

function isUuidLike(text: string): boolean {
  return /[0-9a-f]{4,}[\s_-]+[0-9a-f]{4,}/i.test(text);
}

function formatFriendlyLabel(rawKey: string, indexFallback?: number): string {
  const cleaned = rawKey
    .replace(/^kayarabuko_website\//i, "")
    .replace(/^poster\.poster-\d+-?/i, "Published Poster ")
    .replace(/\.[a-z0-9]{3,5}$/i, "")
    .replace(/_17\d{11,}.*$/, "")
    .replace(/[._-]+/g, " ")
    .trim();
  if (!cleaned || isUuidLike(cleaned)) {
    return indexFallback
      ? `Website Photograph ${indexFallback}`
      : "Website Photograph";
  }
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractStorageObjectPath(url: string): string {
  const match = url.match(/\/o\/([^?]+)/);
  return match ? decodeURIComponent(match[1]) : url;
}

export async function GET(req: Request) {
  const authErr = verifyAdminApiRequest(req);
  if (authErr) return authErr;

  const byObjectPath = new Map<string, StorageLibraryImage>();

  const addEntry = (entry: StorageLibraryImage) => {
    if (!entry.url || !entry.url.includes("firebasestorage.googleapis.com")) {
      return;
    }
    const objKey = extractStorageObjectPath(entry.url);
    const existing = byObjectPath.get(objKey);
    if (!existing) {
      byObjectPath.set(objKey, entry);
    } else if (entry.url.includes("token=") && !existing.url.includes("token=")) {
      byObjectPath.set(objKey, { ...existing, url: entry.url });
    }
  };

  // 1. Read saved-site-images.json
  try {
    const siteImagesPath = path.join(
      process.cwd(),
      "data",
      "saved-site-images.json"
    );
    const raw = await fs.readFile(siteImagesPath, "utf8");
    const parsed = JSON.parse(raw);
    const overrides = (parsed.overrides || {}) as Record<string, string>;
    for (const [slotKey, url] of Object.entries(overrides)) {
      if (typeof url === "string") {
        addEntry({
          id: `slot-${slotKey}`,
          url,
          label: formatFriendlyLabel(slotKey),
          slotKey,
          category: inferCategoryFromSlot(slotKey),
          updatedAt: parsed.updatedAt,
        });
      }
    }
  } catch {
    // Ignore if missing
  }

  // 2. Read saved-posters.json
  try {
    const postersPath = path.join(process.cwd(), "data", "saved-posters.json");
    const raw = await fs.readFile(postersPath, "utf8");
    const parsed = JSON.parse(raw);
    const posters = Array.isArray(parsed.posters) ? parsed.posters : [];
    for (let idx = 0; idx < posters.length; idx++) {
      const p = posters[idx];
      const url = p?.image?.src;
      if (typeof url === "string") {
        const cleanTitle =
          p.title && !isUuidLike(p.title)
            ? p.title
            : `Published Poster ${String(idx + 1).padStart(2, "0")}`;
        addEntry({
          id: `poster-${p.id}`,
          url,
          label: cleanTitle,
          slotKey: `poster.${p.id}`,
          category: "Published Posters",
          updatedAt: parsed.updatedAt,
        });
      }
    }
  } catch {
    // Ignore if missing
  }

  // 3. Read saved-activity-gallery.json
  try {
    const galleryPath = path.join(
      process.cwd(),
      "data",
      "saved-activity-gallery.json"
    );
    const raw = await fs.readFile(galleryPath, "utf8");
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    for (const item of items) {
      const url = item?.image?.src;
      if (typeof url === "string") {
        addEntry({
          id: `activity-${item.id}`,
          url,
          label: item.title ? `Activity: ${item.title}` : "Activity Photo",
          slotKey: `activity.${item.id}`,
          category: "Safari & Activity Gallery",
          updatedAt: parsed.updatedAt,
        });
      }
    }
  } catch {
    // Ignore if missing
  }

  // 4. Query live Firebase Storage bucket for any additional uploaded files
  try {
    const listUrl = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o?prefix=${encodeURIComponent(
      "kayarabuko_website/"
    )}&maxResults=250`;
    const res = await fetch(listUrl, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      for (const obj of items) {
        const name = obj?.name as string | undefined;
        if (!name) continue;
        const token =
          typeof obj.downloadTokens === "string" && obj.downloadTokens
            ? obj.downloadTokens.split(",")[0]
            : "";
        const url = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(
          name
        )}?alt=media${token ? `&token=${token}` : ""}`;
        addEntry({
          id: `storage-${name}`,
          url,
          label: formatFriendlyLabel(name),
          category: inferCategoryFromSlot(name),
          updatedAt: obj.updated || obj.timeCreated,
        });
      }
    }
  } catch {
    // Non-fatal if bucket listing is restricted or times out; saved JSON entries are already included
  }

  const images = Array.from(byObjectPath.values());
  return NextResponse.json({
    images,
    count: images.length,
  });
}
