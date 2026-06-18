# Zova Table Under the Hood

This guide explains the source-level runtime path behind Zova Table.

Use this page together with:

- [Table Guide](/frontend/table-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)
- [API Schema Guide](/frontend/api-schema-guide)
- [Bean Scene Authoring](/frontend/bean-scene-authoring)

Use this page after [Table Guide](/frontend/table-guide) when you want to move from the public authoring surface to the internal cooperation among table controllers, schema metadata, TanStack Table, `tableCell` beans, JSX/CEL scopes, and resource-page integration.

If your next question is not “how does this runtime work?” but “which files should I read next?”, continue with [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map).

> [!TIP]
> **Zova Table docs path**
> 1. **[Table Guide](/frontend/table-guide)** — learn the public authoring surface
> 2. **[Zova Table Under the Hood](/frontend/zova-table-under-the-hood)** — learn how the runtime pieces cooperate
> 3. **[Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)** — learn which files to read next
>
> **You are here:** step 2.
> **Previous page:** [Table Guide](/frontend/table-guide).
> **Next recommended page:** [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map).

## Why this page exists

The public table guide already explains the authoring surface:

- `ZTable`
- schema-driven columns
- `getColumns(...)`
- `tableCell` beans
- resource-page integration

What many contributors and AI workflows still want next is the implementation bridge:

- where the table controller is created
- where schema `table` metadata becomes visible columns
- where TanStack Table enters the runtime
- how a `tableCell` onion name becomes a bean instance
- how column and cell CEL/JSX scopes are prepared
- how resource page blocks feed data and permissions into the table runtime

This page is that bridge.

## The shortest accurate runtime model

For a typical Zova table, the shortest accurate model is:

1. the `ZTable` wrapper creates a table controller bean through the normal Zova controller path
2. the table controller loads table-scene schema properties from the row schema
3. the controller builds table metadata with visible properties and per-column render functions
4. the controller creates TanStack table options through Zova’s `$useTable(...)` wrapper
5. each cell render resolves either to text fallback, a general JSX render target, or a `tableCell` bean
6. the cell runtime evaluates JSX/CEL props with table-aware column and cell scope
7. resource pages feed schema, data, permissions, and page scope into the same table runtime through `basic-page:blockTable`

That is why Zova Table is not only a thin wrapper around TanStack Table. The business-facing runtime surface is still Zova-native.

## A concrete source specimen

The smallest public wrapper entry is:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/.metadata/component/table.ts
```

A business-facing consumer specimen is:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx
```

A representative `tableCell` bean specimen is:

```text
zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx
```

These three files already show the core architecture:

- the wrapper is thin
- the controller owns the runtime
- cell rendering is scene-driven rather than hard-coded in the page

## The core source-reading path

When you want to trace the full mechanism, read these files in order:

1. `zova/src/suite-vendor/a-zova/modules/a-table/src/.metadata/component/table.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerTableBase.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/render.tsx`
5. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-table/src/types/tableCell.ts`
7. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`
8. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`

A compact role map is:

- `table.ts` shows how the public wrapper enters `useController(...)`
- `component/table/controller.tsx` owns schema properties, metadata refresh, TanStack bridge, and cell rendering
- `beanControllerTableBase.ts` shows the Zova wrapper around `useVueTable(...)`
- `component/table/render.tsx` shows the default table DOM render path through `FlexRender`
- `schema.ts` shows how table-scene schema properties are loaded and ordered
- `types/tableCell.ts` shows the `tableCell` scene contract
- `blockTable/controller.tsx` shows how page blocks feed `data`, `schema`, and `tableScope` into `ZTable`
- `blockPage/controller.tsx` shows where resource data, permissions, and page scope come from

## Step-by-step runtime path

### 1. `ZTable` creates the table controller bean

The public wrapper enters the normal Zova controller path through:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/.metadata/component/table.ts
```

That wrapper calls `useController(ControllerTable, RenderTable, undefined)`.

A practical reading takeaway is:

- **the visible wrapper component is thin**
- **the controller bean is the real runtime owner**

That wrapper also exposes `controllerRef`, which means the public instance-reference pattern is still controller-oriented rather than DOM-ref-oriented.

## 2. The table controller owns schema properties, metadata, and render context

The main runtime owner is:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx
```

Inside `ControllerTable.__init__()` the controller:

- registers itself as `$$table`
- creates a column CEL environment
- creates a `ZovaJsx` instance bound to that CEL environment
- creates reactive `properties` from `this.$sdk.loadSchemaProperties(this.schema, 'table')`
- refreshes `tableMeta` and `columns`
- watches schema changes and refreshes metadata when needed
- creates the TanStack table instance

This is one of the most important source-level facts about Zova Table.

The table controller is not only coordinating rows. It is the central bridge among:

- table-scene schema metadata
- column and cell CEL/JSX scope
- TanStack table state
- `tableCell` bean-scene rendering

## 3. Why `$useTable(...)` exists

The shared wrapper lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerTableBase.ts
```

and the page-controller variant lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerPageTableBase.ts
```

The important runtime detail is that `$useTable(...)` wraps TanStack `useVueTable(...)` like this:

- run it inside `ctx.util.instanceScope(...)`
- then `markRaw(...)` the returned TanStack object

That matters because:

- Zova wants the controller bean to stay the business-facing runtime host
- the underlying TanStack table object still needs to be created in the correct Zova instance scope
- the raw TanStack API should not become the main architecture surface

A practical reading takeaway is:

- **Zova does not replace TanStack Table**
- **Zova relocates the business-facing ownership into controller beans**

## 4. How schema becomes visible columns

The default schema path starts in two places:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx
zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts
```

The important runtime path is:

1. the table receives `schema`
2. `_createProperties()` computes `this.$sdk.loadSchemaProperties(this.schema, 'table')`
3. `loadSchemaProperties(...)` resolves `$ref`, applies `rest.table` overlays, and sorts by `rest.order`
4. `_createTableMeta()` iterates those properties and decides visibility and render behavior
5. `_createColumnsMiddle()` converts the surviving properties into TanStack column definitions

A practical reading takeaway is:

- **schema is not only validation truth**
- **schema also drives table order, visibility, and cell render metadata**

## 5. How table metadata is built

The internal table metadata shape is:

- `properties`
- `renders`

For each property, `_createTableMeta()` does this work:

- create column scope with `getColumnScope(...)`
- create column render context with `getColumnJsxRenderContext(...)`
- compute top-level column options through `getColumnComponentPropsTop(...)`
- skip the column if `visible === false`
- create a render function through `_createColumnRender(...)`

That means a visible column is not only “one schema property plus one header”.

It is the result of a controller-owned pipeline that has already decided:

- whether the column exists
- which render provider it uses
- which column props belong to that provider

## 6. The default TanStack table options are still controller-owned

The actual TanStack table is created in `_createTable()`.

Important defaults include:

- `getRowId: row => row.id`
- `getCoreRowModel: getCoreRowModel()`
- `renderFallbackValue: this.scope.config.renderFallbackValue`
- `manualPagination: true`
- reactive `data` getter returning `self.data || []`
- reactive `columns` getter returning `self.columns`

A practical reading takeaway is:

- **TanStack owns the row-model mechanics**
- **the controller still owns which data and columns TanStack sees**

## 7. Column and cell render context are explicitly separated

The controller creates two related but distinct runtime contexts.

### Column context

`getColumnJsxRenderContext(...)` exposes:

- `$scene: 'tableColumn'`
- `$host: this`
- `$celScope`
- `$jsx`
- `$$table`

### Cell context

`getCellJsxRenderContext(...)` exposes:

- `$scene: 'tableCell'`
- `$host: this`
- `$celScope`
- `$jsx`
- `$$table`
- `cellContext`

This matters because column-level decisions and cell-level rendering do not have exactly the same information.

A practical reading takeaway is:

- **column configuration is prepared before one row value exists**
- **cell rendering gets the row-aware `CellContext` only when the cell is actually rendered**

## 8. How a `tableCell` onion name becomes a bean instance

The central method is:

```text
ControllerTable.getRenderProvider(...)
```

Its important behavior is:

- no render -> use `'text'`
- onion-like render string with `:` -> convert it with `beanFullNameFromOnionName(render, 'tableCell')`
- otherwise keep the render target as-is

Then `_createColumnRender(...)` can resolve that provider.

If the provider belongs to the `tableCell` bean scene, the controller:

- loads the bean instance through `this.sys.bean._getBean(...)`
- reads decorator options through `appResource.getBean(...)`
- merges onion options with column props via `deepExtend(...)`
- optionally calls `beanInstance.checkVisible(...)`

That means a cell bean is not only a render callback. It is a first-class scene resource with:

- bean resolution
- decorator options
- optional async visibility logic
- render-time `next()` composition

## 9. The cell render pipeline

The most useful durable mental model for one cell is:

```text
column metadata -> render provider resolution -> bean/decorator option merge -> cell scope -> JSX/CEL evaluation -> bean render or direct render
```

The core methods are:

- `cellRenderPrepare(...)`
- `cellRender(...)`
- `_cellRender(...)`
- `_cellRenderInner(...)`

Important behavior includes:

### Text fallback

If the render provider is `'text'`, the cell returns:

- the current value
- or `renderFallbackValue` when the value is nil or empty string

### Cell scope construction

If no explicit cell scope exists yet, the controller derives one from column scope plus:

- `value`
- `fallbackValue`

### Transient helper injection

`_cellRender(...)` uses `zovaJsx.setTransientObject(...)` so CEL/JSX evaluation can call `getValue(name)` against the current row.

### Bean-backed render path

When the render provider resolves to a `tableCell` bean:

- props are rendered through `zovaJsx.renderJsxProps(...)`
- `class` and `style` are normalized into controller-host CSS handling
- `beanInstance.render(...)` receives final options, render context, and `next()`

### General render path

When there is no bean instance, the controller falls back to `zovaJsx.render(...)`.

A practical reading takeaway is:

- **`tableCell` resources are part of a controller-prepared render pipeline**
- **the page does not manually wire row value extraction, CEL scope, and option merge each time**

## 10. What `tableCell` beans really are

The scene contract lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/types/tableCell.ts
zova/src/suite-vendor/a-zova/modules/a-table/src/lib/tableCell.ts
```

That contract defines:

- `ITableCellRender`
- `IDecoratorTableCellOptions`
- `NextTableCellRender`
- `SysOnion.tableCell`
- `ConfigOnions.tableCell`
- `IBeanSceneRecord.tableCell`

The decorator itself is:

```typescript
createBeanDecorator('tableCell', 'sys', true, options)
```

That means `tableCell` is not only a naming convention. It is a frontend bean scene with:

- system-scoped resolution behavior
- scene-level typing
- CLI boilerplate support
- metadata-driven resource identity

## 11. Representative `tableCell` patterns

Simple formatting cells such as:

- `basic-text:text`
- `basic-date:date`
- `basic-select:select`

usually implement a straightforward shape:

1. call `next()` to get the base value
2. format or map that value
3. optionally wrap it with a class-aware container

Row-action cells such as:

- `basic-table:actionOperationsRow`

show the more advanced pattern:

- `checkVisible(...)` filters actions by permission and preloads nested renders
- `render(...)` reuses `$$table.cellRender(...)` for each visible action

That is an important source-level clue:

- **one `tableCell` bean can itself orchestrate more table-cell renders**

## 12. The default DOM render still happens in a render bean

The default render bean lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/render.tsx
```

It does two important jobs:

- render the outer table markup with `<table class="table">`
- delegate header and cell vnode creation to TanStack `FlexRender`

If `slotDefault` is supplied, the render bean yields to that slot instead of the built-in table DOM.

That means automatic table rendering is not happening magically in the wrapper component. It is happening in the render bean.

A practical reading takeaway is:

- **the wrapper starts the controller path**
- **the render bean owns the default DOM shape**
- **the table controller still owns the cell render functions that `FlexRender` consumes**

## 13. Resource-page integration path

Zova Table is frequently consumed through Cabloy Basic resource pages.

The strongest specimens are:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx
```

### Page block path

`blockPage`:

- loads `ModelResource`
- creates page-level JSX/CEL environment
- computes resource query state
- exposes `data`, `schemaRow`, and `permissions`
- refreshes table metadata when permissions change

### Table block path

`blockTable`:

- renders `ZTable`
- passes `data={$$page.data}`
- passes `schema={$$page.schemaRow}`
- passes `tableScope={$$page.jsxCelScope}`
- captures `controllerRef` and stores `tableRef` back onto the page controller

This is one of the most important integration facts about the module.

The resource page does not manually rebuild the table runtime. It feeds page-owned resource state into the same reusable table controller.

## 14. Compact call-flow sketch

When in doubt, use this short call flow:

1. `ZTable` wrapper enters the normal Zova controller path
2. `ControllerTable.__init__()` creates CEL/JSX support and schema-driven properties
3. `refreshMeta()` computes visible table properties and per-column render functions
4. `_createTable()` creates the TanStack bridge through `$useTable(...)`
5. `RenderTable` renders headers and rows through `FlexRender`
6. each cell render resolves to text fallback, a general render target, or a `tableCell` bean
7. `tableCell` beans receive controller-prepared options, scope, and `next()`
8. resource pages prepare `data`, `schemaRow`, `permissions`, and `tableScope` before entering the same runtime

That is the shortest end-to-end explanation of how the module cooperates.

## Final takeaway

Zova Table is not just TanStack Table plus JSX wrappers.

It moves table ownership into:

- table controller beans
- schema metadata
- `tableCell` bean-scene resources
- controller-prepared CEL/JSX scope
- resource-page integration

TanStack Table is still the underlying row-model engine, but the business-facing runtime model is Zova-native.

## Verification checklist

When documenting or changing this area, verify in this order:

1. confirm the runtime claims against the current `a-table` source
2. confirm `tableCell` scene metadata and boilerplates still match current `package.json` and `cli/` wiring
3. confirm resource-page integration claims still match `blockPage` and `blockTable`
4. build the docs site:

   ```bash
   npm run docs:build
   ```

5. verify the page is reachable from the frontend sidebar and related table docs
