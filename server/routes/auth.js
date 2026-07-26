import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
const { sign } = jwt;
import bcryptPkg from 'bcryptjs';
const { hash, compare } = bcryptPkg;
import { connectDB } from '../config/db.js';

const router = new Hono();

// POST /api/auth/login
router.post('/login', async (c) => {
  try {
    const db = await connectDB();
    const body = await c.req.json().catch(() => ({}));
    const { username, password } = body;

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return c.json({ message: 'Username and password required' }, 400);
    }

    const cleanUsername = username.trim();
    const admins = db.collection('admins');
    let admin = await admins.findOne({ username: cleanUsername });

    // Auto-seed default admin if none exists
    if (!admin && cleanUsername === 'admin') {
      console.log('[Auth] Seeding default admin user (admin / admin@123)...');
      const hashedPassword = await hash('admin@123', 12);
      const result = await admins.insertOne({
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      admin = await admins.findOne({ _id: result.insertedId });
    }

    if (!admin) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const isMatch = await compare(password, admin.password);
    if (!isMatch) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const token = sign(
      { id: admin._id.toString(), username: admin.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    return c.json({ token, username: admin.username });
  } catch (err) {
    console.error('[POST /auth/login] Error:', err.stack || err);
    return c.json({ message: err.message || 'Server error' }, 500);
  }
});

export default router;
