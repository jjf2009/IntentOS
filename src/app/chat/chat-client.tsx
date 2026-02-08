"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

export function ChatClient({ userId }: { userId: string }) {
  const mcpServers = useMcpServers();
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  return (
    <TamboProvider
      apiKey={apiKey!}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      autoGenerateThreadName={false}
    >
      <div className="h-screen">
        <MessageThreadFull className="max-w-4xl mx-auto" />
      </div>
    </TamboProvider>
  );
}
