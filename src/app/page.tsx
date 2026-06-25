"use client";

import { useState } from "react";
import { AlertTriangle, Timer, Send, RotateCcw } from "lucide-react";

export default function CrisisWarRoom() {
  const [brainDump, setBrainDump] = useState("");
  const [submittedDump, setSubmittedDump] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const hasContent = brainDump.trim().length > 0;

  async function handleLaunch() {
    if (!hasContent || isAnalyzing) return;

    setIsAnalyzing(true);

    // Smallest simulation of analysis (Module 3 will replace with real Tambo)
    await new Promise((resolve) => setTimeout(resolve, 650));

    setSubmittedDump(brainDump.trim());
    setIsAnalyzing(false);
    // Keep the text in textarea for easy re-edit; user can clear manually
  }

  function handleReset() {
    setSubmittedDump("");
    setBrainDump("");
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
              disabled={isAnalyzing}
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
                  disabled={!hasContent || isAnalyzing}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-900/60 bg-red-950 px-5 py-2 text-sm font-medium text-red-400 hover:bg-red-950/80 active:bg-red-950 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <Timer className="w-4 h-4 animate-pulse" />
                      ANALYZING SITUATION...
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

              <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-8 min-h-[140px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-medium text-zinc-400">CrisisTimeline loading...</div>
                  <div className="text-xs text-zinc-500 mt-1 font-mono">
                    Tambo AI will stream the time-bound execution plan here
                  </div>
                </div>
              </div>

              <div className="mt-3 text-[10px] text-zinc-500 font-mono">
                Next: Tambo integration will replace this placeholder with live generative components.
              </div>
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
