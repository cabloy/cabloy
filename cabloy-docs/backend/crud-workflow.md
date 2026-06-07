# CRUD Workflow

This guide explains the Vona CRUD generator workflow in the Cabloy monorepo.

## Why this page matters

CRUD is one of the clearest places where Cabloy’s CLI-first philosophy pays off.

Instead of creating controller, service, model, entity, DTO, metadata, locale, and test files by hand, Vona already provides generators that create the initial backend thread.

## Generate a CRUD skeleton

Example: generate a CRUD workflow for `student` in module `demo-student`.

```bash
npm run vona :tools:crud student -- --module=demo-student
```

A lighter variant also exists:

```bash
npm run vona :tools:crudBasic student -- --module=demo-student
```

This is important because the repo already encodes both the full CRUD thread and a lighter CRUD-basic workflow in the CLI surface.

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
