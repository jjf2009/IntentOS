// "use client";

import { ChatClient } from "@/app/chat/chat-client";
import { createSupabaseServerClient } from "@/app/supabase/server";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const hasTamboApiKey = !!process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!hasTamboApiKey) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="max-w-lg px-6 text-center">
          <div className="text-base font-semibold text-foreground">
            Missing Tambo API key
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Set <span className="font-mono">TAMBO_API_KEY</span> in your
            environment to use the chat.
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <TamboProvider
  //     apiKey={apiKey}
  //     components={components}
  //     tools={tools}
  //     tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
  //     mcpServers={mcpServers}
  //     autoGenerateThreadName={false}
  //   >
  //     <div className="h-screen">
  //       <MessageThreadFull className="max-w-4xl mx-auto" />
  //     </div>
  //   </TamboProvider>
  // );
  return <ChatClient userId={user.id} />
}
