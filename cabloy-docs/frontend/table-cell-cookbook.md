# TableCell Authoring Cookbook

This cookbook explains how to author `tableCell` resources in Zova for the most common business table patterns.

Use this page when the public table runtime already makes sense to you and your next question is practical:

- how should I write a custom `tableCell` bean?
- when should I use `next()` directly?
- how should I format values, wrap them with styles, or trigger commands?
- when should I use the `tableActionRow` boilerplate instead of a normal `tableCell`?

Use this page together with:

- [Table Guide](/frontend/table-guide)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map)
- [Bean Scene Authoring](/frontend/bean-scene-authoring)
- [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates)
- [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers)
- [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing)

## What a `tableCell` bean is for

A `tableCell` bean is the main reusable extension surface for one table cell in Zova.

It is a good fit when:

- the same cell behavior should be reused across pages
- a schema field should point to a named frontend render resource
- a row action should be represented as one reusable render unit
- the table runtime should continue owning scope, visibility, and render orchestration

It is **not** the first choice when:

- the change is only one page-local layout tweak with no reuse value
- the page should instead add or remove whole columns through `getColumns(...)`
- the business truth really belongs in backend schema metadata and no custom frontend behavior is needed yet

A practical rule is:

- use schema metadata first
- use built-in table-cell resources second
- add a custom `tableCell` bean only when the UI behavior becomes business-specific or reusable

## The smallest correct mental model

If you only remember one idea, remember this one:

> A `tableCell` bean does not own the whole table. The table controller owns the table runtime, and your `tableCell` bean receives a prepared render context plus `next()` for the current cell.

That is why `tableCell` authoring usually feels small and focused.

Your bean normally decides only one of these things:

- format the current value
- wrap the current value with extra markup
- trigger a command or action
- orchestrate several nested row actions

## Step 1: Start from the CLI scaffold

Inspect the CLI surface first:

```bash
npm run zova :create:bean --help
```

Create a normal table-cell bean:

```bash
npm run zova :create:bean tableCell level -- --module=training-student
```

Create a row-action variant:

```bash
npm run zova :create:bean tableCell actionOperationsRow -- --module=training-student --boilerplate=tableActionRow
```

The default scaffold shape is intentionally small:

```tsx
@TableCell<ITableCellOptionsLevel>()
export class TableCellLevel extends BeanBase implements ITableCellRender {
  render(
    _options: ITableCellOptionsLevel,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    return next();
  }
}
```

That is already the correct architectural starting point because:

- the bean is registered in the `tableCell` scene
- the options type is local to your resource identity
- the render context is already prepared by the table controller
- `next()` already represents the cell’s current value or downstream content path

## Step 2: Understand the three parameters you receive

The `render(...)` method usually receives:

- `options` — the final merged options for this cell resource
- `renderContext` — the current table/cell runtime context
- `next` — the function that gives you the downstream cell content

### `options`

Use `options` for things such as:

- `class`
- formatting presets
- display items
- command options
- action lists for row-action cells

These options may come from more than one layer, including:

- decorator defaults on `@TableCell(...)`
- schema `rest.table.columnProps`
- action metadata options

### `renderContext`

Use `renderContext` when you need access to:

- `$host` — the host controller utilities such as `$performCommand(...)`
- `$$table` — the current table controller
- `cellContext` — the TanStack cell context
- `$celScope` — the current cell scope

### `next()`

Use `next()` when your cell should build on top of the current value rather than replace the whole rendering path.

A practical rule is:

- if the cell is basically a formatter or wrapper, start from `next()`
- if the cell is a command button or link, you may ignore `next()` and render your own content

## Pattern 1: Minimal pass-through cell

Use this pattern when you only want a reusable placeholder bean or a very thin wrapper.

Representative shape:

```tsx
@TableCell<ITableCellOptionsLevel>()
export class TableCellLevel extends BeanBase implements ITableCellRender {
  render(
    _options: ITableCellOptionsLevel,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    return next();
  }
}
```

Use this when:

- the backend already points to a custom cell resource but the UI behavior is still small
- you want the resource identity to exist before you add richer logic
- you want a stable extension point for future customization

This is the right starting point for many business-specific fields.

## Pattern 2: Format a value and optionally wrap it with a class

Use this pattern when the cell is still “show the field value,” but the value needs formatting.

Representative built-in examples are:

- `basic-date:date`
- `basic-currency:currency`
- `basic-select:select`
- `basic-text:text`

The common pattern is:

1. call `next()`
2. transform the value
3. if `options.class` exists, wrap the result with a container

Representative shape:

```tsx
@TableCell<ITableCellOptionsCurrency>()
export class TableCellCurrency extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsCurrency,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = currencyFormat(next(), options);
    if (!options.class) return value;
    return <div class={options.class}>{value}</div>;
  }
}
```

This is a good fit when:

- the field is still conceptually one value
- formatting logic should be shared across multiple pages
- schema metadata should be able to point to one stable frontend renderer

A practical rule is:

- prefer formatting around `next()` for date, currency, enum-label, or badge-like display
- do not re-fetch row data manually if the current cell value is already enough

## Pattern 3: Map a raw value to an item label

Use this pattern when the raw stored value is not the final display value.

Representative built-in example:

- `basic-select:select`

Representative shape:

```tsx
@TableCell<ITableCellOptionsSelect>({
  itemValue: 'value',
  itemTitle: 'title',
})
export class TableCellSelect extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsSelect,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const item = options.items?.find(
      item => String(item[String(options.itemValue)]) === String(value),
    );
    const value2 = item?.[String(options.itemTitle)];
    if (!options.class) return value2;
    return <div class={options.class}>{value2}</div>;
  }
}
```

This is a good fit when:

- the stored value is a code, enum, or id-like value
- the visible table should show a label instead
- the same mapping should be reused in several places

## Pattern 4: Turn the cell into a command link or button

Use this pattern when the cell should trigger a user action.

Representative built-in examples are:

- `basic-table:actionView`
- `basic-table:actionDelete`

A command-link pattern looks like this:

```tsx
@TableCell<ITableCellOptionsActionView>({
  class: 'hover:text-blue-500',
})
export class TableCellActionView extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionView,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    const value = next();
    return (
      <a
        class={options.class}
        href="#"
        onClick={async e => {
          e.preventDefault();
          e.stopPropagation();
          await $host.$performCommand('basic-commands:view', options, renderContext);
        }}
      >
        {value}
      </a>
    );
  }
}
```

A command-button pattern looks like this:

```tsx
@TableCell<ITableCellOptionsActionDelete>({
  class: 'btn btn-outline btn-error join-item',
})
export class TableCellActionDelete extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsActionDelete,
    renderContext: IJsxRenderContextTableCell,
    _next: NextTableCellRender,
  ) {
    const { $host } = renderContext;
    return (
      <button
        class={options.class}
        type="button"
        onClick={async () => {
          if (!window.confirm(this.scope.locale.DeleteConfirm())) return;
          await $host.$performCommand('basic-commands:delete', options, renderContext);
        }}
      >
        Delete
      </button>
    );
  }
}
```

This is a good fit when:

- the cell is really an action, not only formatted display
- the same action should be reusable across resource pages
- command-scene infrastructure should remain the action execution path

A practical rule is:

- let the cell resource own the render interaction
- let the command bean or model layer own the actual action semantics

## Pattern 5: Row-action composition with `tableActionRow`

Use this pattern when one cell should show several row actions together.

Representative built-in example:

- `basic-table:actionOperationsRow`

This pattern is different from a normal single-action cell because the bean often needs to:

- inspect an `actions` array
- filter actions by permission
- preload nested renders
- render several child action cells in one wrapper

That is why the `tableActionRow` boilerplate exists.

Representative runtime shape:

```tsx
@TableCell<ITableCellOptionsActionOperationsRow>({
  class: 'join',
})
export class TableCellActionOperationsRow extends BeanBase implements ITableCellRender {
  async checkVisible(
    options: ITableCellOptionsActionOperationsRow,
    renderContext: IJsxRenderContextTableColumn,
  ): Promise<boolean> {
    const { $celScope, $host, $$table } = renderContext;
    const permissions = $celScope.permissions;
    const actions = options.actions;
    if (!actions || actions.length === 0) return false;
    const renders: TypeTableCellRenderComponent[] = [];
    for (const action of actions) {
      const actionName = action.name;
      const actionRender = action.render;
      const permissionHint = action.options?.permission;
      if ($host.$passport.checkPermission(permissions, actionName, permissionHint)) {
        if (!actionRender) throw new Error(`should specify action render: ${actionName}`);
        renders.push(actionRender);
      }
    }
    await $$table.cellRenderPrepare(renders);
    return renders.length > 0;
  }
}
```

And the render step usually reuses the table runtime again:

```tsx
render(options, renderContext) {
  const { $celScope, $host, $$table } = renderContext;
  const permissions = $celScope.permissions;
  const actions = options.actions;
  if (!actions || actions.length === 0) return;
  const domActions = [];
  actions.forEach((action, index) => {
    const actionName = action.name;
    const permissionHint = action.options?.permission;
    if (!$host.$passport.checkPermission(permissions, actionName, permissionHint)) return;
    const options2 = Object.assign({ key: index }, action.options);
    domActions.push($$table.cellRender(action.render!, options2, renderContext));
  });
  return <div class={options.class}>{domActions}</div>;
}
```

This is a good fit when:

- one Operations column should contain several reusable child actions
- permission filtering belongs in the table action layer
- nested action cells should still reuse the same table-cell pipeline

A practical rule is:

- use the normal scaffold for one render resource
- use `--boilerplate=tableActionRow` when the cell is really a row-action container

## Pattern 6: Business-specific badge or label cell

Use this pattern when a field such as `level`, `status`, or `state` should have module-owned presentation.

A typical workflow is:

1. create a module-local table cell bean
2. move the presentation logic into that bean
3. point backend metadata to the bean resource name

Representative CLI command:

```bash
npm run zova :create:bean tableCell level -- --module=training-student
```

Representative backend-facing metadata target:

```typescript
ZovaRender.cell('training-student:level', { items: levelItems });
```

This is the right fit when:

- the field now has business-specific UI meaning
- built-in renderers are a good start but no longer enough
- the backend contract should still choose the frontend resource identity

For the full walkthrough around `level`, see [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers).

## Pattern 7: Backend contract to frontend cell handoff

Many table-cell workflows are easiest to understand as a contract chain.

A common chain is:

1. backend row DTO owns the field metadata or row-action metadata
2. frontend `tableCell` bean provides the render resource implementation
3. the table controller resolves that render resource at runtime
4. the visible table page reuses the same table runtime with no page-local duplication

For row actions, the chain often continues further:

1. backend action contract exists
2. frontend generated API exists
3. frontend model wraps the generated API thinly
4. `tableCell.actionXxx.tsx` triggers that action through command or model logic

That is why custom table cells often belong to the contract loop rather than to isolated page-only UI work.

For the forward-chain row-action example, see [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing).

## How to choose between the common patterns

Use this quick rule set:

### Choose a minimal pass-through cell when:

- you only need a stable module-owned resource identity
- you expect richer logic later

### Choose a formatting cell when:

- the cell still represents one value
- the business behavior is formatting or display mapping

### Choose a command cell when:

- the cell is an action trigger
- the action should be reusable and command-oriented

### Choose a row-action cell when:

- one column should contain several child actions
- permission-sensitive action composition is needed

### Stay with schema metadata only when:

- built-in render resources already solve the problem
- no module-owned frontend logic is needed yet

## Common mistakes to avoid

### Mistake 1: Rebuilding row access manually

The table controller already prepares `cellContext`, scope, and render context. Use `next()` and `renderContext` first.

### Mistake 2: Using a custom `tableCell` bean for a one-off page-local column shape

If the behavior is not reusable, consider `getColumns(...)` or page-local rendering first.

### Mistake 3: Putting business action semantics directly into ad hoc click handlers everywhere

Prefer one reusable command or model path, and let the `tableCell` bean stay the render-facing adapter.

### Mistake 4: Using the normal scaffold when the cell is really a row-action container

If the cell will host several actions, prefer `--boilerplate=tableActionRow`.

### Mistake 5: Treating a `tableCell` bean like a full table replacement

It only owns one cell render resource. The table controller still owns the table runtime.

## A practical authoring order

If you want the shortest path to a correct custom table cell, use this order:

1. confirm whether built-in renderers already solve the problem
2. confirm whether the truth should live in backend schema or row-action metadata
3. generate the correct `tableCell` scaffold
4. start from `next()` when the cell is still value-centric
5. use `renderContext.$host` when the cell needs commands or host services
6. use `tableActionRow` only for multi-action composition
7. point backend metadata to the new frontend cell resource when the contract is ready
8. continue with [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook) if the cell belongs inside a standard resource list page
9. continue with [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions) if the cell is part of a larger contract-loop action chain
10. continue with [Zova Table Under the Hood](/frontend/zova-table-under-the-hood) if you need the controller-level runtime explanation
11. continue with [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map) if you need the exact next files to read

## Verification checklist

When authoring or documenting a custom `tableCell`, verify in this order:

1. confirm the CLI command shape still exists:

   ```bash
   npm run zova :create:bean --help
   ```

2. confirm the scene variant still exists before recommending it:

   ```bash
   npm run zova :create:bean tableCell test -- --module=training-student --boilerplate=tableActionRow
   ```

3. confirm your bean follows the current `ITableCellRender` contract
4. confirm the target backend metadata points to the intended resource name
5. run the docs build if you changed docs:

   ```bash
   npm run docs:build
   ```

## Final takeaway

A good `tableCell` bean is usually small.

It does not replace the table runtime. It plugs into it.

That is why the best `tableCell` authoring style is usually:

- small bean
- clear options type
- minimal render responsibility
- stable contract-facing resource identity
