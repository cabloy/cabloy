# DTO Infer and Generation

This guide explains how DTO inference and generation work in Vona within the Cabloy monorepo.

Use this page when your question is not only “what is a DTO?”, but also:

- when should a DTO stay explicit?
- when should a DTO be inferred?
- when should I wrap an inferred shape in a named DTO class?
- how do inferred DTO choices show up in generated metadata and downstream contract flow?

## Why DTO inference matters

DTOs are essential for validation and OpenAPI metadata, but manually maintaining them becomes expensive and error-prone as models, filters, and relationships grow more complex.

Vona addresses that by dynamically inferring and generating DTOs from model structure and query shape.

That gives you a more useful spectrum than a simple “handwritten or not” decision:

- fully explicit named DTO classes
- inline inferred DTOs
- named DTO classes that wrap inferred helper surfaces

This is one of the most important practical distinctions in the backend contract loop.

## This page’s role in the backend reading chain

A practical split is:

- [DTO Guide](/backend/dto-guide) explains DTOs as named contract artifacts
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain) shows how one real module is wired end-to-end
- this page explains how DTO shapes are chosen, inferred, wrapped, and surfaced in generated metadata

That means this page is the DTO-mechanics deep dive, not the full module specimen page.

## DTO tools

Several DTO-oriented tools are available, including:

- `$Dto.get`
- `$Dto.listAndCount`
- `$Dto.query`
- `$Dto.queryPage`
- `$Dto.create`
- `$Dto.update`
- `$Dto.aggregate`
- `$Dto.group`

These tools let DTOs emerge from model-aware structure instead of always being hand-authored from scratch.

## Three useful DTO shapes to distinguish

### 1. Explicit named DTO classes

Use this shape when the contract should be a stable named artifact with strong public identity.

Typical reasons:

- the contract is long-lived and reused broadly
- the contract needs stronger customization
- the contract should be easy to find and discuss by name

### 2. Inline inferred DTOs

Use this shape when the contract closely follows model or query truth and only one action needs it.

Typical reasons:

- one endpoint needs one inferred relation-aware shape
- a separate named class would add little value
- the contract is more about one query result than about a reusable domain artifact

### 3. Named DTO classes that wrap inferred helpers

This is the most practical middle ground in real Cabloy code.

The class stays explicit and discoverable, but its shape is derived from model/entity/query truth through `$Dto.*` helpers.

That means the contract can be:

- readable by name
- reusable by other code and docs
- still close to model and query truth rather than manually duplicated

## When each inferred DTO shape is useful

A practical mental model is:

- use `$Dto.get` for one-item read contracts
- use `$Dto.listAndCount` for list-plus-total contracts
- use `$Dto.query` and `$Dto.queryPage` for query-input or query-result patterns
- use `$Dto.create` and `$Dto.update` for write contracts derived from model structure
- use `$Dto.aggregate` and `$Dto.group` for summary-oriented result shapes

This matters because different ORM operations naturally produce different API contracts.

## Default read shape versus a public projection

`$Dto.get(() => ModelX)` defaults to the complete model-aware Entity read shape, including inherited framework fields such as `iid` and `deleted` when the Entity defines them. This is the ordinary read baseline, not an automatic public-payload minimization policy.

Use `columns` when an endpoint genuinely needs a smaller one-off business, query, or response projection. Use `dtoClass` when that curated read surface is named and reusable, especially for nested relation contracts. Do not add either solely to remove `iid` or `deleted` from an otherwise complete `$Dto.get(...)` shape.

This differs from top-level `$Dto.create(...)` and `$Dto.update(...)`. Their default omission of identity, active-instance, soft-deletion, and lifecycle fields establishes a write-input authorization boundary: callers must not supply those framework-owned values. That write policy does not imply that ordinary read DTOs need the same narrowing.

A narrowed DTO or emitted OpenAPI schema declares the supported contract, but does not by itself prove that an already-built HTTP response object is projected or stripped at runtime. When actual payload minimization is required, deliberately shape the returned data or apply a verified response-output policy, then verify the action response. See [Serialization Guide](/backend/serialization-guide) for response transformation behavior.

## When inference should replace handwritten DTOs

A practical rule is:

- prefer inferred DTOs when the contract closely follows model structure or query shape
- prefer explicit DTO classes when the contract is long-lived, heavily customized, or needs a strong named public identity
- wrap inferred DTOs into named DTO classes when reuse becomes more important than one-off convenience

A practical reading takeaway is:

> the best default is often not “handwritten DTO or no DTO.” It is “named DTO class backed by the right inferred helper.”

## Default-first three-layer DTO authoring

The three DTO shapes above classify the public artifact: explicit named DTO, inline inference, or a named class that wraps inference. They do not describe how to author an inferred contract.

When an Entity, Model, relation, or query shape already owns stable contract truth, start from that truth instead of redeclaring its fields. Define the DTO projection first, then add only the smallest DTO-local difference. This preserves inherited validation, titles, OpenAPI metadata, and render metadata wherever they still apply.

### Layer 1: project upstream truth

Use the operation-appropriate `$Dto.*` helper to establish the baseline contract. Then choose the narrowest projection mechanism:

- use the default inferred shape when all relevant model-aware fields belong in the DTO
- use `columns` for a simple local field subset, including the exclusion of server-owned fields
- use `include` to bring a relation-aware shape into the DTO
- use `dtoClass` when a top-level or nested relation needs a reusable, named field surface

For example, `DtoStudentSelectReq` starts from an Entity-backed query projection:

```typescript
export class DtoStudentSelectReq extends $Dto.queryPage(EntityStudent, [
  'name',
  'level',
  'createdAt',
]) {}
```

A relation-aware DTO can use `columns` and `include` to curate its baseline without restating each field decorator:

```typescript
export class DtoDetailRecordBase extends $Dto.get(() => ModelRecord, {
  columns: ['id', 'name', 'subjectCount', 'totalScore', 'averageScore'],
  include: { trainingRecordSubjects: true },
}) {}
```

Use `dtoClass` when that curated surface is itself reusable. For example, a detail mutate DTO can take its field surface from `DtoDetailRecordBase`, and a parent create DTO can include that named detail contract:

```typescript
export class DtoDetailRecordMutate extends $Dto.mutate(() => ModelRecord, {
  dtoClass: DtoDetailRecordBase,
  include: { trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectMutate } },
}) {}

export class DtoStudentCreate extends $Dto.create(() => ModelStudent, {
  include: { trainingRecords: { dtoClass: DtoDetailRecordMutate } },
}) {}
```

When a field genuinely does not belong to an API's business read or write contract, exclude it through the projection; do not rely on visibility metadata to hide a field that the API must not accept or return. Do not add a projection solely to remove framework read fields such as `iid` or `deleted` from an otherwise complete `$Dto.get(...)` shape; see [Default read shape versus a public projection](#default-read-shape-versus-a-public-projection).

### Layer 2: overlay metadata or refine the schema

For a field already supplied by the projection, use the `fields` map on `@Dto(...)` rather than redeclaring the property:

- use `$makeMetadata(...)` when only field metadata changes, such as title, order, visibility, serialization, or render behavior; the inherited schema and validation remain authoritative
- use `$makeSchema(...)` when optionality, validation, enum members, preprocess/transform behavior, or another schema structure must change; it replaces or refines the runtime field schema while preserving the framework's inherited OpenAPI metadata merge

`DtoStudentSelectReq` demonstrates schema refinement for query input:

```typescript
@Dto({
  fields: {
    name: $makeSchema(v.optional(), z.string()),
    level: $makeSchema(v.optional(), z.number()),
    createdAt: $makeSchema(v.filterTransform('a-web:dateRange'), v.optional(), z.string()),
  },
})
export class DtoStudentSelectReq extends $Dto.queryPage(EntityStudent, [
  'name',
  'level',
  'createdAt',
]) {}
```

`$makeSchema(...)` applies schema-like arguments right-to-left. Keep the final structure-defining schema, such as `z.string()`, `z.number()`, `v.object(...)`, or `v.array(...)`, last in authoring order. Treat optionality, nullability, defaults, preprocess/transform wrappers, objects, and arrays as structure-shaping rather than metadata-only, and verify emitted schema/OpenAPI output after changing them.

Framework DTO composition preserves inherited OpenAPI metadata when a field schema is refined. That includes metadata such as titles, render information, and scene identity. It does **not** make structure-shaping schema-like arguments order-independent: keep the final structure-defining argument last and verify the effective schema rather than assuming a metadata merge can repair a reordered schema.

#### Virtual fields in the DTO fields map

The Layer 2 `$makeMetadata(...)` rule has a precondition: the field key must already be supplied by the inferred projection, whether through the `$Dto.*` base, `columns`, `include`, or `dtoClass`. It overlays metadata on that existing runtime schema.

A **true virtual DTO field** is a key added only through `@Dto({ fields })` and absent from that inherited projection. Define such a key with `$makeSchema(...)` and a final concrete Zod schema, even when its purpose is only to map a renderer to a nested source:

```typescript
const descriptionMarkdownField = $makeSchema(
  ZovaRender.fieldSource('content.descriptionMarkdown'),
  ZovaRender.field('basic-markdown:formFieldMarkdown'),
  v.optional(),
  z.string(),
);
```

`z.string()` establishes the virtual key's validation and emitted OpenAPI type. `fieldSource(...)` only maps the DTO-facing key to the canonical source path used by downstream schema-driven UI; it does not supply a type. `$makeMetadata(...)` alone has no inherited schema to overlay for a true virtual key, so its metadata is attached to an unconstrained fallback rather than a meaningful field schema.

Use a class-body `@Api.field(...)` member instead when the new field should be a declared, statically typed DTO property rather than a contract-only `fields`-map key.

`@Dto({ fields })` changes the runtime contract and metadata. It does not rewrite the TypeScript property type inferred from the `$Dto.*` base class. Do not add a duplicate `declare` field or a second field decorator solely to mirror a runtime schema restriction unless a separate static contract is genuinely required and is type-compatible with the inferred base.

### Layer 3: add contract-only fields

Declare a class member with `@Api.field(...)` only when the field is absent from the inferred projection. Typical examples are serializer-produced response fields, operation-local helper fields, or a separate nested representation.

```typescript
export class DtoStudentCreate extends $Dto.create(() => ModelStudent, {
  include: { trainingRecords: { dtoClass: DtoDetailRecordMutate } },
}) {
  @Api.field(v.optional(), v.array(DtoDetailRecordResItem))
  _trainingRecords?: DtoDetailRecordResItem[];
}
```

Do not manually redeclare an inferred field merely to adjust its title, renderer, validation, or schema. Use Layer 2 instead.

### When to use an explicit DTO from scratch

Inference first is a default strategy, not a requirement to force every DTO through `$Dto.*`. Use an explicit DTO deliberately when no stable upstream Entity, Model, relation, or query shape is suitable, for example:

- authentication, captcha, or behavior-focused commands
- webhook and third-party protocol payloads
- aggregate commands assembled from unrelated resources
- a public contract that must stay intentionally decoupled from persistence structure

If the inferred baseline would require pervasive exceptions or no longer makes the contract clearer, an explicit DTO is the better design.

## `training-student` as the decision specimen

The current `training-student` module is a strong specimen because it shows several different DTO choices in one compact family.

Relevant source files include:

- `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordBase.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordMutate.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/studentUpdate.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/studentView.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/studentSelectReq.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/studentSelectResItem.tsx`
- `vona/src/suite/a-training/modules/training-student/src/dto/studentSelectRes.tsx`
- `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`

### Create and update DTOs

Representative source facts:

- `DtoStudentCreate` extends `$Dto.create(() => ModelStudent)`
- `DtoStudentUpdate` extends `$Dto.update(() => ModelStudent)`

These are good examples of **named DTO classes that wrap inference**.

The mutation helpers also carry their conventional schema-scene identity into the DTO's Cabloy OpenAPI metadata:

| Helper             | Effective schema scene | Practical effect                                                    |
| ------------------ | ---------------------- | ------------------------------------------------------------------- |
| `$Dto.create(...)` | `form-create`          | Create-specific field metadata applies after the shared form layer. |
| `$Dto.update(...)` | `form`                 | Shared form field metadata applies directly.                        |

For `form-view`, `form-create`, and `filter`, field metadata resolves in this order: base `rest`, then the shared `rest.form` overlay, then the exact scene overlay. `table` has no shared-form overlay. For example, a field can remain read-only in normal form contracts while being enabled specifically for creation:

```typescript
@Dto({
  fields: {
    referenceNo: $makeMetadata(
      v.openapi({
        rest: {
          'form': { readonly: true },
          'form-create': { readonly: false },
        },
      }),
    ),
  },
})
export class DtoOrderCreate extends $Dto.create(() => ModelOrder) {}
```

The effective `form-create` rule makes `referenceNo` writable for this create contract. An update DTO using the shared `form` scene keeps it read-only unless its own scene metadata changes that result. DTO options such as `fields`, `blocks`, `openapi`, and `schemaScene` merge with metadata supplied by inferred helpers or inheritance; they do not erase the helper-provided scene identity.

Why this is a good fit:

- the contracts are operation-specific and worth naming
- the underlying field truth already exists in the model/entity thread
- rewriting all fields manually would add duplication without adding much clarity

So the code gets both:

- a stable named DTO artifact
- inference-backed contract derivation

### View DTO

Representative source fact:

- `DtoStudentView` extends `$Dto.get(() => ModelStudent)`

This is the one-item read version of the same pattern.

Again, the class keeps a named public identity, while the DTO shape stays close to model truth.

### Query/filter DTO

`DtoStudentSelectReq` is especially important because it shows that query contracts are often more than a simple list of optional fields.

Representative source facts:

- it extends `$Dto.queryPage(EntityStudent, ['name', 'level', 'createdAt'])`
- it also adds `@Dto({ openapi: { filter: { table: 'trainingStudent' } }, fields: { ... } })`
- `level` uses preprocess logic so string query input can be normalized before schema validation
- `createdAt` uses `v.filterTransform('a-web:dateRange')`

This makes it a strong specimen of a **query DTO that still wraps inference, but adds operation-specific shaping**.

Its `fields` entries use `$makeSchema(...)` because the query contract changes the projected fields' runtime schema: query values become optional, `level` is normalized before validation, and `createdAt` accepts the date-range filter representation. Keep the final structure-defining schema last in each `$makeSchema(...)` call, then verify the emitted schema/OpenAPI result after a structure-shaping change.

A practical reading takeaway is:

- inference gives the structural baseline
- `$makeSchema(...)` refines projected fields when their query contract behavior differs

### Row-item response DTO

`DtoStudentSelectResItem` is useful for a different reason.

Representative source fact:

- it extends `$Dto.get(() => ModelStudent)`

But it also adds response-facing metadata such as:

- page block metadata
- row-action metadata
- table-cell-related render hints

That means a named DTO can still wrap inference while carrying richer response-facing semantics that matter downstream.

### List-and-count response DTO

Representative source fact:

- `DtoStudentSelectRes` extends `$Dto.listAndCount(DtoStudentSelectResItem)`

This is the aggregate response wrapper for the list endpoint.

So the list-response chain is not one DTO only. It is:

1. one query/filter request DTO
2. one row-item DTO
3. one list-and-count wrapper DTO

That is exactly the kind of shape where helper-level inference improves consistency more than manual duplication would.

## Main-details example

A representative example for relation-aware inferred contracts uses an `Order -> Product` relation.

The key lesson is that when the return shape is richer than a simple entity array, an inferred DTO can capture the real result shape more accurately than a hand-waved entity annotation.

Representative pattern:

```typescript
@Api.body(v.array($Dto.get(() => ModelOrder, { include: { products: true } })))
```

Another useful inferred pattern is action-derived contract reuse:

```typescript
@Web.get('getUserDynamic')
@Api.body($Dto.get('test-vona:post'))
getPostDynamic() {}
```

This is especially useful when a controller wants to expose the same contract shape that the model/action thread already defines elsewhere.

## Relation-aware inference

DTO inference becomes especially powerful when the result shape depends on relations.

Examples include:

- static relations loaded through `include`
- dynamic relations loaded through `with`
- grouped or aggregated related substructures

That means DTO inference should often be considered together with relation design rather than only after the fact.

A practical rule is:

- keep inference inline when one action needs one contract shape only once
- wrap the inferred DTO into a named DTO class when the same relation-aware shape becomes part of a reusable public contract

## Use `dtoClass` to shape inferred fields

When inferred DTOs should still follow a reusable named field surface, pass `dtoClass` to the helper options. This is the reusable projection choice from [Layer 1: project upstream truth](#layer-1-project-upstream-truth).

This is useful when:

- the inferred DTO should reuse a DTO class instead of exposing the full model field surface
- a nested relation needs its own mutate/view contract class
- a master-detail contract should stay relation-aware while the allowed fields remain curated and discoverable by name

A practical rule is:

- use `dtoClass` when the shaping should be reusable and named
- use `columns` when the narrowing is simple and only needed once

Representative specimen from `training-student`:

```typescript
export class DtoDetailRecordMutate extends $Dto.mutate(() => ModelRecord, {
  dtoClass: DtoDetailRecordBase,
  include: { trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectMutate } },
}) {}
```

This pattern keeps model-aware and relation-aware inference, but takes the field truth from the provided DTO classes.

In a master-detail flow, this usually means:

- a base detail DTO such as `DtoDetailRecordBase` defines the reusable field surface for the owned detail
- a parent contract such as `DtoStudentCreate` or `DtoStudentUpdate` includes the detail through `include: { trainingRecords: { dtoClass: DtoDetailRecordMutate } }`
- a nested detail can repeat the same rule one level lower, such as `trainingRecordSubjects: { dtoClass: DtoDetailRecordSubjectMutate }`

That separation is useful because the parent DTO keeps the aggregate relation wiring, while the detail DTO family owns which detail fields are actually exposed for create, update, or view.

The nested relation case matters because `dtoClass` can also be applied inside `include`, not only at the top level.

The test suite also shows the behavioral difference from a one-off `columns` selection: a relation-level `dtoClass` can act like a reusable named field subset instead of repeating inline column lists.

## Aggregate and group DTO inference

Summary-oriented ORM queries often benefit from inferred DTOs because the result shape is driven by `aggrs`, `groups`, and relation configuration.

A practical rule is:

- if the summary shape comes directly from ORM query structure, inference is often the cleanest option
- if the same summary contract is reused broadly, wrap the inferred DTO into a named DTO class

For the query side of this topic, also see [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide).

## How DTOs surface in generated metadata

When you change or add DTOs, do not think only about the local DTO file.

The current `training-student` module also makes DTOs visible through generated metadata in:

- `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`

The DTO-facing part of that generated registry includes:

- exports of the DTO classes themselves
- `IDtoRecord` registrations for DTO onion names
- a broader generated surface that keeps DTO availability aligned with controller, API path, and resource registrations

A practical reading takeaway is:

> DTO classes are not only local TypeScript artifacts. They become part of the generated contract registry that the rest of the backend thread can reason about.

This is also why DTO changes should be thought about together with:

- OpenAPI emission
- downstream frontend generation
- broader contract-loop verification

## Relationship to CRUD generation

Inferred DTOs are not separate from the CRUD workflow. They sit on the same contract loop.

A useful split is:

- CRUD generation gives you the initial backend thread
- explicit DTOs give you stable named operation contracts
- inferred DTO helpers let the contract stay close to model and query truth when another handwritten class would add little value

This helps keep the generated thread productive instead of forcing redundant DTO maintenance everywhere.

## Relationship to OpenAPI and frontend generation

DTO inference and generation are not isolated authoring tricks. They are part of a broader backend contract workflow.

When model, relation, DTO, or controller contracts change, remember to consider the downstream path too:

- backend OpenAPI output
- frontend SDK generation
- frontend schema-driven helpers

For the bridge step that carries this backend-authored contract across the stack, continue with [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## Read this guide together with

- [DTO Guide](/backend/dto-guide)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
- [Relations Guide](/backend/relations-guide)
- [ORM Select Guide](/backend/orm-select-guide)
- [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

## Where to read next

- If you want one concrete module specimen first, continue with [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain).
- If your next question is about broader DTO design choices, continue with [DTO Guide](/backend/dto-guide).
- If your next question is about emitted backend contract output, continue with [OpenAPI Guide](/backend/openapi-guide).
- If your next question is about how backend-authored DTO and OpenAPI truth becomes generated frontend contract material, continue with [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).

## Implementation checks for DTO inference and generation changes

When evaluating a return shape or input contract that closely follows model structure, ask:

1. does an Entity, Model, relation, or query shape already provide stable upstream contract truth?
2. is the contract get/list/query/create/update/aggregate/group oriented, and which `$Dto.*` helper matches it?
3. should `columns`, `include`, `with`, or `dtoClass` define the projection boundary?
4. should the inferred DTO stay inline or be wrapped in a named DTO class?
5. for every local difference, does the `fields` key already have an inferred/projected schema, or is it a true virtual key?
6. use `$makeMetadata(...)` only for metadata-only refinement of an inferred/projected field; define every true virtual key with `$makeSchema(...)` and a final concrete `z.<type>()` schema
7. is every `@Api.field(...)` member genuinely new instead of a redeclared inferred field?
8. if `$makeSchema(...)` is used, is the structure-defining schema last and is emitted schema/OpenAPI verification planned?
9. does the resulting DTO also affect OpenAPI and frontend generation paths?
10. is CRUD generation already giving enough contract structure that another handwritten DTO would be redundant, or is an explicit DTO clearer?

That helps reduce redundant type work and keeps contracts closer to the model truth.
