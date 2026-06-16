# Tutorial 4: Custom Form/Table Renderers for Level

<Badge type="info" text="Basic" />

In this tutorial, you ask AI to upgrade the `level` field from built-in render resources to custom frontend renderers owned by the `demo-student` module.

## Goal

By the end of this tutorial, you will understand:

- when built-in render metadata is enough and when a custom renderer is worth adding
- how a frontend table cell bean and a frontend form-field component can both serve the same backend field
- how backend metadata points to module-owned frontend render resources

## AI Prompt

Give AI a prompt like this:

```text
Act as my Cabloy Basic pair programmer.

Task:
I already implemented the demo-student level field with built-in rendering metadata in this monorepo. Help me upgrade it to custom form and table renderers owned by the demo-student frontend module.

Working rules:
1. Work from the repo root.
2. Inspect the existing Zova CLI surfaces before creating files manually.
3. Generate or refine the frontend table-cell bean and frontend form-field component in the demo-student module.
4. Wire the backend level field metadata to those custom frontend resources.
5. Keep the result aligned with the module you built in the previous tutorials.
6. Treat this as an upgrade of the previous tutorial, not a restart from scratch.

When you finish, return your answer in this format:
- Commands used
- Files generated or changed
- Custom table renderer path
- Custom form renderer path
- Backend metadata targets
- What I should verify next
```
If AI drifts, redirect it with:

```text
Inspect npm run zova :create first. I need custom frontend renderer resources for level before wiring the backend metadata to them.
```

## Why this step matters

This is the right AI-assisted follow-up step because built-in render resources are a good starting point, but some business fields eventually need module-specific behavior.

The `level` field is a good teaching example because you can ask AI to deepen the UI in two concrete ways:

- a custom table cell that renders a more business-specific badge style
- a custom form field that adds helper text, readonly behavior, or module-specific select styling

This is where Cabloy’s contract model becomes more practical: the backend field still owns the business contract, while the frontend module progressively deepens the UI behavior behind that contract.

## CLI commands to inspect/use

Inspect the Zova create surface first:

```bash
npm run zova :create
npm run zova :create:bean --help
npm run zova :create:component --help
```

Representative generation commands for this tutorial:

```bash
npm run zova :create:bean tableCell level -- --module=demo-student
npm run zova :create:component formFieldLevel -- --module=demo-student
```

Usage notes:

- use `:create:bean` when you need a table-cell render resource under the bean scene
- use `:create:component` when you need a custom frontend component/controller surface
- generation gives you the structural starting point, but this tutorial still expects manual refinement so the result matches the `demo-student` teaching implementation
- after frontend resources exist, return to the backend entity and point `ZovaRender.field(...)` and `ZovaRender.cell(...)` at the custom module resources

## Generated or affected files

By the end of this tutorial, your module should provide these teaching anchors:

- custom table cell bean:
  - `zova/src/module/demo-student/src/bean/tableCell.level.tsx`
- custom form-field controller:
  - `zova/src/module/demo-student/src/component/formFieldLevel/controller.tsx`
- form-field metadata wrapper:
  - `zova/src/module/demo-student/src/.metadata/component/formFieldLevel.ts`
- backend field contract to update:
  - `vona/src/module/demo-student/src/entity/student.tsx`

Representative custom metadata targets are:

```typescript
ZovaRender.field('demo-student:formFieldLevel', {
  items: levelItems,
  helper: $locale('LevelPlaceholder'),
})
```

and:

```typescript
ZovaRender.cell('demo-student:level', { items: levelItems })
```

## What those files mean in the business thread

This tutorial makes the split of responsibilities explicit:

- `tableCell.level.tsx` owns the custom table-cell rendering behavior for `level`
- `component/formFieldLevel/controller.tsx` owns the custom form-field behavior for `level`
- `.metadata/component/formFieldLevel.ts` exposes that component through the module registration surface
- `entity/student.tsx` remains the backend-owned business contract that chooses which frontend resources should render the field

That means the backend still defines the business field, validation, and metadata entry point, while the frontend module owns the implementation details of the richer UI behavior.

## Verification

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. open `http://localhost:7102/admin/`
3. enter the **Student** list page and verify that the `level` column now uses the custom table-cell presentation
4. open a Student create, update, or view form and verify that the `level` field now uses the custom form-field behavior
5. inspect `vona/src/module/demo-student/src/entity/student.tsx` and confirm that the backend metadata now points to `demo-student:formFieldLevel` and `demo-student:level`

## Read more

- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
- [Frontend CLI](/frontend/cli)
- [Component Guide](/frontend/component-guide)
- [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates)

## Next step

Continue to [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing).
