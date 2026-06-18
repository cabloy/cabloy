# Tutorial 4: Custom Form/Table Renderers for Level

<Badge type="info" text="Basic" />

In this tutorial, one prompt lets the user express a simple product need: the `level` field in the Student experience should feel less generic and more like a real training-stage workflow.

From that user need, AI can infer that the next step is no longer just relabeling the field. It now needs a more dedicated rendering experience owned by the `demo-student` module.

This tutorial covers the **reverse chain** custom-resource handoff branch of the contract loop.

## Goal

By the end of this tutorial, you will understand how a user-facing request about a more business-specific `level` experience turns into a concrete custom-renderer implementation.

In particular, you will understand:

- when built-in render metadata is enough and when a custom renderer is worth adding
- how a frontend table cell bean and a frontend form-field component can both serve the same backend field
- how backend metadata points to module-owned frontend render resources

## AI Prompt

Give AI a prompt like this:

```text
The current level field in the Student list page and form still feels too generic. Please redesign it so it feels like a dedicated training-stage field for a real Student Training Center workflow, with a more recognizable presentation in the list and a more guided experience in the form.
```

## Why this step matters

This is the right follow-up step because built-in render resources are a good starting point, but some fields eventually need a more distinctive user experience to match the business workflow.

The `level` field is a good teaching example because users often expect two improvements once a training workflow becomes more realistic:

- the list should make each training stage easier to recognize at a glance
- the form should guide the user more clearly when choosing a training stage

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

- use `:create:bean` when AI determines that the list needs a dedicated table-cell render resource under the bean scene
- use `:create:component` when AI determines that the form needs a custom frontend component/controller surface
- generation gives you the structural starting point, but this tutorial still expects manual refinement so the result matches the `demo-student` teaching implementation
- after frontend resources exist, return to the backend entity and point `ZovaRender.field(...)` and `ZovaRender.cell(...)` at the custom module resources
- once backend metadata starts consuming those new frontend resources, treat the next step as a reverse fullstack handoff rather than frontend-only cleanup: refresh generated output, rebuild the relevant flavor, and re-sync Vona dependencies

## Generated or affected files

To satisfy the user-facing need above, AI will usually converge on a small set of implementation anchors like these:

- custom table cell bean:
  - `zova/src/module/demo-student/src/bean/tableCell.level.tsx`
- custom form-field controller:
  - `zova/src/module/demo-student/src/component/formFieldLevel/controller.tsx`
- form-field metadata wrapper:
  - `zova/src/module/demo-student/src/.metadata/component/formFieldLevel.ts`
- backend field contract to update:
  - `vona/src/module/demo-student/src/entity/student.tsx`

Representative metadata targets after AI makes that implementation decision are:

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

This is the point where a user request about “better list presentation” and “better form guidance” starts turning into explicit renderer resources and backend metadata links.

## How those files support the user experience

These files work together to deliver the richer `level` experience:

- `tableCell.level.tsx` makes the training stage easier to recognize in the list
- `component/formFieldLevel/controller.tsx` makes the form interaction more guided and business-specific
- `.metadata/component/formFieldLevel.ts` exposes that component through the module registration surface
- `entity/student.tsx` remains the backend-owned business contract that chooses which frontend resources should render the field

That means the backend still defines the business field, validation, and metadata entry point, while the frontend module owns the implementation details that make the experience feel more tailored to the Student Training Center workflow.

## Verification

These checks are the reverse-chain synchronization steps AI must complete so the user-facing renderer change is actually available to backend consumers and the running app.

1. refresh the generated handoff surfaces before checking backend consumers:

```bash
npm run zova :tools:metadata demo-student
npm run build:zova:admin
npm run deps:vona
```

If the same renderer path must also be available for Web, also run:

```bash
npm run build:zova:web
npm run deps:vona
```

If backend-side type consumers still cannot see the new shared renderer types even though generated `.zova-rest` output is already correct, rebuild `vona/node_modules` and reinstall dependencies:

```bash
cd vona && rm -rf node_modules && pnpm install
```

2. make sure the local dev workflow is running:

```bash
npm run dev
```

3. open `http://localhost:7102/admin/`
4. enter the **Student** list page and verify that the `level` column now uses the custom table-cell presentation
5. open a Student create, update, or view form and verify that the `level` field now uses the custom form-field behavior
6. inspect `vona/src/module/demo-student/src/entity/student.tsx` and confirm that the backend metadata now points to `demo-student:formFieldLevel` and `demo-student:level`

## Read more

- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
- [Frontend CLI](/frontend/cli)
- [Component Guide](/frontend/component-guide)
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates)

## Next step

Continue to [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing).
