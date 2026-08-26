# Backend CLI

This guide explains how to use the Vona CLI in the Cabloy monorepo.

## Why the CLI matters

Vona provides a large number of CLI commands for generating code skeletons and running backend workflows.

For implementation work, the CLI is especially important because it encodes framework conventions directly. If a command already exists, use it before writing backend scaffolding manually.

## Entry from repo root

The current monorepo entrypoint is defined at the repo root:

```bash
npm run vona :
```

That wrapper points to the Vona CLI under `vona/packages-cli/` while preserving the monorepo project path.

## Command discovery pattern

Vona commands follow a consistent discovery model.

### 1. List all command groups and commands

```bash
npm run vona :
```

### 2. List commands for a specific group

```bash
npm run vona :create
```

### 3. Inspect help for one command

```bash
npm run vona :create:bean --help
```

This discovery pattern should be the default contributor workflow before inventing manual scaffolding steps.

## High-value command families

From the current source tree, the most useful Vona command families for day-to-day development are:

- `bin:*`
- `create:*`
- `init:*`
- `tools:*`

Typical use cases include:

- scaffold suites, modules, beans, and tests
- initialize config, locale, constants, assets, types, and related module-scope resources
- generate CRUD-oriented resources
- refresh metadata and dependency-related output
- run build, dev, test, typecheck, playground, and database reset flows

## Generator-first workflow

A practical backend workflow is:

1. inspect the command family
2. run the generator or initializer
3. inspect the generated suite/module/bean structure
4. only then add the minimal manual logic the task actually needs

This matters because backend modularization, naming, and bean scenes are part of the framework architecture, not only coding style.

## Representative generation examples

### Create a suite

```bash
npm run vona :create:suite suiteName
```

### Create a module

```bash
npm run vona :create:module moduleName -- [--suite=]
```

### Create a service bean

```bash
npm run vona :create:bean service student -- --module=training-student
```

### Create a model bean

```bash
npm run vona :create:bean model student -- --module=training-student
```

### Create an entity bean

```bash
npm run vona :create:bean entity student -- --module=training-student
```

### Create a DTO bean

```bash
npm run vona :create:bean dto studentCreate -- --module=training-student
```

### Create a startup bean

```bash
npm run vona :create:bean startup log -- --module=training-student
```

These examples show that the CLI is tightly connected to module boundaries and bean scenes such as service, model, entity, DTO, and startup.

A practical bean-scene reading is:

- `service`, `model`, `entity`, `dto`, and `startup` are representative bean scenes
- `:create:bean sceneName beanName -- --module=...` uses `sceneName` as the operational family slot inside the bean identifier
- this is why generated bean names later appear in forms such as `module.scene.bean`

## Bean boilerplate variants

Some backend bean scenes expose more than one scaffold template.

In those cases, use `--boilerplate=...` to select a named variant:

```bash
npm run vona :create:bean ssrMenu menuTest -- --module=training-student --boilerplate=web
```

A practical rule is:

- the default scene template comes from the scene metadata `boilerplate`
- a named variant such as `--boilerplate=web` maps to a metadata key such as `boilerplateWeb`
- supported variants are scene-defined, so do not assume every scene exposes them

For the current cross-stack lookup table, see [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates).

## Initializer-family examples

Not every backend resource is created through bean scenes.

Representative initializer commands include:

```bash
npm run vona :init:constant training-student
npm run vona :init:types training-student
npm run vona :init:lib training-student
npm run vona :init:asset static -- --module=training-student
```

A practical distinction is:

- `:create:bean` creates scene-based backend beans
- `:init:*` commands create module-scope resources such as constants, typings, helper directories, or asset-resource structure

A practical helper-placement rule is:

- if a backend module needs reusable pure helper functions, initialize `src/lib` with `npm run vona :init:lib training-student`
- place those shared helpers under `src/lib` and export shared entrypoints from `src/lib/index.ts`
- if the logic needs container-managed runtime behavior, do not force it into `src/lib`; re-evaluate `src/service` or another bean scene instead

## Relationship to modules, suites, and package metadata

The backend CLI is not only a code generator. It is also one of the clearest expressions of Vona’s modular architecture.

CLI generation decisions affect:

- where files live
- which suite or module owns the resource
- how bean identifiers and onion names are derived
- how package metadata and dependencies should be interpreted later

For the current repo structure, also see [Package Map](/reference/package-map).

## CLI vs scripts

A practical distinction is:

- use [Backend Scripts](/backend/scripts) for root dev/build/start/test workflows
- use the Vona CLI when you are discovering commands, generating backend resources, or running backend-specific tool flows

This keeps contributor workflows clear instead of mixing runtime scripts with generator commands.

## Generator-first workflow checklist

When creating backend code:

1. inspect `npm run vona :` or the relevant command family
2. prefer the matching generator or initializer
3. inspect the generated output
4. only then make minimal follow-up edits

This reduces unnecessary manual scaffolding and keeps the implementation aligned with Vona conventions.

## Where to read next

If your next question is no longer only which command to run, but which backend source files to inspect after the CLI step, continue with:

- [Backend Scripts](/backend/scripts)
- [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)
- [Vona Source Reading Map](/backend/vona-source-reading-map)
- [Backend Resource/Module Contract Chain](/backend/backend-resource-module-contract-chain)
