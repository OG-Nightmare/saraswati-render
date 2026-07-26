import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { secureHeaders } from 'hono/secure-headers';
import { connectDB } from './config/db.js';

const app = new Hono();


// ── CORS Middleware ────────────────────────────────────────────────────────────
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposeHeaders: ['Server-Timing', 'X-Request-ID'],
  credentials: false,
  maxAge: 86400,
}));

// ── Secure Headers ─────────────────────────────────────────────────────────────
app.use('*', secureHeaders());

// ── Request ID Tracing ────────────────────────────────────────────────────────
app.use('*', async (c, next) => {
  const reqId = c.req.header('X-Request-ID') || `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  c.set('reqId', reqId);
  c.header('X-Request-ID', reqId);
  await next();
});

// ── DB Connection Middleware (skip health checks) ─────────────────────────────
app.use('*', async (c, next) => {
  const path = new URL(c.req.url).pathname;
  if (path === '/health' || path === '/api/health') return next();
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB connection timed out (3s)')), 3000)
    );
    await Promise.race([connectDB(), timeoutPromise]);
    await next();
  } catch (err) {
    const reqId = c.get('reqId') || 'N/A';
    console.error(`[requireDB][${reqId}] DB connection error: ${err.message}`);
    return c.json({ error: 'Database connection in progress', message: err.message, reqId }, 503);
  }
});

// ── Health Check ───────────────────────────────────────────────────────────────
app.get('/health', (c) => c.json({ status: 'OK', time: new Date() }));
app.get('/api/health', (c) => c.json({ status: 'OK', time: new Date() }));

// ── Route Imports ──────────────────────────────────────────────────────────────
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import contactRoutes from './routes/contact.js';
import testimonialRoutes from './routes/testimonials.js';
import sellRequestRoutes from './routes/sellRequests.js';

// Mount routes at both /api/<resource> and /<resource> for Vercel/CF compatibility
app.route('/api/auth', authRoutes);
app.route('/auth', authRoutes);
app.route('/api/vehicles', vehicleRoutes);
app.route('/vehicles', vehicleRoutes);
app.route('/api/contact', contactRoutes);
app.route('/contact', contactRoutes);
app.route('/api/testimonials', testimonialRoutes);
app.route('/testimonials', testimonialRoutes);
app.route('/api/sell-requests', sellRequestRoutes);
app.route('/sell-requests', sellRequestRoutes);

// ── Root Status Page ───────────────────────────────────────────────────────────
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html>
<head>
  <title>Saraswati Motors API</title>
  <style>
    body{font-family:system-ui,sans-serif;background:#fafaf8;color:#1c1c1e;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
    .card{background:white;padding:2.5rem;border-radius:16px;border:1px solid #e5e4e0;box-shadow:0 4px 20px rgba(0,0,0,.05);text-align:center;max-width:450px}
    h1{color:#f97316;margin-top:0}
    a{color:#f97316;font-weight:bold;text-decoration:none}
    .status{display:inline-block;background:#dcfce7;color:#166534;padding:4px 12px;border-radius:99px;font-size:13px;font-weight:bold;margin-bottom:1rem}
  </style>
</head>
<body>
  <div class="card">
    <div class="status">● API Backend Running (Hono)</div>
    <h1>Saraswati Motors API</h1>
    <p>Backend active and connected to MongoDB Atlas.</p>
    <p><a href="/api/health">Health Check (/api/health)</a></p>
    <p><a href="/api/vehicles">Vehicle Inventory (/api/vehicles)</a></p>
  </div>
</body>
</html>`);
});

// ── 404 Handler ────────────────────────────────────────────────────────────────
app.notFound((c) => {
  const reqId = c.get('reqId') || 'N/A';
  return c.json({ message: 'Route not found', reqId }, 404);
});

// ── Global Error Handler ───────────────────────────────────────────────────────
app.onError((err, c) => {
  const reqId = c.get('reqId') || 'N/A';
  console.error(`[${reqId}] GLOBAL ERROR:`, err.stack || err.message || err);
  return c.json({
    reqId,
    success: false,
    error: err.message || 'Internal server error',
    message: err.message || 'Internal server error',
  }, err.status || 500);
});

export default app;
