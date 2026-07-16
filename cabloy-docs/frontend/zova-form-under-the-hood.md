# Zova Form Under the Hood

This guide explains the source-level runtime path behind Zova Form.

Use this page together with:

- [Form Guide](/frontend/form-guide)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)
- [Zova Reactivity Under the Hood](/frontend/zova-reactivity-under-the-hood)
- [Behavior Guide](/frontend/behavior-guide)
- [API Schema Guide](/frontend/api-schema-guide)

Use this page after [Form Guide](/frontend/form-guide) when you want to move from the public authoring surface to the internal cooperation among form controllers, field controllers, schema metadata, provider config, behaviors, and CRUD integration.

If your next question is not “how does this runtime work?” but “which files should I read next?”, continue with [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map).

If your next question is specifically how `formScene` flows into `formMeta`, then `pageMeta`, and finally shell/tab state, continue with [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide).

If your next question is how backend/entity schema metadata attaches live field-side behavior through `ZovaRender.onEffect(...)`, `ZovaEvent`, and command chains, continue with [Schema-Driven Field Effects Guide](/frontend/schema-driven-field-effects-guide).

> [!TIP]
> **Zova Form docs path**
>
> 1. **[Form Guide](/frontend/form-guide)** — learn the public authoring surface
> 2. **[Zova Form Under the Hood](/frontend/zova-form-under-the-hood)** — learn how the runtime pieces cooperate
> 3. **[Zova Form Source Reading Map](/frontend/zova-form-source-reading-map)** — learn which files to read next
>
> **You are here:** step 2.
> **Previous page:** [Form Guide](/frontend/form-guide).
> **Next recommended page:** [Zova Form Source Reading Map](/frontend/zova-form-source-reading-map).

## Why this page exists

The public form guide already explains the authoring surface:

- `ZForm`
- `ZFormFieldPreset`
- `ZFormField`
- `ZFormFieldBlank`
- `formMeta`
- `formProvider`

The source-reading map already explains where to look when you need a targeted code path.

What many contributors and AI workflows still want next is the implementation bridge:

- where the TanStack form instance is created
- where one field becomes a TanStack field binding
- how schema metadata becomes field props
- how layout, provider config, and behaviors merge into final rendering
- how validation and server errors flow back into the form state
- how CRUD pages feed resource-driven schema and data into `ZForm`

This page is that bridge.

## The shortest accurate runtime model

For a typical Zova form, the shortest accurate model is:

1. the `ZForm` wrapper creates a form controller bean through the normal Zova controller path
2. the form controller creates a TanStack form instance through Zova’s `$useForm(...)` wrapper
3. the form controller computes provider config, schema, Zod schema, and rendered properties
4. if the form body is not manually overridden, the form render bean turns schema properties into field children
5. each field controller creates its own TanStack field binding with `useField(...)`
6. field props merge from schema metadata, field props, layout options, provider config, and readonly rules
7. provider behaviors wrap the field render path before the final renderer is invoked
8. submit and validation flow through TanStack and Zod, then Zova normalizes invalid-submit and 422 server errors back into form state
9. resource-driven CRUD pages feed `formMeta`, `formSchema`, `formData`, and `formProvider` into the same runtime

That is why Zova Form is not only a thin wrapper around TanStack Form. The business-facing runtime surface is still Zova-native.

## A concrete source specimen

A small public example that shows several form patterns clearly is:

```text
zova/src/suite/a-demo/modules/demo-basic/src/page/toolOne/render.tsx
```

That specimen is useful because it shows both:

- schema-driven rendering
- manual field rendering through `ZFormField`

A more business-facing specimen is:

```text
zova/src/suite/a-home/modules/home-login/src/page/login/render.tsx
```

That page shows:

- preset-based field rendering
- a provider-level layout behavior override
- a blank row used for action controls

If you want a business-facing specimen where backend entity metadata attaches live field-side behavior through `ZovaRender.onEffect(...)`, `ZovaEvent`, and command chains, continue with [Schema-Driven Field Effects Guide](/frontend/schema-driven-field-effects-guide).

The rest of this page explains how those public authoring shapes become real runtime behavior.

## The core source-reading path

When you want to trace the full mechanism, read these files in order:

1. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx`
2. `zova/src/suite-vendor/a-zova/modules/a-form/src/lib/beanControllerFormBase.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/render.tsx`
4. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx`
5. `zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/render.tsx`
6. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts`
7. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`

A compact role map is:

- `form/controller.tsx` owns form runtime creation, schema state, submit flow, and error normalization
- `beanControllerFormBase.ts` shows the Zova wrapper around TanStack `useForm(...)`
- `form/render.tsx` shows automatic schema-driven field iteration and form-level submit wiring
- `formField/controller.tsx` owns field runtime creation, props merge, validation setup, and behavior selection
- `formField/render.tsx` shows the final behavior-wrapped render handoff
- `schema.ts` shows schema-property loading and Zod conversion
- `blockPageEntry/controller.tsx` shows how a resource-driven CRUD page feeds schema and data into `ZForm`

## Step-by-step runtime path

### 1. `ZForm` creates the form controller bean

The public wrapper enters the normal Zova controller path through the generated metadata wrapper:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/.metadata/component/form.ts
```

That wrapper calls `useController(...)`, which means the form runtime begins as a controller bean, not as a page-local ad hoc object.

A practical reading takeaway is:

- **the visible wrapper component is thin**
- **the controller bean is the real runtime owner**

## 2. The form controller creates the TanStack form bridge

The main runtime owner is:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx
```

Inside `ControllerForm.__init__()` the controller:

- registers itself as `$$form`
- creates the form instance with `_createForm()`
- creates `formState` with `useStore(this.form.store, ...)`
- computes `formProvider`
- computes `schema`
- computes `zodSchema`
- computes rendered `properties`
- creates the field CEL environment
- creates `zovaJsx`
- watches incoming `data` and resets the form when it changes

This is one of the most important source-level facts about Zova Form.

The form controller is not only coordinating submit. It is the central bridge among:

- TanStack form state
- schema-driven field metadata
- provider-driven renderer lookup
- Zova field render context

## 3. Why `$useForm(...)` exists

The shared wrapper lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/lib/beanControllerFormBase.ts
```

and the page-controller variant lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/lib/beanControllerPageFormBase.ts
```

The important runtime detail is that `$useForm(...)` wraps TanStack `useForm(...)` like this:

- run it inside `ctx.util.instanceScope(...)`
- then `markRaw(...)` the returned TanStack object

That matters because:

- Zova wants the controller bean to stay the business-facing reactive host
- the underlying TanStack object still needs to be created in the right Zova instance scope
- the raw TanStack API should not itself become the main reactive authoring object

A practical reading takeaway is:

- **Zova does not replace TanStack Form**
- **Zova relocates the business-facing ownership into controller beans**

## 4. How schema becomes rendered fields

The form controller computes two related surfaces:

- `zodSchema`
- `properties`

The relevant source files are:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx
zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts
```

The important runtime path is:

1. the form receives `schema`
2. `_getZodSchema()` either reuses `props.zodSchema` or converts the schema with `schemaToZodSchema(...)`
3. `loadSchemaProperties(...)` resolves fields for the current schema scene
4. each property carries field-level metadata such as render, order, and scene-specific `rest` overrides

`loadSchemaProperties(...)` is especially important because it does more than list object keys.

It also:

- resolves `$ref`
- applies scene-specific metadata overlays such as `form`, `form-view`, `form-create`, and `filter`
- sorts fields by `rest.order`

A practical reading takeaway is:

- **schema is not only validation truth**
- **schema also drives ordering, render metadata, and scene-specific field behavior**

## 5. The form controller creates the field render context

Still inside `form/controller.tsx`, the form controller prepares the field runtime support used later by every field:

- `getFieldValue(...)`
- `setFieldValue(...)`
- `getFieldProperty(...)`
- `getFieldZodSchema(...)`
- `getFieldScope(...)`
- `getFieldJsxRenderContext(...)`
- `getFieldComponentPropsTop(...)`

These methods matter because they separate responsibilities clearly:

- the form controller owns cross-field knowledge
- the field controller owns one field’s runtime binding

This is why a field can ask the parent form for:

- its current value
- its schema property metadata
- its field-level Zod schema
- the JSX/CEL scope used for rendering expressions

## 6. One field becomes a TanStack field binding

The field runtime owner is:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx
```

Inside `ControllerFormField.__init__()` the field controller:

- verifies it is inside a form
- registers itself as `$$formField`
- creates the field with `_createField()`
- computes `propsBucket`
- watches schema-property changes and updates the TanStack field options
- initializes the behavior holder

The key bridge is `_createField()`:

- call `useField(options as any)`
- `markRaw(...)` the field object
- create reactive `fieldState` with `useStore(field.api.store, ...)`

This is the field-level equivalent of the form controller’s TanStack bridge.

A practical reading takeaway is:

- **the form owns the cross-field runtime**
- **each field controller owns one field’s TanStack binding and render context**

## 7. How one field is configured

The field controller builds its runtime configuration mainly through:

- `_getPropsBucket()`
- `_getFormFieldOptions()`
- `_getFormFieldOptionsValidators()`

### `_getPropsBucket()`

This is one of the most important methods in the entire module.

Its job is to merge the final field-facing props from several sources:

1. default field render assumptions
2. local field props
3. top-level schema-derived props from the parent form
4. computed layout options
5. computed renderer options
6. readonly normalization
7. final render-provider resolution

That means the final field render is not decided by one layer only.

It is the result of several layers cooperating.

### `_getFormFieldOptions()`

This method builds the TanStack field options by combining:

- current form value
- default value from system options or schema property defaults
- form reference
- validators

### `_getFormFieldOptionsValidators()`

This method chooses the validation surface for `onDynamic`, `onBlur`, and `onChange`.

Its important behavior is:

- if a validator flag is `true`, use the field’s Zod schema
- if a validator is an explicit Zod validator, use that
- if no field-specific validator is given, default dynamic validation can still be enabled

A practical reading takeaway is:

- **field validation is not hard-coded in one place**
- **it is derived from either explicit field options or the field’s schema-driven Zod contract**

## 8. The prop/provider/behavior merge pipeline

The most useful durable mental model for field rendering is:

```text
schema/rest + field props + layout + provider config -> behavior wrapping -> final renderer
```

The relevant sources are:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/controller.tsx
zova/src/suite/cabloy-basic/modules/basic-adapter/src/config/config.ts
zova/src/suite/cabloy-basic/modules/basic-form/src/bean/behavior.formField.ts
zova/src/suite/cabloy-basic/modules/basic-form/src/bean/behavior.formFieldLayout.tsx
```

### Provider defaults

In Cabloy Basic, the default provider config maps:

- `FormField` -> `basic-form:formField`
- `FormFieldLayout` -> `basic-form:formFieldLayout`
- `Input` -> `basic-input:formFieldInput`

That means the field runtime is provider-driven even before a page overrides anything.

### Behavior merge

`_getFieldBehaviors()` merges:

- explicit field `behaviors`
- provider-level `FormField`
- provider-level `FormFieldLayout`

Then `RenderFormField.render()` passes rendering through:

- `$$beanBehaviorsHolder.render(...)`

In the Basic defaults:

- `BehaviorFormField` is a pass-through behavior
- `BehaviorFormFieldLayout` decides inline vs block layout and renders validation errors in the wrapper

A practical reading takeaway is:

- **field rendering is provider-driven and behavior-wrapped**
- **`a-form` does not hard-code one final Basic UI layout by itself**

## 9. Render flow for form and field

The form render bean lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/render.tsx
```

The field render bean lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/component/formField/render.tsx
```

### Form render path

`RenderForm` does three important jobs:

- iterate schema properties when the form body is not manually overridden
- create structural slots like header/body/footer/wrapper
- wire native form submit to `submit()` unless `onFormSubmit` is supplied

That means automatic schema-driven rendering is not happening magically in the wrapper component. It is happening in the render bean.

### Structural Form Layout boundary

When `ZForm` receives a nonempty block list, the render bean delegates body rendering to those blocks instead of iterating schema fields directly. For Cabloy Basic structural forms, `basic-form:blockFormLayout` resolves `formLayout` against the form's current schema properties and calls `$$form.renderField(...)` for each surviving layout field.

This keeps ownership separate:

- the form controller owns schema properties, field state, validation, and field rendering
- the shared form-layout resolver normalizes field placement metadata
- the Basic layout block renders sections, groups, grids, and tabs
- field-layout behaviors still own each field wrapper and its visible validation message

Read [Form Layout Guide](/frontend/form-layout-guide) for the DTO authoring grammar, resolver behavior, and Basic-specific responsive/tab behavior.

### Field render path

`RenderFormField` does two important jobs:

- pass the field render context through the behavior pipeline
- if no custom slot is given, call `$$form.zovaJsx.render(...)`

That means the final renderer is reached only after:

- field controller preparation
- props merge
- behavior wrapping

## 10. Validation and server error round-trip

The main submit and error path lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/component/form/controller.tsx
```

The short version is:

- `submit()` delegates to `this.form.handleSubmit(...)`
- `_createForm()` wires `onSubmitInvalid` and `onSubmit`
- `onSubmit` calls user `onSubmitData`
- if the backend returns a 422 validation error, Zova normalizes it back into TanStack field/form error state
- other errors can flow to `onShowError`

### Why 422 handling matters

Without this step, server validation would stay outside the form runtime and feel disconnected from field state.

Instead, `_handleError422(...)` parses the server payload and pushes normalized errors back into TanStack’s error maps.

That is one of the strongest reasons the module feels like a real form runtime rather than only a submit helper.

A practical reading takeaway is:

- **Zova does not treat server validation as an unrelated external concern**
- **it feeds server validation back into the same field/form state model**

## 11. CRUD and filter integration path

Zova Form is also used as part of Cabloy Basic’s resource-driven page runtime.

The strongest source specimens are:

```text
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx
zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx
zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockFilter/controller.tsx
zova/src/suite-vendor/a-zova/modules/a-form/src/lib/utils.ts
```

### Resource entry page path

`blockPageEntry` computes:

- `formMeta`
- `formProvider`
- `formSchema`
- `formData`

from the resource model.

Then `blockForm` passes those into `ZForm`.

So in resource CRUD pages, `ZForm` is not expected to discover business data by itself. The page/resource layer prepares the form inputs first.

### Filter-form path

`blockFilter` shows the lighter filter branch:

- `formMeta = { formMode: 'edit' }`
- `schemaScene="filter"`
- inline field layout
- reset and submit reuse the same form runtime

This is a useful reminder that the same form module supports more than create/edit/view pages.

## 12. Type contracts worth knowing

If you want the compact type surface, do not skip these files:

```text
zova/src/suite-vendor/a-zova/modules/a-form/src/types/form.ts
zova/src/suite-vendor/a-zova/modules/a-form/src/types/formField.ts
```

The most useful contracts to notice are:

- `TypeForm`
- `TypeFormField`
- `TypeFormOnSubmitData`
- `TypeFormOnSubmitInvalid`
- `TypeFormOnShowError`
- `IFormFieldRenderContext`
- `IJsxRenderContextFormField`
- `constFieldProps`

These types show where the runtime contracts are formalized for:

- submit payloads
- field render context
- form events
- field-level slot signatures

## 13. Compact call-flow sketch

When in doubt, use this short call flow:

1. `ZForm` wrapper enters the normal Zova controller path
2. `ControllerForm.__init__()` creates the TanStack form bridge
3. form controller computes provider/schema/Zod/properties
4. `RenderForm` either auto-renders schema fields or uses custom slots
5. each `ControllerFormField` creates a TanStack `useField(...)` binding
6. field props merge from schema metadata, field props, layout, provider config, and readonly rules
7. `RenderFormField` sends the field through the behavior pipeline
8. final field rendering reaches `zovaJsx.render(...)` or a custom slot
9. submit flows through TanStack, then Zova normalizes invalid-submit and server-side validation back into form state
10. resource CRUD pages prepare `formMeta`, `formSchema`, `formData`, and `formProvider` before entering the same runtime

That is the shortest end-to-end explanation of how the module cooperates.

## Final takeaway

Zova Form is not just TanStack Form plus JSX wrappers.

It moves form ownership into:

- Zova controller beans
- schema metadata
- provider-driven renderer lookup
- behavior-based field wrapping
- resource-driven CRUD integration

TanStack Form and Zod are still important underlying engines, but the business-facing runtime model is Zova-native.

## Verification checklist

When documenting or changing this area, verify in this order:

1. confirm the runtime claims against the current `a-form` source
2. confirm the Basic provider defaults still match current `basic-adapter` and `basic-form` wiring
3. confirm CRUD integration claims still match `blockPageEntry`, `blockForm`, and `blockFilter`
4. build the docs site:

   ```bash
   npm run docs:build
   ```

5. verify the page is reachable from the frontend sidebar and related form docs
