import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

const TestingPages = () => {
  const [stats, setStats] = useState({
    status: "Initializing...",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "MISSING",
    usersCount: "...",
    reportsCount: "...",
    error: null,
  });

  useEffect(() => {
    async function runTest() {
      try {
        setStats((s) => ({ ...s, status: "Testing Connection..." }));

        // 1. Test Users
        const uSnap = await getDocs(query(collection(db, "users"), limit(1)));
        const usersCount = uSnap.size;

        // 2. Test Reports
        const rSnap = await getDocs(query(collection(db, "reports"), limit(1)));
        const reportsCount = rSnap.size;

        setStats((s) => ({
          ...s,
          status: "SUCCESS",
          usersCount: uSnap.empty ? "0 (Collection Empty)" : "Detected",
          reportsCount: rSnap.empty ? "0 (Collection Empty)" : "Detected",
          error: null,
        }));
      } catch (err) {
        console.error("Test Fail:", err);
        setStats((s) => ({
          ...s,
          status: "FAILED",
          error: `${err.name}: ${err.message}`,
        }));
      }
    }
    runTest();
  }, []);

  return (
    <div
      style={{
        padding: 40,
        fontFamily: "monospace",
        background: "#000",
        color: "#0f0",
        minHeight: "100vh",
      }}
    >
      <h1>🛠️ FIRESTORE DIAGNOSTICS</h1>
      <hr />
      <div style={{ marginTop: 20 }}>
        <p>
          <strong>OVERALL STATUS:</strong>{" "}
          <span style={{ color: stats.status === "SUCCESS" ? "#0f0" : "#f00" }}>
            {stats.status}
          </span>
        </p>
        <p>
          <strong>Project ID:</strong> {stats.projectId}
        </p>
        <p>
          <strong>Users Access:</strong> {stats.usersCount}
        </p>
        <p>
          <strong>Reports Access:</strong> {stats.reportsCount}
        </p>
      </div>

      {stats.error && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #f00",
            color: "#f00",
            background: "#200",
          }}
        >
          <h3>❌ ERROR DETECTED</h3>
          <p>{stats.error}</p>
          <div style={{ fontSize: 12, marginTop: 10 }}>
            <strong>Possibilities:</strong>
            <ul>
              <li>Firestore Rules: "allow read: if false;"</li>
              <li>Network: Firewalled or Offline</li>
              <li>Config: Project ID doesn't match Firebase Console</li>
            </ul>
          </div>
        </div>
      )}

      <div style={{ marginTop: 40, display: "flex", gap: 12 }}>
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "10px 20px",
            background: "#333",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
        <button
          onClick={async () => {
            const { SEED_USERS, SEED_REPORTS } = await import("../features/qc/qcConstants");
            const { setDoc, doc } = await import("firebase/firestore");
            try {
              alert("Mengisi database...");
              for (const u of SEED_USERS)
                await setDoc(doc(db, "users", String(u.id)), u);
              for (const r of SEED_REPORTS)
                await setDoc(doc(db, "reports", String(r.id)), r);
              alert("SUCCESS! Silakan login sekarang di halaman utama.");
              window.location.reload();
            } catch (e) {
              alert("Gagal seeding: " + e.message);
            }
          }}
          style={{
            padding: "10px 20px",
            background: "#070",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          🚀 Paksa Isi Data (Seed Database)
        </button>
      </div>
    </div>
  );
};

export default TestingPages;
