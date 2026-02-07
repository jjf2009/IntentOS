import type { TamboThreadMessage } from "@tambo-ai/react";
import { z } from "zod";

const intentTypeSchema = z.enum([
  "goal_planning",
  "analysis",
  "tracking",
  "decision_support",
]);

const requiredComponentSchema = z.enum([
  "elicitation",
  "timeline",
  "task_list",
  "chart",
]);

const elicitationFieldSchema = z.object({
  key: z.string().min(1),
  type: z.enum(["string", "number", "integer", "boolean"]),
  required: z.boolean().default(false),
  description: z.string().optional(),
  enum: z.array(z.string()).optional(),
  default: z.union([z.string(), z.number(), z.boolean()]).optional(),
  minimum: z.number().optional(),
  maximum: z.number().optional(),
});

export const intentContractSchema = z.object({
  intent_id: z.string().min(1),
  intent_type: intentTypeSchema,
  summary: z.string().min(1),
  confidence: z.number().min(0).max(1),
  required_components: z.array(requiredComponentSchema),
  elicitation_schema: z
    .object({
      fields: z.array(elicitationFieldSchema),
    })
    .optional(),
  workflow_state: z.enum(["draft", "active", "completed"]),
});

export type IntentContract = z.infer<typeof intentContractSchema>;
export type IntentContractRequiredComponent = z.infer<
  typeof requiredComponentSchema
>;

function contentToText(content: TamboThreadMessage["content"]): string {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    const parts: string[] = [];
    for (const item of content) {
      if (item?.type === "text" && typeof item.text === "string") {
        parts.push(item.text);
      }
    }
    return parts.join(" ");
  }

  return "";
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  const withoutStart = trimmed.replace(/^```[a-zA-Z]*\n?/, "");
  return withoutStart.replace(/```\s*$/, "").trim();
}

function extractJsonObjectCandidate(text: string): string | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  return text.slice(start, end + 1);
}

export function parseIntentFromMessage(
  message: Pick<TamboThreadMessage, "role" | "content">,
): IntentContract | null {
  if (message.role !== "assistant") {
    return null;
  }

  const rawText = contentToText(message.content);
  const candidate = stripCodeFences(rawText);
  if (!candidate) {
    return null;
  }

  if (!candidate.includes('"intent_id"')) {
    return null;
  }

  try {
    const parsed = JSON.parse(candidate);
    const validated = intentContractSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    const extracted = extractJsonObjectCandidate(candidate);
    if (!extracted) {
      return null;
    }

    try {
      const parsed = JSON.parse(extracted);
      const validated = intentContractSchema.safeParse(parsed);
      return validated.success ? validated.data : null;
    } catch {
      return null;
    }
  }
}
