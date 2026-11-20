import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { DEFAULT_ORG_ID, firebaseConfig } from "@/lib/firebase/config";
import {
  verifyAdminApiRequest,
  isSafeExternalImageUrl,
} from "@/lib/firebase/adminApiGuard";

const LOCAL_JSON_PATH = path.join(
  process.cwd(),
  "data",
  "saved-site-images.json"
);

const FIRESTORE_DOC_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/organizations/${DEFAULT_ORG_ID}/settings/siteImages`;

function persistSlotOverrideToDisk(rawSlotKey: string, downloadUrl: string) {
  try {
    const dir = path.dirname(LOCAL_JSON_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    let existing: Record<string, string> = {};
    if (fs.existsSync(LOCAL_JSON_PATH)) {
      const raw = fs.readFileSync(LOCAL_JSON_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.overrides === "object") {
        existing = parsed.overrides as Record<string, string>;
      }
    }
    existing[rawSlotKey] = downloadUrl;
    fs.writeFileSync(
      LOCAL_JSON_PATH,
      JSON.stringify(
        {
          overrides: existing,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf-8"
    );
    return existing;
  } catch (e) {
    console.warn("Could not persist slot override to disk:", e);
    return { [rawSlotKey]: downloadUrl };
  }
}

async function persistSlotToFirestore(allOverrides: Record<string, string>) {
  try {
    const mapFields: Record<string, { stringValue: string }> = {};
    for (const [k, v] of Object.entries(allOverrides)) {
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
    console.warn("Firestore REST sync warning in /api/media/upload:", e);
  }
}

async function uploadBufferToStorage(
  storagePath: string,
  buffer: Uint8Array | Buffer,
  mimeType: string
): Promise<string> {
  // 1. Prioritize Vercel Blob if token is set
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const bodyBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
    const blob = await put(storagePath, bodyBuffer, {
      access: "public",
      contentType: mimeType,
    });
    return blob.url;
  }

  // 2. Fallback to Firebase Storage
  const storage = getFirebaseStorage();
  if (storage) {
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, buffer, { contentType: mimeType });
    return await getDownloadURL(storageRef);
  }

  throw new Error("No media storage provider available (neither Vercel Blob nor Firebase Storage).");
}

export async function POST(req: Request) {
  const authErr = verifyAdminApiRequest(req);
  if (authErr) return authErr;

  try {
    const contentTypeHeader = req.headers.get("content-type") || "";

    // Case 1: Multipart FormData file upload from "Upload Photo" button
    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      const rawSlotKey = String(formData.get("slotKey") || "image");
      const safeSlotKey = rawSlotKey.replace(/[^a-zA-Z0-9._-]/g, "_");

      if (!file) {
        return NextResponse.json(
          { error: "No image file provided." },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const mimeType = file.type || "image/jpeg";
      const ext = mimeType.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "jpg";
      const safeName = file.name
        ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
        : `${safeSlotKey}.${ext}`;

      const storagePath = `kayarabuko_website/${safeSlotKey}_${Date.now()}_${safeName}`;
      const downloadUrl = await uploadBufferToStorage(storagePath, buffer, mimeType);

      const allOverrides = persistSlotOverrideToDisk(rawSlotKey, downloadUrl);
      await persistSlotToFirestore(allOverrides);

      return NextResponse.json({
        success: true,
        url: downloadUrl,
        storagePath,
      });
    }

    // Case 2: JSON body with { sourceUrl, slotKey } — fetches remote or data: URL & uploads
    const body = await req.json();
    const sourceUrl = String(body.sourceUrl || "").trim();
    const rawSlotKey = String(body.slotKey || "image");
    const safeSlotKey = rawSlotKey.replace(/[^a-zA-Z0-9._-]/g, "_");

    if (!sourceUrl) {
      return NextResponse.json(
        { error: "Missing sourceUrl." },
        { status: 400 }
      );
    }

    // If already hosted on Vercel Blob or Firebase Storage, persist & return
    if (
      sourceUrl.includes("blob.vercel-storage.com") ||
      (sourceUrl.includes("firebasestorage.googleapis.com") &&
        sourceUrl.includes("legaprimed.firebasestorage.app"))
    ) {
      const allOverrides = persistSlotOverrideToDisk(rawSlotKey, sourceUrl);
      await persistSlotToFirestore(allOverrides);
      return NextResponse.json({
        success: true,
        url: sourceUrl,
        alreadyInStorage: true,
      });
    }

    // Handle data:image/... base64 URLs
    if (sourceUrl.startsWith("data:image/")) {
      const match = sourceUrl.match(
        /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/
      );
      if (!match) {
        return NextResponse.json(
          { error: "Invalid data URL format." },
          { status: 400 }
        );
      }
      const mimeType = match[1];
      const base64Data = match[2];
      const buffer = Buffer.from(base64Data, "base64");
      const ext = mimeType.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "jpg";
      const storagePath = `kayarabuko_website/${safeSlotKey}_${Date.now()}.${ext}`;

      const downloadUrl = await uploadBufferToStorage(storagePath, buffer, mimeType);
      const allOverrides = persistSlotOverrideToDisk(rawSlotKey, downloadUrl);
      await persistSlotToFirestore(allOverrides);

      return NextResponse.json({
        success: true,
        url: downloadUrl,
        storagePath,
      });
    }

    // Fetch external HTTPS image (with SSRF protection) and upload into media storage
    if (!isSafeExternalImageUrl(sourceUrl)) {
      return NextResponse.json(
        { error: "Invalid or restricted external image URL." },
        { status: 400 }
      );
    }

    const response = await fetch(sourceUrl);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch remote image (${response.status}).` },
        { status: 400 }
      );
    }

    const mimeType =
      response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const ext = mimeType.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "jpg";
    const storagePath = `kayarabuko_website/${safeSlotKey}_${Date.now()}.${ext}`;

    const downloadUrl = await uploadBufferToStorage(storagePath, buffer, mimeType);

    const allOverrides = persistSlotOverrideToDisk(rawSlotKey, downloadUrl);
    await persistSlotToFirestore(allOverrides);

    return NextResponse.json({
      success: true,
      url: downloadUrl,
      storagePath,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to upload image to storage.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
