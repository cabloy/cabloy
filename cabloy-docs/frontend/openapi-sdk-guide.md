# OpenAPI SDK Guide

This guide explains how the Zova OpenAPI SDK workflow fits into the Cabloy monorepo.

## Why OpenAPI SDK matters

Zova can generate frontend client SDKs from backend Swagger/OpenAPI metadata.

This is one of the most important fullstack links in Cabloy, because it lets backend contracts drive frontend integration more directly and reduces redundant hand-written API code.

## This page’s role in the contract loop

A practical split is:

- backend docs explain contract authoring and OpenAPI emission
- the fullstack bridge doc explains how emitted OpenAPI becomes generated frontend SDKs
- this page explains frontend configuration, generation, and usage choices after that contract reaches Zova

For the bridge view, also see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

For the broader frontend contract-consumption ladder, also see [Server Data](/frontend/server-data), [API Schema Guide](/frontend/api-schema-guide), and [SDK Guide](/frontend/sdk-guide).

## Initialize OpenAPI config

Example: initialize OpenAPI config for module `demo-student`.

```bash
npm run zova :openapi:config demo-student
```

## Module-level config

Each module must explicitly declare which backend operations belong to it.

Representative idea:

- configure `operations.match` or `operations.ignore` in the module OpenAPI config
- keep API ownership aligned with the module boundary
- avoid generating large amounts of unrelated SDK output for the current module

If both `operations.match` and `operations.ignore` are left empty, `:openapi:generate` should fail fast and ask you to define one of them explicitly. This fail-fast feedback helps both developers and AI agents notice the missing ownership rule immediately and correct it before unrelated SDK output is generated.

This modular split matters because Cabloy does not treat the frontend as one flat API client surface.

## Project-level config

The project-level OpenAPI config defines where Swagger/OpenAPI metadata is downloaded from.

Representative use case:

- point the frontend project at the correct backend Swagger JSON source
- then generate only the SDK slices needed by the current module

## Generate the SDK

Example: generate OpenAPI-based frontend services for module `demo-student`.

```bash
npm run zova :openapi:generate demo-student
```

## Build the rest-contract output

For Cabloy Basic, representative contract-build commands include:

```bash
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

This matters because SDK generation and rest-contract build steps are related, but not identical.

## Important convention

One important rule is that a module should usually standardize on one API-service creation style.

That means a module should generally choose between:

- manually authored API services
- OpenAPI-generated API services

Mixing both styles carelessly inside one module makes the codebase harder to reason about.

## Relationship to backend authoring

This page is about frontend consumption and generation, not backend contract authoring.

If the backend contract itself changes, first inspect or update the backend contract pages such as:

- [Controller Guide](/backend/controller-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [DTO Guide](/backend/dto-guide)

Then return to this page for the frontend regeneration step.

## Implementation checks for SDK regeneration decisions

When evaluating a request that depends on backend contracts, ask:

1. is this module already using generated OpenAPI services?
2. should the SDK be regenerated instead of hand-writing a new frontend service?
3. is the real source of truth the backend OpenAPI metadata rather than the current frontend code?
4. is the current task backend authoring, bridge regeneration, or frontend consumption?

That helps keep frontend integration aligned with the backend contract.
