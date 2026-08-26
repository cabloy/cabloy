# Resource List Page Deep Dive

This guide explains the runtime path of a resource list page in Zova through the current public Cabloy Basic source.

Use this page when you want to understand:

- how a `/rest/resource/:resource` route becomes a working list page
- where the thin `rest-resource` list shell stops
- how `basic-page:blockPage` takes over the deeper list runtime
- where `blockFilter`, `blockTable`, and `blockPager` fit into that runtime
- how `ZTable` and `ModelResource` cooperate under the list-page shell

## Why this page exists

Several existing docs already explain important parts of the story:

- [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch) explains the consumer-side handoff before the deeper runtime begins
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood) explains the module-level runtime bridge
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map) explains the shortest file path into the module
- [Table Guide](/frontend/table-guide) and [Zova Table Under the Hood](/frontend/zova-table-under-the-hood) explain the table runtime
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook) explains authoring-oriented CRUD assembly

What those pages do not isolate directly is the one cohesive list-page runtime path from route entry into the deeper Basic page and table runtime.

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. `rest-resource` declares the generic resource list route
2. a generated page wrapper binds that route to `ControllerPageResource`
3. `ControllerPageResource` is a thin shell that resolves the current `resource`, loads top-level schema state, and renders `schemaRow.rest.blocks`
4. those blocks usually enter `basic-page:blockPage`
5. `blockPage` becomes the deeper list runtime owner for filter state, paging state, query state, and resource-backed list data
6. `blockFilter`, `blockTable`, and `blockPager` are specialized consumers of that shared page runtime/context
7. `ZTable` is the final schema-driven table runtime endpoint under that list-page runtime

That means the resource list page is not one controller doing everything. It is a route shell plus downstream reusable list/runtime blocks.

This page focuses only on the list-page branch. For the broader module-level shell-to-runtime map shared by both list and entry pages, keep [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map) as the general reference.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts`
2. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/resource.ts`
3. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`
4. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`
5. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
6. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockFilter/controller.tsx`
7. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`
8. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPager/controller.tsx`
9. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`
10. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/render.tsx`

That order moves from public route surface, to route wrapper, to list shell, to resource owner, to deeper list runtime, and finally to the schema-driven table runtime endpoint.

## Runtime path by layer

### 1. Route list entry

The public route surface lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/routes.ts
```

The list route is:

- `:resource`

That already shows the public list-page contract:

- the route is generic
- runtime identity comes from `route.params.resource`
- the shared `tabKey(route)` keeps list and entry pages grouped under one resource-oriented workspace

### 2. Generated page wrapper

The list-page wrapper lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/.metadata/page/resource.ts
```

This file shows that the route enters runtime through the standard Zova page-controller path:

- `createZovaComponentPage(ControllerPageResource, ...)`

That means the list page still begins as a controller-oriented page surface, not as ad hoc local route code.

### 3. Thin `rest-resource` list shell

The list shell lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx
```

Its main jobs are:

- resolve the current selector-backed `ModelResource`
- ensure select API schemas are loaded
- read `schemaRow?.rest?.blocks`
- render those blocks through `ZovaJsx`

This is the first key architectural boundary:

- `ControllerPageResource` is a **thin list shell**
- it does not own the whole list runtime by itself

Its role is to interpret resource context, load top-level schema state, and let schema-defined blocks take over the deeper behavior.

### 4. `ModelResource` as the stable owner boundary

The owner model lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts
```

Its main jobs are:

- bootstrap the resource API path
- expose `permissions`
- expose schema surfaces such as `schemaFilter` and `schemaRow`
- expose `select(query)` for list data
- expose item/view/create/update/delete mutation/query helpers

This is the core owner boundary for the list page.

It is the stable resource-level runtime, even though the deeper list behavior is later assembled through Basic blocks.

### 5. `basic-page:blockPage` becomes the deeper list runtime owner

The most important current Basic list-runtime file is:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx
```

This controller becomes the deeper owner for:

- selector-backed `ModelResource`
- `queryFilterData`
- `queryPaged`
- computed `query`
- `select(this.query)` list data
- `schemaFilter`, `schemaRow`, and `permissions`
- the shared page JSX/render context (`$$page`)
- permission-driven table-meta refresh through `tableRef.refreshMeta()`

This is the second key architectural boundary:

- the route shell chooses the resource context
- `blockPage` owns the real list/runtime state after blocks are rendered

### 6. `blockFilter` consumes the shared list-page context

The filter block lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockFilter/controller.tsx
```

This block is a specialized consumer of the shared `$$page` runtime context.

Its role is to turn schema-driven filter UI into filter-state updates that flow back into the list-page query path.

That means filter state is not a separate unrelated subsystem. It is part of the shared list-page runtime owned by `blockPage`.

### 7. `blockTable` bridges the page runtime into `ZTable`

The table bridge lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx
```

This controller consumes `$$page` and passes the canonical page-owned values into `ZTable`, including:

- `data`
- `schemaRow`
- `tableScope`

It also captures the table controller ref back onto `$$page.tableRef`.

This is the clearest proof that `blockTable` is a bridge into table runtime, not the main owner of list state.

### 8. `blockPager` consumes paged state

The pager block lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPager/controller.tsx
```

Its role is to read paged state and delegate page changes back into the shared list-page runtime.

Like the filter and table blocks, it is another specialized consumer of the page runtime owned by `blockPage`.

### 9. `ZTable` is the schema-driven runtime endpoint

The deeper table endpoint lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx
zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/render.tsx
```

This table runtime:

- loads schema properties for table rendering
- computes table metadata and columns
- creates column renderers
- turns schema-driven row metadata into visible table output

This is the final endpoint under the list-page runtime chain.

## The shared handoff model

A useful rule is:

- the route shell resolves resource context
- schema-defined blocks choose which deeper list runtime pieces should appear
- `blockPage` becomes the shared host runtime owner
- `blockFilter`, `blockTable`, and `blockPager` are specialized consumers of that host-owned context
- `ZTable` is the final schema-driven render endpoint for rows and cells

That means the shared handoff is through `$$page`, not through scattered local page state.

## What this guide does not re-explain

This page does **not** fully re-explain:

- the internals of `ModelResource` ownership -> see [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- the internals of `ZTable` itself -> see [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- table authoring recipes -> see [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)

Its job is only to explain how the list-page runtime is assembled across route shell, resource owner, Basic blocks, and table runtime.

## Debugging checklist

If a resource list page behaves unexpectedly, ask:

1. is the route resolving the expected `resource`?
2. is `ControllerPageResource` loading the expected `schemaRow.rest.blocks`?
3. is the expected `basic-page:*` block actually present in the schema?
4. is `blockPage` resolving the expected `ModelResource` selector state?
5. is filter state flowing into `queryFilterData` as expected?
6. is pager state flowing into `queryPaged` as expected?
7. is `blockTable` receiving the expected `schemaRow`, `data`, and `permissions` scope?
8. is table meta stale because the permission-driven refresh path is not firing where expected?

## Where to read next

Use these next steps depending on your question:

- if you want the resource module bridge: [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- if you want the shortest source map: [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- if you want the owner internals behind this runtime: [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- if you want the narrower filter/query/select data path: [Filter to Query to Select Data Flow Guide](/frontend/filter-query-select-data-flow-guide)
- if you want the table runtime branch: [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- if you want row/bulk action visibility and permission gating: [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- if you want the entry-page counterpart: [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)

## Final takeaway

The most accurate way to read a resource list page in the current Basic frontend is:

- `rest-resource` list page is the thin route shell
- `ModelResource` is the stable owner boundary
- `basic-page:blockPage` owns the real list runtime
- `blockFilter`, `blockTable`, and `blockPager` consume the same shared page runtime context
- `ZTable` is the schema-driven runtime endpoint under that list-page chain

That is the source-confirmed list-page runtime path in the current Cabloy Basic frontend architecture.
