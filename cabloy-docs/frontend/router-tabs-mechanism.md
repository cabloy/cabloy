# Router Tabs Mechanism

This guide explains how the router-tabs mechanism works in Zova within the Cabloy monorepo.

For the business meaning of the mechanism, see [Router Tabs Overview](/frontend/router-tabs-overview).

## Why this mechanism exists

The router-tabs mechanism is designed to support a workbench-style frontend navigation model.

Its main purpose is to separate:

- business-level grouping
- page-instance-level switching

In code, that separation is expressed mainly through:

- `tabKey`
- `componentKey`

These two fields are related, but they do not mean the same thing.

In the current Cabloy Basic frontend source, the shared router-tabs model lives in:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`

The Admin layout integration appears in:

- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/controller.tsx`
- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx`

The Web layout reuses the same model through:

- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/controller.tsx`
- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx`

## Core data model

The main tab model is `RouteTab`.

Representative shape:

```typescript
export interface RouteTab extends RouteTabBase {
  items?: IRouteViewRouteItem[];
  updatedAt: number;
  info: RouteTabInfo;
}
```

A `RouteTab` represents one level-1 tab.

Its `items` array contains the level-2 tab items associated with that level-1 tab.

Representative related types include:

- `RouteTab`
- `RouteTabInfo`
- `IRouteViewRouteItem`
- `IRouteViewRouteMeta`
- `IPageMeta`

The important conceptual split is:

- `RouteTab` is the level-1 workspace
- `RouteTab.items[]` are the level-2 work items

Representative source definitions:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/types/tabs.ts`
- `zova/src/suite-vendor/a-zova/modules/a-router/src/types/routerView.ts`
- `zova/src/suite-vendor/a-zova/modules/a-router/src/types/pageMeta.ts`

## Route-to-tab mapping

When a route is processed, the model prepares a route meta record containing:

- `fullPath`
- `componentKey`
- `tabKey`
- `keepAlive`

Representative pattern:

```typescript
prepareRouteMeta(route: RouteLocationNormalizedLoadedGeneric): IRouteViewRouteMeta {
  const fullPath = route.fullPath;
  const componentKey = this.__handleRoutePropComponentKey(route);
  const tabKey = this._handleRouteProp(route, 'tabKey') || componentKey;
  const keepAlive = this._handleRouteProp(route, 'keepAlive');
  return { tabKey, componentKey, fullPath, keepAlive };
}
```

This is the central mapping step from routing state into tab state.

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 493-530

## `tabKey`: level-1 grouping identity

`tabKey` decides which level-1 tab a route belongs to.

This is the grouping key.

If several routes should belong to the same business workspace, they should share the same `tabKey`.

If a route does not explicitly provide one, the mechanism falls back to `componentKey`.

That fallback means:

- every route can still open as a tab
- a route only joins an existing level-1 group when grouping is intentionally defined

This makes `tabKey` the business-grouping surface rather than the page-instance surface.

### Recommended `tabKey` rule

Use a stable `tabKey` for the durable business workspace identity, not for a temporary route variant.

Good candidates include:

- a module link such as `/user/list`
- a stable named business entry
- a menu identity that should continue to represent the same workspace over time

Avoid using `tabKey` values that change only because query, params, or transient task context changes.

## `componentKey`: level-2 instance identity

`componentKey` decides whether the current route should be treated as the same page instance or as a distinct one.

This is the level-2 identity key.

The mechanism first checks route meta for `componentKey`. If it is not provided, it derives the value from route name or route path.

Representative logic:

- explicit `meta.componentKey` has priority
- if route name exists and `componentKeyMode === 'nameOnly'`, use the route name
- otherwise use the route path

This matters because different pages need different reuse rules.

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 519-530
- `zova/src/suite/a-demo/modules/demo-basic/src/routes.ts` lines 20-28

### Example: shared instance

If a route uses `componentKeyMode: 'nameOnly'`, routes with different params can still share one logical page instance.

This is useful when the page should behave as one reusable workspace rather than opening a separate tab for each path variation.

### Example: separate instance

If the effective `componentKey` changes with the route path, different page entries can appear as separate level-2 tab items.

This is useful when different records or route shapes should remain independently open.

### Recommended `componentKey` rule

Use `componentKey` to answer one question only:

- should these route visits reuse one page instance, or should they remain separately open?

If the answer is reuse, keep `componentKey` coarse and stable.

If the answer is parallel open work, keep `componentKey` fine enough to distinguish those instances.

Do not use `componentKey` as a substitute for business grouping. That is `tabKey`'s job.

## Tab creation flow

The main flow is:

1. route enters the router-view tab system
2. route meta is prepared
3. the model calls `addTab`
4. the system either creates a new level-1 tab or updates an existing one
5. the current active tab keys are updated

Representative route-forwarding pattern:

```typescript
forwardRoute(route: RouteLocationNormalizedLoadedGeneric) {
  const routeMeta = this.prepareRouteMeta(route);
  this.addTab(routeMeta);
}
```

Inside `addTab`, the mechanism:

- finds the existing level-1 tab by `tabKey`
- resolves the display info for that tab
- creates a new tab if needed
- inserts a newly created level-1 tab near the current context while keeping affixed tabs as a contiguous prefix
- otherwise updates the tab and its items without reordering an already existing level-1 tab

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 122-184
- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 483-486

## Level-1 tab structure and the anchor item

When a new level-1 tab is created, the first item is usually created from the current route itself.

That first item often acts as the anchor route for the level-1 tab.

This is why the items list may contain an item whose `componentKey` equals `tabKey`.

In the Admin layout, level-2 rendering intentionally skips that first anchor item. That means:

- the level-1 tab still has a route anchor
- the level-2 row only shows the additional work items

This is an important part of the mechanism.

The shared model also preserves these ordering rules:

- the anchor item stays first within the workspace item list
- new level-2 items open near the current active item when they belong to the current workspace
- revisiting an already open level-2 item updates it in place instead of moving it

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 142-158
- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx` lines 67-70

## Tab activation behavior

Activating a level-1 tab is different from activating a level-2 tab.

### Activating a level-1 tab

When a level-1 tab becomes active, the system tries to navigate back through that tab's anchor route or first route item.

Representative behavior:

```typescript
const tabItemFirst = tab.items?.[0];
const path = tabItemFirst?.componentKey === tabKey ? tabItemFirst.fullPath : tabKey;
await this.$router.push(path);
```

This means a level-1 tab is not just a label. It remains connected to a restorable route context.

### Activating a level-2 tab

When a level-2 tab item becomes active, the system pushes its own `fullPath`.

That gives each work item an exact route target.

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 351-373

## Tab info and menu integration

In the Admin layout, level-1 tab info is usually derived from the menu model.

Representative initialization pattern:

- `getInitialTabs`
- `getTabInfo`

This means the level-1 title and icon are normally tied to business navigation identity, not to the runtime page title of a specific inner task.

That is why the first-level and second-level labels come from different sources.

Representative implementation:

- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/controller.tsx` lines 75-107
- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/controller.tsx` lines 73-107

## Page metadata and level-2 state

Level-2 tab items can carry `pageMeta`.

Representative page metadata includes:

- `pageTitle`
- `pageDirty`
- `formMeta`

This metadata shapes the visible state of the level-2 tab.

### `pageTitle`

`pageTitle` is typically used as the displayed title of the level-2 item.

This is what allows the second level to show task-specific names instead of module names.

### `pageDirty`

If `pageDirty` is true, the UI can show a dirty indicator such as an asterisk.

This tells the user that the current work item has unsaved changes.

### `formMeta.formScene`

The form scene can also affect the icon or visual state.

Typical cases include:

- `create`
- `edit`

This helps the user distinguish draft-like work from modification work at a glance.

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 212-233
- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 488-490
- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx` lines 113-128

## Keep-alive behavior

The model computes a `keepAliveInclude` list from tab items.

Representative rule:

- include each `componentKey` whose tab item is not explicitly `keepAlive: false`
- avoid duplicates

This keeps routed page instances alive while they remain part of the active tab model.

This is a key part of the workbench experience because users expect tabs to preserve state across switching.

For the broader SSR client-only boundary pattern, also see [SSR ClientOnly](/frontend/ssr-client-only).

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 452-465
- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx` lines 36-42

## Cache behavior

The tab model supports both in-memory and persistent state depending on configuration.

Representative options include:

- `cache`
- `max`
- `maxItems`

If `cache` is enabled, the model can store tab state through a persistent model-state path instead of memory-only state.

This allows the workbench state to survive refreshes more effectively.

### Why dirty state is reset

When cached tab state is restored, the mechanism resets `pageDirty` flags.

This is an important safety boundary.

A restored tab should not automatically claim that the user still has unsaved work unless the application can truly re-establish that state reliably.

That is why the mechanism restores the workspace structure but clears fragile dirty markers.

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 71-87
- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 532-545
- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx` lines 24-25
- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx` lines 25-26

## Capacity control

The model supports two capacity limits:

- `max`: maximum number of level-1 tabs
- `maxItems`: maximum number of level-2 items per level-1 tab

When limits are exceeded, the mechanism prunes older entries based on update time.

This keeps the workbench from growing without bound.

There is also special handling for affixed tabs such as fixed entry tabs. Those should not be pruned in the same way as normal tabs.

Representative implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts` lines 382-423

## Rendering model in Admin and Web layouts

The current Cabloy Basic source shows two different presentations of the same model.

### Admin layout

The Admin layout renders:

- level-1 tabs in a lifted tab row
- level-2 tabs in a bordered tab row for the current level-1 tab

Important implementation points include:

- level-1 uses tab info such as title and icon
- level-2 uses page-level metadata such as `pageTitle`
- level-2 skips the anchor item
- close actions differ for level-1 and level-2 items

Representative implementation:

- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx`

### Web layout

The Web layout reuses the same router-tabs model but renders top-level workspaces as horizontal menu items and nested menu groups.

That means the framework contract should be understood as a route-grouping and workbench-state mechanism, not only as one specific double-tab-row UI.

Representative implementation:

- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx`

## Extension guidance

When designing pages that participate in this mechanism, ask these questions:

### Should several routes belong to one business workspace?

If yes, define a stable `tabKey`.

### Should several route variants reuse one page instance?

If yes, consider `componentKey` or `componentKeyMode`.

### Should the page show task-specific titles or state in the second-level tabs?

If yes, provide `pageMeta` updates such as `pageTitle`, `pageDirty`, or form scene metadata.

### Should the workbench survive refreshes?

If yes, evaluate whether `cache` should be enabled.

### Should users be able to open several records in parallel?

If yes, ensure that `componentKey` is fine-grained enough to keep those records distinct.

## Common pitfalls

Typical mistakes include:

- using `tabKey` as if it were only a route identity
- making `tabKey` unstable across equivalent business routes
- making `componentKey` too coarse and collapsing distinct tasks into one tab item
- making `componentKey` too fine and opening too many nearly identical tab items
- assuming dirty state can be restored safely after every reload
- treating one layout's rendering choice as if it were the full framework contract

## Summary

The router-tabs mechanism depends on a clear split:

- `tabKey` groups routes into level-1 workspaces
- `componentKey` identifies level-2 work items or page instances

With page metadata, keep-alive behavior, caching, and capacity control layered on top, the result is a workbench-style navigation model that fits complex admin workflows much better than plain route switching.

## See also

- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
- [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
