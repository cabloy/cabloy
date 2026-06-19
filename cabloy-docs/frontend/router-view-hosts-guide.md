# Router View Hosts Guide

This guide explains how router-view hosts work in Zova within the Cabloy monorepo.

Use this page after [Page Route Guide](/frontend/page-route-guide), [A-Router Guide](/frontend/a-router-guide), and [Zova Router Under the Hood](/frontend/zova-router-under-the-hood) when your next question is no longer “how is the route registered?” but “which routed host actually owns the page instance, keep-alive behavior, and workspace model?”.

Read this page together with:

- [Page Route Guide](/frontend/page-route-guide)
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)
- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs vs Stack](/frontend/router-tabs-vs-stack)
- [Router Stack Guide](/frontend/router-stack-guide)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Page Meta Guide](/frontend/page-meta-guide)
- [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

If you reached this page from the routing branch of [Zova Source Reading Map](/frontend/zova-source-reading-map), this is the next step after route registration and controller route-state injection.

> [!TIP]
> **Router ecosystem docs path**
>
> 1. **[Page Route Guide](/frontend/page-route-guide)** — learn the public route-record and layout surface
> 2. **[A-Router Guide](/frontend/a-router-guide)** — learn what the `a-router` package owns in the runtime
> 3. **[Zova Router Under the Hood](/frontend/zova-router-under-the-hood)** — learn how the core router runtime cooperates
> 4. **[Router View Hosts Guide](/frontend/router-view-hosts-guide)** — learn how routed pages are actually hosted
> 5. **[Router Tabs Overview](/frontend/router-tabs-overview)** — learn the business/workbench meaning of router tabs
> 6. **[Router Tabs Mechanism](/frontend/router-tabs-mechanism)** — learn the shared tabs model in code
> 7. **[Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)** — learn how the current Basic layouts turn the shared model into a visible shell
> 8. **[Zova Source Reading Map](/frontend/zova-source-reading-map)** — learn which files to read next
>
> **You are here:** step 4.
> **Previous pages:** [Page Route Guide](/frontend/page-route-guide), [A-Router Guide](/frontend/a-router-guide), and [Zova Router Under the Hood](/frontend/zova-router-under-the-hood).
> **Next recommended pages:** [Router Tabs Overview](/frontend/router-tabs-overview), [Router Tabs Mechanism](/frontend/router-tabs-mechanism), [Page Meta Guide](/frontend/page-meta-guide), and [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration).

## Why this page exists

After contributors understand route records, guards, aliases, and typed params/query, the next practical question is usually about the routed host itself.

Typical follow-up questions are:

- why does one routed page behave like a plain shell page while another behaves like a workbench tab?
- where does keep-alive inclusion come from?
- where do `tabKey`, `componentKey`, and page-level task state actually attach?
- what is the difference among `routerViewEmpty`, `routerViewTabs`, and `routerViewStack`?

This page answers those questions.

## The shortest accurate mental model

The shortest accurate model is:

1. `a-router` resolves the target route
2. the routed page enters a router-view host, not only a bare Vue Router outlet
3. the host decides whether the route is treated as plain output, a workbench tab, or a stack item
4. the host computes routed identity such as `tabKey`, `componentKey`, and keep-alive participation
5. the shared router bean calls host callbacks on forward/back navigation and page-meta updates
6. the active layout chooses which host component to render

That is why routed-page behavior in Zova is not only a route-record concern. It is also a host-selection concern.

## The public host entrypoints

The public wrapper components are:

- `ZRouterViewEmpty`
- `ZRouterViewTabs`
- `ZRouterViewStack`

Representative wrapper sources:

- `zova/src/suite-vendor/a-zova/modules/a-router/src/.metadata/component/routerViewEmpty.ts`
- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/.metadata/component/routerViewTabs.ts`
- `zova/src/suite-vendor/a-zova/modules/a-routerstack/src/.metadata/component/routerViewStack.ts`

These wrapper files matter for two reasons:

- they show that router-view hosts still enter the runtime through the normal `useController(...)` wrapper path
- they confirm that `controllerRef` exposes the controller instance of the host, not a generic DOM ref

So even at the routed-host level, Zova keeps the same controller-oriented component model.

## The shared contract: `BeanRouterViewBase`

The shared base host lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx
```

This is the core host contract for richer routed shells.

Its main responsibilities are:

- register itself on the bean host as `$$routerView`
- register and deregister itself with `$router`
- expose host callbacks for forward-route and back-route handling
- expose `setPageMeta(...)` for task-level page metadata updates
- wrap routed pages in `RouterView`
- wrap routed pages in `KeepAlive`
- set vnode `key` from the host-computed route meta
- inject the current page route into the routed vnode through host providers

A practical reading takeaway is:

- **a routed page enters a host controller first, then the host decides how the page instance participates in the shell**

## The route-meta contract for hosts

The shared host-level route-meta types live in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/types/routerView.ts
```

The important records are:

- `IRouteViewRouteItem`
- `IRouteViewRouteMeta`

A compact interpretation is:

- `tabKey` = the host-level grouping identity
- `componentKey` = the page-instance identity
- `fullPath` = the concrete route visit
- `keepAlive` = whether that routed instance should participate in host keep-alive inclusion

This is the point where route state becomes host state.

## Host 1: `routerViewEmpty`

The minimal host controller lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-router/src/component/routerViewEmpty/controller.tsx
```

### Zova-native role

`routerViewEmpty` is the minimal routed host.

It is for cases where the page should render directly without the richer tab/workspace model.

### Source-confirmed runtime behavior

This host overrides `render()` instead of using the base `BeanRouterViewBase.render()` pipeline.

That means it:

- renders a plain `RouterView`
- creates the routed vnode directly from `component.Component`
- injects the current page route provider
- does **not** use the base keep-alive inclusion flow
- does **not** ask a host model to compute `tabKey` or `componentKey`

A practical reading takeaway is:

- **`routerViewEmpty` is the lowest-friction routed host and the closest thing to a shell-minimal route outlet in Zova**

## Host 2: `routerViewTabs`

The tabs host controller lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx
```

Its shared model lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts
```

### Zova-native role

`routerViewTabs` is the routed host for the workbench-style tabs model.

It does not invent a second routing system.

Instead it reinterprets normal route visits as:

- stable level-1 workspaces through `tabKey`
- level-2 routed page instances through `componentKey`
- task-level page presentation through `pageMeta`
- keep-alive participation through the tabs model

### Source-confirmed runtime behavior

The controller itself is intentionally thin.

It delegates these responsibilities to `ModelTabs`:

- `backRoute(...)`
- `forwardRoute(...)`
- `setPageMeta(...)`
- `prepareRouteMeta(...)`
- `keepAliveInclude`

That means the tabs host is really the shell-facing controller surface for the model, while `ModelTabs` is the real state owner.

### What `ModelTabs` actually owns

Inside `ModelTabs`, the main responsibilities are:

- keep the `tabs` array as the workbench-state owner
- track `tabKeyCurrent` and `componentKeyCurrent`
- compute `tabCurrent` and `tabCurrentIndex`
- compute `keepAliveInclude`
- load cached tab state when enabled
- add, update, activate, prune, and delete tabs and tab items
- update task-level `pageMeta`
- derive route-level host metadata from route meta and route identity

This is the main source-level fact about `a-routertabs`:

- **the workbench model is implemented as a model bean, not as ad hoc layout-local state**

### How route identity becomes workbench identity

`ModelTabs.prepareRouteMeta(route)` does four important things:

1. keeps `fullPath`
2. computes `componentKey`
3. computes `tabKey`
4. computes `keepAlive`

The key rules are:

- explicit `meta.componentKey` has highest priority
- otherwise a named route with `componentKeyMode: 'nameOnly'` reuses the route name
- otherwise the route path becomes the effective page-instance identity
- explicit `meta.tabKey` groups several route visits into one workspace
- if `meta.tabKey` is absent, the model falls back to `componentKey`

That is why [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook) is really a host-behavior document as much as a route-meta document.

### Why page metadata matters here

`ModelTabs.updateTabItemPageMeta(...)` stores page-level task state such as:

- `pageTitle`
- `pageDirty`
- `formMeta`

This is how task-level routed state becomes visible in workbench UI.

In the current Basic source, the Admin layout uses this for task-row icon and title behavior such as dirty state and create/edit indicators.

### Current Cabloy Basic consumers

In the current public Cabloy Basic source, `routerViewTabs` is the actively used richer routed host.

Representative consumers:

- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/controller.tsx`
- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx`
- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/controller.tsx`
- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx`

The source-confirmed split is:

- Admin renders the two-level workbench meaning directly
- Web reuses the same `ModelTabs` state but presents the top level as a menu-like workspace surface

### Config-sensitive differences in current Basic source

Representative config sources:

- `zova/src/suite/a-home/modules/home-layoutadmin/src/config/config.ts`
- `zova/src/suite/a-home/modules/home-layoutweb/src/config/config.ts`

In the current Basic source:

- Admin uses `scene: ''`, `max: 6`, `maxItems: 3`, `cache: true`
- Web uses `scene: 'web'`, `max: 6`, `maxItems: 6`, `cache: false`

That means the shared tabs model is stable, but the layout can still choose different cache and density behavior.

## Host 3: `routerViewStack`

The stack host controller lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-routerstack/src/component/routerViewStack/controller.tsx
```

Its shared model lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-routerstack/src/model/stack.ts
```

### Zova-native role

`routerViewStack` is the minimal richer host for stack-style routed caching.

Unlike `routerViewTabs`, it does not model a stable business workspace plus nested work items.

Instead it treats routed visits as a linear stack of page instances.

### Source-confirmed runtime behavior

The controller mirrors the tabs host shape, but with a smaller contract:

- `backRoute(...)` delegates to `ModelStack.backRoute(...)`
- `forwardRoute(...)` delegates to `ModelStack.forwardRoute(...)`
- `prepareRouteMeta(...)` delegates to `ModelStack.prepareRouteMeta(...)`
- `getKeepAliveInclude()` delegates to `ModelStack.keepAliveInclude`

There is no `setPageMeta(...)` override here.

That is an important difference from `routerViewTabs`.

### What `ModelStack` actually owns

Inside `ModelStack`, the main responsibilities are:

- keep the `tabs` array as a linear stack of routed instances
- compute `keepAliveInclude`
- add, update, delete, and prune stack items by recency
- map both `tabKey` and `componentKey` to `route.fullPath`

The crucial identity rule is:

```typescript
return { tabKey: fullPath, componentKey: fullPath, fullPath };
```

That means:

- each concrete route visit is its own stack item
- there is no level-1 workspace grouping
- there is no separate task-level page-meta model
- the host behaves more like a bounded stack of routed instances than a business workbench

### Practical interpretation

`routerViewStack` is useful when you want:

- routed keep-alive behavior
- per-visit identity
- simple pruning by recency
- no extra workbench grouping semantics

A practical reading takeaway is:

- **`a-routerstack` is a host-level cache/stack primitive, not a tabs/workspace mechanism**

If your next question is specifically about how a page author should update task-level title, dirty state, or form scene through `$router.setPageMeta(...)`, continue with [Page Meta Guide](/frontend/page-meta-guide).

### Current usage boundary in Cabloy Basic

In the current public Cabloy Basic source, there is no app-level layout consumer of `ZRouterViewStack` outside the vendor module itself.

That means the stack host is present as a reusable framework primitive, but the current public Basic layouts visibly consume `routerViewTabs` rather than `routerViewStack`.

This is a source-confirmed statement based on the current repo search surface, not a guarantee about all future editions or downstream apps.

## Empty vs tabs vs stack

A useful routing-host comparison is:

| Host              | Main role                     | Identity model            | Page-meta support            | Current Basic consumer shape                                 |
| ----------------- | ----------------------------- | ------------------------- | ---------------------------- | ------------------------------------------------------------ |
| `routerViewEmpty` | minimal routed host           | no richer host model      | no host-level page-meta flow | empty/minimal shell routing                                  |
| `routerViewTabs`  | workbench host                | `tabKey` + `componentKey` | yes                          | Admin and Web layouts                                        |
| `routerViewStack` | stack-style routed cache host | `fullPath` only           | no                           | framework primitive, no current public Basic layout consumer |

## How to choose the right mental model while reading source

Use these questions first:

### When the page feels shell-minimal

Start with `routerViewEmpty`.

Ask:

- does this route only need plain routed output?
- is keep-alive or workspace state intentionally absent?

### When the page feels like part of a workbench

Start with `routerViewTabs` and `ModelTabs`.

Ask:

- does this route need stable workspace grouping?
- does it need several inner work items?
- does page-level dirty/title/form state matter visibly?

### When the page feels like a linear routed cache

Start with `routerViewStack` and `ModelStack`.

Ask:

- does each route visit stand alone?
- is fullPath-level identity enough?
- do I want pruning and keep-alive without the two-level workspace model?

## Suggested source-reading path

When the question is specifically about routed hosts, read these files in order:

1. `zova/src/suite-vendor/a-zova/modules/a-router/src/lib/routerViewBase.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-router/src/component/routerViewEmpty/controller.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx`
4. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-routerstack/src/component/routerViewStack/controller.tsx`
6. `zova/src/suite-vendor/a-zova/modules/a-routerstack/src/model/stack.ts`
7. the active layout controller/render pair that consumes the host you care about

In the current Basic source, the most important app-level consumers are:

- `home-layoutadmin`
- `home-layoutweb`

## Common mistakes to avoid

### Mistake 1: treating `RouterView` as the whole routed contract

In Zova, the routed host can add keep-alive, grouping, task-state, and shell-specific behavior on top of route matching.

### Mistake 2: assuming router tabs are only a UI widget

In Zova, `a-routertabs` is a routed host plus a shared workbench-state model.

### Mistake 3: assuming `a-routerstack` is just a smaller copy of `a-routertabs`

It is not.

`a-routerstack` uses a different identity model and does not carry the same page-meta and workspace semantics.

### Mistake 4: assuming current Basic layout usage defines the full framework contract

Current Basic source confirms active consumers for `routerViewTabs`, but `routerViewStack` still exists as a reusable framework host primitive even when the current public layouts do not use it.

## Edition note

This guide describes the shared routed-host architecture and the current public Cabloy Basic source.

That means the host contract is not limited to one visible Admin tab row. However, layout-level presentation and actual host selection can still vary by edition, flavor, or downstream app.

## Final takeaway

If [Zova Router Under the Hood](/frontend/zova-router-under-the-hood) explains how a route becomes routable, this page explains how that routed page is actually hosted after route resolution.

That host layer is where Zova distinguishes among plain routed output, workbench tabs, and stack-style routed caching.
