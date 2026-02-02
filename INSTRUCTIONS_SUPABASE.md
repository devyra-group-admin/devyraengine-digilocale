# Supabase Integration Instructions

## Current Setup: Local Supabase

I have set up a **Local Supabase** instance for you. This runs completely free on your machine using Docker.

**Credentials (already configured in `client/.env`):**

- URL: `http://127.0.0.1:54321`
- Anon Key: (Pre-configured)

**Dashboard:**
You can access your local Supabase Studio to view/edit data here:
[http://127.0.0.1:54323](http://127.0.0.1:54323)

## How to use

1.  **Ensure Docker is running.**
2.  **Start Supabase:** `npx supabase start` (It's already running now).
3.  **Run Client:** `cd client && npm run dev`.

## Moving to Cloud (Optional)

If you want to deploy this to the internet later:

1.  Create a project at [supabase.com](https://supabase.com).
2.  Link your project: `npx supabase link --project-ref your-project-id`
3.  Push your migrations: `npx supabase db push`
4.  Update `client/.env` with your production keys.

## Troubleshooting

If `npx supabase start` fails, try `npx supabase stop --no-backup` and start again.
I have temporarily moved older migrations to `supabase/migrations_bak` to ensure a clean startup.
