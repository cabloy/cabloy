# Router Tabs Introduction

This guide is the landing page for the router-tabs documentation set in Zova within the Cabloy monorepo.

Use it to understand what the router-tabs mechanism is, which questions each companion document answers, and what order to read them in.

## What router tabs are

Router tabs provide a workbench-style navigation model for frontend layouts that need more than a simple route-transition model.

In the current Cabloy Basic source, the mechanism supports:

- stable workspace-level grouping
- task-level page-instance switching inside a workspace
- keep-alive integration for routed work items
- optional cache restoration for workbench state
- more than one layout presentation on top of the same shared model

That means router tabs are not only a visual tab bar. They are a route-grouping and workbench-state mechanism.

## Start here when you need to answer these questions

### What business problem does this solve?

Read [Router Tabs Overview](/frontend/router-tabs-overview).

This document explains:

- why admin-style applications need more than a simple menu transition model
- why workspace identity and task identity should stay separate
- how the mechanism supports parallel work and workbench continuity

### How does the mechanism work in code?

Read [Router Tabs Mechanism](/frontend/router-tabs-mechanism).

This document explains:

- the shared state model
- `tabKey` and `componentKey`
- page metadata, keep-alive, cache, and pruning behavior
- the relationship between the shared model and concrete layouts

### How should I author route meta for this?

Read [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook).

This document explains:

- practical recipes for `tabKey`
- when to use `componentKeyMode`
- when to define explicit `componentKey`
- when to disable keep-alive
- common authoring mistakes to avoid

### How do Admin and Web layouts differ?

Read [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison).

This document explains:

- what both layouts share
- how Admin exposes the two-level model directly
- how Web reuses the same model with a different shell style
- why layout-specific UI should not be confused with shared mechanism semantics

## Recommended reading paths

### Product or architecture perspective

Recommended order:

1. [Router Tabs Overview](/frontend/router-tabs-overview)
2. [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
3. [Router Tabs Mechanism](/frontend/router-tabs-mechanism)

### Frontend implementation perspective

Recommended order:

1. [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
2. [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
3. [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)

### Maintenance and refactor perspective

Recommended order:

1. [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
2. [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
3. `.docs-internal/architecture/router-tabs-design-boundaries.md`

## Scope boundary

The public router-tabs docs explain the shared frontend mechanism and how to use it.

For internal design boundaries, maintenance invariants, and refactor safety rules, see:

- `.docs-internal/architecture/router-tabs-design-boundaries.md`

## See also

- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
- [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
