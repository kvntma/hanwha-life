---
name: feature
description: End-to-end workflow for meaningful feature implementation.
---

# Feature Workflow

Use for meaningful feature implementation.

## 1. Understand

Determine:
- requested behavior
- acceptance criteria
- constraints
- known relevant files
- unresolved questions

Do not run repository-wide discovery automatically.

## 2. Gather Context

If the implementation surface is unclear, use `repo-scout`.

Prefer the repository exploration model defined by the project's routing policy.

Request only:
- relevant files
- current flow
- existing patterns
- dependencies
- risks

If sufficient context already exists, skip this phase.

## 3. Plan

The coordinator creates the canonical implementation plan.

Specify:
- files to modify
- changes per file
- important constraints
- testing strategy
- risks

Do not ask multiple models to independently create competing plans unless explicitly requested.

## 4. Implement

For substantial implementation, use `implementer`.

Provide:
- objective
- approved plan
- relevant files
- constraints
- acceptance criteria

Do not provide unnecessary conversation history.

For very small changes, the coordinator may implement directly.

## 5. Review

Use `reviewer` for substantial changes.

Provide:
- original requirements
- implementation diff
- relevant context

Do not ask the reviewer to rediscover the repository unless necessary.

If findings are returned, send only those findings and necessary context back to implementation.

## 6. Verify

The coordinator owns final verification.

The implementation agent should not start servers, browsers, or integration
environments unless explicitly instructed.

After implementation:

1. Review the implementation result.
2. Decide whether additional validation is necessary.
3. Ask the user or perform validation only when appropriate.

Prefer cheap static validation before runtime validation.