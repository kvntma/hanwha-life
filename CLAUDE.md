# Hanwha Life Project Guidelines

## Overview
Next.js 15 starter application using React 18, TypeScript, Tailwind CSS, shadcn/ui, Supabase, and Biome.

## Development Commands
- **Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Start Production:** `npm run start`
- **Linting:** `npm run lint` (`biome check .`)
- **Lint Fix:** `npm run lint:fix`
- **Format:** `npm run format`
- **Sync PRD / Tasks:** `npm run sync-prd` / `npm run sync-tasks`

## Project Structure & Conventions
- `src/app`: Next.js App Router pages and layouts
- `src/components`: UI components (including `src/components/ui` for shadcn/ui)
- `src/lib`: Utility functions and shared instances
- `supabase`: Supabase migrations, configurations, and edge functions
- `scripts`: Utility scripts for PRD and task synchronization

## Subagents & Skills
Subagent personas are available in `.claude/agents/`:
- `repo-scout`: Workspace exploration & context gathering
- `implementer`: Code implementation & component building
- `reviewer`: Code quality, security, and performance review
- `debugger`: Log analysis & root cause bug fixing

Workflow skills are available in `.claude/skills/`:
- `feature`: End-to-end feature creation
- `bugfix`: Systematic bug identification and resolution
- `repo-context`: Full codebase analysis and schema mapping
- `review`: Comprehensive code auditing
- `routing-logger`: Subagent spawn logging and external model routing hook

## Hooks & Logging
Routing and subagent lifecycle events are logged via `.claude/hooks/routing-log.sh` configured in `.claude/settings.json`.
Events tracked:
- `UserPromptExpansion` (slash command invocation)
- `PreToolUse` (skill usage & external model CLI routing via Claudish / Antigravity)
- `SubagentStart` (subagent spawn logging with policy mapping)
- `SubagentStop` (subagent completion notification)

