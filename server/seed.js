import 'dotenv/config';
import bcryptPkg from 'bcryptjs';
const { hash, compare } = bcryptPkg;
import { connectDB, getDB } from './config/db.js';

const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_DEFAULT_PASSWORD || 'admin@123$';
const ADMIN_PHONE = process.env.ADMIN_PHONE || '+91 98117 98761';

async function seed(shouldConnect = false) {
  if (shouldConnect) {
    await connectDB();
    console.log('[Seed] Connected to MongoDB');
  }

  const db = getDB();

  // ── Seed admin ─────────────────────────────────────────────────────────────
  const admins = db.collection('admins');
  const existingAdmin = await admins.findOne({ username: DEFAULT_ADMIN_USERNAME });

  if (!existingAdmin) {
    const hashedPassword = await hash(DEFAULT_ADMIN_PASSWORD, 12);
    await admins.insertOne({
      username: DEFAULT_ADMIN_USERNAME,
      password: hashedPassword,
      phone: ADMIN_PHONE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`[Seed] ✅ Admin created — username: ${DEFAULT_ADMIN_USERNAME} | password: ${DEFAULT_ADMIN_PASSWORD}`);
  } else {
    // If admin exists with older default password 'admin@123', upgrade to 'admin@123$'
    const isOldDefault = await compare('admin@123', existingAdmin.password).catch(() => false);
    if (isOldDefault) {
      const hashedPassword = await hash(DEFAULT_ADMIN_PASSWORD, 12);
      await admins.updateOne(
        { _id: existingAdmin._id },
        {
          $set: {
            password: hashedPassword,
            phone: ADMIN_PHONE,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`[Seed] 🔄 Upgraded admin password to new default: ${DEFAULT_ADMIN_PASSWORD}`);
    } else {
      console.log('[Seed] ℹ️  Admin already configured in database');
    }
  }
}

// Run directly: node seed.js
if (process.argv[1] === new URL(import.meta.url).pathname || process.argv[1]?.endsWith('seed.js')) {
  connectDB().then(() => seed(false)).then(() => {
    console.log('[Seed] Done!');
    process.exit(0);
  }).catch((err) => {
    console.error('[Seed] Error:', err);
    process.exit(1);
  });
}

export default seed;
