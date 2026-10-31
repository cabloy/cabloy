# CRUD Workflow

This guide explains the Vona CRUD generator workflow in the Cabloy monorepo.

## Why this page matters

CRUD is one of the clearest places where Cabloy’s CLI-first philosophy pays off.

Instead of creating controller, service, model, entity, DTO, metadata, locale, and test files by hand, Vona already provides generators that create the initial backend thread.

> [!NOTE]
> The fullstack tutorial series intentionally uses a standalone `demo-student` sandbox so readers can experiment without colliding with the repo's real suite-owned `a-training/training-student` implementation.
> This guide, by contrast, uses the current repo implementation as its compact specimen.

## Generate a CRUD skeleton

Example: generate a CRUD workflow for `student` in module `training-student`.

```bash
npm run vona :tools:crud student -- --module=training-student
```

A lighter variant also exists:

```bash
npm run vona :tools:crudBasic student -- --module=training-student
```

This is important because the repo already encodes both the full CRUD thread and a lighter CRUD-basic workflow in the CLI surface.

## Grouping and statistics

The Basic and Start CRUD generators provide `group` and `aggregate` read actions by default, alongside ordinary `select`:

```bash
npm run vona :tools:crud report -- --module=demo-report
```

The direct `:tools:crudBasic` and `:tools:crudStart` commands use the same default. There are no `--aggregate` or `--groupBy` options; edit the generated policy to configure analysis capabilities.

| Generated action | Default result                           |
| ---------------- | ---------------------------------------- |
| `GET select`     | Resource records and pagination metadata |
| `GET group`      | One row per name, with `count_all`       |
| `GET aggregate`  | One object with `count_all`              |

The generator exports one shared analysis policy in `src/lib/<resourceName>Analysis.ts`:

```typescript
export const reportAnalysis = $defineAnalysis(() => ModelReport, {
  groups: ['name'],
  aggrs: { count: ['*'] },
  defaults: {
    group: { groups: ['name'], aggrs: { count: ['*'] } },
    aggregate: { aggrs: { count: ['*'] } },
  },
  limits: { maxGroups: 3, maxMetrics: 10, maxGroupRows: 1000 },
});
```

Default API generation does not expose every Entity field. The initial allowlist contains only `name` and `count('*')`; it does not automatically allow `description`, identity fields, timestamps, or numeric metrics. Callers can select combinations only within that backend-owned policy, not arbitrary model columns or SQL expressions. No analysis capability fields are added to the Entity.

Fresh CRUD entities contain `name`, so name grouping provides a runnable starting point, not a universal business default. Refine the policy to use meaningful dimensions such as status, category, or level as the resource evolves. Choose dimensions with suitable cardinality: grouping by a nearly unique name can return almost as many groups as records. Generated group actions do not provide group pagination or a group-count total.

These commands create new resources and refuse an existing controller. Do not rerun them against the existing `training-student` resource to add actions. For an existing resource, define its policy and reuse it in the request DTO, response DTOs, and service; the Student reference uses its already-defined `level` field.

### Query and response boundaries

`select`, `group`, and `aggregate` remain separate contracts:

- `select` returns resource records and existing pagination metadata.
- `group` returns group keys and metrics, not nested lists of resource records.
- `aggregate` returns metrics over all matching source records, not the current select page.

The actions reuse the resource's `SelectReq`; no separate `AnalysisReq` is generated. `@Dto({ analysis: resourceAnalysis })` attaches the shared policy, and `@Arg.filter(SelectReq, { mode: 'group' })` or `{ mode: 'aggregate' }` derives that action's controls without adding them to ordinary select. Select rejects explicit analysis controls. The service uses `$executeAnalysisGroup(model, policy, params)` or `$executeAnalysisAggregate(model, policy, params)`, which also revalidate controls for direct service callers.

A group request may select `groups: string[]` and `aggrs: { count?: string[]; sum?: string[]; avg?: string[]; min?: string[]; max?: string[] }`; an aggregate request accepts only `aggrs`. Every function and column must be allowed by the policy. Omitted controls independently use the action's defaults. Explicit empty selections, duplicates, unsupported functions/columns, and `groups` on aggregate fail validation rather than falling back or being stripped.

Named local business filters and raw `where` retain their existing semantics. A raw predicate for a field takes precedence over that field's named-filter transformation. List projection, ordering, and pagination controls are still parsed and validated, but do not change analysis: statistics cover all matching source rows, not the current select page. Filters that require joins are rejected for analysis; ordinary select can still use its existing joined filters. Client `having`, joins, expressions, and custom aliases are not analysis controls. Keep server-side instance, soft-delete, and business authorization scope; caller-supplied predicates are not an authorization boundary.

The default policy limits are 3 selected dimensions, 10 selected metric aliases, and 1000 group-result rows; a policy may set explicit limits. Group execution reads at most the row cap plus one and returns a deliberate `422` validation/resource-limit error on overflow, not a silently truncated result. These bounds do not limit the database work needed to scan or aggregate the matching population.

Response DTOs use `$Dto.analysisGroup(policy)` / `$Dto.analysisAggregate(policy)` to describe a finite **optional superset** of allowed keys. Each response includes only requested dimensions and aliases. Optional means unrequested; nullable means a real SQL null. If a business-specific policy adds a nullable dimension, preserve both optionality and nullability in its response contract and never synthesize an unrequested key.

Count aliases are decimal strings, normalized by the ORM query/cache boundary; non-count metrics are strings or SQL `null`. Services need no count-conversion helper. An empty group query returns `[]`; an empty aggregate count returns `"0"`. Missing dimension values are not synthesized into zero-valued groups.

### Student policy and GET controls

The Student reference exports this policy in `src/lib/studentAnalysis.ts`:

```typescript
export const studentAnalysis = $defineAnalysis(() => ModelStudent, {
  groups: ['level'],
  aggrs: { count: ['*', 'imageId'] },
  defaults: {
    group: { groups: ['level'], aggrs: { count: ['*'] } },
    aggregate: { aggrs: { count: ['*', 'imageId'] } },
  },
});
```

Its default `GET /api/training/student/group` counts by `level`, ordered by level. Its default `GET /api/training/student/aggregate` returns `count_all` and `count_imageId` (students with a non-null image reference). A caller can request only `count_imageId`, without receiving `count_all` as an extra field. `name`, mobile, and raw timestamps are not allowed dimensions merely because the Entity contains them.

For GET requests, encode array/object controls as JSON query values using the existing `combineQueries` convention. Generated API methods accept structured controls and handle that encoding. The equivalent raw request is:

```bash
curl --get 'http://localhost:7102/api/training/student/group' \
  --data-urlencode 'groups=["level"]' \
  --data-urlencode 'aggrs={"count":["imageId"]}'
```

Use the normal authenticated session for this protected action. Do not send comma-separated dimensions or JavaScript object text. Malformed JSON is invalid input. The existing `summary/:id` remains an individual Student summary, not population statistics.

Action request schemas expose finite enums and `filter.capabilities.analysis` with the public allowlist, action defaults, mode, and effective limits, including on emitted `groups` / `aggrs` parameter schemas. Model/class references are not public capabilities. See [DTO Infer and Generation](/backend/dto-infer-generation#aggregate-and-group-dto-inference), [Validation Guide](/backend/validation-guide#analysis-action-modes), and [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide).

### Authorization and source scope

The generated analysis actions inherit the `select` RBAC policy. Policy inheritance does not apply row filtering or copy data-scope options. Normal model instance and soft-delete predicates remain active.

For a resource that supports department/owner data scope, explicitly configure that scope and combine `rbacScopeCurrent.where(params.where)` **before** grouping or aggregation. Filtering group results afterward is not an authorization boundary. Do not enable ownership scope for Student or another resource that lacks the corresponding ownership fields. See [RBAC Authorization](/backend/rbac-authorization).

## Generated structure

The generator creates a connected set of files, typically including:

- controller
- service
- model
- entity
- create/update DTOs
- meta version and index files
- locale files
- tests

This is exactly why this generator should be the default starting point. It gives a consistent starting shape across the backend thread.

### Generated authorization default

The standard generated CRUD actions (`create`, `select`, `view`, `update`, and `delete`) each use `@Passport.rbac()`. Bulk delete inherits the `delete` policy. These guards authorize API execution independently of the generated SSR menu's visibility policy.

The guard is attached to individual actions rather than the controller class. When you add a custom action later, no local Passport guard intentionally means the global authenticated-and-activated baseline applies; it does not mean the action is public. Use `@Passport.public()` to intentionally allow anonymous access, or add a role/domain guard when an action needs stronger restriction.

SSR menu roles control navigation disclosure only. They never authorize a controller action, API, or resource; keep the action guard as the server-side authorization boundary. See [Controller AOP Guide](/backend/controller-aop-guide) and [Menu Guide](/backend/menu-guide).

### Generated mutation response default

Generated resource `update` and `delete` actions are command-style actions. Their controllers use `Promise<void>`, await the service call without forwarding its result, and declare `@Api.body(z.null())` so OpenAPI and generated SDKs describe the normal HTTP `200` success wrapper accurately as `data: null`.

This controller-facing default does not require the service or model mutation method to return `void`. Those lower layers may retain mutation data for internal orchestration. See [Controller Guide](/backend/controller-guide#resource-mutation-response-contract) when a mutation deliberately needs a consumer-facing response payload.

A practical generated-output checklist usually includes:

- controller
- service
- model
- entity
- create/update DTOs
- `meta.version`
- locale assets
- test file
- package-version update for the next schema step

That checklist is useful because it makes the generated thread easier to inspect after the CLI run instead of treating CRUD generation as a black box.

## The generated backend thread

The CRUD generator is not a shortcut around the architecture. It instantiates the same backend contract loop documented elsewhere.

A practical thread is:

1. controller exposes the HTTP contract
2. service owns orchestration
3. model owns persistence behavior
4. entity defines the field/data contract
5. DTOs define operation-specific request/response contracts
6. meta.version handles schema lifecycle
7. tests verify the resulting contract through action execution

Read this guide together with:

- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [Migration and Changes](/backend/migration-and-changes)
- [Unit Testing](/backend/unit-testing)

## Instance-scoped CRUD

Generated controller, service, and model flows retain Vona's default active-instance scope. In the current tenancy model, a tenant corresponds to an instance, so ordinary resource CRUD should not accept caller-controlled `iid` or tenant selection.

When a normal scoped view, update, or delete target is not found, preserve its absent/not-found semantics. Do not run an unscoped raw-table probe merely to discover whether another instance owns the same identifier and convert that result into `403`.

If a future requirement introduces multiple merchants inside one instance, model that as an explicit additional business boundary with its own ownership, authorization, relations, indexes, and tests. It does not replace the existing instance scope.

For the runtime tenancy boundary, see [Multi-Instance and Instance Resolution](/backend/multi-instance-and-instance-resolution). For model-level behavior and exceptional raw/builder usage, see [Model Guide](/backend/model-guide).

## Recommended workflow

1. run the CRUD generator
2. inspect the generated files
3. refine entity, DTO, model, service, and controller behavior for the real business case
4. verify routes, model behavior, migration behavior, and tests

A practical expectation is that the generated test should already help verify the full contract thread rather than only file existence. In other words, generation should leave you with something that can immediately participate in CRUD-oriented action testing, migration verification, and later OpenAPI/frontend contract refinement.

This is the preferred path because it preserves framework conventions first, then applies domain-specific refinement second.

## When to keep generated defaults vs refine them manually

A practical rule is:

- keep generated defaults when the backend thread already matches the business shape
- refine the generated code when response contracts, DTO behavior, controller metadata, model behavior, or test flow need stronger domain-specific semantics
- avoid replacing the generated thread wholesale unless the framework shape truly does not fit the use case

## Aggregate detail scaffolding

When the business shape is not a standalone CRUD resource but a master resource that owns a nested detail collection, use the master-detail generator instead of hand-wiring the relation and DTO thread.

Example:

```bash
npm run vona :tools:masterDetail student -- --module=training-student --detailModule=training-record --detailResourceName=record --relationName=trainingRecords --fk=studentId --detailMode=aggregate
```

This command is intended to scaffold the aggregate-detail thread that the `training-student` / `training-record` specimen demonstrates:

- master model `hasMany` relation
- master service `include` lifecycle
- master-side nested detail DTOs
- built-in `basic-details` bulk/row actions
- detail FK persistence and index wiring

For `--module` and `--detailModule`, use canonical Vona module relative names such as `training-student` and `training-record`, not package names such as `vona-module-training-student`.

### Two supported detail-module modes

Use `--detailMode=aggregate` when the detail module should remain entity/model/meta-only and should not expose its own standalone controller/service resource surface.

Use `--detailMode=standalone` when the detail module should participate in the master aggregate but also keep its own standalone resource surface.

A practical rule is:

- choose `aggregate` when the detail is owned and managed primarily inside the master workflow
- choose `standalone` when the detail also needs independent resource entry/use cases

The generator should be the default starting point for this pattern, and manual refinement should come afterward.

## Relationship to DTO inference and OpenAPI

The generated thread is also part of the broader contract-emission path.

That means generated entity, DTO, controller, and validation structure can feed:

- backend OpenAPI output
- DTO inference and generation
- frontend SDK generation

For the cross-stack side of this loop, also see [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## Generated workflow checklist

When you see a request like “create a student CRUD” or “scaffold backend resources,” the correct default should be:

1. inspect the Vona CLI
2. use `:tools:crud` or `:tools:crudBasic` if one matches the need
3. modify the generated output instead of hand-building the whole thread from scratch
4. verify the resulting migration, controller, and test path instead of stopping at file creation
