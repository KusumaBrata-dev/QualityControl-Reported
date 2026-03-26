// src/seedFirestore.js
import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { SEED_REPORTS, SEED_USERS } from "./features/qc/qcConstants";

export const seedFirestore = async () => {
  console.log("Seeding Firestore...");

  for (const report of SEED_REPORTS) {
    await setDoc(doc(collection(db, "reports"), String(report.id)), report);
  }
  console.log("✅ Reports selesai");

  for (const user of SEED_USERS) {
    await setDoc(doc(collection(db, "users"), String(user.id)), user);
  }
  console.log("✅ Users selesai");
};
