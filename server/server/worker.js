/**
 * Cloudflare Worker entry point — Saraswati Motors Express backend.
 *
 * Architecture:
 * - On first fetch(), inject env secrets and lazily init Express app
 * - Connect to MongoDB separately (non-blocking) using ctx.waitUntil
 * - Use httpServerHandler to bridge Cloudflare requests to Express
 * - Health check always responds instantly (no DB required)
 */
import { httpServerHandler } from 'cloudflare:node';

const PORT = 8080;
let appHandler = null;
let envInjected = false;

function injectEnv(env) {
  if (envInjected || !env || typeof env !== 'object') return;
  for (const [key, value] of Object.entries(env)) {
    if (typeof value === 'string') {
      process.env[key] = value;
    }
  }
  envInjected = true;
}

function initApp() {
  if (appHandler) return appHandler;
  const app = require('./app.js');
  app.listen(PORT);
  appHandler = httpServerHandler({ port: PORT });
  return appHandler;
}

export default {
  async fetch(request, env, ctx) {
    // 1. Inject Cloudflare secrets into process.env (e.g. MONGODB_URI, JWT_SECRET)
    injectEnv(env);

    // 2. Init Express app lazily (first request only)
    const handler = initApp();

    // 3. Delegate to Express via httpServerHandler
    if (typeof handler === 'function') {
      return handler(request, env, ctx);
    }
    if (handler && typeof handler.fetch === 'function') {
      return handler.fetch(request, env, ctx);
    }

    return new Response('Worker initialization failed', { status: 500 });
  },
};
