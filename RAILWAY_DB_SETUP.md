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

---

## Local Owner Account Management (Invite-Only)

For local development, owner accounts are invite-only and open signup is disabled in `supabase/config.toml`.

### 1. Start/reseed local Supabase

```bash
npx supabase start
npx supabase db reset
```

This ensures migrations are applied, including storage buckets like `business-images`.

### 2. Configure server environment

Copy `server/.env.example` to `server/.env` and set:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_INVITE_TOKEN`
- `INVITE_REDIRECT`
- `PASSWORD_RESET_REDIRECT`

### 3. Invite a pre-registered business owner

Use the server endpoint (admin token required):

```bash
curl -X POST http://localhost:5000/api/v1/admin/invite-owner ^
  -H "Content-Type: application/json" ^
  -H "x-admin-invite-token: YOUR_ADMIN_INVITE_TOKEN" ^
  -d "{\"email\":\"owner@example.com\",\"fullName\":\"Owner Name\"}"
```

### 4. Password resets

The portal calls:

- `POST /api/v1/auth/forgot-password`

In local Supabase, emails are captured by Inbucket (not sent publicly):

- Inbucket UI: `http://localhost:54324`
- Supabase Studio: `http://localhost:54323`

### 5. Super admin access

The admin stats/management dashboard is now hidden from public users and only shown to authenticated super users.

Grant super admin in SQL (local or cloud):

```sql
update public.profiles
set is_super_admin = true, role = 'admin'
where email = 'you@example.com';
```

Then sign out/in again so the app refreshes your role.
