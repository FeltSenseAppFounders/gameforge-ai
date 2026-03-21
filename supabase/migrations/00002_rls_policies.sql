-- 00002_rls_policies.sql
-- Row Level Security — clinic isolation for all tenant-scoped tables
-- Pattern: user must be a member of the clinic to access its data

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CLINICS — owner or member can access
-- ============================================================

CREATE POLICY "clinic_owner_access" ON clinics
  FOR ALL
  USING (owner_id = auth.uid());

CREATE POLICY "clinic_member_access" ON clinics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = clinics.id
      AND clinic_members.user_id = auth.uid()
    )
  );

-- ============================================================
-- CLINIC MEMBERS — members can see other members of their clinic
-- ============================================================

CREATE POLICY "clinic_members_isolation" ON clinic_members
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members AS cm
      WHERE cm.clinic_id = clinic_members.clinic_id
      AND cm.user_id = auth.uid()
    )
  );

-- Only owner/admin can manage members
CREATE POLICY "clinic_members_manage" ON clinic_members
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clinic_members AS cm
      WHERE cm.clinic_id = clinic_members.clinic_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "clinic_members_delete" ON clinic_members
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members AS cm
      WHERE cm.clinic_id = clinic_members.clinic_id
      AND cm.user_id = auth.uid()
      AND cm.role IN ('owner', 'admin')
    )
  );

-- ============================================================
-- TENANT-SCOPED TABLES — standard clinic isolation pattern
-- ============================================================

CREATE POLICY "patients_clinic_isolation" ON patients
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = patients.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );

CREATE POLICY "appointments_clinic_isolation" ON appointments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = appointments.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );

CREATE POLICY "calls_clinic_isolation" ON calls
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = calls.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );

CREATE POLICY "campaigns_clinic_isolation" ON campaigns
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = campaigns.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );

CREATE POLICY "leads_clinic_isolation" ON leads
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = leads.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );

-- ============================================================
-- SERVICE ROLE BYPASS
-- The Python voice agent uses the service_role key which bypasses
-- RLS automatically. No additional policies needed for agent writes.
-- ============================================================
