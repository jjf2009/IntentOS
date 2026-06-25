/**
 * @file tambo.ts
 * @description Central registry for Tambo AI components (AGENTS.md).
 *
 * Register ONLY generative components used by Crisis Mode here.
 * Every Tambo component MUST have a strict Zod propsSchema.
 *
 * Keep tools empty for MVP (no external services needed).
 */

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
  // CrisisTimeline registered in Module 4
  // FocusBlocker registered in Module 5
];
