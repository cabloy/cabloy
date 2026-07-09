# Resource Entry Page Deep Dive

This guide explains the runtime path of a resource entry page in Zova through the current public Cabloy Basic source.

Use this page when you want to understand:

- how a `/rest/resource/...` entry route becomes a working entry page
- where the thin `rest-resource` page shell stops
- how `basic-pageentry` takes over the deeper entry runtime
- where `blockForm` and `blockToolbarRow` fit into that runtime
- how submit flow and page-meta updates connect back to the routed shell

## Why this page exists

Several existing docs already explain important parts of the story:

- [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch) explains the consumer-side handoff before the deeper runtime begins
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood) explains the module-level runtime bridge
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map) explains the shortest file path into the module
- [Form Guide](/frontend/form-guide) and [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) explain the form runtime
- [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide) explains the cross-layer `formScene -> formMeta -> pageMeta` chain

What those pages do not isolate directly is the one cohesive entry-page runtime path from route entry into the deeper Basic form/page runtime.

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. `rest-resource` declares generic resource entry routes
2. generated page wrappers bind those routes to `ControllerPageEntry`
3. `ControllerPageEntry` is a thin shell that resolves `resource`, `id`, and `formScene`
4. that shell derives `formMeta`, loads `formSchema`, and renders `formSchema.rest.blocks`
5. those blocks usually enter `basic-pageentry:blockPageEntry`
6. `blockPageEntry` becomes the deeper runtime owner for `ModelResource`, `formData`, submit flow, and page-meta updates
7. `blockForm` bridges into `ZForm`
8. `blockToolbarRow` renders the action row from the shared page-entry render context

That means the entry page is not “one big page controller that does everything.” It is a route-shell plus downstream reusable block runtime.

This page focuses only on the entry-page branch. For the broader module-level shell-to-runtime map shared by both list and entry pages, keep [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map) as the general reference.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts`
2. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/entry.ts`
3. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/index.ts`
5. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
6. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`
7. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`

That order moves from public route surface, to route wrapper, to resource entry shell, to Basic block registry, to the real entry-page runtime owner, then to the form bridge and action row.

## Runtime path by layer

### 1. Route entry

The public route surface lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts
```

The entry routes are:

- `:resource/create`
- `:resource/:id/:formScene?`

This already shows the public entry-page contract:

- resource identity comes from the route
- row identity comes from `id`
- scene can come explicitly from `formScene`, or later fall back by runtime rule

The shared `tabKey(route)` also shows that entry pages stay grouped under one resource-oriented workspace rather than creating a brand-new workspace per row.

### 2. Generated page wrapper

The route component wrapper lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/entry.ts
```

This file is thin but important.

It shows that the page does not enter runtime through ad hoc local setup code. Instead, it enters the standard Zova page-controller path through:

- `createZovaComponentPage(ControllerPageEntry, ...)`

That means the route entry is still controller-oriented from the beginning.

### 3. Thin `rest-resource` entry shell

The actual entry shell lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx
```

Its main jobs are:

- resolve `resource`
- resolve `entryId`
- resolve `formScene`
- derive `formMeta`
- resolve `formProvider`
- resolve `formSchema`
- ensure form API schemas are loaded
- render `formSchema?.rest?.blocks`

This is the first key architectural boundary:

- `ControllerPageEntry` is a **thin shell**
- it does not own the whole entry runtime by itself

Its role is to interpret route context, resolve resource/form schema state, and let schema-defined blocks take over the deeper behavior.

### 4. `basic-pageentry` block registry

The Basic block registry lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/.metadata/index.ts
```

This file shows the reusable entry-page runtime surface exported by the module:

- `basic-pageentry:blockPageEntry`
- `basic-pageentry:blockForm`
- `basic-pageentry:blockToolbarRow`

That matters because the deeper entry-page behavior is not hidden inside one giant page file.

It is split into reusable controller-backed blocks.

### 5. `blockPageEntry` becomes the deeper runtime owner

The most important current Basic file is:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
```

This is the deeper entry runtime owner.

Its main jobs are:

- resolve selector-backed `ModelResource`
- derive `formMeta` and `schemaScene`
- derive `formProvider`, `formSchema`, and `formData`
- prepare the shared JSX render context
- ensure view/query data is loaded
- own submit flow through `submitData(...)`
- update page meta through `setPageMeta(...)`
- expose `$$pageEntry` into the render context for downstream blocks

This is the second key architectural boundary:

- the route shell chooses the resource/scene context
- `blockPageEntry` owns the deeper entry-page runtime once blocks are rendered

### 6. `blockForm` bridges into `ZForm`

The form bridge lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx
```

This controller does not re-derive entry-page state.

Instead, it consumes `$$pageEntry` from the host render context and passes the canonical page-entry-owned values into `ZForm`, including:

- `data`
- `schema`
- `schemaScene`
- `formMeta`
- `formProvider`
- `formScope`
- submit callback
- change callback

This is the clearest source-confirmed proof that `blockForm` is a bridge, not the main owner of entry-page orchestration.

### 7. `blockToolbarRow` renders the action row

The action row lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx
```

Its role is to consume the same `$$pageEntry` render context and render action buttons based on:

- current permissions
- current `formScene`
- action render definitions

This is important because it shows that action visibility and entry-page state stay attached to the same host context, instead of being recomputed independently by unrelated components.

## The shared handoff model

A useful rule is:

- the route shell resolves context
- schema blocks choose which entry-page runtime pieces should appear
- `blockPageEntry` becomes the shared host runtime owner
- `blockForm` and `blockToolbarRow` are specialized consumers of that host-owned context

That means the shared handoff is through `$$pageEntry`, not through scattered local state.

## Submit flow and page-meta flow

The entry runtime also connects cleanly to the wider shell/task model.

Inside `blockPageEntry`:

- data loading initializes page state
- submit flow delegates to `ModelResource` mutation logic
- `setPageMeta(...)` updates the routed shell title / dirty / form-scene state

This is why the entry-page runtime should be read together with [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide) and [Page Meta Guide](/frontend/page-meta-guide).

## What this guide does not re-explain

This page does **not** fully re-explain:

- the internals of `ZForm` itself -> see [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- the full `formScene -> formMeta -> pageMeta` bridge -> see [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- the routed-shell host mechanics -> see [Router Tabs Mechanism](/frontend/router-tabs-mechanism)

Its job is only to explain how the entry page runtime is assembled across route shell, Basic blocks, and shared host context.

## Debugging checklist

If a resource entry page behaves unexpectedly, ask:

1. is the route resolving the expected `resource`, `id`, and `formScene`?
2. is `ControllerPageEntry` loading the expected `formSchema.rest.blocks`?
3. is the expected `basic-pageentry:*` block actually present in the schema?
4. is `blockPageEntry` resolving the expected `ModelResource` selector state?
5. is `blockForm` receiving the correct `schemaScene`, `formMeta`, and `formData`?
6. is `blockToolbarRow` consuming the expected `$$pageEntry` context?
7. is submit/page-meta flow failing in `blockPageEntry`, rather than in the outer route shell?

## Where to read next

Use these next steps depending on your question:

- if you want the resource module bridge: [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- if you want the shortest source map: [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- if you want the form runtime branch: [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- if you want the `formScene -> formMeta -> pageMeta` chain: [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- if you want action visibility rules: [Permission, formScene, and Action Visibility Guide](/frontend/permission-formscene-action-visibility-guide)

## Final takeaway

The most accurate way to read a resource entry page in the current Basic frontend is:

- `rest-resource` entry page is the thin route shell
- schema-defined blocks choose the deeper runtime pieces
- `basic-pageentry:blockPageEntry` owns the real entry runtime
- `blockForm` and `blockToolbarRow` consume the same shared host context
- submit flow and page-meta flow live in that deeper runtime layer

That is the source-confirmed entry-page runtime path in the current Cabloy Basic frontend architecture.
