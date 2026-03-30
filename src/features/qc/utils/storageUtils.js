import { storage } from "../../../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

/**
 * Uploads an array of files/blobs to Firebase Storage and returns their download URLs.
 * @param {Array<File|Blob|string>} images - Array of images (File objects or Base64 strings to be converted)
 * @param {string} reportId - The ID of the report these images belong to
 * @returns {Promise<Array<string>>} - Array of download URLs
 */
export async function uploadReportImages(images, reportId) {
  if (!images || images.length === 0) return [];

  const uploadPromises = images.map(async (img, index) => {
    // If it's already a URL, skip upload
    if (typeof img === "string" && (img.startsWith("http") || img.startsWith("https"))) {
      return img;
    }

    let blob;
    if (typeof img === "string" && img.startsWith("data:")) {
      // Convert base64 to Blob
      const res = await fetch(img);
      blob = await res.blob();
    } else if (img instanceof File || img instanceof Blob) {
      blob = img;
    } else {
      return null;
    }

    const fileRef = ref(storage, `reports/${reportId}/img_${Date.now()}_${index}`);
    const snapshot = await uploadBytes(fileRef, blob);
    return await getDownloadURL(snapshot.ref);
  });

  const urls = await Promise.all(uploadPromises);
  return urls.filter(u => u !== null);
}

/**
 * Deletes an image from Storage given its URL
 * @param {string} url 
 */
export async function deleteStorageImage(url) {
  if (!url || !url.includes("firebasestorage.googleapis.com")) return;
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (e) {
    console.error("Failed to delete storage image:", e);
  }
}
