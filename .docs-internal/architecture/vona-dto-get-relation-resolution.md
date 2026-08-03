# `$Dto.get` Named Relation Lazy-Resolution Invariant

## Purpose

`$Dto.get(...)` has two intentionally different Model-resolution stages. Preserving their boundary prevents module registration order from leaking into ordinary DTO authoring.

This is a framework implementation invariant, not an application-module dependency rule.

## Invariant

- `$Dto.get(...)` resolves its top-level source Model eagerly.
- An included relation target resolves lazily, inside the schema thunk consumed by `v.lazy(...)`.
- This includes a relation target declared through an onion name or string ModelLike such as `training-student:student`.

The top-level Model must resolve eagerly because `$Dto.get(...)` immediately needs its source Entity and relation metadata to construct the DTO base class. A relation target is needed only when its nested schema is expanded.

Therefore, constructing a source DTO must not require the target relation Model to have been registered already. Schema or OpenAPI expansion must still resolve a valid target Model when the lazy relation schema is consumed.

## Source path

The load-bearing code is in [dtoGet.ts](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/lib/dto/dtoGet.ts):

1. `_DtoGet_raw(...)` resolves the top-level source Model with `prepareClassModel(...)`.
2. `_DtoGet_relation_handle(...)` reads the relation definition and passes its unresolved `model` value into `_DtoGet_relation_handle_schemaLazy(...)`.
3. `_DtoGet_relation_handle_schemaLazy(...)` returns the thunk used by `v.lazy(...)` and resolves `modelLike` with `prepareClassModel(...)` inside that thunk.
4. The resolved target then feeds ordinary DTO inference, mutation DTO inference, or autoload dynamic-schema caching.

[utils.ts](../../vona/src/suite-vendor/a-vona/modules/a-orm/src/common/utils.ts) shows why this timing matters: `prepareClassModel(...)` immediately resolves a string ModelLike through `appResource`. Moving that call from the lazy thunk back into relation-field construction reintroduces registration-order coupling.

## Refactor guardrails

When changing inferred relation schemas:

- do not pre-resolve a relation target merely to simplify helper parameters or cache setup
- preserve the eager top-level / lazy relation-target distinction
- preserve lazy behavior for `belongsTo`, `hasOne`, and collection relation schemas
- retain the current mutation distinctions, including omitted nested `belongsTo` mutation fields and `belongsToMany` identity schemas
- retain autoload dynamic-schema cache work after the target resolves inside the lazy path: entity-name derivation, cache lookup, cache-key construction, `SymbolSchemaDynamicRefId`, and cache insertion

Do not solve a regression in this boundary by adding a business-module `vonaModule.dependencies` edge solely to force target registration order. Named resources and normal ORM relations resolve dynamically; a module dependency must reflect a real availability, ordering, or version contract.

## Executable regression coverage

[dtoGet.test.ts](../../vona/src/suite-vendor/a-test/modules/test-vona/test/database/dtoGet.test.ts) contains `action:dtoGet:resolves named relation lazily`.

The test temporarily replaces a relation target with an unregistered onion name and verifies that `$Dto.get(..., { include: { user: true } })` still constructs the DTO. It then restores the valid target and verifies that OpenAPI schema generation emits the relation field.

Together, these checks protect both sides of the invariant:

- DTO construction does not eagerly resolve the named relation target
- lazy schema expansion still resolves and emits a valid relation target

## Related guidance

- [DTO/Model Contract Projection Evolution](./dto-model-contract-projection-evolution.md)
- [DTO Render Field-Name Typing Boundary](./dto-render-field-name-typing.md)
- [Vona Module Dependencies](../../cabloy-docs/backend/module-dependencies.md)
- [Backend Foundation](../../cabloy-docs/backend/foundation.md#scope-lookup-vs-module-dependencies)
