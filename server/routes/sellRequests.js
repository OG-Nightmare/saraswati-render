import { Hono } from 'hono';
import { connectDB, isValidObjectId, ObjectId } from '../config/db.js';
import authMiddleware from '../middleware/auth.js';
import { uploadSingle, deleteSingle } from '../services/cloudinary.service.js';

const router = new Hono();

// POST /api/sell-requests  (public — visitor submits their bike)
router.post('/', async (c) => {
  try {
    const db = await connectDB();

    // Parse multipart form data (Hono handles this natively)
    const formData = await c.req.parseBody();
    const { name, phone, brand, model, year, kilometers, askingPrice, description } = formData;
    const imageFile = formData['image'];

    if (!name || !phone || !brand || !model || !year || typeof name !== 'string' || typeof phone !== 'string') {
      return c.json({ message: 'Name, phone, brand, model and valid year are required' }, 400);
    }

    const parsedYear = Number(year);
    const currentYear = new Date().getFullYear();
    if (isNaN(parsedYear) || parsedYear < 1970 || parsedYear > currentYear + 1) {
      return c.json({ message: 'Invalid vehicle manufacturing year' }, 400);
    }

    // Upload image to Cloudinary if provided
    let uploadedImage = null;
    if (imageFile && (imageFile instanceof File || imageFile instanceof Blob || Buffer.isBuffer(imageFile))) {
      uploadedImage = await uploadSingle(imageFile, 'sell-requests');
    }

    const sellReq = {
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 30),
      brand: String(brand).trim().slice(0, 50),
      model: String(model).trim().slice(0, 50),
      year: parsedYear,
      kilometers: Math.max(0, Number(kilometers) || 0),
      askingPrice: askingPrice ? Math.max(0, Number(askingPrice) || 0) : undefined,
      description: typeof description === 'string' ? description.trim().slice(0, 2000) : '',
      image: uploadedImage ? { url: uploadedImage.url, publicId: uploadedImage.publicId } : null,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('sellrequests').insertOne(sellReq);
    return c.json({ success: true, id: result.insertedId }, 201);
  } catch (err) {
    console.error('[POST /sell-requests]', err);
    return c.json({ message: 'Server error' }, 500);
  }
});

// GET /api/sell-requests  (admin only)
router.get('/', authMiddleware, async (c) => {
  try {
    const db = await connectDB();
    const requests = await db.collection('sellrequests').find().sort({ createdAt: -1 }).toArray();
    return c.json(requests);
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

// PATCH /api/sell-requests/:id/status  (admin only)
router.patch('/:id/status', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    if (!isValidObjectId(id)) return c.json({ message: 'Invalid ID' }, 400);
    const db = await connectDB();
    const body = await c.req.json().catch(() => ({}));
    const result = await db.collection('sellrequests').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status: body.status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result) return c.json({ message: 'Not found' }, 404);
    return c.json(result);
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

// Helper to delete a sell request + its Cloudinary image
const deleteSellRequest = async (db, id) => {
  const sellReq = await db.collection('sellrequests').findOne({ _id: new ObjectId(id) });
  if (!sellReq) return null;
  if (sellReq.image?.publicId) {
    try {
      await deleteSingle(sellReq.image.publicId);
    } catch (e) {
      console.warn('[sell-requests] Cloudinary delete warning:', e.message);
    }
  }
  await db.collection('sellrequests').deleteOne({ _id: new ObjectId(id) });
  return sellReq;
};

// DELETE /api/sell-requests/:id  (admin only)
router.delete('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    if (!isValidObjectId(id)) return c.json({ message: 'Invalid ID' }, 400);
    const db = await connectDB();
    const deleted = await deleteSellRequest(db, id);
    if (!deleted) return c.json({ message: 'Not found' }, 404);
    return c.json({ message: 'Deleted' });
  } catch (err) {
    console.error('[DELETE /sell-requests/:id]', err);
    return c.json({ message: 'Server error' }, 500);
  }
});

// POST /api/sell-requests/:id/delete  (admin only — firewall fallback)
router.post('/:id/delete', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    if (!isValidObjectId(id)) return c.json({ message: 'Invalid ID' }, 400);
    const db = await connectDB();
    const deleted = await deleteSellRequest(db, id);
    if (!deleted) return c.json({ message: 'Not found' }, 404);
    return c.json({ message: 'Deleted' });
  } catch (err) {
    console.error('[POST /sell-requests/:id/delete]', err);
    return c.json({ message: 'Server error' }, 500);
  }
});

export default router;
