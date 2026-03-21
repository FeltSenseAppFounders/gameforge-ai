-- 00001_initial_schema.sql
-- FeltSense Clinic — Initial database schema
-- Multi-tenant dental practice management with voice AI call logging

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE clinic_role AS ENUM ('owner', 'admin', 'dentist', 'hygienist', 'receptionist', 'staff');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'no_show', 'cancelled');
CREATE TYPE call_type AS ENUM ('inbound', 'outbound');
CREATE TYPE call_status AS ENUM ('pending', 'ringing', 'in_progress', 'completed', 'failed', 'missed');
CREATE TYPE campaign_type AS ENUM ('recall', 'debt_collection', 'followup', 'lead_response');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');

-- ============================================================
-- TABLES
-- ============================================================

-- Clinics (multi-tenant root)
CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'growth', 'enterprise')),
  phone TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clinic members (users <-> clinics with roles)
CREATE TABLE clinic_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role clinic_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, user_id)
);

-- Patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  insurance_provider TEXT,
  insurance_member_id TEXT,
  insurance_group_number TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES auth.users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'scheduled',
  appointment_type TEXT NOT NULL,
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

-- Calls (voice agent conversation logs)
CREATE TABLE calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id),
  caller_phone TEXT,
  call_type call_type NOT NULL,
  status call_status DEFAULT 'pending',
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_seconds INT,
  transcript JSONB,
  ai_summary TEXT,
  call_outcome TEXT,
  appointment_booked_id UUID REFERENCES appointments(id),
  payment_collected DECIMAL(10, 2),
  livekit_room_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Campaigns (recall, debt collection, lead response)
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  campaign_type campaign_type NOT NULL,
  status campaign_status DEFAULT 'draft',
  target_patient_count INT DEFAULT 0,
  completed_call_count INT DEFAULT 0,
  ai_script TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Leads (inbound inquiries not yet converted to patients)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT DEFAULT 'phone' CHECK (source IN ('phone', 'web', 'referral', 'campaign')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  call_id UUID REFERENCES calls(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Clinic isolation (critical for RLS performance)
CREATE INDEX idx_clinic_members_clinic_id ON clinic_members(clinic_id);
CREATE INDEX idx_clinic_members_user_id ON clinic_members(user_id);
CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_calls_clinic_id ON calls(clinic_id);
CREATE INDEX idx_campaigns_clinic_id ON campaigns(clinic_id);
CREATE INDEX idx_leads_clinic_id ON leads(clinic_id);

-- Common query patterns
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_calls_created_at ON calls(created_at);
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_calls_status ON calls(status);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
