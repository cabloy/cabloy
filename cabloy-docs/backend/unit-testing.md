# Unit Testing

This page migrates the highest-value ideas from the legacy Vona unit-test documentation.

## Why testing is emphasized

The legacy docs strongly recommend test-driven development, and that recommendation still makes sense in the Cabloy monorepo.

Vona’s testing story is valuable because it is closely integrated with:

- app initialization
- Redis cleanup
- database recreation
- migration execution
- request-context simulation

That means tests can exercise framework behavior in a realistic way.

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

The legacy docs describe the test flow as including:

1. create a global `app` object
2. clean Redis data
3. recreate the database
4. execute migration code
5. run the test files

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

The legacy docs also showed locale-sensitive variants and additional request-context helpers.

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

## Authentication simulation

The legacy docs also showed that tests can simulate signin and signout behavior.

Representative patterns include:

- `signinMock()`
- `signinMock('admin')`
- `signout()`

This is important for testing permission-sensitive flows.

## Assertion and error-handling helpers

The legacy docs highlighted two practical testing helpers:

- Node’s built-in `assert`
- `catchError` from `@cabloy/utils`

These help keep tests explicit while still fitting the framework’s async execution style.

## Why this matters for AI workflows

When AI adds or changes backend behavior, it should not stop at code generation.

It should also ask:

1. should a module test be created or updated?
2. does the change need request-context simulation?
3. does it affect migration/setup behavior that should be covered through the test flow?
4. should controller behavior be verified through `performAction` rather than only direct method calls?

That leads to much stronger and more framework-native verification.
