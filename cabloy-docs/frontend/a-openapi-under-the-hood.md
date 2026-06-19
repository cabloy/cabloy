# OpenAPI Runtime Under the Hood

This guide explains the lower-level runtime of `a-openapi` in Zova through the current public Cabloy Basic source.

Use this page when you want to understand:

- how `$sdk` becomes available on beans
- what `ModelSdk` and `SysSdk` each own
- how bootstrap and permissions loading work
- how request/query/filter/body/row/paged schema surfaces are derived
- why `a-openapi` is a lower-level shared runtime substrate for resource, model, and table consumers

## Why this page exists

Several existing docs already explain usage and positioning around the server-data ladder:

- [Server Data](/frontend/server-data)
- [SDK Guide](/frontend/sdk-guide)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [API Schema Guide](/frontend/api-schema-guide)

What those pages do not isolate directly is the source-first runtime path inside `a-openapi` itself.

That is the gap this page fills.

## The shortest accurate mental model

A practical mental model is:

1. `a-openapi` injects `$sdk` onto beans through its module monkey
2. `$sdk` resolves a locale-scoped `ModelSdk`
3. `ModelSdk` exposes bootstrap, permissions, sdk, schema, Zod, and default-value helpers
4. `SysSdk` owns the lower cache/fetch layer for bootstrap/docs/schemas
5. `schema.ts` extracts request/query/filter/body/row/paged schema surfaces and applies scene-aware property selection
6. downstream resource/model/table consumers reuse those lower-level surfaces rather than rebuilding them independently

That means `a-openapi` is not only about generated SDK usage. It is also the lower-level schema/runtime bridge beneath the higher-level frontend runtime.

## Source-confirmed reading path

When reading this topic, use this order:

1. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/monkey.ts`
2. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/model/sdk.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/bean/sys.sdk.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/rest.ts`
6. optional supporting files:
   - `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/sdk.ts`
   - `zova/src/suite-vendor/a-zova/modules/a-openapi/src/config/config.ts`

That order moves from bean-level injection, to the locale-scoped model surface, to the lower fetch/cache layer, to the schema extraction layer, and finally to the schema/type contract.

## `$sdk` injection and locale-scoped runtime

The injection layer lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-openapi/src/monkey.ts
```

The key source-confirmed behavior is:

- `beanInit(...)` defines `$sdk` on bean instances
- `$sdk` points to a ref-like current `ModelSdk`
- `moduleLoaded(...)` loads the SDK model for the current locale
- locale changes trigger `_loadSdk()` again

That means `$sdk` is not a static global object.

It is a runtime-injected, locale-scoped model surface.

## `ModelSdk` responsibilities

The selector-backed model lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-openapi/src/model/sdk.ts
```

The current source confirms that `ModelSdk` is:

- `@Model({ enableSelector: true })`
- selector-backed by locale
- responsible for:
  - `getBootstrap(resource)`
  - `getPermissions(resource)`
  - `getSdk(api, method)`
  - `getSchema(schemaName)`
  - `getZodSchema(schemaName)`
  - `getSchemaDefaultValue(schemaName)`
  - `createApiSchemas(api, method)`
  - `loadSchemaProperties(schema, schemaScene)`
  - `schemaToZodSchema(schema)`

A practical reading rule is:

- `ModelSdk` is the higher model-facing façade over lower OpenAPI runtime state
- it is the surface most downstream consumers actually reuse

## `SysSdk` responsibilities

The lower runtime owner lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-openapi/src/bean/sys.sdk.ts
```

Its main jobs are:

- store loaded bootstraps
- store loaded schemas
- store loaded operation SDK entries by API and method
- fetch bootstrap data
- fetch operation-level OpenAPI docs
- cache schemas and operation objects in reactive stores
- reload caches during SSR HMR reload paths

This is the lower-level owner beneath `ModelSdk`.

A practical rule is:

- `ModelSdk` is the model-facing surface
- `SysSdk` is the lower cache/fetch owner

## Bootstrap and permissions loading

The bootstrap path is defined in `ModelSdk.getBootstrap(resource)`.

The source confirms that:

- bootstrap data is loaded first
- permissions are then loaded through `getPermissions(resource)`
- on the server, permissions are autoloaded as part of the bootstrap path
- on the client, permission queries are refetched when needed

That means bootstrap and permissions are part of the same lower-level OpenAPI/runtime ladder, not unrelated utilities.

## `getSdk(...)` and schema preloading

The operation-level SDK path is centered on:

- `ModelSdk.getSdk(api, apiMethod)`
- `SysSdk.loadSdk(...)`

The source confirms that:

- one operation-level SDK entry is keyed by API path and request method
- schema docs are fetched through the lower OpenAPI fetch path
- component schemas referenced by the operation document are cached into `SysSdk.schemas`
- operation metadata is cached into `SysSdk.sdks`

That means `getSdk(...)` is not only a fetch helper. It is also a preloading point for the schema runtime that later powers query/body/row/filter access.

## `createApiSchemas(...)` and derived schema surfaces

The high-value consumer-facing helper is:

- `createApiSchemas(api, method)`

The source confirms that it exposes these derived surfaces:

- `query`
- `filter`
- `requestBody`
- `responseBody`
- `paged`
- `row`

This is the most practical lower-level bridge from raw OpenAPI docs into the higher-level resource, form, and table runtimes.

A practical reading rule is:

- downstream consumers should reuse these derived schema surfaces
- they should not rebuild request/query/body/row extraction rules independently

## `schema.ts` and scene-aware property loading

The canonical schema extraction layer lives in:

```text
zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts
```

This file owns the main lower-level helpers for:

- request body schema extraction
- response body schema extraction
- request query schema extraction
- filter-schema extraction
- scene-aware property loading
- JSON-schema-to-Zod conversion

The most important scene-aware rule is in `loadSchemaProperties(...)`:

- property metadata can be extended by `rest.*`
- scene-specific overlays such as `table`, `form`, `form-view`, `form-create`, and `filter` are applied
- field ordering is resolved through `rest.order`

That means `a-openapi` is not only a transport/schema lookup layer.

It is also the lower-level metadata shaping layer for schema-driven UI behavior.

## Current consumers that prove the contract

The clearest current consumers of `a-openapi` runtime are:

- `rest-resource/src/model/resource.ts`
- list and entry page shells that reuse `ModelResource`
- table/form runtimes that consume schema surfaces derived from `createApiSchemas(...)` and `loadSchemaProperties(...)`

This is enough to show that `a-openapi` should be understood as shared runtime substrate rather than one isolated SDK helper.

## What this page does not re-explain

This page does **not** fully re-explain:

- how to configure or generate OpenAPI SDK output -> see [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- the broader server-data abstraction ladder -> see [Server Data](/frontend/server-data)
- how `$apiSchema` is positioned conceptually -> see [API Schema Guide](/frontend/api-schema-guide)
- downstream resource-owner or table runtime behavior -> see the relevant resource/table deep dives

Its job is only to explain the lower-level `a-openapi` runtime and source path.

## Where to read next

Use these next steps depending on your question:

- if you want the broader server-data ladder, read [Server Data](/frontend/server-data)
- if you want OpenAPI generation/config usage, read [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- if you want schema-driven UI positioning, read [API Schema Guide](/frontend/api-schema-guide)
- if you want the resource-owner consumer side, read [ModelResource Internals Deep Dive](/frontend/model-resource-internals-deep-dive)
- if you want the table/resource consumer side, read [Zova Table Under the Hood](/frontend/zova-table-under-the-hood) and the resource deep dives

## Final takeaway

The most accurate way to read `a-openapi` is not as one generated-client helper.

Read it as the lower-level schema/runtime bridge that:

- injects `$sdk`
- scopes SDK/runtime state by locale
- loads bootstrap, permissions, operation docs, and component schemas
- derives request/query/filter/body/row/paged schema surfaces
- applies scene-aware schema-property shaping
- supports higher-level resource, form, and table consumers

That is the source-confirmed role of `a-openapi` in the current Cabloy Basic frontend architecture.
