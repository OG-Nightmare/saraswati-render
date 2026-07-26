require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// 1. Disable Express fingerprinting
app.disable('x-powered-by');

// 2. CORS — manual middleware (avoids cors npm package calling app.options('*')
// which is incompatible with Express 5 / path-to-regexp v8)
const allowedOrigins = [
    'https://saraswati-eight.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CLIENT_URL,
].filter(Boolean);

const isOriginAllowed = (origin) => {
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return true;
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return true;
    return false;
};

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (isOriginAllowed(origin)) {
        if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    } else if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: 'CORS: origin not allowed' });
    }
    // Handle OPTIONS preflight — respond immediately without going to DB
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }
    next();
});


// 3. Security Headers (helmet)
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// 4. Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. NoSQL Injection Sanitizer (Express 5 compatible — in-place mutation)
const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
            const sanitizedKey = key.replace(/[$\.]/g, '_');
            obj[sanitizedKey] = sanitizeObject(obj[key]);
            delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            sanitizeObject(obj[key]);
        }
    }
    return obj;
};

app.use((req, res, next) => {
    if (req.body) sanitizeObject(req.body);
    if (req.params) sanitizeObject(req.params);
    if (req.query) sanitizeObject(req.query);
    next();
});

// 6. Rate Limiters
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
});
app.use('/api/', globalLimiter);

// 7. Static files
let uploadsPath;
try {
    uploadsPath = path.join(__dirname, 'uploads');
} catch (e) {
    uploadsPath = './uploads';
}
app.use('/uploads', express.static(uploadsPath));

// ── MongoDB Connection Helper ─────────────────────────────────────────────────

// Auto-fix MongoDB URI encoding (handles passwords with @ like pari@2006 → pari%402006)
const fixMongoUri = (uri) => {
    if (!uri || typeof uri !== 'string') return uri;
    const match = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
    if (!match) return uri;
    const scheme = match[1];
    const rest = match[2];
    const lastAt = rest.lastIndexOf('@');
    if (lastAt === -1) return uri;
    const creds = rest.substring(0, lastAt);
    const hostAndPath = rest.substring(lastAt + 1);
    const colon = creds.indexOf(':');
    if (colon === -1) return uri;
    const user = creds.substring(0, colon);
    const pass = creds.substring(colon + 1);
    return `${scheme}${encodeURIComponent(decodeURIComponent(user))}:${encodeURIComponent(decodeURIComponent(pass))}@${hostAndPath}`;
};

let connState = 'disconnected'; // 'disconnected' | 'connecting' | 'connected' | 'error'
let connPromise = null;

// Start connecting to MongoDB eagerly (called once at app init time)
const startDBConnection = () => {
    if (connState === 'connecting' || connState === 'connected') return;
    const rawUri = process.env.MONGODB_URI;
    if (!rawUri) {
        console.error('MONGODB_URI not set — cannot connect to database');
        connState = 'error';
        return;
    }
    const uri = fixMongoUri(rawUri);
    connState = 'connecting';
    connPromise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        heartbeatFrequencyMS: 30000,
    }).then(() => {
        connState = 'connected';
        connPromise = null;
        console.log('MongoDB Atlas connected ✓');
    }).catch((err) => {
        connState = 'error';
        connPromise = null;
        console.error('MongoDB connection failed:', err.message);
    });
};

// Call eagerly so DB connects during Worker warm-up
startDBConnection();

// Middleware: wait for DB or reject fast if already failed
const requireDB = async (req, res, next) => {
    if (mongoose.connection.readyState === 1) return next();
    if (connState === 'error') {
        // Retry connection
        connState = 'disconnected';
        startDBConnection();
    }
    if (connPromise) {
        // Wait for the current connection attempt (max 10s)
        try { await connPromise; } catch (e) { /* ignore, state already set */ }
    }
    if (mongoose.connection.readyState === 1) return next();
    return res.status(503).json({ message: 'Database not ready. Please try again in a moment.' });
};

// 8. DB connection middleware — only on /api routes, skip health check
app.use('/api', (req, res, next) => {
    if (req.path === '/health') return next();
    return requireDB(req, res, next);
});

// ── Routes ────────────────────────────────────────────────────────────────────

// Health check (no DB required)
app.get('/api/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/sell-requests', require('./routes/sellRequests'));

// Root status page
app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
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
        <div class="status">● API Backend Running</div>
        <h1>Saraswati Motors API</h1>
        <p>Cloudflare Worker backend is active and connected to MongoDB Atlas.</p>
        <p><a href="/api/health">Health Check (/api/health)</a></p>
        <p><a href="/api/vehicles">Vehicle Inventory (/api/vehicles)</a></p>
    </div>
</body>
</html>`);
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack || err.message);
    const status = err.status || 500;
    const message = status === 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error';
    res.status(status).json({ message });
});

module.exports = app;
