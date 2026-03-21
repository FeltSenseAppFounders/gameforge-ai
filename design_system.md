# Design System — GameForge AI (GTA Aesthetic)

**All frontend work must follow these guidelines.** Read this before any UI work.

---

## Visual Identity

**Grand Theft Auto** inspired. Dark surfaces, neon glows, angular UI, Pricedown headings in ALL CAPS. Think: loading screens, HUD elements, mission briefings.

---

## Color Palette

### Brand Colors — GTA Neon

| Role | Hex | Tailwind Class | Use |
|------|-----|----------------|-----|
| **Primary** | `#47761E` | `bg-primary` / `text-primary` | CTAs, active states, primary buttons |
| **Primary Light** | `#7CFC00` | `bg-primary-light` / `text-primary-light` | Neon green glows, hover, accents |
| **Primary Dark** | `#2D4F12` | `bg-primary-dark` / `text-primary-dark` | Pressed/active states |
| **Secondary** | `#FED985` | `bg-secondary` / `text-secondary` | Caramel Yellow — badges, warnings, highlights |
| **Accent** | `#F09E71` | `bg-accent` / `text-accent` | Kawaii Orange — feature cards, warm accents |
| **Accent Blue** | `#61B5CB` | `bg-accent-blue` / `text-accent-blue` | Links, info, AI indicators |
| **Accent Purple** | `#D5A0C4` | `bg-accent-purple` / `text-accent-purple` | Community, social features |

### Surface Colors — Dark-First

| Token | Hex | Tailwind Class | Use |
|-------|-----|----------------|-----|
| **Surface Dark** | `#0F0F0F` | `bg-surface-dark` | Page backgrounds |
| **Surface** | `#1A1A1A` | `bg-surface` | Cards, sidebar, panels |
| **Surface Light** | `#2A2A2A` | `bg-surface-light` | Hover states, borders, elevated |

### Neutral Scale

| Token | Hex | Tailwind Class | Use |
|-------|-----|----------------|-----|
| 50 | `#FAFAFA` | `text-neutral-50` | Brightest text (rare) |
| 100 | `#F5F5F5` | `text-neutral-100` | Headings on dark bg |
| 200 | `#E5E5E5` | `text-neutral-200` | Primary body text |
| 300 | `#D4D4D4` | `text-neutral-300` | Default body text |
| 400 | `#A3A3A3` | `text-neutral-400` | Muted/secondary text |
| 500 | `#737373` | `text-neutral-500` | Placeholder, disabled |
| 600 | `#525252` | `border-neutral-600` | Borders on dark surfaces |
| 700 | `#404040` | `border-neutral-700` | Subtle dividers |
| 800 | `#262626` | `bg-neutral-800` | Elevated surfaces |
| 900 | `#171717` | `bg-neutral-900` | Deep backgrounds |
| 950 | `#0A0A0A` | `bg-neutral-950` | Deepest dark |

### Semantic Colors

| Role | Hex | Tailwind Class | Use |
|------|-----|----------------|-----|
| **Success** | `#22C55E` | `text-success` / `bg-success` | Online, published, playable |
| **Warning** | `#FED985` | `text-warning` / `bg-warning` | Draft, pending (= secondary) |
| **Error** | `#FF3131` | `text-error` / `bg-error` | GTA Red — crashes, errors, destructive |
| **Info** | `#61B5CB` | `text-info` / `bg-info` | AI indicators (= accent-blue) |

---

## Typography

### Fonts

| Role | Font | Tailwind Class | Loading |
|------|------|----------------|---------|
| **Headings** | Pricedown | `font-heading` | `next/font/local` from `public/fonts/pricedown.woff` |
| **Body** | Inter | `font-body` | `next/font/google` |
| **Mono** | JetBrains Mono | `font-mono` | `next/font/google` — code, game stats |

### Rules
- **ALL headings in Pricedown must be UPPERCASE** — the font is designed for caps
- Pricedown for: page titles, section headers, CTAs, KPI numbers, game titles
- Inter for: body text, descriptions, form labels, navigation labels
- JetBrains Mono for: game code, stats, technical data

### Typography Scale

| Name | Size | Tailwind | Usage |
|------|------|----------|-------|
| display | 64px | `text-5xl font-heading uppercase` | Hero headlines |
| heading-1 | 48px | `text-4xl font-heading uppercase` | Page titles |
| heading-2 | 36px | `text-3xl font-heading uppercase` | Section headers |
| heading-3 | 28px | `text-2xl font-heading uppercase` | Card titles |
| heading-4 | 22px | `text-xl font-heading uppercase` | Sub-sections |
| body-lg | 18px | `text-lg font-body` | Hero subtitles, descriptions |
| body | 16px | `text-base font-body` | Default body text |
| body-sm | 14px | `text-sm font-body` | Secondary text, captions |
| label | 14px | `text-sm font-semibold` | Form labels |
| caption | 12px | `text-xs` | Timestamps, metadata |
| overline | 11px | `text-[11px] font-semibold uppercase tracking-wider` | Category labels |

---

## Border Radii — Angular

GTA aesthetic = sharp, angular. NOT rounded.

| Name | Value | Tailwind |
|------|-------|----------|
| Small | 2px | `rounded-sm` |
| Medium | 4px | `rounded-md` |
| Large | 8px | `rounded-lg` |
| Full | 9999px | `rounded-full` — only for avatar dots, status indicators |

---

## Shadows — Neon Glows

No soft box-shadows. Use neon glow effects.

| Name | Utility Class | Use |
|------|--------------|-----|
| Green Glow | `glow-green` | Primary CTAs, active elements |
| Green Glow Hover | `glow-green-hover` | Add to green glow elements for hover |
| Yellow Glow | `glow-yellow` | Secondary highlights |
| Orange Glow | `glow-orange` | Feature cards |
| Blue Glow | `glow-blue` | AI/info elements |
| Purple Glow | `glow-purple` | Community/social |
| Neon Text | `neon-text` | Green text glow effect |
| Neon Text Yellow | `neon-text-yellow` | Yellow text glow effect |
| Pulse Neon | `animate-pulse-neon` | Animated green pulse glow |
| HUD Bracket | `hud-bracket` | Corner bracket decoration on cards |

---

## Component Guidelines

### Button

```html
<!-- Primary CTA — Green Neon -->
<button class="bg-primary hover:bg-primary-light active:bg-primary-dark text-white
  rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider
  glow-green glow-green-hover transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary-light/35
  min-h-[44px]">
  START CREATING
</button>

<!-- Secondary / Outline — Yellow Border -->
<button class="border border-secondary text-secondary bg-transparent
  hover:bg-secondary/10 active:bg-secondary/20
  rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider
  transition-all duration-200
  min-h-[44px]">
  SEE EXAMPLES
</button>

<!-- Destructive — GTA Red -->
<button class="bg-error hover:bg-error/90 text-white
  rounded-md px-6 py-3 text-sm font-semibold uppercase tracking-wider
  min-h-[44px]">
  DELETE GAME
</button>
```

### Card — Dark Surface

```html
<!-- Standard Card -->
<div class="bg-surface rounded-lg border border-neutral-700
  hover:border-primary-light/30 transition-colors duration-200 p-6">
  <!-- content -->
</div>

<!-- HUD Card — with corner brackets -->
<div class="bg-surface rounded-lg border border-neutral-700 p-6 hud-bracket">
  <!-- content -->
</div>

<!-- Neon Accent Card -->
<div class="bg-surface rounded-lg border border-primary-light/20
  glow-green p-6">
  <!-- content -->
</div>
```

### Input — Dark Theme

```html
<div class="flex flex-col gap-1.5">
  <label class="text-sm font-semibold text-neutral-300">
    Game Name
  </label>
  <input class="w-full bg-surface-light border border-neutral-600 rounded-md
    px-3.5 py-2.5 text-base text-neutral-200
    placeholder:text-neutral-500
    focus:border-primary-light focus:ring-2 focus:ring-primary-light/35 focus:outline-none
    transition-colors duration-150" />
</div>
```

### Badge / Status

```html
<!-- Playable (success) -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-sm
  bg-success/10 text-success border border-success/20
  text-[11px] font-semibold uppercase tracking-wider">
  PLAYABLE
</span>

<!-- Draft (warning/secondary) -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-sm
  bg-secondary/10 text-secondary border border-secondary/20
  text-[11px] font-semibold uppercase tracking-wider">
  DRAFT
</span>

<!-- Published (primary) -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-sm
  bg-primary-light/10 text-primary-light border border-primary-light/20
  text-[11px] font-semibold uppercase tracking-wider">
  PUBLISHED
</span>
```

### Navigation / Sidebar

```html
<aside class="w-64 bg-surface text-neutral-400 min-h-screen p-6 flex flex-col gap-1
  border-r border-neutral-700">
  <!-- Logo -->
  <div class="px-4 py-6 mb-4">
    <span class="text-lg font-heading text-primary-light uppercase">GAMEFORGE</span>
    <span class="text-lg font-heading text-secondary uppercase ml-1">AI</span>
  </div>

  <!-- Nav item (active) — green left border -->
  <a class="flex items-center gap-3 px-4 py-3 rounded-md
    bg-primary/10 text-primary-light border-l-2 border-primary-light
    font-semibold text-sm">
    <Icon /> OVERVIEW
  </a>

  <!-- Nav item (inactive) -->
  <a class="flex items-center gap-3 px-4 py-3 rounded-md
    text-neutral-400 hover:bg-surface-light hover:text-neutral-200
    transition-colors duration-150 text-sm font-semibold">
    <Icon /> MY GAMES
  </a>
</aside>
```

### KPI Card — HUD Style

```html
<div class="bg-surface rounded-lg border border-neutral-700 p-6 hud-bracket">
  <p class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
    GAMES CREATED
  </p>
  <p class="text-3xl font-heading text-primary-light uppercase neon-text">
    1,247
  </p>
  <div class="flex items-center gap-1 mt-2">
    <span class="text-success text-sm font-semibold">↑ 12%</span>
    <span class="text-neutral-500 text-xs">vs last week</span>
  </div>
</div>
```

---

## Key Rules

1. **Dark-first**: All backgrounds use `bg-surface-dark`, `bg-surface`, or `bg-surface-light`
2. **Angular**: Use `rounded-sm` (2px), `rounded-md` (4px), `rounded-lg` (8px) — NEVER rounded-xl or rounded-2xl
3. **Neon glows**: Replace soft shadows with `glow-green`, `glow-yellow`, etc.
4. **Pricedown = UPPERCASE**: Every Pricedown heading must be in ALL CAPS
5. **No gradients**: Use flat colors with neon glow accents
6. **HUD brackets**: Use `hud-bracket` class on key cards for the GTA corner decoration
7. **Tailwind classes only**: Never use inline `style={{}}` or arbitrary hex values
8. **Color text on dark**: Primary text is `text-neutral-300`, headings are `text-neutral-100` or `text-primary-light`

---

## Tailwind v4 Theme Configuration

The canonical `@theme` block lives in `src/app/globals.css`. All tokens above are defined there. Custom utility classes (`glow-green`, `neon-text`, `hud-bracket`, etc.) are in `@layer utilities` blocks in the same file.

**Remember**: Consistency is key. Always use Tailwind classes with these tokens. Never use inline `style={{}}` or arbitrary hex values.
