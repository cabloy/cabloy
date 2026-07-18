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

For browser work that must wait for the initial SSR handoff, register `this.$ssr.onHydrated(...)`. The callback runs once after the SSR root and Zova-tracked nested hydration work complete, including deferred client updates.

This lifecycle applies only to the initial client hydration of SSR HTML. It is not an SPA-startup or later client-navigation readiness signal. Do not render a client-ready marker into server HTML; add it from an `onHydrated(...)` callback when browser-visible evidence is required.

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
