# Frontend Source Reading Roadmap

This page is a lightweight roadmap for reading the Cabloy Basic frontend source.

Use it when your question is not yet “which exact runtime file should I open next?” but:

- where should I start reading?
- which topic cluster matches my question?
- should I begin with an overview page, an under-the-hood page, or a source-reading map?

## Why this page exists

The current frontend docs now include:

- broad overview pages
- under-the-hood/runtime explanations
- source-reading maps
- many focused deep dives for specific runtime chains

That is good for depth, but it also means readers can reach the “which page next?” problem before they reach the “which file next?” problem.

This page solves that problem.

It is a chooser, not another runtime explainer.

## How to use this page

Use this rule of thumb:

- if you are new to the topic, start with an **overview** page
- if you already understand the public concept and want runtime behavior, go to an **under-the-hood** page
- if you already know the topic and want the shortest path through source files, go to a **source-reading map** page
- if your question is very narrow and practical, go directly to the relevant **deep dive** page

## Architecture spine: start here first

If you need the shortest path into the frontend mental model, start with these pages:

- [Introduction](/frontend/introduction)
- [Foundation](/frontend/foundation)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [Zova vs Vue 3 Comparison](/frontend/zova-vs-vue3-comparison)
- [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

A practical reading order is:

1. Introduction
2. Foundation
3. Reading Zova for Vue Developers
4. Zova Source Reading Map

## Topic cluster: app shell and startup

Start here when your question is about the root app host, startup, shell behaviors, or root composition.

### Overview / concept pages

- [App Startup Guide](/frontend/app-startup-guide)
- [Behavior Guide](/frontend/behavior-guide)

### Focused deep dives

- [Zova App Guide](/frontend/zova-app-guide)
- [Root Behaviors Guide](/frontend/root-behaviors-guide)

### Best next step

- if the question is “what is the root app host?” -> read [Zova App Guide](/frontend/zova-app-guide)
- if the question is “how do app-wide behaviors wrap the routed tree?” -> read [Root Behaviors Guide](/frontend/root-behaviors-guide)

## Topic cluster: routing and routed hosts

Start here when your question is about route identity, routed hosts, tabs/stack, or task-level shell state.

### Overview / concept pages

- [Page Route Guide](/frontend/page-route-guide)
- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Overview](/frontend/router-tabs-overview)

### Under-the-hood / runtime pages

- [A-Router Guide](/frontend/a-router-guide)
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)

### Focused deep dives

- [Page Meta Guide](/frontend/page-meta-guide)
- [Router Tabs vs Stack](/frontend/router-tabs-vs-stack)
- [Router Stack Guide](/frontend/router-stack-guide)

### Best next step

- if the question is “how do routes become operational?” -> read [A-Router Guide](/frontend/a-router-guide)
- if the question is “which host owns the routed page instance?” -> read [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- if the question is “what is the workbench meaning of router tabs?” -> read [Router Tabs Overview](/frontend/router-tabs-overview)
- if the question is “how does tabs state work?” -> read [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- if the question is “how should I choose between tabs and stack?” -> read [Router Tabs vs Stack](/frontend/router-tabs-vs-stack)

## Topic cluster: forms

Start here when your question is about `ZForm`, `formMeta`, page-entry forms, or form-driven shell state.

### Overview / concept pages

- [Form Guide](/frontend/form-guide)

### Under-the-hood / runtime pages

- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)

### Focused deep dives

- [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- [Schema-Driven Field Effects Guide](/frontend/schema-driven-field-effects-guide)

### Best next step

- if the question is “how does form runtime work?” -> read [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- if the question is “how does `formScene` become shell-visible state?” -> read [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- if the question is “how does backend/schema metadata drive field-level reactive behavior?” -> read [Schema-Driven Field Effects Guide](/frontend/schema-driven-field-effects-guide)

## Topic cluster: resources and ModelResource

Start here when your question is about resource-driven CRUD pages, `ModelResource`, or route/resource/runtime assembly.

### Overview / concept pages

- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Using ModelResource in Your Module](/frontend/model-resource-usage-guide)

### Under-the-hood / runtime pages

- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)

### Focused deep dives

- [A-Model Under the Hood](/frontend/a-model-under-the-hood)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)
- [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- [Filter to Query to Select Data Flow Guide](/frontend/filter-query-select-data-flow-guide)

### Best next step

- if the question is “why does the resource owner exist?” -> read [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- if the question is “how does the owner itself work internally?” -> read [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- if the question is “how does the entry page runtime fit together?” -> read [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)
- if the question is “how does the list page runtime fit together?” -> read [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- if the question is “how does filter state become list data?” -> read [Filter to Query to Select Data Flow Guide](/frontend/filter-query-select-data-flow-guide)

## Topic cluster: tables

Start here when your question is about `ZTable`, schema-driven columns, row/bulk actions, or table runtime.

### Overview / concept pages

- [Table Guide](/frontend/table-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)

### Under-the-hood / runtime pages

- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)

### Focused deep dives

- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- [Zova Table Controller Render Supplement](/frontend/zova-table-controller-render-supplement)

### Best next step

- if the question is “how does the table runtime work?” -> read [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- if the question is “how do row/bulk actions become visible or hidden?” -> read [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)

## Topic cluster: server data and lower-level shared runtime

Start here when your question is about schema-driven server-data consumption, SDK/runtime loading, or lower-level metadata infrastructure.

### Overview / concept pages

- [Server Data](/frontend/server-data)
- [SDK Guide](/frontend/sdk-guide)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [API Schema Guide](/frontend/api-schema-guide)

### Focused deep dives

- [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)
- [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch)
- [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch)
- [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook)
- [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist)
- [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood)

### Best next step

- if the question is “how do I consume the server-data ladder?” -> read [Server Data](/frontend/server-data)
- if the question is “what does generated contract consumption look like in one practical frontend path?” -> read [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen), then choose the list or entry branch
- if the question is “how do I prove or diagnose the generated-contract consumer path?” -> continue with [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook) or [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist)
- if the question is “how does the lower-level OpenAPI/schema runtime work?” -> read [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood)

## Topic cluster: SSR

Start here when your question is about SSR orchestration, hydration, SEO meta, or SSR troubleshooting.

### Overview / concept pages

- [SSR Architecture Overview](/frontend/ssr-architecture-overview)
- [SSR Overview](/frontend/ssr-overview)
- [SSR Init Data](/frontend/ssr-init-data)
- [SSR SEO Meta](/frontend/ssr-seo-meta)

### Best next step

- if the question is “which side owns this SSR behavior?” -> read [SSR Architecture Overview](/frontend/ssr-architecture-overview)
- if the question is “is this document/meta or task-level shell state?” -> compare [SSR SEO Meta](/frontend/ssr-seo-meta) with [Page Meta Guide](/frontend/page-meta-guide)

## Recent deep dives and maps

If you already know the cluster and want the most focused next page, these are the most useful recent deep dives/maps:

- [Root Behaviors Guide](/frontend/root-behaviors-guide)
- [A-Router Guide](/frontend/a-router-guide)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)
- [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- [Filter to Query to Select Data Flow Guide](/frontend/filter-query-select-data-flow-guide)
- [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood)

## Final rule

When in doubt:

1. pick the cluster on this page
2. read the overview page first
3. move to the under-the-hood page
4. only then move to the source-reading map or deep dive

This roadmap is the chooser.

The detailed runtime explanations still belong to the cluster-specific pages.
