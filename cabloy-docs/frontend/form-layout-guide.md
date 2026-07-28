# Form Layout Guide

Use Form Layout when a schema-driven resource form needs a deliberate structure: field order, Grid or flow sections, groups, or tabs.

This guide covers the **structural** layout contract authored in DTO metadata and rendered through `basic-form:blockFormLayout`. It does not replace [Form Guide](/frontend/form-guide), which explains `ZForm`, field rendering, validation, and manual or mixed forms.

> [!TIP]
> Cabloy Basic implements the renderer described here with DaisyUI and Tailwind CSS. The `formLayout` contract and its resolver are shared Zova surfaces, but group, Grid, flow, and tab presentation are Basic-specific. Do not assume Cabloy Start uses identical markup or styling.

## The layout layers are different

Several APIs contain the word “layout,” but they own different concerns:

| Surface                                        | Owns                                                                                                           | Does not own                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `formLayout`                                   | Field and renderable-block placement, Grid/flow sections, groups, responsive spans, and tabs                   | Field renderer selection, validation rules, submit policy |
| `basic-form:blockFormLayout`                   | Resolving and rendering a structural `formLayout` tree in Cabloy Basic, including embedded renderable blocks   | Page-entry or filter action semantics                     |
| `layout`, `formFieldLayout`, `FormFieldLayout` | One field's label and wrapper presentation: inline/block mode, icons, borders, header/footer, class, and style | Sections, Grid/flow placement, groups, or tabs            |

For example, `formFieldLayout: { inline: false }` makes each field use a block-style wrapper. It does not create a grid. Pair it with `basic-form:blockFormLayout` when the fields also need structural placement.

Read [Form Guide](/frontend/form-guide) for field wrapper and provider customization, and [Behavior Guide](/frontend/behavior-guide) for the `FormFieldLayout` behavior pipeline.

## Compose the layout through resource blocks

For resource forms, author structural layout in backend DTO metadata with `ZovaRender.block(...)`. The helper creates contract metadata; it does not render the form itself. Zova later consumes the generated schema metadata and renders the registered blocks.

### Entry form composition

A resource entry DTO normally nests the layout block inside the page-entry form block:

```tsx
@Dto({
  blocks: [
    ZovaRender.block('basic-pageentry:blockPageEntry', {
      blocks: [
        ZovaRender.block('basic-pageentry:blockForm', {
          blocks: [
            ZovaRender.block('basic-form:blockFormLayout', {
              formLayout: {
                children: [/* fields, groups, sections, or tabs */],
              },
            }),
          ],
        }),
        ZovaRender.block('basic-pageentry:blockToolbarRow', {
          actions: [/* Submit, Back, and other page-entry actions */],
        }),
      ],
    }),
  ],
})
```

The responsibilities stay separate:

- the DTO supplies the structural contract metadata
- `basic-pageentry:blockForm` bridges page-entry form state, schema, and scene into `ZForm`
- `basic-form:blockFormLayout` places schema fields
- `basic-pageentry:blockToolbarRow` owns page-entry actions and their scene/permission rules

Form Layout changes neither readonly behavior nor actions. Create, update, and view scenes can reuse the same structure while the normal form and page-entry pipelines decide field state and available actions. See [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive) for the wider entry-page runtime.

### Filter form composition

A filter uses the filter block as its host. Place Search/Reset inside the structural layout when they should participate in the same Grid or flow as filter fields:

```tsx
ZovaRender.block('basic-page:blockFilter', {
  formFieldLayout: { inline: false },
  blocks: [
    ZovaRender.block('basic-form:blockFormLayout', {
      formLayout: {
        children: [
          {
            type: 'section',
            layout: 'flow',
            children: [
              /* filter fields */
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

The renderable block node controls only structural placement. `basic-page:blockFilterActions` still owns Search/Reset and obtains the filter command surface from the inherited form scope, preserving normalization and page-query handoff. A nonempty `blocks` list replaces `ZForm`'s automatic body and footer.

The legacy sibling composition remains supported when actions do not need to share a structural section:

```tsx
blocks: [
  ZovaRender.block('basic-form:blockFormLayout', { formLayout }),
  ZovaRender.block('basic-page:blockFilterActions'),
];
```

Use either the embedded layout block or the legacy sibling action block, never both; otherwise Search and Reset are rendered twice. See [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook#use-blocks-for-a-structural-filter-layout) for the filter ownership model.

## Layout node grammar

`formLayout` has a root `children` array. The node types deliberately have limited nesting rather than arbitrary recursion:

```text
formLayout
├─ field
├─ block
├─ section
│  ├─ field
│  └─ block
├─ group
│  ├─ field
│  ├─ block
│  ├─ group
│  └─ section
└─ tabs
   └─ tab
      ├─ field
      ├─ block
      ├─ group
      └─ section
```

| Node      | Key properties                                             | Allowed children                 | Use it for                                  |
| --------- | ---------------------------------------------------------- | -------------------------------- | ------------------------------------------- |
| `field`   | required `name`; optional `span`                           | none                             | Place one resolved schema field             |
| `block`   | required `block`; optional `span`                          | none                             | Place an existing renderable resource block |
| `section` | optional `id`, `title`, `description`, `layout`, `columns` | fields and blocks                | A Grid or wrapping flow layout              |
| `group`   | optional `id`, `title`, `description`                      | fields, blocks, groups, sections | A semantic, bordered fieldset-style group   |
| `tabs`    | optional `id`                                              | tabs only                        | One tab container                           |
| `tab`     | optional `id`; required `title`                            | fields, blocks, groups, sections | One tab panel                               |

A section is a layout boundary. It uses the Grid strategy by default; set `layout: 'flow'` for compact, left-packed fields and blocks that wrap at their intrinsic widths. Use a group when the fields need a semantic or visual boundary, and place a section inside that group when it also needs Grid columns or flow placement. There is no separate `row` node: Grid and flow placement create rows automatically.

A `block` node is not a schema field and does not add a request, response, validation, or query value. It wraps an existing `ZovaRender.block(...)` descriptor and renders it with the current form JSX/CEL context. This lets a filter action block participate in a flow section without transferring filter-action behavior into Form Layout.

Nested tabs are not part of the current contract. Likewise, a section cannot contain a group or another section.

## Grid sections and field spans

Grid is the default section strategy: omit `layout` or set `layout: 'grid'`. Both `section.columns` and `field.span` use the same responsive shape:

```ts
{
  default?: 1 | 2 | 3 | 4,
  md?: 1 | 2 | 3 | 4,
  lg?: 1 | 2 | 3 | 4,
}
```

- `columns` chooses how many columns a section has at each breakpoint.
- `span` chooses how many of those columns a field occupies.
- In Cabloy Basic, these become Tailwind classes such as `grid-cols-2`, `md:grid-cols-2`, `col-span-2`, and `md:col-span-2`.
- A section with no `columns.default` renders as one column.
- A field with no `span` takes its normal grid cell.

The following compact filter structure becomes one column by default, two columns at `md`, and makes `createdAt` use both medium columns:

```tsx
formLayout: {
  children: [
    {
      type: 'section',
      columns: { default: 1, md: 2 },
      children: [
        { type: 'field', name: 'name' },
        { type: 'field', name: 'level' },
        { type: 'field', name: 'createdAt', span: { default: 1, md: 2 } },
      ],
    },
  ],
},
```

## Flow sections

Set `layout: 'flow'` when compact fields should appear from left to right without being distributed across equal Grid columns. Cabloy Basic renders a flow section as a wrapping flex layout, so each field keeps its renderer-defined width and moves to the next line only when space runs out.

```tsx
{
  type: 'section',
  layout: 'flow',
  children: [
    { type: 'field', name: 'name' },
    { type: 'field', name: 'level' },
    { type: 'field', name: 'createdAt' },
  ],
}
```

`columns` and `span` are Grid-only settings. Omit them from flow sections; they do not determine flex widths or offsets. Use `formFieldLayout.inline` independently when the fields themselves should use compact inline wrappers.

## How the resolver handles the declared tree

Before rendering, `resolveFormLayout(...)` reconciles `formLayout` with the current scene's resolved schema properties. This makes the declaration a **placement overlay**, not an allow-list.

### Eligible and omitted fields

Only schema properties with `rest.visible !== false` are eligible. When an eligible visible field is absent from `formLayout`, the resolver appends it as a root-level field after the declared nodes, in schema-property order.

If a field must not render, make it invisible in schema metadata. Leaving it out of `formLayout.children` is not enough.

### Invalid declarations and diagnostics

The resolver keeps the first occurrence of each field and removes later duplicates. It also removes field names that are not eligible in the current schema scene.

| Situation                                 | Resolver result                               | Diagnostic       |
| ----------------------------------------- | --------------------------------------------- | ---------------- |
| Unknown or invisible field name           | Field is removed                              | `unknownField`   |
| Repeated field name                       | Later field is removed                        | `duplicateField` |
| Repeated structural ID                    | Later group, section, tabs, or tab is removed | `duplicateId`    |
| Structural node has no surviving children | Node is removed                               | none             |

Groups, sections, tab containers, and tabs receive an ID even when the DTO omits one. The resolver derives it from the node type and index path, for example `tabs-0` or `section-0-1-0`. Omit IDs for simple static layouts; provide explicit IDs when external state, diagnostics, tests, or future extensions need a stable structural reference.

> [!WARNING]
> Diagnostics are returned in the resolved layout plan, but the current `basic-form:blockFormLayout` renderer does not display or log them. Treat field names and explicit IDs as metadata that must be reviewed and tested, rather than expecting a visible authoring error at runtime.

## Tabs and validation feedback

The Basic renderer keeps active-tab state locally for each `tabs` node. If no saved active tab remains valid, it falls back to the first surviving tab.

It renders native tab buttons and panels with `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-controls`, and `aria-labelledby` relationships. A tab receives an error badge when fields below it have validation errors. The badge counts fields with errors, not individual error messages.

Field error messages remain the responsibility of the field-layout behavior. The structural layout only summarizes their presence on tabs.

Current behavior boundaries:

- an error badge does not automatically activate or focus the tab containing the invalid field
- tab state belongs to the `basic-form:blockFormLayout` component, not the form globally
- the contract does not support nested tabs
- Form Layout does not select field renderers, change field visibility, or alter validation and submit policies

## Complete entry-form example

The Student create DTO is the canonical complete example. It uses optional structural IDs, two tabs, a titled group, a responsive profile section, and a nested-details field:

```tsx
ZovaRender.block('basic-pageentry:blockForm', {
  blocks: [
    ZovaRender.block('basic-form:blockFormLayout', {
      formLayout: {
        children: [
          {
            type: 'tabs',
            children: [
              {
                type: 'tab',
                title: $locale('BasicInformation'),
                children: [
                  {
                    type: 'group',
                    title: $locale('StudentProfile'),
                    children: [
                      {
                        type: 'section',
                        columns: { default: 1, md: 2 },
                        children: [
                          { type: 'field', name: 'name' },
                          { type: 'field', name: 'mobile' },
                          { type: 'field', name: 'imageId' },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'tab',
                title: $locale('TrainingRecords'),
                children: [
                  { type: 'field', name: 'level' },
                  {
                    type: 'section',
                    children: [{ type: 'field', name: 'trainingRecords' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    }),
  ],
});
```

`trainingRecords` is one field in the structural tree. Its `basic-details:formFieldDetails` renderer owns the nested details UI; Form Layout does not recursively arrange the properties inside each detail record.

Student update and view DTOs use the same structural shape. The normal form scene controls readonly behavior, while the page-entry toolbar decides whether Submit, Back, or other actions are available.

## Complete filter-form example

The Student list filter combines field-wrapper and structural layout concerns:

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

Here `formFieldLayout.inline: true` controls how each field wrapper is presented. The flow section keeps fields and the action block left-packed and wraps them together when necessary. `basic-page:blockFilterActions` remains required because the custom blocks replace automatic filter body/footer content, but it is now placed through the structural layout rather than as a sibling block.

## Authoring checklist

1. Start with DTO or resource metadata; do not hand-patch generated `.zova-rest` artifacts.
2. Use `formLayout` when the requirement is field placement, Grid or flow structure, groups, or tabs.
3. Use `layout`, `formFieldLayout`, `options`, or provider behaviors when the requirement is one field's wrapper or renderer.
4. Keep entry actions in page-entry toolbar blocks. Keep filter action semantics in `basic-page:blockFilterActions`; place that block inside Form Layout only when actions must share structural Grid or flow placement with fields.
5. Review field names against the scene-specific schema. Unlisted visible fields are appended; unknown and duplicate declarations are silently pruned from the rendered plan.
6. Use the smallest layout that communicates the form structure; reserve tabs for genuinely separate field groups.

## Source-reading and verification path

For source-level investigation, follow this order:

1. `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx` or `studentSelectResItem.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/formLayout.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/formLayout.ts`
4. `zova/src/suite/cabloy-basic/modules/basic-form/src/component/blockFormLayout/controller.tsx`
5. `vona/src/suite/a-training/modules/training-student/test/student.test.ts`

The Student test verifies that entry and filter DTO metadata preserves the current block nesting, optional IDs, Grid columns/spans, flow layout selection, and field order through OpenAPI generation. It is a contract-metadata test, not a browser end-to-end assertion for tabs, layout behavior, or error badges.

For the broader form runtime, continue with [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) and [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map).
