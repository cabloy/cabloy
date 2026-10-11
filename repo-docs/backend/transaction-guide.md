# Transaction Guide

This guide explains how Vona transactions work in the Cabloy monorepo.

## Why transactions matter in Vona

Vona treats transactions as a framework-level capability, not just as a raw database primitive.

Four especially important areas define the transaction model:

- decorator-based transaction entry
- transaction propagation
- compensation behavior
- database and cache consistency

That is a stronger model than “open transaction, do SQL, commit or rollback.”

## Decorator-based transactions

Representative pattern:

```typescript
@Core.transaction()
async transaction() {
  const post = await this.scope.model.post.insert({ title: 'Post001' });
  await this.scope.model.post.update({ id: post.id, title: 'Post001-Update' });
}
```

This matters because it makes transaction behavior explicit at the business-method level.

## Choose atomicity and concurrency guarantees separately

Keep ordinary, independent CRUD writes simple: do not add an explicit transaction or pessimistic update lock just because a method is named `create`, `update`, or `delete`. A Model mutation participates in an existing transaction on its datasource, but ordinary CRUD does not automatically start a transaction around the entire service method. A single Model call can also perform more than one write, so do not assume that a compound call is an all-or-nothing business operation without checking its behavior.

Ask what the business operation must guarantee:

- **Multiple writes must succeed or fail together:** put a transaction around the business unit of work. Parent/companion writes and all-or-nothing bulk commands are examples. A transaction gives atomicity, not automatic protection against every concurrent write race.
- **A shared invariant depends on previously read state:** define the competing operations and required outcome, then select a concurrency strategy. Depending on the operation, that may be an atomic conditional update, optimistic version check, suitable isolation with retry, or a pessimistic row lock inside a transaction. For a read-modify-write balance or a check-then-insert path, a transaction alone may still allow a lost update or duplicate first insert.
- **No cross-write or contention guarantee is required:** leave the CRUD operation without an additional explicit transaction or pessimistic lock. This is a decision about application-level guarantees, not a claim that the database never locks rows while executing writes.

For an optional one-to-one companion, updating parent fields and companion content together can justify a transaction. If concurrent first writes must leave exactly one companion, locking an existing companion row cannot protect its first insertion: a parent-row serialization point or another deliberate strategy is needed. Once all competing writers use the same parent-row serialization point, an additional companion-row lock on that path may be redundant; verify that no writer bypasses the serialization point before removing it. Test the required combined durable outcome under competing operations. See [One-to-One Companion Resource Guide](/fullstack/one-to-one-companion-resource-guide#consistency-modes-and-concurrency) and [Unit Testing](/backend/unit-testing).

## Manual transactions

Vona also supports manual transaction control using either:

- the current datasource
- a specified datasource

That matters for advanced scenarios where the caller needs tighter control over which database handle is active.

## Isolation level and propagation

Vona supports transaction parameters such as:

- `isolationLevel`
- `propagation`

The propagation model includes levels like:

- `REQUIRED`
- `SUPPORTS`
- `MANDATORY`
- `REQUIRES_NEW`
- `NOT_SUPPORTED`
- `NEVER`

This is important because multi-layer business logic often depends on how nested calls interact with an outer transaction.

## Compensation hooks

Vona also provides success and failure compensation hooks.

That means Vona transactions can coordinate follow-up behavior explicitly, not only database commit/rollback.

## Transaction and cache consistency

One of the most important Vona ideas is that transaction behavior is adapted to the cache system.

That means if the transaction fails, cache compensation can run so database and cache state remain consistent.

This is a major part of Vona’s large-system story.

## Implementation checks for transactional write changes

When changing write-path business logic, ask:

1. should this operation be transactional?
2. does propagation behavior matter because the method is called from other transactional methods?
3. does cache behavior need the transaction-aware path?
4. is the operation bound to the current datasource or a specified datasource?

That helps AI-generated backend code remain correct under real business complexity.
