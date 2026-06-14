# Fullstack Quick Start Tutorials

<Badge type="info" text="Basic" />

This tutorial series gives new Cabloy users one connected onboarding path instead of five isolated reference pages.

## Why this series exists

Cabloy already has strong reference guides for CRUD, OpenAPI, DTO and entity contracts, schema-driven frontend rendering, and serialization. What many beginners still need is one practical storyline that connects those capabilities in the order they usually discover them.

This series fills that gap.

It uses one small business scenario and teaches the Cabloy workflow in the order that is usually most helpful for a first project:

1. create a module
2. create a CRUD thread
3. share frontend render metadata back into backend contracts
4. share backend API contracts forward into the frontend SDK
5. understand how one field-oriented contract surface can drive multiple behaviors

## The business scenario

Throughout the series, you will build a small **Student Training Center** example.

The main business object is `student`, and the teaching fields are:

- `name`
- `description`
- `level`
- `mobile`

Why these fields?

- `level` is a natural field for custom form and table rendering
- `mobile` is a natural field for validation, OpenAPI output, and serialization or masking

This keeps the storyline simple enough for beginners while still showing Cabloy’s fullstack strengths.

## What you should prepare first

Before starting this tutorial series, make sure you already know:

- how to bootstrap a Cabloy Basic project
- how to run the repo from the root
- how to discover command families through `npm run vona` and `npm run zova`

Read these pages first:

- [Fullstack Quickstart](/fullstack/quickstart)
- [Fullstack CLI](/fullstack/cli)
- [CLI Reference](/reference/cli-reference)

Those pages explain the repo entrypoints and the CLI-first workflow model that this series builds on.

## The learning path

### Phase 1: Scaffold the business thread

- [Tutorial 1: Create Your First Module](/fullstack/tutorial-1-first-module)
- [Tutorial 2: Create Your First CRUD](/fullstack/tutorial-2-first-crud)

### Phase 2: Learn bidirectional fullstack sharing

- [Tutorial 3: Frontend Metadata Sharing](/fullstack/tutorial-3-frontend-metadata-sharing)
- [Tutorial 4: Backend Contract Sharing](/fullstack/tutorial-4-backend-contract-sharing)

### Phase 3: Understand the Cabloy contract model

- [Tutorial 5: One Contract Surface, Four Uses](/fullstack/tutorial-5-one-contract-four-uses)

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

This is one of the most important Cabloy habits to learn early.

## Suggested reading rhythm

A good beginner rhythm for this series is:

1. read one tutorial page completely
2. run only the commands from that page
3. if the tutorial creates a new module, rerun `npm run dev` so the local dev workflow picks up the new module before continuing
4. inspect the generated or modified files before moving on
5. keep the previous tutorial result, because the next tutorial builds on it

Do not jump directly to SDK generation or schema-driven UI before the module and CRUD thread are in place.

## What you will understand by the end

After the five tutorials, you should be able to explain:

- when to use Vona and when to use Zova
- why CRUD generation usually comes before hand-written backend boilerplate
- how frontend render resources can participate in backend field contracts
- how backend OpenAPI contracts can regenerate frontend SDKs
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

This series is not meant to replace those guides. It is meant to give you a practical path through them.