# API Schema Guide

This page expands the legacy `$apiSchema` placeholder into a practical guidance page for the new docs site.

## What `$apiSchema` represents

`$apiSchema` is the schema-oriented layer of the server-data model.

While `$api` and generated SDKs focus on calling backend operations, `$apiSchema` focuses on the API metadata itself.

That matters when frontend behavior needs to be driven by schema, not just by returned values.

## Why schema access matters

In the Cabloy/Zova model, schema metadata can support higher-level frontend behavior such as:

- validation
- automatic form rendering
- automatic field behavior
- metadata-driven UI logic

This is one reason the server-data thread in Zova is more powerful than a plain request library.

## The generated and runtime path

A schema-driven frontend normally follows this contract path:

```text
backend entity / DTO / controller metadata
  -> Swagger / OpenAPI
  -> generated API bean + API-schema bean + static types
  -> $api / $apiSchema / $sdk
  -> ModelResource when the API belongs to a reusable resource
  -> ZForm for schema-driven form runtime
  -> page/controller for local orchestration
```

Each layer has a different responsibility:

| Layer                                     | Responsibility                                                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Backend entity or inferred field contract | Reusable field meaning, validation, titles, ordering, and shared renderer metadata                           |
| Backend DTO                               | Operation-specific request/response projection and composition                                               |
| Generated `$api`                          | Execute a typed backend operation                                                                            |
| Generated `$apiSchema`                    | Expose a named operation's schema-oriented facade                                                            |
| `$sdk`                                    | Provide the lower-level schema/query runtime used by schema facades and dynamic consumers                    |
| `ModelResource`                           | Own reusable resource schema, query, mutation, cache, invalidation, and permission state                     |
| `ZForm`                                   | Consume a resolved schema and own form binding, validation, submission, and field rendering                  |
| Page/controller                           | Coordinate local page lifecycle and page-specific actions without duplicating shared contract or cache state |

The generated API bean, API-schema bean, and static OpenAPI types are separate frontend surfaces for the same backend operation. Runtime schema metadata such as titles, renderer names, validation, and scene information is consumed through `$apiSchema`/`$sdk`; static request and response typing is consumed through the generated TypeScript types and `$api` methods.

### Direct schema-driven form pattern

For a page-specific form whose request-body schema is already exposed by a generated API-schema bean, load that schema and pass it directly to `ZForm`:

```ts
const apiSchemas = this.$apiSchema.homeUserPassport.register({ authToken: false });
await $QueryEnsureLoaded(() => apiSchemas.sdk);

this.schemaRegister = this.$computed(() => {
  return apiSchemas.requestBody;
});
```

```tsx
<ZForm
  data={this.user}
  schema={this.schemaRegister}
  onSubmitData={data => this.submitRegister(data)}
  slotFooter={$form => {
    return <button type="submit">Register</button>;
  }}
></ZForm>
```

When `ZForm` receives a schema without a default body slot, it iterates the schema properties and resolves each field from the contract metadata. `slotFooter` is independent of body rendering, so page-specific submit actions can remain in the form without replacing automatic field rendering. Adding default children to the form changes the body path to explicit composition and should be reserved for manual or mixed forms.

For a reusable resource, prefer the owning `ModelResource` to supply `formSchema`, `formData`, `formMeta`, and mutation policy. For a low-reuse page action with no shared query, cache, mutation, or invalidation state, the page controller may call the generated `$api` directly. A model should not wrap an API merely to add an extra indirection.

## How to think about `$apiSchema`

Use `$apiSchema` when the frontend needs to inspect what the backend contract says, not just call the backend endpoint.

That usually means the problem is shifting from “fetch data” to “use metadata to drive behavior.”

## One practical metadata-driven expression example

When schema-driven form or table rendering uses JSX/CEL evaluation, the runtime can resolve helper functions against the current scope.

For example, frontend CEL expressions can now use `toFixed(value, precision)` to keep a numeric value at the desired precision:

```text
toFixed(getValue('price'), 2)
```

In the shared form/table CEL environment:

- `toFixed(...)` returns a string with fixed decimal precision
- `getValue(name)` reads the current field value or current row value from the active runtime scope
- `getProperty(name)` reads the current schema property metadata from the active runtime scope

That is useful when the backend contract already owns the field metadata and the frontend only needs a thin expression layer for schema-driven display behavior.

If your next question is not only how expressions read schema-driven scope, but how backend-owned field metadata attaches live field-side behavior through `ZovaRender.onEffect(...)`, `ZovaEvent`, and command chains, continue with [Schema-Driven Field Effects Guide](/frontend/schema-driven-field-effects-guide).

## Read together with

Use this page together with:

- [Server Data](/frontend/server-data)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Form Guide](/frontend/form-guide)
- [Generated Contract Consumption Specimen](/frontend/generated-contract-consumption-specimen)
- [Model Resource Owner Pattern](/frontend/model-resource-owner-pattern)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [SDK Guide](/frontend/sdk-guide)
- [A-OpenAPI Under the Hood](/frontend/a-openapi-under-the-hood)

## Implementation checks for schema-driven UI changes

When asked to build dynamic forms, metadata-driven UI, or schema-aware validation, consider whether the right source is `$apiSchema` rather than hand-authored frontend-only field definitions.

That keeps the frontend closer to backend truth and reduces duplicate configuration.
