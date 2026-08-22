# SSR Overview

This guide explains the overall SSR model in Zova within the Cabloy monorepo.

## What Zova SSR provides

Zova includes a built-in SSR solution that supports both front-end applications and admin systems.

The important point for the new docs is not the implementation detail alone. It is the developer experience goal:

SSR should feel like a normal part of the application model rather than a separate, awkward mode that forces unrelated coding patterns.

## Key SSR capabilities

### Support for multiple UI-library strategies

Zova SSR can be used together with different UI-library strategies. This matters directly for Cabloy editions because Basic and Start diverge on frontend stack assumptions.

### Theme support

The SSR story includes theme-related behavior, including dark/light patterns and admin-oriented theme behavior.

### Sidebar and client-state integration

For admin systems, SSR still needs to cooperate with client-facing behavior such as sidebar state.

### Initialize data

A central SSR capability is preparing initial data on the server, synchronizing it to the client, and completing hydration naturally.

### Initial hydration completion

For browser work that must wait for the initial SSR handoff, register `this.$ssr.onHydrated(...)`. The callback runs once only after the SSR root and every currently tracked Zova nested hydration boundary complete, including deferred client updates. Root mount alone is not sufficient when an async component or controller is still hydrating.

This lifecycle applies only to the initial client hydration of SSR HTML. It is not an SPA-startup or later client-navigation readiness signal. Do not render a client-ready marker into server HTML; add it from an `onHydrated(...)` callback when browser-visible evidence is required.

For work that is safe to run immediately in an SPA, but must wait until hydration in an SSR document, use `this.$ssr.handleDirectOrOnHydrated(...)`:

```ts
this.$ssr.handleDirectOrOnHydrated(() => {
  // browser-only work
});
```

The helper is a client-only boundary. It returns without invoking the callback on the server; during the browser's initial SSR hydration it queues the callback through `onHydrated(...)`; and for SPA startup or after hydration it invokes the callback immediately. Callers should not wrap this helper in a second `process.env.CLIENT` guard. Do not put server-required initialization inside the callback; keep server work outside the helper and use the helper only for browser-only work.

For a render-time branch, use `this.$ssr.isRuntimeSsrHydrated`. It is reactive and is `false` during server rendering and the browser's initial hydration render, then `true` after that hydration completes. It is also immediately `true` for SPA startup and later client navigation. Use it to retain the same neutral shell before hydration and begin private or browser-only queries and UI afterward. It indicates only SSR-hydration lifecycle readiness, not completed route admission, authentication, or data loading.

### SEO meta

SSR also supports flexible SEO metadata handling.

### Env configuration

SSR behavior can depend on environment variables and configuration choices, so SSR docs should be read together with the runtime/flavor model and frontend script model.

## Implementation checks for SSR-sensitive changes

When changing SSR-sensitive code, ask:

1. does this logic run on the server, the client, or both?
2. does this affect initialization or hydration?
3. does the active edition change the UI-library assumptions behind the SSR workflow?
4. does the existing Zova SSR abstraction already cover this case?

That keeps SSR work aligned with the framework instead of drifting into generic frontend patterns.
