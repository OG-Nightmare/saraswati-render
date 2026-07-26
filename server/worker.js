/**
 * Cloudflare Worker entry point — Saraswati Motors Hono backend.
 *
 * Architecture:
 * - Hono's fetch handler is used directly as the Worker fetch handler.
 * - Cloudflare secrets (MONGODB_URI, JWT_SECRET, etc.) are injected into
 *   process.env before each request is processed.
 * - Cloudinary is re-configured on each cold start since env vars are
 *   injected at request time in CF Workers.
 */
import app from './app.js';
import { configure } from './config/cloudinary.js';

function injectEnv(env) {
  if (!env || typeof env !== 'object') return;
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string') {
      process.env[key] = value;
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    // 1. Inject Cloudflare secrets into process.env
    injectEnv(env);

    // 2. Re-configure Cloudinary with injected env vars
    configure();

    // 3. Delegate to Hono app — clean and direct
    return app.fetch(request, env, ctx);
  },
};
