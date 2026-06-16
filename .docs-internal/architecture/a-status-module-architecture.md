# a-status Module Architecture

This note explains how the Vona-side `a-status` module works in Cabloy Basic, what runtime boundary it owns, and which invariants future contributors should preserve when changing it.

Use it when future work needs to:

- understand how module-local durable status values are persisted
- decide whether a requirement belongs in `a-status` or in a dedicated business resource
- trace the current `get` / `set` call path from consumer bean to storage
- reason about first-write concurrency, cache freshness, and module scoping
- evaluate whether new features such as delete, list, indexes, or unique constraints belong in the current design

For the public user-facing explanation, also read `cabloy-docs/backend/status-guide.md`.

## Why this note exists

The public Status guide explains what Status is for and how a module author uses it.

It does **not** preserve the maintainer-level model of how `a-status` is wired internally.

That internal model matters because `a-status` looks small, but it sits at the intersection of several framework facilities:

- generated `scope` resources
- module-owned bean identity
- ORM model persistence
- migration/version bootstrap
- Redlock-based concurrency control
- cache freshness behavior during first-write creation

Without a durable architecture note, future contributors can easily miss the actual design intent and accidentally turn a small infrastructure module into an under-specified mini resource system.

## Module role in the monorepo

`a-status` is a backend infrastructure module that provides a **module-local persisted key/value status facility**.

It is not a standalone business resource module.

More specifically, it provides:

- one shared storage table: `aStatus`
- one shared ORM model over that table
- one reusable base class: `BeanStatusBase<IStatusRecord>`
- one Redlock metadata bean for first-write protection
- one version metadata bean for schema creation
- one CLI boilerplate for scaffolded `meta.status` beans in consuming modules

It intentionally does **not** provide:

- controller routes
- a public CRUD surface
- a list/delete/query API
- status-domain events
- module-local config knobs

The intended consumption model is:

1. a business module defines its own `meta.status` bean
2. that bean extends `BeanStatusBase<IStatusRecord>`
3. the business module then uses `this.scope.status.get(...)` and `set(...)`
4. `a-status` provides the shared storage and concurrency behavior underneath

## Important source entrypoints

The most important files are:

- `vona/src/suite-vendor/a-cabloy/modules/a-status/package.json`
- `vona/src/suite-vendor/a-cabloy/modules/a-status/src/.metadata/index.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-status/src/index.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-status/src/lib/beanStatusBase.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-status/src/entity/status.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-status/src/model/status.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-status/src/bean/meta.version.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-status/src/bean/meta.redlock.ts`
- `vona/src/suite-vendor/a-cabloy/modules/a-status/cli/boilerplate/{{sceneName}}.{{beanName}}.ts_`

A representative consumer example is:

- `vona/src/suite-vendor/a-test/modules/test-cabloy/src/bean/meta.status.ts`
- `vona/src/suite-vendor/a-test/modules/test-cabloy/src/controller/status.ts`

## High-level execution model

At runtime, the module works like this:

1. `a-status` creates and owns the shared `aStatus` table
2. a consuming module creates `meta.status` by extending `BeanStatusBase<IStatusRecord>`
3. generated metadata exposes that consumer bean as `scope.status` inside the consuming module
4. `scope.status.get(name)` resolves the current module name and reads `(module, name)` from the shared table
5. `scope.status.set(name, value)` updates the row if it already exists
6. if the row does not exist, the first write is serialized with `lockIsolate(...)`
7. inside the lock, the code re-reads with forced freshness and inserts only if the row is still missing

The design center is not “generic JSON storage” in the abstract.

The design center is “a tiny persisted state surface whose ownership is naturally tied to the module that defines the status bean.”

## Registration and metadata model

## Module metadata contract

`a-status/package.json` declares:

- `vonaModule.fileVersion: 1`
- dependency on `a-vona`
- one meta named `status`
- `scopeResource: true`
- `boilerplate: "boilerplate"`

That means the module contributes a meta-scene resource called `status` that is available to the CLI and metadata generator.

A key design point is that Status is modeled as a **meta bean**, not as a service bean.

That keeps the public authoring surface aligned with other Vona module metadata patterns such as `meta.version`, `meta.redlock`, and `meta.index`.

## CLI integration model

The shared backend CLI entrypoint remains:

```bash
npm run vona :create:bean sceneName beanName -- --module=...
```

`create.bean` resolves both scene-level onions and meta-level onions. For Status specifically, the relevant logical selector is:

- `sceneName = meta`
- `beanName = status`

The CLI then resolves the boilerplate path from `a-status/package.json` and renders:

- `cli/boilerplate/{{sceneName}}.{{beanName}}.ts_`

The generated shape is intentionally thin:

- declare the consumer record interface
- extend `BeanStatusBase<Record>`
- register the bean with `@Meta()`

This is important because the real runtime contract lives in the base class, not in scaffolded business boilerplate.

## Scope-resource integration

The `status` meta is marked `scopeResource: true`, so metadata generation exposes it through module scope.

That matters at two layers:

1. inside the `a-status` module itself, scope resolution exposes internal resources such as:
   - `scope.status.model.status`
   - `scope.status.entity.status`
   - `scope.status.redlock`
2. inside a consuming module, the consumer’s own `meta.status` bean becomes available as:
   - `this.scope.status`

This dual reading is easy to miss.

The same word `status` is participating in two different but aligned surfaces:

- the infrastructure module’s own scope resources
- the consumer module’s local status bean surface

That alignment is one reason the API feels natural in business code.

## Storage model

## Table shape

The built-in migration creates table `aStatus` with:

- `basicFieldsSimple()`
- `module: string(255)`
- `name: string(255)`
- `value: json`

`basicFieldsSimple()` contributes framework baseline fields such as:

- `id`
- timestamps
- `deleted`
- `iid`

The logical identity of a status value is therefore:

- `module`
- `name`

with payload:

- `value`

## Entity and model shape

The entity defines:

- `module: string`
- `name: string`
- `value: any`

The model is intentionally small and currently sets `disableDeleted: true`.

That design tells us that status rows are meant to be operational key/value records, not user-facing content rows that participate in a richer soft-delete lifecycle.

## Shared-table design

A central design choice is that there is **one shared status table**, not one status table per consuming module.

Module separation is enforced by the `module` column and by how `BeanStatusBase` derives the current module name.

Strengths of this design:

- one reusable storage facility for all modules
- no extra table scaffolding for each consumer
- natural logical namespace separation by module

Tradeoffs:

- all consumers share one table shape
- advanced per-module indexing/query needs are outside the current abstraction
- business domains that stop looking like key/value state should move to dedicated resources

## Module ownership and scoping invariant

The strongest invariant in this module is:

> status values belong to the module that defines the consumer `meta.status` bean

This is implemented through `SymbolModuleBelong`.

When `BeanStatusBase` reads or writes, it does **not** ask the caller to provide the module name manually.

Instead it derives the module identity from the bean itself and stores rows under that module namespace.

That has several important consequences:

- business code cannot accidentally collide with another module just by choosing the same key name
- the API stays compact because callers only pass `name` and `value`
- module ownership is structural, not convention-only

Future contributors should preserve this invariant.

If a future feature request wants “global shared status across modules,” that is not a small extension. It changes the ownership model and should be treated as a separate abstraction decision.

## Read path

`BeanStatusBase.get<K extends keyof IStatusRecord>(name: K)` performs a point lookup by:

- `module: this[SymbolModuleBelong]`
- `name`

Then it returns:

- `status?.value`

The public API deliberately hides the row wrapper.

This is a good design boundary because business code interacts with typed values, not table internals.

Maintainer implication:

- if future changes need row metadata, timestamps, or record-management behavior, that is likely a sign the caller should use a richer resource abstraction instead of extending the public Status API casually

## Write path and first-write concurrency

The most important implementation logic is in `_setInner(name, value, lock)`.

The algorithm is:

1. read `(module, name)`
2. if found, update by `id`
3. if not found and `lock === true`, enter `lockIsolate(...)`
4. recurse into `_setInner(name, value, false)`
5. inside the locked second pass, re-read with `cache.force: true`
6. insert only if still missing

This design exists to solve one very specific problem well:

- concurrent first write of the same logical key across requests, workers, or nodes

### Why the recursion is intentional

The recursion is not stylistic.

It separates two phases cleanly:

- optimistic normal path
- serialized creation path

The second pass reuses the same logic while switching two behaviors:

- it runs under lock
- it forces a fresh read

That is a compact way to keep the logic aligned without duplicating the read/update/insert decision tree.

### Why `lockIsolate(...)` matters

The module does not use plain `lock(...)`.

It uses `lockIsolate(...)` because the operation is storage-related and Vona’s Redlock layer incorporates datasource-isolation behavior for that path.

That matters because the design goal is not only mutual exclusion, but also avoiding deadlock-adjacent coordination problems in the surrounding persistence stack.

### Why forced freshness matters

Inside the locked second pass, the read options become:

- `cache: { force: true }`

This is a subtle but important invariant.

Without forced freshness, a stale cached “not found” result could survive into the critical section and cause an unnecessary duplicate insert attempt.

So the design is not merely “lock then insert.”

It is:

- lock
- re-check with fresh visibility
- insert only if still absent

That freshness rule should be preserved if the write path is ever refactored.

## Redlock model

`meta.redlock.ts` declares typed isolate resource names as:

- ``statusSet.${string}``

At call time, `BeanStatusBase` uses:

- ``statusSet.${module}.${name}``

The Redlock base then prefixes that resource with the owning module of the lock bean itself.

Operationally, the lock resource becomes an `a-status`-owned lock namespace protecting a consumer-module/key pair.

This layering matters:

- consumer ownership stays visible in the resource name
- infrastructure ownership stays visible in the lock namespace

That is a clean compromise between business meaning and infrastructure coordination.

## Version/bootstrap model

`a-status` creates its schema through `meta.version.update(...)` and currently has `fileVersion: 1`.

This means the module participates in the normal Vona version lifecycle rather than hiding storage bootstrap in startup code.

That is the correct architectural choice because Status storage is persistent schema, not runtime ephemeral state.

Important maintainer implication:

- if `aStatus` schema changes later, treat that as a normal migration/version decision
- do not bypass the version system with ad hoc startup mutations

## Why there is no delete/list API

The absence of delete/list helpers is deliberate in practice, even if the source does not spell it out with comments.

The current abstraction is optimized for:

- get one key
- set one key
- keep the value durable

Adding delete/list/query helpers would begin shifting the abstraction toward a generic resource model.

That may still be worth doing someday, but it should be treated as an architectural expansion with explicit boundaries, not as a trivial convenience patch.

A good maintainer question is:

- is the requirement still “small module-owned durable state,” or has it become “collection-oriented resource management”?

If it is the latter, a dedicated entity/model/controller flow is usually the better design.

## Current strengths

The current design has several strong properties:

- very small runtime surface
- natural module-local ownership
- typed business-facing API through generics
- shared storage without per-consumer boilerplate duplication
- migration-based schema bootstrap
- Redlock-protected first-write behavior
- cache-fresh re-check inside the critical section

These strengths are tightly connected. Removing one piece casually can weaken the others.

## Current limitations and deliberate boundaries

The current design also has visible limits:

- no built-in delete/list API
- no explicit validation layer in `a-status` itself
- no explicit DB-level unique constraint documented in the migration
- no dedicated index metadata for `(module, name)` in the built-in module
- JSON payloads remain flexible but weakly constrained at storage level

These are not automatically bugs.

Several are side effects of keeping the abstraction small and generic.

But they are the first places to revisit if Status usage expands and new operational requirements appear.

## Refactor safety rules

If future contributors change this module, preserve these rules unless there is an explicit architectural decision to break them:

1. **module ownership stays structural**
   - do not move to caller-supplied module names casually
2. **public API stays value-oriented**
   - business callers should not need to manage raw row structure for ordinary use
3. **first-write remains race-safe**
   - no refactor should reintroduce duplicate-create windows
4. **locked second-pass reads stay fresh**
   - keep the anti-stale-read invariant in the critical section
5. **schema bootstrap stays in `meta.version`**
   - do not move persistent schema concerns into startup code
6. **Status remains a small-state abstraction**
   - if the need becomes collection/query heavy, prefer a dedicated resource design

## First code paths to inspect during future changes

When changing or debugging Status, inspect in this order:

1. `a-status/src/lib/beanStatusBase.ts`
   - public API and concurrency logic
2. `a-status/src/bean/meta.redlock.ts`
   - lock resource typing
3. `a-status/src/bean/meta.version.ts`
   - storage bootstrap
4. `a-status/src/entity/status.ts` and `src/model/status.ts`
   - persistence shape
5. `a-status/package.json`
   - `fileVersion`, meta registration, boilerplate metadata
6. consumer examples such as `a-test/modules/test-cabloy/src/bean/meta.status.ts`
   - expected usage shape
7. Vona CLI `cli.create.bean.ts`
   - if the issue is scaffolding or meta resolution rather than runtime behavior

## Related notes and docs

- `cabloy-docs/backend/status-guide.md`
- `cabloy-docs/backend/redlock-guide.md`
- `cabloy-docs/backend/migration-and-changes.md`
- `cabloy-docs/backend/cache-guide.md`
- `.docs-internal/architecture/backend-resource-field-workflow.md`
