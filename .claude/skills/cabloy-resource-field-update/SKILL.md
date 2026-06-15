---
name: cabloy-resource-field-update
description: Use this skill whenever the user wants to update a field on an existing Cabloy backend resource: add a new persisted field, refine validation, add enum-like constraints, attach or change ZovaRender.field / ZovaRender.cell metadata, decide whether vonaModule.fileVersion should change, or demonstrate a custom frontend renderer for a backend field. Trigger when the request is specifically about modifying an existing resource field thread rather than creating a new CRUD/resource thread. Prefer it for backend-first field-update work that may branch into renderer-aware frontend follow-up. Do not use it for initial backend scaffolding, generic frontend scaffolding, or stale generated contract diagnosis.
---

# Cabloy Resource Field Update

Use this skill when the user wants to change a field on an existing Vona backend resource.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. classify the task as a new persisted field or a metadata-only field refinement
3. force the correct `fileVersion` decision before persistence edits
4. keep the workflow entity-first and inferred-DTO-first
5. prefer shared renderer reuse unless the task explicitly asks for a custom renderer demo
6. finish with verification guidance that matches backend and renderer follow-up scope

## Step 1: Detect repo and confirm existing-resource scope

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- `__CABLOY_BASIC__` present → this is Cabloy Basic
- `__CABLOY_START__` present → this is Cabloy Start
- neither present → inspect nearby scripts and ask before making edition-specific assumptions

Then confirm the request is about an **existing** resource field.

Use this skill for requests such as:

- add a field to an existing resource
- tighten validation for an existing field
- add enum-like constraints to an existing field
- add or change `ZovaRender.field(...)` / `ZovaRender.cell(...)`
- decide whether a persisted field change needs a new `fileVersion`
- demonstrate a custom renderer workflow for a backend field

Do **not** use this skill when the user is really asking to create a new module, bean, CRUD thread, page thread, or stale consumer diagnosis flow.

If the request is really about initial backend thread creation, prefer `cabloy-backend-scaffold`.
If the request is really about stale generated frontend/backend consumers, prefer `cabloy-contract-loop`.
If the request is mainly about choosing a workflow, prefer `cabloy-workflow`.

## Step 2: Classify the field change before editing

Branch the request into one of two cases.

### Case A: new persisted field

Examples:

- add `level: number`
- add `status: string`
- add a new stored relation key

This case affects persistence and versioning.

### Case B: metadata-only or validation/render-only refinement

Examples:

- add enum validation to an existing field
- add or change `ZovaRender.field(...)`
- add or change `ZovaRender.cell(...)`
- refine locale labels
- tighten validation without changing storage shape

This case usually does **not** require a `fileVersion` bump, because the persisted field already exists.

## Step 3: Force the `fileVersion` decision for new persisted fields

If the task is a new persisted field on an existing resource, ask whether `vonaModule.fileVersion` should be incremented **before** changing:

- `meta.version.ts`
- the module schema version path
- the module `package.json` `fileVersion`

### If the user says yes

Then:

1. bump `vonaModule.fileVersion`
2. add a new migration branch in `meta.version.ts`
3. preserve older version branches as historical snapshots
4. introduce the new persisted field in the new version branch

Important warning:

- do not add the same new column to an older create path and again to a new migration branch
- fresh install may run version branches sequentially
- that pattern can produce duplicate-column failures

### If the user says no

Then:

1. keep the current `fileVersion`
2. fold the schema change into the current version path
3. do not create a new migration branch

## Step 4: Inspect the current backend thread first

Before proposing or making edits, inspect the existing thread:

- entity
- model
- DTOs
- controller
- service
- `meta.version.ts`
- module `package.json`
- locale files
- tests

Also inspect the shared entrypoints first:

- root `package.json`
- `npm run vona`
- `npm run zova`

Use these references for compact support material:

- `references/field-update-decision-tree.md`
- `references/follow-up-checklist.md`
- `references/verification-checklist.md`

## Step 5: Update the entity first and reuse inferred DTO flow

Treat the entity as the primary field-definition surface.

Typical field-update changes belong here first:

- `@Api.field(...)`
- `v.required()` / `v.optional()`
- `v.title($locale(...))`
- `ZovaRender.order(...)`
- explicit zod schema for constrained values

For enum-like numeric or string values, prefer an explicit constrained schema such as:

- `z.union([z.literal(1), z.literal(2), z.literal(3)])`

Then check whether DTOs are already inferred through patterns such as:

- `$Dto.create(...)`
- `$Dto.update(...)`
- `$Dto.get(...)`

If the DTOs are inferred from the entity/model chain, let the entity change propagate. Do not hand-edit DTO field lists unless the source clearly requires it.

## Step 6: Apply the renderer branch deliberately

### Default rule: prefer shared renderer reuse

If the field needs form or table rendering metadata, inspect shared renderers first.

Default preference order:

1. reuse an existing shared renderer
2. configure it with field-level options
3. only create a new custom renderer if the shared surface cannot express the needed behavior

For enum-like values, the best default is usually:

- `ZovaRender.field('basic-select:formFieldSelect', { items })`
- `ZovaRender.cell('basic-select:select', { items })`

### Custom renderer demo rule

If the user explicitly wants to **demonstrate** the custom renderer workflow, branch into a frontend follow-up path.

Use these references:

- `references/custom-renderer-demo-checklist.md`
- `.docs-internal/architecture/backend-resource-field-workflow.md`

Recommended shape:

- module-local FormField component for backend field rendering
- module-local `@TableCell(...)` bean for backend table-cell rendering
- metadata regeneration
- frontend build
- `deps:vona`
- Vona-side typecheck and targeted backend test

Important warning:

- a plain frontend component alone is not enough for backend `ZovaRender.cell(...)`
- the backend table-cell render key should be backed by a registered `@TableCell(...)` bean

## Step 7: Always close the remaining layers

### Locale

If titles, enum labels, or helper text are user-visible, update locale files in the same task.

Typical additions:

- field title like `Level`
- enum labels like `LevelBeginner`, `LevelIntermediate`, `LevelAdvanced`
- custom renderer helper text when applicable

### Tests

Minimum expected backend coverage usually includes:

- create with the field
- select/list still works
- update persists the field
- get-by-id/view returns the field
- delete flow still works if relevant

For constrained enum-like fields, add a negative test such as:

- invalid value is rejected

### Verification

Always end with a verification path matched to the scope.

Typical checks include:

- `npm run test`
- `npm run tsc`
- `npm run build`
- narrow resource test runs
- renderer/build/deps synchronization when custom frontend renderers are involved

## Response pattern

When helpful, structure the response around these points:

1. detected edition
2. persisted-field vs metadata-only classification
3. `fileVersion` decision if needed
4. backend thread surfaces to inspect or modify
5. shared-renderer reuse vs custom-renderer branch
6. verification steps

Keep the response practical. The value of this skill is turning existing-resource field updates into the correct Cabloy decision tree with the right backend and renderer follow-up, not writing a broad architecture essay.
