# Router Tabs Introduction

This guide is the landing page for the router-tabs documentation set in Zova within the Cabloy monorepo.

Use it to understand what the router-tabs mechanism is, how it fits into the broader routed-host layer, which questions each companion document answers, and what order to read them in.

## What router tabs are

Router tabs are one routed-host strategy built on top of the shared Zova router-view host layer.

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

If your real question is whether this should be modeled as tabs at all, compare it first with [Router Tabs vs Stack](/frontend/router-tabs-vs-stack), then read [Router Stack Guide](/frontend/router-stack-guide) if the stack branch is a better fit.

This document explains:

- the shared state model
- `tabKey` and `componentKey`
- page metadata, keep-alive, cache, and pruning behavior
- the relationship between the shared model and concrete layouts

For authoring-focused page metadata usage, continue with [Page Meta Guide](/frontend/page-meta-guide).

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

## Router ecosystem map

Use this compact map when you want the shortest accurate document order for Zova routing and routed-shell behavior.

| If your question is mainly about                                                            | Read this next                                                               | Then continue with                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| route records, shell/layout choice, and the public route surface                            | [Page Route Guide](/frontend/page-route-guide)                               | [Route Alias Guide](/frontend/route-alias-guide), [Navigation Guards Guide](/frontend/navigation-guards-guide)                                                                                              |
| route registration, startup, lazy loading, and controller route-state injection             | [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)           | [Router View Hosts Guide](/frontend/router-view-hosts-guide)                                                                                                                                                |
| why one routed page behaves like an empty shell while another behaves like a workbench host | [Router View Hosts Guide](/frontend/router-view-hosts-guide)                 | this page, then [Router Tabs Mechanism](/frontend/router-tabs-mechanism)                                                                                                                                    |
| the business meaning of router tabs                                                         | [Router Tabs Overview](/frontend/router-tabs-overview)                       | [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)                                                                                                                          |
| how the tabs model works in code                                                            | [Router Tabs Mechanism](/frontend/router-tabs-mechanism)                     | [Page Meta Guide](/frontend/page-meta-guide), [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration), then [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook) |
| how the current Basic layouts turn the shared tabs model into a visible shell               | [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)   | [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)                                                                                                                          |
| how to intentionally author `tabKey`, `componentKey`, and `keepAlive`                       | [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook) | [Zova Source Reading Map](/frontend/zova-source-reading-map)                                                                                                                                                |
| which files to read first for a targeted source dive                                        | [Zova Source Reading Map](/frontend/zova-source-reading-map)                 | the branch that matches your current question                                                                                                                                                               |

## Recommended reading paths

### Product or architecture perspective

Recommended order:

1. [Router Tabs Overview](/frontend/router-tabs-overview)
2. [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
3. [Router Tabs Mechanism](/frontend/router-tabs-mechanism)

### Frontend implementation perspective

Recommended order:

1. [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
2. [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)
3. [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
4. [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)

### Maintenance and refactor perspective

Recommended order:

1. [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
2. [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
3. inspect the current implementation and public comparison guidance for refactor boundaries

## Scope boundary

The public router-tabs docs explain the shared frontend mechanism and how to use it.

For maintainer-only design boundaries, maintenance invariants, and refactor safety rules, consult an established internal-documentation home when the active repository provides one. The public mechanism, layout, route-meta, and Admin/Web comparison guides remain the shared implementation baseline.

## See also

- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
- [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
