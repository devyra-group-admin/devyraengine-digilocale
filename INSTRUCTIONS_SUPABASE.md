# Supabase Integration Instructions

## 1. Supabase Setup

1.  Log in to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Create a new project.
3.  Go to the **SQL Editor** in the side menu.
4.  Open the file `client/supabase_setup.sql` in this project, copy its content, and paste it into the SQL Editor.
5.  Click **Run** to create the `accommodations` table and insert the seed data.

## 2. Environment Variables

1.  In your Supabase project settings, go to **API**.
2.  Copy the **Project URL** and **anon public key**.
3.  Create a file named `.env` in the `client` directory (you can copy `.env.example`).
4.  Fill in the values:
    ```
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_public_key
    ```
5.  Restart your development server (`npm run dev`) to load the new environment variables.

## 3. Verification

The application will now fetch accommodation data from your Supabase database instead of the hardcoded file. You can verify this by modifying a record in the Supabase table and refreshing the application page.
