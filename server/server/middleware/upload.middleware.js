const multer = require('multer');

// Memory storage keeps files in buffers so they can be streamed to Cloudinary
const storage = multer.memoryStorage();

// Accept only standard image file formats
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG, WEBP, and GIF are allowed.'), false);
  }
};

// Multer parser config
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Max 5MB file size
  },
  fileFilter: fileFilter
});

module.exports = upload;
