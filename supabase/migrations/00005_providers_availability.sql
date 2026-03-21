-- 00005_providers_availability.sql
-- Providers and weekly availability templates for appointment scheduling

-- ============================================================
-- PROVIDERS (clinic staff who see patients — not tied to auth.users)
-- ============================================================

CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Dr.',
  specialty TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PROVIDER AVAILABILITY (weekly schedule templates)
-- day_of_week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
-- Each row is one time block (e.g. Mon 8AM-12PM, Mon 1PM-6PM)
-- ============================================================

CREATE TABLE provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INT NOT NULL DEFAULT 30,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_providers_clinic_id ON providers(clinic_id);
CREATE INDEX idx_providers_is_active ON providers(clinic_id, is_active);
CREATE INDEX idx_provider_availability_provider ON provider_availability(provider_id);
CREATE INDEX idx_provider_availability_clinic_day ON provider_availability(clinic_id, day_of_week);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;

-- Clinic members can read providers
CREATE POLICY "providers_clinic_isolation" ON providers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = providers.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );

-- Clinic members can read availability
CREATE POLICY "provider_availability_clinic_isolation" ON provider_availability
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = provider_availability.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER set_updated_at BEFORE UPDATE ON providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
