# Zova Table Controller Render Deep Dive

This page is a small lower-level supplement for the Zova Table runtime.

Use it when you already understand the broader table architecture and now want to inspect the controller micro-pipeline more precisely:

- how `ControllerTable` boots
- how visible columns and render functions are assembled
- how `tableCell` render providers are normalized and resolved
- how cell render preparation and transient-object handoff work

## Why this supplement exists

The existing table docs already cover the broad architecture well:

- [Table Guide](/frontend/table-guide)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)

What those pages do not isolate directly is the controller/render micro-pipeline inside `ControllerTable`.

That is the only gap this supplement fills.

## The shortest accurate mental model

A practical mental model is:

1. `BeanControllerTableBase.$useTable(...)` owns the TanStack bridge at controller level
2. `ControllerTable.__init__()` prepares schema properties, metadata, columns, and the table instance
3. `_createTableMeta()` decides which properties are visible and which render function each one should use
4. `_createColumnRender()` resolves either a `tableCell` bean-backed render path or a general render target
5. `cellRenderPrepare()` can preload nested bean-backed renders
6. `_cellRender()` / `_cellRenderInner()` hand off row/cell scope, fallback values, and transient `getValue(...)` state into final rendering

That means the controller micro-pipeline is where schema, visibility, bean resolution, and render contexts finally converge.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerTableBase.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-table/src/types/tableCell.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-table/src/types/tableColumn.ts`
5. `zova/packages-utils/zova-jsx/src/lib/zovaJsx.ts`
6. `zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx`

That order moves from the controller/TanStack bridge, to the main controller runtime, to the render contracts, to the JSX runtime handoff, and finally to a concrete `tableCell` specimen.

## `BeanControllerTableBase.$useTable(...)`

The TanStack bridge lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/lib/beanControllerTableBase.ts
```

The key source-confirmed behavior is:

- `useVueTable(...)` is called inside `instanceScope(...)`
- the returned table instance is `markRaw(...)`

This is the first important lower-level rule:

- the table instance is still controller-owned runtime
- TanStack is the underlying table engine, but the controller remains the effective Zova runtime owner

## `ControllerTable.__init__()` boot sequence

The main runtime file is:

```text
zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx
```

The source confirms this boot sequence:

1. register `$$table`
2. create the CEL environment and `ZovaJsx` instance
3. create schema-driven properties
4. refresh metadata
5. watch `schema` for meta refresh
6. create the TanStack table instance

That is the core controller-level assembly path.

## `_createTableMeta()` as visible-column/render assembly point

Inside the same controller, `_createTableMeta()` is the clearest metadata-assembly step.

It:

- iterates schema-derived properties
- builds column scope
- builds render context
- merges top-level column props
- checks visibility
- creates per-column render functions
- stores the surviving visible properties and render map in `tableMeta`

This is the most important micro-pipeline rule:

- schema properties do not automatically become rendered columns
- they are filtered and converted through controller-owned metadata assembly first

## `getRenderProvider()` normalization and `_createColumnRender()`

The render-resolution path also lives in `ControllerTable`.

It decides whether a column render should be treated as:

- text fallback
- a general render target
- a `tableCell` bean-backed renderer

`_createColumnRender()` is the main resolution point where:

- render provider is normalized
- bean-backed providers are resolved
- decorator options are merged
- visibility hooks such as `checkVisible(...)` can participate

This is the lower-level rule to remember:

- render resolution is not only “take whatever the schema says”
- the controller resolves and normalizes that render contract first

## `cellRenderPrepare()` and nested render preloading

`cellRenderPrepare()` is the preloading step for bean-backed renderers.

This matters most for nested or action-heavy cells, because it lets the controller prepare the concrete `tableCell` beans before final render.

A practical reading rule is:

- `cellRenderPrepare()` is part of render readiness, not only a cosmetic helper

A good current specimen is:

- `basic-table/src/bean/tableCell.actionOperationsRow.tsx`

because it prepares the nested row-action render set based on visibility.

## `_cellRender()` / `_cellRenderInner()` and transient value handoff

The final cell rendering path uses:

- column scope
- cell scope
- fallback value
- actual cell value
- transient `getValue(...)` handoff through `ZovaJsx`

This is where the lower-level scope handoff matters most.

The current runtime uses the `ZovaJsx` transient-object path so cell renderers can see the active value context while still staying inside the controller-driven runtime.

A practical reading rule is:

- the final cell render is not only a plain function call
- it is a scoped runtime handoff with controller-owned context

## Table-cell contract in types

The render contracts live in:

- `a-table/src/types/tableCell.ts`
- `a-table/src/types/tableColumn.ts`

These files confirm the lower-level boundary types for:

- `ITableCellRender`
- `checkVisible(...)`
- column scope vs cell scope
- render contexts passed into cell renderers

That makes them the right files to read when the runtime feels confusing even though the broad table docs are already understood.

## Concrete specimen: operations-row tableCell

A good concrete specimen is:

```text
zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx
```

This file is useful because it shows several lower-level pieces in one place:

- `checkVisible(...)`
- permission-based render filtering
- nested render preparation
- final action-row rendering through the table cell contract

So it is the best small specimen for understanding why the micro-pipeline matters in practice.

## What this page does not re-explain

This supplement does **not** fully re-explain:

- broad table authoring -> see [Table Guide](/frontend/table-guide)
- full runtime architecture -> see [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- general file-order map -> see [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)
- row/bulk permission semantics -> see [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)

Its job is only to explain the controller/render micro-pipeline.

## Where to read next

Use these next steps depending on your question:

- if you want the broad table runtime again, read [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- if you want the file-order map, read [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)
- if you want row/bulk visibility behavior, read [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- if you want the list-page runtime that feeds `ZTable`, read [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)

## Final takeaway

The most accurate way to read this lower-level table supplement is:

- `BeanControllerTableBase` owns the TanStack bridge at controller scope
- `ControllerTable` owns metadata assembly and render resolution
- `tableCell` beans participate through explicit controller-managed resolution and scope handoff
- `cellRenderPrepare()` and `_cellRender()` are part of the real runtime pipeline, not only helper details

That is the source-confirmed controller/render micro-pipeline in the current Cabloy Basic table runtime.
