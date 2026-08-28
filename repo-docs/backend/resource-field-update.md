# Existing Resource Field Update

<Badge type="tip" text="Common" />

Use this workflow when changing a field on an existing Vona resource. It covers a new persisted field, validation or metadata refinement, enum-like constraints, and the optional renderer follow-up that connects backend `ZovaRender.*(...)` metadata to Zova resources.

This is a field-update workflow, not a substitute for initial module or CRUD scaffolding. For a new backend thread, start from [CRUD Workflow](/backend/crud-workflow). For an already stale generated consumer, start from the [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## When to use this workflow

Use it when you need to:

- add a stored field to an existing resource;
- refine validation, titles, OpenAPI metadata, or `ZovaRender.field(...)` / `ZovaRender.cell(...)` metadata for an existing field;
- add enum-like field constraints;
- decide whether a persisted field change increments `vonaModule.fileVersion`;
- add a custom form-field or table-cell renderer because shared renderer options are insufficient.

Before changing anything, detect the active edition from the root marker. Explain the common backend workflow once, then resolve renderer keys, frontend flavors, build commands, and generated-output paths from the active edition.

## Persisted field or metadata-only change

Classify the work before editing migration code.

### New persisted field

Examples include a new `level: number`, `status: string`, or stored relation key. This changes storage shape and requires an explicit `fileVersion` decision.

### Metadata-only or validation/rendering refinement

Examples include:

- enum validation for a field that already exists in storage;
- a new field or table rendering hint;
- locale-label changes;
- stricter validation that does not change storage shape.

This usually does not require a `fileVersion` increment. Confirm the current schema first instead of assuming the field already exists.

## Decide whether to increment fileVersion

For a new persisted field, decide with the user **before** editing `meta.version.ts`, a versioned schema path, or the module `package.json`.

### Increment fileVersion

When the change needs a new sequential migration:

1. increment `vonaModule.fileVersion`;
2. add a new `meta.version.ts` migration branch;
3. preserve older branches as historical snapshots;
4. introduce the field only in the new version branch.

Do not add the same column to an older create path and again to a later migration branch. A fresh installation can apply the branches sequentially and fail on a duplicate column.

### Keep the current fileVersion

When the user decides not to create new migration history:

1. keep the current `fileVersion`;
2. fold the schema change into the current version path;
3. do not create a new migration branch.

For the complete migration lifecycle and test requirement, see [Migration and Changes](/backend/migration-and-changes#decide-whether-to-increment-fileversion).

## Inspect the existing resource thread

Read the current implementation before proposing changes:

- entity and model;
- DTOs, controller, and service;
- `meta.version.ts` and module `package.json`;
- locale files;
- resource tests;
- root `package.json`, `npm run vona`, and `npm run zova`.

Use source patterns to determine whether DTOs are inferred. Do not hand-edit generated consumers or duplicate existing schema metadata.

## Update entity truth first

Treat the entity as the primary field-definition surface. Typical changes begin with `@Api.field(...)`, validation helpers, titles, and `ZovaRender.*(...)` metadata.

For enum-like values, prefer a constrained schema that expresses the allowed values explicitly, for example `z.union([z.literal(1), z.literal(2), z.literal(3)])`.

Structure-shaping schema helpers remain order-sensitive. When a field uses `v.object(...)`, `v.array(...)`, `v.optional()`, `v.nullable()`, `v.default(...)`, preprocess/transform wrappers, or an explicit zod schema, keep the final structure-defining schema-like argument last. Then verify emitted schema/OpenAPI output rather than assuming argument reordering is safe.

For the underlying contract surface, see [Entity Guide](/backend/entity-guide#api-field-as-the-shared-contract-surface).

## Preserve the inferred DTO flow

When DTOs use `$Dto.create(...)`, `$Dto.update(...)`, `$Dto.get(...)`, or another inferred projection, let the entity change propagate. Add hand-authored field lists only when the current source demonstrates an intentional business projection or a separate contract-only field.

For projected fields, use `$makeMetadata(...)` for metadata-only refinement and `$makeSchema(...)` for schema or validation refinement. Use a class-body `@Api.field(...)` member only for a genuinely new declared field.

Read [DTO Infer and Generation](/backend/dto-infer-generation) when inference cannot express the intended contract. If serialization metadata controls the returned value, also confirm that the target controller action opts into `@Core.serializer()`.

## Choose the renderer branch

Prefer the smallest rendering change that expresses the requirement:

1. reuse an existing shared renderer;
2. configure it with field-level options;
3. create a custom module-local renderer only when the shared surface cannot express the needed behavior.

For a field-rendering select, provide a visible placeholder unless the UX genuinely requires a preselected value.

### Shared renderer reuse

Resolve renderer keys and component behavior in the active edition. Cabloy Basic and Cabloy Start can differ in select wrappers, placeholder behavior, UI library, flavors, and generated outputs. Do not copy a Basic renderer key or empty-item convention into Start without inspecting the Start baseline.

### Custom renderer follow-up

A custom backend-rendered field normally needs both sides of the frontend pair:

- a module-local FormField component;
- a registered module-local `@TableCell(...)` bean when backend `ZovaRender.cell(...)` references a table cell.

A plain frontend component is not sufficient for backend table-cell metadata. Reuse the closest shared renderer’s option/data flow and keep the customization focused.

For public implementation patterns, see [Form Guide](/frontend/form-guide), [TableCell Cookbook](/frontend/table-cell-cookbook#pattern-7-backend-contract-to-frontend-cell-handoff), and the Basic-only [Custom Form/Table Renderers tutorial](/fullstack/tutorial-4-custom-level-renderers).

## Follow the contract loop

A field change commonly has two possible handoffs:

- a persisted entity/DTO/OpenAPI change begins with the **forward chain**: update backend truth, verify emitted contract output, regenerate frontend consumers, then make thin follow-up changes;
- a new frontend-owned FormField or TableCell resource begins the **reverse chain**: update frontend source, regenerate metadata when needed, run the active edition’s complete frontend build, then run `npm run deps:vona`.

Do not treat `build:rest:*` alone as sufficient for reverse-chain work. The SSR bundle and REST output must move together. If generated `.zova-rest` output already contains the expected keys but Vona still sees stale types after the normal build and dependency sync, treat the issue as local dependency drift and repair the local installation state before hand-patching generated links.

Use the [Contract Loop Playbook](/fullstack/contract-loop-playbook) for edition-aware commands and recovery details.

## Update locale and tests

Update locale files when users can see field titles, enum labels, placeholders, or renderer helper text.

Minimum backend coverage generally includes:

- create with the field;
- select/list behavior;
- update persistence;
- get-by-id or view response;
- delete behavior when it is relevant.

For constrained enum-like values, add a negative test that proves an invalid value is rejected. Test-local persisted resources must be deleted in `finally` using precise owned identities and reverse dependency order.

## Verification checklist

Choose checks that match the layers changed:

- inspect generated schema/OpenAPI after structure-shaping field changes;
- run the narrow resource test and relevant typecheck;
- run `npm run test` for any `meta.version.ts` change so the test database is recreated and migration consistency is exercised;
- run the relevant frontend metadata/build/dependency synchronization when custom renderer resources are involved;
- verify action-level serializer behavior with an API test when `v.serializer*` metadata changes returned fields.

Finish by confirming the backend contract, frontend resources, generated handoff, and user-visible locale labels all describe the same field behavior.
