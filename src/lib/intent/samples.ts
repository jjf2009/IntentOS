import type { IntentContract } from "@/lib/intent/intent-contract";

export const DEMO_INTERNSHIP_PREP_INTENT: IntentContract = {
  intent_id: "demo-internship-prep-30d",
  intent_type: "goal_planning",
  summary: "30-day internship preparation plan",
  confidence: 0.92,
  required_components: ["elicitation", "timeline", "task_list", "chart"],
  elicitation_schema: {
    fields: [
      {
        key: "time_horizon_days",
        type: "integer",
        required: true,
        description: "How many days do you have?",
        default: 30,
        minimum: 7,
        maximum: 90,
      },
      {
        key: "target_role",
        type: "string",
        required: true,
        description: "What role are you targeting? (e.g., SWE, Data, PM)",
        default: "Software engineering intern",
      },
      {
        key: "hours_per_week",
        type: "integer",
        required: false,
        description: "How many hours/week can you commit?",
        default: 10,
        minimum: 1,
        maximum: 60,
      },
      {
        key: "focus_areas",
        type: "string",
        required: false,
        description:
          "Any focus areas? (comma-separated, e.g., DSA, React, SQL, systems)",
      },
    ],
  },
  workflow_state: "draft",
};
