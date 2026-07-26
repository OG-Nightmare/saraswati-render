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
console.log(`[API Init] Target API URL: ${activeBaseURL}`);

const api = axios.create({
  baseURL: activeBaseURL,
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

  console.log(`[API Req ${reqId}] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Handle responses & errors with Request ID correlation logging
api.interceptors.response.use(
  (res) => {
    const reqId = res.config?.reqId || res.headers?.['x-request-id'] || 'N/A';
    console.log(`[API Res ${reqId}] Status ${res.status} ${res.config?.url}`);
    return res;
  },
  (err) => {
    const reqId = err.config?.reqId || err.response?.headers?.['x-request-id'] || 'N/A';
    const status = err.response?.status || 'NETWORK_ERROR';
    console.error(`[API Error ${reqId}] Status: ${status} | URL: ${err.config?.url} | Message: ${err.message}`, err.response?.data);

    const isLoginReq = err.config?.url?.includes('/auth/login');
    const isLoginPage = window.location.pathname.includes('/admin/login');
    if (err.response?.status === 401 && !isLoginReq && !isLoginPage) {
      localStorage.removeItem('sm_token');
      localStorage.removeItem('sm_admin');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

export default api;
