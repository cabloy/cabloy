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
- frontend contract impact
- `@Api.field(...)` / `$makeSchema(...)` ordering: framework guards now preserve previously attached OpenAPI metadata across schema rebuilds, but structure-shaping schemaLike is still order-sensitive
- when an explicit zod/custom schema or other structure-defining schemaLike is present, put that structure-defining schemaLike last because `makeSchemaLikes(...)` applies arguments right-to-left and later structure changes can otherwise alter or replace the intended schema
- treat `v.object(...)`, `v.array(...)`, `v.optional()`, `v.nullable()`, `v.default(...)`, and preprocess/transform wrappers as structure-shaping rather than metadata-only
- after touching structure-shaping schemaLike, verify the emitted schema/OpenAPI result explicitly

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
- add a warm-query → mutate-source → repeat-query regression test for each new dependency path; read [Vona Cross-Model Query-Cache Dependencies](../../../../.docs-internal/architecture/vona-cross-model-query-cache-dependencies.md) for the source-backed decision rules
- transaction behavior

## Test resource lifecycle follow-up

- classify persisted test data as either an owning-module durable seed or a test-local fixture
- create durable test or local-development baseline data in the owning module's `meta.version.ts` `seed()` hook; this managed path starts from a newly recreated database
- treat durable seed data as read-only in tests; create an independent fixture when a scenario needs mutation
- retain exact IDs or entities for every test-local persisted resource and delete them from `finally`
- delete joins, children, derived records, and other dependents before their owners, in the same active tenant/instance scope
- do not use unscoped, timestamp-, prefix-, or broad business-condition deletion when an exact test-owned identity is available

## Module composition and dependency intent

- target module is already composed into the application when code uses cross-module scope lookup
- cross-module `this.$scope.<module>` or `app.scope(...)` lookup alone does not require `vonaModule.dependencies`
- `vonaModule.dependencies` is added only for a genuine target-module availability, dependency-first ordering, or minimum-version requirement
- do not create speculative dependency edges or circular declarations merely to document a lookup

## Verification follow-up

- unit tests
- `db:reset` or migration verification
- `npm run test`
- `npm run tsc`
- `npm run build`

## Escalation rule

If the request clearly affects frontend SDK, schema, or page logic too, hand off mentally to a fullstack workflow instead of pretending it is backend-only.
