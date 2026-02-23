-- ============================================
-- Multi-town branding + super admin support
-- Migration: 20260223000300_town_branding_super_admin
-- ============================================

-- Mark privileged users without overloading role values.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_profiles_super_admin
ON public.profiles(is_super_admin)
WHERE is_super_admin = TRUE;

CREATE OR REPLACE FUNCTION public.ensure_super_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_super_admin = TRUE THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_super_admin_role_trigger ON public.profiles;
CREATE TRIGGER ensure_super_admin_role_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.ensure_super_admin_role();

UPDATE public.profiles
SET role = 'admin'
WHERE is_super_admin = TRUE
  AND role <> 'admin';

-- Per-town branding configuration.
CREATE TABLE IF NOT EXISTS public.town_branding (
  slug VARCHAR(100) PRIMARY KEY,
  town_name VARCHAR(255) NOT NULL,
  app_name VARCHAR(255) NOT NULL DEFAULT 'Digital Guide',
  tagline TEXT,
  logo_url TEXT,
  hero_url TEXT,
  primary_color VARCHAR(7),
  secondary_color VARCHAR(7),
  accent_color VARCHAR(7),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}',
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_town_branding_active ON public.town_branding(is_active);
CREATE INDEX IF NOT EXISTS idx_town_branding_town_name ON public.town_branding(town_name);

DROP TRIGGER IF EXISTS update_town_branding_updated_at ON public.town_branding;
CREATE TRIGGER update_town_branding_updated_at
  BEFORE UPDATE ON public.town_branding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.town_branding ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Town branding is viewable by everyone" ON public.town_branding;
CREATE POLICY "Town branding is viewable by everyone"
ON public.town_branding FOR SELECT
USING (
  is_active = TRUE OR
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (p.is_super_admin = TRUE OR p.role = 'admin')
  )
);

DROP POLICY IF EXISTS "Only super admins can manage town branding" ON public.town_branding;
CREATE POLICY "Only super admins can manage town branding"
ON public.town_branding FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (p.is_super_admin = TRUE OR p.role = 'admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND (p.is_super_admin = TRUE OR p.role = 'admin')
  )
);

COMMENT ON TABLE public.town_branding IS 'Branding settings per town (logo, hero, colors, tagline)';
COMMENT ON COLUMN public.profiles.is_super_admin IS 'Grants access to super admin-only controls';
