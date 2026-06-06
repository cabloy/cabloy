# OpenAPI Guide

This guide explains how OpenAPI works in Vona within the Cabloy monorepo.

## Why OpenAPI matters in Cabloy

OpenAPI is one of the main fullstack contract bridges between Vona and Zova.

The backend exposes machine-readable contract metadata, and the frontend can consume that metadata through generated SDKs, schema-driven behavior, and API tooling.

That is why OpenAPI belongs in the core Cabloy knowledge graph rather than in an isolated backend appendix.

The same field metadata surface also connects naturally to response serialization; see [Serialization Guide](/backend/serialization-guide).

## Built-in endpoints

Several built-in endpoints are available, including:

- Swagger UI
- OpenAPI JSON output
- versioned OpenAPI JSON output
- RapiDoc

This makes the contract easy to inspect both manually and programmatically.

## `bean.openapi`

Vona provides a global bean for OpenAPI-related generation tasks.

Representative capabilities include generating JSON for:

- a specific DTO class
- multiple DTO classes
- the entire system
- a specific controller action

This is important because OpenAPI is treated as a first-class framework service, not as an external afterthought.

## Validation and OpenAPI are linked

A major theme is that the same validation-oriented declaration surface also drives OpenAPI metadata generation.

That means:

- inferred schemas can become OpenAPI metadata
- explicit schema rules can become OpenAPI metadata
- `v` helper extensions can enrich OpenAPI output

This tight linkage is one of the reasons the Cabloy contract story can stay productive at scale.

## I18n support

OpenAPI metadata can also participate in i18n.

That is useful because contract descriptions and titles are not only for machines. They are also developer-facing assets. For the broader locale/timezone and localization model behind this, see [I18n Guide](/backend/i18n-guide).

## Configuration

The OpenAPI behavior is configurable through the `a-openapi` module config.

This matters because API contract output is part of the application configuration surface, not a fixed global constant.

## Why this matters for AI workflows

When AI changes backend contracts, it should ask:

1. does this change affect Swagger/OpenAPI output?
2. does the frontend SDK or schema-driven frontend behavior need to be regenerated?
3. should metadata such as title, description, or examples be improved at the same time?
4. is this a place where validation and OpenAPI should be edited together rather than separately?

That helps keep the backend/frontend contract loop coherent.

Upload-oriented endpoints often combine multipart request handling with explicit response metadata such as `@Api.contentType('application/json')`; see [Upload Guide](/backend/upload-guide).
