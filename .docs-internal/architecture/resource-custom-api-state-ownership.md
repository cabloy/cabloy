# Resource-Bound Custom API State Ownership

This note records the preferred frontend state-ownership pattern for resource-bound custom APIs in Zova.

Use it when a task adds or refactors custom resource endpoints such as:

- `summary/:id`
- `restore/:id`
- `deleteForce/:id`
- `history/:id`
- any other row-scoped or resource-scoped endpoint that belongs to the same logical resource as the standard CRUD flow

## Purpose

This pattern exists to prevent a common state inconsistency:

- the generic resource pages already use `rest-resource.model.resource` as the canonical owner of resource server state
- a module-local model introduces a second owner for custom query or mutation state
- a custom mutation invalidates only its own cache namespace
- the resource list or entry page continues to display stale data because it is reading a different model owner

The durable rule is:

- resource-bound server state should have one owner
- in this codebase, that owner should be `rest-resource.model.resource`
- module-local models may stay as semantic facades, but they should not become competing state owners for the same resource

## The ownership split to avoid

Avoid this shape:

1. `rest-resource.model.resource` owns `select`, `view`, `create`, `update`, `delete`
2. a local semantic model, for example a module-local wrapper bean, also owns custom query and mutation state with its own keys
3. custom mutation success only invalidates the local model keys

That split creates drift because the resource pages and commands do not consume the same owner.

The main resource consumers already rely on the generic resource model, for example:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`
- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.tsx`

If a module-local model manages a second cache tree for the same resource rows, mutations become harder to reason about and stale UI becomes likely.

## Preferred ownership model

The preferred shape is:

1. `rest-resource.model.resource` owns all resource-bound server state
2. standard CRUD methods remain there
3. custom resource query and mutation state also goes there through reusable helpers
4. module-local models remain thin semantic wrappers that delegate to the generic resource owner

In practice, this means:

- keep generated SDK calls typed and module-local
- centralize cache keys, invalidation, and query or mutation ownership in `ModelResource`
- keep the page, command, and table-action layers pointed at one state owner

## Cache-key convention

Use grouped row keys so one invalidation can clear all row-specific query scenes.

Recommended structure:

- list-scoped query keys:
  - `['select', actionPath ?? '', hashkey(query)]`
- row root key:
  - `['item', id]`
- row-scoped query keys:
  - `['item', id, 'get']`
  - `['item', id, 'summary']`
  - `['item', id, 'history']`
- row-scoped mutation keys may extend the same structure, for example:
  - `['item', id, 'deleteForce', 'mutation']`

Recommended invalidation rules:

- a list-affecting mutation invalidates `['select']`
- a row-affecting mutation invalidates `['item', id]`
- if both are affected, invalidate both

This grouping allows one row-level invalidation to clear:

- the standard row detail state
- custom row query state
- future row-scoped query scenes that belong to the same entity instance

## Generic resource helper pattern

`zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts` should own the reusable helpers for custom resource state.

Preferred helper shape:

- key factories for list and row keys
- a row-scoped query helper such as `queryItem(...)`
- a row-scoped mutation helper such as `mutationItem(...)`

Recommended design constraints:

- let callers provide `queryFn` and `mutationFn`
- keep generated SDK calls outside the generic model when they are module-specific
- let the generic model own only:
  - cache key construction
  - query or mutation state ownership
  - invalidation policy
  - any durable lifecycle invariants

This keeps the abstraction small and avoids teaching `ModelResource` about every module-specific endpoint.

## Module-local semantic facade pattern

A module-local model may still be useful when the task needs to demonstrate or preserve business semantics close to the module.

Preferred pattern:

1. keep the local semantic facade model bean when the module still benefits from a business-local API surface
2. resolve the selector-backed `rest-resource.model.resource` for the resource
3. expose semantic methods such as:
   - `summary(id)`
   - `deleteForce(id)`
4. implement those methods by delegating to `ModelResource.queryItem(...)` or `ModelResource.mutationItem(...)`

This preserves a good demo and business API surface while avoiding a second cache owner.

## Typed generated SDK usage

Do not force the generic resource model to know module-specific generated API classes.

Prefer this split:

- generated SDK call stays in the module-local facade
- state owner remains the generic resource model

That means the module-local facade passes typed closures into the generic helpers, for example conceptually:

- `queryItem({ id, action: 'summary', queryFn: () => api.summary(...) })`
- `mutationItem({ id, action: 'deleteForce', mutationFn: () => api.deleteForce(...) })`

This gives typed request and response handling without duplicating state ownership.

## Naming guidance

For custom row-scoped helper options, prefer `action` over `scene` or `handler`.

Reasoning:

- `action` matches resource action semantics such as `get`, `summary`, `deleteForce`
- `scene` already has strong UI and form-scene meaning elsewhere in the codebase
- `handler` describes implementation shape rather than resource meaning

Preferred examples:

- `queryItem({ id, action: 'get', ... })`
- `queryItem({ id, action: 'summary', ... })`
- `mutationItem({ id, action: 'deleteForce', ... })`

## When this pattern should be reused

Reuse this pattern when all of the following are true:

- the endpoint belongs logically to an existing resource
- standard resource pages or commands already consume that resource through `rest-resource.model.resource`
- the custom endpoint returns or mutates resource-bound server state
- stale list or row state would matter after a mutation

Typical examples:

- hard delete vs soft delete
- restore
- summary/details sidebar data that belongs to one row
- approval or publication mutations that affect both row and list views

## When a separate state owner may still be fine

A separate owner may still be acceptable when the data is not really part of the resource state surface, for example:

- unrelated cross-resource dashboard data
- global application state
- purely local UI state
- data that is intentionally not synchronized with the generic resource page model

Even then, be explicit about the boundary. Do not create a second owner by accident.

## Implementation checklist

When adding a new resource-bound custom API flow:

1. confirm whether the resource pages already use `rest-resource.model.resource`
2. decide whether the new endpoint is row-scoped or list-scoped
3. reuse or extend the generic resource helpers rather than creating a second cache owner
4. group row keys under `['item', id, action]`
5. invalidate `['item', id]` for row-affecting mutations
6. invalidate `['select']` for list-affecting mutations
7. keep module-local models as semantic facades only
8. verify both the generic resource flows and the new custom action flow

## Verification focus

After implementing or refactoring a custom resource action, verify:

- the normal resource list still refreshes correctly
- the normal entry or detail page still refreshes correctly
- the custom action still works through the module-local semantic facade if one exists
- one row-level invalidation clears all row-specific query scenes for that item
- `npm run build:zova:admin` still passes so the SSR/rest type surface stays healthy

If Vona consumes the generated rest surface for related typing, also verify:

- `cd vona && npm run tsc`

## Representative implementation references

Use the framework-level files as the primary anchors for this pattern:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`
- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.tsx`

A module-level demo such as `demo-student` may remain a representative example, but the rule should not depend on that module continuing to exist:

- `zova/src/module/demo-student/src/model/student.ts`
- `zova/src/module/demo-student/src/bean/tableCell.actionSummary.tsx`
- `zova/src/module/demo-student/src/bean/tableCell.actionDeleteForce.tsx`
