# Rest Resource Source Reading Map

This page is a practical map for contributors and AI workflows that need to read the `rest-resource` module efficiently.

Use this page when the main question is not only what `ModelResource` does in isolation, but how the whole module works at runtime:

- which files form the module entry surface?
- how do routes reach page controllers?
- why are the page controllers so thin?
- where do list-page and entry-page blocks actually come from?
- where does the real query, form, and mutation ownership live?

Use this page together with:

- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Form Guide](/frontend/form-guide)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

Use this page after [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood) when your next question is not the runtime model itself, but which files to read first for one specific `rest-resource` question.

> [!TIP]
> **Rest Resource docs paths**
>
> - **Architecture path:** [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) → [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood) → **Rest Resource Source Reading Map**
> - **Application path:** [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) → [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide) → [Resource Model Cookbook](/frontend/model-resource-cookbook)
>
> **You are here:** module-level source reading.
> **Previous page:** [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood).

## Why this page exists

The existing `ModelResource` pages already explain two important things well:

- why `ModelResource` is a resource-owner model
- how application code should reuse it directly or through a thin facade

What those pages do **not** focus on is the module-level runtime path around that model:

- route records
- generated page wrappers
- page-shell controllers
- block rendering from schema metadata
- downstream generic consumers such as `basic-page` and `basic-pageentry`

That missing layer matters because `rest-resource` is not only a reusable model bean.

It is also a **route-to-page-shell-to-block-to-model bridge** for resource-driven CRUD pages.

## The shortest accurate runtime model

If you only remember one mental model, remember this one:

1. `routes.ts` chooses one of three resource-oriented pages
2. generated `ZPage*` wrappers bind those route entries to page controllers
3. the page controllers resolve the current `resource`, `id`, and `formScene`
4. the page controllers load top-level schema metadata and render `rest.blocks`
5. those rendered blocks usually enter generic Basic runtimes such as `basic-page:blockPage` or `basic-pageentry:blockPageEntry`
6. those downstream runtimes resolve the same selector-backed `ModelResource` instance again
7. `ModelResource` remains the stable owner of resource bootstrap, schema, permissions, queries, mutations, and invalidation

A compact relationship map is:

```text
routes.ts
  └─ ZPageResource / ZPageEntry / ZPageEntryCreate
       └─ page controller shell
            └─ schema rest.blocks
                 └─ generic Basic blocks
                      └─ selector-backed ModelResource
                           └─ OpenAPI bootstrap / fetch / mutation / invalidation
```

That is why `rest-resource` should not be read as “one page that does CRUD directly”.

The Zova-native meaning is:

- `rest-resource` provides the **module-level bridge**
- `ModelResource` provides the **resource-owner boundary**
- `basic-page` and `basic-pageentry` provide the **deeper list/form runtime**

## The core source-reading path

When you want the shortest correct reading order, use this sequence:

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
- `.metadata/page/*.ts` shows the generated wrapper entry into `createZovaComponentPage(...)`
- `page/resource/controller.tsx` shows the list-page shell
- `page/entry/controller.tsx` shows the entry-page shell
- `page/entryCreate/controller.tsx` shows virtual create-page reuse
- `model/resource.ts` shows the resource-owner core
- `basic-page:blockPage` shows the deeper list runtime
- `basic-pageentry:blockPageEntry` shows the deeper form runtime
- `command.delete.tsx` shows non-page consumers reusing the same resource owner
- `.metadata/index.ts` shows the generated typing and bean-registration surface

## 1. Route surface and tab identity

Start with:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts`

This file declares three routes:

- `:resource`
- `:resource/create`
- `:resource/:id/:formScene?`

That already tells you the module’s public role.

It is not tied to one concrete resource such as Student or Product.

Instead, it is a generic route module whose runtime identity comes from `route.params.resource`.

### Why `tabKey` matters

All three routes use the same `tabKey(route)` shape:

```typescript
`/rest/resource/${encodeURIComponent(route.params.resource)}`;
```

This means the tab identity is resource-level rather than row-level.

So these views are grouped under one resource-oriented tab boundary:

- resource list
- create entry
- view/edit entry

That is a small but important architectural clue.

The module is designed around one stable **resource workspace**, not one isolated page per row.

## 2. Generated wrapper layer and typed page identity

Read next:

- `src/.metadata/page/resource.ts`
- `src/.metadata/page/entry.ts`
- `src/.metadata/page/entryCreate.ts`

These files are thin but important.

They show that the route component is not hand-written Vue setup code.

Instead, each route enters the normal Zova page-controller path through:

- `createZovaComponentPage(ControllerPageResource, ...)`
- `createZovaComponentPage(ControllerPageEntry, ...)`
- `createZovaComponentPage(ControllerPageEntryCreate, ...)`

These files also expose the typed Zod-based params schema for each page.

### What `.metadata/index.ts` adds

After the page wrappers, read:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/index.ts`

This generated file is mostly not “business logic”, but it is still the best summary of the module’s registered surfaces:

- `rest-resource.model.resource` → model bean full name
- `rest-resource.controller.pageResource` / `pageEntry` / `pageEntryCreate` → controller registrations
- page-path and page-name typing for `/rest/resource/...`
- module scope typing for `rest-resource`

Use this file as the **registry map**, not as the first place to learn the runtime behavior.

## 3. Thin page-shell controllers

The most important module-level reading insight is this:

> the page controllers are thin shells that load top-level schema metadata and render blocks; they are not the whole CRUD runtime by themselves.

That becomes clear when you read the two real page controllers.

### 3.1 Resource list shell

Read:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`

This controller does three main things:

1. resolves the selector-backed `ModelResource` instance from `this.$params.resource`
2. autoloads `apiSchemasSelect.sdk`
3. reads `schemaRow?.rest?.blocks` and renders those blocks through `ZovaJsx`

The key point is what it does **not** do.

It does not own:

- filter state
- pager state
- table refresh logic
- row data fetch orchestration

Those deeper concerns usually appear later inside the rendered block chain, especially in `basic-page:blockPage`.

So this controller is better understood as a **resource list page shell**.

It resolves resource context, loads the schema surface, and lets schema metadata choose which blocks should render.

### 3.2 Entry shell

Read:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`

This controller is the entry-page counterpart.

It mainly owns:

- parameter interpretation (`resource`, `id`, `formScene`)
- `formMeta` derivation
- `formProvider` lookup from `ModelResource`
- `formSchema` lookup from `ModelResource`
- autoload of the form API schemas
- block rendering from `formSchema?.rest?.blocks`

Again, the most important insight is what it does **not** fully own.

It does not directly become the full form runtime.

The actual form-state, form-data, submit, and page-meta orchestration commonly appear deeper in downstream consumers such as `basic-pageentry:blockPageEntry`.

So this controller is a **schema-driven entry shell**, not a page-local CRUD implementation.

### 3.3 Virtual create shell reuse

Read:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entryCreate/controller.tsx`

This file is intentionally small.

It is a virtual subclass of `ControllerPageEntry`.

That tells you the module does not want two separate create/runtime implementations.

Instead, the create route reuses the entry shell and lets route params plus form-scene logic select the create behavior.

This is a good example of Zova keeping page identity separate from duplicated controller logic.

## 4. `ModelResource` is the owner core, not only a helper

Read:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`

This file is the real owner boundary of the module.

The earlier page [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) already covers this class in depth, so here the focus is narrower:

- how it fits into the module-level runtime around it
- which methods the page-shell and downstream blocks actually depend on

### What this model owns for the module

At module level, `ModelResource` provides the stable surface for:

- selector identity by resource name
- bootstrap through `$sdk.getBootstrap(this.resource)`
- resolution of `resourceApi`
- permissions lookup
- schema access for select/view/create/update
- form-provider access
- list/item query ownership
- create/update/delete mutation ownership
- invalidation policy
- form-facing helpers

A practical source-reading takeaway is:

> the routes and page shells give the module its shape, but `ModelResource` gives the module its resource truth.

### Why selector identity is still essential here

Because the module routes are generic, the same page/controller classes must work for many resources.

That only works cleanly because `ModelResource` uses selector identity.

The selector is the current resource name, so the same generic model class can safely serve:

- one Student resource instance
- one Product resource instance
- one Article resource instance

without cache collisions.

## 5. Downstream generic consumers are the next runtime layer

To understand the full runtime, do not stop at `rest-resource` itself.

Continue into the main downstream consumers.

### 5.1 `basic-page:blockPage`

Read:

- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`

This file shows where the deeper list-page runtime really lives:

- selector-based `ModelResource` lookup
- query filter state
- paged query state
- list fetch through `select(this.query)`
- permission-sensitive table-meta refresh
- page-scene JSX/CEL scope
- rendering of filter/table/pager blocks

This is the strongest confirmation that `ControllerPageResource` is only the shell, while `basic-page:blockPage` is the richer list runtime.

### 5.2 `basic-pageentry:blockPageEntry`

Read:

- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`

This file shows the deeper entry runtime:

- selector-based `ModelResource` lookup
- `formMeta`, `formProvider`, `formSchema`, and `formData`
- view-query loading for existing rows
- form submit delegation through `getFormMutationSubmit(...)`
- page-title/page-dirty updates
- form-scene JSX/CEL scope

This is the strongest confirmation that `ControllerPageEntry` is the page shell, while `basic-pageentry:blockPageEntry` is the richer form runtime.

### 5.3 Commands can reuse the same owner boundary

Read:

- `zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.tsx`

This file shows an important architectural property:

`ModelResource` is not only for page controllers.

A command bean can resolve the same selector-backed model and reuse its delete mutation directly.

So the owner boundary is reusable across:

- pages
- blocks
- commands
- custom business facades

## 6. What is runtime logic and what is generated scaffolding?

When reading this module, keep this distinction clear.

### Runtime logic

These are the main runtime logic files:

- `src/routes.ts`
- `src/page/resource/controller.tsx`
- `src/page/entry/controller.tsx`
- `src/page/entryCreate/controller.tsx`
- `src/model/resource.ts`

These are where the real behavior decisions live.

### Generated or type-oriented scaffolding

These are mostly generated/type-facing support files:

- `src/.metadata/index.ts`
- `src/.metadata/page/*.ts`
- `src/types/resource.ts`
- `src/types/pageWrapper.ts`
- `src/types/pageEntryWrapper.ts`

They are still useful, but for a different purpose:

- bean registration lookup
- page wrapper identity
- typed route params
- render-context augmentation
- bootstrap shape typing

Read them to confirm the public/typed surfaces, not to discover the main runtime flow first.

## 7. Question-oriented reading paths

Use these shorter paths when you have one specific question.

### Question: how does one generic resource route become one page controller?

Read:

1. `src/routes.ts`
2. `src/.metadata/page/resource.ts` or `src/.metadata/page/entry.ts`
3. the corresponding `src/page/*/controller.tsx`

### Question: where does resource list-page block composition come from?

Read:

1. `src/page/resource/controller.tsx`
2. `src/model/resource.ts` for `schemaRow`
3. `basic-page/src/component/blockPage/controller.tsx`

The important answer is usually:

- page shell reads `schemaRow.rest.blocks`
- generic Basic block runtime owns the deeper list behavior

### Question: where does entry create/view/edit behavior come from?

Read:

1. `src/page/entry/controller.tsx`
2. `src/page/entryCreate/controller.tsx`
3. `src/model/resource.ts` for `getFormSchema`, `getFormApiSchemas`, `getFormData`, and `getFormMutationSubmit`
4. `basic-pageentry/src/component/blockPageEntry/controller.tsx`

### Question: where do actual list query and form submit rules live?

Read:

1. `src/model/resource.ts`
2. `basic-page:blockPage`
3. `basic-pageentry:blockPageEntry`

This is the path that most clearly shows the separation between page shells and deeper generic runtimes.

### Question: how do resource actions such as delete reach the same owner boundary?

Read:

1. `basic-commands/src/bean/command.delete.tsx`
2. `src/model/resource.ts`

## 8. The Zova-native explanation

The most accurate Zova-native description is:

- `rest-resource` is a **generic resource page module**
- the page controllers are **schema-driven shells**
- `ModelResource` is the **selector-backed resource owner**
- generic Basic blocks are the **deeper list/form runtime consumers**

An approximate Vue-style translation would be:

- the module is not “one big page component with local hooks”
- it is closer to a route-driven controller shell that delegates into reusable runtime layers

That translation can help orientation, but the Zova meaning above is the authoritative one.

## 9. What to read next after this page

Choose the next page by the question you actually have.

### If the next question is about the owner model itself

Continue with:

- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)

### If the next question is about how to use the owner in your own business module

Continue with:

- [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)
- [Resource Model Cookbook](/frontend/model-resource-cookbook)
- [Resource Model Best Practices and Anti-Patterns](/frontend/model-resource-best-practices)

### If the next question is about resource list-page blocks and tables

Continue with:

- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)

### If the next question is about resource entry pages and forms

Continue with:

- [Form Guide](/frontend/form-guide)
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)

## Final takeaway

The fastest accurate way to read `rest-resource` is to stop treating it as only one model file.

Read it as four cooperating layers:

1. route surface
2. generated page wrappers
3. thin page-shell controllers
4. selector-backed resource owner with downstream Basic block consumers

Once you see those layers clearly, the module becomes much easier to extend, debug, and explain without flattening Zova back into ad hoc page-local CRUD code.
