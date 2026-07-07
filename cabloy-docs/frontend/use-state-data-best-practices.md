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

## Practical rule 3: `disableSuspenseOnInit: true` means “do not block initial render”, not “do not query”

This option is often a good fit when you want:

- render to stay responsive
- query state to exist immediately
- persistence/restore/refetch behavior to remain normal

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

That distinction matters a lot.

## Practical rule 4: be cautious with `enabled: false` and `staleTime: Infinity`

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

## Practical rule 5: removing a manual `ensure...()` helper does not mean interaction can never wait

A common over-correction is:

- first version: controller manually owns fetching through `ensure...()`
- second version: remove `ensure...()` and assume interaction must never wait for anything

The better middle ground is:

- query lifecycle remains model-owned
- query is established during render
- interaction consumes the existing query
- if an edge timing window appears, interaction may wait for the existing query to finish

That is very different from rebuilding a second fetch lifecycle.

## Practical rule 6: derive render-time state once per render when possible

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

## Practical rule 7: design query keys so the ownership boundary is obvious

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

## Real example: upload policy refactor

Representative files in the Cabloy Basic frontend:

- `zova/src/suite/cabloy-basic/modules/basic-image/src/model/image.ts`
- `zova/src/suite/cabloy-basic/modules/basic-file/src/model/file.ts`
- `zova/src/suite/cabloy-basic/modules/basic-image/src/component/formFieldImage/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-file/src/component/formFieldFile/controller.tsx`

### What this example demonstrates

- `getUploadPolicy(...)` stays in the model
- the query is created as formal state instead of a one-off click helper
- `disableSuspenseOnInit: true` avoids blocking initial render
- render derives `acceptAttr`, `multiple`, and `pending`
- interaction reuses that state
- interaction may still `await query.suspense()` on the already-created query if an edge timing window requires it

This is a good specimen because it shows both the architectural rule and the practical timing guard.

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
