# Backend Metadata to Frontend Table Actions Source Reading Map

This page is a practical source-reading companion for one narrow fullstack question:

> if I need to trace one Student row-action chain across backend metadata, generated contract follow-up, and frontend action resources, which files should I open first, and in what order?

Use this page together with:

- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)

> [!TIP]
> **Mixed-chain reading path**
>
> 1. **[Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)** — understand the mixed contract chain conceptually
> 2. **[Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map)** — trace the same Student row-action chain in file order
>
> **You are here:** step 2.
> **Previous recommended page:** [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).

## Why this page exists

The current mixed-chain explainer page already answers the conceptual question well:

- backend metadata chooses frontend action resources
- generated API/model follow-up can join that same thread when custom actions need backend endpoints
- the visible row action is only the last step of the chain

What it does not isolate directly is the shortest source-order path through one real Student row-action thread.

This page fills that gap.

It is a file-order map, not another runtime explainer.

## How to use this page

For the two paths below:

1. start with the conceptual mixed-chain page first
2. read the first source file to identify the current source of truth
3. follow the handoff only until you can answer the question you actually have
4. stop before you drift into deeper table/runtime internals unless they are really needed

## 1. Built-in row-action chain

Use this path when your question is about:

- how one built-in row action becomes visible
- how `actionOperationsRow` composes visible child actions
- where backend metadata stops and frontend action resources start

### Read the docs first

- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)

### Then read source in this order

1. `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-table/src/bean/tableCell.actionOperationsRow.tsx`
3. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`

### What each file clarifies

- `studentSelectResItem.tsx` shows the backend-owned row DTO metadata that chooses `basic-table:actionOperationsRow` and the visible child actions inside it
- `tableCell.actionOperationsRow.tsx` shows how the frontend runtime filters those child actions by permission and renders them through nested action resources
- `blockPage/controller.tsx` shows how `schemaRow`, `permissions`, and list data are exposed from the stable resource owner into the page runtime
- `blockTable/controller.tsx` shows the bridge from page runtime into `ZTable`

## 2. Custom action chain with generated contract follow-up

Use this path when your question is about:

- how a custom row action such as `summary` or `deleteForce` joins the mixed chain
- where the forward-generated API/model path enters
- how the visible action stays thin while backend truth and resource ownership remain coherent

### Read the docs first

- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)

### Then read source in this order

1. `vona/src/module/demo-student/src/controller/student.ts`
2. `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`
3. `zova/src/module/demo-student/cli/openapi.config.ts`
4. `zova/src/module/demo-student/src/api/demoStudent.ts`
5. `zova/src/module/demo-student/src/model/student.ts`
6. `zova/src/module/demo-student/src/bean/tableCell.actionSummary.tsx`
7. `zova/src/module/demo-student/src/bean/tableCell.actionDeleteForce.tsx`
8. optional downstream handoff:
   - `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`
   - `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockTable/controller.tsx`

### What each file clarifies

- `controller/student.ts` shows the backend source truth for custom endpoints such as `summary/:id` and `deleteForce/:id`
- `studentSelectResItem.tsx` shows the backend row metadata that inserts the custom row actions into the operations column
- `openapi.config.ts` shows the frontend module ownership rule for generated OpenAPI operations
- `api/demoStudent.ts` shows the generated typed API surface that the frontend can consume
- `model/student.ts` shows the thin semantic facade over the stable resource owner
- `tableCell.actionSummary.tsx` shows a visible action that stays thin and delegates summary behavior into the model/API path
- `tableCell.actionDeleteForce.tsx` shows the same pattern for force-delete behavior
- `blockPage` and `blockTable` are only needed when the question becomes “how does the list runtime carry that row schema into visible table output?”

## What this page does not re-explain

This page deliberately does **not** re-teach:

- generic table runtime internals -> see [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)
- CRUD list-page assembly -> see [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- row/bulk permission filtering semantics -> see [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide)
- the pure forward bridge -> see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- the pure reverse bridge -> see [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)

Its job is only to provide the shortest file-order path through one mixed Student row-action chain.

## Where to read next

- If you need the conceptual mixed-chain explanation first, return to [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions).
- If you now want to prove the Student row-action chain end-to-end after a change, continue with [Backend Metadata to Frontend Table Actions Verify Playbook](/fullstack/backend-metadata-to-frontend-table-actions-verify-playbook).
- If the visible Student row action is still wrong after you understand the file-order path, continue with [Backend Metadata to Frontend Table Actions Debug Checklist](/fullstack/backend-metadata-to-frontend-table-actions-debug-checklist).
- If your next question is purely forward-chain, continue with [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).
- If your next question is purely reverse-chain, continue with [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend).
- If your next question becomes table-runtime specific, continue with [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map) and [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide).

## Final takeaway

The cleanest way to read a mixed Student row-action chain is not to jump directly into either the backend bridge docs or the deepest table runtime files.

Start from the backend row metadata that chooses the visible action resources, then follow the custom forward-generated path only when the action semantics actually require new backend endpoints.
