# Playbook: Add a Backend Module

This playbook turns the Cabloy backend documentation into a repeatable AI-friendly workflow.

## When to use this playbook

Use this playbook when the goal is to add a new backend feature thread in Vona, such as:

- a new module
- a new controller/service/model/entity/dto thread
- a new CRUD-oriented backend feature

## Step 1: Detect the repo and scope

Before generating anything:

1. confirm the active repo marker
2. confirm whether the task is backend-only or fullstack
3. inspect the root `package.json`
4. inspect `npm run vona` command families

This avoids solving the wrong problem or choosing the wrong edition assumptions.

## Step 2: Prefer the Vona CLI first

Choose the smallest matching Vona command family.

Typical options include:

- `create:*` for module/bean/test scaffolding
- `tools:*` for CRUD generation
- `init:*` for config/locale/constant/type helpers

Example paths:

```bash
npm run vona :create:module ...
npm run vona :create:bean ...
npm run vona :tools:crud ...
```

Do not start by hand-writing the whole thread if the generator already exists.

## Step 3: Inspect the generated thread

After generation, inspect the resulting backend layers:

- controller
- service
- model
- entity
- dto
- migration/meta files if applicable
- locale and test files if applicable

Use the generated structure as the baseline rather than replacing it.

## Step 4: Add contract and persistence details

Depending on the feature, extend the generated code with the right framework-level concerns:

- validation
- OpenAPI metadata
- DTO inference or explicit DTOs
- model relations
- migration and changes
- field indexes

When refining entity or DTO fields that use `@Api.field(...)`, apply this framework-specific guardrail:

- if you include an explicit zod schema such as `z.number().int().min(1)`, place it as the **last argument**
- keep helper metadata such as `v.xxx(...)` and `ZovaRender.xxx(...)` before the zod schema
- otherwise helpers written after the zod schema may stop taking effect

Relevant docs:

- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [Migration and Changes](/backend/migration-and-changes)

## Step 5: Verify the backend path

Choose verification based on scope.

Typical checks include:

```bash
npm run test
npm run tsc
npm run build
```

Or narrower checks such as:

- module tests
- migration reset flow
- controller action testing

## AI rule of thumb

A good AI backend workflow in Cabloy is usually:

1. detect
2. choose CLI
3. generate
4. inspect
5. refine
6. verify

Not:

1. imagine the file structure
2. write everything manually
3. hope it matches framework conventions
