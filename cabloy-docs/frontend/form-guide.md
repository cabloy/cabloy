# Form Guide

This guide explains how to build forms in Zova with a practical, tutorial-style path.

Zova Form is not only a thin Vue wrapper around a form library. It is a Zova-native form layer built around:

- controller-oriented frontend architecture
- schema-driven field rendering
- Zod-friendly validation
- behavior-based field layout and customization
- provider-based render selection

Use this page together with:

- [Component Guide](/frontend/component-guide)
- [Behavior Guide](/frontend/behavior-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [Zod Guide](/frontend/zod-guide)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Zova Form Under the Hood](/frontend/zova-form-under-the-hood)
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)

> [!TIP]
> **Zova Form docs path**
> 1. **[Form Guide](/frontend/form-guide)** — learn the public authoring surface
> 2. **[Zova Form Under the Hood](/frontend/zova-form-under-the-hood)** — learn how the runtime pieces cooperate
> 3. **[Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)** — learn which files to read next
>
> **You are here:** step 1.
> **Next recommended page:** [Zova Form Under the Hood](/frontend/zova-form-under-the-hood).

If your next question is how these public APIs cooperate internally at runtime, continue with [Zova Form Under the Hood](/frontend/zova-form-under-the-hood).

## What you should learn first

If you only remember one idea, remember this one:

> In Zova, a form is centered on a form controller and field controllers, while schema, provider config, and behaviors decide how much of the UI should be automatic and how much should be customized.

That leads to four common authoring surfaces:

- `ZForm` — the root form component
- `ZFormFieldPreset` — the quickest way to render a standard field
- `ZFormField` — the low-level custom field entry
- `ZFormFieldBlank` — a free layout row for buttons and other non-field content

## One running example through this guide: Student

To keep the guide concrete, the examples below all use the same teaching resource:

- resource: `demo-student:student`
- representative fields: `name`, `level`, and `mobile`
- common scenes: Student create, Student edit, and Student view

That Student thread is a good specimen because it grows through the same path most real business forms follow:

1. generated CRUD structure
2. schema-driven form rendering
3. metadata-driven field rendering
4. custom field rendering only where the business UI needs it

So as you read the code samples below, treat them as different stages of the same Student form rather than unrelated fragments.

## Step 1: Choose the right form style

Before writing code, choose which of these three styles matches your Student page.

### Style A: schema-driven form

Use this when:

- the backend Student contract already describes the form well
- you want labels, defaults, readonly behavior, and render metadata to come from schema-driven truth
- you want the shortest path to a working Student create/edit/view page

### Style B: manual form

Use this when:

- one Student field needs very custom UI behavior
- the page has unusual interaction or layout rules
- you want to wire one field directly through a field slot

### Style C: mixed form

Use this when:

- most Student fields can use preset or schema-driven rendering
- one or two Student fields need a custom renderer
- you need action rows, helper rows, or page-specific layout blocks

A practical rule is:

- start with **schema-driven** if the Student contract is already strong
- use **mixed** for most business forms
- drop to **manual** only where the UI really needs it

## Step 2: Start with the smallest useful Student form

The smallest useful Zova form is usually a mixed Student form with `ZForm`, a couple of fields, and one submit row.

```tsx
<ZForm data={this.studentFormData} onSubmitData={data => this.submitStudent(data)}>
  <ZFormFieldPreset
    name="name"
    layout={{ label: 'Student Name:' }}
  ></ZFormFieldPreset>

  <ZFormFieldPreset
    name="level"
    render="basic-select:formFieldSelect"
    options={{ items: this.levelItems }}
    layout={{ label: 'Level:' }}
  ></ZFormFieldPreset>

  <ZFormFieldBlank
    slotDefault={$$form => {
      return (
        <button disabled={$$form.formState.isSubmitting} type="submit" class="btn btn-primary">
          Save Student
        </button>
      );
    }}
  ></ZFormFieldBlank>
</ZForm>
```

What this gives you immediately:

- form state ownership through `ZForm`
- standard Student fields through `ZFormFieldPreset`
- submit state through `$$form.formState.isSubmitting`
- a Zova-native Student form flow without hand-building local state wiring

## Step 3: Understand the field components

The three field entries are intentionally different.

### `ZFormFieldPreset`

Use `ZFormFieldPreset` when you want the standard form pipeline with a reusable preset renderer.

Typical Student cases:

- `name` as a standard input
- `level` as a select field
- `mobile` as a standard input or masked input
- any provider-defined standard Student field component

Representative Student field:

```tsx
<ZFormFieldPreset
  name="level"
  render="basic-select:formFieldSelect"
  options={{
    items: this.levelItems,
    placeholder: 'Choose a level',
  }}
  layout={{ label: 'Level:' }}
></ZFormFieldPreset>
```

### `ZFormField`

Use `ZFormField` when you want direct render control.

Representative Student field:

```tsx
<ZFormField
  name="mobile"
  slotDefault={({ propsBucket, props }, $$formField) => {
    return (
      <input
        {...props}
        class="input"
        value={propsBucket.value}
        placeholder="Student mobile"
        onInput={(e: Event) => {
          $$formField.setValue((e.target as HTMLInputElement).value);
        }}
        onBlur={() => {
          $$formField.handleBlur();
        }}
      ></input>
    );
  }}
></ZFormField>
```

Use this when you need to:

- render one Student field manually
- integrate a custom Student UI component
- intercept input and blur behavior yourself
- mix Zova form state with a custom render contract

### `ZFormFieldBlank`

Use `ZFormFieldBlank` when the row is **not** a real data field.

Typical Student cases:

- save/cancel buttons
- helper text under the Student fields
- page-specific action rows
- custom layout blocks between field groups

Representative shape:

```tsx
<ZFormFieldBlank
  slotDefault={$$form => {
    return (
      <div class="flex gap-2">
        <button disabled={$$form.formState.isSubmitting} type="submit" class="btn btn-primary">
          Save Student
        </button>
        <button type="button" class="btn btn-default" onClick={() => this.cancelEdit()}>
          Cancel
        </button>
      </div>
    );
  }}
></ZFormFieldBlank>
```

A simple memory aid is:

- `ZFormFieldPreset` = convention-first Student field
- `ZFormField` = custom Student field render
- `ZFormFieldBlank` = free row inside the Student form

## Step 4: Add submit behavior

The most common submit hook is `onSubmitData`.

```tsx
<ZForm
  data={this.studentFormData}
  onSubmitData={data => {
    return this.submitStudent(data);
  }}
></ZForm>
```

`onSubmitData` receives submission data plus form API context.

In practice, that means you can:

- read `data.value` as the submitted Student form data
- use `data.formApi` when you need lower-level form access
- pass typed submit metadata if your workflow uses it

### Show loading state

A common pattern is to read loading state from `formState`.

```tsx
slotFooter={$$form => {
  return (
    <div>
      {$$form.formState.isSubmitting && (
        <span class="loading loading-spinner text-primary"></span>
      )}
      <button class="btn btn-primary">Save Student</button>
    </div>
  );
}}
```

### Show errors

Use `onShowError` when you want a centralized user-facing error handler.

```tsx
<ZForm
  onShowError={({ error }) => {
    window.alert(error.message)
  }}
></ZForm>
```

That is useful when the default Student field-level error state is not enough and the page also wants a broader error message.

## Step 5: Move to schema-driven Student rendering when possible

When `ZForm` receives a `schema` and you do **not** provide a default body slot for the form, Zova can render fields automatically from the schema properties.

```tsx
<ZForm
  data={this.studentFormData}
  schema={this.studentFormSchema}
  formMeta={this.studentFormMeta}
  onSubmitData={data => this.submitStudent(data)}
></ZForm>
```

This is usually the best next step after a manual Student prototype because it lets the backend Student contract drive more of the UI.

Schema-driven rendering is a strong fit when:

- the Student schema already carries field metadata
- frontend and backend should stay close to the same Student contract truth
- you want to reduce duplicated Student field configuration

Read together with [API Schema Guide](/frontend/api-schema-guide).

## Step 6: Add validation

Zova Form is built on top of TanStack Form and integrates naturally with Zod.

### Use schema-driven validation as the default

When the Student form has a Zod schema, field validation can often be derived from the field schema directly.

That is the best default when:

- the backend Student contract already defines the validation truth
- the frontend should stay close to the same validation semantics

### Add field-level validation when needed

You can also provide validators directly on a field.

```tsx
<ZFormFieldPreset
  name="name"
  validators={{ onDynamic: z.string().min(3) }}
></ZFormFieldPreset>
```

Or, for a custom Student field:

```tsx
<ZFormField
  name="mobile"
  validators={{ onBlur: z.string().min(6) }}
></ZFormField>
```

The common validator hooks are:

- `onDynamic`
- `onBlur`
- `onChange`

A practical rule is:

- use schema-derived validation for the default Student contract-driven case
- add field-level validators when one Student field needs an explicit frontend rule

### Handle invalid submit

Useful form-level hooks include:

- `onSubmitInvalid`
- `onShowError`

Zova Form also normalizes server validation failures back into the form pipeline. In practice, backend validation responses such as Student field-oriented 422 errors can flow back into form and field error state instead of being treated as unrelated generic exceptions.

## Step 7: Choose the form scene with `formMeta`

`formMeta` is the main scene-level mode input for the form.

```tsx
this.studentFormMeta = {
  formMode: 'edit',
  editMode: 'update',
}
```

A practical way to read it is:

- `formMode: 'view'` -> Student view form
- `formMode: 'edit'` + `editMode: 'create'` -> Student create form
- `formMode: 'edit'` + `editMode: 'update'` -> Student edit form

This matters because the form pipeline can derive behavior such as readonly field state from the form scene.

If the Student form is in view mode, field rendering can become readonly automatically without every field re-implementing that rule manually.

## Step 8: Customize layout with `layout`, `options`, and `formProvider`

A Zova form is not driven by one source only.

In practice, Student field rendering can be influenced by:

- schema metadata
- field props
- form-level layout defaults
- provider defaults
- field-specific options

### Use `layout` for label and wrapper concerns

```tsx
<ZFormFieldPreset
  name="level"
  layout={{ label: 'Student Level:' }}
></ZFormFieldPreset>
```

Use `layout` for concerns such as:

- label text
- icon prefix/suffix
- field wrapper presentation
- row-level layout intent

### Use `options` for renderer-specific input props

```tsx
<ZFormFieldPreset
  name="level"
  render="basic-select:formFieldSelect"
  options={{
    items: this.levelItems,
    placeholder: 'Choose a level',
  }}
></ZFormFieldPreset>
```

Use `options` when the concrete Student field renderer needs its own input options.

### Use `formProvider` for page-level behavior and render decisions

`formProvider` is the main provider-level customization surface.

```tsx
<ZForm
  formProvider={{ behaviors: { FormFieldLayout: 'demo-student:formFieldLayoutStudent' } }}
>
```

This is useful for:

- provider-defined Student field components
- provider-defined layout behavior
- page-level Student form customization without rewriting every field

Read together with [Behavior Guide](/frontend/behavior-guide).

## Step 9: Decide whether the root should be a real `<form>`

By default, `ZForm` uses `formTag="form"`.

That means:

- the root element is a native `<form>`
- normal submit behavior is available
- Zova wires the submit event into the form controller

If you need the Student form pipeline but do **not** want a native `<form>` root, switch the wrapper tag.

```tsx
<ZForm
  formTag="div"
  data={this.studentFormData}
  schema={this.studentFormSchema}
  onSubmitData={data => this.submitStudent(data)}
></ZForm>
```

Use this when the Student form is embedded inside a larger block system or another page-level orchestration layer.

## Step 10: Use `controllerRef` when the page needs the form instance

Like other Zova components, the preferred instance reference is the **controller instance**, not a generic DOM ref.

```tsx
<ZForm
  controllerRef={ref => {
    this.studentFormRef = ref;
  }}
></ZForm>
```

This is useful when you need to:

- submit the Student form programmatically
- inspect `formState`
- integrate the Student form into a larger page-entry or action system

Example:

```tsx
<button
  onClick={async () => {
    await this.studentFormRef.submit();
  }}
>
  Save Student
</button>
```

## Step 11: Know when to use the advanced base classes

The module also exposes controller base classes for cases where the controller itself should participate more directly in form ownership.

The main exported bases are:

- `BeanControllerFormBase`
- `BeanControllerPageFormBase`

Use these when:

- a reusable Student-related component controller wants typed form access
- a Student page controller wants form-specific helpers while staying in the normal Zova page-controller model
- you want to keep Student page logic and form lifecycle close together

This is an advanced surface. For most page and component authoring, start with `ZForm` and the field components first.

## Step 12: Study one complete CRUD form pattern with the Student resource

When you move from a demo form to a real business page, the best source specimen in this repository is the **Student** teaching thread used across the fullstack tutorials.

That Student thread is useful because it grows from:

- generated CRUD structure
- schema-driven create/edit/view forms
- metadata-driven field rendering
- custom field rendering when the business UI needs it

Use the Student resource when you want a concrete mental model for how `ZForm` fits into Cabloy’s larger contract loop.

### The practical Student CRUD story

A standard Student entry form usually follows this business path:

1. the backend Student resource defines the contract truth
2. the frontend resource model loads schema and provider metadata for Student
3. the page decides whether the Student form is `create`, `edit`, or `view`
4. `ZForm` renders from Student form schema and Student form data
5. submit delegates back to the Student mutation owned by the model

So the page is **not** the place that should invent schema lookup rules or mutation policy.

### Controller-side shape for a Student entry page

A representative Student-oriented controller shape looks like this:

```ts
protected async __init__() {
  this.$$modelResource = await this.bean._getBeanSelector(
    'rest-resource.model.resource',
    true,
    'demo-student:student',
  );

  this.studentFormMeta = this.$computed(() => {
    const formScene = this.entryId ? 'edit' : 'create';
    return { ...formMetaFromFormScene(formScene), formScene };
  });

  this.studentFormProvider = this.$computed(() => {
    return this.$$modelResource.formProvider;
  });

  this.studentFormSchema = this.$computed(() => {
    return this.$$modelResource.getFormSchema(this.studentFormMeta);
  });

  this.studentFormData = this.$computed(() => {
    return this.$$modelResource.getFormData(this.studentFormMeta, this.entryId);
  });
}

async submitStudent(data: TypeFormOnSubmitData<StudentFormData>) {
  const mutationSubmit = this.$$modelResource.getFormMutationSubmit(this.studentFormMeta, this.entryId);
  await mutationSubmit?.mutateAsync(data.value);
}
```

Read that example as four ownership boundaries:

- `demo-student:student` identifies the business resource
- `ModelResource` owns resource-level Student form schema/data/provider lookup
- `studentFormMeta` decides whether the Student page is create/edit/view
- `submitStudent` delegates to the Student mutation policy instead of inventing a page-local submit rule

### Render-side shape for a Student entry page

Once the Student model side is prepared, the render side can stay thin:

```tsx
<ZForm
  formTag="div"
  data={this.studentFormData}
  schema={this.studentFormSchema}
  formMeta={this.studentFormMeta}
  formProvider={this.studentFormProvider}
  onSubmitData={data => this.submitStudent(data)}
  onShowError={({ error }) => {
    window.alert(error.message)
  }}
></ZForm>
```

This is the important design lesson:

- the Student page renders the form
- the Student model owns form resource semantics
- the backend Student contract still remains the source of truth for schema-driven behavior

### How the Student example evolves over time

The Student tutorials show a useful growth path:

1. start with generated CRUD
2. let schema drive the Student create/edit/view surfaces
3. reuse built-in field renderers for fields like `level`
4. only add custom Student field renderers when the business UI really needs them

That is the same growth strategy you should usually follow in your own modules.

### Why this is the recommended CRUD architecture

This Student pattern is recommended because:

- the page does **not** own schema lookup rules
- the page does **not** invent its own submit mutation policy
- `ModelResource` owns resource-level form metadata and mutation selection
- `ZForm` stays focused on rendering, validation, and submission flow
- Student-specific UI can deepen later without breaking the contract-first structure

This is also why Cabloy can provide complete CRUD-style form pages with a strong schema-driven surface instead of requiring every page to hand-build form wiring from scratch.

Read together with:

- [Tutorial 2: Create Your First CRUD](/fullstack/tutorial-2-first-crud)
- [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing)
- [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)

## Quick comparison: schema-driven vs manual vs mixed

Use this table when you are unsure which style to choose.

| Style | Best fit | Strengths | Trade-offs |
| --- | --- | --- | --- |
| Schema-driven | resource CRUD pages, contract-first forms, metadata-rich pages | least duplication, easiest to keep aligned with backend truth, fastest way to scale many forms | less suitable when one page has unusual UI structure |
| Manual | highly custom UI, one-off interaction-heavy forms | maximum render control | easiest way to drift away from contract truth and duplicate field wiring |
| Mixed | most business pages | keeps standard fields cheap while leaving room for custom rows or custom renderers | requires discipline about which layer should own each customization |

A practical recommendation is:

- use **schema-driven** for standard Student-style resource create/edit/view pages
- use **mixed** for most real business forms
- use **manual** only when the page truly needs renderer-level control

## Relationship map 1: business ownership from resource to form

Use this diagram when the question is:

- who owns the business scene?
- where do schema and data come from?
- how does a resource page reach `ZForm`?

```text
Backend resource contract (example: Student)
  ├─ field definitions
  ├─ validation truth
  └─ frontend render metadata
             │
             ▼
ModelResource / page controller
  ├─ provides formMeta
  ├─ provides formSchema
  ├─ provides formData
  └─ provides formProvider
             │
             ▼
           ZForm
  ├─ owns form controller
  ├─ owns form state / submit / reset
  ├─ resolves schema properties
  └─ creates field render context
```

Read this top-down:

- the **backend resource** still defines the business contract
- the **resource model/page** translates that contract into page-ready form inputs
- `ZForm` owns the frontend form runtime

This is the diagram to use when you are debugging a CRUD form page at the business or architecture level.

## Relationship map 2: field rendering pipeline inside `ZForm`

Use this diagram when the question is:

- why did this field render that way?
- where did the final component choice come from?
- should I change schema metadata, field props, provider config, or behaviors?

```text
ZForm
  └─ field render context
        │
        ├───────────────┬───────────────────┐
        ▼               ▼                   ▼
 ZFormFieldPreset   ZFormField         ZFormFieldBlank
        │               │                   │
        │               │                   └─ free row for buttons / helper content
        │               │
        │               └─ manual slot render
        │                  + setValue / handleBlur
        │
        └─ preset-driven standard field

Field rendering pipeline
  schema/rest + field props + layout + provider config
                        │
                        ▼
                 formProvider.components
                        │
                        ▼
                    behaviors
                        │
                        ▼
                  final rendered field
```

Read this top-down too:

- field components choose how much rendering is automatic vs custom
- schema metadata and field props shape the initial field contract
- `formProvider.components` decides the concrete renderer surface
- behaviors wrap or refine the final UI without changing the higher-level form contract

This is the diagram to use when you are debugging one field instead of the whole resource page.

## Recommended learning path

If you are new to Zova Form, use this order:

1. build one small mixed Student form with `ZForm`, `ZFormFieldPreset`, and `ZFormFieldBlank`
2. add `onSubmitData` and loading/error handling
3. move one Student page to schema-driven rendering
4. add field-level or schema-level validation
5. introduce `formMeta` for Student `view`, `create`, and `edit`
6. introduce `formProvider` only when page-level layout or render behavior needs customization
7. study one Student resource CRUD form and trace how `ModelResource` feeds `ZForm`
8. continue with [Zova Form Under the Hood](/frontend/zova-form-under-the-hood) when you want the runtime explanation behind the public authoring surface
9. continue with [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map) when you need framework-level source details and targeted file-order guidance

That path usually gives the fastest route from first usage to a maintainable business form.

## Common mistakes to avoid

### Mistake 1: starting with manual fields for everything

If the backend Student schema already carries the form truth, start schema-driven or mixed instead of manually wiring every field.

### Mistake 2: treating `ZFormFieldBlank` like a normal field

Use it for action rows and free layout content, not for real data ownership.

### Mistake 3: putting layout policy into every field manually

If the concern is page-wide or provider-wide, prefer `formProvider` and behavior-based customization.

### Mistake 4: forgetting `formMeta`

If the Student page has clear `view`, `create`, or `edit` semantics, encode that through `formMeta` so readonly and edit behavior stay consistent.

### Mistake 5: reaching for advanced base classes too early

Most Student form pages should start with `ZForm` and field components. Use `BeanControllerFormBase` or `BeanControllerPageFormBase` only when the controller-level ownership is genuinely the clearer architecture.

## Edition note

This guide describes the shared Zova Form architecture.

That architecture applies across Cabloy Basic and Cabloy Start. However, visual styling, preset field components, and provider-level UI details can still differ once the task becomes UI-library-specific.

For Cabloy Basic, public examples in this repository currently align with DaisyUI + Tailwind CSS.

## Verification checklist

When documenting or changing Zova Form usage, verify in this order:

1. confirm whether the form should be schema-driven, manual, or mixed
2. confirm whether `formMeta` should be `view`, `create`, or `edit`
3. confirm whether validation truth should come from schema, field-level validators, or both
4. confirm whether layout customization belongs in field props or provider behaviors
5. build the docs site:

   ```bash
   npm run docs:build
   ```

6. verify the page is reachable from the frontend sidebar and the frontend introduction page
