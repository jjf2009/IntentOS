# IntentOS: Crisis Mode — Design (AGENTS.md Compliant)

## Overview (from AGENTS.md)
A generative "War Room" that converts a panicked brain-dump into a strict, time-bound execution timeline using Tambo AI.

Core experience:
- Natural language brain-dump input
- Tambo AI dynamic component streaming
- Generative `CrisisTimeline` component
- Interactable `FocusBlocker` component isolating the single active task

**Completely stateless, simple, visually impactful.**

## Architecture (Strict)
```
src/
  app/
    page.tsx          # Single-page MVP only
    layout.tsx
    globals.css
  components/
    tambo/
      crisis-timeline.tsx   # ONLY generative component (AI-driven)
      focus-blocker.tsx     # ONLY generative component (AI-driven)
  lib/
    tambo.ts          # Central registry (Zod schemas only)
    utils.ts
public/
```

**Rules enforced:**
- No other routes.
- `components/tambo/` contains **only** the two generative components.
- All Tambo components registered exclusively in `lib/tambo.ts` with strict Zod `propsSchema`.
- No databases, no Zustand/Redux. Only `useState` + `useTamboComponentState`.

## Visual System — Soft Editorial Dark Studio

**Palette (exact tokens):**
- `--bg-canvas`: #0f0d0c (warm near-black)
- `--bg-card`: #1a1614
- `--bg-modal`: #231f1c
- `--accent-primary`: #933B5B (Amaranth) — only for the single most important action
- `--accent-secondary`: #B5728A (Thulian Pink)
- `--accent-neutral`: #AABAAE (Brook Green)
- `--accent-warm`: #E3D6BF (Chalk)
- `--accent-muted`: #9F9679 (Pomelo Olive)
- `--text-primary`: #E3D6BF
- `--text-secondary`: #AABAAE

**Typography:**
- Display: Cormorant Garamond (serif, 300 weight, used sparingly for headlines)
- Body: Inter (or system-ui), 14-16px, line-height 1.7
- Mono: JetBrains Mono (for all timers, durations, tags)

**Key rules applied:**
- Sentence case everywhere.
- One primary Amaranth CTA per view.
- Borders: 0.5px solid rgba(170,186,174,0.2)
- Elevation via background lightness only (max 2 layers).
- No neon, no pure white/black, no heavy shadows.

**Buttons (exact patterns):**
- Primary: `bg-[#933B5B] text-[#E3D6BF] ... hover:bg-[#B5728A]`
- Ghost: border + subtle hover.

## Core Flow

1. **Input** — Large, calm textarea. "Brain dump your crisis..."
   - CTA: "Launch Rescue Plan" (Amaranth primary).
   - Example buttons for quick demos (no hardcoded components in canvas).

2. **Generative Canvas**
   - On submit → send via Tambo.
   - Tambo streams `<CrisisTimeline />` (registered component).
   - Timeline shows blocks with durations, urgency, tasks.
   - Clicking a block (or "Focus" action) surfaces the `FocusBlocker`.

3. **FocusBlocker**
   - Large task title.
   - Live countdown timer (mono, big).
   - Checklist (interactive via useTamboComponentState).
   - Controls: Complete, +5 min, Exit focus.
   - When completed → back to timeline or victory state.

## State Strategy
- Page level: `useState` for input value + submitted text + optional local "focus mode" flag (ephemeral).
- Inside generative components: `useTamboComponentState` for checkmarks, active block, timer state.
- No persistence across reloads.

## Animation System (GSAP)
Install once: `npm install gsap`

**Used sparingly for impact:**
- Hero / initial load: subtle fade + lift for headline + CTA.
- Timeline blocks: staggered reveal on stream complete (or scroll).
- FocusBlocker entrance: clean fade + scale from 0.98.
- Hover cards: micro lift + border change (power1.out).
- Timer updates: no animation on digits (just mono numbers).

Respect `prefers-reduced-motion`.

All motion uses power/expo eases, duration 0.2–0.8s max. No bouncing.

## Components

### CrisisTimeline (generative only)
Props (Zod enforced):
- deadlineMinutes
- summary (optional)
- blocks: [{ id, title, durationMinutes, description, tasks?, urgency? }]

Renders:
- Deadline header (mono, Amaranth for critical time).
- Progress bar (inline style only).
- Vertical list of blocks with urgency coloring (Amaranth for catastrophic, etc.).
- Checkable tasks.
- Clicking block sets active state (local + can trigger FocusBlocker).

### FocusBlocker (generative only)
Props (Zod):
- id, title, durationMinutes?, description, checklist?

Renders:
- Prominent focused task.
- Large live timer (useEffect + useState for seconds).
- Checklist.
- Action buttons (Amaranth for primary actions).

## Tambo Integration
- `lib/tambo.ts` registers **only** the two components with excellent descriptions + strict Zod schemas.
- Prompt engineering in `handleLaunch` forces the model to output the component.
- Canvas prefers `renderedComponent` from Tambo messages.

## Demo Experience (for hackathon)
- Prominent "Try an example" chips that populate the brain-dump field with realistic last-minute scenarios.
- One-click "Launch" shows real Tambo streaming or high-quality fallback.
- Clear "New Crisis" reset.

## Files That Must Be Cleaned
- Keep only `crisis-timeline.tsx` and `focus-blocker.tsx` in `components/tambo/`.
- Remove or archive all full chat UI primitives if not strictly needed for rendering the two components.
- `globals.css` and layout must implement the new palette + font variables.
- No leftover zinc cyber styles.

## Tech Constraints (AGENTS.md)
- Next.js 15 App Router, single page.tsx
- Tailwind v4 + exact tokens
- lucide-react icons
- GSAP for specified animations
- Zod for all Tambo component props
- useState + useTamboComponentState only
- No auth, no DBs

This design directly satisfies every rule in the current AGENTS.md while preserving the powerful Crisis Mode concept.
