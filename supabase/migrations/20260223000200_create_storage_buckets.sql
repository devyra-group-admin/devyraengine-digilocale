-- ============================================
-- Ensure required storage buckets exist
-- Migration: 20260223000200_create_storage_buckets
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES
  ('business-images', 'business-images', true),
  ('post-media', 'post-media', true),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE
SET
  name = EXCLUDED.name,
  public = EXCLUDED.public;
