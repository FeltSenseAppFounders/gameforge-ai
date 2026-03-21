-- seed.sql
-- Development seed data for FeltSense Clinic
-- Creates a demo clinic with patients, appointments, calls, and campaigns

-- ============================================================
-- 1. CREATE DEMO USER via Supabase auth
-- ============================================================

-- Insert a demo user into auth.users (Supabase local dev)
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
  'demo@brightsmile.com',
  crypt('demo123456', gen_salt('bf')),
  now(),
  '{"full_name": "Dr. Sarah Mitchell", "role": "owner"}'::jsonb,
  now(),
  now(),
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Also insert identity for the user
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
  'demo@brightsmile.com',
  'email',
  '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "demo@brightsmile.com"}'::jsonb,
  now(),
  now(),
  now()
) ON CONFLICT (provider_id, provider) DO NOTHING;

-- ============================================================
-- 2. CLINIC
-- ============================================================

INSERT INTO clinics (id, name, owner_id, subscription_tier, phone, timezone) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Bright Smile Dental', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'growth', '+1-555-234-5678', 'America/New_York');

-- ============================================================
-- 3. CLINIC MEMBER (owner)
-- ============================================================

INSERT INTO clinic_members (clinic_id, user_id, role) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'owner');

-- ============================================================
-- 4. PROVIDERS (3 dentists — matches seed_demo_clinic pattern)
-- ============================================================

INSERT INTO providers (id, clinic_id, first_name, last_name, title, specialty) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Emily',  'Chen',   'Dr.', 'General Dentistry'),
  ('d0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Marcus', 'Rivera', 'Dr.', 'Cosmetic & Implants'),
  ('d0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Sarah',  'Park',   'Dr.', 'Pediatric Dentistry');

-- ============================================================
-- 5. PROVIDER AVAILABILITY (weekly schedule templates)
--    Mon-Thu: 8AM-12PM + 1PM-6PM
--    Fri: 8AM-3PM
--    Sat: 9AM-1PM
-- ============================================================

-- Mon-Thu morning block (day_of_week 1-4)
INSERT INTO provider_availability (clinic_id, provider_id, day_of_week, start_time, end_time, slot_duration_minutes)
SELECT 'c0000000-0000-0000-0000-000000000001', prov.id, dow.d, '08:00'::TIME, '12:00'::TIME, 30
FROM (VALUES ('d0000000-0000-0000-0000-000000000001'::UUID), ('d0000000-0000-0000-0000-000000000002'::UUID), ('d0000000-0000-0000-0000-000000000003'::UUID)) AS prov(id)
CROSS JOIN (VALUES (1), (2), (3), (4)) AS dow(d);

-- Mon-Thu afternoon block
INSERT INTO provider_availability (clinic_id, provider_id, day_of_week, start_time, end_time, slot_duration_minutes)
SELECT 'c0000000-0000-0000-0000-000000000001', prov.id, dow.d, '13:00'::TIME, '18:00'::TIME, 30
FROM (VALUES ('d0000000-0000-0000-0000-000000000001'::UUID), ('d0000000-0000-0000-0000-000000000002'::UUID), ('d0000000-0000-0000-0000-000000000003'::UUID)) AS prov(id)
CROSS JOIN (VALUES (1), (2), (3), (4)) AS dow(d);

-- Friday (day_of_week 5)
INSERT INTO provider_availability (clinic_id, provider_id, day_of_week, start_time, end_time, slot_duration_minutes)
SELECT 'c0000000-0000-0000-0000-000000000001', prov.id, 5, '08:00'::TIME, '15:00'::TIME, 30
FROM (VALUES ('d0000000-0000-0000-0000-000000000001'::UUID), ('d0000000-0000-0000-0000-000000000002'::UUID), ('d0000000-0000-0000-0000-000000000003'::UUID)) AS prov(id);

-- Saturday (day_of_week 6)
INSERT INTO provider_availability (clinic_id, provider_id, day_of_week, start_time, end_time, slot_duration_minutes)
SELECT 'c0000000-0000-0000-0000-000000000001', prov.id, 6, '09:00'::TIME, '13:00'::TIME, 30
FROM (VALUES ('d0000000-0000-0000-0000-000000000001'::UUID), ('d0000000-0000-0000-0000-000000000002'::UUID), ('d0000000-0000-0000-0000-000000000003'::UUID)) AS prov(id);

-- ============================================================
-- 6. PATIENTS (12 with varied demographics)
-- ============================================================

INSERT INTO patients (id, clinic_id, first_name, last_name, email, phone, date_of_birth, insurance_provider, insurance_member_id, status, notes) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Maria', 'Garcia', 'maria.garcia@email.com', '+1-555-100-0001', '1985-03-15', 'Delta Dental', 'DD-98765', 'active', 'Regular 6-month cleanings. Prefers morning appointments.'),
  ('b0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'James', 'Wilson', 'james.w@email.com', '+1-555-100-0002', '1972-07-22', 'Cigna Dental', 'CG-45231', 'active', 'Crown on #14 scheduled. Anxious patient — needs extra reassurance.'),
  ('b0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Priya', 'Patel', 'priya.p@email.com', '+1-555-100-0003', '1990-11-08', 'MetLife Dental', 'ML-77432', 'active', NULL),
  ('b0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Robert', 'Johnson', 'bob.j@email.com', '+1-555-100-0004', '1965-01-30', 'Aetna Dental', 'AE-11298', 'active', 'Diabetic — requires antibiotic premedication.'),
  ('b0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'Emily', 'Chen', 'emily.chen@email.com', '+1-555-100-0005', '1998-05-19', NULL, NULL, 'active', 'No insurance. Self-pay. Interested in payment plans.'),
  ('b0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'Marcus', 'Thompson', 'marcus.t@email.com', '+1-555-100-0006', '1988-09-12', 'Delta Dental', 'DD-55431', 'active', NULL),
  ('b0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', 'Sofia', 'Rodriguez', 'sofia.r@email.com', '+1-555-100-0007', '1995-02-28', 'Guardian Dental', 'GD-33219', 'active', 'Orthodontic treatment in progress.'),
  ('b0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', 'David', 'Kim', 'david.kim@email.com', '+1-555-100-0008', '1978-12-04', 'Cigna Dental', 'CG-88712', 'active', 'Periodontal maintenance every 3 months.'),
  ('b0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'Ashley', 'Brown', 'ashley.b@email.com', '+1-555-100-0009', '2001-06-17', 'MetLife Dental', 'ML-22198', 'active', NULL),
  ('b0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000001', 'William', 'Davis', NULL, '+1-555-100-0010', '1955-04-03', 'Aetna Dental', 'AE-66543', 'inactive', 'Hasn''t visited in 18 months. Recall candidate.'),
  ('b0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000001', 'Linda', 'Martinez', 'linda.m@email.com', '+1-555-100-0011', '1982-08-25', 'Delta Dental', 'DD-44321', 'active', 'Teeth whitening consultation requested.'),
  ('b0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000001', 'Kevin', 'Nguyen', 'kevin.n@email.com', '+1-555-100-0012', '1993-10-11', NULL, NULL, 'active', 'New patient. Referred by Maria Garcia.');

-- ============================================================
-- 7. APPOINTMENTS (20 across the next 2 weeks)
--    provider_ref links to providers table; provider_id kept for legacy compat
-- ============================================================

INSERT INTO appointments (id, clinic_id, patient_id, provider_id, provider_ref, start_time, end_time, status, appointment_type, reason) VALUES
  -- Past appointments (completed / no-show)
  -- All times are clinic-local (America/New_York) via AT TIME ZONE
  ('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date - 5 + time '09:00') AT TIME ZONE 'America/New_York', (now()::date - 5 + time '09:30') AT TIME ZONE 'America/New_York', 'completed', 'Cleaning', 'Routine 6-month cleaning'),
  ('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000002', (now()::date - 5 + time '10:00') AT TIME ZONE 'America/New_York', (now()::date - 5 + time '11:00') AT TIME ZONE 'America/New_York', 'completed', 'Crown Prep', 'Crown preparation for tooth #14'),
  ('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000003', (now()::date - 3 + time '14:00') AT TIME ZONE 'America/New_York', (now()::date - 3 + time '14:30') AT TIME ZONE 'America/New_York', 'no_show', 'Cleaning', 'Recall appointment'),
  ('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date - 2 + time '11:00') AT TIME ZONE 'America/New_York', (now()::date - 2 + time '11:45') AT TIME ZONE 'America/New_York', 'completed', 'Filling', 'Composite filling on #19'),
  ('a0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000003', (now()::date - 1 + time '09:00') AT TIME ZONE 'America/New_York', (now()::date - 1 + time '09:30') AT TIME ZONE 'America/New_York', 'completed', 'Cleaning', 'Routine cleaning'),

  -- Today's appointments
  ('a0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + time '09:00') AT TIME ZONE 'America/New_York', (now()::date + time '10:00') AT TIME ZONE 'America/New_York', 'confirmed', 'Root Canal', 'Root canal treatment #30'),
  ('a0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + time '10:30') AT TIME ZONE 'America/New_York', (now()::date + time '11:00') AT TIME ZONE 'America/New_York', 'confirmed', 'Consultation', 'New patient exam and X-rays'),
  ('a0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000003', (now()::date + time '13:00') AT TIME ZONE 'America/New_York', (now()::date + time '13:45') AT TIME ZONE 'America/New_York', 'scheduled', 'Perio Maintenance', 'Quarterly periodontal maintenance'),
  ('a0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000003', (now()::date + time '14:30') AT TIME ZONE 'America/New_York', (now()::date + time '15:00') AT TIME ZONE 'America/New_York', 'scheduled', 'Ortho Adjustment', 'Monthly wire adjustment'),
  ('a0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + time '15:30') AT TIME ZONE 'America/New_York', (now()::date + time '16:00') AT TIME ZONE 'America/New_York', 'scheduled', 'Cleaning', 'Routine cleaning'),

  -- Upcoming appointments (next 2 weeks)
  ('a0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000002', (now()::date + 2 + time '09:00') AT TIME ZONE 'America/New_York', (now()::date + 2 + time '10:00') AT TIME ZONE 'America/New_York', 'confirmed', 'Crown Seat', 'Permanent crown cementation #14'),
  ('a0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000002', (now()::date + 3 + time '11:00') AT TIME ZONE 'America/New_York', (now()::date + 3 + time '11:30') AT TIME ZONE 'America/New_York', 'scheduled', 'Consultation', 'Whitening consultation'),
  ('a0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + 4 + time '10:00') AT TIME ZONE 'America/New_York', (now()::date + 4 + time '10:30') AT TIME ZONE 'America/New_York', 'scheduled', 'Cleaning', 'Follow-up cleaning'),
  ('a0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000012', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + 5 + time '09:00') AT TIME ZONE 'America/New_York', (now()::date + 5 + time '10:00') AT TIME ZONE 'America/New_York', 'scheduled', 'New Patient Exam', 'Comprehensive exam + full mouth X-rays'),
  ('a0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000003', (now()::date + 7 + time '13:00') AT TIME ZONE 'America/New_York', (now()::date + 7 + time '13:30') AT TIME ZONE 'America/New_York', 'scheduled', 'Cleaning', 'Routine 6-month cleaning'),
  ('a0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + 8 + time '10:00') AT TIME ZONE 'America/New_York', (now()::date + 8 + time '10:30') AT TIME ZONE 'America/New_York', 'scheduled', 'Follow-up', 'Check filling from last visit'),
  ('a0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + 10 + time '09:00') AT TIME ZONE 'America/New_York', (now()::date + 10 + time '10:00') AT TIME ZONE 'America/New_York', 'scheduled', 'Root Canal', 'Root canal continuation #30'),
  ('a0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000008', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000003', (now()::date + 11 + time '14:00') AT TIME ZONE 'America/New_York', (now()::date + 11 + time '14:45') AT TIME ZONE 'America/New_York', 'scheduled', 'Perio Maintenance', 'Quarterly periodontal maintenance'),
  ('a0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + 12 + time '11:00') AT TIME ZONE 'America/New_York', (now()::date + 12 + time '12:00') AT TIME ZONE 'America/New_York', 'scheduled', 'Extraction', 'Wisdom tooth extraction #32'),
  ('a0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000009', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'd0000000-0000-0000-0000-000000000001', (now()::date + 14 + time '15:00') AT TIME ZONE 'America/New_York', (now()::date + 14 + time '15:30') AT TIME ZONE 'America/New_York', 'scheduled', 'Cleaning', 'Routine cleaning');

-- ============================================================
-- 8. CALLS (10 historical calls with transcripts)
-- ============================================================

INSERT INTO calls (id, clinic_id, patient_id, caller_phone, call_type, status, start_time, end_time, duration_seconds, transcript, ai_summary, call_outcome, livekit_room_name) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', '+1-555-100-0001', 'inbound', 'completed',
    now() - interval '7 days' + time '09:15', now() - interval '7 days' + time '09:19', 240,
    '[{"role":"assistant","content":"Good morning! Thank you for calling Bright Smile Dental. This is Sarah, your AI assistant. How can I help you today?"},{"role":"user","content":"Hi, I need to schedule a cleaning appointment."},{"role":"assistant","content":"I''d be happy to help you schedule a cleaning! I can see you''re due for your 6-month cleaning. We have availability this week on Wednesday at 9 AM or Thursday at 2 PM. Which works better for you?"},{"role":"user","content":"Wednesday at 9 works great."},{"role":"assistant","content":"Perfect! I''ve noted your preference for Wednesday at 9 AM for a routine cleaning. Our team will confirm this appointment shortly. Is there anything else I can help with?"},{"role":"user","content":"No, that''s all. Thanks!"},{"role":"assistant","content":"You''re welcome, Maria! We look forward to seeing you. Have a great day!"}]'::jsonb,
    'Patient Maria Garcia called to schedule a routine 6-month cleaning. Appointment requested for Wednesday 9 AM. Patient is a regular — no concerns noted.',
    'appointment_requested', 'room_seed_001'),

  ('c1000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', '+1-555-100-0002', 'inbound', 'completed',
    now() - interval '6 days' + time '14:30', now() - interval '6 days' + time '14:38', 480,
    '[{"role":"assistant","content":"Good afternoon! Thank you for calling Bright Smile Dental. This is Sarah. How can I help you today?"},{"role":"user","content":"Hi, I had a crown prep done last week and I''m having some sensitivity. Is that normal?"},{"role":"assistant","content":"I understand your concern, James. Some sensitivity after a crown preparation is quite common and usually subsides within 1-2 weeks. Are you experiencing sharp pain when biting down, or is it more of a temperature sensitivity?"},{"role":"user","content":"Mostly temperature sensitivity, especially with cold drinks."},{"role":"assistant","content":"That''s very typical after crown prep. I''d recommend using a sensitivity toothpaste and avoiding extremely hot or cold foods for the next few days. If the sensitivity worsens or you experience sharp pain, please call us back right away. Would you like me to have Dr. Mitchell''s team follow up with you?"},{"role":"user","content":"That would be great, thanks."},{"role":"assistant","content":"I''ll make sure the team follows up with you tomorrow. Your permanent crown appointment is already scheduled. Take care, James!"}]'::jsonb,
    'James Wilson called about post-crown-prep sensitivity. Temperature sensitivity is normal — advised sensitivity toothpaste and monitoring. Requested team follow-up. No emergency action needed.',
    'question_answered', 'room_seed_002'),

  ('c1000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', NULL, '+1-555-200-9999', 'inbound', 'completed',
    now() - interval '5 days' + time '10:45', now() - interval '5 days' + time '10:51', 360,
    '[{"role":"assistant","content":"Good morning! Thank you for calling Bright Smile Dental. This is Sarah. How can I help you today?"},{"role":"user","content":"Hi, I''m looking for a new dentist. Do you accept MetLife insurance?"},{"role":"assistant","content":"Welcome! Yes, we do accept MetLife Dental insurance. We''d love to have you as a new patient! Our new patient visit includes a comprehensive exam, full mouth X-rays, and a cleaning. Would you like to schedule an appointment?"},{"role":"user","content":"Yes, what''s available next week?"},{"role":"assistant","content":"We have several openings next week. I can see availability on Monday at 10 AM, Tuesday at 2 PM, or Friday at 9 AM. Which would work best for you?"},{"role":"user","content":"Friday at 9 sounds good. My name is Kevin Nguyen."},{"role":"assistant","content":"Wonderful, Kevin! I''ll pass along your request for Friday at 9 AM for a new patient exam. Our team will call you back to confirm and collect your insurance details. What''s the best number to reach you?"},{"role":"user","content":"This number is fine, 555-100-0012."},{"role":"assistant","content":"Got it! We''ll be in touch soon. Welcome to Bright Smile Dental, Kevin!"}]'::jsonb,
    'New patient inquiry from Kevin Nguyen. Has MetLife insurance. Requested new patient exam for Friday 9 AM. Phone: 555-100-0012. Converted from lead to patient.',
    'appointment_requested', 'room_seed_003'),

  ('c1000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005', '+1-555-100-0005', 'inbound', 'completed',
    now() - interval '4 days' + time '16:20', now() - interval '4 days' + time '16:26', 360,
    '[{"role":"assistant","content":"Good afternoon! Bright Smile Dental, Sarah speaking. How can I help you?"},{"role":"user","content":"Hi, I wanted to ask about payment options. I don''t have insurance and I need to get a wisdom tooth removed."},{"role":"assistant","content":"Of course, Emily. We understand that dental costs can be a concern. For wisdom tooth extractions, we offer several payment options including payment plans. The typical cost for a single wisdom tooth extraction ranges from $200-400 depending on complexity. Would you like to schedule a consultation first?"},{"role":"user","content":"Yes, that would be helpful. And what about the payment plan?"},{"role":"assistant","content":"We offer interest-free payment plans that can split the cost into 3-6 monthly installments. Our team can go over all the details during your consultation. Shall I schedule that for you?"},{"role":"user","content":"Yes please, sometime next week if possible."},{"role":"assistant","content":"I''ll request a consultation appointment for next week. Our team will reach out to confirm the exact time. Is there anything else I can help with?"},{"role":"user","content":"No, that''s it. Thank you!"}]'::jsonb,
    'Emily Chen called about wisdom tooth extraction costs and payment options. No insurance — self-pay patient. Interested in payment plan (3-6 month installments). Consultation appointment requested for next week.',
    'appointment_requested', 'room_seed_004'),

  ('c1000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004', '+1-555-100-0004', 'inbound', 'completed',
    now() - interval '3 days' + time '08:30', now() - interval '3 days' + time '08:33', 180,
    '[{"role":"assistant","content":"Good morning! Bright Smile Dental, Sarah here. How can I help you?"},{"role":"user","content":"I need to reschedule my root canal. Something came up at work."},{"role":"assistant","content":"No problem, Robert. I can see you have a root canal scheduled. Let me pass this along to our scheduling team. Do you have a preferred date or time?"},{"role":"user","content":"Anytime next week in the morning works."},{"role":"assistant","content":"I''ll note your preference for a morning slot next week. Our team will call you back with available times. Anything else?"},{"role":"user","content":"Nope, thanks."}]'::jsonb,
    'Robert Johnson called to reschedule root canal appointment. Prefers morning slots next week. Note: patient is diabetic and requires antibiotic premedication.',
    'reschedule_requested', 'room_seed_005'),

  ('c1000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000001', NULL, '+1-555-300-1111', 'inbound', 'missed',
    now() - interval '3 days' + time '12:05', NULL, 0,
    NULL,
    NULL,
    'missed', 'room_seed_006'),

  ('c1000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000007', '+1-555-100-0007', 'inbound', 'completed',
    now() - interval '2 days' + time '15:00', now() - interval '2 days' + time '15:05', 300,
    '[{"role":"assistant","content":"Good afternoon! Bright Smile Dental, this is Sarah. How can I help you?"},{"role":"user","content":"Hi Sarah, I''m calling about my orthodontic treatment. My wire feels loose."},{"role":"assistant","content":"I''m sorry to hear that, Sofia. A loose wire can be uncomfortable. If it''s poking your cheek, you can use orthodontic wax as a temporary fix. However, I''d recommend coming in as soon as possible so Dr. Mitchell can adjust it. Would you like me to schedule an emergency ortho visit?"},{"role":"user","content":"Yes please, can I come in tomorrow?"},{"role":"assistant","content":"I''ll flag this as urgent and have our team reach out to fit you in tomorrow. In the meantime, try the wax trick and avoid hard or sticky foods. We''ll take care of you!"},{"role":"user","content":"Thank you so much!"}]'::jsonb,
    'Sofia Rodriguez called about a loose orthodontic wire. Advised wax as temporary fix. Urgent ortho adjustment requested for next day.',
    'urgent_appointment_requested', 'room_seed_007'),

  ('c1000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000008', '+1-555-100-0008', 'outbound', 'completed',
    now() - interval '1 day' + time '10:00', now() - interval '1 day' + time '10:04', 240,
    '[{"role":"assistant","content":"Hi David, this is Sarah from Bright Smile Dental. I''m calling to remind you about your periodontal maintenance appointment coming up. Are you still available?"},{"role":"user","content":"Oh yes, thanks for the reminder. I''ll be there."},{"role":"assistant","content":"Great! Just a reminder to continue with your prescribed mouth rinse before the visit. See you then!"},{"role":"user","content":"Will do, thanks!"}]'::jsonb,
    'Outbound reminder call to David Kim for upcoming periodontal maintenance. Patient confirmed attendance. Reminded about prescribed mouth rinse.',
    'confirmed', 'room_seed_008'),

  ('c1000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000011', '+1-555-100-0011', 'inbound', 'completed',
    now() - interval '1 day' + time '11:30', now() - interval '1 day' + time '11:35', 300,
    '[{"role":"assistant","content":"Good morning! Bright Smile Dental, Sarah here. How may I help you?"},{"role":"user","content":"Hi, I''d like to learn about teeth whitening options."},{"role":"assistant","content":"Great question, Linda! We offer both in-office and take-home whitening options. In-office whitening takes about an hour and gives immediate results. Take-home kits are custom-fitted and work over 1-2 weeks. Would you like to schedule a whitening consultation?"},{"role":"user","content":"Yes, the in-office option sounds interesting. How much does it cost?"},{"role":"assistant","content":"In-office whitening typically ranges from $300-500. The exact cost depends on the level of treatment. I''d recommend starting with a consultation where Dr. Mitchell can assess your teeth and recommend the best option. Shall I schedule that?"},{"role":"user","content":"Yes please!"}]'::jsonb,
    'Linda Martinez inquired about teeth whitening options. Interested in in-office whitening ($300-500 range). Consultation appointment requested.',
    'appointment_requested', 'room_seed_009'),

  ('c1000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000010', '+1-555-100-0010', 'outbound', 'failed',
    now() - interval '1 day' + time '14:00', now() - interval '1 day' + time '14:01', 60,
    NULL,
    'Attempted recall outbound call to William Davis. No answer — went to voicemail. Patient hasn''t visited in 18 months.',
    'no_answer', 'room_seed_010');

-- ============================================================
-- 9. CAMPAIGNS (2 active)
-- ============================================================

INSERT INTO campaigns (id, clinic_id, name, campaign_type, status, target_patient_count, completed_call_count, ai_script) VALUES
  ('c2000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '6-Month Recall — March 2026', 'recall', 'active', 15, 3,
    'Hi [patient_name], this is Sarah from Bright Smile Dental. I''m calling because it''s been about 6 months since your last cleaning, and we''d love to get you scheduled for your next visit. Do you have a few minutes to find a time that works?'),
  ('c2000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'New Lead Follow-up — Web Inquiries', 'lead_response', 'active', 8, 1,
    'Hi [lead_name], this is Sarah from Bright Smile Dental. Thank you for your interest in our practice! I''m calling to answer any questions you might have and help you schedule your first visit. Is now a good time?');

-- ============================================================
-- 10. LEADS
-- ============================================================

INSERT INTO leads (clinic_id, first_name, last_name, phone, email, source, status, notes) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Alex', 'Rivera', '+1-555-400-0001', 'alex.r@email.com', 'web', 'new', 'Submitted form on website. Interested in Invisalign.'),
  ('c0000000-0000-0000-0000-000000000001', 'Jennifer', 'Park', '+1-555-400-0002', NULL, 'phone', 'contacted', 'Called asking about pediatric dental services.'),
  ('c0000000-0000-0000-0000-000000000001', 'Michael', 'O''Brien', '+1-555-400-0003', 'michael.ob@email.com', 'referral', 'new', 'Referred by patient Marcus Thompson.');
