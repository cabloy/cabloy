# `$useStateData` Best Practices

This guide explains how to use `$useStateData(...)` well in Zova, especially when you are deciding whether a piece of async frontend data should behave like render-time state or interaction-time ad hoc fetch logic.

Read [Model Architecture](/frontend/model-architecture) first if you want the broader role of Model.

Read [Model State Guide](/frontend/model-state-guide) first if you want the larger helper-family overview.

Use this page when your real design question is one of these:

- should this async value live in a model query or stay inside one controller?
- should the query be established during render or only during interaction?
- should I use `enabled: false` or let the query participate in the normal lifecycle?
- how should I think about `disableSuspenseOnInit: true`?
- if I remove a manual `ensure...()` helper, can interaction still wait for query readiness when needed?

## Why this page exists

`$useStateData(...)` is easy to misuse if it is treated only as a request helper.

The larger value is architectural:

- model-owned async state gets one stable owner
- query identity, persistence, restore, and refetch behavior stay in one place
- render logic can consume a formal query state instead of rebuilding mini loading/cache systems in controllers

The common failure mode is not that the code stops working immediately.

The common failure mode is that the code keeps working while the state model becomes increasingly command-oriented, duplicated, and difficult to reason about.

## The core mental model

The best starting point is simple:

> treat `$useStateData(...)` as a model-owned async state source, not only as a function that happens to fetch data.

That changes several downstream decisions.

If a value affects:

- whether a button can be clicked
- accepted file types
- maximum upload size
- whether a UI branch is shown
- whether a flow can continue safely

then that value is usually not just a click-time fetch result.
It is part of the page's real interaction state.

## Practical rule 1: prefer model ownership for reusable async state

When a value has broader reuse, persistence, or lifecycle requirements, prefer model ownership.

Typical good fits are:

- upload policy by scene
- resource bootstrap
- schema metadata
- permission/capability state
- query-style domain state reused across pages or components

Typical weak fits are:

- a one-off page-local toggle
- a tiny local interaction detail with no reuse value
- temporary page-only state that does not benefit from caching or restore semantics

### Review question

Ask:

> if another controller needed this same async value tomorrow, would I want the ownership and lifecycle policy to already exist in one model?

If the answer is yes, that state usually belongs in a model.

## Practical rule 2: if the value affects render or interaction rules, establish the query during render

If a value determines runtime interaction conditions, prefer this shape:

1. model exposes `getXxx(...)`
2. controller/page establishes the query during render
3. render consumes `data`, `pending`, and derived values
4. interaction consumes that existing query state instead of inventing a second lifecycle

### Why this is good

This keeps the UI honest.

The rendered UI can already know:

- whether interaction should wait
- which accept/multiple flags apply
- which validation path should be used

### Smell

A controller renders as though the interaction is ready, but clicking the button is what really begins the important state lookup.

That is a sign that a query-state concern may have been pushed too far into imperative interaction code.

### SSR exception: intentionally omitted state

For state intentionally omitted from SSR, hydration equivalence takes priority over the normal render-time default. Keep the same neutral shell or placeholder in the server output and the client's hydration-time initial render, then establish or load the private/client-only branch only after an explicit client boundary. Read [SSR Init Data](/frontend/ssr-init-data) before applying this exception.

## Practical rule 3: `disableSuspenseOnInit: true` disables the init-time `query.suspense()` kick, not the query itself

This point needs precise wording.

Current model runtime shows that `$useStateData(...)` creates the query wrapper first, then, only on first creation, optionally calls `query.suspense()`:

```ts
if (!this[SymbolUseQueries][queryHash]) {
  const useQuery = this.$useQuery(options, queryClient);
  this[SymbolUseQueries][queryHash] = useQuery;
  if (!options.meta?.disableSuspenseOnInit) {
    useQuery.suspense();
  }
}
```

Two details matter:

- the query is already created either way
- the runtime does **not** use `await` there

So `disableSuspenseOnInit: true` does **not** mean “block vs do not block render” in a strict synchronous sense.

It more precisely means:

- with default behavior, the first consumer of that query immediately kicks one init-time `query.suspense()` call
- with `disableSuspenseOnInit: true`, that automatic init-time kick is skipped

This option is often a good fit when you want:

- query state to exist immediately
- persistence/restore/refetch behavior to remain normal
- no automatic init-time `query.suspense()` kick on first creation

Representative pattern:

```ts
getUploadPolicy(imageScene?: string) {
  if (!imageScene) return undefined;
  return this.$useStateData({
    queryKey: ['uploadPolicy', 'image', imageScene],
    queryFn: async () => {
      return this.scope.api.image.getUploadPolicy({ imageScene });
    },
    meta: {
      disableSuspenseOnInit: true,
    },
  });
}
```

### What it does not mean

It does not mean:

- no query should be created
- no request should run
- no persisted value should be restored
- no refetch should happen later
- interaction can never explicitly wait for query readiness

That distinction matters a lot.

## Practical rule 4: distinguish three different semantics

A useful review habit is to keep these three behaviors separate.

| Case                                                            | What happens                                                                       | What it does **not** mean                                                          | Best fit                                                                                                                         |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Default `$useStateData(...)`                                    | On first query creation, runtime immediately calls `query.suspense()` once         | It does **not** synchronously `await` readiness in that call site                  | Data where “first consumer should eagerly kick one refresh/update semantic” is a good default                                    |
| `$useStateData(..., { meta: { disableSuspenseOnInit: true } })` | Query still exists, but the automatic init-time `query.suspense()` kick is skipped | It does **not** disable the query, persistence, restore, or later refetch behavior | Data that is relatively stable inside the current frontend process and does not need an automatic first-consumer kick every time |
| `await query.suspense()`                                        | Current logic sequence explicitly waits until the query is ready                   | It is **not** merely a hint or passive kickoff                                     | Interaction or orchestration boundaries where later logic must not continue until the value is ready                             |

Two practical consequences follow from this table:

1. multiple synchronous `query.suspense()` calls can still deduplicate at the query runtime level
2. only explicit `await query.suspense()` introduces a true sequencing guarantee for the current logic path

## Practical rule 5: be cautious with `enabled: false` and `staleTime: Infinity`

These options are useful, but they are easy to over-apply.

### `enabled: false`

Use it when the query should not exist yet because a real prerequisite is missing.

Good examples:

- required params are absent
- the page is in a branch where the query truly does not apply
- the query would be meaningless or invalid before some explicit condition

Be cautious when the real motivation is only:

- “I want to fetch later when the user clicks”

That often means you are taking a state concern and turning it back into a command concern.

### `staleTime: Infinity`

Use it when the value is effectively static for the relevant session.

Be cautious when the underlying backend configuration may change.

If backend scene config can change, letting the query participate in normal freshness/refetch rules is usually healthier than freezing it forever.

## Practical rule 6: removing a manual `ensure...()` helper does not mean interaction can never wait

A common over-correction is:

- first version: controller manually owns fetching through `ensure...()`
- second version: remove `ensure...()` and assume interaction must never wait for anything

The better middle ground is:

- query lifecycle remains model-owned
- query is established during render
- interaction consumes the existing query
- if an edge timing window appears, interaction may wait for the existing query to finish

That is very different from rebuilding a second fetch lifecycle.

### Choose the wait semantic: loaded versus fresh

Waiting for an existing query can mean two different things:

- **Loaded** means a value exists.
  `$QueryEnsureLoaded(...)` waits only when `query.data === undefined`, so it can continue with an older cached value.
- **Fresh** means the model's domain-specific validity rule accepts the value.
  `$QueryGetFresh(...)` and `$QueryEnsureFresh(...)` receive an `isStale(query)` predicate, so the model decides whether loaded data is still safe to consume.

| Need                                 | Helper                          | Missing or stale behavior                                                | Return shape                |
| ------------------------------------ | ------------------------------- | ------------------------------------------------------------------------ | --------------------------- |
| An interaction needs any loaded data | `await $QueryEnsureLoaded(...)` | Waits only while `query.data === undefined`                              | Query object or `undefined` |
| Render may consume only fresh data   | `$QueryGetFresh(...)`           | Starts `query.suspense()` and returns no data for the current render     | `TData \| undefined`        |
| An interaction requires fresh data   | `await $QueryEnsureFresh(...)`  | Waits for `query.suspense()` and throws a query error when refresh fails | `TData \| undefined`        |

Loaded is an availability condition. Fresh is a validity condition defined by the model; it might use `dataUpdatedAt`, response expiry metadata, or another business rule. `a-model` accepts the predicate and does not prescribe that policy.

For example, `ModelPassport` keeps the temporary-token query and its 30-second reuse rule in the model, while the generic helpers provide the consumption mechanics:

```ts
import { $QueryEnsureFresh, $QueryGetFresh, BeanModelBase, Model } from 'zova-module-a-model';

@Model()
export class ModelPassport extends BeanModelBase {
  getFreshTempAuthToken(options: TempTokenOptions): string | undefined {
    return $QueryGetFresh(
      () => this.getTempAuthToken(options),
      query => this._isTempAuthTokenExpired(query.data, query.dataUpdatedAt, options.staleTime),
    );
  }

  async ensureFreshTempAuthToken(options: TempTokenOptions): Promise<string | undefined> {
    return await $QueryEnsureFresh(
      () => this.getTempAuthToken(options),
      query => this._isTempAuthTokenExpired(query.data, query.dataUpdatedAt, options.staleTime),
    );
  }
}
```

Use the non-blocking facade during render, where stale data should not build a protected URL:

```ts
const passportCode = this.$passport.getFreshTempAuthToken(options);
```

Use the awaited facade at an interaction boundary, where a download or preview must not continue with an expired token:

```ts
const passportCode = await this.$passport.ensureFreshTempAuthToken(options);
```

Both paths reuse the same model-owned query. When `$QueryGetFresh(...)` finds stale data, it starts `query.suspense()` and returns `undefined` for the current render; reactive query state provides the replacement value on a later render. `$QueryEnsureFresh(...)` instead waits for that refresh and propagates query errors to the interaction flow.

## Render-driving state versus one-shot refetch results

A query established during render remains the owner of its ongoing state. Render paths should read the current reactive surface—typically `query.data`, `query.pending`, `query.error`, or a model-derived projection—and let query updates drive a later render.

An interaction or orchestration boundary may still await `query.refetch()` when it needs one result to decide whether to continue a command, navigate, show a notification, or open a dialog. That result is local to the current sequence; it does not transfer query ownership to the controller or render path.

Do not copy an awaited `refetch()` result into a second long-lived controller/render state that drives an open dialog or persistent component. If the UI remains mounted and displays query-backed data, bind it to `query.data` or a model-derived reactive surface so later refetches and model updates remain visible.

### Per-fetch persistence bypass

When one interaction needs an API-fresh result but should not restore persisted data or schedule a persistence save for that fetch, use the model query's per-fetch option:

```ts
await query.refetch({ bypassPersister: true });
```

`bypassPersister: true`:

- affects only the current fetch
- does not change the query's static options or `meta.persister`
- skips persisted-query restore for that fetch
- does not schedule that fetch through the persister's save path
- still lets TanStack Query update the in-memory query, timestamps, observers, and reactive `query.data`
- does not create a second query or cache owner

This option is not a force-new-request flag. Cancellation, `cancelRefetch`, and in-flight deduplication continue to follow TanStack Query semantics. If an existing fetch is reused, its already-established fetch semantics remain in effect. The bypassed fetch itself does not intentionally replace an existing persisted value; an already queued ordinary persistence callback is a separate operation and is not automatically cancelled.

This is different from static `meta.persister: false`: the static option disables persistence for the query generally, while `bypassPersister: true` opts out only for one fetch.

By contrast, a summary dialog can deliberately use persisted-cache-first behavior while remaining bound to query-owned state:

```ts
const querySummary = modelStudent.summary(id);

$host.$appModal.dialog({
  slotDefault: () => {
    const hasData = querySummary.data !== undefined;
    const isLoading = !hasData && (querySummary.isPending || querySummary.isFetching);
    const error = querySummary.error;

    return (
      <>
        {hasData && error && <SummaryRefreshWarning />}
        {error && <SummaryFetchError error={error} />}
        {hasData ? (
          <ZMarkdownHtml html={querySummary.data?.descriptionHtml ?? ''} />
        ) : isLoading ? (
          <SummaryLoading />
        ) : undefined}
      </>
    );
  },
});
```

This dialog has no command decision that needs readiness, so it opens immediately after creating its model-owned query rather than awaiting `refetch()`. By default, first query creation kicks `query.suspense()` without awaiting it. A cold query can restore usable persisted data, and a stale restored value can later revalidate according to the configured persister and query rules; the open dialog reads every transition through `querySummary.data` and its query status.

Treat `data !== undefined` as the availability boundary. Retained data plus `error` has two separate user-facing meanings: render a non-blocking refresh-failure warning to explain that the retained content may be outdated, render the concrete `error.message` through `SummaryFetchError`, and keep the content visible. With no data plus `error`, render only the concrete fetch error. This is persisted-cache-first stale-while-revalidate UI, not an API-fresh orchestration request. Restore and follow-up revalidation depend on data availability, persister configuration, and staleness.

## Practical rule 7: derive render-time state once per render when possible

Even when the query object is reused, a controller can still become noisy if it repeatedly derives the same values in several helper calls.

A good cleanup pattern is to derive one local state object such as:

- `acceptAttr`
- `multiple`
- `pending`

and let input/button/render branches consume that shared result.

### Why this helps

It makes one render pass easier to understand:

- what query-backed state is being consumed
- which UI props come from that state
- where the interaction gate really is

### Smell

The controller repeatedly:

- grabs the same query
- re-reads the same policy data
- re-derives the same `multiple` or `accept` value in several places

That is often a sign that local render-time derivation should be consolidated.

## Practical rule 8: design query keys so the ownership boundary is obvious

Prefer keys that make the domain explicit.

For example:

- `['uploadPolicy', 'image', imageScene]`
- `['uploadPolicy', 'file', fileScene]`

This is usually better than ambiguous cross-domain shapes such as:

- `['uploadPolicy', scene]`

### Why this matters

Readable keys improve:

- debugging
- tracing cache behavior
- future refactors when similar query families grow

## Practical rule 9: key stable resource inputs, not ambient caller identity

A `$useStateData(...)` query key identifies the stable variant of a resource. Include inputs that change that variant, such as an operation or resource identifier, filters, pagination, Site/public path, or locale.

Do not append the current username, authenticated flag, Passport role names or IDs, or another authorization fingerprint merely because the server evaluates the current Passport while producing the response. Those values are ambient request context, not automatically part of the frontend resource identity.

Normal authentication transitions already provide lifecycle boundaries: login stores the new Passport before navigating into the destination model, and that model's ordinary query lifecycle refreshes stale data under the new request context. Logout clears query data after leaving protected UI.

Use explicit invalidation or refetch when authorization policy changes during an otherwise continuing authenticated session, such as an administrator changing role membership, Site policy, or menu policy. Refresh authoritative Passport state when necessary, then synchronize the affected stable resource key; do not turn a policy fingerprint into the key by default.

For example, the menu resource is keyed by its stable Site/public path and locale:

```ts
queryKey: ['retrieveMenus', publicPath, locale];
```

Do not key it by the current roles:

```ts
// Avoid: roles are ambient request policy, not menu resource identity.
queryKey: ['retrieveMenus', publicPath, locale, roleNames];
```

## Anti-pattern: command-first controller state

A common anti-pattern looks like this:

- model query is disabled by default
- controller clicks trigger `ensure...()`
- controller maintains the important timing logic itself
- render does not fully know the interaction conditions yet

### Why this is harmful

- the model no longer owns the full lifecycle cleanly
- restore/refetch semantics are weakened or bypassed
- controller responsibilities grow too large
- interaction rules become harder to inspect from the render path

## Better pattern: model-owned query, render-owned derivation, interaction-owned orchestration

A healthier split is:

### Model owns

- `queryKey`
- `queryFn`
- persistence/restore/refetch lifecycle
- the stable meaning of the async state

### Controller/page owns

- how the query-backed state is rendered
- derived props needed by the current UI
- user interaction flow
- edge-timing waits on the already-existing query when necessary

This creates a much cleaner division of responsibilities.

## Representative examples

### Example A: resource entry pages usually prefer the default init-time kick

A good counterexample to overusing `disableSuspenseOnInit: true` is the resource entry-page branch.

Useful reading pages are:

- [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)

In that branch, the practical expectation is often:

- opening a row page may show an already-known value first
- but entering that page should still eagerly kick one update semantic for the item-level state
- the page benefits from the default “first consumer kicks `query.suspense()` once” behavior

This makes entry pages a good mental model for queries where the default init-time kick is healthy:

- the query is a real page-state dependency
- the first consumer should actively nudge freshness
- you usually do not want every caller to remember to add that kickoff manually

This is not about synchronous blocking.
It is about preserving the default eager-init semantic when the first consumer of that page state appears.

### Example B: upload policy prefers `disableSuspenseOnInit: true`

Representative files in the Cabloy Basic frontend:

- `zova/src/suite/cabloy-basic/modules/basic-image/src/model/image.ts`
- `zova/src/suite/cabloy-basic/modules/basic-file/src/model/file.ts`
- `zova/src/suite/cabloy-basic/modules/basic-image/src/component/formFieldImage/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-file/src/component/formFieldFile/controller.tsx`

### What this example demonstrates

- `getUploadPolicy(...)` stays in the model
- the query is created as formal state instead of a one-off click helper
- `disableSuspenseOnInit: true` skips the automatic init-time `query.suspense()` kick while preserving the query as formal state
- upload policy still uses normal async freshness semantics here because the model method does not set `staleTime: Infinity`
- render establishes and derives `acceptAttr`, `multiple`, and `pending` from that query-backed state
- interaction reuses that same state
- interaction may still `await query.suspense()` on the already-created query if an edge timing window requires it

Why this is a good fit:

- upload policy is a real query-backed state
- it is stable enough that every first consumer does not need to auto-kick one eager init-time refresh semantic
- it should still keep normal async freshness behavior rather than being frozen through `staleTime: Infinity`
- the strict-ready moment is the interaction boundary, not every initial render consumer

Taken together, Example A and Example B show the most important design contrast on this page:

- entry-page item state is a good example of why the default init-time kick can be valuable
- upload policy is a good example of why a stable state may still be a formal query while skipping that init-time kick

## Checklist before you use `$useStateData(...)`

Ask these questions:

1. Is this value really a reusable async state source rather than a one-off action result?
2. Will this value affect render or interaction conditions?
3. Should another page or controller be able to consume the same lifecycle and cache policy later?
4. Is `disableSuspenseOnInit: true` enough, instead of disabling the query entirely?
5. Would `enabled: false` or `staleTime: Infinity` accidentally cut off useful restore/refetch behavior?
6. If interaction needs a safety wait, can it wait on the existing query rather than reintroducing a manual `ensure...()` lifecycle?
7. Can I derive the render-time state once and reuse it across the UI branch?

## Final takeaway

The most important usage insight is simple:

> `$useStateData(...)` is strongest when it models async state that the UI can render from, persist, restore, and refresh naturally.

When that mindset is clear, controllers become thinner, models become more authoritative, and query lifecycle decisions become easier to reason about.
