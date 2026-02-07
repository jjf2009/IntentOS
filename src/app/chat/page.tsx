"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { CHAT_SYSTEM_PROMPT } from "@/lib/intent/chat-system-prompt";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

/**
 * Home page component that renders the Tambo chat interface.
 *
 * @remarks
 * The `NEXT_PUBLIC_TAMBO_URL` environment variable specifies the URL of the Tambo server.
 * You do not need to set it if you are using the default Tambo server.
 * It is only required if you are running the API server locally.
 *
 * @see {@link https://github.com/tambo-ai/tambo/blob/main/CONTRIBUTING.md} for instructions on running the API server locally.
 */
export default function Home() {
  // Load MCP server configurations
  const mcpServers = useMcpServers();
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-lg px-6 text-center">
          <div className="text-base font-semibold text-foreground">
            Missing Tambo API key
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Set <span className="font-mono">NEXT_PUBLIC_TAMBO_API_KEY</span> in
            your environment to use the chat.
          </div>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={components}
      tools={tools}
      tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
      mcpServers={mcpServers}
      autoGenerateThreadName={false}
      initialMessages={[
        {
          role: "system",
          content: [{ type: "text", text: CHAT_SYSTEM_PROMPT }],
        },
      ]}
    >
      <div className="h-screen">
        <MessageThreadFull className="max-w-4xl mx-auto" />
      </div>
    </TamboProvider>
  );
}
