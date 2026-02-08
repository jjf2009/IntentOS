# IndentOS

**An AI-powered intent-driven operating system that understands what you want to do and generates intelligent workflows to help you achieve it.**

IndentOS is a next-generation interface built on [Tambo AI](https://tambo.co) that bridges the gap between user intent and action. Instead of navigating through menus and clicking buttons, you simply express your intent in natural language, and IndentOS orchestrates the necessary steps, components, and tools to accomplish your goal.

---

## 🌟 What is IndentOS?

IndentOS reimagines how users interact with software by:

- **Understanding Intent**: Uses advanced AI to comprehend what users actually want to accomplish
- **Generating Workflows**: Automatically creates step-by-step workflows tailored to user goals
- **Dynamic UI Generation**: Renders the right components at the right time based on context
- **Intelligent Tool Orchestration**: Connects to various tools and services to execute tasks
- **Conversational Interface**: Natural language interaction instead of traditional point-and-click

### Key Concepts

**Intent-Driven Design**: Rather than building fixed UI flows, IndentOS dynamically generates workflows based on user intent. The AI interprets what you want and creates a personalized path to achieve it.

**Generative UI**: Components are generated on-the-fly by AI based on the conversation context, creating adaptive interfaces that respond to user needs.

**Tool Integration**: IndentOS can invoke various tools and services (APIs, databases, external systems) to accomplish tasks, making it a powerful orchestration layer.

---

## ✨ Features

### 🤖 AI-Powered Chat Interface
- **Natural language interaction** with context-aware responses
- **Streaming responses** for real-time feedback
- **Voice input support** with dictation capabilities
- **Thread management** with conversation history
- **File attachments** with drag-and-drop support

### 🎯 Intent Workflow System
- **Dynamic workflow generation** based on user goals
- **Task breakdown** with progress tracking
- **Timeline visualization** for multi-step processes
- **Elicitation system** to gather required information

### 🔧 Extensible Component System
- **Graph visualizations** (bar, line, pie charts) using Recharts
- **Data cards** for multi-select interactions
- **Custom components** registered via `src/lib/tambo.ts`
- **AI-generated UI** that adapts to context

### 🛠️ Tool Orchestration
- **Population statistics tools** (example implementation)
- **Extensible tool system** for adding external capabilities
- **Schema-validated inputs/outputs** using Zod
- **MCP (Model Context Protocol)** support for external integrations

### 🔐 Authentication & User Management
- **Supabase authentication** integration
- **User signup and login** flows
- **Secure session management**

### 🎨 Modern UI/UX
- **Dark mode support** with Tailwind CSS v4
- **Responsive design** for all screen sizes
- **Rich text editing** with TipTap
- **Markdown rendering** with code highlighting
- **Smooth animations** using Framer Motion

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 with App Router |
| **UI Library** | React 19.1 |
| **Language** | TypeScript 5 |
| **AI Platform** | Tambo AI SDK (@tambo-ai/react) |
| **Styling** | Tailwind CSS v4 |
| **Authentication** | Supabase |
| **Data Visualization** | Recharts |
| **Rich Text** | TipTap |
| **Validation** | Zod |
| **Animation** | Framer Motion |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Tambo API key ([Get one free here](https://tambo.co/dashboard))
- Supabase project (optional, for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd IndentOS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `example.env.local` to `.env.local`:
   ```bash
   cp example.env.local .env.local
   ```
   
   Then add your API keys to `.env.local`:
   ```env
   NEXT_PUBLIC_TAMBO_API_KEY=your_tambo_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

---

## 📂 Project Structure

```
IndentOS/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── chat/              # Chat interface route
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── interactables/     # Interactive components demo
│   │   ├── layout.tsx         # Root layout with TamboProvider
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── hero/              # Landing page sections
│   │   │   ├── Hero.tsx       # Main hero section
│   │   │   ├── AboutSection.tsx
│   │   │   └── FAQSection.tsx
│   │   ├── tambo/             # Tambo AI components
│   │   │   ├── graph.tsx      # Chart visualizations
│   │   │   ├── intent-workflow.tsx  # Workflow renderer
│   │   │   ├── message-thread-full.tsx  # Chat UI
│   │   │   ├── message-input.tsx    # Input with file support
│   │   │   ├── text-editor.tsx      # Rich text editor
│   │   │   └── mcp-*.tsx      # MCP integration components
│   │   ├── ui/                # Reusable UI components
│   │   │   └── card-data.tsx  # Data card component
│   │   ├── ApiKeyCheck.tsx    # API key validation
│   │   ├── Navbar.tsx         # Main navigation
│   │   └── Footer.tsx         # Footer component
│   ├── lib/
│   │   ├── tambo.ts           # ⭐ Component & tool registration
│   │   ├── thread-hooks.ts    # Thread management hooks
│   │   └── utils.ts           # Utility functions
│   ├── services/
│   │   └── population-stats.ts # Example tool implementation
│   └── middleware.ts           # Auth middleware
├── public/                     # Static assets
├── .env.local                  # Environment variables (git-ignored)
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/tambo.ts` | **Central configuration** - Register components and tools here |
| `src/app/layout.tsx` | Root layout with TamboProvider setup |
| `src/app/chat/page.tsx` | Main chat interface |
| `src/components/tambo/intent-workflow.tsx` | Intent workflow renderer |
| `AGENTS.md` | Developer guide for AI assistants |
| `components.md` | Complete component documentation |

---

## 🎯 How It Works

### 1. Component Registration

Components are registered in `src/lib/tambo.ts` with Zod schemas that define their props:

```typescript
export const components: TamboComponent[] = [
  {
    name: "IntentWorkflow",
    description: "A structured intent-driven workflow renderer",
    component: IntentWorkflow,
    propsSchema: intentWorkflowSchema,
  },
  {
    name: "Graph",
    description: "Renders charts (bar, line, pie) using Recharts",
    component: Graph,
    propsSchema: graphSchema,
  },
];
```

The AI can then dynamically render these components based on conversation context.

### 2. Tool Registration

Tools extend what the AI can do by connecting to external capabilities:

```typescript
export const tools: TamboTool[] = [
  {
    name: "globalPopulation",
    description: "Gets global population trends with year filtering",
    tool: getGlobalPopulationTrend,
    inputSchema: z.object({
      startYear: z.number().optional(),
      endYear: z.number().optional(),
    }),
    outputSchema: z.array(z.object({
      year: z.number(),
      population: z.number(),
      growthRate: z.number(),
    })),
  },
];
```

### 3. TamboProvider Setup

The `TamboProvider` wraps your app and provides AI capabilities:

```tsx
<TamboProvider
  apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
  components={components}
  tools={tools}
>
  {children}
</TamboProvider>
```

### 4. Intent Workflow Generation

When a user expresses intent (e.g., "I want to plan a trip to Japan"), IndentOS:
1. **Analyzes the intent** using AI
2. **Breaks down the goal** into actionable steps
3. **Generates a workflow** with elicitation forms, tasks, and timeline
4. **Renders the UI** dynamically as the user progresses
5. **Orchestrates tools** to fetch data or perform actions

---

## 🔧 Customization

### Adding a New Component

1. **Create the component** in `src/components/tambo/`:
   ```tsx
   import { z } from "zod";

   export const myComponentSchema = z.object({
     title: z.string(),
     data: z.array(z.string()),
   });

   export function MyComponent(props: z.infer<typeof myComponentSchema>) {
     return <div>{/* Your component */}</div>;
   }
   ```

2. **Register it** in `src/lib/tambo.ts`:
   ```tsx
   import { MyComponent, myComponentSchema } from "@/components/tambo/my-component";

   export const components: TamboComponent[] = [
     // ... existing components
     {
       name: "MyComponent",
       description: "What this component does",
       component: MyComponent,
       propsSchema: myComponentSchema,
     },
   ];
   ```

### Adding a New Tool

1. **Implement the tool** in `src/services/`:
   ```typescript
   export async function myTool(params: { query: string }) {
     // Your tool logic
     return { result: "data" };
   }
   ```

2. **Register it** in `src/lib/tambo.ts`:
   ```tsx
   export const tools: TamboTool[] = [
     // ... existing tools
     {
       name: "myTool",
       description: "What this tool does",
       tool: myTool,
       inputSchema: z.object({ query: z.string() }),
       outputSchema: z.object({ result: z.string() }),
     },
   ];
   ```

---

## 📚 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at `localhost:3000` |
| `npm run build` | Build production bundle |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npx tambo init` | Initialize Tambo configuration |
| `npx tambo add <component>` | Add a pre-built Tambo component |

---

## 🎨 Key Features Deep Dive

### Intent Workflow Components

The `IntentWorkflow` component renders structured workflows with:
- **Elicitation forms** to gather user input
- **Task lists** with progress tracking
- **Timeline views** for multi-step processes
- **Dynamic validation** using Zod schemas

### Chat Interface

The chat system includes:
- **Streaming responses** with real-time updates
- **Message history** with thread management
- **File attachments** via drag-and-drop
- **Voice input** using speech-to-text
- **MCP integration** for external prompts/resources

### MCP (Model Context Protocol)

Connect to external tools and resources:
- **Prompt insertion** from MCP servers
- **Resource references** with @-mentions
- **Client-side configuration** via modal

---

## 🌐 Authentication

IndentOS uses Supabase for authentication:

- **Signup**: `/signup` - Create a new account
- **Login**: `/login` - Sign in to existing account
- **Protected routes**: Middleware handles auth checks
- **Session management**: Automatic token refresh

---

## 📖 Documentation

- **Tambo AI Docs**: [docs.tambo.co](https://docs.tambo.co)
- **Component List**: See `components.md` for all available components
- **Developer Guide**: See `AGENTS.md` for architecture details
- **Tambo Dashboard**: [tambo.co/dashboard](https://tambo.co/dashboard)

---

## 🤝 Contributing

This is a demonstration project showing the possibilities of intent-driven interfaces. To extend it:

1. Add new components in `src/components/tambo/`
2. Register them in `src/lib/tambo.ts`
3. Create tools in `src/services/` for external integrations
4. Update documentation in `components.md`

---

## 📝 License

This project is built using the Tambo template. Check individual dependencies for their licenses.

---

## 🆘 Support

- **Tambo Documentation**: [docs.tambo.co](https://docs.tambo.co)
- **Tambo Dashboard**: [tambo.co/dashboard](https://tambo.co/dashboard)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

---

## 🚀 What's Next?

IndentOS is a foundation for building intent-driven applications. You can:

- **Add more workflows** for different use cases (travel planning, task management, etc.)
- **Integrate with external APIs** to expand capabilities
- **Create custom components** for your specific domain
- **Build on the authentication** to add user profiles and data persistence
- **Deploy to production** using Vercel, Netlify, or your preferred host

**Start building the future of human-computer interaction with IndentOS!** 🎉
