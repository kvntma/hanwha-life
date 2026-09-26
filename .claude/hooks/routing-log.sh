#!/usr/bin/env bash

INPUT=$(cat)

EVENT=$(jq -r '.hook_event_name // ""' <<< "$INPUT")
AGENT_TYPE=$(jq -r '.agent_type // ""' <<< "$INPUT")
AGENT_ID=$(jq -r '.agent_id // ""' <<< "$INPUT")

show() {
  jq -nc --arg msg "$1" '{systemMessage: $msg}'
}

case "$EVENT" in

  UserPromptExpansion)
    TYPE=$(jq -r '.expansion_type // ""' <<< "$INPUT")
    NAME=$(jq -r '.command_name // ""' <<< "$INPUT")

    if [[ "$TYPE" == "slash_command" ]]; then
      show "◆ SKILL | $NAME"
    fi
    ;;

  PreToolUse)
    TOOL=$(jq -r '.tool_name // ""' <<< "$INPUT")

    # Claude invoked a skill itself
    if [[ "$TOOL" == "Skill" ]]; then
      SKILL=$(jq -r '
        .tool_input.skill //
        .tool_input.name //
        .tool_input.command //
        "unknown"
      ' <<< "$INPUT")

      show "◆ SKILL | $SKILL"
      exit 0
    fi

    # Detect real external model routing
    if [[ "$TOOL" == "Bash" ]]; then
      COMMAND=$(jq -r '.tool_input.command // ""' <<< "$INPUT")

      # Codex / other provider through Claudish
      if [[ "$COMMAND" == *"claudish"* ]]; then
        MODEL=$(sed -nE \
          's/.*--model[ =]+([^ ]+).*/\1/p' \
          <<< "$COMMAND" | head -1)

        [[ -z "$MODEL" ]] && MODEL="default Claudish model"

        if [[ -n "$AGENT_TYPE" ]]; then
          show "↳ ROUTE | $AGENT_TYPE → $MODEL via Claudish"
        else
          show "↳ ROUTE | $MODEL via Claudish"
        fi

        exit 0
      fi

      # Gemini via Antigravity CLI
      if [[ "$COMMAND" =~ (^|[[:space:]])agy([[:space:]]|$) ]]; then
        if [[ -n "$AGENT_TYPE" ]]; then
          show "↳ ROUTE | $AGENT_TYPE → Gemini via Antigravity CLI"
        else
          show "↳ ROUTE | Gemini via Antigravity CLI"
        fi

        exit 0
      fi
    fi
    ;;

  SubagentStart)
    case "$AGENT_TYPE" in
      repo-scout)
        POLICY="Gemini / repository scouting"
        ;;
      implementer)
        POLICY="Codex / implementation"
        ;;
      debugger)
        POLICY="Claude / debugging"
        ;;
      reviewer)
        POLICY="Claude / review"
        ;;
      *)
        POLICY="Claude native unless externally delegated"
        ;;
    esac

    show "▶ SUBAGENT | $AGENT_TYPE | policy: $POLICY | id: $AGENT_ID"
    ;;

  SubagentStop)
    show "■ SUBAGENT COMPLETE | $AGENT_TYPE | id: $AGENT_ID"
    ;;

esac

exit 0
