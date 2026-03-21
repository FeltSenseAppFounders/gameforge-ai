# FeltSense Clinic — AI Reception Platform

## Memory

Claude Code maintains persistent memory for this project at `/home/santiago-garcia/.claude/projects/-home-santiago-garcia-Documents-FeltSense/memory`:
- `MEMORY.md` — project state, what's been built, known issues, and lessons learned
- `epic1-plan.md` — EPIC 1 implementation plan and task tracker (complete)
- `epic2-plan.md` — EPIC 2 implementation plan — self-serve demo + real scheduling (complete)
- `epic3-plan.md` — EPIC 3 implementation plan — manual scheduling & patient forms (planned)

When learning something important, update the memory file so it persists across sessions.

---

## Skills

Read the relevant skill file in `.claude/skills/` before starting work on any area:

### Product Skills (what to build)
| Skill | File | Scope |
|-------|------|-------|
| **Landing Page** | `.claude/skills/landing-page/SKILL.md` | Marketing site — hero, features, pricing, FAQ |
| **Voice Agent** | `.claude/skills/voice-agent/SKILL.md` | LiveKit agent — Python backend, WebRTC frontend, STT/LLM/TTS |
| **Dashboard** | `.claude/skills/dashboard/SKILL.md` | Admin UI — calls, patients, campaigns, KPIs, style migration |
| **Database** | `.claude/skills/database/SKILL.md` | Supabase schema, migrations, RLS, seed data, types |

### Technology Skills (how to build)
| Skill | File | Scope |
|-------|------|-------|
| **Next.js** | `.claude/skills/nextjs/SKILL.md` | App Router, server/client components, layouts, API routes, metadata |
| **LiveKit** | `.claude/skills/livekit/SKILL.md` | `livekit-agents` SDK, `@livekit/components-react`, tokens, deployment |
| **Supabase** | `.claude/skills/supabase/SKILL.md` | Auth, queries, RLS policies, realtime, migrations, type generation |

---

## Product Overview

**FeltSense Clinic** is a Y Combinator-backed (Winter 2026) AI booking system and virtual front desk for dental practices. $1M pre-seed raised. It acts as an autonomous, always-on AI receptionist that plugs front-desk revenue leaks.

**Core value proposition:** Replace missed calls, slow follow-ups, and manual insurance checks with an AI agent that handles everything — from the first ring to payment collection.

---

## Core Epics

### Epic 1: Low-Latency Conversational Voice Agent `✅ COMPLETE`
**Full plan:** `.claude/memory/epic1-plan.md` | **Phase 1 MVP — 18 tasks across 6 phases**

**MVP scope (Phase 1):**
- Inbound voice agent (Deepgram STT → Claude LLM → ElevenLabs TTS via LiveKit WebRTC)
- Dental receptionist persona "Sarah" with hardcoded FAQs
- Full call logging to Supabase (transcript, duration, AI summary)
- Manual calendar handoff (booking request notifications)
- Dashboard wiring (sidebar, calls page, KPIs with real data)
- Real-time call monitoring via Supabase Realtime

**Deferred to later phases:**
- Outbound lead calling (webhook + auto-dial within 10s)
- Recall & debt collection campaigns (batched outbound)
- Omnichannel handoff (SMS/email mid-conversation via Twilio/SendGrid)
- Patient recognition (caller ID lookup)
- Spanish language support

### Epic 2: Self-Serve Demo with Real Scheduling + Guided Tour `✅ COMPLETE`
**Full plan:** `epic2-plan.md` in memory | **24 tasks across 6 phases (A-F)**

**Scope (lead collection demo, not SaaS):**
- "Try it now" → instant demo clinic creation + auto-login (no email verification)
- Voice agent Sarah can **check real availability and book real appointments** (via `@function_tool`)
- Providers + availability schema, `get_available_slots` RPC, `seed_demo_clinic` function
- Dashboard wiring with real Supabase data (appointments, patients, voice widget)
- **Intro.js guided tour** on first visit — showcases product capabilities
- Remove hardcoded `CLINIC_ID` — multi-tenant via dispatch metadata
- Lead capture in `leads` table for business validation

### Epic 3: Manual Appointment Scheduling & Patient Management Forms `⬜ PLANNED`
**Full plan:** `epic3-plan.md` in memory | **33 tasks across 5 phases (A-E)**

**Scope (dashboard forms — super easy to use):**
- **UI Primitives:** Button, Input, Select, Textarea, Badge, Modal, DatePicker in `src/components/ui/`
- **Patient Forms:** Add patient, edit patient, validation, server actions, appointment history in detail panel
- **Appointment Scheduling:** Patient search combobox, slot picker grid (uses `get_available_slots` RPC), booking form with double-booking prevention
- **Row Actions:** Status dropdown (scheduled→confirmed→completed/cancelled), cancel confirmation modal
- **Polish:** Toast notifications, loading states, enhanced empty states

### Epic 4: PMS & CRM Integration (was Epic 3)
- **Two-way calendar sync**: Real-time read/write to Dentrix, OpenDental, Eaglesoft via REST APIs — prevents double-booking
- **Context injection**: Query caller ID against patient DB pre-connection, inject history into LLM system prompt

### Epic 5: Real-Time Financials & Insurance (was Epic 4)
- **Live verification**: Clearinghouse API integration to verify coverage/copays instantly during the call
- **Voice-auth payments**: PCI-compliant secure payment capture over the phone for deposits and outstanding balances

---

## Technical Architecture (MVP)

### Voice Agent Stack: LiveKit Agents

| Layer | Technology |
|-------|-----------|
| **Transport** | LiveKit WebRTC (browser-only, no Twilio/SIP) — agent joins as a WebRTC participant |
| **Agent Backend** | Python `livekit-agents` SDK with `VoicePipelineAgent` |
| **STT** | Deepgram (fast, accurate for medical/dental terminology) |
| **LLM** | Claude Sonnet via Anthropic plugin (dental receptionist brain) |
| **TTS** | ElevenLabs (natural-sounding, bilingual English/Spanish) |
| **Hosting** | LiveKit Cloud ($0.01/min) for MVP — self-host later if needed |
| **Frontend** | `@livekit/components-react` integrated into this Next.js app |
| **Database** | Supabase (auth + Postgres for everything — patients, calls, campaigns, transcripts) |

**Target latency:** Sub-500ms conversational response time.

> **MVP scope:** No SIP/telephony infrastructure. No AWS services (EKS, Lambda, DynamoDB, KMS). No HIPAA/security hardening yet. Ship first, harden later.

---

## Target Market & Localization

- **Primary users:** US dental clinic owners and office managers
- **End users:** Patients booking appointments, checking coverage, paying bills
- **Localization:** Must support native-level Spanish voice models and flexible regional payment gateways (Latin America)

---

## Phased Roadmap

### Phase 1 — MVP `✅ COMPLETE`
- Basic inbound voice agent with hardcoded FAQs
- Manual calendar handoff (booking request notifications)
- Full conversational logging
- Dashboard with real data (sidebar, calls page, KPIs)

### Phase 2 — Self-Serve Demo + Guided Tour `✅ COMPLETE`
- "Try it now" → instant demo clinic + auto-login (lead capture)
- Real appointment scheduling via agent tools
- Multi-tenant clinic isolation (remove hardcoded CLINIC_ID)
- Dashboard wiring with real Supabase data
- Intro.js guided tour showcasing product capabilities

### Phase 3 — Manual Scheduling & Patient Forms `⬜ PLANNED`
- UI primitive component library (Button, Input, Select, Modal, DatePicker, etc.)
- Patient add/edit forms with validation and server actions
- Appointment scheduling form with slot picker and double-booking prevention
- Appointment status management (confirm, complete, cancel)
- Toast notifications, loading states, enhanced empty states

### Phase 4 — PMS Integration
- Two-way API integration for direct calendar booking (Dentrix, OpenDental, Eaglesoft)
- 10-second outbound lead response workflow

### Phase 5 — Financials & Localization
- Payment collection gateways
- Real-time insurance API integration
- Full Spanish language support

---

## Landing Page (Marketing Site)

A modern SaaS landing page (Linear/Vercel-inspired) to sell FeltSense Clinic. Built within this Next.js app.

**Sections:**
1. **Hero** — Bold headline, subheadline about revenue recovery, "Book a Demo" CTA, product screenshot/animation
2. **Social Proof** — YC W26 badge, "$1M pre-seed", customer logos / "Trusted by X practices"
3. **Features Grid** — Voice AI Agent, PMS Integration, Insurance & Payments as feature cards
4. **How It Works** — 3-step visual flow (Connect PMS → AI handles calls → Revenue grows)
5. **Stats/Metrics** — Animated counters (calls handled, revenue recovered, hours saved)
6. **Testimonials** — Quote cards from dental practice owners (placeholder initially)
7. **Pricing** — Tier cards (Starter, Growth, Enterprise) or "Book a Demo" CTA
8. **FAQ** — Accordion for common objections (HIPAA, accuracy, setup time)
9. **Footer CTA** — Final conversion section + footer links

**Technical:** Server-rendered, mobile-responsive, Framer Motion for scroll animations, proper meta/OG/SEO tags.

---

## Tech Stack & Conventions

- **Frontend:** Next.js 16 + React 19 + TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS 4 (PostCSS plugin)
- **Database:** Supabase (auth + Postgres)
- **Voice Agent:** LiveKit Agents (Python backend) + `@livekit/components-react` (frontend)
- **STT/TTS:** Deepgram + ElevenLabs
- **LLM:** Claude Sonnet via Anthropic
- **Runtime:** Bun (frontend), Python (agent backend)
- **Path alias:** `@/*` → `./src/*`

---

## Project Structure

```
├── .claude/
│   ├── skills/                 # Claude Code Agent Skills (SKILL.md format)
│   └── memory/                 # Persistent project memory
│       ├── MEMORY.md           # Project state and known issues
│       └── epic1-plan.md       # EPIC 1 implementation plan + task tracker
├── agent/                      # Python LiveKit agent backend
│   ├── agent.py                # VoicePipelineAgent entry point
│   ├── prompts.py              # Dental receptionist system prompt
│   ├── knowledge.py            # FAQ knowledge base (hardcoded for MVP)
│   ├── db.py                   # Supabase call logging helpers
│   ├── notifications.py        # Booking request HTTP client
│   ├── pyproject.toml          # Python dependencies (uv managed)
│   ├── Dockerfile              # Multi-stage build for LiveKit Cloud deployment
│   └── .dockerignore           # Excludes .venv, __pycache__, .env from builds
├── supabase/                   # Database config and migrations
│   ├── migrations/             # SQL migration files
│   ├── seed.sql                # Development seed data
│   └── config.toml             # Local Supabase config
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Landing page at /
│   │   ├── (dashboard)/        # Dashboard at /dashboard, all admin pages
│   │   └── api/                # API routes
│   │       ├── livekit-token/  # LiveKit JWT generation
│   │       └── booking-request/# Booking notification endpoint
│   ├── components/             # Shared React components
│   │   └── ui/                 # Design-system-level primitives
│   ├── features/               # Feature modules
│   │   ├── landing-page/       # Marketing site sections (complete)
│   │   ├── voice-agent/        # LiveKit frontend integration
│   │   ├── dashboard/          # Sidebar, TopBar, KPI cards
│   │   ├── calls/              # Call logs, transcripts, realtime monitoring
│   │   ├── patients/           # Patient management
│   │   ├── campaigns/          # Campaign management
│   │   └── insurance/          # Insurance verification
│   ├── core/
│   │   ├── constants/          # App-wide constants and enums
│   │   └── types/              # Shared TypeScript types + database.types.ts
│   └── lib/
│       └── supabase/           # Supabase clients (browser, server, middleware)
└── design_system.md            # Visual design tokens (read before any UI work)
```

---

## Deployment

Three services, all managed:

| Component | Platform | Config |
|-----------|----------|--------|
| Next.js frontend + API routes | **Vercel** | Auto-detected from repo, env vars in dashboard |
| Python voice agent | **LiveKit Cloud** | `agent/Dockerfile`, secrets via `lk agent update-secrets` |
| Database + Auth | **Supabase Cloud** | Migrations via `npx supabase db push` |

**Key files:**
- `agent/Dockerfile` — multi-stage build (uv + python3.12-slim-bookworm)
- `agent/.dockerignore` — excludes .venv, .env, __pycache__
- `.env.production.example` — documents all required production env vars

**Agent deploy commands:**
```bash
cd agent
lk cloud auth                           # First-time auth
lk agent create --secrets-file=.env     # First deploy
lk agent deploy                          # Subsequent deploys
lk agent update-secrets --secrets K=V   # Update secrets
lk agent status / lk agent logs          # Monitor
```

**LiveKit Cloud auto-injects** `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` — do not set these manually in agent secrets.

---

## Development Rules

1. **Design system first**: Always read `design_system.md` before any UI work. Use ONLY design system tokens (colors, spacing, typography, shadows, border radii).
2. **Tailwind classes, NOT inline styles**: All styling must use Tailwind utility classes. No `style={{}}` objects.
3. **TypeScript strict**: No `any` types. Proper interfaces/types for all data structures.
4. **No mock data in production components**: Use Supabase queries or API routes for real data. Mock data is only acceptable in clearly labeled demo/placeholder pages.
5. **Feature-module pattern**: New features go in `src/features/<feature-name>/` with their own components, hooks, types, and utils.
6. **Composable components**: Build small, reusable components. Follow the existing `src/components/ui/` pattern for design-system primitives.
7. **Server components by default**: Only add `"use client"` when the component needs interactivity (state, effects, event handlers).
8. **Accessibility**: All interactive elements need proper labels, ARIA attributes, and minimum 44px touch targets.
