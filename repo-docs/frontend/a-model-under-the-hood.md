# Model Runtime Under the Hood

This guide explains the lower-level runtime of `a-model` in Zova through the current public Cabloy Basic source.

Use this page when you want to understand:

- how the model module bootstraps its shared query infrastructure
- how `$queryClient` becomes available on beans
- how the model inheritance stack is assembled
- how query keys are prefixed and normalized
- how `useQuery`, state helpers, and persister behavior fit together
- how SSR dehydrate/hydrate and stale-time rules participate in the model runtime

## Why this page exists

Several existing docs already explain the role and usage of models well:

- [Model Architecture](/frontend/model-architecture)
- [Model State Guide](/frontend/model-state-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)

What those pages do not isolate directly is the lower-level generic `a-model` runtime chain.

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. `@Model()` registers a model bean on the model scene
2. the `a-model` module monkey bootstraps a shared `QueryClient`
3. the monkey injects `$queryClient` onto bean instances
4. `BeanModelBase` is the public entry into a deeper inheritance stack for query, mutation, state, and persistence behavior
5. all model query/state operations prefix keys by model identity, and selector-enabled models add selector identity too
6. `useQuery`, state helpers, and persister behavior cooperate to apply SSR-aware stale/hydration/persistence rules

That means the model layer is not only a set of convenience helpers. It is a lower-level shared query/persistence runtime for the frontend.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-model/src/monkey.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.modelBase.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.last.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.query.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`
8. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`
9. `zova/src/suite-vendor/a-zova/modules/a-model/src/config/config.ts`

That order moves from module bootstrapping, to shared query storage, to the public model bean entry, then into identity, query, useQuery, state, persister, and finally default config behavior.

## monkey/bootstrap and `QueryClient` wiring

The module monkey lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/monkey.ts
```

The source confirms that:

- `appInitialize()` creates/initializes shared storage
- `moduleLoaded()` lets the storage service finish module-level setup
- `beanInit(...)` defines `$queryClient` on beans
- `$queryClient` is resolved through `useQueryClient()` and marked raw

This is the first important lower-level rule:

- the model runtime is bootstrapped at module/app level before higher model helpers are used

## `ServiceStorage` and shared query lifecycle

The shared query-storage/runtime owner lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/service/storage.ts
```

Its main jobs are:

- create the shared `QueryClient`
- create the `QueryCache`
- install the Vue Query plugin into the app
- on the server, dehydrate eligible query state after render into `stateDefer.query`
- on the client, hydrate that snapshot during SSR pre-hydration
- clear the server query client after the snapshot has been created

The server-to-client handoff is therefore:

```text
server QueryClient
  → dehydrate after render
  → stateDefer.query
  → deferred SSR bootstrap state
  → client QueryClient hydrate during SSR pre-hydration
```

This is an initial SSR handoff, not browser persistence. The server cache is request-scoped for this flow and is cleared after its snapshot is taken.

This is the second important lower-level rule:

- the model runtime is not only about per-model helper methods
- it also owns one shared query lifecycle around SSR and client hydration

## The public model bean entry and inheritance stack

The public bean entry lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.modelBase.ts
```

It is intentionally thin:

- `BeanModelBase extends BeanModelFirst`

A key lower-level identity layer appears in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.last.ts
```

This file confirms that:

- selector identity is stored on the model when `enableSelector` is on
- `self` and `scopeSelf` provide access to the effective model bean/runtime scope

This is the rule to keep in mind when reading the rest of the runtime:

- `BeanModelBase` is the public entry
- the lower-level behavior is assembled through the internal inheritance chain beneath it

## Query-key prefixing and normalization

The core query identity logic lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.query.ts
```

The most important lower-level rule is `_forceQueryKeyPrefix(...)`.

The source confirms that query keys are prefixed with:

- bean full name
- selector, when selector mode is enabled

This matters because model query identity is not only whatever the caller typed in `queryKey`.

The model runtime namespaces the key automatically.

This same layer also owns:

- `$setQueryData(...)`
- `$invalidateQueries(...)`
- `$refetchQueries(...)`
- `$queryFind(...)`
- filter normalization through `$normalizeFilters(...)`

That means key prefixing and invalidation are part of the same lower-level runtime layer.

## `useQuery` runtime behavior

The query wrapper lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts
```

The source confirms that `useQuery` behavior is not passed through untouched.

It adds:

- prefixed query keys
- persister integration
- default error handling
- SSR-aware stale-time branching

The important SSR-aware rule is:

- async queries use configured async stale time by default
- during client SSR pre-hydration, cached SSR data can switch to SSR stale-time behavior

That means stale-time behavior is part of the model runtime contract, not only a local query option.

### Per-fetch persistence bypass

The returned query's `refetch()` is extended by the model runtime with an opt-in per-fetch persistence bypass:

```ts
await query.refetch({ bypassPersister: true });
```

The source-level execution path is:

```text
query.refetch({ bypassPersister: true })
  -> BeanModelUseQuery refetch wrapper
  -> remove bypassPersister from the public options
  -> attach a per-fetch internal marker
  -> TanStack Query fetch
  -> BeanModelPersister wrapper
  -> call queryFn(context) directly
  -> TanStack Query updates in-memory query state
  -> observers and query.data update
```

An ordinary refetch follows the existing persister path instead:

```text
query.refetch()
  -> TanStack Query fetch
  -> experimental query persister
  -> possible persisted restore or restore-triggered refresh
  -> normal persistence behavior
```

For a bypassed fetch, the marker makes the model persister skip persisted restore and the persister's save path for that fetch. The result still goes through TanStack Query's normal success/error handling, so the query's in-memory data, timestamps, observers, and reactive result continue to behave normally. The marker is scoped to the fetch and does not modify static query options or `meta.persister`; `meta.persister: false` remains the query-wide switch.

This option is not a force-new-request primitive. The model wrapper preserves TanStack Query cancellation and in-flight deduplication semantics, including the meaning of `cancelRefetch`. A fetch that has already been deduplicated cannot be retroactively converted into a bypassed fetch. The bypass call also does not automatically cancel an ordinary persistence callback that was already queued before it.

The current implementation transports the marker through the installed TanStack Query observer's internal fetch-options forwarding. `bypassPersister` is therefore a Zova model option, not a native public TanStack `RefetchOptions` field; the model wrapper keeps that internal detail out of the normal authoring surface.

## State helper families as one runtime family

The state helper layer lives mainly in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts
```

This is where the five main state families are exposed:

- `data`
- `mem`
- `local`
- `cookie`
- `db`

The important lower-level point is that these are not unrelated helpers.

They are one model-owned runtime family built on shared query/persistence identity.

A practical reading rule is:

- different state families differ in persistence/storage and SSR behavior
- but they still participate in one model runtime vocabulary and query-key system

`$useStateMem(...)` makes the two policy axes especially clear. It returns an assignable custom-ref surface that reads and writes through the Model Query Cache, while setting `persister: false` so no browser storage adapter is used. No persistence backend does not imply no SSR transfer: a successful eligible memory query can still be included in the shared Query Cache snapshot.

A hydrated entry is reusable only when the later call resolves to the same effective key. The runtime prefixes each logical key with Model identity and, for selector-enabled Models, selector identity.

## Persister storage selection and restore/save/remove behavior

The persister layer lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts
```

Its main jobs are:

- choose the storage backend
- compute storage key and prefix
- apply `buster`
- apply `maxAge`
- restore persisted state
- save persisted state
- remove persisted state
- prefix persisted query identity consistently with the model/query runtime

The storage options include:

- cookie
- local
- db

This is the clearest lower-level source for understanding why model persistence behavior differs by state family and why restored state still respects model identity.

## Default config behavior

The default model-runtime config lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/config/config.ts
```

This file confirms default behavior such as:

- query retry/refetch defaults
- async stale time
- SSR stale time
- persistence max-age defaults
- dehydration rules for sync persister-backed queries

The current dehydration decision is ordered:

1. `meta.ssr.dehydrate === false` explicitly excludes a query.
2. A sync persister-backed query is excluded.
3. Remaining queries use TanStack Query's current default dehydration predicate, which accepts successful queries.

This is why `$useStateMem(...)` can participate in the initial SSR transfer despite `persister: false`, while `$useStateLocalAsync(...)` opts out explicitly. This is the place to check when the runtime feels surprising even though your page/model code looks correct.

## What this page does not re-explain

This page does **not** fully re-explain:

- the architectural role of Model -> see [Model Architecture](/frontend/model-architecture)
- the public helper-family usage -> see [Model State Guide](/frontend/model-state-guide)
- the resource-owner pattern -> see [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- the resource-owner internals -> see [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)

Its job is only to explain the lower-level generic `a-model` runtime.

## Where to read next

Use these next steps depending on your question:

- if you want the architectural role of Model, read [Model Architecture](/frontend/model-architecture)
- if you want state helper usage, read [Model State Guide](/frontend/model-state-guide)
- if you want resource-owner patterns built on this runtime, read [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- if you want the resource-owner itself, read [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- if you want the lower OpenAPI/schema substrate beneath some model behavior, read [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood)

## Final takeaway

The most accurate way to read `a-model` is not as one set of convenience wrappers around TanStack Query.

Read it as the lower-level frontend model runtime that:

- bootstraps a shared query client
- injects query access into beans
- composes model identity and selector-aware query-key namespacing
- applies persistence and SSR-aware hydration/stale behavior
- supports higher-level model and resource-owner patterns on top of that lower runtime

That is the source-confirmed role of `a-model` in the current Cabloy Basic frontend architecture.
