# Tutorial 2: Create Your First CRUD

<Badge type="info" text="Basic" />

This tutorial turns the new module into the first real business thread by generating a `student` CRUD workflow.

## Goal

By the end of this tutorial, you will understand:

- why Cabloy prefers CRUD generation over hand-written boilerplate
- what the generated backend thread usually includes
- how the generated entity and DTO surface becomes the contract foundation for later tutorials

## Why this step matters

Once the module exists, the next useful step is not to hand-build controller, service, model, entity, DTO, metadata, locale, and tests one by one.

Cabloy already provides a CRUD generator for that thread.

## Before you run commands

Make sure the module from Tutorial 1 already exists.

Work from the repo root and keep the module name ready. In this series, the examples assume `demo-student`.

## Step 1: Inspect the CRUD family

Run from the repo root:

```bash
npm run vona :tools
```

Then inspect the command surfaces you care about:

```bash
npm run vona :tools:crud --help
npm run vona :tools:crudBasic --help
```

In the current Cabloy Basic repo, `:tools:crud` is the public entrypoint and routes to the Basic-specific CRUD path. Beginners can start with `:tools:crud`, while advanced readers can still inspect `:tools:crudBasic` directly.

## Step 2: Generate the `student` CRUD thread

Example:

```bash
npm run vona :tools:crud student -- --module=demo-student
```

Equivalent Basic-oriented surface:

```bash
npm run vona :tools:crudBasic student -- --module=demo-student
```

This is the preferred Cabloy path because it keeps the framework-managed thread consistent from the start.

## Step 3: Verify the generated CRUD from the admin UI

After the CLI command finishes, do not stop at file inspection. Use the generated UI to verify that the CRUD thread is already usable.

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. open `http://localhost:7102/admin/`
3. enter the **Student** list page from the **Student** menu
4. trigger create, read, update, and delete operations from the page
5. verify that the generated Student business thread is already usable from the admin UI

This is an important beginner checkpoint: after generator-driven CRUD creation, you should be able to verify the Student business thread from the admin UI, not only from source files.

## Step 4: Inspect the generated files immediately

After generation, inspect the resulting backend thread before changing it.

The current public Student example shows a representative generated shape under `vona/src/module/demo-student/src/`:

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

The exact generated file set can evolve. The point is to understand the thread, not memorize a frozen list.

## Step 5: Refine the first business fields

For this tutorial series, refine the generated `student` resource around these fields:

- `name`
- `description`
- `level`
- `mobile`

A practical beginner sequence is:

1. keep `name` and `description` first
2. add `level` for render-oriented work in Tutorial 3
3. add `mobile` for validation and serialization work in Tutorial 5

Keep the first refinement small.

A good beginner rule is:

- let the generator create the architecture thread
- manually refine only the fields and behaviors the teaching scenario actually needs

## Step 6: Compare with the existing Student example

This repo already contains a useful Student reference thread.

Representative source anchors:

- `vona/src/module/demo-student/src/entity/student.tsx`
- `vona/src/module/demo-student/src/dto/studentCreate.tsx`
- `vona/src/module/demo-student/src/dto/studentUpdate.tsx`
- `vona/src/module/demo-student/src/dto/studentView.tsx`
- `vona/src/module/demo-student/src/controller/student.ts`
- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

Use these files to understand the current Cabloy style for:

- `@Api.field(...)`
- validation helpers such as `v.required()` and `v.optional()`
- DTO creation through `$Dto.create(...)`, `$Dto.update(...)`, and `$Dto.get(...)`
- controller route declaration through `@Web.get()`, `@Web.post()`, `@Web.patch()`, and `@Web.delete()`
- table and list page block composition through `ZovaRender.block(...)`

## Step 7: Understand the generated contract thread

As you inspect the generated files, pay attention to the division of responsibility:

1. controller exposes the HTTP contract
2. service owns orchestration
3. model owns persistence behavior
4. entity defines the field-oriented contract surface
5. DTOs define operation-specific request and response contracts

That architecture is the base for the later fullstack sharing work in this series.

## Expected result

At the end of this tutorial, you should have one working backend resource thread for `student`.

At minimum, you should be able to point to:

- a controller for the HTTP contract
- an entity for the field contract
- DTOs for create, update, and view behavior
- a test file for the generated CRUD flow
- a working **Student** list page in the admin UI where you can perform create, read, update, and delete operations

If you cannot clearly identify those surfaces yet, stop here and inspect the generated files and verify the Student page again in the admin UI before moving on.

## Checkpoint

Before moving to the next tutorial, make sure you can answer these questions:

1. have you already opened `http://localhost:7102/admin/`, entered the **Student** list page, and completed create, read, update, and delete operations there?
2. where will the `level` field be defined first?
3. where will the `mobile` field validation rules live?
4. which file exposes the HTTP endpoints for the `student` resource?
5. which DTOs will later feed OpenAPI and frontend SDK generation?

## Read together with

- [CRUD Workflow](/backend/crud-workflow)
- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [Validation Guide](/backend/validation-guide)

## Next step

Continue to [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing).
