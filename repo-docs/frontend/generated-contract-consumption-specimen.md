# Generated Contract Consumption Specimen

This page is a focused specimen for one narrow frontend question:

> after backend-authored OpenAPI/schema contract material has already been generated into Zova, what does real frontend consumption look like?

Use this page together with:

- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [Server Data](/frontend/server-data)
- [SDK Guide](/frontend/sdk-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood)
- [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)
- [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)

> [!TIP]
> **Generated-contract reading path**
>
> 1. **[Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)** — understand how backend-authored truth crosses the stack boundary
> 2. **[OpenAPI SDK Guide](/frontend/openapi-sdk-guide)** — configure and generate the frontend contract slice
> 3. **[Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)** — see how generated contract material is consumed in practice
>
> **You are here:** step 3.
> **Previous recommended pages:** [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) and [OpenAPI SDK Guide](/frontend/openapi-sdk-guide).

## Why this page exists

Several existing docs already explain parts of this story well:

- the fullstack bridge from backend OpenAPI to frontend generation
- frontend OpenAPI config and module ownership
- the conceptual roles of `$sdk`, `$apiSchema`, and server-data layers
- the internals of `a-openapi` and `ModelResource`

What was still missing was one narrow page that shows the practical consumer-side chain after generation.

This page fills that gap.

It is not another generation guide and not another internals page. It is a specimen page about consumption.

## Shortest accurate mental model

A practical generated-contract consumption path looks like this:

1. backend-authored contract truth has already been generated into frontend contract material
2. frontend accesses that material through generated API/schema surfaces such as `$api`, `$apiSchema`, and `$sdk`
3. when the API still belongs to one resource boundary, `ModelResource` remains the stable owner
4. list-page and entry-page shells consume that owner rather than recreating the contract ad hoc
5. deeper runtime details still belong to the existing under-the-hood pages

That means generated contract consumption is not one thing only.

It usually moves through:

- generated API/schema access
- owner-level resource consumption
- page-shell/runtime consumption

## Where generated contract material comes from

This page starts **after** the forward-chain bridge and generation steps.

Those earlier steps are owned by:

- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)

Once that handoff is complete, the frontend can consume generated contract material through several surfaces:

- generated API services
- generated API schema accessors
- `$sdk` schema/runtime helpers
- higher-level resource owners such as `ModelResource`

## Shared consumption chain

A practical shared reading path is:

1. `zova/src/suite/a-training/modules/training-student/src/apiSchema/trainingStudent.ts`
2. `zova/src/suite/a-training/modules/training-student/src/model/student.ts`
3. optional direct schema/api consumer specimen: `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`

That short path already shows the shared contract-consumption layers that both list and entry pages depend on:

- generated schema access
- thin semantic model follow-up when needed
- stable resource-owner consumption

## `$sdk`, `$apiSchema`, and generated-contract surfaces in one view

A practical split is:

- generated API services expose callable backend operations
- `$apiSchema` exposes schema-oriented access to those operations
- `$sdk` is the lower-level schema/runtime bridge beneath those higher-level consumers

A clear direct schema specimen exists in:

- `zova/src/suite/a-training/modules/training-student/src/apiSchema/trainingStudent.ts`

Representative source facts:

- `@ApiSchema()` exposes a schema bean for the module
- methods such as `select()`, `create()`, `view()`, `delete()`, `update()`, `summary()`, and `deleteForce()` call `this.$sdk.createApiSchemas(...)`

A second useful specimen is:

- `zova/src/suite/a-home/modules/home-passport/src/model/passport.ts`

Representative source fact:

- `schemaLogin` is derived from `this.apiSchemasLogin.requestBody`

Together, these show the first practical boundary in the frontend contract path:

> the generated contract does not jump directly from backend OpenAPI into page internals. It first becomes frontend-accessible through schema- and SDK-oriented surfaces.

## `ModelResource` as the shared owner before branch split

When the generated contract still belongs to one business resource, frontend consumption usually should not create a second competing owner.

A strong public specimen for this pattern exists in:

- `zova/src/suite/a-training/modules/training-student/src/model/student.ts`

Representative source facts:

- the module model is a semantic facade, not the primary resource owner
- it resolves `rest-resource.model.resource` through selector-backed access
- custom methods such as `summary(id)` and `deleteForce(id)` still delegate to resource-owner query and mutation helpers

This is the practical contract-consumption rule that matters most:

> when the API still belongs to the same resource, keep `ModelResource` as the stable owner and keep frontend follow-up thin.

At this point, the generated contract consumption path splits into two practical branches:

- **list branch** -> list route shell, schema row, query state, and table-facing owner surfaces
- **entry branch** -> entry route shell, `formMeta`, `formSchema`, `formData`, and submit/page-meta owner surfaces

## Choose the branch that matches your question

### List branch

Use this branch when your question is about:

- list-page schema and data consumption
- `schemaRow`, `schemaFilter`, and `select(query)`
- the route shell and `basic-page:blockPage` handoff

Continue with [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch).

### Entry branch

Use this branch when your question is about:

- `formMeta`, `formSchema`, and `formData`
- `create` / `view` / `update` schema consumption
- the route shell and `basic-pageentry:blockPageEntry` handoff

Continue with [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch).

## What this page does not re-explain

This page deliberately does **not** re-teach in depth:

- how to configure or generate OpenAPI SDK output -> see [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- the broader server-data abstraction ladder -> see [Server Data](/frontend/server-data)
- how `$apiSchema` is positioned conceptually -> see [API Schema Guide](/frontend/api-schema-guide)
- the lower runtime of `$sdk` and schema extraction -> see [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood)
- `ModelResource` internals -> see [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- the broader `rest-resource` runtime bridge -> see [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood)

Its job is only to show the practical consumer-side handoff after generation.

## Where to read next

- If your next question is still on the bridge/generation side, return to [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) and [OpenAPI SDK Guide](/frontend/openapi-sdk-guide).
- If your next question is about the list-page branch, continue with [Generated Contract Consumption: List Branch](/frontend/generated-contract-consumption-list-branch).
- If your next question is about the entry-page branch, continue with [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch).
- If you now want a proof-oriented layer-by-layer consumer-side workflow, continue with [Generated Contract Consumption Verify Playbook](/frontend/generated-contract-consumption-verify-playbook).
- If the result is already wrong and you want symptom-first diagnosis, continue with [Generated Contract Consumption Debug Checklist](/frontend/generated-contract-consumption-debug-checklist).
- If your next question is about the conceptual server-data ladder, continue with [Server Data](/frontend/server-data), [SDK Guide](/frontend/sdk-guide), and [API Schema Guide](/frontend/api-schema-guide).
- If your next question is about the lower runtime beneath `$sdk`, continue with [OpenAPI Runtime Under the Hood](/frontend/a-openapi-under-the-hood).
- If your next question is about the resource-owner internals, continue with [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive).

## Final takeaway

The cleanest way to read generated contract consumption in Zova is not to jump straight from generated OpenAPI into deep runtime internals.

Instead, read the chain like this:

- generated contract surfaces
- schema and SDK access
- stable resource owner
- pick the list or entry branch
- deeper runtime internals only if you still need them

That reading order keeps the consumer-side contract path visible without flattening the architecture into one giant runtime story.
