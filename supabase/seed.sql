-- ============================================
-- Dullstroom Digital - Seed Data
-- Description: Initial data for categories, boards, and sample businesses
-- ============================================

-- ============================================
-- CATEGORIES
-- Migrated from existing App.jsx (lines 135-142)
-- ============================================

INSERT INTO public.categories (name, slug, icon, color, display_order) VALUES
  ('Food & Drink', 'food-drink', '🍴', '#c77d3b', 1),
  ('Accommodation', 'accommodation', '🛏️', '#5a8ba8', 2),
  ('Retail & Gifts', 'retail-gifts', '🎁', '#e8b844', 3),
  ('Outdoor & Adventure', 'outdoor-adventure', '🏕️', '#6b8e4e', 4),
  ('Tourism & Attractions', 'tourism-attractions', '🎯', '#d4a853', 5),
  ('Property & Real Estate', 'property-real-estate', '🏠', '#8b6f47', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- BUSINESSES
-- Migrated from existing App.jsx (lines 18-133)
-- ============================================

-- Get category IDs for reference
DO $$
DECLARE
  cat_food UUID;
  cat_accommodation UUID;
  cat_retail UUID;
  cat_outdoor UUID;
  cat_tourism UUID;
  cat_property UUID;
BEGIN
  SELECT id INTO cat_food FROM public.categories WHERE slug = 'food-drink';
  SELECT id INTO cat_accommodation FROM public.categories WHERE slug = 'accommodation';
  SELECT id INTO cat_retail FROM public.categories WHERE slug = 'retail-gifts';
  SELECT id INTO cat_outdoor FROM public.categories WHERE slug = 'outdoor-adventure';
  SELECT id INTO cat_tourism FROM public.categories WHERE slug = 'tourism-attractions';
  SELECT id INTO cat_property FROM public.categories WHERE slug = 'property-real-estate';

  -- Insert businesses
  INSERT INTO public.businesses (
    name,
    slug,
    category_id,
    description,
    address,
    location,
    images,
    is_featured,
    tier
  ) VALUES
  (
    'Duck & Trout Restaurant',
    'duck-trout-restaurant',
    cat_food,
    'Popular pub and restaurant on the main street.',
    'Hugenote St, Dullstroom',
    ST_SetSRID(ST_MakePoint(30.10037451338561, -25.42392769985406), 4326)::geography,
    '["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"]'::jsonb,
    true,
    'featured'
  ),
  (
    'Mrs Simpson''s',
    'mrs-simpsons',
    cat_food,
    'Cozy restaurant with local cuisine.',
    'Main Street, Dullstroom',
    ST_SetSRID(ST_MakePoint(30.107736413385332, -25.41545673927404), 4326)::geography,
    '["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'Critchley Hackle Lodge',
    'critchley-hackle-lodge',
    cat_accommodation,
    'Luxury lodge with scenic views.',
    'Dullstroom Area',
    ST_SetSRID(ST_MakePoint(30.109825753861376, -25.418347743222068), 4326)::geography,
    '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'premium'
  ),
  (
    'Dullstroom Inn',
    'dullstroom-inn',
    cat_accommodation,
    'Historic inn in the heart of town.',
    'Central Dullstroom',
    ST_SetSRID(ST_MakePoint(30.10727345386131, -25.41494493857514), 4326)::geography,
    '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'Earth Gear',
    'earth-gear',
    cat_retail,
    'Outdoor equipment and gifts.',
    'Shopping District',
    ST_SetSRID(ST_MakePoint(30.11013720528195, -25.413330763950693), 4326)::geography,
    '["https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'Mavungana',
    'mavungana',
    cat_accommodation,
    'Comfortable accommodation with mountain views.',
    'Dullstroom',
    ST_SetSRID(ST_MakePoint(30.10008468454961, -25.424415320795934), 4326)::geography,
    '["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'Kosmas Stationery & Gift',
    'kosmas-stationery-gift',
    cat_retail,
    'Stationery and unique gift items.',
    'Main Street, Dullstroom',
    ST_SetSRID(ST_MakePoint(30.104644628018615, -25.412152156571196), 4326)::geography,
    '["https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'Birchcroft Preparatory School',
    'birchcroft-preparatory-school',
    cat_tourism,
    'Local educational institution.',
    'Dullstroom',
    ST_SetSRID(ST_MakePoint(30.10588185006474, -25.41395311554934), 4326)::geography,
    '["https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'The Montreo School',
    'the-montreo-school',
    cat_tourism,
    'Private school in the highlands.',
    'Dullstroom Area',
    ST_SetSRID(ST_MakePoint(30.101963360852068, -25.411059606266303), 4326)::geography,
    '["https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'Barlack Attorneys',
    'barlack-attorneys',
    cat_property,
    'Legal services and property consultation.',
    'Dullstroom',
    ST_SetSRID(ST_MakePoint(30.106519790495973, -25.41535905346672), 4326)::geography,
    '["https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'Zest Property Group',
    'zest-property-group',
    cat_property,
    'Real estate services and property management.',
    'Dullstroom',
    ST_SetSRID(ST_MakePoint(30.10289628896996, -25.41526686131065), 4326)::geography,
    '["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  ),
  (
    'Farms, Lodges & Estates',
    'farms-lodges-estates',
    cat_outdoor,
    'Experience farm life and outdoor activities.',
    'Dullstroom',
    ST_SetSRID(ST_MakePoint(30.103432158910046, -25.42142053247414), 4326)::geography,
    '["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop"]'::jsonb,
    false,
    'basic'
  )
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- ============================================
-- COMMUNITY BOARDS
-- Based on PDF requirements (page 2-3)
-- ============================================

INSERT INTO public.boards (name, slug, description, icon, color, display_order) VALUES
  (
    'Local Events',
    'local-events',
    'Community events, gatherings, and local happenings in Dullstroom',
    '📅',
    '#2D9B9E',
    1
  ),
  (
    'Buy & Sell',
    'buy-sell',
    'Local marketplace for buying and selling items',
    '🛒',
    '#4CAF50',
    2
  ),
  (
    'Jobs & Vacancies',
    'jobs-vacancies',
    'Job postings, employment opportunities, and career opportunities',
    '💼',
    '#FF9800',
    3
  ),
  (
    'Lost & Found',
    'lost-found',
    'Report lost items or found belongings in the Dullstroom area',
    '🔍',
    '#F44336',
    4
  ),
  (
    'Fishing & Outdoors',
    'fishing-outdoors',
    'Fishing reports, outdoor activities, hiking trails, and nature discussions',
    '🎣',
    '#00BCD4',
    5
  ),
  (
    'Local Services',
    'local-services',
    'Recommendations for local service providers, contractors, and professionals',
    '🔧',
    '#9C27B0',
    6
  )
ON CONFLICT (slug) DO NOTHING;

-- Create sub-groups for Fishing & Outdoors
INSERT INTO public.boards (name, slug, description, parent_board_id, icon, display_order)
SELECT
  'Fishing Club',
  'fishing-club',
  'Dullstroom Fishing Club - members, events, and fly-fishing discussions',
  id,
  '🎣',
  1
FROM public.boards WHERE slug = 'fishing-outdoors'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.boards (name, slug, description, parent_board_id, icon, display_order)
SELECT
  'Community Projects',
  'community-projects',
  'Volunteer opportunities and community improvement initiatives',
  id,
  '🏘️',
  2
FROM public.boards WHERE slug = 'local-events'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.boards (name, slug, description, parent_board_id, icon, display_order)
SELECT
  'Tourism Tips',
  'tourism-tips',
  'Visitor recommendations, travel tips, and tourist information',
  id,
  '🗺️',
  1
FROM public.boards WHERE slug = 'fishing-outdoors'
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- Sample Posts (Optional - for demo purposes)
-- ============================================

-- Note: These would need a real user to be created first via Supabase Auth
-- Uncomment and run after you have test users set up

-- INSERT INTO public.posts (board_id, author_id, title, content, post_type)
-- SELECT
--   b.id,
--   (SELECT id FROM auth.users LIMIT 1), -- Replace with actual user ID
--   'Welcome to Dullstroom Community!',
--   'This is the first post on our community boards. Share your stories, ask questions, and connect with fellow Dullstroom residents!',
--   'text'
-- FROM public.boards b WHERE b.slug = 'local-events';

-- ============================================
-- Comments
-- ============================================

-- The database is now seeded with:
-- - 6 business categories
-- - 12 sample businesses (from existing App.jsx)
-- - 6 main community boards
-- - 3 sub-group boards
--
-- Next steps:
-- 1. Create Supabase project at supabase.com
-- 2. Run these migrations in order (001, 002, 003)
-- 3. Run this seed.sql file
-- 4. Create storage buckets: business-images, post-media, avatars
