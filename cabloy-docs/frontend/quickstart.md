# Frontend Quickstart

This guide explains the fastest way to get oriented on the frontend side of the Cabloy framework repository.

If you want to create and use a Cabloy project, start with [Fullstack Quickstart](/fullstack/quickstart).

## When to use this page

Use this page when you want to move from the framework repository root to the first visible routed screen in Zova with the right edition and script assumptions.

This page is the frontend narrative hub for framework-repository work such as:

- detecting the active edition
- choosing the right root scripts and frontend flavors
- understanding how startup and routing make the app routable
- understanding the app shell around routed pages
- reaching the first routed page and knowing what to read next

## Step 1: detect the edition first

Before choosing frontend examples, scripts, or shell assumptions, detect whether you are working in:

- **Cabloy Basic**
- **Cabloy Start**

When working in this framework repository, the active edition is **Cabloy Basic**.

That matters because edition choice affects:

- frontend flavor names
- UI-layer assumptions
- available modules, layouts, and SSR site baselines
- project assets and examples
- which examples in the docs match the current repo directly

Read together with:

- [Edition Detection](/editions/detection)
- [Cabloy Basic](/editions/cabloy-basic)
- [Cabloy Start](/editions/cabloy-start)

## Step 2: start from root scripts

When working in the framework repository, begin from the root repository scripts.

These commands are repository-root workflows for framework development and verification, not the default bootstrap path for a normal Cabloy project.

### Install and initialize the framework workspace

```bash
npm run init
```

### Start frontend development for Cabloy Basic

```bash
npm run dev:zova:admin
npm run dev:zova:web
```

These root wrappers currently map to the Basic flavors:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

### Build frontend output for Cabloy Basic

```bash
npm run build:zova
```

Use the root wrappers as the normal entrypoint for this framework repository, then read the deeper script guide when you need appMode/flavor detail.

Read together with:

- [Reference Introduction](/reference/introduction)
- [Repo Scripts](/reference/repo-scripts)
- [Frontend Scripts](/frontend/scripts)

## Step 3: understand runtime selection

Frontend behavior is not chosen by one flag only. It is shaped by:

- `mode`
- `appMode`
- `flavor`

Those runtime choices affect:

- which config and env values are active
- which shell/layout components are resolved
- how startup and routing behave in the current frontend variant
- which edition-specific script examples apply

Read next:

- [Environment and Config Guide](/frontend/environment-config-guide)

## Step 4: understand how the app becomes routable

A practical startup split is:

- **system startup** registers routes and loads system-level config before the app can really become routable
- **app startup** makes router, guards, and first-navigation behavior operational for the running app instance

That means the first visible screen is not only a page concern. It depends on the startup sequence that prepares routing and navigation behavior first.

Read in sequence:

1. [System Startup Guide](/frontend/system-startup-guide)
2. [App Startup Guide](/frontend/app-startup-guide)

## Step 5: understand the app shell

A routed page does not appear alone. It appears inside an app shell.

In practice, the shell is the layout layer around the routed page. Route metadata chooses a logical layout such as `default` or `empty`, and env/config resolves that logical choice into the actual layout component for the active runtime variant.

In the current Basic source, the most important shell shapes are represented by:

- admin-style layout behavior
- web-style layout behavior
- empty/minimal layout behavior

This is why route metadata, guards, aliases, and theme/header/menu behavior should be understood together rather than as unrelated features.

Read together with:

- [Page Route Guide](/frontend/page-route-guide)
- [Navigation Guards Guide](/frontend/navigation-guards-guide)
- [Route Alias Guide](/frontend/route-alias-guide)
- [Theme Guide](/frontend/theme-guide)

## Step 6: reach the first routed page

Once the edition and runtime path are clear, the fastest practical next step is to create a page and understand where it appears.

A useful frontend-first sequence is:

1. create or choose a module
2. create a page in that module
3. let Zova generate the route record and page path
4. confirm which shell/layout the route should use
5. run the matching frontend flavor and inspect the result

The generated route path follows Zova’s module-oriented naming conventions, so the first page is part of the broader routing and shell model rather than a free-form standalone screen.

Read next:

- [Frontend CLI](/frontend/cli)
- [Page Guide](/frontend/page-guide)
- [Page Route Guide](/frontend/page-route-guide)

## Step 7: understand menu and CLI ergonomics

Zova supports both command-line and editor-driven workflows.

A practical distinction is:

- **CLI** is the canonical automation and scriptable workflow surface
- **editor menus** improve discoverability and ergonomics for the same underlying workflows

That means frontend onboarding should not force a choice between the two. Use menus when they help you discover commands quickly, and use the CLI when you need reproducible automation or explicit command history.

Read next:

- [Frontend CLI](/frontend/cli)

## Recommended next paths

### I want to run and inspect the frontend shell

- [Frontend Scripts](/frontend/scripts)
- [Environment and Config Guide](/frontend/environment-config-guide)
- [Page Route Guide](/frontend/page-route-guide)
- [Theme Guide](/frontend/theme-guide)

### I want to understand startup and routing

- [System Startup Guide](/frontend/system-startup-guide)
- [App Startup Guide](/frontend/app-startup-guide)
- [Page Route Guide](/frontend/page-route-guide)
- [Navigation Guards Guide](/frontend/navigation-guards-guide)
- [Route Alias Guide](/frontend/route-alias-guide)

### I want to create my first page

- [Frontend CLI](/frontend/cli)
- [Page Guide](/frontend/page-guide)
- [Page Route Guide](/frontend/page-route-guide)

### I need edition-sensitive guidance

- [Edition Detection](/editions/detection)
- [Cabloy Basic](/editions/cabloy-basic)
- [Cabloy Start](/editions/cabloy-start)
- [Frontend Scripts](/frontend/scripts)

### I want the broader frontend architecture story

- [Frontend (Zova)](/frontend/introduction)
- [Frontend Foundation](/frontend/foundation)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)
- [Zova vs Vue 3 Comparison](/frontend/zova-vs-vue3-comparison)
- [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)
- [Design Principles](/frontend/design-principles)
