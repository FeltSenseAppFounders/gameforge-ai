-- 00003_fix_clinic_members_rls.sql
-- Fix infinite recursion in clinic_members RLS policies.
--
-- Problem: clinic_members policies query clinic_members itself,
-- which triggers the same RLS check → infinite recursion.
--
-- Fix: Use SECURITY DEFINER functions that bypass RLS to check membership.

-- ============================================================
-- HELPER FUNCTIONS (SECURITY DEFINER = bypasses RLS)
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_clinic_member(_clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clinic_members
    WHERE clinic_id = _clinic_id
    AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_clinic_admin(_clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.clinic_members
    WHERE clinic_id = _clinic_id
    AND user_id = auth.uid()
    AND role IN ('owner', 'admin')
  );
$$;

-- ============================================================
-- DROP OLD RECURSIVE POLICIES
-- ============================================================

DROP POLICY IF EXISTS "clinic_members_isolation" ON clinic_members;
DROP POLICY IF EXISTS "clinic_members_manage" ON clinic_members;
DROP POLICY IF EXISTS "clinic_members_delete" ON clinic_members;

-- ============================================================
-- RECREATE POLICIES USING HELPER FUNCTIONS
-- ============================================================

-- Members can see other members of their clinic
CREATE POLICY "clinic_members_isolation" ON clinic_members
  FOR SELECT
  USING (public.is_clinic_member(clinic_id));

-- Only owner/admin can add members
CREATE POLICY "clinic_members_manage" ON clinic_members
  FOR INSERT
  WITH CHECK (public.is_clinic_admin(clinic_id));

-- Only owner/admin can remove members
CREATE POLICY "clinic_members_delete" ON clinic_members
  FOR DELETE
  USING (public.is_clinic_admin(clinic_id));
