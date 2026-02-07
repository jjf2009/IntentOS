"use client";

import { IntentWorkflow } from "@/components/tambo/intent-workflow";
import { extractIntent } from "@/lib/intent/extractIntent";
import type { IntentContract } from "@/lib/intent/intent-contract";
import type { TamboThreadMessage } from "@tambo-ai/react";
import { useTamboThread } from "@tambo-ai/react";
import * as React from "react";

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

type IntentExtractionStatus = "idle" | "extracting" | "error";

export function IntentThreadHeader() {
  const { thread } = useTamboThread();

  const [intent, setIntent] = React.useState<IntentContract | null>(null);
  const [status, setStatus] = React.useState<IntentExtractionStatus>("idle");
  const [lastError, setLastError] = React.useState<string | null>(null);
  const lastProcessedMessageId = React.useRef<string | null>(null);

  const lastUserMessage = React.useMemo(() => {
    const messages = thread?.messages ?? [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.role === "user") {
        return message;
      }
    }
    return null;
  }, [thread?.messages]);

  React.useEffect(() => {
    if (!lastUserMessage?.id) {
      return;
    }

    if (lastProcessedMessageId.current === lastUserMessage.id) {
      return;
    }

    lastProcessedMessageId.current = lastUserMessage.id;
    const text = contentToText(lastUserMessage.content).trim();

    if (!text) {
      return;
    }

    let cancelled = false;

    setStatus("extracting");
    setLastError(null);

    void (async () => {
      const result = await extractIntent(text);
      if (cancelled) {
        return;
      }

      if (result.ok) {
        setIntent(result.intent);
        setStatus("idle");
        return;
      }

      console.error("Intent extraction failed:", result);
      setStatus("error");
      setLastError(result.error);
      setIntent(null);
    })();

    return () => {
      cancelled = true;
    };
  }, [lastUserMessage]);

  if (!intent && status === "idle") {
    return null;
  }

  return (
    <div className="w-full">
      {intent ? (
        <IntentWorkflow intent={intent} className="mb-4" />
      ) : (
        <div className="mb-4 rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
          {status === "extracting" ? "Extracting intent…" : null}
          {status === "error"
            ? process.env.NODE_ENV === "development" && lastError
              ? `Intent extraction failed: ${lastError}`
              : "Intent preview unavailable."
            : null}
        </div>
      )}
    </div>
  );
}
