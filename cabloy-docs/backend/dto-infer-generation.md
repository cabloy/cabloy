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

## When inference should replace handwritten DTOs

A practical rule is:

- prefer inferred DTOs when the contract closely follows model structure or query shape
- prefer explicit DTO classes when the contract is long-lived, heavily customized, or needs a strong named public identity
- wrap inferred DTOs into named DTO classes when reuse becomes more important than one-off convenience

A practical reading takeaway is:

> the best default is often not “handwritten DTO or no DTO.” It is “named DTO class backed by the right inferred helper.”

## `training-student` as the decision specimen

The current `training-student` module is a strong specimen because it shows several different DTO choices in one compact family.

Relevant source files include:

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

A practical reading takeaway is:

- inference gives the structural baseline
- explicit field metadata adds the operation-specific contract behavior

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

1. should this DTO be inferred instead of handwritten?
2. does model relationship structure already contain enough information?
3. is the contract get/list/query/create/update/aggregate/group oriented?
4. should the inferred DTO stay inline or be wrapped in a named DTO class?
5. does the resulting DTO also affect OpenAPI and frontend generation paths?
6. is CRUD generation already giving enough contract structure that another handwritten DTO would be redundant?

That helps reduce redundant type work and keeps contracts closer to the model truth.
