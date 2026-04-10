import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Compresses an image to fit within Firestore document limits
 * @param {string|File|Blob} imageSource - The source image
 * @param {number} maxWidth - Max width in pixels (default 800)
 * @param {number} quality - JPEG quality 0-1 (default 0.6)
 * @returns {Promise<string>} - Compressed base64 string
 */
async function compressImage(imageSource, maxWidth = 800, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Handle different source types
    let src = typeof imageSource === "string" ? imageSource : URL.createObjectURL(imageSource);
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Output as compressed JPEG base64
      const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
      
      // Cleanup Object URL if created
      if (typeof imageSource !== "string") URL.revokeObjectURL(src);
      
      resolve(compressedDataUrl);
    };

    img.onerror = (e) => {
      if (typeof imageSource !== "string") URL.revokeObjectURL(src);
      reject(e);
    };
  });
}

/**
 * "Uploads" images by compressing them and returning base64 strings
 * These strings will be saved directly to Firestore documents
 */
export async function uploadReportImages(images, reportId, onProgress) {
  if (!images || images.length === 0) return [];

  const total = images.length;
  console.log(`📦 Starting Compression for ${total} images...`);

  const processPromises = images.map(async (img, index) => {
    try {
      if (onProgress) onProgress(index + 1, total);
      
      // If it's already a URL (not a base64/blob), skip
      if (typeof img === "string" && (img.startsWith("http") || img.startsWith("https"))) {
        return img;
      }

      console.log(`🖼️ Compressing image ${index + 1}/${total}...`);
      const compressed = await compressImage(img);
      console.log(`✅ Image ${index + 1}/${total} compressed (size: ${Math.round(compressed.length / 1024)} KB)`);
      return compressed;
    } catch (err) {
      console.error(`❌ Compression failed for image ${index + 1}:`, err.message);
      return null;
    }
  });

  const results = await Promise.all(processPromises);
  return results.filter(u => u !== null);
}

// Keep other functions for compatibility if needed elsewhere
export async function deleteStorageImage(url) {
  if (!url || !url.includes("firebasestorage.googleapis.com")) return;
  try {
    const fileRef = ref(storage, url);
    // await deleteObject(fileRef); // Disabled for now as we use Firestore base64
  } catch (e) {
    console.error("Failed to delete storage image:", e);
  }
}

export async function uploadUserAvatar(image, userId) {
  if (!image) return null;
  if (typeof image === "string" && (image.startsWith("http") || image.startsWith("https"))) {
    return image;
  }
  return await compressImage(image, 200, 0.5); // Smaller for avatars
}
