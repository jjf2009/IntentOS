/**
 * @file tambo.ts
 * @description Central registry for Tambo AI components (AGENTS.md).
 *
 * Register ONLY generative components used by Crisis Mode here.
 * Every Tambo component MUST have a strict Zod propsSchema.
 *
 * Keep tools empty for MVP (no external services needed).
 */

import { CrisisTimeline, crisisTimelineSchema } from "@/components/tambo/crisis-timeline";
import { FocusBlocker, focusBlockerSchema } from "@/components/tambo/focus-blocker";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * tools
 * No tools needed for Crisis Mode MVP (stateless generative timeline only).
 */
export const tools: TamboTool[] = [];

/**
 * components
 * Crisis Timeline + Focus Blocker will be registered here.
 */
export const components: TamboComponent[] = [
  {
    name: "CrisisTimeline",
    description:
      "Use this for any high-stakes crisis. Converts a brain dump into a strict time-bound execution timeline. Always return realistic blocks with minute durations that add up to the available time. Prefer 4-7 blocks. Mark urgency appropriately. Include tasks when they help execution.",
    component: CrisisTimeline,
    propsSchema: crisisTimelineSchema,
  },
  {
    name: "FocusBlocker",
    description:
      "Use this when the user needs to isolate on a single active task from the timeline. Renders a high-focus isolation view with a live countdown timer, checklist, and controls to complete, extend time, or exit. Always tie the title and description to the currently active block.",
    component: FocusBlocker,
    propsSchema: focusBlockerSchema,
  },
];
