# Playbook: Update a Backend Contract and Regenerate the Frontend

This playbook documents one of the highest-value fullstack AI workflows in Cabloy.

## When to use this playbook

Use this playbook when a backend API contract changes and the frontend should be brought back into sync.

Typical triggers include:

- DTO field changes
- controller parameter or response changes
- validation changes
- OpenAPI metadata changes
- relation or DTO inference changes that affect API shape

## Step 1: Update the backend contract at the correct layer

Inspect which backend layer actually owns the change:

- controller
- dto
- entity
- validation rule
- inferred DTO path
- OpenAPI configuration

Relevant docs:

- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [DTO Guide](/backend/dto-guide)
- [DTO Infer and Generation](/backend/dto-infer-generation)

## Step 2: Verify the backend contract output

Before touching the frontend, verify that the backend-side contract change is really reflected in the generated OpenAPI output.

That may include:

- rebuilding or running the backend
- checking Swagger / OpenAPI JSON
- confirming the contract shape matches intent

## Step 3: Detect the edition and frontend target

Before regenerating frontend artifacts:

1. detect Basic vs Start
2. verify the relevant frontend flavor
3. confirm whether the change affects Admin, Web, or both

## Step 4: Regenerate the frontend-side contract artifacts

Use the Zova OpenAPI and REST-generation path rather than manually updating request code first. Follow the canonical [Contract Loop Playbook](/fullstack/contract-loop-playbook#forward-chain-playbook) for the active edition’s complete generation and verification sequence.

Do not treat `build:rest:*` as a standalone current command recipe. Resolve the active edition’s full build path from the canonical playbook and current root scripts so SSR bundle and REST output stay synchronized.

For Start, resolve Start-specific flavor paths from that repository.

## Step 5: Inspect affected frontend layers

After regeneration, inspect which frontend layers need follow-up changes:

- API services
- generated SDK
- model-managed data access
- schema-driven UI
- page or component assumptions

## Step 6: Verify the end-to-end loop

Use a verification path that checks both sides:

- backend contract correctness
- regenerated frontend artifacts
- typecheck/build for the affected frontend edition or flavor

## AI rule of thumb

A good fullstack contract update workflow is usually:

1. change backend contract
2. verify OpenAPI output
3. detect edition and target flavor
4. regenerate frontend contract artifacts
5. inspect downstream breakage
6. verify end to end

Not:

1. change backend DTO
2. hand-edit a few frontend request types
3. leave the contract loop out of sync
