-- ============================================
-- Dullstroom Digital - Row-Level Security Policies
-- Migration: 20250122_003_rls_policies
-- Description: Security policies for all tables
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PROFILES POLICIES
-- ============================================

-- Users can view all active profiles
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (deleted_at IS NULL AND is_active = true);

-- Users can update own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================
-- CATEGORIES POLICIES
-- ============================================

-- Categories are viewable by everyone
CREATE POLICY "Categories are viewable by everyone"
ON public.categories FOR SELECT
USING (is_active = true);

-- Only admins can manage categories
CREATE POLICY "Only admins can manage categories"
ON public.categories FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================================
-- BUSINESSES POLICIES
-- ============================================

-- Published businesses are viewable by everyone
CREATE POLICY "Published businesses are viewable by everyone"
ON public.businesses FOR SELECT
USING (
  is_published = true AND deleted_at IS NULL OR
  auth.uid() = owner_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Authenticated users can create businesses (for claiming)
CREATE POLICY "Authenticated users can create businesses"
ON public.businesses FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Business owners can update own businesses
CREATE POLICY "Business owners can update own businesses"
ON public.businesses FOR UPDATE
USING (
  auth.uid() = owner_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  auth.uid() = owner_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Only admins can delete businesses
CREATE POLICY "Only admins can delete businesses"
ON public.businesses FOR DELETE
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- BUSINESS EVENTS POLICIES
-- ============================================

-- Events are viewable by everyone
CREATE POLICY "Events are viewable by everyone"
ON public.business_events FOR SELECT
USING (
  is_active = true OR
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_id AND (b.owner_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    ))
  )
);

-- Business owners can manage own business events
CREATE POLICY "Business owners can manage own business events"
ON public.business_events FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_id AND (b.owner_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    ))
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_id AND (b.owner_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    ))
  )
);

-- ============================================
-- BUSINESS ANALYTICS POLICIES
-- ============================================

-- Only business owners and admins can view analytics
CREATE POLICY "Business owners can view own business analytics"
ON public.business_analytics FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.businesses b
    WHERE b.id = business_id AND (b.owner_id = auth.uid() OR auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    ))
  )
);

-- System can insert analytics (via service role)
-- Individual users cannot insert analytics directly

-- ============================================
-- BOARDS POLICIES
-- ============================================

-- Active boards are viewable by everyone
CREATE POLICY "Active boards are viewable by everyone"
ON public.boards FOR SELECT
USING (is_active = true);

-- Only admins can manage boards
CREATE POLICY "Only admins can manage boards"
ON public.boards FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- BOARD FOLLOWERS POLICIES
-- ============================================

-- Users can view all board followers
CREATE POLICY "Board followers are viewable by everyone"
ON public.board_followers FOR SELECT
USING (true);

-- Users can follow/unfollow boards
CREATE POLICY "Users can manage own board follows"
ON public.board_followers FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- POSTS POLICIES
-- ============================================

-- Approved posts are viewable by everyone
CREATE POLICY "Approved posts are viewable by everyone"
ON public.posts FOR SELECT
USING (
  (is_approved = true AND deleted_at IS NULL) OR
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
ON public.posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Authors can update own posts
CREATE POLICY "Authors can update own posts"
ON public.posts FOR UPDATE
USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Authors and admins can delete posts
CREATE POLICY "Authors and admins can delete posts"
ON public.posts FOR DELETE
USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- COMMENTS POLICIES
-- ============================================

-- Approved comments are viewable by everyone
CREATE POLICY "Approved comments are viewable by everyone"
ON public.comments FOR SELECT
USING (
  (is_approved = true AND deleted_at IS NULL) OR
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Authors can update own comments
CREATE POLICY "Authors can update own comments"
ON public.comments FOR UPDATE
USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Authors and admins can delete comments
CREATE POLICY "Authors and admins can delete comments"
ON public.comments FOR DELETE
USING (
  auth.uid() = author_id OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- POST LIKES POLICIES
-- ============================================

-- Post likes are viewable by everyone
CREATE POLICY "Post likes are viewable by everyone"
ON public.post_likes FOR SELECT
USING (true);

-- Users can like/unlike posts
CREATE POLICY "Users can manage own post likes"
ON public.post_likes FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- COMMENT LIKES POLICIES
-- ============================================

-- Comment likes are viewable by everyone
CREATE POLICY "Comment likes are viewable by everyone"
ON public.comment_likes FOR SELECT
USING (true);

-- Users can like/unlike comments
CREATE POLICY "Users can manage own comment likes"
ON public.comment_likes FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================

-- Users can view own notifications
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Users can update own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- System can create notifications (via triggers/functions)
-- Users cannot manually create notifications

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Storage bucket policies for business-images
CREATE POLICY "Anyone can view business images"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-images');

CREATE POLICY "Business owners can upload business images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'business-images' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Business owners can update own business images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'business-images' AND
  auth.uid() = owner
);

CREATE POLICY "Business owners can delete own business images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'business-images' AND
  auth.uid() = owner
);

-- Storage bucket policies for post-media
CREATE POLICY "Anyone can view post media"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-media');

CREATE POLICY "Authenticated users can upload post media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-media' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update own post media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'post-media' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete own post media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-media' AND
  auth.uid() = owner
);

-- Storage bucket policies for avatars
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid() = owner
);
