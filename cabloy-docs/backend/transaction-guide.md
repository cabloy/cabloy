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

## Why this matters for AI workflows

When AI changes write-path business logic, it should ask:

1. should this operation be transactional?
2. does propagation behavior matter because the method is called from other transactional methods?
3. does cache behavior need the transaction-aware path?
4. is the operation bound to the current datasource or a specified datasource?

That helps AI-generated backend code remain correct under real business complexity.
