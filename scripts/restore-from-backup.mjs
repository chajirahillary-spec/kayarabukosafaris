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
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
        if (key === "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID") config.measurementId = value;
      }
    }
  }
  return config;
}

const firebaseConfig = loadEnvConfig();
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ORG_ID = process.env.NEXT_PUBLIC_ORGANIZATION_ID || "kayarabuko-safaris";

async function restoreDatabase() {
  console.log("Reading backup data...");
  const rawBackup = fs.readFileSync("data/full-firestore-backup.json", "utf-8");
  const backup = JSON.parse(rawBackup);

  // 1. Restore settings
  if (backup.settings) {
    console.log("Restoring settings documents...");
    for (const [docId, data] of Object.entries(backup.settings)) {
      const docRef = doc(db, "organizations", ORG_ID, "settings", docId);
      await setDoc(docRef, data, { merge: true });
      console.log(`  ✓ Restored settings/${docId}`);
    }
  }

  // Restore activityGallery into settings/activityGallery if exists in data/saved-activity-gallery.json
  if (fs.existsSync("data/saved-activity-gallery.json")) {
    const actData = JSON.parse(fs.readFileSync("data/saved-activity-gallery.json", "utf-8"));
    if (actData && actData.items) {
      const actRef = doc(db, "organizations", ORG_ID, "settings", "activityGallery");
      await setDoc(actRef, {
        itemsJson: JSON.stringify(actData.items),
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log("  ✓ Restored settings/activityGallery");
    }
  }

  // 2. Restore destinations
  if (backup.destinations) {
    console.log("Restoring destinations (27 documents)...");
    for (const [slug, data] of Object.entries(backup.destinations)) {
      const docRef = doc(db, "organizations", ORG_ID, "destinations", slug);
      await setDoc(docRef, data, { merge: true });
    }
    console.log(`  ✓ Restored ${Object.keys(backup.destinations).length} destinations`);
  }

  // 3. Restore safaris
  if (backup.safaris) {
    console.log("Restoring safaris (10 documents)...");
    for (const [slug, data] of Object.entries(backup.safaris)) {
      const docRef = doc(db, "organizations", ORG_ID, "safaris", slug);
      await setDoc(docRef, data, { merge: true });
    }
    console.log(`  ✓ Restored ${Object.keys(backup.safaris).length} safaris`);
  }

  // 4. Restore experiences
  if (backup.experiences) {
    console.log("Restoring experiences (7 documents)...");
    for (const [slug, data] of Object.entries(backup.experiences)) {
      const docRef = doc(db, "organizations", ORG_ID, "experiences", slug);
      await setDoc(docRef, data, { merge: true });
    }
    console.log(`  ✓ Restored ${Object.keys(backup.experiences).length} experiences`);
  }

  // 5. Restore stories
  if (backup.stories) {
    console.log("Restoring stories (9 documents)...");
    for (const [slug, data] of Object.entries(backup.stories)) {
      const docRef = doc(db, "organizations", ORG_ID, "stories", slug);
      await setDoc(docRef, data, { merge: true });
    }
    console.log(`  ✓ Restored ${Object.keys(backup.stories).length} stories`);
  }

  console.log("\n========================================================");
  console.log("🎉 ALL FIRESTORE DATA SUCCESSFULLY RESTORED TO NEW PROJECT!");
  console.log("========================================================");
  process.exit(0);
}

restoreDatabase().catch((err) => {
  console.error("Restoration error:", err);
  process.exit(1);
});
