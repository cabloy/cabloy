# Page Meta Guide

This guide explains how page metadata works in Zova within the Cabloy monorepo.

Use this page after [Router View Hosts Guide](/frontend/router-view-hosts-guide) and [Router Tabs Mechanism](/frontend/router-tabs-mechanism) when your next question is no longer “which routed host owns this page?” but “how should the page author update task-level title, dirty state, or form scene in the routed shell?”.

In the current public Cabloy Basic source, Page Meta is mainly a `routerViewTabs` concern rather than a universal routed-host feature.

Read this together with:

- [Page Route Guide](/frontend/page-route-guide)
- [A-Router Guide](/frontend/a-router-guide)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
- [Form Guide](/frontend/form-guide)
- [Permission, formScene, and Action Visibility Guide](/frontend/permission-formscene-action-visibility-guide)
- [SSR SEO Meta](/frontend/ssr-seo-meta)

## Why this guide exists

After contributors understand route meta, router-view hosts, and the router-tabs model, the next practical question is often about task-level page presentation:

- when should a page update its visible task title?
- how should a page mark itself dirty?
- how can create/edit form state affect the routed shell?
- what is the difference between `route.meta` and `pageMeta`?
- why does `$router.setPageMeta(...)` matter in `routerViewTabs` but not in every host?

This guide is the authoring-focused answer to those questions.

## The shortest accurate mental model

The shortest accurate model is:

1. route meta such as `tabKey`, `componentKey`, and `keepAlive` defines routed-host identity and workbench behavior
2. page code calls `$router.setPageMeta(this.$pageRoute, pageMeta)` when task-level presentation should change
3. the shared router bean forwards that update to registered router-view hosts
4. `routerViewTabs` delegates the update to `ModelTabs`
5. `ModelTabs` stores the metadata on the current level-2 tab item
6. the active layout reads that metadata to render task-level title and icon state

That is why page metadata is not the same thing as route metadata.

- **route meta** shapes routed identity and host behavior before or during route processing
- **page meta** updates task-level presentation after the page instance is already participating in the routed host

## Source-confirmed runtime path

The highest-value current Basic source path is:

1. `zova/src/suite-vendor/a-zova/modules/a-router/src/types/pageMeta.ts` defines `IPageMeta`
2. `zova/src/suite-vendor/a-zova/modules/a-router/src/types/routerView.ts` allows routed work items to carry `pageMeta`
3. `zova/src/suite-vendor/a-zova/modules/a-router/src/bean/bean.router.ts` forwards `$router.setPageMeta(...)` updates to registered router-view hosts
4. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx` provides the default no-op host behavior
5. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx` overrides `setPageMeta(...)` and delegates to `ModelTabs`
6. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` stores and merges `pageMeta` on the routed work item
7. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx` shows the clearest current authoring path
8. `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx` shows the clearest current visible shell consumer

A compact interpretation is:

- page code emits page meta through `$router.setPageMeta(...)`
- the router forwards it to the active routed host
- the tabs host stores it on the routed work item
- the shell renders title, dirty, and form-scene signals from that stored metadata

## The public page-meta surface

The public page-meta type is `IPageMeta`.

Representative source:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/types/pageMeta.ts`

Representative shape:

```typescript
export interface IPageMeta {
  pageTitle?: string;
  pageDirty?: boolean;
  formMeta?: IFormMeta;
}
```

### `pageTitle`

`pageTitle` is the task-level title for the current routed work item.

In the current Basic source, this is typically what the Admin layout uses for the level-2 item label instead of the broader menu-backed workspace title.

### Resource entry `pageTitleKey`

For schema-driven Resource entry pages, `basic-pageentry:blockPageEntry` derives `pageTitle` from the current form data. Its default `pageTitleKey` is `name`.

When the resource's human-readable identifier uses another top-level field, configure that field explicitly on the page-entry block in the DTO:

```typescript
@Dto({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      pageTitleKey: 'title',
      blocks: [
        // form and toolbar blocks
      ],
    }),
  ],
})
```

Use the same key in the create, update, and view DTOs when those scenes should show a consistent task title. Common choices include `title` and `code`; do not add a synthetic `name` field merely to satisfy the default.

Keep these boundaries in mind:

- `pageTitleKey` controls the routed-shell level-2 task title, not the resource or OpenAPI schema title and not the browser document title.
- The current implementation reads one exact top-level form-data key. It is not a dotted-path resolver or a formatter.
- On a create page, the title remains empty until its source field has a value. A fixed initial label such as “Create Product” requires a dedicated page-entry behavior that writes page meta explicitly.

### `pageDirty`

`pageDirty` tells the routed shell whether the current work item should appear dirty.

Typical visible effect:

- an asterisk or similar dirty indicator in the task-level UI

### `formMeta`

`formMeta` lets the routed shell reflect form-scene context such as `create` or `edit`.

In the current Basic source, this can affect task-level icon treatment.

A practical way to read it is:

- page/form code derives `formMeta`
- the routed shell consumes `formMeta`
- `formScene` is therefore not only a form concern; it also becomes task-level visual state in the current tabs-based shell

If you want the full cross-layer runtime path from `formScene` to `formMeta`, then to `pageMeta`, and finally to visible shell/tab state, continue with [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide).

## What page meta is not

Keep these boundaries clear.

### It is not route meta

Do not treat `pageMeta` as a late mutation form of `route.meta`.

- `route.meta` belongs to route declaration and routed-host behavior
- `pageMeta` belongs to the active page instance and its task-level presentation

If your question is “which workspace should this route belong to?” or “should this route reuse one page instance?”, that is a route-meta question, not a page-meta question.

### It is not business state ownership

Do not use `pageMeta` as the primary storage place for business data.

Business state still belongs in page/controller/model/service code.

`pageMeta` should stay small and presentation-oriented.

### It is not guaranteed to be the browser document title

`pageTitle` is a task-level routed-shell title surface.

It may align with visible shell labels, but contributors should not assume it is automatically identical to browser-level document-title handling unless they verify the current consumer path.

A practical rule is:

- use **page meta** for task-level shell presentation
- use **SSR/browser metadata** for document title and SEO-oriented head output

For the SSR/browser metadata path, see [SSR SEO Meta](/frontend/ssr-seo-meta).

### It is not a universal routed-host contract

`pageMeta` is most meaningful in hosts that actually model task-level routed items.

In the current source:

- `routerViewTabs` supports host-level page-meta updates
- `routerViewEmpty` does not add a richer host-level page-meta model
- `routerViewStack` does not override `setPageMeta(...)`

That means page-meta authoring is mainly a `routerViewTabs` concern.

## The runtime path

### 1. Page code calls `$router.setPageMeta(...)`

Representative source-confirmed usage in the current Basic repo:

- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`

Representative pattern:

```typescript
setPageMeta(data: any | undefined, pageDirty?: boolean) {
  if (!this.$pageRoute) return;
  const pageTitle = data?.[this.$props.pageTitleKey];
  this.$router.setPageMeta(this.$pageRoute, { pageTitle, pageDirty, formMeta: this.formMeta });
}
```

This is the authoring entrypoint most page contributors care about.

### 2. `BeanRouter` forwards the update to registered hosts

Representative source:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/bean/bean.router.ts`

Representative pattern:

```typescript
setPageMeta(route, pageMeta) {
  for (const routerView of this._routerViews) {
    routerView.setPageMeta(route, pageMeta);
  }
}
```

This means the router bean is not itself the state owner.

It is the forwarding boundary between page code and routed hosts.

### 3. `routerViewTabs` delegates to `ModelTabs`

Representative source:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx`
- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`

Representative pattern:

```typescript
public setPageMeta(route, pageMeta) {
  this.$$modelTabs.setPageMeta(route, pageMeta);
}
```

Inside `ModelTabs`, the update is resolved by `route.fullPath`, then applied to the current tab item.

This is the crucial source-level fact:

- **page metadata is stored on the routed work item, not on the route record itself**

### 4. The active layout consumes the stored page meta

Representative Basic consumers:

- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx`
- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx`

In the current Basic source, the layout can use page meta for:

- task-level title rendering
- dirty indicators
- create/edit icon signals derived from `formMeta.formScene`

## The most important authoring pattern

The current Basic `basic-pageentry` code shows the most important pattern.

### Initialize task presentation from loaded data

When page data becomes ready, set the initial title and non-dirty state.

Representative pattern:

```typescript
this.setPageMeta(this.formData, false);
```

### Mark the task dirty on form changes

Representative pattern:

```typescript
onChanged={data => {
  $$pageEntry.setPageMeta(data, true);
}}
```

### Clear dirty state after successful submit

Representative pattern:

```typescript
async submitData(data) {
  await mutationSubmit?.mutateAsync(data.value as any);
  this.setPageMeta(data.value, false);
}
```

This sequence gives the routed shell a stable task title, a live dirty signal, and scene-aware icon context without moving that concern into menu state or route meta.

## FAQ-style scenarios

### Scenario 1: the route is correct, but the task title is too generic

Typical situation:

- the workspace grouping is already correct through `tabKey`
- the page instance identity is already correct through `componentKey` or default behavior
- but the visible level-2 task label should show the loaded record name instead of a generic page label

Use page meta here, not route meta.

Representative pattern:

```typescript
const pageTitle = data?.name;
this.$router.setPageMeta(this.$pageRoute, { pageTitle });
```

This changes task-level presentation without changing workspace grouping or page-instance identity.

### Scenario 2: a form starts clean, becomes dirty while editing, then returns clean after submit

This is the most common page-meta lifecycle.

Representative pattern:

```typescript
this.setPageMeta(this.formData, false);

onChanged={data => {
  this.setPageMeta(data, true);
}}

async submitData(data) {
  await mutationSubmit?.mutateAsync(data.value as any);
  this.setPageMeta(data.value, false);
}
```

Use this when the shell should reflect unsaved work without moving dirty tracking into menu state or route declaration.

### Scenario 3: create and edit pages should look different in the shell

If the shell should distinguish create work from edit work, include `formMeta` in page meta updates.

Representative pattern:

```typescript
this.$router.setPageMeta(this.$pageRoute, {
  pageTitle,
  pageDirty,
  formMeta: this.formMeta,
});
```

In the current Basic source, this lets the layout derive task-level icon treatment from `formMeta.formScene`.

### Scenario 4: I only want to change browser document title

Do not assume page meta is the right tool.

`pageTitle` is a routed-shell task-title surface first.

If the requirement is only browser document-title behavior, verify the current document-title consumer path before reusing page meta for that purpose.

## A compact helper pattern

When a page repeatedly updates title, dirty state, and form scene together, keep the write path centralized.

Representative pattern:

```typescript
setPageMeta(data: any | undefined, pageDirty?: boolean) {
  if (!this.$pageRoute) return;
  const pageTitle = data?.[this.$props.pageTitleKey];
  this.$router.setPageMeta(this.$pageRoute, { pageTitle, pageDirty, formMeta: this.formMeta });
}
```

This is usually better than scattering several independent `$router.setPageMeta(...)` calls across unrelated handlers.

## When you should update page meta

Update page meta when the routed task presentation changes.

Typical cases:

- the loaded record changes the task title
- the form becomes dirty or returns to a clean state
- the form scene should visibly distinguish create vs edit work
- the current work item needs a more specific task label than the workspace title
- the page needs one small shell-facing metadata update without changing route identity or layout-owned menu info

Avoid updating page meta for concerns that are really:

- workspace grouping questions
- page-instance reuse questions
- broad business state storage
- low-level transient values that the shell does not need to present

## `pageMeta` vs router-tabs route meta

Use this split:

- use route meta such as `tabKey`, `componentKey`, `componentKeyMode`, and `keepAlive` to decide **how the route participates in the workbench**
- use page meta to decide **how the current work item should be presented after it is already open**

A compact rule:

- **route meta answers identity**
- **page meta answers presentation**

## Cache and dirty-state safety

The current router-tabs model resets restored `pageDirty` state when cached tabs are loaded.

This is intentional.

A restored work item should not automatically claim unsaved work unless the application can truly re-establish that state.

That means contributors should treat `pageDirty` as a live task-state presentation signal, not as a durable business-truth record.

## Edition note

This guide describes the shared routed-host contract and the current public Cabloy Basic consumers.

The same architectural role applies across editions where the shared router-view host and router-tabs model are reused, but visible shell presentation can still differ by edition, layout, or UI layer.

## Suggested reading order when debugging page-meta behavior

If the task is specifically about page metadata, read these in order:

1. this page
2. the concrete page controller that calls `$router.setPageMeta(...)`
3. [Router View Hosts Guide](/frontend/router-view-hosts-guide)
4. [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
5. [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)

This keeps the authoring entrypoint in view before you descend into host and layout internals.

## A compact authoring checklist

Before adding or changing page-meta logic, ask:

1. is this really a task-presentation change rather than a route-identity change?
2. does the shell need this information, or is it only business state?
3. should the title come from loaded data, form state, or some other stable task label?
4. should dirty state reset after successful submit?
5. is the current routed host actually a page-meta consumer?

If those answers are clear, the page-meta update path is usually clear too.

## Common mistakes to avoid

### Mistake 1: using route meta when the real problem is task presentation

If the route is already in the right workspace and page instance, do not reach for `tabKey` or `componentKey` just to change the visible task label.

Use page meta instead.

### Mistake 2: storing business payloads in page meta

Keep `pageMeta` small and shell-facing.

If the data matters to business logic, it probably belongs elsewhere.

### Mistake 3: assuming every routed host consumes page meta

Do not overgeneralize `routerViewTabs` behavior to `routerViewEmpty` or `routerViewStack` without verification.

### Mistake 4: assuming `pageDirty` is durable across cache restore

The current model intentionally clears restored dirty signals.

## Summary

Page metadata is the routed-shell presentation layer for an already-open page task.

Use `$router.setPageMeta(this.$pageRoute, ...)` when the current work item should update its title, dirty state, or form-scene-driven visual context.

Keep the architectural split clear:

- route meta controls routed identity and host behavior
- page meta controls task-level presentation after the page is already open

## See also

- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
- [Form Guide](/frontend/form-guide)
