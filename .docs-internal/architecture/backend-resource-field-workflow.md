# Backend Resource Field Update Workflow

This note records the preferred AI-assisted workflow for adding or refining fields on an existing Vona backend resource.

Use it when a task involves one or more of these changes:

- add a new persisted field to an existing resource
- tighten validation for an existing field
- add enum-like constraints to a field
- attach `ZovaRender.field(...)` or `ZovaRender.cell(...)` metadata
- update the migration, locale, DTO-inference, or test layers that follow from a field change

## Purpose

This workflow exists to prevent the most common mistakes in field-change tasks:

- changing persistence without deciding the `fileVersion` strategy first
- editing `meta.version.ts` in a way that breaks fresh install vs upgrade behavior
- forgetting that DTOs may already be inferred from the entity/model chain
- skipping locale updates
- creating custom frontend renderers when an existing shared renderer already fits
- stopping after the entity edit without adding or updating tests

## First decision: persisted field or metadata-only change?

Start by classifying the request.

### Case A: new persisted field on an existing resource

Examples:

- add `level: number`
- add `status: string`
- add a new stored relation key

This case requires an explicit versioning decision **before** changing `meta.version.ts` or the module schema path.

Ask the user:

- should `vonaModule.fileVersion` be incremented?

Then follow one of the two branches below.

### Case B: metadata-only or validation/render-only refinement

Examples:

- add enum validation to an existing persisted field
- add `ZovaRender.field(...)` / `ZovaRender.cell(...)`
- add or refine locale labels
- tighten validation for an existing field without changing storage shape

This case usually does **not** require a new `fileVersion`, because the persisted field already exists.

## Versioning decision tree for new persisted fields

### If the user says to increment `fileVersion`

Then:

1. bump `vonaModule.fileVersion` in the module `package.json`
2. add a new migration branch in `meta.version.ts`
3. keep earlier version branches as historical snapshots
4. put the new persisted field change in the new version branch

Important pitfall:

- in this repo, fresh install can execute version migrations sequentially
- therefore, do **not** retroactively add the new column to an older create path and also add it again in the new migration branch
- that pattern can create duplicate-column failures on fresh databases

Practical rule:

- when you bump from version `N` to `N + 1`, the new persisted field should normally be introduced in version `N + 1`, not duplicated back into older historical branches

### If the user says not to increment `fileVersion`

Then:

1. keep the current `vonaModule.fileVersion`
2. fold the schema change into the current version path
3. do not create a new migration version branch

Use this branch only when the user explicitly wants the field addition folded into the current version path rather than treated as a new upgrade step.

## Recommended execution order

### 1. Inspect the existing thread first

Check the existing resource thread before editing anything:

- entity
- model
- DTOs
- controller
- service
- `meta.version.ts`
- module `package.json`
- locale files
- tests

Also inspect the relevant repo entrypoints first:

- root `package.json`
- `npm run vona`
- `npm run zova`

The goal is to confirm whether the resource already follows the standard inferred DTO / CRUD pattern.

### 2. Update the entity first

For most backend resource field work, the entity is the primary source of truth.

Typical changes include:

- `@Api.field(...)`
- `v.required()` / `v.optional()`
- `v.title($locale(...))`
- `ZovaRender.order(...)`
- explicit zod schema when the field has constrained allowed values

If the field is an enum-like numeric or string choice, prefer a constrained schema such as:

- `z.union([z.literal(1), z.literal(2), z.literal(3)])`

This keeps the contract explicit and testable.

### 3. Reuse inferred DTO flow unless source proves otherwise

Do not hand-edit DTO field lists by default.

First verify whether the module uses inferred DTOs such as:

- `$Dto.create(...)`
- `$Dto.update(...)`
- `$Dto.get(...)`

If the DTOs are inferred from the entity/model chain, let the entity change propagate naturally.

Only add manual DTO changes when the source clearly requires them.

### 4. Prefer shared renderers for enum-like fields

If the field needs form and table rendering metadata, inspect existing shared renderer modules before creating new frontend code.

Default preference order:

1. reuse an existing shared renderer
2. configure it with field-level options
3. only create a new custom renderer if the shared surface cannot express the needed behavior

For enum-like values, apply an edition-aware default.

In Cabloy Basic, the usual default is:

- `ZovaRender.field('basic-select:formFieldSelect', { items, placeholder })`
- `ZovaRender.cell('basic-select:select', { items })`

This is usually enough for simple labeled choices.

In Cabloy Start:

- do not assume the same renderer keys or empty-item behavior from the Basic component family
- verify the `start-select` wrapper and its underlying component semantics before copying Basic-specific select logic

Important AI-facing nuance:

- when using a field-rendering select component, default to providing a user-visible `placeholder` unless the UX clearly requires an always-preselected value
- in Cabloy Basic, `basic-select:formFieldSelect` should prefer `placeholder` rather than an artificial empty item when the goal is to keep the field initially unchosen

### 4A. When a task explicitly needs a custom renderer demo

Sometimes the goal is not just to solve the field-rendering need, but to demonstrate the full custom-renderer workflow for future AI or maintainer use.

In that case, keep the normal preference for shared renderers conceptually, but intentionally implement a module-local custom renderer pair so the workflow is preserved as a concrete example.

Recommended structure:

- custom FormField component in the frontend module, for example:
  - `zova/src/module/<module-name>/src/component/formFieldX/controller.tsx`
- custom backend-usable TableCell renderer as a `@TableCell(...)` bean, for example:
  - `zova/src/module/<module-name>/src/bean/tableCell.x.tsx`

Important distinction:

- `ZovaRender.field(...)` can target a custom component key
- `ZovaRender.cell(...)` should target a registered table-cell key backed by a `@TableCell(...)` bean
- a plain frontend component alone is not enough for a backend table-cell render key

Recommended implementation style:

- keep option shapes compatible with the shared renderer being mimicked
- reuse the existing data contract such as `items`, `itemValue`, and `itemTitle`
- copy behavior from the closest shared renderer first, then add only the minimum module-local customization needed for the demo

For a select-like field, the best baseline references are:

- `zova/src/suite/cabloy-basic/modules/basic-select/src/component/formFieldSelect/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-select/src/bean/tableCell.select.tsx`

### 5. Update locale entries together with the field

If a field title or enum labels are user-visible, update locale files in the same change.

Typical layers:

- field title such as `Level`
- enum item labels such as `LevelBeginner`, `LevelIntermediate`, `LevelAdvanced`

Keep the locale style consistent with the surrounding module.

### 6. Update persistence carefully

For new persisted fields, update:

- `meta.version.ts`
- module `package.json` if `fileVersion` changes

Check both runtime paths conceptually:

- fresh install
- upgrade from an older module version

If the migration strategy would add the same column twice across historical and new branches, stop and fix that before running tests.

### 7. Add or update tests in the same task

Minimum expected coverage for a backend resource field change is usually:

- create with the new field
- select/list path still works
- update persists the new field
- get-by-id/view returns the new field
- delete flow still works when relevant

For constrained enum-like fields, also add a negative test such as:

- invalid value is rejected

That test should assert the validation failure in the repo’s existing style.

## Verification checklist

### If `meta.version.ts` changed

Run:

```bash
npm run test
```

Reason:

- the test database must be reinitialized so schema/version mismatches surface early

This is a project rule, not an optional extra.

### If the change is narrower

Start with the narrowest meaningful verification, for example:

```bash
cd vona && npm test -- student.test.ts
cd vona && npm run tsc
```

Then widen only if the scope or failures justify it.

### If the task introduces a new custom frontend renderer used by backend field metadata

Recommended verification order:

1. regenerate frontend module metadata
2. build the relevant frontend SSR/rest target so both bundle output and type surface are refreshed
3. run `deps:vona` so the Vona-side file dependencies are synchronized
4. run Vona typecheck
5. run the narrow backend test that exercises the resource contract

For the current Cabloy Basic admin flow, the representative commands are:

```bash
npm run zova :tools:metadata <module-name>
npm run build:zova:admin
npm run deps:vona
cd vona && npm run tsc
cd vona && npm test -- <resource-test>.test.ts
```

If the same renderer path must also be available for web SSR, add the corresponding web build and then repeat the dependency-sync step.

Practical recovery rule:

- if `.zova-rest/*` has been regenerated correctly but Vona still behaves as if the old renderer types are installed, suspect a stale or unhealthy `vona/node_modules` installation state
- in that case, after normal `deps:vona`, the most reliable recovery is to rebuild `vona/node_modules` and reinstall dependencies so the local file packages are relinked cleanly

## Checklist for enum-like field refinements

Use this quick list when the field already exists but now needs discrete allowed values and UI rendering metadata.

- confirm the field already exists in persistence
- keep `fileVersion` unchanged unless persistence is changing again
- add explicit zod allowed-value schema
- add `items` metadata for renderer labels
- prefer `basic-select` before creating custom renderer code
- update locale labels for both the field title and enum item text
- add an invalid-value test
- rerun the narrow resource test and typecheck

## Checklist for custom renderer demos

Use this quick list when the task explicitly wants to demonstrate how to build and register a custom renderer, even though an existing shared renderer would already work.

- confirm whether the task is instructional/demo-oriented rather than a pure reuse task
- keep the existing field business semantics unchanged where possible
- add a module-local FormField component
- add a module-local `@TableCell(...)` bean for backend cell rendering
- keep renderer option shapes compatible with the shared renderer baseline when practical
- regenerate frontend module metadata
- run the relevant frontend SSR/rest build
- run `deps:vona`
- if Vona still sees stale renderer types, rebuild `vona/node_modules` and reinstall
- rerun Vona typecheck
- rerun the narrow backend resource test

## Checklist for new persisted fields

Use this quick list when the field does not yet exist in storage.

- ask whether to increment `vonaModule.fileVersion`
- update entity metadata
- verify whether DTOs are inferred
- update locale files
- update `meta.version.ts`
- update module `package.json` if `fileVersion` changes
- check fresh install vs upgrade behavior
- update CRUD tests
- run `npm run test`

## Demo-student lessons worth preserving

The `demo-student.level` work exposed two easy mistakes.

### Migration/versioning lesson

A persisted-field addition can fail if you:

- add the new column into the older `createTable(...)` path
- and also add it again in the new `alterTable(...)` migration branch

Because fresh install can run version branches sequentially, that produced a duplicate-column failure.

Preserve this invariant for future field additions:

- one schema introduction path per persisted field change for the chosen versioning strategy

### Custom renderer integration lesson

A custom renderer task can appear finished too early if you stop after adding source files and metadata.

For backend `ZovaRender.field(...)` / `ZovaRender.cell(...)` usage, the actual end-to-end chain is:

1. create the frontend component / tableCell bean
2. regenerate frontend metadata
3. build the relevant frontend SSR/rest target
4. run `deps:vona`
5. confirm the regenerated local `zova-rest-*` package is actually visible from Vona’s installed dependency surface
6. only then trust Vona typecheck results

A further practical lesson from this task:

- if the generated `.zova-rest` files already contain the new renderer keys but Vona still fails to resolve them, the issue may be the local installation state rather than the renderer implementation itself

## Related guidance

- `CLAUDE.md`
- `.docs-internal/architecture/ai-enablement.md`
- `cabloy-docs/ai/class-placement-rule.md`
