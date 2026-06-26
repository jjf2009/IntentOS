"use client";

import { useEffect, useRef, useState } from "react";
import { Timer, AlertTriangle } from "lucide-react";
import gsap from "gsap";
import { TamboProvider, useTambo, useTamboThreadInput } from "@tambo-ai/react";
import { CrisisTimeline } from "@/components/tambo/crisis-timeline";
import { FocusBlocker } from "@/components/tambo/focus-blocker";
import { components, tools } from "@/lib/tambo";

export default function CrisisWarRoom() {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-canvas)", color: "var(--text-primary)" }}>
        <div className="max-w-md text-center p-6 card">
          <div className="font-medium mb-2 flex items-center justify-center gap-2" style={{ color: "var(--accent-primary)" }}>
            <AlertTriangle className="w-5 h-5" /> Missing Tambo API Key
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Set <span className="font-mono" style={{ background: "var(--bg-hover)", padding: "1px 4px", borderRadius: "3px" }}>NEXT_PUBLIC_TAMBO_API_KEY</span> in your <span className="font-mono">.env.local</span>
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
  const [sendError, setSendError] = useState<string | null>(null);

  const { setValue, submit } = useTamboThreadInput();
  const { thread, isIdle } = useTambo();
  const isGenerating = !isIdle;

  // Refs for GSAP animations (per AGENTS.md)
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const examplesRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Hero entrance animation (subtle, respects reduced motion)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    if (headlineRef.current) {
      tl.fromTo(headlineRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9 });
    }
    if (subRef.current) {
      tl.fromTo(subRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.5");
    }
    if (examplesRef.current) {
      tl.fromTo(examplesRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3");
    }
  }, []);

  // Animate canvas when content appears
  useEffect(() => {
    if (submittedDump && canvasRef.current) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prefersReduced) {
        gsap.fromTo(
          canvasRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }
    }
  }, [submittedDump]);

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

You MUST respond using the CrisisTimeline component.

Rules:
- Always provide a non-empty "blocks" array (at least 3 items).
- Each block must have: id (string), title, durationMinutes (number), description.
- Optional but recommended: tasks (array of strings), urgency ("catastrophic" | "critical" | "active").
- The sum of all durationMinutes should be close to the total available time.
- Make the plan realistic and actionable for a last-minute crisis.

Output ONLY via the CrisisTimeline component. Do not return plain text.`;

    setValue(prompt);
    setSendError(null);
    try {
      await submit({ streamResponse: true });
    } catch (err) {
      console.error("Failed to send to Tambo:", err);
      setSendError("Failed to generate plan. Please try again or adjust your description.");
    }
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
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-canvas)", color: "var(--text-primary)" }}>
      {/* Header */}
      <header className="border-b border-[rgba(170,186,174,0.2)] sticky top-0 z-50" style={{ background: "var(--bg-canvas)" }}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: "var(--accent-primary)" }}>
              <span className="text-[var(--bg-canvas)] text-sm font-bold tracking-tighter">IC</span>
            </div>
            <div className="font-semibold tracking-tight font-display">IntentOS</div>
            <div className="text-xs tracking-[0.05em]" style={{ color: "var(--accent-muted)" }}>CRISIS MODE</div>
          </div>

          <div className="flex items-center gap-4 text-xs tracking-[0.05em] font-mono" style={{ color: "var(--text-muted)" }}>
            <div className="flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5" />
              <span>EXECUTION WINDOW</span>
            </div>
            <div className="h-px w-8" style={{ background: "rgba(170,186,174,0.3)" }} />
            <span>STRICT • TIME-BOUND</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 flex-1 w-full pt-10 pb-16">
        {/* Hero */}
        <div className="mb-10">
          <div className="chip chip-primary mb-3">last-minute rescue</div>
          <h1 ref={headlineRef} className="font-display text-5xl tracking-[-1px] leading-none mb-3">Turn panic into a plan.</h1>
          <p ref={subRef} className="max-w-md text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dump everything. Tambo AI generates a precise, time-bound execution timeline. Focus on one thing at a time.
          </p>
        </div>

        {/* Examples */}
        <div ref={examplesRef} className="mb-4 flex flex-wrap gap-2 text-xs">
          {[
            "Client deck due in 90 minutes",
            "Final exam tomorrow at 9am",
            "Investor pitch in 3 hours",
          ].map((ex, i) => (
            <button
              key={i}
              onClick={() => setBrainDump(ex)}
              className="chip chip-neutral hover:border-[var(--accent-neutral)] cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>

        {/* Brain-dump input */}
        <div className="mb-8">
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <div style={{ color: "var(--text-secondary)" }}>BRAIN DUMP</div>
            <div className="text-[10px] font-mono tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>NATURAL LANGUAGE • CMD/CTRL + ENTER</div>
          </div>

          <div className="card p-5">
            <textarea
              value={brainDump}
              onChange={(e) => setBrainDump(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[110px] resize-y bg-transparent text-lg placeholder:text-[var(--text-muted)] focus:outline-none leading-snug"
              placeholder="I have a board presentation in 90 minutes. No slides. Key metrics scattered across 4 emails..."
              disabled={isGenerating}
            />

            <div className="mt-3 flex items-center justify-between">
              <div className="text-[10px] font-mono tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>
                {brainDump.length} chars
              </div>

              <div className="flex gap-2">
                {submittedDump && (
                  <button onClick={handleReset} className="btn-ghost text-sm">
                    new crisis
                  </button>
                )}

                <button
                  onClick={handleLaunch}
                  disabled={!hasContent || isGenerating}
                  className="btn-primary disabled:opacity-50"
                >
                  {isGenerating ? "generating..." : "launch rescue plan"}
                </button>
              </div>
              {sendError && (
                <div className="mt-2 text-xs" style={{ color: "var(--accent-primary)" }}>
                  {sendError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generative Canvas */}
        <div>
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <div style={{ color: "var(--text-secondary)" }}>RESCUE PLAN</div>
            <div className="text-[10px] font-mono tracking-[0.05em]" style={{ color: "var(--text-muted)" }}>GENERATIVE • TIMELINE + FOCUS</div>
          </div>

          {!submittedDump ? (
            <div className="card min-h-[220px] p-8 flex items-center justify-center text-center" style={{ color: "var(--text-muted)" }}>
              Enter a last-minute crisis above and launch to generate your timeline.
            </div>
          ) : (
            <div className="card p-6">
              <div className="text-xs tracking-[0.05em] mb-1" style={{ color: "var(--accent-muted)" }}>
                SITUATION LOGGED
              </div>

              <div className="text-[15px] leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                {submittedDump}
              </div>

              {/* Generative content from Tambo */}
              {(() => {
                const lastWithComponent = [...(thread?.messages || [])]
                  .reverse()
                  .find((m: any) => m.role === "assistant" && m.renderedComponent);

                if (lastWithComponent?.renderedComponent) {
                  return <div className="mt-2">{lastWithComponent.renderedComponent}</div>;
                }

                if (isGenerating) {
                  return <div className="py-6 text-center" style={{ color: "var(--accent-muted)" }}>Generating your rescue plan…</div>;
                }

                if (responseText) {
                  return <div className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{responseText}</div>;
                }

                return <div className="py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>Waiting for AI response…</div>;
              })()}
            </div>
          )}
        </div>
      </div>

      <footer className="border-t border-[rgba(170,186,174,0.2)] py-4 text-center text-xs tracking-[0.05em] font-mono" style={{ color: "var(--text-muted)" }}>
        STATELESS • CLIENT-ONLY • POWERED BY TAMBO
      </footer>
    </div>
  );
}
