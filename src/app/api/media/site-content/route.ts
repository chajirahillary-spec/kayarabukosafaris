import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { DEFAULT_ORG_ID, firebaseConfig } from "@/lib/firebase/config";
import { verifyAdminApiRequest } from "@/lib/firebase/adminApiGuard";

const LOCAL_CONTENT_PATH = path.join(
  process.cwd(),
  "data",
  "saved-site-content.json"
);

const FIRESTORE_CONTENT_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/organizations/${DEFAULT_ORG_ID}/settings/visualContent`;

interface SiteVisualContentPayload {
  texts: Record<string, string>;
  deletedSections: string[];
}

function readLocalContent(): SiteVisualContentPayload {
  try {
    if (fs.existsSync(LOCAL_CONTENT_PATH)) {
      const raw = fs.readFileSync(LOCAL_CONTENT_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        texts:
          parsed && typeof parsed.texts === "object" && parsed.texts !== null
            ? (parsed.texts as Record<string, string>)
            : {},
        deletedSections: Array.isArray(parsed?.deletedSections)
          ? (parsed.deletedSections as string[])
          : [],
      };
    }
  } catch (e) {
    console.warn("Could not read local saved-site-content.json:", e);
  }
  return { texts: {}, deletedSections: [] };
}

function writeLocalContent(payload: SiteVisualContentPayload) {
  try {
    const dir = path.dirname(LOCAL_CONTENT_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_CONTENT_PATH,
      JSON.stringify(
        {
          texts: payload.texts,
          deletedSections: payload.deletedSections,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf-8"
    );
  } catch (e) {
    console.warn("Could not write local saved-site-content.json:", e);
  }
}

async function readFirestoreContent(): Promise<SiteVisualContentPayload> {
  try {
    const res = await fetch(FIRESTORE_CONTENT_URL, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) return { texts: {}, deletedSections: [] };
    const data = await res.json();
    const textsStr = data?.fields?.textsJson?.stringValue;
    const deletedStr = data?.fields?.deletedSectionsJson?.stringValue;

    let texts: Record<string, string> = {};
    let deletedSections: string[] = [];

    if (typeof textsStr === "string" && textsStr.trim()) {
      const parsed = JSON.parse(textsStr);
      if (parsed && typeof parsed === "object") {
        texts = parsed as Record<string, string>;
      }
    }
    if (typeof deletedStr === "string" && deletedStr.trim()) {
      const parsed = JSON.parse(deletedStr);
      if (Array.isArray(parsed)) {
        deletedSections = parsed as string[];
      }
    }

    return { texts, deletedSections };
  } catch (e) {
    console.warn("Firestore REST visualContent read warning:", e);
    return { texts: {}, deletedSections: [] };
  }
}

async function writeFirestoreContent(
  payload: SiteVisualContentPayload
): Promise<boolean> {
  try {
    const res = await fetch(FIRESTORE_CONTENT_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          updatedAt: { stringValue: new Date().toISOString() },
          textsJson: { stringValue: JSON.stringify(payload.texts) },
          deletedSectionsJson: {
            stringValue: JSON.stringify(payload.deletedSections),
          },
        },
      }),
    });
    return res.ok;
  } catch (e) {
    console.warn("Firestore REST visualContent write warning:", e);
    return false;
  }
}

export async function GET() {
  const [diskData, firestoreData] = await Promise.all([
    Promise.resolve(readLocalContent()),
    readFirestoreContent(),
  ]);

  const mergedTexts: Record<string, string> = {
    ...firestoreData.texts,
    ...diskData.texts,
  };

  // Prefer disk deletedSections if present, otherwise firestore
  const hasDiskFile = fs.existsSync(LOCAL_CONTENT_PATH);
  const mergedDeletedSections = (
    hasDiskFile ? diskData.deletedSections : firestoreData.deletedSections
  ).filter(
    (id) =>
      id !== "card::team::2" && id !== "gallery" && id !== "card::reviews::2"
  );

  const mergedPayload: SiteVisualContentPayload = {
    texts: mergedTexts,
    deletedSections: mergedDeletedSections,
  };

  if (
    !hasDiskFile &&
    (Object.keys(mergedTexts).length > 0 || mergedDeletedSections.length > 0)
  ) {
    writeLocalContent(mergedPayload);
  }

  return NextResponse.json({
    success: true,
    texts: mergedTexts,
    deletedSections: mergedDeletedSections,
  });
}

export async function POST(req: Request) {
  const authErr = verifyAdminApiRequest(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const existing = readLocalContent();

    const replaceAll = Boolean(body.replaceAll);
    const incomingTexts =
      body.texts && typeof body.texts === "object"
        ? (body.texts as Record<string, string>)
        : {};

    const mergedTexts: Record<string, string> = replaceAll
      ? { ...incomingTexts }
      : {
          ...existing.texts,
          ...incomingTexts,
        };

    for (const [k, v] of Object.entries(mergedTexts)) {
      if (v === "__RESET__") {
        delete mergedTexts[k];
      }
    }

    const mergedDeletedSections: string[] = Array.isArray(body.deletedSections)
      ? Array.from(new Set(body.deletedSections as string[]))
      : existing.deletedSections;

    const payload: SiteVisualContentPayload = {
      texts: mergedTexts,
      deletedSections: mergedDeletedSections,
    };

    writeLocalContent(payload);
    await writeFirestoreContent(payload);

    return NextResponse.json({
      success: true,
      texts: mergedTexts,
      deletedSections: mergedDeletedSections,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to save site text content.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
