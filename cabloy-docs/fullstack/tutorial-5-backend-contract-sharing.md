# Tutorial 5: Backend Contract Sharing

<Badge type="info" text="Basic" />

In this tutorial, one prompt lets AI show the forward direction of Cabloy’s fullstack contract loop: backend API contracts that generate and refresh the frontend consumption surface.

The teaching thread in this page is the pair of Student actions:

- `summary/:id`
- `deleteForce/:id`

## Goal

By the end of this tutorial, you will understand:

- how a backend controller and DTO change becomes frontend generated API output
- how backend row-action metadata can drive frontend table actions
- how generated API, frontend model helpers, and row-action beans fit into one contract-sharing workflow

## AI Prompt

Give AI a prompt like this:

```text
Act as my Cabloy Project pair programmer.

Task:
I already built the demo-student CRUD thread and the level rendering work in the previous tutorials. Help me implement backend contract sharing for two custom Student actions: summary/:id and deleteForce/:id.

Focus for this tutorial:
- use `summary/:id` and `deleteForce/:id` as the custom action thread
- regenerate the frontend OpenAPI-based contract output instead of hand-writing duplicate request types
- show how the generated frontend API, the frontend model wrapper, and the table row-action cells connect to those backend contracts

When you finish, return your answer in this format:
- Commands used
- Backend files changed
- Generated frontend contract files
- Frontend model or action files involved
- End-to-end contract chain
- What I should verify next
```
Optional follow-up prompt if you need to correct the result:

```text
Do not create ad hoc frontend request types first. Update the backend contract, then regenerate the frontend OpenAPI surface for demo-student.
```

## Why this step matters

This is the right step because it reduces duplicated type work across backend and frontend.

Instead of manually synchronizing request and response shapes in two places, this workflow keeps the backend as the source of truth and regenerates the frontend artifacts from that contract.

This step also shows that contract sharing is not only about API methods. It also affects how backend row-action metadata becomes frontend table behavior.

## CLI commands to inspect/use

Inspect the relevant command surfaces first:

```bash
npm run zova :openapi
npm run zova :openapi:config demo-student
npm run zova :openapi:generate demo-student
```

If your workflow also needs refreshed rest-contract output for Cabloy Basic, the related build commands are:

```bash
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

Usage notes:

- use the backend controller and DTOs as the starting point
- inspect the module OpenAPI config before generation
- prefer regeneration over hand-written duplicate API layers when the module already owns an OpenAPI contract surface

## Generated or affected files

The backend contract anchors are:

- `vona/src/module/demo-student/src/controller/student.ts`
- `vona/src/module/demo-student/src/dto/studentSummary.tsx`
- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

By the end of this tutorial, your `demo-student` controller should expose:

```typescript
@Web.get('summary/:id')
async summary(...) { ... }

@Web.delete('deleteForce/:id')
async deleteForce(...) { ... }
```

The frontend contract and consumption anchors are:

- OpenAPI config:
  - `zova/src/module/demo-student/cli/openapi.config.ts`
- generated frontend API:
  - `zova/src/module/demo-student/src/api/demoStudent.ts`
- frontend model wrapper:
  - `zova/src/module/demo-student/src/model/student.ts`
- custom row-action cells:
  - `zova/src/module/demo-student/src/bean/tableCell.actionSummary.tsx`
  - `zova/src/module/demo-student/src/bean/tableCell.actionDeleteForce.tsx`

After regeneration, `src/api/demoStudent.ts` should contain generated methods such as:

- `summary(...)`
- `deleteForce(...)`

## What those files mean in the business thread

This tutorial is easiest to understand as one contract chain:

1. `controller/student.ts` defines the backend action endpoints
2. `dto/studentSummary.tsx` defines the response contract for the summary action
3. `dto/studentSelectResItem.tsx` defines the row-action metadata that exposes those actions in the Student list page
4. `cli/openapi.config.ts` tells the frontend module which backend operations it owns
5. `src/api/demoStudent.ts` is the generated typed API surface created from that backend contract
6. `src/model/student.ts` wraps the generated API in frontend business-facing helper methods
7. `tableCell.actionSummary.tsx` and `tableCell.actionDeleteForce.tsx` turn those model methods into visible row actions

That is the practical contract-sharing loop: backend controller and DTO truth flows into generated frontend API output, then into frontend model helpers, and finally into visible table actions.

## Verification

1. regenerate the frontend contract output:

```bash
npm run zova :openapi:generate demo-student
```

2. make sure the local dev workflow is running:

```bash
npm run dev
```

3. open `http://localhost:7102/admin/`
4. enter the **Student** list page
5. trigger the **Summary** row action and verify that it uses the regenerated frontend API and returns the expected Student summary data
6. trigger the **Force Delete** row action and verify that it reaches the custom backend deleteForce contract path
7. inspect the source chain and confirm that each layer is present:
   - `controller/student.ts`
   - `dto/studentSummary.tsx`
   - `dto/studentSelectResItem.tsx`
   - `src/api/demoStudent.ts`
   - `src/model/student.ts`
   - `tableCell.actionSummary.tsx`
   - `tableCell.actionDeleteForce.tsx`

## Read more

- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [OpenAPI Guide](/backend/openapi-guide)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [SDK Guide](/frontend/sdk-guide)
- [Server Data](/frontend/server-data)

## Next step

Continue to [Tutorial 6: One Contract Surface, Four Uses](/fullstack/tutorial-6-one-contract-four-uses).
