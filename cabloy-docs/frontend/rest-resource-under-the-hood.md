# Rest Resource Under the Hood

This guide explains the source-level runtime path behind the `rest-resource` module.

Use this page together with:

- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Form Guide](/frontend/form-guide)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

Use this page after [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) when you want to move from the model-focused explanation to the internal cooperation among route records, generated page wrappers, page-shell controllers, schema-driven block rendering, selector-backed resource ownership, and downstream CRUD block runtimes.

If your next question is not “how does this runtime work?” but “which files should I read next?”, continue with [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map).

If your next question is specifically how a resource entry route becomes a working entry page through `rest-resource`, `basic-pageentry`, `blockForm`, and `blockToolbarRow`, continue with [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive).

If your next question is specifically how the resource list route becomes a working list page through `basic-page`, `blockFilter`, `blockTable`, `blockPager`, and `ZTable`, continue with [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive).

If your next question is specifically how filter state becomes `query`, then `ModelResource.select(query)`, and finally list/paged data, continue with [Filter to Query to Select Data Flow Guide](/frontend/filter-query-select-data-flow-guide).

If your next question is specifically how the resource owner works internally, continue with [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive).

If your next question is specifically how the lower-level generic model runtime works beneath that owner, continue with [Model Runtime Under the Hood](/frontend/a-model-under-the-hood).

> [!TIP]
> **Resource docs path**
>
> 1. **[Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)** — learn why `ModelResource` is a resource owner
> 2. **[Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)** — learn how the module runtime pieces cooperate
> 3. **[Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)** — learn which files to read next
> 4. **[Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)** — learn how to reuse the owner in application code
> 5. **[Resource Model Best Practices](/frontend/model-resource-best-practices)** — learn the review guardrails
> 6. **[Resource Model Cookbook](/frontend/model-resource-cookbook)** — learn the common implementation shapes
>
> **You are here:** step 2.
> **Previous page:** [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern).
> **Next recommended page:** [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map).

## Why this page exists

The existing `ModelResource` pages already explain the owner pattern clearly:

- why selector identity matters
- why the model owns schema, permissions, queries, mutations, and invalidation
- how business modules should reuse the existing resource owner directly or through a thin facade

What those pages do **not** focus on is the larger module-level runtime around that owner:

- where the generic `/rest/resource/...` routes are declared
- how those routes become page-controller instances
- why the page controllers are intentionally thin
- how `rest.blocks` drives page assembly
- where the deeper list-page and entry-page CRUD runtime really lives
- how commands and other consumers reuse the same owner boundary

This page is that bridge.

## The shortest accurate runtime model

For a typical `rest-resource` page, the shortest accurate model is:

1. `routes.ts` declares one generic resource list route and two generic resource entry routes
2. generated `ZPage*` wrappers bind those route records to page-controller classes through `createZovaComponentPage(...)`
3. the page controller resolves a selector-backed `ModelResource` instance from the current `resource`
4. `ModelResource.__init__(resource)` bootstraps the resource metadata and resolves the final `resourceApi`
5. the model exposes resource-level computed surfaces such as permissions, form provider, and select/view/create/update schemas
6. the list shell reads `schemaRow.rest.blocks`, while the entry shell reads `formSchema.rest.blocks`
7. those blocks usually enter downstream generic runtimes such as `basic-page:blockPage` or `basic-pageentry:blockPageEntry`
8. those downstream runtimes resolve the same selector-backed `ModelResource` again and own the deeper list/form behavior
9. commands such as delete can also reuse the same model boundary instead of inventing page-local mutation logic

That is why `rest-resource` is not only one reusable model bean.

It is a **route-driven, schema-driven bridge** that connects:

- generic resource routes
- thin page-shell controllers
- generic Basic CRUD blocks
- one stable resource-owner model

## Runtime relationship map

Use this diagram when the question is:

- where does one `/rest/resource/...` route actually go?
- where does schema-driven block composition happen?
- where does the deeper CRUD runtime begin?
- which layer owns fetch, form, and mutation semantics?

```text
Route record
  └─ routes.ts
       └─ ZPageResource / ZPageEntry / ZPageEntryCreate
            └─ createZovaComponentPage(...)
                 └─ page-controller shell
                      ├─ resolves current resource / id / formScene
                      ├─ resolves selector-backed ModelResource
                      ├─ ensures top-level API schema surface is loaded
                      └─ reads schemaRow.rest.blocks or formSchema.rest.blocks
                               │
                               ▼
                      schema-driven block composition
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
      basic-page:blockPage         basic-pageentry:blockPageEntry
                │                             │
                ├─ filter / pager / table     ├─ formMeta / formData / submit
                ├─ query orchestration        ├─ page-title / dirty-state sync
                └─ deeper list runtime        └─ deeper entry runtime
                               │
                               ▼
                    selector-backed ModelResource
                               │
                ├─ bootstrap → resourceApi
                ├─ permissions / schemas / provider
                ├─ select / view queries
                ├─ create / update / delete mutations
                └─ centralized invalidation
                               │
                               ▼
                    OpenAPI bootstrap + fetch runtime
```

Read this top-down:

- the route and page shell choose the scene
- schema metadata chooses the block composition
- generic Basic blocks own the richer CRUD page behavior
- `ModelResource` remains the stable owner of resource semantics underneath all of them

## A concrete source specimen

The smallest module-level source set is:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts
```

A deeper runtime continuation is:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.tsx
```

Those files show the core architectural split clearly:

- `rest-resource` owns the module bridge and page shells
- `ModelResource` owns the resource boundary
- `basic-page` and `basic-pageentry` own the richer reusable CRUD block runtime
- command beans can reuse the same resource owner outside page rendering

## The core source-reading path

When you want to trace the full mechanism, read these files in order:

1. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts`
2. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/resource.ts`
3. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/entry.ts`
4. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/entryCreate.ts`
5. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`
6. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`
7. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entryCreate/controller.tsx`
8. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`
9. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
10. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
11. `zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.tsx`
12. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/index.ts`

A compact role map is:

- `routes.ts` shows the public route surface
- `.metadata/page/*.ts` shows how route components enter `createZovaComponentPage(...)`
- `page/resource/controller.tsx` shows the list-page shell
- `page/entry/controller.tsx` shows the entry-page shell
- `page/entryCreate/controller.tsx` shows virtual create-route reuse
- `model/resource.ts` shows the owner core
- `blockPage/controller.tsx` shows the deeper list runtime
- `blockPageEntry/controller.tsx` shows the deeper form runtime
- `command.delete.tsx` shows non-page reuse of the same owner boundary
- `.metadata/index.ts` shows the generated bean/type registry surface

## Step-by-step runtime path

### 1. Generic resource routes define the public module surface

Start with:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts
```

This file declares three routes:

- `:resource`
- `:resource/create`
- `:resource/:id/:formScene?`

That already reveals the module’s public role.

It is not a resource-specific module such as Student or Product.

It is a generic module whose runtime identity comes from the route params.

### Why the shared `tabKey` matters

All three routes use the same `tabKey(route)` shape:

```typescript
`/rest/resource/${encodeURIComponent(route.params.resource)}`;
```

This means the workspace identity is resource-level rather than row-level.

So the list page, create page, and entry page for one resource remain grouped under one resource-oriented tab boundary.

## 2. Generated page wrappers enter the normal Zova page-controller path

Read next:

- `src/.metadata/page/resource.ts`
- `src/.metadata/page/entry.ts`
- `src/.metadata/page/entryCreate.ts`

These files are intentionally thin.

They show that each route component is generated as a `ZPage*` wrapper through:

- `createZovaComponentPage(ControllerPageResource, ...)`
- `createZovaComponentPage(ControllerPageEntry, ...)`
- `createZovaComponentPage(ControllerPageEntryCreate, ...)`

They also surface the Zod-based params schemas for each page.

That means the route record does not jump straight into generic Vue page code.

It enters the normal Zova page-controller runtime with typed params.

## 3. The list page controller is a shell, not the full list runtime

Read:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx
```

The main jobs of `ControllerPageResource` are:

1. resolve the selector-backed model from `this.$params.resource`
2. ensure the select API schema is loaded through `this.$$modelResource.apiSchemasSelect.sdk`
3. read `this.schemaRow?.rest?.blocks`
4. render those blocks through `ZovaJsx`

What is most important is what this controller does **not** own.

It does not directly own:

- filter state
- paged query state
- table refresh policy
- row-data fetching orchestration
- permission-sensitive table metadata refresh

Those deeper concerns usually appear later in the rendered block runtime, especially in `basic-page:blockPage`.

So the correct reading is:

> `ControllerPageResource` is the resource list **page shell**.

It resolves the current resource context, loads the schema surface, and lets metadata choose the block composition.

## 4. The entry page controller is also a shell

Read:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx
```

The main jobs of `ControllerPageEntry` are:

- resolve `resource`, `id`, and `formScene`
- derive `formMeta`
- expose `formProvider` from the model
- expose `formSchema` from the model
- ensure the form API schemas are loaded
- read `formSchema?.rest?.blocks`
- render those blocks through `ZovaJsx`

Again, the deeper runtime is intentionally elsewhere.

This controller does **not** fully own:

- row-data loading for the business entry scene
- submit mutation execution for the full CRUD flow
- page-title/page-dirty synchronization
- the final reusable block-level form orchestration

Those concerns usually appear later in `basic-pageentry:blockPageEntry`.

So the correct reading is:

> `ControllerPageEntry` is the resource entry **page shell**.

It interprets the route and the form scene, then lets schema metadata choose the entry blocks.

## 5. Create-route reuse is handled through virtual subclassing

Read:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entryCreate/controller.tsx
```

This file is intentionally tiny.

`ControllerPageEntryCreate` is a virtual subclass of `ControllerPageEntry`.

That means the create route does not get a second independently maintained runtime.

Instead, it reuses the same entry shell and lets route params plus form-scene logic choose the create branch.

This is an important Zova design clue:

- page identity can differ
- controller logic can still stay shared

## 6. `ModelResource` is the owner core behind both shells

Read:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts
```

This file is the stable owner boundary behind the route shells.

At the module-runtime level, the most important steps are:

### 6.1 Selector-backed initialization

`ModelResource` is decorated with:

```typescript
@Model({ enableSelector: true })
```

and initializes through:

```typescript
protected async __init__(resource: string)
```

That means one generic model class can serve many resources safely, because the runtime identity comes from the selector resource name.

### 6.2 Bootstrap resolves the final `resourceApi`

Inside initialization, `_bootstrap()` calls:

```typescript
$QueryEnsureLoaded(() => this.$sdk.getBootstrap(this.resource));
```

and then resolves:

```typescript
this.resourceApi = this.sys.util.parseResourceApi(this.resource, queryBootstrap.data.apiPath);
```

This is one of the most important architectural facts in the whole module.

The model does not assume a hardcoded final API path.

It bootstraps the resource metadata first, then derives the stable runtime API boundary from that metadata.

### 6.3 The model exposes resource-level metadata surfaces

Still inside initialization, the model creates computed surfaces for:

- `permissions`
- `formProvider`
- `schemaView`
- `schemaCreate`
- `schemaUpdate`
- `schemaFilter`
- `schemaRow`
- `schemaPages`

That is why the page shells can stay thin.

They do not need to invent schema or permission lookup rules locally, because the owner already exposes them.

### 6.4 The model owns query, mutation, and form semantics

The same owner also provides:

- `selectGeneral(...)`
- `select(...)`
- `queryItem(...)`
- `view(id)`
- `create()`
- `update(id)`
- `delete(id)`
- `mutationItem(...)`
- `getFormSchema(...)`
- `getFormApiSchemas(...)`
- `getFormMutationSubmit(...)`
- `getFormData(...)`

A practical reading takeaway is:

> routes and page shells give the module its outer shape, but `ModelResource` gives it its resource truth.

## 7. `basic-page:blockPage` is the deeper list runtime

Read:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx
```

This file shows where the richer list behavior really lives.

It resolves the same selector-backed model again, then owns:

- filter state
- paged query state
- combined `query`
- list loading through `this.$$modelResource.select(this.query)`
- permission-sensitive table-meta refresh
- page-scene JSX/CEL scope
- block rendering for filter/table/pager composition

This is the strongest runtime proof that `rest-resource` list pages are layered like this:

```text
rest-resource page shell
  └─ schema-driven block composition
       └─ basic-page:blockPage
            └─ selector-backed ModelResource select(...) ownership
```

So if you are debugging list-page behavior such as paging, filtering, or table refresh, stopping at `ControllerPageResource` is usually too early.

## 8. `basic-pageentry:blockPageEntry` is the deeper form runtime

Read:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
```

This file shows where the richer entry behavior really lives.

It resolves the same selector-backed model again, then owns:

- `formMeta`
- `formProvider`
- `formSchema`
- `formData`
- existing-row view-query loading
- form submission through `getFormMutationSubmit(...)`
- page-title/page-dirty synchronization
- page-entry JSX/CEL scope
- rendering of the actual form block composition

This is the strongest runtime proof that `rest-resource` entry pages are layered like this:

```text
rest-resource entry shell
  └─ schema-driven block composition
       └─ basic-pageentry:blockPageEntry
            └─ selector-backed ModelResource form/query/mutation ownership
```

So if you are debugging entry-page behavior such as submit, title updates, or row-data loading, stopping at `ControllerPageEntry` is usually too early.

## 9. Commands can reuse the same owner boundary

Read:

```text
zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.tsx
```

This file shows an important architectural property of the module.

A command bean can resolve the same selector-backed `ModelResource` by resource name and call:

- `modelResource.delete(id)`

That means the resource owner is not tied to one page controller.

It is reusable across:

- page shells
- generic blocks
- commands
- business-facing thin facades

This is one reason the owner boundary is so valuable.

The mutation policy remains centralized even when the caller is not a page.

## 10. Generated metadata is a registry layer, not the main runtime layer

Read last:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/index.ts
```

This file is still useful, but use it for a different purpose.

It is best read as the module registry map for:

- model bean registration
- controller bean registration
- page-path and page-name typing
- module scope typing
- generated module augmentation surfaces

It helps answer questions like:

- what is the bean full name?
- which page names and paths are registered?
- where does typed `$params` come from?
- which scope class represents this module?

But it is not the best first file for understanding the behavioral runtime flow.

## What `rest-resource` owns vs what downstream blocks own

This distinction is the single most useful debugging habit for this module.

### `rest-resource` mainly owns

- generic resource route surface
- page-shell controller layer
- resource-level schema/block entry surface
- selector-backed owner resolution
- reusable resource-owner model logic

### downstream generic Basic blocks mainly own

- filter/table/pager CRUD list behavior
- richer form-page orchestration
- page-title/page-dirty updates in entry scenes
- more complete list/query/form submit integration

When this distinction is clear, the module becomes much easier to extend without misplacing logic.

## The Zova-native explanation

The most accurate Zova-native description is:

- `rest-resource` is a **generic resource page module**
- `ModelResource` is a **selector-backed resource owner**
- `ControllerPageResource` and `ControllerPageEntry` are **schema-driven page shells**
- `basic-page:blockPage` and `basic-pageentry:blockPageEntry` are the **deeper reusable CRUD block runtimes**

An approximate Vue-style translation would be:

- this is not one page component with local fetch hooks
- it is closer to a route-driven controller shell that delegates into reusable model and block runtimes

That translation can help orientation, but the Zova meaning above is the authoritative one.

## What to read next after this page

Choose the next page by the question you actually have.

### If the next question is which files to read next

Continue with:

- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)

### If the next question is how to reuse the owner in application code

Continue with:

- [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)
- [Resource Model Cookbook](/frontend/model-resource-cookbook)
- [Resource Model Best Practices and Anti-Patterns](/frontend/model-resource-best-practices)

### If the next question is about list-page tables and resource list blocks

Continue with:

- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)

### If the next question is about entry pages and forms

Continue with:

- [Form Guide](/frontend/form-guide)
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)

## Final takeaway

The fastest accurate way to understand `rest-resource` is to stop reading it as only one reusable model file.

Read it as four cooperating layers:

1. generic resource routes
2. generated page wrappers
3. thin schema-driven page shells
4. one selector-backed resource owner reused by deeper CRUD block runtimes

Once those layers are clear, the module becomes much easier to debug, extend, and explain without collapsing Zova back into page-local CRUD code.
