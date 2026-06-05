# SSR Overview

This page migrates the highest-value ideas from the legacy Zova SSR introduction.

## What Zova SSR provides

Zova includes a built-in SSR solution that supports both front-end applications and admin systems.

The important point for the new docs is not the implementation detail alone. It is the developer experience goal:

SSR should feel like a normal part of the application model rather than a separate, awkward mode that forces unrelated coding patterns.

## Key SSR capabilities highlighted in the legacy docs

### Support for multiple UI-library strategies

Zova SSR can be used together with different UI-library strategies. This matters directly for Cabloy editions because Basic and Start diverge on frontend stack assumptions.

### Theme support

The SSR story includes theme-related behavior, including dark/light patterns and admin-oriented theme behavior.

### Sidebar and client-state integration

For admin systems, SSR still needs to cooperate with client-facing behavior such as sidebar state.

### Initialize data

A central SSR capability is preparing initial data on the server, synchronizing it to the client, and completing hydration naturally.

### SEO meta

SSR also supports flexible SEO metadata handling.

### Env configuration

SSR behavior can depend on environment variables and configuration choices, so SSR docs should be read together with the runtime/flavor model and frontend script model.

## Why this matters for AI workflows

When an AI system changes SSR-sensitive code, it should ask:

1. does this logic run on the server, the client, or both?
2. does this affect initialization or hydration?
3. does the active edition change the UI-library assumptions behind the SSR workflow?
4. does the existing Zova SSR abstraction already cover this case?

That keeps SSR work aligned with the framework instead of drifting into generic frontend patterns.
