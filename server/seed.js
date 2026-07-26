import 'dotenv/config';
import bcryptPkg from 'bcryptjs';
const { hash } = bcryptPkg;
import { connectDB, getDB } from './config/db.js';

async function seed(shouldConnect = false) {
  if (shouldConnect) {
    await connectDB();
    console.log('[Seed] Connected to MongoDB');
  }

  const db = getDB();

  // ── Seed admin ─────────────────────────────────────────────────────────────
  const admins = db.collection('admins');
  const existingAdmin = await admins.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const hashedPassword = await hash('admin@123', 12);
    await admins.insertOne({
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('[Seed] ✅ Admin created — username: admin | password: admin@123');
  } else {
    console.log('[Seed] ℹ️  Admin already exists, skipping');
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
