-- 00011_fix_seed_demo_timezone.sql
-- Fix: seed_demo_clinic now uses the clinic's timezone column when creating
-- appointment timestamps, so "9 AM" means 9 AM clinic-local, not 9 AM UTC.

CREATE OR REPLACE FUNCTION seed_demo_clinic(
  _clinic_id UUID,
  _owner_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  -- Provider IDs
  _prov_chen UUID := gen_random_uuid();
  _prov_rivera UUID := gen_random_uuid();
  _prov_park UUID := gen_random_uuid();
  -- Patient IDs
  _pat_ids UUID[] := ARRAY[
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid()
  ];
  -- Call IDs (for booking_requests FK)
  _call_ids UUID[] := ARRAY[
    gen_random_uuid(), gen_random_uuid(), gen_random_uuid(),
    gen_random_uuid(), gen_random_uuid()
  ];
  _today DATE := CURRENT_DATE;
  _tz TEXT;
BEGIN

  -- Load the clinic's timezone
  SELECT timezone INTO _tz FROM clinics WHERE id = _clinic_id;
  IF _tz IS NULL THEN _tz := 'America/New_York'; END IF;

  -- ============================================================
  -- 1. PROVIDERS (3 dentists)
  -- ============================================================

  INSERT INTO providers (id, clinic_id, first_name, last_name, title, specialty) VALUES
    (_prov_chen,   _clinic_id, 'Emily',  'Chen',   'Dr.', 'General Dentistry'),
    (_prov_rivera, _clinic_id, 'Marcus', 'Rivera', 'Dr.', 'Cosmetic & Implants'),
    (_prov_park,   _clinic_id, 'Sarah',  'Park',   'Dr.', 'Pediatric Dentistry');

  -- ============================================================
  -- 2. PROVIDER AVAILABILITY (weekly templates)
  --    Mon-Thu: 8AM-12PM + 1PM-6PM
  --    Fri: 8AM-3PM
  --    Sat: 9AM-1PM
  -- ============================================================

  -- Mon-Thu morning block (day_of_week 1-4)
  INSERT INTO provider_availability (clinic_id, provider_id, day_of_week, start_time, end_time, slot_duration_minutes)
  SELECT _clinic_id, prov.id, dow.d, '08:00'::TIME, '12:00'::TIME, 30
  FROM (VALUES (_prov_chen), (_prov_rivera), (_prov_park)) AS prov(id)
  CROSS JOIN (VALUES (1), (2), (3), (4)) AS dow(d);

  -- Mon-Thu afternoon block
  INSERT INTO provider_availability (clinic_id, provider_id, day_of_week, start_time, end_time, slot_duration_minutes)
  SELECT _clinic_id, prov.id, dow.d, '13:00'::TIME, '18:00'::TIME, 30
  FROM (VALUES (_prov_chen), (_prov_rivera), (_prov_park)) AS prov(id)
  CROSS JOIN (VALUES (1), (2), (3), (4)) AS dow(d);

  -- Friday (day_of_week 5)
  INSERT INTO provider_availability (clinic_id, provider_id, day_of_week, start_time, end_time, slot_duration_minutes)
  SELECT _clinic_id, prov.id, 5, '08:00'::TIME, '15:00'::TIME, 30
  FROM (VALUES (_prov_chen), (_prov_rivera), (_prov_park)) AS prov(id);

  -- Saturday (day_of_week 6)
  INSERT INTO provider_availability (clinic_id, provider_id, day_of_week, start_time, end_time, slot_duration_minutes)
  SELECT _clinic_id, prov.id, 6, '09:00'::TIME, '13:00'::TIME, 30
  FROM (VALUES (_prov_chen), (_prov_rivera), (_prov_park)) AS prov(id);

  -- ============================================================
  -- 3. PATIENTS (10 diverse patients)
  -- ============================================================

  INSERT INTO patients (id, clinic_id, first_name, last_name, email, phone, date_of_birth, insurance_provider, insurance_member_id, status, notes) VALUES
    (_pat_ids[1],  _clinic_id, 'Maria',    'Garcia',    'maria.garcia@email.com',    '+1-555-100-0001', '1985-03-15', 'Delta Dental',    'DD-98765', 'active', 'Regular 6-month cleanings. Prefers morning appointments.'),
    (_pat_ids[2],  _clinic_id, 'James',    'Wilson',    'james.w@email.com',         '+1-555-100-0002', '1972-07-22', 'Cigna Dental',    'CG-45231', 'active', 'Crown on #14 scheduled. Anxious patient.'),
    (_pat_ids[3],  _clinic_id, 'Priya',    'Patel',     'priya.p@email.com',         '+1-555-100-0003', '1990-11-08', 'MetLife Dental',  'ML-77432', 'active', NULL),
    (_pat_ids[4],  _clinic_id, 'Robert',   'Johnson',   'bob.j@email.com',           '+1-555-100-0004', '1965-01-30', 'Aetna Dental',    'AE-11298', 'active', 'Diabetic — requires antibiotic premedication.'),
    (_pat_ids[5],  _clinic_id, 'Emily',    'Tran',      'emily.tran@email.com',      '+1-555-100-0005', '1998-05-19', NULL,              NULL,       'active', 'No insurance. Self-pay. Interested in payment plans.'),
    (_pat_ids[6],  _clinic_id, 'Marcus',   'Thompson',  'marcus.t@email.com',        '+1-555-100-0006', '1988-09-12', 'Delta Dental',    'DD-55431', 'active', NULL),
    (_pat_ids[7],  _clinic_id, 'Sofia',    'Rodriguez', 'sofia.r@email.com',         '+1-555-100-0007', '1995-02-28', 'Guardian Dental', 'GD-33219', 'active', 'Orthodontic treatment in progress.'),
    (_pat_ids[8],  _clinic_id, 'David',    'Kim',       'david.kim@email.com',       '+1-555-100-0008', '1978-12-04', 'Cigna Dental',    'CG-88712', 'active', 'Periodontal maintenance every 3 months.'),
    (_pat_ids[9],  _clinic_id, 'Ashley',   'Brown',     'ashley.b@email.com',        '+1-555-100-0009', '2001-06-17', 'MetLife Dental',  'ML-22198', 'active', NULL),
    (_pat_ids[10], _clinic_id, 'William',  'Davis',     NULL,                        '+1-555-100-0010', '1955-04-03', 'Aetna Dental',    'AE-66543', 'inactive', 'Hasn''t visited in 18 months. Recall candidate.');

  -- ============================================================
  -- 4. APPOINTMENTS (15: 5 past, 2 today, 8 upcoming — with gaps)
  --    All times interpreted in the clinic's timezone
  -- ============================================================

  INSERT INTO appointments (clinic_id, patient_id, provider_ref, start_time, end_time, status, appointment_type, reason) VALUES
    -- Past completed (5)
    (_clinic_id, _pat_ids[1], _prov_chen,   (_today - 5 + TIME '09:00') AT TIME ZONE _tz, (_today - 5 + TIME '09:30') AT TIME ZONE _tz, 'completed', 'Cleaning',     'Routine 6-month cleaning'),
    (_clinic_id, _pat_ids[2], _prov_rivera, (_today - 5 + TIME '10:00') AT TIME ZONE _tz, (_today - 5 + TIME '11:00') AT TIME ZONE _tz, 'completed', 'Crown Prep',   'Crown preparation for tooth #14'),
    (_clinic_id, _pat_ids[3], _prov_chen,   (_today - 3 + TIME '11:00') AT TIME ZONE _tz, (_today - 3 + TIME '11:45') AT TIME ZONE _tz, 'completed', 'Filling',      'Composite filling on #19'),
    (_clinic_id, _pat_ids[6], _prov_park,   (_today - 2 + TIME '09:00') AT TIME ZONE _tz, (_today - 2 + TIME '09:30') AT TIME ZONE _tz, 'completed', 'Cleaning',     'Routine cleaning'),
    (_clinic_id, _pat_ids[4], _prov_chen,   (_today - 1 + TIME '14:00') AT TIME ZONE _tz, (_today - 1 + TIME '15:00') AT TIME ZONE _tz, 'completed', 'Root Canal',   'Root canal treatment #30'),

    -- Today (2)
    (_clinic_id, _pat_ids[5], _prov_chen,   (_today + TIME '09:00') AT TIME ZONE _tz, (_today + TIME '10:00') AT TIME ZONE _tz, 'confirmed', 'Consultation', 'New patient exam and X-rays'),
    (_clinic_id, _pat_ids[8], _prov_park,   (_today + TIME '13:00') AT TIME ZONE _tz, (_today + TIME '13:30') AT TIME ZONE _tz, 'scheduled', 'Perio Maintenance', 'Quarterly periodontal maintenance'),

    -- Upcoming (8 — spread across next 2 weeks, leaving plenty of gaps)
    (_clinic_id, _pat_ids[2],  _prov_rivera, (_today + 2  + TIME '09:00') AT TIME ZONE _tz, (_today + 2  + TIME '10:00') AT TIME ZONE _tz, 'confirmed', 'Crown Seat',      'Permanent crown cementation #14'),
    (_clinic_id, _pat_ids[7],  _prov_park,   (_today + 3  + TIME '14:00') AT TIME ZONE _tz, (_today + 3  + TIME '14:30') AT TIME ZONE _tz, 'scheduled', 'Ortho Adjustment', 'Monthly wire adjustment'),
    (_clinic_id, _pat_ids[1],  _prov_chen,   (_today + 4  + TIME '10:00') AT TIME ZONE _tz, (_today + 4  + TIME '10:30') AT TIME ZONE _tz, 'scheduled', 'Cleaning',         'Follow-up cleaning'),
    (_clinic_id, _pat_ids[9],  _prov_chen,   (_today + 5  + TIME '15:00') AT TIME ZONE _tz, (_today + 5  + TIME '15:30') AT TIME ZONE _tz, 'scheduled', 'Cleaning',         'Routine cleaning'),
    (_clinic_id, _pat_ids[6],  _prov_rivera, (_today + 7  + TIME '13:00') AT TIME ZONE _tz, (_today + 7  + TIME '13:30') AT TIME ZONE _tz, 'scheduled', 'Cleaning',         'Routine 6-month cleaning'),
    (_clinic_id, _pat_ids[3],  _prov_chen,   (_today + 8  + TIME '10:00') AT TIME ZONE _tz, (_today + 8  + TIME '10:30') AT TIME ZONE _tz, 'scheduled', 'Follow-up',        'Check filling from last visit'),
    (_clinic_id, _pat_ids[4],  _prov_chen,   (_today + 10 + TIME '09:00') AT TIME ZONE _tz, (_today + 10 + TIME '10:00') AT TIME ZONE _tz, 'scheduled', 'Root Canal',       'Root canal continuation #30'),
    (_clinic_id, _pat_ids[8],  _prov_park,   (_today + 11 + TIME '14:00') AT TIME ZONE _tz, (_today + 11 + TIME '14:45') AT TIME ZONE _tz, 'scheduled', 'Perio Maintenance', 'Quarterly periodontal maintenance');

  -- ============================================================
  -- 5. CALLS (5 with realistic transcripts)
  -- ============================================================

  INSERT INTO calls (id, clinic_id, patient_id, caller_phone, call_type, status, start_time, end_time, duration_seconds, transcript, ai_summary, call_outcome, livekit_room_name) VALUES
    (_call_ids[1], _clinic_id, _pat_ids[1], '+1-555-100-0001', 'inbound', 'completed',
      now() - INTERVAL '3 days' + TIME '09:15', now() - INTERVAL '3 days' + TIME '09:19', 240,
      '[{"role":"assistant","content":"Good morning! Thank you for calling. This is Sarah, your AI dental assistant. How can I help you today?"},{"role":"user","content":"Hi, I need to schedule a cleaning appointment."},{"role":"assistant","content":"I''d be happy to help! Let me check our availability. We have openings this week. Would a morning or afternoon work better?"},{"role":"user","content":"Morning is great."},{"role":"assistant","content":"I have a slot available on Wednesday at 9 AM with Dr. Chen. Shall I book that for you?"},{"role":"user","content":"Perfect, yes please!"},{"role":"assistant","content":"Done! You''re all set for Wednesday at 9 AM. See you then, Maria!"}]'::JSONB,
      'Maria Garcia called to schedule a routine cleaning. Booked for Wednesday 9 AM with Dr. Chen.',
      'appointment_booked', 'room_demo_001'),

    (_call_ids[2], _clinic_id, _pat_ids[2], '+1-555-100-0002', 'inbound', 'completed',
      now() - INTERVAL '2 days' + TIME '14:30', now() - INTERVAL '2 days' + TIME '14:38', 480,
      '[{"role":"assistant","content":"Good afternoon! This is Sarah. How can I help you today?"},{"role":"user","content":"Hi, I had a crown prep last week and I''m having some sensitivity. Is that normal?"},{"role":"assistant","content":"That''s very common after crown prep, James. Temperature sensitivity usually subsides within 1-2 weeks. I''d recommend sensitivity toothpaste and avoiding extreme temperatures. If it worsens, call us right away."},{"role":"user","content":"Okay, that''s reassuring. Thanks!"},{"role":"assistant","content":"Your permanent crown appointment is already scheduled. Take care!"}]'::JSONB,
      'James Wilson called about post-crown sensitivity. Reassured — normal within 1-2 weeks. No action needed.',
      'question_answered', 'room_demo_002'),

    (_call_ids[3], _clinic_id, NULL, '+1-555-200-9999', 'inbound', 'completed',
      now() - INTERVAL '2 days' + TIME '10:45', now() - INTERVAL '2 days' + TIME '10:51', 360,
      '[{"role":"assistant","content":"Good morning! This is Sarah. How can I help you today?"},{"role":"user","content":"Hi, I''m looking for a new dentist. Do you accept MetLife insurance?"},{"role":"assistant","content":"Yes, we accept MetLife! We''d love to have you. Our new patient visit includes a comprehensive exam, X-rays, and cleaning. Would you like to schedule?"},{"role":"user","content":"Yes, what''s available next week?"},{"role":"assistant","content":"I have openings on Monday at 10 AM or Thursday at 2 PM with Dr. Chen. Which works for you?"},{"role":"user","content":"Thursday at 2 sounds good."},{"role":"assistant","content":"Wonderful! I''ll get that booked for you. Welcome to the practice!"}]'::JSONB,
      'New patient inquiry. Has MetLife insurance. Booked new patient exam Thursday 2 PM with Dr. Chen.',
      'appointment_booked', 'room_demo_003'),

    (_call_ids[4], _clinic_id, _pat_ids[5], '+1-555-100-0005', 'inbound', 'completed',
      now() - INTERVAL '1 day' + TIME '16:20', now() - INTERVAL '1 day' + TIME '16:26', 360,
      '[{"role":"assistant","content":"Good afternoon! This is Sarah. How may I help you?"},{"role":"user","content":"Hi, I wanted to ask about payment options. I don''t have insurance."},{"role":"assistant","content":"Of course! We offer interest-free payment plans that split costs into 3-6 monthly installments. Would you like to schedule a consultation to discuss your options?"},{"role":"user","content":"Yes, that would be great."},{"role":"assistant","content":"I''ll schedule a consultation for you. Our team will go over all the details."}]'::JSONB,
      'Emily Tran called about payment options. No insurance, self-pay. Interested in payment plans. Consultation scheduled.',
      'appointment_requested', 'room_demo_004'),

    (_call_ids[5], _clinic_id, _pat_ids[4], '+1-555-100-0004', 'inbound', 'completed',
      now() - INTERVAL '1 day' + TIME '08:30', now() - INTERVAL '1 day' + TIME '08:33', 180,
      '[{"role":"assistant","content":"Good morning! This is Sarah. How can I help you?"},{"role":"user","content":"I need to reschedule my root canal. Something came up."},{"role":"assistant","content":"No problem, Robert. I can help with that. Do you have a preferred time next week?"},{"role":"user","content":"Morning works best."},{"role":"assistant","content":"I''ll find a morning slot for you with Dr. Chen and our team will confirm. Anything else?"},{"role":"user","content":"No, thanks."}]'::JSONB,
      'Robert Johnson called to reschedule root canal. Prefers mornings. Note: diabetic, needs antibiotic premedication.',
      'reschedule_requested', 'room_demo_005');

  -- ============================================================
  -- 6. BOOKING REQUESTS (2)
  -- ============================================================

  INSERT INTO booking_requests (clinic_id, call_id, patient_name, caller_phone, reason_for_visit, preferred_date, preferred_time, status) VALUES
    (_clinic_id, _call_ids[4], 'Emily Tran',     '+1-555-100-0005', 'Payment consultation', (_today + 3)::TEXT, 'Afternoon', 'new'),
    (_clinic_id, _call_ids[5], 'Robert Johnson',  '+1-555-100-0004', 'Root canal reschedule', (_today + 5)::TEXT, 'Morning',   'new');

END;
$$;
