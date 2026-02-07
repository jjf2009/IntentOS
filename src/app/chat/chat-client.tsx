"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { GEMINI_INTENT_SYSTEM_PROMPT } from "@/lib/intent/gemini-intent-system-prompt";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

export function ChatClient({ userId }: { userId: string }) {
  const mcpServers = useMcpServers();

  return (
    <TamboProvider
      apiKey="unused"
      tamboUrl="/api/tambo"
      contextKey={userId}
      autoGenerateThreadName={false}
      components={components}
      tools={tools}
      mcpServers={mcpServers}
      initialMessages={[
        {
          role: "system",
          content: [{ type: "text", text: GEMINI_INTENT_SYSTEM_PROMPT }],
        },
      ]}
    >
      <div className="h-screen">
        <MessageThreadFull className="max-w-4xl mx-auto" />
      </div>
    </TamboProvider>
  );
}
