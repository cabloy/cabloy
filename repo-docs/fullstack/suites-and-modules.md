# Suites and Modules

This guide explains how to think about suites and modules in the current Cabloy monorepo.

Use it when you need to answer these questions clearly:

1. what a suite is
2. when to create a suite instead of only a module
3. how suite naming works
4. where suite-owned modules should live
5. which CLI workflows should create the structure

## Why suites exist

As a project evolves, business capabilities do not usually grow as one isolated feature at a time.

In real business scenarios, one business domain often requires multiple related modules that evolve together. A training domain, for example, may later grow into modules for:

- training-student
- training-course
- training-record
- training-attendance
- training-certificate

Because of that, the default architectural decision should usually start from a **suite** rather than from an isolated standalone module.

A suite is the business-level composition boundary for a domain. A module is the feature-level implementation boundary inside that domain.

A practical mental model is:

- use a **suite** for the business domain
- use **modules** for the concrete capabilities inside that domain

## Suite and module roles

The two units serve different jobs.

### Suite

A suite groups related modules into one larger business scenario or architectural area.

That grouping matters because it gives the domain:

- a stable ownership boundary
- a clear place for future module growth
- consistent source-tree organization
- a shared naming anchor across backend and frontend

### Module

A module is the concrete implementation unit for one feature area.

That usually means a module owns the code for things such as:

- backend controllers, services, entities, DTOs, and models
- frontend pages, components, APIs, models, and metadata
- module-local config, locale, and other scoped resources

A useful rule is:

- the **suite** answers "which business domain does this belong to?"
- the **module** answers "which capability inside that domain owns this work?"

## Recommended decision path

In the current Cabloy monorepo, the preferred decision path is:

1. identify the business domain
2. create a suite for that domain
3. create one or more modules inside the suite
4. continue feature growth inside those suite-owned modules

In other words, for real business work, **suite-first** is usually the best choice.

### When suite-first is the default

Create a suite first when:

- the work belongs to a real business domain
- the domain is expected to grow beyond one small feature
- backend and frontend will both evolve around the same domain
- you want to avoid later structural migration from standalone modules into a domain boundary

In practice, this is the normal path for long-lived product work.

### When a standalone module is still acceptable

A standalone module can still be acceptable for cases such as:

- very small experiments
- disposable demos
- isolated utilities that are intentionally not the start of a larger domain
- short tutorials where introducing a domain suite would add noise

But this should be the exception, not the default path for real business architecture.

## Naming

Suite naming follows the same high-level model on both sides:

```text
Vona: FullName  = vona-suite-{providerId}-{suiteName}
Zova: FullName  = zova-suite-{providerId}-{suiteName}
ShortName      = {providerId}-{suiteName}
```

### Important suiteName rule

In this repository, `suiteName` must follow this rule:

- `suiteName` must use lowercase English letters only
- `suiteName` must not contain another `-`

This rule matters because the `-` already separates `{providerId}` and `{suiteName}` in the short name.

So the supported shape is:

```text
{providerId}-{suiteName}
```

not:

```text
{providerId}-{part1-part2}
```

### Examples

Representative examples from the current repo include:

- `a-home`
- `a-demo`
- `cabloy-basic`

These can be read as:

- `a-home` -> providerId: `a`, suiteName: `home`
- `a-demo` -> providerId: `a`, suiteName: `demo`
- `cabloy-basic` -> providerId: `cabloy`, suiteName: `basic`

For a training-oriented suite, the valid short name is:

- `a-training`

where:

- providerId: `a`
- suiteName: `training`

A practical rule is:

- keep `suiteName` simple, lowercase, and single-segment
- do not add another `-` inside `suiteName`
- if you need more semantic detail, express it through module names inside the suite rather than by making the suite name longer

## Supported directory pattern

To keep the code style consistent and reduce cognitive overhead, this repository supports only one suite layout for normal authoring work:

- **suite-contained modules**

That means when a suite exists, its modules belong under that suite.

### Backend pattern

```text
vona/src/suite/<suite>/modules/<module>/
```

### Frontend pattern

```text
zova/src/suite/<suite>/modules/<module>/
```

### Example

```text
vona/src/suite/a-training/
├── modules/
│  ├── training-student/
│  ├── training-course/
│  └── training-record/
└── package.json
```

```text
zova/src/suite/a-training/
├── modules/
│  ├── training-student/
│  ├── training-course/
│  └── training-record/
└── package.json
```

## Unsupported pattern for normal project authoring

For consistency, do not treat a suite as a loose composition package that only depends on standalone modules located elsewhere.

In other words, do not use a suite as a separate conceptual wrapper while keeping its real modules outside the suite tree.

Use the suite as the real ownership boundary, and keep the suite-owned modules physically inside:

- `vona/src/suite/<suite>/modules/`
- `zova/src/suite/<suite>/modules/`

This keeps the source tree easier to read and avoids extra mental branching about whether a module is only logically related to a suite or actually owned by it.

## CLI-first workflow

Do not scaffold suite/module structure manually when the CLI already supports it.

Use the framework CLI first, then make only the minimal follow-up edits that the task still needs.

### Create a backend suite

```bash
npm run vona :create:suite suiteName
```

### Create a frontend suite

```bash
npm run zova :create:suite suiteName
```

### Create a backend module inside a suite

```bash
npm run vona :create:module moduleName -- --suite=suiteName
```

### Create a frontend module inside a suite

```bash
npm run zova :create:module moduleName -- --suite=suiteName
```

A practical fullstack rule is:

- use `npm run vona` to create the backend side of the domain
- use `npm run zova` to create the frontend side of the domain
- for a real business domain, create the suite first on both sides, then create the suite-owned modules

## Recommended workflow for real business domains

A practical suite-first workflow is:

1. decide the domain boundary
2. choose a valid suite short name
3. create the suite in Vona
4. create the suite in Zova
5. create the first backend and frontend modules inside that suite
6. continue all later domain growth inside the same suite

For example, for a training domain:

```bash
npm run vona :create:suite a-training
npm run zova :create:suite a-training

npm run vona :create:module training-student -- --suite=a-training
npm run zova :create:module training-student -- --suite=a-training
```

Later domain growth can continue with modules such as:

- training-course
- training-record
- training-attendance

This keeps the domain boundary stable while the capabilities inside it expand.

## How to choose between a suite and only a module

Use this rule:

### Choose a suite first when

- the work belongs to a real domain
- more related modules are likely
- the feature will grow across backend and frontend
- you want the structure to remain stable as the domain expands

### Choose only a standalone module when

- the work is intentionally isolated
- the scope is very small
- the code is exploratory or disposable
- creating a domain suite would add more ceremony than value

For most real business scenarios, the correct answer is to create the suite first.

## Relationship to repo structure

This guide should be read together with:

- [Package Map](/reference/package-map)
- [Vona Module Dependencies](/backend/module-dependencies)
- [Backend Directory Structure](/reference/backend-directory-structure)
- [Frontend Directory Structure](/reference/frontend-directory-structure)
- [Backend CLI](/backend/cli)
- [Frontend CLI](/frontend/cli)
- [Fullstack CLI](/fullstack/cli)

A practical split is:

- this page explains the decision model for suites and modules
- the reference pages explain where those units live in the repo
- the CLI pages explain how to generate them correctly

## Verification

After creating or restructuring suites and modules, verify with the narrowest useful checks first.

Typical checks include:

```bash
npm run vona :
npm run zova :

npm run deps:vona
npm run deps:zova

npm run tsc
```

If the change affects broader cross-stack output, also use the relevant build flow from the repo root.

The key rule is:

- verify that the suite and module were created in the intended structural location
- verify that later commands and dependency refresh flows still recognize that structure
