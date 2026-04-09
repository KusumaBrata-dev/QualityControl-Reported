const {setGlobalOptions} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fse = require("fs-extra");
const path = require("path");

const app = express();
app.use(cors({ origin: true }));

// Target NAS Path
const NAS_PATH = "\\\\10.0.0.8\\home\\QCSystem";



// Setup multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

setGlobalOptions({ maxInstances: 10 });

/**
 * Endpoint to upload photos to the local NAS share
 */
app.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = `img_${Date.now()}_${req.body.reportId || "unknown"}.jpg`;
    const targetFilePath = path.join(NAS_PATH, fileName);

    // Ensure target directoy exists (requires NAS connection)
    await fse.ensureDir(NAS_PATH);
    
    // Write the buffer to the NAS
    await fse.writeFile(targetFilePath, req.file.buffer);

    // Return the URL that points back to this function to serve the file
    // Note: In emulator, the URL structure is usually http://127.0.0.1:5001/project-id/us-central1/localBridge/photos/filename
    res.status(200).json({
      success: true,
      fileName,
      url: `/localBridge/photos/${fileName}` // Relative URL for frontend to handle
    });
  } catch (error) {
    console.error("NAS Upload Error:", error);
    res.status(500).json({ error: "Failed to save to NAS", details: error.message });
  }
});

/**
 * Endpoint to serve photos from the local NAS share
 */
app.get("/photos/:name", async (req, res) => {
  try {
    const targetFilePath = path.join(NAS_PATH, req.params.name);
    
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
