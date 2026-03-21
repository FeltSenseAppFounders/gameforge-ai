---
name: Supabase
description: Supabase conventions — client setup (browser/server/middleware), auth flows, RLS policies, database queries, realtime subscriptions, migrations CLI, and TypeScript type generation.
---

# Supabase

## Overview

Conventions for using Supabase in this project. Covers the existing client setup, auth flows, database queries (server vs client), RLS policies, realtime subscriptions, migrations, and type generation.

## Existing Setup

Already configured and working:

- `src/lib/supabase/client.ts` — browser client using `createBrowserClient`
- `src/lib/supabase/server.ts` — server client using `createServerClient` with cookies
- `src/lib/supabase/middleware.ts` — session refresh via `getUser()`
- `supabase/config.toml` — local DB on port 58332, PostgreSQL v17

## Server Components (default)

```tsx
import { createClient } from "@/lib/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("id, first_name, last_name, phone")
    .order("created_at", { ascending: false });
}
```

## Client Components

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

export function PatientSearch() {
  const supabase = createClient();
  // Use in useEffect, event handlers, etc.
}
```

## Key Security Rule

**Never use `getSession()` on the server** — it reads from cookies which can be tampered. Always use `getUser()` which validates the JWT:

```tsx
// Correct
const { data: { user } } = await supabase.auth.getUser();

// Wrong (insecure on server)
const { data: { session } } = await supabase.auth.getSession();
```

## Query Patterns

### Select with Joins

```tsx
const { data } = await supabase
  .from("patients")
  .select(`
    id, first_name, last_name, phone,
    appointments (id, start_time, status, appointment_type)
  `)
  .eq("clinic_id", clinicId)
  .order("created_at", { ascending: false });
```

### Insert

```tsx
const { data, error } = await supabase
  .from("patients")
  .insert({ clinic_id: clinicId, first_name: "Jane", last_name: "Doe", phone: "+1234567890" })
  .select()
  .single();
```

### Update

```tsx
const { data, error } = await supabase
  .from("appointments")
  .update({ status: "confirmed" })
  .eq("id", appointmentId)
  .select()
  .single();
```

### Filters

```tsx
.ilike("first_name", `%${query}%`)
.eq("clinic_id", clinicId)
.gte("start_time", today)
.lt("start_time", tomorrow)
.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,phone.ilike.%${q}%`)
```

## Auth Flows

### Sign Up

```tsx
const { data, error } = await supabase.auth.signUp({
  email: "doctor@clinic.com",
  password: "securePassword123",
  options: {
    data: { full_name: "Dr. Smith", role: "owner" },
  },
});
```

### Protected Route Helper

```tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  return user;
}
```

## RLS Pattern

Every table with `clinic_id`:

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_isolation" ON <table>
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM clinic_members
      WHERE clinic_members.clinic_id = <table>.clinic_id
      AND clinic_members.user_id = auth.uid()
    )
  );
```

Always index `clinic_id` for RLS performance.

## Realtime Subscriptions

```tsx
"use client";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function LiveCalls({ clinicId }: { clinicId: string }) {
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`clinic:${clinicId}:calls`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "calls",
          filter: `clinic_id=eq.${clinicId}`,
        },
        (payload) => {
          console.log("Change:", payload);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [clinicId, supabase]);
}
```

## Migrations

```bash
bun run db:start                          # Start local Supabase
npx supabase migration new <name>         # Create migration
bun run db:reset                          # Reset & re-run migrations + seed
bun run db:gen-types                      # Generate TypeScript types
npx supabase db push                      # Push to remote
npx supabase db diff --schema public      # See diff
```

## Type Generation

```bash
bun run db:gen-types
# → npx supabase gen types typescript --local > src/core/types/database.types.ts
```

```tsx
import { Database } from "@/core/types/database.types";

type Patient = Database["public"]["Tables"]["patients"]["Row"];
type PatientInsert = Database["public"]["Tables"]["patients"]["Insert"];
```

## References

- `src/lib/supabase/client.ts` — browser client
- `src/lib/supabase/server.ts` — server client
- `src/lib/supabase/middleware.ts` — session middleware
- `supabase/config.toml` — local configuration
- [Supabase + Next.js Docs](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
