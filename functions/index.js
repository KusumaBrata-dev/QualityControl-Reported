const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fse = require("fs-extra");
const path = require("path");

const app = express();
// Increase limit for large photos
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({ origin: true }));

const NAS_PATH = "\\\\10.0.0.8\\home\\QCSystem";
const LOCAL_PATH = path.join(__dirname, "photos");

async function getActivePath() {
  await fse.ensureDir(LOCAL_PATH);
  return LOCAL_PATH;
}

// Setup multer (limit 50MB per file)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } 
});

/**
 * Endpoint to upload photos to the local NAS share
 */
app.post("/upload", (req, res, next) => {
  console.log("📥 NEW UPLOAD REQUEST RECEIVED");
  next();
}, upload.single("photo"), async (req, res) => {
  try {
    console.log("🧪 Multer finished processing. File:", req.file ? req.file.originalname : "NONE");
    
    if (!req.file) {
      console.warn("⚠️ No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const safeId = String(req.body.reportId || "unknown").replace(/[^a-z0-9_\-]/gi, "_");
    const fileName = `img_${Date.now()}_${safeId}.jpg`;
    const activePath = await getActivePath();
    const targetFilePath = path.join(activePath, fileName);

    console.log("💾 Saving to:", targetFilePath);
    await fse.writeFile(targetFilePath, req.file.buffer);
    console.log("✅ File saved successfully");

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("NAS Write Timeout")), 5000)
    );

    await Promise.race([writePromise, timeoutPromise]);

    res.status(200).json({
      success: true,
      fileName,
      url: `/localBridge/photos/${fileName}`
    });
  } catch (error) {
    console.error("Bridge Error:", error.message);
    res.status(500).json({ error: "Bridge failed", details: error.message });
  }
});

/**
 * Endpoint to serve photos from the local NAS share
 */
app.get("/photos/:name", async (req, res) => {
  try {
    const activePath = await getActivePath();
    const targetFilePath = path.join(activePath, req.params.name);
    
    if (await fse.pathExists(targetFilePath)) {
      res.sendFile(targetFilePath);
    } else {
      res.status(404).send("Photo not found on NAS");
    }
  } catch (error) {
    res.status(500).send("Error retrieving photo");
  }
});

exports.localBridge = onRequest(app);
