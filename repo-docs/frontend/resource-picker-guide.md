# Resource Picker Guide

Use a Resource Picker when a form field stores the identity of an existing resource, such as a Student, Product, or Role. The picker is schema-driven: declare the field renderer in backend entity or DTO metadata, and the active Cabloy edition renders the appropriate frontend control.

Use this page together with:

- [Form Guide](/frontend/form-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Routed Dialog Guide](/frontend/routed-dialog-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)

> [!TIP]
> A Resource Picker is a resource-field renderer, not a standalone client-side component API. The backend contract remains the source of truth for the field, its target resource, its selectable rows, and its display data.

## What a Resource Picker stores

A picker field persists an identity, not the whole selected row:

- `single` selection stores one ID;
- `multiple` selection stores an ID array;
- related objects are response-only display projections used to show labels.

For example, a Training Record can persist `studentId` while its select and view responses include a narrow `student` relation with the Student ID and display name. Do not replace the ID write contract with a submitted Student object merely because the UI displays a Student label.

## Prerequisites

Before adding a picker, verify the target resource has all of the following:

1. A valid resource name and a selectable resource API that the current user may access.
2. Select results with stable, nonempty row IDs.
3. A label field such as `name`, or a configured alternative such as `title` or `code`.
4. For `routedDialog` mode, select-schema blocks that produce the target resource's normal list experience, such as filter, table, and pager blocks.
5. A response-only relation projection for labels when the editing, readonly, or list experience needs to display the selected resource after loading.

The target resource's server-side authorization, instance scope, filtering, and validation remain authoritative. A client-side `query`, `actionPath`, or picker field does not authorize a user to select a row.

## Declare the field renderer

Declare the field renderer on the persisted identity field with `ZovaRender.field(...)`. Add a matching cell renderer when a resource list should display the relation label instead of a raw ID.

### Cabloy Basic

```ts
@Api.field(
  v.title($locale('Student')),
  ZovaRender.field('basic-resource:formFieldResourcePicker', {
    resource: $resourceName('training-student:student'),
    pickerMode: 'routedDialog',
    selectionMode: 'single',
  }),
  ZovaRender.cell('basic-resource:resourcePicker', {
    resource: $resourceName('training-student:student'),
  }),
  v.tableIdentity(),
)
studentId: TableIdentity;
```

### Cabloy Start

Use the same business contract, but use Start's renderer identities:

```ts
@Api.field(
  v.title($locale('Student')),
  ZovaRender.field('start-resource:formFieldResourcePicker', {
    resource: $resourceName('training-student:student'),
    pickerMode: 'routedDialog',
    selectionMode: 'single',
  }),
  ZovaRender.cell('start-resource:resourcePicker', {
    resource: $resourceName('training-student:student'),
  }),
  v.tableIdentity(),
)
studentId: TableIdentity;
```

The two renderer names are edition-specific. Do not use `basic-resource:*` names in Start, or `start-resource:*` names in Basic.

> [!IMPORTANT]
> The `resourcePicker` **cell** renderer is presentation-only. It reads related display data already returned in the list row; it does not open a picker and it does not fetch a missing label.

## Field options

The form-field renderer supports the following public metadata options.

| Option          | Applies to               | Meaning                                                                                                                                                                             |
| --------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resource`      | both modes               | Required target resource name. The type currently marks it optional, but the renderer throws if it is missing.                                                                      |
| `actionPath`    | both modes               | Optional target-resource select action. Use it when the resource exposes a dedicated selection endpoint.                                                                            |
| `query`         | both modes               | Optional fixed list query. In dialog mode it is supplied to the picker list; it does not replace server-side scope or authorization.                                                |
| `relationName`  | labels                   | Response relation used to present selected labels. When omitted, the renderer can derive a relation name from a field ending in `Id`; specify it explicitly for exceptions.         |
| `selectOptions` | inline select and labels | Edition-native select options, including `itemValue` and `itemTitle`. The default mapping is `id` and `name`; use another `itemTitle`, such as `title` or `code`, when appropriate. |
| `pickerMode`    | interaction              | `'select'` by default, or `'routedDialog'` for the hosted resource-list picker.                                                                                                     |
| `selectionMode` | routed dialog            | `'single'` by default, or `'multiple'`.                                                                                                                                             |
| `selectionMax`  | routed dialog            | Maximum selected identities. Single mode is always limited to one. Multiple mode currently defaults to 100 when no valid nonnegative integer limit is supplied.                     |

Cabloy Start also provides Vuetify presentation options for this field, including `display`, `chipGroupOptions`, and `chipOptions`. Use them only in Start-specific metadata; they are not shared Basic options.

## Choose an interaction mode

### Inline select: the default

When `pickerMode` is omitted, the field loads the target `ModelResource` through its select query and renders an inline select. Use this for a small, readily available option set.

```ts
ZovaRender.field('basic-resource:formFieldResourcePicker', {
  resource: $resourceName('commerce-catalog:category'),
  selectOptions: {
    itemValue: 'id',
    itemTitle: 'name',
  },
});
```

`actionPath` and `query` affect the target select request. `selectionMode` and `selectionMax` are routed-dialog controls; do not use them to assume an inline select will enforce a dialog-style selection policy.

### Routed dialog: searchable resource-list selection

Use `pickerMode: 'routedDialog'` when the user needs the target resource's table-based selection experience, including its existing filters, pager, list actions, fixed query, or controlled multi-selection.

```ts
ZovaRender.field('basic-resource:formFieldResourcePicker', {
  resource: $resourceName('training-student:student'),
  pickerMode: 'routedDialog',
  selectionMode: 'single',
});
```

The routed picker reuses the target resource's schema-authored select blocks instead of maintaining a second hard-coded list. It opens the named `rest-resource:resourcePicker` route inside a routed-dialog host.

> [!WARNING]
> `rest-resource:resourcePicker` is not a standalone browser page or a direct navigation API. Its page controller requires a host-scoped picker contract supplied by the field/dialog workflow. Do not link users directly to `/rest/resource/:resource/picker`, treat it as bookmarkable state, or build application behavior around entering that route without its host.

## Selection result and limits

When the user confirms a routed picker:

- `single` writes the first selected ID;
- `multiple` writes a capped array of selected IDs;
- null, undefined, and empty IDs are discarded;
- duplicate IDs are collapsed while preserving the original ID value type;
- the dialog requires a valid nonempty selection to enable confirmation.

Single mode always has an effective maximum of one. For multiple mode, a missing or invalid limit currently becomes 100. A maximum of `0` prevents confirmation; it is not a useful way to request a deliberate empty result.

The picker keeps selection across list pages, filters, and sorting within the dialog. Its returned row snapshots are useful presentation data, but the saved field value remains IDs.

## Persisted IDs and display relations

A good picker contract separates writing from presentation:

```ts
// Write data
studentId: TableIdentity;

// Response-only display projection
student?: {
  id: TableIdentity;
  name: string;
};
```

The exact DTO form may differ, but the rule stays the same:

- send and persist `studentId`;
- return a narrow `student` relation for labels;
- use `relationName` if the relation does not follow the normal `...Id` naming convention;
- align the relation's title property with `selectOptions.itemTitle`.

After routed selection, the field can synchronize selected display data and may hydrate a missing label through the target resource. That behavior improves the immediate UI, but it is not a replacement for a correct view/select response projection. Readonly fields and list cells should receive the labels they need from the server response.

## Readonly fields and table cells

A Resource Picker field is interactive only in an editable form. In readonly mode it displays a relation-backed label instead of a chooser.

The paired `resourcePicker` table cell is also noninteractive. It formats relation data already attached to the table row. In particular:

- it does not fetch a related row;
- it does not open a dialog;
- missing display projection data can leave the cell without a useful label.

Use a relation projection deliberately rather than relying on a raw foreign-key ID to become readable presentation data.

## Routed-dialog lifecycle and SSR

A routed picker starts with the field's current IDs as its selection. On confirmation, it updates the field; on Cancel or an ordinary close, its result is `undefined` and the form keeps its prior value.

The routed dialog has its own in-memory route history. Opening, navigating inside, or closing it does not change the outer browser URL. It therefore is not appropriate for a flow that must be bookmarkable or survive a browser reload.

Routed dialogs are client-only. Open them from an interaction such as a button click, or defer lifecycle-driven behavior to an explicit post-hydration client boundary. Do not open a routed dialog from SSR execution merely because the surrounding page supports SSR. For the general lifecycle and presentation contract, see [Routed Dialog Guide](/frontend/routed-dialog-guide).

## Basic and Start UI differences

The resource/data contract is shared, but the visual implementation is deliberately edition-specific.

| Surface                              | Cabloy Basic                                         | Cabloy Start                                 |
| ------------------------------------ | ---------------------------------------------------- | -------------------------------------------- |
| Inline field                         | `ZSelect` with Basic's DaisyUI-oriented presentation | Vuetify `VSelect`                            |
| Optional selected-value presentation | Standard Basic field presentation                    | Can use Start's Vuetify chip-display options |
| Routed picker trigger and actions    | Basic/DaisyUI-oriented controls                      | Vuetify controls                             |
| Routed single selection              | Radio control                                        | Checkbox selection surface                   |
| Renderer identities                  | `basic-resource:*`                                   | `start-resource:*`                           |

Treat these as UI differences only. They do not change the core persistence rule, resource-owner data ownership, or server authorization boundary.

## Authoring checklist

Before shipping a Resource Picker, check the following:

- [ ] The field persists a stable identity or identity array.
- [ ] `resource` names the intended target resource.
- [ ] The target select API returns stable IDs and the configured title property.
- [ ] The target resource's select schema contains the list blocks needed by dialog mode.
- [ ] `actionPath` and `query` express only the desired selection view; server-side scope and authorization still enforce access.
- [ ] The response DTO supplies a narrow relation projection for editable, readonly, and table-label presentation.
- [ ] `relationName` and `selectOptions.itemTitle` match the returned projection when defaults do not.
- [ ] The field and table-cell renderer names match the active edition.
- [ ] The selected IDs, labels, cancellation behavior, and authorization rules are covered by a targeted test or end-to-end scenario.

The Training Record → Student picker is covered by existing end-to-end scenarios in both Cabloy Basic and Cabloy Start. Use that flow as the reference specimen when verifying an equivalent picker in your own resource.
