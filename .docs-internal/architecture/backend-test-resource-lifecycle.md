# Backend Test Resource Lifecycle

## Purpose

Persisted data created by backend tests has an ownership and lifecycle boundary. This note preserves the rule that test-local fixtures do not survive the test that created them, while durable baseline data is owned by the module test-seed lifecycle rather than by an individual test.

This is a forward-looking convention. It does not make this document a mandate to broaden an unrelated change into a repository-wide cleanup migration.

## Classify persisted test data first

Before creating persisted data, choose one of two categories:

1. **Test-local fixture**: data needed only by one test or one tightly coupled test scenario. The test owns it and must delete it.
2. **Durable module seed**: stable baseline data needed by multiple tests or intentionally available to local development through the managed test-data workflow. The owning module creates it through `meta.version.ts` `test()`.

Default to a test-local fixture. Promote data to a durable seed only when it has genuine shared baseline value.

## Test-local fixture ownership

A test that creates persisted resources must retain the returned entities or their exact identifiers as it creates them. Do not rediscover test data for cleanup through a broad table query, a timestamp, a name prefix, or a business condition when an exact test-owned identity is available.

Put cleanup in `finally` as soon as persistent setup begins. This keeps cleanup active when a later assertion, authentication action, controller call, service call, or transaction fails.

```ts
const created = await createFixture();
try {
  // exercise and assert the behavior under test
} finally {
  await deleteFixtureDependents(created);
  await deleteFixtureOwners(created);
}
```

Delete in reverse dependency order. Remove derived records, join rows, children, and other owned side effects before their owners. If a model uses soft deletion, make the deletion/read options explicit so that cleanup removes the records required by the test contract.

Create and delete data through the active tenant or instance scope. A cross-tenant scenario owns its fixture separately in every participating context and cleans each fixture inside that same context. Ordinary scoped model and service paths remain the default; do not use unscoped or cross-instance deletion merely to simplify cleanup.

The existing `create()` / `drop()` helper in [testData.ts](../../vona/src/suite-vendor/a-test/modules/test-vona/src/service/testData.ts) demonstrates returning precise fixture identities and removing dependents before owners. Its use from `finally` in [modelForUpdate.test.ts](../../vona/src/suite-vendor/a-test/modules/test-vona/test/database/modelForUpdate.test.ts) demonstrates the required failure-safe call-site shape.

## Durable module seeds

Use the owning module's `meta.version.ts` `test()` lifecycle for durable test or local-development baseline fixtures. Vona has `update`, `init`, and `test` lifecycle scenes; `test()` is the test-data scene, not a substitute for schema migration or tenant initialization.

A durable seed must:

- use stable business identifiers or equivalent lookup/create semantics;
- be idempotent when the seed path runs more than once;
- stay within the owning module and its intended tenant/instance scope;
- be minimal, deterministic, and suitable for shared reuse.

Tests may read durable seed data but must not mutate or delete it. A test requiring a changed state must create an independent test-local fixture, then clean that fixture in `finally`.

## Review checklist

When reviewing backend tests, verify:

- every persisted record is explicitly classified as test-local or durable;
- test-local records are tracked by exact owned identity;
- `finally` cleanup runs in reverse dependency order and in the proper tenant/instance context;
- shared durable records are idempotent `meta.version.ts` `test()` seeds and remain read-only to tests;
- a new rule is applied prospectively unless cleanup migration work is explicitly in scope.
