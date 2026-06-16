# Fullstack Quick Start Tutorials

<Badge type="info" text="Basic" />

This six-part tutorial series gives you one connected, AI-guided path into Cabloy fullstack development.

## Why this series exists

Cabloy already has strong reference guides for CRUD, OpenAPI, DTO and entity contracts, schema-driven frontend rendering, and serialization. This series packages those capabilities into one simple workflow: each page gives you one focused prompt, AI completes the next increment, and you use the result to understand the framework model behind it.

The core rhythm is:

1. each page provides one focused prompt
2. AI completes the tutorial-sized increment
3. the generated or affected files become the next teaching surface
4. the result is verified in the running app or generated contract output
5. deeper reference docs remain available when more background is needed

That makes the series practical as a guided, interactive workflow: each tutorial reduces the user action to one prompt, while the generated result becomes the teaching material for the next step.

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

At the beginning of the series, the `demo-student` module does not exist yet. The tutorials build it step by step.

## What you should prepare first

Before starting this tutorial series, make sure you already know:

- how to bootstrap a Cabloy Basic project
- how to run the repo from the root
- how to discover command families through `npm run vona` and `npm run zova`

Read these pages first:

- [Fullstack Quickstart](/fullstack/quickstart)
- [Fullstack CLI](/fullstack/cli)
- [CLI Reference](/reference/cli-reference)

Those pages explain the repo entrypoints and the CLI-first workflow model that the tutorial prompts will reuse throughout this series.

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

This makes the series easier to execute one page at a time: each page gives AI one clear increment, and the resulting output teaches why that step fits the Cabloy architecture.

## How to use this series with AI

Keep this series simple.

In each tutorial, your main job is to copy the prompt from the page and give it to AI.

That prompt already tells AI how to work in the Cabloy way, including things like:

- inspect the CLI first
- perform only the current tutorial increment
- explain the commands it used
- explain the business meaning of the generated or changed files
- tell you what to verify next

So for the user, the workflow is intentionally lightweight:

1. open the current tutorial
2. copy the prompt
3. send it to AI
4. review the result and continue to the next tutorial when ready

## CLI-first rule

This series assumes that AI should follow Cabloy’s CLI-first workflow before attempting manual scaffolding.

In practice, the tutorial prompt should push AI to follow this rule:

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

This is one of the most important Cabloy rules for AI-driven development in this series.

## Suggested reading rhythm

This series is designed to progress one prompt at a time.

Each tutorial assumes that the previous result remains in place, so the workflow should stay incremental:

1. complete the current tutorial prompt
2. keep the generated result
3. continue to the next tutorial on top of that result

If a tutorial creates a new module, the local dev workflow may need `npm run dev` again so the new module is picked up before the next step.

Do not jump directly to SDK generation or custom renderers before the module and CRUD thread are in place.

## What you will understand by the end

After the six tutorials, the completed workflow should make these Cabloy ideas clear:

- when to use Vona and when to use Zova
- why CRUD generation usually comes before hand-written backend boilerplate
- how backend field metadata can reuse frontend render resources
- how to evolve from built-in renderers to custom renderers
- how backend OpenAPI contracts regenerate frontend SDKs and model helpers
- how validation, rendering, OpenAPI, and serialization fit into one field-oriented contract model

## Read together with

The deeper reference guides behind this workflow include:

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

This series is not meant to replace those guides. It is meant to help you move through them in one practical, task-driven order.
