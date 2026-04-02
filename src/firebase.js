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
export const storage = getStorage(app); // INSPECTORS removed as per user request (Shift & Inspector fields deleted)

export const DEFECT_CATS = [
  { v: "DL01", l: "DC01 – Lecet A" },
  { v: "DL02", l: "DC02 – Lecet B" },
  { v: "DL03", l: "DC03 – Lecet C" },
  { v: "DL04", l: "DC04 – Lecet D" },
  { v: "DL05", l: "DC05 – Camera Berdebu" },
  { v: "DC06", l: "DC06 – Camera Tergores" },
  { v: "DC07", l: "DC07 – Camera Tidak Terdeteksi" },
  { v: "DC08", l: "DC08 – Camera Titik Hitam" },
  { v: "DC09", l: "DC09 – Camera Titik Putih" },
  { v: "DC10", l: "DC10 – Camera Flicker" },
  { v: "DC11", l: "DC11 – Camera Tidak Fokus" },
  { v: "DC12", l: "DC12 – Camera " },
  { v: "DC13", l: "DC13 – Camera " },
  { v: "DC14", l: "DC14 – Camera Blur" },
  { v: "DC15", l: "DC15 – Camera Blur" },
  { v: "DC16", l: "DC16 – Camera Blur" },
  { v: "DC17", l: "DC17 – Camera Blur" },
  { v: "DC18", l: "DC18 – Camera Blur" },
  { v: "DC19", l: "DC19 – Camera Blur" },
  { v: "DC20", l: "DC20 – Camera Blur" },
  { v: "DC21", l: "DC21 – Camera Blur" },
  { v: "DC22", l: "DC22 – Camera Blur" },
  { v: "DC23", l: "DC23 – Camera Blur" },
  { v: "DC24", l: "DC24 – Camera Blur" },
  { v: "DC25", l: "DC25 – Camera Blur" },
  { v: "DC26", l: "DC26 – Camera Blur" },
  { v: "DC27", l: "DC27 – Camera Blur" },
  { v: "DC28", l: "DC28 – Camera Blur" },
  { v: "DC29", l: "DC29 – Camera Blur" },
  { v: "DC30", l: "DC30 – Camera Blur" },
  { v: "DC31", l: "DC31 – Camera Blur" },
  { v: "DC32", l: "DC32 – Camera Blur" },
  { v: "DC33", l: "DC33 – Camera Blur" },
  { v: "DC34", l: "DC34 – Camera Blur" },
  { v: "DC35", l: "DC35 – Camera Blur" },
];
