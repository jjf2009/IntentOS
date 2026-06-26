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

# UI Rules — Soft Editorial Dark Studio
> Aesthetic system built from the Amaranth palette. Warm, restrained, organic. No neon. No cyber.

---

## The Palette

| Token Name     | Hex       | Role                                              |
|----------------|-----------|---------------------------------------------------|
| Amaranth       | `#933B5B` | Primary accent — CTAs, active states, headlines   |
| Thulian Pink   | `#B5728A` | Secondary — hover states, badges, secondary labels|
| Brook Green    | `#AABAAE` | Neutral tint — borders, dividers, quiet tags      |
| Chalk          | `#E3D6BF` | Warm surface — card bg, body text on dark         |
| Pomelo Olive   | `#9F9679` | Muted utility — timestamps, placeholders, captions|
| Near-Black     | `#0f0d0c` | Canvas floor (warm, never pure black)             |
| Card Surface   | `#1a1614` | Card background                                   |
| Modal Surface  | `#231f1c` | Modal / elevated panel background                 |

---

## Color Rules

- **One primary accent per view.** Amaranth (`#933B5B`) is reserved for the single most important action on screen.
- **Never use pure white** (`#ffffff`) or pure black (`#000000`). Use Chalk or near-black.
- **No neon, no electric blue, no acid green.** This palette is warm and organic — keep it that way.
- Elevation is expressed via **background lightness delta only** — no drop shadows, no blur, no glow.
- Max **2 elevation layers** on screen at once.

### Semantic Assignment

```
Primary CTA / active state    → #933B5B (Amaranth)
Hover / focus ring / badge    → #B5728A (Thulian Pink)
Borders / dividers / tags     → #AABAAE (Brook Green)
Warm cards / reading surfaces → #E3D6BF (Chalk)
Timestamps / metadata         → #9F9679 (Pomelo Olive)
```

---

## Typography

| Role     | Family                             | Size      | Weight | Notes                          |
|----------|------------------------------------|-----------|--------|--------------------------------|
| Display  | `Cormorant Garamond, serif`        | 48–64px   | 300    | Headlines only. Use sparingly. |
| Body     | `Inter, system-ui, sans-serif`     | 14–16px   | 400    | `line-height: 1.7`             |
| Mono     | `JetBrains Mono, monospace`        | 12–13px   | 400    | Metrics, code, dates, tags     |

### Typography Rules
- **Sentence case always.** No ALL CAPS except micro-labels (≤ 4 chars, e.g. `PRO`, `NEW`).
- No mid-sentence bold. Bold is for headings and labels only.
- Display font (`Cormorant`) is used with restraint — 1–2 instances per page maximum.

---

## Borders & Surfaces

```css
/* Default border */
border: 0.5px solid rgba(170, 186, 174, 0.2);

/* Hover / Focus border */
border: 0.5px solid #AABAAE;
box-shadow: 0 0 0 3px rgba(170, 186, 174, 0.1);

/* Corner radius */
--radius-control: 6px;
--radius-card: 12px;
--radius-modal: 16px;
--radius-pill: 99px;
```

---

## Backgrounds (CSS Variables)

```css
:root {
  --bg-canvas:  #0f0d0c;
  --bg-card:    #1a1614;
  --bg-modal:   #231f1c;
  --bg-hover:   #201c19;

  --accent-primary:   #933B5B;
  --accent-secondary: #B5728A;
  --accent-neutral:   #AABAAE;
  --accent-warm:      #E3D6BF;
  --accent-muted:     #9F9679;

  --text-primary:   #E3D6BF;
  --text-secondary: #AABAAE;
  --text-muted:     #9F9679;
}
```

---

## Buttons

```tsx
// Primary (one per view)
<button className="bg-[#933B5B] text-[#E3D6BF] px-5 py-2.5 rounded-[6px]
  font-mono text-sm tracking-wide transition-all duration-200
  hover:bg-[#B5728A] hover:scale-[1.02] active:scale-[0.98]">
  Create project
</button>

// Ghost / secondary
<button className="border border-[rgba(170,186,174,0.3)] text-[#AABAAE]
  px-5 py-2.5 rounded-[6px] font-mono text-sm tracking-wide
  transition-all duration-200 hover:border-[#AABAAE] hover:text-[#E3D6BF]
  hover:bg-[rgba(170,186,174,0.05)]">
  Cancel
</button>
```

---

## Tags / Chips

No hard backgrounds. Use 12% opacity fill + 30% opacity border of the role color.

```tsx
// Amaranth chip
<span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono
  tracking-[0.05em] bg-[rgba(147,59,91,0.12)]
  border border-[rgba(147,59,91,0.3)] text-[#933B5B]">
  primary
</span>

// Brook Green chip
<span className="inline-block px-2 py-0.5 rounded text-[11px] font-mono
  tracking-[0.05em] bg-[rgba(170,186,174,0.12)]
  border border-[rgba(170,186,174,0.3)] text-[#AABAAE]">
  neutral
</span>
```

---

## Icons

- Use **`lucide-react`** only.
- Size: `16px` inline · `20px` card icons · `24px` section icons.
- Stroke width: `1.5` (never filled).
- Color: inherit or apply palette role tokens.

```tsx
import { ArrowRight, Sparkles, Leaf } from "lucide-react";

<ArrowRight className="w-4 h-4 text-[#933B5B]" strokeWidth={1.5} />
<Sparkles  className="w-5 h-5 text-[#B5728A]" strokeWidth={1.5} />
<Leaf      className="w-5 h-5 text-[#AABAAE]" strokeWidth={1.5} />
```

---

## Animation System (GSAP)

Install:
```bash
npm install gsap
```

### Motion Tokens

| Token           | Value                              | Use case                        |
|-----------------|------------------------------------|---------------------------------|
| `dur.fast`      | `0.2s`                             | Hover micro-interactions        |
| `dur.base`      | `0.4s`                             | Card reveals, fades             |
| `dur.slow`      | `0.8s`                             | Hero entrance, section reveals  |
| `ease.out`      | `power2.out`                       | Most transitions                |
| `ease.soft`     | `power1.inOut`                     | Gentle fades                    |
| `ease.display`  | `expo.out`                         | Display type entrances          |

---

### Page Load — Hero Entrance

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HeroSection() {
  const headlineRef = useRef(null);
  const subRef      = useRef(null);
  const ctaRef      = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(headlineRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.9 }
    )
    .fromTo(subRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.5"
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4 },
      "-=0.3"
    );
  }, []);

  return (
    <section>
      <h1 ref={headlineRef} style={{ opacity: 0 }}>Your headline</h1>
      <p  ref={subRef}      style={{ opacity: 0 }}>Supporting copy</p>
      <div ref={ctaRef}     style={{ opacity: 0 }}>
        <button>Get started</button>
      </div>
    </section>
  );
}
```

---

### Scroll-Triggered Section Reveals (ScrollTrigger)

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function RevealSection({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    gsap.fromTo(ref.current,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div ref={ref} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
```

---

### Staggered Card Grid

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CardGrid({ cards }) {
  const gridRef = useRef(null);

  useEffect(() => {
    const cards = gridRef.current.querySelectorAll(".card");
    gsap.fromTo(cards,
      { opacity: 0, y: 24, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="card" style={{ opacity: 0 }}>
          {card}
        </div>
      ))}
    </div>
  );
}
```

---

### Hover Micro-Interaction (vanilla GSAP)

```tsx
import { useRef } from "react";
import gsap from "gsap";

export function HoverCard({ children }) {
  const ref = useRef(null);

  const onEnter = () =>
    gsap.to(ref.current, {
      y: -4,
      borderColor: "#AABAAE",
      duration: 0.2,
      ease: "power1.out",
    });

  const onLeave = () =>
    gsap.to(ref.current, {
      y: 0,
      borderColor: "rgba(170,186,174,0.2)",
      duration: 0.2,
      ease: "power1.out",
    });

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        background: "#1a1614",
        border: "0.5px solid rgba(170,186,174,0.2)",
        borderRadius: 12,
        padding: "1.25rem",
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
}
```

---

### Text Character Reveal (SplitText)

> Requires GSAP Club (SplitText plugin) — use a free alternative with manual char splitting if needed.

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

function splitToChars(el) {
  const text = el.textContent;
  el.innerHTML = text
    .split("")
    .map(c => `<span class="char" style="display:inline-block">${c === " " ? "&nbsp;" : c}</span>`)
    .join("");
  return el.querySelectorAll(".char");
}

export function RevealHeadline({ text }) {
  const ref = useRef(null);

  useEffect(() => {
    const chars = splitToChars(ref.current);
    gsap.fromTo(chars,
      { opacity: 0, y: 20, rotateX: -40 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "expo.out",
        stagger: 0.025,
        delay: 0.2,
      }
    );
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: 56,
        fontWeight: 300,
        color: "#E3D6BF",
        perspective: 400,
      }}
    >
      {text}
    </h1>
  );
}
```

---

### Accent Line Draw (SVG stroke animation)

```tsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function AccentDivider() {
  const lineRef = useRef(null);

  useEffect(() => {
    const length = lineRef.current.getTotalLength();
    gsap.set(lineRef.current, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
    gsap.to(lineRef.current, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: lineRef.current,
        start: "top 90%",
      },
    });
  }, []);

  return (
    <svg width="100%" height="2" viewBox="0 0 400 2">
      <line
        ref={lineRef}
        x1="0" y1="1" x2="400" y2="1"
        stroke="#933B5B"
        strokeWidth="1"
      />
    </svg>
  );
}
```

---

## Animation Anti-Rules

```
✕  No bouncing / spring physics (cubic-bezier only, or GSAP power/expo eases)
✕  No infinite looping animations in UI chrome
✕  No more than one entrance animation per section
✕  No blur/scale-down on exit — fade out only
✕  No stagger > 0.12s between siblings (feels sluggish)
✕  Always respect prefers-reduced-motion
```

### Reduced Motion Guard

```tsx
const prefersReducedMotion =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  gsap.fromTo(ref.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 });
} else {
  gsap.set(ref.current, { opacity: 1, y: 0 });
}
```

---

## Anti-Rules (What This Aesthetic Is Not)

```
✕  No neon / cyber accents
✕  No electric blue, hot pink, acid green
✕  No heavy drop shadows or depth blur
✕  No glass / frosted panels (backdrop-filter)
✕  No uppercase body text
✕  No pure white (#fff) — use Chalk (#E3D6BF) or near-white instead
✕  No pure black — use warm near-black (#0f0d0c) as the canvas floor
✕  No more than one Amaranth CTA per view
```

---

## Tailwind Config Additions

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        amaranth:    "#933B5B",
        thulian:     "#B5728A",
        brook:       "#AABAAE",
        chalk:       "#E3D6BF",
        pomelo:      "#9F9679",
        canvas:      "#0f0d0c",
        "card-bg":   "#1a1614",
        "modal-bg":  "#231f1c",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        control: "6px",
        card:    "12px",
        modal:   "16px",
      },
    },
  },
};
```

---

*Last updated: June 2026 — Soft Editorial Dark Studio system.*

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