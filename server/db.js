import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * connectDB — safe to call multiple times.
 * - If already connected (readyState 1): returns immediately.
 * - If currently connecting (readyState 2): waits for that promise to resolve.
 * - Otherwise: initiates a new connection.
 *
 * The old 30-second cooldown is removed because in Vercel serverless each
 * function invocation is a fresh process, so the cooldown only blocked the
 * per-request middleware reconnect without any benefit.
 */
const connectDB = async () => {
  // Already connected — nothing to do
  if (mongoose.connection.readyState === 1) return;

  // A connection attempt is already in-flight — wait for it instead of
  // starting a second one (avoids duplicate connection race in serverless).
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    });
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DB] MONGODB_URI is not set. Cannot connect to MongoDB.');
    if (process.env.DISABLE_MEMORY_FALLBACK === 'true') {
      console.error('[DB] DISABLE_MEMORY_FALLBACK is true. Server will not start without MongoDB.');
      process.exit(1);
    }
    console.warn('[DB] Falling back to In-Memory mode. ALL DATA WILL BE LOST ON RESTART.');
    return;
  }

  try {
    mongoose.set('bufferCommands', false);

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s — enough for Atlas cold connections
      socketTimeoutMS: 45000,
    });

    const { host, name } = mongoose.connection;
    console.log(`[DB] MongoDB Connected: ${host || 'unknown'} — DB: ${name || 'unknown'}`);

    // Register event listeners only once per process
    if (!mongoose.connection.listenerCount('disconnected')) {
      mongoose.connection.on('disconnected', () => {
        console.warn('[DB] MongoDB disconnected.');
      });
      mongoose.connection.on('reconnected', () => {
        console.log('[DB] MongoDB reconnected successfully.');
      });
      mongoose.connection.on('error', (err) => {
        console.error(`[DB] MongoDB connection error: ${err.message}`);
      });
    }

  } catch (error) {
    console.error(`[DB] MongoDB Connection Failed: ${error.message}`);

    if (process.env.DISABLE_MEMORY_FALLBACK === 'true') {
      console.error('[DB] DISABLE_MEMORY_FALLBACK is true. Exiting.');
      process.exit(1);
    }

    console.warn('[DB] Running in In-Memory Fallback Mode. DATA IS NOT PERSISTED.');
  }
};

export default connectDB;
