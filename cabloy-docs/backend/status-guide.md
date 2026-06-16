# Status Guide

This guide explains how Status works in Vona within the Cabloy monorepo.

## Why Status matters

Some backend modules need a very small amount of durable module-local state without introducing a full business resource.

Typical examples include:

- feature toggles owned by one module
- small structured status payloads
- module-local runtime flags that should survive process restart
- lightweight persisted settings that do not justify a dedicated CRUD surface

Vona provides Status for exactly that shape.

A practical mental model is:

- Status is a persisted key/value store
- keys are scoped by the owning module
- values are stored as JSON
- the main public API is a typed `get` / `set` surface

## Create `meta.status`

Create a status bean in your module with the shared Vona CLI entrypoint:

```bash
npm run vona :create:bean meta status -- --module=demo-student
```

This follows the same `:create:bean` workflow used by other backend bean scenes and metadata beans.

The generated shape is representative of:

```typescript
import { Meta } from 'vona-module-a-meta';
import { BeanStatusBase } from 'vona-module-a-status';

export interface IStatusRecord {}

@Meta()
export class MetaStatus extends BeanStatusBase<IStatusRecord> {}
```

The important point is that your module defines its own typed status record while reusing the shared persistence and locking behavior from `BeanStatusBase`.

## Define a typed status record

Status is most useful when the record shape is explicit.

Representative pattern:

```typescript
interface IStatusUser {
  name: string;
  age: number;
}

export interface IStatusRecord {
  enable: boolean;
  user: IStatusUser;
}

@Meta()
export class MetaStatus extends BeanStatusBase<IStatusRecord> {}
```

This gives a practical typed contract:

- `get('enable')` returns `boolean | undefined`
- `set('enable', true)` requires a boolean
- `get('user')` returns the typed user object or `undefined`

So Status is flexible at storage time because the value is JSON, but strongly typed at authoring time because the bean is generic.

## Use `scope.status`

After defining `meta.status` in a module, the generated scope exposes it as `scope.status` inside that module.

Representative usage:

```typescript
let value = await this.scope.status.get('enable');
await this.scope.status.set('enable', true);
value = await this.scope.status.get('enable');

let user = await this.scope.status.get('user');
await this.scope.status.set('user', { name: 'zhennann', age: 18 });
user = await this.scope.status.get('user');
```

A practical behavior summary is:

- `get(...)` returns `undefined` when the key has not been written yet
- `set(...)` creates the key on first write
- later `set(...)` updates the existing value

## What is actually stored

The current source stores Status data in table `aStatus`.

The logical identity of a record is:

- `module`
- `name`

The stored payload is:

- `value` as JSON

So a practical storage reading is:

| Field    | Meaning                                 |
| -------- | --------------------------------------- |
| `module` | the owning backend module               |
| `name`   | the status key inside that module       |
| `value`  | the persisted JSON value for that key   |

The current migration creates the table with the framework basic fields plus:

- `module`
- `name`
- `value`

This means Status is designed as a small module-scoped persistence surface rather than a general-purpose relational model.

## Module-local scoping

One of the most important design points is that Status is scoped by the **consumer module**, not only by the key name.

That means two different modules can both use a key such as `enable` without colliding with each other.

A practical reading is:

- `demo-student + enable` is one status record
- `demo-course + enable` is a different status record

This makes Status a natural fit for module-local state.

## First-write concurrency behavior

The current implementation protects first-write creation with Redlock.

A practical flow is:

1. attempt to read the current `(module, name)` record
2. if the record exists, update it
3. if the record does not exist, enter a `lockIsolate(...)` critical section
4. re-check the record with a forced fresh read
5. insert only if it is still missing

This is important in distributed or multi-worker deployments because two workers might otherwise try to create the same logical key at the same time.

The design intention is:

- ordinary reads stay simple
- first-write races are serialized
- the locked re-check avoids stale read behavior during creation

For the broader locking model, also see [Redlock Guide](/backend/redlock-guide).

## Relationship to cache and ORM

Status is built on top of the Vona ORM model layer.

That matters because Status is not a separate storage engine. It participates in the same broader backend persistence model as other ORM-backed data.

A practical reading is:

- Status persistence is implemented through an ORM model
- reads can benefit from the framework data-access stack
- write behavior still follows the framework mutation path

For surrounding concepts, also see:

- [ORM Guide](/backend/orm-guide)
- [Cache Guide](/backend/cache-guide)
- [Migration and Changes](/backend/migration-and-changes)

## Relationship to migration

The built-in `a-status` module currently creates its own storage table through `meta.version` with `fileVersion: 1`.

For ordinary consumers of Status, the usual workflow is simple:

- depend on the shared Status module
- create your own `meta.status`
- define your typed record
- use `scope.status` from your module

You do **not** create a separate status table per consuming module.

If your own module later outgrows Status and needs a richer schema, that usually means moving to dedicated entity/model resources and managing your own `meta.version` changes directly.

## What Status is good for

Status is a strong fit when the data is:

- small in size
- keyed by a fixed or slowly changing set of names
- naturally owned by one module
- read or updated by key rather than queried as a collection

Typical good fits include:

- module enable flags
- one module-owned progress marker
- compact structured settings
- one-off durable state snapshots

## What Status is not for

Status is usually the wrong abstraction when you need:

- a large collection of rows
- rich filtering or search
- relational structure
- a public CRUD API
- list, delete, or pagination behavior
- field-level validation and indexing as a first-class domain concern

A practical boundary is:

- use Status for a small number of durable module-local keys
- use entity/model/controller resources when the data becomes a real business resource

## Current implementation notes

From the current source, some boundaries are worth knowing:

- the public base API is intentionally small: `get` and `set`
- there is no built-in delete or list convenience API
- values are stored as JSON
- first-write concurrency is protected by Redlock
- the current table creation is lightweight and does not define a separate Status-specific CRUD surface

These details make Status easy to use, but they also mean you should not stretch it into a substitute for a richer domain model.

## Recommended workflow

A practical Status workflow is:

1. create `meta.status` with the Vona CLI
2. define a small typed `IStatusRecord`
3. read and write through `this.scope.status`
4. keep payloads compact and module-owned
5. move to dedicated entity/model resources if the data stops looking like key/value state

## Related guides

Read this guide together with:

- [Backend CLI](/backend/cli)
- [Migration and Changes](/backend/migration-and-changes)
- [ORM Guide](/backend/orm-guide)
- [Cache Guide](/backend/cache-guide)
- [Redlock Guide](/backend/redlock-guide)

## Implementation checks for Status changes

When adding or revising module-local durable state, ask:

1. is this really a small module-owned key/value need?
2. should the state live in `meta.status` instead of a dedicated entity/model resource?
3. is the status record shape explicit and typed?
4. will the payload remain compact and stable over time?
5. do later requirements such as list, delete, filtering, or indexing mean the design should graduate to a richer persistence model?

That keeps Status aligned with its intended role in Vona.
