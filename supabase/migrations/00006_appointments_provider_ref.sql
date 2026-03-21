-- 00006_appointments_provider_ref.sql
-- Add provider_ref column to appointments for agent-booked appointments
-- Links to the new providers table (separate from the auth.users-based provider_id)

ALTER TABLE appointments
  ADD COLUMN provider_ref UUID REFERENCES providers(id) ON DELETE SET NULL;

CREATE INDEX idx_appointments_provider_ref ON appointments(provider_ref);
