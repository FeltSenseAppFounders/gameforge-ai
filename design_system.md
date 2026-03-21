# Design System — FeltSense Clinic

**All frontend work must follow these guidelines.** Read this before any UI work.

---

## Color Palette

### Brand Colors — Indigo + Teal

AI intelligence meets medical trust. Indigo signals premium technology; teal conveys healthcare calm and reliability.

| Role | Hex | Tailwind Class | Use |
|------|-----|----------------|-----|
| **Primary** | `#4F46E5` | `bg-primary` / `text-primary` | CTAs, active nav, key actions |
| **Primary Light** | `#818CF8` | `bg-primary-light` / `text-primary-light` | Hover states, light accents |
| **Primary Dark** | `#3730A3` | `bg-primary-dark` / `text-primary-dark` | Active/pressed states, depth |
| **Secondary** | `#0D9488` | `bg-secondary` / `text-secondary` | Medical indicators, success-adjacent |
| **Secondary Light** | `#2DD4BF` | `bg-secondary-light` / `text-secondary-light` | Highlights, verification badges |
| **Secondary Dark** | `#115E59` | `bg-secondary-dark` / `text-secondary-dark` | Dark accents |
| **Accent** | `#06B6D4` | `bg-accent` / `text-accent` | AI glow, futuristic highlights, links |

### Neutral Scale — Slate

Cool blue undertone for a tech-forward feel. Use slate instead of pure gray.

| Token | Hex | Tailwind Class | Use |
|-------|-----|----------------|-----|
| 50 | `#F8FAFC` | `bg-neutral-50` | Page background |
| 100 | `#F1F5F9` | `bg-neutral-100` | Card alt background, hover rows |
| 200 | `#E2E8F0` | `border-neutral-200` | Borders, dividers |
| 300 | `#CBD5E1` | `border-neutral-300` | Input borders, disabled states |
| 400 | `#94A3B8` | `text-neutral-400` | Placeholder text |
| 500 | `#64748B` | `text-neutral-500` | Muted / helper text |
| 600 | `#475569` | `text-neutral-600` | Secondary body text |
| 700 | `#334155` | `text-neutral-700` | Primary body text |
| 800 | `#1E293B` | `bg-neutral-800` | Sidebar, headings |
| 900 | `#0F172A` | `bg-neutral-900` | Dark mode backgrounds |
| 950 | `#020617` | `bg-neutral-950` | Deepest dark |

### Semantic Colors

| Role | Hex | Tailwind Class | Use |
|------|-----|----------------|-----|
| **Success** | `#059669` | `text-success` / `bg-success` | Verified, complete, active |
| **Warning** | `#D97706` | `text-warning` / `bg-warning` | Attention, pending, caution |
| **Error** | `#E11D48` | `text-error` / `bg-error` | Failures, destructive, alerts |
| **Info** | `#4F46E5` | `text-info` / `bg-info` | Informational (= primary) |

### Gradients

| Name | CSS | Tailwind | Use |
|------|-----|----------|-----|
| **AI Glow** | `linear-gradient(135deg, #4F46E5, #06B6D4)` | `bg-gradient-to-br from-primary to-accent` | Hero CTAs, AI status indicators |
| **Medical Trust** | `linear-gradient(135deg, #0D9488, #06B6D4)` | `bg-gradient-to-br from-secondary to-accent` | Verification badges, success states |
| **Dark Surface** | `linear-gradient(180deg, #1E293B, #0F172A)` | `bg-gradient-to-b from-neutral-800 to-neutral-900` | Sidebar, dark sections |

---

## Typography

### Fonts

| Role | Font | Tailwind Class | Loading |
|------|------|----------------|---------|
| **Headings** | Plus Jakarta Sans | `font-heading` | `next/font/google` |
| **Body** | Inter | `font-body` | `next/font/google` |
| **Mono** | JetBrains Mono | `font-mono` | `next/font/google` — for transcripts, data, code |

### Typography Scale

| Name | Size | Weight | Line Height | Tailwind |
|------|------|--------|-------------|----------|
| heading-1 | 48px | 700 | 1.15 | `text-4xl font-bold font-heading` |
| heading-2 | 36px | 700 | 1.2 | `text-3xl font-bold font-heading` |
| heading-3 | 28px | 600 | 1.25 | `text-2xl font-semibold font-heading` |
| heading-4 | 22px | 600 | 1.3 | `text-xl font-semibold font-heading` |
| heading-5 | 18px | 600 | 1.4 | `text-lg font-semibold font-heading` |
| body-lg | 18px | 400 | 1.7 | `text-lg font-body` |
| body | 16px | 400 | 1.7 | `text-base font-body` |
| body-sm | 14px | 400 | 1.6 | `text-sm font-body` |
| label | 14px | 600 | 1.4 | `text-sm font-semibold` |
| caption | 12px | 400 | 1.5 | `text-xs` |
| overline | 11px | 600 | 1.4 | `text-[11px] font-semibold uppercase tracking-wider` |

---

## Spacing Scale

Use these values for margins, padding, and gaps:

| px | Tailwind |
|----|----------|
| 4px | `p-1` / `gap-1` |
| 8px | `p-2` / `gap-2` |
| 12px | `p-3` / `gap-3` |
| 16px | `p-4` / `gap-4` |
| 24px | `p-6` / `gap-6` |
| 32px | `p-8` / `gap-8` |
| 48px | `p-12` / `gap-12` |
| 64px | `p-16` / `gap-16` |
| 80px | `p-20` / `gap-20` |
| 96px | `p-24` / `gap-24` |
| 128px | `p-32` / `gap-32` |

---

## Border Radii

| Name | Value | Tailwind |
|------|-------|----------|
| Small | 6px | `rounded-sm` |
| Medium | 10px | `rounded-md` |
| Large | 16px | `rounded-lg` |
| Full | 9999px | `rounded-full` |

---

## Shadows

| Name | CSS | Tailwind |
|------|-----|----------|
| xs | `0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)` | `shadow-xs` |
| sm | `0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04)` | `shadow-sm` |
| md | `0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05)` | `shadow-md` |
| lg | `0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06)` | `shadow-lg` |
| xl | `0 16px 48px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07)` | `shadow-xl` |
| focus-ring | `0 0 0 3px rgba(79,70,229,0.35)` | `shadow-focus-ring` / `ring-2 ring-primary/35` |

---

## Glassmorphism

Frosted glass effect for overlays, modals, and elevated cards. Use sparingly for premium feel.

| Variant | Classes | Use |
|---------|---------|-----|
| **Glass Card** | `bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg` | Floating cards, overlays |
| **Glass Dark** | `bg-neutral-900/70 backdrop-blur-xl border border-white/10` | Dark mode overlays |
| **Glass Subtle** | `bg-white/50 backdrop-blur-md border border-neutral-200/50` | Secondary surfaces |

---

## Component Guidelines

### Button

```html
<!-- Primary -->
<button class="bg-primary hover:bg-primary-dark active:bg-primary-dark text-white
  rounded-md px-6 py-3 text-sm font-semibold
  shadow-sm hover:shadow-md transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2
  min-h-[44px]">
  Book a Demo
</button>

<!-- Secondary / Outline -->
<button class="border border-primary text-primary bg-transparent
  hover:bg-primary/5 active:bg-primary/10
  rounded-md px-6 py-3 text-sm font-semibold
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2
  min-h-[44px]">
  Learn More
</button>

<!-- Gradient CTA (hero, high-impact) -->
<button class="bg-gradient-to-br from-primary to-accent text-white
  rounded-md px-8 py-3 text-sm font-semibold
  shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2
  min-h-[44px]">
  Get Started
</button>

<!-- Destructive -->
<button class="bg-error hover:bg-error/90 text-white
  rounded-md px-6 py-3 text-sm font-semibold
  min-h-[44px]">
  End Call
</button>

<!-- Disabled -->
<button class="bg-neutral-300 text-neutral-400 cursor-not-allowed
  rounded-md px-6 py-3 text-sm font-semibold
  min-h-[44px]" disabled>
  Unavailable
</button>
```

### Card

```html
<!-- Standard Card -->
<div class="bg-white rounded-lg border border-neutral-200
  shadow-sm hover:shadow-md transition-shadow duration-200
  p-6">
  <!-- content -->
</div>

<!-- Glass Card (elevated, overlays) -->
<div class="bg-white/70 backdrop-blur-xl rounded-lg
  border border-white/20 shadow-lg p-6">
  <!-- content -->
</div>

<!-- Trust Card (compliance, HIPAA) — left accent border -->
<div class="bg-white rounded-lg border border-neutral-200
  border-l-4 border-l-secondary shadow-sm p-6">
  <!-- content -->
</div>
```

### Input

```html
<div class="flex flex-col gap-1.5">
  <label class="text-sm font-semibold text-neutral-700">
    Patient Name
  </label>
  <input class="w-full bg-white border border-neutral-300 rounded-md
    px-3.5 py-2.5 text-base text-neutral-700
    placeholder:text-neutral-400
    focus:border-primary focus:ring-2 focus:ring-primary/35 focus:outline-none
    transition-colors duration-150" />
  <!-- Error state: add border-error focus:ring-error/35 -->
  <!-- <p class="text-sm text-error">Error message</p> -->
</div>
```

### Badge / Status Indicator

```html
<!-- Success badge -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-sm
  bg-success/10 text-success
  text-[11px] font-semibold uppercase tracking-wider">
  Active
</span>

<!-- Warning badge -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-sm
  bg-warning/10 text-warning
  text-[11px] font-semibold uppercase tracking-wider">
  Pending
</span>

<!-- Error badge -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-sm
  bg-error/10 text-error
  text-[11px] font-semibold uppercase tracking-wider">
  Failed
</span>

<!-- AI / Accent badge -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-sm
  bg-accent/10 text-accent
  text-[11px] font-semibold uppercase tracking-wider">
  AI Verified
</span>
```

### Navigation / Sidebar

```html
<aside class="w-64 bg-gradient-to-b from-neutral-800 to-neutral-900
  text-neutral-400 min-h-screen p-6 flex flex-col gap-1">

  <!-- Logo area -->
  <div class="px-4 py-6 mb-4">
    <span class="text-lg font-bold font-heading text-white">
      FeltSense Clinic
    </span>
  </div>

  <!-- Nav item (active) -->
  <a class="flex items-center gap-3 px-4 py-3 rounded-md
    bg-primary text-white font-semibold text-sm">
    <Icon /> Dashboard
  </a>

  <!-- Nav item (inactive) -->
  <a class="flex items-center gap-3 px-4 py-3 rounded-md
    text-neutral-400 hover:bg-neutral-700 hover:text-white
    transition-colors duration-150 text-sm font-semibold">
    <Icon /> Patients
  </a>

  <!-- Section divider -->
  <div class="border-t border-neutral-700 my-3"></div>
</aside>
```

### Data Table

```html
<table class="w-full">
  <thead>
    <tr class="bg-neutral-50 border-b border-neutral-200">
      <th class="text-left text-sm font-semibold text-neutral-600 px-4 py-3">
        Patient
      </th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-neutral-200 hover:bg-neutral-100
      transition-colors duration-100">
      <td class="px-4 py-3 text-sm text-neutral-700">
        Jane Smith
      </td>
    </tr>
  </tbody>
</table>
```

### Metric / KPI Card

```html
<div class="bg-white rounded-lg border border-neutral-200
  border-t-3 border-t-primary shadow-md p-8">
  <p class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
    Calls Handled
  </p>
  <p class="text-3xl font-bold font-heading text-neutral-800">
    1,247
  </p>
  <div class="flex items-center gap-1 mt-2">
    <span class="text-success text-sm font-semibold">↑ 12%</span>
    <span class="text-neutral-400 text-xs">vs last week</span>
  </div>
</div>
```

### Alert / Notification Banner

```html
<!-- Info -->
<div class="w-full px-4 py-3 bg-info/10 border-l-4 border-l-info
  rounded-r-md flex items-start gap-3">
  <InfoIcon class="w-5 h-5 text-info mt-0.5 shrink-0" />
  <div>
    <p class="text-sm font-semibold text-neutral-800">Sync Complete</p>
    <p class="text-sm text-neutral-600">All patient records are up to date.</p>
  </div>
</div>

<!-- Error (non-dismissible for critical) -->
<div class="w-full px-4 py-3 bg-error/10 border-l-4 border-l-error
  rounded-r-md flex items-start gap-3">
  <AlertIcon class="w-5 h-5 text-error mt-0.5 shrink-0" />
  <div>
    <p class="text-sm font-semibold text-neutral-800">Call Dropped</p>
    <p class="text-sm text-neutral-600">Connection lost with patient. Attempting reconnect.</p>
  </div>
</div>
```

### Modal / Dialog

```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50
  flex items-center justify-center">
  <!-- Modal -->
  <div class="bg-white rounded-lg shadow-xl max-w-[560px] w-full mx-4">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
      <h3 class="text-xl font-semibold font-heading text-neutral-800">
        Confirm Appointment
      </h3>
      <button class="text-neutral-400 hover:text-neutral-600 p-1">×</button>
    </div>
    <!-- Body -->
    <div class="px-6 py-4 text-base text-neutral-700">
      <!-- content -->
    </div>
    <!-- Footer -->
    <div class="flex justify-end gap-2 px-6 py-4 border-t border-neutral-200">
      <button class="border border-neutral-300 text-neutral-700
        rounded-md px-4 py-2 text-sm font-semibold">Cancel</button>
      <button class="bg-primary text-white
        rounded-md px-4 py-2 text-sm font-semibold">Confirm</button>
    </div>
  </div>
</div>
```

### Voice AI Status Widget

```html
<!-- Floating widget — bottom-right -->
<div class="fixed bottom-6 right-6 z-40">
  <!-- Idle state -->
  <button class="w-14 h-14 rounded-full bg-white shadow-lg
    border-2 border-neutral-300 flex items-center justify-center
    hover:shadow-xl transition-shadow duration-200">
    <MicIcon class="w-5 h-5 text-neutral-500" />
  </button>

  <!-- Active call — pulsing primary ring -->
  <button class="w-14 h-14 rounded-full bg-white shadow-lg
    border-2 border-primary flex items-center justify-center
    ring-4 ring-primary/20 animate-pulse">
    <MicIcon class="w-5 h-5 text-primary" />
  </button>

  <!-- Emergency — error ring -->
  <button class="w-14 h-14 rounded-full bg-white shadow-lg
    border-2 border-error flex items-center justify-center
    ring-4 ring-error/20 animate-pulse">
    <AlertIcon class="w-5 h-5 text-error" />
  </button>
</div>
```

---

## Tailwind v4 Theme Configuration

This is the canonical `@theme` block. It lives in `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-primary: #4F46E5;
  --color-primary-light: #818CF8;
  --color-primary-dark: #3730A3;
  --color-secondary: #0D9488;
  --color-secondary-light: #2DD4BF;
  --color-secondary-dark: #115E59;
  --color-accent: #06B6D4;

  /* Neutrals (Slate) */
  --color-neutral-50: #F8FAFC;
  --color-neutral-100: #F1F5F9;
  --color-neutral-200: #E2E8F0;
  --color-neutral-300: #CBD5E1;
  --color-neutral-400: #94A3B8;
  --color-neutral-500: #64748B;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1E293B;
  --color-neutral-900: #0F172A;
  --color-neutral-950: #020617;

  /* Semantic */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #E11D48;
  --color-info: #4F46E5;

  /* Typography */
  --font-heading: "Plus Jakarta Sans", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Font sizes */
  --text-xs: 12px;
  --text-xs--line-height: 1.5;
  --text-sm: 14px;
  --text-sm--line-height: 1.6;
  --text-base: 16px;
  --text-base--line-height: 1.7;
  --text-lg: 18px;
  --text-lg--line-height: 1.7;
  --text-xl: 22px;
  --text-xl--line-height: 1.3;
  --text-2xl: 28px;
  --text-2xl--line-height: 1.25;
  --text-3xl: 36px;
  --text-3xl--line-height: 1.2;
  --text-4xl: 48px;
  --text-4xl--line-height: 1.15;

  /* Border radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.06), 0 4px 8px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.05);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06);
  --shadow-xl: 0 16px 48px rgba(0,0,0,0.10), 0 32px 64px rgba(0,0,0,0.07);
  --shadow-focus-ring: 0 0 0 3px rgba(79,70,229,0.35);
}
```

---

**Remember**: Consistency is key. Always use Tailwind classes with these tokens. Never use inline `style={{}}` or arbitrary hex values.
