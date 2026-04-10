import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Use Emulators ONLY if VITE_USE_EMULATORS=true is set in .env
if (import.meta.env.VITE_USE_EMULATORS === "true") {
  const { connectFirestoreEmulator } = await import("firebase/firestore");
  const { connectStorageEmulator } = await import("firebase/storage");
  
  try {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    console.log("🛠️ Connected to Firebase Emulators");
  } catch (e) {
    console.warn("Emulators could not be connected.", e);
  }
} else {
  console.log("🌐 Connected to Production Firebase");
}

export const DEFECT_CATS = [
  { v: "DS01", l: "DL01 – Lecet A" },
  { v: "DS02", l: "DL02 – Lecet B" },
  { v: "DS03", l: "DL03 – Lecet C" },
  { v: "DS04", l: "DL04 – Lecet D" },
  { v: "DC05", l: "DC05 – Camera Berdebu" },
  { v: "DC06", l: "DC06 – Camera Tergores" },
  { v: "DC07", l: "DC07 – Camera Tidak Terdeteksi" },
  { v: "DC08", l: "DC08 – Camera Titik Hitam" },
  { v: "DC09", l: "DC09 – Camera Titik Putih" },
  { v: "DC10", l: "DC10 – Camera Flicker" },
  { v: "DC11", l: "DC11 – Camera Tidak Fokus" },
  { v: "DC12", l: "DC12 – Camera Tidak Normal" },
  { v: "DC13", l: "DC13 – Camera Dent" },
  { v: "DC14", l: "DC14 – Camera Blur" },
  { v: "DG15", l: "DG15 – Gompal A" },
  { v: "DG16", l: "DG16 – Gompal B" },
  { v: "DG17", l: "DG17 – Gompal C" },
  { v: "DG18", l: "DG18 – Gompal D" },
  { v: "DL24", l: "DL24 – LCD Pecah" },
  { v: "DL25", l: "DL25 – LCD Tidak Menyala" },
  { v: "DL26", l: "DL26 – LCD Lecet" },
  { v: "DL27", l: "DL27 – LCD Gompal" },
  { v: "DL28", l: "DL28 – LCD Redup" },
  { v: "DL29", l: "DL29 – LCD Kedip" },
  { v: "DL30", l: "DL30 – LCD Garis " },
  { v: "DL31", l: "DL31 – LCD Bias " },
  { v: "DG32", l: "DG32 – Gompal A" },
  { v: "DG33", l: "DG33 – Gompal B" },
  { v: "DG34", l: "DG34 – Gompal C" },
  { v: "DG35", l: "DG35 – Gompal D" },
];
