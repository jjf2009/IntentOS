# Last-Minute Life Saver — Hackathon Winning Plan

**Goal**: Adapt and extend the existing IntentOS / Crisis Mode project into a compelling "Last-Minute Life Saver" — an AI-powered productivity companion that turns last-minute panic into immediate, actionable rescue plans. Leverage the current Tambo-powered generative UI (CrisisTimeline + FocusBlocker) as the core differentiator.

**Problem Fit**: This is an *extremely strong* match. The current brain-dump → strict timeline → focus isolation flow directly solves "missed deadlines, assignments, meetings" by forcing meaningful action instead of passive reminders.

**Current Project State (as of latest implementation)**:
- Single-page dark "War Room" with natural language brain-dump input
- TamboProvider + generative streaming
- Registered CrisisTimeline (Zod schema, interactive blocks, progress, urgency colors, useTamboComponentState)
- Registered FocusBlocker (live countdown timer, checklist, extend/complete)
- Basic demo integration (activate focus from timeline samples)
- High-stakes aesthetic (zinc-950, mono timers, red/amber/emerald accents)
- Stateless, client-only

**Philosophy**: Stay true to root AGENTS.md where it makes sense (simple, no new major libs, stateless useState, Tambo for generative components, war-room visual impact). Optimize aggressively for hackathon demo impact, judge wow-factor, and clear problem-solution narrative.

---

## Why This Can Win

1. **Unique Tech**: Most entries will be forms + LLM text. You have **live, interactive, AI-generated UI components** (Tambo) that feel magical.
2. **Perfect Problem-Solution**: Directly addresses the pain of "I know I should have started earlier".
3. **Action-Oriented** (not passive reminders): Timeline + FocusBlocker force execution.
4. **Demo Gold**: Real ticking timers, clicking to focus, check-offs, urgency visuals.
5. **Versatile**: Works for students (assignments), professionals (meetings), entrepreneurs (pitches/payments).

---

## Recommendations: What Else to Add to Win

**High-Impact Additions** (prioritized for effort vs. demo power):

### Must-Do / High Leverage
- **Rebrand & Narrative Polish**: Rename title/copy to "Last-Minute Life Saver" or "IntentOS - Deadline Rescue". Update hero text, examples, footer. Add "Saved X deadlines today" counter (ephemeral).
- **Smart Deadline Extraction**: Improve the prompt + simple client-side regex/time parsing to pull out "in 3 hours", "tomorrow 9am", "by Friday". Pre-fill timeline duration automatically.
- **Pre-loaded Killer Examples**: 4-5 big clickable "Try this scenario" buttons (student assignment due in 4h, client meeting in 90min, bill due tomorrow, interview in 2 days). Judges love one-click demos.
- **Impact & Celebration**: When blocks are completed or time saved, show a "You just saved your ass" victory state with fake stats ("3 hours of panic avoided").
- **Voice Brain-Dump**: Integrate the existing dictation-button.tsx or add simple Web Speech API for voice input (huge for demo).

### Strong Differentiators
- **Multi-Commitment Parser**: One dump can contain several things ("exam + group project + pay rent"). Generate a master timeline that respects all deadlines and prioritizes intelligently.
- **Risk + "What If" Analysis**: Each block in the timeline shows "Risk if skipped" + AI-suggested alternatives ("What if I only do the top 3 slides?").
- **Simulated Calendar / Commitments View**: A nice side panel showing extracted commitments as cards that "sync" with the timeline.
- **Proactive Micro-Actions**: After generating timeline, the AI suggests the *very next* 5-minute action you can do right now.
- **FocusBlocker Enhancements**: Real-time "time remaining vs tasks left" warning. "Autopilot" mode that advances checklist as time passes.
- **Recurring Rescue**: Detect if this is a recurring problem ("I always do this") and generate a prevention mini-plan.

### Polish & Judging
- Beautiful animated timers and progress.
- Keyboard shortcuts everywhere.
- 3 crisp 60-second demo scripts for different judge types.
- "Before vs After" story in README or a small slide.
- Edge cases handled gracefully (impossible deadline → honest "you need to negotiate or cut scope").

**Avoid**: Real calendar OAuth, databases, heavy new libs, complex state management. Keep it fast to demo.

---

## Recommended Plan (Incremental, Demo-First)

Build on top of what's already working. Deliverable after each phase is a runnable, impressive state.

### Phase 1: Rebrand + Narrative (1-2 hours)
- Update titles, descriptions, examples, footer to directly match "Last-Minute Life Saver".
- Add ephemeral "Rescues Today: 3" counter + celebration banner.
- Create 4-5 pre-filled scenario buttons.
- Update README with hackathon problem statement + why this wins.

**Verification**: Open app — feels like it's built *for* this exact problem.

### Phase 2: Smarter Input & Extraction (2-3 hours)
- Enhance the launch prompt with better deadline/time extraction instructions.
- Add lightweight client-side parsing for common phrases (use date-fns or simple regex if no new dep; otherwise pure prompt engineering).
- When user types "due in 3 hours", pre-set the timeline deadline.
- Add "I have X hours" quick presets.

**Verification**: Type a natural sentence → timeline duration makes sense without manual editing.

### Phase 3: Voice + Immediate Impact (1-2 hours)
- Wire in voice input (use existing dictation component or Web Speech).
- Add "You rescued this deadline" celebration UI with nice animation and fake impact metrics.
- Make the "NEW CRISIS" / reset feel like starting a new rescue.

**Verification**: Speak a panic scenario → beautiful timeline appears → complete it → satisfying win state.

### Phase 4: Generative Flow Polish + Flow Integration (3-4 hours)
- Improve real generative experience: better system-style prompt prefix.
- Make clicking a block in a real CrisisTimeline (when streamed) actually open a FocusBlocker for that specific block (use component state or follow-up message).
- Add a simple "Commitments" sidebar that lists extracted items.
- When user marks blocks done in FocusBlocker, update progress in the main timeline if possible (via shared thread or local sync).

**Verification**: Full loop works end-to-end with real Tambo streaming (or excellent samples).

### Phase 5: Winning Features & Multi-Commitment (3-4 hours)
- Add one "Multi-Commitment" mode: dump containing several things → master prioritized plan.
- Add Risk/Alternative suggestions as a small additional generative component or section.
- "Next 5-min action" call-to-action after timeline.
- Polish timers, colors, empty states, loading.

**Verification**: One brain dump can rescue a whole day.

### Phase 6: Demo Mastery + Final Polish (2-3 hours)
- Create 3 ready-to-run demo scripts.
- Add keyboard shortcuts (space to check, esc to exit focus).
- Tweak visuals for maximum impact (bigger timers, subtle animations if possible without new libs).
- Remove or clearly label "demo samples" vs live generative.
- Final README + one-pager for judges.
- Test with real panic scenarios from different personas.

**Verification**: Anyone can sit down and be impressed in 90 seconds.

---

## Key Files to Touch

- `src/app/page.tsx` — main UI, rebranding, scenarios, integration logic, victory states
- `src/app/layout.tsx` + `globals.css` — titles, subtle aesthetic tweaks if needed
- `src/lib/tambo.ts` — possibly add 1-2 small new generative components (e.g. RiskCard, CommitmentList)
- `src/components/tambo/` — new small components if useful (keep to tambo/ folder)
- Existing `crisis-timeline.tsx` and `focus-blocker.tsx` — minor enhancements (e.g. better onActivate support)

---

## Risks & Decisions

- **Real AI vs Samples**: Have both excellent hardcoded samples (for reliability in judging) *and* live Tambo path.
- **Deadline Parsing**: If pure prompt engineering isn't reliable enough, consider a very small pure-JS helper (no new lib).
- **Scope Creep**: Stick to "one panic → rescue plan → focused execution" as the hero flow. Add-ons should support this.
- **Tambo Dependency**: Make sure key is easy to set. Document clearly.

---

## Winning Demo Script (Example)

1. Judge: "Tell me about your project."
2. You: "This is the Last-Minute Life Saver. Watch what happens when a student panics 4 hours before a presentation."
3. Click example or speak/type realistic dump.
4. Show beautiful generative timeline appear.
5. Click a block → FocusBlocker opens with live timer.
6. Check a few things, extend time, complete.
7. Big win state: "You just saved it."
8. "Imagine this instead of ignoring another reminder."

---

**Next step**: Approve this plan (or give feedback). Then we can execute phase by phase.

This positions the *existing strong work* as the foundation for a differentiated, visually impressive, problem-solving entry.

---

## Context

Current project is a Tambo template with:
- Multi-page architecture (/, /chat, /interactables)
- Landing (Hero, Navbar, Footer, About, FAQ)
- Existing `IntentWorkflow` + intent contract system (internship demo)
- Heavy/unnecessary deps (Supabase SSR, TipTap, Recharts, Framer Motion, Streamdown, etc.)
- Full chat UI primitives + MCP + auth middleware remnants
- Mixed light/dark styling

AGENTS.md requires:
- Single-page MVP (`src/app/page.tsx`)
- `src/components/tambo/` **only** for generative AI components (`crisis-timeline.tsx`, `focus-blocker.tsx`)
- `src/lib/tambo.ts` as the **central** registry with Zod schemas
- Strict "War Room" dark UI (`bg-zinc-950`, `border-zinc-800`, `font-mono` timers, urgency colors: red/amber/green)
- Tambo for dynamic component streaming
- Completely stateless + client-side only

The rebuild will delete or archive old demo code and produce a focused, visually impactful demo.

---

## Recommended Approach (Chosen)

1. **Incremental modules** for review after each (user requested). Each module ends in working, lint-clean state.
2. **Reuse**:
   - TamboProvider + registration pattern (`src/app/chat/page.tsx:40`, `src/lib/tambo.ts`)
   - Hook patterns: `useTamboThread`, `useTamboThreadInput`, `useTamboComponentState` (see `intent-workflow.tsx:285`, `card-data.tsx:58`)
   - `cn()` utility (`src/lib/utils.ts`)
   - Zod + TamboComponent/TamboTool types (`src/lib/tambo.ts`)
   - lucide-react icons
   - Message rendering concepts (e.g. `MessageRenderedComponentArea` from `message.tsx`) for streaming components
3. **Do NOT reuse** for core Crisis: old `IntentWorkflow`, `intent-contract`, Gemini prompts, population tools, graph.tsx, full heavy chat chrome. Only pull in the absolute minimum tambo primitives (e.g. `MessageRenderedComponentArea` or basic input hooks) if a pure custom implementation would be slower — justify in the module. Prefer custom lean UI in `page.tsx`.
4. **UI first, then wire**: Build the visual war room shell → input → then Tambo generative components.
5. **Generation strategy**:
   - Simple dedicated brain-dump textarea + prominent submit (custom, not the full heavy message-thread UI).
   - Send message via Tambo hooks (`useTamboThread` / `useTamboThreadInput`).
   - AI uses registered `CrisisTimeline` / `FocusBlocker` (excellent `description` + strict Zod schema in tambo.ts guide the model).
   - Render generated components prominently in a dedicated "War Room Canvas" area by leveraging `MessageRenderedComponentArea` (from `message.tsx`) or extracting rendered components. Avoid showing raw message list unless it helps demo.
   - Keep a minimal follow-up input for refinements ("shorten phase 2", "focus on X").
6. **State**: Pure React `useState` + `useTamboComponentState` inside generative components. No persistence.
7. **Cleanup last**: Remove routes, unused components, dead imports, Supabase references in final module.
8. **No new libs**. Leverage existing Tambo + Tailwind + lucide. Recharts/graph can be removed if unused in Crisis.

**Tradeoff accepted**: We will keep a subset of stable tambo UI primitives (input basics, scroll container, message areas) only as needed for a lean thread-backed generation. The generative components themselves live strictly in `components/tambo/`.

---

## Module Breakdown (Build & Review One-by-One)

### Module 1: Project Reset + Architecture Alignment + Base Styling

**Why first**: Establish the exact folder + single-page contract before any features.

**Files to modify/create**:
- `src/app/layout.tsx` — Set dark base, update `<title>IntentOS: Crisis Mode</title>`, meta. TamboProvider can live here or in page (MVP decision).
- `src/app/page.tsx` — Replace entire landing with War Room shell skeleton (header bar, brain-dump section placeholder, canvas placeholder). No hero/about/faq/navbar/footer.
- `src/app/globals.css` — Add War Room theme tokens, enforce `bg-zinc-950` `border-zinc-800`, `font-mono` for timers, urgency colors. Dark-only.
- `src/lib/tambo.ts` — Strip old tools/components. Keep structure + empty `components` + `tools` arrays. Add comments for Crisis ones.
- Delete or empty: `src/app/chat/`, `src/app/interactables/`, `src/components/hero/`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/middleware.ts`, `src/lib/supabase/`, `src/lib/intent/`, `src/services/`.
- `example.env.local` — Clean to only Tambo key + comment.
- `README.md` — Minimal update in later module (or stub).
- `src/components/ApiKeyCheck.tsx` — Keep temporarily or inline simple key check in page.

**Key actions**:
- Force `dark` class / zinc-950 base everywhere.
- Ensure single route only.
- Add basic "high stakes" header (logo + "CRISIS MODE" + timer hint).
- No auth. Pure client components (`"use client"` on page).

**Verification**:
- `npm run dev` — loads single dark page at `/`.
- `npm run lint` clean.
- No console errors about missing routes.
- Visual: deep dark zinc, sharp borders.
- Folder check: `src/` contains only `app/`, `components/tambo/` (empty or minimal), `lib/` . No hero/, no chat/ etc. at end of module.

**Reuse**: Layout pattern, TamboProvider wiring example from `chat/page.tsx`.

---

### Module 2: Brain-Dump Input (Standalone UI)

**Goal**: The natural language entry point. Smallest useful.

**Files**:
- `src/app/page.tsx` — Add large, prominent `<textarea>` + "Launch War Room" / submit button.
- New small pure UI if needed (but keep inline per "Keep classes inline unless abstracting").
- Use lucide `AlertTriangle`, `Timer`.

**Behavior**:
- Placeholder: "Brain-dump your crisis... (e.g. 'Client presentation in 75 minutes. I have zero slides, data is scattered across 4 emails, boss is calling in 20 min...')"
- Optional quick-adds: "I have __ minutes/hours" hints (AI will parse natural language anyway).
- Loading state on submit ("Analyzing situation...").
- Clear visual urgency (red accents on critical elements).
- On submit: capture text, clear or keep for reference.

**Verification**:
- Input accepts multi-line text.
- Submit button disabled on empty.
- Basic keyboard (Enter+Cmd/Ctrl to submit).
- Looks "high stakes".

**No Tambo yet** — pure UI + state.

---

### Module 3: Tambo Integration — Provider + Message Sending

**Goal**: Wire the brain-dump to Tambo so the model can respond and stream components.

**Files**:
- `src/app/page.tsx` or new `src/app/layout.tsx` — Wrap War Room content with `<TamboProvider apiKey=... components={...} tools={[]}>`.
- Add minimal hook usage: `useTamboThread`, `useTamboThreadInput`.
- On submit: `sendMessage(brainDumpText)` (or prefixed: "CRISIS MODE: Create strict time-bound timeline for this situation: ...").
- Handle generation state (`isGenerating`).
- Show basic streamed assistant text initially.
- Error handling for missing key (simple banner, reuse pattern from `chat/page.tsx` and `ApiKeyCheck.tsx`).

**Files touched**:
- `src/lib/tambo.ts` — ensure export ready.
- Possibly reuse tiny bits: `ScrollableMessageContainer` or `MessageInput` if it speeds a minimal follow-up input (decide in impl).

**Verification**:
- Enter brain dump → Tambo processes (requires valid `NEXT_PUBLIC_TAMBO_API_KEY`).
- See assistant response text appear.
- No full chat bloat visible yet.
- `npm run lint && npm run build` (typecheck).

**Note**: If full thread chrome leaks, we will suppress in later modules.

---

### Module 4: CrisisTimeline Generative Component (Core)

**Create**:
- `src/components/tambo/crisis-timeline.tsx`

**Requirements (strict)**:
- Export `CrisisTimeline` + `crisisTimelineSchema` (Zod).
- Props (example):
  ```ts
  {
    deadlineMinutes: number,
    totalDuration: number,
    summary: string,
    blocks: Array<{
      id: string,
      title: string,
      durationMinutes: number,
      description: string,
      tasks?: string[],
      urgency: "catastrophic" | "critical" | "active"
    }>
  }
  ```
- Visual:
  - Strict timeline (vertical cards or segmented bar).
  - `font-mono` for all times/countdowns.
  - Progress bar using **inline style** only for dynamic width.
  - Color by urgency (Neon Red `#ef4444` or zinc-red for catastrophic, Amber for critical, Cyber Green for active).
  - Total remaining time header.
- Interactive (minimal): Click a block → "activate" (will wire to FocusBlocker later). Local checkmarks using `useTamboComponentState` for persistence inside the component instance.
- Keep extremely simple and readable. No clever abstractions.

**Files**:
- Register in `src/lib/tambo.ts` with description that tells the model exactly when/how to use it ("Use this for any time-bound crisis execution plan... Always include realistic minute allocations...").

**Verification**:
- Temporarily hard-code a sample timeline in page to render it (before full streaming).
- AI call produces a real `CrisisTimeline` in the rendered area.
- Looks sharp in dark zinc.

**Do not** implement FocusBlocker yet.

---

### Module 5: FocusBlocker Generative Component

**Create**:
- `src/components/tambo/focus-blocker.tsx`

**Requirements**:
- Zod schema: `focusBlockerSchema` (id, title, durationMinutes or endTime, description, checklist items?).
- "Isolation" view: Large focused task title, big countdown (live `setInterval` + `useState` — ephemeral), description, sub-steps checklist.
- Buttons: "Mark Complete & Advance", "Extend 5 min", "Exit Focus (return to timeline)".
- Use `font-mono`, high contrast (zinc + one strong accent).
- Can be triggered from Timeline (the generative components can coordinate via shared thread state or parent page state + re-rendering via Tambo).
- Or: When user clicks "Focus" on a CrisisTimeline block, the page sends a follow-up message or uses component state to surface the FocusBlocker.

**Verification**:
- Standalone render test.
- Timer ticks accurately and cleans up.
- Checkbox interactions work (useTamboComponentState).

---

### Module 6: End-to-End Generative Flow + Focus Integration

**Connect everything**:
- `src/app/page.tsx` becomes the full War Room:
  - Brain-dump header/input (Module 2).
  - Prominent "Canvas" area showing latest `CrisisTimeline` (use `MessageRenderedComponentArea` or direct component render when available).
  - When a block is activated → render/switch to prominent `FocusBlocker`.
  - Small persistent "Refine" input at bottom or side for follow-ups ("make phase 1 shorter", "add buffer").
- Store minimal ephemeral page state: `activeFocusId`, `completedBlockIds` (useState). Generative components can read/write via their own `useTamboComponentState` keyed by thread + intent.
- Global deadline countdown (derived from timeline).
- On complete all blocks → victory state (simple "Crisis contained" banner + "New Crisis" reset button that clears thread state).

**Key files**:
- `src/app/page.tsx` (main work)
- `src/lib/tambo.ts` (register both)
- Tweak CSS.

**Verification**:
- Full loop: paste realistic panic text → see timeline generated by AI → click block → FocusBlocker appears with ticking timer → check tasks → advance.
- Refinement messages update timeline if model supports.
- All state resets on hard refresh (stateless).
- No errors in console.

---

### Module 7: Polish, Timers, Urgency, Edge Polish

**Aesthetic & UX hardening** (AGENTS UI rules):
- Every timer/countdown: `font-mono`.
- Dynamic progress bars: only inline `style={{ width: 'xx%' }}`.
- Urgency logic: remaining time drives colors (e.g. < 20% → red pulse).
- Empty / loading / error states for war room.
- Keyboard: Esc to exit focus, space to check current task?
- Responsive: usable on laptop (primary target).
- Big impactful numbers.
- Add lucide icons throughout (`Timer`, `AlertTriangle`, `CheckCircle`, `Target`, `Clock`).
- Subtle borders, clean cards (`border-zinc-800`).

**Optional small enhancements** (only if repetition):
- Simple total elapsed vs remaining.
- "Panic add 15 min" button (sends instruction to model).

**Verification**:
- Visual audit against AGENTS "UI Rules" + "Styling Rules".
- Timers accurate, no memory leaks.
- `npm run lint` zero issues.

---

### Module 8: Cleanup + Final Hardening

**Purge**:
- Delete old routes, hero components, intent/, supabase/, services/, unused tambo files (graph, intent-*, text-editor, mcp-*, etc.).
- Remove or comment heavy package deps where safe (document decision).
- Clean `example.env.local`, `README.md` (rewrite brief Crisis-focused version).
- Remove any remaining light-mode classes or old CSS.
- Ensure no `any`, strict types.
- Update root `page.tsx` comments / KeyFiles if needed (or delete section).
- Final pass: re-read AGENTS.md and confirm compliance.

**Verification**:
- `npm run build` succeeds.
- `npm run lint` clean.
- Manual E2E demo with 2-3 realistic crisis brain-dumps.
- Cold reload still works (no persisted state).
- Only the allowed files exist under `src/`.
- Tambo key is the only required secret.

---

## Critical Files (Final State)

| Path | Role | Notes |
|------|------|-------|
| `src/app/layout.tsx` | Root HTML + TamboProvider wrapper | Dark, minimal |
| `src/app/page.tsx` | **The entire MVP** | Brain input + War Room canvas + focus |
| `src/app/globals.css` | War Room theme | Zinc dark + mono + accents |
| `src/lib/tambo.ts` | **Central registry** | CrisisTimeline + FocusBlocker + Zod |
| `src/components/tambo/crisis-timeline.tsx` | Generative timeline | New, Zod + useTamboComponentState |
| `src/components/tambo/focus-blocker.tsx` | Generative focus UI | New |
| `src/lib/utils.ts` | `cn()` | Keep |
| `public/logo.png` | Favicon | Optional reuse |

**Files to delete** (in Module 1 + 8): `chat/`, `interactables/`, `hero/`, `Navbar.tsx`, `Footer.tsx`, most of `components/tambo/*` (keep ONLY `crisis-timeline.tsx`, `focus-blocker.tsx`, and the absolute minimum primitives required for rendering — prefer none), `lib/intent/`, `lib/supabase/`, `middleware.ts`, `services/`. Keep `lib/utils.ts` and any tiny pure helpers.

---

## Existing Code to Reuse (with paths)

- TamboProvider setup + apiKey guard: `src/app/chat/page.tsx:40-52`
- Component registration + Zod pattern: `src/lib/tambo.ts:90-113`
- Interactive state inside generative comp: `src/components/tambo/intent-workflow.tsx:288` (`useTamboComponentState`)
- `cn` + basic utils: `src/lib/utils.ts:4`
- Icon usage example + lucide import: `src/components/ui/card-data.tsx:7`
- Message component streaming area: `src/components/tambo/message.tsx:1000+` (`MessageRenderedComponentArea`)
- Schema examples: `src/lib/tambo.ts` and `src/components/ui/card-data.tsx`

**Do not** import or depend on old `IntentWorkflow`, `intent-contract.ts`, `graph.tsx`, population tools, `intent-message-renderer`, or heavy chat chrome in the final Crisis implementation.

---

## Verification Strategy (End-to-End)

1. Before starting each module: re-read `AGENTS.md`.
2. After every module:
   - `npm run dev`
   - Manual interaction + visual check vs UI Rules
   - `npm run lint`
   - `npm run build` (type + lint clean at module boundaries)

3. Final demo script:
   - Load page → clean key guard if missing.
   - Paste realistic brain-dump: "I have a 2-hour board presentation. Slides are empty. Key metrics are in 3 different Notion pages. My co-founder is already in the room."
   - Expect: realistic phased timeline with minute allocations + urgency colors.
   - Activate first block → FocusBlocker with live ticking countdown (font-mono).
   - Check off 1-2 sub items.
   - Refine via follow-up: "add 10 min buffer to data collection".
   - Complete entire timeline → success state.
   - Hard refresh → all state gone.

4. Non-functional:
   - No Supabase calls, no middleware hits, no server components.
   - All state ephemeral client-only (`useState` + Tambo component state).
   - No `any`. Strict Zod schemas for every Tambo component.
   - Folder structure exactly as AGENTS: `src/app/page.tsx`, `components/tambo/` only for generative, `lib/tambo.ts` central.
   - Follows every bullet in AGENTS.md.

---

## Risks / Decisions for User

- **Generation UX**: We will use thread-backed generation for reliable component streaming. If too chat-like, we can later extract rendered components into a pure canvas (low risk).
- **Dep removal**: Will clean files first; `package.json` pruning (uninstall) can be done at end if desired — ask before `npm uninstall`.
- **Component coordination**: Timeline + FocusBlocker communicate via thread state + page `useState`. If Tambo offers better canvas patterns, we can adjust.
- **Prompting the model**: Good component `description` + schema is the lever. May need 1-2 example prompts in initial message.

**Next step after plan approval**: Start Module 1. Stop after each module for review.

---

**Plan created following AGENTS.md strictly. Ready for user review and approval.**
