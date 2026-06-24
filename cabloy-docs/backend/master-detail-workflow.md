# Master-Detail Workflow

This guide explains how to scaffold a backend master-detail aggregate in the Cabloy monorepo.

## Why this page matters

Some business shapes are not best expressed as two unrelated CRUD resources.

A common pattern is:

- one master resource owns the aggregate lifecycle
- one detail resource is edited as a nested collection under the master
- the detail may or may not also expose its own standalone resource surface

The `training-student` + `training-record` specimen in the current repo demonstrates this pattern.

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
4. built-in `basic-details` UI metadata for row/bulk actions
5. detail FK persistence field in the detail entity
6. detail schema/index support for the FK

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
- without a standalone controller/service resource surface

Choose this mode when the detail is primarily edited only through the master workflow.

### Standalone mode

Use:

```bash
--detailMode=standalone
```

In this mode, the detail module:

- still participates in the master aggregate
- keeps or creates its own standalone controller/service resource surface

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

## Specimen mapping

The current specimen maps like this:

- master relation: `vona/src/suite/a-training/modules/training-student/src/model/student.ts`
- master service include lifecycle: `vona/src/suite/a-training/modules/training-student/src/service/student.ts`
- master nested DTOs: `vona/src/suite/a-training/modules/training-student/src/dto/studentCreate.tsx`, `studentUpdate.tsx`, `studentView.tsx`
- detail row/bulk metadata: `vona/src/suite/a-training/modules/training-student/src/dto/detailRecordResItem.tsx`
- detail FK field: `vona/src/suite/a-training/modules/training-record/src/entity/record.tsx`

This is the reference shape the generator aims to standardize.

## Recommended workflow

1. run `:tools:masterDetail`
2. inspect the generated relation, DTO, and service thread
3. refine entity fields and validation rules for the domain
4. refine detail columns/actions when the default `basic-details` behavior is not enough
5. refresh and verify metadata/build outputs

## Relationship to CRUD workflow

Use [CRUD Workflow](/backend/crud-workflow) when the target is primarily a standalone resource.

Use this page when the target is a master resource with a nested detail collection.

The two workflows are complementary:

- CRUD scaffolds standalone backend threads
- master-detail scaffolds aggregate ownership plus nested detail editing

## Verification checklist

After generation:

1. confirm the master model contains the `hasMany` relation
2. confirm master service create/view/update/delete includes the detail relation
3. confirm master create/update/view DTOs include nested detail DTO wiring
4. confirm the detail entity contains the FK field
5. confirm detail schema/index output includes the FK support
6. if standalone mode was chosen, confirm the detail module still exposes its standalone resource surface
