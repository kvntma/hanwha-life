---
name: routing-logger
description: Skill and hook for logging subagent lifecycle events, model routing decisions, and skill executions.
---

# Routing Logger Skill & Hook

This skill and corresponding lifecycle hooks log subagent spawns, subagent completions, skill invocations, and external model routing decisions across the project workflow.

## Structure

- `.claude/hooks/routing-log.sh`: Hook script that processes lifecycle JSON payload events and returns structured `{ systemMessage: "..." }` formatted outputs.
- `.claude/settings.json`: Configuration defining hooks for `UserPromptExpansion`, `PreToolUse`, `SubagentStart`, and `SubagentStop`.

## Event Handling

1. **`UserPromptExpansion`**: Emits `◆ SKILL | <name>` when a slash command is expanded.
2. **`PreToolUse`**:
   - For `Skill` tool usage: Emits `◆ SKILL | <skill_name>`.
   - For `Bash` tool usage: Detects `claudish` or `agy` (Antigravity CLI) commands and logs routing details (e.g. `↳ ROUTE | <agent> → <model> via Claudish`).
3. **`SubagentStart`**: Logs subagent spawn events with the mapped model routing policy and agent ID:
   - `repo-scout` → Gemini / repository scouting
   - `implementer` → Codex / implementation
   - `debugger` → Claude / debugging
   - `reviewer` → Claude / review
   - Default → Claude native unless externally delegated
4. **`SubagentStop`**: Emits `■ SUBAGENT COMPLETE | <agent_type> | id: <agent_id>`.

## Hook Registration (`.claude/settings.json`)

Registers `${CLAUDE_PROJECT_DIR}/.claude/hooks/routing-log.sh` across all relevant lifecycle hooks.
