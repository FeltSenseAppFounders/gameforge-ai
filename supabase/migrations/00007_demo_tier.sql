-- 00007_demo_tier.sql
-- Add 'demo' to the subscription_tier CHECK constraint on clinics

ALTER TABLE clinics
  DROP CONSTRAINT clinics_subscription_tier_check;

ALTER TABLE clinics
  ADD CONSTRAINT clinics_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'starter', 'growth', 'enterprise', 'demo'));

-- Also expand leads source to include 'demo_signup'
ALTER TABLE leads
  DROP CONSTRAINT leads_source_check;

ALTER TABLE leads
  ADD CONSTRAINT leads_source_check
  CHECK (source IN ('phone', 'web', 'referral', 'campaign', 'demo_signup'));
