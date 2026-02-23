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
  ('Property & Real Estate', 'property-real-estate', '🏠', '#8b6f47', 6),
  ('Professional Services', 'professional-services', '🛠️', '#6f7f8f', 7),
  ('Health, Education & Public Services', 'public-services', '🏥', '#4f7fa8', 8),
  ('Hotel & Restaurant', 'hotel-restaurant', '🏨', '#b36f3a', 9)
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
  cat_services UUID;
  cat_public UUID;
  cat_hotel UUID;
  default_lng DOUBLE PRECISION := 30.10243602023188;
  default_lat DOUBLE PRECISION := -25.41682188170712;
BEGIN
  SELECT id INTO cat_food FROM public.categories WHERE slug = 'food-drink';
  SELECT id INTO cat_accommodation FROM public.categories WHERE slug = 'accommodation';
  SELECT id INTO cat_retail FROM public.categories WHERE slug = 'retail-gifts';
  SELECT id INTO cat_outdoor FROM public.categories WHERE slug = 'outdoor-adventure';
  SELECT id INTO cat_tourism FROM public.categories WHERE slug = 'tourism-attractions';
  SELECT id INTO cat_property FROM public.categories WHERE slug = 'property-real-estate';
  SELECT id INTO cat_services FROM public.categories WHERE slug = 'professional-services';
  SELECT id INTO cat_public FROM public.categories WHERE slug = 'public-services';
  SELECT id INTO cat_hotel FROM public.categories WHERE slug = 'hotel-restaurant';

  -- Official client list (January 2026 submissions)
  INSERT INTO public.businesses (
    name,
    slug,
    category_id,
    description,
    address,
    location,
    phone,
    email,
    website_url,
    social_links,
    metadata,
    is_featured,
    tier
  ) VALUES
  (
    'The Dullstroom Inn',
    'the-dullstroom-inn',
    cat_accommodation,
    NULL,
    'Cnr Teding Von Berkhold and Oranje Nassau',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '013 254 0071',
    'shane@dullstroominn.co.za',
    'https://dullstroominn.co.za',
    '{"facebook":"The Dullstroom inn"}'::jsonb,
    '{"contact_person":"The Dullstroom Inn Pub","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    '10@Cherry Grove',
    '10-cherry-grove',
    cat_accommodation,
    NULL,
    'The Piazza Cherry Grove Centre - above Zest',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0836106122',
    'nico.roos@yahoo.com',
    NULL,
    '{}'::jsonb,
    '{"contact_person":"Elmarie Roos","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Donut World Dullstroom',
    'donut-world-dullstroom',
    cat_food,
    NULL,
    'Cherry Grove, Dullstroom',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0814991290',
    'juan@brilliantconsultants.co.za',
    NULL,
    '{"facebook":"Donut World Dullstroom"}'::jsonb,
    '{"contact_person":"Juan","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Dullstroom Riding Centre',
    'dullstroom-riding-centre',
    cat_outdoor,
    NULL,
    'Walkersons Private Estate',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0824429766',
    'horsetrails@worldonline.co.za',
    'https://www.dullstroomhorseriding.co.za',
    '{}'::jsonb,
    '{"contact_person":"Dave Curtis","interests":"Basic business listing;Featured placement on map;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Cherry Lane @ Cherry Grove',
    'cherry-lane-at-cherry-grove',
    cat_accommodation,
    NULL,
    '9 Naledi Drive, Dullstroom',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0824586104',
    'info@dullstroomactivities.com',
    NULL,
    '{}'::jsonb,
    '{"contact_person":"Karin Metz","interests":"Basic business listing;Featured placement on map;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Dullstroom Framing',
    'dullstroom-framing',
    cat_services,
    NULL,
    '207 Blue Crane Drive',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0722607527',
    'chantel@dullstroom.net',
    NULL,
    '{}'::jsonb,
    '{"contact_person":"Chantel Boshoff","interests":"Basic business listing;Featured placement on map"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Fairstream 1',
    'fairstream-1',
    cat_accommodation,
    NULL,
    'Janson Street, Dullstroom',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0829331011',
    'sanibonani@sanibonanigroup.co.za',
    NULL,
    '{}'::jsonb,
    '{"contact_person":"Linda Pieters","interests":"Basic business listing;Featured placement on map;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Big Oak Cottages',
    'big-oak-cottages',
    cat_accommodation,
    NULL,
    '28 Eagle Avenue, Dullstroom',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0832659900',
    'reservations@bigiakcottages.co.za',
    'https://www.bigiakcottages.co.za',
    '{}'::jsonb,
    '{"contact_person":"Gail Trollip","interests":"Basic business listing"}'::jsonb,
    false,
    'basic'
  ),
  (
    'Dullstroom Bird of Prey and Rehabilitation Centre',
    'dullstroom-bird-of-prey-and-rehabilitation-centre',
    cat_tourism,
    NULL,
    'Crn R540 Kruisfontein road, Dullstroom',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0828994108',
    'info@wildlifesos.co.za',
    'https://www.birdsofprey.co.za',
    '{"instagram":"@dullstroombirdsofprey"}'::jsonb,
    '{"contact_person":"Frith Douglas","interests":"Reaching tourists visiting Dullstroom"}'::jsonb,
    false,
    'basic'
  ),
  (
    'The Dullstroom Inn',
    'the-dullstroom-inn-hotel-restaurant',
    cat_hotel,
    NULL,
    '196 Teding van Berkhout street',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '013 254 0071',
    'bookings@dullstroominn.co.za',
    'https://dullstroominn.co.za/',
    '{"facebook":"https://www.facebook.com/thedullstroominn"}'::jsonb,
    '{"contact_person":"Johnny/ Kaylyn","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Connemara Close Country Estate',
    'connemara-close-country-estate',
    cat_accommodation,
    NULL,
    'Lesedi street, Dullstroom',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '071 173 7023',
    'bookings@dullstroominn.co.za',
    'https://connemara-close.co.za/',
    '{"facebook":"https://www.facebook.com/profile.php?id=61575792519452"}'::jsonb,
    '{"contact_person":"Kaylyn","interests":"Basic business listing;Featured placement on map;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Jocks Cottages',
    'jocks-cottages',
    cat_accommodation,
    NULL,
    'Groot Suikerboschkop',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '071 672 6761',
    'info@jockscottages.co.za',
    'https://www.jockscottages.co.za',
    '{"facebook":"Jocks Cottages"}'::jsonb,
    '{"contact_person":"Jeanne Badenhorst - Booking Manager","interests":"Basic business listing;Featured placement on map;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'i-Health Clinics',
    'i-health-clinics',
    cat_public,
    NULL,
    '488 Blue Crane Drive, Dullstroom, 1110',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '071 156 1771',
    'reception@ihealthclinics.co.za',
    'https://www.ihealthclinics.co.za',
    '{}'::jsonb,
    '{"contact_person":"i-Health","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Thembalethu Farm House',
    'thembalethu-farm-house',
    cat_accommodation,
    NULL,
    '"Old Skooltjie" Elandsfontein',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '083 3382 280',
    'sandradwurm@gmail.com',
    'https://www.thembalethufarmhouse.co.za',
    '{}'::jsonb,
    '{"contact_person":"Sandra Wurm","interests":"Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Skintopia',
    'skintopia',
    cat_retail,
    'No',
    '69 Naledi Drive, Bella Burano Centre',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0845134781',
    'venessa@skintopia.co.za',
    'https://www.skintopia.co.za',
    '{"facebook":"Skintopia dullies"}'::jsonb,
    '{"contact_person":"Venessa Brink","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Saverite Arbees',
    'saverite-arbees',
    cat_retail,
    NULL,
    '565 Lesedi street',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0820994988',
    'saveritearbees@gamil.com',
    NULL,
    '{"facebook":"Saveritearbees"}'::jsonb,
    '{"contact_person":"Zuleikha","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Plastic Fantastic',
    'plastic-fantastic',
    cat_retail,
    NULL,
    '228 Bluecrane drive',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0820994545',
    'plasticfantastic25@gmail.com',
    NULL,
    '{"facebook":"Plasticfantastic"}'::jsonb,
    '{"contact_person":"Amaan","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Osman Arbee Hardware',
    'osman-arbee-hardware',
    cat_retail,
    NULL,
    '228 Bluecrane Drive',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0131360061',
    'osmanarbee@gmail.com',
    NULL,
    '{}'::jsonb,
    '{"contact_person":"Christo","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'The Smokey Owl',
    'the-smokey-owl',
    cat_retail,
    NULL,
    '83 Naledi drive',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '0820994988',
    'zuleikhag@gmail.com',
    NULL,
    '{}'::jsonb,
    '{"contact_person":"Zuleikha","interests":"Basic business listing;Featured placement on map;Promoting events or specials;Reaching tourists visiting Dullstroom"}'::jsonb,
    true,
    'featured'
  ),
  (
    'Dullstroom Station Antiques, Collectables & Books',
    'dullstroom-station-antiques-collectables-books',
    cat_tourism,
    'Antiques, Collectables & Books plus tourist destination',
    'Around the corner from The Old Dullstroom Mill - off Bosman Street',
    ST_SetSRID(ST_MakePoint(default_lng, default_lat), 4326)::geography,
    '082 550 9091',
    'dullstroomsac@gmail.com',
    NULL,
    '{"note":"Yes. Both"}'::jsonb,
    '{"contact_person":"Peter Hardy","interests":"Both business listing & tourist destination. Highest station in South Africa"}'::jsonb,
    false,
    'basic'
  )
  ON CONFLICT (slug) DO UPDATE
  SET
    category_id = EXCLUDED.category_id,
    description = EXCLUDED.description,
    address = EXCLUDED.address,
    location = EXCLUDED.location,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    website_url = EXCLUDED.website_url,
    social_links = EXCLUDED.social_links,
    metadata = EXCLUDED.metadata,
    is_featured = EXCLUDED.is_featured,
    tier = EXCLUDED.tier,
    updated_at = NOW();
END $$;

-- ============================================
-- Official client coordinates (Jan 2026)
-- ============================================

WITH coords(slug, lat, lon) AS (
  VALUES
    ('the-dullstroom-inn', -25.418505, 30.104493),
    ('10-cherry-grove', -25.418505, 30.104493),
    ('donut-world-dullstroom', -25.416700, 30.116699),
    ('dullstroom-riding-centre', -25.418505, 30.104493),
    ('cherry-lane-at-cherry-grove', -25.418505, 30.104493),
    ('dullstroom-framing', -25.416406, 30.103602),
    ('fairstream-1', -25.413306, 30.107536),
    ('big-oak-cottages', -25.418505, 30.104493),
    ('dullstroom-bird-of-prey-and-rehabilitation-centre', -25.444917, 30.109672),
    ('the-dullstroom-inn-hotel-restaurant', -25.416078, 30.107814),
    ('connemara-close-country-estate', -25.418897, 30.103358),
    ('jocks-cottages', -25.418505, 30.104493),
    ('i-health-clinics', -25.416406, 30.103602),
    ('thembalethu-farm-house', -25.418505, 30.104493),
    ('skintopia', -25.418505, 30.104493),
    ('saverite-arbees', -25.418897, 30.103358),
    ('plastic-fantastic', -25.416406, 30.103602),
    ('osman-arbee-hardware', -25.416406, 30.103602),
    ('the-smokey-owl', -25.418505, 30.104493),
    ('dullstroom-station-antiques-collectables-books', -25.423906, 30.100853)
)
UPDATE public.businesses b
SET
  location = ST_SetSRID(ST_MakePoint(c.lon, c.lat), 4326)::geography,
  updated_at = NOW()
FROM coords c
WHERE b.slug = c.slug;

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

INSERT INTO public.town_branding (
  slug,
  town_name,
  app_name,
  tagline,
  logo_url,
  hero_url,
  primary_color,
  secondary_color,
  accent_color,
  metadata
)
VALUES (
  'dullstroom',
  'Dullstroom',
  'Digital',
  'Building a modern digital heart for our town',
  '/branding/logo-square.svg',
  '/branding/hero-banner.svg',
  '#2f4a2f',
  '#3b77c4',
  '#e58a2a',
  '{"location_label":"Mpumalanga, South Africa","banner_badge":"Official Town Guide"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE
SET
  town_name = EXCLUDED.town_name,
  app_name = EXCLUDED.app_name,
  tagline = EXCLUDED.tagline,
  logo_url = EXCLUDED.logo_url,
  hero_url = EXCLUDED.hero_url,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  accent_color = EXCLUDED.accent_color,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- The database is now seeded with:
-- - 9 business categories
-- - 20 official client businesses (Jan 2026 list)
-- - 6 main community boards
-- - 3 sub-group boards
--
-- Next steps:
-- 1. Run migrations in order (001, 002, 003)
-- 2. Run this seed.sql file (or `npx supabase db reset` locally)
-- 3. Create storage buckets: business-images, post-media, avatars
