# Model State Guide

This guide explains how to author and consume model-managed state in Zova within the Cabloy monorepo.

Read [Model Architecture](/frontend/model-architecture) first if you want the broader architectural role of Model.

If your main question is how Model fits into the larger ownership/scope/persistence picture for big Vue applications, read [State Architecture for Vue Developers](/frontend/state-architecture-for-vue-developers) before going deeper into helper families.

If you specifically want the scalable resource-facade pattern, continue with [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern).

If you want the generic lower-level model runtime beneath these helper families, continue with [A-Model Under the Hood](/frontend/a-model-under-the-hood).

If your main question is how to design and review `$useStateData(...)` usage itself, continue with [`$useStateData` Best Practices](/frontend/use-state-data-best-practices).

If you want to understand how that owner pattern expands into the whole `rest-resource` module runtime, continue with [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood), then [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map).

If you want to apply that pattern in your own module with a more uniform two-usage model, continue with [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide).

## Why the model-state layer exists

Zova uses model-based state management so cached remote data and several local state categories can participate in one broader model system.

This improves runtime performance and developer experience by building on top of TanStack Query while keeping the developer-facing surface aligned with Zova beans.

The key point is that model state is not limited to server data.

Current `a-model` source supports a broader state family that includes:

- remote/query-style state
- in-memory state
- local-storage state
- cookie-backed state
- async persisted db state

## Create a model

Example: create a model named `menu` in module `training-student`.

```bash
npm run zova :create:bean model menu -- --module=training-student
```

## Basic model definition

Representative pattern:

```typescript
import { BeanModelBase, Model } from 'zova-module-a-model';

@Model()
export class ModelMenu extends BeanModelBase {
  retrieveMenus() {
    return this.$useStateData({
      queryKey: ['retrieveMenus'],
      queryFn: async () => {
        return await this.$api.homeBaseMenu.retrieveMenus({
          params: { publicPath: '' },
        });
      },
    });
  }
}
```

This pattern matters because it shows that model logic is the place where cached remote data becomes a reusable abstraction.

## Using a model

Representative consumption pattern:

```typescript
@Use()
$$modelMenu: ModelMenu;

protected render() {
  const { data, error } = this.$$modelMenu.retrieveMenus();
  if (error) return <div>{error.message}</div>;
  return <div>{data}</div>;
}
```

The important point is architectural:

- the page/controller consumes the model
- the model owns the reusable data access and cache behavior

## The main helper families

The current source organizes model state around these helper families. They share model-owned query-key and cache infrastructure, but differ in the surface returned to callers and in their persistence and restore lifecycle.

### Choose the state helper by ownership and lifecycle

Choose a helper by the state surface, persistence, restore, and SSR behavior it needs, not only by whether its value should survive a reload.

| Helper                     | Use it when                                                                       | Caller-facing surface                                                     | Persistence and restore                                                                      |
| -------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `$useStateData(...)`       | The model owns remote or query-style async state and consumers need query status  | Full query wrapper, including `data`, `error`, and readiness/status state | Normal query lifecycle; may participate in query hydration subject to metadata               |
| `$useStateMem(...)`        | The model owns reusable runtime state without a browser persistence backend       | Assignable state value                                                    | No browser persistence; eligible successful state can transfer through initial SSR hydration |
| `$useStateLocal(...)`      | The model owns a small browser value that should restore synchronously            | Assignable state value                                                    | Synchronous `localStorage` restore                                                           |
| `$useStateCookie(...)`     | The state needs cookie persistence or request-aware handling                      | Assignable state value                                                    | Synchronous cookie restore                                                                   |
| `$useStateLocalAsync(...)` | The model owns longer-lived browser-local state whose restore may be asynchronous | Assignable state value                                                    | Asynchronous `localforage` restore                                                           |
| `$useStateComputed(...)`   | The model exposes derived state                                                   | Computed value                                                            | No query fetch or persistence                                                                |

### Data, local, and async-local behavior

`$useStateData(...)`, `$useStateLocal(...)`, and `$useStateLocalAsync(...)` use the same model-owned cache foundation, but they are not interchangeable.

| Concern              | `$useStateData(...)`                                      | `$useStateLocal(...)`                                         | `$useStateLocalAsync(...)`                                                                            |
| -------------------- | --------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Return surface       | A memoized query wrapper                                  | An assignable state value                                     | An assignable state value                                                                             |
| Source or storage    | `queryFn`, query cache, and query configuration           | `localStorage`                                                | `localforage`                                                                                         |
| Initial availability | Follows the query lifecycle                               | Restores synchronously, then falls back to `meta.defaultData` | Restores asynchronously, then falls back to `meta.defaultData`                                        |
| Intended write flow  | Mutation, cache update, and invalidation policy           | Replace or assign the model field                             | Replace or assign the model field                                                                     |
| SSR behavior         | Can follow ordinary query dehydration and hydration rules | Browser storage is unavailable on the server                  | Browser storage is unavailable on the server and async-local state explicitly opts out of dehydration |

Use the detailed [`$useStateData` Best Practices](/frontend/use-state-data-best-practices) guide for render-versus-interaction placement, `disableSuspenseOnInit`, freshness utilities, and explicit readiness boundaries.

### 1. `$useStateData(...)`

Use this for cached remote data or other query-style state where the caller wants the full query object.

Representative characteristics from current source:

- it delegates to `$useQuery(...)`
- it memoizes the query wrapper by prefixed query key
- it auto-calls `suspense()` on first creation unless disabled by metadata
- it is the main bridge from model methods to query-style UI state

Representative example:

```typescript
findAll() {
  return this.$useStateData({
    queryKey: ['list'],
    queryFn: async () => {
      return this.scope.api.todo.findAll();
    },
  });
}
```

### Query readiness utilities: loaded versus fresh

These utilities consume an existing model-owned `$useStateData(...)` query. They do not create another state category or a second fetch lifecycle:

- `$QueryEnsureLoaded(...)` is an availability utility. It waits only when the query has no `data`, then returns the query wrapper.
- `$QueryGetFresh(...)` is a non-blocking freshness read. It returns data only when a model-supplied `isStale(query)` predicate accepts the cached value; otherwise it starts refresh work and returns `undefined` for the current render.
- `$QueryEnsureFresh(...)` is an awaited freshness gate. It waits for stale data to refresh, returns the result, and propagates query errors.

The freshness predicate belongs to the domain owner. For example, `ModelPassport` considers a temporary token stale when it is absent or when its `dataUpdatedAt` falls outside the model's short reuse window.

For render-versus-interaction placement guidance, see [`$useStateData` Best Practices](/frontend/use-state-data-best-practices).

## 2. `$useMutationData(...)`

Use this for model-owned mutation state.

Current-source behavior includes:

- `mutationKey` is required
- the key is automatically prefixed with model identity
- the mutation wrapper is memoized by prefixed key
- default error handling is attached unless disabled

Representative example:

```typescript
create() {
  return this.$useMutationData({
    mutationKey: ['create'],
    mutationFn: async body => {
      return this.scope.api.todo.create(body);
    },
    onSuccess: () => {
      this.$invalidateQueries({ queryKey: ['list'] });
    },
  });
}
```

The pattern to notice is that the model owns both the mutation and the follow-up cache invalidation policy.

## 3. `$useStateMem(...)`

Use this for reusable runtime state that belongs to a Model but does not need a browser persistence backend. It returns an assignable value, rather than a query wrapper, while retaining Model-owned Query Cache identity.

Current-source characteristics:

- `enabled: false`, so it does not define a normal remote-fetch lifecycle
- `staleTime: Infinity`
- `meta.persister: false`, so it does not read or write `localStorage`, cookies, or `localforage`
- reads from existing Query Cache first, then `meta.defaultData`, then `undefined`
- assignments update the Query Cache without a persister save
- automatic key prefixing isolates the state by Model identity and, when enabled, selector identity

This is useful when several consumers or Model methods need the same business state during the current frontend runtime, but the browser should not restore it from storage. For structured values, replace or assign the Model field so its custom-ref setter updates the Query Cache:

```typescript
this.selectedIds = nextSelectedIds;
```

A plain Controller field is usually clearer when the state belongs only to that one Controller. Choose `$useStateLocal(...)`, `$useStateCookie(...)`, or `$useStateLocalAsync(...)` when browser persistence is part of the requirement. Choose `$useStateData(...)` when consumers need query status, errors, freshness, or a remote-fetch lifecycle.

### SSR transfer is not persistence

`meta.persister: false` means no browser persistence backend. It does not, by itself, exclude the state from the initial SSR server-to-client Query Cache handoff.

After server rendering, a successful eligible memory-state query can be dehydrated with the shared Query Cache. During client SSR pre-hydration, the snapshot is hydrated into the client QueryClient. A later `$useStateMem(...)` read can therefore receive the transferred value directly from cache when its effective key matches: the same Model, the same selector when selector mode is enabled, and the same logical `queryKey`.

This transfer has limits:

- it applies only to entries accepted by the normal dehydration policy; `meta.ssr.dehydrate: false` opts a state out
- it is not a replacement for `localStorage`, cookies, or async-local persistence
- it does not make the value survive a later browser reload without a new SSR handoff
- it does not make an empty or unsuccessful cache entry transfer automatically

The router-tabs Model uses memory state for current navigation keys and for tabs when tab caching is disabled. The page-data Model uses memory slots keyed by page path. Read [SSR Init Data](/frontend/ssr-init-data) for the page-side flow, or [A-Model Under the Hood](/frontend/a-model-under-the-hood) for the Query Cache and dehydration mechanics.

### SSR/CSR bridge: `ModelPassport`

`ModelPassport` shows that the state helper selected on the server and the one selected on the client do not have to be the same. Its application initialization creates the same logical state differently by environment:

```typescript
this.passport = process.env.CLIENT
  ? this.$useStateLocal({ queryKey: ['passport'] })
  : this.$useStateMem({ queryKey: ['passport'] });
```

On the SSR server, authenticated work can assign the current passport to the memory-backed Query Cache entry. If that entry is successful and eligible, it is dehydrated with the server QueryClient. During client SSR pre-hydration, the snapshot restores the entry before the client Model consumes it.

The client then creates a `$useStateLocal(...)` wrapper for the same effective key. Its read order is Query Cache first, then `localStorage`, then `meta.defaultData`. The hydrated server passport therefore wins on the initial client read; synchronous local-storage restoration is a fallback only when the transferred cache entry is absent.

This gives authentication state two complementary properties:

- SSR uses the request-confirmed passport to keep the initial HTML and client hydration consistent.
- CSR-only entry and later browser sessions can restore the client-local passport value from `localStorage`.

The server `$useStateMem(...)` entry is the entry that is dehydrated. The client `$useStateLocal(...)` call is a new client-side wrapper that reuses hydrated cache because its effective key matches. Matching requires the same Model, the same selector when selector mode is enabled, and the same logical `queryKey`; the short logical key alone is not global identity.

Reading the hydrated value does not save it back to `localStorage`. A later assignment through the client local-state wrapper updates Query Cache and writes the local-storage record. This is an initial SSR cache handoff plus client persistence fallback, not automatic persistence of the SSR snapshot.

## 4. `$useStateLocal(...)`

Use this when the model state should persist in local storage.

Current-source characteristics:

- sync local storage persistence
- simplified storage keys by default
- `enabled: false`
- `staleTime: Infinity`
- state still flows through model-owned query cache first

A useful mental model is:

> local-storage state in Zova Model is not a separate store system. It is model-owned query state with a local-storage persister.

## 5. `$useStateCookie(...)`

Use this when the model state should persist in cookies.

Current-source characteristics:

- sync cookie persistence
- cookie-type coercion support such as `boolean`, `number`, `date`, or `string`
- simplified storage keys by default
- still uses model-owned query cache semantics

This is particularly relevant for state that must participate in request-aware or SSR-adjacent flows.

## 6. `$useStateLocalAsync(...)`

Use this when the model state should persist asynchronously in browser-local storage backed by `localforage`.

Current-source characteristics:

- async persistence through `localforage`
- `enabled: false`
- `staleTime: Infinity`
- explicit `ssr.dehydrate = false`
- the first unresolved read may need async restore before the state is available

This is useful for larger persisted client state that should outlive a page session without being stored in cookies or plain local storage.

### Initialize and ensure async-local state

Assign the state property before awaiting it. When later initialization depends on the restored value, establish an explicit restore boundary with `$ensureStateLocalAsync(...)`. It waits for the pending initial restore to settle; it does not force another load and does not guarantee a defined result:

```typescript
protected async __init__() {
  this.tabs = this.$useStateLocalAsync({
    queryKey: ['tabs'],
    meta: {
      defaultData: [],
    },
  });

  await this.$ensureStateLocalAsync(this.tabs);

  // Continue only after persisted tabs, or the fallback default, is available.
  this.initializeTabs();
}
```

`meta.defaultData` is a fallback: it initializes the state only when no persisted value is restored. If neither provides a value, the ensured result can still be `undefined`. The router-tabs model follows this assign-then-ensure sequence before it continues with route initialization.

Persisted local and async-local state should be updated by replacing or assigning the model field so its custom-ref setter can update query state and persist the new value:

```typescript
this.tabs = nextTabs;
```

Do not rely on an in-place nested mutation alone to persist the change. Assigning `undefined` removes the persisted value.

## 7. `$useStateComputed(...)`

Use this when the model should expose derived state that is still model-key-oriented but computed locally.

Current-source characteristics:

- it prefixes the query key
- it memoizes the computed value by the hashed prefixed key
- it uses `$computed(...)` rather than TanStack Query fetching

## Query keys are model-owned, not global strings

One of the most important model-state behaviors is automatic key prefixing.

When a model uses:

```typescript
queryKey: ['list'];
```

that logical key is prefixed internally with model identity, and with selector when selector mode is enabled.

That means model code can use short business-facing keys while still getting namespace isolation.

Automatic model namespacing does not make every varying runtime value part of the logical key. Logical keys still describe stable resource inputs. Do not add a user or role fingerprint solely because a backend response is evaluated through the current Passport; use the normal authentication lifecycle for login/logout and explicitly invalidate or refetch affected stable keys for an in-session policy change. See [use-state-data-best-practices.md](./use-state-data-best-practices.md) for the full rule.

## Persistence and restore behavior

Current source treats persistence as part of the model-state runtime.

Representative behaviors include:

- persisted data can be restored back into query state
- expired or busted persisted entries are removed automatically
- `defaultData` can initialize the cache when no restored value exists
- setting persisted state to `undefined` removes the persisted record

This is why model helpers are better understood as state-runtime helpers, not only convenience wrappers.

## SSR-sensitive state choices

Model state choices can affect SSR behavior.

Current-source behaviors to remember:

- successful eligible Query Cache state can be dehydrated on the server and hydrated on the client
- `$useStateMem(...)` has no browser persister but can participate in that initial SSR handoff unless excluded by metadata
- mutations are not dehydrated
- `$useStateLocalAsync(...)` explicitly opts out of dehydration
- server-side sync local and cookie persister-backed Query Cache entries are excluded by the default dehydration policy; this does not prevent a client `$useStateLocal(...)` or `$useStateCookie(...)` wrapper from reusing a hydrated entry that the server created with a different eligible helper
- server cannot use local-storage or async-local persistence backends; cookie state is special because cookie access can still exist through the app cookie surface

Practical implication:

- do not equate browser persistence with SSR transfer, or assume every state family behaves the same during SSR
- choose `mem`, `local`, `cookie`, `localAsync`, or `data` based on ownership, persistence, and hydration requirements, not only convenience

## Real examples to read

### Minimal query and mutation model

Read:

- `zova/src/suite/a-demo/modules/demo-todo/src/model/todo.ts`

This file shows:

- extending `BeanModelBase`
- `@Model()` authoring
- query-style state through `$useStateData(...)`
- mutation-style state through `$useMutationData(...)`
- cache invalidation inside the model

### Selector-enabled cache-oriented model

Read:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`

This file shows:

- `@Model({ enableSelector: true, ... })`
- richer model initialization in `__init__`
- mixed use of `$useStateMem(...)` and `$useStateLocalAsync(...)`
- model-owned tab state with cache and persistence decisions

### SSR-sensitive auth model

Read:

- `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`

This file shows:

- mixing `mem`, `local`, and `cookie` state in one model
- SSR-aware state choices
- model ownership of auth-related cached state and mutation flows

### Generic resource-owner model

Read:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`

This file is especially important because it shows a higher-level infrastructure pattern rather than a small feature model.

It demonstrates that a model can act as a **resource owner facade** for CRUD-oriented business modules.

What this example shows:

- `@Model({ enableSelector: true })` uses selector to isolate one model instance per resource name
- `__init__(resource)` bootstraps resource metadata and resolves `resourceApi` before normal query usage
- `$computed(...)` can expose permissions, form provider, and schema surfaces as model-owned derived state
- `$useStateData(...)` drives select/view queries
- `$useMutationData(...)` is wrapped by reusable `create`, `update`, `delete`, and `mutationItem` helpers
- invalidation policy is centralized so list and item caches stay coherent after mutations
- model methods can combine `$fetch`, `$sdk`, OpenAPI schema helpers, and form-oriented helpers behind one reusable boundary

This is one of the best examples for understanding how Zova Model scales from simple data queries to reusable domain infrastructure.

If your next question is not only about the model class but about how generic routes, page shells, schema-driven blocks, and downstream CRUD blocks cooperate around that owner, continue with [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood).

#### Why `enableSelector` matters here

This model is not meant to represent only one concrete resource forever.

It is a reusable generic model class that can serve many resources.

That is why `enableSelector` is essential.

The model passes `resource` into `super.__init__(resource)`, so the resource name becomes the selector identity for that model instance.

At runtime, model query keys are therefore prefixed not only by the bean full name but also by the selected resource.

That means two consumers can both use logical keys such as:

```typescript
['select', '', hashkey(query)][('item', id, 'view')];
```

without colliding with each other, because the effective cache identity is separated by resource selector.

A practical reading takeaway is:

> selector turns one generic `ModelResource` implementation into many isolated resource-specific runtime instances.

#### Why this is a resource owner, not only a CRUD helper

A plain CRUD helper usually forwards requests.

`ModelResource` does more than that.

It owns several resource-level concerns together:

- bootstrap of resource metadata through `$QueryEnsureLoaded(...)`
- resolution of the final `resourceApi`
- permissions lookup
- OpenAPI schema access for view/create/update/select
- form integration such as submit mutation choice and default form data
- query and mutation cache invalidation rules

That is why this model is better understood as a **resource owner facade**.

In application code, prefer consuming that existing owner directly or adding a thin facade over it, while the lower-level `$fetch` and `$sdk` details stay inside the owner boundary.

#### How the cache-key design works

The cache-key design in this file is also worth reading carefully.

It separates three levels of identity:

- `keySelect(actionPath, query)` → list/query-level state
- `keyItemRoot(id)` → all state owned by one row id
- `keyItem(id, action)` → one concrete row action such as `view` or `update`

Representative shapes are:

```typescript
['select', actionPath ?? '', hashkey(query)][('item', id)][('item', id, action)];
```

This makes the invalidation strategy much clearer:

- create invalidates the select-level list cache
- update/delete invalidate the select-level list cache and the item root for that row
- item-specific queries such as `view(id)` live under the item branch

The practical benefit is that the model does not scatter cache policy across pages.

Instead, the model itself defines how list-level and row-level state stay coherent after mutations.

#### Why this example is a strong source-reading specimen

If `demo-todo` shows the minimal pattern for model queries and mutations, `rest-resource` shows the scalable pattern.

Use it when you want to understand how Zova Model can support:

- generic reusable business infrastructure
- selector-isolated model instances
- unified resource schema and permission ownership
- form-oriented integration on top of query state
- centralized invalidation semantics for larger UI systems

## Relationship to the server-data ladder

Think about the layers like this:

- `$fetch` → direct request access
- `$api` → business-oriented service methods
- `Model` → cached, reusable, persistence-aware state

That makes the model layer one of the most important bridges between backend contracts and frontend rendering.

## Practical design checks

When adding frontend state, avoid jumping straight to ad hoc request logic or generic store habits.

Instead ask:

1. should this state live in an existing model?
2. should it be `data`, `mem`, `local`, `cookie`, or `db` state?
3. should the model own invalidation or refetch behavior?
4. does persistence or SSR change the right helper choice?
5. should the page/controller consume a model instead of owning this state directly?

That usually produces cleaner, more Cabloy-native code.

## Final takeaway

The most important usage insight is simple:

> In Zova, model state is not only “fetch some data”. It is a unified model-owned runtime for query state, local state, persistence, invalidation, and SSR-aware reuse.

Once that is clear, the helper family in `a-model` reads as one coherent system instead of several unrelated APIs.
