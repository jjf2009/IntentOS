"use client";

import { useState } from "react";
import { AlertTriangle, Timer, Send, RotateCcw } from "lucide-react";
import { TamboProvider, useTambo, useTamboThreadInput } from "@tambo-ai/react";
import { CrisisTimeline } from "@/components/tambo/crisis-timeline";
import { FocusBlocker } from "@/components/tambo/focus-blocker";
import { components, tools } from "@/lib/tambo";

export default function CrisisWarRoom() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-200">
        <div className="max-w-md text-center p-6 border border-zinc-800 rounded-xl bg-zinc-900">
          <div className="text-red-500 font-medium mb-2 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Missing Tambo API Key
          </div>
          <div className="text-sm text-zinc-400">
            Set <span className="font-mono bg-zinc-800 px-1 py-0.5 rounded">NEXT_PUBLIC_TAMBO_API_KEY</span> in your <span className="font-mono">.env.local</span>
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
      autoGenerateThreadName={false}
    >
      <WarRoomContent />
    </TamboProvider>
  );
}

function WarRoomContent() {
  const [brainDump, setBrainDump] = useState("");
  const [submittedDump, setSubmittedDump] = useState("");
  const [focusedBlock, setFocusedBlock] = useState<{ title: string; description: string; durationMinutes?: number; checklist?: string[] } | null>(null);

  const { setValue, submit } = useTamboThreadInput();
  const { thread, isIdle } = useTambo();
  const isGenerating = !isIdle;

  const hasContent = brainDump.trim().length > 0;

  // Simple extractor for assistant message text (no extra deps)
  function getTextFromContent(content: unknown): string {
    if (!content) return "";
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .filter((part: any) => part?.type === "text")
        .map((part: any) => part.text || "")
        .join("");
    }
    return "";
  }

  const assistantMessages = (thread?.messages || []).filter((m: any) => m.role === "assistant");
  const lastAssistant = assistantMessages[assistantMessages.length - 1];
  const responseText = lastAssistant ? getTextFromContent(lastAssistant.content) : "";

  async function handleLaunch() {
    if (!hasContent || isGenerating) return;

    const dumpText = brainDump.trim();
    setSubmittedDump(dumpText);

    // Send to Tambo AI — strongly encourage using the registered CrisisTimeline component
    const prompt = `CRISIS MODE BRAIN DUMP: ${dumpText}

You must respond by using the CrisisTimeline component. Create a realistic, strict, minute-by-minute execution timeline. Blocks should have clear titles, durations in minutes, short descriptions, and optional tasks. Use urgency levels. The total durations should roughly match the available time.`;

    setValue(prompt);
    try {
      await submit({ streamResponse: true });
    } catch (err) {
      console.error("Failed to send to Tambo:", err);
    }
  }

  function handleReset() {
    setSubmittedDump("");
    setBrainDump("");
    setFocusedBlock(null);
  }

  function activateFocus(block: { title: string; description: string; durationMinutes?: number; checklist?: string[] }) {
    setFocusedBlock(block);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleLaunch();
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex flex-col">
      {/* High-stakes header */}
      <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold tracking-tighter">CR</span>
            </div>
            <div>
              <div className="font-semibold tracking-tight">IntentOS</div>
              <div className="text-[10px] text-red-500 -mt-1">CRISIS MODE</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs uppercase tracking-[2px] text-zinc-500 font-mono">
            <div className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" />
              <span>EXECUTION WINDOW</span>
            </div>
            <div className="h-px w-8 bg-zinc-800" />
            <span className="text-amber-500">STRICT • TIME-BOUND</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 flex-1 w-full pt-8 pb-12">
        {/* Title / context */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs tracking-widest text-zinc-400 mb-3">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            HIGH-STAKES WAR ROOM
          </div>
          <h1 className="text-4xl font-semibold tracking-tighter">Turn panic into action.</h1>
          <p className="mt-2 max-w-xl text-zinc-400">
            Dump everything. Get a strict, minute-precise execution timeline. Focus on one thing at a time.
          </p>
        </div>

        {/* Brain-dump input */}
        <div className="mb-8">
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <div className="font-medium text-zinc-300">BRAIN DUMP</div>
            <div className="text-[10px] font-mono text-zinc-500">NATURAL LANGUAGE • CMD/CTRL + ENTER TO LAUNCH</div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <textarea
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[128px] resize-y bg-transparent text-lg placeholder:text-zinc-600 focus:outline-none font-light leading-snug"
              placeholder="Client presentation in 75 minutes. Zero slides started. Data scattered across 4 emails + Notion. Boss already in the room. Need to pull numbers, write deck, and rehearse..."
              disabled={isGenerating}
            />

            <div className="mt-3 flex items-center justify-between">
              <div className="text-[10px] font-mono text-zinc-500">
                {brainDump.length} chars
              </div>

              <div className="flex gap-2">
                {submittedDump && (
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 active:bg-zinc-950"
                  >
                    <RotateCcw className="w-4 h-4" />
                    NEW CRISIS
                  </button>
                )}

                <button
                  onClick={handleLaunch}
                  disabled={!hasContent || isGenerating}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-900/60 bg-red-950 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-950/80 active:bg-red-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Timer className="w-4 h-4 animate-pulse" />
                      GENERATING...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      LAUNCH WAR ROOM
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* War Room Canvas */}
        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <div className="font-medium text-zinc-300">WAR ROOM CANVAS</div>
            <div className="text-[10px] font-mono text-zinc-500">GENERATIVE TIMELINE • FOCUS BLOCKER</div>
          </div>

          {!submittedDump ? (
            <div className="min-h-[260px] rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 flex items-center justify-center">
              <div className="text-center text-zinc-500">
                <div className="text-sm">Enter a brain dump above and launch to generate the timeline.</div>
                <div className="mt-1 text-[10px] font-mono">CrisisTimeline will appear here (Module 4+)</div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="text-xs uppercase tracking-widest text-amber-500 mb-1 font-mono">
                SITUATION LOGGED
              </div>

              <div className="text-sm text-zinc-300 whitespace-pre-wrap mb-4 border-l-2 border-amber-600 pl-3">
                {submittedDump}
              </div>

              {/* Generative component + fallback text (Module 4) */}
              {(() => {
                // Find if latest assistant message has a rendered CrisisTimeline
                const lastWithComponent = [...(thread?.messages || [])]
                  .reverse()
                  .find((m: any) => m.role === "assistant" && m.renderedComponent);

                if (lastWithComponent?.renderedComponent) {
                  return (
                    <div className="mt-4">
                      <div className="text-xs uppercase tracking-widest text-emerald-500 mb-2 font-mono">
                        GENERATED TIMELINE
                      </div>
                      {lastWithComponent.renderedComponent}
                    </div>
                  );
                }

                if (isGenerating) {
                  return (
                    <div className="text-amber-500 flex items-center gap-2 text-sm font-mono mt-4">
                      <Timer className="w-4 h-4 animate-pulse" /> GENERATING TIMELINE FROM TAMBO...
                    </div>
                  );
                }

                if (responseText) {
                  return (
                    <div className="mt-4">
                      <div className="text-xs uppercase tracking-widest text-emerald-500 mb-1 font-mono">AI RESPONSE</div>
                      <div className="text-sm text-zinc-300 whitespace-pre-wrap border-l-2 border-emerald-600 pl-3">
                        {responseText}
                      </div>
                    </div>
                  );
                }

                return null;
              })()}

              {/* TEMPORARY HARDCODED SAMPLE — visual verification only (remove in later modules) */}
              {submittedDump && (
                <div className="mt-6">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-mono">
                    VISUAL SAMPLE (hardcoded for testing)
                  </div>
                  <CrisisTimeline
                    deadlineMinutes={90}
                    summary="Board presentation in 90 minutes — zero prep"
                    blocks={[
                      {
                        id: "b1",
                        title: "Data pull & key metrics",
                        durationMinutes: 15,
                        description: "Grab the 4 critical numbers from email and Notion.",
                        tasks: ["Open emails", "Copy Q3 numbers", "Verify with finance"],
                        urgency: "critical",
                      },
                      {
                        id: "b2",
                        title: "Build slide deck skeleton",
                        durationMinutes: 25,
                        description: "Create 8-slide structure with titles and placeholders.",
                        urgency: "active",
                      },
                      {
                        id: "b3",
                        title: "Populate & design slides",
                        durationMinutes: 30,
                        description: "Fill content, charts, and minimal visuals.",
                        urgency: "active",
                      },
                      {
                        id: "b4",
                        title: "Rehearse + final polish",
                        durationMinutes: 20,
                        description: "Run through once, fix glaring issues, print notes.",
                        urgency: "catastrophic",
                      },
                    ]}
                  />

                  {/* FocusBlocker demo - activate one block to simulate isolation */}
                  <div className="mt-6">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-mono">
                      FOCUS BLOCKER SAMPLE (clicking a block in timeline would activate this)
                    </div>
                    <FocusBlocker
                      id="focus-demo-1"
                      title="Populate & design slides"
                      durationMinutes={30}
                      description="Fill content, charts, and minimal visuals for the 8 slides."
                      checklist={[
                        "Add key metrics to slide 3",
                        "Create simple bar chart",
                        "Write speaker notes",
                        "Align branding on all slides",
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Basic activation demo for flow (m6) - simulates clicking timeline block */}
              {submittedDump && !focusedBlock && (
                <div className="mt-4 flex gap-2 text-xs">
                  <button onClick={() => activateFocus({ title: "Data pull & key metrics", description: "Grab the 4 critical numbers from email and Notion.", durationMinutes: 15, checklist: ["Open emails", "Copy Q3 numbers"] })} className="px-3 py-1 bg-zinc-800 rounded border border-zinc-700 hover:bg-zinc-900">Focus on B1</button>
                  <button onClick={() => activateFocus({ title: "Rehearse + final polish", description: "Run through once, fix glaring issues.", durationMinutes: 20 })} className="px-3 py-1 bg-zinc-800 rounded border border-zinc-700 hover:bg-zinc-900">Focus on B4</button>
                </div>
              )}

              {focusedBlock && (
                <div className="mt-6">
                  <div className="text-xs uppercase tracking-widest text-emerald-500 mb-2 font-mono">ACTIVE FOCUS</div>
                  <FocusBlocker
                    id={`focus-${focusedBlock.title}`}
                    title={focusedBlock.title}
                    durationMinutes={focusedBlock.durationMinutes}
                    description={focusedBlock.description}
                    checklist={focusedBlock.checklist}
                  />
                  <button onClick={() => setFocusedBlock(null)} className="mt-2 text-xs text-zinc-500 hover:text-white">← Back to Timeline</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-zinc-800 py-4 text-center text-[10px] font-mono text-zinc-600">
        STATELESS • CLIENT-ONLY • USESTATE • POWERED BY TAMBO
      </footer>
    </div>
  );
}
