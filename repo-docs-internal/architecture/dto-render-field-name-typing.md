# DTO Render Field-Name Typing Boundary

This note records the boundary for TypeScript field-name constraints in Vona DTO render metadata.

## Decision

Do not add DTO-local identity helpers solely to constrain render field names, for example:

```ts
function studentViewFieldName<T extends keyof DtoStudentView>(name: T): T {
  return name;
}
```

Keep ordinary render metadata field names as string literals until the framework can provide the constraint from the DTO schema/type context itself.

## Why DTO-local helpers are the wrong abstraction

A DTO class may combine fields from several sources:

- inferred entity/model fields through `$Dto.create(...)`, `$Dto.update(...)`, or `$Dto.get(...)`
- model relations and `include` options
- DTO class members decorated with `@Api.field(...)`
- DTO decorator metadata and dynamically assembled schema behavior

A local `keyof` helper either fails to include some of those fields or requires a manually maintained field union. The latter duplicates contract truth and can drift from the emitted DTO/OpenAPI schema.

Such a helper also adds call-site noise without runtime behavior:

```ts
{ type: 'field', name: studentViewFieldName('name') }
```

instead of:

```ts
{ type: 'field', name: 'name' }
```

## Correct ownership boundary

If strong field-name constraints are needed broadly, implement them in the shared type layer:

1. derive the effective DTO field set after inference, relation inclusion, and decorated fields are composed;
2. carry that field type into `@Dto(...)` options and the relevant `ZovaRender` block/layout types;
3. constrain every `{ type: 'field', name }` node from that shared context.

A framework-level solution protects all form layouts and avoids a separate helper and manually duplicated union in every DTO.

## Maintenance rule

- Use plain field-name literals in individual DTO render layouts by default.
- Do not infer a field-name union from `IDecoratorDtoOptions` unless that interface explicitly and correctly owns the effective field type.
- Do not introduce a local helper for one or a few call sites.
- Revisit this only when the framework can expose a complete DTO field type through the renderer metadata API.

## Related guidance

This preserves the inferred DTO flow described in [Backend Resource Field Update Workflow](./backend-resource-field-workflow.md): entity/model/DTO schema composition remains the contract truth, rather than a parallel manually maintained field list.
