# Router Tabs Overview

This guide explains the business meaning of the router tabs mechanism in Zova within the Cabloy monorepo.

In the current Cabloy Basic frontend source, the same mechanism supports more than one layout style. The Admin layout shows the two-level meaning explicitly, while the Web layout reuses the same model with a menu-oriented top-level presentation.

## Why router tabs matter

In a simple application, a left-side menu plus route navigation can be enough.

In an admin-style application, that is often not enough.

Users usually need to:

- move across several business modules
- keep the current working context of each module
- open more than one task inside the same module
- switch between unfinished tasks without losing their place

That is the main problem solved by router tabs.

The mechanism is not only a visual tab bar. It is a workbench-style navigation model.

## The two levels at a glance

In the Admin layout, the two levels serve different purposes:

- level-1 tabs represent business modules or workspaces
- level-2 tabs represent concrete tasks or page instances inside the current workspace

This separation is the key idea.

A user should be able to say both:

- "I am working in Order Management"
- "Inside Order Management, I currently have Create Order and Edit Order 2026001 open"

That is exactly what the two levels express.

## Business meaning of level-1 tabs

A level-1 tab represents the broader business area the user is working in.

Typical examples include:

- Home
- User Management
- Order Management
- Content Management

This level should stay relatively stable.

Its job is not to reflect every temporary page the user opens. Its job is to preserve the higher-level workspace identity.

In practice, this gives the user a stable top-level navigation surface even when the detailed work inside a module changes frequently.

In Cabloy Basic Admin, the current level-1 title and icon are typically derived from the menu model rather than from the current inner page title. That is why the first level behaves more like a business workspace than like a raw route list.

## Business meaning of level-2 tabs

A level-2 tab represents a concrete working item inside the current level-1 tab.

Typical examples include:

- a create page
- an edit page
- a detail page
- a preview page
- multiple records opened in parallel

This makes the interaction model much closer to a desktop workbench or IDE.

Instead of repeatedly returning to a list and reopening records one by one, the user can keep several work items open and switch between them directly.

In practice, the second level is where task identity becomes visible. A level-2 item can represent "Create User", "Edit User A", or "Edit User B" even though all of them still belong to the same level-1 workspace such as User Management.

## Why not use only one level

A single-level tab system often becomes unstable in admin workflows.

If every open page appears at the top level, the tab bar can quickly become noisy:

- User Management
- Edit User A
- Edit User B
- Order Management
- Edit Order X
- Create Order
- Content Management
- Edit Article 1

At that point, the top level is no longer a clean business navigation layer.

The two-level design avoids that problem:

- level-1 tabs keep the business structure stable
- level-2 tabs hold the temporary work items

This keeps navigation and working context separate.

## Typical admin scenarios

Two-level router tabs are especially useful in these cases.

### Parallel work inside one module

A user may need to:

- create a new user
- edit an existing user
- compare two records
- check a detail page while keeping a form open

These are not separate business modules. They are parallel tasks inside the same module.

### Frequent switching across modules

A user may need to:

- inspect an order
- jump to a user profile
- return to inventory
- go back to the previous order task

The mechanism allows the user to switch business areas without losing the active work context of each area.

### Long-running form workflows

Some forms are not completed in one uninterrupted pass.

Users may leave a form, handle another task, and then return later.

A tabbed workbench model supports that better than a strict list-detail-return cycle.

## Visual and interaction meaning

The two levels carry different kinds of information.

### Level-1 tabs

Level-1 tabs usually communicate:

- business identity
- module title
- module icon
- whether the workspace is pinned or fixed

### Level-2 tabs

Level-2 tabs usually communicate:

- page or record title
- current task identity
- whether the page is dirty
- whether the page is in create or edit mode

This means the user can see not only where they are working, but also what state the current work item is in.

## Workbench continuity

Another important value is continuity.

A module tab is not just a shortcut to a menu entry. It acts more like a workspace anchor.

When the user returns to a level-1 tab, the system can restore the working context associated with that tab instead of forcing the user to start navigation from scratch each time.

This is one of the main reasons the mechanism feels more like a workbench than a simple menu wrapper.

## Admin and Web layout perspective

The current Cabloy Basic source shows that router tabs are a mechanism first and a specific visual shape second.

### Admin layout

The Admin layout exposes the two-level meaning directly:

- a first row for workspace-level tabs
- a second row for task-level items inside the active workspace

This is the clearest illustration of the level-1 and level-2 split.

### Web layout

The Web layout reuses the same underlying tab model but presents the first level more like a menu-driven horizontal workspace surface.

That means future contributors should avoid assuming that the framework contract is identical to one concrete tab-row UI.

The durable idea is the route-to-workspace model, not only the exact Admin visual treatment.

## When this pattern is a good fit

This pattern is a good fit when the frontend behaves like a business workbench, especially when users need:

- multi-step task flows
- repeated switching across modules
- several open records at once
- persistent working context
- form-heavy operations

It is less important for simple content sites or low-interaction flows where a single route transition is enough.

## Recommended design questions

When deciding whether a page or feature should participate in router tabs, ask these questions first:

1. is this a real business workspace or only a temporary route?
2. should several related pages stay grouped under one stable module identity?
3. do users need to keep more than one work item open at the same time?
4. does the page need visible task state such as dirty/create/edit indicators?

If most answers are yes, the router-tabs workbench model is usually a strong fit.

## Summary

The router tabs mechanism separates two different concerns:

- business-module switching
- task-level page switching inside the current module

That separation improves clarity, preserves working context, and supports parallel task handling in admin-style applications.

## See also

- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)
- [Router Tabs Admin and Web Comparison](/frontend/router-tabs-admin-web-comparison)
