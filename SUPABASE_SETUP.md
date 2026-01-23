# Supabase Setup Guide for Dullstroom Digital

This guide will walk you through setting up your Supabase backend for the Dullstroom Digital application.

## Prerequisites

- A Supabase account (free tier is sufficient to start)
- The migration files in `supabase/migrations/`

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in the project details:
   - **Project name**: `dullstroom-digital` (or your preferred name)
   - **Database Password**: Choose a strong password and save it securely
   - **Region**: Choose closest to your users (e.g., `eu-west-1` for Europe, `us-east-1` for USA)
   - **Pricing Plan**: Free (sufficient for MVP)
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

## Step 2: Get Your API Keys

Once your project is ready:

1. In the Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (this is safe to use in your frontend)
3. **IMPORTANT**: Never commit these keys to git!

## Step 3: Configure Environment Variables

1. In your project root (`c:\DevSA\sadev`), create a `.env.local` file:

```bash
# Copy from .env.example
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Map Configuration (already filled in)
VITE_MAP_CENTER_LAT=-25.41682188170712
VITE_MAP_CENTER_LNG=30.10243602023188
VITE_MAP_DEFAULT_ZOOM=16.5
```

3. Add `.env.local` to your `.gitignore` (if not already there):

```
.env.local
```

## Step 4: Run Database Migrations

You'll run these SQL files in the Supabase SQL Editor:

### 4.1 Run Initial Schema Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Open `supabase/migrations/20250122_001_initial_schema.sql`
4. Copy the entire contents and paste into the SQL Editor
5. Click **"Run"** (or press F5)
6. ✅ You should see "Success. No rows returned"

This creates:
- `profiles` table (user profiles)
- `categories` table (business categories)
- `businesses` table with PostGIS (business listings with location data)
- `business_events` table (events and deals)
- `business_analytics` table (tracking views and clicks)
- Automatic timestamp triggers
- Auto-create profile trigger (creates profile when user signs up)

### 4.2 Run Community Boards Migration

1. Create another new query
2. Open `supabase/migrations/20250122_002_community_boards.sql`
3. Copy and paste contents
4. Click **"Run"**
5. ✅ Success

This creates:
- `boards` table (community board categories)
- `board_followers` table (users following boards)
- `posts` table (user posts)
- `comments` table (post comments with nested replies)
- `post_likes` and `comment_likes` tables
- `notifications` table
- Denormalized counter triggers (auto-update like_count, comment_count)
- Notification triggers (auto-create notifications for interactions)

### 4.3 Run RLS Policies Migration

1. Create another new query
2. Open `supabase/migrations/20250122_003_rls_policies.sql`
3. Copy and paste contents
4. Click **"Run"**
5. ✅ Success

This sets up:
- Row-Level Security (RLS) on all tables
- Policies for viewing, creating, updating, deleting data
- Role-based access control (visitor, free_user, business_owner, admin)
- Storage bucket policies

### 4.4 Run Seed Data

1. Create another new query
2. Open `supabase/seed.sql`
3. Copy and paste contents
4. Click **"Run"**
5. ✅ Success

This populates:
- 6 business categories (Food & Drink, Accommodation, etc.)
- 12 sample businesses from your existing app
- 6 main community boards
- 3 sub-group boards

## Step 5: Create Storage Buckets

### 5.1 Business Images Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `business-images`
   - **Public bucket**: ✅ Check this (allows public access)
   - **File size limit**: 5242880 (5 MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
4. Click **"Create bucket"**

### 5.2 Post Media Bucket

1. Create another bucket:
   - **Name**: `post-media`
   - **Public bucket**: ✅ Checked
   - **File size limit**: 10485760 (10 MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp,video/mp4`
2. Click **"Create bucket"**

### 5.3 Avatars Bucket

1. Create another bucket:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Checked
   - **File size limit**: 2097152 (2 MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
2. Click **"Create bucket"**

## Step 6: Verify Setup

### Check Tables

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - ✅ profiles
   - ✅ categories (with 6 rows)
   - ✅ businesses (with 12 rows)
   - ✅ business_events
   - ✅ business_analytics
   - ✅ boards (with 9 rows: 6 main + 3 sub-groups)
   - ✅ board_followers
   - ✅ posts
   - ✅ comments
   - ✅ post_likes
   - ✅ comment_likes
   - ✅ notifications

### Check PostGIS Extension

1. Go to **SQL Editor**
2. Run this query:

```sql
SELECT PostGIS_version();
```

3. ✅ You should see a version number (e.g., "3.3 USE_GEOS=1 USE_PROJ=1 ...")

### Verify Sample Data

1. Go to **Table Editor** → **categories**
2. ✅ You should see 6 categories:
   - Food & Drink (🍴)
   - Accommodation (🛏️)
   - Retail & Gifts (🎁)
   - Outdoor & Adventure (🏕️)
   - Tourism & Attractions (🎯)
   - Property & Real Estate (🏠)

3. Go to **businesses** table
4. ✅ You should see 12 businesses with geospatial data

5. Go to **boards** table
6. ✅ You should see 9 boards (6 main + 3 sub-groups)

## Step 7: Test Authentication (Optional)

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Create a test user:
   - **Email**: test@example.com
   - **Password**: TestPassword123!
4. Click **"Send email confirmation"** → No (for testing)
5. ✅ User created

Check **profiles** table:
- A profile should have been auto-created for this user (via trigger)

## Step 8: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email settings (optional for development):
   - For local development, use **"Send test emails to your inbox"**
   - For production, set up an email provider (SendGrid, etc.)

## Common Issues & Solutions

### "relation does not exist" Error

**Cause**: Tables not created yet
**Solution**: Make sure you ran all 3 migration files in order (001, 002, 003)

### "permission denied for table" Error

**Cause**: RLS policies not set up
**Solution**: Run the RLS policies migration (003_rls_policies.sql)

### PostGIS Function Not Found

**Cause**: PostGIS extension not enabled
**Solution**:
1. Go to **SQL Editor**
2. Run: `CREATE EXTENSION IF NOT EXISTS "postgis";`

### Can't Insert Businesses

**Cause**: Category IDs not matching
**Solution**: Make sure you ran seed.sql after the schema migrations

## Next Steps

Once your Supabase setup is complete:

1. ✅ Your database is ready with all tables and sample data
2. ✅ Storage buckets are created for images
3. ✅ Security policies are in place
4. ➡️ Return to your React app and start development!

The app will automatically connect to Supabase using the credentials in `.env.local`.

## Useful Supabase Dashboard Links

- **Table Editor**: View and edit data directly
- **SQL Editor**: Run custom queries
- **API Docs**: Auto-generated API documentation for your database
- **Authentication**: Manage users
- **Storage**: Manage file uploads
- **Database** → **Replication**: Set up backups (Pro plan)

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [PostGIS Documentation](https://postgis.net/docs/)

---

**🎉 Your Supabase backend is now ready for the Dullstroom Digital MVP!**
