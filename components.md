# Project Components

This document lists and describes the React components present in the project `src/components` directory.

## Root Components
Located in `src/components/`

- **[ApiKeyCheck](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/ApiKeyCheck.tsx)**: Ensures the `NEXT_PUBLIC_TAMBO_API_KEY` is present. Displays an alert if missing, otherwise renders its children.
- **[Footer](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/Footer.tsx)**: The application footer containing product identity, architecture signal, and meta links.
- **[Navbar](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/Navbar.tsx)**: The main navigation bar with brand, system state indicator, and action buttons.

## Hero Components
Located in `src/components/hero/`

- **[AboutSection](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/hero/AboutSection.tsx)**: A section describing IndentOS with text content and visual blocks.
- **[FAQSection](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/hero/FAQSection.tsx)**: Displays a list of frequently asked questions in an accordion style.
- **[Hero](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/hero/Hero.tsx)**: The main hero section of the landing page with title, description, and call-to-action buttons.

## UI Components
Located in `src/components/ui/`

- **[DataCard](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/ui/card-data.tsx)**: A multi-select component that displays options as clickable cards with titles, descriptions, and links.

## Tambo Components
Located in `src/components/tambo/`

These components are part of the Tambo AI integration for chat and interaction.

- **[DictationButton](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/dictation-button.tsx)**: A button that enables voice input using `useTamboVoice`. Handles recording and transcription.
- **[ElicitationUI](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/elicitation-ui.tsx)**: Dynamically renders form inputs based on a schema to elicit information from the user (Single and Multi-entry modes).
- **[Graph](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/graph.tsx)**: Renders various types of charts (bar, line, pie) using `recharts` with error handling and loading states.
- **[MarkdownComponents](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/markdown-components.tsx)**: Configuration and custom component definitions for `Streamdown` markdown rendering (code blocks, primitive elements, etc.).
- **[McpComponents](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/mcp-components.tsx)**: Contains buttons for MCP integration:
    - `McpPromptButton`: Inserts prompts from MCP servers.
    - `McpResourceButton`: Inserts resource references from MCP servers.
- **[McpConfigModal](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/mcp-config-modal.tsx)**: A modal dialog for configuring client-side MCP server connections.
- **[MessageGenerationStage](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/message-generation-stage.tsx)**: Displays the current state of message generation (e.g., "Fetching context", "Generating response").
- **[MessageInput](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/message-input.tsx)**: A comprehensive input component for the chat thread. Handles text entry, file attachments (drag & drop), and MCP integrations.
- **[MessageSuggestions](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/message-suggestions.tsx)**: Displays AI-generated reply suggestions for the user.
- **[MessageThreadFull](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/message-thread-full.tsx)**: A full-screen chat interface composition including the sidebar, thread container, message list, and input area.
- **[Message](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/message.tsx)**: Renders a single message in the thread, including text content, images, reasoning steps, and tool calls.
- **[ScrollableMessageContainer](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/scrollable-message-container.tsx)**: A wrapper that handles auto-scrolling to the bottom of the chat as new messages arrive.
- **[SuggestionsTooltip](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/suggestions-tooltip.tsx)**: A tooltip component wrapper used for displaying suggestion shortcuts.
- **[TextEditor](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/text-editor.tsx)**: A TipTap-based rich text editor enabling @-mentions for resources and /-commands for prompts.
- **[ThreadContainer](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/thread-container.tsx)**: Manages the layout of the thread view, adjusting for the sidebar and optional canvas availability.
- **[ThreadContent](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/thread-content.tsx)**: Renders the list of messages (`ThreadContentMessages`) using data from the `useTambo` hook.
- **[ThreadHistory](file:///home/jjf2009/Desktop/Projects/IndentOS/src/components/tambo/thread-history.tsx)**: A sidebar component that displays the list of past conversation threads with search and rename capabilities.
