# API Schema Guide

This page expands the legacy `$apiSchema` placeholder into a practical guidance page for the new docs site.

## What `$apiSchema` represents

`$apiSchema` is the schema-oriented layer of the server-data model.

While `$api` and generated SDKs focus on calling backend operations, `$apiSchema` focuses on the API metadata itself.

That matters when frontend behavior needs to be driven by schema, not just by returned values.

## Why schema access matters

In the Cabloy/Zova model, schema metadata can support higher-level frontend behavior such as:

- validation
- automatic form rendering
- automatic field behavior
- metadata-driven UI logic

This is one reason the server-data thread in Zova is more powerful than a plain request library.

## How to think about `$apiSchema`

Use `$apiSchema` when the frontend needs to inspect what the backend contract says, not just call the backend endpoint.

That usually means the problem is shifting from “fetch data” to “use metadata to drive behavior.”

## Why this matters for AI workflows

When AI is asked to build dynamic forms, metadata-driven UI, or schema-aware validation, it should consider whether the right source is `$apiSchema` rather than hand-authored frontend-only field definitions.

That keeps the frontend closer to backend truth and reduces duplicate configuration.
