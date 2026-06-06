# OpenAPI SDK Guide

This guide explains how the Zova OpenAPI SDK workflow fits into the Cabloy monorepo.

## Why OpenAPI SDK matters

Zova can generate frontend client SDKs from backend Swagger/OpenAPI metadata.

This is one of the most important fullstack links in Cabloy, because it lets backend contracts drive frontend integration more directly and reduces redundant hand-written API code.

## Initialize OpenAPI config

Example: initialize OpenAPI config for module `demo-student`.

```bash
npm run zova :openapi:config demo-student
```

## Module-level config

Each module can control which backend operations belong to it.

Representative idea:

- configure matching rules in the module OpenAPI config
- keep API ownership aligned with the module boundary

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

## Important convention

One important rule is that a module should usually standardize on one API-service creation style.

That means a module should generally choose between:

- manually authored API services
- OpenAPI-generated API services

Mixing both styles carelessly inside one module makes the codebase harder to reason about.

## Why this matters for AI workflows

When AI sees a request that depends on backend contracts, it should ask:

1. is this module already using generated OpenAPI services?
2. should the SDK be regenerated instead of hand-writing a new frontend service?
3. is the real source of truth the backend OpenAPI metadata rather than the current frontend code?

That helps keep frontend integration aligned with the backend contract.
