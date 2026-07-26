import cloudinary, { configure } from '../config/cloudinary.js';
import path from 'path';

// Re-configure cloudinary in case env vars were injected after module load
const ensureConfigured = () => configure();

/**
 * Uploads a Buffer to Cloudinary as a base64 data URI (Cloudflare Worker compatible).
 *
 * @param {Buffer|Uint8Array} buffer - File buffer
 * @param {string} folder - Target Cloudinary folder (e.g. 'bikes', 'sell-requests')
 * @param {object} options - Extra Cloudinary upload options
 * @returns {Promise<object>} Structured { url, publicId, width, height, format }
 */
const uploadBuffer = async (buffer, folder, options = {}) => {
  ensureConfigured();

  // Convert buffer to base64 data URI — works in both Node.js and CF Workers
  const base64 = Buffer.from(buffer).toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `saraswati/${folder}`,
    resource_type: 'auto',
    quality: 'auto',
    fetch_format: 'auto',
    ...options,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
  };
};

/**
 * Uploads a single file from a Hono multipart file entry.
 *
 * @param {File|object} file - A File object with arrayBuffer() or a Buffer
 * @param {string} folder - Target folder name
 * @param {object} options - Extra Cloudinary options
 * @returns {Promise<object|null>}
 */
const uploadSingle = async (file, folder, options = {}) => {
  if (!file) return null;

  // Fallback mock when Cloudinary creds are missing (local dev)
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('[Cloudinary] Credentials missing — returning mock image URL');
    const mockBikes = [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    ];
    return {
      url: mockBikes[Math.floor(Math.random() * mockBikes.length)],
      publicId: `mock-fallback-${Date.now()}`,
      width: 1200,
      height: 800,
      format: 'jpg',
    };
  }

  // Accept Buffer directly, or Web API File/Blob with arrayBuffer()
  let buffer;
  if (Buffer.isBuffer(file)) {
    buffer = file;
  } else if (file.buffer) {
    buffer = file.buffer;
  } else if (typeof file.arrayBuffer === 'function') {
    buffer = Buffer.from(await file.arrayBuffer());
  } else {
    throw new Error('uploadSingle: unsupported file type — expected Buffer or File');
  }

  const originalName = file.originalname || file.name || 'media';
  const cleanName = path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

  return uploadBuffer(buffer, folder, {
    public_id: `${cleanName}_${Date.now()}`,
    ...options,
  });
};

/**
 * Uploads multiple files concurrently to Cloudinary.
 *
 * @param {Array<File|Buffer>} files
 * @param {string} folder
 * @param {object} options
 * @returns {Promise<Array<object>>}
 */
const uploadMultiple = async (files, folder, options = {}) => {
  if (!files || files.length === 0) return [];
  return Promise.all(files.map((f) => uploadSingle(f, folder, options)));
};

/**
 * Deletes a single image from Cloudinary by public ID.
 *
 * @param {string} publicId
 * @returns {Promise<object|null>}
 */
const deleteSingle = async (publicId) => {
  if (!publicId) return null;
  ensureConfigured();
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Deletes multiple images from Cloudinary concurrently.
 *
 * @param {string[]} publicIds
 * @returns {Promise<Array>}
 */
const deleteMultiple = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) return [];
  return Promise.all(publicIds.map((id) => deleteSingle(id)));
};

export { uploadBuffer, uploadSingle, uploadMultiple, deleteSingle, deleteMultiple };
