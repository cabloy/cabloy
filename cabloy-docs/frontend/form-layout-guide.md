# Form Layout Guide

Use Form Layout when a schema-driven resource form needs a deliberate structure: field order, responsive sections, groups, or tabs.

This guide covers the **structural** layout contract authored in DTO metadata and rendered through `basic-form:blockFormLayout`. It does not replace [Form Guide](/frontend/form-guide), which explains `ZForm`, field rendering, validation, and manual or mixed forms.

> [!TIP]
> Cabloy Basic implements the renderer described here with DaisyUI and Tailwind CSS. The `formLayout` contract and its resolver are shared Zova surfaces, but group, grid, and tab presentation are Basic-specific. Do not assume Cabloy Start uses identical markup or styling.

## The layout layers are different

Several APIs contain the word “layout,” but they own different concerns:

| Surface                                        | Owns                                                                                                           | Does not own                                              |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `formLayout`                                   | Field placement, sections, groups, responsive spans, and tabs                                                  | Field renderer selection, validation rules, submit policy |
| `basic-form:blockFormLayout`                   | Resolving and rendering a structural `formLayout` tree in Cabloy Basic                                         | Page-entry or filter actions                              |
| `layout`, `formFieldLayout`, `FormFieldLayout` | One field's label and wrapper presentation: inline/block mode, icons, borders, header/footer, class, and style | Sections, responsive grids, groups, or tabs               |

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

A filter uses the filter block as its host and keeps filter actions as an explicit sibling block:

```tsx
ZovaRender.block('basic-page:blockFilter', {
  formFieldLayout: { inline: false },
  blocks: [
    ZovaRender.block('basic-form:blockFormLayout', {
      formLayout: {
        children: [
          /* structural nodes */
        ],
      },
    }),
    ZovaRender.block('basic-page:blockFilterActions'),
  ],
});
```

A nonempty `blocks` list replaces `ZForm`'s automatic body and footer. Therefore a structured filter must explicitly include `basic-page:blockFilterActions`; it owns Search and Reset and keeps the filter's existing normalization and page-query handoff. See [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook#use-blocks-for-a-structural-filter-layout) for the filter ownership model.

## Layout node grammar

`formLayout` has a root `children` array. The node types deliberately have limited nesting rather than arbitrary recursion:

```text
formLayout
├─ field
├─ section
│  └─ field
├─ group
│  ├─ field
│  ├─ group
│  └─ section
└─ tabs
   └─ tab
      ├─ field
      ├─ group
      └─ section
```

| Node      | Key properties                                   | Allowed children         | Use it for                                |
| --------- | ------------------------------------------------ | ------------------------ | ----------------------------------------- |
| `field`   | required `name`; optional `span`                 | none                     | Place one resolved schema field           |
| `section` | optional `id`, `title`, `description`, `columns` | fields only              | A responsive field grid                   |
| `group`   | optional `id`, `title`, `description`            | fields, groups, sections | A semantic, bordered fieldset-style group |
| `tabs`    | optional `id`                                    | tabs only                | One tab container                         |
| `tab`     | optional `id`; required `title`                  | fields, groups, sections | One tab panel                             |

A section is the grid boundary. Use a group when the fields need a semantic or visual boundary, and place a section inside that group when it also needs responsive columns. There is no separate `row` node: grid placement creates rows automatically.

Nested tabs are not part of the current contract. Likewise, a section cannot contain a group or another section.

## Responsive sections and field spans

Both `section.columns` and `field.span` use the same responsive shape:

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
  formFieldLayout: { inline: false },
  blocks: [
    ZovaRender.block('basic-form:blockFormLayout', {
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
    }),
    ZovaRender.block('basic-page:blockFilterActions'),
  ],
});
```

Here `formFieldLayout.inline: false` controls how each field wrapper is presented. The section's `columns` and the date field's `span` control where those wrappers appear. `basic-page:blockFilterActions` remains required because the custom blocks replace automatic filter body/footer content.

## Authoring checklist

1. Start with DTO or resource metadata; do not hand-patch generated `.zova-rest` artifacts.
2. Use `formLayout` when the requirement is field placement, responsive structure, groups, or tabs.
3. Use `layout`, `formFieldLayout`, `options`, or provider behaviors when the requirement is one field's wrapper or renderer.
4. Keep entry actions in page-entry toolbar blocks and filter actions in `basic-page:blockFilterActions`.
5. Review field names against the scene-specific schema. Unlisted visible fields are appended; unknown and duplicate declarations are silently pruned from the rendered plan.
6. Use the smallest layout that communicates the form structure; reserve tabs for genuinely separate field groups.

## Source-reading and verification path

For source-level investigation, follow this order:

1. `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx` or `studentSelectResItem.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/formLayout.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/formLayout.ts`
4. `zova/src/suite/cabloy-basic/modules/basic-form/src/component/blockFormLayout/controller.tsx`
5. `vona/src/suite/a-training/modules/training-student/test/student.test.ts`

The Student test verifies that entry and filter DTO metadata preserves the current block nesting, optional IDs, columns, spans, and field order through OpenAPI generation. It is a contract-metadata test, not a browser end-to-end assertion for tabs, grids, or error badges.

For the broader form runtime, continue with [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) and [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map).
