# ORM Mutation Guide

This guide explains how ORM mutation operations work in Vona within the Cabloy monorepo.

## Why mutation operations matter

Mutation is where data shape, persistence behavior, soft deletion, relation-aware writes, and business rules intersect.

Vona ORM provides a structured mutation surface rather than forcing every change through raw SQL or hand-written branching.

## Basic mutation operations

Representative operations include:

- `insert`
- `insertBulk`
- `update`
- `updateBulk`
- `delete`
- `deleteBulk`

Representative examples:

```typescript
await this.scope.model.post.insert({ title: 'Post001' });
await this.scope.model.post.update({ id: 1, title: 'Post001-Update' });
await this.scope.model.post.delete({ id: 1 });
```

These operations are the clearest fit when the caller already knows the exact write intent.

## Field presence in insert and update

For normal writable fields, insert and update intentionally interpret field presence differently:

| Field state                | `insert`                                           | `update`                         |
| -------------------------- | -------------------------------------------------- | -------------------------------- |
| Field is absent            | Leave the column to normal insert/default behavior | Leave the stored value unchanged |
| Own field with `undefined` | Leave the column to normal insert/default behavior | Write SQL `NULL`                 |
| `null`                     | Write SQL `NULL`                                   | Write SQL `NULL`                 |

An own `undefined` means the property exists on the JavaScript object but its value is `undefined`, such as `{ title: undefined }`. This lets an update distinguish an omitted field from an intentional clear:

```typescript
await this.scope.model.post.update({
  id,
  title: undefined, // write SQL NULL
  // stars is absent, so its stored value is unchanged
});
```

### JSON columns

JSON columns follow the same field-presence rules. Non-null values are persisted as JSON. An explicit `null` writes SQL `NULL`, not a JSON literal `null`. On update, an own `undefined` also clears the column to SQL `NULL`.

A JSON request body normally omits object properties whose value is `undefined`. This distinction therefore most often applies to in-process TypeScript model calls or server-side payload construction.

## Conditional update and delete paths

Write operations do not have to target one row only by primary key.

Representative patterns:

```typescript
await this.scope.model.post.update(
  {
    title: 'Post001-Update',
  },
  {
    where: {
      title: { _startsWith_: 'Post001' },
    },
  },
);
```

```typescript
await this.scope.model.post.delete({
  title: {
    _startsWith_: 'Post',
  },
});
```

That matters because the mutation layer still participates in the same structured query language used by select operations. In `options.where`, an absent field, an own `undefined`, and `Op.omit` all omit that condition; `null` requests SQL `IS NULL`. See [ORM Select Guide](/backend/orm-select-guide#absent-undefined-and-null-in-where) for the detailed query contract.

## Bulk mutation operations

Representative bulk patterns:

```typescript
await this.scope.model.post.insertBulk([{ title: 'Post001' }, { title: 'Post002' }]);
```

```typescript
await this.scope.model.post.updateBulk([
  { id: 1, title: 'Post001-Update' },
  { id: 2, title: 'Post002-Update' },
]);
```

```typescript
await this.scope.model.post.deleteBulk([1, 2]);
```

Bulk methods are useful when the business flow already has a set of independent records to process in one operation family.

## `mutate` and `mutateBulk`

One of the most interesting Vona ideas is the `mutate` model.

Instead of forcing callers to choose insert/update/delete up front, Vona can infer the mutation kind from data characteristics.

Representative logic:

- `id` absent, `undefined`, or `null` → insert
- non-nullish `id` → update
- non-nullish `id` and `deleted: true` → delete
- `deleted: true` without a non-nullish `id` → ignore the item because no deletion target exists

A non-nullish identity is neither `null` nor `undefined`. `mutate` chooses by that usable identity value, not merely by whether the `id` key exists.

Representative pattern:

```typescript
const post = await this.scope.model.post.mutate({
  title: 'Post001',
});

await this.scope.model.post.mutate({
  id: post.id,
  title: 'Post001-Update',
});

await this.scope.model.post.mutate({
  id: post.id,
  deleted: true,
});
```

`mutateBulk` applies the same inference to a list of rows:

```typescript
await this.scope.model.post.mutateBulk([
  { title: 'Post003' },
  { id: 1, title: 'Post001-Update' },
  { id: 2, deleted: true },
]);
```

This is important because many CRUD-oriented business flows naturally arrive as mixed create/update/delete batches.

## Explicit operations vs `mutate`

A practical rule is:

- use explicit `insert` / `update` / `delete` when write intent should stay obvious at the call site
- use `mutate` when the business payload itself should drive the write behavior
- use `mutateBulk` when one payload contains mixed create/update/delete rows

That keeps write APIs expressive without overcomplicating caller logic.

## Relation-aware writes and nested CRUD

Mutation is also where relations become operational, not only descriptive.

For `hasOne`, `hasMany`, and `belongsToMany` scenarios, nested writes can be expressed by combining the write payload with `include` or `with` relation definitions.

A representative `hasMany` pattern is:

```typescript
await this.scope.model.order.update(
  {
    id: orderCreate.id,
    orderNo: 'Order001-Update',
    products: [
      { name: 'Peach' },
      { id: orderCreate.products?.[0].id, name: 'Apple-Update' },
      { id: orderCreate.products?.[1].id, deleted: true },
    ],
  },
  {
    include: {
      products: true,
    },
  },
);
```

This is one of the strongest reasons mutation guidance must be read together with relation guidance.

## Relationship to soft deletion

Deletion behavior is not always hard deletion. In Vona, mutation semantics may also interact with soft-delete behavior, model defaults, and cleanup policies.

Read this guide together with:

- [ORM Configuration Guide](/backend/orm-configuration-guide)
- [Relations Guide](/backend/relations-guide)
- [Transaction Guide](/backend/transaction-guide)

## Relationship to magic methods

Legacy ORM docs also highlighted model-level convenience methods such as `getByName`, `updateById`, or custom helper methods that wrap ordinary mutation/select behavior.

The important rule is:

- magic-style methods are convenience entry points
- the underlying write semantics still come from the standard ORM mutation surface
- custom model methods take precedence when business-specific behavior is needed

There is also a useful argument-handling rule to remember:

- default `eq` magic methods such as `getByName()` or `selectByName()` treat an omitted or `undefined` argument as `null`
- non-`eq` magic methods such as `getByNameEqI()` require a concrete value and throw when the argument is omitted or `undefined`

This is argument adaptation performed by the convenience method. It differs from a direct structured `where` object, where `{ name: undefined }` omits the condition. Use `Op.omit` to make direct condition omission explicit, and use `null` to request SQL `IS NULL`.

That means mutation should stay conceptually grounded in the standard model methods even when convenience wrappers are present.

## Implementation checks for ORM mutation changes

When writing mutation logic, ask:

1. is this best expressed as explicit insert/update/delete?
2. or is `mutate` a cleaner fit for the business flow?
3. does the deletion behavior depend on Vona soft-delete semantics?
4. does the write path also update related records through `include` or `with`?
5. should the mutation contract be reflected in DTO or controller definitions too?

That helps keep write-path logic aligned with the ORM’s intended abstractions.
