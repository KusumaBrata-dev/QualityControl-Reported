import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';

// Manual .env parser for Node
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const config = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) config[key.trim()] = value.trim();
});

const firebaseConfig = {
  apiKey: config.VITE_FIREBASE_API_KEY,
  authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: config.VITE_FIREBASE_PROJECT_ID,
  storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.VITE_FIREBASE_APP_ID,
};

console.log("Checking connection for Project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

try {
  const snap = await getDocs(collection(db, "reports"));
  console.log("SUCCESS! Firestore is reachable.");
  console.log("Found:", snap.size, "reports.");
  process.exit(0);
} catch (e) {
  console.error("FAILURE! Cannot reach Firestore.");
  console.error("Error Code:", e.code);
  console.error("Message:", e.message);
  process.exit(1);
}
