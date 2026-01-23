# Deployment Guide

This guide describes how to deploy the Dullstroom Digital monorepo.

## Project Structure

- **Frontend**: `client/` (Vite + React) -> Deploy to **Vercel**
- **Backend**: `server/` (Node + Express) -> Deploy to **Railway** or **Render**

---

## 1. Frontend Deployment (Vercel)

Vercel is the recommended host for the frontend because it has native support for monorepos and Zero-Config deployments for Vite.

### Steps:

1. Push your code to a Git provider (GitHub/GitLab/Bitbucket).
2. Log in to [Vercel](https://vercel.com).
3. Click **"Add New..."** -> **"Project"**.
4. Import your `dullstroom-digital` repository.
5. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: Click "Edit" and select `client`.
   - **Build Settings**: Vercel should auto-detect:
     - Build Command: `npm run build`
     - Output Directory: `dist`
6. **Environment Variables**:
   Add the following variables in the Vercel dashboard:
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://your-backend.railway.app/api/v1`)
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon Key
7. Click **Deploy**.

> **Note**: The `client/vercel.json` file is already configured to handle SPA routing (redirecting all requests to `index.html`).

---

## 2. Backend Deployment (Railway)

Railway is excellent for Node.js backends and offers a seamless PostgreSQL integration if you choose to host your database there too.

### Steps:

1. Log in to [Railway](https://railway.app).
2. Click **"New Project"** -> **"Deploy from GitHub repo"**.
3. Select your repository.
4. **Configure Monorepo**:
   - Railway might ask required path. Set **Root Directory** to `server`.
5. **Environment Variables**:
   - `PORT`: `5000` (or leave empty, Railway sets one automatically)
   - `DATABASE_URL`: Your PostgreSQL connection string (Supabase or Railway DB)
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase Service Role Key
6. Click **Deploy**.

---

## 3. Database (Supabase)

If you haven't set up Supabase yet:

1. Create a project at [Supabase](https://supabase.com).
2. Go to **Settings** -> **API** to copy your URL and Keys.
3. Use the SQL Editor to run the migrations located in `supabase/migrations/`.

---

## Troubleshooting

### Vercel 404 on Refresh

If you get 404 errors when refreshing pages like `/bookings`, ensure `client/vercel.json` exists with the rewrite rules.

### CORS Errors

If the frontend cannot talk to the backend:

1. Check your Vercel URL (e.g., `https://dullstroom.vercel.app`).
2. Update the backend `cors` configuration in `server/src/index.js` to allow this origin.
