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
  id = "unknown",
  title = "Focus Task",
  durationMinutes = 15,
  description = "",
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
    <div className="card w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs tracking-[0.05em] text-[var(--accent-muted)] font-mono">
          <Target className="w-3.5 h-3.5" /> focus mode
        </div>
        <button
          onClick={exitFocus}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)] flex items-center gap-1"
        >
          <X className="w-3 h-3" /> exit focus
        </button>
      </div>

      {/* Big Task Title */}
      <div className="mb-3">
        <div className="text-sm text-[var(--text-muted)] mb-1">current task</div>
        <div className="text-2xl font-semibold tracking-tight">{title}</div>
      </div>

      <div className="text-sm text-[var(--text-secondary)] mb-6">{description}</div>

      {/* Live Timer */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <div className={`font-mono text-6xl font-bold tabular-nums tracking-tighter ${isOvertime ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"}`}>
            {formatTime(Math.max(0, localRemaining))}
          </div>
          <div className="text-xs text-[var(--text-muted)] font-mono">min:sec</div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-[rgba(170,186,174,0.15)] rounded-full overflow-hidden mb-2">
          <div
            className="h-1.5 transition-all"
            style={{ width: `${Math.min(100, progress)}%`, background: isOvertime ? "var(--accent-primary)" : "var(--accent-neutral)" }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleTimer}
            className="btn-ghost flex-1 flex items-center justify-center gap-2 text-sm"
          >
            {localIsRunning ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {localIsRunning ? "pause" : "resume"}
          </button>

          <button
            onClick={() => extendTime(5)}
            className="btn-ghost flex-1 text-sm"
            style={{ borderColor: "rgba(181,114,138,0.4)", color: "var(--accent-secondary)" }}
          >
            +5 min
          </button>

          <button
            onClick={markComplete}
            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
          >
            <Check className="w-4 h-4" /> complete
          </button>
        </div>
      </div>

      {/* Checklist */}
      {checklist.length > 0 && (
        <div>
          <div className="text-xs tracking-[0.05em] text-[var(--text-muted)] mb-2 font-mono">checklist</div>
          <div className="space-y-2">
            {checklist.map((item, index) => {
              const itemKey = `${id}-${index}`;
              const isChecked = checked.includes(itemKey) || checked.includes(item);
              return (
                <button
                  key={index}
                  onClick={() => toggleCheck(itemKey)}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg border text-sm transition-colors"
                  style={{
                    borderColor: isChecked ? "rgba(147,59,91,0.4)" : "rgba(170,186,174,0.2)",
                    background: isChecked ? "rgba(147,59,91,0.08)" : "var(--bg-card)",
                    color: isChecked ? "var(--accent-primary)" : "var(--text-secondary)",
                    textDecoration: isChecked ? "line-through" : undefined,
                  }}
                >
                  <div
                    className="w-5 h-5 rounded border flex items-center justify-center shrink-0"
                    style={{
                      background: isChecked ? "var(--accent-primary)" : "transparent",
                      borderColor: isChecked ? "var(--accent-primary)" : "rgba(170,186,174,0.3)",
                    }}
                  >
                    {isChecked && <Check className="w-3 h-3 text-[var(--bg-canvas)]" />}
                  </div>
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isOvertime && (
        <div className="mt-4 text-center text-[var(--accent-primary)] text-xs font-mono">
          time expired — consider extending or moving on
        </div>
      )}
    </div>
  );
}

FocusBlocker.displayName = "FocusBlocker";
