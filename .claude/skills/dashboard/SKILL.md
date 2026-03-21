---
name: Dashboard
description: Build and refine the admin dashboard — migrate inline styles to Tailwind, replace mock data with Supabase queries, build KPI widgets, patient management, call logs, campaigns, and insurance views.
---

# Dashboard & UI

## Overview

Build and refine the admin dashboard for dental clinic staff. Migrate existing demo pages from hardcoded mock data to real Supabase queries, build KPI widgets, and ensure all UI follows the design system with Tailwind classes (not inline styles).

## Key Files

### Existing Pages to Migrate
- `src/app/page.tsx` — dashboard home (KPIs + widgets)
- `src/app/calls/page.tsx` — call logs and transcripts
- `src/app/patients/page.tsx` — patient directory
- `src/app/campaigns/page.tsx` — campaign management
- `src/app/insurance-verification/page.tsx` — insurance lookup

### Existing Components to Refactor
- `src/components/LiveCallMonitoringWidget.tsx` — inline styles → Tailwind
- `src/components/LeadResponseSimulation.tsx` — inline styles → Tailwind
- `src/components/SmsHandoffWidget.tsx` — inline styles → Tailwind
- `src/components/GlobalSearch.tsx` — inline styles → Tailwind
- `src/components/ui/InsuranceVerificationResultCard.tsx` — inline styles → Tailwind

### New Feature Modules
- `src/features/dashboard/` — KPI cards, activity feed, overview widgets
- `src/features/patients/` — patient list, detail view, search
- `src/features/calls/` — call log, transcript viewer, live monitoring
- `src/features/campaigns/` — campaign list, creation, detail view
- `src/features/insurance/` — verification form, result display, history

## Migration Priority

1. **Phase 1 — Style Migration**: Convert all inline `style={{}}` to Tailwind classes. No functionality changes.
2. **Phase 2 — Data Layer**: Replace mock data with Supabase queries. Server components for initial data, client components for interactivity.
3. **Phase 3 — New Features**: Build missing pages (appointments, team, reports).

### Style Migration Pattern

Before:
```tsx
<div style={{ padding: '24px', backgroundColor: '#F7FAFC', borderRadius: '16px' }}>
```

After:
```tsx
<div className="p-6 bg-neutral-50 rounded-lg">
```

### Data Migration Pattern

Before (mock data):
```tsx
const patients = [
  { id: 1, name: "John Doe", ... },
];
```

After (Supabase query):
```tsx
import { createClient } from "@/lib/supabase/server";

export default async function PatientsPage() {
  const supabase = await createClient();
  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  return <PatientList patients={patients ?? []} />;
}
```

## Dashboard Layout

```
src/app/(dashboard)/
├── layout.tsx          # Sidebar + top bar + main content area
├── page.tsx            # Dashboard home (KPIs)
├── calls/page.tsx
├── patients/page.tsx
├── campaigns/page.tsx
└── ...
```

## KPI Cards

Dashboard home shows 4 key metrics:
1. **Calls Handled Today** — count from `calls` table where `created_at` is today
2. **Appointments Booked** — count from `appointments` where `created_at` is this week
3. **Revenue Recovered** — sum of `payment_collected` from `calls` this month
4. **Insurance Verifications** — count of successful verifications today

## Acceptance Criteria

- [ ] All existing components use Tailwind classes (zero inline styles)
- [ ] Dashboard home shows real KPI data from Supabase
- [ ] Patient list loads from database with search/filter
- [ ] Call log shows real call history with transcripts
- [ ] Campaign list shows real campaigns with status
- [ ] All pages follow `design_system.md` exactly
- [ ] Mobile responsive
- [ ] Loading states for async data
- [ ] Error states when queries fail

## References

- `design_system.md` — all visual tokens
- `src/lib/supabase/server.ts` — server-side Supabase client
- `src/lib/supabase/client.ts` — browser-side Supabase client
