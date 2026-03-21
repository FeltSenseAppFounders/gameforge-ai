---
name: Next.js
description: Next.js 16 + React 19 conventions — App Router, server vs client components, route groups, layouts, API routes, middleware, metadata/SEO, and @/* path alias.
---

# Next.js 16 + React 19

## Overview

Conventions and patterns for building with Next.js 16 App Router and React 19 in this project.

## Project Config

- **Next.js 16.1.6** with App Router (no Pages Router)
- **React 19.2.3** with Server Components by default
- **TypeScript 5** in strict mode
- **Path alias:** `@/*` maps to `./src/*` (in `tsconfig.json`)

## Server Components (Default)

Every component is a server component unless it has `"use client"`. Use for:
- Data fetching (Supabase queries)
- Pages that don't need interactivity
- SEO-critical content
- Layout shells

```tsx
// src/app/patients/page.tsx — server component (no directive needed)
import { createClient } from "@/lib/supabase/server";

export default async function PatientsPage() {
  const supabase = await createClient();
  const { data: patients } = await supabase.from("patients").select("*");
  return <PatientList patients={patients ?? []} />;
}
```

## Client Components

Add `"use client"` only when the component needs:
- `useState`, `useEffect`, `useRef`
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `navigator`)
- Third-party client libraries (LiveKit, Framer Motion)

```tsx
"use client";
import { useState } from "react";

export function PatientSearch() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

## Route Groups

Use `(groupName)` folders to share layouts without affecting the URL:

```
src/app/
├── (marketing)/        # Landing page layout (no sidebar)
│   ├── layout.tsx
│   └── page.tsx        # → /
├── (dashboard)/        # Dashboard layout (sidebar + auth)
│   ├── layout.tsx
│   └── patients/
│       └── page.tsx    # → /patients
```

## Layouts

```tsx
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

## API Routes

```tsx
// src/app/api/example/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true });
}
```

## Middleware

`src/middleware.ts` handles Supabase session refresh:

```tsx
import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
```

## Metadata & SEO

```tsx
export const metadata = {
  title: "Patients — FeltSense Clinic",
  description: "Manage your dental practice patients",
};

// Dynamic metadata
export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: `Patient ${params.id}` };
}
```

## Loading & Error States

```tsx
// src/app/patients/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading patients...</div>;
}

// src/app/patients/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

## Import Conventions

Always use the `@/` path alias:

```tsx
import { createClient } from "@/lib/supabase/server";
import { PatientCard } from "@/features/patients/PatientCard";
```

## File Naming

- **Pages:** `page.tsx`
- **Layouts:** `layout.tsx`
- **Components:** PascalCase (`PatientCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`usePatients.ts`)
- **Utils:** camelCase (`formatDate.ts`)
- **Types:** PascalCase or grouped in `types/`
