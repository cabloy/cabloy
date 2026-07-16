# Zova Form Source Reading Map

This page is a practical map for contributors and AI workflows that need to read Zova Form source code efficiently.

Use this page after [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) when your next question is not the runtime model itself, but which files to read first for a specific form-internals topic.

It answers a narrow question:

> when I need to understand how Zova Form works internally, which files should I read first, and in what order?

Use this page together with:

- [Form Guide](/frontend/form-guide)
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)
- [Behavior Guide](/frontend/behavior-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)

> [!TIP]
> **Zova Form docs path**
>
> 1. **[Form Guide](/frontend/form-guide)** — learn the public authoring surface
> 2. **[Zova Form Under the Hood](/frontend/zova-form-under-the-hood)** — learn how the runtime pieces cooperate
> 3. **[Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)** — learn which files to read next
>
> **You are here:** step 3.
> **Previous page:** [Zova Form Under the Hood](/frontend/zova-form-under-the-hood).

## Why this page exists

The `a-form` module sits at the intersection of several Zova concerns at once:

- controller-oriented component design
- schema-driven rendering
- Zod and TanStack validation
- behavior-based field wrapping
- resource-driven CRUD page integration

This page exists for one narrow job:

- [Form Guide](/frontend/form-guide) explains how to author forms
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) explains how the runtime pieces cooperate
- this page gives the shortest file-order paths for specific form questions

## How to use this page

For each topic below:

1. start with the public guide to refresh the architectural intent
2. read the first source file to identify the public surface
3. continue into the next runtime file only if you still need the implementation detail
4. stop as soon as you have enough information for the task

The goal is not to read the entire form stack every time. The goal is to choose the shortest correct path.

## 1. Public form surface and wrapper entrypoints

Use this path when you are asking questions like:

- what is the public Zova Form surface?
- where do `ZForm` and `ZFormField` enter the runtime?
- how does `controllerRef` reach the controller instance?

### Read the docs first

- [Form Guide](/frontend/form-guide)
- [Component Guide](/frontend/component-guide)
- [Reading Zova for Vue Developers](/frontend/reading-zova-for-vue-developers)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/.metadata/component/form.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-form/src/.metadata/component/formField.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx`
4. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx`
5. `zova/packages-zova/zova-core/src/composables/useController.ts`

### What each file clarifies

- metadata wrapper files show how the public component wrappers enter `useController(...)`
- `form.ts` exposes `ZForm` and its typed controller-facing props surface
- `formField.ts` exposes `ZFormField` and the controller-aware slot contract
- `useController.ts` shows how the controller instance is created and bound to the wrapper component lifecycle

## 2. Form controller ownership and form runtime

Use this path when you are asking questions like:

- where is the form instance created?
- where does `formState` come from?
- how does `submit()` or `reset()` work in Zova Form?

### Read the docs first

- [Form Guide](/frontend/form-guide)
- [Zod Guide](/frontend/zod-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/beanControllerFormBase.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/beanControllerPageFormBase.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-form/src/types/form.ts`

### What each file clarifies

- `component/form/controller.tsx` is the main form runtime owner
- `beanControllerFormBase.ts` shows the shared `$useForm(...)` wrapper around TanStack Form
- `beanControllerPageFormBase.ts` shows the page-controller-oriented variant for form pages
- `types/form.ts` shows the exposed type contracts for submit data, state, and events

## 3. Field controller ownership and field render flow

Use this path when you are asking questions like:

- how is one field connected to the parent form?
- where do `setValue(...)` and `handleBlur()` live?
- how does one field become a rendered vnode?

### Read the docs first

- [Form Guide](/frontend/form-guide)
- [Behavior Guide](/frontend/behavior-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/render.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/types/formField.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formFieldPreset/controller.tsx`
5. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formFieldBlank/controller.tsx`

### What each file clarifies

- `formField/controller.tsx` is the field runtime owner and host-injected child of the form controller
- `formField/render.tsx` shows the final render handoff through behaviors and `zovaJsx.render(...)`
- `types/formField.ts` shows field options, layout options, render context, and the `$$FieldProps` marker
- `formFieldPreset/controller.tsx` shows the preset-driven delegation path
- `formFieldBlank/controller.tsx` shows the free-row slot-only path

## 4. Schema-driven rendering and CEL/JSX resolution

Use this path when you are asking questions like:

- how does a schema become rendered fields?
- where do field props come from?
- how are metadata expressions or render providers resolved?

### Read the docs first

- [API Schema Guide](/frontend/api-schema-guide)
- [Form Guide](/frontend/form-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/render.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/types/formField.ts`

### What each file clarifies

- `form/controller.tsx` shows schema property loading, field CEL scope creation, and top-level field prop extraction
- `form/render.tsx` shows how schema properties become children when the form body is not manually overridden
- `types/formField.ts` shows the field render-context shapes that the runtime passes through to renderers and behaviors

## 5. Validation, submit flow, and server error normalization

Use this path when you are asking questions like:

- where is submit wired?
- how are form-level and field-level validators chosen?
- how are server validation errors pushed back into the form state?

### Read the docs first

- [Form Guide](/frontend/form-guide)
- [Zod Guide](/frontend/zod-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/types/form.ts`

### What each file clarifies

- `form/controller.tsx` shows `submit(...)`, `_createForm()`, `onSubmitInvalid`, `onSubmitData`, and error normalization
- `formField/controller.tsx` shows how field validators are derived from Zod schema or explicit field options
- `types/form.ts` shows the public event and submit-type contracts that the rest of the framework consumes

## 6. Provider config, default renderers, and behavior-based layout

Use this path when you are asking questions like:

- where does the default `Input` renderer come from?
- how does `formProvider` affect field rendering?
- where do form-field layout behaviors enter the pipeline?

### Read the docs first

- [Form Guide](/frontend/form-guide)
- [Behavior Guide](/frontend/behavior-guide)

### Then read source in this order

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-adapter/src/config/config.ts`
3. `zova/src/suite/a-home/modules/home-login/src/page/login/render.tsx`
4. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/render.tsx`

### What each file clarifies

- `formField/controller.tsx` shows how field props, layout, options, provider config, and behaviors are merged
- `basic-adapter/src/config/config.ts` shows the default Basic provider components and layout behaviors
- `home-login/render.tsx` shows a page-level `formProvider` override for layout behavior
- `formField/render.tsx` shows how the behavior-wrapped render path leads to the final vnode

## 7. DTO-driven structural Form Layout

Use this path when you are asking questions like:

- where does `formLayout` come from in a resource DTO?
- how are fields, sections, groups, and tabs normalized before rendering?
- why are omitted visible fields appended or duplicate fields removed?
- where does Cabloy Basic render responsive grids and tab error badges?

### Read the docs first

- [Form Layout Guide](/frontend/form-layout-guide)
- [Table + Resource CRUD Cookbook](/frontend/table-resource-crud-cookbook)
- [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)

### Then read source in this order

1. `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx`
2. `vona/src/suite/a-training/modules/training-student/src/dto/studentSelectResItem.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/resource/formLayout.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/formLayout.ts`
5. `zova/src/suite/cabloy-basic/modules/basic-form/src/component/blockFormLayout/controller.tsx`
6. `vona/src/suite/a-training/modules/training-student/test/student.test.ts`

### What each file clarifies

- the Student DTOs show the entry and filter block composition that supplies layout metadata
- the OpenAPI type contract defines the legal node grammar and responsive values
- the resolver reconciles metadata with visible schema fields, generated IDs, and diagnostics
- the Basic block controller renders sections, groups, tabs, and field spans while delegating widgets to `$$form.renderField(...)`
- the Student test verifies emitted metadata nesting, columns, spans, and optional IDs; it is not a browser rendering test

## 8. Resource-driven CRUD page integration

Use this path when you are asking questions like:

- how does a resource page feed schema and data into `ZForm`?
- where do `formMeta`, `formSchema`, and `formProvider` come from in CRUD pages?
- how does submit delegate back to resource mutation logic?

### Read the docs first

- [Form Guide](/frontend/form-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Tutorial 2: Create Your First CRUD](/fullstack/tutorial-2-first-crud)
- [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing)

### Then read source in this order

1. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
2. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/utils.ts`
4. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockFilter/controller.tsx`

### What each file clarifies

- `blockPageEntry/controller.tsx` shows the resource-driven CRUD form orchestration path
- `blockForm/controller.tsx` shows how a block-level wrapper passes schema/data/provider/meta into `ZForm`
- `lib/utils.ts` shows the canonical scene-to-form-meta translation helpers
- `blockFilter/controller.tsx` shows the lighter-weight filter-form branch using the same form module

If your next question becomes how `formScene` becomes `formMeta`, then `pageMeta`, and finally visible shell/tab state, continue with [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide).

If your next question becomes how backend/entity schema metadata attaches field-side effects through `ZovaRender.onEffect(...)` and command chains, continue with [Schema-Driven Field Effects Guide](/frontend/schema-driven-field-effects-guide).

## 9. Representative specimens to read before editing the framework

Use this section when you want one small example before reading the framework internals.

### Read these specimens first

1. `zova/src/suite/a-demo/modules/demo-basic/src/page/toolOne/controller.tsx`
2. `zova/src/suite/a-demo/modules/demo-basic/src/page/toolOne/render.tsx`
3. `zova/src/suite/a-home/modules/home-login/src/page/login/render.tsx`

### Why these three specimens matter

- `toolOne` shows both schema-driven and manual form usage in one page
- `home-login` shows a real page using presets, blank rows, and provider-level layout override
- together they give you the public authoring shape before you descend into the form runtime

## 10. A compact reading strategy

When in doubt, use this order:

1. [Form Guide](/frontend/form-guide)
2. one real usage specimen such as `toolOne` or `home-login`
3. the public wrapper metadata under `src/.metadata/component/*.ts`
4. `component/form/controller.tsx`
5. `component/formField/controller.tsx`
6. render beans, types, and integration layers only if you still need more detail

That order usually gets you to the answer faster than starting from the deepest runtime files first.

## 11. Final takeaway

The fastest way to read Zova Form accurately is not to memorize every file in `a-form`.

It is to recognize which question you are asking:

- public wrapper question
- form-runtime question
- field-render question
- validation question
- resource-CRUD integration question

Then start from the smallest public file that matches that question and only descend into deeper runtime files as needed.
