# GameForge AI — AI-Powered Game Creation Platform

## Product Overview

**GameForge AI** is an AI-powered platform where users **chat with MAX** to create **real, playable browser games**. MAX uses the Claude API to generate Phaser.js game code that runs live in an iframe. Visual aesthetic: **Grand Theft Auto** (Pricedown font, neon glows, dark surfaces, angular UI).

**Core value proposition:** Type a description → get a playable game in seconds. Iterate via chat. Share with the community.

---

## Technical Architecture

**Chat → Claude API → Phaser.js code → iframe preview**

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 + React 19 + TypeScript 5 |
| **AI** | Claude API via `@anthropic-ai/sdk` (streaming) |
| **Game Engine** | Phaser.js 3 (CDN, self-contained HTML) |
| **Game Rendering** | `<iframe sandbox="allow-scripts" srcdoc={code} />` |
| **Database** | Supabase (auth + Postgres — studios, game_projects, chat_sessions) |
| **Styling** | Tailwind CSS 4 (PostCSS plugin) |
| **Runtime** | Bun |
| **Path alias** | `@/*` → `./src/*` |

---

## Project Structure

```
├── .claude/skills/           # Claude Code Agent Skills
├── supabase/                 # Database config and migrations
│   ├── migrations/           # SQL migration files
│   ├── seed.sql              # Development seed data
│   └── config.toml           # Local Supabase config
├── src/
│   ├── app/
│   │   ├── (marketing)/      # Landing page at /
│   │   ├── (dashboard)/      # Dashboard at /dashboard
│   │   └── api/              # API routes
│   │       ├── chat/         # Claude API streaming endpoint
│   │       └── demo/create/  # Demo studio creation
│   ├── components/ui/        # Design-system primitives
│   ├── features/
│   │   ├── landing-page/     # Marketing site sections
│   │   ├── dashboard/        # Sidebar, TopBar, KPIs
│   │   ├── game-creator/     # ChatPanel, GamePreview (core feature)
│   │   ├── games/            # My Games grid
│   │   └── community/        # Community gallery
│   ├── core/
│   │   ├── constants/        # App-wide constants
│   │   └── types/            # TypeScript types + database.types.ts
│   └── lib/
│       ├── supabase/         # Supabase clients (browser, server, middleware)
│       └── prompts/          # Claude system prompts for game generation
└── design_system.md          # GTA design tokens (read before any UI work)
```

---

## Development Rules

1. **Design system first**: Always read `design_system.md` before any UI work. Use ONLY design system tokens.
2. **Tailwind classes, NOT inline styles**: All styling must use Tailwind utility classes. No `style={{}}` objects.
3. **TypeScript strict**: No `any` types. Proper interfaces/types for all data structures.
4. **No mock data in production components**: Use Supabase queries or API routes for real data.
5. **Feature-module pattern**: New features go in `src/features/<feature-name>/`.
6. **Composable components**: Build small, reusable components in `src/components/ui/`.
7. **Server components by default**: Only add `"use client"` when needed for interactivity.
8. **Accessibility**: All interactive elements need proper labels, ARIA attributes, and minimum 44px touch targets.
9. **GTA aesthetic**: Angular radii (2px/4px/8px), neon glow shadows, Pricedown headings in ALL CAPS, dark-first design.

---

## Deployment

| Component | Platform |
|-----------|----------|
| Next.js frontend + API routes | **Vercel** |
| Database + Auth | **Supabase Cloud** |

**Environment variables:**
- `ANTHROPIC_API_KEY` — Claude API key for game generation
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
