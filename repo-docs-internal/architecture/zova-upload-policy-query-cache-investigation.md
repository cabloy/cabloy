# Zova Upload Policy Query Cache Investigation

This note records the current source-backed conclusions about upload-policy query behavior in Zova, with `basic-file` and `basic-image` as the representative examples.

Use it when future work touches any of these areas:

- `getUploadPolicy(...)` style model-owned query state
- `disableSuspenseOnInit: true`
- `staleTime: Infinity`
- `$QueryEnsureLoaded(...)` / `$QueriesEnsureLoaded(...)`
- persisted query restore behavior
- the contrast between field support queries and page-entry resource queries

## Purpose

This note exists to preserve several distinctions that are easy to blur during debugging:

- query ownership vs controller-owned command logic
- init-time trigger policy vs freshness policy
- mounted first-load semantics vs explicit interaction-time waiting
- persisted state restore behavior vs literal persistence of old query options

The concrete investigation started from one question:

- why `getUploadPolicy(...)` did not appear to execute `queryFn` on create-page open in a CSR flow

The investigation ended with a broader set of durable rules about how upload policy should be modeled and how to read the relevant Zova and TanStack runtime layers.

## Durable conclusion summary

The main conclusions are:

- `getUploadPolicy(...)` should stay model-owned query state, not controller-owned ad hoc fetch logic.
- `disableSuspenseOnInit: true` skips the first automatic init-time `query.suspense()` kick, but it does not disable query creation, persistence/restore semantics, or later fetch/refetch behavior.
- `staleTime: Infinity` and `disableSuspenseOnInit: true` are not equivalent:
  - `staleTime: Infinity` is a freshness policy
  - `disableSuspenseOnInit: true` is an init-time trigger policy
- upload-policy state should be established during render so the field can derive `acceptAttr`, `multiple`, and `pending` from formal query state.
- strict readiness should be awaited only at the interaction boundary when sequencing actually requires it.
- the upload-policy path and the page-entry/resource-data path intentionally have different loading semantics.
- deleting old IndexedDB cache can fix misleading first-load behavior even though query options themselves are not what gets persisted; persisted query state is enough to change the fetch path.

## Primary source path

Start with these files when re-tracing this behavior:

- `zova/src/suite/cabloy-basic/modules/basic-file/src/model/file.ts`
- `zova/src/suite/cabloy-basic/modules/basic-file/src/component/formFieldFile/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/lib/utils.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/config/config.ts`
- `zova/src/suite-vendor/a-zova/modules/a-openapi/src/model/sdk.ts`
- `zova/node_modules/.pnpm/@tanstack+vue-query@5.101.1_vue@3.5.18_typescript@5.9.2_/node_modules/@tanstack/vue-query/src/useBaseQuery.ts`
- `zova/node_modules/.pnpm/@tanstack+query-core@5.101.1/node_modules/@tanstack/query-core/src/queryObserver.ts`
- `zova/node_modules/.pnpm/@tanstack+query-core@5.101.1/node_modules/@tanstack/query-core/src/query.ts`
- `zova/node_modules/.pnpm/@tanstack+query-persist-client-core@5.101.1/node_modules/@tanstack/query-persist-client-core/src/createPersister.ts`

Public companion reading:

- `repo-docs/frontend/use-state-data-best-practices.md`
- `repo-docs/frontend/model-state-guide.md`
- `repo-docs/frontend/resource-entry-page-deep-dive.md`
- `repo-docs/frontend/model-resource-internals-deep-dive.md`

## Runtime behavior by layer

### Query creation semantics

Upload policy is created as model-owned query state.

Representative file:

- `zova/src/suite/cabloy-basic/modules/basic-file/src/model/file.ts`

Representative shape:

```ts
getUploadPolicy(fileScene?: string) {
  if (!fileScene) return undefined;
  return this.$useStateData({
    queryKey: ['uploadPolicy', 'file', fileScene],
    queryFn: async () => {
      return this.scope.api.file.getUploadPolicy({ fileScene });
    },
    meta: {
      disableSuspenseOnInit: true,
    },
  });
}
```

This means:

- upload policy has a formal query key
- upload policy participates in model-owned query lifecycle
- upload policy is not hidden inside an event handler or one-off click command

In the field controller, render establishes and consumes that state:

- `zova/src/suite/cabloy-basic/modules/basic-file/src/component/formFieldFile/controller.tsx`

Representative behavior:

- `_getUploadPolicyQuery(...)` resolves the model-owned query
- `_getUploadPolicyState(...)` derives `acceptAttr`, `multiple`, and `pending`
- `_handleFileChange(...)` later awaits `_waitForUploadPolicy(...)` before upload logic continues

### Freshness semantics

Upload policy does not set `staleTime: Infinity`.

That matters because Zova wraps async query stale-time behavior in:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`

The important behavior is:

- if there is no existing cache data for the effective query key, the wrapped stale time resolves as `0`
- otherwise it resolves as the configured or explicit stale time

Default async query freshness comes from:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/config/config.ts`

Representative default:

```ts
query: {
  staleTime: {
    async: 0,
    ssr: Infinity,
  },
},
```

So upload policy keeps normal async query freshness semantics unless a caller explicitly changes them.

### Readiness semantics

Zova uses two different readiness surfaces here:

1. render-time derived state
2. explicit interaction-time waiting

The field controller demonstrates this split:

- render derives `pending` from existing query state
- interaction may explicitly await readiness through `$QueryEnsureLoaded(...)`

Representative helper:

```ts
private async _waitForUploadPolicy(options?: IResourceFormFieldFileOptions) {
  await $QueryEnsureLoaded(() => this._getUploadPolicyQuery(options));
}
```

And `$QueryEnsureLoaded(...)` itself is intentionally small:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/lib/utils.ts`

It only calls `query.suspense()` when:

- the query exists, and
- `query.data === undefined`

This helper is a strict sequencing tool, not a second state owner.

## Zova model and TanStack Vue Query internals walkthrough

### `$useStateData(...)` memoization and the conditional init-time `query.suspense()` kick

The core source is:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`

Current behavior:

```ts
if (!this[SymbolUseQueries][queryHash]) {
  const useQuery = this.$useQuery(options, queryClient);
  this[SymbolUseQueries][queryHash] = useQuery;
  if (!options.meta?.disableSuspenseOnInit) {
    useQuery.suspense();
  }
}
```

This proves two important things:

- the query wrapper is created either way
- `disableSuspenseOnInit: true` only skips the automatic first init-time `query.suspense()` kick

It does not mean:

- no query exists
- no request can ever run
- restore semantics are disabled
- interaction cannot explicitly wait later

### `$useQuery(...)` stale-time wrapping and the first-no-cache staleTime `0` behavior

The next layer is:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`

For non-sync persisters, current source wraps stale time like this:

- if no cache data exists yet, use `0`
- during client SSR pre-hydration, use SSR stale time
- otherwise use the configured or explicit stale time

That first-no-cache `0` behavior is one reason `staleTime: Infinity` can look less powerful than expected in narrow first-load tests.

### TanStack `QueryObserver` mounted/load decision points

Mounted first-load semantics live in:

- `zova/node_modules/.pnpm/@tanstack+query-core@5.101.1/node_modules/@tanstack/query-core/src/queryObserver.ts`

The key functions to re-read are:

- `shouldLoadOnMount(...)`
- `shouldFetchOnMount(...)`
- `shouldFetchOptionally(...)`
- `isStale(...)`

The main first-load rule is:

- when `query.state.data === undefined` and the query is enabled, mounted first-load can trigger fetch even if `refetchOnMount` is false

This is why `disableSuspenseOnInit: true` can still lead to one fetch on first render/mount.

### TanStack `query.suspense()` / optimistic result / `fetchOptimistic()` branching

The relevant source is:

- `zova/node_modules/.pnpm/@tanstack+vue-query@5.101.1_vue@3.5.18_typescript@5.9.2_/node_modules/@tanstack/vue-query/src/useBaseQuery.ts`

The important branch is:

- `query.suspense()` computes an optimistic result
- if `optimisticResult.isStale` is true, it calls `observer.fetchOptimistic(...)`
- otherwise it resolves without that fetch branch

That means `query.suspense()` is not “always fetch.”
It is “fetch if this query is stale under the current conditions.”

### Persister restore path and why persisted state can change whether the real `queryFn` runs

The TanStack persister source is:

- `zova/node_modules/.pnpm/@tanstack+query-persist-client-core@5.101.1/node_modules/@tanstack/query-persist-client-core/src/createPersister.ts`

Important behavior:

- persistence stores `state`, `queryKey`, `queryHash`, and `buster`
- it does not persist the full live query options object
- when fetch starts and `query.state.data === undefined`, persister restore may return persisted data first
- after restore, `refetchOnRestore` may trigger a follow-up fetch depending on staleness

So deleting old IndexedDB can fix misleading behavior even though old query options themselves were not literally persisted as the active runtime configuration. Persisted state is enough to change the path.

The Zova-side persister wrapper is:

- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`

Use it when confirming:

- storage key shape
- max-age / buster handling
- which storages are used
- what Zova saves or restores around TanStack

## `staleTime: Infinity` vs `disableSuspenseOnInit: true`

These two settings solve different problems.

### Exact semantic difference

- `staleTime: Infinity` is a freshness policy
  - once data exists, treat it as long-lived or effectively static for the relevant runtime
- `disableSuspenseOnInit: true` is an init-time trigger policy
  - skip the automatic first-consumer `query.suspense()` kick, while keeping normal query ownership and later fetch/refetch semantics

They are not equivalent.

### Why they can look similar in first-load upload-policy tests

In a narrow first-load test, both can appear to produce “only one `queryFn` call.”

But the reasons differ:

- with `disableSuspenseOnInit: true`, the first request tends to be driven by mounted first-load behavior
- with `staleTime: Infinity`, first-load/no-data behavior can still fetch because:
  - no-data queries are stale
  - Zova wraps first-no-cache stale time as `0`

So a superficial first-load outcome is not enough to treat the options as interchangeable.

### Scenario table

| Scenario                                                                                                | `staleTime: Infinity`        | `disableSuspenseOnInit: true`                                    | Recommended use                                           |
| ------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| Local-state wrappers such as `$useStateMem`, `$useStateLocal`, `$useStateCookie`, `$useStateLocalAsync` | Appropriate                  | Usually not the main concern                                     | Keep `staleTime: Infinity`                                |
| OpenAPI structural metadata such as `getBootstrap`, `getPermissions`, `getSdk`, `getSchema`             | Appropriate                  | Usually not the main concern                                     | Keep `staleTime: Infinity`                                |
| Business runtime support queries such as upload policy                                                  | Usually not the first choice | Appropriate when the goal is to skip the init-time suspense kick | Prefer `disableSuspenseOnInit: true`                      |
| Explicit interaction-time waiting                                                                       | Not the right tool           | Not the right tool by itself                                     | Use `await query.suspense()` or `$QueryEnsureLoaded(...)` |

### Recommended selection rule

Use `staleTime: Infinity` when the state is effectively static for the relevant runtime, such as:

- local-state wrappers
- structural metadata
- runtime surfaces that are meant to be refreshed only through explicit invalidation or version-buster mechanisms

Use `disableSuspenseOnInit: true` when the goal is instead:

- keep the query formal and model-owned
- skip the automatic init-time suspense kick
- let render establish state naturally
- wait strictly only when an interaction boundary really requires readiness

## Why upload policy should stay model-owned query state

Upload policy is not just a click-time helper.
It governs interaction rules such as:

- which file types are accepted
- whether multiple upload is allowed
- whether the UI should stay pending before upload proceeds
- which validation path can safely continue

That makes it query-backed interaction state, not a one-off controller command.

The preferred ownership split is:

### Model owns

- query identity
- `queryKey`
- `queryFn`
- persistence/restore/refetch lifecycle
- the durable meaning of upload-policy state

### Controller owns

- render-time derivation
- button/input gating
- upload orchestration
- explicit interaction-time waiting on the already-owned query

This keeps controller logic smaller and keeps lifecycle rules in one place.

## Contrast case: upload policy vs page-entry item state

The key counterexample is:

- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`

Current entry-page behavior explicitly ensures page-entry dependencies through:

- `$QueriesEnsureLoaded(...)`
- `queryData`
- `ModelResource.view(...)`

Representative intent:

- entry-page item state is a real page dependency
- first consumer eager-init behavior is healthy there
- the page should not require each caller to remember a manual kickoff

That is different from upload policy, where:

- the state still deserves formal query ownership
- but an automatic init-time suspense kick is not required for every first render consumer
- the strict-ready moment is the interaction boundary

Do not flatten these two categories into one loading rule.

## Documentation boundary decision

Keep the full investigation here in `repo-docs-internal/` because it includes:

- maintainer rationale
- internal source-reading path
- TanStack/Zova runtime branching details
- cache-restore edge-case interpretation
- comparison rules that are useful mainly for maintainers and framework contributors

Keep public docs focused on reusable user guidance only.

## Public-doc extraction candidates

The reusable public subset is:

- `disableSuspenseOnInit: true` skips the init-time `query.suspense()` kick rather than disabling the query
- upload policy is a good example of model-owned async state established during render
- interaction may still explicitly wait on that same query when sequencing requires readiness
- `staleTime: Infinity` should not be over-applied to business runtime support queries just because it looks similar in a first-load test

Do not copy the full internal TanStack/Zova branching trace into public docs.

## Verification focus

When editing code or docs around this area, re-check these claims against current source:

- `$useStateData(...)` memoization and optional init-time `query.suspense()` kick
- `$useQuery(...)` stale-time wrapping behavior
- `$QueryEnsureLoaded(...)` and `$QueriesEnsureLoaded(...)` readiness semantics
- default async query stale time in config
- upload-policy model ownership and field render/interaction split
- page-entry contrast path through `blockPageEntry` and `ModelResource`
- TanStack `useBaseQuery.suspense()` branching through optimistic result and `fetchOptimistic()`
- TanStack `QueryObserver` mounted/load decision points and stale checks
- TanStack persister restore/refetch behavior and what is actually persisted
- `staleTime: Infinity` usage in local-state wrappers and OpenAPI metadata queries

## Representative implementation references

The most representative current files are:

- `zova/src/suite/cabloy-basic/modules/basic-file/src/model/file.ts`
- `zova/src/suite/cabloy-basic/modules/basic-file/src/component/formFieldFile/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-image/src/model/image.ts`
- `zova/src/suite/cabloy-basic/modules/basic-image/src/component/formFieldImage/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`
- `zova/src/suite-vendor/a-zova/modules/a-openapi/src/model/sdk.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useState.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/lib/utils.ts`
- `zova/src/suite-vendor/a-zova/modules/a-model/src/config/config.ts`
