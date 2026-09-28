# Resource Custom State Pattern

Use this reference when a contract-loop task adds or refactors a custom API that still belongs to an existing resource.

This is a downstream consumer-alignment pattern for the forward chain. It applies after contract regeneration, not instead of contract generation.

Typical examples:

- `summary/:id`
- `restore/:id`
- `deleteForce/:id`
- `history/:id`
- any other row-scoped endpoint that should stay synchronized with standard resource list or entry flows

## The ownership rule

Prefer one owner for all server state in the same Admin Resource boundary.

In this codebase, the preferred Admin Resource owner is:

- `rest-resource.model.resource`

Do not let a module-local model become a second state owner for the same Admin resource rows unless the boundary is explicitly intentional.

## The split to avoid

Avoid this pattern:

1. standard resource list and entry pages consume `rest-resource.model.resource`
2. a module-local model introduces separate query or mutation state for the same rows
3. custom mutation success invalidates only the local model keys
4. the generic resource pages keep reading stale row or list state

This usually happens when a task starts with a module-local generated SDK wrapper and stops there. The pattern is generic and should not depend on any one demo module continuing to exist.

## Preferred pattern

Use this shape instead:

1. keep `ModelResource` as the single owner of resource-bound server state
2. add reusable resource-owned helpers for custom query and mutation state
3. keep module-local models only as thin semantic facades when the task still benefits from a business-local API surface

This is the forward-chain downstream rule in practice: regenerate the contract first, then keep the frontend follow-up thin and resource-owner-aware.

A good semantic facade may still expose methods such as:

- `summary(id)`
- `deleteForce(id)`

But those methods should delegate to `ModelResource`, not create a competing cache owner.

## Cache-key convention

For row-scoped state, group keys under the item identity.

Preferred structure:

- row root:
  - `['item', id]`
- row query scenes:
  - `['item', id, 'get']`
  - `['item', id, 'summary']`
  - `['item', id, 'history']`
- row mutation scenes may extend the same structure, for example:
  - `['item', id, 'deleteForce', 'mutation']`

For list-scoped resource queries, keep the select-style grouping, for example:

- `['select', actionPath ?? '', hashkey(query)]`

## Invalidation rule

For a row-affecting mutation:

- invalidate `['item', id]`

For a list-affecting mutation:

- invalidate `['select']`

If both are affected:

- invalidate both

This is the key benefit of the grouped row-root convention: one invalidation clears all row-specific query scenes for the same item.

## Helper naming guidance

When adding reusable row-scoped helper options, prefer `action` over `scene` or `handler`.

Reason:

- `action` matches resource semantics such as `get`, `summary`, `deleteForce`
- `scene` already has stronger UI and form-scene meaning elsewhere in the codebase
- `handler` describes implementation shape rather than resource meaning

Preferred examples:

- `queryItem({ id, action: 'summary', ... })`
- `mutationItem({ id, action: 'deleteForce', ... })`

## Typed SDK guidance

Keep generated SDK calls typed and module-local.

Preferred split:

- module-local facade keeps the generated SDK call
- `ModelResource` owns the query or mutation state and invalidation policy

That means the facade passes typed closures into the generic helpers, conceptually like:

- `queryItem({ id, action: 'summary', queryFn: () => api.summary(...) })`
- `mutationItem({ id, action: 'deleteForce', mutationFn: () => api.deleteForce(...) })`

This preserves strong typing without duplicating state ownership.

## When to reuse this pattern

Reuse it when all of the following are true:

- the endpoint still belongs logically to an existing resource
- standard resource list or entry pages already consume that resource through `rest-resource.model.resource`
- stale row or list state would matter after the mutation or fetch
- the task needs a custom API shape beyond standard CRUD, but not a separate application-state subsystem

## When a separate owner may still be acceptable

A separate owner may still be fine when the data is not really part of the resource state surface, for example:

- unrelated dashboard data
- global application state
- purely local UI state
- intentionally unsynchronized auxiliary data

Even then, be explicit about the boundary.

## Admin Resource and Web self-service boundary

A dedicated Web model is also valid when one persisted domain exposes a genuinely separate, customer-scoped self-service contract.

Use that branch only when all of these are true:

- the Web operations and DTOs are distinct from Admin `select`/`view` semantics;
- the server derives owner scope from the authenticated user and preserves normal instance scope;
- the Web model owns only its self-service query keys and purpose-built page state, not Admin Resource schemas, permissions, or generic page state;
- Web UX or private SSR behavior needs a dedicated admission and post-hydration boundary.

This does not justify a parallel owner for a custom Admin endpoint. It establishes a separate Web state domain beside the Admin Resource boundary. Read `../../../../repo-docs/fullstack/admin-resource-and-web-self-service.md` for the complete cross-stack pattern.

## Quick checklist

1. confirm whether the resource pages already use `rest-resource.model.resource`
2. decide whether the custom endpoint is row-scoped or list-scoped
3. reuse or extend the generic resource helpers instead of creating a second owner
4. group row keys under `['item', id, action]`
5. invalidate `['item', id]` for row-affecting mutations
6. invalidate `['select']` for list-affecting mutations
7. keep module-local models semantic-only when possible
8. verify both standard resource flows and the new custom action flow
