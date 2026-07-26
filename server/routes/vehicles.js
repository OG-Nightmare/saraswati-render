import { Hono } from 'hono';
import { connectDB, isValidObjectId, ObjectId } from '../config/db.js';
import authMiddleware from '../middleware/auth.js';
import { uploadSingle, deleteMultiple } from '../services/cloudinary.service.js';

const router = new Hono();

// In-Memory Edge Cache for ultra-fast inventory responses
const memoryCache = new Map();
const CACHE_TTL_MS = 15000; // 15 seconds

const clearVehicleCache = () => memoryCache.clear();

// Helper: escape special characters for safe RegExp matching (ReDoS defence)
const escapeRegExp = (str) => (typeof str === 'string' ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '');

// ── GET /api/vehicles/debug-db  (diagnostic) ───────────────────────────────────
router.get('/debug-db', async (c) => {
  try {
    const db = await connectDB();
    const count = await db.collection('vehicles').countDocuments();
    return c.json({ success: true, count });
  } catch (err) {
    return c.json({ success: false, error: err.message, stack: err.stack });
  }
});

// ── GET /api/vehicles/test-all  (diagnostic) ──────────────────────────────────
router.get('/test-all', async (c) => {
  const results = {};
  try {
    const db = await connectDB();
    try { results.testimonialsCount = await db.collection('testimonials').countDocuments(); } catch (e) { results.testimonialsError = e.message; }
    try { results.cityCount = await db.collection('vehicles').countDocuments({ category: 'city' }); } catch (e) { results.cityError = e.message; }
    try { results.superbikeCount = await db.collection('vehicles').countDocuments({ category: 'superbike' }); } catch (e) { results.superbikeError = e.message; }
    try { results.featuredCount = await db.collection('vehicles').countDocuments({ featured: true }); } catch (e) { results.featuredError = e.message; }
    return c.json({ success: true, results });
  } catch (err) {
    return c.json({ success: false, error: err.message, stack: err.stack });
  }
});

// ── GET /api/vehicles  ─────────────────────────────────────────────────────────
router.get('/', async (c) => {
  const t0 = performance.now();
  const queryParams = c.req.query();
  const cacheKey = JSON.stringify(queryParams);
  const cached = memoryCache.get(cacheKey);

  // Fast cache hit — return immediately
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    c.header('Server-Timing', 'conn;dur=0, db;dur=0, cache;hit=1, total;dur=0');
    c.header('Cache-Control', 'public, max-age=15, stale-while-revalidate=60');
    c.header('Content-Type', 'application/json');
    return c.body(cached.jsonString, 200);
  }

  try {
    const db = await connectDB();
    const tConn = performance.now();

    const { type, brand, category, subcategory, fuelType, transmission, minPrice, maxPrice, year, sort, status, featured, search, page = '1', limit = '12' } = queryParams;

    // Build MongoDB filter query
    const filter = {};
    if (type && typeof type === 'string') filter.type = type;
    if (brand && typeof brand === 'string') filter.brand = { $regex: escapeRegExp(brand), $options: 'i' };
    if (category && typeof category === 'string') filter.category = category;
    if (subcategory && typeof subcategory === 'string') filter.subcategory = subcategory;
    if (fuelType && typeof fuelType === 'string') filter.fuelType = fuelType;
    if (transmission && typeof transmission === 'string') filter.transmission = transmission;
    if (year && !isNaN(year)) filter.year = Number(year);
    if (status && typeof status === 'string') filter.status = status;
    if (featured === 'true') filter.featured = true;
    if (search && typeof search === 'string') filter.title = { $regex: escapeRegExp(search), $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const sortMap = {
      'name-asc': { title: 1 },
      'name-desc': { title: -1 },
      newest: { createdAt: -1 },
      'price-low': { price: 1 },
      'price-high': { price: -1 },
    };
    const sortObj = sortMap[sort] || { title: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const projection = {
      title: 1, brand: 1, model: 1, type: 1, category: 1, subcategory: 1,
      year: 1, price: 1, fuelType: 1, transmission: 1, ownership: 1,
      kilometers: 1, features: 1, images: 1, registrationState: 1,
      insuranceStatus: 1, status: 1, featured: 1, createdAt: 1,
    };

    const [vehicles, total] = await Promise.all([
      db.collection('vehicles').find(filter, { projection }).sort(sortObj).skip(skip).limit(limitNum).toArray(),
      db.collection('vehicles').countDocuments(filter),
    ]);

    const tQuery = performance.now();
    const responsePayload = {
      vehicles: vehicles || [],
      total: total || 0,
      page: pageNum,
      pages: Math.ceil((total || 0) / limitNum) || 1,
    };
    const jsonString = JSON.stringify(responsePayload);

    // Store in memory cache
    try {
      memoryCache.set(cacheKey, { jsonString, timestamp: Date.now() });
      if (memoryCache.size > 200) memoryCache.clear();
    } catch (_) { /* ignore */ }

    const connMs = Math.round(tConn - t0);
    const dbMs = Math.round(tQuery - tConn);
    const totalMs = Math.round(performance.now() - t0);
    c.header('Server-Timing', `conn;dur=${connMs}, db;dur=${dbMs}, total;dur=${totalMs}`);
    c.header('Cache-Control', 'public, max-age=15, stale-while-revalidate=60');
    c.header('Content-Type', 'application/json');
    return c.body(jsonString, 200);
  } catch (err) {
    console.error('[GET /vehicles] Error:', err.stack || err);
    return c.json({ message: err.message || 'Server error', error: err.message }, 500);
  }
});

// ── GET /api/vehicles/:id ──────────────────────────────────────────────────────
router.get('/:id', async (c) => {
  const { id } = c.req.param();
  if (!isValidObjectId(id)) return c.json({ message: 'Invalid vehicle ID format' }, 404);
  try {
    const db = await connectDB();
    const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(id) });

    if (!vehicle) return c.json({ message: 'Vehicle not found' }, 404);
    return c.json(vehicle);
  } catch (err) {
    console.error(`[GET /vehicles/:id] Error for ${id}:`, err.stack || err);
    return c.json({ message: err.message || 'Server error', error: err.message }, 500);
  }
});

// ── POST /api/vehicles  (Admin protected) ─────────────────────────────────────
router.post('/', authMiddleware, async (c) => {
  try {
    const db = await connectDB();

    const formData = await c.req.parseBody({ all: true });
    let data = {};
    if (formData.data) {
      try { data = JSON.parse(formData.data); } catch (_) { data = formData; }
    } else {
      data = formData;
    }

    // Handle multiple uploaded images
    const imageFiles = formData['images'] ? (Array.isArray(formData['images']) ? formData['images'] : [formData['images']]) : [];
    const images = [];
    for (const file of imageFiles) {
      if (file && (file instanceof File || file instanceof Blob || Buffer.isBuffer(file))) {
        const result = await uploadSingle(file, 'bikes');
        images.push({ url: result.url, publicId: result.publicId, alt: data.title || 'Vehicle image', displayOrder: images.length });
      }
    }

    const vehicle = {
      title: String(data.title || '').trim(),
      brand: String(data.brand || '').trim(),
      model: String(data.model || '').trim(),
      type: String(data.type || '').trim(),
      category: data.category || 'city',
      subcategory: data.subcategory || 'commuter',
      year: Number(data.year),
      price: Number(data.price),
      fuelType: String(data.fuelType || '').trim(),
      transmission: String(data.transmission || '').trim(),
      ownership: Number(data.ownership || 1),
      kilometers: Number(data.kilometers || 0),
      description: String(data.description || '').trim(),
      features: Array.isArray(data.features) ? data.features : [],
      images,
      registrationState: data.registrationState || 'Delhi',
      insuranceStatus: data.insuranceStatus || 'Active',
      sellerNotes: data.sellerNotes || '',
      status: data.status || 'available',
      featured: Boolean(data.featured),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('vehicles').insertOne(vehicle);
    clearVehicleCache();
    return c.json({ ...vehicle, _id: result.insertedId }, 201);
  } catch (err) {
    console.error('[POST /vehicles]', err);
    return c.json({ message: err.message || 'Server error' }, 500);
  }
});

// ── PUT /api/vehicles/:id  (Admin protected) ───────────────────────────────────
router.put('/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  if (!isValidObjectId(id)) return c.json({ message: 'Invalid vehicle ID format' }, 404);

  try {
    const db = await connectDB();
    const existing = await db.collection('vehicles').findOne({ _id: new ObjectId(id) });
    if (!existing) return c.json({ message: 'Vehicle not found' }, 404);

    const formData = await c.req.parseBody({ all: true });
    let data = {};
    if (formData.data) {
      try { data = JSON.parse(formData.data); } catch (_) { data = formData; }
    } else {
      data = formData;
    }

    // Determine which existing images to keep
    let updatedImages = [];
    if (data.keepImages && Array.isArray(data.keepImages)) {
      const keepUrls = data.keepImages.map((img) => (typeof img === 'object' ? img.url : img));
      updatedImages = existing.images.filter((img) => keepUrls.includes(img.url));
    } else {
      updatedImages = [...(existing.images || [])];
    }

    // Upload new images
    const imageFiles = formData['images'] ? (Array.isArray(formData['images']) ? formData['images'] : [formData['images']]) : [];
    for (const file of imageFiles) {
      if (file && (file instanceof File || file instanceof Blob || Buffer.isBuffer(file))) {
        const result = await uploadSingle(file, 'bikes');
        updatedImages.push({ url: result.url, publicId: result.publicId, alt: data.title || existing.title, displayOrder: updatedImages.length });
      }
    }

    const update = {
      title: String(data.title ?? existing.title).trim(),
      brand: String(data.brand ?? existing.brand).trim(),
      model: String(data.model ?? existing.model).trim(),
      type: String(data.type ?? existing.type).trim(),
      category: data.category ?? existing.category,
      subcategory: data.subcategory ?? existing.subcategory,
      year: Number(data.year ?? existing.year),
      price: Number(data.price ?? existing.price),
      fuelType: String(data.fuelType ?? existing.fuelType).trim(),
      transmission: String(data.transmission ?? existing.transmission).trim(),
      ownership: Number(data.ownership ?? existing.ownership),
      kilometers: Number(data.kilometers ?? existing.kilometers),
      description: String((data.description ?? existing.description) || '').trim(),
      features: Array.isArray(data.features) ? data.features : existing.features,
      images: updatedImages,
      registrationState: data.registrationState ?? existing.registrationState,
      insuranceStatus: data.insuranceStatus ?? existing.insuranceStatus,
      sellerNotes: data.sellerNotes ?? existing.sellerNotes,
      status: data.status ?? existing.status,
      featured: data.featured !== undefined ? Boolean(data.featured) : existing.featured,
      updatedAt: new Date(),
    };

    const result = await db.collection('vehicles').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );
    clearVehicleCache();
    return c.json(result);
  } catch (err) {
    console.error(`[PUT /vehicles/:id]`, err);
    return c.json({ message: err.message || 'Server error' }, 500);
  }
});

// ── DELETE /api/vehicles/:id  (Admin protected) ────────────────────────────────
router.delete('/:id', authMiddleware, async (c) => {
  const { id } = c.req.param();
  if (!isValidObjectId(id)) return c.json({ message: 'Invalid vehicle ID format' }, 404);
  try {
    const db = await connectDB();
    const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(id) });
    if (!vehicle) return c.json({ message: 'Vehicle not found' }, 404);

    const publicIds = (vehicle.images || []).map((img) => img.publicId).filter(Boolean);
    if (publicIds.length > 0) {
      await deleteMultiple(publicIds).catch((e) => console.warn('[Cloudinary delete warning]', e.message));
    }

    await db.collection('vehicles').deleteOne({ _id: new ObjectId(id) });
    clearVehicleCache();
    return c.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error(`[DELETE /vehicles/:id]`, err);
    return c.json({ message: 'Server error' }, 500);
  }
});

// ── POST /api/vehicles/:id/delete  (Fallback for platforms restricting DELETE) ─
router.post('/:id/delete', authMiddleware, async (c) => {
  const { id } = c.req.param();
  if (!isValidObjectId(id)) return c.json({ message: 'Invalid vehicle ID format' }, 404);
  try {
    const db = await connectDB();
    const vehicle = await db.collection('vehicles').findOne({ _id: new ObjectId(id) });
    if (!vehicle) return c.json({ message: 'Vehicle not found' }, 404);

    const publicIds = (vehicle.images || []).map((img) => img.publicId).filter(Boolean);
    if (publicIds.length > 0) {
      await deleteMultiple(publicIds).catch((e) => console.warn('[Cloudinary delete warning]', e.message));
    }

    await db.collection('vehicles').deleteOne({ _id: new ObjectId(id) });
    clearVehicleCache();
    return c.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error(`[POST /vehicles/:id/delete]`, err);
    return c.json({ message: 'Server error' }, 500);
  }
});

export default router;
