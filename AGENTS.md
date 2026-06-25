```markdown
You are an expert Next.js and AI engineer helping me build
IntentOS: Crisis Mode.
Write clean, simple, maintainable code. Prioritize clarity over
unnecessary abstraction.
Think like a senior product engineer operating under a strict 5-day hackathon deadline.
---
## Project Overview
We are building IntentOS: Crisis Mode, a generative "War Room" that converts a panicked brain-dump into a strict, time-bound execution timeline.
The app includes:
- Natural language brain-dump input.
- Tambo AI dynamic component streaming.
- A Generative `CrisisTimeline` component mapping out the deadline.
- An interactable `FocusBlocker` component isolating the single active task.
Keep the implementation completely stateless, simple, and visually impactful.
---
## Tech Stack
- Next.js 15 (App Router)
- React 19.1
- TypeScript
- Tailwind CSS v4
- Tambo AI SDK (`@tambo-ai/react`)
- Zod (for schema validation)
- lucide-react (for icons)

Do not introduce new major libraries unless there is a strong reason.
Do NOT introduce databases (Prisma, Supabase) or state managers (Redux, Zustand).
Ask before installing anything new.
---
## Development Philosophy
Build feature by feature.
For every feature:
1. Read this file first.
2. Keep the implementation simple.
3. Avoid overengineering.
4. Prefer readable code over clever code.
5. Build the smallest useful version first.
6. Refactor only when repetition appears.
---
## Decision Making
If something is unclear or could be improved, suggest a better
approach. If a new library would significantly help, recommend it,
explain why, and ask before adding it.
Do not install new libraries without approval. 
Always optimize for speed-to-demo.
---
## Architecture
Use this folder structure:
```text
src/
  app/
  components/
    tambo/
  lib/
public/

```

## **app/** is for Next.js routes. Keep it to a single-page architecture (`page.tsx`) for the MVP.
**components/tambo/** is strictly for AI-generated React components. Examples for this app:
`crisis-timeline.tsx`, `focus-blocker.tsx`. Do not create components too early.
**lib/** holds the core configurations. `tambo.ts` is the central registry where all Tambo components must be registered with strict Zod schemas.
Never expose secret keys here.

## UI Rules

For any UI task:

* Lean into the "High-Stakes War Room" aesthetic.
* Deep dark mode (`bg-zinc-950`).
* Sharp, clean borders (`border-zinc-800`).
* Use `font-mono` for all timers, countdowns, and metrics to emphasize precision.
* Use accent colors based on urgency: Neon Red for catastrophic, Amber for critical, Cyber Green for active tasks.
* Do not approximate. Do not overcomplicate the CSS.

---

## Styling Rules

Use Tailwind CSS v4. Do not use standard CSS stylesheets or modules.
Keep classes inline unless abstracting into a simple UI component.
Reuse class patterns through standard Tailwind utility conventions.

### Style Exception List

Use inline styles strictly for:

* Dynamic progress bar widths calculated via React state (`style={{ width: `${progress}%` }}`)
* Complex generative visual positioning not easily handled by Tailwind utilities.
Everywhere else, use Tailwind classes.

---

## Icon & Asset Rule

Use `lucide-react` for all UI icons.
Do not import heavy external SVGs unless absolutely necessary.
When using Next.js images, place them in `public/` and reference them cleanly.

```tsx
import { Timer, AlertTriangle, CheckCircle } from "lucide-react";

<AlertTriangle className="text-red-500 w-5 h-5"/>

```

---

## State Management

* React `useState` for all interactive state (e.g., checking off tasks).
* All state must be ephemeral and client-side to keep the hackathon demo fast.
* No Zustand. No Redux. No persistent databases.

---

## TypeScript

* Strict mode.
* No `any`.
* Keep types simple and readable.
* You MUST use `Zod` to define the `propsSchema` for any Tambo AI component.

---

## Feature Implementation

When building a feature:

1. Read this file first.
2. Identify the files to change.
3. Keep changes focused.
4. Do not rewrite unrelated code.
5. Follow existing patterns.
6. Make sure the feature works end to end.
7. Fix lint and type errors before finishing.

---

## Secrets

* Never expose secret keys in client code.
* Ensure `NEXT_PUBLIC_TAMBO_API_KEY` is handled securely via environment variables.

---

## Authentication

## NONE. Do not build authentication. Do not install Clerk or Supabase. We are optimizing for a frictionless, single-click demo experience.

## Communication

## Be concise. Explain what changed and how to test it. Do not lecture on best practices unless a critical error is being made.

## Final Reminder

Before every feature:

* Read this file.
* Follow it strictly.
* Build clean, simple code.
* Optimize for shipping the MVP.

```

```