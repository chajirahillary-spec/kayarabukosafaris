import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_ORG_ID, firebaseConfig } from "@/lib/firebase/config";
import { initialActivityGallery } from "@/data/content";
import type { ActivityGalleryItem } from "@/lib/types";
import { verifyAdminApiRequest } from "@/lib/firebase/adminApiGuard";

const LOCAL_GALLERY_PATH = path.join(
  process.cwd(),
  "data",
  "saved-activity-gallery.json"
);

const FIRESTORE_GALLERY_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/organizations/${DEFAULT_ORG_ID}/settings/activityGallery`;

function readLocalActivityGallery(): ActivityGalleryItem[] | null {
  try {
    if (fs.existsSync(LOCAL_GALLERY_PATH)) {
      const raw = fs.readFileSync(LOCAL_GALLERY_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        return parsed.items as ActivityGalleryItem[];
      }
    }
  } catch (e) {
    console.warn("Could not read local saved-activity-gallery.json:", e);
  }
  return null;
}

function writeLocalActivityGallery(items: ActivityGalleryItem[]) {
  try {
    const dir = path.dirname(LOCAL_GALLERY_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_GALLERY_PATH,
      JSON.stringify(
        {
          items,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf-8"
    );
  } catch (e) {
    console.warn("Could not write local saved-activity-gallery.json:", e);
  }
}

async function readFirestoreActivityGallery(): Promise<
  ActivityGalleryItem[] | null
> {
  try {
    const res = await fetch(FIRESTORE_GALLERY_URL, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const jsonStr = data?.fields?.itemsJson?.stringValue;
    if (typeof jsonStr === "string" && jsonStr.trim()) {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return parsed as ActivityGalleryItem[];
    }
  } catch (e) {
    console.warn("Firestore REST activityGallery read warning:", e);
  }
  return null;
}

async function writeFirestoreActivityGallery(
  items: ActivityGalleryItem[]
): Promise<void> {
  try {
    await fetch(FIRESTORE_GALLERY_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          updatedAt: { stringValue: new Date().toISOString() },
          itemsJson: { stringValue: JSON.stringify(items) },
        },
      }),
    });
  } catch (e) {
    console.warn("Firestore REST activityGallery write warning:", e);
  }
}

export async function GET() {
  const [diskItems, remoteItems] = await Promise.all([
    Promise.resolve(readLocalActivityGallery()),
    readFirestoreActivityGallery(),
  ]);

  const savedItems = diskItems !== null ? diskItems : remoteItems;
  const items: ActivityGalleryItem[] =
    savedItems !== null ? savedItems : initialActivityGallery;

  return NextResponse.json({
    success: true,
    items,
  });
}

export async function POST(req: Request) {
  const authErr = verifyAdminApiRequest(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const items = Array.isArray(body.items)
      ? (body.items as ActivityGalleryItem[])
      : initialActivityGallery;

    writeLocalActivityGallery(items);
    await writeFirestoreActivityGallery(items);

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to save safari activity gallery.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
