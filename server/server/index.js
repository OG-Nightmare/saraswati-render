require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI;

// Only call app.listen in local development
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    console.log("Connecting to MongoDB at: " + mongoUri);
    mongoose
        .connect(mongoUri)
        .then(async () => {
            console.log('MongoDB connected');

            // Auto-seed if database is empty (dev mode)
            try {
                const Vehicle = require('./models/Vehicle');
                const count = await Vehicle.countDocuments();
                if (count === 0) {
                    console.log('Database is empty. Running auto-seed...');
                    const seed = require('./seed');
                    await seed(false);
                    console.log('Auto-seed completed successfully');
                } else {
                    console.log("Database already has " + count + " vehicles. Skipping auto-seed.");
                }
            } catch (seedErr) {
                console.error('Auto-seed failed:', seedErr.message);
            }

            app.listen(PORT, () => console.log("Server running on port: " + PORT));
        })
        .catch(async (err) => {
            console.warn('Primary MongoDB connection failed:', err.message);
            console.log('Spinning up in-memory MongoDB server for local development fallback...');
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                const mongoServer = await MongoMemoryServer.create();
                const memUri = mongoServer.getUri();
                await mongoose.connect(memUri);
                console.log('Connected to In-Memory MongoDB at:', memUri);

                const Vehicle = require('./models/Vehicle');
                const count = await Vehicle.countDocuments();
                if (count === 0) {
                    console.log('Running auto-seed for in-memory database...');
                    const seed = require('./seed');
                    await seed(false);
                    console.log('Auto-seed completed successfully');
                }

                app.listen(PORT, () => console.log("Server running on port: " + PORT + " (In-Memory DB)"));
            } catch (fallbackErr) {
                console.error('In-Memory MongoDB fallback failed:', fallbackErr.message);
                process.exit(1);
            }
        });
}

module.exports = app;
