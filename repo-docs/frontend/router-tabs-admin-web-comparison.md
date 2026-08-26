# Router Tabs Admin and Web Comparison

This guide compares how the router-tabs mechanism appears in the Admin and Web layouts in Zova within the Cabloy monorepo.

Read this together with:

- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)

## Why this comparison matters

The current Cabloy Basic frontend source uses one shared router-tabs state model in more than one layout.

That means future contributors should not assume that the mechanism is identical to one specific tab-row UI.

The shared contract is the workbench-state and route-grouping model. The visible layout expression can vary.

## The shared foundation

Both layouts reuse the same router-tabs model.

They both depend on the same ideas:

- `tabKey` as the level-1 workspace grouping identity
- `componentKey` as the page-instance identity
- tab activation through router navigation
- keep-alive integration through the router-tabs controller
- cache, pruning, and item-state behavior in the shared model

Representative shared implementation:

- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/model/tabs.ts`
- `zova/src/suite-vendor/a-zova/modules/a-routertabs/src/component/routerViewTabs/controller.tsx`

## The main difference in one sentence

The Admin layout shows the workbench model as an explicit two-level tab UI, while the Web layout uses the same underlying state model but presents the top-level workspaces through a horizontal menu-like surface.

## Admin layout view

Representative sources:

- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/controller.tsx`
- `zova/src/suite/a-home/modules/home-layoutadmin/src/component/layoutAdmin/render.tabs.tsx`

### What users see

In the Admin layout, users can see the two levels directly:

- a first row for workspace-level tabs
- a second row for task-level items inside the current workspace

This is the clearest visual expression of the router-tabs workbench model.

### How level-1 behaves

In Admin, level-1 tabs are rendered from `RouteTab` records.

The visible title and icon are usually derived from menu-backed tab info rather than from the active inner page title.

That means the first row behaves like a business workspace selector.

### How level-2 behaves

In Admin, level-2 items are rendered from `tabCurrent.items`.

The second row shows task-level state such as:

- page title
- dirty state
- create/edit form state
- close actions for inner work items

The Admin layout also deliberately skips the anchor item when rendering the second row. That keeps the second level focused on additional work items rather than on the workspace anchor itself.

### When Admin is the best mental model

Use the Admin layout as the primary mental model when explaining:

- why router tabs are two-level in business meaning
- how one workspace can hold several work items
- how page metadata affects task-level presentation

## Web layout view

Representative sources:

- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/controller.tsx`
- `zova/src/suite/a-home/modules/home-layoutweb/src/component/layoutWeb/render.tabs.tsx`

### What users see

In the Web layout, the same router-tabs model is presented differently.

The top-level workspace surface is rendered more like a horizontal menu, with support for folders, leaves, and separators.

This means the visual experience is less like an IDE-style double tab bar and more like a menu-driven workspace shell.

### How top-level behavior works

The Web layout still uses `$$modelTabs.tabs` as the current workspace list.

However, instead of rendering a lifted tab row plus a bordered second row, it renders menu items that can:

- behave as top-level workspace entries
- expand folders
- navigate through menu leaf links
- highlight the active workspace

This is an important reminder that router tabs are not only a cosmetic tab component. They are a route-grouping and workbench-state mechanism that a layout can present in different ways.

### How grouping differs visually

In the Web layout, the grouping meaning can still be present even when the UI does not emphasize the second level in the same direct way as Admin.

That means the mechanism is still doing grouping and workspace-state management, but the visual expression is tuned for a different frontend shell style.

### When Web is the better mental model

Use the Web layout as the primary mental model when explaining:

- that the router-tabs model is reusable beyond one tab-row UI
- that top-level workspaces can be expressed through a menu-like shell
- that the framework contract is broader than the Admin visual treatment

## Comparison table

| Topic                     | Admin layout                           | Web layout                                             |
| ------------------------- | -------------------------------------- | ------------------------------------------------------ |
| Shared model              | router-tabs model                      | router-tabs model                                      |
| Top-level presentation    | explicit lifted tab row                | horizontal menu-like workspace surface                 |
| Second-level presentation | explicit bordered task row             | not emphasized in the same direct double-row way       |
| Primary user signal       | workbench tabs                         | menu-oriented workspace navigation                     |
| Best use as explanation   | business meaning of two levels         | portability of the shared mechanism                    |
| Risk if misread           | assuming Admin UI is the only contract | assuming menu presentation means tabs are not involved |

## What is shared and should stay shared

Future contributors should preserve these shared behaviors across layouts unless there is an intentional framework change:

- route-to-workspace mapping
- `tabKey` and `componentKey` semantics
- activation through router navigation
- keep-alive integration
- cache and pruning behavior in the shared model

If one layout needs different visuals, it should change the presentation layer first rather than casually rewriting the shared state semantics.

## What may differ safely by layout

These areas are more naturally layout-specific:

- how top-level workspaces are styled
- whether the second level is displayed explicitly
- icon placement and density
- close-button visibility
- whether the shell feels tab-centric or menu-centric

The key rule is:

- layout-specific UI may vary
- workbench-state semantics should stay intentional

## Common mistakes to avoid

Avoid these assumptions:

### Mistake 1: Admin rendering is the whole contract

This can lead contributors to hard-code two-row visual assumptions into framework-level decisions.

### Mistake 2: Web rendering means router tabs are not involved

This can lead contributors to ignore the shared state model and accidentally break workspace continuity.

### Mistake 3: layout differences justify changing `tabKey` or `componentKey` semantics

Usually they do not.

Those keys belong to the shared routing and state model, not only to one specific layout theme.

## Recommended guidance for future docs and implementation work

When documenting or extending this area:

1. explain the shared mechanism first
2. use Admin as the clearest business-meaning example
3. use Web as the proof that the mechanism is presentation-independent
4. keep route-meta guidance layout-neutral unless a real layout-specific exception exists

## Summary

The Admin and Web layouts do not represent two different router-tabs mechanisms.

They represent two different UI expressions of the same underlying workbench-state model.

Admin is the clearest example of explicit two-level tabs. Web is the clearest example that the same grouping and state model can power a different shell style without changing the core semantics.

## See also

- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
