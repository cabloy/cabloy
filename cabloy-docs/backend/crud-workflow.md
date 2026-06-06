# CRUD Workflow

This guide explains the Vona CRUD generator workflow in the Cabloy monorepo.

## Why this page matters

CRUD is one of the clearest places where Cabloy’s CLI-first philosophy pays off.

Instead of creating controller, service, model, entity, DTO, metadata, locale, and test files by hand, Vona already provides a generator that creates the initial skeleton.

## Generate a CRUD skeleton

Example: generate a CRUD workflow for `student` in module `demo-student`.

```bash
npm run vona :tools:crud student -- --module=demo-student
```

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

That is exactly why AI systems should prefer this generator. It gives a consistent starting shape across the backend thread.

## Recommended workflow

1. run the CRUD generator
2. inspect the generated files
3. refine entity, DTO, service, and controller behavior for the real business case
4. verify routes, model behavior, and tests

## Relationship to the REST API thread

The generated CRUD skeleton is not a shortcut around the architecture. It is a fast way to instantiate the same architecture documented elsewhere:

- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)

## Why this matters for AI workflows

When an AI system sees a request like “create a student CRUD” or “scaffold backend resources,” the correct default should be:

- inspect the Vona CLI
- use the CRUD generator if it matches the request
- modify the generated output instead of hand-building the whole thread from scratch
