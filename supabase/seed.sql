-- seed.sql
-- Development seed data for GameForge AI

-- ============================================================
-- 1. CREATE DEMO USER via Supabase auth
-- ============================================================

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'demo@gameforge.ai',
  crypt('demo123456', gen_salt('bf')),
  now(),
  '{"full_name": "Demo Creator", "role": "owner"}'::jsonb,
  now(),
  now(),
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'demo@gameforge.ai',
  'email',
  '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "demo@gameforge.ai"}'::jsonb,
  now(),
  now(),
  now()
) ON CONFLICT (provider_id, provider) DO NOTHING;

-- ============================================================
-- 2. SEED DEMO STUDIO (uses the RPC function)
-- ============================================================

SELECT seed_demo_studio('a1b2c3d4-e5f6-7890-abcd-ef1234567890');
