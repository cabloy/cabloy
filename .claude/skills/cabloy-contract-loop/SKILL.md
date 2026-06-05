---
name: cabloy-contract-loop
description: Use this skill whenever a Cabloy task crosses the Vona-to-Zova contract boundary: backend DTO, controller, validation, entity, inferred DTO, or OpenAPI changes that should drive SDK, schema, api, model, or rest-output regeneration, or stale generated frontend consumers that may be out of sync with backend truth. Trigger for requests about stale home-api output, OpenAPI regeneration, whether to regenerate instead of hand-patching types, or how to verify the Cabloy Basic or Cabloy Start contract loop end to end. Prefer it when the main problem is backend/frontend sync or diagnosis, not initial backend scaffolding or frontend page/component scaffolding.
---

# Cabloy Contract Loop

Use this skill when a backend contract change needs to be reflected in frontend consumers, or when frontend consumers appear stale and you need to diagnose whether the backend contract loop is the real source of drift.

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. classify whether the task truly crosses the backend/frontend contract boundary
3. support both forward contract changes and reverse stale-consumer detection
4. keep the workflow contract-first instead of hand-patching generated frontend types or services
5. prefer CLI-first regeneration paths on both Vona and Zova sides
6. finish with end-to-end verification guidance that checks both contract production and consumption

## Step 1: Detect repo and contract scope

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- `__CABLOY_BASIC__` present → this is Cabloy Basic
- `__CABLOY_START__` present → this is Cabloy Start
- neither present → inspect nearby scripts and ask before making edition-specific assumptions

Then classify whether the task is really a contract-loop task.

Use this skill in two common entry modes.

### Mode A: forward contract change

The user already changed or plans to change backend contract surfaces such as:

- controller request or response shape
- DTO shape
- entity field shape that feeds API-facing contracts
- validation rules
- OpenAPI metadata
- inferred DTO or ORM DTO output that affects API consumers

### Mode B: reverse stale-consumer detection

The user reports symptoms on the frontend side such as:

- stale SDK types
- stale schema-driven UI behavior
- API/model consumers no longer matching backend reality
- hand-patched frontend types that seem to drift from backend truth

In this mode, first diagnose whether the frontend is stale because the backend contract changed and the regeneration loop was skipped.

If the task is only backend scaffolding or only frontend scaffolding, the more specialized scaffold skills may be the better primary choice.

## Step 2: Start from the contract source of truth

Inspect these surfaces before proposing workflow:

- the repository or workspace `package.json` that owns the scripts
- backend contract-defining code in Vona
- `npm run zova`
- frontend generation or consumption path in Zova
- relevant docs in `cabloy-docs/fullstack/`, `cabloy-docs/backend/`, and `cabloy-docs/frontend/`

For deeper reference material, read:

- `references/contract-loop-map.md`
- `references/verification-checklist.md`

## Step 3: Identify the contract source of truth deliberately

In Cabloy, the backend is often the source of truth for the contract. Treat that as the default unless the codebase clearly shows a generated or schema-owned frontend artifact that should be regenerated from backend output.

### If this is a forward change

Start with the backend side and update the contract deliberately.

Typical backend layers to inspect or change include:

- controller action signatures and annotations
- DTO classes
- entity field metadata
- validation rules and `v` helpers
- inferred DTO generation paths
- OpenAPI configuration or metadata annotations

The key rule is:

- do **not** patch frontend consumers first if the backend contract is the real source of truth

### If this is reverse stale-consumer detection

Do not assume the frontend is the right place to fix the problem.

Instead:

1. inspect what frontend artifact looks stale
2. identify whether that artifact is generated, schema-driven, or hand-authored
3. inspect the backend contract source that should feed it
4. only then decide whether the fix is regeneration, backend correction, or a genuine frontend bug

## Step 4: Verify backend contract output before touching frontend consumers

Before regenerating frontend artifacts, confirm the backend-side contract is actually correct.

That may include:

- reviewing controller return contracts
- confirming DTO and validation alignment
- checking Swagger/OpenAPI output
- confirming that the changed endpoint or schema now reflects the intended contract

If the backend contract output is wrong, frontend regeneration will only spread the mistake.

## Step 5: Choose the right frontend regeneration path

Once the backend contract is correct, decide how the frontend should consume it.

### Path A: OpenAPI / SDK regeneration

Use this when the frontend consumes generated API contracts.

Typical Zova commands include:

- `npm run zova :openapi:config ...`
- `npm run zova :openapi:generate ...`

### Path B: REST/type generation by flavor

Use the edition-specific Zova REST/type build path when the workflow depends on the built flavor outputs.

Typical examples in Cabloy Basic include:

- `cd zova && npm run build:rest:cabloyBasicAdmin`
- `cd zova && npm run build:rest:cabloyBasicWeb`

For Cabloy Start, verify the exact Start-specific flavor names and paths in the Start repo.

### Path C: Downstream frontend alignment

After generation, inspect whether the frontend still needs follow-up in:

- API services
- model-managed remote state
- schema-driven UI
- page or component assumptions

## Step 6: Keep edition-aware differences explicit

The collaboration model is shared across Basic and Start, but the operational details may differ.

Especially verify:

- active repo marker
- affected frontend flavor
- whether the change affects Admin, Web, or both
- whether the generated output path is edition-specific

Do not silently reuse Basic-specific examples in Start workflows.

## Step 7: End-to-end verification

A fullstack contract loop is not done until both sides are checked.

### Backend-side verification

Typical checks may include:

- controller-level tests
- OpenAPI inspection
- `npm run test`
- `npm run tsc`
- `npm run build`

### Frontend-side verification

Typical checks may include:

- SDK or metadata regeneration success
- `npm run tsc:zova`
- `npm run build:zova`
- flavor-specific or route-specific checks
- schema-driven consumer alignment

## Step 8: Response pattern

When helpful, structure the response around these points:

1. detected edition
2. why this is a contract-loop task
3. backend source-of-truth layer to change first
4. frontend regeneration path to run second
5. edition-specific operational notes
6. end-to-end verification steps

Keep the response practical. The value of this skill is to prevent contract drift between Vona and Zova by guiding the user through the right backend-first, regeneration-second, verification-third workflow.
