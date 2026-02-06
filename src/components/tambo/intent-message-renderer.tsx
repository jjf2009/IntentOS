"use client";

import { IntentWorkflow } from "@/components/tambo/intent-workflow";
import { parseIntentFromMessage } from "@/lib/intent/intent-contract";
import type { TamboThreadMessage } from "@tambo-ai/react";
import * as React from "react";

export function IntentMessageRenderer({
  message,
}: {
  message: Pick<TamboThreadMessage, "role" | "content">;
}) {
  const intent = React.useMemo(
    () => parseIntentFromMessage(message),
    [message],
  );

  if (!intent) {
    return null;
  }

  return (
    <div className="w-full pt-2">
      <IntentWorkflow intent={intent} />
    </div>
  );
}
