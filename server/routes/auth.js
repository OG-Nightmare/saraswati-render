import { Hono } from 'hono';
import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;
import bcryptPkg from 'bcryptjs';
const { hash, compare } = bcryptPkg;
import { connectDB } from '../config/db.js';
import {
  HARDCODED_ADMIN_PHONE,
  maskPhoneNumber,
  generateOtp,
  dispatchOtp,
  saveOtpToDB,
  verifyOtpFromDB,
  clearOtpFromDB,
} from '../services/otp.service.js';

const router = new Hono();

const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'admin@123$';
const JWT_SECRET = process.env.JWT_SECRET || 'saraswati_motors_fallback_secret_2026';

// ── GET /api/auth/info ──────────────────────────────────────────────────────────
// Returns public auth configuration metadata
router.get('/info', async (c) => {
  return c.json({
    adminUsername: DEFAULT_ADMIN_USERNAME,
    maskedPhone: maskPhoneNumber(HARDCODED_ADMIN_PHONE),
    phone: HARDCODED_ADMIN_PHONE,
  });
});

// ── POST /api/auth/login ───────────────────────────────────────────────────────
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
    if (!admin && cleanUsername === DEFAULT_ADMIN_USERNAME) {
      console.log(`[Auth] Seeding default admin user (${DEFAULT_ADMIN_USERNAME} / ${DEFAULT_ADMIN_PASSWORD})...`);
      const hashedPassword = await hash(DEFAULT_ADMIN_PASSWORD, 12);
      const result = await admins.insertOne({
        username: DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
        phone: HARDCODED_ADMIN_PHONE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      admin = await admins.findOne({ _id: result.insertedId });
    }

    if (!admin) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    // Compare with current password hash
    let isMatch = await compare(password, admin.password);

    // Backward-compatibility migration:
    // If entered password is the new default 'admin@123$' but database still had the old 'admin@123'
    if (!isMatch && password === DEFAULT_ADMIN_PASSWORD) {
      const isOldDefault = await compare('admin@123', admin.password).catch(() => false);
      if (isOldDefault) {
        console.log(`[Auth] Upgrading existing admin account password to ${DEFAULT_ADMIN_PASSWORD}`);
        const newHashed = await hash(DEFAULT_ADMIN_PASSWORD, 12);
        await admins.updateOne(
          { _id: admin._id },
          { $set: { password: newHashed, updatedAt: new Date(), phone: HARDCODED_ADMIN_PHONE } }
        );
        isMatch = true;
      }
    }

    if (!isMatch) {
      return c.json({ message: 'Invalid credentials' }, 401);
    }

    const token = sign(
      { id: admin._id.toString(), username: admin.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return c.json({
      token,
      username: admin.username,
      message: 'Login successful',
    });
  } catch (err) {
    console.error('[POST /auth/login] Error:', err.stack || err);
    return c.json({ message: err.message || 'Server error' }, 500);
  }
});

// ── POST /api/auth/forgot-password ─────────────────────────────────────────────
// Dispatches a 6-digit OTP to the hard-coded registered phone number
router.post('/forgot-password', async (c) => {
  try {
    const db = await connectDB();
    const admins = db.collection('admins');

    // Ensure admin user exists
    let admin = await admins.findOne({ username: DEFAULT_ADMIN_USERNAME });
    if (!admin) {
      const hashedPassword = await hash(DEFAULT_ADMIN_PASSWORD, 12);
      const result = await admins.insertOne({
        username: DEFAULT_ADMIN_USERNAME,
        password: hashedPassword,
        phone: HARDCODED_ADMIN_PHONE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      admin = await admins.findOne({ _id: result.insertedId });
    }

    const otp = generateOtp();
    await saveOtpToDB(db, {
      username: DEFAULT_ADMIN_USERNAME,
      phone: HARDCODED_ADMIN_PHONE,
      otp,
      expiresInMinutes: 10,
    });

    const dispatchResult = await dispatchOtp(HARDCODED_ADMIN_PHONE, otp);

    return c.json({
      success: true,
      message: `OTP sent successfully to registered admin phone (${dispatchResult.maskedPhone})`,
      maskedPhone: dispatchResult.maskedPhone,
      expiresInSeconds: dispatchResult.expiresInSeconds,
      // Provide devOtp when not in production so testing is instant
      devOtp: process.env.NODE_ENV === 'production' ? undefined : otp,
    });
  } catch (err) {
    console.error('[POST /auth/forgot-password] Error:', err.stack || err);
    return c.json({ success: false, message: err.message || 'Failed to dispatch OTP' }, 500);
  }
});

// ── POST /api/auth/verify-otp ──────────────────────────────────────────────────
// Validates the entered 6-digit OTP and provides a temporary reset token
router.post('/verify-otp', async (c) => {
  try {
    const db = await connectDB();
    const body = await c.req.json().catch(() => ({}));
    const { otp } = body;

    const verification = await verifyOtpFromDB(db, {
      username: DEFAULT_ADMIN_USERNAME,
      otp,
    });

    if (!verification.valid) {
      return c.json({ success: false, message: verification.error }, 400);
    }

    // Generate short-lived reset token (valid for 15 minutes)
    const resetToken = sign(
      { username: DEFAULT_ADMIN_USERNAME, purpose: 'admin_password_reset' },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    return c.json({
      success: true,
      message: 'OTP verified successfully',
      resetToken,
    });
  } catch (err) {
    console.error('[POST /auth/verify-otp] Error:', err.stack || err);
    return c.json({ success: false, message: err.message || 'Failed to verify OTP' }, 500);
  }
});

// ── POST /api/auth/reset-password ──────────────────────────────────────────────
// Resets the admin password using either the verified resetToken or directly with the OTP
router.post('/reset-password', async (c) => {
  try {
    const db = await connectDB();
    const body = await c.req.json().catch(() => ({}));
    const { otp, resetToken, newPassword } = body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 6) {
      return c.json({ success: false, message: 'New password must be at least 6 characters long' }, 400);
    }

    let isAuthorized = false;

    // Option A: Verified via resetToken
    if (resetToken && typeof resetToken === 'string') {
      try {
        const decoded = verify(resetToken, JWT_SECRET);
        if (decoded && decoded.purpose === 'admin_password_reset' && decoded.username === DEFAULT_ADMIN_USERNAME) {
          isAuthorized = true;
        }
      } catch (tokenErr) {
        // Reset token expired or invalid, fall back to check OTP
      }
    }

    // Option B: Verified directly via OTP
    if (!isAuthorized && otp) {
      const verification = await verifyOtpFromDB(db, {
        username: DEFAULT_ADMIN_USERNAME,
        otp,
      });
      if (verification.valid) {
        isAuthorized = true;
      } else {
        return c.json({ success: false, message: verification.error }, 400);
      }
    }

    if (!isAuthorized) {
      return c.json({ success: false, message: 'Invalid or expired OTP session. Please request a new OTP.' }, 401);
    }

    // Hash and update the password
    const hashedPassword = await hash(newPassword.trim(), 12);
    const admins = db.collection('admins');

    const updateResult = await admins.updateOne(
      { username: DEFAULT_ADMIN_USERNAME },
      {
        $set: {
          password: hashedPassword,
          phone: HARDCODED_ADMIN_PHONE,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Invalidate OTPs so they cannot be reused
    await clearOtpFromDB(db, { username: DEFAULT_ADMIN_USERNAME });

    console.log(`[Auth] ✅ Admin password successfully updated by admin`);

    return c.json({
      success: true,
      message: 'Admin password has been reset successfully. You can now login with your new password.',
    });
  } catch (err) {
    console.error('[POST /auth/reset-password] Error:', err.stack || err);
    return c.json({ success: false, message: err.message || 'Failed to reset password' }, 500);
  }
});

export default router;
