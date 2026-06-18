# Router Tabs Layout Integration

This guide explains how the current Cabloy Basic layouts turn `ModelTabs` into visible router shell behavior in Zova.

Use this page after [Router View Hosts Guide](/frontend/router-view-hosts-guide) and [Router Tabs Mechanism](/frontend/router-tabs-mechanism) when your next question is no longer “how does the tabs model work?” but “how do the real layout controllers and render beans turn that model into the Admin or Web shell?”.

Read this page together with:

- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Page Meta Guide](/frontend/page-meta-guide)
- [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

> [!TIP]
> **Router ecosystem docs path**
> 1. **[Page Route Guide](/frontend/page-route-guide)** — learn the public route-record and layout surface
> 2. **[Zova Router Under the Hood](/frontend/zova-router-under-the-hood)** — learn how the core router runtime cooperates
> 3. **[Router View Hosts Guide](/frontend/router-view-hosts-guide)** — learn how routed pages are actually hosted
> 4. **[Router Tabs Mechanism](/frontend/router-tabs-mechanism)** — learn how the tabs host turns route visits into state
> 5. **[Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)** — learn how the current Basic layouts turn that state into visible shell behavior
> 6. **[Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)** — learn how route metadata intentionally drives the model
>
> **You are here:** step 5.
> **Previous pages:** [Router View Hosts Guide](/frontend/router-view-hosts-guide) and [Router Tabs Mechanism](/frontend/router-tabs-mechanism).
> **Next recommended page:** [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook).

## Why this page exists

The current router-tabs docs already explain:

- the business meaning of router tabs
- the shared `ModelTabs` mechanism
- the Admin vs Web visual comparison
- the route-meta inputs that drive the model

What contributors and AI workflows still often want next is the layout-integration bridge:

- where `ModelTabs` is created inside a real layout controller
- how the layout chooses `tabsOptions`
- how the render bean turns `tabs` into a visible shell
- which parts are shared model semantics and which parts are layout presentation

This page is that bridge.

If your next question is specifically about how page code feeds task-level title, dirty state, or form scene into the visible shell, continue with [Page Meta Guide](/frontend/page-meta-guide).

## The shortest accurate mental model

For the current public Cabloy Basic source, the shortest accurate model is:

1. the layout controller loads menus and creates a `ModelTabs` selector bean
2. the layout passes layout-specific `tabsOptions` such as `scene`, `max`, `maxItems`, and `cache`
3. the shared `ZRouterViewTabs` host keeps route visits and keep-alive behavior synchronized with `ModelTabs`
4. the layout render bean reads `$$modelTabs.tabs`, `tabCurrent`, and related state to produce the visible shell
5. Admin and Web reuse the same underlying tabs model but project it into different top-level UI structures

That is why layout integration is not merely cosmetic. It is the point where shared router-tabs state becomes the concrete shell experience.

## The source files that matter most

### Admin layout integration

- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/controller.tsx`
- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx`
- `zova/src/suite/a-home/modules/home-layoutadmin/src/config/config.ts`

### Web layout integration

- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/controller.tsx`
- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx`
- `zova/src/suite/a-home/modules/home-layoutweb/src/config/config.ts`

### Shared host/model layer used by both

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx`
- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`

## Step-by-step layout integration path

### 1. The layout controller, not the render bean, creates `ModelTabs`

The real integration starts in the layout controller.

In both Admin and Web, the controller is where:

- menus are loaded
- tabs config is read from the layout scope config
- a selector-scoped `ModelTabs` bean is created
- later menu changes refresh or reset visible tab info

This is the first important source-level fact about layout integration:

- **the render bean does not own tabs state**
- **the layout controller owns the decision to create and configure the tabs model**

## 2. Admin layout integration

Representative controller source:

```text
zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/controller.tsx
```

### Zova-native role

The Admin layout controller creates a workbench-oriented tabs model whose top level is anchored to menu-backed business workspaces.

### Source-confirmed runtime behavior

Inside `_initTabs()` the Admin layout:

- reads `this.scope.config.tabs`
- builds `tabsOptions`
- uses `this.bean._getBeanSelector('a-routertabs.model.tabs', true, configTabs.scene, tabsOptions)`
- keeps the selected model on `this.$$modelTabs`
- watches menu data and calls `updateAllTabInfos()` when menus change

The important Admin-specific `tabsOptions` behavior is:

- `getInitialTabs()` returns `[{ tabKey: '/', affix: true }]` once menus are available
- `getTabInfo(tabKey)` resolves title and icon from the menu model by `link`

That means the Admin layout does two important things for the shared tabs model:

1. it guarantees a fixed affixed top-level home workspace
2. it derives visible workspace labels from menu-backed business information rather than from temporary page state

### Why this matters

This is why Admin level-1 tabs feel stable and business-oriented.

The model itself is generic, but the layout controller injects business-facing tab identity and the initial affixed workspace rule.

## 3. Admin render integration

Representative render source:

```text
zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx
```

### Zova-native role

The Admin render bean turns `ModelTabs` into an explicit two-level workbench shell.

### Source-confirmed runtime behavior

The render bean exposes three main surfaces:

- `renderTabs()` for level-1 workspace tabs
- `renderTabItems()` for level-2 task items
- `_renderRouterViewTabs()` for the actual routed host outlet

Important details:

- level-1 rows iterate over `$$modelTabs.tabs`
- clicking a level-1 tab calls `$$modelTabs.activeTab(tabKey)`
- non-affix level-1 tabs expose `deleteTab(tabKey)`
- level-2 rows read `$$modelTabs.tabCurrent.items`
- the anchor item is intentionally skipped when `componentKey === tabKey`
- clicking a level-2 item calls `activeTabItem(tabKey, componentKey)`
- deleting a level-2 item calls `deleteTabItem(...)`
- page-level icon state is derived from `pageMeta` such as `pageDirty` and `formMeta.formScene`
- the actual routed content still enters through `<ZRouterViewTabs>`

For the authoring-side write path that produces those `pageMeta` values, see [Page Meta Guide](/frontend/page-meta-guide).

This is the second important source-level fact about layout integration:

- **the layout render bean does not replace the router host**
- **it wraps the shared host with a visible shell that reads the same model state**

### What the Admin shell makes visible

Admin makes these model semantics explicit:

- level-1 workspace grouping
- level-2 task items
- dirty indicators
- create/edit task indicators
- close actions for both outer and inner levels

That is why Admin is the clearest business-meaning specimen for router tabs.

## 4. Web layout integration

Representative controller source:

```text
zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/controller.tsx
```

### Zova-native role

The Web layout controller creates a tabs model that is still shared in semantics, but whose initial top-level state is derived from the menu tree rather than from one affixed home workspace.

### Source-confirmed runtime behavior

Inside `_initTabs()` the Web layout:

- reads `this.scope.config.tabs`
- builds `tabsOptions`
- creates the same selector-scoped `ModelTabs` bean
- watches menu data and calls `resetAllTabInfos()` when menus change

The important Web-specific `tabsOptions` behavior is:

- `getInitialTabs()` returns one item per top-level menu tree entry
- each initial tab uses `item.folder ? item.name : item.link` as `tabKey`
- `info` is stored directly from the menu tree item

That means the Web layout treats top-level workspace entries more like shell navigation nodes than like one pre-affixed home workspace plus later-opened work areas.

### Why this matters

This is why the Web shell can feel menu-driven at the top level while still relying on the same `ModelTabs` state underneath.

The model stays shared, but the controller chooses a different initialization strategy.

## 5. Web render integration

Representative render source:

```text
zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx
```

### Zova-native role

The Web render bean projects the same tabs model into a horizontal menu-like shell.

### Source-confirmed runtime behavior

The render bean:

- iterates over `$$modelTabs.tabs`
- renders top-level entries through `_renderMenuItem(...)`
- supports folder, separator, and leaf menu shapes
- uses `tabKey === $$modelTabs.tabKeyCurrent` for top-level active state
- lets top-level shell clicks call `$$modelTabs.activeTab(tabKey)`
- lets nested leaf links navigate through `RouterLink`
- still renders the actual routed content through `<ZRouterViewTabs>`

This is the third important source-level fact about layout integration:

- **Web does not abandon the tabs model**
- **it simply renders the top-level workspace state through a menu-oriented shell instead of an explicit lifted tab row**

## 6. Config is part of layout integration, not an afterthought

Representative config sources:

- `zova/src/suite/a-home/modules/home-layoutadmin/src/config/config.ts`
- `zova/src/suite/a-home/modules/home-layoutweb/src/config/config.ts`

### Current Basic source values

Admin:

- `scene: ''`
- `max: 6`
- `maxItems: 3`
- `cache: true`
- `tabItem.maxWidth: '130px'`

Web:

- `scene: 'web'`
- `max: 6`
- `maxItems: 6`
- `cache: false`

### Why this matters

These config differences directly shape shell behavior:

- `scene` chooses the selector-space identity of the tabs model
- `max` and `maxItems` change pruning density
- `cache` changes whether shell state is restored through cached model state
- Admin-only `tabItem.maxWidth` shapes inner task-row presentation

A practical reading takeaway is:

- **layout integration includes controller logic, render logic, and config together**

## 7. What is shared vs what is layout-specific

### Shared semantics

These remain in the shared model/host layer:

- route-to-workspace mapping
- `tabKey` and `componentKey` meaning
- keep-alive inclusion
- activation and pruning behavior
- page-meta storage on tab items
- routed content entering through `ZRouterViewTabs`

### Layout-specific behavior

These belong mainly to the layout integration layer:

- how top-level entries are initialized from menu state
- whether there is an affixed home workspace
- whether the second level is shown explicitly
- whether the top level looks like tabs or a horizontal menu
- how close buttons, item width, and icon density are presented

This is the key boundary to preserve:

- **change shared semantics in the host/model layer only when the framework contract should change**
- **change visual shell behavior in the layout layer when only presentation should change**

## 8. A practical reading order for source readers

If your question is specifically about how `ModelTabs` becomes a visible shell, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx`
3. `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/controller.tsx`
4. `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx`
5. `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/controller.tsx`
6. `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx`
7. the two layout config files

Use Admin first when you want the clearest expression of the workbench model.
Use Web next when you want to confirm that the same model can back a different shell style.

## Common mistakes to avoid

### Mistake 1: treating the layout render bean as the tabs state owner

It is not.

The render bean projects state visually. The controller and shared model own the state.

### Mistake 2: assuming Admin-specific tab rows define the whole router-tabs contract

They do not.

Admin is one visible projection of a broader routed-host and tabs-model contract.

### Mistake 3: assuming Web is not using router tabs because it looks like a menu

It is still using `ModelTabs` and `ZRouterViewTabs`.

Only the shell projection differs.

### Mistake 4: changing layout presentation when the real change belongs in `ModelTabs`

If the behavior should be shared across shells, change the shared model/host layer first.

If only the visible shell should differ, change the layout layer first.

## Edition note

This guide is source-confirmed against the current public Cabloy Basic layouts.

That means the integration story here is accurate for the current Basic Admin and Web shells, but should not be overgeneralized to every future edition or downstream layout without verification.

## Final takeaway

If [Router Tabs Mechanism](/frontend/router-tabs-mechanism) explains how the shared tabs model works, this page explains how the real Basic layouts turn that shared model into visible shell behavior.

That is the missing bridge between framework-level tabs semantics and the actual layout code contributors edit.