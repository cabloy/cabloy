# Router Tabs vs Stack

This guide explains when to think in **Router Tabs** and when to think in **Router Stack** in Zova.

Use this page when you want to answer questions like:

- should this routed host behave like a workbench or like a linear routed stack?
- when do I need `tabKey` and `componentKey`?
- when is `fullPath` identity enough?
- when should page-meta-aware work items exist, and when are they unnecessary?

## Why this comparison exists

The current frontend docs already explain the two nearby branches separately:

- [Router Tabs Introduction](/frontend/router-tabs-introduction) and the rest of the tabs series explain the workbench-tabs branch
- [Router Stack Guide](/frontend/router-stack-guide) explains the stack branch
- [Router View Hosts Guide](/frontend/router-view-hosts-guide) explains the shared routed-host layer above both

What many readers still need next is a decision page.

That is the gap this guide fills.

This page is intentionally a chooser between two host models. For the shared host boundary, keep [Router View Hosts Guide](/frontend/router-view-hosts-guide) as the main reference, and use this page only when the host question has already narrowed to tabs vs stack.

## The shortest accurate mental model

A practical mental model is:

- **Router Tabs** = a workbench model with business/workspace grouping plus page-instance identity
- **Router Stack** = a linear routed-cache model where each route visit is one host identity

If you need grouped workspaces and task-level state, think in Tabs.

If you need a simple per-visit routed stack, think in Stack.

## The core difference in one table

| Question                                         | Router Tabs                                 | Router Stack                                            |
| ------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------- |
| What owns the host state?                        | `ModelTabs`                                 | `ModelStack`                                            |
| What is the host controller?                     | `ControllerRouterViewTabs`                  | `ControllerRouterViewStack`                             |
| What is the main identity model?                 | `tabKey` + `componentKey`                   | `fullPath`                                              |
| What is `tabKey` for?                            | level-1 workspace grouping                  | same as `fullPath` identity                             |
| What is `componentKey` for?                      | level-2 page-instance identity              | same as `fullPath` identity                             |
| Does it support workbench semantics?             | yes                                         | no                                                      |
| Does it support page-meta-aware task updates?    | yes                                         | no dedicated stack equivalent                           |
| What kind of pruning does it do?                 | tab/work-item pruning inside the tabs model | linear recency-based pruning                            |
| What is the current public Basic shell emphasis? | visible and central                         | framework primitive, not the main visible shell pattern |

## Identity model: Tabs

The tabs branch separates two questions:

1. which business/workspace does this route belong to?
2. which page instance inside that workspace is this?

That is why `ModelTabs` works with both:

- `tabKey`
- `componentKey`

A compact interpretation is:

- `tabKey` = level-1 grouping identity
- `componentKey` = level-2 page-instance identity

This is the right model when multiple routed visits should still belong to one durable business workspace.

## Identity model: Stack

The stack branch collapses routed identity to `fullPath`.

In `ModelStack.prepareRouteMeta(...)`, the stack host returns:

- `tabKey = route.fullPath`
- `componentKey = route.fullPath`
- `fullPath = route.fullPath`

That means a stack visit is treated as one linear routed entry.

This is the right model when per-visit identity is enough and you do not need a separate workspace grouping layer.

## Page-meta and workbench semantics

The tabs branch supports richer task/workbench semantics.

In the current public source:

- `ControllerRouterViewTabs` forwards `setPageMeta(...)`
- `ModelTabs` stores and updates page-meta information per routed work item

That makes tabs a good fit for:

- workbench titles
- dirty state
- task-level UI state that belongs to an open work item

The stack branch does not add that richer page-meta ownership model.

That is why stack should not be treated as “tabs with fewer UI decorations.” It is a different host model.

## Choose Tabs when

Choose Router Tabs when you need:

- stable business/workspace grouping
- more than one open work item inside that grouping
- page-instance reuse decisions separate from workspace identity
- task-level page-meta behavior
- the current public Basic Admin/Web-style workbench semantics

This is the normal fit for the existing Router Tabs series.

## Choose Stack when

Choose Router Stack when you need:

- a simpler per-visit routed host
- one identity per route visit
- bounded linear routed caching
- recency-based pruning without workbench grouping
- no tabs-style page-meta/workspace semantics

This is the normal fit when `fullPath` identity is the main thing that matters.

## Current Cabloy Basic visibility note

In the current public Basic source:

- Router Tabs are the visibly emphasized shell model in the existing public layout docs
- Router Stack exists as a real framework host primitive
- Router Stack should therefore be understood as an available routed-host strategy, not as the most prominent visible Basic shell pattern

This distinction matters because the framework capability and the currently emphasized public shell are not always the same thing.

## Suggested decision rule

Use this quick rule:

1. do you need a durable business/workspace grouping layer?
   - yes -> choose **Router Tabs**
   - no -> continue
2. do you only need each route visit to behave like one linear cached routed item?
   - yes -> choose **Router Stack**
   - no -> re-check whether you actually need tabs-level semantics

## Read together with

Use this page together with:

- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Router Stack Guide](/frontend/router-stack-guide)
- [A-Router Guide](/frontend/a-router-guide)

## Final takeaway

The most accurate distinction is:

- **Router Tabs** are for grouped workbench semantics
- **Router Stack** is for linear routed-cache semantics

If you need workspace grouping, task identity, and page-meta-aware work items, think in Tabs.

If you need one identity per route visit with simpler recency-based caching, think in Stack.
