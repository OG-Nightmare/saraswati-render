# Deploying Saraswati Motors to Cloudflare

This guide explains how to deploy both the Express backend API to **Cloudflare Workers** and the React frontend SPA to **Cloudflare Pages**.

---

## 1. Prerequisites

1. Install Cloudflare Wrangler CLI globally (or use `npx wrangler`):
   ```bash
   npm install -g wrangler
   ```

2. Log in to your Cloudflare Account:
   ```bash
   wrangler login
   ```

---

## 2. Deploying Backend API (Cloudflare Worker)

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Set Cloudflare Secrets (Environment Variables)
Set your environment variables using Cloudflare Wrangler Secrets so they are encrypted and available to your worker:

```bash
npx wrangler secret put MONGODB_URI
# (Paste your MongoDB Atlas connection string when prompted)

npx wrangler secret put JWT_SECRET
# (Paste your JWT secret string when prompted)

npx wrangler secret put WHATSAPP_NUMBER
# (e.g. 9811798761)

# Optional: Cloudinary Credentials (if configured)
npx wrangler secret put CLOUDINARY_CLOUD_NAME
npx wrangler secret put CLOUDINARY_API_KEY
npx wrangler secret put CLOUDINARY_API_SECRET
```

### Step 3: Deploy Worker to Cloudflare
```bash
npx wrangler deploy
```

> **Deployed Backend URL**: Once deployed, Wrangler will output your worker URL (e.g., `https://saraswati-backend.<your-subdomain>.workers.dev`). Copy this URL.

---

## 3. Deploying Frontend App (Cloudflare Pages)

### Step 1: Navigate to Client Directory
```bash
cd ../client
```

### Step 2: Configure Environment Variable
In `client/.env` (or during build), set `VITE_API_URL` to your deployed backend Cloudflare Worker URL:

```env
VITE_API_URL=https://saraswati-backend.<your-subdomain>.workers.dev
```

### Step 3: Build & Deploy to Cloudflare Pages
```bash
npm run deploy
```

> **Deployed Frontend URL**: Wrangler will deploy your static SPA build (`dist`) with automatic `/* -> /index.html` fallback rules and output your live site URL (e.g., `https://saraswati-motors.pages.dev`).

---

## 4. Verification & Testing

1. Open your live Cloudflare Pages URL in your browser.
2. Check home page bike inventory, category filters, and vehicle detail pages.
3. Test Admin Login at `/admin/login` using username `admin` and password `admin@123`.
4. Test Contact and Sell Bike form submissions.
