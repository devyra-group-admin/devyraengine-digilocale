-- ============================================
-- Allow owners to claim unowned listings by email
-- Migration: 20260223_001_business_claim_policy
-- ============================================

CREATE POLICY "Users can claim unowned businesses by email"
ON public.businesses FOR UPDATE
USING (
  owner_id IS NULL
  AND auth.uid() IS NOT NULL
  AND email IS NOT NULL
  AND lower(email) = lower(auth.email())
)
WITH CHECK (
  owner_id = auth.uid()
);
