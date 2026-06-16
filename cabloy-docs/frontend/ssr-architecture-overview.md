# SSR Architecture Overview

This guide explains the public SSR architecture model in Zova within the Cabloy monorepo.

## Why this page exists

The other SSR pages explain focused topics such as init data, client-only boundaries, SEO meta, and env behavior.

This page explains the larger mental model:

- where SSR starts
- how Vona and Zova cooperate
- what the generated frontend bundle contributes
- how server render hands off to client hydration

That model helps contributors and AI workflows place SSR changes in the correct layer instead of treating SSR as a single opaque step.

## The shortest accurate SSR model

Cabloy SSR is a coordinated fullstack flow:

1. **Vona** receives the request and decides whether the request should be handled as SSR
2. **Vona SSR integration** loads the built frontend SSR bundle for the matching site
3. **Zova SSR runtime** resolves the page route and renders HTML on the server
4. **Zova SSR state/meta logic** injects the data needed for hydration
5. **the browser** hydrates the page and continues as a normal client application

The important point is that SSR is not frontend-only and not backend-only.

It is one connected request flow across both sides of the framework.

## The four practical layers

In these docs, **frontend build output** includes the SSR bundle entry plus the client assets used after render.

### 1. Vona SSR orchestration

This layer owns the outer request lifecycle.

Its responsibilities include:

- receiving the HTTP request
- matching the request to the correct SSR site
- deciding between dev proxy, built static asset, or SSR render
- loading the built SSR entry for the site
- writing the final HTML response

A practical way to think about this layer is:

- **Vona decides whether SSR should happen and which site should handle it**

### 2. Generated frontend SSR bundle

Each SSR site produces a built bundle that the backend can load.

This bundle contributes:

- the SSR entry used by the backend
- the client assets used after render
- the manifest/preload information needed by the SSR runtime

A practical way to think about this layer is:

- **the frontend build produces the server-renderable application package**

### 3. Zova server-side SSR runtime

This layer owns the actual server render of the frontend application.

Its responsibilities include:

- resolving the target route inside the frontend application
- creating the SSR context
- rendering the application to HTML
- collecting preload information for used modules/assets
- returning the final HTML shell

A practical way to think about this layer is:

- **Zova turns the built frontend application into server-rendered HTML**

### 4. Zova hydration handoff

After server render, the framework still needs to transfer state into the browser correctly.

This layer owns:

- injecting initial SSR state into the HTML
- injecting SSR-aware meta output
- preserving data needed for hydration
- resuming on the client without redoing the whole first-screen work unnecessarily

A practical way to think about this layer is:

- **SSR finishes only when hydration has a clean handoff path**

## End-to-end request flow

A useful high-level sequence is:

```text
browser request
  -> Vona receives the URL
  -> Vona matches the SSR site
  -> Vona chooses dev proxy, static asset, or SSR render
  -> Vona loads the built frontend SSR entry
  -> Zova resolves the frontend route
  -> Zova renders HTML on the server
  -> Zova injects state/meta/preload output
  -> Vona returns the HTML response
  -> browser hydrates the page
```

This sequence is the durable contract even if specific internal implementation details evolve.

## What each side owns

### Vona mainly owns

- request entry
- SSR site matching
- HTTP response lifecycle
- SSR site-level environment assembly
- backend-side integration with the built frontend bundle

### Zova mainly owns

- frontend route resolution during SSR
- server rendering of the frontend application
- SSR state and meta injection
- hydration-aware frontend runtime behavior

### The built bundle mainly owns

- the page/component tree itself
- the emitted SSR entry
- the client assets used after render

## Why this split matters

This split helps avoid common mistakes.

### Mistake 1: treating SSR as frontend-only

That misses the fact that Vona decides when SSR runs and how the frontend bundle is entered.

### Mistake 2: treating SSR as backend-only

That misses the fact that route resolution, HTML render, state injection, and hydration behavior are frontend runtime responsibilities.

### Mistake 3: debugging the wrong layer

For example:

- if the request never reaches the intended SSR site, start from the Vona side
- if the page route or rendered HTML is wrong after the frontend bundle is entered, continue on the Zova side
- if hydration or SSR-transferred state is wrong, focus on the SSR state/meta layer rather than only the outer request layer

## How to reason about SSR changes

When editing SSR-sensitive code, ask these questions first:

1. does this change affect **request routing** or **frontend rendering**?
2. does it affect the **server render result** or only the **client hydration result**?
3. does it belong to **site integration**, **frontend runtime**, or **page-level application code**?
4. does the active edition change only the UI layer, or does it change the SSR workflow itself?

That framing usually tells you where the change belongs before you start coding.

## Edition impact

For Cabloy Basic and Cabloy Start, the SSR architecture contract is shared at the framework level.

That means the same high-level model still applies:

- backend request entry
- frontend SSR bundle
- server render
- hydration handoff

What can differ by edition is usually:

- UI library assumptions
- site baselines
- frontend flavor names
- project assets and generated output paths

So the architecture model is shared, while some concrete frontend examples remain edition-sensitive.

## Recommended reading order

Use this order when you need the shortest path from mental model to implementation detail:

1. this page for the architecture overview
2. [SSR Overview](/frontend/ssr-overview)
3. [SSR Init Data](/frontend/ssr-init-data)
4. [SSR ClientOnly](/frontend/ssr-client-only)
5. [SSR SEO Meta](/frontend/ssr-seo-meta)
6. [SSR Env](/frontend/ssr-env)
7. [Fullstack Vona + Zova Integration](/fullstack/vona-zova-integration)

## Implementation checks for architecture-sensitive SSR changes

Before finalizing an SSR-related change, ask:

1. does the request still enter the correct SSR site?
2. does the server render still produce the intended HTML?
3. does the client reuse the server-provided state during hydration?
4. does the change assume a UI or theme behavior that is actually edition-specific?

That keeps SSR work aligned with the Cabloy fullstack model rather than drifting into generic frontend-only or backend-only assumptions.
