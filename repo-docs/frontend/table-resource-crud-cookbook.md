# Table + Resource CRUD Cookbook

This cookbook explains how Zova Table fits into Cabloy Basic’s resource-driven CRUD list pages.

Use this page when your next question is practical rather than framework-neutral:

- how should I assemble a standard resource list page?
- where do filter, toolbar, table, and pager blocks come from?
- how does `ModelResource` feed schema and data into `ZTable`?
- where should list-page customization happen without breaking the existing runtime?

Use this page together with:

- [Table Guide](/frontend/table-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)
- [Zova Table Under the Hood](/frontend/zova-table-under-the-hood)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions)
- [Tutorial 2: Create Your First CRUD](/fullstack/tutorial-2-first-crud)
- [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing)
- [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing)

## What this cookbook is for

If your next question is how the resource list page runtime is assembled under the hood, continue with [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive). If your next question is why row or bulk actions are visible or hidden, continue with [Table Action Visibility and Permission Flow Guide](/frontend/table-action-visibility-permission-flow-guide).

A Cabloy Basic CRUD list page is usually not authored as:

- one page-local table component
- one page-local fetch call
- one page-local pager state
- one page-local filter form

The more typical Zova-native shape is:

- one resource-owner model
- one page block that owns query and permissions
- several reusable blocks for filter, bulk toolbar, table, and pager
- schema and metadata driving the visible UI

That means the practical CRUD question becomes less:

- “how do I hand-build one list page?”

and more:

- “how do I plug my resource into the existing resource-page runtime?”

## The shortest correct mental model

If you only remember one idea, remember this one:

> In Cabloy Basic CRUD list pages, `ZTable` is usually one block inside a larger resource-page runtime owned by `basic-page:blockPage` and backed by `ModelResource`.

That larger runtime usually owns:

- resource bootstrap
- list query state
- filter state
- permissions
- row schema
- paged response state
- coordination among filter, table, and pager

## One running example through this guide: Student list page

To keep the guide concrete, the examples below all use the same teaching thread:

- resource: `training-student:student`
- list-page concerns: filter, row actions, create action, pagination
- metadata sources: backend row DTO and row-action metadata

This is the same general shape already used in the built-in specimen:

- `vona/src/suite-vendor/a-test/modules/test-rest/src/dto/productSelectResItem.tsx`

## Step 1: Start from the generated CRUD contract, not from page-local UI

For a standard CRUD list page, begin with the generated backend thread.

The first useful entrypoint is still the CRUD generator:

```bash
npm run vona :tools:crud student -- --module=training-student
```

That generated thread already gives you the important contract anchors such as:

- backend entity
- select request DTO
- select response DTO
- select row-item DTO

A practical rule is:

- treat the generated resource contract as the list-page foundation
- refine schema and metadata before hand-building frontend list code

For the first generated CRUD walkthrough, see [Tutorial 2: Create Your First CRUD](/fullstack/tutorial-2-first-crud).

## Step 2: Understand the block chain for a standard list page

A standard resource list page is usually declared through backend-owned block metadata like this:

```tsx
ZovaRender.block('basic-page:blockPage', {
  blocks: [
    ZovaRender.block('basic-page:blockFilter', {
      formFieldLayout: { inline: true },
      blocks: [
        ZovaRender.block('basic-form:blockFormLayout', {
          formLayout: {
            children: [
              {
                type: 'section',
                layout: 'flow',
                children: [
                  { type: 'field', name: 'name' },
                  { type: 'field', name: 'createdAt' },
                  {
                    type: 'block',
                    block: ZovaRender.block('basic-page:blockFilterActions'),
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    ZovaRender.block('basic-page:blockToolbarBulk', {
      actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')],
    }),
    ZovaRender.block('basic-page:blockTable'),
    ZovaRender.block('basic-page:blockPager'),
  ],
});
```

The example follows the current Cabloy Basic CRUD convention: enumerate the real `SelectReq` fields in schema order and embed Search/Reset once so they share the filter flow. A bare `basic-page:blockFilter` remains supported as a minimal/default form, but it delegates placement to the automatic renderer.

That declaration is important because it shows the intended authoring direction clearly:

- backend or shared contract metadata chooses the block composition
- frontend block implementations provide the runtime behavior
- the page is assembled from existing building blocks rather than from ad hoc local wiring

A practical reading takeaway is:

- **the block list is the public page composition surface**
- **the frontend block controllers are the runtime owners**

## Step 3: Know what `basic-page:blockPage` owns

The main runtime owner for a resource list page is:

- `basic-page:blockPage`

Its controller is responsible for:

- resolving the `ModelResource` selector for the current resource
- preparing page-level JSX/CEL support
- creating query state
- loading schema and paged data
- exposing `data`, `schemaRow`, `schemaFilter`, `permissions`, and `paged`
- refreshing table metadata when permissions change

This is one of the most important architecture facts about CRUD pages.

The page block does not only render layout. It owns the list-page resource state.

A practical rule is:

- if the concern is about resource query, schema, or permissions, start debugging in `blockPage`
- if the concern is about one visual block, continue to the corresponding block controller next

## Step 4: Let `blockFilter` own filter-form behavior

The standard filter block is:

- `basic-page:blockFilter`

This block uses `ZForm` with:

- `schema={$$page.schemaFilter}`
- `schemaScene="filter"`
- page-owned filter data
- field-level `formFieldLayout.inline: true` by default

Its job is not to duplicate the list query logic.

Its job is to:

- render the filter form from resource filter schema
- normalize submitted filter data
- call `$$page.onFilter(...)`

A practical rule is:

- if you need to refine which filter fields exist, start from backend filter-side metadata and schema
- if you need to refine how filter submission affects the list, inspect `blockFilter` and `blockPage.onFilter(...)`

### Use blocks for a structural filter layout

A bare `basic-page:blockFilter` keeps the default schema field rendering and adds Search/Reset controls automatically. For a structured filter whose actions should share the flow with filter fields, embed the existing action block in Form Layout:

```tsx
ZovaRender.block('basic-page:blockFilter', {
  formFieldLayout: { inline: true },
  blocks: [
    ZovaRender.block('basic-form:blockFormLayout', {
      formLayout: {
        children: [
          {
            type: 'section',
            layout: 'flow',
            children: [
              { type: 'field', name: 'name' },
              { type: 'field', name: 'level' },
              { type: 'field', name: 'createdAt' },
              {
                type: 'block',
                block: ZovaRender.block('basic-page:blockFilterActions'),
              },
            ],
          },
        ],
      },
    }),
  ],
});
```

`basic-form:blockFormLayout` owns structural placement only. `basic-page:blockFilterActions` still owns Search/Reset behavior and invokes the filter command surface supplied through the inherited form scope, preserving filter normalization and page-query behavior. A nonempty `blocks` list replaces the automatic body and footer; include the action block explicitly to make the filter operable. The older sibling action-block composition remains supported, but do not combine it with an embedded action block.

`ZForm.inline` is no longer a form API. Use `formFieldLayout.inline` for field-level compact layout, or use blocks plus `basic-form:blockFormLayout` for structural layout. The flow section above keeps compact filters left-packed and wrapping; use the default Grid section when fields need responsive columns and spans. Read [Form Layout Guide](/frontend/form-layout-guide) for the full node grammar, section layout rules, resolver behavior, tabs, and entry-form composition.

## Step 5: Let `blockToolbarBulk` own bulk-action display

The standard bulk toolbar block is:

- `basic-page:blockToolbarBulk`

This block is intentionally thin.

Its main job is to:

- inspect the configured bulk actions
- filter them by permission
- render each action through the page JSX runtime

That means the toolbar block usually should not become a second action-semantics layer.

A practical rule is:

- if the page only needs standard create or other bulk actions, keep the existing block and adjust the metadata
- if an action is reusable, prefer a reusable action render resource rather than page-local ad hoc code

## Step 6: Let `blockTable` bridge page state into `ZTable`

The standard table block is:

- `basic-page:blockTable`

Its bridge role is very clear:

- render `ZTable`
- pass page data into `data`
- pass row schema into `schema`
- pass page CEL scope into `tableScope`
- capture the table controller through `controllerRef`

That means `blockTable` does not own list fetching or pagination logic.

It owns the handoff from page resource state to the reusable table runtime.

A practical rule is:

- if the table shows the wrong rows or wrong schema, inspect `blockPage` first
- if the handoff from page to table looks wrong, inspect `blockTable`
- if one column or cell renders incorrectly, continue into `a-table` and `tableCell` logic

## Step 7: Let `blockPager` own page navigation UI

The standard pager block is:

- `basic-page:blockPager`

This block reads the paged response from `$$page.paged` and renders:

- total items
- total pages
- previous-page button
- current page indicator
- next-page button

It delegates actual page movement back to the page block through `gotoPage(...)`.

That means the pager block owns the visible pager UI, while the page block still owns pagination state.

A practical rule is:

- if the pager UI looks wrong, inspect `blockPager`
- if paging requests or totals are wrong, inspect `blockPage` and the resource model/query side

## Step 8: Know where the table columns and row actions really come from

In a standard CRUD list page, the table contents are usually not first defined in the block controller.

They come from the backend resource contract, especially row DTO metadata.

A representative example is:

```tsx
@Api.field(
  v.title($locale('Operations')),
  ZovaRender.order(1, 'max'),
  ZovaRender.cell('basic-table:actionOperationsRow', {
    actions: [
      ZovaRender.tableActionRow('basic-table:actionUpdate'),
      ZovaRender.tableActionRow('basic-table:actionDelete'),
    ],
  }),
)
_operationsRow?: unknown;
```

This is the practical reverse-sharing model:

- the backend row contract chooses the table cell resource identity
- the frontend table runtime resolves that resource
- the page block and table block do not need page-local hard-coded row-action wiring

For the built-in metadata-sharing teaching path, see [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing).

For the forward-chain row-action teaching path, see [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing).

## Step 9: The common extension points

For standard CRUD list pages, most customization should happen in one of these places.

### Extension point A: backend row schema metadata

Use this when:

- a field should change order
- a column should be visible or hidden
- a field should use a different built-in or custom `tableCell`

This is usually the first and best extension point.

### Extension point B: backend block composition metadata

Use this when:

- the page should add or remove a standard block
- the page should include bulk actions
- the page should change list-page composition order

### Extension point C: custom `tableCell` resources

Use this when:

- a field needs business-specific table rendering
- one action cell should be reusable across pages
- one operations row should orchestrate several child actions

For concrete patterns, continue with [TableCell Authoring Cookbook](/frontend/table-cell-cookbook).

### Extension point D: page-level block implementation

Use this only when:

- the existing block runtime is structurally insufficient
- the behavior really belongs to the block runtime rather than to metadata
- you have already confirmed that schema, metadata, and cell resources are not enough

A practical rule is:

- prefer metadata and cell resources before changing block controllers

## Step 10: Distinguish list page from entry page

A common source-reading mistake is to mix `basic-page` list runtime with `basic-pageentry` form runtime.

They are related but they do not own the same concerns.

### `basic-page` list runtime

Typical responsibilities:

- filter form
- bulk toolbar
- table
- pager
- list query
- row schema and permissions

### `basic-pageentry` entry runtime

Typical responsibilities:

- view/create/edit form scene
- form schema and form data
- form submission
- page dirty state and page title

A practical rule is:

- if the page is about rows in a list, stay in `basic-page`
- if the page is about one entry form, stay in `basic-pageentry`

This distinction prevents a lot of source-reading confusion.

## Pattern 1: The standard generated CRUD list page

Use this pattern when:

- the CRUD generator already created the resource thread
- built-in page blocks are enough
- backend metadata can express the list behavior

Recommended path:

1. generate the CRUD thread
2. inspect row DTO metadata
3. keep the standard block chain
4. verify the list page in Admin

This should be the default choice for first CRUD pages.

## Pattern 2: Add a filter field through contract refinement

Use this pattern when:

- the list page needs one more search field
- the field belongs in the resource contract
- the filter form should stay schema-driven

Recommended path:

1. refine backend field and query DTO metadata
2. verify `schemaFilter`
3. reuse `basic-page:blockFilter`
4. avoid page-local manual filter UI unless really necessary

## Pattern 3: Add row actions through backend metadata

Use this pattern when:

- the row should expose update/delete/summary/deleteForce-like actions
- the action identity belongs in the contract
- the frontend should reuse `tableCell` resources

Recommended path:

1. define or refine backend row-action metadata
2. point the action cell to built-in or custom table-cell resources
3. if needed, add generated API and thin model helpers
4. verify the list page row actions in Admin

## Pattern 4: Add a business-specific cell for one field

Use this pattern when:

- one field such as `level`, `status`, or `score` needs module-owned UI behavior
- the list page should remain resource-driven overall

Recommended path:

1. create a custom `tableCell` bean
2. point backend field metadata to it
3. keep `basic-page:blockTable` and `ZTable` unchanged

This is the preferred path when the customization belongs to a field rather than to page structure.

## Common mistakes to avoid

### Mistake 1: Rebuilding list-page fetch state inside the table block

`blockTable` is only the page-to-table bridge. Query ownership lives in `blockPage` and `ModelResource`.

### Mistake 2: Hand-writing table columns before checking row schema metadata

For most CRUD pages, the row schema is the first source of truth.

### Mistake 3: Mixing list-page and entry-page concerns

`basic-page` and `basic-pageentry` are related, but they own different runtime responsibilities.

### Mistake 4: Modifying block controllers when metadata or `tableCell` resources are enough

Most business customization should happen before block-controller changes.

### Mistake 5: Treating row actions as only frontend-local UI

In Cabloy, row actions often belong to a broader contract chain involving backend metadata, generated API, model helpers, and table-cell resources.

## A practical authoring order

If you want the shortest path to a real CRUD list page, use this order:

1. generate or confirm the backend CRUD contract thread
2. confirm the resource-owner model already exposes the required schemas and permissions
3. keep the standard `blockPage -> blockFilter -> blockToolbarBulk -> blockTable -> blockPager` chain
4. refine backend row metadata for visible columns and row actions
5. reuse built-in `tableCell` resources first
6. add custom `tableCell` resources only where the UI becomes business-specific
7. change block controllers only when the existing runtime is structurally insufficient
8. continue with [Table Guide](/frontend/table-guide) for the public `ZTable` surface
9. continue with [TableCell Authoring Cookbook](/frontend/table-cell-cookbook) for custom cell patterns
10. continue with [Backend Metadata to Frontend Table Actions](/fullstack/backend-metadata-to-frontend-table-actions) when the visible row actions belong to a larger contract-loop chain
11. continue with [Zova Table Under the Hood](/frontend/zova-table-under-the-hood) when you want the controller-level runtime explanation
12. continue with [Zova Table Source Reading Map](/frontend/zova-table-source-reading-map) when you need targeted file-order guidance for the table runtime

## Verification checklist

When authoring or documenting a resource CRUD list page, verify in this order:

1. confirm the generated or existing backend CRUD contract files are present
2. confirm the block composition still matches the intended standard page chain
3. confirm row schema metadata points to the intended built-in or custom render resources
4. make sure the local dev workflow is running:

   ```bash
   npm run dev
   ```

5. open `http://localhost:7102/admin/`
6. enter the target list page and verify:
   - filter works
   - bulk actions render correctly
   - table columns and row actions match metadata
   - pager updates the list correctly
7. if you changed docs, build the docs site:

   ```bash
   npm run docs:build
   ```

## Final takeaway

A good Cabloy Basic CRUD list page is usually not a custom page-local table stack.

It is a resource-driven composition of:

- one resource-owner model
- one page block
- one schema-driven table runtime
- several reusable page blocks
- optional custom `tableCell` resources

That is the path that keeps CRUD list pages consistent, extensible, and aligned with the Zova-native architecture.
