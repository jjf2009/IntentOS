"use client";

import { useTamboComponentState } from "@tambo-ai/react";
import { CheckCircle, Clock } from "lucide-react";
import { z } from "zod";

export const crisisTimelineSchema = z.object({
  deadlineMinutes: z
    .number()
    .describe("Total minutes remaining for the entire crisis response"),
  summary: z
    .string()
    .optional()
    .describe("Very short one-line summary of the crisis situation"),
  blocks: z
    .array(
      z.object({
        id: z.string().describe("Unique id for the block"),
        title: z.string().describe("Short actionable title for this phase"),
        durationMinutes: z
          .number()
          .describe("How many minutes this block should take"),
        description: z
          .string()
          .describe("Clear description of what to do in this block"),
        tasks: z
          .array(z.string())
          .optional()
          .describe("Optional list of concrete sub-tasks"),
        urgency: z
          .enum(["catastrophic", "critical", "active"])
          .optional()
          .describe("Urgency level of this block"),
      })
    )
    .describe("Ordered list of execution blocks that add up to the deadline"),
});

export type CrisisTimelineProps = z.infer<typeof crisisTimelineSchema>;

type CrisisState = {
  completedBlockIds: string[];
  activeBlockId?: string;
};

export function CrisisTimeline({
  deadlineMinutes = 60,
  summary,
  blocks = [],
}: CrisisTimelineProps) {
  const [state, setState] = useTamboComponentState<CrisisState>(
    "crisis-timeline",
    {
      completedBlockIds: [],
      activeBlockId: undefined,
    }
  );

  const completed = state?.completedBlockIds ?? [];
  const activeId = state?.activeBlockId;

  // Defensive: handle undefined / empty / malformed blocks (Tambo sometimes streams partial data)
  const validBlocks = (blocks || []).filter((b) => b && b.title && typeof b.durationMinutes === "number");

  if (validBlocks.length === 0) {
    return (
      <div className="card w-full p-6">
        <div className="text-center text-[var(--text-muted)]">
          <div className="font-mono text-sm">No timeline blocks generated yet.</div>
          <div className="mt-1 text-xs">The AI is still planning the rescue.</div>
        </div>
      </div>
    );
  }

  const totalDuration = validBlocks.reduce((sum, b) => sum + (b.durationMinutes || 0), 0);
  const completedDuration = validBlocks
    .filter((b) => completed.includes(b.id || ""))
    .reduce((sum, b) => sum + (b.durationMinutes || 0), 0);

  const progress =
    totalDuration > 0
      ? Math.round((completedDuration / totalDuration) * 100)
      : 0;

  const safeDeadline = Number.isFinite(deadlineMinutes) && deadlineMinutes > 0 ? deadlineMinutes : 60;

  const toggleBlock = (id: string) => {
    const newCompleted = completed.includes(id)
      ? completed.filter((i) => i !== id)
      : [...completed, id];
    setState({
      completedBlockIds: newCompleted,
      activeBlockId: state?.activeBlockId,
    });
  };

  const setActive = (id: string) => {
    setState({
      completedBlockIds: state?.completedBlockIds ?? [],
      activeBlockId: id,
    });
  };

  return (
    <div className="card w-full p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs tracking-[0.05em] text-[var(--accent-muted)] font-mono mb-1">
            <Clock className="w-3.5 h-3.5" /> TOTAL DEADLINE
          </div>
          <div className="font-mono text-4xl font-semibold tabular-nums" style={{ color: "var(--accent-primary)" }}>
            {safeDeadline}
            <span className="text-base align-super ml-1">min</span>
          </div>
        </div>
        {summary && (
          <div className="text-right text-sm text-[var(--text-secondary)] max-w-[55%]">
            {summary}
          </div>
        )}
      </div>

      {/* Overall progress */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)] mb-1">
          <div>execution progress</div>
          <div>{progress}% complete</div>
        </div>
        <div className="h-2 bg-[rgba(170,186,174,0.15)] rounded-full overflow-hidden">
          <div
            className="h-2 transition-all duration-300"
            style={{ width: `${progress}%`, background: "var(--accent-primary)" }}
          />
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        {validBlocks.map((block, idx) => {
          const blockId = block.id || `block-${idx}`;
          const isDone = completed.includes(blockId);
          const isActive = activeId === blockId;

          const urgencyColor =
            block.urgency === "catastrophic"
              ? "var(--accent-primary)"
              : block.urgency === "critical"
              ? "var(--accent-secondary)"
              : "var(--accent-neutral)";

          return (
            <div
              key={blockId}
              onClick={() => setActive(blockId)}
              className="group border border-[rgba(170,186,174,0.2)] rounded-xl p-4 cursor-pointer transition-all active:scale-[0.995]"
              style={{
                background: isActive ? "var(--bg-hover)" : "var(--bg-card)",
                borderColor: isActive ? "var(--accent-neutral)" : undefined,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="font-mono text-xs px-2 py-0.5 rounded shrink-0 mt-0.5" style={{ background: "rgba(170,186,174,0.12)", color: urgencyColor }}>
                  {block.durationMinutes} min
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-base pr-2" style={{ color: "var(--text-primary)" }}>
                      {idx + 1}. {block.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBlock(blockId);
                      }}
                      className="p-1 -mr-1"
                      style={{ color: isDone ? "var(--accent-primary)" : "var(--text-muted)" }}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    {block.description}
                  </div>

                  {block.tasks && block.tasks.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
                      {block.tasks.map((task, i) => (
                        <li key={`${blockId}-task-${i}`} className="pl-1">
                          • {task}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-[10px] font-mono text-center" style={{ color: "var(--text-muted)" }}>
        click block to focus • tap check to mark done
      </div>
    </div>
  );
}

CrisisTimeline.displayName = "CrisisTimeline";
