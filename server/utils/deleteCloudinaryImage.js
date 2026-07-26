import { deleteSingle } from '../services/cloudinary.service.js';

/**
 * Safely deletes a Cloudinary image by publicId.
 * Swallows errors so callers are not blocked by cloud-sync failures.
 *
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object|null>}
 */
const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return null;
  try {
    return await deleteSingle(publicId);
  } catch (err) {
    console.error(`[Cloudinary] Failed to delete image: ${publicId}`, err.message);
    return null;
  }
};

export default deleteCloudinaryImage;
