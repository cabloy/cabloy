# Generated Contract Consumption: Entry Branch

This page is a focused specimen for one narrow frontend question:

> after generated contract material has already crossed into Zova, how is that contract consumed on the entry-page branch?

Use this page together with:

- [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)

## Why this page exists

The current docs already explain:

- how backend-authored contract truth reaches frontend generation
- how generated contract material is consumed in a broad sense
- how the deeper entry runtime works internally

What was still missing was one narrow page that isolates the **entry-page consumption branch** before the deeper form/page-entry runtime takes over.

This page fills that gap.

## The shortest accurate mental model

A practical entry-branch chain looks like this:

1. generated contract material already exists in frontend API/schema surfaces
2. the current resource model keeps `ModelResource` as the stable owner
3. the entry route shell consumes that owner through resource, `id`, and `formScene`
4. `basic-pageentry:blockPageEntry` becomes the deeper entry runtime owner
5. `blockForm` and `blockToolbarRow` consume that owner-owned context
6. deeper form and page-meta runtime docs take over from there

That means the entry branch is not only “render a form from schema.”

It is the path from generated contract access into resource-owner and entry-page shell consumption.

## Source-confirmed reading path

This page is the second layer of a small source-reading chain around same-resource model facades:

1. [Model Architecture](/frontend/model-architecture) for the broader role of Zova Model
2. this page for the consumer-side handoff into the owner
3. [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive) for the owner internals that make that handoff work

Use this order:

1. `zova/src/suite/a-training/modules/training-student/src/apiSchema/trainingStudent.ts`
2. `zova/src/suite/a-training/modules/training-student/src/model/student.ts`
3. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`
5. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`
6. `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`

That order starts from the generated schema access surface, moves into the thin module model facade, then into the resource entry shell and the deeper Basic entry runtime owner plus its concrete consumers.

## Generated contract surface on the entry branch

A practical current source anchor is:

- `zova/src/suite/a-training/modules/training-student/src/apiSchema/trainingStudent.ts`

Representative source facts:

- the module exposes a schema bean through `@ApiSchema()`
- entry-related schema access is available through methods such as `create()`, `view()`, and `update()`
- those methods call `this.$sdk.createApiSchemas(...)`

This is the first consumer-facing contract surface on the entry branch.

The entry-page branch does not start with local form-only logic.
It starts with generated schema access that has already been turned into frontend-usable contract material.

## Thin model facade and owner-level form helpers

A practical current model specimen is:

- `zova/src/suite/a-training/modules/training-student/src/model/student.ts`

Representative source facts:

- the module model keeps `rest-resource.model.resource` as the stable owner
- `summary(id)` still goes through `queryItem(...)` rather than bypassing the owner
- `deleteForce(id)` still goes through `mutationItem(...)` rather than introducing a separate mutation surface
- custom endpoints still delegate to owner-level helpers rather than replacing the resource-owner story

This is the thin-facade boundary:

- the model does not become a second resource owner
- same-resource custom actions are exposed as small named model methods
- entry and form consumers can continue to depend on owner-level surfaces without splitting the resource story

A practical rule is:

> when entry-page behavior still belongs to the same resource, keep the resource owner stable and let form helpers stay owner-driven.

This matters because entry pages usually depend on owner-level surfaces such as:

- `formMeta`
- `formSchema`
- `formProvider`
- `formData`
- submit helpers

If you want the broader model-layer explanation behind this narrow facade pattern, continue with [Model Architecture](/frontend/model-architecture).
If you want the deeper owner internals behind `queryItem(...)`, `mutationItem(...)`, and form-derived helpers, continue with [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive).

## Entry shell consumption

The clearest current entry shell is:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`

Representative source facts:

- the page resolves `$$modelResource` from the route resource
- it derives `formMeta` from `formScene`
- it ensures `this.$$modelResource.getFormApiSchemas(this.formMeta)?.sdk` is loaded
- it derives `formSchema` from `this.$$modelResource.getFormSchema(this.formMeta)`

This is the entry-shell boundary:

- generated contract material has already crossed into the owner
- the shell uses the owner to derive scene-aware form schema state
- schema-defined blocks then take over the deeper runtime

## Handoff into `basic-pageentry:blockPageEntry`

The next concrete consumer is:

- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockPageEntry/controller.tsx`

Representative source facts:

- it resolves the selector-backed owner
- it computes `formMeta`, `formProvider`, `formSchema`, and `formData`
- it uses owner-level helpers such as `getFormData(...)` and `getFormMutationSubmit(...)`
- it pushes `pageTitle`, `pageDirty`, and `formMeta` into page meta

This means the deeper entry runtime still depends on the same generated-contract and resource-owner surfaces.

## `blockForm` and `blockToolbarRow` as concrete consumers

Two especially clear consumer files are:

- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockForm/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-pageentry/src/component/blockToolbarRow/controller.tsx`

Representative source facts from `blockForm`:

- it passes owner-derived `formData`, `formSchema`, `schemaScene`, `formMeta`, and `formProvider` into `ZForm`
- `onChanged` feeds updated data back into page meta through `$$pageEntry.setPageMeta(...)`

Representative source facts from `blockToolbarRow`:

- it consumes the same `$$pageEntry` context
- it filters actions by current `formScene`
- it combines `formScene` and permission checks before rendering the toolbar actions

A practical reading takeaway is:

- generated contract material becomes owner-level form surfaces first
- the entry runtime then turns those surfaces into actual form and toolbar behavior

## What this page does not re-explain

This page does **not** fully re-explain:

- how to configure or generate OpenAPI SDK output -> see [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- the broader generated-contract hub -> see [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)
- the lower runtime of `$sdk` -> see [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood)
- `ModelResource` internals -> see [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- the deeper entry runtime and form/page-meta chain -> see [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive) and [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide)
- the broader `rest-resource` runtime bridge -> see [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)

Its job is only to show the entry-side contract-consumption handoff before deeper runtime internals take over.

## Where to read next

- If you want the shared consumer-side overview first, return to [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen).
- If you want a proof-oriented layer-by-layer validation workflow, continue with [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook).
- If the result is already wrong and you want symptom-first diagnosis, continue with [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist).
- If you want the deeper entry runtime internals, continue with [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive).
- If you want the broader resource/runtime shell map, continue with [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood).
- If you want the form-scene to page-meta runtime chain, continue with [Form Scene to Page Meta Guide](/frontend/form-scene-to-page-meta-guide).
- If you want resource-owner internals, continue with [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive).

## Final takeaway

The cleanest way to read generated contract consumption on the entry branch is:

- generated schema/API surface
- stable resource owner
- entry route shell
- deeper `basic-pageentry` runtime owner
- form and toolbar consumers
- deeper runtime internals only if you still need them

That keeps the entry-branch consumption path visible before you descend into the heavier form/runtime details.
