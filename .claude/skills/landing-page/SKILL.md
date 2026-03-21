---
name: Landing Page
description: Build and maintain the FeltSense Clinic marketing site — hero, social proof, features grid, how it works, stats, testimonials, pricing, FAQ, and footer CTA. Modern SaaS aesthetic (Linear/Vercel-inspired).
---

# Landing Page

## Overview

Build a modern SaaS landing page to sell FeltSense Clinic. This is the public-facing marketing site that converts dental clinic owners into demo bookings. Clean, professional, tech-forward — not generic healthcare.

## Key Files

- `src/app/(marketing)/page.tsx` — landing page root (uses route group for separate layout)
- `src/app/(marketing)/layout.tsx` — marketing layout (no sidebar, different nav)
- `src/features/landing-page/` — all landing page section components
- `design_system.md` — **must follow all design tokens**

## Route Structure

Use a Next.js route group `(marketing)` for a different layout than the dashboard:

```
src/app/
├── (marketing)/
│   ├── layout.tsx          # Marketing layout (sticky nav, footer)
│   └── page.tsx            # Landing page (composes sections)
├── (dashboard)/
│   ├── layout.tsx          # Dashboard layout (sidebar, auth)
│   └── ...existing pages
```

## Sections to Build

Each section is a server component in `src/features/landing-page/`:

1. **HeroSection** — Bold headline ("Your AI Front Desk, 24/7"), subheadline about revenue recovery, "Book a Demo" CTA button, product screenshot or animated mockup
2. **SocialProofBar** — YC W26 badge, "$1M pre-seed raised", logos or "Trusted by X+ dental practices"
3. **FeaturesGrid** — 3 cards: Voice AI Agent, PMS Integration, Insurance & Payments
4. **HowItWorks** — 3-step visual: Connect PMS → AI handles calls → Revenue grows
5. **StatsSection** — Animated counters: calls handled, revenue recovered, hours saved/week
6. **TestimonialsSection** — Quote cards from dental practice owners (placeholder data OK)
7. **PricingSection** — 3 tiers (Starter, Growth, Enterprise) or single "Book a Demo" CTA
8. **FaqSection** — Accordion for HIPAA, accuracy, setup time, cost objections
9. **FooterCta** — Final conversion block + footer with navigation links

## Component Pattern

```tsx
// src/features/landing-page/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="...">
      {/* Server component — no "use client" needed */}
    </section>
  );
}
```

Only add `"use client"` for:
- `StatsSection` (animated counters need `useEffect`/`useRef`)
- `FaqSection` (accordion needs `useState`)

## Styling Rules

- Tailwind classes exclusively (no inline styles)
- Follow `design_system.md` tokens for colors, spacing, typography
- Mobile-first responsive design
- Framer Motion for scroll-triggered animations (install if needed)

## SEO & Metadata

```tsx
// src/app/(marketing)/layout.tsx
export const metadata = {
  title: "FeltSense Clinic — AI-Powered Reception, Always On",
  description: "Smart AI receptionist for dental practices. Handle calls, book appointments, verify insurance, and collect payments automatically.",
  openGraph: {
    title: "FeltSense Clinic",
    description: "...",
    images: ["/og-image.png"],
  },
};
```

## Acceptance Criteria

- [ ] Landing page loads at `/` (or `/landing` if dashboard stays at `/`)
- [ ] All 9 sections render correctly
- [ ] Fully responsive (mobile, tablet, desktop)
- [ ] Lighthouse performance score > 90
- [ ] Proper meta tags and Open Graph for social sharing
- [ ] "Book a Demo" CTA scrolls to or links to a form/Calendly
- [ ] No `style={{}}` — all Tailwind classes
- [ ] Follows design system tokens exactly

## References

- `design_system.md` — color, typography, spacing, component guidelines
- Inspiration: linear.app, vercel.com, cal.com
