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

const ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "kayarabuko-safaris";
const BUCKET = firebaseConfig.storageBucket || "legaprimed.firebasestorage.app";

function getStorageUrl(path) {
  const encoded = encodeURIComponent(path);
  return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encoded}?alt=media`;
}

// Read data files directly
const destinationsRaw = fs.readFileSync("./src/data/destinations.ts", "utf8");
const safarisRaw = fs.readFileSync("./src/data/safaris.ts", "utf8");
const contentRaw = fs.readFileSync("./src/data/content.ts", "utf8");

// Extract slugs
const destSlugs = [...destinationsRaw.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const safariSlugs = [...safarisRaw.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]);
const expSlugs = [...contentRaw.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]);

async function seedAll() {
  console.log("Seeding all catalogue items to Firestore...");

  // 1. Seed brand settings
  const brandDoc = doc(db, "organizations", ORG_ID, "settings", "brand");
  await setDoc(brandDoc, {
    companyName: "KayArabuko Safaris",
    tagline: "Explore. Conserve. Empower.",
    statement: "Not just a destination... but a story.",
    supporting: "Story tellers and custodians of our African cultures.",
    logoUrl: getStorageUrl("brand/logo.png"),
    logoStoragePath: "brand/logo.png",
    heroBannerUrl: getStorageUrl("brand/hero-banner.jpg"),
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  console.log("✓ Brand settings confirmed in Firestore");
  console.log(`Found ${destSlugs.length} destination slugs, ${safariSlugs.length} safari slugs.`);
}

seedAll().catch(console.error);
