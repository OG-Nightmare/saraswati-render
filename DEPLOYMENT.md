# Saraswati Motors – Deployment Guide

## Step 1 – Run Locally First

### Prerequisites
- **MongoDB** running locally: `mongod` (or use MongoDB Compass)
- **Node.js** v18+

### Start Backend

```bash
cd server
npm install
npm run seed       # seeds admin + sample vehicles
npm run dev        # starts on http://https://saraswati-backend.parikshitkapoor2.workers.dev/api:5000
```

### Start Frontend

```bash
cd client
npm install
npm run dev        # starts on http://https://saraswati-backend.parikshitkapoor2.workers.dev/api:5173
```

### Admin Login
- URL: `http://https://saraswati-backend.parikshitkapoor2.workers.dev/api:5173/admin/login`
- Username: `admin`
- Password: `admin@123`

---

## Step 2 – Deploy Backend to Railway

1. **Create account** at [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub Repo**
3. **Add MongoDB Service** (Railway provides free MongoDB)
4. Set the following environment variables in Railway:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | (Railway's MongoDB connection string) |
| `JWT_SECRET` | `any_strong_random_string_here` |
| `PORT` | `5000` |
| `CLIENT_URL` | `https://your-vercel-app.vercel.app` |

5. Set the **Start Command**: `node index.js`
6. Set the **Root Directory**: `server`
7. Railway will give you a URL like `https://saraswati-motors-server.railway.app`

---

## Step 3 – Deploy Frontend to Vercel

1. **Create account** at [vercel.com](https://vercel.com)
2. **New Project → Import GitHub Repo**
3. Set **Root Directory** to `client`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`
6. Add this environment variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://saraswati-motors-server.railway.app` |

7. Update `vite.config.js` proxy target from `https://saraswati-backend.parikshitkapoor2.workers.dev/api:5000` to the Railway URL
8. Vercel will give you a URL like `https://saraswati-motors.vercel.app`

---

## Step 4 – Optional: Add Cloudinary for Image Uploads

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, API Secret
3. Add to Railway environment variables:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. In `server/routes/vehicles.js`, replace `multer` storage with Cloudinary storage (search online for `multer-storage-cloudinary` package)

---

## Step 5 – Run Seed in Production

After deploying backend, run seed remotely via Railway CLI:

```bash
railway run --service server node seed.js
```

---

## Custom Domain (Optional)

- In Vercel: Settings → Domains → Add `www.saraswatimotors.in`
- Point DNS CNAME to `cname.vercel-dns.com`

---

## Summary

| Service | Provider | Cost |
|---------|----------|------|
| Frontend (React) | Vercel | Free |
| Backend (Node/Express) | Railway | ~$5/mo or free tier |
| Database (MongoDB) | Railway or Atlas | Free tier available |
| Images | Local / Cloudinary | Free tier |
