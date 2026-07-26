const { deleteSingle } = require('../services/cloudinary.service');

/**
 * Utility function to delete an image from Cloudinary by its publicId.
 * Suppresses errors to prevent breaking requests when deletion fails due to missing files.
 * 
 * @param {string} publicId - The Cloudinary publicId of the image to destroy.
 * @returns {Promise<object|null>} - Result of the deletion or null.
 */
const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await deleteSingle(publicId);
    return result;
  } catch (err) {
    console.error(`Failed to delete Cloudinary image: ${publicId}`, err.message);
    return null; // Resolve with null so caller flow is not blocked by cloud sync issues
  }
};

module.exports = deleteCloudinaryImage;
