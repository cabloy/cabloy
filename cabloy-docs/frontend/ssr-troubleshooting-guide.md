# SSR Troubleshooting Guide

This guide explains how to debug common SSR problems in Zova within the Cabloy monorepo.

## Why this page exists

The other SSR pages explain how the SSR model is supposed to work.

This page answers a different question:

- when SSR behavior is wrong, where should you look first?

That matters because SSR issues are easy to misclassify.

A symptom that looks like “frontend rendering is broken” can actually come from:

- SSR site routing on the backend side
- a missing or stale frontend bundle
- SSR-only route or data-loading behavior
- hydration mismatch on the client
- edition-specific theme assumptions

A good troubleshooting flow starts by identifying **which layer is failing** before trying to patch the symptom directly.

## Start with the four-layer model

Use the [SSR Architecture Overview](/frontend/ssr-architecture-overview) as the first mental model.

For troubleshooting, the practical layer split is:

1. **Vona SSR orchestration**
   - request entry
   - SSR site matching
   - dev proxy versus built asset versus SSR render
2. **frontend build output**
   - SSR entry
   - manifest
   - client assets
3. **Zova SSR server render**
   - route resolution
   - HTML render
   - state/meta/preload generation
4. **client hydration**
   - initial state reuse
   - browser-only behavior
   - final theme and DOM state

If you identify the failing layer first, most SSR debugging becomes much faster.

## Fast symptom-to-layer map

Use this quick map before diving deeper.

| Symptom | Start here |
| --- | --- |
| request does not hit the expected SSR page | Vona SSR orchestration |
| dev works but prod fails | frontend build output + SSR env/runtime |
| HTML appears but hydration is wrong | client hydration |
| server-rendered data is missing or refetched unexpectedly | Zova SSR server render + init data flow |
| SEO/meta output is missing | Zova SSR server render + meta flow |
| first paint theme is wrong | SSR env + theme rules |
| static assets 404 after SSR deploy | frontend build output |

## Symptom 1: the request does not hit the expected SSR page

Typical signs:

- a page that should be SSR-rendered falls through to another route
- a URL returns the wrong site
- SSR works for one path prefix but not another

Start with these questions:

1. is the request entering the correct SSR site at all?
2. is the path prefix/site selection correct?
3. are you expecting SSR where the route is actually a normal backend or static path?

A practical debugging order is:

- confirm the target URL and SSR site assumptions
- re-check the SSR architecture split in [SSR Architecture Overview](/frontend/ssr-architecture-overview)
- verify whether the problem is a site-entry issue rather than a page-render issue

If the request never reaches the intended SSR site, do **not** start by changing page components or hydration logic.

## Symptom 2: dev works but prod fails

Typical signs:

- SSR works through the dev server but breaks after build
- dev shows the page, while prod returns missing asset or render errors
- only built deployments show the problem

This usually means the issue is not only “SSR logic.”

It often means one of these instead:

- build output is stale or incomplete
- the expected frontend bundle was not generated for the target flavor
- SSR env/runtime assumptions differ between dev and prod
- asset paths or manifest assumptions are wrong after build

Start with these checks:

1. was the relevant frontend SSR build actually regenerated?
2. are you targeting the correct flavor for the active edition?
3. does the issue happen before page render, during page render, or only after hydration?

Read together:

- [SSR Architecture Overview](/frontend/ssr-architecture-overview)
- [SSR Environment Variables](/frontend/ssr-env)
- [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)

## Symptom 3: HTML appears, but hydration is wrong

Typical signs:

- server HTML looks right at first, then changes unexpectedly on the client
- hydration mismatch warnings appear
- browser-only UI behaves differently from the server output
- the first screen “flashes” into a different state after load

This usually means the server render and the browser’s final state are not using exactly the same assumptions.

Common causes include:

- browser-only logic running too early
- client-only components not being isolated properly
- theme-sensitive output being treated as authoritative on the server when it is not
- state that was expected to transfer through SSR not being reused correctly during hydration

Start with these checks:

1. does this UI depend on browser APIs or client-only rendering behavior?
2. should part of the UI be wrapped in `ClientOnly`?
3. is the code assuming the server already knows the browser’s final theme?
4. is the client reusing server-provided state, or recomputing a different result?

Read together:

- [SSR ClientOnly](/frontend/ssr-client-only)
- [SSR Init Data](/frontend/ssr-init-data)
- [SSR Environment Variables](/frontend/ssr-env)
- [Theme Guide](/frontend/theme-guide)

## Symptom 4: server-rendered data is missing or is fetched again unexpectedly

Typical signs:

- the page renders without expected data on the server
- the client repeats the first data fetch that should have been prepared already
- loading behavior is different between SSR and client navigation

A better default in Zova is:

- prepare SSR data through the intended model/controller flow
- let hydration reuse that prepared state on the client

Start with these checks:

1. is the data prepared in the intended SSR lifecycle rather than in an ad hoc client path?
2. is the data-loading logic aligned with the model-based SSR flow?
3. are you accidentally bypassing the existing hydration reuse path?

Read together:

- [SSR Init Data](/frontend/ssr-init-data)
- [Server Data](/frontend/server-data)
- [Model State Guide](/frontend/model-state-guide)

## Symptom 5: SEO/meta output is missing or inconsistent

Typical signs:

- page title is wrong after SSR
- expected meta tags are missing in server-rendered HTML
- metadata looks correct on the client but not in the initial server response

This usually means the metadata is not being produced through the intended SSR-aware path.

Start with these checks:

1. are you using `$useMeta` instead of a parallel custom mechanism?
2. is the metadata available during SSR rather than only after client boot?
3. are multiple metadata layers overwriting each other intentionally or accidentally?

Read together:

- [SSR SEO Meta](/frontend/ssr-seo-meta)
- [SSR Architecture Overview](/frontend/ssr-architecture-overview)

## Symptom 6: theme or dark-mode behavior is wrong on first paint

Typical signs:

- server output uses one theme, then the browser switches to another immediately
- dark/light SSR output looks unstable
- the result differs between Web SSR and Admin SSR

This area is especially sensitive because SSR theme authority is not identical in every flavor.

Start with these checks:

1. are you treating the server’s theme-sensitive read as final browser truth?
2. does the active flavor support cookie-backed SSR theme resolution?
3. are you applying a Basic-specific theme assumption to a different edition or adapter?

Read together:

- [SSR Environment Variables](/frontend/ssr-env)
- [Theme Guide](/frontend/theme-guide)
- [SSR Architecture Overview](/frontend/ssr-architecture-overview)

A practical rule is:

- if exact browser theme matching matters, keep the output hydration-tolerant unless the active SSR path provides a stronger server-side guarantee

## Symptom 7: static assets 404 after SSR deploy

Typical signs:

- HTML response appears, but CSS or JS assets do not load
- SSR page shell renders without expected styling or scripts
- built deployment fails while local dev works

This usually points to bundle output or deployment-path issues rather than page logic.

Start with these checks:

1. was the correct frontend build generated?
2. are the expected client assets present for the deployed bundle?
3. does the deployment path still match the built asset assumptions?

Read together:

- [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)
- [Environment and Config Guide](/frontend/environment-config-guide)
- [SSR Architecture Overview](/frontend/ssr-architecture-overview)

## A safe debugging order

When SSR breaks and the failure is unclear, use this order.

### Step 1: identify the first broken stage

Ask:

- is the request entering the intended SSR site?
- is the server returning HTML at all?
- is the HTML already wrong before hydration?
- does it only go wrong after the browser starts running?

### Step 2: separate server-render problems from hydration problems

This split removes a lot of confusion.

- if the initial HTML is wrong, focus on SSR entry, route resolution, render, data, or meta
- if the initial HTML is right but the browser changes it incorrectly, focus on hydration, client-only boundaries, theme authority, or client state reuse

### Step 3: check edition-sensitive assumptions

Especially for theme or UI-sensitive work, confirm:

- active edition
- active UI layer
- whether the rule is shared across editions or adapter-specific

### Step 4: reuse the framework’s intended abstractions

Before adding custom fixes, ask whether the framework already provides the right surface:

- `ClientOnly` for browser-only UI
- model/controller SSR init flow for data preparation
- `$useMeta` for SEO/meta
- existing theme/env rules for theme-sensitive SSR behavior

## Recommended reading order for troubleshooting

Use this path when SSR behavior is wrong and you need to narrow the problem quickly:

1. this page for symptom triage
2. [SSR Architecture Overview](/frontend/ssr-architecture-overview)
3. [SSR Overview](/frontend/ssr-overview)
4. [SSR Init Data](/frontend/ssr-init-data)
5. [SSR ClientOnly](/frontend/ssr-client-only)
6. [SSR SEO Meta](/frontend/ssr-seo-meta)
7. [SSR Environment Variables](/frontend/ssr-env)
8. [Theme Guide](/frontend/theme-guide)
9. [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)

## Implementation checks for SSR troubleshooting

Before finalizing an SSR fix, ask:

1. did I identify the failing SSR layer before changing code?
2. is this actually a server-render issue, or a hydration issue?
3. am I reusing the intended framework abstraction instead of adding a parallel workaround?
4. does the fix accidentally assume an edition-specific UI or theme rule is universal?

That keeps SSR debugging aligned with the Cabloy fullstack model and reduces one-off fixes that solve only the symptom.