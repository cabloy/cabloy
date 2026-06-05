# SDK Guide

This page expands the legacy `$sdk` placeholder into a practical guidance page for the new docs site.

## What `$sdk` is for

`$sdk` can be understood as a more generalized schema-driven access layer built on the same broader server-data model.

If `$apiSchema` exposes the metadata directly, `$sdk` represents a more application-friendly way to package schema-driven capabilities into a unified development experience.

## Why `$sdk` matters

The server-data thread in Zova is not only about calling endpoints. It is also about turning backend metadata into reusable frontend capabilities.

That is the context in which `$sdk` matters.

## How to think about the layers together

- `$fetch` → direct transport-oriented calls
- `$api` → business-oriented request services
- `Model` → cached remote state and UI-facing reuse
- `OpenAPI SDK` → generated client services from backend metadata
- `$apiSchema` → direct schema access
- `$sdk` → a more generalized schema-driven integration layer

## Why this matters for AI workflows

When AI is asked to build metadata-driven frontend behavior, it should not stop at “can I call the API?”

It should also ask:

- should this use the generated SDK?
- should this use schema metadata?
- should this be packaged into a more reusable `$sdk`-style abstraction?

That mindset produces more reusable frontend architecture.
