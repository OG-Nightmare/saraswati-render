import { Hono } from 'hono';
import { connectDB, isValidObjectId, ObjectId } from '../config/db.js';
import authMiddleware from '../middleware/auth.js';

const router = new Hono();

// POST /api/contact  (public)
router.post('/', async (c) => {
  try {
    const db = await connectDB();
    const body = await c.req.json().catch(() => ({}));
    const { name, phone, email, message, vehicleInterested } = body;

    if (!name || !phone || !message || typeof name !== 'string' || typeof phone !== 'string' || typeof message !== 'string') {
      return c.json({ message: 'Name, phone and message are required strings' }, 400);
    }

    const contact = {
      name: name.trim().slice(0, 100),
      phone: phone.trim().slice(0, 30),
      email: typeof email === 'string' ? email.trim().slice(0, 100) : '',
      message: message.trim().slice(0, 2000),
      vehicleInterested: typeof vehicleInterested === 'string' ? vehicleInterested.trim().slice(0, 100) : '',
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('contacts').insertOne(contact);
    return c.json({ success: true, contact: { ...contact, _id: result.insertedId } }, 201);
  } catch (err) {
    console.error('[POST /contact]', err);
    return c.json({ message: 'Server error' }, 500);
  }
});

// GET /api/contact  (protected)
router.get('/', authMiddleware, async (c) => {
  try {
    const db = await connectDB();
    const contacts = await db.collection('contacts').find().sort({ createdAt: -1 }).toArray();
    return c.json(contacts);
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

// PATCH /api/contact/:id/status  (protected)
router.patch('/:id/status', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    if (!isValidObjectId(id)) return c.json({ message: 'Invalid ID' }, 400);
    const db = await connectDB();
    const body = await c.req.json().catch(() => ({}));
    const result = await db.collection('contacts').findOneAndUpdate(
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

// DELETE /api/contact/:id  (protected)
router.delete('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    if (!isValidObjectId(id)) return c.json({ message: 'Invalid ID' }, 400);
    const db = await connectDB();
    await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    return c.json({ message: 'Deleted' });
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

// POST /api/contact/:id/delete  (protected — fallback for firewall blocks on DELETE)
router.post('/:id/delete', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    if (!isValidObjectId(id)) return c.json({ message: 'Invalid ID' }, 400);
    const db = await connectDB();
    await db.collection('contacts').deleteOne({ _id: new ObjectId(id) });
    return c.json({ message: 'Deleted' });
  } catch (err) {
    return c.json({ message: 'Server error' }, 500);
  }
});

export default router;
