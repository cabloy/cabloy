# Validation Guide

This guide explains how validation works in Vona within the Cabloy monorepo.

## Why validation matters in Vona

Vona builds validation around Zod and integrates it directly into controller argument handling, DTOs, entities, and OpenAPI generation.

That means validation is not an isolated input-checking step. It is part of the contract layer shared across runtime behavior, types, and API documentation.

## Automatic schema inference

One very important convenience is that if a parameter type is a basic type, DTO, or entity, Vona can automatically infer the corresponding Zod schema.

Representative cases:

- `number` → `z.number()`
- DTO → `z.object({...})`
- Entity → `z.object({...})`

This matters because Vona tries to keep the contract surface concise while still producing strong runtime validation.

In controller AOP terms, this usually means built-in argument handling is enough for many request parameters without creating a custom pipe or argument pipe first.

## Explicit schema rules

You can also pass explicit schema rules when automatic inference is not enough.

Representative pattern:

```typescript
findOne(@Arg.query('id', z.number().min(6)) id: number) {}
```

## Extending the inferred schema

Inferred schemas can also be extended through helper tools like:

- `v.optional`
- `v.nullable`
- `v.default`
- `v.array`
- `v.lazy`

That is important because many real validation cases need augmentation rather than total replacement.

## Scene-aware readonly input sanitization

DTO and field OpenAPI metadata can identify a Cabloy schema scene and its scene-specific field behavior. After a schema parses successfully, Vona removes each known property whose **effective** `rest` metadata resolves to `readonly: true` for that scene.

This is server-side input sanitization, not a browser-only disabled control and not a validation error. A caller cannot turn a read-only field into a write channel by bypassing a Zova form.

For `form-view`, `form-create`, and `filter`, Vona resolves field metadata in this order:

1. base `rest` metadata
2. shared `rest.form` metadata
3. the exact scene metadata, such as `rest['form-create']`

For `table` and `form`, only the base metadata and exact-scene metadata apply. A nested DTO inherits the containing scene unless it declares its own `rest.schemaScene`.

The sanitization traverses nested DTO/object values and array elements, including framework lazy and chained schema composition. For example, a create request can prevent callers from supplying a line-item price while still accepting its quantity:

```typescript
class DtoLineItem {
  @Api.field(v.openapi({ rest: { form: { readonly: true } } }))
  price: number;

  @Api.field()
  quantity: number;
}

export class DtoOrderCreate extends $Dto.create(() => ModelOrder) {
  @Api.field(v.array(DtoLineItem))
  items: DtoLineItem[];
}

// request input
{
  items: [{ price: 99, quantity: 2 }];
}

// validated value delivered to the handler
{
  items: [{ quantity: 2 }];
}
```

Use DTO projection to omit a field that the API must never accept or return. Use scene-aware `readonly` when a field belongs to the schema but must be removed from write input for one contract scene. This sanitization is not response serialization; response payload shaping remains a separate concern in the [Serialization Guide](/backend/serialization-guide). General object parsing and unknown-key behavior still belong to the supplied Zod schema; readonly sanitization removes known protected fields only after successful parsing.

A useful distinction is:

- `v.optional` means the field may be omitted
- `v.nullable` means the field may carry a real `null`

For query parameters, that distinction matters because plain optional values still collapse `null` to omission, while `v.optional(), v.nullable()` allows a real `null` to survive parsing when the contract needs SQL `IS NULL` semantics downstream.

## `@Arg.filter`

The validation layer supports query-style inputs through `@Arg.filter`, which ties DTO/query helpers to named filters, raw `where`, transformations, and list controls.

### Analysis action modes

A DTO can attach one shared `$defineAnalysis` policy through `@Dto({ analysis: studentAnalysis })`. Select, group, and aggregate still have separate contracts:

```typescript
async select(
  @Arg.filter(DtoStudentSelectReq) params: IQueryParams<ModelStudent>,
) {
  return await this.scope.service.student.select(params);
}

async group(
  @Arg.filter(DtoStudentSelectReq, { mode: 'group' })
  params: TypeAnalysisGroupParams<typeof studentAnalysis>,
) {
  return await this.scope.service.student.group(params);
}

async aggregate(
  @Arg.filter(DtoStudentSelectReq, { mode: 'aggregate' })
  params: TypeAnalysisAggregateParams<typeof studentAnalysis>,
) {
  return await this.scope.service.student.aggregate(params);
}
```

Group mode derives `groups` and `aggrs` controls from the policy; aggregate mode derives `aggrs` only. Each action receives its own schema reference and finite enums without mutating the base SelectReq schema. An ordinary select request explicitly containing analysis controls is rejected before unknown-key stripping can hide them. This does not enable strict unknown-key rejection for every unrelated filter.

For GET, array/object controls are JSON query values: `groups=["level"]` and `aggrs={"count":["imageId"]}` before URL encoding. Generated API calls accept structured values and encode them through the existing `combineQueries` convention. Malformed JSON, empty arrays/metric objects, duplicate fields, unsupported functions/columns, or any `groups` on aggregate are invalid. Omitted `groups` and `aggrs` independently use the action defaults; explicit empty input never means “use the default.”

The policy owns a dimension allowlist and function-specific column allowlists. Clients cannot introduce custom aliases, expressions, joins, or `having`. A named filter that requires a join also fails for analysis, rather than silently dropping the join or changing aggregate multiplicity; ordinary select joined filters remain supported. Named local filters, transforms, and raw-`where` precedence retain their existing behavior.

List controls such as `columns`, `orders`, `pageNo`, and `pageSize` remain validated but do not project, sort, or paginate analysis results. For example, invalid `pageSize: 0` still fails, while valid page 2 does not remove matching source rows from the aggregate population. Server-side instance, soft-delete, and business scope must still constrain `where` before execution.

`$executeAnalysisGroup(model, policy, params)` and `$executeAnalysisAggregate(model, policy, params)` revalidate analysis controls for direct service callers. The default effective limits are `maxGroups: 3`, `maxMetrics: 10`, and `maxGroupRows: 1000`; policies can deliberately override them. Group execution uses deterministic dimension ordering and reads cap+1 rows to detect overflow. Invalid analysis selections and group-row overflow produce deliberate `422` errors, not generic server failures or silently truncated results. The row cap is not a limit on database scan/aggregation cost.

The derived schemas expose public `filter.capabilities.analysis` (mode, allowlists, defaults, limits), including on flattened `groups` / `aggrs` query parameter schemas. They do not publish model/class references. See [CRUD Workflow](/backend/crud-workflow#grouping-and-statistics) and [DTO Infer and Generation](/backend/dto-infer-generation#aggregate-and-group-dto-inference) for policy authoring and requested-only response fields.

## Tool groups

These helper tools fall into groups such as:

- basic tools
- string tools
- OpenAPI tools
- serializer tools
- Zod tools

For response-side shaping with those serializer helpers, see [Serialization Guide](/backend/serialization-guide).

- query filter tools
- special tools like `v.tableIdentity`

This matters because the right answer is often “use the existing helper vocabulary” instead of hand-writing a one-off schema pattern.

## Implementation checks for request-validation changes

When changing request contracts, ask:

1. can Vona infer the schema automatically?
2. does the contract need explicit extension through the `v` helpers?
3. does the same validation surface also feed OpenAPI and DTO behavior?
4. is the validation logic better expressed at the controller, DTO, or entity layer?
5. for a scene-aware DTO, what is its effective schema scene and does each protected field resolve to read-only there?
6. when protected fields can be nested, have object and array inputs been tested separately?

That produces more consistent backend contracts.

For the broader request-path model around pipes, guards, middleware, interceptors, and filters, see [Controller AOP Guide](/backend/controller-aop-guide). Captcha verification flows commonly intersect with this request-path layer through a local interceptor; see [Captcha Guide](/backend/captcha-guide).
