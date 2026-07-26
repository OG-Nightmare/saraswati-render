import { Hono } from 'hono';
import { connectDB, isValidObjectId, ObjectId } from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = new Hono();

// GET /api/testimonials  (public — with graceful fallback)
router.get('/', async (c) => {
  try {
    const db = await connectDB();
    let testimonials = [];
    try {
      testimonials = await db.collection('testimonials')
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .toArray();
    } catch (e) {
      console.warn('[GET /testimonials] DB query warning:', e.message);
    }
    c.header('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
    return c.json(Array.isArray(testimonials) ? testimonials : []);
  } catch (err) {
    return c.json([], 200);
  }
});

// GET /api/testimonials/all  (protected — includes inactive)
router.get('/all', authMiddleware, async (c) => {
  try {
    const db = await connectDB();
    const testimonials = await db.collection('testimonials').find().sort({ createdAt: -1 }).toArray();
    return c.json(Array.isArray(testimonials) ? testimonials : []);
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

// POST /api/testimonials  (protected)
router.post('/', authMiddleware, async (c) => {
  try {
    const db = await connectDB();
    const body = await c.req.json().catch(() => ({}));
    const testimonial = {
      name: String(body.name || '').trim(),
      review: String(body.review || '').trim(),
      rating: Math.min(5, Math.max(1, Number(body.rating) || 5)),
      image: String(body.image || ''),
      isActive: body.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('testimonials').insertOne(testimonial);
    return c.json({ ...testimonial, _id: result.insertedId }, 201);
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

// PUT /api/testimonials/:id  (protected)
router.put('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    if (!isValidObjectId(id)) return c.json({ message: 'Invalid ID' }, 400);
    const db = await connectDB();
    const body = await c.req.json().catch(() => ({}));
    const update = { updatedAt: new Date() };
    if (body.name !== undefined) update.name = String(body.name).trim();
    if (body.review !== undefined) update.review = String(body.review).trim();
    if (body.rating !== undefined) update.rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    if (body.image !== undefined) update.image = String(body.image);
    if (body.isActive !== undefined) update.isActive = Boolean(body.isActive);
    const result = await db.collection('testimonials').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    if (!result) return c.json({ message: 'Not found' }, 404);
    return c.json(result);
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

// DELETE /api/testimonials/:id  (protected)
router.delete('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    if (!isValidObjectId(id)) return c.json({ message: 'Invalid ID' }, 400);
    const db = await connectDB();
    await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) });
    return c.json({ message: 'Deleted' });
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

export default router;
