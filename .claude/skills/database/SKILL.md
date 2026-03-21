---
name: Database
description: Design and implement the Supabase database schema — tables (clinics, patients, appointments, calls, campaigns), migrations, RLS policies, seed data, and TypeScript type generation.
---

# Database

## Overview

Design and implement the Supabase database schema for FeltSense Clinic. Multi-tenant (clinic-scoped), with tables for clinics, patients, appointments, calls, campaigns, and insurance verifications. Includes migrations, RLS policies, seed data, and TypeScript type generation.

## Key Files

- `supabase/migrations/` — SQL migration files (ordered by timestamp)
- `supabase/seed.sql` — seed data for local development
- `supabase/config.toml` — local Supabase configuration
- `src/core/types/database.types.ts` — auto-generated TypeScript types
- `src/lib/supabase/` — client setup (already exists)

## Schema Overview

```
clinics (tenant)
├── clinic_members (users ↔ clinics, roles)
├── patients
│   ├── appointments
│   └── insurance_verifications
├── calls
│   └── call_transcripts
├── campaigns
│   └── campaign_calls
└── leads
```

## Core Tables

### Clinics (Multi-Tenant Root)

```sql
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
```

### Clinic Members

```sql
CREATE TYPE clinic_role AS ENUM ('owner', 'admin', 'dentist', 'hygienist', 'receptionist', 'staff');

CREATE TABLE clinic_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role clinic_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(clinic_id, user_id)
);
```

### Patients

```sql
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
```

### Appointments

```sql
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'no_show', 'cancelled');

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
```

### Calls

```sql
CREATE TYPE call_type AS ENUM ('inbound', 'outbound');
CREATE TYPE call_status AS ENUM ('pending', 'ringing', 'in_progress', 'completed', 'failed', 'missed');

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
```

### Campaigns

```sql
CREATE TYPE campaign_type AS ENUM ('recall', 'debt_collection', 'followup', 'lead_response');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');

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
```

## RLS Pattern

Every table with `clinic_id`:

```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_isolation" ON patients
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = patients.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );
```

## Indexes

```sql
CREATE INDEX idx_patients_clinic_id ON patients(clinic_id);
CREATE INDEX idx_appointments_clinic_id ON appointments(clinic_id);
CREATE INDEX idx_calls_clinic_id ON calls(clinic_id);
CREATE INDEX idx_campaigns_clinic_id ON campaigns(clinic_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_calls_created_at ON calls(created_at);
CREATE INDEX idx_patients_phone ON patients(phone);
```

## Migration Workflow

```bash
bun run db:migrate          # npx supabase migration new <name>
bun run db:reset            # Reset local DB (re-runs migrations + seed)
bun run db:gen-types        # Generate TypeScript types → src/core/types/database.types.ts
bun run db:start            # Start local Supabase
npx supabase db push        # Push migrations to remote
```

## Seed Data

Create `supabase/seed.sql` with:
- 1 clinic ("Bright Smile Dental")
- 1 owner user
- 12 patients with varied demographics
- 20 appointments across the next 2 weeks
- 10 historical calls with transcripts
- 2 active campaigns (recall + lead follow-up)

## Acceptance Criteria

- [ ] All migrations run cleanly with `bun run db:reset`
- [ ] RLS policies prevent cross-clinic data access
- [ ] Seed data populates a realistic demo environment
- [ ] TypeScript types generated and importable as `@/core/types/database.types`
- [ ] All foreign keys and constraints are in place
- [ ] Indexes on all `clinic_id` columns and common query columns
