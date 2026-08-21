---
name: cabloy-contract-loop
description: Use this skill whenever a Cabloy task crosses the Vona-to-Zova contract boundary: backend DTO, controller, validation, entity, inferred DTO, or OpenAPI changes that should drive SDK, schema, api, model, or rest-output regeneration, or stale generated frontend consumers that may be out of sync with backend truth. Trigger for requests about stale home-api output, OpenAPI regeneration, whether to regenerate instead of hand-patching types, or how to verify the Cabloy Basic or Cabloy Start contract loop end to end. Prefer it when the main problem is backend/frontend sync or diagnosis, not initial backend scaffolding or frontend page/component scaffolding.
---

# Cabloy Contract Loop

Use this skill when a backend contract change needs to be reflected in frontend consumers, when frontend-owned metadata or resources need to be reflected back into backend consumers, or when either side appears stale and you need to diagnose where drift actually lives.

Read the public [Contract Loop Playbook](../../../cabloy-docs/fullstack/contract-loop-playbook.md) for the canonical bidirectional model. This skill is the branching orchestration guide.

## Important recovery note for stale local file consumers

When the generated `.zova-rest` artifacts or other generated consumer artifacts already contain the expected new keys or types but Vona still sees stale consumer types, treat that first as a local dependency drift problem rather than a source-editing problem.

This includes the reverse fullstack direction where newly added frontend resources such as custom renderers are later consumed by backend metadata.

In that situation:

1. run the normal sync or regeneration flow first
2. run the relevant Zova build from the repo root before `npm run deps:vona`
   - use `npm run build:zova:admin` for Admin-facing render/action/metadata changes
   - also run `npm run build:zova:web` when the Web flavor is affected
3. do not treat `build:rest:*` alone as sufficient, because the SSR bundle and rest output must move together
4. run `npm run deps:vona`
5. if the generated `.zova-rest` artifacts already contain the expected changes but Vona still sees stale types, delete `vona/node_modules` and reinstall dependencies

Do not keep debugging source-level contract or renderer changes until the local file-package installation state is known to be healthy.

## Current safeguard behavior in this repo

- there is no contract-loop pre-commit gate in the current repo workflow
- the active safeguard lives in the Claude `PostToolUse` hook configured in `.claude/settings.json`
- for high-confidence reverse-chain source edits on the Zova side, the hook auto-runs `npm run build:zova:admin` and then `npm run deps:vona`
- forward-chain detections remain reminder-only, so backend contract changes still require deliberate regeneration and verification
- consumer-side reverse signals remain reminder-only, so do not assume every reverse-chain case auto-syncs itself

## Goals

1. detect whether the active repository is Cabloy Basic or Cabloy Start
2. classify whether the task truly crosses the backend/frontend contract boundary
3. route the task into one of four modes: forward chain, reverse chain, consumer drift diagnosis, or local dependency drift recovery
4. keep the workflow contract-first instead of hand-patching generated frontend types or services
5. prefer CLI-first regeneration paths on both Vona and Zova sides
6. finish with end-to-end verification guidance that checks both contract production and consumption

## Step 1: Detect repo, edition, and branch

Check the repository root for these marker files:

- `__CABLOY_BASIC__`
- `__CABLOY_START__`

Interpretation:

- `__CABLOY_BASIC__` present → this is Cabloy Basic
- `__CABLOY_START__` present → this is Cabloy Start
- neither present → inspect nearby scripts and ask before making edition-specific assumptions

Then classify whether the task is really a contract-loop task.

These four modes are shared across Cabloy Basic and Cabloy Start. Edition detection chooses the operational branch, but does not change the core contract-loop model.

Use this skill in four common entry modes.

### Mode A: forward chain

The user already changed or plans to change backend contract surfaces such as:

- controller request or response shape
- DTO shape
- entity field shape that feeds API-facing contracts
- validation rules
- OpenAPI metadata
- inferred DTO or ORM DTO output that affects API consumers

### Mode B: reverse chain

The user changed or plans to change frontend-owned resources or metadata that backend-side tooling or metadata will later consume, such as:

- routes
- components
- icons
- custom form-field resources
- custom table-cell resources
- generated frontend metadata that backend `ZovaRender.*(...)` references depend on

### Mode C: consumer drift diagnosis

The user reports symptoms on the frontend side such as:

- stale SDK types
- stale schema-driven UI behavior
- API/model consumers no longer matching backend reality
- hand-patched frontend types that seem to drift from backend truth

In this mode, first diagnose whether the visible stale behavior comes from skipped regeneration, a wrong source-of-truth edit, or a stale generated consumer.

### Mode D: local dependency drift recovery

Use this mode when generated artifacts already contain the expected keys, types, or resources, but installed local file dependencies still behave stale after the normal sync flow.

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
- `references/resource-custom-state-pattern.md`
- `../../../cabloy-docs/fullstack/admin-resource-and-web-self-service.md`

## Step 3: Identify the contract source of truth deliberately

In Cabloy, the backend is often the source of truth for the contract. Treat that as the default unless the codebase clearly shows a frontend-owned artifact that the reverse chain should hand back into backend consumers.

### If this is the forward chain

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

### If this is the reverse chain

Start with the frontend-owned resource or metadata that backend consumers later depend on.

Typical frontend layers to inspect or change include:

- routes
- components
- icons
- custom form-field resources
- custom table-cell resources
- generated metadata that backend `ZovaRender.*(...)` references depend on

The key rule is:

- do **not** treat this as frontend-only cleanup if backend consumers depend on the generated handoff

### If this is consumer drift diagnosis

Do not assume the visible stale behavior identifies the wrong layer automatically.

Instead:

1. inspect what artifact looks stale
2. identify whether that artifact is generated, schema-driven, or hand-authored
3. inspect the source layer that should feed it
4. only then decide whether the fix is regeneration, source correction, consumer alignment, or a genuine bug

### If this is local dependency drift recovery

Only enter this branch after the source layer and generated handoff are already known to be correct.

## Step 4: Verify backend contract output before touching frontend consumers

Before regenerating frontend artifacts, confirm the backend-side contract is actually correct.

That may include:

- reviewing controller return contracts
- confirming DTO and validation alignment
- checking Swagger/OpenAPI output
- confirming that the changed endpoint or schema now reflects the intended contract
- if local OpenAPI generation depends on a running Swagger source, starting the backend service first — in Cabloy Basic, `npm run dev` is the normal path and exposes `http://localhost:7102/swagger/json?version=V31`

If the backend contract output is wrong, frontend regeneration will only spread the mistake.

## Step 5: Choose the right frontend regeneration path

Once the backend contract is correct, decide how the frontend should consume it.

### Path A: OpenAPI / SDK regeneration

Use this when the frontend consumes generated API contracts.

Typical Zova commands include:

- `npm run zova :openapi:config ...`
- `npm run zova :openapi:generate ...`

Preflight reminder:

- if `:openapi:generate` reads from a local Swagger endpoint, do not assume the generator itself is broken when fetch fails
- first start the backend service, typically with `npm run dev`, and confirm `http://localhost:7102/swagger/json?version=V31` is reachable

When the target is a module-local SDK, constrain `openapi.config.ts` with `operations.match` unless the module intentionally owns a broad API surface. This prevents unrelated APIs from being generated into the module.

### Path B: REST/type generation by flavor

Use the edition-specific Zova REST/type build path when the workflow depends on the built flavor outputs.

Typical examples in Cabloy Basic include:

- `cd zova && npm run build:rest:cabloyBasicAdmin`
- `cd zova && npm run build:rest:cabloyBasicWeb`

Important Cabloy Basic reverse-sync rule:

- if Vona consumes newly added or changed Zova Admin render/action/metadata, do **not** stop at `build:rest:cabloyBasicAdmin`
- run `npm run build:zova:admin` from the repo root instead, then run `npm run deps:vona`
- treat this as a JS-bundle-plus-rest-output handoff, not a rest-types-only refresh
- the current repo safeguard may auto-run those two commands for high-confidence Zova reverse-source edits, but only as a convenience layer on top of the contract-loop model
- if the change was consumer-side, low-confidence, cross-edition, or happened outside the Claude hook path, run the reverse sync flow deliberately yourself
- prefer visible proof under `zova/src/**/.metadata/**` when it is available; if the effective handoff only appears in `.zova-rest`, treat the safeguard as conservative reminder/auto-sync assistance rather than strict proof

For Cabloy Start, verify the exact Start-specific flavor names, paths, SSR site baselines, and project assets in the licensed Start repo.

### Schema-driven UI decision branch

When the regenerated contract feeds a form or another metadata-driven UI, decide the ownership path before adding frontend field definitions:

1. Put reusable field meaning, validation, titles, ordering, and renderer metadata on the backend entity or inferred contract when those semantics are shared; put operation-specific projection or composition in the DTO.
2. Identify the frontend consumer surface:
   - generated `$api` for executing an operation;
   - generated `$apiSchema` for a named schema facade;
   - `$sdk` or `ModelResource` for dynamic schema/resource access;
   - a direct page form for a local, non-resource workflow.
3. Prefer automatic `ZForm` rendering when the resolved schema already carries the field metadata. A `ZForm` with `schema` and no default body slot iterates schema properties automatically; use `slotFooter` for page-specific actions without replacing the automatic body.
4. Keep reusable query, cache, mutation, invalidation, and resource state in `ModelResource` or a model. A page-specific action may call generated `$api` directly when it has no shared state or cache ownership; do not add an infrequently used operation to a shared model only for API indirection.
5. If the page needs a custom renderer, layout, or behavior, determine whether that resource is frontend-owned and referenced by backend metadata. If so, follow the reverse-chain flavor build and `deps:vona` handoff rather than treating the change as frontend-only.

Read the [API Schema Guide](../../../cabloy-docs/frontend/api-schema-guide.md), [Form Guide](../../../cabloy-docs/frontend/form-guide.md), and [Model Resource Owner Pattern](../../../cabloy-docs/frontend/model-resource-owner-pattern.md) for the ownership and runtime details. Use `references/contract-loop-map.md` and `references/verification-checklist.md` for the contract-loop proof steps.

### Path C: Downstream frontend alignment

After generation, inspect whether the frontend still needs follow-up in:

- API services
- model-managed remote state
- schema-driven UI
- page or component assumptions

Keep frontend follow-up thin:

- use thin semantic model facades over generated consumers instead of re-declaring the contract
- if a custom endpoint still belongs to an existing Admin Resource state boundary, prefer one resource-state owner instead of letting a module-local model create a second cache tree

For one persisted domain with both Admin Resource and Web self-service consumers, choose the state boundary deliberately after backend contract truth and regeneration are established:

- **Admin/custom-resource branch:** the endpoint remains part of the Admin Resource authority, projection, and generic page state, so reuse `rest-resource.model.resource` through a thin semantic facade.
- **Separate Web self-service branch:** the consumer has different authority, server-derived owner scope, DTO projection, operation names, UX, or SSR behavior, so expose explicit self-service operations and use a dedicated Web model and purpose-built pages.

Share domain persistence and lifecycle logic, not necessarily HTTP projections or frontend state ownership. Read `../../../cabloy-docs/fullstack/admin-resource-and-web-self-service.md` for the complete architecture. Reuse the resource-owned custom state pattern in `references/resource-custom-state-pattern.md` for the Admin/custom-resource branch.

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
