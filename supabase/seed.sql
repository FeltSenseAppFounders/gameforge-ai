-- seed.sql
-- Development seed data for GameForge AI

SET session_replication_role = 'replica';

-- ============================================================
-- 1. CREATE DEMO USER via Supabase auth
-- ============================================================

INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890', '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'demo@gameforge.ai',
  extensions.crypt('demo123456', extensions.gen_salt('bf')), NOW(), NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name": "Demo Creator", "role": "owner"}'::jsonb,
  NOW(), NOW(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, provider_id, provider, identity_data,
  last_sign_in_at, created_at, updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'demo@gameforge.ai', 'email',
  '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "demo@gameforge.ai"}'::jsonb,
  NOW(), NOW(), NOW()
) ON CONFLICT (provider_id, provider) DO NOTHING;

SET session_replication_role = 'origin';

-- ============================================================
-- 2. SEED DEMO STUDIO (uses the RPC function)
-- ============================================================

SELECT seed_demo_studio('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
