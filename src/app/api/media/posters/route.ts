import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_ORG_ID, firebaseConfig } from "@/lib/firebase/config";
import { initialPublishedPosters } from "@/data/content";
import type { PublishedPoster } from "@/lib/types";
import { verifyAdminApiRequest } from "@/lib/firebase/adminApiGuard";

const LOCAL_POSTERS_PATH = path.join(
  process.cwd(),
  "data",
  "saved-posters.json"
);

const FIRESTORE_POSTERS_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/organizations/${DEFAULT_ORG_ID}/settings/posters`;

function readLocalPosters(): PublishedPoster[] | null {
  try {
    if (fs.existsSync(LOCAL_POSTERS_PATH)) {
      const raw = fs.readFileSync(LOCAL_POSTERS_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.posters)) {
        return parsed.posters as PublishedPoster[];
      }
    }
  } catch (e) {
    console.warn("Could not read local saved-posters.json:", e);
  }
  return null;
}

function writeLocalPosters(posters: PublishedPoster[]) {
  try {
    const dir = path.dirname(LOCAL_POSTERS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_POSTERS_PATH,
      JSON.stringify(
        {
          posters,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf-8"
    );
  } catch (e) {
    console.warn("Could not write local saved-posters.json:", e);
  }
}

async function readFirestorePosters(): Promise<PublishedPoster[] | null> {
  try {
    const res = await fetch(FIRESTORE_POSTERS_URL, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const jsonStr = data?.fields?.postersJson?.stringValue;
    if (typeof jsonStr === "string" && jsonStr.trim()) {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed)) return parsed as PublishedPoster[];
    }
  } catch (e) {
    console.warn("Firestore REST posters read warning:", e);
  }
  return null;
}

async function writeFirestorePosters(posters: PublishedPoster[]): Promise<void> {
  try {
    await fetch(FIRESTORE_POSTERS_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          updatedAt: { stringValue: new Date().toISOString() },
          postersJson: { stringValue: JSON.stringify(posters) },
        },
      }),
    });
  } catch (e) {
    console.warn("Firestore REST posters write warning:", e);
  }
}

function sanitizePostersList(posters: PublishedPoster[]): PublishedPoster[] {
  return posters.map((p, idx) => {
    const isUuidTitle =
      !p.title || /[0-9a-f]{4,}[\s_-]+[0-9a-f]{4,}/i.test(p.title);
    const cleanTitle = isUuidTitle
      ? `Published Poster ${String(idx + 1).padStart(2, "0")}`
      : p.title;
    const isUuidAlt =
      !p.image?.alt || /[0-9a-f]{4,}[\s_-]+[0-9a-f]{4,}/i.test(p.image.alt);
    return {
      ...p,
      title: cleanTitle,
      image: {
        ...p.image,
        alt: isUuidAlt ? cleanTitle : p.image.alt,
      },
    };
  });
}

export async function GET() {
  const [diskPosters, remotePosters] = await Promise.all([
    Promise.resolve(readLocalPosters()),
    readFirestorePosters(),
  ]);

  const rawPosters = diskPosters || remotePosters || initialPublishedPosters;
  const posters = sanitizePostersList(rawPosters);
  if (!diskPosters && remotePosters) {
    writeLocalPosters(posters);
  }

  return NextResponse.json({
    success: true,
    posters,
  });
}

export async function POST(req: Request) {
  const authErr = verifyAdminApiRequest(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const posters = Array.isArray(body.posters)
      ? (body.posters as PublishedPoster[])
      : initialPublishedPosters;

    writeLocalPosters(posters);
    await writeFirestorePosters(posters);

    return NextResponse.json({
      success: true,
      posters,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to save posters.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
