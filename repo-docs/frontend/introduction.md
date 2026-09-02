# Frontend (Zova)

This page is the frontend hub for Cabloy users, contributors, and AI vibe coding workflows that need the frontend side of the framework.

Zova is the frontend layer of Cabloy’s one fullstack system, supporting bidirectional type sync, CLI-first workflows, and source-grounded docs and skills.

## What Zova is responsible for

- page and component architecture
- SSR, SPA, Web, and Admin rendering flows
- data access patterns such as `$fetch`, `$api`, and generated SDKs
- UI library integration
- route, icon, and component type generation
- frontend-side refactors and code generation through the Zova CLI

## How to approach frontend work

For contributor and automation workflows in this repository, prefer this order:

1. inspect the root `package.json` and `npm run zova` entrypoint
2. inspect Zova CLI command families such as `create:*`, `init:*`, `refactor:*`, `tools:*`, and `openapi:*`
3. inspect the active edition before assuming a UI stack
4. document shared concepts once, then isolate edition-specific notes where the module set or UI library differs

## Frontend reading paths

Use this page as the main frontend hub, then choose the path that matches your task.

### Getting started and architecture spine

Start here when you need the shortest route to the frontend mental model and startup context.

A practical rule is:

- if you need the broadest entry page, stay on this page
- if you need help choosing a topic cluster, continue with [Frontend Source Reading Roadmap](/frontend/frontend-source-reading-roadmap)
- if you already know the topic and want file-order guidance, continue with [Zova Source Reading Map](/frontend/zova-source-reading-map)

Recommended starting set:

- [Quickstart](/frontend/quickstart)
- [Foundation](/frontend/foundation)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [State Architecture for Vue Developers](/frontend/state-architecture-for-vue-developers)
- [Frontend Source Reading Roadmap](/frontend/frontend-source-reading-roadmap)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Design Principles](/frontend/design-principles)
- [Environment and Config Guide](/frontend/environment-config-guide)
- [App Startup Guide](/frontend/app-startup-guide)
- [System Startup Guide](/frontend/system-startup-guide)
- [Frontend Directory Structure](/reference/frontend-directory-structure)

### Page and routing flow

Use this path when the task is page-oriented, route-oriented, or the first time you need Zod in frontend params and query work:

- [Page Guide](/frontend/page-guide)
- [Page Query Guide](/frontend/page-query-guide)
- [Page Params Guide](/frontend/page-params-guide)
- [Zod Guide](/frontend/zod-guide)
- [Page Route Guide](/frontend/page-route-guide)
- [A-Router Guide](/frontend/a-router-guide)
- [Route Alias Guide](/frontend/route-alias-guide)
- [Navigation Guards Guide](/frontend/navigation-guards-guide)
- [Zova Router Under the Hood](/frontend/zova-router-under-the-hood)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Tabs Introduction](/frontend/router-tabs-introduction)
- [Router Tabs Overview](/frontend/router-tabs-overview)
- [Router Tabs Mechanism](/frontend/router-tabs-mechanism)
- [Page Meta Guide](/frontend/page-meta-guide)
- [Router Tabs Layout Integration](/frontend/router-tabs-layout-integration)
- [Router Tabs vs Stack](/frontend/router-tabs-vs-stack)
- [Router Stack Guide](/frontend/router-stack-guide)
- [Router Tabs Route Meta Cookbook](/frontend/router-tabs-route-meta-cookbook)

### Components and UI flow

Use this path when the task is about UI composition, component contracts, form or table architecture, form or table internals, form or table source reading, or theme work:

- [Component Guide](/frontend/component-guide)
- [Form Guide](/frontend/form-guide)
- [Form Layout Guide](/frontend/form-layout-guide)
- [Image Guide](/frontend/image-guide)
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)
- [Table Guide](/frontend/table-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)
- [Component Props Guide](/frontend/component-props-guide)
- [Component v-model Guide](/frontend/component-v-model-guide)
- [Generic Component Guide](/frontend/generic-component-guide)
- [CSS-in-JS Guide](/frontend/css-in-js-guide)
- [Theme Guide](/frontend/theme-guide)
- [Icon Engine Guide](/frontend/icon-engine-guide)

### Data, contract, and SSR flow

Use this path when the task is about data loading, API contracts, generated SDKs, or SSR behavior:

- [Server Data](/frontend/server-data)
- [API Guide](/frontend/api-guide)
- [Model Architecture](/frontend/model-architecture)
- [Model State Guide](/frontend/model-state-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- [Using ModelResource in Your Module](/frontend/model-resource-usage-guide)
- [Resource Model Best Practices](/frontend/model-resource-best-practices)
- [Resource Model Cookbook](/frontend/model-resource-cookbook)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [SDK Guide](/frontend/sdk-guide)
- [SSR Architecture Overview](/frontend/ssr-architecture-overview)
- [SSR Build and Deploy Guide](/frontend/ssr-build-deploy-guide)
- [SSR Troubleshooting Guide](/frontend/ssr-troubleshooting-guide)
- [SSR Review Checklist](/frontend/ssr-review-checklist)
- [SSR Overview](/frontend/ssr-overview)
- [SSR Init Data](/frontend/ssr-init-data)
- [SSR ClientOnly](/frontend/ssr-client-only)
- [SSR SEO Meta](/frontend/ssr-seo-meta)
- [SSR Env](/frontend/ssr-env)

### Tooling support

Use these pages when the work is about commands, scripts, or mock-driven iteration:

- [CLI](/frontend/cli)
- [Scripts](/frontend/scripts)
- [Mock Guide](/frontend/mock-guide)

## Edition impact

Frontend work is where Cabloy Basic and Cabloy Start differ most clearly.

- **Shared frontend engineering layer**: both editions follow the same Zova-centered frontend direction, with Vue, Vite, Quasar tooling, and related libraries.
- **Cabloy Basic UI layer**: current public docs and examples align with DaisyUI + Tailwind CSS.
- **Cabloy Start UI layer**: the public MIT-licensed edition aligns with Vuetify and may use different frontend modules, SSR site baselines, and project assets.

Because of this, automation and docs should always detect the active edition before recommending page-level, component-level, or UI-library-specific work.
