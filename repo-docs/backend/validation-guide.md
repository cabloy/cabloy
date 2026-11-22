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

DTO and field OpenAPI metadata can identify a Cabloy schema scene and its scene-specific field behavior. Vona's canonical API input compiler derives an executable input schema that removes each known property whose **effective** `rest` metadata resolves to `readonly: true`. It also removes those submitted keys recursively **before** the affected object applies strict, loose or catchall handling and semantic parsing.

This is server-side input sanitization, not a browser-only disabled control and not a validation error. Effective readonly wins over the property's original requiredness: an omitted or invalid submitted readonly value does not run that property's validators, defaults, refinements or transforms. A caller cannot turn a readonly field into a write channel by bypassing a Zova form. `visible` is independent presentation behavior, not writability.

For `form-view`, `form-create`, and `filter`, Vona resolves field metadata in this order:

1. base `rest` metadata
2. shared `rest.form` metadata
3. the exact scene metadata, such as `rest['form-create']`

For `table` and `form`, only the base metadata and exact-scene metadata apply. A nested DTO inherits the containing scene unless it declares its own `rest.schemaScene`. Without a declared or inherited scene, base `rest.readonly` still applies; do not independently impose a browser scene merely because an Action creates or updates a resource.

The compiler traverses nested DTO/object values and array elements, including framework lazy and chained schema composition. It removes readonly definitions as well as submitted keys so a strict object does not reject them as unknown and a loose object or catchall cannot retain or validate them. Other unknown keys remain subject to the supplied Zod schema's normal policy; this is not blanket unknown-key removal. For example, a create request can prevent callers from supplying a line-item price while still accepting its quantity:

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

Use DTO projection to omit a field that the API must never accept or return. Use scene-aware `readonly` when a field belongs to the schema but must be removed from caller input for that backend contract. Writable fields retain their normal parsing and requiredness. Object-level checks see the projected input, while intentional output transforms remain intact: there is **no final readonly scrub** of the parsed result. A transform may deliberately produce a server-computed property with the same name as a removed caller-input property; that is not caller write authority. This input compilation is not response serialization; response payload shaping remains a separate concern in the [Serialization Guide](/backend/serialization-guide).

### MCP transport and client projection

MCP retains JSON/protocol boundary validation and dispatches through the ordinary guarded API path for **one semantic parameter parse**. It does not run a native preflight parse in the mapper or reparse arguments to diagnose a JSON-contract failure. This avoids executing defaults, refinements or transforms twice. Actual API parameter-validation failures can yield bounded, safe public-path diagnostics; a JSON-only rejection uses a generic root diagnostic rather than guessing a field. See [MCP arguments and results](/mcp/mcp-controller-tools#arguments-and-results).

Known readonly properties remain optional, unconstrained slots in the MCP **input transport contract**, even when the original DTO property was required. Descriptive metadata and `rest` metadata remain in the full `cabloy_tool_contract` input schema; ordinary tool declarations sanitize schema-position `rest`. This transport representation does not make the property writable: clients should omit it, and the backend strips it before semantic parsing.

For both create and update, a client projects values recursively against the selected operation's current contract, omitting readonly and undeclared data at every object/array depth without inventing defaults. Preserve admitted writable nested IDs and deletion controls; never remove fields solely because they are named `id` or `deleted`. Visibility does not select the writable set, and a client must not independently choose browser scenes. Full CRUD updates still need a fresh complete authorized read and preservation of unrelated writable state; projection alone is not permission, concurrency control or replay safety. MCP scopes, Action guards, business authorization and instance/data scope remain independent.

A useful distinction is:

- `v.optional` means the field may be omitted
- `v.nullable` means the field may carry a real `null`

For named query conveniences, `v.optional(), v.nullable()` can preserve a real `null` for conversion into an admitted null-check predicate. The canonical public AST instead uses explicit `isNull` / `isNotNull` leaves without `value`; it never treats `eq: null` as a null-check shorthand.

## `@Arg.filter`

`@Arg.filter` connects a policy-bound request DTO to native validation and named-filter normalization. Its output is **public canonical query input**, not trusted `IQueryParams`. A Resource controller must compile it through `$compileQuery` together with the current Action's trusted scope before passing trusted ORM parameters to its service; the service does not recompile them as public input. Dedicated self-service methods with explicit caller identity and their own business scope may still own compilation. See [Public Query Guide](/backend/public-query-guide) for the complete language, typed/null/date semantics, budgets and mandatory scope boundary.

Associate a static `$defineQuery` policy before Action/schema construction with `@Dto({ query: studentQuery })` and `$Dto.queryPage(studentQuery, namedKeys)`. Predicate fields/operators, order fields and response projection are independent of the named UI field set. Supplied named filters become canonical contributions combined with explicit `where` by **AND**, never raw-`where` precedence.

HTTP GET JSON-decodes `where`, `orders`, `groups` and `aggrs` once; MCP supplies native JSON. Canonical AST validation disables broad recursive coercion, so numeric/Boolean string operands remain invalid. Named conveniences keep their own input decoding. Unknown controls, legacy property-keyed predicates, underscore operators, malformed/mixed nodes and unsupported operands fail closed. Current fixed-projection contracts reject client `columns`.

### Analysis action modes

A DTO can attach both the query policy and one shared `$defineAnalysis` policy through `@Dto({ query: studentQuery, analysis: studentAnalysis })`. Select, group and aggregate have separate contracts:

```typescript
async select(
  @Arg.filter(DtoStudentSelectReq) params: TypeQueryInput<typeof studentQuery>,
) {
  return await this.scope.service.student.select(
    $compileQuery(this.scope.model.student, studentQuery, params),
  );
}

async group(
  @Arg.filter(DtoStudentSelectReq, { mode: 'group' })
  params: TypeQueryGroupInput<typeof studentQuery, typeof studentAnalysis>,
) {
  return await this.scope.service.student.group(
    $compileQuery(this.scope.model.student, studentQuery, params, {
      mode: 'group',
      analysis: studentAnalysis,
    }),
  );
}

async aggregate(
  @Arg.filter(DtoStudentSelectReq, { mode: 'aggregate' })
  params: TypeQueryAggregateInput<typeof studentQuery, typeof studentAnalysis>,
) {
  return await this.scope.service.student.aggregate(
    $compileQuery(this.scope.model.student, studentQuery, params, {
      mode: 'aggregate',
      analysis: studentAnalysis,
    }),
  );
}
```

Group mode derives `groups` and `aggrs` controls from the analysis policy; aggregate derives `aggrs` only. Each Action has its own schema without mutating ordinary select. Select rejects analysis controls. Group and aggregate reject irrelevant list controls (`orders`, `columns`, `pageNo`, `pageSize`) instead of accepting and ignoring them.

For GET, structured controls are JSON query values: `groups=["level"]` and `aggrs={"count":["imageId"]}` before URL encoding. Generated API calls accept structured values and use the existing query encoder. Malformed JSON, empty selections, duplicate fields, unsupported functions/columns, or any `groups` on aggregate are invalid. Omitted `groups` and `aggrs` independently use Action defaults; explicit empty input never means “use the default.”

These abbreviated Student controller methods show compilation without an RBAC row predicate. For a Resource Action configured for RBAC data scope, inject `@Arg.rbacScopeCurrent()` and add `scopeWhere: rbacScopeCurrent.where()` to the compiler options for that exact Action. Never pass public AST input to `rbacScopeCurrent.where(params.where)`. The service receives trusted `TypeAnalysisGroupParams<typeof analysisPolicy>` / `TypeAnalysisAggregateParams<typeof analysisPolicy>` and invokes `$executeAnalysisGroup` / `$executeAnalysisAggregate` without public-query recompilation. These execution helpers retain their trusted internal API and revalidate analysis controls. The compiler supplies the same policy validation and mandatory server-scope boundary used by list execution; client OR/NOT cannot replace it. Services retain business authorization; main-model instance/deleted scope remains active. Only fixed server-declared related aliases are public query capabilities; arbitrary client joins, expressions, custom aliases and `having` are not.

The analysis defaults remain `maxGroups: 3`, `maxMetrics: 10`, `maxGroupRows: 1000`, with deliberate policy overrides possible. Group execution uses deterministic dimension ordering and reads cap+1 rows to detect overflow. Invalid analysis selections and overflow produce deliberate `422` errors, not silent truncation. These result limits do not bound database scan/aggregation cost and apply alongside the public query budgets.

The derived schemas expose `filter.capabilities.query` and action-specific `filter.capabilities.analysis`, without model/class references. Regenerate affected consumers after backend changes. See [CRUD Workflow](/backend/crud-workflow#grouping-and-statistics), [DTO Infer and Generation](/backend/dto-infer-generation#aggregate-and-group-dto-inference) and [Bounded analysis APIs](/backend/orm-aggregate-group-guide#bounded-client-selectable-analysis-apis).

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
