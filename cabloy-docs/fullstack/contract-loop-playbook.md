# Contract Loop Playbook

This page is the canonical playbook for Cabloy’s bidirectional fullstack contract loop.

Use it when you need to decide:

- where source truth lives for a change
- which generated handoff should be refreshed
- which side is actually stale
- whether the problem is source drift, generated-output drift, consumer drift, or local dependency drift

## Why this playbook exists

Cabloy’s fullstack collaboration is not only backend-to-frontend.

The same monorepo supports two symmetric chains:

- **forward chain** — backend contract emission and frontend consumption
- **reverse chain** — frontend metadata or resource handoff and backend consumption

The core model applies to both **Cabloy Basic** and **Cabloy Start**.

What changes by edition is not the model itself, but the operational branch:

- flavor names
- UI-resource examples
- generated-output paths
- build commands

So the first question is always:

1. which chain am I in?
2. which edition is active?

## Shared vocabulary

Use these terms consistently:

- **contract loop** — the full bidirectional Vona↔Zova collaboration model
- **forward chain** — backend contract truth flows into generated frontend consumers
- **reverse chain** — frontend-owned metadata or resources flow into backend consumers
- **contract source** — the authored layer that currently owns truth
- **generated handoff** — the generated output that carries truth to the other side
- **consumer drift** — downstream consumers no longer match current truth
- **local dependency drift** — generated artifacts are already correct, but installed local file dependencies are still stale

## The two chains

### Forward chain

Use the forward chain when backend-authored contract surfaces changed.

Typical contract sources:

- controller request or response signatures
- DTOs
- entity field metadata
- validation rules
- OpenAPI metadata

Typical handoff:

- Swagger or OpenAPI output
- generated Zova SDK or schema-aware helpers
- flavor-built REST output when the workflow depends on it

Typical consumers:

- generated frontend API files
- thin frontend model facades
- schema-driven UI
- custom row or page actions

If your issue becomes one mixed Student row-action chain rather than a pure direction question, first continue with [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions), then [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map).

If the family root and source-reading map already match your case and the visible result is still wrong, continue with [Backend Metadata to Frontend Table Actions Debug Checklist](/fullstack/backend-metadata-to-frontend-table-actions-debug-checklist).

If you have already changed that mixed chain and now want to prove it layer by layer rather than diagnose a failure, continue with [Backend Metadata to Frontend Table Actions Verify Playbook](/fullstack/backend-metadata-to-frontend-table-actions-verify-playbook).

### Reverse chain

Use the reverse chain when frontend-owned metadata or resources changed and backend-side tooling or metadata will consume them.

Typical contract sources:

- frontend routes
- frontend components
- frontend icons
- custom form-field or table-cell resources
- module metadata consumed by backend `ZovaRender.*(...)` references

Typical handoff:

- generated metadata
- flavor build output
- local file dependency sync into Vona

Typical consumers:

- backend metadata that references frontend resources
- backend-side tooling and type hints
- SSR or integration paths that depend on refreshed frontend output

## Decision tree

Use this decision tree before editing or regenerating anything.

### 1. Did backend contract truth change?

Examples:

- DTO shape changed
- controller request or response changed
- validation changed
- OpenAPI metadata changed

Then use the **forward chain**:

1. change backend truth first
2. prove emitted contract output is correct
3. regenerate frontend consumers
4. keep frontend follow-up thin
5. verify consumer alignment

See [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) for the end-to-end forward-chain bridge from backend-authored contract truth to generated frontend consumers.

### 2. Did frontend-owned metadata or resource truth change?

Examples:

- a custom table cell was added
- a custom form field was added
- routes, components, or icons changed
- backend metadata now references new frontend resources

Then use the **reverse chain**:

1. change frontend source truth
2. regenerate metadata when applicable
3. build the relevant frontend flavor output
4. run `npm run deps:vona`
5. verify backend consumers can see the refreshed handoff

See [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend) for the end-to-end reverse-chain bridge from frontend-owned truth to backend-visible shared handoff.

### 3. Do generated artifacts look stale?

Examples:

- generated SDK still reflects an old endpoint shape
- generated metadata is missing a new resource
- rest output did not pick up the latest source change

Then diagnose **generated-output drift**:

1. confirm the source layer was changed in the right place
2. confirm the correct generation path was used
3. regenerate instead of hand-patching
4. verify the generated output itself before debugging downstream code

### 4. Do generated artifacts already look correct, but consumers still behave stale?

Examples:

- generated `.zova-rest` output already contains the new keys or types
- generated SDK already contains the new method
- backend or frontend still behaves as if old local file packages are installed

Then suspect **local dependency drift**:

1. stop editing source files
2. prove the generated handoff is already correct
3. rerun the normal sync flow
4. only then repair the local install state if consumers still look stale

## Forward chain playbook

### Stage 1: Backend contract source

Author the truth in Vona first.

Typical layers:

- controllers
- DTOs
- entities
- validation helpers
- OpenAPI annotations

Rule:

- do **not** patch generated frontend consumers first when the backend owns truth

### Stage 2: Emitted contract proof

Before regeneration, verify the backend output is actually correct.

Typical checks:

- controller contract matches intent
- DTO and validation align
- OpenAPI output reflects the intended shape

If the emitted contract is wrong, regeneration will only spread the mistake.

### Stage 3: Module ownership and generation

Regenerate the frontend consumer path deliberately.

Typical commands include:

```bash
npm run zova :openapi:config <module-name>
npm run zova :openapi:generate <module-name>
```

When the target is a module-local SDK, keep ownership constrained with `operations.match` so the module only generates the API surface it actually owns.

### Stage 4: Thin frontend follow-up

After regeneration, keep frontend follow-up thin.

That means:

- prefer generated contract consumers over hand-written duplicates
- use **thin model facades** as semantic wrappers over generated APIs
- **reuse the existing resource-owner** when the custom API still belongs to an existing resource

For resource-bound custom endpoints, prefer `rest-resource.model.resource` as the state owner. A module-local model may still exist, but it should remain a semantic facade instead of becoming a second cache owner.

See the downstream pattern in `.claude/skills/cabloy-contract-loop/references/resource-custom-state-pattern.md`.

### Stage 5: Consumer verification

Verify that generated output and frontend consumers agree.

Typical checks:

- generated API contains the intended methods
- model or schema consumers still typecheck
- UI behavior now matches the regenerated contract

## Reverse chain playbook

### Stage 1: Frontend-owned source truth

Start from the frontend resource or metadata that actually changed.

Typical layers:

- bean resources
- components
- metadata wrappers
- routes
- icons

Rule:

- do **not** treat a frontend-owned resource handoff as frontend-only cleanup if backend consumers depend on it

### Stage 2: Generated handoff

Refresh the generated metadata or build output that carries the change across the boundary.

Typical commands may include:

```bash
npm run zova :tools:metadata <module-name>
```

and then the relevant build path for the active edition and flavor.

### Stage 3: Vona sync handoff

After the frontend-generated handoff is ready, run the relevant Zova build first and then re-sync Vona’s local dependency state with `npm run deps:vona`.

For the current **Cabloy Basic Admin** branch, the representative sequence is:

```bash
npm run build:zova:admin
npm run deps:vona
```

If the same resource path must also be available to Web, also run:

```bash
npm run build:zova:web
npm run deps:vona
```

Do not treat `build:rest:*` alone as sufficient. The SSR bundle and the generated rest output should move together.

For **Cabloy Start**, use the same reverse-chain logic, but resolve the Start-specific flavor names and output paths from the active Start repo before recommending commands.

### Stage 4: Consumer verification

Verify that backend consumers can now resolve the refreshed frontend-generated handoff.

Typical checks:

- backend metadata resolves the new frontend resource names
- generated shared types now appear in backend-side consumers
- SSR or integration behavior sees the refreshed output

## Recovery path for local dependency drift

Use this branch only when all of these are already true:

- source truth was edited in the right place
- the generated `.zova-rest` artifacts or other build output already contain the intended change
- the normal sync flow already ran
- consumers still behave stale

Then treat the problem as **local dependency drift**.

Representative recovery path:

```bash
cd vona && rm -rf node_modules && pnpm install
```

This is a recovery step, not the first response.

## Verification by branch

### Forward chain

- backend source truth is correct
- emitted OpenAPI or contract output is correct
- module ownership is constrained
- generated frontend consumer output is refreshed
- frontend consumers and UI behavior align

### Reverse chain

- frontend source truth is correct
- metadata or build output is refreshed
- Vona dependency sync completed
- backend consumers resolve the updated frontend-generated handoff

### Local dependency drift

- generated artifacts already prove the change exists
- sync flow already ran
- reinstall is justified only because consumers still behave stale

## Tutorial map

Use the tutorial series as examples of the two chains:

- [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing) — reverse chain, built-in metadata branch
- [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers) — reverse chain, custom resource handoff branch
- [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing) — forward chain, backend-emitted contract branch
- [Tutorial 6: One Contract Surface, Four Uses](/fullstack/tutorial-6-one-contract-four-uses) — one field story spanning multiple contract surfaces

## Related docs

- [Fullstack Introduction](/fullstack/introduction)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
- [Vona + Zova Integration](/fullstack/vona-zova-integration)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [API Schema Guide](/frontend/api-schema-guide)
