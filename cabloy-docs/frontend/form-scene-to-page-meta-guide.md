# Form Scene to Page Meta Guide

This guide explains the cross-layer runtime path from `formScene` to `formMeta`, then to `pageMeta`, and finally to visible shell/tab state in Zova.

Use this page when you want to understand one narrow question end to end:

- where `formScene` comes from
- how it becomes `formMeta`
- how page-entry code uses that `formMeta`
- how `formMeta` becomes part of `pageMeta`
- how routed host / tabs / layout UI consume that state

## Why this page exists

The current frontend docs already explain the pieces of this story well:

- [Form Guide](/frontend/form-guide) explains `formMeta` as form-scene input
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) explains form runtime orchestration
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map) explains where to read form internals
- [Page Meta Guide](/frontend/page-meta-guide) explains how page meta is emitted and consumed
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism) and [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration) explain how tabs store and display page/task state

What those pages do not isolate directly is the one continuous cross-layer chain.

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. `formScene` is the semantic page/form scene input such as `view`, `create`, or `edit`
2. `formMetaFromFormScene(...)` converts that scene into canonical runtime metadata
3. page-entry controllers use `formMeta` to choose schema, data, and form behavior
4. page-entry code pushes `{ pageTitle, pageDirty, formMeta }` through `$router.setPageMeta(...)`
5. the router forwards that page meta into the active routed host
6. `routerViewTabs` / `ModelTabs` store the metadata on the current tab item
7. shell and nearby page-entry UI consume `formMeta.formScene` for visible create/edit/task state

That means `formMeta` is not only a form-internal value. In the current Basic source, it also becomes routed-shell presentation state.

## What this guide is not

This page is a bridge page.

It is **not**:

- a replacement for [Form Guide](/frontend/form-guide)
- a full form runtime deep dive instead of [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- a full page-meta guide instead of [Page Meta Guide](/frontend/page-meta-guide)
- a full routed-host guide instead of [Router Tabs Mechanism](/frontend/router-tabs-mechanism)

Its job is only to connect those layers into one readable path.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/utils.ts`
2. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`
5. `zova/src/suite-vendor/a-zova/modules/a-router/src/bean/bean.router.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx`
7. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`
8. `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx`
9. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`

That order moves from the scene/meta translation helper, to page-entry orchestration, to form runtime usage, to router forwarding, to tabs storage, and finally to visible shell/local UI consumption.

## Runtime path by layer

### 1. `formScene` becomes `formMeta`

The canonical translation helper lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/lib/utils.ts
```

The source-confirmed rules are:

- `view` -> `{ formScene, formMode: 'view', editMode: undefined }`
- `create` -> `{ formScene, formMode: 'edit', editMode: 'create' }`
- `edit` -> `{ formScene, formMode: 'edit', editMode: 'update' }`

This is the most important first step.

A practical rule is:

- treat `formScene` as the semantic scene input
- treat `formMeta` as the canonical runtime metadata derived from that input

The same helper file also exposes the reverse mapping through `formSceneFromFormMeta(formMeta)`.

### 2. Page-entry controllers use `formMeta` to choose schema and data

A generic resource-page entry path appears in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx
```

A stronger business-facing current Basic specimen appears in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
```

In `blockPageEntry`, the controller:

- derives `formScene`
- computes `formMeta`
- derives `schemaScene`
- computes `formProvider`
- computes `formSchema`
- computes `formData`

This is the key Zova-native meaning of `formMeta` at the page-entry layer:

- it is the runtime selector for how the page-entry form should behave
- it is not only a display flag

### 3. `formMeta` enters the form runtime

The clearest current Basic form-side specimen is:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx
```

This block passes the page-entry-owned values into `ZForm`, including:

- `schemaScene`
- `formMeta`
- `formProvider`
- `formScope`
- `data`
- `schema`

This confirms an important boundary:

- page-entry owns the scene/meta decision
- `ZForm` consumes that runtime metadata for real form behavior

### 4. Page-entry code emits `pageMeta`

The strongest current Basic write path is still in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
```

Representative behavior:

- initialize shell/task state from loaded data
- mark dirty on form change
- clear dirty after submit
- include `formMeta` in each page-meta write

Representative pattern:

```typescript
setPageMeta(data: any | undefined, pageDirty?: boolean) {
  if (!this.$pageRoute) return;
  const pageTitle = data?.[this.$props.pageTitleKey];
  this.$router.setPageMeta(this.$pageRoute, { pageTitle, pageDirty, formMeta: this.formMeta });
}
```

This is the most important transition point in the whole chain:

- `formMeta` stops being only a form runtime input
- it becomes part of shell-facing routed work-item presentation

### 5. The router forwards page meta to the active host

The forwarding boundary lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/bean/bean.router.ts
```

Its role is straightforward:

- receive `setPageMeta(route, pageMeta)`
- forward that update to registered router-view hosts

This means the router bean is not the long-term owner of the metadata.

It is the forwarding boundary from page code into routed-host ownership.

### 6. `routerViewTabs` stores the metadata on the tab item

The tabs host forwarding layer appears in:

```text
zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx
```

The actual storage owner appears in:

```text
zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts
```

This is the source-confirmed current Basic path for routed-shell state:

- `routerViewTabs` forwards `setPageMeta(...)` into `ModelTabs`
- `ModelTabs` resolves the routed work item and merges `pageMeta` onto it

This matters because:

- page meta is stored on the active routed work item
- it is not stored on the route record itself

### 7. Shell and nearby UI consume `formMeta.formScene`

The clearest visible shell consumer is:

```text
zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx
```

This render path uses:

- `pageMeta.pageTitle` for task title
- `pageMeta.pageDirty` for asterisk/dirty signal
- `pageMeta.formMeta.formScene` for create/edit task icons

A second, more local consumer appears in:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx
```

That controller reads `$$pageEntry.formMeta.formScene` directly for permission/display filtering.

This gives the clean end-to-end interpretation:

- shell/tab UI can consume `formMeta` after it has been promoted into page meta
- nearby page-entry UI can also consume `formMeta` directly before or alongside shell usage

## A compact end-to-end trace

The shortest end-to-end trace is:

- page-entry decides `formScene`
- `formMetaFromFormScene(formScene)` derives canonical form runtime metadata
- page-entry uses `formMeta` to compute schema/data/runtime behavior
- page-entry writes `{ pageTitle, pageDirty, formMeta }` through `$router.setPageMeta(...)`
- router forwards the update
- tabs model stores `pageMeta` on the active work item
- layout renders title/dirty/icon state from `pageMeta.formMeta.formScene`

That is the source-confirmed cross-layer path in the current Basic frontend.

## What this path is not

Keep these boundaries clear.

### It is not only a form concern

`formMeta` starts from form scene logic, but in the current Basic tabs-based shell it also becomes task-level shell state.

### It is not route identity

Do not confuse this chain with route-meta questions such as:

- `tabKey`
- `componentKey`
- `keepAlive`

Those are route/work-item identity concerns.

This guide is about scene-derived presentation/runtime metadata after the routed item already exists.

### It is not browser document-title handling

If the requirement is browser title or SEO metadata only, that belongs in the SSR/meta path rather than this chain.

For that boundary, see [SSR SEO Meta](/frontend/ssr-seo-meta).

## Where to read next

Use these next steps depending on your question:

- if you want form authoring: [Form Guide](/frontend/form-guide)
- if you want deeper form runtime internals: [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- if you want the form source file map: [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)
- if you want page-meta authoring and semantics: [Page Meta Guide](/frontend/page-meta-guide)
- if you want the action-visibility rule for `permissionHint.formScene` and `$$pageEntry.formMeta.formScene`, read [Permission, formScene, and Action Visibility Guide](/frontend/permission-formscene-action-visibility-guide)
- if you want tabs-side host storage and visible shell behavior: [Router Tabs Mechanism](/frontend/router-tabs-mechanism) and [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)

## Final takeaway

The most accurate way to read this topic is:

- `formScene` is the semantic input
- `formMeta` is the derived runtime metadata
- `pageMeta` is the shell-facing routed work-item presentation payload
- tabs/layout render turns that payload into visible task-level state

That is the source-confirmed `formScene -> formMeta -> pageMeta -> shell/tab state` path in the current Cabloy Basic frontend.
