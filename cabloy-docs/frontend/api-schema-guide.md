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

## One practical metadata-driven expression example

When schema-driven form or table rendering uses JSX/CEL evaluation, the runtime can resolve helper functions against the current scope.

For example, frontend CEL expressions can now use `toFixed(value, precision)` to keep a numeric value at the desired precision:

```text
toFixed(getValue('price'), 2)
```

In the shared form/table CEL environment:

- `toFixed(...)` returns a string with fixed decimal precision
- `getValue(name)` reads the current field value or current row value from the active runtime scope
- `getProperty(name)` reads the current schema property metadata from the active runtime scope

That is useful when the backend contract already owns the field metadata and the frontend only needs a thin expression layer for schema-driven display behavior.

## Read together with

Use this page together with:

- [Server Data](/frontend/server-data)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [SDK Guide](/frontend/sdk-guide)
- [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood)

## Implementation checks for schema-driven UI changes

When asked to build dynamic forms, metadata-driven UI, or schema-aware validation, consider whether the right source is `$apiSchema` rather than hand-authored frontend-only field definitions.

That keeps the frontend closer to backend truth and reduces duplicate configuration.
