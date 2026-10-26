import axios from 'axios';

// Dynamically resolve base API URL for local dev and Vercel production
const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  return '/api';
};

const activeBaseURL = getBaseURL();
const isDev = import.meta.env.DEV;

if (isDev) {
  console.log(`[API Init] Target API URL: ${activeBaseURL}`);
}

const api = axios.create({
  baseURL: activeBaseURL,
});

// Lightweight memory cache & in-flight deduplicator for GET requests
const responseCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 45000; // 45 seconds cache for public GET queries

const invalidateCache = () => {
  responseCache.clear();
};

// Wrap GET for in-flight deduplication & short-TTL cache
const originalGet = api.get;
api.get = function (url, config = {}) {
  const bypassCache = config.bypassCache || config.headers?.['Cache-Control'] === 'no-cache';
  const cacheKey = `get:${url}:${config.params ? JSON.stringify(config.params) : ''}`;

  if (!bypassCache) {
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return Promise.resolve(cached.data);
    }

    if (inFlightRequests.has(cacheKey)) {
      return inFlightRequests.get(cacheKey);
    }
  }

  const promise = originalGet.call(this, url, config)
    .then((response) => {
      if (!bypassCache && response.status === 200) {
        responseCache.set(cacheKey, {
          timestamp: Date.now(),
          data: response,
        });
      }
      return response;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  if (!bypassCache) {
    inFlightRequests.set(cacheKey, promise);
  }

  return promise;
};

// Auto-invalidate cache on write mutations
['post', 'put', 'delete', 'patch'].forEach((method) => {
  const originalMethod = api[method];
  api[method] = function (...args) {
    invalidateCache();
    return originalMethod.apply(this, args);
  };
});

// Inject JWT token & unique X-Request-ID into every outgoing request
api.interceptors.request.use((config) => {
  const reqId = `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  config.headers['X-Request-ID'] = reqId;
  config.reqId = reqId;

  const token = localStorage.getItem('sm_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (isDev) {
    console.log(`[API Req ${reqId}] ${config.method?.toUpperCase()} ${config.url}`);
  }
  return config;
});

// Handle responses & errors with Request ID correlation logging
api.interceptors.response.use(
  (res) => {
    if (isDev) {
      const reqId = res.config?.reqId || res.headers?.['x-request-id'] || 'N/A';
      console.log(`[API Res ${reqId}] Status ${res.status} ${res.config?.url}`);
    }
    return res;
  },
  (err) => {
    const reqId = err.config?.reqId || err.response?.headers?.['x-request-id'] || 'N/A';
    const status = err.response?.status || 'NETWORK_ERROR';
    if (isDev) {
      console.error(`[API Error ${reqId}] Status: ${status} | URL: ${err.config?.url} | Message: ${err.message}`, err.response?.data);
    }

    const isLoginReq = err.config?.url?.includes('/auth/login');
    const isLoginPage = typeof window !== 'undefined' && window.location.pathname.includes('/admin/login');
    if (err.response?.status === 401 && !isLoginReq && !isLoginPage) {
      localStorage.removeItem('sm_token');
      localStorage.removeItem('sm_admin');
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
