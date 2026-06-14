# Tutorial 3: Frontend Metadata Sharing

<Badge type="info" text="Basic" />

This tutorial shows the reverse direction of Cabloy’s fullstack contract loop: frontend render resources that are referenced back from backend field contracts.

## Goal

By the end of this tutorial, you will understand:

- why Cabloy fullstack type sharing is bidirectional
- how a frontend render resource can participate in backend DTO and entity metadata
- how schema-driven form and table rendering stays close to the backend field contract

## What “frontend metadata sharing” means here

This tutorial does **not** mean that backend and frontend literally share arbitrary component code.

Instead, the frontend defines render resources, and the backend field contract references those resources through metadata.

That is why this is better described as **frontend metadata sharing** than only “frontend type sharing.”

## Copy-first command block

If you want the shortest possible start, copy and run this command from the repo root:

```bash
npm run zova :create:bean tableCell studentLevel -- --module=demo-student
```

Then inspect these files first:

- `zova/src/module/demo-student/src/bean/`
- `vona/src/module/demo-student/src/entity/student.tsx`
- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

## The teaching field: `student.level`

Use `level` as the teaching field for this tutorial.

It is a natural example because beginners can immediately understand why the field might want:

- a custom form field rendering style
- a custom table cell display style
- shared metadata instead of repeated UI decisions in many places

## Step 1: Inspect the existing render contract pattern

Before creating anything new, inspect the current pattern in the Student example.

Representative source anchors:

- `vona/src/module/demo-student/src/entity/student.tsx`
- `vona/src/module/demo-student/src/dto/studentCreate.tsx`
- `vona/src/module/demo-student/src/dto/studentUpdate.tsx`
- `vona/src/module/demo-student/src/dto/studentView.tsx`
- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

Notice how these files already use metadata such as:

- `ZovaRender.order(...)`
- `ZovaRender.field(...)`
- `ZovaRender.cell(...)`
- `ZovaRender.block(...)`

This is the key idea: backend field and page metadata can point at frontend render resources.

## Step 2: Inspect the frontend generation surfaces

When you need a new render resource, create it on the frontend side first.

That usually means using the Zova CLI rather than inventing file placement manually.

Start by discovering the relevant create surface:

```bash
npm run zova :create
npm run zova :create:component --help
npm run zova :create:bean --help
```

Authoritative command shapes in this repo include:

```bash
npm run zova :create:component componentName -- [--module=] [--boilerplate=]
npm run zova :create:bean sceneName beanName -- [--module=] [--boilerplate=]
```

Then choose the narrowest generator that matches the resource you want to add.

- if your team models the new render as a standard component, start with `:create:component`
- if the render belongs to an existing bean scene such as a table-cell workflow, start with `:create:bean`

## Step 3: Create the frontend render resource first

For example, a table-cell-oriented path may look like:

```bash
npm run zova :create:bean tableCell studentLevel -- --module=demo-student
```

If the scene exposes multiple boilerplates, inspect them before deciding which one matches your use case.

The current built-in examples are summarized in:

- [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates)

A good beginner rule is: create the render resource first, then reference it from backend metadata. Do not start by hard-coding frontend rendering in a page if your goal is shared contract behavior.

## Step 4: Attach the render resource from backend metadata

Once the frontend resource exists, reference it from the backend field contract.

A representative entity pattern already looks like this:

```typescript
@Api.field(
  v.title($locale('Name')),
  v.required(),
  ZovaRender.order(1),
  ZovaRender.cell('basic-table:actionView'),
)
name: string;
```

For the `level` field, the goal is the same pattern with a field-specific render and, if useful, a matching table-cell render.

This is the important mental model:

- frontend owns the render resource
- backend owns the business field contract
- metadata connects the two

A representative field-level snippet from the current Student entity looks like this:

```typescript
@Api.field(
  v.title($locale('Name')),
  v.required(),
  v.min(2),
  ZovaRender.order(1),
  ZovaRender.cell('basic-table:actionView'),
)
name: string;
```

A representative list-page snippet from the current Student DTO looks like this:

```typescript
@Dto({
  blocks: [
    ZovaRender.block('basic-page:blockPage', {
      blocks: [
        ZovaRender.block('basic-page:blockFilter'),
        ZovaRender.block('basic-page:blockToolbarBulk', {
          actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')],
        }),
        ZovaRender.block('basic-page:blockTable'),
        ZovaRender.block('basic-page:blockPager'),
      ],
    }),
  ],
})
```

These two snippets show the same idea at two levels:

- field metadata can reuse frontend render resources
- page and table structure can also be driven by the same render-oriented contract system

## Step 5: Check the DTO surface too

Do not stop at the entity.

In this repo, DTOs also participate in render-aware metadata and page-block composition.

A good example is the Student list-response item:

- `vona/src/module/demo-student/src/dto/studentSelectResItem.tsx`

That file shows that the frontend render conversation is not only about a single field. It also reaches page blocks, toolbars, table rows, and row actions.

## Expected result after this tutorial

At the end of this tutorial, you should have both of these results:

1. a new frontend render resource in the `demo-student` frontend module
2. a backend field contract that references that resource through `ZovaRender.field(...)` or `ZovaRender.cell(...)`

Depending on the generator and scene you used, the new frontend file will typically appear under one of these shapes:

- `zova/src/module/demo-student/src/component/...`
- `zova/src/module/demo-student/src/bean/...`
- `zova/src/module/demo-student/src/<sceneName>/...`

And the backend metadata anchor will typically be in:

- `vona/src/module/demo-student/src/entity/student.tsx`
- and sometimes related DTO files too

## Step 6: Let schema-driven UI consume the contract

After the backend metadata references the frontend render resource, the frontend schema-driven layers can use that contract for rendering.

That is where pages, forms, and tables benefit from the same field-oriented definition instead of duplicating UI decisions manually.

Read that together with the schema-driven frontend surfaces:

- `$apiSchema`
- `$sdk`
- form-field render resources
- table-cell render resources

## Checkpoint

Before moving to the next tutorial, make sure you can answer these questions:

1. which side creates the render resource first?
2. which backend file references that render resource through metadata?
3. why is this workflow better than duplicating render choices page by page?
4. which existing Student DTO shows that render metadata can participate in larger page structure too?

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