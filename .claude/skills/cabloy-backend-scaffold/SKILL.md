---
name: cabloy-backend-scaffold
description: Use this skill whenever the user wants the Vona backend path in this Cabloy repo: scaffold or extend modules, beans, controllers, services, models, entities, DTOs, CRUD resources, migrations, indexes, validation, OpenAPI-facing backend files, or backend tests. Trigger for questions about which npm run vona generator or CRUD command to use and what backend follow-up is required after generation, especially when the user mentions create:bean, CRUD, meta.version, field indexes, DTOs, or tests. Prefer it for backend-first requests, even if they may later require frontend contract regeneration. Do not use it for frontend-first Zova work or stale generated consumer diagnosis.
---

# Cabloy Backend Scaffold

Use this skill when the user wants to add or extend a Vona backend feature thread.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. stay backend-first unless the request clearly becomes a larger fullstack workflow
3. prefer Vona CLI generation and CRUD tools over manual scaffolding
4. always perform a backend follow-up review so migration, field indexes, DTO/OpenAPI contracts, and tests are not forgotten
5. add a frontend-contract reminder only when the backend change likely affects OpenAPI consumers or generated SDK flows
6. finish with verification guidance that matches the scope of the change

## Step 1: Detect repo and task scope

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- `__CABLOY_BASIC__` present → this is Cabloy Basic
- `__CABLOY_START__` present → this is Cabloy Start
- neither present → inspect nearby scripts and ask before making edition-specific assumptions

Then classify the request:

- **backend-only** if the task is about Vona modules, beans, models, entities, DTOs, CRUD, migration, tests, or backend contracts
- **fullstack** only if the task clearly requires frontend SDK regeneration, frontend page/component work, or a broader cross-stack contract loop

Default to backend-first. Only escalate mentally to a broader fullstack workflow when the backend change obviously crosses the contract boundary.

If the user is still deciding a new business-domain boundary or suite/module naming, use the root `cabloy-domain-planning` skill before scaffolding.

If the task is really a broad cross-stack workflow, consider whether the root `cabloy-workflow` skill is the better primary router.

## Step 2: Start from Vona CLI and repo entrypoints

Inspect these surfaces before proposing implementation:

- the repository or workspace `package.json` that owns the scripts
- `npm run vona`
- Vona command families such as `create:*`, `init:*`, `tools:*`, and `bin:*`
- `cabloy-docs/backend/` for the relevant backend thread

For deeper reference material, read:

- `references/backend-thread-map.md`
- `references/follow-up-checklist.md`

## Step 3: Choose the correct scaffolding path

### Path A: create one backend bean or module piece

Use `create:*` when the user needs one structural piece such as:

- module
- bean
- controller
- service
- model
- entity
- dto
- test

Typical examples:

- `npm run vona :create:module ...`
- `npm run vona :create:bean controller ...`
- `npm run vona :create:bean dto ...`
- `npm run vona :create:test ...`

### Path B: create a full CRUD thread

Use `tools:*` when the user needs a whole backend thread rather than one isolated file.

Typical example:

- `npm run vona :tools:crud ...`

Choose this path when the user asks for a CRUD feature, an admin-style backend resource thread, or a connected set of controller/service/model/entity/dto/test files.

### Path C: initialize supporting module resources

Use `init:*` when the task is really about module support files rather than business logic itself.

Typical areas include:

- config
- locale
- constant
- asset
- types

## Step 4: Inspect the generated backend thread

After generation, inspect what the CLI created and keep it as the baseline.

Typical backend thread pieces include:

- controller
- service
- model
- entity
- dto
- migration/meta files
- locale files
- tests

Do not throw away the generated structure and rewrite it from scratch unless the generator clearly does not match the task.

## Step 5: Apply backend follow-up logic deliberately

Backend scaffolding is rarely complete after file generation alone. Treat this follow-up review as mandatory.

Check which of these concerns apply:

### Contract and validation

Check whether the feature needs:

- request validation
- DTO design
- OpenAPI metadata
- inferred DTO generation

### Persistence and schema lifecycle

Check whether the feature needs:

- migration/version updates
- `meta.version`
- field indexes
- relation definitions
- datasource or cache considerations

### Verification

Check whether the feature needs:

- unit tests
- `db:reset` or migration verification
- controller action testing
- broader `test` / `tsc` / `build` checks

### Optional frontend-contract reminder

Stay backend-first, but if the backend change likely affects frontend contract consumers, add a reminder such as:

- OpenAPI output may have changed
- frontend SDK or schema-driven layers may need regeneration
- the active edition and frontend flavor may matter for the regeneration path

Do not turn the skill into a full frontend workflow. Only surface the reminder when the contract boundary is clearly involved.

## Step 6: Use docs to avoid missing layers

Use the docs to decide what the generated backend thread still needs.

Especially relevant pages include:

- `cabloy-docs/backend/controller-guide.md`
- `cabloy-docs/backend/service-guide.md`
- `cabloy-docs/backend/model-guide.md`
- `cabloy-docs/backend/entity-guide.md`
- `cabloy-docs/backend/dto-guide.md`
- `cabloy-docs/backend/crud-workflow.md`
- `cabloy-docs/backend/migration-and-changes.md`
- `cabloy-docs/backend/field-indexes.md`
- `cabloy-docs/backend/unit-testing.md`
- `cabloy-docs/backend/validation-guide.md`
- `cabloy-docs/backend/openapi-guide.md`
- `cabloy-docs/backend/dto-infer-generation.md`

## Step 7: Verification guidance

Always end with a verification path that matches the scope of the backend change.

Typical shared checks include:

- `npm run test`
- `npm run tsc`
- `npm run build`

Narrower checks may include:

- module test updates
- route/controller action verification
- migration reset flow
- CRUD workflow test coverage

## Response pattern

When helpful, structure the response around these points:

1. detected edition
2. backend-first or clearly fullstack-sensitive classification
3. recommended Vona CLI path
4. required backend follow-up layers to check
5. optional frontend-contract reminder if applicable
6. verification steps

Keep the response practical. The value of this skill is turning Cabloy backend requests into the right generation + refinement + verification workflow, not writing more prose than necessary.
