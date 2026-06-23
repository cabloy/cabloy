# Backend Metadata to Frontend Table Actions

This page explains one of the most practical fullstack contract chains in Cabloy Basic:

> backend field and row metadata can drive visible frontend table actions, while frontend action resources and generated contract consumers stay aligned with that backend truth.

This page sits between the pure direction guides:

- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)

It is not only a forward-chain page and not only a reverse-chain page.

Instead, it explains one concrete business thread where both directions usually cooperate.

Use this page together with:

- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
- [Table Guide](/frontend/table-guide)
- [TableCell Authoring Cookbook](/frontend/table-cell-cookbook)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing)
- [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing)
- [Backend Metadata to Frontend Table Actions Verify Playbook](/fullstack/backend-metadata-to-frontend-table-actions-verify-playbook)
- [Backend Metadata to Frontend Table Actions Debug Checklist](/fullstack/backend-metadata-to-frontend-table-actions-debug-checklist)
- [Backend Metadata to Frontend Table Actions Source Reading Map](/fullstack/backend-metadata-to-frontend-table-actions-source-reading-map)

## Why this page exists

Several Cabloy docs already explain parts of this story:

- backend field contracts
- OpenAPI generation
- frontend metadata sharing
- custom table-cell authoring
- resource-driven CRUD pages

What contributors and AI workflows often still want is one continuous answer to this narrower question:

> how does one row action or one table-cell decision travel from backend metadata to a visible frontend list page?

This page answers that question by treating table actions as one complete contract chain rather than as disconnected snippets.

## The shortest correct mental model

If you only remember one idea, remember this one:

> in Cabloy Basic, a visible frontend table action usually belongs to a larger contract chain: backend metadata chooses the action resource identity, frontend runtime resolves that resource, and generated API/model layers keep the action semantics aligned with the backend contract.

That means the visible button or link in a table row is often only the last step of the chain, not the first.

## The main chain in one view

A practical row-action chain often looks like this:

1. backend resource entity or row DTO defines field or row-action metadata
2. that metadata uses `ZovaRender.cell(...)`, `ZovaRender.tableActionRow(...)`, `ZovaRender.tableActionBulk(...)`, or `ZovaRender.block(...)`
3. frontend resource/page runtime consumes the generated schema or DTO-backed block metadata
4. `basic-page:blockPage` and `basic-page:blockTable` feed row schema and data into `ZTable`
5. the `a-table` runtime resolves the referenced `tableCell` resource
6. the `tableCell` bean renders the visible action and may delegate to commands or model methods
7. if the action uses custom backend endpoints, frontend generated API and thin model facades keep the action semantics aligned with backend truth

That is the chain this page makes explicit.

## Two common categories of table action work

Before diving into files, separate two cases.

### Case A: metadata-only or built-in action path

Use this mental model when:

- built-in actions are enough
- row actions such as view/update/delete/create already exist
- the backend mainly needs to point to existing frontend resources

Representative examples include:

- `basic-table:actionView`
- `basic-table:actionUpdate`
- `basic-table:actionDelete`
- `basic-table:actionCreate`
- `basic-table:actionOperationsRow`

In this case, the main work is usually on the reverse-sharing side:

- backend metadata chooses frontend resource identities
- frontend runtime consumes them

### Case B: custom action path with backend contract changes

Use this mental model when:

- the row action corresponds to a new backend endpoint such as `summary/:id` or `deleteForce/:id`
- frontend should consume a newly generated API surface
- the same resource-owner model should stay the semantic owner

In this case, both directions cooperate:

- **forward chain**: backend controller/DTO changes generate frontend API consumers
- **reverse chain**: backend metadata points to frontend action resources that expose those new actions in the list page

This is the most practical reason to keep the forward and reverse chains conceptually separate but operationally connected.

## Step 1: Backend metadata chooses the visible action resource identity

The first source of truth for table action visibility often lives in backend field or row DTO metadata.

Representative entity-level field example:

```typescript
@Api.field(
  v.title($locale('Name')),
  v.min(3, $locale('ZodErrorStringMin')),
  v.required(),
  ZovaRender.order(1),
  ZovaRender.cell('basic-table:actionView'),
)
name: string;
```

Representative row-action-column example:

```typescript
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

This is one of the most important fullstack facts about list pages.

The backend contract is not trying to render the button itself. It is choosing the frontend resource identity that should render the button.

A practical reading takeaway is:

- **the backend owns the action contract surface**
- **the frontend owns the action implementation**
- **metadata is the bridge**

## Step 2: Block metadata composes the list page around those actions

Table actions do not live in isolation. They appear inside a resource-page block composition.

Representative shape:

```tsx
ZovaRender.block('basic-page:blockPage', {
  blocks: [
    ZovaRender.block('basic-page:blockFilter'),
    ZovaRender.block('basic-page:blockToolbarBulk', {
      actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')],
    }),
    ZovaRender.block('basic-page:blockTable'),
    ZovaRender.block('basic-page:blockPager'),
  ],
});
```

That means the row-action chain usually sits inside a larger page contract chain:

- block composition decides the page shape
- row or field metadata decides the cell/action resources
- frontend blocks and table runtime consume both surfaces together

## Step 3: `ModelResource` becomes the stable frontend resource owner

On the frontend side, the standard list runtime begins with the resource-owner model:

- `rest-resource.model.resource`

Its responsibilities include:

- resource bootstrap
- permissions
- `schemaFilter`
- `schemaRow`
- list query state
- item query state
- mutation ownership

This matters because the page runtime is not expected to rediscover resource contracts ad hoc.

A practical reading takeaway is:

- **pages consume resource semantics**
- **the model owns query and mutation semantics**

When a custom row action still belongs to the same business resource, keep that action inside the existing resource-owner story instead of inventing a competing owner.

## Step 4: `basic-page` feeds the row schema into `ZTable`

On a standard CRUD list page:

- `basic-page:blockPage` owns the resource state
- `basic-page:blockTable` passes `data`, `schemaRow`, and `tableScope` into `ZTable`

That means the backend metadata chain becomes visible in the table only after this resource-page handoff:

1. backend row schema / row DTO metadata exists
2. `ModelResource` exposes the row schema
3. `blockPage` exposes that schema to the page runtime
4. `blockTable` passes it into `ZTable`
5. `a-table` resolves the cell render resources from table-scene schema metadata

A practical rule is:

- if the action metadata looks right but the page still does not show it, inspect the page-block handoff before changing the cell bean itself

## Step 5: `a-table` resolves the referenced `tableCell` resources

Inside the table runtime, `ControllerTable` resolves the `render` metadata into a real render provider.

Important behaviors include:

- no render -> text fallback
- onion-like render string -> resolve through the `tableCell` scene
- `tableCell` bean options merge with column props
- `checkVisible(...)` can filter a render before the column/cell is shown

This is why `ZovaRender.cell('basic-table:actionView')` or `ZovaRender.cell('basic-table:actionOperationsRow', ...)` is enough on the backend side.

The frontend runtime already knows how to turn that contract identity into a real action render.

## Step 6: `tableCell` beans become the visible action implementations

Representative built-in row-action implementations include:

- `basic-table:actionView`
- `basic-table:actionUpdate`
- `basic-table:actionDelete`
- `basic-table:actionOperationsRow`

Their responsibilities usually stay small and focused.

### `actionView`

Typical responsibility:

- render a visible link
- call `$performCommand('basic-commands:view', ...)`

### `actionUpdate`

Typical responsibility:

- render an edit button
- call `$performCommand('basic-commands:edit', ...)`

### `actionDelete`

Typical responsibility:

- render a delete button
- confirm the action
- call `$performCommand('basic-commands:delete', ...)`

### `actionOperationsRow`

Typical responsibility:

- inspect the `actions` list
- filter actions by permission
- preload nested renders
- render each child action through `$$table.cellRender(...)`

A practical reading takeaway is:

- **single-action cells adapt render interaction to commands**
- **operations-row cells orchestrate several action resources together**

For deeper cell-authoring detail, continue with [TableCell Authoring Cookbook](/frontend/table-cell-cookbook).

## Step 7: Bulk actions follow the same contract idea at page level

The same mental model also appears in bulk or page-level actions.

Representative example:

```tsx
actions: [ZovaRender.tableActionBulk('basic-table:actionCreate')];
```

And the corresponding frontend implementation can render a button that performs:

- `basic-commands:create`

This is the same contract idea at a different UI level:

- backend or shared page metadata chooses the action resource identity
- frontend runtime resolves that identity to a visible action implementation

## Step 7A: Detail actions follow the same contract idea inside details blocks

The same contract model also appears in resource details tables.

A representative backend DTO shape is:

```tsx
@Dto({
  blocks: [
    ZovaRender.block('basic-details:blockDetails', {
      blocks: [
        ZovaRender.block('basic-details:blockToolbarBulk', {
          actions: [
            ZovaRender.detailsActionBulk('basic-details:actionCreate', {
              permission: { formScene: ['create', 'edit'] },
            }),
          ],
        }),
        ZovaRender.block('basic-details:blockTable'),
      ],
    }),
  ],
})
```

And the row-action column inside that detail table can look like this:

```tsx
@Api.field(
  v.title($locale('Operations')),
  ZovaRender.order(1, 'max'),
  ZovaRender.cell('basic-details:actionOperationsRow', {
    actions: [
      ZovaRender.detailsActionRow('basic-details:actionUpdate'),
      ZovaRender.detailsActionRow('basic-details:actionDelete'),
    ],
  }),
)
_operationsRow?: unknown;
```

This shows a practical three-part scaffold relationship:

1. `detailsActionBulk`
   - creates a detail-level bulk action controller resource
   - declaration-merges into `IResourceDetailsActionBulkRecord`
   - is the right fit for actions such as add/create on the whole details block
2. `detailsActionRow`
   - creates one detail-row action cell resource
   - declaration-merges into `IResourceDetailsActionRowRecord`
   - is the right fit for update/delete style actions attached to one detail row
3. `commandDetailsRow`
   - creates the command bean used when a detail-row action should delegate its semantics to the command scene
   - types options through `ICommandDetailsRowOptionsBase`
   - is the right fit when the visible detail-row action should call `$performCommand(...)` instead of embedding all behavior directly in the cell bean

A representative built-in flow in `basic-details` is:

- `basic-details:actionCreate`
  - a component/controller resource for `detailsActionBulk`
- `basic-details:actionUpdate`
  - a `tableCell` resource for `detailsActionRow`
- `basic-details:actionDelete`
  - a `tableCell` resource for `detailsActionRow`
- `basic-details:delete`
  - a command bean that matches the `commandDetailsRow` execution pattern

A practical reading takeaway is:

- **details bulk actions** usually coordinate the whole details block
- **details row actions** usually own the visible row-level interaction
- **details row commands** are the reusable semantic layer when one row action should execute through the command scene

So even though the UI surface is a detail table instead of a top-level resource list, the architecture still follows the same rule:

- backend metadata chooses resource identities
- frontend resources implement the interaction
- optional command beans keep the action semantics reusable and scene-aware

## Step 8: Where the forward chain enters for custom actions

So far, everything could still be handled by built-in commands and built-in resources.

The forward chain becomes important when the action itself depends on a new backend API contract.

Representative examples include actions such as:

- `summary/:id`
- `deleteForce/:id`

In that case, the practical chain becomes:

1. backend controller exposes the custom endpoint
2. backend DTOs define request/response contracts
3. frontend OpenAPI generation produces typed API consumers
4. the frontend module model wraps those generated consumers thinly
5. a custom `tableCell.actionSummary.tsx` or `tableCell.actionDeleteForce.tsx` triggers the corresponding semantic action path
6. backend row metadata points the visible row action at that frontend resource identity

This is why Tutorial 5 is a forward-chain tutorial even though the visible result is a row action in a table.

The action semantics are forward-generated; the visible table exposure is reverse-shared.

## Step 9: Why the resource-owner model should stay the semantic owner

When a custom action still belongs to the same business resource, do not create a competing cache owner only because the action is custom.

Instead:

- generate the new frontend API contract from backend truth
- wrap it in the existing module model as a thin semantic facade
- keep invalidation and resource ownership coherent

This matters because row actions often affect:

- current row state
- list query invalidation
- related item views
- page refresh expectations

A practical rule is:

- if the action still belongs to the same resource, prefer extending the existing resource owner over inventing a second one

## Step 10: A practical end-to-end example matrix

Here is the most useful way to think about common action types.

### Built-in view action

Chain:

1. backend field metadata uses `ZovaRender.cell('basic-table:actionView')`
2. row schema reaches `ZTable`
3. `a-table` resolves `basic-table:actionView`
4. the frontend action cell performs `basic-commands:view`

This is mostly a reverse-sharing path.

### Built-in operations row

Chain:

1. backend row DTO metadata uses `ZovaRender.cell('basic-table:actionOperationsRow', { actions: [...] })`
2. nested row-action metadata uses `ZovaRender.tableActionRow(...)`
3. `actionOperationsRow` filters and renders child actions
4. each child action delegates to its own command-oriented cell resource

This is also mainly a reverse-sharing path.

### Custom summary action

Chain:

1. backend controller and DTOs define `summary/:id`
2. frontend OpenAPI generation creates the API consumer
3. frontend model wraps the consumer thinly
4. custom `tableCell.actionSummary.tsx` exposes the visible row action
5. backend row metadata includes that action in the operations row

This uses both forward and reverse directions.

## Step 11: How to classify the work before editing anything

Use this quick decision map.

### Mostly reverse-chain work

Use this path when:

- you are only changing which built-in or existing frontend render resource a field or row should use
- no new backend endpoint is needed
- the visible change is mostly metadata-driven

Typical examples:

- switch one field to `basic-table:actionView`
- add an operations row using existing update/delete actions
- add a custom table-cell renderer that backend metadata points to
- add a details block action chain with `detailsActionBulk` and `detailsActionRow` resources

### Mostly forward-chain work

Use this path when:

- the action semantics need a new backend endpoint or changed response contract
- frontend typed consumers must regenerate
- the row action is only the last visible step of a larger API-contract change

Typical examples:

- add summary, archive, approve, or force-delete actions with new backend contracts

### Consumer drift

Suspect this when:

- generated artifacts already contain the expected action contracts or resource keys
- but the visible frontend behavior still looks stale

### Local dependency drift

Suspect this when:

- generated `.zova-rest` output or SDK output looks correct
- but backend or frontend local consumers still do not see the refreshed shared types or resource identities

## Common mistakes to avoid

### Mistake 1: Treating the visible button as the start of the design

Usually the visible button is the end of the design. Start from the contract and metadata chain first.

### Mistake 2: Adding a custom backend endpoint but manually duplicating its frontend contract

Prefer the forward-generation path before hand-writing request code.

### Mistake 3: Creating a competing frontend state owner for an action that still belongs to the same resource

Prefer reusing the existing resource-owner model.

### Mistake 4: Patching page-local table code when metadata already expresses the action correctly

If the contract is metadata-driven, keep it metadata-driven.

### Mistake 5: Mixing up built-in action resources and custom action semantics

Built-in action resources often only adapt UI to commands. Custom action semantics may still need generated API and model work behind them.

## A practical authoring order

If you want the shortest path to a correct table-action implementation, use this order:

1. decide whether the work is mostly reverse-chain or forward-chain
2. if forward-chain, change backend controller/DTO truth first
3. regenerate frontend API consumers when backend contract changes
4. keep frontend model follow-up thin and semantic
5. point backend row metadata to the intended built-in or custom table-action resources
6. for details-table work, also align `detailsActionBulk`, `detailsActionRow`, and any `commandDetailsRow` delegation path
7. verify the resource-page block chain still feeds the right schema into `ZTable`
8. verify the visible row action in Admin

## Verification checklist

When documenting or implementing this chain, verify in this order:

1. confirm the backend metadata anchors actually point to the intended `ZovaRender.*(...)` resources
2. confirm the page block composition still includes the intended list blocks
3. confirm the current frontend `tableCell` resources exist and match the named identities
4. if custom backend actions were added, regenerate the frontend contract surface first
5. make sure the local dev workflow is running:

   ```bash
   npm run dev
   ```

6. open `http://localhost:7102/admin/`
7. verify the visible list page behavior:
   - bulk create action if relevant
   - row operations visibility
   - row action execution
   - list invalidation or refresh after mutations
8. if reverse-chain frontend resources changed, run the representative Basic handoff flow when needed:

   ```bash
   npm run zova :tools:metadata <module-name>
   npm run build:zova:admin
   npm run deps:vona
   ```

9. if docs changed, build the docs site:

   ```bash
   npm run docs:build
   ```

## Final takeaway

A frontend table action in Cabloy Basic is often not just a frontend button.

It is the visible result of a contract chain that may include:

- backend field or row metadata
- page block composition metadata
- generated frontend contract consumers
- resource-owner model semantics
- `tableCell` bean-scene resources
- `basic-page` list runtime

Once you read the system through that chain, row actions stop looking like scattered UI details and start looking like one coherent fullstack workflow.
