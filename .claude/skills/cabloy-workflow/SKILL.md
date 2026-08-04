---
name: cabloy-workflow
description: This skill should be used when the main Cabloy problem is workflow routing before implementation: deciding between Vona backend scaffolding, Zova frontend scaffolding, contract-loop work, or docs/AI-enablement homes such as cabloy-docs, .docs-internal, CLAUDE.md, commands, or skills, including cases where Cabloy Basic vs Cabloy Start assumptions affect that routing. Trigger on requests to route, classify, choose a workflow, choose an edition-specific path, or decide where Cabloy guidance should live. Do not use it once the task is already clearly a backend scaffold, frontend scaffold, or contract-loop job.
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

This matters most for frontend work, UI-layer assumptions, flavor names, suite/module availability, SSR site baselines, project assets, and edition-specific AI guidance.

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
- UI-layer-sensitive work
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

### Parallel worktree environment setup

When a request involves a second worktree, concurrent Vona/Zova development, isolated ordinary tests, or managed clean E2E, classify it as fullstack workflow setup. Read [Parallel Worktree Environment](../../../cabloy-docs/fullstack/parallel-worktree-environment.md), the canonical shared recipe maintained in Cabloy Basic for both editions.

This routing skill provides read-only guidance only. Do not infer an `APP_NAME` or ports, edit local overrides, or run `npm run init` from a generic worktree request. When the user wants confirmation-gated local environment setup, ask them to explicitly invoke `/cabloy-worktree-environment`.

The invoked skill detects Basic or Start to select the active root scripts and managed clean-E2E command. It uses Git worktree metadata, the fixed Vona/Zova port baselines, and the worktree basename to recommend an identity and port tuple for confirmation; it does not inspect environment-file content or allocate/reserve a live port. It may write only `vona/env/.env.local` and `zova/env/.env.local`; never use flavor-, mode-, app-mode-, or runtime-specific `.env.*.local` files. A selected Zova development process requires isolated `DEV_SERVER_PORT` and `DEV_SERVER_HMR_PORT` listeners. The shared environment is Vona + Zova development; a worktree runs one Zova development flavor, Admin or Web. Concurrent Admin and Web development requires separately configured linked worktrees.

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

When the request is specifically about master-detail or nested-detail aggregate scaffolding, aggregate-owned detail resources, `:tools:masterDetail`, or nested detail DTO naming/placement in a scaffolding context, route to the dedicated `cabloy-master-detail` skill instead of treating it as generic backend scaffolding.

### Class-placement questions

When the request is about whether a backend base class belongs in `src/lib`, `src/service`, or the global bean shorthand surface, apply the A / B1 / B2 rule.

- **A**: pure helper base -> `src/lib`
- **B1**: subclass-only base -> evaluate case by case, often `src/lib`
- **B2**: runtime-anchor base that still needs container-managed or selector/class-token behavior but should not be a global bean -> prefer `src/service` with `@Service()`

For these requests:

- put the durable operational explanation in `cabloy-docs/`
- put rationale and invariants in `.docs-internal/`
- keep `CLAUDE.md` short and behavioral
- do not treat `@Service()` as a business-layer naming decision only; for B2 it is a runtime-anchor placement choice

### Service underscore files

When a backend base class should move into `src/service`, do not treat the file name as a cosmetic choice.

Prefer `src/service/*_.ts` when the class:

- should remain container-managed
- mainly acts as a runtime-anchor base, selector anchor, or class-token contract
- should not participate in the general full-name registration surface
- may need to keep meaningful `@Virtual()` semantics

Prefer a normal `src/service/*.ts` file when the service-scene class itself should remain part of the general full-name surface.

Do not apply this mechanically to all concrete beans or all abstract classes. Judge by runtime role and registration surface.

### Bean-scene and global shorthand

Treat `src/bean` as the structural definition of the global shorthand surface.

For these requests:

- do not treat `@Virtual()` as a reason to exclude a bean-scene class from `IBeanRecordGlobal`
- if a class in `src/bean` should not be global shorthand, re-evaluate placement first
- prefer B1/B2 relocation over metadata exceptions or manual `IBeanRecordGlobal` patching
- use `IBeanRecordGlobal` as the static authoring-surface registry for global shorthand, not as a full runtime-container inventory

### Global bean lookup workflow

When backend code references `this.bean.xxx`, `ctx.bean.xxx`, or `app.bean.xxx`, prefer this lookup sequence:

1. check `IBeanRecordGlobal` in the relevant module `src/.metadata/index.ts`
2. map the shorthand name to the generated bean type
3. jump from the generated type to the source file in `src/bean`
4. only if the shorthand is not found, re-evaluate whether the target is actually a general full-name bean, a service-scene runtime-anchor, or a lib/helper class

Use `IBeanRecordGeneral` for general full-name beans and `src/service` or service metadata for runtime-anchor/service-scene lookup. Do not treat `IBeanRecordGlobal` as a full container inventory.

## Step 6: Apply edition-aware branching

When the task is frontend-sensitive or examples differ between editions, branch explicitly.

### Cabloy Basic

Bias toward:

- the public framework/reference edition
- current public monorepo source
- the default `npm create cabloy` project route
- public docs examples
- the Basic repo marker
- current Basic frontend flavors, module layout, and DaisyUI + Tailwind CSS UI assumptions

### Cabloy Start

Bias toward:

- the private commercial edition
- the Start repo marker
- the licensed private repository source
- Vuetify-sensitive examples
- Start-specific frontend flavor names
- Start-specific suites/modules, SSR site baselines, project assets, and licensed private-repo structure

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
