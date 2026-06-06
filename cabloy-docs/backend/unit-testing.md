# Unit Testing

This guide explains the most important Vona testing workflows in the Cabloy monorepo.

## Why testing is emphasized

Test-driven development remains a strong default in the Cabloy monorepo.

Vona’s testing story is valuable because it is closely integrated with:

- app initialization
- Redis cleanup
- database recreation
- migration execution
- request-context simulation
- action-level API verification

That means tests can exercise framework behavior in a realistic way.

## Unit testing in the backend contract loop

A useful backend-contract-loop testing mental model is:

- migration prepares the structural state
- controllers expose the route/action surface
- services and models execute the business and persistence logic
- tests verify the resulting contract through scoped access and action execution

This is why Vona testing should not be reduced to isolated helper-unit testing only.

## Create a test file

Example:

```bash
npm run vona :create:test student -- --module=demo-student
```

## Execute tests

From the root repository:

```bash
npm run test
```

A typical Vona test flow includes:

1. create a global `app` object
2. clean Redis data
3. recreate the database
4. execute migration code
5. run the test files

This is one of the most important distinctions from ordinary app flow: test execution rebuilds and verifies the framework lifecycle, not only the target function.

## Reset database without running tests

Representative command:

```bash
cd vona && npm run db:reset
```

This is useful when you want to reapply migration logic without running the entire test suite.

## Coverage

Representative command:

```bash
cd vona && npm run cov
```

## Mock request context

One of the most important Vona testing patterns is simulating a request context.

Representative shape:

```typescript
await app.bean.executor.mockCtx(async () => {
  // test logic here
});
```

Locale-sensitive variants and additional request-context helpers are also available.

## Working with module scope in tests

Representative pattern:

```typescript
const scopeStudent = app.scope('demo-student');
```

This lets tests exercise:

- services
- models
- entities
- controller actions

through the same scoped abstractions used in application code.

## Testing controllers through actions

Representative pattern:

```typescript
await app.bean.executor.performAction('get', '/demo/student');
```

This is especially useful because it exercises the controller path more realistically than only unit-testing isolated helper functions.

A practical rule is:

- use direct service/model assertions when the test target is truly internal behavior
- use `performAction(...)` when the goal is to verify the backend API contract as a controller-facing workflow

A representative contract-verification pattern is:

```typescript
await app.bean.executor.performAction('patch', '/test/rest/product/:id', {
  params: { id: productId },
  body: dataUpdate,
});
```

This is a good default because the same test can exercise params, body, route wiring, validation, and response behavior together.

## Authentication simulation

Tests can also simulate signin and signout behavior.

Representative patterns include:

- `signinMock()`
- `signinMock('admin')`
- `signout()`

This is important for testing permission-sensitive flows.

A practical CRUD-style pattern is:

- sign in
- call create via `performAction(..., { body })`
- call list/query and verify inclusion
- call update via params + body
- call find-one and verify new state
- call delete and verify final state
- sign out

This keeps auth-sensitive CRUD verification close to the real controller contract path.

## Assertion and error-handling helpers

Two practical testing helpers are:

- Node’s built-in `assert`
- `catchError` from `@cabloy/utils`

These help keep tests explicit while still fitting the framework’s async execution style.

## End-to-end CRUD test story

A realistic CRUD test usually verifies a whole backend thread, not only one method call.

A practical sequence is:

1. create request data
2. sign in if auth is required
3. call create action
4. call list/query action and verify inclusion
5. call update action
6. call find-one action and verify the new state
7. call delete action
8. verify the final deleted/not-found state
9. sign out

This is the most framework-native verification path because it tests route, validation, DTO, service, model, and migration assumptions together.

## Relationship to migration and CRUD generation

Read this guide together with:

- [CRUD Workflow](/backend/crud-workflow)
- [Migration and Changes](/backend/migration-and-changes)
- [Controller Guide](/backend/controller-guide)

A practical split is:

- CRUD generation creates the initial backend thread
- migration keeps that thread structurally valid over time
- tests verify the resulting contract through realistic execution

## Why this matters for AI workflows

When AI adds or changes backend behavior, it should not stop at code generation.

It should also ask:

1. should a module test be created or updated?
2. does the change need request-context simulation?
3. does it affect migration/setup behavior that should be covered through the test flow?
4. should controller behavior be verified through `performAction` rather than only direct method calls?
5. does the change affect the end-to-end CRUD thread rather than only one isolated function?

That leads to much stronger and more framework-native verification.
