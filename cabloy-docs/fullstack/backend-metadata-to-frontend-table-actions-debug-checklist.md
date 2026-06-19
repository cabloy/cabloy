# Backend Metadata to Frontend Table Actions Debug Checklist

This page is a symptom-first verify/debug companion for one narrow fullstack question:

> when a visible Student row action is wrong, stale, hidden, or missing, which layer should I check next?

Use this page together with:

- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)

> [!TIP]
> **Mixed-chain diagnosis path**
>
> 1. **[Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)** — understand the mixed chain conceptually
> 2. **[Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map)** — trace the Student row-action chain in file order
> 3. **[Backend Metadata to Frontend Table Actions Debug Checklist](/fullstack/backend-metadata-to-frontend-table-actions-debug-checklist)** — verify which layer is wrong when the visible action still fails
>
> **You are here:** step 3.
> **Previous recommended pages:** [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions) and [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map).

## Why this page exists

The current docs already explain the mixed chain in two useful ways:

- conceptually, through the mixed-chain explainer page
- structurally, through the mixed-chain source-reading map

What was still missing was one page that starts from symptoms.

This page fills that gap.

It is not another contract-loop overview and not another table-runtime deep dive. It is a practical checklist for debugging one Student row-action chain.

## Fastest mental model for diagnosis

A visible row action can fail at several different layers:

1. backend row metadata may not point to the intended action resource
2. custom backend action semantics may not have refreshed the generated frontend contract surface
3. the frontend action resource may be missing or stale
4. the page block/runtime handoff may not be feeding the right row schema into `ZTable`
5. the table runtime may finally be filtering or resolving the action differently than expected

The fastest debugging strategy is:

> check the earliest possible source of truth first, and only descend into deeper runtime layers when the earlier layers already look correct.

## Debugging checklist by layer

### 1. Check the backend row metadata first

Start here when:

- the action is missing entirely
- the wrong action appears in the operations column
- the custom action is not present in the backend contract surface at all

Primary source anchor:

- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

What to confirm:

- the row metadata still uses the intended `ZovaRender.cell(...)` identity
- nested `ZovaRender.tableActionRow(...)` entries include the expected action names
- custom actions such as `demo-student:actionSummary` or `demo-student:actionDeleteForce` are still present where expected

If this layer is wrong, stop here and fix the metadata truth first.

### 2. Check the forward-generated contract only when custom action semantics changed

Only do this when the visible action depends on a changed backend endpoint such as:

- `summary/:id`
- `deleteForce/:id`

Primary source anchors:

- `vona/src/module/demo-student/src/controller/student.ts`
- `zova/src/module/demo-student/cli/openapi.config.ts`
- `zova/src/module/demo-student/src/api/demoStudent.ts`
- `zova/src/module/demo-student/src/model/student.ts`

What to confirm:

- the backend controller still exposes the intended custom endpoint
- the frontend module OpenAPI config still owns the expected operation slice
- the generated frontend API surface still contains the expected typed method
- the thin model facade still delegates to the correct generated API path while keeping the existing resource-owner story intact

If the endpoint changed but the generated contract did not refresh, the issue is not the visible action resource yet.
It is a forward-chain regeneration problem.

### 3. Check that the frontend action resource exists and matches the metadata identity

Start here when:

- backend metadata looks correct
- generated contract also looks correct
- but the visible action still does not render or behaves like the wrong action implementation

Primary source anchors:

- `zova/src/module/demo-student/src/bean/tableCell.actionSummary.tsx`
- `zova/src/module/demo-student/src/bean/tableCell.actionDeleteForce.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx`

What to confirm:

- the expected custom or built-in action bean exists
- the resource identity in backend metadata still matches the frontend bean identity
- the custom action bean is still thin and delegates to the right model or command path
- `actionOperationsRow` is still able to include and render the child action resources

### 4. Check the page handoff into the list/table runtime

Start here when:

- backend metadata and action resources both look correct
- but the list page still does not expose the action as expected

Primary source anchors:

- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`

What to confirm:

- `schemaRow` is still exposed from the stable resource owner
- `permissions` are still flowing through the shared page runtime
- `blockTable` is still bridging the expected `schemaRow`, `data`, and `tableScope` into `ZTable`

If this layer is wrong, the problem is in the page/runtime handoff, not in the action bean itself.

### 5. Only then check final table/runtime resolution

Go here last when:

- metadata truth is correct
- generated contract is correct
- action resources exist
- page block handoff also looks correct
- but the action still renders incorrectly

Primary final-runtime anchor:

- `zova/src/suite-vendor/a-zova/modules/a-table/src/component/table/controller.tsx`

At this point, switch from contract debugging into deeper table-runtime debugging.

For the broader table runtime reading path, continue with [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map).

## How to classify the failure

### Visible action missing entirely

Most likely checks, in order:

1. backend row metadata truth
2. frontend action resource identity exists
3. page block/schema handoff

### Visible action exists but uses stale behavior

Most likely checks, in order:

1. if custom semantics changed, inspect the forward-generated contract path
2. distinguish generated-output drift from local dependency drift
3. then confirm the action bean still delegates to the expected model/API path

### Visible action exists but wrong permissions or visibility

This is often a narrower visibility problem rather than a full mixed-chain problem.

When that is the real issue, continue with [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide).

### Visible action exists but wrong runtime/render resolution

Treat this as the deepest layer.

Only go here after upstream contract, generation, action-resource, and page handoff checks already pass.

## Generated-output drift vs local dependency drift

A useful distinction is:

### Generated-output drift

This is the problem when:

- the custom backend contract changed
- but the generated frontend API/model surface was not refreshed correctly

Typical response:

1. confirm backend contract truth first
2. refresh the generated frontend contract surface
3. verify the generated output itself before debugging the visible action

### Local dependency drift

This is the problem when:

- the generated output already contains the expected action contract or types
- but local consumers still behave as if the old version is installed

Typical response:

1. stop editing source truth
2. prove the generated handoff is already correct
3. rerun the normal sync flow
4. only then repair local install state if needed

For the broader drift vocabulary, continue with [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## What this page does not re-explain

This page deliberately does **not** re-teach:

- generic contract-loop direction and drift theory -> see [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- the conceptual mixed-chain story -> see [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- the file-order mixed-chain path -> see [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map)
- table-action permission semantics in depth -> see [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- deep table runtime internals -> see [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)

Its job is only to tell you which layer to verify next when the visible Student row action still fails.

## Where to read next

- If you need the conceptual mixed-chain explanation first, return to [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).
- If you need the file-order path first, continue with [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map).
- If you want a proof-oriented layer-by-layer validation workflow after making a change, continue with [Backend Metadata to Frontend Table Actions Verify Playbook](/fullstack/backend-metadata-to-frontend-table-actions-verify-playbook).
- If the issue is really visibility/permission logic, continue with [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide).
- If the mixed-chain layer itself now looks correct and you want the frontend consumer-side diagnosis family, continue with [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist).
- If the issue becomes deep table-runtime resolution, descend into [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map).

## Final takeaway

The cleanest way to debug a visible Student row action is not to start from the deepest table runtime file.

Start from backend row metadata truth, then only move into generated contract follow-up, action resource existence, page handoff, and final runtime resolution as needed.
