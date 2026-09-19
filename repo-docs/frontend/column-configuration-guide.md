# Column Configuration Guide

Column Configuration lets authenticated users save a personal table layout on a resource list page. They can change the visibility, width, and order of eligible columns; the layout is restored when they revisit the same page.

This guide covers Column Configuration on standard resource list pages in both Cabloy Basic and Cabloy Start. It complements the [Table Guide](/frontend/table-guide), which explains the general `ZTable`, schema-metadata, and `tableCell` authoring surfaces. This page focuses on user layouts and their persistence.

## What Column Configuration does

After opening **Column Configuration** from the toolbar, a user can:

| Capability             | Description                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------- |
| Show or hide columns   | Only columns eligible in the current table schema can be changed                    |
| Set a numeric width    | The width must be an integer from `1` through `2000`                                |
| Use automatic width    | Set the width to `auto` and let the table handle it from content and runtime layout |
| Reorder columns        | Reorder only within the same fixed region                                           |
| Save a personal layout | Save it for the current authenticated user and page path                            |
| Reset the layout       | Remove the personal layout and restore current schema defaults                      |

Column Configuration does not change backend DTOs, database fields, API permissions, or the schema itself. It is a personal presentation preference over already authorized data; it must not be used as an authorization or data-isolation mechanism.

### Fixed regions define the reorder boundary

A schema can pin a column to the `left`, `center`, or `right` region. The Move Up and Move Down controls in Column Configuration work only within the same region:

- A left-fixed column can move only among left-fixed columns.
- A center column can move only among center columns.
- A right-fixed column can move only among right-fixed columns.

A user cannot change a column's fixed region through Column Configuration. The row-selection column is also a runtime-generated column and is never saved in a personal layout.

## User workflow

1. Sign in and open a resource list page.
2. Click the settings icon for **Column Configuration** in the bulk toolbar.
3. In the dialog, as needed:
   - select or clear a column to control its visibility;
   - enter a numeric width or choose automatic width;
   - use the Move Up and Move Down controls to reorder columns in the same fixed region.
4. Click **Save** to persist the personal layout and refresh the current table.
5. To return to defaults, click **Reset**, then click **Save**.

Unauthenticated users cannot load, save, or reset personal column layouts. Even when the toolbar action uses `permission: { public: true }`, that setting controls whether the action is discoverable; it does not allow anonymous reads or writes of personal layouts.

## Basic and Start integration

Both editions share the same layout contract and persistence model. Page-block names, action resource keys, and UI components are edition-specific.

| Edition      | Toolbar block                 | Column-configuration action      | UI layer               |
| ------------ | ----------------------------- | -------------------------------- | ---------------------- |
| Cabloy Basic | `basic-page:blockToolbarBulk` | `basic-table:actionColumnConfig` | DaisyUI + Tailwind CSS |
| Cabloy Start | `start-page:blockToolbarBulk` | `start-table:actionColumnConfig` | Vuetify                |

Current CRUD generator templates add the edition-specific Column Configuration action. Add the action explicitly when authoring a custom or existing resource page.

### Cabloy Basic

```ts
ZovaRender.block('basic-page:blockToolbarBulk', {
  actions: [
    ZovaRender.tableActionBulk('basic-table:actionColumnConfig', {
      permission: { public: true },
      placement: 'end',
    }),
  ],
});
```

Place this action in a standard resource list page hosted by `basic-page:blockPage`, together with `basic-page:blockTable`.

### Cabloy Start

```ts
ZovaRender.block('start-page:blockToolbarBulk', {
  actions: [
    ZovaRender.tableActionBulk('start-table:actionColumnConfig', {
      permission: { public: true },
      placement: 'end',
    }),
  ],
});
```

Place this action in a standard resource list page hosted by `start-page:blockPage`, together with `start-page:blockTable`.

> [!TIP]
> Do not copy Basic `basic-*` action or block names into a Start page, or the reverse. The editions share the layout protocol but register different page and table resources.

## Schema defaults and personal layouts

Column Configuration has two layers: the schema defines the default table columns, and a personal layout overrides visibility, width, and order within permitted boundaries.

### 1. Define default columns in the schema

Use `ZovaRender.order(...)`, `ZovaRender.visible(...)`, and `ZovaRender.column(...)` on row-DTO or entity fields:

```ts
@Api.field(
  v.title($locale('StudentName')),
  ZovaRender.order(1),
  ZovaRender.column({
    align: 'left',
    width: 240,
    fixed: 'left',
    enableSorting: true,
    sortDescFirst: true,
  }),
  v.string(),
)
name: string;
```

The three metadata categories have distinct responsibilities:

| Metadata                    | Responsibility                                                                                                 |
| --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `ZovaRender.visible(false)` | Sets schema/scene visibility. A hidden field does not become a configurable table column.                      |
| `ZovaRender.order(...)`     | Defines the schema default order. It is normally clearer than setting `order` inside `ZovaRender.column(...)`. |
| `ZovaRender.column(...)`    | Defines physical-column capabilities: `align`, `width`, `fixed`, and sorting capabilities.                     |
| `ZovaRender.cell(...)`      | Selects a cell-render resource; it does not persist a layout.                                                  |

The `width` and `fixed` values in `ZovaRender.column(...)` are schema defaults. `fixed` also defines the region in which a user may reorder the column. For a standard resource list page, the backend row schema is the contract truth for column metadata; do not maintain a parallel frontend list of default columns.

### 2. Personal layouts override only permitted parts

A saved personal layout can change:

- whether an eligible table-schema column is visible;
- its numeric or automatic width;
- its order within the same `left`, `center`, or `right` region.

The schema remains authoritative:

- A schema-hidden field cannot be restored by a personal layout.
- A personal layout cannot change the schema-defined fixed region.
- An old column that is absent from the current schema is not rendered.
- The row-selection column is not included in the personal layout.

## How layouts are saved and restored

A standard resource page uses the current route `path` as its `layoutKey`. A layout profile is scoped as follows:

```text
current authenticated user + current page route path
```

Consequently, one user can save different layouts for different resource pages, and different users do not overwrite one another's layout on the same page.

The `a-layoutprofile` frontend model handles `load`, `save`, and `reset`. A standard `blockPage` first loads the current profile and passes it into the table. After a save or reset succeeds, the page refreshes table metadata so that visibility, order, width, and pinned-column state take effect immediately.

A simplified layout profile has this form:

```json
{
  "version": 1,
  "schemaFingerprint": "optional-fingerprint",
  "columns": [
    { "key": "name", "visible": true, "width": 240 },
    { "key": "mobile", "visible": false, "width": "auto" }
  ]
}
```

| Field               | Rule                                                |
| ------------------- | --------------------------------------------------- |
| `version`           | Must currently be `1`                               |
| `schemaFingerprint` | Optional schema fingerprint, at most 255 characters |
| `columns`           | At most 200 column entries                          |
| `columns[].key`     | Schema column key, from 1 through 100 characters    |
| `columns[].visible` | Boolean                                             |
| `columns[].width`   | `auto` or an integer from `1` through `2000`        |

The standard API requires an authenticated user: load, save, and reset all use the current user as the layout owner. Public SSR pre-hydration also does not read this private user state in advance, so a server-side render does not treat a user layout as established first-render truth.

## Compatibility when the schema changes

Before using a profile, the table reconciles it with the current schema instead of trusting its saved JSON directly:

1. It discards empty keys, invalid widths, invalid visibility values, later duplicate entries, and other malformed profile entries.
2. It discards old columns that no longer exist in the current schema.
3. It regroups columns into the schema-defined left, center, and right fixed regions; a persisted order is retained only inside its original region.
4. It appends new schema columns to their region, using the schema width or `auto` when the schema does not define a width.
5. It excludes the runtime row-selection column.

Therefore, users normally do not need to clean up an old profile manually after fields are added, removed, or repinned. To return entirely to the current schema default layout, use **Reset** in Column Configuration.

## Standard resource-page runtime path

This is the simplified flow when a standard resource page saves a column configuration:

```text
tableActionBulk in the DTO
    ↓
edition-specific blockToolbarBulk
    ↓
actionColumnConfig dialog
    ↓
blockPage (route.path → layoutKey)
    ↓
a-layoutprofile load / save / reset
    ↓
reconcileTableLayout(...)
    ↓
effective ZTable layout
    ↓
column visibility / order / width / pinned-column rendering
```

In that flow:

- `blockPage` supplies a Column Configuration draft only after the table reference, table-column metadata, layout-profile model, and authenticated state are ready.
- `actionColumnConfig` edits the draft and reconciles it again before saving.
- `ZTable` derives column visibility, order, and numeric widths from its effective layout.
- Pinned-column state still comes from the schema's `rest.fixed`, not from the profile.

`training-student:student` is a complete Basic reference: its list DTO uses `basic-table:actionColumnConfig`, and its field schema defines defaults with `ZovaRender.visible(...)`, `ZovaRender.order(...)`, and `ZovaRender.column(...)`.

## When using `ZTable` directly

A direct `ZTable` consumer can pass a `layout`:

```tsx
<ZTable data={this.students} schema={this.schemaRow} layout={this.layout} />
```

The table still reconciles that layout with the current schema and applies visibility, order, width, and schema-defined fixed regions. However, direct `ZTable` use does not automatically provide a personal-profile loader, saver, resetter, or Column Configuration toolbar.

When a page is not a standard resource list page, its owner must decide:

1. where the layout comes from;
2. how it is loaded, saved, and reset for the relevant user and page scope;
3. how the page keeps its state consistent after a layout changes.

For ordinary resource CRUD lists, prefer the existing `basic-page` or `start-page` blockPage/blockTable flow instead of rebuilding the persistence path.

## Troubleshooting

| Symptom                                                     | What to check                                                                                                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| The toolbar has no Column Configuration button              | Confirm that the page has the action for the active edition, uses the correct `blockToolbarBulk`, and does not filter the action through toolbar permission rules. |
| Clicking it does not open a dialog                          | Confirm that the page uses standard `blockPage` and `blockTable`, and that table metadata and authenticated state are ready.                                       |
| The layout is not restored after save                       | Confirm that the same user visits the same route path, Save was clicked, and no frontend or API request failed.                                                    |
| A new column does not follow the old profile's order        | This is expected: new columns are appended to their fixed region with current schema defaults.                                                                     |
| A column cannot move to another side                        | This is the schema `fixed`-region constraint. Change the schema, not the user profile.                                                                             |
| A hidden system field should appear in Column Configuration | Do not use a profile for this. Check whether the field uses `ZovaRender.visible(false)`.                                                                           |
| A direct `ZTable` has no save behavior                      | The `layout` prop is only a layout input; its owner is responsible for persistence.                                                                                |

## Related documentation

- [Table Guide](/frontend/table-guide): table public APIs, schema column metadata, and `tableCell`.
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook): how a standard resource list combines filter, toolbar, table, and pager blocks.
- [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive): the route-to-`blockPage`/`blockTable`/`ZTable` runtime path.
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood): schema metadata, table metadata, and render runtime.
- [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map): source-reading order for deeper implementation analysis.
