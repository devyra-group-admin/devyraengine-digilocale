# Deployment Guide

This guide describes how to deploy the Dullstroom Digital monorepo.

## Project Structure

- **Frontend**: `client/` (Vite + React) -> Built to static files, served by Backend.
- **Backend**: `server/` (Node + Express) -> Serves API and Frontend.
- **Platform**: **Railway** (Unified Deployment)

---

## 1. Unified Deployment (Railway)

We deploy the entire monorepo as a single service on Railway. The backend acts as the web server for both the API and the React frontend.

### Steps:

1. Push your code to a Git provider (GitHub).
2. Log in to [Railway](https://railway.app).
3. Click **"New Project"** -> **"Deploy from GitHub repo"**.
4. Select your repository.
5. **Configure Project**:
   - The project includes a `railway.json` file, so **Build Command** and **Start Command** effectively auto-configure.
   - **Root Directory**: Ensure this is set to `/` (Root).
6. **Environment Variables**:
   - `PORT`: `5000` (or leave empty, Railway sets one automatically, code respects it)
   - `VITE_API_URL`: `/api/v1` (Optional: The code now defaults to relative path in production)
   - `DATABASE_URL`: Your PostgreSQL connection string.
   - `SUPABASE_URL`: Your Supabase URL.
   - `SUPABASE_SERVICE_KEY` / `ANON_KEY`: As needed.
7. Click **Deploy**.

> **Note**: The `server/src/index.js` file is configured to serve static files from `client/dist` and handle SPA routing (sending `index.html` for unknown routes).

---

## 3. Database (Supabase)

If you haven't set up Supabase yet:

1. Create a project at [Supabase](https://supabase.com).
2. Go to **Settings** -> **API** to copy your URL and Keys.
3. Use the SQL Editor to run the migrations located in `supabase/migrations/`.
