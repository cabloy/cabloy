# Backend OpenAPI to Frontend SDK

This page is the **forward chain** deep dive for Cabloy’s bidirectional contract loop.

## Why this path matters

In the bidirectional [Contract Loop Playbook](/fullstack/contract-loop-playbook), this page covers the **forward chain**:

1. Vona emits backend API metadata through Swagger/OpenAPI
2. Zova consumes that metadata to generate frontend SDKs and schema-aware helpers
3. frontend pages, models, and services build on those generated contracts instead of re-declaring everything manually

This is one of the strongest AI-leverage paths in the repo because it reduces duplicated type work and keeps backend/frontend coordination closer to source truth.

## The forward chain in practical terms

A useful split is:

- backend docs define the authoring side of the contract
- fullstack docs define the bridge from emitted contract to generated SDK
- frontend docs define the consumption side of the generated contract

That means this page is the forward-chain bridge page, not the backend authoring page and not the frontend usage page.

If the changed source is actually a frontend-owned resource that backend consumers later depend on, switch to the reverse-chain guide: [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend).

## Backend side: Vona emits the contract

On the backend side, OpenAPI metadata is driven by:

- controller argument and return contracts
- DTO and entity field definitions
- validation rules and `v` helpers
- `a-openapi` configuration

For the deeper backend perspective, see:

- [Controller Guide](/backend/controller-guide)
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
- [Server Data](/frontend/server-data)
- [API Guide](/frontend/api-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [SDK Guide](/frontend/sdk-guide)

## Cabloy Basic workflow

In the current public monorepo, Basic-specific Zova flavors include:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

Representative frontend-side contract-generation commands include:

```bash
npm run zova :openapi:config demo-student
npm run zova :openapi:generate demo-student
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

A practical forward-chain sequence is:

1. author or change the backend contract
2. emit or inspect backend OpenAPI output
3. configure frontend module ownership if needed
4. generate module-level OpenAPI SDK output
5. run the rest build for the active flavor when needed
6. consume the generated contract from frontend code instead of re-declaring it manually
7. keep frontend follow-up thin by wrapping generated consumers with semantic facades instead of re-declaring the contract
8. when the custom API still belongs to an existing resource, reuse the existing resource-owner instead of creating a competing cache owner

A practical responsibility split is:

- project-level OpenAPI config decides where the backend Swagger/OpenAPI source comes from
- module-level OpenAPI config decides which generated contract slice belongs to which frontend module

A practical regeneration rule is:

- if the backend contract changed, prefer regenerating the SDK/rest layer before hand-editing frontend request code
- if the generated consumer path is already correct, but frontend behavior still looks stale, stop patching generated files and diagnose consumer drift or local dependency drift instead

## Cabloy Start workflow

In the sibling private Start repo, the same collaboration idea applies, but the frontend flavor names differ.

Representative Start-specific flavors include:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Before documenting or automating this path for Start, confirm:

1. the `__CABLOY_START__` marker
2. the Start repo’s `package.json`
3. the exact frontend flavor names and generated output paths

## Implementation checks for backend-to-frontend contract changes

When changing a backend API contract, ask:

1. does OpenAPI output change?
2. does the frontend SDK or schema layer need regeneration?
3. is the active edition Basic or Start?
4. is the right next step to regenerate contracts instead of hand-editing frontend request code?
5. is the current task on the backend authoring side, the bridge step, or the frontend consumption side?

That keeps the backend/frontend contract loop coherent.
