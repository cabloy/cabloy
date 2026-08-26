# ModelResource Internals Deep Dive

This guide explains the internals of `ModelResource` in Zova through the current public Cabloy Basic source.

Use this page when you want to understand:

- how `ModelResource` bootstraps itself
- how `resourceApi` is resolved
- where permissions, schemas, and form-provider surfaces come from
- how query, mutation, and form helpers are organized
- how query-key prefixing and invalidation work
- why `ModelResource` is the stable resource-owner boundary under both list and entry pages

## Why this page exists

This page is the third layer of a small source-reading chain around same-resource model facades:

1. [Model Architecture](/frontend/model-architecture) for the broader role of Zova Model
2. [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch) for the consumer-side handoff into the owner
3. this page for the owner internals that make that handoff work

Several existing docs already explain the meaning and usage of the resource owner well:

- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern) explains the architecture and why the owner boundary exists
- [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide) explains application-level usage patterns
- [Resource Model Best Practices](/frontend/model-resource-best-practices) and [Resource Model Cookbook](/frontend/model-resource-cookbook) explain review and implementation guidance
- [Rest Resource Under the Hood](/frontend/rest-resource-under-the-hood) explains the module/runtime bridge around the owner

What those pages do not isolate directly is the one source-first path through `ModelResource` itself.

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. `ModelResource` is a selector-backed owner keyed by `resource`
2. bootstrap resolves the final `resourceApi`
3. the owner exposes computed surfaces for permissions, schema, and form provider
4. query helpers wrap the shared model/query runtime for select/view/item-style fetches
5. mutation helpers wrap the shared model/query runtime for create/update/delete behavior
6. form helpers let pages choose schema/data/mutation behavior from `formMeta`
7. query keys and invalidation are centralized as part of the owner contract

That means `ModelResource` is not only a fetch helper. It is the stable resource semantics boundary for the frontend.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/model/sdk.ts`
3. `zova/packages-zova/zova-core/src/core/sys/util.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.query.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts`
7. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resource/controller.tsx`
8. `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/entry/controller.tsx`

That order moves from the owner core, to the OpenAPI model it relies on, to path/config helpers, to query/persister behavior, and finally to the clearest current consumers.

## Initialization and bootstrap

The owner core lives in:

```text
zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/model/resource.ts
```

The first source-confirmed facts are:

- `@Model({ enableSelector: true })`
- `__init__(resource)` requires a concrete `resource`
- bootstrap happens before downstream consumers use the owner surfaces

This matters because `ModelResource` is not one global singleton.

It is a selector-backed owner whose runtime identity is the current resource name.

## `resourceApi` resolution

The bootstrap path uses:

- `this.$sdk.getBootstrap(this.resource)`
- `this.sys.util.parseResourceApi(resource, api)`

The path/config helper lives in:

```text
zova/packages-zova/zova-core/src/core/sys/util.ts
```

This confirms the owner flow:

- bootstrap data may override the final API path
- otherwise the resource name is translated into a default controller/action API path

That is why `resourceApi` should be treated as an owner-level resolved surface, not as one hard-coded string duplicated across pages.

## Metadata surfaces exposed by the owner

Inside `ModelResource`, the owner computes and exposes:

- `permissions`
- `formProvider`
- `schemaView`
- `schemaCreate`
- `schemaUpdate`
- `schemaFilter`
- `schemaRow`
- `schemaPages`

These surfaces are derived from:

- the bootstrap/runtime resource context
- the OpenAPI SDK/schema helpers

This is the clearest source-confirmed reason why both list pages and entry pages reuse the same owner: schema, permission, and provider surfaces belong to one resource boundary.

## Query helper layer

The query helpers are organized around:

- `selectGeneral(actionPath?, query?)`
- `select(query?)`
- `queryItem(...)`
- `view(id)`

`select(query?)` is only a thin wrapper over `selectGeneral(undefined, query)`.

The important source-confirmed detail is that the select key includes a hash of the query object:

- `['select', actionPath ?? '', hashkey(query)]`

That means query identity is deliberate and owner-controlled.

This is the owner-side boundary for list/query fetches, not the page shell.

## Mutation helper layer

The mutation helpers are organized around:

- `create()`
- `mutationItem(...)`
- `update(id)`
- `delete(id)`

The most important source-confirmed behavior is:

- select queries are invalidated after successful mutations
- item-root queries are invalidated for the specific row identity

That means mutation helpers do not only perform network requests. They also own the default resource-level invalidation policy.

## Form helper layer

The form-facing helpers are:

- `getFormSchema(formMeta)`
- `getFormApiSchemas(formMeta)`
- `getFormMutationSubmit(formMeta, id?)`
- `getFormData(formMeta, id?)`
- `getQueryDataDefaultValue(schemaName?)`

This is the clearest source-confirmed bridge from resource owner to entry-page form runtime.

A practical reading rule is:

- list pages mainly consume `schemaFilter`, `schemaRow`, and `select(...)`
- entry pages mainly consume `formMeta`-driven form helpers

## Query-key prefixing and invalidation behavior

The shared model/query behavior lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.useQuery.ts
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.query.ts
zova/src/suite-vendor/a-zova/modules/a-model/src/bean/bean.model/bean.model.persister.ts
```

The important source-confirmed behavior is:

- owner query keys are prefixed with bean full name
- selector-backed models also prefix by selector
- persister/query behavior therefore treats one resource owner as a distinct query namespace

This is why `ModelResource` query identity is stable even when multiple resources or multiple selectors exist at once.

## Current consumers that prove the contract

The clearest current consumers are:

- `rest-resource/src/page/resource/controller.tsx`
- `rest-resource/src/page/entry/controller.tsx`

These page shells prove that:

- list pages consume the owner for top-level list/schema/runtime entry
- entry pages consume the owner for form/provider/schema/runtime entry

That is enough to verify that `ModelResource` is the shared owner beneath both branches.

## What this guide does not re-explain

This page does **not** fully re-explain:

- why the resource owner pattern exists -> see [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- application-level facade and usage guidance -> see [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)
- the full list-page runtime -> see [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- the full entry-page runtime -> see [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)

Its job is only to explain the owner internals and their current consumer contract.

## Where to read next

Use these next steps depending on your question:

- if you want to step back to the broader model role, return to [Model Architecture](/frontend/model-architecture)
- if you want to step back to the consumer-side handoff, return to [Generated Contract Consumption: Entry Branch](/frontend/generated-contract-consumption-entry-branch)
- if you want the list-page runtime branch, read [Resource List Page Deep Dive](/frontend/resource-list-page-deep-dive)
- if you want the entry-page runtime branch, read [Resource Entry Page Deep Dive](/frontend/resource-entry-page-deep-dive)
- if you want the owner-pattern explanation, read [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- if you want application-level usage/facade rules, read [Using `ModelResource` in Your Module](/frontend/model-resource-usage-guide)

## Final takeaway

The most accurate way to read `ModelResource` is not as one generic CRUD helper.

Read it as the selector-backed resource owner that:

- bootstraps and resolves `resourceApi`
- exposes schema, permission, and provider surfaces
- owns query, mutation, and form helper boundaries
- defines query-key and invalidation behavior
- remains the stable resource semantics layer beneath both list pages and entry pages

That is the source-confirmed role of `ModelResource` in the current Cabloy Basic frontend architecture.
