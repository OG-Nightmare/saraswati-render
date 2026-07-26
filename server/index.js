import 'dotenv/config';
import { serve } from '@hono/node-server';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;

async function startServer() {
  console.log('[Startup] Connecting to MongoDB at:', mongoUri ? mongoUri.replace(/:\/\/[^@]+@/, '://***:***@') : 'MISSING_URI');

  try {
    await connectDB();
    console.log('[Startup] MongoDB connected');
  } catch (primaryErr) {
    console.warn('[Startup] Primary MongoDB connection failed:', primaryErr.message);
    console.log('[Startup] Spinning up in-memory MongoDB fallback for local development...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server').catch(() => {
        throw new Error('mongodb-memory-server is not installed. Run: npm install --save-dev mongodb-memory-server');
      });
      const mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      process.env.MONGODB_URI = memUri + 'saraswati';
      await connectDB();
      console.log('[Startup] Connected to In-Memory MongoDB at:', memUri);
    } catch (fallbackErr) {
      console.error('[Startup] In-Memory MongoDB fallback failed:', fallbackErr.message);
      process.exit(1);
    }
  }

  // Auto-seed if database is empty (dev mode)
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { default: seed } = await import('./seed.js');
      await seed(false);
    } catch (seedErr) {
      console.error('[Startup] Auto-seed failed:', seedErr.message);
    }
  }

  serve({ fetch: app.fetch, port: PORT }, (info) => {
    console.log(`[Startup] Server running on http://localhost:${info.port}`);
  });
}

startServer();
