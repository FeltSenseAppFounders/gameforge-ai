# GameForge AI

AI-powered game creation platform. Describe a game to MAX — get a playable browser game in seconds. Iterate via chat. Share with the community.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + React 19 + TypeScript 5 |
| AI | Claude API via `@anthropic-ai/sdk` (streaming) |
| Game Engine | Phaser.js 3 (CDN, self-contained HTML) |
| Game Rendering | `<iframe sandbox="allow-scripts" srcdoc={code} />` |
| Database | Supabase (auth + Postgres) |
| Styling | Tailwind CSS 4 |
| Runtime | Bun |

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

# Start local Supabase
bunx supabase start

# Run database migrations
bunx supabase db push

# Start dev server
bun dev
```

## Environment Variables

```
ANTHROPIC_API_KEY=          # Claude API key for game generation
NEXT_PUBLIC_SUPABASE_URL=   # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=  # Supabase service role (for demo creation)
```

## Project Structure

```
src/
├── app/
│   ├── (marketing)/        # Landing page
│   ├── (dashboard)/        # Dashboard (create, games, community)
│   ├── (auth)/             # Login/signup
│   └── api/
│       ├── chat/           # Claude API streaming endpoint
│       └── demo/create/    # Demo studio creation
├── features/
│   ├── landing-page/       # Marketing site sections
│   ├── dashboard/          # Sidebar, TopBar
│   ├── game-creator/       # ChatPanel + GamePreview (core)
│   ├── games/              # My Games grid
│   └── community/          # Community gallery
├── core/types/             # TypeScript types
└── lib/
    ├── supabase/           # Supabase clients
    └── prompts/            # Claude system prompts
```

## Design System

GTA-inspired aesthetic: Pricedown font (ALL CAPS headings), neon green glows, angular radii, dark surfaces. See `design_system.md` for full documentation.

## Deployment

| Component | Platform |
|-----------|----------|
| Next.js frontend + API | Vercel |
| Database + Auth | Supabase Cloud |
