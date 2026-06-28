# Custom Renderer Demo Checklist

Use this checklist when the user explicitly wants to demonstrate how a backend resource field can switch from a shared renderer to a custom module-local renderer.

## Goal

Preserve the field’s backend business semantics while deliberately exercising the full frontend renderer registration path.

## 1. Confirm the task is really instructional

Use this branch when the user wants to show:

- how to build a custom FormField component
- how to build a custom backend-usable TableCell renderer
- how to connect them back to `ZovaRender.field(...)` / `ZovaRender.cell(...)`

If the user only wants the simplest production implementation, prefer shared renderer reuse instead.

## 2. Keep business semantics unchanged if possible

Do not rework field meaning unless the request also asks for it.

Preserve existing semantics such as:

- allowed values
- locale labels
- `items`, `itemValue`, `itemTitle`
- backend field name and DTO flow

## 3. Build the correct frontend pair

### FormField

Add a module-local FormField component such as:

- `src/component/formFieldX/controller.tsx`

Best practice:

- reuse the option shape of the closest shared renderer
- copy the data flow from the shared baseline first
- default to providing a user-visible `placeholder` for field-rendering select components unless the UX clearly requires an always-preselected value
- in Cabloy Basic, keep placeholder handling aligned with `basic-select` semantics instead of adding artificial empty items by default
- in Cabloy Start, verify the `start-select` wrapper behavior before copying Basic-specific placeholder or empty-item logic
- keep customizations minimal and clearly demo-oriented

### TableCell

Add a module-local `@TableCell(...)` bean such as:

- `src/bean/tableCell.x.tsx`

Important:

- backend `ZovaRender.cell(...)` should point to a registered table-cell key
- a plain frontend component is not enough for this role

## 4. Use the best existing baseline

For select-like enum fields, start from an edition-correct baseline.

In Cabloy Basic, start from:

- `basic-select` FormField behavior
- `basic-select` table-cell bean behavior

In Cabloy Start:

- identify the Start-side select baseline first rather than reusing Basic components by name
- verify placeholder and empty-state behavior before copying Basic-specific logic

The goal is to demonstrate module-local customization, not to reinvent field-state handling.

## 5. Regenerate and synchronize in the right order

Recommended order:

1. create or update renderer source files
2. regenerate frontend metadata
3. run the relevant frontend build so both bundle output and type surface update
4. run `deps:vona`
5. run Vona typecheck
6. run the narrow backend resource test

For Cabloy Basic admin, the representative flow is:

```bash
npm run zova :tools:metadata <module-name>
npm run build:zova:admin
npm run deps:vona
cd vona && npm run tsc
cd vona && npm test -- <resource-test>.test.ts
```

## 6. Recovery rule when generated keys still look stale

If the generated `.zova-rest` artifacts already contain the new renderer keys but Vona still sees stale types after the normal sync flow:

- treat it as local dependency drift
- after the relevant Zova build and `npm run deps:vona`, rebuild `vona/node_modules` and reinstall dependencies if needed

This is an installation-state recovery step, not the normal first move.
