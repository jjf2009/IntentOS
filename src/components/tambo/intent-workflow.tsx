"use client";

import { ElicitationUI } from "@/components/tambo/elicitation-ui";
import { Graph } from "@/components/tambo/graph";
import {
  intentContractSchema,
  type IntentContract,
  type IntentContractRequiredComponent,
} from "@/lib/intent/intent-contract";
import { cn } from "@/lib/utils";
import { useTamboComponentState, useTamboThread } from "@tambo-ai/react";
import type {
  PrimitiveSchemaDefinition,
  TamboElicitationRequest,
  TamboElicitationResponse,
} from "@tambo-ai/react/mcp";
import * as React from "react";
import { z } from "zod";

type WorkflowTask = {
  id: string;
  title: string;
  description?: string;
  week: number;
};

type WorkflowParams = {
  time_horizon_days: number;
  target_role: string;
  hours_per_week?: number;
  focus_areas?: string;
};

type IntentWorkflowState = {
  locked: boolean;
  params: Partial<WorkflowParams>;
  completedTaskIds: string[];
};

export const intentWorkflowSchema = z.object({
  intent: intentContractSchema.describe(
    "Structured intent contract that drives dynamic workflow rendering",
  ),
  className: z.string().optional().describe("Optional CSS classes"),
});

export type IntentWorkflowProps = z.infer<typeof intentWorkflowSchema>;

function hasComponent(
  intent: IntentContract,
  component: IntentContractRequiredComponent,
): boolean {
  return intent.required_components.includes(component);
}

function toPrimitiveSchema(
  field: NonNullable<IntentContract["elicitation_schema"]>["fields"][number],
): PrimitiveSchemaDefinition {
  if (field.type === "string") {
    if (field.enum) {
      return {
        type: "string" as const,
        enum: field.enum,
        description: field.description,
        default: typeof field.default === "string" ? field.default : undefined,
      };
    }

    return {
      type: "string" as const,
      description: field.description,
      default: typeof field.default === "string" ? field.default : undefined,
    };
  }

  if (field.type === "boolean") {
    return {
      type: "boolean" as const,
      description: field.description,
      default: typeof field.default === "boolean" ? field.default : undefined,
    };
  }

  const type = field.type === "integer" ? "integer" : "number";
  return {
    type,
    description: field.description,
    default: typeof field.default === "number" ? field.default : undefined,
    minimum: field.minimum,
    maximum: field.maximum,
  };
}

function buildElicitationRequest(
  intent: IntentContract,
): TamboElicitationRequest | null {
  const fields = intent.elicitation_schema?.fields;
  if (!fields || fields.length === 0) {
    return null;
  }

  const properties: Record<string, PrimitiveSchemaDefinition> = {};
  const required: string[] = [];

  for (const field of fields) {
    properties[field.key] = toPrimitiveSchema(field);
    if (field.required) {
      required.push(field.key);
    }
  }

  return {
    message: "A few quick questions to personalize your workflow.",
    requestedSchema: {
      type: "object",
      properties,
      required: required.length > 0 ? required : undefined,
    },
  };
}

function clampInt(
  value: unknown,
  fallback: number,
  min?: number,
  max?: number,
): number {
  const n =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);
  if (Number.isNaN(n)) {
    return fallback;
  }
  const minVal = min ?? Number.NEGATIVE_INFINITY;
  const maxVal = max ?? Number.POSITIVE_INFINITY;
  return Math.max(minVal, Math.min(maxVal, n));
}

function buildInternshipPrepTasks(days: number): WorkflowTask[] {
  const weeks = Math.max(1, Math.ceil(days / 7));

  const baseWeeks: Omit<WorkflowTask, "id" | "week">[][] = [
    [
      {
        title: "Define your target and success metrics",
        description:
          "Pick roles, locations, and target companies. Write down what “ready” means for you.",
      },
      {
        title: "Resume + LinkedIn pass",
        description:
          "Update bullets with impact metrics; align headline and projects with your target.",
      },
      {
        title: "Interview warm-up routine",
        description:
          "Set a daily cadence (DSA + behavioral). Start with arrays/strings patterns.",
      },
      {
        title: "Project scope selection",
        description:
          "Pick one portfolio project you can ship or significantly improve in 2–3 weeks.",
      },
    ],
    [
      {
        title: "DSA fundamentals",
        description:
          "Linked lists, stacks/queues, hashing patterns. Track mistakes and revisit.",
      },
      {
        title: "Behavioral story bank",
        description:
          "Draft 6–8 STAR stories (conflict, leadership, learning, failure, impact).",
      },
      {
        title: "Networking pass",
        description:
          "Reach out to 5–10 people (alumni, friends, recruiters) with a short, specific ask.",
      },
      {
        title: "Project build (v1)",
        description:
          "Ship a working v1. Prioritize a clean README + deploy link.",
      },
    ],
    [
      {
        title: "Intermediate DSA",
        description: "Trees/graphs basics + recursion practice.",
      },
      {
        title: "Mock interview #1",
        description:
          "Do one timed mock (peer or platform). Review mistakes and write a retry plan.",
      },
      {
        title: "Applications sprint",
        description: "Apply to 10+ internships and track follow-ups.",
      },
      {
        title: "Project polish",
        description: "Improve UI, tests, and add one standout feature.",
      },
    ],
    [
      {
        title: "Mock interview #2",
        description:
          "Do another mock; focus on communication + edge cases + complexity.",
      },
      {
        title: "System design basics",
        description:
          "Review API design, caching, and basic scalability concepts (at intern level).",
      },
      {
        title: "Resume final pass",
        description: "Tighten wording, verify links, and tailor top bullets.",
      },
      {
        title: "Behavioral rehearsal",
        description:
          "Practice answers out loud; aim for concise STAR responses (<2 min each).",
      },
    ],
  ];

  const tasks: WorkflowTask[] = [];

  for (let week = 1; week <= weeks; week++) {
    const weekTemplate = baseWeeks[week - 1] ?? [
      {
        title: "Continue applications + practice",
        description:
          "Keep applying, keep doing mocks, and revisit weak topics until the deadline.",
      },
    ];

    for (let i = 0; i < weekTemplate.length; i++) {
      const task = weekTemplate[i];
      tasks.push({
        id: `w${week}-t${i + 1}`,
        week,
        title: task.title,
        description: task.description,
      });
    }
  }

  return tasks;
}

function normalizeWorkflowParams(
  intent: IntentContract,
  params: Partial<WorkflowParams>,
): WorkflowParams {
  const fieldDefaults = Object.fromEntries(
    (intent.elicitation_schema?.fields ?? []).map((f) => [f.key, f]),
  ) as Record<string, NonNullable<IntentContract["elicitation_schema"]>["fields"][number]>;

  const timeField = fieldDefaults.time_horizon_days;
  const hoursField = fieldDefaults.hours_per_week;

  return {
    time_horizon_days: clampInt(
      params.time_horizon_days ?? timeField?.default,
      30,
      timeField?.minimum,
      timeField?.maximum,
    ),
    target_role:
      (params.target_role ?? (fieldDefaults.target_role?.default as string)) ||
      "Intern",
    hours_per_week:
      params.hours_per_week === undefined
        ? typeof hoursField?.default === "number"
          ? clampInt(hoursField.default, 10, hoursField.minimum, hoursField.maximum)
          : undefined
        : clampInt(params.hours_per_week, 10, hoursField?.minimum, hoursField?.maximum),
    focus_areas: params.focus_areas,
  };
}

export const IntentWorkflow = ({ intent, className }: IntentWorkflowProps) => {
  const { thread, updateThreadName } = useTamboThread();
  const componentKey = `intent-workflow:${thread.id}:${intent.intent_id}`;

  const [state, setState] = useTamboComponentState<IntentWorkflowState>(
    componentKey,
    {
      locked: !hasComponent(intent, "elicitation"),
      params: {},
      completedTaskIds: [],
    },
  );

  const normalizedParams = normalizeWorkflowParams(intent, state?.params ?? {});
  const tasks = buildInternshipPrepTasks(normalizedParams.time_horizon_days);

  const completedTaskIds = state?.completedTaskIds ?? [];
  const completedCount = tasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const progress = tasks.length === 0 ? 0 : completedCount / tasks.length;
  const isCompleted = tasks.length > 0 && completedCount === tasks.length;

  const weekLabels = Array.from(
    { length: Math.max(1, Math.ceil(normalizedParams.time_horizon_days / 7)) },
    (_, i) => `Week ${i + 1}`,
  );
  const completedByWeek = weekLabels.map((_, i) => {
    const weekNum = i + 1;
    const weekTasks = tasks.filter((t) => t.week === weekNum);
    return weekTasks.filter((t) => completedTaskIds.includes(t.id)).length;
  });
  const totalByWeek = weekLabels.map((_, i) => {
    const weekNum = i + 1;
    return tasks.filter((t) => t.week === weekNum).length;
  });

  const elicitationRequest = buildElicitationRequest(intent);
  const showElicitation =
    hasComponent(intent, "elicitation") && !state?.locked && !!elicitationRequest;

  const handleElicitationResponse = (response: TamboElicitationResponse) => {
    if (!state) return;

    if (response.action !== "accept") {
      setState({ ...state, locked: true });
      return;
    }

    setState({
      ...state,
      locked: true,
      params: { ...state.params, ...(response.content ?? {}) },
    });
  };

  const handleToggleTask = (taskId: string) => {
    if (!state) return;

    const completed = new Set(state.completedTaskIds);
    if (completed.has(taskId)) {
      completed.delete(taskId);
    } else {
      completed.add(taskId);
    }
    setState({ ...state, completedTaskIds: [...completed] });
  };

  React.useEffect(() => {
    const storageKey = `intent-workflow:set-thread-name:${thread.id}`;
    if (sessionStorage.getItem(storageKey) === "1") {
      return;
    }

    if (intent.summary && thread.name !== intent.summary) {
      updateThreadName(intent.summary);
    }

    sessionStorage.setItem(storageKey, "1");
  }, [intent.summary, thread.id, thread.name, updateThreadName]);

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-background p-4",
        className,
      )}
      data-slot="intent-workflow"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground">
            {intent.summary}
          </h3>
          <span className="text-xs text-muted-foreground">
            {isCompleted ? "completed" : state?.locked ? "active" : "draft"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          Intent: <span className="font-mono">{intent.intent_type}</span> ·
          confidence: <span className="font-mono">{intent.confidence}</span>
        </div>
      </div>

      {showElicitation && elicitationRequest ? (
        <div className="mt-4">
          <ElicitationUI
            request={elicitationRequest}
            onResponse={handleElicitationResponse}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <ParamChip label="Days" value={`${normalizedParams.time_horizon_days}`} />
            <ParamChip label="Role" value={normalizedParams.target_role} />
            {normalizedParams.hours_per_week !== undefined && (
              <ParamChip
                label="Hours/week"
                value={`${normalizedParams.hours_per_week}`}
              />
            )}
            {normalizedParams.focus_areas && (
              <ParamChip label="Focus" value={normalizedParams.focus_areas} />
            )}
          </div>

          {hasComponent(intent, "chart") && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-muted/30 p-3">
                <div className="text-sm font-medium">Progress</div>
                <div className="mt-1 text-2xl font-semibold">
                  {Math.round(progress * 100)}%
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {completedCount}/{tasks.length} tasks completed
                </div>
              </div>
              <Graph
                title="Completed tasks by week"
                data={{
                  type: "bar",
                  labels: weekLabels,
                  datasets: [
                    {
                      label: "Completed",
                      data: completedByWeek,
                      color: "hsl(160, 82%, 47%)",
                    },
                    {
                      label: "Total",
                      data: totalByWeek,
                      color: "hsl(220, 14%, 70%)",
                    },
                  ],
                }}
                variant="bordered"
                size="sm"
                showLegend
              />
            </div>
          )}

          {hasComponent(intent, "timeline") && (
            <Timeline tasks={tasks} completedTaskIds={completedTaskIds} />
          )}

          {hasComponent(intent, "task_list") && (
            <TaskList
              tasks={tasks}
              completedTaskIds={completedTaskIds}
              onToggle={handleToggleTask}
            />
          )}
        </div>
      )}
    </div>
  );
};

IntentWorkflow.displayName = "IntentWorkflow";

function ParamChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs text-foreground">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </span>
  );
}

function Timeline({
  tasks,
  completedTaskIds,
}: {
  tasks: WorkflowTask[];
  completedTaskIds: string[];
}) {
  const weeks = Array.from(new Set(tasks.map((t) => t.week))).sort((a, b) => a - b);

  return (
    <div className="rounded-xl border border-border bg-muted/10 p-3">
      <div className="text-sm font-medium">Timeline</div>
      <div className="mt-3 space-y-3">
        {weeks.map((week) => {
          const weekTasks = tasks.filter((t) => t.week === week);
          const completed = weekTasks.filter((t) => completedTaskIds.includes(t.id)).length;
          return (
            <div key={week} className="rounded-lg border border-border bg-background p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">Week {week}</div>
                <div className="text-xs text-muted-foreground">
                  {completed}/{weekTasks.length} done
                </div>
              </div>
              <ul className="mt-2 space-y-1">
                {weekTasks.map((t) => (
                  <li
                    key={t.id}
                    className={cn(
                      "text-sm",
                      completedTaskIds.includes(t.id) &&
                        "line-through text-muted-foreground",
                    )}
                  >
                    {t.title}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TaskList({
  tasks,
  completedTaskIds,
  onToggle,
}: {
  tasks: WorkflowTask[];
  completedTaskIds: string[];
  onToggle: (taskId: string) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/10 p-3">
      <div className="text-sm font-medium">Task checklist</div>
      <div className="mt-3 space-y-2">
        {tasks.map((t) => {
          const checked = completedTaskIds.includes(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onToggle(t.id)}
              className={cn(
                "w-full text-left rounded-lg border border-border bg-background p-3 hover:bg-muted/30 transition-colors",
                checked && "opacity-70",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 h-4 w-4 rounded border border-border",
                    checked && "bg-emerald-500 border-emerald-500",
                  )}
                  aria-hidden="true"
                />
                <div className="flex-1">
                  <div
                    className={cn(
                      "text-sm font-medium",
                      checked && "line-through",
                    )}
                  >
                    {t.title}
                  </div>
                  {t.description && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {t.description}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">Week {t.week}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
