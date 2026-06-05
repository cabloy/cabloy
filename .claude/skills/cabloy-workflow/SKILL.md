---
name: cabloy-workflow
description: Use this skill first when a Cabloy request is about choosing the right path before implementation: whether the work belongs to Vona backend scaffolding, Zova frontend scaffolding, backend/frontend contract sync, or docs, .docs-internal, CLAUDE.md, commands, or skills; which Cabloy Basic or Cabloy Start assumptions apply; or where Cabloy guidance should live. Trigger on requests that ask to route, classify, choose a workflow, choose an edition-specific path, or decide between docs, rules, and skills. Do not use it once the task is already clearly a backend scaffold, frontend scaffold, or contract-loop job.
---

# Cabloy Workflow

Use this skill to choose the right workflow before making Cabloy changes.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. choose the correct layer of work: fullstack, backend, frontend, docs, or AI-enablement
3. prefer Vona or Zova CLI capabilities over manual scaffolding whenever possible
4. keep public docs, internal docs, rules, and skills in the correct locations
5. finish with verification guidance that matches the scope of the task

## Step 1: Detect the active edition

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- `__CABLOY_BASIC__` present → this is Cabloy Basic
- `__CABLOY_START__` present → this is Cabloy Start
- neither present → inspect the repo scripts and ask the user before making a strong edition-specific assumption

This matters most for frontend work, UI-library assumptions, flavor names, and edition-specific modules.

## Step 2: Identify the task layer

Classify the request before proposing a workflow.

### Fullstack

Use the fullstack path when the task spans backend and frontend or touches shared scripts, integration, docs architecture, or cross-stack generation.

Typical signals:

- "fullstack"
- "Cabloy"
- backend + frontend in one request
- OpenAPI + SDK + DTO + page generation
- docs/rules/skills that must support both Vona and Zova

### Backend (Vona)

Use the backend path when the task is about:

- suite, module, bean, service, controller, model, entity, DTO
- CRUD generation
- ORM, cache, queue, worker, schedule, auth, permissions
- backend tests, build, play, or database reset

### Frontend (Zova)

Use the frontend path when the task is about:

- page, component, mock, bean
- SSR, Web, Admin, SPA
- UI-library-sensitive work
- OpenAPI SDK generation
- frontend refactors such as page params, page query, component props, or model helpers

### Docs and AI-enablement

Use the docs/AI path when the task is about:

- `cabloy-docs/`
- `.docs-internal/`
- `CLAUDE.md`
- `.claude/commands/`
- `.claude/skills/`
- repo guidance for AI development

## Step 3: Start from shared entrypoints

Before inventing a workflow, inspect these shared surfaces:

- the repository or workspace `package.json` that owns the active scripts
- `npm run vona`
- `npm run zova`
- root `CLAUDE.md` if present
- `cabloy-docs/` for public guidance
- `.docs-internal/` for maintainer rationale

If the request spans backend and frontend, classify it as fullstack by default unless the user clearly wants only one side.

If edition markers are missing or the repo shape is ambiguous, inspect the nearby scripts and ask the user before making a strong edition-specific assumption.

For deeper reference material, read:

- `references/edition-detection.md`
- `references/cli-strategy.md`

The reason is simple: these files are where Cabloy already encodes its real workflows.

## Step 4: Prefer CLI-first workflows

Whenever the task maps to an existing generator, initializer, refactor, or metadata command, prefer the CLI.

### Vona CLI families

Typical families:

- `bin:*`
- `create:*`
- `init:*`
- `tools:*`

Typical use cases:

- scaffold suite/module/bean/test resources
- initialize config/locale/constant/error/assets/types
- generate CRUD-related artifacts
- refresh metadata or dependency-related output
- run backend verification flows

### Zova CLI families

Typical families:

- `bin:*`
- `create:*`
- `init:*`
- `refactor:*`
- `tools:*`
- `openapi:*`

Typical use cases:

- scaffold suite/module/page/component/mock/bean resources
- initialize app/system assets and typing helpers
- run focused refactors for page/component patterns
- generate OpenAPI-related output
- refresh metadata or dependency-related output

## Step 5: Choose where the knowledge belongs

When the user is asking for guidance or automation assets, route the work to the correct home.

### Public docs

Use `cabloy-docs/` for:

- user-facing explanations
- reusable AI-facing workflow guidance
- edition-aware public documentation

### Internal engineering docs

Use `.docs-internal/` for:

- ADRs
- architecture notes
- maintainer rationale
- invariants and design boundaries

### Root rules and commands

Use `CLAUDE.md` and `.claude/commands/` for:

- concise operational guidance
- named recurring workflows
- repo-wide behavior for Claude

### Skills

Use `.claude/skills/` for:

- procedural workflows that benefit from reusable instructions
- edition-aware decision trees
- CLI-first orchestration paths
- future bundled references or deterministic helper scripts

## Step 6: Apply edition-aware branching

When the task is frontend-sensitive or examples differ between editions, branch explicitly.

### Cabloy Basic

Bias toward:

- current public monorepo source
- public docs examples
- the Basic repo marker
- current Basic frontend flavors and module layout

### Cabloy Start

Bias toward:

- the Start repo marker
- Vuetify-sensitive examples
- Start-specific frontend flavor names
- Start-specific modules and private-value repo structure

Do not silently reuse Basic examples when Start-specific assumptions matter.

## Step 7: Verification

Always finish with a verification plan that matches the work.

### For docs or AI-asset changes

Verify:

- referenced paths exist
- command names still exist
- public docs, internal docs, and rules tell a consistent story
- edition-specific notes point to the right repo assumptions

### For backend/frontend workflow changes

Prefer the narrowest useful checks first, then broader checks when needed.

Typical shared checks include:

- root scripts such as `npm run tsc`, `npm run test`, `npm run build`
- command help or discovery output from `npm run vona` / `npm run zova`
- targeted build/dev/typecheck flows for the affected side

## Response pattern

When you use this skill, structure the response around these points when helpful:

1. detected edition
2. detected task layer
3. recommended CLI or repo entrypoint
4. files or directories likely involved
5. verification steps

Keep the response practical. The value of this skill is not extra prose. The value is choosing the right Cabloy workflow quickly and accurately.
