# Resource Model Best Practices and Anti-Patterns

This guide explains practical best practices and common anti-patterns for resource-oriented models in Zova.

It assumes you have already read:

- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)

Use this page when you want review guidance, design guardrails, or a practical checklist before adding or refactoring a resource model.

If you want implementation-oriented templates after the review guidance, continue with [Resource Model Cookbook](/frontend/model-resource-cookbook).

## Why this page exists

Once a team starts using `ModelResource` and thin business facades, the next risk is not lack of capability.

The next risk is inconsistency.

Typical problems are:

- pages bypass the model and call resource endpoints directly
- invalidation rules drift across screens
- models start collecting page-only presentation details
- wrappers duplicate generic CRUD behavior without adding resource semantics
- selector identity is used inconsistently

This page exists to keep the resource-owner pattern healthy as a codebase grows.

## The core review question

When you review a resource model, the first question should be:

> does this model own resource semantics, or is it just collecting unrelated convenience logic?

That one question catches many design mistakes early.

## Best Practice 1: keep one stable resource-owner boundary

A good resource model should become the stable boundary for one backend resource.

That means related concerns should converge there:

- resource bootstrap
- resource API resolution
- schema access
- permissions access
- CRUD query state
- CRUD mutation state
- invalidation rules
- form-related resource semantics

### Why this is good

It keeps pages and reusable blocks focused on page flow instead of resource plumbing.

### Healthy sign

Multiple screens can consume the same model surface without re-deciding how the resource works.

### Smell

Several pages each rebuild their own fetch, schema, permission, or invalidation logic for the same resource.

## Best Practice 2: keep selector semantics explicit and consistent

If a resource model is designed to serve many concrete resource instances, selector identity should stay explicit.

### Good pattern

- the model remains selector-aware
- cache identity stays resource-scoped
- generic consumers request the model through selector-based lookup

### Why this matters

Selector identity is not only an IoC detail.

It is part of the runtime resource-isolation model.

### Smell

- a resource-scoped model is reused without clear selector identity
- resource instances can accidentally share cache state
- developers stop knowing whether the model instance is generic or resource-specific

## Best Practice 3: centralize invalidation policy in the model

A resource model should usually own the invalidation policy for its own queries and mutations.

### Good pattern

- create, update, delete, and custom actions define invalidation behavior in the model
- list-level and item-level cache structure stay coherent
- pages trigger mutations but do not reinvent consistency rules

### Why this matters

Invalidation policy is part of resource semantics.

If it drifts into pages, the same resource starts behaving differently across screens.

### Smell

- one page invalidates list queries
- another page invalidates item queries
- another page manually refetches everything
- no single place explains the resource consistency model

## Best Practice 4: put resource semantics in the model, not page trivia

A strong resource model owns semantics that belong to the resource boundary.

Examples:

- business actions such as archive/publish/approve
- schema-driven decisions
- permission-driven decisions
- resource-level computed helpers
- form submission selection rules

### Keep out of the model

- one-off page text formatting
- view-only CSS decisions
- local widget toggles with no resource meaning
- temporary presentation hacks

### Review question

If another page reused this resource, would this logic still belong to the same resource owner?

If the answer is no, it probably does not belong in the model.

## Best Practice 5: add semantics only when they are real

When direct `ModelResource` usage is already enough, keep it direct.

When business semantics do appear, add them through a thin facade instead of re-expressing the same generic CRUD behavior.

### Good pattern

- keep standard CRUD on the existing resource-owner
- add custom query methods through the thin facade
- add custom mutation methods through the thin facade
- add domain-specific computed helpers only when they improve the business-facing surface

### Smell

A wrapper adds little more than renamed access to the same generic behavior and no new semantic rule.

That usually adds maintenance without adding clarity.

## Best Practice 6: preserve generic consumer compatibility when valuable

A resource-facing model setup becomes more valuable when generic consumers can still work with it.

Examples of stable surfaces include:

- `select(...)`
- `view(...)`
- `permissions`
- `schemaFilter`
- `schemaRow`
- `getFormSchema(...)`
- `getFormMutationSubmit(...)`
- `getFormData(...)`

### Why this matters

If generic page or form blocks can keep working, the codebase gains resource-specific power without losing reuse.

### Smell

A wrapper or customization breaks existing generic consumers even though no real business need required that break.

## Best Practice 7: keep `$fetch`, `$sdk`, and model state aligned behind one surface

A resource model is often strongest when it composes multiple frontend data layers behind one resource-facing API.

### Good pattern

- `$fetch` handles direct transport execution
- `$sdk` handles bootstrap/schema/permission/default-value helpers
- model helpers handle query and mutation state
- pages consume one coherent model surface

### Smell

- schema logic lives in one place
- permissions logic in another
- fetch logic in page controllers
- mutation invalidation in dialogs
- no single resource boundary remains visible

## Best Practice 8: keep key structure intentional and readable

A good resource model should have a clear internal cache-key structure.

### Good pattern

Use distinct identity layers such as:

- list/query scope
- row root scope
- row action scope

### Why this matters

Readable key structure makes invalidation and debugging much easier.

### Smell

- random string keys with no visible structure
- keys that do not reflect resource semantics
- mutation and query ownership impossible to trace mentally

## Best Practice 9: keep bootstrap and readiness logic close to the model

If a resource needs bootstrap before normal use, keep that responsibility inside the model boundary.

### Good pattern

- the model prepares itself before pages rely on it
- resource metadata and API resolution are model responsibilities

### Smell

- every page must remember to prepare bootstrap manually
- some pages load metadata first while others assume it already exists
- resource readiness becomes implicit and error-prone

## Best Practice 10: prefer incremental abstraction growth

Do not jump to the largest possible resource model on day one.

A healthy path is often:

1. start with direct `ModelResource` usage
2. let generic pages and forms consume the existing resource-owner surface
3. add a thin facade only when real business semantics appear
4. promote repeated resource logic into that stable model surface
5. keep page logic thin where possible

### Why this matters

Over-abstraction and under-abstraction are both expensive.

Incremental growth keeps the model proportional to the real business shape.

## Anti-Pattern 1: page-driven resource ownership

### What it looks like

Pages call resource endpoints directly, choose their own invalidation, and only use the model selectively.

### Why it is harmful

The codebase stops having one authoritative resource boundary.

### Better direction

Move repeated resource semantics back into the model and let pages focus on page flow.

## Anti-Pattern 2: model as a dumping ground

### What it looks like

The resource model accumulates unrelated helpers only because “it was convenient”.

### Why it is harmful

The model loses semantic clarity and becomes hard to evolve.

### Better direction

Keep the model centered on resource ownership. Move page-only or unrelated logic elsewhere.

## Anti-Pattern 3: invalidation by folklore

### What it looks like

Developers remember from habit which queries to invalidate, but the rules are not encoded centrally.

### Why it is harmful

Correctness becomes person-dependent.

### Better direction

Encode invalidation behavior inside resource mutations and keep the policy visible in one place.

## Anti-Pattern 4: selector ambiguity

### What it looks like

The same model is treated as generic in some places and concrete in others, without clear selector rules.

### Why it is harmful

Cache isolation and mental ownership both become fragile.

### Better direction

Decide whether the model is selector-scoped and keep that choice explicit in lookup and design.

## Anti-Pattern 5: add a wrapper for branding only

### What it looks like

A team creates `ModelStudent`, `ModelCourse`, `ModelOrder`, and each one only re-labels the existing resource-owner without adding meaning.

### Why it is harmful

The codebase grows more types but not more clarity.

### Better direction

Add a thin facade only when it contributes real business-facing semantics, reusable helpers, or clearer forward-chain frontend follow-up.

## Anti-Pattern 6: breaking generic blocks without benefit

### What it looks like

A wrapper or customization removes or reshapes stable resource-owner surfaces that generic blocks depend on, even though no real business need requires it.

### Why it is harmful

You lose reuse and create unnecessary divergence.

### Better direction

Preserve stable surfaces when possible and add custom semantics around them.

## Anti-Pattern 7: hiding important resource semantics in pages

### What it looks like

Pages decide custom actions, form submission logic, or permission-based branching that really belong to the resource itself.

### Why it is harmful

The same resource starts behaving differently depending on which page happens to own the branch.

### Better direction

Promote resource-level semantics into the model so all consumers inherit the same rules.

## Review checklist

Use this checklist before merging resource-model changes:

1. Is the resource-owner boundary still clear?
2. Are selector semantics explicit and consistent?
3. Are invalidation rules centralized in the model?
4. Does the model own resource semantics rather than page trivia?
5. Does the wrapper or facade add real value instead of CRUD duplication?
6. Are generic consumers preserved where practical?
7. Is the key structure readable and intentional?
8. Does bootstrap/readiness stay inside the model boundary?
9. Are `$fetch`, `$sdk`, and model state composed coherently?
10. Would another screen reuse this model surface confidently?

## When to use this page

Use this page when:

- reviewing a resource-model pull request
- deciding whether direct `ModelResource` usage is enough or a thin facade is justified
- cleaning up a resource model that feels bloated or inconsistent
- checking whether page logic has started to steal resource ownership

## Final takeaway

The most important discipline is simple:

> a good resource model is neither a thin CRUD forwarding shell nor a dumping ground. It is a stable owner of resource semantics.

That is the standard to optimize for when using the resource-owner pattern in Zova.
