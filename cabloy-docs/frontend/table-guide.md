# Table Guide

This guide explains how to build tables in Zova with a practical path from the public authoring surface to the most common extension points.

Zova Table is not only a thin JSX wrapper around TanStack Table. It is a Zova-native table layer built around:

- controller-oriented frontend architecture
- schema-driven column metadata
- TanStack Table as the row-model engine under a controller-owned runtime
- `tableCell` bean-scene render resources
- resource-page integration through `basic-page:blockPage` and `basic-page:blockTable`

Use this page together with:

- [Component Guide](/frontend/component-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [Bean Scene Authoring](/frontend/bean-scene-authoring)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)

> [!TIP]
> **Zova Table docs path**
>
> 1. **[Table Guide](/frontend/table-guide)** — learn the public authoring surface
> 2. **[Zova Table Under the Hood](/frontend/zova-table-under-the-hood)** — learn how the runtime pieces cooperate
> 3. **[Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)** — learn which files to read next
>
> **Companion cookbooks**
>
> - **[TableCell Authoring Cookbook](/frontend/table-cell-cookbook)** — concrete custom-cell and row-action patterns
> - **[Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)** — standard resource-page integration for filter, bulk actions, table, and pager
>
> **You are here:** step 1.
> **Next recommended page:** [Zova Table Under the Hood](/frontend/zova-table-under-the-hood).

If your next question is how these public APIs cooperate internally at runtime, continue with [Zova Table Under the Hood](/frontend/zova-table-under-the-hood).

## What you should learn first

If you only remember one idea, remember this one:

> In Zova, a table is centered on a table controller bean, while schema metadata and `tableCell` render resources decide which columns exist, which cells are visible, and how each cell is rendered.

That leads to three common authoring surfaces:

- `ZTable` — the root table component
- schema `rest.table` metadata — the default source of visibility, order, and render decisions
- `tableCell` beans — the main extension surface for reusable cell rendering

## One running example through this guide: Student list page

To keep the guide concrete, the examples below all use the same teaching resource:

- resource: `training-student:student`
- representative columns: `name`, `level`, `mobile`, and row operations
- common page shape: resource page with filter, table, and pager blocks

That Student thread is a good specimen because it grows through the same path most real business tables follow:

1. resource-driven list page
2. schema-driven default columns
3. field metadata pointing to built-in table-cell renderers
4. custom row-actions or business-specific cell beans only where needed

## Step 1: Choose the right table style

Before writing code, choose which of these three styles matches your page.

### Style A: schema-driven table

Use this when:

- the backend row schema already describes the list page well
- you want visible columns, order, and render metadata to come from schema-driven truth
- you want the shortest path to a working resource list page

### Style B: mixed table with custom columns

Use this when:

- most columns can come from schema metadata
- one or two columns need page-local structure such as operations or combined display
- you want to keep the built-in table runtime but customize the column list through `getColumns(...)`

### Style C: resource-driven page blocks

Use this when:

- the page is a standard resource list page
- filter, table, bulk toolbar, and pager should cooperate through the existing `basic-page` runtime
- permissions and schema refresh should be owned by the resource-page layer

A practical rule is:

- start with **resource-driven** for standard CRUD list pages
- use **schema-driven** when you want the smallest direct `ZTable` usage
- use **mixed** when one page needs custom columns without abandoning the built-in table runtime

## Step 2: Start with the smallest useful table

The smallest useful Zova table is usually a direct `ZTable` with row data and a row schema:

```tsx
<ZTable data={this.students} schema={this.schemaRow}></ZTable>
```

That already gives you the default runtime shape:

- the wrapper creates a table controller bean
- the controller loads table-scene schema properties
- the controller converts those properties into TanStack columns
- each visible column renders through either text fallback or a `tableCell` render resource

A practical reading takeaway is:

- **the visible wrapper component is thin**
- **the controller bean is the real runtime owner**

## Step 3: Let schema metadata drive the default columns

In the default path, `ZTable` reads table-scene metadata from the row schema.

The key table-facing metadata surface is the schema field `rest.table`, especially values such as:

- `order`
- `visible`
- `render`
- `columnProps`

A simplified mental model is:

```text
schema row -> load table properties -> sort by order -> filter by visible -> build columns -> render cells
```

That means the default list-page question becomes less:

- “which local column array should I hand-write first?”

and more:

- “which backend field metadata should own this column?”

This is why table work often belongs in the broader contract loop when the real source of truth is backend field metadata.

For the schema side of that contract, also see [API Schema Guide](/frontend/api-schema-guide).

## Step 4: Use built-in or custom `tableCell` render resources

A column render is usually chosen through schema metadata such as:

```typescript
render: 'basic-text:text';
```

or another `tableCell` resource such as:

- `basic-date:date`
- `basic-select:select`
- `basic-table:actionOperationsRow`

These render resources are not ordinary page-local callbacks. They are Zova bean-scene resources registered under the `tableCell` scene.

That matters because the table runtime can then:

- resolve the render resource through the bean system
- merge decorator options with column props
- ask the bean whether the cell should be visible
- run render-time JSX/CEL evaluation in the correct table and cell scope

A practical rule is:

- use built-in `tableCell` resources first
- add a custom `tableCell` bean only when the business UI really needs module-owned rendering behavior

## Step 5: Create a custom `tableCell` bean

When a built-in renderer is not enough, use the existing CLI-backed scene workflow.

Inspect the command first:

```bash
npm run zova :create:bean --help
```

Create a normal table-cell bean:

```bash
npm run zova :create:bean tableCell level -- --module=training-student
```

Create a row-actions variant:

```bash
npm run zova :create:bean tableCell actionOperationsRow -- --module=training-student --boilerplate=tableActionRow
```

The default generated shape is intentionally small:

```tsx
@TableCell<ITableCellOptionsLevel>()
export class TableCellLevel extends BeanBase implements ITableCellRender {
  render(
    _options: ITableCellOptionsLevel,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    return next();
  }
}
```

That scaffold is useful because it starts from the correct Zova scene contract:

- the bean is marked with `@TableCell(...)`
- the bean participates in the `tableCell` scene
- the bean receives controller-prepared render context
- `next()` already represents the cell’s underlying value or children path

For the broader scene system behind this decorator, see [Bean Scene Authoring](/frontend/bean-scene-authoring).

## Step 6: Add page-local custom columns with `getColumns(...)`

When most columns should stay schema-driven but one column should be page-local, use `getColumns(...)`.

A representative pattern is:

```tsx
<ZTable
  data={this.students}
  schema={this.schemaRow}
  getColumns={async (next, createColumnRender) => {
    const columns = await next();
    const operationsRender = await createColumnRender(
      'operations',
      'basic-table:actionOperationsRow',
    );
    if (operationsRender) {
      columns.push({
        id: 'operations',
        header: () => 'Operations',
        cell: props => operationsRender(props),
      });
    }
    return columns;
  }}
></ZTable>
```

The important design point is that `createColumnRender(...)` still routes through the table runtime.

That means your page-local column can still reuse:

- `tableCell` resource resolution
- column scope creation
- cell scope creation
- JSX/CEL evaluation
- `checkVisible(...)` handling

A practical caveat is:

- if the custom column key is not a real schema property, the render pipeline still works, but schema-derived property metadata for that key will be absent
- prefer a real schema-backed key when you want property-driven metadata such as `rest.table` behavior for that column

So a mixed table does **not** mean bypassing Zova. It means extending the existing runtime through its own hooks.

## Step 7: Use resource-driven page blocks for CRUD list pages

For standard resource pages, the more common public surface is not direct `ZTable` usage. It is the block-based page runtime:

- `basic-page:blockPage`
- `basic-page:blockFilter`
- `basic-page:blockTable`
- `basic-page:blockPager`

In that path:

1. the page block owns the resource model
2. the page block loads row schema, permissions, and paged data
3. the table block renders `ZTable`
4. the table controller derives columns from the same row schema

This gives you a cohesive CRUD path where:

- filter and pager reuse the same page state
- table refresh can react to permission changes
- the page can keep a `tableRef` to the controller instance through `controllerRef`

For the resource ownership side of that page shape, see [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern).

## Step 8: Know when to use `BeanControllerPageTableBase`

If your table belongs directly to a page controller rather than a reusable component controller, the page-oriented base class already exists:

- `BeanControllerPageTableBase`

It provides the same `$useTable(...)` TanStack bridge as the component-oriented base while staying aligned with page-controller architecture.

A practical rule is:

- use `ZTable` and its built-in controller when you only need the reusable component surface
- evaluate `BeanControllerPageTableBase` when the table runtime truly belongs inside a page-controller-owned workflow

## Common mistakes to avoid

### Mistake 1: Treating `ZTable` as only a Vue wrapper around TanStack Table

TanStack Table is still important, but the business-facing runtime is controller-owned and schema-aware.

### Mistake 2: Hand-writing every column before checking schema metadata

For many resource pages, the faster path is to let `rest.table` metadata describe the default columns first.

### Mistake 3: Bypassing `tableCell` beans for reusable cell behavior

If a renderer should be shared across pages or modules, prefer a `tableCell` resource over repeated page-local callbacks.

### Mistake 4: Treating `controllerRef` like a generic Vue DOM ref

`controllerRef` gives you the table controller instance, not a plain DOM element.

### Mistake 5: Rebuilding CRUD list wiring manually when `basic-page` already owns it

For standard resource pages, prefer the existing block/page runtime before hand-building a custom table flow.

## A practical authoring order

If you want the shortest accurate path to a real business table, use this order:

1. make sure the backend row schema is already the right contract truth
2. start with a resource page or direct `ZTable`
3. let schema metadata drive the default columns
4. reuse built-in `tableCell` renderers first
5. add page-local `getColumns(...)` only where needed
6. create custom `tableCell` beans only where the UI becomes business-specific
7. continue with [TableCell Authoring Cookbook](/frontend/table-cell-cookbook) when you want concrete patterns for custom cell beans and row actions
8. continue with [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook) when you want the standard resource-page integration path for filter, bulk actions, table, and pager
9. continue with [Zova Table Under the Hood](/frontend/zova-table-under-the-hood) when you want the runtime explanation behind the public authoring surface
10. continue with [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map) when you need framework-level source details and targeted file-order guidance

## Verification checklist

When documenting or changing a table workflow, verify in this order:

1. confirm the CLI command shape still exists:

   ```bash
   npm run zova :create:bean --help
   ```

2. confirm the `tableCell` scene metadata still exists in the current `a-table` module
3. confirm the runtime claims against the current `a-table`, `basic-table`, and `basic-page` source
4. if you changed docs, build the docs site:

   ```bash
   npm run docs:build
   ```

## Final takeaway

Zova Table is not only a column array plus JSX.

It moves table ownership into:

- table controller beans
- schema-driven column metadata
- `tableCell` bean-scene render resources
- resource-page integration

TanStack Table is still the underlying row-model engine, but the business-facing runtime model is Zova-native.
