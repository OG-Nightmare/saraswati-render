import { MongoClient, ObjectId } from 'mongodb';
import dns from 'dns';

// Configure reliable DNS servers for SRV lookups in Node.js environment
try {
  if (dns && typeof dns.setServers === 'function') {
    dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
  }
} catch (e) {
  // Ignore in Cloudflare Worker runtime
}

// Auto-fix MongoDB URI encoding (handles passwords with @ like pari@2006 → pari%402006)
export const fixMongoUri = (uri) => {
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

// Validate a hex ObjectId string
export const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export { ObjectId };

let client = null;
let db = null;
let connectionPromise = null;

const createIndexes = async (database) => {
  try {
    const vehicles = database.collection('vehicles');
    await Promise.all([
      vehicles.createIndex({ type: 1, status: 1, featured: -1 }),
      vehicles.createIndex({ category: 1, subcategory: 1 }),
      vehicles.createIndex({ brand: 1 }),
      vehicles.createIndex({ price: 1 }),
      vehicles.createIndex({ year: -1 }),
      vehicles.createIndex({ createdAt: -1 }),
      vehicles.createIndex({ title: 'text' }),
    ]);
    console.log('[DB] Indexes ensured on vehicles collection');
  } catch (e) {
    console.warn('[DB] Index creation warning:', e.message);
  }
};

export const connectDB = async () => {
  // Already connected — return immediately
  if (client && db) {
    return db;
  }

  // Await any in-flight connection attempt
  if (connectionPromise) {
    try {
      await connectionPromise;
      if (db) return db;
    } catch (_) {
      connectionPromise = null;
    }
  }

  let rawUri = process.env.MONGODB_URI;
  if (!rawUri) {
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        rawUri = mongoServer.getUri() + 'saraswati';
        process.env.MONGODB_URI = rawUri;
        console.log('[DB] Auto-started in-memory MongoDB for development at:', rawUri);
      } catch (err) {
        throw new Error('MONGODB_URI environment variable is not defined and in-memory fallback could not start: ' + err.message);
      }
    } else {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
  }
  const uri = fixMongoUri(rawUri);


  connectionPromise = (async () => {
    try {
      console.log('[DB] Initiating new MongoClient connection...');
      const newClient = new MongoClient(uri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 20000,
        maxPoolSize: 2,
        minPoolSize: 0,
        maxIdleTimeMS: 15000,
      });
      await newClient.connect();
      const dbName = new URL(uri.replace('mongodb+srv://', 'https://')).pathname.slice(1).split('?')[0] || 'saraswati';
      const database = newClient.db(dbName || 'saraswati');
      createIndexes(database).catch(e => console.warn('[DB] Index creation warning:', e.message));
      client = newClient;
      db = database;
      console.log(`[DB] Connected successfully to database: ${database.databaseName}`);
      return database;
    } catch (err) {
      client = null;
      db = null;
      console.error('[DB] Connection failed:', err.message);
      throw err;
    } finally {
      connectionPromise = null;
    }
  })();

  try {
    return await connectionPromise;
  } catch (err) {
    throw err;
  }
};

export const getDB = () => {
  if (!db) throw new Error('Database not connected. Call connectDB() first.');
  return db;
};
