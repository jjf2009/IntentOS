import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT_ID = "supabase";

type ThreadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string | null;
  metadata: Record<string, unknown> | null;
};

type MessageRow = {
  id: string;
  thread_id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: unknown;
  component_state: Record<string, unknown> | null;
  additional_context: Record<string, unknown> | null;
  component: Record<string, unknown> | null;
  tool_call_request: Record<string, unknown> | null;
  tool_calls: unknown[] | null;
  tool_call_id: string | null;
  parent_message_id: string | null;
  reasoning: unknown;
  reasoning_duration_ms: number | null;
  error: string | null;
  is_cancelled: boolean | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

function getTamboBaseUrl(): string {
  return (
    process.env.TAMBO_AI_BASE_URL ??
    process.env.TAMBO_URL ??
    process.env.NEXT_PUBLIC_TAMBO_URL ??
    "https://api.tambo.co"
  );
}

function getTamboApiKey(): string | null {
  return process.env.TAMBO_API_KEY ?? null;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function threadFromRow(row: ThreadRow, userId: string) {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    projectId: PROJECT_ID,
    name: row.name ?? undefined,
    metadata: row.metadata ?? undefined,
    contextKey: userId,
    generationStage: "IDLE",
    statusMessage: "",
  };
}

function messageFromRow(row: MessageRow) {
  return {
    id: row.id,
    threadId: row.thread_id,
    role: row.role,
    content: row.content,
    createdAt: row.created_at,
    componentState: row.component_state ?? {},
    additionalContext: row.additional_context ?? undefined,
    component: row.component ?? undefined,
    toolCallRequest: row.tool_call_request ?? undefined,
    tool_calls: row.tool_calls ?? undefined,
    tool_call_id: row.tool_call_id ?? undefined,
    parentMessageId: row.parent_message_id ?? undefined,
    reasoning: (row.reasoning ?? undefined) as never,
    reasoningDurationMS: row.reasoning_duration_ms ?? undefined,
    error: row.error ?? undefined,
    isCancelled: row.is_cancelled ?? undefined,
    metadata: row.metadata ?? undefined,
  };
}

async function tamboFetch(pathname: string, init: RequestInit) {
  const apiKey = getTamboApiKey();
  if (!apiKey) {
    throw new Error(
      "Missing TAMBO_API_KEY. Set it in .env.local (server-side, not NEXT_PUBLIC).",
    );
  }

  const url = new URL(pathname, getTamboBaseUrl());
  const headers = new Headers(init.headers);
  headers.set("x-api-key", apiKey);
  headers.set("accept", "text/event-stream");

  return fetch(url, {
    ...init,
    headers,
  });
}

function getFirstUserMessageText(messages: Array<{ role: string; content: any }>) {
  for (const msg of messages) {
    if (msg.role !== "user") continue;
    const text = Array.isArray(msg.content)
      ? msg.content
          .map((part: any) => (part?.type === "text" ? part.text : ""))
          .filter(Boolean)
          .join(" ")
          .trim()
      : "";
    if (text) return text;
  }
  return null;
}

async function handleThreadsList(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
) {
  const { data, error } = await supabase
    .from("threads")
    .select("id, created_at, updated_at, name, metadata")
    .order("updated_at", { ascending: false });

  if (error) {
    return jsonError(error.message, 500);
  }

  const items = (data as unknown as ThreadRow[]).map((row) =>
    threadFromRow(row, userId),
  );

  return NextResponse.json({
    items,
    total: items.length,
    count: items.length,
  });
}

async function handleThreadRetrieve(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  threadId: string,
) {
  const { data: thread, error: threadError } = await supabase
    .from("threads")
    .select("id, created_at, updated_at, name, metadata")
    .eq("id", threadId)
    .maybeSingle();

  if (threadError) return jsonError(threadError.message, 500);
  if (!thread) return jsonError("Not found", 404);

  const { data: messages, error: msgError } = await supabase
    .from("messages")
    .select(
      [
        "id",
        "thread_id",
        "role",
        "content",
        "component_state",
        "additional_context",
        "component",
        "tool_call_request",
        "tool_calls",
        "tool_call_id",
        "parent_message_id",
        "reasoning",
        "reasoning_duration_ms",
        "error",
        "is_cancelled",
        "metadata",
        "created_at",
      ].join(","),
    )
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (msgError) return jsonError(msgError.message, 500);

  return NextResponse.json({
    ...threadFromRow(thread as unknown as ThreadRow, userId),
    messages: (messages as unknown as MessageRow[]).map(messageFromRow),
  });
}

async function handleThreadUpdate(
  request: Request,
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  threadId: string,
) {
  const body = (await request.json().catch(() => null)) as
    | { name?: string; metadata?: Record<string, unknown> }
    | null;

  if (!body) return jsonError("Invalid JSON body", 400);

  const update: Record<string, unknown> = {};
  if (typeof body.name === "string") update.name = body.name;
  if (body.metadata && typeof body.metadata === "object") update.metadata = body.metadata;

  const { error } = await supabase
    .from("threads")
    .update(update)
    .eq("id", threadId);

  if (error) return jsonError(error.message, 500);

  const { data: thread, error: readError } = await supabase
    .from("threads")
    .select("id, created_at, updated_at, name, metadata")
    .eq("id", threadId)
    .maybeSingle();

  if (readError) return jsonError(readError.message, 500);
  if (!thread) return jsonError("Not found", 404);

  return NextResponse.json(threadFromRow(thread as unknown as ThreadRow, userId));
}

async function handleThreadGenerateName(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  threadId: string,
) {
  const { data: messages, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) return jsonError(error.message, 500);

  const seed = getFirstUserMessageText(messages as any);
  const name = seed
    ? seed.slice(0, 48) + (seed.length > 48 ? "…" : "")
    : `Thread ${threadId.slice(0, 8)}`;

  const { error: updateError } = await supabase
    .from("threads")
    .update({ name })
    .eq("id", threadId);

  if (updateError) return jsonError(updateError.message, 500);

  const { data: thread, error: readError } = await supabase
    .from("threads")
    .select("id, created_at, updated_at, name, metadata")
    .eq("id", threadId)
    .maybeSingle();

  if (readError) return jsonError(readError.message, 500);
  if (!thread) return jsonError("Not found", 404);

  return NextResponse.json(threadFromRow(thread as unknown as ThreadRow, userId));
}

async function handleThreadCancel() {
  return NextResponse.json(true);
}

async function handleAdvanceStream(
  request: Request,
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  userId: string,
  threadId: string | null,
) {
  const body = (await request.json().catch(() => null)) as any;
  if (!body || !body.messageToAppend) {
    return jsonError("Invalid JSON body", 400);
  }

  const messageToAppend = body.messageToAppend as {
    role: "user" | "assistant" | "system" | "tool";
    content: unknown;
    additionalContext?: Record<string, unknown>;
    component?: Record<string, unknown>;
    toolCallRequest?: Record<string, unknown>;
  };

  let persistentThreadId = threadId;

  if (!persistentThreadId) {
    const { data: newThread, error: threadError } = await supabase
      .from("threads")
      .insert({ user_id: userId })
      .select("id")
      .single();

    if (threadError) return jsonError(threadError.message, 500);
    persistentThreadId = (newThread as any).id as string;

    const initial = Array.isArray(body.initialMessages) ? body.initialMessages : [];
    if (initial.length > 0) {
      const initialRows = initial.map((m: any) => ({
        id: crypto.randomUUID(),
        thread_id: persistentThreadId,
        role: m.role,
        content: m.content,
        additional_context: m.additionalContext ?? null,
        component_state: m.componentState ?? {},
        component: m.component ?? null,
        tool_call_request: m.toolCallRequest ?? null,
        created_at: m.createdAt ?? new Date().toISOString(),
      }));

      const { error: insertError } = await supabase.from("messages").insert(initialRows);
      if (insertError) return jsonError(insertError.message, 500);
    }
  }

  const { data: historyRows, error: historyError } = await supabase
    .from("messages")
    .select(
      [
        "role",
        "content",
        "additional_context",
        "component",
        "tool_call_request",
        "created_at",
      ].join(","),
    )
    .eq("thread_id", persistentThreadId)
    .order("created_at", { ascending: true });

  if (historyError) return jsonError(historyError.message, 500);

  const { error: appendError } = await supabase.from("messages").insert({
    id: crypto.randomUUID(),
    thread_id: persistentThreadId,
    role: messageToAppend.role,
    content: messageToAppend.content,
    additional_context: messageToAppend.additionalContext ?? null,
    component_state: {},
    component: messageToAppend.component ?? null,
    tool_call_request: messageToAppend.toolCallRequest ?? null,
  });

  if (appendError) return jsonError(appendError.message, 500);

  const initialMessages = (historyRows as any[]).map((m) => ({
    role: m.role,
    content: m.content,
    additionalContext: m.additional_context ?? undefined,
    component: m.component ?? undefined,
    toolCallRequest: m.tool_call_request ?? undefined,
  }));

  const computeBody = {
    ...body,
    contextKey: userId,
    initialMessages,
    messageToAppend,
    clientTools: [],
  };

  const tamboResponse = await tamboFetch("/threads/advancestream", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(computeBody),
    signal: request.signal,
  });

  if (!tamboResponse.ok || !tamboResponse.body) {
    const text = await tamboResponse.text().catch(() => "");
    return jsonError(text || "Tambo request failed", tamboResponse.status);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const messageIdMap = new Map<string, string>();
  const finalMessages = new Map<string, any>();

  let didPersist = false;
  const persistMessages = async () => {
    if (didPersist) return;
    didPersist = true;

    if (finalMessages.size > 0) {
      const rows = Array.from(finalMessages.values()).map((m) => ({
        id: m.id,
        thread_id: persistentThreadId,
        role: m.role,
        content: m.content,
        component_state: m.componentState ?? {},
        additional_context: m.additionalContext ?? null,
        component: m.component ?? null,
        tool_call_request: m.toolCallRequest ?? null,
        tool_calls: m.tool_calls ?? null,
        tool_call_id: m.tool_call_id ?? null,
        parent_message_id: m.parentMessageId ?? null,
        reasoning: m.reasoning ?? null,
        reasoning_duration_ms: m.reasoningDurationMS ?? null,
        error: m.error ?? null,
        is_cancelled: m.isCancelled ?? false,
        metadata: m.metadata ?? null,
        created_at: m.createdAt ?? new Date().toISOString(),
      }));

      await supabase.from("messages").upsert(rows);
    }

    await supabase
      .from("threads")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", persistentThreadId);
  };

  let buffer = "";
  const reader = (tamboResponse.body as ReadableStream<Uint8Array>).getReader();

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        try {
          await persistMessages();
        } catch (error) {
          console.error("Failed to persist streamed messages:", error);
        }
        controller.close();
        return;
      }

      buffer += decoder.decode(value, { stream: true });

      while (true) {
        const nl = buffer.indexOf("\n");
        if (nl === -1) break;

        const rawLine = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);

        if (!rawLine) continue;
        if (rawLine === "data: DONE") {
          controller.enqueue(encoder.encode("data: DONE\n"));
          continue;
        }
        if (rawLine.startsWith("error: ")) {
          controller.enqueue(encoder.encode(`${rawLine}\n`));
          continue;
        }

        const jsonStr = rawLine.startsWith("data: ") ? rawLine.slice(6) : rawLine;
        if (!jsonStr) continue;

        let chunk: any;
        try {
          chunk = JSON.parse(jsonStr);
        } catch {
          continue;
        }

        const dto = chunk?.responseMessageDto;
        if (dto && typeof dto === "object") {
          const originalMessageId = typeof dto.id === "string" ? dto.id : null;
          if (originalMessageId) {
            const mapped = messageIdMap.get(originalMessageId) ?? crypto.randomUUID();
            messageIdMap.set(originalMessageId, mapped);
            dto.id = mapped;

            finalMessages.set(mapped, {
              ...dto,
              threadId: persistentThreadId,
            });
          }

          dto.threadId = persistentThreadId;
        }

        const outLine = `data: ${JSON.stringify(chunk)}\n`;
        controller.enqueue(encoder.encode(outLine));
      }
    },

    async cancel() {
      try {
        await persistMessages();
      } catch (error) {
        console.error("Failed to persist streamed messages:", error);
      }
      reader.cancel().catch(() => undefined);
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
    },
  });
}

async function proxyToTambo(request: Request, path: string[]) {
  const apiKey = getTamboApiKey();
  if (!apiKey) {
    return jsonError(
      "Missing TAMBO_API_KEY. Set it in .env.local (server-side, not NEXT_PUBLIC).",
      500,
    );
  }

  const targetUrl = new URL(`/${path.join("/")}`, getTamboBaseUrl());
  const requestUrl = new URL(request.url);
  targetUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  headers.set("x-api-key", apiKey);
  headers.delete("host");
  headers.delete("content-length");

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: request.body,
    redirect: "manual",
  });

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-encoding");

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

async function handler(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { path } = await params;

  if (path.length === 1 && path[0] === "projects" && request.method === "GET") {
    return NextResponse.json({
      id: PROJECT_ID,
      isTokenRequired: false,
      name: "IntentOS",
      providerType: "llm",
      userId: user.id,
    });
  }

  if (path[0] === "threads") {
    if (path.length >= 3 && path[1] === "project" && request.method === "GET") {
      return handleThreadsList(supabase, user.id);
    }

    if (path.length === 2 && path[1] === "advancestream" && request.method === "POST") {
      return handleAdvanceStream(request, supabase, user.id, null);
    }

    if (path.length >= 2) {
      const threadId = path[1];

      if (path.length === 2 && request.method === "GET") {
        return handleThreadRetrieve(supabase, user.id, threadId);
      }

      if (path.length === 2 && request.method === "PUT") {
        return handleThreadUpdate(request, supabase, user.id, threadId);
      }

      if (path.length === 3 && path[2] === "generate-name" && request.method === "POST") {
        return handleThreadGenerateName(supabase, user.id, threadId);
      }

      if (path.length === 3 && path[2] === "cancel" && request.method === "POST") {
        return handleThreadCancel();
      }

      if (path.length === 3 && path[2] === "advancestream" && request.method === "POST") {
        return handleAdvanceStream(request, supabase, user.id, threadId);
      }
    }
  }

  return proxyToTambo(request, path);
}

export async function GET(
  request: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handler(request, ctx);
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handler(request, ctx);
}

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handler(request, ctx);
}

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handler(request, ctx);
}

export async function DELETE(
  request: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  return handler(request, ctx);
}
