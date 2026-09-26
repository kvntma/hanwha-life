---
name: Repo Context Workflow
description: Workflow for summarizing workspace structure, tech stack, configuration files, and database integrations.
---

# Repo Context Skill Workflow

Follow these steps to gather and present repository context:

1. **Stack Identification:**
   - Read `package.json` for frameworks, UI libraries, and runtime versions.
   - Inspect build & lint configs (`biome.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`).

2. **Directory & File Hierarchy:**
   - Map main directories (`src/app`, `src/components`, `supabase`, `scripts`).

3. **Data Layer & Security:**
   - Check Supabase client setups (`src/lib` or `@supabase/ssr` usage) and RLS schemas.

4. **Output Synthesis:**
   - Present a concise, structured overview of architecture and conventions.
