# DTO Schema Scenes and Readonly Sanitization

## Context

Commit `82556374c8b89703a4c6244190d9fad5008c5cf7` introduced DTO-level schema scenes as one cross-package contract. The feature connects inferred mutation DTOs, class OpenAPI metadata, Vona request validation, and Zova schema-driven form behavior.

This note records the framework invariants behind the public DTO, validation, and OpenAPI guidance. It is not a user-facing authoring tutorial.

## Contract propagation

`TypeSchemaScene` is shared by the Vona and Zova OpenAPI REST extension typings. Its current values are:

- `table`
- `form`
- `form-view`
- `form-create`
- `filter`

Keep the typings compatible in both packages:

- `vona/src/suite-vendor/a-vona/modules/a-openapi/src/types/rest.ts`
- `zova/src/suite-vendor/a-zova/modules/a-openapi/src/types/rest.ts`

`@Dto({ schemaScene })` becomes `rest.schemaScene` class OpenAPI metadata in:

```text
vona/src/suite-vendor/a-vona/modules/a-web/src/lib/decorator/bean.ts
```

Generated mutation DTOs establish the conventional scene identity before a named DTO's `@Dto(...)` options are applied:

- `$Dto.create(...)` sets `form-create` in `vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/dto/dtoCreate.ts`
- `$Dto.update(...)` sets `form` in `vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/dto/dtoUpdate.ts`

## Metadata-preservation invariant

Class OpenAPI metadata must be deep-merged, not replaced, when decorators, inferred helpers, and inheritance all contribute to a DTO. In particular, `mergeTargetDecoratorDtoOpenapi(...)` in:

```text
vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/utils.ts
```

reads inherited/current metadata and merges new options into it. Reverting this path to replacement semantics would discard inferred scene identity, blocks, or other pre-existing metadata when `@Dto(...)` runs.

Field-schema refinement has a matching preservation rule: framework composition retains inherited OpenAPI metadata while a field schema is replaced or refined. This does not make schema-like structure composition order-independent. Structure-shaping inputs still need their final authoring position, and emitted schema/OpenAPI must be checked after changes.

## Readonly sanitization invariant

`BeanValidator` performs readonly sanitization only after the supplied Zod schema parses successfully:

```text
vona/src/suite-vendor/a-vona/modules/a-validation/src/bean/bean.validator.ts
```

The sanitizer must preserve these behaviors:

1. resolve lazy schemas and unwrap chained schemas before determining whether the value is an object or array;
2. pass the containing effective scene into nested values, while allowing a nested schema's `rest.schemaScene` to override that inherited scene;
3. recurse into array elements and nested object fields;
4. determine effective field REST metadata in this order:
   - base `rest`;
   - shared `rest.form` only for `form-view`, `form-create`, and `filter`;
   - exact scene metadata;
5. omit a field only when the resolved `readonly` value is exactly `true`;
6. preserve fields absent from the object schema after parsing, leaving ordinary Zod object/unknown-key policy authoritative.

This makes scene-specific readonly behavior an input-sanitization boundary. It is deliberately not response serialization, a strict-object policy, or a general authorization replacement.

## Frontend-parity invariant

Zova schema loading must retain the compatible scene-overlay model in:

```text
zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts
```

`loadSchemaProperties(...)` applies the shared `form` overlay for `form-view`, `form-create`, and `filter`, then applies the exact scene override. The backend's readonly resolver and the frontend property loader must not drift in this precedence rule, or a form can present one behavior while Vona accepts a different input shape.

## Locale-scoped OpenAPI schema lifetime

Localized OpenAPI metadata has a runtime lifetime boundary in Zova:

```text
app.meta.locale.current
  -> a-openapi monkey replaces the selected ModelSdk
  -> selector-backed ModelSdk uses the current locale
  -> locale-specific SysSdk requests and caches OpenAPI schema data
  -> generated API-schema operation facade exposes requestBody/properties
  -> page/model supplies that schema to ZForm
```

The important closure boundary is `ModelSdk.createApiSchemas(...)`: the returned facade captures the SDK query and `ModelSdk` instance used when it is created. It is therefore not a locale-neutral handle. A controller or model must not retain that facade, its `requestBody`, or an `omit`/`pick`/other transformed schema snapshot across a locale change. Reacquire the current facade through a getter, `$computed`, or the owning `ModelResource`, and perform transformations inside that reactive derivation.

Keep two failure classes separate:

- **Generated contract drift:** emitted OpenAPI metadata or generated API/API-schema consumers are wrong; follow the forward contract chain and regenerate.
- **Consumer facade capture:** emitted metadata is correct, but a mounted consumer still displays the prior locale; inspect the locale-scoped SDK selection and the lifetime of the stored schema facade before changing generated output.

`ZForm` owns binding, validation, and field rendering, but its owner supplies the schema, data, provider, and metadata. Without a default body slot, it iterates the supplied schema properties automatically; a default body slot intentionally replaces that path. The form cannot refresh an old-locale schema object retained by its owner.

For runtime changes or regressions, exercise at least two locales after a schema facade has already been created. Verify the locale-specific OpenAPI request/header and rendered metadata, and cover both automatic body rendering and intentional explicit-body composition where applicable.

## Source-reading order

For a future change, trace the following order:

1. `vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/dto/dtoCreate.ts`
2. `vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/dto/dtoUpdate.ts`
3. `vona/src/suite-vendor/a-vona/modules/a-web/src/lib/decorator/bean.ts`
4. `vona/src/suite-vendor/a-vona/modules/a-openapiutils/src/lib/utils.ts`
5. `vona/src/suite-vendor/a-vona/modules/a-validation/src/bean/bean.validator.ts`
6. `zova/src/suite-vendor/a-zova/modules/a-openapi/src/lib/schema.ts`

## Verification boundary

The source commit added no focused regression test for scene-aware readonly sanitization. Future implementation changes should add targeted coverage for:

- create versus update scene behavior;
- base, shared-form, and exact-scene precedence;
- nested object and array sanitization;
- lazy and chained schemas;
- nested scene override;
- preservation of inferred scene metadata when a named `@Dto(...)` adds options.

For documentation changes, build the VitePress site. For behavior changes, also inspect emitted OpenAPI and exercise validated request values rather than treating generated schema output as sufficient proof.
