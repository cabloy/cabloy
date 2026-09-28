# Follow-up Checklist

After generating or extending a backend thread, check which follow-up layers apply.

## Structural follow-up

- controller path and action shape
- service ownership of business logic
- model/entity pairing
- DTO design

## Contract follow-up

- validation rules
- OpenAPI metadata
- inferred DTO opportunities
- treat `$Dto.get(...)` as the complete model-aware read shape by default; use `columns` or `dtoClass` only for a genuine business/query/response projection, not solely to remove `iid` or `deleted`
- treat the top-level `$Dto.create(...)` / `$Dto.update(...)` default omissions as a write-input authorization boundary, not as a reason to mechanically narrow ordinary `$Dto.get(...)` contracts
- when a narrowed DTO or OpenAPI schema is expected to remove physical response fields, separately shape and verify the action response; declaration narrowing alone does not guarantee runtime field stripping
- when stable Entity, Model, relation, or query truth exists, define the DTO projection first with `$Dto.*` and, where needed, `columns`, `include`, or `dtoClass`
- for an inferred/projected field, use `$makeMetadata(...)` for metadata-only refinement and `$makeSchema(...)` for schema or validation refinement; use a class-body `@Api.field(...)` member only for a genuinely new declared field
- before using `$makeMetadata(...)`, confirm the `fields` key already has an inferred/projected schema; a true virtual key added only through `@Dto({ fields })` must use `$makeSchema(...)` with a final concrete `z.<type>()` schema, because `fieldSource(...)` maps a source path but supplies no missing type; see [Virtual fields in the DTO fields map](../../../../repo-docs/backend/dto-infer-generation.md#virtual-fields-in-the-dto-fields-map)
- when inference cannot express the contract clearly, choose an explicit DTO deliberately; see [Default-first three-layer DTO authoring](../../../../repo-docs/backend/dto-infer-generation.md#default-first-three-layer-dto-authoring)
- frontend contract impact
- `@Api.field(...)` / `$makeSchema(...)` ordering: framework guards now preserve previously attached OpenAPI metadata across schema rebuilds, but structure-shaping schemaLike is still order-sensitive
- when an explicit zod/custom schema or other structure-defining schemaLike is present, put that structure-defining schemaLike last because `makeSchemaLikes(...)` applies arguments right-to-left and later structure changes can otherwise alter or replace the intended schema
- treat `v.object(...)`, `v.array(...)`, `v.optional()`, `v.nullable()`, `v.default(...)`, and preprocess/transform wrappers as structure-shaping rather than metadata-only
- after touching structure-shaping schemaLike, verify the emitted schema/OpenAPI result explicitly

### Conditional RBAC metadata follow-up

When the active edition and installed modules provide `@Passport.rbac(...)` and a task adds or changes a decorated action:

- verify the decorator, RBAC catalog, and any policy-catalog/editor consumer in the active source before making availability claims
- provide locale-aware `summary` metadata at both the controller and action levels; these scopes are independent and must be authored explicitly
- add locale-aware `description` metadata only when the business or administrative experience needs explanatory text
- keep action keys, controller bean names, action names, routes, and other authorization/integration identifiers stable and nonlocalized
- treat summary/description as presentation metadata, not authorization identity or enforcement
- verify the explicit server-side catalog/editor projection; do not assume OpenAPI metadata is automatically displayed by a policy editor

## Persistence follow-up

- migration/version changes
- `meta.version`
- field indexes; in shared-database multitenancy, preserve ordinary lookup indexes and enforce business uniqueness in tenant-aware business logic rather than with `table.unique(...)`
- relations
- datasource choice
- cache behavior
- cross-Model query-cache dependencies: when a source mutation can change another Model's cached query members, totals, projections, includes, or visibility, declare exactly one directed `modelsClear` / `modelsClearedBy` edge
- keep the dependency graph acyclic and free of duplicate edges; do not declare both forms for the same edge because propagation is transitive and current runtime collection does not deduplicate targets
- when `modelsClearedByFn` is required, treat it as replacement behavior and explicitly own the target clear and any necessary downstream propagation
- prefer normal Model/service mutation paths so source invalidation, commit-time re-clear, and configured double-delete remain active
- add a warm-query → mutate-source → repeat-query regression test for each new dependency path; follow [Cross-model query-cache dependencies](../../../../repo-docs/backend/cache-guide.md#cross-model-query-cache-dependencies) for the portable decision rules
- transaction behavior

## Test resource lifecycle follow-up

- classify persisted test data as either an owning-module durable seed or a test-local fixture
- create durable test or local-development baseline data in the owning module's `meta.version.ts` `seed()` hook; this managed path starts from a newly recreated database
- treat durable seed data as read-only in tests; create an independent fixture when a scenario needs mutation
- retain exact IDs or entities for every test-local persisted resource and delete them from `finally`
- delete joins, children, derived records, and other dependents before their owners, in the same active tenant/instance scope
- do not use unscoped, timestamp-, prefix-, or broad business-condition deletion when an exact test-owned identity is available
- treat the application lifecycle as runner-owned; do not create or close the shared `app` in an individual test
- give each scoped test or operation its own `app.bean.executor.mockCtx(...)` boundary
- for a business race, give every contender a separate `mockCtx(...)`, launch the competing operations explicitly, wait for all branches to settle, and assert the combined durable state
- gate lock- or isolation-sensitive contention tests on supporting database capabilities; runner scheduling is never race-condition evidence

## Module composition and dependency intent

- confirm package, suite, or application composition already supplies a target before using cross-module lookup; lookup cannot compose an absent module
- choose the narrowest lookup form first: `this.scope` for local resources, `this.$scope.<module>` for a fixed cross-module target, and `app.scope(...)` when an application reference or genuinely dynamic target is required
- cross-module scope lookup, a named ORM relation, or `$Dto.get(..., { include })` alone does not require `vonaModule.dependencies`
- add `vonaModule.dependencies` only for a genuine target-module availability, dependency-first ordering, or minimum-version requirement
- startup, lifecycle, or `monkey.ts` integration can require dependency-first ordering, but are not the only valid dependency case
- when adding an edge, verify package/suite composition, the target relative module name, the minimum compatible version, and that the graph remains acyclic
- do not create speculative dependency edges or circular declarations merely to document a lookup; read [Vona Module Dependencies](../../../../repo-docs/backend/module-dependencies.md) for the canonical decision guide

## Verification follow-up

- unit tests
- `db:reset` or migration verification
- `npm run test`
- `npm run tsc`
- `npm run build`

## Escalation rule

If the request clearly affects frontend SDK, schema, or page logic too, hand off mentally to a fullstack workflow instead of pretending it is backend-only.
