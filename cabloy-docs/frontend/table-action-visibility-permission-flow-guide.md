# Table Action Visibility and Permission Flow Guide

This guide explains how row and bulk action visibility works in current Cabloy Basic list pages.

Use this page when you want to understand:

- why a row action is visible or hidden
- why a bulk action is visible or hidden
- where table action permissions come from
- how row action and bulk action visibility differ
- how the list-page action path differs from the entry-page `formScene`-aware path

## Why this page exists

Several existing docs already explain nearby pieces:

- [Table Guide](/frontend/table-guide) and [Zova Table Under the Hood](/frontend/zova-table-under-the-hood) explain table runtime and rendering
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) explains `ModelResource` as the owner of permissions and schema
- [Permission, formScene, and Action Visibility Guide](/frontend/permission-formscene-action-visibility-guide) explains the entry-page scene-aware action path

What those pages do not isolate directly is the list-page row/bulk action visibility path.

That is the gap this page fills.

In the current Basic source, list-page row and bulk action visibility are permission-driven, but they do not add the entry-page `formScene` prefilter layer.

## The shortest accurate mental model

A practical mental model is:

1. `ModelResource.permissions` is the permission source for the current resource
2. `blockPage` publishes those permissions into the page render scope
3. `blockTable` passes that scope into `ZTable`
4. row action visibility is decided in the table-cell operations-row renderer through `$passport.checkPermission(...)`
5. bulk action visibility is decided in the bulk-toolbar block through `$passport.checkPermission(...)`
6. row and bulk list-page flows do not add the entry-page `formScene` visibility prefilter

That means current list-page action visibility is a permission-gating problem first, not a form-scene filtering problem.

## What this guide is not

This page is not a general permission guide for all frontend action surfaces.

It is specifically about current **list-page** action visibility.

It is also not a page-entry action guide. If your question is about entry-page scene-aware toolbar actions, read [Permission, formScene, and Action Visibility Guide](/frontend/permission-formscene-action-visibility-guide).

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockToolbarBulk/controller.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx`
5. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/permissions.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableActionRow.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableActionBulk.ts`
8. optional contrast: `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`

That order moves from permission source/context exposure, to row/bulk consumers, to permission-hint type contracts, and finally to the entry-page contrast.

## Visibility flow by surface

### 1. Permission source: `ModelResource.permissions`

The list-page permission source lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts
```

The current source confirms:

- `permissions` is computed from `this.$sdk.getPermissions(this.resource).data`

That means action visibility in list pages is grounded in resource-owned permissions, not in ad hoc page-local permission state.

### 2. `blockPage` exposes permissions into page scope

The deeper list runtime lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx
```

This controller exposes `permissions` through the shared page CEL/render scope.

That matters because downstream blocks and table renders do not fetch permissions independently. They consume the permission surface prepared by the page runtime.

### 3. `blockTable` passes page scope into `ZTable`

The table bridge lives in:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx
```

This bridge passes:

- `data`
- `schemaRow`
- `tableScope`

into `ZTable`.

That means table-cell action visibility runs inside a render scope that already contains the page/resource permission surface.

## Row action visibility

### 4. Row actions are filtered in the operations-row cell bean

The key row-action file is:

```text
zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx
```

This bean handles row action visibility in two related phases:

- `checkVisible(...)`
- `render(...)`

#### `checkVisible(...)`

The cell bean:

- iterates configured actions
- calls `$passport.checkPermission(permissions, actionName, permissionHint)` for each one
- collects only visible render providers
- prepares those renders in advance
- returns visible only if at least one action survives

This means the row-action container itself can disappear when no actions remain visible.

#### `render(...)`

At render time, the bean again filters actions with:

- `$passport.checkPermission(permissions, actionName, permissionHint)`

Only surviving actions are rendered into the row action container.

This is the clearest source-confirmed row-action rule:

- row action visibility is permission-driven
- it is resolved in the table-cell operations-row bean

## Bulk action visibility

### 5. Bulk actions are filtered in the bulk-toolbar block

The key bulk-action file is:

```text
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockToolbarBulk/controller.tsx
```

This block:

- iterates configured bulk actions
- reads `action.options?.permission`
- calls `$passport.checkPermission(this.permissions, actionName, permissionHint)`
- renders only the permitted actions

This is the clearest source-confirmed bulk-action rule:

- bulk action visibility is permission-driven
- it is resolved in the bulk-toolbar block

## Row action hints vs bulk action hints

The permission hint contracts live in:

```text
zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/permissions.ts
zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableActionRow.ts
zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableActionBulk.ts
```

The important source-confirmed difference is:

- `IPermissionHintTableActionRow` can carry row-style permission hint fields such as `formScene`
- `IPermissionHintTableActionBulk` does not carry `formScene`

This is a type-contract distinction, not only a docs convention.

## What row and bulk actions do not do in current list pages

A common confusion is to assume that because entry-page actions can use `formScene`, table row or bulk actions automatically use the same scene-aware filter.

That is **not** the current list-page rule.

In current Basic list pages:

- row and bulk action visibility rely on permission gating
- they do not add the entry-page `formScene` prefilter path

So even if some row-style hint types can carry `formScene`, the current list-page row/bulk runtime path documented here should be read as permission-gating first.

## Contrast with the entry-page action path

A useful contrast file is:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx
```

That entry-page action row:

- checks `permissionHint.formScene` first against `$$pageEntry.formMeta.formScene`
- then calls `$passport.checkPermission(...)`

That is a different rule from current list-page row/bulk visibility.

So the practical split is:

- **entry-page toolbar** = scene-aware visibility prefilter + permission check
- **list-page row/bulk actions** = permission check path only

## What bulk actions can and cannot express today

Current public Basic source supports this rule clearly:

- bulk actions can express permission hints through `IPermissionHintTableActionBulk`
- bulk actions do not currently carry `formScene`
- bulk visibility should therefore not be documented as scene-aware unless the type/runtime contract changes

This is the safest public rule to teach.

## Debugging checklist

If a list-page action is missing unexpectedly, ask:

1. does `ModelResource.permissions` contain the expected action grant?
2. is the page/table render scope exposing the expected `permissions`?
3. is the action name correct for the configured renderer/action?
4. is the permission hint aligned with the intended action semantics?
5. for row actions, is the operations-row cell bean actually resolving a visible renderer set?
6. for bulk actions, is the bulk toolbar reading the expected action config?
7. are you accidentally expecting entry-page `formScene` behavior in a list-page action surface?

## Where to read next

Use these next steps depending on your question:

- if you want the list-page runtime path that hosts these actions, read [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- if you want the entry-page scene-aware action path, read [Permission, formScene, and Action Visibility Guide](/frontend/permission-formscene-action-visibility-guide)
- if you want the broader resource-owner permission surface, read [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- if you want table runtime internals, read [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)

## Final takeaway

The most accurate current Basic rule for list-page actions is:

- `ModelResource.permissions` is the permission source
- row action visibility is resolved in `tableCell.actionOperationsRow.tsx`
- bulk action visibility is resolved in `blockToolbarBulk/controller.tsx`
- both use `$passport.checkPermission(...)`
- current list-page row/bulk flows do **not** add the entry-page `formScene` prefilter
- bulk action hints do not carry `formScene`

That is the source-confirmed `table row / bulk action visibility` path in the current Cabloy Basic frontend architecture.
