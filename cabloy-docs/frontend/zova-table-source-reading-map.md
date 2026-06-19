# Zova Table Source Reading Map

This page is a practical map for contributors and AI workflows that need to read Zova Table source code efficiently.

Use this page after [Zova Table Under the Hood](/frontend/zova-table-under-the-hood) when your next question is not the runtime model itself, but which files to read first for a specific table-internals topic.

It answers a narrow question:

> when I need to understand how Zova Table works internally, which files should I read first, and in what order?

Use this page together with:

- [Table Guide](/frontend/table-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Zova Table Controller Render Deep Dive](/frontend/zova-table-controller-render-supplement)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)
- [Bean Scene Authoring](/frontend/bean-scene-authoring)
- [API Schema Guide](/frontend/api-schema-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)

> [!TIP]
> **Zova Table docs path**
>
> 1. **[Table Guide](/frontend/table-guide)** — learn the public authoring surface
> 2. **[Zova Table Under the Hood](/frontend/zova-table-under-the-hood)** — learn how the runtime pieces cooperate
> 3. **[Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)** — learn which files to read next
>
> **You are here:** step 3.
> **Previous page:** [Zova Table Under the Hood](/frontend/zova-table-under-the-hood).

## Why this page exists

The `a-table` module sits at the intersection of several Zova concerns at once:

- controller-oriented component design
- schema-driven column metadata
- TanStack Table integration
- bean-scene-based cell rendering
- resource-page integration through `basic-page`

This page exists for one narrow job:

- [Table Guide](/frontend/table-guide) explains how to author tables
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood) explains how the runtime pieces cooperate
- this page gives the shortest file-order paths for specific table questions

## How to use this page

For each topic below:

1. start with the public guide to refresh the architectural intent
2. read the first source file to identify the public surface
3. continue into the next runtime file only if you still need the implementation detail
4. stop as soon as you have enough information for the task

The goal is not to read the entire table stack every time. The goal is to choose the shortest correct path.

## 1. Public table surface and wrapper entrypoints

Use this path when you are asking questions like:

- what is the public Zova Table surface?
- where does `ZTable` enter the runtime?
- how does `controllerRef` reach the controller instance?

### Read the docs first

- [Table Guide](/frontend/table-guide)
- [Component Guide](/frontend/component-guide)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-table/src/.metadata/component/table.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/render.tsx`
4. `zova/packages-zova/zova-core/src/composables/useController.ts`

### What each file clarifies

- metadata wrapper files show how the public component wrapper enters `useController(...)`
- `table.ts` exposes `ZTable` and its typed controller-facing props surface
- `controller.tsx` shows the table runtime owner
- `render.tsx` shows the default DOM render path
- `useController.ts` shows how the controller instance is created and bound to the wrapper lifecycle

## 2. Table controller ownership and TanStack bridge

Use this path when you are asking questions like:

- where is the TanStack table instance created?
- where do `columns` and `tableMeta` come from?
- why does the table runtime live in a controller bean?

### Read the docs first

- [Table Guide](/frontend/table-guide)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerTableBase.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerPageTableBase.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-table/src/types/table.ts`

### What each file clarifies

- `component/table/controller.tsx` is the main table runtime owner
- `beanControllerTableBase.ts` shows the shared `$useTable(...)` wrapper around TanStack `useVueTable(...)`
- `beanControllerPageTableBase.ts` shows the page-controller-oriented variant
- `types/table.ts` shows the exposed type contracts for table, columns, metadata, and `getColumns(...)`

## 3. Schema-driven columns and metadata overlays

Use this path when you are asking questions like:

- how does a row schema become visible columns?
- where do `visible`, `order`, `render`, and `columnProps` come from?
- how does the table scene differ from form or filter scenes?

### Read the docs first

- [Table Guide](/frontend/table-guide)
- [API Schema Guide](/frontend/api-schema-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/rest.ts`

### What each file clarifies

- `controller.tsx` shows `_createProperties()`, `_createTableMeta()`, and `_createColumnsMiddle()`
- `schema.ts` shows `loadSchemaProperties(...)`, `$ref` resolution, and scene-specific `rest` overlays
- `rest.ts` shows the schema extension contract, including `rest.table` and table-related render types

## 4. `tableCell` bean-scene contract and decorator surface

Use this path when you are asking questions like:

- what exactly is a `tableCell` bean?
- where does `@TableCell(...)` come from?
- how is the scene registered for metadata and typing?

### Read the docs first

- [Bean Scene Authoring](/frontend/bean-scene-authoring)
- [Table Guide](/frontend/table-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-table/src/lib/tableCell.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-table/src/types/tableCell.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-table/package.json`
4. `zova/src/suite-vendor/a-zova/modules/a-table/cli/tableCell/boilerplate/{{sceneName}}.{{beanName}}.tsx_`
5. `zova/src/suite-vendor/a-zova/modules/a-table/cli/tableActionRow/boilerplate/{{sceneName}}.{{beanName}}.tsx_`

### What each file clarifies

- `tableCell.ts` shows the decorator definition
- `types/tableCell.ts` shows the runtime contract, scene typing, and `NextTableCellRender`
- `package.json` shows `zovaModule.onions.tableCell` and boilerplate metadata
- the boilerplate files show the intended scaffold shape for normal cells and row-action cells

## 5. Cell render pipeline and CEL/JSX scope

Use this path when you are asking questions like:

- how does one column render become one real cell vnode?
- where do `getValue(...)` and cell scope come from?
- how are JSX props evaluated for a cell bean?

### Read the docs first

- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-table/src/types/tableColumn.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-table/src/types/tableCell.ts`

### What each file clarifies

- `controller.tsx` shows `getColumnJsxRenderContext(...)`, `getCellJsxRenderContext(...)`, `cellRenderPrepare(...)`, `cellRender(...)`, and `_cellRenderInner(...)`
- `tableColumn.ts` shows column scope, cell scope, and table column render types
- `tableCell.ts` shows the render-context contract received by a `tableCell` bean

## 6. Representative built-in cell renderers

Use this path when you are asking questions like:

- what does a simple formatter-style table cell look like?
- what does a row-action cell look like?
- how should I design my own custom table cell?

### Read the docs first

- [Table Guide](/frontend/table-guide)
- [Bean Scene Authoring](/frontend/bean-scene-authoring)

### Then read source in this order

1. `zova/src/suite/cabloy-basic/modules/basic-text/src/bean/tableCell.text.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-date/src/bean/tableCell.date.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-select/src/bean/tableCell.select.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx`

### What each file clarifies

- `tableCell.text.tsx` shows the minimal pass-through plus optional wrapper pattern
- `tableCell.date.tsx` shows formatting around `next()`
- `tableCell.select.tsx` shows value-to-item mapping
- `actionOperationsRow.tsx` shows advanced visibility checks, nested action rendering, and permission-aware orchestration

## 7. Custom columns through `getColumns(...)`

Use this path when you are asking questions like:

- how should I add one page-local operations column?
- how can I reuse the existing cell-render pipeline from custom columns?
- where is `createColumnRender(...)` defined?

### Read the docs first

- [Table Guide](/frontend/table-guide)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-table/src/types/table.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-table/src/component/table/render.tsx`

### What each file clarifies

- `types/table.ts` shows `TypeTableGetColumns` and `TypeTableCreateColumnRender`
- `controller.tsx` shows how custom columns are given `next(...)`, `createColumnRender(...)`, and the table controller itself
- `basic-table/render.tsx` shows a module-level consumer wrapping `ZTable` rather than replacing its runtime

## 8. Resource-page integration

Use this path when you are asking questions like:

- how does a resource list page feed schema and data into `ZTable`?
- where do `data`, `schemaRow`, and `tableScope` come from?
- where should permission-sensitive table refresh be debugged?

### Read the docs first

- [Table Guide](/frontend/table-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)

### Then read source in this order

1. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`
3. `vona/src/suite-vendor/a-test/modules/test-rest/src/dto/productSelectResItem.tsx`

### What each file clarifies

- `blockPage/controller.tsx` shows resource ownership, query state, page CEL scope, permissions, and table refresh integration
- `blockTable/controller.tsx` shows the direct bridge from page block to `ZTable`
- the Vona DTO specimen shows the block-based page composition consumed from backend-owned metadata

## 9. Representative specimens to read before editing the framework

Use this section when you want one small example before reading framework internals.

### Read these specimens first

1. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-text/src/bean/tableCell.text.tsx`

### Why these three specimens matter

- `blockTable` shows the public integration path from a page into `ZTable`
- `actionOperationsRow` shows the advanced `tableCell` orchestration path
- `tableCell.text` shows the smallest custom-cell authoring shape

Together they give you the public integration, the advanced cell path, and the minimal cell path before you descend into the whole table runtime.

## 10. A compact reading strategy

When in doubt, use this order:

1. [Table Guide](/frontend/table-guide)
2. one real usage specimen such as `blockTable`
3. the public wrapper metadata under `src/.metadata/component/table.ts`
4. `component/table/controller.tsx`
5. `lib/beanControllerTableBase.ts`
6. `types/tableCell.ts` and representative cell beans only if you still need more detail

That order usually gets you to the answer faster than starting from the deepest runtime files first.

## 11. Final takeaway

The fastest way to read Zova Table accurately is not to memorize every file in `a-table`.

It is to recognize which question you are asking:

- wrapper-entry question
- controller-runtime question
- schema-column question
- `tableCell` scene question
- cell-render question
- resource-page integration question

Then start from the smallest public file that matches that question and only descend into deeper runtime files as needed.
