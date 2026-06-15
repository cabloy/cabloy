# CLI to Skill Map

This page explains how Cabloy skills should map onto Vona and Zova CLI capabilities.

## Why this mapping matters

The CLI is the most efficient automation surface in the repo.

Skills should normally orchestrate CLI capabilities rather than replacing them.

That is how Cabloy reduces token use and keeps AI output aligned with framework conventions.

## The general rule

When a task matches an existing generator, refactor, metadata, or execution command:

1. detect the active edition
2. identify the relevant framework side
3. choose the correct CLI family
4. run or recommend the CLI command
5. inspect output
6. apply minimal follow-up edits
7. verify

## Vona CLI families and likely skill roles

### `create:*`

Typical use cases:

- suite/module/bean/test generation
- controller/service/model/entity/dto creation

Typical skill role:

- choose the right bean or module workflow
- branch on context
- then delegate creation to Vona CLI

### `init:*`

Typical use cases:

- config / locale / constant / asset / types initialization

Typical skill role:

- decide whether the task belongs to module setup or later feature work
- then delegate initialization to Vona CLI

### `tools:*`

Typical use cases:

- CRUD generation
- metadata and dependency refresh

Typical skill role:

- recognize when a task is “scaffold a thread” rather than “hand-build layers”
- choose the right generator
- then inspect and refine output

### `bin:*`

Typical use cases:

- dev / test / tsc / play / db-reset / build

Typical skill role:

- pick the right verification or execution path after changes

## Zova CLI families and likely skill roles

### `create:*`

Typical use cases:

- page / component / module / mock / bean generation

Typical skill role:

- detect whether the task is page/component/API/model-oriented
- then delegate generation to Zova CLI

### `refactor:*`

Typical use cases:

- page query
- page params
- component props
- generic component
- v-model

Typical skill role:

- recognize when a task is “add a framework feature to an existing page/component”
- then delegate the structural transform to Zova CLI

### `openapi:*`

Typical use cases:

- config generation
- SDK generation

Typical skill role:

- connect backend contract changes to frontend regeneration
- then delegate to Zova OpenAPI commands

### `tools:*`

Typical use cases:

- metadata regeneration
- dependency refresh

Typical skill role:

- notice when route/component/icon changes require metadata regeneration

## Example mappings

### Example: “Create a student CRUD backend thread”

- skill decides this is a backend CRUD task
- skill chooses Vona `tools:*`
- likely CLI path: `npm run vona :tools:crud ...`
- skill then verifies the generated layers and suggests follow-up edits

### Example: “Add page params to an existing Zova page”

- skill decides this is a frontend page refactor task
- skill chooses Zova `refactor:*`
- likely CLI path: `npm run zova :refactor:pageParams ...`
- skill then reminds the user to regenerate metadata and verify route behavior

### Example: “Backend contract changed, frontend needs refresh”

- skill decides this is a fullstack contract loop task
- skill uses docs + edition detection
- likely CLI path: Zova `openapi:*` or REST build flows
- skill then verifies the right edition-specific flavor path

### Example: “Update a field on an existing backend resource”

- skill decides this is an existing-resource field-update task
- skill classifies persisted-field vs metadata-only refinement
- likely CLI path: Vona persistence verification plus Zova metadata/build flows only if renderer follow-up is required
- skill then verifies entity, locale, tests, `fileVersion` logic, and renderer/build/deps follow-up when applicable

## Anti-patterns

Avoid these mistakes in skills:

- hand-writing all generated files when a CLI command exists
- editing page/component/model structure manually before checking `refactor:*`
- ignoring metadata regeneration after route/component/icon changes
- using Basic-specific examples in Start without edition detection

## Current root skill example

The root-level skill:

- `.claude/skills/cabloy-workflow/SKILL.md`

already follows this philosophy: detect edition, classify layer, prefer CLI, then verify.

Future skills should follow the same mapping pattern.
