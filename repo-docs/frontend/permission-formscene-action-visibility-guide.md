# Permission, formScene, and Action Visibility Guide

This guide explains how action visibility works in current Cabloy Basic entry pages when `formScene` participates in the decision.

Use this page when you want to understand:

- how `permissionHint.formScene` works
- how it interacts with `$$pageEntry.formMeta.formScene`
- how that differs from `$passport.checkPermission(...)`
- why some actions can be scene-gated while others cannot
- why bulk actions do not currently support `formScene`

## Why this page exists

Several existing docs already explain nearby pieces:

- [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide) explains how `formScene` becomes `formMeta`, then `pageMeta`
- [Page Meta Guide](/frontend/page-meta-guide) explains shell/task presentation
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) and related resource-model docs explain permissions as part of resource ownership

What those pages do not isolate directly is the specific runtime rule for entry-page action visibility.

That is the gap this page fills.

In the current Basic source, `formScene` participates in action visibility as a **UI visibility filter** layered in front of the normal permission authorization check.

## The shortest accurate mental model

A practical mental model is:

1. page-entry runtime decides the current `formScene`
2. `formMetaFromFormScene(...)` derives `formMeta`
3. `$$pageEntry.formMeta.formScene` becomes the current scene surface for entry-page blocks
4. `blockToolbarRow` reads `permissionHint.formScene`
5. if the current scene does not match, the action is hidden immediately
6. if the scene matches, `$passport.checkPermission(...)` still decides whether the action is allowed by permission rules
7. the action renders only if both checks pass

That means `formScene` is not itself a permission engine. It is a scene-aware visibility prefilter.

## What this guide is not

This page is not a general permission guide for every frontend action surface.

It is specifically about the current **entry-page** action visibility flow.

It is also not a guide to page-meta propagation. `pageMeta.formMeta` is part of the surrounding story, but the actual visibility authority for entry-page actions is the local page-entry runtime context.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/utils.ts`
2. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`
4. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/permissions.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/formActionRow.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableActionRow.ts`
7. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/tableActionBulk.ts`
8. optional comparison: `zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx`

That order moves from scene/meta translation, to page-entry runtime ownership, to action-row filtering, to permission-hint typing, and finally to the bulk-action limitation and row-action comparison.

## Visibility flow step by step

### 1. `formScene` becomes canonical runtime metadata

The canonical helper lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/lib/utils.ts
```

The current source confirms:

- `view` -> `formMode: 'view'`
- `create` -> `formMode: 'edit', editMode: 'create'`
- `edit` -> `formMode: 'edit', editMode: 'update'`

This matters because action visibility does not read an arbitrary raw string from anywhere in the app. It reads the current page-entry scene after that scene has already become part of the page-entry runtime metadata.

### 2. `blockPageEntry` exposes the current scene through `$$pageEntry`

The key entry-page runtime file is:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
```

This controller:

- resolves `formScene`
- computes `formMeta`
- builds the shared JSX render context
- exposes `$$pageEntry` into that context

That is the key boundary for action visibility:

- entry-page actions do not need to rediscover the current scene
- they can read it from `$$pageEntry.formMeta.formScene`

## 3. `blockToolbarRow` checks scene first, then permission

The most important source file for this guide is:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx
```

Its action loop does two different checks:

1. `_checkFormScene(permissionHint)`
2. `$passport.checkPermission(...)`

The order matters.

### Scene prefilter

`_checkFormScene(...)`:

- reads `$$pageEntry.formMeta.formScene`
- reads `permissionHint?.formScene`
- accepts a single scene or an array of scenes
- treats no `formScene` hint as “all scenes”

If the scene does not match, the action does not continue into the permission check.

### Authorization check

Only after the scene passes does the controller call:

- `$passport.checkPermission(this.permissions, actionName, permissionHint)`

This is the critical source-confirmed distinction:

- **scene filtering** decides whether this action should even be considered in the current page-entry scene
- **permission checking** decides whether the user is allowed to perform it

## 4. What `permissionHint.formScene` really means

`permissionHint.formScene` should be read as:

- a UI visibility filter tied to the current page-entry scene

It should **not** be read as:

- a replacement for permission authorization
- a generic global permission-engine rule
- a page-meta-driven shell rule

A practical reading rule is:

- if the scene is wrong, hide the action
- if the scene is right, still run the real permission check

## 5. What the permission types confirm

The permission hint types live in:

```text
zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/permissions.ts
```

The important source-confirmed detail is:

- `IPermissionHintGeneral` can carry `formScene`
- `IPermissionHintTableActionRow` can carry `formScene`
- `IPermissionHintTableActionBulk` does **not** carry `formScene`

This matches the current runtime split:

- entry-page row/form action visibility can be scene-aware
- bulk-action visibility is not scene-aware in the same way today

## 6. Row/form action types vs bulk action types

The row/form action option types live in:

- `a-openapi/src/types/resource/formActionRow.ts`
- `a-openapi/src/types/resource/tableActionRow.ts`

They both use `permission?: IPermissionHintTableActionRow`.

That means row-style action definitions can express `formScene` in their permission hints.

By contrast, bulk action options live in:

- `a-openapi/src/types/resource/tableActionBulk.ts`

That type uses:

- `permission?: IPermissionHintTableActionBulk`

And that bulk hint type does not have `formScene`.

This is the clearest public type-level explanation for the current limitation.

## 6A. Details actions have their own scene-aware visibility path

The details-table action path uses a nearby but distinct contract.

Relevant type-level surfaces are:

- `a-openapi/src/types/detail/detailsActionRow.ts`
- `a-openapi/src/types/detail/detailsActionBulk.ts`
- `a-openapi/src/types/permissions.ts`

The current source confirms:

- `IResourceDetailsActionRowOptionsBase` uses `permission?: IPermissionHintDetailsActionRow`
- `IResourceDetailsActionBulkOptionsBase` uses `permission?: IPermissionHintDetailsActionBulk`
- both details permission-hint types support `formScene`

That means the details action family is scene-aware in a different way from `tableActionBulk`.

A practical current example from backend DTO metadata is:

```tsx
ZovaRender.detailsActionBulk('basic-details:actionCreate', {
  permission: { formScene: ['create', 'edit'] },
});
```

and:

```tsx
ZovaRender.detailsActionRow('basic-details:actionDelete', {
  permission: { formScene: ['create', 'edit'] },
});
```

So the correct distinction is:

- `tableActionBulk` does not currently support `formScene`
- `detailsActionBulk` does support `formScene`
- `detailsActionRow` also supports `formScene`

## 7. Why bulk actions are different today

Bulk actions are typed around bulk permission hints, not row/form-scene hints.

So in current Basic source, you should not claim that bulk actions support scene-based filtering the same way entry-page toolbar actions do.

This is not only a docs distinction. It is a source-confirmed contract distinction.

## 8. Comparison with table row actions and details actions

A useful table-row comparison file is:

```text
zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx
```

This table-row action surface uses permission checks, but it does not add the same local page-entry `formScene` prefilter path as `blockToolbarRow`.

A useful details comparison set is:

```text
zova/src/suite/cabloy-basic/modules/basic-details/src/component/blockToolbarBulk/controller.tsx
zova/src/suite/cabloy-basic/modules/basic-details/src/bean/tableCell.actionOperationsRow.tsx
zova/src/suite/cabloy-basic/modules/basic-details/src/lib/utils.ts
```

Those files show that the details action path also performs a scene-prefilter, but the authority is different:

- `blockToolbarRow` reads `$$pageEntry.formMeta.formScene`
- `basic-details` reads `$$details.formScene` or `$celScope.formMeta.formScene`
- the shared helper in `basic-details/src/lib/utils.ts` performs the actual `formScene` match

That makes the current frontend split more precise:

- entry-page row/form actions are scene-filtered by page-entry runtime context
- details bulk and details row actions are scene-filtered by details runtime context
- the two paths are similar in behavior, but they are not the same runtime surface

## 9. Boundary with page meta

A common confusion is to think that because `formMeta` also becomes part of page meta, page meta is the authority for action visibility.

That is not the current source-confirmed rule.

The better boundary is:

- `pageMeta.formMeta` is shell/task presentation state
- `$$pageEntry.formMeta.formScene` is the local page-entry runtime surface that `blockToolbarRow` reads for scene filtering

So for action visibility, the local page-entry context is the authority.

## 10. Bulk-action limitation

The current public Basic source supports this rule clearly for the table-action family:

- row/form action hints can be scene-aware
- table bulk action hints are not scene-aware today

But the details-action family is different:

- details row action hints can be scene-aware
- details bulk action hints can also be scene-aware

So do not compress these two families into one blanket rule about “bulk actions”.

If a contributor needs scene-aware bulk visibility, they should first verify whether the type and runtime contracts are being extended, rather than assuming the row-action rule applies automatically.

## Where to read next

Use these next steps depending on your question:

- if you want the full `formScene -> formMeta -> pageMeta -> shell/tab` bridge, read [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- if you want the broader entry-page runtime path, read [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)
- if you want the list-page row/bulk contrast, read [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- if you want shell/task presentation semantics, read [Page Meta Guide](/frontend/page-meta-guide)
- if you want the underlying resource permission/model context, read [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)

## Final takeaway

The most accurate rule for current Cabloy Basic entry-page action visibility is:

- `permissionHint.formScene` is a scene-aware visibility prefilter
- `$$pageEntry.formMeta.formScene` is the current scene source
- `$passport.checkPermission(...)` is still the actual authorization check
- the action renders only if both layers pass
- bulk actions do not currently carry `formScene` in their permission hints

That is the source-confirmed `permission / formScene / action visibility` path in the current Basic frontend architecture.
