# FeltSense Clinic

Smart AI receptionist for dental practices. Handles inbound calls, books appointments, answers patient questions, and logs everything — around the clock.

**YC W26 | $1M Pre-Seed**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4 |
| Database | Supabase (Postgres + Auth + Realtime) |
| Voice Agent | LiveKit Agents 1.4 (Python) |
| STT | Deepgram Nova 3 |
| LLM | Claude Sonnet (Anthropic) |
| TTS | ElevenLabs Turbo v2.5 |
| Package Manager | Bun (frontend), uv (Python agent) |

## Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Python](https://python.org/) 3.12+
- [uv](https://docs.astral.sh/uv/) (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- [Docker](https://docker.com/) (for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`bunx supabase --version` to verify)

### API Keys Needed

| Service | Env Var | Get it at |
|---------|---------|-----------|
| Supabase | Auto-generated locally | `bun run db:start` |
| LiveKit Cloud | `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `LIVEKIT_URL` | [livekit.io/cloud](https://livekit.io/cloud) |
| Deepgram | `DEEPGRAM_API_KEY` | [console.deepgram.com](https://console.deepgram.com/) |
| ElevenLabs | `ELEVENLABS_API_KEY` | [elevenlabs.io](https://elevenlabs.io/) |
| Anthropic | `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com/) |

## Quick Start

### 1. Install dependencies

```bash
# Frontend
bun install

# Python agent
cd agent && uv sync && cd ..
```

### 2. Set up environment variables

```bash
# Frontend — copies Supabase keys from local instance
cp .env.example .env.local
# Then fill in LIVEKIT_* values

# Agent
cp agent/.env.example agent/.env
# Fill in all API keys
```

### 3. Start local Supabase

```bash
bun run db:start    # Starts Postgres, Auth, Studio (Docker)
bun run db:reset    # Runs migrations + seed data
```

Supabase Studio will be at [http://127.0.0.1:58333](http://127.0.0.1:58333).

### 4. Run the app (3 terminals)

**Terminal 1 — Next.js frontend:**
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000).

**Terminal 2 — Python voice agent:**
```bash
cd agent
uv run python agent.py dev
```

**Terminal 3 (optional) — Supabase logs:**
```bash
bun run db:start  # already running, just keep this terminal open
```

## Project Structure

```
├── agent/                    # Python voice agent (LiveKit)
│   ├── agent.py              # Main entrypoint — AgentServer + AgentSession
│   ├── prompts.py            # "Sarah" dental receptionist persona
│   ├── knowledge.py          # Hardcoded FAQ (hours, services, insurance)
│   ├── db.py                 # Supabase call logging helpers
│   └── pyproject.toml        # Python dependencies (uv managed)
├── supabase/                 # Database
│   ├── migrations/           # SQL migrations
│   ├── seed.sql              # Demo data (Bright Smile Dental)
│   └── config.toml           # Local Supabase config (ports, auth)
├── src/
│   ├── app/
│   │   ├── (marketing)/      # Landing page at /
│   │   ├── (dashboard)/      # Dashboard at /dashboard/*
│   │   └── api/              # API routes (livekit-token, booking-request)
│   ├── features/             # Feature modules
│   │   ├── voice-agent/      # LiveKit frontend (VoiceAgent, AgentVisualizer)
│   │   ├── dashboard/        # Sidebar, TopBar, KPIs
│   │   ├── calls/            # Call logs table
│   │   └── landing-page/     # Marketing site sections
│   ├── components/ui/        # Design system primitives
│   ├── core/types/           # TypeScript types (database.types.ts)
│   └── lib/supabase/         # Supabase client setup
└── design_system.md          # Visual design tokens
```

## Available Scripts

### Frontend (Bun)

| Command | Description |
|---------|-------------|
| `bun dev` | Start Next.js dev server (port 3000) |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |
| `bun run db:start` | Start local Supabase |
| `bun run db:stop` | Stop local Supabase |
| `bun run db:reset` | Reset DB (re-run migrations + seed) |
| `bun run db:migrate` | Run pending migrations |
| `bun run db:gen-types` | Regenerate TypeScript types from schema |

### Python Agent (uv)

| Command | Description |
|---------|-------------|
| `uv run python agent.py dev` | Development mode (auto-reload + web playground) |
| `uv run python agent.py console` | Terminal interaction (no browser needed) |
| `uv run python agent.py start` | Production mode |

## Deployment

The app deploys as three services:

| Component | Platform | What it runs |
|-----------|----------|-------------|
| Next.js frontend + API routes | **Vercel** | Landing page, dashboard, auth, token generation |
| Python voice agent | **LiveKit Cloud** | Managed agent hosting (Dockerfile-based) |
| Database | **Supabase Cloud** | Postgres, auth, realtime subscriptions |

### 1. Supabase Cloud

Create a project at [supabase.com](https://supabase.com), then push your local schema:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

### 2. LiveKit Cloud (Python agent)

Install the [LiveKit CLI](https://docs.livekit.io/intro/basics/cli/), then deploy:

```bash
cd agent

# Authenticate with your LiveKit Cloud project
lk cloud auth

# First-time deploy — builds Dockerfile, uploads, and starts the agent
lk agent create --secrets-file=.env
```

LiveKit Cloud auto-injects `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET`. Your `.env` only needs the external API keys (Deepgram, ElevenLabs, Anthropic, Supabase).

Subsequent deploys:
```bash
lk agent deploy                     # Push new code
lk agent update-secrets --secrets-file=.env  # Update secrets
lk agent status                     # Check health
lk agent logs                       # Stream logs
```

### 3. Vercel (Next.js frontend)

1. Push repo to GitHub
2. Import at [vercel.com](https://vercel.com) — auto-detects Next.js
3. Set **Install Command** to `bun install`
4. Add environment variables (see `.env.production.example`):

| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase dashboard |
| `NEXT_PUBLIC_LIVEKIT_URL` | LiveKit Cloud dashboard |
| `LIVEKIT_API_KEY` | LiveKit Cloud dashboard |
| `LIVEKIT_API_SECRET` | LiveKit Cloud dashboard |

5. After deploy, update the agent's webhook URL:
```bash
lk agent update-secrets --secrets "BOOKING_WEBHOOK_URL=https://your-app.vercel.app/api/booking-request"
```

## Architecture

```
Browser (Next.js)                 LiveKit Cloud                  Agent (Python)
┌──────────────────┐             ┌──────────────┐              ┌──────────────────┐
│ VoiceAgent       │  WebRTC    │              │   WebRTC     │ AgentSession      │
│ component        │◄──────────►│  LiveKit SFU │◄────────────►│  Deepgram STT     │
│                  │            │              │              │  Claude LLM       │
└──────────────────┘            └──────────────┘              │  ElevenLabs TTS   │
        │                                                      └────────┬─────────┘
        │ POST /api/livekit-token                                       │
        └───────────────────────────────────────────────────┐          │
                                                             │          │
                                                    ┌────────▼──────────▼──┐
                                                    │     Supabase         │
                                                    │  (Postgres + Auth)   │
                                                    └──────────────────────┘
```

## License

Proprietary — FeltSense, Inc.

YyY