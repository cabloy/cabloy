# Tutorial 3: Frontend Metadata Sharing

<Badge type="info" text="Basic" />

In this tutorial, you ask AI to show the reverse direction of Cabloy’s fullstack contract loop: backend field metadata can reference frontend render resources.

You start with the simplest path first: reuse the existing built-in rendering resources for the `level` field.

## Goal

By the end of this tutorial, you will understand:

- why Cabloy fullstack sharing is bidirectional
- how a backend field can reuse frontend rendering resources through metadata
- how one `level` field can participate in schema-driven form and table behavior without a custom component yet

## AI Prompt

Give AI a prompt like this:

```text
Act as my Cabloy Basic pair programmer.

Task:
I already built the demo-student CRUD thread in the previous tutorials. Help me add and refine a level field so it uses built-in frontend rendering metadata through the backend contract.

Working rules:
1. Work from the repo root.
2. Inspect the existing backend entity and DTO surfaces first.
3. Prefer existing built-in Cabloy render resources before creating any custom frontend component.
4. Use level as the field that demonstrates both form and table rendering metadata.
5. Keep the result aligned with the module you built in the previous tutorials.
6. Do not introduce custom level renderers yet.

When you finish, return your answer in this format:
- Commands used
- Files changed
- Field metadata added or refined
- Which frontend render resources are being reused
- Why this is frontend metadata sharing
- What I should verify next
```
If AI drifts, redirect it with:

```text
Do not create a custom renderer yet. First implement level with built-in ZovaRender.field(...) and ZovaRender.cell(...) metadata.
```

## Why this step matters

This is the right AI-assisted step because it teaches you how to guide AI through a very specific Cabloy distinction.

You are not asking AI to make backend and frontend share arbitrary component code. You are asking AI to keep the backend field contract in charge while letting that contract reference frontend render resources through metadata.

That is why this step is better described as **frontend metadata sharing** than only “frontend type sharing.”

## CLI commands to inspect/use

This tutorial is mainly a contract-refinement step, so the most important habit is inspection before editing.

Useful discovery commands from the repo root:

```bash
npm run vona :
npm run zova :
npm run zova :create
```

You usually do **not** need to generate a custom bean in this tutorial.

Instead, inspect the current contract surfaces first:

- `vona/src/module/demo-student/src/entity/student.tsx`
- `vona/src/module/demo-student/src/dto/studentSelectReq.tsx`

Usage notes:

- keep the backend entity as the main source of truth for the `level` field
- prefer built-in frontend render resources first
- delay custom renderer authoring to the next tutorial

## Generated or affected files

The key backend contract anchor is:

- `vona/src/module/demo-student/src/entity/student.tsx`

By the end of this tutorial, the `level` field should follow a built-in path like this:

```typescript
@Api.field(
  v.title($locale('Level')),
  v.required(),
  ZovaRender.order(3),
  ZovaRender.field('basic-select:formFieldSelect', {
    items: levelItems,
    placeholder: $locale('LevelPlaceholder'),
  }),
  ZovaRender.cell('basic-select:select', { items: levelItems }),
  levelSchema,
)
level: number;
```

A related DTO anchor is:

- `vona/src/module/demo-student/src/dto/studentSelectReq.tsx`

That DTO already shows how filter-side field metadata can also participate in schema-driven UI.

## What those files mean in the business thread

This tutorial teaches one core mental model:

- the backend still owns the business field contract
- the frontend still owns the render resources
- metadata is the bridge between them

Concretely:

- `entity/student.tsx` defines `level` as a real business field
- `levelItems` gives that field a stable set of business options
- `ZovaRender.field('basic-select:formFieldSelect', ...)` makes the form side schema-aware
- `ZovaRender.cell('basic-select:select', ...)` makes the table side schema-aware
- `dto/studentSelectReq.tsx` reminds you that filter-side metadata is also part of the same contract story

At this stage, you do not need a custom frontend component to understand the reverse-sharing model.

## Verification

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. open `http://localhost:7102/admin/`
3. enter the **Student** list page from the **Student** menu
4. verify that the `level` field appears with select-style behavior in the relevant schema-driven surfaces
5. inspect `vona/src/module/demo-student/src/entity/student.tsx` and confirm that the backend field contract now points to built-in frontend render resources instead of page-local hard-coded UI logic

## Read more

- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
- [API Schema Guide](/frontend/api-schema-guide)
- [Server Data](/frontend/server-data)
- [Frontend CLI](/frontend/cli)

## Next step

Continue to [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers).
