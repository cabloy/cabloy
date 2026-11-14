# Frontend Metadata Back to Backend

This page is the **reverse chain** deep dive for Cabloy’s bidirectional contract loop.

## Why this path matters

The fullstack collaboration loop in Cabloy is not one-way.

> [!NOTE]
> The fullstack tutorial series intentionally uses a standalone `demo-student` sandbox so readers can experiment without colliding with the repo's real suite-owned `a-training/training-student` implementation.
> This guide focuses on the current repo implementation as its reverse-chain specimen.

In the bidirectional [Contract Loop Playbook](/fullstack/contract-loop-playbook), this page covers the **reverse chain**:

1. frontend-owned truth changes first
2. frontend metadata or flavor build output refreshes the generated handoff
3. Vona syncs that refreshed handoff through local dependency flow
4. backend-side metadata, tooling, or type surfaces consume the result

For the forward contract-bridge direction from backend OpenAPI to frontend consumption, also see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

If your real question is the full row-action chain from backend metadata to visible frontend table actions, including when forward-generated API consumers and reverse-shared render resources cooperate, also see [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).

## This page’s role in the contract loop

A practical split is:

- fullstack docs classify which direction the contract loop is moving
- this page explains the **reverse bridge** from frontend-owned truth to backend-visible handoff
- frontend docs explain how to author the relevant frontend resources
- tutorials show concrete implementation flows for specific cases

That means this page is the reverse-chain bridge page, not a frontend authoring cookbook and not a backend table-action runtime page.

## Frontend side: Zova owns the source truth

The reverse chain starts when the source of truth lives on the frontend side.

Typical frontend-owned truth includes:

- routes
- components
- icons
- custom form-field renderers
- custom table-cell renderers
- generated frontend metadata that backend `ZovaRender.*(...)` references rely on

This is one of the unusual strengths of the Cabloy monorepo model.

The frontend does not only consume backend contract truth through OpenAPI. It can also generate metadata and build output that improves backend-side development, tooling, and integration confidence.

## Backend side: Vona consumes the refreshed handoff

On the backend side, Vona does not consume the raw frontend source tree directly.

Instead, it consumes the refreshed handoff that the frontend generation/build path produces:

- generated metadata
- flavor build output
- refreshed local file dependency state after `npm run deps:vona`

That distinction matters.

The reverse chain is not complete when the frontend source file is saved.
It is complete only when the generated/shared handoff is refreshed and the backend side can actually see it.

## Source-to-consumer reverse chain

If you want the shortest accurate mental model, use this reverse chain:

1. frontend-owned truth changes in resources such as table cells, form fields, routes, or related metadata
2. frontend metadata or flavor build output refreshes the generated handoff
3. `npm run deps:vona` refreshes the Vona-side local dependency view
4. backend-side metadata, tooling, and type surfaces consume the refreshed handoff
5. if generated output already looks correct but backend consumers still behave stale, suspect **local dependency drift** rather than source-truth drift

That means the reverse chain is not only “build frontend and hope backend notices.”

It is a deliberate handoff path with a sync step and a verification step.

## Which page owns which question?

Use this split to avoid reading the wrong layer too deeply.

### Reverse-chain bridge and regeneration workflow

Use **this page** when the real question is:

- how frontend-owned truth crosses into backend-visible shared output
- which generation/build/sync steps belong to the reverse chain
- how to diagnose generated-output drift vs local dependency drift

### Forward-chain bridge and regeneration workflow

Use [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) when the real question is:

- how backend-authored truth becomes generated frontend contract material
- which OpenAPI generation and rest-build steps belong to that path

### Full chain classification and drift diagnosis

Use [Contract Loop Playbook](/fullstack/contract-loop-playbook) when the real question is:

- which direction the contract loop is moving
- whether the problem is source drift, generated-output drift, consumer drift, or local dependency drift

### Concrete mixed metadata/action thread

Use [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions) when the real question is:

- how backend metadata and frontend action resources cooperate in one visible table-action chain

If you then want the shortest file-order path through that same Student row-action thread across both sides, continue with [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map).

### Concrete implementation steps

Use these when the real question is how to author the frontend resources themselves:

- [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing)
- [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers)

## Edition/version-neutral workflow

The reverse-chain path is shared across editions and versions:

1. change the frontend-owned truth
2. regenerate frontend metadata when applicable
3. detect the active edition and version, then resolve every affected flavor and its source-confirmed paired SSR/REST wrapper from the active manifests
4. complete every affected paired build before the final synchronization
5. run `npm run deps:vona`
6. verify backend-side consumers can now see the refreshed handoff

Resolve every affected flavor/site, identity, and output path from the active manifests. Use the affected ordinary `build:zova*` wrapper when convenient or the universal paired command `npm run build:zova:isolated -- <affected-flavor> [<affected-flavor> ...]`; complete every paired SSR/REST build before `npm run deps:vona`. A REST-only build is not sufficient because the SSR and REST outputs must move together.

### Cabloy Basic example (this repository)

Representative commands for the current Basic admin path are:

```bash
npm run zova :tools:metadata <module-name>
npm run build:zova:admin
npm run deps:vona
```

If the same resource path must also be available for Web, complete both affected pairs before the final dependency synchronization:

```bash
npm run build:zova:admin
npm run build:zova:web
npm run deps:vona
```

A practical rule is:

- treat metadata generation, every affected paired flavor build, and the default `deps:vona` synchronization as one reverse-chain handoff
- with healthy local dependency state, `deps:vona` is normally sufficient; deleting `vona/node_modules` is not a routine prerequisite
- do not treat `build:rest:*` alone as sufficient, because the SSR bundle and REST output should move together
- do not stop after the frontend source edit alone
- if generated artifacts are correct but Vona remains stale after synchronization, follow the conditional local-dependency-drift recovery below rather than hand-editing generated output

## `training-student` as a compact reverse-chain specimen

A compact specimen helps make the reverse chain concrete without replaying the full tutorials.

A practical example thread looks like this:

1. frontend-owned truth lives in module resources such as:
   - `zova/src/suite/a-training/modules/training-student/src/bean/tableCell.level.tsx`
   - `zova/src/suite/a-training/modules/training-student/src/component/formFieldLevel/controller.tsx`
2. frontend-generated metadata is refreshed and the relevant flavor build output is rebuilt
3. `npm run deps:vona` refreshes what Vona can see from the frontend side
4. backend-side metadata such as `vona/src/suite/a-training/modules/training-student/src/entity/student.tsx` can safely reference the refreshed frontend resource identities through `ZovaRender.*(...)`
5. if the generated/shared output already contains the right resource keys but Vona still behaves stale, the next suspect is local dependency drift instead of missing source edits

The key point is simple:

> frontend-owned renderer and metadata resources become backend-visible only after the reverse-chain handoff is refreshed.

## Generated-output drift vs local dependency drift

A useful distinction is:

### Generated-output drift

This is the problem when:

- the correct frontend source changed
- but the generated metadata or flavor build output was never refreshed

Typical fix:

1. regenerate metadata when applicable
2. rebuild the relevant frontend flavor output
3. verify the generated/shared output itself before debugging Vona consumers

### Local dependency drift

This is the problem when:

- generated `.zova-rest` or related shared output already contains the expected keys or types
- but backend-side consumers still behave as if the old handoff is installed

Typical fix:

1. stop editing source files
2. confirm every affected paired SSR/REST build completed, then run the normal sync flow with `npm run deps:vona`
3. if Vona still looks stale, restart an affected running TypeScript/Vona process if one is present
4. if the relevant generated output is not already known to be correct, make a quick confirmation; if it is wrong, return to the build chain
5. only if the output is correct, synchronization completed, and stale behavior remains, recover the local dependency state

Representative recovery path:

```bash
cd vona && rm -rf node_modules && pnpm install
```

This is an exceptional recovery step, not a routine prerequisite. Never hand-edit generated manifests, dependency links, lockfiles, or `.zova-rest` packages. This distinction is one of the most important practical diagnostics in the reverse chain.

## Edition awareness

The reverse-chain mental model applies to both Cabloy Basic and Cabloy Start.

This path is especially sensitive to edition differences because Basic and Start do not expose the same frontend module and UI shape.

So when AI or contributors reason about frontend-generated metadata, they should verify:

- which repo is active
- which flavor is active
- which generated output belongs to that edition
- which concrete build and sync commands belong to that edition

The Basic commands above are scoped to this checkout; do not treat them as portable templates for Start or another edition/version. Resolve the corresponding commands from the active repository instead.

## Where to read next

- If your next question is about classifying the contract direction first, return to [Contract Loop Playbook](/fullstack/contract-loop-playbook).
- If your next question is the opposite direction, continue with [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).
- If your next question is about concrete mixed metadata/action collaboration, continue with [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).
- If your next question is about the concrete frontend authoring flows behind this handoff, continue with [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing) and [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers).

## Implementation checks for frontend-metadata changes

When changing frontend structural resources such as routes, renderers, or shared metadata, ask:

1. does metadata need regeneration?
2. does backend-side tooling or backend metadata rely on that handoff?
3. is this a Basic-specific or Start-specific workflow?
4. should the next action be generation, flavor build, and `deps:vona` rather than only source edits?
5. if backend still looks stale, is the problem generated-output drift or local dependency drift?

That keeps the reverse contract loop visible instead of accidental.
