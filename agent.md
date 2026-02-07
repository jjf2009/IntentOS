# agent.md

**Project Codename:** IntentOS
**Category:** Intent-Native Productivity System
**Primary Stack:** Next.js (App Router), Tambo SDK, Gemini 3
**Execution Mode:** Solo / Autonomous Agent Compatible

## 1. Mission Statement

You are building **IntentOS**, a next-generation productivity system where:

> Users express goals in natural language, and the system dynamically renders interactive workflows instead of static screens.

This is **not** a chat app.
Chat is the control surface.
UI is a side-effect of intent reasoning.

Your objective is to ship a **fully working, judge-ready demo** that demonstrates this paradigm clearly within hackathon constraints.

## 2. Core Design Principles (Non-Negotiable)

1. **Intent > Screens**

   - No fixed dashboards
   - No static workflows
   - UI components appear only when required by intent

2. **Chat as an OS Bus**

   - All interaction flows through Tambo’s message system
   - Threads represent *one intent lifecycle*

3. **Minimal Surface, Maximum Depth**

   - One killer end-to-end demo flow
   - Avoid feature sprawl

4. **Leverage Existing Tambo Primitives**

   - Do not rebuild chat, editors, or orchestration logic
   - Compose, don’t replace

## 3. High-Level Architecture

```
User Input (Text / Voice / Files)
        ↓
Tambo Message Pipeline
        ↓
Gemini 3 (Intent Classification + Planning)
        ↓
Structured Intent JSON
        ↓
Elicitation (if needed)
        ↓
Dynamic Component Rendering
        ↓
Interactive Workflow Execution
```

## 4. Canonical Intent Contract (CRITICAL)

All intents must resolve into a structured object.

### Intent JSON Schema (Baseline)

```json
{
  "intent_id": "uuid",
  "intent_type": "goal_planning | analysis | tracking | decision_support",
  "summary": "string",
  "confidence": 0.0,
  "required_components": [
    "elicitation",
    "timeline",
    "task_list",
    "chart"
  ],
  "elicitation_schema": {
    "fields": [
      {
        "key": "time_horizon",
        "type": "string",
        "required": true
      }
    ]
  },
  "workflow_state": "draft | active | completed"
}
```

This schema is the **bridge between Gemini and Tambo UI rendering**.

## 5. Agent Responsibilities (Task Breakdown)

### A. Intent Understanding Layer (Gemini)

**Objective:** Convert free-form user input into structured intent.

Tasks:

- Write a **system prompt** for Gemini that:
  - Classifies intent
  - Determines missing information
  - Outputs valid JSON only
- Ensure deterministic structure
- Reject vague or multi-intent inputs with clarification requests

Deliverable:

- A single prompt file or inline system prompt
- Sample intent outputs stored for demo reliability

### B. Elicitation Layer (Tambo Native)

**Objective:** Collect missing parameters before execution.

Use:

- `ElicitationUI`

Tasks:

- Dynamically render questions from `elicitation_schema`
- Support:
  - Single value fields
  - Multi-entry fields
- Lock intent once elicitation completes

Deliverable:

- Clean elicitation → execution transition
- No dead-ends or infinite loops

### C. Dynamic Workflow Rendering

**Objective:** Render UI components based on intent needs.

Allowed Components:

- `ElicitationUI`
- `DataCard`
- `Graph`
- Markdown blocks with embedded components

Rules:

- No page navigation
- No hardcoded workflows
- Rendering must be driven by intent JSON

Deliverable:

- One flagship workflow fully implemented

### D. Productivity Primitives

Implement **only what supports the demo intent**.

Examples:

- Task checklist with completion state
- Timeline visualization
- Progress or status indicator

State Handling:

- State may be local or ephemeral
- Persistence is optional, clarity is not

### E. Thread & Memory Semantics

Use:

- `ThreadHistory`

Rules:

- One thread = one intent lifecycle
- Thread title = intent summary
- Thread history doubles as “intent archive”

### F. MCP Integration (Signal, Not Depth)

Use:

- `McpPromptButton`
- `McpResourceButton`
- `McpConfigModal`

Tasks:

- Show MCP affordances
- Demonstrate at least one injected prompt or resource
- No real server required

Purpose:

- Signal extensibility
- Impress judges with forward compatibility

## 6. Non-Goals (Explicitly Out of Scope)

Do NOT implement:

- Authentication logic
- User settings
- Notifications
- Collaboration
- Theming systems
- Multi-intent orchestration

If it does not strengthen the **intent → workflow** story, it is a liability.

## 7. Demo Flow (Must Be Perfect)

### Required Demo Scenario

> “Create a 30-day internship preparation plan”

Steps:

1. User enters intent via chat or voice
2. Gemini returns structured intent
3. Elicitation collects missing constraints
4. System renders:
   - Timeline
   - Task checklist
   - Progress visualization
5. User interacts with tasks
6. System updates state and suggests next steps

This flow must be:

- Fast
- Visually clear
- Impossible to confuse with a normal chatbot

## 8. Judging Alignment Checklist

- **Tambo Usage:** Central, not decorative
- **Generative UI:** Clearly visible
- **Innovation:** Intent-native paradigm obvious in first 30 seconds
- **Technical Execution:** Clean, stable, explainable
- **Narrative:** “We design intent, not screens”

## 9. Success Criteria

The project is successful if:

- A judge can explain IntentOS after one demo
- The UI adapts visibly to user intent
- The system feels like infrastructure, not an app
- The codebase looks intentional, not hacked together

## 10. Final Instruction to Agent

Optimize for:

- Clarity over completeness
- Depth over breadth
- Systems thinking over UI polish

This is not a feature contest.
This is a **category definition exercise**.

Build accordingly.
