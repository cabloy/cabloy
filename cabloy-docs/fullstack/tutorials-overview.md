# Fullstack Quick Start Tutorials

<Badge type="info" text="Basic" />

This six-part tutorial series gives you one connected, AI-guided path into Cabloy fullstack development.

## Why this series exists

Cabloy already has strong reference guides for CRUD, OpenAPI, DTO and entity contracts, schema-driven frontend rendering, and serialization. This series turns those capabilities into one guided execution path: you give AI the next focused task, inspect the result together, and then use that result to understand the framework model behind it.

The core rhythm is:

1. give AI a focused prompt
2. let AI inspect the Cabloy CLI first
3. let AI generate or refine the next increment
4. inspect the generated or affected files
5. verify the visible result
6. continue into deeper reference docs when needed

That makes the series practical as a guided, interactive workflow: you give AI one focused task at a time, inspect the result together, and learn the framework model behind each generated step.

## The business scenario

Throughout the series, you will build and refine a small **Student Training Center** example.

The main business object is `student`, and the teaching fields are:

- `name`
- `description`
- `level`
- `mobile`

Why these fields?

- `level` is a good field for schema-driven form and table rendering
- `mobile` is a good field for validation, OpenAPI output, and serialization or masking

This keeps the storyline small enough for beginners while still showing Cabloy’s fullstack contract model.

At the beginning of the series, the `demo-student` module does not exist yet. The tutorials guide you and AI to build it step by step.

## What you should prepare first

Before starting this tutorial series, make sure you already know:

- how to bootstrap a Cabloy Basic project
- how to run the repo from the root
- how to discover command families through `npm run vona` and `npm run zova`

Read these pages first:

- [Fullstack Quickstart](/fullstack/quickstart)
- [Fullstack CLI](/fullstack/cli)
- [CLI Reference](/reference/cli-reference)

Those pages explain the repo entrypoints and the CLI-first workflow model that you and AI will reuse throughout this series.

## The learning path

### Phase 1: Create the module and CRUD thread

- [Tutorial 1: Create Your First Module](/fullstack/tutorial-1-first-module)
- [Tutorial 2: Create Your First CRUD](/fullstack/tutorial-2-first-crud)

### Phase 2: Share frontend rendering metadata through the backend contract

- [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing)
- [Tutorial 4: Custom Form/Table Renderers for Level](/fullstack/tutorial-4-custom-level-renderers)

### Phase 3: Share backend contracts forward into frontend consumption

- [Tutorial 5: Backend Contract Sharing](/fullstack/tutorial-5-backend-contract-sharing)

### Phase 4: Understand one contract surface through one field story

- [Tutorial 6: One Contract Surface, Four Uses](/fullstack/tutorial-6-one-contract-four-uses)

## The standard tutorial structure

All six tutorials in this series follow the same learning structure:

1. `Goal`
2. `AI Prompt`
3. `Why this step matters`
4. `CLI commands to inspect/use`
5. `Generated or affected files`
6. `What those files mean in the business thread`
7. `Verification`
8. `Read more`
9. `Next step`

This makes the series easier to execute one page at a time while keeping the interaction clear: you ask AI for the next increment, inspect the result, and learn why that output fits the Cabloy architecture.

## How to use this series with AI

Use the same workflow in every tutorial:

1. give AI the prompt from the page
2. require AI to inspect the existing Cabloy CLI before creating files manually
3. let AI perform only the tutorial-sized increment
4. ask AI to summarize which commands it used and why
5. inspect the generated or modified files before moving on
6. compare the result with the target architecture described in the tutorial and keep the implementation aligned from step to step
7. verify the result from the admin UI or generated contract output before continuing

A useful prompt habit is to tell AI explicitly:

- work from the repo root
- prefer `npm run vona ...` and `npm run zova ...` workflows
- avoid hand-written scaffolding when the CLI already provides it
- explain the business meaning of each changed file

## CLI-first rule

This series always prefers the existing Cabloy CLI surface before manual scaffolding.

Use this default workflow in every tutorial:

1. inspect the existing CLI family
2. run the matching generator or tooling command
3. inspect the generated result
4. make only the minimal manual follow-up changes that the business case still needs

Shared discovery commands from the repo root:

```bash
npm run vona :
npm run vona :create
npm run vona :tools

npm run zova :
npm run zova :create
npm run zova :openapi
```

This is one of the most important Cabloy habits to practice early with AI.

## Suggested reading rhythm

A good beginner rhythm for this series is:

1. read one tutorial page completely
2. run only the prompt and commands from that page
3. if the tutorial creates a new module, rerun `npm run dev` so the local dev workflow picks up the new module before continuing
4. inspect the generated or modified files before moving on
5. keep the previous tutorial result, because the next tutorial builds on it

Do not jump directly to SDK generation or custom renderers before the module and CRUD thread are in place.

## What you will understand by the end

After the six tutorials, you should be able to explain:

- when to use Vona and when to use Zova
- why CRUD generation usually comes before hand-written backend boilerplate
- how backend field metadata can reuse frontend render resources
- how to evolve from built-in renderers to custom renderers
- how backend OpenAPI contracts regenerate frontend SDKs and model helpers
- how validation, rendering, OpenAPI, and serialization fit into one field-oriented contract model

## Read together with

Use this series together with the deeper reference guides:

- [CRUD Workflow](/backend/crud-workflow)
- [Entity Guide](/backend/entity-guide)
- [DTO Guide](/backend/dto-guide)
- [Validation Guide](/backend/validation-guide)
- [OpenAPI Guide](/backend/openapi-guide)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [API Schema Guide](/frontend/api-schema-guide)
- [Serialization Guide](/backend/serialization-guide)

This series is not meant to replace those guides. It is meant to help you and AI move through them in one practical, task-driven order.
