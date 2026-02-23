import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const DEFAULT_BRANDING = {
  slug: 'dullstroom',
  townName: 'Dullstroom',
  appName: 'Digital',
  tagline: 'Building a modern digital heart for our town',
  logoUrl: '/branding/logo-square.svg',
  heroUrl: '/branding/hero-banner.svg',
  primaryColor: '#2f4a2f',
  secondaryColor: '#3b77c4',
  accentColor: '#e58a2a',
  locationLabel: 'Mpumalanga, South Africa',
  bannerBadge: 'Official Town Guide',
};

function normalizeColor(value, fallback) {
  const color = String(value || '').trim();
  return /^#[0-9a-fA-F]{6}$/.test(color) ? color : fallback;
}

function getTownSlug() {
  const envSlug = String(import.meta.env.VITE_TOWN_SLUG || '').trim().toLowerCase();
  let querySlug = '';

  if (typeof window !== 'undefined') {
    const fromQuery = new URLSearchParams(window.location.search).get('town');
    querySlug = String(fromQuery || '').trim().toLowerCase();
  }

  return querySlug || envSlug || DEFAULT_BRANDING.slug;
}

function mapRowToBranding(row, fallbackSlug) {
  const metadata = row?.metadata && typeof row.metadata === 'object' ? row.metadata : {};
  return {
    slug: row?.slug || fallbackSlug || DEFAULT_BRANDING.slug,
    townName: row?.town_name || DEFAULT_BRANDING.townName,
    appName: row?.app_name || DEFAULT_BRANDING.appName,
    tagline: row?.tagline || DEFAULT_BRANDING.tagline,
    logoUrl: row?.logo_url || DEFAULT_BRANDING.logoUrl,
    heroUrl: row?.hero_url || DEFAULT_BRANDING.heroUrl,
    primaryColor: normalizeColor(row?.primary_color, DEFAULT_BRANDING.primaryColor),
    secondaryColor: normalizeColor(row?.secondary_color, DEFAULT_BRANDING.secondaryColor),
    accentColor: normalizeColor(row?.accent_color, DEFAULT_BRANDING.accentColor),
    locationLabel: String(metadata.location_label || DEFAULT_BRANDING.locationLabel),
    bannerBadge: String(metadata.banner_badge || DEFAULT_BRANDING.bannerBadge),
  };
}

export default function useTownBranding() {
  const slug = useMemo(() => getTownSlug(), []);
  const [branding, setBranding] = useState(() => ({
    ...DEFAULT_BRANDING,
    slug,
  }));
  const [loadingBranding, setLoadingBranding] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchBranding = async () => {
      const { data, error } = await supabase
        .from('town_branding')
        .select('slug,town_name,app_name,tagline,logo_url,hero_url,primary_color,secondary_color,accent_color,metadata')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (!mounted) return;

      if (!error && data) {
        setBranding(mapRowToBranding(data, slug));
      } else {
        setBranding((prev) => ({ ...prev, slug }));
      }

      setLoadingBranding(false);
    };

    void fetchBranding();

    const channel = supabase
      .channel(`town-branding-${slug}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'town_branding', filter: `slug=eq.${slug}` },
        () => {
          void fetchBranding();
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, [slug]);

  useEffect(() => {
    if (typeof document !== 'undefined' && branding?.townName) {
      document.title = `${branding.townName} ${branding.appName || DEFAULT_BRANDING.appName}`.trim();
    }
  }, [branding?.townName, branding?.appName]);

  return { branding, loadingBranding, townSlug: slug };
}
