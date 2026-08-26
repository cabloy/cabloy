# Master-Detail Workflow

This guide explains how to scaffold and reason about backend detail aggregates in the Cabloy monorepo.

Use this page when the business shape is not “two unrelated CRUD resources,” but a parent resource that owns one or more nested detail collections.

> [!TIP]
> For the deep evidence trail behind this workflow, also read [Master-Detail Source Reading Map](/backend/master-detail-source-reading-map).

## What this page covers

The current repo already demonstrates three related shapes:

1. **master-detail** — one master resource owns a first-level detail collection
2. **nested-detail** — a detail can itself own another detail collection
3. **standalone-capable detail resource** — a detail can remain aggregate-owned only, or also keep its own standalone resource surface

The strongest current specimen is:

- `training-student` -> `training-record` -> `training-recordsubject`

A practical reading of that chain is:

- `student` is the master resource
- `record` is a first-level detail under `student`
- `subject` is a second-level detail under `record`
- `record` also demonstrates the case where a detail keeps its own standalone CRUD/resource surface

## Why this page matters

Some business shapes are not best expressed as unrelated standalone resources.

A common Cabloy pattern is:

- one master resource owns the aggregate lifecycle
- one detail resource is edited as a nested collection under the master
- the detail may or may not also expose its own standalone resource surface
- the same structural rule can repeat recursively when a detail becomes the parent of another detail

The `training-student` + `training-record` specimen demonstrates the first-level pattern, and the `training-record` + `training-recordsubject` thread demonstrates the recursive second-level pattern.

## Use the generator first

When the requirement is “add details under a master resource,” prefer the master-detail generator before hand-wiring relation, DTO, and service changes.

Example:

```bash
npm run vona :tools:masterDetail student -- --module=training-student --detailModule=training-record --detailResourceName=record --relationName=trainingRecords --fk=studentId --detailMode=aggregate
```

A practical reading of the arguments is:

- `student`: master resource name
- `--module=training-student`: master module
- `--detailModule=training-record`: detail module
- `--detailResourceName=record`: detail resource name inside the detail module
- `--relationName=trainingRecords`: master-side `hasMany` relation name
- `--fk=studentId`: detail-side FK field
- `--detailMode=...`: whether the detail keeps a standalone resource surface

The same structural rule applies recursively when a first-level detail later owns its own nested detail collection.

## Module naming rule

For `--module` and `--detailModule`, use the canonical Vona module relative name such as `training-student` or `training-record`.

A practical rule is:

- use the module relative name itself
- do not pass the package name such as `vona-module-training-student`
- do not append an extra suffix that changes the canonical module identity

This matters because the CLI resolves modules by their canonical relative names.

## What the generator scaffolds

The generator is designed to create the aggregate-detail thread, including:

1. master model relation wiring
2. master service `include` lifecycle for create/view/update/delete
3. master-side nested detail DTOs
4. built-in `basic-details` UI metadata for nested row/bulk interactions
5. detail FK persistence field in the detail entity
6. detail schema/index support for the FK
7. metadata refresh for both the master module and the detail module

This keeps the structural pattern consistent before domain-specific refinement starts.

## Two supported detail-module modes

### Aggregate mode

Use:

```bash
--detailMode=aggregate
```

In this mode, the detail module remains:

- entity/model/meta-based
- owned by the master aggregate
- without a standalone controller/service/DTO resource surface

A practical source-backed nuance is:

- if the detail resource was just scaffolded for aggregate usage, the standalone controller/service/DTO surface is removed
- if an existing detail module already has a standalone surface, the generator refuses to silently repurpose it as aggregate-only

Choose this mode when the detail is primarily edited only through the master workflow.

### Standalone mode

Use:

```bash
--detailMode=standalone
```

In this mode, the detail module:

- still participates in the master aggregate
- keeps its own standalone controller/service/DTO resource surface
- can be addressed both through nested editing and through its own independent resource workflow

Choose this mode when the detail also needs independent entry points, workflows, or resource-level access outside the master editing flow.

## Practical decision rule

Use aggregate mode when:

- the detail has no meaningful lifecycle outside the master
- independent detail routes would add noise rather than value
- the master should remain the clear aggregate root

Use standalone mode when:

- the detail also needs independent CRUD/use cases
- external workflows need to query or mutate detail items directly
- the detail has user-facing or integration-facing behavior beyond nested editing

## Nested-detail pattern

Nested-detail is not a separate special case. It is the same structural idea applied one level lower.

The specimen chain is:

- `student`
  - `trainingRecords`
    - `trainingRecordSubjects`

A practical rule is:

- the master owns first-level detail editing
- a first-level detail can itself own second-level detail editing
- each level repeats the same relation + DTO + include wiring pattern with the immediate parent as the owner

That means `record` is both:

- a detail under `student`
- a parent of `trainingRecordSubjects`

## DTO naming and placement rules

The current source shows a consistent naming and placement rule for nested detail DTOs.

| Concern                   | Rule                                                                                                     | Example                                                                      | Boundary                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Nested detail DTO naming  | Prefix nested detail DTO names with `detail` for immediate recognizability                               | `detailRecordMutate`, `detailRecordView`                                     | This rule is for nested detail DTOs, not every DTO in the child module                        |
| First-level placement     | Place first-level detail DTOs beside the parent DTOs that consume them                                   | `training-student/src/dto/studentCreate.tsx` beside `detailRecord*.tsx`      | Do not move these DTOs into the child module just because the child also has its own resource |
| Second-level placement    | Place second-level detail DTOs beside the DTOs of their immediate parent                                 | `training-record/src/dto/recordCreate.tsx` beside `detailRecordSubject*.tsx` | Repeat the same rule recursively for deeper levels                                            |
| Standalone child boundary | A detail resource that keeps its own standalone surface still uses its normal standalone DTO names there | `recordCreate`, `recordUpdate`, `recordView` in `training-record`            | Standalone CRUD naming does not replace the nested `detail*` DTO convention                   |

## DTO naming rule

Use the `detail` prefix for nested detail DTOs so the role is explicit in both source and generated contract surfaces.

Representative first-level examples:

- `detailRecordBase`
- `detailRecordMutate`
- `detailRecordResItem`
- `detailRecordView`

Representative second-level examples:

- `detailRecordSubjectBase`
- `detailRecordSubjectMutate`
- `detailRecordSubjectResItem`
- `detailRecordSubjectView`

This makes nested detail artifacts easy to distinguish from ordinary standalone CRUD DTOs.

## DTO placement rule

Place nested detail DTOs next to the parent DTOs that consume them.

That means:

- the `student*` DTOs and `detailRecord*` DTOs live together in `training-student/src/dto/`
- the `record*` DTOs and `detailRecordSubject*` DTOs live together in `training-record/src/dto/`

A practical recursive rule is:

- first-level detail DTOs belong with the master DTOs
- second-level detail DTOs belong with the first-level parent DTOs
- repeat the same rule for deeper levels if the aggregate continues to nest

This placement makes the ownership path obvious at the point where nested editing is actually authored.

## `dtoClass` in master-detail DTO wiring

The nested DTO thread is not only about naming. The current scaffolded pattern also uses `dtoClass` so the parent DTO keeps aggregate relation wiring while the nested detail DTO class defines the reusable field surface.

Representative pattern:

- parent DTOs include nested details through `include: { relationName: { dtoClass: DtoDetail... } }`
- detail DTO families such as `detailRecordBase`, `detailRecordMutate`, and `detailRecordView` define which detail fields are exposed for each scene
- nested details can repeat the same `dtoClass` pattern recursively one level lower

That is why master-detail DTOs do not need to inline long relation column lists everywhere. They can reuse named detail DTO classes instead.

For a broader explanation of `dtoClass` as a DTO inference option, also read [DTO Infer and Generation](/backend/dto-infer-generation).

## Specimen walkthrough

The current specimen maps like this.

### First-level master-detail: `student -> record`

- master relation: `vona/src/suite/a-training/modules/training-student/src/model/student.ts`
- master service include lifecycle: `vona/src/suite/a-training/modules/training-student/src/service/student.ts`
- master nested DTO wiring: `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx`, `studentUpdate.tsx`, `studentView.tsx`
- first-level detail DTOs: `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordBase.tsx`, `detailRecordMutate.tsx`, `detailRecordResItem.tsx`, `detailRecordView.tsx`
- detail FK field: `vona/src/suite/a-training/modules/training-record/src/entity/record.tsx`
- contract exposure: `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`

### Second-level nested-detail: `record -> subject`

- detail-as-parent relation: `vona/src/suite/a-training/modules/training-record/src/model/record.ts`
- detail-as-parent include lifecycle: `vona/src/suite/a-training/modules/training-record/src/service/record.ts`
- second-level nested DTO wiring: `vona/src/suite/a-training/modules/training-record/src/dto/recordCreate.tsx`, `recordUpdate.tsx`, `recordView.tsx`
- second-level detail DTOs: `vona/src/suite/a-training/modules/training-record/src/dto/detailRecordSubjectBase.tsx`, `detailRecordSubjectMutate.tsx`, `detailRecordSubjectResItem.tsx`, `detailRecordSubjectView.tsx`
- contract exposure: `vona/src/suite/a-training/modules/training-record/src/.metadata/index.ts`

### Detail resource that also keeps a standalone resource surface

The `training-record` module demonstrates the dual-role case.

It is simultaneously:

- a nested detail under `student`
- a standalone resource with its own ordinary CRUD DTOs such as `recordCreate`, `recordUpdate`, and `recordView`

That is the practical boundary to remember:

- nested detail DTOs use `detail*` names in the parent module
- the child resource can still keep its own ordinary standalone DTO names in its own standalone resource surface

## Recommended workflow

1. run `:tools:masterDetail`
2. inspect the generated relation, DTO, and service thread
3. confirm whether the detail should remain aggregate-only or also stay standalone
4. if the detail later becomes a parent of another detail, repeat the same pattern one level lower
5. refine entity fields and validation rules for the domain
6. refine detail columns/actions when the default `basic-details` behavior is not enough
7. refresh and verify metadata/build outputs

## Relationship to other docs

Use [CRUD Workflow](/backend/crud-workflow) when the target is primarily a standalone resource.

Use [Relations Guide](/backend/relations-guide) when the question is about general ORM relation semantics such as `hasMany`, `belongsTo`, `include`, or `with`.

Use [Master-Detail Source Reading Map](/backend/master-detail-source-reading-map) when the question becomes “which source files prove the current master-detail and nested-detail behavior?”

Use [Contract Loop Playbook](/fullstack/contract-loop-playbook) when the next question crosses the backend/frontend contract boundary.

The workflows are complementary:

- CRUD scaffolds standalone backend threads
- master-detail scaffolds aggregate ownership plus nested detail editing
- the source-reading map traces the current evidence trail behind both

## Verification checklist

After generation or documentation changes:

1. confirm the master model contains the expected `hasMany` relation
2. confirm master service create/view/update/delete includes the detail relation
3. confirm master create/update/view DTOs include nested detail DTO wiring
4. confirm the nested detail DTO names follow the `detail*` rule
5. confirm the nested detail DTOs are placed beside the parent DTOs that consume them
6. for second-level nested detail, confirm the same naming and placement rule repeats with the immediate parent
7. confirm the detail entity contains the FK field
8. confirm detail schema/index output includes the FK support
9. confirm the module `.metadata/index.ts` exports the expected nested detail DTOs
10. if standalone mode was chosen, confirm the detail module still exposes its standalone resource surface
