---
name: bugfix
description: Systematic workflow for investigating, isolating root cause, fixing, and verifying software bugs.
---

# Bug Fix Workflow

## 1. Define Failure

Establish:
- EXPECTED  
- ACTUAL  
- REPRODUCTION

Do not immediately edit code unless the cause is obvious.

## 2. Investigate

Use `debugger` when root cause is unclear.

Use `repo-scout` if broad repository tracing is required.

Avoid having multiple agents independently investigate the same failure.

## 3. Establish Root Cause

Before implementation, establish a plausible root cause supported by evidence.

Distinguish evidence from assumptions.

## 4. Implement

Use `implementer` when the fix is non-trivial.

Provide:
- root cause
- affected files
- expected behavior
- regression constraints
- required validation

Fix the cause rather than masking symptoms.

## 5. Review

Use `reviewer` for substantial fixes.

Review specifically against:
- root cause
- reproduction
- expected behavior
- regression risk

## 6. Verify

Re-run the reproduction or relevant regression test.

Confirm the original failure no longer occurs.
