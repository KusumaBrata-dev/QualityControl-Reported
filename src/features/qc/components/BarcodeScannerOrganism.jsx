import React, { useEffect, useState, useRef } from "react";
import { ModalShell } from "./Molecules";
import { Html5Qrcode } from "html5-qrcode";
import { T } from "../qcConstants";
import { Btn } from "./Atoms";

export const BarcodeScannerOrganism = ({ open, onClose, onScanSuccess }) => {
  const [error, setError] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const qrScannerRef = useRef(null);
  const scannerId = "qc-universal-scanner-region";

  useEffect(() => {
    if (!open) {
      stopScanner();
      return;
    }

    // Initialize scanner logic
    startScanner();

    return () => {
      stopScanner();
    };
  }, [open]);

  const startScanner = async () => {
    setError("");
    setHasCamera(false);
    
    try {
      // Small delay to ensure DOM is ready
      await new Promise(r => setTimeout(r, 100));
      
      const html5QrCode = new Html5Qrcode(scannerId);
      qrScannerRef.current = html5QrCode;

      const config = { 
        fps: 15, 
        qrbox: { width: 250, height: 180 },
        aspectRatio: 1.0
      };

      // Prefer back camera (environment)
      await html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        (decodedText) => {
          // Success callback
          handleSuccess(decodedText);
        },
        (errorMessage) => {
          // Failure callback - ignored to avoid console spam
        }
      );
      
      setIsScanning(true);
      setHasCamera(true);
    } catch (err) {
      console.error("Camera start error:", err);
      setError("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (qrScannerRef.current && qrScannerRef.current.isScanning) {
      try {
        await qrScannerRef.current.stop();
        qrScannerRef.current = null;
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const handleSuccess = (text) => {
    const cleanText = text.trim().toUpperCase();
    // Stop scanner immediately on success
    stopScanner();
    onScanSuccess(cleanText);
  };

  const handleRetry = () => {
    stopScanner().then(() => startScanner());
  };

  return (
    <ModalShell
      open={open}
      onClose={() => {
        stopScanner();
        onClose();
      }}
      title="📷 Pindai Barcode / SN"
      subtitle="Gunakan kamera belakang untuk hasil terbaik"
      maxWidth={500}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative" }}>
        
        {/* Scanner Container */}
        <div 
          style={{ 
            width: "100%", 
            aspectRatio: "1/1",
            background: "#000",
            borderRadius: T.r2, 
            overflow: "hidden", 
            border: `1px solid ${T.border}`,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div id={scannerId} style={{ width: "100%", height: "100%" }} />
          
          {/* Custom Overlay UI */}
          {isScanning && (
            <div 
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {/* Corner Accents */}
              <div style={{ position: "absolute", top: 20, left: 20, width: 40, height: 40, borderTop: "4px solid " + T.blue, borderLeft: "4px solid " + T.blue, borderRadius: "4px 0 0 0" }} />
              <div style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderTop: "4px solid " + T.blue, borderRight: "4px solid " + T.blue, borderRadius: "0 4px 0 0" }} />
              <div style={{ position: "absolute", bottom: 20, left: 20, width: 40, height: 40, borderBottom: "4px solid " + T.blue, borderLeft: "4px solid " + T.blue, borderRadius: "0 0 0 4px" }} />
              <div style={{ position: "absolute", bottom: 20, right: 20, width: 40, height: 40, borderBottom: "4px solid " + T.blue, borderRight: "4px solid " + T.blue, borderRadius: "0 0 4px 0" }} />
              
              {/* Laser Animation Line */}
              <div 
                className="scanner-laser-line"
                style={{
                  width: "80%",
                  height: "2px",
                  background: T.blue,
                  boxShadow: `0 0 15px ${T.blue}, 0 0 5px #fff`,
                  position: "absolute",
                  top: "20%",
                  animation: "scanLaser 2.5s ease-in-out infinite"
                }}
              />
            </div>
          )}

          {!hasCamera && !error && (
            <div style={{ color: T.muted, fontSize: 13, textAlign: "center", padding: 20 }}>
              ⏳ Menghubungkan kamera...
            </div>
          )}

          {error && (
            <div style={{ padding: 20, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <div style={{ color: T.red, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{error}</div>
              <Btn variant="blue_outline" onClick={handleRetry}>Coba Lagi</Btn>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 4px" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.blueL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💡</div>
          <div style={{ fontSize: 12.5, color: T.muted, lineHeight: 1.4 }}>
            Posisikan barcode di dalam area kotak biru. Pastikan pencahayaan cukup dan barcode tidak terhalang.
          </div>
        </div>

        {isScanning && (
          <div style={{ textAlign: "center" }}>
            <Btn variant="ghost" size="sm" onClick={stopScanner}>Hentikan Kamera</Btn>
          </div>
        )}

      </div>

      <style>{`
        @keyframes scanLaser {
          0%, 100% { top: 20%; opacity: 0.2; }
          50% { top: 80%; opacity: 1; }
        }
        #qc-universal-scanner-region video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
        }
      `}</style>
    </ModalShell>
  );
};
