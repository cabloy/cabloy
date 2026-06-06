# Serialization Guide

## Why serialization matters in Vona

Vona provides serialization so backend APIs can transform response data before it leaves the request path.

That matters because response shaping often needs to do more than return raw entity fields. Real systems frequently need to:

- exclude sensitive fields
- mask values such as email or mobile data
- derive new output fields
- apply custom transforms to response values

## Core serialization model

Serialization in Vona is built around two layers:

- enabling serialization for an API
- attaching serializer behavior to fields through metadata helpers

The framework can then transform response data using typed, reusable rules instead of ad hoc post-processing logic.

## Enabling serialization for an API

Serialization is enabled per API with:

```typescript
@Core.serializer()
```

Representative pattern:

```typescript
@Web.get(':id')
@Api.body(v.optional(), v.object(EntityStudent))
@Core.serializer()
async findOne(id) {
  return await this.scope.service.student.findOne(id);
}
```

This makes serialization an explicit request-path capability rather than an invisible response-side convention.

## Serializer transforms

Vona supports custom serializer transforms through `@SerializerTransform(...)`.

Representative generation workflow:

```bash
npm run vona :create:bean serializerTransform upper -- --module=demo-student
```

Representative pattern:

```typescript
@SerializerTransform<ISerializerTransformOptionsUpper>()
export class SerializerTransformUpper {
  async transform(value: string) {
    return value.toUpperCase();
  }
}
```

A transform can define:

- input value type
- parent data type
- result type
- transform options

This makes serializer behavior reusable and typed.

## Applying a serializer transform

Field-level serialization is attached through `@Api.field(...)` metadata helpers.

Representative pattern:

```typescript
@Api.field(v.serializerTransform('demo-student:upper'))
name: string;
```

This means response transformation is part of the same field-oriented contract model used for validation and OpenAPI metadata.

## Filtered serializer execution

A serializer transform can include a filter function so the transform only runs when the filter allows it.

This is useful when serialization behavior depends on the current user, request context, or other runtime conditions.

## Serializer transform parameters

Serializer transforms can define options with:

- default values
- per-usage overrides
- app-config overrides

This lets projects tune serializer behavior without rewriting the transform implementation each time.

A representative precedence model is:

- usage-site override in `v.serializerTransform(...)`
- then `config.onions.serializerTransform`
- then decorator default values

## Serializer helper tools

Vona also provides a set of serializer-oriented helpers under the `v` helper surface.

Representative helpers include:

- `v.serializerTransform(...)`
- `v.serializerExclude()`
- `v.serializerReplace(...)`
- `v.serializerGetter(...)`
- `v.serializerCustom(...)`

## `v.serializerExclude()`

Use this to remove a field from serialized output.

This is useful for fields that should exist in the backend model but should not appear in API responses.

## `v.serializerReplace(...)`

Use this to mask or rewrite a field value.

A representative use case is partially masking a string such as an email, mobile number, or other sensitive value.

## `v.serializerGetter(...)`

Use this to derive a new serialized field value from the parent object.

This is useful for fields such as `fullName` that are better expressed as output-only computed values.

## `v.serializerCustom(...)`

Use this when the transformation should be expressed inline as a custom function rather than through a named reusable transform bean.

## App-config override patterns

Serializer metadata can also be adjusted through app config, including field-level metadata updates for entities.

That means serialization participates in the broader backend metadata and schema configuration system instead of being locked into only one code location.

Representative patterns include:

- direct metadata replacement with `$makeMetadata(...)`
- schema reconstruction with `$makeSchema(...)`

That choice matters because sometimes you only want to swap serialization metadata, while other times you want to rebuild the field schema surface more explicitly.

## Relationship to DTOs, entities, validation, and OpenAPI

Serialization should be read together with:

- [DTO Guide](/backend/dto-guide)
- [Entity Guide](/backend/entity-guide)
- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)

These guides explain the same field-oriented metadata system from the perspectives of contract design, persistence shape, validation, and machine-readable API output.

## When to use serialization instead of service-layer mutation

Use serialization when:

- the underlying backend object should remain unchanged
- the output should vary by API response needs
- the transformation belongs to response presentation or exposure policy

Use service- or model-layer mutation when the underlying business data itself should change.

A useful rule of thumb is:

- choose a named serializer transform when the rule should be reusable across fields or entities
- choose `v.serializerCustom(...)` when the rule is local to one field and does not deserve its own bean
- choose `v.serializerExclude`, `v.serializerReplace`, or `v.serializerGetter` when the intent is one of those standard output policies

## Why this matters for AI workflows

When AI changes backend response behavior, it should ask:

1. should this be a serialization concern instead of modifying the underlying entity or service result?
2. is a reusable named serializer transform better than an inline custom transform?
3. should the field be excluded, masked, derived, or otherwise transformed through `v.serializer*` helpers?
4. does the same field metadata also interact with validation, DTO design, or OpenAPI output?

That helps AI keep response shaping aligned with Vona’s contract and metadata model.
