import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "node:fs";
import path from "node:path";

function loadEnvConfig() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        if (key === "NEXT_PUBLIC_FIREBASE_API_KEY") config.apiKey = value;
        if (key === "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN") config.authDomain = value;
        if (key === "NEXT_PUBLIC_FIREBASE_PROJECT_ID") config.projectId = value;
        if (key === "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET") config.storageBucket = value;
        if (key === "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID") config.messagingSenderId = value;
        if (key === "NEXT_PUBLIC_FIREBASE_APP_ID") config.appId = value;
      }
    }
  }
  return config;
}

const firebaseConfig = loadEnvConfig();
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const logoUrl = process.argv[2] || process.env.LOGO_URL;
const heroUrl = process.argv[3] || process.env.HERO_URL;
const orgId = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "kayarabuko-safaris";

async function sync() {
  console.log("Connecting to Firestore...");
  const brandRef = doc(db, "organizations", orgId, "settings", "brand");

  const payload = {
    updatedAt: new Date().toISOString(),
  };

  if (logoUrl) {
    payload.logoUrl = logoUrl;
    console.log("Setting logoUrl in Firestore:", logoUrl);
  }

  if (heroUrl) {
    payload.heroBannerUrl = heroUrl;
    console.log("Setting heroBannerUrl in Firestore:", heroUrl);
  }

  await setDoc(brandRef, payload, { merge: true });
  console.log(`✓ Successfully synced to Firestore path: organizations/${orgId}/settings/brand`);
  process.exit(0);
}

sync().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
