# Tutorial 3: Frontend Metadata Sharing

<Badge type="info" text="Basic" />

This tutorial shows the reverse direction of Cabloy’s fullstack contract loop: frontend render resources that are referenced back from backend field contracts.

## Goal

By the end of this tutorial, you will understand:

- why Cabloy fullstack sharing is bidirectional
- how a frontend render resource can participate in backend entity and DTO metadata
- how schema-driven table rendering stays close to the backend field contract

## Why this step matters

This tutorial does **not** mean that backend and frontend literally share arbitrary component code.

Instead, the frontend defines render resources, and the backend field contract references those resources through metadata.

That is why this is better described as **frontend metadata sharing** than only “frontend type sharing.”

## Before you run commands

Before starting this tutorial, make sure Tutorial 2 is already complete.

Work from the repo root and keep these source facts in mind:

- the current public `demo-student` example already has `name` and `description`
- the current public `demo-student` example does **not** already contain `student.level`
- the current frontend module does **not** already contain a custom `studentLevel` render resource

So this tutorial must first create the missing business field and then wire a new frontend render resource back into that contract.

## Step 1: Inspect the current starting state

Before creating anything new, inspect the current Student example.

Representative source anchors:

- `vona/src/module/demo-student/src/entity/student.tsx`
- `vona/src/module/demo-student/src/dto/studentCreate.tsx`
- `vona/src/module/demo-student/src/dto/studentUpdate.tsx`
- `vona/src/module/demo-student/src/dto/studentView.tsx`
- `vona/src/module/demo-student/src/dto/studentSelectReq.tsx`
- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

A useful beginner observation is:

- the entity already shows `ZovaRender.order(...)`, `ZovaRender.field(...)`, and `ZovaRender.cell(...)` patterns
- `studentSelectReq.tsx` already shows filter-side `ZovaRender.field(...)` usage
- `studentSelectResItem.tsx` already shows list-page blocks and row-action composition

That is the real starting point.

## Step 2: Add `student.level` to the backend contract surface first

Use `level` as the teaching field for this tutorial.

A simple business meaning is enough, for example:

- student level
- training stage
- level code such as `primary`, `intermediate`, or `advanced`

Start in the entity:

- `vona/src/module/demo-student/src/entity/student.tsx`

A representative direction is to add a small field such as:

```typescript
@Api.field(
  v.title($locale('Level')),
  v.required(),
  ZovaRender.order(3),
)
level: string;
```

In the current Student example, the create, update, and view DTO classes are already thin page-entry wrappers around the model-driven contract surface. That means the first important change belongs in the entity.

Then inspect the related DTO surfaces and only add follow-up metadata where the workflow really needs it:

- `vona/src/module/demo-student/src/dto/studentCreate.tsx`
- `vona/src/module/demo-student/src/dto/studentUpdate.tsx`
- `vona/src/module/demo-student/src/dto/studentView.tsx`
- `vona/src/module/demo-student/src/dto/studentSelectReq.tsx`
- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

A practical beginner rule is: without a real backend field first, there is nothing for frontend metadata to target.

## Step 3: Inspect the frontend CLI and bean scene first

When you need a new render resource, create it on the frontend side with the existing Zova CLI surface instead of inventing file placement manually.

Start by discovering the relevant create surface:

```bash
npm run zova :create
npm run zova :create:bean --help
```

Authoritative command shape in this repo:

```bash
npm run zova :create:bean sceneName beanName -- [--module=] [--boilerplate=]
```

For this tutorial, the important scene is `tableCell`.

If you want to inspect current scene and boilerplate guidance first, use:

- [Frontend CLI](/frontend/cli)
- [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates)

## Step 4: Generate the frontend `tableCell` resource

Create the new render resource from the repo root:

```bash
npm run zova :create:bean tableCell studentLevel -- --module=demo-student
```

Then inspect the generated file. In the current module layout, a beginner should expect a bean path like:

- `zova/src/module/demo-student/src/bean/tableCell.studentLevel.tsx`

The default generated table-cell bean is intentionally small. It gives you a valid frontend render resource that the backend contract can reference.

A useful comparison anchor is the current built-in table-cell boilerplate and examples:

- `zova/src/suite-vendor/a-zova/modules/a-table/cli/tableCell/boilerplate/{{sceneName}}.{{beanName}}.tsx_`
- `zova/src/suite/a-demo/modules/demo-basic/src/bean/tableCell.test.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-select/src/bean/tableCell.select.tsx`

## Step 5: Reference the generated resource from backend metadata

Once the frontend resource exists, wire it back into the backend field contract.

That means returning to:

- `vona/src/module/demo-student/src/entity/student.tsx`

and attaching the generated table-cell resource to the new `level` field:

```typescript
@Api.field(
  v.title($locale('Level')),
  v.required(),
  ZovaRender.order(3),
  ZovaRender.cell('demo-student:studentLevel'),
)
level: string;
```

This is the important mental model:

- frontend owns the render resource
- backend owns the business field contract
- metadata connects the two

If you want a current source example where a field already uses both field and cell render metadata, inspect:

- `vona/src/suite-vendor/a-test/modules/test-rest/src/entity/product.tsx`

## Step 6: Inspect the DTO surfaces and keep deeper form customization optional

Do not stop at the entity.

A good beginner follow-up is to inspect whether the related DTO surfaces need extra work for your teaching goal:

- `studentCreate.tsx`
- `studentUpdate.tsx`
- `studentView.tsx`
- `studentSelectReq.tsx`
- `studentSelectResItem.tsx`

In the current Student example, the first real win is the shared table-cell path.

If you want filter-side behavior later, inspect the existing `ZovaRender.field(...)` usage in:

- `vona/src/module/demo-student/src/dto/studentSelectReq.tsx`

If you want deeper custom form-field rendering later, treat that as a follow-up extension, not as the primary promised outcome of this tutorial.

## Step 7: Verify the visible result from the admin UI

After the backend metadata references the frontend render resource, use the same shared verification rhythm to confirm the visible result.

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. open `http://localhost:7102/admin/`
3. enter the **Student** list page from the **Student** menu
4. navigate to the table surface where the `level` field should appear
5. verify that the `level` column is now rendered through the shared metadata path you added

That is where the reverse fullstack direction becomes visible: the backend field contract is now pointing at a frontend render resource instead of hard-coding UI behavior page by page.

## Expected result

At the end of this tutorial, you should have all of these results:

1. a real `student.level` field in the backend contract surface
2. a generated frontend table-cell resource in the `demo-student` module
3. backend metadata that references that resource through `ZovaRender.cell('demo-student:studentLevel')`
4. a visible Student list-page result that proves the shared metadata path is working

## Checkpoint

Before moving to the next tutorial, make sure you can answer these questions:

1. did you start by adding a real backend `level` field before trying to reference any frontend resource?
2. which command created the frontend `tableCell` resource for `student.level`?
3. which backend file now points to `demo-student:studentLevel`?
4. which Student DTO already shows that render metadata can also participate in larger page structure?
5. if you want deeper form-specific behavior later, which surface should you inspect next?

## Why this is a Cabloy-specific strength

In many codebases, backend fields and frontend rendering drift apart because they live in different systems with weak contracts.

In Cabloy, the monorepo and metadata model make this collaboration path much more explicit.

The result is not “the frontend magically controls the backend.”
The result is that backend field contracts can reuse frontend render capabilities as part of one fullstack system.

## Read together with

- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
- [API Schema Guide](/frontend/api-schema-guide)
- [Server Data](/frontend/server-data)
- [Frontend CLI](/frontend/cli)
- [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates)

## Next step

Continue to [Tutorial 4: Backend Contract Sharing](/fullstack/tutorial-4-backend-contract-sharing).
