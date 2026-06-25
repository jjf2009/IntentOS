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
  deadlineMinutes,
  summary,
  blocks,
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

  const totalDuration = blocks.reduce((sum, b) => sum + b.durationMinutes, 0);
  const completedDuration = blocks
    .filter((b) => completed.includes(b.id))
    .reduce((sum, b) => sum + b.durationMinutes, 0);

  const progress =
    totalDuration > 0
      ? Math.round((completedDuration / totalDuration) * 100)
      : 0;

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

  const getUrgencyClasses = (urgency?: string) => {
    if (urgency === "catastrophic")
      return "border-red-600 bg-red-950/40 text-red-400";
    if (urgency === "critical")
      return "border-amber-600 bg-amber-950/40 text-amber-400";
    return "border-emerald-600 bg-emerald-950/40 text-emerald-400";
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[1px] text-zinc-500 font-mono mb-1">
            <Clock className="w-3.5 h-3.5" /> TOTAL DEADLINE
          </div>
          <div className="font-mono text-4xl font-semibold text-red-500 tabular-nums">
            {deadlineMinutes}
            <span className="text-base align-super ml-1">MIN</span>
          </div>
        </div>
        {summary && (
          <div className="text-right text-sm text-zinc-400 max-w-[55%]">
            {summary}
          </div>
        )}
      </div>

      {/* Overall progress */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
          <div>EXECUTION PROGRESS</div>
          <div>{progress}% COMPLETE</div>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-2 bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Blocks */}
      <div className="space-y-3">
        {blocks.map((block, idx) => {
          const isDone = completed.includes(block.id);
          const isActive = activeId === block.id;

          return (
            <div
              key={block.id}
              onClick={() => setActive(block.id)}
              className={`group border rounded-xl p-4 cursor-pointer transition-all active:scale-[0.995] ${getUrgencyClasses(
                block.urgency
              )} ${isActive ? "ring-1 ring-white/70" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="font-mono text-xs px-2 py-0.5 rounded bg-black/40 shrink-0 mt-0.5">
                  {block.durationMinutes} MIN
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-base pr-2">
                      {idx + 1}. {block.title}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBlock(block.id);
                      }}
                      className="p-1 -mr-1 text-zinc-500 hover:text-current"
                    >
                      <CheckCircle
                        className={`w-5 h-5 transition-colors ${
                          isDone ? "text-emerald-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  <div className="text-sm text-zinc-400 mt-1">
                    {block.description}
                  </div>

                  {block.tasks && block.tasks.length > 0 && (
                    <ul className="mt-3 space-y-1 text-xs text-zinc-400">
                      {block.tasks.map((task, i) => (
                        <li key={i} className="pl-1">
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

      <div className="mt-4 text-[10px] font-mono text-center text-zinc-500">
        CLICK BLOCK TO FOCUS • TAP CHECK TO MARK DONE
      </div>
    </div>
  );
}

CrisisTimeline.displayName = "CrisisTimeline";
