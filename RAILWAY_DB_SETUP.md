# Railway + Supabase Setup Guide

You have successfully deployed the App to Railway!
Currently, your live Railway app is using **Fallback Data** (the static files) because it cannot connect to your _Local_ database.

To get **Live "Actual" Data** on Railway, follow these steps:

## 1. Create a Cloud Database (Free)

Since your Local DB cannot be accessed by Railway, you need a hosted one.

1.  Go to **[Supabase.com](https://supabase.com)** and create a free project.
2.  Go to the **SQL Editor** in your new project.
3.  Copy/Paste the contents of `supbase/migrations/20250202120000_accommodations.sql` (or `client/supabase_setup.sql`) and run it.
    - _Note: This creates the table and same seed data you have locally._

## 2. Connect Railway to Supabase

1.  Get your **Production Keys** from Supabase (`Settings` -> `API`).
    - `Project URL`
    - `anon` (public) key
2.  Go to your **Railway Dashboard**.
3.  Click on your **Client** service.
4.  Go to the **Variables** tab.
5.  Add these two variables:
    - `VITE_SUPABASE_URL`: (Paste your Supabase URL)
    - `VITE_SUPABASE_ANON_KEY`: (Paste your Supabase Anon Key)
6.  Railway will automatically redeploy.

## 3. Done!

Your Railway app will now pull data from the Supabase Cloud database. You can edit data on Supabase.com and it will update on your live site instantly.
