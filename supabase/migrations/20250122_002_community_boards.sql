-- ============================================
-- Dullstroom Digital - Community Boards Schema
-- Migration: 20250122_002_community_boards
-- Description: Tables for community boards, posts, comments, and interactions
-- ============================================

-- ============================================
-- BOARDS TABLE
-- Community board categories and sub-groups
-- ============================================

CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(7),
  parent_board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
    -- For sub-groups (e.g., "Fishing Club" under "Fishing & Outdoors")
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  requires_approval BOOLEAN DEFAULT FALSE, -- Moderation flag
  post_count INTEGER DEFAULT 0,
  member_count INTEGER DEFAULT 0, -- Users who follow this board
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_boards_slug ON public.boards(slug);
CREATE INDEX idx_boards_parent ON public.boards(parent_board_id);
CREATE INDEX idx_boards_active ON public.boards(is_active);
CREATE INDEX idx_boards_display_order ON public.boards(display_order);

-- ============================================
-- BOARD FOLLOWERS TABLE
-- Track which users follow which boards
-- ============================================

CREATE TABLE public.board_followers (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, board_id)
);

CREATE INDEX idx_board_followers_user ON public.board_followers(user_id);
CREATE INDEX idx_board_followers_board ON public.board_followers(board_id);

-- ============================================
-- POSTS TABLE
-- User posts in community boards
-- ============================================

CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title VARCHAR(255),
  content TEXT NOT NULL,
  post_type VARCHAR(50) DEFAULT 'text',
    -- Enum: text, image, video, link, poll
  media_urls JSONB DEFAULT '[]', -- Array of media URLs
  tags VARCHAR(255)[],
  location GEOGRAPHY(POINT, 4326), -- Optional location (for local events, etc.)
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE, -- Prevent new comments
  is_approved BOOLEAN DEFAULT TRUE, -- For moderation
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}', -- For polls, links, etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_posts_board ON public.posts(board_id);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_posts_created ON public.posts(created_at DESC);
CREATE INDEX idx_posts_tags ON public.posts USING GIN(tags);
CREATE INDEX idx_posts_location ON public.posts USING GIST(location);
CREATE INDEX idx_posts_approved ON public.posts(is_approved) WHERE deleted_at IS NULL;

-- ============================================
-- COMMENTS TABLE
-- Comments on posts (with nested replies)
-- ============================================

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    -- For threaded replies
  content TEXT NOT NULL,
  media_urls JSONB DEFAULT '[]',
  is_approved BOOLEAN DEFAULT TRUE,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_comments_post ON public.comments(post_id);
CREATE INDEX idx_comments_author ON public.comments(author_id);
CREATE INDEX idx_comments_parent ON public.comments(parent_comment_id);
CREATE INDEX idx_comments_created ON public.comments(created_at DESC);

-- ============================================
-- POST LIKES TABLE
-- Track which users liked which posts
-- ============================================

CREATE TABLE public.post_likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX idx_post_likes_user ON public.post_likes(user_id);
CREATE INDEX idx_post_likes_post ON public.post_likes(post_id);

-- ============================================
-- COMMENT LIKES TABLE
-- Track which users liked which comments
-- ============================================

CREATE TABLE public.comment_likes (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, comment_id)
);

CREATE INDEX idx_comment_likes_user ON public.comment_likes(user_id);
CREATE INDEX idx_comment_likes_comment ON public.comment_likes(comment_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- User notifications for interactions
-- ============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
    -- Enum: post_like, comment_reply, board_update, business_event,
    --       system_message, promotion
  title VARCHAR(255) NOT NULL,
  message TEXT,
  action_url TEXT, -- Deep link to relevant content
  related_entity_type VARCHAR(50), -- post, comment, business, event
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE, -- For push notifications
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created ON public.notifications(created_at DESC);

-- ============================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ============================================

CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON public.boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DENORMALIZED COUNTER TRIGGERS
-- Update counts automatically
-- ============================================

-- Increment post comment_count when comment added
CREATE OR REPLACE FUNCTION increment_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = comment_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comment_added
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION increment_post_comment_count();

-- Decrement post comment_count when comment deleted
CREATE OR REPLACE FUNCTION decrement_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET comment_count = GREATEST(comment_count - 1, 0)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_comment_removed
  AFTER DELETE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION decrement_post_comment_count();

-- Increment post like_count when like added
CREATE OR REPLACE FUNCTION increment_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET like_count = like_count + 1
  WHERE id = NEW.post_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_like_added
  AFTER INSERT ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION increment_post_like_count();

-- Decrement post like_count when like removed
CREATE OR REPLACE FUNCTION decrement_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.posts
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE id = OLD.post_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER post_like_removed
  AFTER DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_post_like_count();

-- Increment comment like_count when like added
CREATE OR REPLACE FUNCTION increment_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.comments
  SET like_count = like_count + 1
  WHERE id = NEW.comment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_like_added
  AFTER INSERT ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION increment_comment_like_count();

-- Decrement comment like_count when like removed
CREATE OR REPLACE FUNCTION decrement_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.comments
  SET like_count = GREATEST(like_count - 1, 0)
  WHERE id = OLD.comment_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_like_removed
  AFTER DELETE ON public.comment_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_comment_like_count();

-- Increment board post_count when post added
CREATE OR REPLACE FUNCTION increment_board_post_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.boards
  SET post_count = post_count + 1
  WHERE id = NEW.board_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER board_post_added
  AFTER INSERT ON public.posts
  FOR EACH ROW EXECUTE FUNCTION increment_board_post_count();

-- Decrement board post_count when post deleted
CREATE OR REPLACE FUNCTION decrement_board_post_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.boards
  SET post_count = GREATEST(post_count - 1, 0)
  WHERE id = OLD.board_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER board_post_removed
  AFTER DELETE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION decrement_board_post_count();

-- ============================================
-- NOTIFICATION TRIGGERS
-- Auto-create notifications for interactions
-- ============================================

-- Notify post author when someone comments
CREATE OR REPLACE FUNCTION notify_post_comment()
RETURNS TRIGGER AS $$
BEGIN
  -- Don't notify if author comments on own post
  IF NEW.author_id != (SELECT author_id FROM public.posts WHERE id = NEW.post_id) THEN
    INSERT INTO public.notifications (user_id, type, title, message, action_url, related_entity_type, related_entity_id)
    SELECT
      p.author_id,
      'comment_reply',
      (SELECT full_name FROM public.profiles WHERE id = NEW.author_id) || ' commented on your post',
      LEFT(NEW.content, 100),
      '/community/post/' || NEW.post_id,
      'comment',
      NEW.id
    FROM public.posts p
    WHERE p.id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_post_comment
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION notify_post_comment();

-- Notify comment author when someone replies
CREATE OR REPLACE FUNCTION notify_comment_reply()
RETURNS TRIGGER AS $$
BEGIN
  -- Only for nested comments
  IF NEW.parent_comment_id IS NOT NULL THEN
    -- Don't notify if author replies to own comment
    IF NEW.author_id != (SELECT author_id FROM public.comments WHERE id = NEW.parent_comment_id) THEN
      INSERT INTO public.notifications (user_id, type, title, message, action_url, related_entity_type, related_entity_id)
      SELECT
        c.author_id,
        'comment_reply',
        (SELECT full_name FROM public.profiles WHERE id = NEW.author_id) || ' replied to your comment',
        LEFT(NEW.content, 100),
        '/community/post/' || NEW.post_id,
        'comment',
        NEW.id
      FROM public.comments c
      WHERE c.id = NEW.parent_comment_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_on_comment_reply
  AFTER INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION notify_comment_reply();

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE public.boards IS 'Community board categories and sub-groups';
COMMENT ON TABLE public.board_followers IS 'Track which users follow which boards for notifications';
COMMENT ON TABLE public.posts IS 'User posts in community boards';
COMMENT ON TABLE public.comments IS 'Comments on posts with nested replies support';
COMMENT ON TABLE public.post_likes IS 'Track post likes by users';
COMMENT ON TABLE public.comment_likes IS 'Track comment likes by users';
COMMENT ON TABLE public.notifications IS 'User notifications for interactions and updates';
