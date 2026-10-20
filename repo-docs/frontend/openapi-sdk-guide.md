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

If your next question is how the lower-level OpenAPI/schema runtime works under `$sdk`, continue with [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood).

If your next question is how generated contract material becomes schema-driven frontend behavior or resource-owner consumption, continue with [API Schema Guide](/frontend/api-schema-guide) and [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive).

## Initialize OpenAPI config

Example: initialize OpenAPI config for module `training-student`.

```bash
npm run zova :openapi:config training-student
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

Example: generate OpenAPI-based frontend services for module `training-student`.

The direct command is the fast path when a development Swagger service is already available:

```bash
npm run zova :openapi:generate training-student
```

In Cabloy Basic, when generation should use a fresh isolated test-mode Vona service instead:

```bash
npm run contract:generate:isolated -- training-student
```

The isolated command uses the same generator and preserves module ownership validation, but manages a disposable service, claim, and test resources without starting Playwright. Generated files under `zova/src/**` are shared workspace output, not run-owned temporary files; serialize concurrent SDK generation and do not expect automatic rollback.

For an explicitly authorized run that must skip historical-claim reaping, use the standalone `--skip-expired-claim-reaping` flag. In this strict lane, generated environment source contains selected keys rather than resolved values, configuration reaches the bootstrap child in memory, service/generator stdout and stderr are discarded, and framework file logging is prevented before transport construction. Failures remain failures with categorical diagnostics and retained current-run claims/resources; there is no automatic retry or fallback to development Swagger. This is not a network or arbitrary-filesystem sandbox, and it does not authorize Provider operations or prove custom seed/logging behavior. See [Strict isolated generation](/reference/repo-scripts#test-isolation-and-development-data) for resource and diagnostic boundaries.

The project-level source resolver accepts `OPENAPI_SOURCE_URL` as a complete OpenAPI document URL. It takes precedence over `API_BASE_URL` for generation only and does not change runtime `OPENAPI_BASE_URL_*` request targets:

```bash
OPENAPI_SOURCE_URL=https://example.test/swagger/json?version=V31 \
npm run zova :openapi:generate training-student
```

The override changes the project default source. Explicit module sources in module config or project `modules` config retain their existing precedence; remove or align those overrides when the module must use the isolated service. Do not commit source URLs containing credentials or access tokens. Existing project `openapi.config.ts` files are not overwritten by `:openapi:config`; merge the resolver when upgrading an older project manually.

## Build the rest-contract output

SDK generation and flavor builds are separate steps. When refreshed frontend output must be handed back to Vona, use the paired SSR/REST build for each affected flavor, then synchronize dependencies. For Cabloy Basic Admin:

```bash
npm run build:zova:admin
npm run deps:vona
```

Also run `npm run build:zova:web` before dependency synchronization when Web is affected. Do not use `build:rest:*` alone for this reverse handoff; the SSR bundle and REST output must move together. See [Contract Loop Playbook](/fullstack/contract-loop-playbook#reverse-chain-playbook).

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

If your next question is what that generated contract looks like when it is actually consumed in a practical frontend path, continue with [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen).

If you then want a proof-oriented or symptom-first companion for the consumer-side path, continue with [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook) and [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist).

## Implementation checks for SDK regeneration decisions

When evaluating a request that depends on backend contracts, ask:

1. is this module already using generated OpenAPI services?
2. should the SDK be regenerated instead of hand-writing a new frontend service?
3. is the real source of truth the backend OpenAPI metadata rather than the current frontend code?
4. is the current task backend authoring, bridge regeneration, or frontend consumption?

That helps keep frontend integration aligned with the backend contract.
