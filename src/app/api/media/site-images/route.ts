import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DEFAULT_ORG_ID, firebaseConfig } from "@/lib/firebase/config";
import { verifyAdminApiRequest } from "@/lib/firebase/adminApiGuard";

const LOCAL_JSON_PATH = path.join(
  process.cwd(),
  "data",
  "saved-site-images.json"
);

const FIRESTORE_DOC_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/organizations/${DEFAULT_ORG_ID}/settings/siteImages`;

function readLocalDiskOverrides(): Record<string, string> {
  try {
    if (fs.existsSync(LOCAL_JSON_PATH)) {
      const raw = fs.readFileSync(LOCAL_JSON_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.overrides === "object") {
        return parsed.overrides as Record<string, string>;
      }
    }
  } catch (e) {
    console.warn("Could not read local saved-site-images.json:", e);
  }
  return {};
}

function writeLocalDiskOverrides(overrides: Record<string, string>) {
  try {
    const dir = path.dirname(LOCAL_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      LOCAL_JSON_PATH,
      JSON.stringify(
        {
          overrides,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf-8"
    );
  } catch (e) {
    console.warn("Could not write local saved-site-images.json:", e);
  }
}

async function readFirestoreRestOverrides(): Promise<Record<string, string>> {
  try {
    const res = await fetch(FIRESTORE_DOC_URL, {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) return {};
    const data = await res.json();
    const mapFields = data?.fields?.overrides?.mapValue?.fields || {};
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(mapFields)) {
      const strVal = (v as { stringValue?: string })?.stringValue;
      if (typeof strVal === "string" && strVal.trim()) {
        out[k] = strVal.trim();
      }
    }
    return out;
  } catch (e) {
    console.warn("Firestore REST read warning:", e);
    return {};
  }
}

async function writeFirestoreRestOverrides(
  overrides: Record<string, string>
): Promise<void> {
  try {
    const mapFields: Record<string, { stringValue: string }> = {};
    for (const [k, v] of Object.entries(overrides)) {
      if (typeof v === "string" && v.trim()) {
        mapFields[k] = { stringValue: v.trim() };
      }
    }

    await fetch(FIRESTORE_DOC_URL, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          updatedAt: { stringValue: new Date().toISOString() },
          overrides: {
            mapValue: {
              fields: mapFields,
            },
          },
        },
      }),
    });
  } catch (e) {
    console.warn("Firestore REST write warning:", e);
  }
}

async function uploadDataUrlToStorage(
  dataUrl: string,
  slotKey: string
): Promise<string> {
  const storage = getFirebaseStorage();
  if (!storage) {
    throw new Error("Firebase Storage not initialized.");
  }
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data:image base64 format.");
  }
  const mimeType = match[1];
  const base64Data = match[2];
  const buffer = Buffer.from(base64Data, "base64");
  const ext = mimeType.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const safeKey = slotKey.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `kayarabuko_website/${safeKey}_${Date.now()}.${ext}`;
  const storageRef = ref(storage, storagePath);

  await uploadBytes(storageRef, buffer, { contentType: mimeType });
  return await getDownloadURL(storageRef);
}

export async function GET() {
  const [diskOverrides, firestoreOverrides] = await Promise.all([
    Promise.resolve(readLocalDiskOverrides()),
    readFirestoreRestOverrides(),
  ]);

  // Disk overrides have the most recent local writes, merged on top of Firestore
  const merged = { ...firestoreOverrides, ...diskOverrides };

  // Keep disk and Firestore in sync
  if (Object.keys(merged).length > Object.keys(diskOverrides).length) {
    writeLocalDiskOverrides(merged);
  }

  return NextResponse.json({
    success: true,
    overrides: merged,
  });
}

export async function POST(req: Request) {
  const authErr = verifyAdminApiRequest(req);
  if (authErr) return authErr;

  try {
    const body = await req.json();
    const incoming = (body.overrides || {}) as Record<string, string>;
    const existing = readLocalDiskOverrides();

    const merged: Record<string, string> = body.replaceAll
      ? { ...incoming }
      : { ...existing, ...incoming };

    const finalOverrides: Record<string, string> = {};

    // Convert any data:image/... base64 URLs into permanent Storage URLs
    for (const [key, val] of Object.entries(merged)) {
      if (typeof val !== "string" || !val.trim() || val.trim() === "__RESET__") {
        continue;
      }
      const trimmed = val.trim();
      if (trimmed.startsWith("data:image/")) {
        const storageUrl = await uploadDataUrlToStorage(trimmed, key);
        finalOverrides[key] = storageUrl;
      } else {
        finalOverrides[key] = trimmed;
      }
    }

    // 1. Save immediately to local disk JSON so page refreshes never lose data
    writeLocalDiskOverrides(finalOverrides);

    // 2. Save immediately to Firestore via fast REST PATCH
    await writeFirestoreRestOverrides(finalOverrides);

    return NextResponse.json({
      success: true,
      overrides: finalOverrides,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to save website images.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
