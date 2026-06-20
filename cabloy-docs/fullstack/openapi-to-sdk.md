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

If your real question is how one backend-owned row action becomes a visible frontend table action through metadata, page blocks, `tableCell` resources, and optionally generated API/model layers, continue with [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).

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
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)

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

## Source-to-consumer chain

If you want the shortest accurate mental model, use this forward chain:

1. backend controller signatures define request and response entry surfaces
2. backend DTO and entity fields shape named and shared contract structure
3. validation rules and `v` helpers refine the machine-readable contract
4. Vona emits OpenAPI output from those backend declarations
5. Zova OpenAPI config decides which generated contract slice belongs to which frontend module
6. frontend generation produces SDK and rest/schema-related contract output
7. frontend code consumes the generated contract through:
   - generated SDK methods
   - schema-driven helpers
   - `$sdk` and `$apiSchema`-adjacent runtime surfaces
   - thin model facades and existing resource-owner consumers when the API belongs to an existing resource

That means this bridge is not only “generate the SDK.”

It is the whole path that moves backend-authored truth into frontend-usable contract material.

## Which page owns which question?

Use this split to avoid reading the wrong layer too deeply.

### Backend authoring semantics

Use these when the real question is how the backend contract is authored:

- [Controller Guide](/backend/controller-guide)
- [DTO Guide](/backend/dto-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)
- [OpenAPI Guide](/backend/openapi-guide)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)

### Forward-chain bridge and regeneration workflow

Use **this page** when the real question is:

- how backend-authored truth crosses the stack boundary
- which generation steps to run
- where module ownership and regeneration decisions belong
- how to keep frontend follow-up thin after regeneration

### Frontend generation and usage setup

Use these when the generated contract has already crossed the boundary and you are configuring or consuming it in Zova:

- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [SDK Guide](/frontend/sdk-guide)

### Frontend runtime and deeper consumption internals

Use these when the real question is how generated contract material is consumed inside Zova runtime layers:

- [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)

## Cabloy Basic workflow

In the current public monorepo, Basic-specific Zova flavors include:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

Representative frontend-side contract-generation commands include:

```bash
npm run zova :openapi:config training-student
npm run zova :openapi:generate training-student
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

A practical forward-chain sequence is:

1. author or change the backend contract
2. emit or inspect backend OpenAPI output
3. if the frontend generator reads from a local Swagger endpoint, start the backend service first so the endpoint is reachable — in this repo, `npm run dev` is the normal path and exposes Swagger at `http://localhost:7102/swagger/json?version=V31`
4. configure frontend module ownership if needed
5. generate module-level OpenAPI SDK output
6. run the rest build for the active flavor when needed
7. consume the generated contract from frontend code instead of re-declaring it manually
8. keep frontend follow-up thin by wrapping generated consumers with semantic facades instead of re-declaring the contract
9. when the custom API still belongs to an existing resource, reuse the existing resource-owner instead of creating a competing cache owner

A practical responsibility split is:

- project-level OpenAPI config decides where the backend Swagger/OpenAPI source comes from
- module-level OpenAPI config decides which generated contract slice belongs to which frontend module
- module-level ownership should be declared explicitly with `operations.match` or `operations.ignore`

If both `operations.match` and `operations.ignore` are empty, frontend SDK generation should fail fast instead of generating a large unrelated contract surface for the module. That fail-fast behavior helps both developers and AI agents notice the missing ownership boundary immediately and repair the config before the wrong SDK slice is generated.

A practical regeneration rule is:

- if the backend contract changed, prefer regenerating the SDK/rest layer before hand-editing frontend request code
- if `npm run zova :openapi:generate ...` fails because the local Swagger source is unavailable, first start the backend service and confirm `http://localhost:7102/swagger/json?version=V31` is reachable before treating generation as broken
- if the generated consumer path is already correct, but frontend behavior still looks stale, stop patching generated files and diagnose consumer drift or local dependency drift instead

## `training-student` as a compact forward-chain specimen

A compact specimen helps make the bridge more concrete.

A practical `training-student` forward chain looks like this:

1. backend contract truth changes in places such as:
   - `controller/student.ts`
   - `entity/student.tsx`
   - `dto/studentCreate.tsx`
   - `dto/studentUpdate.tsx`
   - `dto/studentView.tsx`
   - `dto/studentSelectReq.tsx`
2. backend OpenAPI output changes because those controller/DTO/entity/validation surfaces changed
3. frontend OpenAPI generation refreshes the module-owned consumer slice
4. flavor-specific rest output is rebuilt when the workflow depends on generated rest output
5. frontend code consumes the generated result through module-owned SDK/schema surfaces, then keeps follow-up thin with semantic wrappers or existing resource owners

This is the main point of the forward chain:

> backend contract truth moves first, generated handoff moves second, frontend consumers stay thin and downstream.

## Thin frontend follow-up after generation

After the generated contract crosses the boundary, the best frontend move is usually **not** to recreate the contract by hand.

A practical split is:

- use generated SDKs when the module already follows the OpenAPI-generated API-service path
- use schema-driven helpers when the workflow is contract/schema oriented
- use thin model facades when the UI needs business semantics over generated APIs
- reuse the existing resource-owner when the custom API still belongs to the same resource

That last point matters especially for resource-driven pages.

If the endpoint still belongs to an existing business resource, prefer keeping `ModelResource` or the existing resource-owner story as the stable state owner rather than introducing a competing second owner.

## Cabloy Start workflow

In the sibling private Start repo, the same collaboration idea applies, but the frontend flavor names differ.

Representative Start-specific flavors include:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Before documenting or automating this path for Start, confirm:

1. the `__CABLOY_START__` marker
2. the Start repo’s `package.json`
3. the exact frontend flavor names and generated output paths

## Where to read next

- If your next question is still on the backend authoring side, continue with [OpenAPI Guide](/backend/openapi-guide), [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen), [Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection), [DTO Guide](/backend/dto-guide), [DTO Infer and Generation](/backend/dto-infer-generation), and [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain).
- If your next question is about frontend SDK setup and module ownership, continue with [OpenAPI SDK Guide](/frontend/openapi-sdk-guide).
- If your next question is about what generated contract consumption looks like in one practical frontend path, continue with [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen), then choose [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch) or [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch) as needed.
- If your next question becomes one mixed Student row-action thread spanning backend metadata, generated contract follow-up, and frontend action resources, continue with [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map).
- If your next question is about schema-driven frontend consumption, continue with [API Schema Guide](/frontend/api-schema-guide).
- If your next question is about the lower-level frontend runtime under generated OpenAPI/schema usage, continue with [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood).
- If your next question is about resource-owner or model-level consumption after regeneration, continue with [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive) and [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map).
- If the problem is actually about deciding which direction the contract loop is moving, return to [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## Implementation checks for backend-to-frontend contract changes

When changing a backend API contract, ask:

1. does OpenAPI output change?
2. does the frontend SDK or schema layer need regeneration?
3. is the active edition Basic or Start?
4. is the right next step to regenerate contracts instead of hand-editing frontend request code?
5. is the current task on the backend authoring side, the bridge step, or the frontend consumption side?

That keeps the backend/frontend contract loop coherent.
