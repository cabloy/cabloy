# Filter to Query to Select Data Flow Guide

This guide explains the list-page data path from filter UI into query state, then into `ModelResource.select(query)`, and finally into table and pager state in Zova.

Use this page when you want to understand:

- how filter UI changes become list-page query state
- how paging state joins that query
- how the final query reaches `ModelResource.select(query)`
- how the resulting paged/list data is consumed by table and pager
- where permission-driven table-meta refresh sits relative to that data flow

## Why this page exists

Several existing docs already explain nearby pieces:

- [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive) explains the broader list-page runtime assembly
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood) explains the module-level bridge
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook) explains practical authoring for CRUD list pages

What those pages do not isolate directly is the one compact data-flow path from filter UI into the owner-side query execution boundary.

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. `blockFilter` normalizes user-entered filter values
2. `blockPage` stores those values in `queryFilterData`
3. `blockPage` also owns paging state in `queryPaged`
4. `blockPage` computes one merged `query`
5. `ModelResource.select(query)` becomes the owner-side query execution boundary
6. the select result provides both `list` and paged metadata
7. `blockTable` consumes the list data
8. `blockPager` consumes the paged metadata

That means the list-page fetch path is not scattered across table, pager, and filter. It is centralized in the page runtime and then handed to the owner.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockFilter/controller.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPager/controller.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`
5. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`

That order moves from the page-owned state source, to filter and pager inputs, to the table bridge, and finally to the owner-side query execution path.

## Runtime path by layer

### 1. Filter UI becomes `queryFilterData`

The filter bridge lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockFilter/controller.tsx
```

This block renders `ZForm` with:

- `data={$$page.queryFilterData}`
- `schema={$$page.schemaFilter}`
- `schemaScene="filter"`

Its submit and reset flow both pass through `_onFilter(dataOld)`.

The important source-confirmed behavior is:

- nil and empty-string values are removed
- the normalized object is passed to `$$page.onFilter(dataNew)`

This is the first key rule:

- `blockFilter` does not fetch directly
- it normalizes filter values and pushes them into page-owned state

### 2. Paging state becomes `queryPaged`

The page runtime owner lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx
```

Inside `__init__()`, it initializes:

- `queryFilterData = {}`
- `queryPaged = { pageNo: 1, pageSize: this.$props.pageSize }`

It also owns:

- `gotoPage(pageNo)`
- `setPageSize(pageSize)`

That means paging is page-owned runtime state, not something the pager block owns independently.

### 3. `query` is the canonical merged state

The same `blockPage` controller computes:

```typescript
this.query = this.$computed(() => {
  return Object.assign({}, this.queryFilterData, this.queryPaged);
});
```

This is the canonical query object for the list page.

A practical reading rule is:

- filter state and paging state stay separate while they are being edited
- `query` is the merged runtime shape passed into the owner

### 4. `ModelResource.select(query)` is the owner-side query boundary

The owner-side boundary lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts
```

`blockPage` uses:

```typescript
get queryData() {
  return this.$$modelResource.select(this.query);
}
```

Inside the owner:

- `select(query?)` delegates to `selectGeneral(undefined, query)`
- `selectGeneral(...)` creates a query key shaped like:
  - `['select', actionPath ?? '', hashkey(query)]`
- it fetches the list result from the resolved `resourceApi`

This is the second key rule:

- pages assemble query state
- `ModelResource` owns query execution, query-key identity, and fetch semantics

### 5. The select result becomes both `data` and `paged`

Back in `blockPage`, two important derived surfaces are exposed:

- `data = queryData.data?.list`
- `paged = queryData.data`

This matters because the select result is not only a list.

It is the paged result surface that both table and pager depend on.

### 6. `blockTable` consumes list data

The table bridge lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx
```

It consumes the shared page runtime and passes into `ZTable`:

- `data={$$page.data}`
- `schema={$$page.schemaRow}`
- `tableScope={$$page.jsxCelScope}`

That means `blockTable` is not the owner of the fetch path.

It is the bridge from page-owned list result into the table runtime.

### 7. `blockPager` consumes paged metadata

The pager block lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPager/controller.tsx
```

It reads:

- `$$page.paged`

and delegates navigation back into page-owned state with:

- `$$page.gotoPage(...)`

This is the third key rule:

- the pager does not fetch directly
- it mutates page-owned paging state and lets the central query path react

## Permission-driven table-meta refresh is adjacent, not the data path itself

`blockPage` also watches:

- `permissions`

and refreshes table meta when permission state changes.

That behavior is important, but it is not the same thing as the filter/query/select data path.

A practical rule is:

- filter/paging changes affect query identity and data fetches
- permission changes affect table metadata and visible action/column behavior

Those are related, but distinct, flows.

## A compact end-to-end trace

The shortest end-to-end trace is:

- filter UI normalizes user input
- `queryFilterData` changes
- `queryPaged` changes when navigation changes page
- `query = { ...queryFilterData, ...queryPaged }`
- `queryData = $$modelResource.select(query)`
- `data = queryData.data?.list`
- `paged = queryData.data`
- table consumes `data`
- pager consumes `paged`

That is the source-confirmed filter -> query -> select data path in the current Basic list-page runtime.

## Debugging checklist

If list data looks wrong, ask:

1. did `blockFilter` normalize away a field unexpectedly?
2. did `queryFilterData` actually change?
3. did `queryPaged` change as expected?
4. does the merged `query` contain the expected fields?
5. did `ModelResource.select(query)` create the expected query-key identity?
6. is `queryData.data?.list` populated as expected?
7. is `paged` present and consistent with the list result?
8. is the issue really data flow, or is it permission-driven table-meta refresh instead?

## Where to read next

Use these next steps depending on your question:

- if you want the broader list-page runtime assembly, read [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- if you want the owner internals behind `select(query)`, read [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- if you want practical CRUD authoring guidance, read [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- if you want row/bulk action visibility, read [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)

## Final takeaway

The most accurate way to read the current Basic list-page data path is:

- `blockFilter` owns filter normalization
- `blockPage` owns query state assembly
- `ModelResource.select(query)` owns owner-side query execution
- `data` and `paged` are the shared outputs
- table and pager consume those outputs instead of owning the fetch logic

That is the source-confirmed `filter -> query -> select` runtime path in the current Cabloy Basic frontend architecture.
