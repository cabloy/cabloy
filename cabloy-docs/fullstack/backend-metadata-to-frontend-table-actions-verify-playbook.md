# Backend Metadata to Frontend Table Actions Verify Playbook

This page is a proof-oriented verification companion for one narrow fullstack question:

> after I change a Student row-action chain, what do I need to verify layer by layer before I trust the result?

Use this page together with:

- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- [Backend Metadata to Frontend Table Actions Debug Checklist](/fullstack/backend-metadata-to-frontend-table-actions-debug-checklist)
- [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)

> [!TIP]
> **Mixed-chain verification path**
>
> 1. **[Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)** — understand the mixed chain conceptually
> 2. **[Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map)** — trace the Student row-action chain in file order
> 3. **[Backend Metadata to Frontend Table Actions Verify Playbook](/fullstack/backend-metadata-to-frontend-table-actions-verify-playbook)** — prove the chain is correct after your change
> 4. **[Backend Metadata to Frontend Table Actions Debug Checklist](/fullstack/backend-metadata-to-frontend-table-actions-debug-checklist)** — use only when the visible result is still wrong
>
> **You are here:** step 3.
> **Previous recommended pages:** [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions) and [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map).

## Why this page exists

The current mixed-chain family already gives you three useful views:

- the conceptual chain
- the file-order source-reading path
- the symptom-first debug checklist

What it did not yet isolate directly was a **proof-oriented verification workflow**.

This page fills that gap.

It is not another diagnosis page. It is a playbook for proving one Student row-action chain is correct after a change.

## Fastest mental model for verification

A mixed Student row-action change is usually correct only when all of these are true:

1. backend metadata truth still points to the intended action resources
2. if custom semantics changed, the generated frontend contract surface is refreshed correctly
3. the frontend action resources still align with the intended identities and behavior
4. the page/runtime handoff still carries the expected row schema and permissions into `ZTable`
5. the visible Admin behavior matches the intended contract

The fastest verification strategy is:

> prove each layer in order, and only classify drift or runtime issues after those proofs already pass.

## Phase 1: Scope the branch first

Before checking files, decide what kind of change you actually made.

### Mostly reverse-chain

Use this path when:

- you changed only which frontend action resource a row or field metadata points to
- no new backend endpoint or response contract is needed
- the visible change is mostly metadata-driven

Typical examples:

- switching a field to `basic-table:actionView`
- adding or reordering actions under `actionOperationsRow`
- changing a custom frontend action resource that backend metadata references

### Mostly forward-chain

Use this path when:

- the action semantics changed because backend endpoint truth changed
- frontend generated API consumers must regenerate
- the visible row action is only the last step of a backend-contract change

Typical examples:

- adding or changing `summary`
- adding or changing `deleteForce`

### True mixed custom-action case

Use this path when both are true:

- backend endpoint truth changed
- backend row metadata also points to custom frontend action resources that expose the result visibly

That is the full mixed-chain case this playbook is built for.

## Phase 2: Prove backend source truth

Start with the earliest source of truth that should already be correct.

Primary anchors:

- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`
- `vona/src/module/demo-student/src/controller/student.ts`
- `vona/src/module/demo-student/src/dto/studentSummary.tsx`

What to prove:

- row metadata still points to the intended action resources
- the controller still exposes the intended custom endpoint when one exists
- the response/request DTO truth still matches the intended action semantics

If this phase fails, stop here.
Do not debug frontend runtime yet.

## Phase 3: Prove the emitted/generated handoff

Only do this when the change touches custom action semantics or any backend-owned contract shape.

Primary anchors:

- `zova/src/module/demo-student/cli/openapi.config.ts`
- `zova/src/module/demo-student/src/api/demoStudent.ts`
- any reverse-shared generated output already relevant to the Student row-action path

What to prove:

- the frontend module still owns the expected generated OpenAPI slice
- the generated frontend API surface contains the expected custom method or changed contract
- if the change is reverse-sharing oriented, the refreshed metadata/build handoff is already correct before debugging downstream consumers

If this phase fails, the problem is still in the handoff/generation layer, not in the visible action resource.

## Phase 4: Prove frontend resource alignment

Once contract handoff looks correct, prove that the frontend action/resource layer still aligns with it.

Primary anchors:

- `zova/src/module/demo-student/src/model/student.ts`
- `zova/src/module/demo-student/src/bean/tableCell.actionSummary.tsx`
- `zova/src/module/demo-student/src/bean/tableCell.actionDeleteForce.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx`

What to prove:

- the custom or built-in action bean identity still matches the backend metadata identity
- thin model facades still delegate to the intended generated API/model path
- the action bean is still thin and semantic rather than acting like a second competing resource owner
- `actionOperationsRow` can still include and render the intended child actions

## Phase 5: Prove page/runtime handoff

Only now move into the page runtime handoff.

Primary anchors:

- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`

What to prove:

- `schemaRow` still contains the intended row-action metadata
- `permissions` still flow into the page runtime as expected
- `blockTable` still bridges the expected `schemaRow`, `data`, and `tableScope` into `ZTable`

If this phase fails, the issue is no longer contract definition or action resource alignment. It is the list/runtime handoff.

## Phase 6: Prove visible Admin behavior

Only after the earlier phases pass should you treat the page as ready for visible behavior checks.

What to prove in Admin:

- the expected row action is visible where it should be
- built-in or custom action ordering still matches the metadata truth
- custom action execution still uses the intended behavior
- after execution, the list/runtime state still matches the expected refresh/invalidation result

This is the point where the row-action chain becomes user-visible rather than just structurally correct.

## Phase 7: Classify drift only after proof steps

If the result is still wrong after the earlier phases, then classify the problem.

### Generated-output drift

This is the problem when:

- backend or reverse-shared source truth changed
- but the generated/shared handoff is still stale or incomplete

### Local dependency drift

This is the problem when:

- the generated/shared output already looks correct
- but local consumers still behave as if the old version is installed

### Visibility-only issue

This is the problem when:

- the action exists and the contract chain is correct
- but the action is hidden only by permissions or visibility logic

When that is the true problem, continue with [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide).

### Deeper table-runtime resolution issue

This is the problem when:

- metadata truth, generated handoff, frontend action alignment, and page handoff all already look correct
- but the final visible action still resolves incorrectly

Only then descend into the deeper table runtime docs.

## What this page does not re-explain

This page deliberately does **not** re-teach:

- generic contract-loop direction and drift theory -> see [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- the conceptual mixed-chain story -> see [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- the file-order mixed-chain path -> see [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map)
- the symptom-first diagnosis path -> see [Backend Metadata to Frontend Table Actions Debug Checklist](/fullstack/backend-metadata-to-frontend-table-actions-debug-checklist)
- deep visibility/permission semantics -> see [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- deep table-runtime internals -> see [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)

Its job is only to tell you what must be true at each layer before you trust the changed Student row-action chain.

## Where to read next

- If you need the conceptual mixed-chain page, return to [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).
- If you need the file-order path, continue with [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map).
- If the visible result is still wrong and you want symptom-first diagnosis, continue with [Backend Metadata to Frontend Table Actions Debug Checklist](/fullstack/backend-metadata-to-frontend-table-actions-debug-checklist).
- If the issue is really about direction/drift theory, return to [Contract Loop Playbook](/fullstack/contract-loop-playbook).
- If the bridge and mixed-chain proof already look correct and you now want the consumer-side verification family, continue with [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook) and [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist).

## Final takeaway

The cleanest way to verify a changed Student row-action chain is not to jump straight into deep runtime debugging.

First prove:

- backend source truth
- generated/shared handoff
- frontend action/resource alignment
- page/runtime handoff
- visible Admin behavior

Only then classify drift or descend into deeper runtime issues.
