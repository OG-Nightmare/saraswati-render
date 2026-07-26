const express = require('express');
const rateLimit = require('express-rate-limit');
const SellRequest = require('../models/SellRequest');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload.middleware');
const CloudinaryService = require('../services/cloudinary.service');
const router = express.Router();

// Public Form Rate Limiter: Max 10 submissions per 15 minutes
const sellLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many bike sell requests submitted. Please try again after 15 minutes.' }
});

// POST /api/sell-requests (public — visitor submits their bike)
router.post('/', sellLimiter, upload.single('image'), async (req, res) => {
  try {
    const { name, phone, brand, model, year, kilometers, askingPrice, description } = req.body;
    if (!name || !phone || !brand || !model || !year || typeof name !== 'string' || typeof phone !== 'string') {
      return res.status(400).json({ message: 'Name, phone, brand, model and valid year are required' });
    }
    
    // Upload image to Cloudinary under the 'sell-requests' folder
    const uploadedImage = req.file ? await CloudinaryService.uploadSingle(req.file, 'sell-requests') : null;
    
    const parsedYear = Number(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(parsedYear) || parsedYear < 1970 || parsedYear > currentYear + 1) {
      return res.status(400).json({ message: 'Invalid vehicle manufacturing year' });
    }

    const sellReq = await SellRequest.create({
      name: name.trim().slice(0, 100), 
      phone: phone.trim().slice(0, 30), 
      brand: String(brand).trim().slice(0, 50), 
      model: String(model).trim().slice(0, 50),
      year: parsedYear,
      kilometers: Math.max(0, Number(kilometers) || 0),
      askingPrice: askingPrice ? Math.max(0, Number(askingPrice) || 0) : undefined,
      description: typeof description === 'string' ? description.trim().slice(0, 2000) : '',
      image: uploadedImage ? { url: uploadedImage.url, publicId: uploadedImage.publicId } : null,
    });
    res.status(201).json({ success: true, id: sellReq._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/sell-requests (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const requests = await SellRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/sell-requests/:id/status (admin only)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const sr = await SellRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!sr) return res.status(404).json({ message: 'Not found' });
    res.json(sr);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/sell-requests/:id (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const sellReq = await SellRequest.findById(req.params.id);
    if (!sellReq) return res.status(404).json({ message: 'Not found' });

    // Clean up media in Cloudinary
    if (sellReq.image && sellReq.image.publicId) {
      try {
        await CloudinaryService.deleteSingle(sellReq.image.publicId);
      } catch (cloudinaryErr) {
        console.warn('Failed to delete image from Cloudinary during sell request deletion:', cloudinaryErr.message);
      }
    }

    await SellRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/sell-requests/:id/delete (admin only - fallback for firewall blocks)
router.post('/:id/delete', auth, async (req, res) => {
  try {
    const sellReq = await SellRequest.findById(req.params.id);
    if (!sellReq) return res.status(404).json({ message: 'Not found' });

    if (sellReq.image && sellReq.image.publicId) {
      try {
        await CloudinaryService.deleteSingle(sellReq.image.publicId);
      } catch (cloudinaryErr) {
        console.warn('Failed to delete image from Cloudinary during sell request deletion:', cloudinaryErr.message);
      }
    }

    await SellRequest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
