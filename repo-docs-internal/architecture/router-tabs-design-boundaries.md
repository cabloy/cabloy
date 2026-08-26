# Router Tabs Design Boundaries

This note records the current design intent, boundaries, and maintenance rules for the router-tabs mechanism in the Cabloy Basic frontend source.

Read this together with:

- `repo-docs/frontend/router-tabs-overview.md`
- `repo-docs/frontend/router-tabs-mechanism.md`

## Why this note exists

The router-tabs subsystem is easy to misread as only a UI tab-bar feature.

That is too narrow.

In the current source, router tabs are a workbench-state mechanism that happens to have one Admin-oriented two-row presentation and one Web-oriented menu-style presentation.

Future contributors are likely to break this area in one of three ways:

1. collapse business grouping and page-instance identity into the same key
2. treat one layout’s rendering as the full framework contract
3. preserve visible tab state while accidentally breaking navigation continuity, cache semantics, or keep-alive behavior

This note exists to keep those boundaries explicit.

## Design intent

The main intent is to preserve two different kinds of identity at the same time:

- business workspace identity
- page-instance identity inside the workspace

That is why the mechanism needs both `tabKey` and `componentKey`.

The design goal is not merely “support many tabs.” The design goal is to support a workbench interaction model where users can:

- switch across business modules
- keep each module’s current working context
- open more than one task in the same module
- return to previous work without rebuilding context from scratch

## Domain grouping vs instance identity

This is the most important boundary.

### `tabKey`

`tabKey` is the workspace grouping identity.

It answers:

- which level-1 workspace does this route belong to?

### `componentKey`

`componentKey` is the page-instance identity.

It answers:

- should this route visit reuse an existing inner page instance, or open a distinct one?

### Why the split matters

If contributors collapse both roles into one key, one of two failures usually follows:

1. **grouping failure**
   - every task becomes its own top-level workspace
   - the level-1 surface loses stable business meaning

2. **instance failure**
   - different records or tasks are forced into one reused inner page
   - users lose the ability to keep parallel work open

Future maintenance should preserve the rule:

- business grouping belongs to `tabKey`
- page-instance identity belongs to `componentKey`

## The anchor-item boundary

A level-1 tab usually contains a first item that acts as the anchor route for the workspace.

This item is not just an implementation accident.

It supports an important continuity rule:

- a workspace should still know how to navigate back into itself

In the Admin layout, the second-level row deliberately skips rendering this anchor item. That visual decision should not be misread as meaning the item is unnecessary.

The important distinction is:

- **model**: the anchor item remains part of the workspace state
- **UI**: the Admin second-level row may choose not to show it

If future refactors remove the anchor-item concept entirely, they must re-establish an equally stable workspace re-entry model.

## Menu-derived level-1 identity

In the Admin integration, level-1 tab info comes from the menu model.

That boundary is intentional.

Level-1 tabs represent a business workspace, so their title and icon should usually come from the business-navigation layer.

By contrast, level-2 items represent concrete work, so their visible state should usually come from page metadata such as `pageTitle`, `pageDirty`, or form scene information.

Future contributors should avoid mixing these roles casually.

Typical mistake:

- deriving level-1 labels directly from the currently active page title

That weakens the stable workspace identity and makes the top-level surface behave like a noisy route-history strip instead of a business workbench.

## Layout-specific UI vs shared mechanism

Another important boundary is between the shared mechanism and the active layout implementation.

### Shared mechanism

The reusable part includes:

- route-to-workspace mapping
- workspace and item state
- keep-alive include computation
- cache loading and persistence behavior
- pruning rules
- navigation activation logic

### Layout-specific expression

The layout decides how to present that state.

In the current source:

- Admin presents a visually explicit two-level tab model
- Web presents a menu-oriented top-level workspace model using the same underlying tabs state

Future maintainers should not treat the current Admin tab-row shape as the only valid expression of the subsystem.

The durable contract is the state model and navigation behavior, not one exact DOM shape.

## Cache recovery boundary

The router-tabs cache is intentionally selective.

The mechanism can restore workspace structure and item identity, but it resets `pageDirty` flags during recovery.

That behavior protects against a misleading UX state.

A restored page should not claim with certainty that it still has unsaved changes unless the application can truly reconstruct that state.

This means future work should preserve the principle:

- durable workspace structure may be restored
- fragile runtime-only dirty hints should not be restored blindly

If future product requirements need stronger draft recovery, that should be modeled as a more formal persisted draft capability, not as a casual change to the existing `pageDirty` reset rule.

## Keep-alive boundary

The keep-alive include list is derived from active tab items.

That means keep-alive behavior is not an unrelated page optimization. It is part of the workbench contract.

Users expect tab switching to preserve useful working state.

Future contributors should therefore treat these changes carefully:

- changing how `componentKey` is generated
- changing whether an item enters `keepAliveInclude`
- changing when old items are pruned

Each of those changes can alter whether the user experiences stable or unstable tab state.

## Capacity and pruning trade-offs

The mechanism supports bounded growth through `max` and `maxItems`.

This is not only a technical cleanup feature. It is part of the workbench trade-off:

- allow parallel work
- but do not let the tab model grow without bound

Current pruning behavior uses update time.

That is a reasonable default because it approximates stale-work cleanup while preserving more recent activity.

If a future refactor changes pruning strategy, it should preserve these questions explicitly:

1. are fixed or affixed workspaces still protected?
2. does the user lose important context unexpectedly?
3. does pruning still align with real workbench expectations?
4. does the change interact safely with keep-alive and cache restoration?

## Safe changes vs risky changes

### Usually safe

These are usually safe if verified carefully:

- improving labels, icons, or visual affordances
- adjusting layout-specific rendering styles
- adding clearer page metadata indicators
- refining docs and examples for `tabKey` and `componentKey`

### Potentially risky

These require subsystem-level reasoning:

- changing default `componentKey` derivation
- changing `tabKey` fallback behavior
- removing or redefining the anchor item
- restoring dirty state from cache without a formal persistence model
- treating Admin-only rendering assumptions as the framework contract
- changing prune semantics without checking workspace continuity side effects

## What future contributors should trace first

When changing this area, trace these paths first:

1. shared state model in `a-routertabs.model.tabs`
2. route preparation in `prepareRouteMeta`
3. Admin layout integration
4. Web layout integration
5. router-view tabs keep-alive boundary

This order helps separate framework behavior from layout behavior before edits are made.

## Invariants future work should preserve

Future refactors should preserve these boundaries:

- `tabKey` remains the workspace grouping key
- `componentKey` remains the page-instance key
- newly created workspaces open near the current context without breaking the affix prefix
- newly created work items open near the current active item in the same workspace
- revisiting an existing workspace or work item updates it in place rather than moving it
- workspace re-entry remains stable
- cached state restoration does not overclaim dirty state truth
- the shared mechanism remains distinguishable from any one layout’s rendering
- menu/business identity and page/task identity remain distinct authoring surfaces

## Related guidance

Read these materials together:

- `repo-docs/frontend/router-tabs-overview.md`
- `repo-docs/frontend/router-tabs-mechanism.md`
- `repo-docs-internal/architecture/ai-enablement.md`
