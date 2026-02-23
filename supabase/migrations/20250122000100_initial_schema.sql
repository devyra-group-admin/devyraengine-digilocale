-- ============================================
-- Dullstroom Digital - Initial Database Schema
-- Migration: 20250122_001_initial_schema
-- Description: Core tables for users, businesses, and categories
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(50),
  role VARCHAR(50) NOT NULL DEFAULT 'free_user',
    -- Enum: visitor, free_user, business_basic, business_featured,
    --       business_premium, sponsored_member, admin
  tier VARCHAR(50) DEFAULT 'free',
    -- Enum: free, basic, featured, premium, sponsored
  bio TEXT,
  location GEOGRAPHY(POINT, 4326), -- Optional user location
  notification_preferences JSONB DEFAULT '{"email": true, "push": true, "inApp": true}',
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Indexes for profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_active ON public.profiles(is_active) WHERE deleted_at IS NULL;

-- ============================================
-- CATEGORIES TABLE
-- Business categories (Food & Drink, Accommodation, etc.)
-- ============================================

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- Emoji or icon name
  color VARCHAR(7), -- Hex color
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_active ON public.categories(is_active);
CREATE INDEX idx_categories_display_order ON public.categories(display_order);

-- ============================================
-- BUSINESSES TABLE
-- Main business listings with PostGIS location
-- ============================================

CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  address TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS for lat/lng
  phone VARCHAR(50),
  email VARCHAR(255),
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
    -- {facebook: "", instagram: "", twitter: ""}
  business_hours JSONB,
    -- {monday: {open: "09:00", close: "17:00", closed: false}, ...}
  tier VARCHAR(50) NOT NULL DEFAULT 'basic',
    -- Enum: basic, featured, premium
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]', -- Array of image URLs
  videos JSONB DEFAULT '[]',
  tags VARCHAR(255)[], -- Array for search
  metadata JSONB DEFAULT '{}', -- Flexible data
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,

  -- Spatial constraint
  CONSTRAINT businesses_location_check CHECK (ST_SRID(location::geometry) = 4326)
);

-- Indexes for businesses
CREATE INDEX idx_businesses_category ON public.businesses(category_id);
CREATE INDEX idx_businesses_owner ON public.businesses(owner_id);
CREATE INDEX idx_businesses_tier ON public.businesses(tier);
CREATE INDEX idx_businesses_featured ON public.businesses(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_businesses_location ON public.businesses USING GIST(location);
CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_businesses_tags ON public.businesses USING GIN(tags);
CREATE INDEX idx_businesses_published ON public.businesses(is_published) WHERE deleted_at IS NULL;

-- ============================================
-- BUSINESS EVENTS TABLE
-- Events and deals posted by businesses
-- ============================================

CREATE TABLE public.business_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_type VARCHAR(50) DEFAULT 'event', -- event, deal, special
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location_override TEXT, -- If different from business location
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_business_events_business ON public.business_events(business_id);
CREATE INDEX idx_business_events_dates ON public.business_events(start_date, end_date);
CREATE INDEX idx_business_events_active ON public.business_events(is_active);

-- ============================================
-- BUSINESS ANALYTICS TABLE
-- Track business listing performance
-- ============================================

CREATE TABLE public.business_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0, -- Clicks on phone, website, directions
  search_appearances INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, date)
);

CREATE INDEX idx_business_analytics_business_date ON public.business_analytics(business_id, date DESC);

-- ============================================
-- AUTOMATIC TIMESTAMP TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_events_updated_at
  BEFORE UPDATE ON public.business_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================

-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email_confirmed_at IS NOT NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE public.categories IS 'Business categories (Food & Drink, Accommodation, etc.)';
COMMENT ON TABLE public.businesses IS 'Business listings with PostGIS geospatial data';
COMMENT ON TABLE public.business_events IS 'Events and deals posted by businesses';
COMMENT ON TABLE public.business_analytics IS 'Business listing performance tracking';
