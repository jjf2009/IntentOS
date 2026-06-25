"use client";

import { useEffect, useState } from "react";
import { useTamboComponentState } from "@tambo-ai/react";
import { Check, Clock, Play, RotateCcw, Target, X } from "lucide-react";
import { z } from "zod";

export const focusBlockerSchema = z.object({
  id: z.string().describe("Unique identifier for this focus block"),
  title: z.string().describe("The main task to focus on"),
  durationMinutes: z.number().optional().describe("Suggested duration in minutes"),
  description: z.string().describe("What needs to be done"),
  checklist: z
    .array(z.string())
    .optional()
    .describe("List of concrete sub-steps or checklist items"),
});

export type FocusBlockerProps = z.infer<typeof focusBlockerSchema>;

type FocusState = {
  checkedItems: string[];
  remainingSeconds: number;
  isRunning: boolean;
};

export function FocusBlocker({
  id,
  title,
  durationMinutes = 15,
  description,
  checklist = [],
}: FocusBlockerProps) {
  const initialSeconds = durationMinutes * 60;

  const [state, setState] = useTamboComponentState<FocusState>(
    `focus-blocker-${id}`,
    {
      checkedItems: [],
      remainingSeconds: initialSeconds,
      isRunning: true,
    }
  );

  const [localRemaining, setLocalRemaining] = useState(
    state?.remainingSeconds ?? initialSeconds
  );
  const [localIsRunning, setLocalIsRunning] = useState(state?.isRunning ?? true);

  const checked = state?.checkedItems ?? [];

  // Live countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (localIsRunning && localRemaining > 0) {
      interval = setInterval(() => {
        const newRemaining = localRemaining - 1;
        setLocalRemaining(newRemaining);

        // Persist to Tambo state
        setState({
          checkedItems: state?.checkedItems ?? [],
          remainingSeconds: newRemaining,
          isRunning: true,
        });
      }, 1000);
    } else if (localRemaining === 0) {
      setLocalIsRunning(false);
      setState({
        checkedItems: state?.checkedItems ?? [],
        remainingSeconds: 0,
        isRunning: false,
      });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [localIsRunning, localRemaining]);

  // Sync from state on mount / external updates
  useEffect(() => {
    if (state?.remainingSeconds !== undefined) {
      setLocalRemaining(state.remainingSeconds);
    }
    if (state?.isRunning !== undefined) {
      setLocalIsRunning(state.isRunning);
    }
  }, [state?.remainingSeconds, state?.isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleCheck = (item: string) => {
    const newChecked = checked.includes(item)
      ? checked.filter((i) => i !== item)
      : [...checked, item];
    setState({
      checkedItems: newChecked,
      remainingSeconds: state?.remainingSeconds ?? localRemaining,
      isRunning: state?.isRunning ?? localIsRunning,
    });
  };

  const toggleTimer = () => {
    const newRunning = !localIsRunning;
    setLocalIsRunning(newRunning);
    setState({
      checkedItems: state?.checkedItems ?? [],
      remainingSeconds: state?.remainingSeconds ?? localRemaining,
      isRunning: newRunning,
    });
  };

  const extendTime = (minutes: number) => {
    const added = minutes * 60;
    const newRemaining = localRemaining + added;
    setLocalRemaining(newRemaining);
    setLocalIsRunning(true);
    setState({
      checkedItems: state?.checkedItems ?? [],
      remainingSeconds: newRemaining,
      isRunning: true,
    });
  };

  const markComplete = () => {
    setLocalIsRunning(false);
    setState({
      checkedItems: checklist.length > 0 ? [...checklist] : checked,
      remainingSeconds: 0,
      isRunning: false,
    });
  };

  const exitFocus = () => {
    // For now just pause and reset visual - parent will handle in m6
    setLocalIsRunning(false);
    setState({
      checkedItems: state?.checkedItems ?? [],
      remainingSeconds: state?.remainingSeconds ?? localRemaining,
      isRunning: false,
    });
    // In real use, this would communicate back to timeline
  };

  const progress = Math.max(
    0,
    Math.min(100, ((initialSeconds - localRemaining) / initialSeconds) * 100)
  );

  const isOvertime = localRemaining <= 0;

  return (
    <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[2px] text-emerald-500 font-mono">
          <Target className="w-3.5 h-3.5" /> FOCUS MODE
        </div>
        <button
          onClick={exitFocus}
          className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1"
        >
          <X className="w-3 h-3" /> EXIT FOCUS
        </button>
      </div>

      {/* Big Task Title */}
      <div className="mb-3">
        <div className="text-sm text-zinc-500 mb-1">CURRENT TASK</div>
        <div className="text-2xl font-semibold tracking-tight">{title}</div>
      </div>

      <div className="text-sm text-zinc-400 mb-6">{description}</div>

      {/* Live Timer */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <div className={`font-mono text-7xl font-bold tabular-nums tracking-tighter ${isOvertime ? "text-red-500" : "text-white"}`}>
            {formatTime(Math.max(0, localRemaining))}
          </div>
          <div className="text-xs text-zinc-500 font-mono">MIN:SEC</div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
          <div
            className={`h-1.5 transition-all ${isOvertime ? "bg-red-600" : "bg-emerald-500"}`}
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-950 text-sm hover:bg-zinc-900"
          >
            {localIsRunning ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {localIsRunning ? "PAUSE" : "RESUME"}
          </button>

          <button
            onClick={() => extendTime(5)}
            className="flex-1 px-4 py-2 rounded-lg border border-amber-700 bg-amber-950/60 text-sm hover:bg-amber-950 text-amber-400"
          >
            +5 MIN
          </button>

          <button
            onClick={markComplete}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-emerald-700 bg-emerald-950/60 text-sm text-emerald-400 hover:bg-emerald-950"
          >
            <Check className="w-4 h-4" /> COMPLETE
          </button>
        </div>
      </div>

      {/* Checklist */}
      {checklist.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2 font-mono">CHECKLIST</div>
          <div className="space-y-2">
            {checklist.map((item, index) => {
              const itemKey = `${id}-${index}`;
              const isChecked = checked.includes(itemKey) || checked.includes(item);
              return (
                <button
                  key={index}
                  onClick={() => toggleCheck(itemKey)}
                  className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg border transition-colors ${
                    isChecked
                      ? "border-emerald-600 bg-emerald-950/30 text-emerald-300 line-through"
                      : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                      isChecked ? "bg-emerald-600 border-emerald-600" : "border-zinc-700"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm">{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isOvertime && (
        <div className="mt-4 text-center text-red-500 text-xs font-mono">
          TIME EXPIRED — CONSIDER EXTENDING OR MOVING ON
        </div>
      )}
    </div>
  );
}

FocusBlocker.displayName = "FocusBlocker";
