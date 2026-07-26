const express = require('express');
const Vehicle = require('../models/Vehicle');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload.middleware');
const CloudinaryService = require('../services/cloudinary.service');
const router = express.Router();

// Helper to escape special characters for Safe Regex matching (ReDoS defense)
const escapeRegExp = (str) => (typeof str === 'string' ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '');

// GET /api/vehicles (with filters)
router.get('/', async (req, res) => {
  try {
    const { type, brand, category, subcategory, fuelType, transmission, minPrice, maxPrice, year, sort, status, featured, search, page = 1, limit = 12 } = req.query;
    const query = {};
    if (type && typeof type === 'string') query.type = type;
    if (brand && typeof brand === 'string') query.brand = new RegExp(escapeRegExp(brand), 'i');
    if (category && typeof category === 'string') query.category = category;
    if (subcategory && typeof subcategory === 'string') query.subcategory = subcategory;
    if (fuelType && typeof fuelType === 'string') query.fuelType = fuelType;
    if (transmission && typeof transmission === 'string') query.transmission = transmission;
    if (year && !isNaN(year)) query.year = Number(year);
    if (status && typeof status === 'string') query.status = status;
    if (featured === 'true') query.featured = true;
    if (search && typeof search === 'string') query.title = new RegExp(escapeRegExp(search), 'i');
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      'name-asc': { title: 1 },
      'name-desc': { title: -1 },
      newest: { createdAt: -1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
    };
    const sortObj = sortMap[sort] || { title: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [vehicles, total] = await Promise.all([
      Vehicle.find(query).sort(sortObj).skip(skip).limit(Number(limit)),
      Vehicle.countDocuments(query),
    ]);

    res.json({ vehicles, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vehicles (protected)
router.post('/', auth, upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    
    // Upload newly uploaded files using modular service
    const uploadedImages = await CloudinaryService.uploadMultiple(req.files || [], 'bikes');
    
    let images = uploadedImages.map((img, idx) => ({
      ...img,
      alt: data.title || 'Bike Image',
      displayOrder: idx
    }));

    // Handle thumbnail primary re-ordering
    if (data.thumbnail && data.thumbnail.startsWith('new-')) {
      const idx = parseInt(data.thumbnail.split('-')[1]);
      if (!isNaN(idx) && images[idx]) {
        const thumb = images[idx];
        images = [thumb, ...images.filter(img => img.url !== thumb.url)];
      }
    }

    const vehicle = new Vehicle({ ...data, images });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// PUT /api/vehicles/:id (protected)
router.put('/:id', auth, upload.array('images', 10), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data || '{}');
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // 1. Upload new image files
    const newUploadedImages = await CloudinaryService.uploadMultiple(req.files || [], 'bikes');

    // 2. Identify existing images to keep vs delete
    const keepImages = data.keepImages || vehicle.images || [];
    
    // Find which images were deleted by the admin user
    const keepPublicIds = new Set(keepImages.map(img => img.publicId));
    const deletedImages = (vehicle.images || []).filter(img => !keepPublicIds.has(img.publicId));
    
    // Remote delete from Cloudinary immediately
    const deletedPublicIds = deletedImages.map(img => img.publicId).filter(Boolean);
    if (deletedPublicIds.length > 0) {
      try {
        await CloudinaryService.deleteMultiple(deletedPublicIds);
      } catch (cloudinaryErr) {
        console.warn('Failed to delete images from Cloudinary during update:', cloudinaryErr.message);
      }
    }

    // 3. Merge kept and newly uploaded images
    let images = [
      ...keepImages,
      ...newUploadedImages.map((img, idx) => ({
        ...img,
        alt: data.title || vehicle.title,
        displayOrder: keepImages.length + idx
      }))
    ];

    // 4. Handle thumbnail selection (reorder target to the front)
    let thumbUrl = null;
    if (data.thumbnail) {
      if (data.thumbnail.startsWith('new-')) {
        const idx = parseInt(data.thumbnail.split('-')[1]);
        if (!isNaN(idx) && newUploadedImages[idx]) {
          thumbUrl = newUploadedImages[idx].url;
        }
      } else {
        thumbUrl = data.thumbnail; // existing kept image URL string
      }
    }

    if (thumbUrl) {
      const thumbObj = images.find(img => img.url === thumbUrl);
      if (thumbObj) {
        images = [thumbObj, ...images.filter(img => img.url !== thumbUrl)];
      }
    }

    data.images = images;

    Object.assign(vehicle, data);
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/vehicles/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Delete all vehicle images from Cloudinary concurrently
    const publicIds = (vehicle.images || []).map(img => img.publicId).filter(Boolean);
    if (publicIds.length > 0) {
      try {
        await CloudinaryService.deleteMultiple(publicIds);
      } catch (cloudinaryErr) {
        console.warn('Failed to delete images from Cloudinary during vehicle deletion:', cloudinaryErr.message);
      }
    }

    // Now delete from database
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/vehicles/:id/delete (protected - fallback for firewall blocks)
router.post('/:id/delete', auth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    // Delete all vehicle images from Cloudinary concurrently
    const publicIds = (vehicle.images || []).map(img => img.publicId).filter(Boolean);
    if (publicIds.length > 0) {
      try {
        await CloudinaryService.deleteMultiple(publicIds);
      } catch (cloudinaryErr) {
        console.warn('Failed to delete images from Cloudinary during vehicle deletion:', cloudinaryErr.message);
      }
    }

    // Now delete from database
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
