# Generated Contract Consumption: List Branch

This page is a focused specimen for one narrow frontend question:

> after generated contract material has already crossed into Zova, how is that contract consumed on the list-page branch?

Use this page together with:

- [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map)
- [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)

## Why this page exists

The current docs already explain:

- how backend-authored contract truth reaches frontend generation
- how generated contract material is consumed in a broad sense
- how the deeper list runtime works internally

What was still missing was one narrow page that isolates the **list-page consumption branch** before the deeper list runtime takes over.

This page fills that gap.

## The shortest accurate mental model

A practical list-branch chain looks like this:

1. generated contract material already exists in frontend API/schema surfaces
2. the current resource model keeps `ModelResource` as the stable owner
3. the list route shell consumes that owner through resource context
4. `basic-page:blockPage` becomes the deeper list runtime owner
5. deeper table, filter, and pager runtime docs take over from there

That means the list branch is not only “call one API.”

It is the path from generated contract access into resource-owner and list-page shell consumption.

## Source-confirmed reading path

Use this order:

1. `zova/src/suite/a-training/modules/training-student/src/apiSchema/trainingStudent.ts`
2. `zova/src/suite/a-training/modules/training-student/src/model/student.ts`
3. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`
4. `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`

That order starts from the generated schema access surface, moves into the thin module model facade, then into the resource list shell and the deeper Basic list runtime owner.

## Generated contract surface on the list branch

A practical current source anchor is:

- `zova/src/suite/a-training/modules/training-student/src/apiSchema/trainingStudent.ts`

Representative source facts:

- the module exposes a schema bean through `@ApiSchema()`
- list-related schema access is available through methods such as `select()`
- those methods call `this.$sdk.createApiSchemas(...)`

This is the first consumer-facing contract surface on the list branch.

The list-page branch does not start with local page-only table logic.
It starts with generated schema access that has already been turned into frontend-usable contract material.

## Thin model facade and stable owner rule

A practical current model specimen is:

- `zova/src/suite/a-training/modules/training-student/src/model/student.ts`

Representative source facts:

- the module model resolves `rest-resource.model.resource` through selector-backed access
- custom methods such as `summary(id)` and `deleteForce(id)` still delegate to resource-owner helper surfaces

A practical rule is:

> when the API still belongs to the same resource, keep `ModelResource` as the stable owner and keep the module model thin.

That is the rule that prevents list-page consumption from scattering contract ownership into ad hoc page code.

## List shell consumption

The clearest current list shell is:

- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`

Representative source facts:

- the page resolves `$$modelResource` from the route resource
- `__init__()` autoloads `this.$$modelResource.apiSchemasSelect.sdk`
- render reads `schemaRow?.rest?.blocks`

This is the list-shell boundary:

- generated contract material has already crossed into the owner
- the shell uses the owner to load top-level list schema state
- schema-defined blocks then take over the deeper runtime

## Deeper handoff into `basic-page:blockPage`

The next concrete consumer is:

- `zova/src/suite/cabloy-basic/modules/basic-page/src/component/blockPage/controller.tsx`

Representative source facts:

- it resolves the selector-backed resource owner
- it loads `this.$$modelResource.apiSchemasSelect.sdk`
- it derives list data through `this.$$modelResource.select(this.query)`
- it exposes `schemaFilter`, `schemaRow`, and `permissions`

That means the deeper list runtime still depends on the same generated-contract and resource-owner surfaces.

A practical reading takeaway is:

- generated contract material becomes owner surfaces first
- `blockPage` then becomes the shared list runtime owner for filters, paging, query state, and list data

## What this page does not re-explain

This page does **not** fully re-explain:

- how to configure or generate OpenAPI SDK output -> see [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- the broader generated-contract hub -> see [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)
- the lower runtime of `$sdk` -> see [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood)
- `ModelResource` internals -> see [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- the deeper list runtime and page-block chain -> see [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- the broader `rest-resource` runtime bridge -> see [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)

Its job is only to show the list-side contract-consumption handoff before deeper runtime internals take over.

## Where to read next

- If you want the shared consumer-side overview first, return to [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen).
- If you want a proof-oriented layer-by-layer validation workflow, continue with [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook).
- If the result is already wrong and you want symptom-first diagnosis, continue with [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist).
- If you want the deeper list runtime internals, continue with [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive).
- If you want the broader resource/runtime shell map, continue with [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood) and [Rest Resource Source Reading Map](/frontend/rest-resource-source-reading-map).
- If you want resource-owner internals, continue with [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive).

## Final takeaway

The cleanest way to read generated contract consumption on the list branch is:

- generated schema/API surface
- stable resource owner
- list route shell
- deeper `basic-page` runtime owner

That keeps the list-branch consumption path visible before you descend into the heavier runtime details.
