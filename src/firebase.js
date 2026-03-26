// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAaHODLMy8QFWa0WB9HTGNIuc-pi7wSMN8",
  authDomain: "qcreportsystem.firebaseapp.com",
  projectId: "qcreportsystem",
  storageBucket: "qcreportsystem.firebasestorage.app",
  messagingSenderId: "860940338162",
  appId: "1:860940338162:web:15ea952356fa493b57a16b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
