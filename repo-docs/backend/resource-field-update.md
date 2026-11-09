# Existing Resource Field Update

<Badge type="tip" text="Common" />

Use this workflow when changing a field on an existing Vona resource. It covers a new persisted field, validation or metadata refinement, enum-like constraints, and the optional renderer follow-up that connects backend `ZovaRender.*(...)` metadata to Zova resources.

This is a field-update workflow, not a substitute for initial module or CRUD scaffolding. For a new backend thread, start from [CRUD Workflow](/backend/crud-workflow). For an already stale generated consumer, start from the [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## When to use this workflow

Use it when you need to:

- add a stored field to an existing resource;
- refine validation, titles, OpenAPI metadata, or `ZovaRender.field(...)` / `ZovaRender.cell(...)` metadata for an existing field;
- add enum-like field constraints;
- filter or sort an existing foreign-key field by a display column from its related table without replacing the stored foreign-key contract;
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

Normal startup does not replay an already-applied positive-numbered migration branch. Managed focused tests exercise the edited path on an isolated test database, not the development database. A no-bump decision does not authorize a destructive dev reset; use a new incremental migration when existing data must be preserved. See [Migration and Changes](/backend/migration-and-changes#local-development-workflow) for the verification and development-database decision paths.

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

## Filter and sort a relation by its display field

A resource list can search and order a relation by a human-readable column from its related table without changing the persisted relation contract. Keep the entity field as the foreign-key identity; put the related-field binding in the select query policy, not in entity filter metadata. For example, `studentId` remains a `TableIdentity` even though the named list filter accepts part of the student's name:

```ts
@Api.field(v.tableIdentity())
studentId: TableIdentity;
```

Declare the canonical display alias, its allowed operators, and its server-owned binding with `$defineQuery`. This policy follows the Training Record pattern and preserves its default ordering:

```ts
export const recordQuery = $defineQuery(() => ModelRecord, {
  name: 'TrainingRecordSelect',
  fields: {
    name: { operators: ['eq', 'containsI'] },
    studentId: { operators: ['eq'] },
    studentName: { operators: ['containsI'] },
    createdAt: { operators: ['gte', 'lt', 'lte'] },
  },
  orderable: ['id', 'name', 'studentId', 'studentName', 'createdAt'],
  defaults: { orders: [{ field: 'createdAt', direction: 'desc' }] },
  bindings: {
    studentName: {
      modelLike: () => ModelStudent,
      field: 'name',
      localKey: 'studentId',
      foreignKey: 'id',
      joinType: 'innerJoin',
    },
  },
  conveniences: { studentId: { field: 'studentName', op: 'containsI' } },
  projection: { mode: 'fixed' },
});
```

`bindings.studentName` obtains the scalar schema from the related Model's `name` field and binds the owning resource's `studentId` to that Model's `id`. `conveniences.studentId` maps the named UI input to the canonical `studentName` predicate. The canonical `studentId` field remains available for an identity `eq` comparison; it does not acquire text-search semantics.

Use `innerJoin` deliberately when a related-field predicate must require a matching related row. For an optional relation, use `leftJoin` (the binding default) when unmatched rows must remain eligible, and choose predicates/null checks accordingly. Related-field sorting uses a scoped scalar lookup, not a row-multiplying outer query join; sorting alone does not exclude unmatched rows, and null values sort last.

Keep `studentId` as the named filter and table-column key, but use `studentName` for canonical display-name predicates and orders. Associate the policy with the select request DTO and refine only the named query-input schema and renderer. A minimal named-filter projection is:

```ts
@Dto({
  query: recordQuery,
  fields: {
    studentId: $makeSchema(
      ZovaRender.field('basic-input:formFieldInput'),
      v.optional(),
      z.string(),
    ),
  },
})
export class DtoRecordSelectReq extends $Dto.queryPage(recordQuery, ['studentId']) {}
```

In an existing DTO, retain its other named filters and refinements, such as `name` and the `createdAt` date-range transform. The renderer key above is Cabloy Basic-specific; resolve the equivalent renderer in the active edition. The entity and create/update contracts remain foreign-key identities. There is no need for a second named `studentName` form control: `studentName` is the canonical policy alias, while `studentId` is the convenience input.

The table maps its `studentId` column through the published convenience capability to `studentName` and submits `orders: [{ field: 'studentName', direction: 'asc' }]`. It inherits that published orderability without `enableSorting: true`; only the server-owned binding supplies the related lookup. Use `ZovaRender.column({ enableSorting: false })` only when the UI should hide an otherwise allowed sort. See [Table Guide](/frontend/table-guide#configure-physical-columns-with-zovarendercolumn) for the column contract.

Do not use removed `v.filter` options `table`, `joinType`, `joinOn`, or `originalName`, or DTO-level `openapi.filter.table`, to configure this path. Policy `bindings` and `conveniences` replace that metadata; the binding's own `joinType` remains supported. This does not remove `v.filter`, filter transforms, query capabilities, or trusted internal ORM joins. See [Public Query Guide](/backend/public-query-guide) for the public contract and compiler boundary, [ORM Select Guide](/backend/orm-select-guide) for trusted ORM operations, and [Filter to Query to Select Data Flow](/frontend/filter-query-select-data-flow-guide) for the list-page path.

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

For public implementation patterns, see [Form Guide](/frontend/form-guide), [TableCell Authoring Cookbook](/frontend/table-cell-cookbook#pattern-7-backend-contract-to-frontend-cell-handoff), and the Basic-only [Custom Form/Table Renderers tutorial](/fullstack/tutorial-4-custom-level-renderers).

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

For join-backed relation filtering and sorting, also verify:

- the named request field is optional text while the entity remains a foreign-key identity;
- the policy has the intended related Model/field/key binding and operator allowlist, while published `filter.capabilities.query` metadata exposes the alias, orderability, and convenience mapping without backend binding details;
- the select action exposes the intended named filter without an unintended second display-name form control, alongside the admitted canonical `where` and `orders` controls;
- named text filtering normalizes to a canonical display-alias predicate and returns records whose related display value matches; an admitted canonical identity comparison remains distinct;
- ascending and descending canonical orders return the expected related-display ordering, with separate checks for unmatched-row predicate semantics and null-last sorting.

For constrained enum-like values, add a negative test that proves an invalid value is rejected. Test-local persisted resources must be deleted in `finally` using precise owned identities and reverse dependency order.

## Verification checklist

Choose checks that match the layers changed:

- inspect generated schema/OpenAPI after structure-shaping field changes;
- run the narrow resource test and relevant typecheck;
- verify affected migration, initialization, or seed behavior through managed isolated tests, preferably focused; focused runs still prepare a fresh test database, so a `meta.version.ts` edit alone does not require the full suite;
- decide development-database updates separately: tests do not update dev data, pending migrations apply through normal startup, and replaying an already-applied positive-numbered branch on disposable dev data requires explicit reset approval;
- run the relevant frontend metadata/build/dependency synchronization when custom renderer resources are involved;
- verify action-level serializer behavior with an API test when `v.serializer*` metadata changes returned fields;
- for relation-backed filters and sorting, inspect normalized canonical `where` / `orders` and the compiled query behavior, then exercise the resource endpoint; do not require a public or top-level ORM `joins` object, because related predicates compile through main-ID membership and related orders through scoped scalar lookups.

Finish by confirming the backend contract, frontend resources, generated handoff, and user-visible locale labels all describe the same field behavior.
