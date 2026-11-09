# Public Query Guide

Use this contract for client-supplied resource queries over HTTP, generated Zova APIs and opted-in MCP Controller tools. It is a bounded JSON language compiled into the existing ORM, **not** a JSON serialization of trusted ORM parameters.

The backend owns the query policy, mandatory row scope and response shape. Clients choose only among the capabilities admitted by that Action. There is no legacy raw-`where` fallback or alternate public ORM language.

## Public input versus trusted ORM

| Public Action input                                                             | Trusted server ORM                                               |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Policy-bound `TypeQueryInput`, `TypeQueryGroupInput`, `TypeQueryAggregateInput` | `IQueryParams`, `TypeModelWhere`, internal analysis parameters   |
| Explicit predicate nodes and structured orders                                  | Property-keyed predicates, underscore operators and tuple orders |
| Logical fields positively admitted by the Action                                | Server-authored model/table/column references                    |
| No SQL, Raw, Ref, callbacks, arbitrary joins or subqueries                      | Rich ORM features available to trusted service code              |

Keep trusted examples in the [ORM Select Guide](/backend/orm-select-guide) and [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide) distinct from request examples. Never forward a request object directly to `model.selectAndCount()` or cast public input to `IQueryParams`.

## Define capabilities before request handling

Define a static `$defineQuery(() => ModelX, config)` policy, associate it with the DTO, and derive controls with `$Dto.query(...)` or `$Dto.queryPage(...)`. An illustrative policy for a resource whose Entity defines these fields is:

```ts
export const reportQuery = $defineQuery(() => ModelReport, {
  name: 'ReportSelect',
  fields: {
    id: { operators: ['eq', 'in'] },
    name: { operators: ['eq', 'containsI', 'in'] },
    description: { operators: ['containsI', 'isNull', 'isNotNull'] },
    createdAt: { operators: ['gte', 'lt'] },
  },
  orderable: ['id', 'name', 'createdAt'],
  conveniences: {
    name: { field: 'name', op: 'containsI' },
    createdAt: { field: 'createdAt' },
  },
  defaults: { orders: [{ field: 'id', direction: 'asc' }] },
  projection: { mode: 'fixed' },
});

@Dto({
  query: reportQuery,
  fields: {
    name: $makeSchema(v.optional(), z.string()),
    createdAt: $makeSchema(v.filterTransform('a-web:dateRange'), v.optional(), z.string()),
  },
})
export class DtoReportSelectReq extends $Dto.queryPage(reportQuery, ['name', 'createdAt']) {}
```

Here `description` must be nullable in the effective field schema to admit null checks. This is an authoring example, not the exact allowlist of every generated resource or Student Action. Preserve intentional endpoint defaults when migrating an existing resource.

The optional `name` supplies a stable recursive schema identity; it defaults to the Model class name. Give distinct policies over the same Model distinct stable names so different Action capabilities do not collide in emitted predicate references.

The policy separates independent capabilities:

- `fields` admits predicate fields and each field's operators.
- `orderable` admits sorting independently of filtering or the named UI form.
- `projection: { mode: 'fixed' }` leaves response fields server-owned.
- `defaults` and `limits` bound execution controls.
- `conveniences` maps named UI inputs to canonical fields/operators; fixed related aliases additionally need server-owned `bindings`.
- A separate `$defineAnalysis` policy admits group dimensions and metrics.

Adding an Entity property does **not** automatically make it queryable. A field may be filterable without being returned, returned without being filterable, or sortable without having a named filter input. Named DTO fields are a small form-oriented convenience surface, not the definition of the advanced field set.

`$defineQuery()` resolves its primary Model and binding-model field metadata during policy construction. A class callback does not make that resolution lazy, and a string Model identifier does not load or register the target module. Use public package exports for cross-module class references and verify actual startup after initialization-sensitive changes; see [Cross-module imports and initialization](/backend/module-dependencies#cross-module-imports-and-initialization).

The policy is startup-stable capability metadata, not RBAC or row authorization. Do not capture a current user, active instance or request in its definition. Operand schemas derive from effective model/Entity field truth, without blindly inheriting write defaults, requiredness, input-length minimums or write transforms. Use an explicit query-owned scalar schema/type adapter where needed; unsupported scalar schemas must not silently become unconstrained operands.

## Predicate language

A select request can contain:

```json
{
  "where": {
    "and": [
      { "field": "name", "op": "containsI", "value": "alice" },
      {
        "or": [
          { "field": "description", "op": "containsI", "value": "100%" },
          { "field": "description", "op": "isNull" }
        ]
      }
    ]
  },
  "orders": [{ "field": "createdAt", "direction": "desc" }],
  "pageNo": 1,
  "pageSize": 20
}
```

Every node has exactly one strict shape:

- `{ field, op, value }`
- `{ field, op: 'isNull' | 'isNotNull' }`, with **no** `value`
- `{ and: [predicate, ...] }`
- `{ or: [predicate, ...] }`
- `{ not: predicate }`

Boolean arrays are nonempty. Omit `where` when there is no client restriction; `where: {}` is invalid. Repeated fields belong in separate leaves, not duplicate JSON keys. Reject mixed node shapes, unknown properties, fields and operators, malformed operands and old underscore operators. A public field is a logical identifier, not a table name, dotted relation path or SQL expression.

### Operators and typed operands

The following are eligible operator families; an individual policy usually admits a smaller subset:

| Field kind                                      | Eligible operators                                              |
| ----------------------------------------------- | --------------------------------------------------------------- |
| String                                          | `eq`, `ne`, `in`, `notIn`, `contains`, `startsWith`, `endsWith` |
| Explicitly admitted insensitive string matching | `eqI`, `containsI`, `startsWithI`, `endsWithI`                  |
| Number, decimal, date, timestamp                | `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`             |
| Boolean                                         | `eq`, `ne`                                                      |
| Enum / identity                                 | `eq`, `ne`, `in`, `notIn`                                       |
| Nullable field or nullable fixed related alias  | Additionally `isNull`, `isNotNull`                              |

There is no implicit equality, scalar-to-list conversion or wildcard syntax. Canonical operands use native JSON types: a numeric field needs `2`, not `"2"`; a Boolean needs `true`, not `"true"`. Identity values follow the application's configured identity representation. Precision-preserving decimal operands use validated decimal strings, not lossy JavaScript numbers. Enum values must match the admitted schema.

Lists for `in` / `notIn` are nonempty, bounded and contain values of the admitted field type, without `null`. Do not infer Boolean membership support from the existence of Boolean operands: Boolean fields currently admit `eq` / `ne` only.

### Null and SQL logic

Use `isNull` and `isNotNull` explicitly. Neither `{ field: 'description', op: 'eq', value: null }` nor `null` inside a membership list is valid.

SQL three-valued logic is preserved: `ne`, `notIn` and `not` do **not** automatically include SQL-null rows. To match both a nonmatching value and null, use an explicit `or` between the comparison and an admitted `isNull` leaf. Omission means no condition; it does not mean a null check.

### Literal string matching

Public string matching treats `%`, `_` and the escape character `!` literally. The compiler supplies the pattern for `contains`, `startsWith` and `endsWith`; clients supply the desired text, not SQL LIKE patterns. For example, `containsI` with `"100%"` searches for the literal percent sign.

Insensitive operators retain supported database/dialect case and collation behavior. They do not promise identical Unicode case folding or normalization across databases. Trusted ORM pattern operators have their own semantics and are not changed by this public contract.

### Dates and timestamps

- A date-only operand is a calendar date such as `"2026-11-09"`.
- A timestamp operand is an ISO date-time with an explicit offset, such as `"2026-11-09T00:00:00Z"` or `"2026-11-09T08:00:00+08:00"`. A local timestamp without an offset is invalid.
- Date-range UI inputs use the existing request-timezone-aware adapter, producing a lower-inclusive and upper-exclusive interval (`gte` / `lt`), including the selected end day.

For example, where both operators are admitted:

```json
{
  "where": {
    "and": [
      { "field": "createdAt", "op": "gte", "value": "2026-11-01T00:00:00Z" },
      { "field": "createdAt", "op": "lt", "value": "2026-12-01T00:00:00Z" }
    ]
  }
}
```

Ranges use ordinary comparisons; there is no additional public `range` or `between` operator.

## Orders, projection and pagination

`orders` is an ordered, nonempty array of `{ field, direction: 'asc' | 'desc' }`. Fields must be in the Action's order allowlist; duplicates and tuple orders are invalid. Omission uses the endpoint's defaults. The compiler appends the owning resource's `id` ascending when absent, providing a stable tie-breaker, and requests null-last ordering for nullable sort fields through the dialect abstraction. Stable ordering is not a snapshot guarantee across concurrent writes.

Current policies use **fixed projection**. Client `columns` is rejected, not ignored and not allowed to cause response-validation failure later. Services retain their deliberate response columns, relation loading, serialization and envelopes. Filtering permission does not grant output permission. This contract does not provide general selectable projection.

`pageNo` and `pageSize` are positive safe integers. Shared defaults are page 1, size 20, maximum size 100 unless the endpoint explicitly sets other supported limits. Computed offset arithmetic must remain safe. Pagination does not authorize reading otherwise hidden records.

An explicit `pagination: false` policy is available for an intentional existing unpaged Action (for example, the test `findAll` contract). It omits paging capabilities, rejects supplied `pageNo` / `pageSize`, and compiles without an ORM limit/offset. Do not apply it as a workaround for page-size or query budgets; ordinary resource lists remain paged, and other budgets still apply.

Not every public endpoint enables advanced controls: an intentionally restricted Action may expose only named filters and paging. Read its actual request schema, not another resource's policy, to decide whether it accepts `where` or `orders`.

## Named UI filters compose, not override

`@Arg.filter` validates named inputs using their DTO schemas, converts them into canonical predicate contributions, and combines:

```text
explicit where AND every supplied named-filter predicate
```

An explicit leaf for `name` does not suppress the named `name` transform. Supplying contradictory restrictions simply yields no matching rows. A transform returns a canonical predicate contribution; it must not mutate arbitrary trusted ORM parameters.

UI names need not be canonical field names. For example, Record's named `studentId` text input searches the fixed `studentName` alias; canonical `studentId`, when separately admitted, remains an identity comparison. Use declared mappings rather than assuming that every UI input's text is the advanced operand for a same-named field. Clearing a UI control omits its restriction; schema-driven UI metadata grants no extra backend capability.

Related-field mappings belong in policy `bindings` and `conveniences`, not the removed `v.filter` options `table`, `joinType`, `joinOn`, or `originalName`, nor DTO-level `openapi.filter.table`. The binding's own `joinType` remains supported. See [Existing Resource Field Update](/backend/resource-field-update#filter-and-sort-a-relation-by-its-display-field) for a complete binding and named-filter example.

`v.filter` itself remains available, including filter transforms and capabilities. For the base named-filter transform, operator selection remains: explicit convenience `op`, then a recognized legacy `v.filter({ op: ... })` mapping, then `containsI` for strings or `eq` otherwise. The selected canonical operator must still be admitted by the policy; metadata cannot grant a new capability. This compatibility behavior does not permit legacy underscore operators in client-supplied canonical predicates, and it does not change trusted internal ORM joins.

## Compile at the Resource action boundary

A Resource controller prepares the public query together with the current Action's RBAC data scope. `@Arg.filter` returns public canonical input, not trusted ORM parameters; call `$compileQuery` before handing it to the resource service:

```ts
// Resource controller, for a resource with configured owner/department data scope
@Web.get()
@Passport.rbac({ dataScope: true })
async select(
  @Arg.filter(DtoReportSelectReq) params: TypeQueryInput<typeof reportQuery>,
  @Arg.rbacScopeCurrent() rbacScopeCurrent: IRbacScopeAccess,
) {
  const compiled = $compileQuery(this.scope.model.report, reportQuery, params, {
    scopeWhere: rbacScopeCurrent.where(),
  });
  return await this.scope.service.report.select(compiled);
}

// Resource service: trusted internal contract, not an HTTP request type
async select(params?: IQueryParams<ModelReport>) {
  return await this.scope.model.report.selectAndCount(params);
}
```

The service accepts these trusted ORM parameters without recompiling them as public input. Internal server callers may also supply deliberate trusted ORM parameters; untrusted request objects must never reach this contract directly. For a Resource Action without RBAC data scope, compilation is still required, but no RBAC row predicate needs to be invented.

`scopeWhere` is a **trusted ORM** predicate. Never pass the public AST into `rbacScopeCurrent.where(params.where)` (or raw request `where`); use `scopeWhere: rbacScopeCurrent.where()` instead. The compiler revalidates canonical input, enforces policy capabilities/budgets and checks that policy and model match, then composes:

```text
mandatory server scope AND canonical client predicate
```

Never spread client predicates over ownership/state/visibility predicates. Client OR/NOT stays inside the client restriction and cannot replace server scope. Apply required scope before pagination or aggregation, never by filtering results afterward. ORM-owned instance and soft-delete constraints remain active. Controller preparation does not move business authorization out of services: services still enforce their business rules and any additional ownership/state/visibility restrictions.

### Dedicated business-scoped service contracts remain valid

This Resource handoff is not a ban on services accepting public query business contracts. A dedicated self-service method may own compilation when it accepts explicit caller identity and defines its own mandatory business scope, rather than depending implicitly on the current Resource Action's RBAC decision:

```ts
async selectMine(userId: TableIdentity, input?: TypeQueryInput<typeof reportQuery>) {
  const model = this.scope.model.report;
  const compiled = $compileQuery(model, reportQuery, input, {
    scopeWhere: { ownerId: userId },
  });
  return await model.selectAndCount(compiled);
}
```

The self-service controller supplies `user.id` from `@Arg.user()`, never a query/body identity. Keep any additional business authorization in this service. Such a contract compiles its public input once with its business scope; it must not recompile already-trusted Resource ORM parameters. See [Service Guide](/backend/service-guide#pass-user-identity-explicitly).

Fixed related-field bindings are server-owned and target a deterministic scalar/id relationship. The complete Boolean filter is evaluated in one main-ID membership subquery, avoiding parent-row fan-out and preserving repeated-field, OR and NOT semantics. Related models retain their instance/deleted scope; additional business visibility still needs a deliberate server-side design. This is not arbitrary joins, many-side traversal or a public relation graph. Response `include` remains independent of parent membership. Declare and verify cross-model cache dependencies when related-source mutations affect warmed queries; see [Cache Guide](/backend/cache-guide#cross-model-query-cache-dependencies).

## Group and aggregate Actions

Attach both `query` and `analysis` policies to the reused SelectReq DTO. `@Arg.filter(SelectReq, { mode: 'group' })` accepts canonical/named filters plus admitted `groups` and `aggrs`; aggregate accepts filters plus `aggrs` only. Compile with the corresponding mode and analysis policy before using `$executeAnalysisGroup` or `$executeAnalysisAggregate`.

Analysis Actions reject `orders`, `columns`, `pageNo` and `pageSize`; these controls are not validated-and-ignored list options. Ordinary select rejects analysis controls. Analysis uses the full scoped matching population, not the current list page, with server-owned grouped ordering and result caps. Trusted internal analysis helpers retain their richer ORM API. See [CRUD Workflow](/backend/crud-workflow#grouping-and-statistics) for analysis policy and response inference.

## HTTP, MCP and discovery

HTTP GET JSON-decodes structured system controls (`where`, `orders`, `groups`, `aggrs`) once. For example, before URL encoding:

```text
where={"field":"name","op":"containsI","value":"alice"}
orders=[{"field":"createdAt","direction":"desc"}]
```

Generated APIs accept structured values and perform query encoding. Named HTTP form inputs retain their own decoding; this does **not** enable recursive string-to-number/Boolean coercion inside the AST. HTTP paging text is parsed as positive integer text before native validation.

MCP arguments are native JSON objects/arrays/numbers, not JSON strings embedded inside arguments. HTTP and MCP reach the same canonical validator/compiler and scope boundary. MCP input grouping still follows the Action's path/query/body locations; a query-only Action is flat. MCP is not a more privileged query language.

The policy supplies named recursive predicate schemas and public `filter.capabilities.query` metadata: admitted fields/operators, value kinds/nullability, orderability, fixed projection, pagination mode, defaults, limits and convenience mappings. Operand alternatives in the emitted schema carry value constraints/enums. Existing OpenAPI operations, generated SDKs, current Zova schema facades and opted-in MCP `inputSchema` are the discovery surfaces; no separate capability endpoint or registry is needed. Backend model classes, tables and binding implementation details are not public capabilities. Regenerate consumers after changing backend truth, and reacquire locale-scoped schema facades through their current reactive owner rather than retaining stale localized snapshots.

## Combined query budgets and errors

Shared defaults, before endpoint-specific overrides:

| Budget                        | Default                                                       |
| ----------------------------- | ------------------------------------------------------------- |
| Serialized query data         | 8 KiB UTF-8                                                   |
| JSON value nodes              | 128                                                           |
| Value depth                   | 6; query root is depth 0, each object/array child edge adds 1 |
| Predicate depth               | 3, including the leaf                                         |
| Boolean children / list items | 32                                                            |
| Requested order clauses       | 5                                                             |
| String operand length         | 256                                                           |
| Page size                     | 100                                                           |

All limits combine: 32 list items or three predicate levels are not a guarantee that every surrounding structure also fits the byte, node and value-depth limits. Named-filter normalization is followed by a separately bounded expansion check; it is not an unbounded way around the compiler budget. These bounds reduce accepted query complexity, not database scan cost or a guaranteed response time.

MCP additionally bounds the **complete transport envelope**, including JSON-RPC and argument wrappers. A semantic query under its own budgets can still exceed transport bytes/depth/nodes; HTTP has its own ingress limits. Keep representative complete calls within both sets of limits rather than raising transport limits to accommodate an assumed query maximum.

Invalid controls, legacy shapes, operands and budgets fail closed. Reviewed HTTP query-validation errors return status/code `422` and `errors: { queryCode, path }`; the path is bounded to 256 characters. Opted-in MCP tools expose reviewed query diagnostics through their invalid-arguments error data so clients can repair input. Do not treat database, authorization or unexpected failures as query diagnostics, and do not expose SQL, operand values or hidden-field catalogs. See [Validation Guide](/backend/validation-guide#arg-filter) and [MCP Controller Tools](/mcp/mcp-controller-tools).

## Connected reading

- [DTO Guide](/backend/dto-guide) and [DTO Infer and Generation](/backend/dto-infer-generation) for policy-bound DTO authoring.
- [CRUD Workflow](/backend/crud-workflow) for the generated contract thread.
- [Filter to Query to Select Data Flow](/frontend/filter-query-select-data-flow-guide) for Zova state ownership and structured query assembly.
- [MCP Controller Tools](/mcp/mcp-controller-tools) for discovery, native arguments and independent business authorization.
