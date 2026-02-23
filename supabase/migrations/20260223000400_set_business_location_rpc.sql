-- ============================================
-- RPC helper to set business location by lat/lng
-- Migration: 20260223000400_set_business_location_rpc
-- ============================================

CREATE OR REPLACE FUNCTION public.set_business_location(
  p_business_id UUID,
  p_lat DOUBLE PRECISION,
  p_lng DOUBLE PRECISION
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_can_manage BOOLEAN := FALSE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated.';
  END IF;

  IF p_lat IS NULL OR p_lng IS NULL THEN
    RAISE EXCEPTION 'Latitude and longitude are required.';
  END IF;

  IF p_lat < -90 OR p_lat > 90 THEN
    RAISE EXCEPTION 'Latitude must be between -90 and 90.';
  END IF;

  IF p_lng < -180 OR p_lng > 180 THEN
    RAISE EXCEPTION 'Longitude must be between -180 and 180.';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.businesses b
    WHERE b.id = p_business_id
      AND (
        b.owner_id = auth.uid()
        OR EXISTS (
          SELECT 1
          FROM public.profiles p
          WHERE p.id = auth.uid()
            AND (p.role = 'admin' OR p.is_super_admin = TRUE)
        )
      )
  )
  INTO v_can_manage;

  IF NOT v_can_manage THEN
    RAISE EXCEPTION 'Not authorized to update this business location.';
  END IF;

  UPDATE public.businesses
  SET
    location = ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
    updated_at = NOW()
  WHERE id = p_business_id;
END;
$$;

REVOKE ALL ON FUNCTION public.set_business_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_business_location(UUID, DOUBLE PRECISION, DOUBLE PRECISION) TO authenticated;
