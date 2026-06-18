# Router Tabs Route Meta Cookbook

This guide provides practical route-meta recipes for the router-tabs mechanism in Zova within the Cabloy monorepo.

If you came here from [Router View Hosts Guide](/frontend/router-view-hosts-guide), [Router Tabs Mechanism](/frontend/router-tabs-mechanism), or [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration), this page is the authoring layer: the earlier pages explain host/runtime behavior, and this page explains how route metadata intentionally drives it.

Read this together with:

- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Page Route Guide](/frontend/page-route-guide)
- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)

## Why this cookbook exists

The router-tabs mechanism is flexible, but the most important authoring choices are usually concentrated in route metadata.

In practice, contributors often need a quick answer to questions such as:

- when should several pages share one level-1 workspace?
- when should several route visits reuse one page instance?
- when should different records remain open in parallel?
- when should a routed page be excluded from keep-alive?

This cookbook answers those questions with focused examples.

## The relevant route-meta surface

Representative route-meta fields for router tabs include:

- `tabKey`
- `componentKey`
- `componentKeyMode`
- `keepAlive`

Representative source definition:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/types/router.ts`

## Mental model before choosing a recipe

Use this decision split first:

- [Router View Hosts Guide](/frontend/router-view-hosts-guide) explains where host-level routed identity is consumed
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism) explains how `ModelTabs` turns route data into tab state
- this page explains how to choose the route-meta inputs that drive that model

- `tabKey` answers: which level-1 workspace should this route belong to?
- `componentKey` answers: should this route visit reuse an existing page instance or remain separately open?

If you keep that split clear, most router-tabs authoring decisions become straightforward.

## Recipe 1: use the default behavior for a simple page

Use the default behavior when a page does not need special grouping or custom instance control.

```typescript
export const routes: IModuleRoute[] = [
  {
    path: 'dashboard',
    component: ZPageDashboard,
  },
];
```

What this means in practice:

- the route can still participate in router tabs
- the effective `tabKey` falls back to the effective `componentKey`
- the page behaves like its own workspace by default

Use this when the page is simple and does not need to share a workspace with related pages.

## Recipe 2: group several pages into one stable workspace with `tabKey`

Use a shared `tabKey` when several related routes should stay under one level-1 workspace.

```typescript
export const routes: IModuleRoute[] = [
  {
    path: 'user/list',
    component: ZPageUserList,
    meta: {
      tabKey: '/user/list',
    },
  },
  {
    path: 'user/create',
    component: ZPageUserCreate,
    meta: {
      tabKey: '/user/list',
    },
  },
  {
    path: 'user/edit/:id',
    component: ZPageUserEdit,
    meta: {
      tabKey: '/user/list',
    },
  },
];
```

What this means in practice:

- User List, User Create, and User Edit all belong to one level-1 workspace
- the top-level workspace remains stable
- the inner work items can still vary

Use this when the business workspace identity matters more than the specific route identity.

## Recipe 3: reuse one page instance across param changes with `componentKeyMode: 'nameOnly'`

Use `componentKeyMode: 'nameOnly'` when different param values should still reuse one logical page instance.

```typescript
export const routes: IModuleRoute[] = [
  {
    name: 'reportDetail',
    path: 'report/:id?',
    component: ZPageReportDetail,
    meta: {
      componentKeyMode: 'nameOnly',
    },
  },
];
```

What this means in practice:

- the route name becomes the effective page-instance identity
- visiting different param values can still reuse one page instance
- this is useful when the page behaves like one reusable tool surface

Representative source example:

- `zova/src/suite/a-demo/modules/demo-basic/src/routes.ts` lines 20-28

## Recipe 4: use an explicit `componentKey` when you need full control

Use an explicit `componentKey` when the default path-based behavior is not precise enough.

```typescript
export const routes: IModuleRoute[] = [
  {
    name: 'orderDetail',
    path: 'order/:id',
    component: ZPageOrderDetail,
    meta: {
      componentKey(route) {
        return `order:${route.params.id}`;
      },
    },
  },
];
```

What this means in practice:

- every order id gets its own page-instance identity
- several orders can remain open in parallel
- the page-instance rule is explicit instead of inferred indirectly

Use this when you want independently open task items for different business objects.

## Recipe 5: combine stable `tabKey` with distinct `componentKey`

This is the most common workbench recipe.

Use it when several routes should stay in one workspace, but different records should still remain separately open.

```typescript
export const routes: IModuleRoute[] = [
  {
    name: 'productEdit',
    path: 'product/edit/:id',
    component: ZPageProductEdit,
    meta: {
      tabKey: '/product/list',
      componentKey(route) {
        return `product-edit:${route.params.id}`;
      },
    },
  },
];
```

What this means in practice:

- all product-edit work stays under the Product List workspace
- Product A and Product B can still remain open as separate level-2 work items
- this preserves both business grouping and parallel record editing

If you need only one recipe to remember, this is often the one.

## Recipe 6: compute `tabKey` dynamically when the workspace identity is derived

Use a function `tabKey` when the workspace grouping depends on route context rather than a fixed string.

```typescript
export const routes: IModuleRoute[] = [
  {
    name: 'contentScene',
    path: 'content/:scene/:id?',
    component: ZPageContentScene,
    meta: {
      tabKey(route) {
        return `/content/${route.params.scene}`;
      },
    },
  },
];
```

What this means in practice:

- each content scene becomes its own workspace grouping
- routes in the same scene stay together
- different scenes remain separated

Use this when the stable business workspace is derived from a route dimension such as scene, category, or module context.

## Recipe 7: exclude a page from keep-alive with `keepAlive: false`

Use `keepAlive: false` when the page should not stay alive in the routed workbench cache.

```typescript
export const routes: IModuleRoute[] = [
  {
    path: 'search/live',
    component: ZPageSearchLive,
    meta: {
      keepAlive: false,
    },
  },
];
```

What this means in practice:

- the route can still participate in router tabs
- but its instance is excluded from the keep-alive include list
- switching away and back may rebuild the page state

Use this only when the page should not preserve the normal keep-alive workbench behavior.

## Recipe 8: pin the workspace identity to the business entry, not to task routes

When choosing `tabKey`, prefer the stable business entry rather than temporary task pages.

Better:

```typescript
meta: {
  tabKey: '/invoice/list',
}
```

Usually worse:

```typescript
meta: {
  tabKey: '/invoice/edit/123',
}
```

Why:

- the first form preserves a stable Invoice workspace
- the second form turns one temporary task into the workspace identity itself

That usually weakens the business meaning of the level-1 surface.

## Recipe 9: decide between `componentKeyMode` and explicit `componentKey`

Use this rule of thumb:

### Prefer `componentKeyMode: 'nameOnly'` when

- one named page should behave as one reusable inner tool
- params do not need separate open instances
- the route name is already a good page-instance identity

### Prefer explicit `componentKey` when

- different records should remain separately open
- the reuse rule depends on route params or query details
- you want the instance boundary to be obvious in the route definition

In the current implementation, `nameOnly` is the special opt-in mode. Otherwise the router-tabs model falls back to path-based distinction unless an explicit `componentKey` is provided.

## Recipe 10: avoid using `tabKey` and `componentKey` for the same purpose

Avoid these two mistakes:

### Mistake A: using `tabKey` to distinguish separate records

```typescript
meta: {
  tabKey(route) {
    return `/customer/${route.params.id}`;
  },
}
```

This often turns every record into its own top-level workspace and makes the level-1 surface noisy.

### Mistake B: using `componentKey` to simulate business grouping

```typescript
meta: {
  componentKey: '/customer/list',
}
```

This can collapse different work items into one reused page instance even when users expect parallel open tasks.

The safer rule is:

- use `tabKey` for workspace grouping
- use `componentKey` for page-instance reuse or separation

## Recommended authoring checklist

Before finalizing route meta for a page, ask:

1. what is the stable business workspace identity?
2. should this page join an existing workspace or create its own?
3. should several visits reuse one page instance or open separately?
4. should this page preserve normal keep-alive behavior?
5. would the chosen keys still make sense after future route refactors?

If the answers are stable, the route-meta design is usually in good shape.

## Summary

The most useful router-tabs recipes are built from one simple split:

- `tabKey` controls workspace grouping
- `componentKey` controls page-instance identity

Once that split is clear, route meta becomes a practical and predictable tool for shaping the workbench experience.

## See also

- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
