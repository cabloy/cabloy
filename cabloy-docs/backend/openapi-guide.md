# OpenAPI Guide

This guide explains how OpenAPI works in Vona within the Cabloy monorepo.

## Why OpenAPI matters in Cabloy

OpenAPI is one of the main fullstack contract bridges between Vona and Zova.

The backend emits machine-readable contract metadata, and the frontend can consume that metadata through generated SDKs, schema-driven behavior, and API tooling.

That is why OpenAPI belongs in the core Cabloy knowledge graph rather than in an isolated backend appendix.

The same field metadata surface also connects naturally to response serialization; see [Serialization Guide](/backend/serialization-guide).

## OpenAPI in the backend contract loop

A useful split is:

- controllers define request and response contracts
- DTOs and entities provide schema and metadata surfaces
- validation contributes runtime constraints and inferred schema
- OpenAPI emits the machine-readable contract from those backend declarations
- frontend SDK generation is a downstream consumer of that emitted contract

This distinction matters because backend authoring and frontend consumption are related, but not the same step.

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

## Controllers, DTOs, entities, and examples all contribute

OpenAPI output is not owned by one layer only.

In practice, the emitted contract can be influenced by:

- controller route and action metadata
- request-parameter decorators
- response schema declarations and wrapper behavior
- DTO field metadata and options
- entity field metadata and options
- validation rules and helper extensions
- examples, titles, descriptions, and related metadata

That is why contract changes should often be reviewed across several backend pages, not only in one file.

## I18n support

OpenAPI metadata can also participate in i18n.

That is useful because contract descriptions and titles are not only for machines. They are also developer-facing assets. For the broader locale/timezone and localization model behind this, see [I18n Guide](/backend/i18n-guide).

## Configuration

The OpenAPI behavior is configurable through the `a-openapi` module config.

This matters because API contract output is part of the application configuration surface, not a fixed global constant.

## Relationship to frontend SDK generation

OpenAPI emission on the backend is the backend-contract-loop side of a broader fullstack contract bridge.

For the downstream bridge and consumption path, also see:

- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)

A practical split is:

- this page explains backend contract authoring and emission
- the fullstack page explains the bridge from emitted OpenAPI to generated frontend SDK
- the frontend page explains how Zova consumes that contract in its own workflows

## Why this matters for AI workflows

When AI changes backend contracts, it should ask:

1. does this change affect Swagger/OpenAPI output?
2. do the controller, DTO, entity, and validation layers still agree on the contract?
3. does the frontend SDK or schema-driven frontend behavior need to be regenerated?
4. should metadata such as title, description, or examples be improved at the same time?
5. is this a place where validation and OpenAPI should be edited together rather than separately?

That helps keep the backend/frontend contract loop coherent.

Upload-oriented endpoints often combine multipart request handling with explicit response metadata such as `@Api.contentType('application/json')`; see [Upload Guide](/backend/upload-guide).
