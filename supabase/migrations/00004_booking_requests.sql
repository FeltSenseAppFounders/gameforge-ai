-- 00004_booking_requests.sql
-- Booking request handoff table — stores booking requests detected by the voice agent
-- for clinic staff to review and manually confirm/reject.

-- ============================================================
-- ENUM
-- ============================================================

CREATE TYPE booking_request_status AS ENUM ('new', 'confirmed', 'rejected');

-- ============================================================
-- TABLE
-- ============================================================

CREATE TABLE booking_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  call_id UUID NOT NULL REFERENCES calls(id) ON DELETE CASCADE,

  -- Patient info extracted from call
  patient_name TEXT,
  caller_phone TEXT,
  reason_for_visit TEXT,
  preferred_date TEXT,
  preferred_time TEXT,
  notes TEXT,

  -- Workflow
  status booking_request_status NOT NULL DEFAULT 'new',
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_booking_requests_clinic_id ON booking_requests(clinic_id);
CREATE INDEX idx_booking_requests_status ON booking_requests(status);
CREATE INDEX idx_booking_requests_created_at ON booking_requests(created_at DESC);
CREATE INDEX idx_booking_requests_call_id ON booking_requests(call_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE TRIGGER set_updated_at BEFORE UPDATE ON booking_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "booking_requests_clinic_isolation" ON booking_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = booking_requests.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );

-- Service role (Python agent) bypasses RLS automatically.
