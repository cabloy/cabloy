# DTO Infer and Generation

This guide explains how DTO inference and generation work in Vona within the Cabloy monorepo.

## Why DTO inference matters

DTOs are essential for validation and OpenAPI metadata, but manually maintaining them becomes expensive and error-prone as models and relationships grow more complex.

Vona addresses that by dynamically inferring and generating DTOs from model structure and query shape.

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

## When each inferred DTO shape is useful

A practical mental model is:

- use `$Dto.get` for one-item read contracts
- use `$Dto.listAndCount` for paginated or list-plus-total contracts
- use `$Dto.query` and `$Dto.queryPage` for query-input or query-result patterns
- use `$Dto.create` and `$Dto.update` for write contracts derived from model structure
- use `$Dto.aggregate` and `$Dto.group` for summary-oriented result shapes

This matters because different ORM operations naturally produce different API contracts.

## When inference should replace handwritten DTOs

A practical rule is:

- prefer inferred DTOs when the contract closely follows model structure or query shape
- prefer explicit DTO classes when the contract is long-lived, heavily customized, or needs a strong named public identity
- wrap inferred DTOs into named DTO classes when reuse becomes more important than one-off convenience

This is one of the most important distinctions in the backend contract loop.

## Main-details example

A representative example uses an `Order -> Product` relation.

The key lesson is that when the return shape is richer than a simple entity array, an inferred DTO can capture the actual result shape more accurately than a hand-waved entity annotation.

Representative pattern:

```typescript
@Api.body(v.array($Dto.get(() => ModelOrder, { include: { products: true } })))
```

This shows the dynamic DTO layer participating directly in controller return contracts.

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

A representative relation-aware response pattern is:

```typescript
@Api.body(v.array($Dto.get(() => ModelOrder, { include: { products: true } })))
```

A practical rule is:

- keep inference inline when one action needs one contract shape only once
- wrap the inferred DTO into a named DTO class when the same relation-aware shape becomes part of a reusable public contract

## Aggregate and group DTO inference

Summary-oriented ORM queries often benefit from inferred DTOs because the result shape is driven by `aggrs`, `groups`, and relation configuration.

A practical rule is:

- if the summary shape comes directly from ORM query structure, inference is often the cleanest option
- if the same summary contract is reused broadly, wrap the inferred DTO into a named DTO class

For the query side of this topic, also see [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide).

## Relationship to CRUD generation

Inferred DTOs are not separate from the CRUD workflow. They sit on the same contract loop.

A useful split is:

- CRUD generation gives you the initial backend thread
- explicit DTOs give you stable named operation contracts
- inferred DTOs let the contract stay close to model and query truth when a separate handwritten class would add little value

This helps keep the generated thread productive instead of forcing redundant DTO maintenance everywhere.

## Encapsulating inferred DTOs

Inferred DTO logic can also be wrapped inside an explicit DTO class for reuse.

That is useful because it gives teams a spectrum of options:

- use inference directly for one endpoint
- wrap the inferred DTO into a named reusable class when the contract is important elsewhere too

## Relationship to generation and metadata refresh

DTO inference and generation are not isolated authoring tricks. They are part of a broader backend contract workflow.

When model, relation, or controller contracts change, remember to consider the downstream metadata and generated-contract path as well.

Read this guide together with:

- [DTO Guide](/backend/dto-guide)
- [Relations Guide](/backend/relations-guide)
- [ORM Select Guide](/backend/orm-select-guide)
- [ORM Aggregate and Group Guide](/backend/orm-aggregate-group-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)

## Implementation checks for DTO inference and generation changes

When evaluating a return shape or input contract that closely follows model structure, ask:

1. should this DTO be inferred instead of handwritten?
2. does model relationship structure already contain enough information?
3. is the contract get/list/query/create/update/aggregate/group oriented?
4. should the inferred DTO stay inline or be wrapped in a named DTO class?
5. does the resulting DTO also affect OpenAPI and frontend generation paths?
6. is CRUD generation already giving enough contract structure that another handwritten DTO would be redundant?

That helps reduce redundant type work and keeps contracts closer to the model truth.
