# Backend OpenAPI to Frontend SDK

This page turns one of Cabloy’s most important fullstack collaboration paths into an explicit guide.

## Why this path matters

Cabloy’s fullstack productivity depends heavily on a contract loop:

1. Vona exposes backend API metadata through Swagger/OpenAPI
2. Zova consumes that metadata to generate frontend SDKs and schema-aware helpers
3. frontend pages, models, and services build on those generated contracts instead of re-declaring everything manually

This is one of the strongest AI-leverage paths in the repo because it reduces duplicated type work and keeps backend/frontend coordination closer to source truth.

## Backend side: Vona produces the contract

On the backend side, OpenAPI metadata is driven by:

- controller argument and return contracts
- DTO and entity field definitions
- validation rules and `v` helpers
- `a-openapi` configuration

For the deeper backend perspective, see:

- [OpenAPI Guide](/backend/openapi-guide)
- [Validation Guide](/backend/validation-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)

## Frontend side: Zova consumes the contract

On the frontend side, the generated-contract path typically includes:

- OpenAPI configuration
- SDK generation
- API services or schema-driven helpers based on the generated output

For the deeper frontend perspective, see:

- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [API Guide](/frontend/api-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [SDK Guide](/frontend/sdk-guide)

## Cabloy Basic workflow

In the current public monorepo, Basic-specific Zova flavors include:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

Representative frontend-side type-generation commands include:

```bash
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

## Cabloy Start workflow

In the sibling private Start repo, the same collaboration idea applies, but the frontend flavor names differ.

Representative Start-specific flavors include:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Before documenting or automating this path for Start, confirm:

1. the `__CABLOY_START__` marker
2. the Start repo’s `package.json`
3. the exact frontend flavor names and generated output paths

## Why this matters for AI workflows

When AI changes a backend API contract, it should ask:

1. does OpenAPI output change?
2. does the frontend SDK or schema layer need regeneration?
3. is the active edition Basic or Start?
4. is the right next step to regenerate contracts instead of hand-editing frontend request code?

That keeps the backend/frontend contract loop coherent.
