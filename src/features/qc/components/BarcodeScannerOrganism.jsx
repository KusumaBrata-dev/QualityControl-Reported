import React, { useEffect, useState } from "react";
import { ModalShell } from "./Molecules";
import { Html5QrcodeScanner } from "html5-qrcode";
import { T } from "../qcConstants";

export const BarcodeScannerOrganism = ({ open, onClose, onScanSuccess }) => {
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    // Reset error when opened
    setError("");

    // Initialize scanner
    const scanner = new Html5QrcodeScanner(
      "qc-barcode-reader",
      { fps: 10, qrbox: { width: 250, height: 150 }, aspectRatio: 1.0 },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        // Success
        scanner.clear().then(() => {
          onScanSuccess(decodedText.trim().toUpperCase());
        }).catch(err => {
          console.error("Failed to clear scanner:", err);
        });
      },
      (err) => {
        // Ignore scan failures because video feeds produce lots of them
      }
    );

    return () => {
      scanner.clear().catch(e => console.error("Unmount clear error", e));
    };
  }, [open, onScanSuccess]);

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="📷 Pindai Barcode / Serial Number"
      subtitle="Arahkan kamera ke barcode unit"
      maxWidth={500}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div style={{ color: T.red, fontSize: 13, textAlign: "center" }}>
            {error}
          </div>
        )}
        <div 
          id="qc-barcode-reader" 
          style={{ width: "100%", borderRadius: T.r2, overflow: "hidden", border: `1px solid ${T.border}` }}
        />
        <div style={{ fontSize: 12, color: T.muted, textAlign: "center", marginTop: 8 }}>
          Mendukung EAN-13, CODE128, QR Code, dan format standar lainnya. 
          Sistem akan menolak barcode buram/tidak valid.
        </div>
      </div>
    </ModalShell>
  );
};
