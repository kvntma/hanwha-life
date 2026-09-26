---
name: investigate
description: Diagnosis, architecture discovery, and impact analysis without immediate implementation.
---

# Investigation Workflow

Use when the user wants understanding, diagnosis, architecture discovery, or impact analysis without immediate implementation.

## 1. Define Question

State exactly what must be understood.

Examples:
- Where is this behavior implemented?
- Why does this request fail?
- What consumes this API?
- What would be affected by changing this type?
- How does this subsystem work?

## 2. Explore

Use `repo-scout` for broad repository investigation.

Use `debugger` when investigating incorrect runtime behavior.

Search progressively.

Do not inspect unrelated areas.

Stop once sufficient evidence exists.

## 3. Synthesize

The coordinator summarizes:
- findings
- relevant files
- execution/data flow
- evidence
- uncertainties
- likely next steps

Do not implement unless the user asks.
