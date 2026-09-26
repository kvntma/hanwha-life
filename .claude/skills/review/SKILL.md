---
name: review
description: Independent review workflow to evaluate implementations against requirements and standards.
---

# Review Workflow

Review the current implementation against the task.

Prefer an independent reviewer when the change is substantial.

Provide the reviewer:
- original objective
- acceptance criteria
- current diff
- relevant tests

Check:
- correctness
- regressions
- edge cases
- compatibility
- types
- state behavior
- error paths
- tests
- unnecessary complexity

Return only meaningful findings.

Do not perform broad repository discovery unless a finding requires it.

If no meaningful problems are found, state that clearly.

If corrections are required, send only the findings and necessary context back to the implementation agent.
