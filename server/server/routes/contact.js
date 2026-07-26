const express = require('express');
const rateLimit = require('express-rate-limit');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const router = express.Router();

// Public Form Rate Limiter: Max 10 requests per 15 minutes
const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many contact requests submitted. Please try again after 15 minutes.' }
});

// POST /api/contact  (public)
router.post('/', formLimiter, async (req, res) => {
  try {
    const { name, phone, email, message, vehicleInterested } = req.body;
    if (!name || !phone || !message || typeof name !== 'string' || typeof phone !== 'string' || typeof message !== 'string') {
      return res.status(400).json({ message: 'Name, phone and message are required strings' });
    }
    const cleanContact = {
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 30),
      email: typeof email === 'string' ? email.trim().slice(0, 100) : '',
      message: message.trim().slice(0, 2000),
      vehicleInterested: typeof vehicleInterested === 'string' ? vehicleInterested.trim().slice(0, 100) : '',
    };
    const contact = await Contact.create(cleanContact);
    res.status(201).json({ success: true, contact });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/contact  (protected)
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/contact/:id/status  (protected)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Not found' });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/contact/:id  (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/contact/:id/delete (protected - fallback for firewall blocks)
router.post('/:id/delete', auth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
