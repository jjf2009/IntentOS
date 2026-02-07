"use server";

import "server-only";

import { GEMINI_INTENT_SYSTEM_PROMPT } from "@/lib/intent/gemini-intent-system-prompt";
import {
  intentContractSchema,
  type IntentContract,
} from "@/lib/intent/intent-contract";
import TamboAI from "@tambo-ai/typescript-sdk";
import type {
  ChatCompletionContentPart,
  ThreadAdvanceByIDParams,
  ThreadAdvanceResponse,
} from "@tambo-ai/typescript-sdk/resources/beta";

export type ExtractIntentResult =
  | {
      ok: true;
      intent: IntentContract;
      rawOutput: string;
    }
  | {
      ok: false;
      error: string;
      rawOutput?: string;
    };

function getTextFromContentParts(parts: ChatCompletionContentPart[]): string {
  const textParts: string[] = [];
  for (const part of parts) {
    if (part.type === "text" && typeof part.text === "string") {
      textParts.push(part.text);
    }
  }
  return textParts.join("").trim();
}

function buildAdvanceParams(message: string): ThreadAdvanceByIDParams {
  const systemMessage: ThreadAdvanceByIDParams.InitialMessage = {
    role: "system",
    content: [{ type: "text", text: GEMINI_INTENT_SYSTEM_PROMPT }],
  };

  return {
    initialMessages: [systemMessage],
    messageToAppend: {
      role: "user",
      content: [{ type: "text", text: message }],
    },
  };
}

function parseAndValidateIntent(rawOutput: string): IntentContract | null {
  try {
    const parsed = JSON.parse(rawOutput) as unknown;
    const validated = intentContractSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}

async function runNonStreamingAdvance(
  client: TamboAI,
  params: ThreadAdvanceByIDParams,
): Promise<ThreadAdvanceResponse> {
  return client.post<ThreadAdvanceResponse>("/threads/advance", {
    body: params,
  });
}

/**
* Convert a raw user message into a validated `IntentContract`.
*
* This is intentionally non-streaming and strict: it must return a valid intent
* object, or a controlled failure.
*/
export async function extractIntent(rawUserMessage: string): Promise<ExtractIntentResult> {
  const apiKey =
    process.env.TAMBO_API_KEY ?? process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return {
      ok: false,
      error:
        "Missing TAMBO_API_KEY (or NEXT_PUBLIC_TAMBO_API_KEY). Cannot extract intent.",
    };
  }

  const client = new TamboAI({ bearer: apiKey });
  const cleaned = rawUserMessage.trim();

  if (!cleaned) {
    return { ok: false, error: "Empty user message." };
  }

  let lastRawOutput: string | undefined;

  for (let attempt = 0; attempt < 2; attempt++) {
    const attemptMessage =
      attempt === 0
        ? cleaned
        : `Original user input:\n${cleaned}\n\nYour previous output was invalid or did not match the schema:\n${lastRawOutput ?? ""}\n\nReturn corrected JSON only.`;

    try {
      const response = await runNonStreamingAdvance(
        client,
        buildAdvanceParams(attemptMessage),
      );
      const rawOutput = getTextFromContentParts(response.responseMessageDto.content);
      lastRawOutput = rawOutput;

      const validated = parseAndValidateIntent(rawOutput);
      if (validated) {
        return { ok: true, intent: validated, rawOutput };
      }

      console.error("Intent extraction produced invalid JSON:", {
        attempt: attempt + 1,
        rawUserMessage: cleaned,
        rawOutput,
      });
    } catch (error) {
      console.error("Intent extraction request failed:", {
        attempt: attempt + 1,
        error,
      });
    }
  }

  return {
    ok: false,
    error: "Intent extraction failed after 2 attempts.",
    rawOutput: lastRawOutput,
  };
}
