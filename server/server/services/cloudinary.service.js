const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');
const path = require('path');

/**
 * Uploads a file buffer directly to Cloudinary using streams.
 * 
 * @param {Buffer} buffer - File buffer from multer memory storage
 * @param {string} folder - Folder name in Cloudinary (e.g. 'bikes', 'gallery', 'banners')
 * @param {object} options - Custom Cloudinary upload options (e.g. transformations)
 * @returns {Promise<object>} - Raw Cloudinary upload result
 */
const uploadBuffer = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `saraswati/${folder}`, // Scope under a project subfolder
        resource_type: 'auto',
        quality: 'auto',              // Auto compression/quality optimization
        fetch_format: 'auto',         // Deliver in modern format (e.g. webp) if browser supports it
        ...options
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Write buffer to stream and pipe to Cloudinary
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
};

/**
 * Uploads a single file (from multer req.file) to Cloudinary
 * 
 * @param {object} file - Multer file object
 * @param {string} folder - Target folder name
 * @param {object} options - Custom Cloudinary options
 * @returns {Promise<object>} - Reusable structured image metadata
 */
const uploadSingle = async (file, folder, options = {}) => {
  if (!file) return null;

  // FALLBACK: If Cloudinary credentials are not configured, return a mock Unsplash image object
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.warn('Cloudinary credentials missing in .env. Falling back to mock image object for development.');
    
    const mockBikes = [
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=1200&q=80'
    ];
    const mockUrl = mockBikes[Math.floor(Math.random() * mockBikes.length)];
    
    return {
      url: mockUrl,
      publicId: `mock-fallback-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      width: 1200,
      height: 800,
      format: 'jpg'
    };
  }

  const buffer = file.buffer || file;
  const originalName = file.originalname || 'media';
  
  // Sanitize filename to prevent directory traversal / invalid characters
  const cleanName = path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  
  const result = await uploadBuffer(buffer, folder, {
    public_id: `${cleanName}_${Date.now()}`,
    ...options
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format
  };
};

/**
 * Uploads multiple files (from multer req.files) to Cloudinary concurrently
 * 
 * @param {Array<object>} files - Array of multer file objects
 * @param {string} folder - Target folder name
 * @param {object} options - Custom Cloudinary options
 * @returns {Promise<Array<object>>} - Array of structured image metadata
 */
const uploadMultiple = async (files, folder, options = {}) => {
  if (!files || files.length === 0) return [];
  const uploadPromises = files.map(file => uploadSingle(file, folder, options));
  return Promise.all(uploadPromises);
};

/**
 * Deletes a single image from Cloudinary by its public ID
 * 
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<object>} - Deletion outcome result
 */
const deleteSingle = async (publicId) => {
  if (!publicId) return null;
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

/**
 * Deletes multiple images from Cloudinary concurrently
 * 
 * @param {Array<string>} publicIds - Array of public IDs
 * @returns {Promise<Array<object>>} - Concurrency deletion outcomes
 */
const deleteMultiple = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) return [];
  const deletePromises = publicIds.map(id => deleteSingle(id));
  return Promise.all(deletePromises);
};

module.exports = {
  uploadBuffer,
  uploadSingle,
  uploadMultiple,
  deleteSingle,
  deleteMultiple
};
