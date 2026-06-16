# Tutorial 2: Create Your First CRUD

<Badge type="info" text="Basic" />

In this tutorial, one prompt lets AI turn the new module into its first real business thread by generating a `student` CRUD workflow.

## Goal

By the end of this tutorial, you will understand:

- why Cabloy prefers CRUD generation over hand-written boilerplate
- what the generated backend thread usually includes
- how the generated entity and DTO surface becomes the contract foundation for later tutorials
- why this step does not generate any frontend code, but already gives you a complete CRUD admin page through Cabloy’s existing schema-driven surface

## AI Prompt

Give AI a prompt like this:

```text
I already created the demo-student module. Help me generate the first CRUD thread for a student resource.
```
Optional follow-up prompt if you need to correct the result:

```text
Inspect npm run vona :tools first, then use the CRUD generator command instead of scaffolding files manually.
```

## Why this step matters

Once the module exists, this is the next useful step because the prompt can drive the CRUD generator instead of hand-building controller, service, model, entity, DTO, metadata, locale, and tests one by one.

That keeps the conversation focused on the generated business thread rather than on repetitive scaffolding details.

## CLI commands to inspect/use

Inspect the CRUD family first:

```bash
npm run vona :tools
npm run vona :tools:crud --help
npm run vona :tools:crudBasic --help
```

Generate the `student` CRUD thread:

```bash
npm run vona :tools:crud student -- --module=demo-student
```

Equivalent Basic-specific entrypoint:

```bash
npm run vona :tools:crudBasic student -- --module=demo-student
```

Usage notes:

- `:tools:crud` is the public entrypoint beginners should prefer
- `:tools:crudBasic` is useful when you want to inspect the Basic-specific underlying path directly
- after generation, verify the result from the admin UI instead of stopping at file inspection

## Generated or affected files

After generation, inspect the resulting backend thread before refining anything.

By the end of this tutorial, your `demo-student` backend thread should have a representative shape under `vona/src/module/demo-student/src/`:

- `controller/student.ts`
- `service/student.ts`
- `model/student.ts`
- `entity/student.tsx`
- `dto/studentCreate.tsx`
- `dto/studentUpdate.tsx`
- `dto/studentView.tsx`
- `dto/studentSelectReq.tsx`
- `dto/studentSelectRes.tsx`
- `dto/studentSelectResItem.tsx`
- `bean/meta.version.ts`

There is also a test anchor at:

- `vona/src/module/demo-student/test/student.test.ts`

## What those files mean in the business thread

As you inspect the generated files, pay attention to the division of responsibility:

1. `controller/student.ts` exposes the HTTP contract
2. `service/student.ts` owns orchestration
3. `model/student.ts` owns persistence behavior
4. `entity/student.tsx` defines the field-oriented contract surface
5. the DTO files define operation-specific request and response contracts
6. `bean/meta.version.ts` anchors the module schema/version thread
7. `test/student.test.ts` gives you a verification anchor for the generated backend flow

This is the backend contract thread that later tutorials will extend with `level`, `mobile`, render metadata, OpenAPI output, and row actions.

## Verification

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. open `http://localhost:7102/admin/`
3. enter the **Student** list page from the **Student** menu
4. trigger create, read, update, and delete operations from the page
5. inspect the generated backend files and confirm that the CRUD layers are present:
   - `vona/src/module/demo-student/src/entity/student.tsx`
   - `vona/src/module/demo-student/src/controller/student.ts`
   - `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

## Read more

- [CRUD Workflow](/backend/crud-workflow)
- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [Validation Guide](/backend/validation-guide)

## Next step

Continue to [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing).
