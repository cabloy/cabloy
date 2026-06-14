# Tutorial 4: Backend Contract Sharing

<Badge type="info" text="Basic" />

This tutorial shows the forward direction of Cabloy’s fullstack contract loop: backend API contracts that generate or refresh the frontend SDK.

## Goal

By the end of this tutorial, you will understand:

- how a backend contract change becomes frontend SDK output
- why SDK regeneration is usually better than hand-writing duplicate request types
- how OpenAPI and module-level SDK ownership fit into one workflow

## Copy-first command block

If you want the shortest possible start, copy and run these commands from the repo root:

```bash
npm run zova :openapi:config demo-student
npm run zova :openapi:generate demo-student
```

Then inspect these files first:

- `vona/src/module/demo-student/src/controller/student.ts`
- `zova/src/module/demo-student/cli/openapi.config.ts`
- `zova/src/module/demo-student/src/api/`
- `zova/src/module/demo-student/src/api/openapi/`

## The teaching endpoint

Add one small business endpoint to the Student Training Center story.

Good beginner examples include:

- `GET /student/:id/summary`
- `GET /student/lookup`

Choose the one that best matches the page or component you plan to build next.

The important teaching point is not the exact route name. The important teaching point is that a backend contract change should flow into generated frontend artifacts.

## Step 1: Change the backend contract first

Start from the backend side.

That usually means updating one or more of these surfaces:

- controller
- DTOs
- entity metadata
- validation rules

The Student example already shows the controller-oriented contract style clearly:

- `vona/src/module/demo-student/src/controller/student.ts`

Use that file as the pattern for adding the next endpoint.

## Step 2: Inspect what OpenAPI is actually reading

The backend contract is not only route metadata.

OpenAPI output depends on the field-oriented contract thread that already exists across:

- controller argument and return contracts
- DTO definitions
- entity definitions
- validation helpers such as `v.*`

That is why adding one endpoint often means adjusting more than one file.

A good beginner rule is:

- if the new endpoint introduces a new request shape, inspect the DTOs first
- if it introduces a new response shape, think about both DTO and serialization concerns
- if it changes field meaning, inspect the entity metadata too

## Step 3: Initialize or inspect frontend OpenAPI config

On the frontend side, start with the OpenAPI config surface:

```bash
npm run zova :openapi:config demo-student
```

This command helps the module decide which backend operations belong to it.

If the module already has config, inspect it before regenerating. A good beginner habit is to understand module ownership before generating output.

A representative config example in this repo is:

- `zova/src/suite/a-home/modules/home-api/cli/openapi.config.ts`

That file is useful because it shows the kind of operation-matching rule the frontend module can own.

## Step 4: Generate the frontend SDK

After the backend contract is ready, regenerate the frontend SDK:

```bash
npm run zova :openapi:generate demo-student
```

This is the most important habit in this tutorial.

When the backend contract changes, prefer regeneration over hand-written duplicate request code whenever the module is already using the generated OpenAPI workflow.

## Step 5: Build the Basic rest-contract output when needed

For Cabloy Basic, the representative rest-build commands are:

```bash
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

These commands matter because the generated SDK and the rest-contract build are related but not identical steps.

## Step 6: Inspect the frontend consumption layer

After regeneration, inspect how the frontend consumes the generated contract.

A representative generated-consumption example in this repo is:

- `zova/src/suite/a-home/modules/home-api/src/api/home.ts`

That file is useful because it shows the normal pattern:

- import generated `paths` types from `./openapi/index.js`
- use a generated base URL helper
- expose a typed API method through the frontend module surface

A representative generated-consumption snippet looks like this:

```typescript
import type { paths } from './openapi/index.js';
import { OpenApiBaseURL } from './openapi/index.js';

export type ApiApiHomeindexResponseBody =
  paths['/']['get']['responses']['200']['content']['application/json']['data'];

@Api()
export class ApiHome extends BeanApiBase {
  index(options?: IApiActionOptions) {
    return this.$fetch.get<any, ApiApiHomeindexResponseBody>(
      '/',
      this.$configPrepare(OpenApiBaseURL(this.sys), options),
    );
  }
}
```

This is the practical takeaway for beginners: after backend contract generation, the frontend does not need to guess response types from memory. It can consume generated contract types directly.

A practical beginner verification step is to use the same shared verification rhythm:

1. make sure the local dev workflow is running:

```bash
npm run dev
```

2. open `http://localhost:7102/admin/`
3. enter the relevant **Student** page that consumes the refreshed endpoint or contract
4. trigger the page behavior that depends on the regenerated SDK or refreshed contract
5. verify that the page can consume the refreshed backend contract successfully without hand-written duplicate request typing

Read this together with the server-data abstraction ladder:

- `OpenAPI SDK`
- `$apiSchema`
- `$sdk`

The goal is not only to generate files. The goal is to let frontend code consume backend truth through the right Cabloy abstraction layer.

## Expected result after this tutorial

At the end of this tutorial, you should have all of these results:

1. a new backend endpoint in the Student module
2. any supporting DTO changes needed by that endpoint
3. a frontend OpenAPI config for `demo-student`, if it did not exist before
4. regenerated frontend contract artifacts for that module

Depending on your module setup, the generated frontend output will often include shapes like:

- `src/api/openapi/...`
- typed `src/api/...` wrappers that consume generated contracts
- optionally `src/apiSchema/...` when the module config enables schema generation

## Checkpoint

Before moving to the next tutorial, make sure you can answer these questions:

1. after regenerating the SDK, have you reopened `http://localhost:7102/admin/`, returned to the relevant **Student** page, and confirmed that the frontend can consume the refreshed contract successfully?
2. which backend files changed when you added the new endpoint?
3. which command regenerates the frontend SDK for `demo-student`?
4. when should you regenerate instead of hand-writing a new frontend service?
5. why are rest-build commands related to, but not the same as, OpenAPI SDK generation?

## Why this matters

This workflow reduces duplicated type work across backend and frontend.

Instead of manually keeping request and response shapes synchronized in two places, you let the backend contract remain the source truth and regenerate the frontend artifacts from it.

That is one of the clearest fullstack productivity wins in Cabloy.

## Read together with

- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [OpenAPI Guide](/backend/openapi-guide)
- [OpenAPI SDK Guide](/frontend/openapi-sdk-guide)
- [SDK Guide](/frontend/sdk-guide)
- [Server Data](/frontend/server-data)

## Next step

Continue to [Tutorial 5: One Contract Surface, Four Uses](/fullstack/tutorial-5-one-contract-four-uses).