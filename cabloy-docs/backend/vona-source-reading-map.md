# Vona Source Reading Map

This page is a practical map for contributors and AI workflows that need to read Vona backend source code efficiently.

It does not try to teach every backend subsystem from scratch. Instead, it answers a narrower question:

> when I need to understand one kind of Vona backend behavior, which files should I read first, and in what order?

Use this page together with:

- [Backend Source Reading Roadmap](/backend/backend-source-reading-roadmap)
- [Backend (Vona)](/backend/introduction)
- [Backend Foundation](/backend/foundation)
- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)
- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [Backend Directory Structure](/reference/backend-directory-structure)

## Why this page exists

In a framework-sized backend codebase, source reading usually becomes slow for one reason:

- you can already find _a_ relevant file
- but you do not yet know the shortest path to the _next_ file

Vona especially benefits from a reading map because several layers cooperate at once:

- root scripts and CLI wrappers
- generated metadata surfaces
- controller / service / model / entity layering
- module and suite boundaries
- project-level backend hooks such as play or build helpers

This page gives a compact starting sequence for each common backend topic so readers can move from concept guide to source path without drifting.

## How to use this page

For each topic below:

1. start with the concept guide to refresh the architectural intent
2. read the first source file to identify the public entry surface
3. continue into the next runtime file only if you still need the implementation detail
4. stop as soon as you have enough information for the task

The goal is not to read the entire backend tree every time. The goal is to choose the shortest accurate path.

## 1. CLI and backend startup entry path

Use this path when you are asking questions like:

- where does backend execution enter from the repo root?
- how does `npm run vona` reach the Vona CLI?
- where does `play` diverge from normal CLI startup?
- where does the backend build or verification hook surface begin?

### Read the docs first

- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)
- [Backend (Vona)](/backend/introduction)
- [Backend Directory Structure](/reference/backend-directory-structure)

### Then read source in this order

1. `package.json`
2. `vona/packages-cli/cli/src/bin/vona.ts`
3. `vona/packages-cli/cli/src/start.ts`
4. `vona/src/backend/cli.ts`
5. `vona/src/backend/play/index.ts`

### What each file clarifies

- `package.json` shows the root `vona` script and the shared monorepo workflow entrypoint
- `vona.ts` shows how raw CLI argv is normalized, how `play` is treated specially, and where normal execution hands off to `VonaCommand`
- `start.ts` shows the CLI bootstrap class itself
- `src/backend/cli.ts` shows the project-level backend build hook surface
- `src/backend/play/index.ts` shows the backend playground-oriented verification entrypoint through `mockCtx(...)`

## 2. Representative backend resource and module CRUD path

Use this path when you are asking questions like:

- how is one backend module wired end-to-end?
- where do controller, service, model, and entity responsibilities separate?
- where do generated metadata and API path registrations live?

### Read the docs first

- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [Backend Directory Structure](/reference/backend-directory-structure)

### Then read source in this order

1. `vona/src/suite/a-training/modules/training-student/src/index.ts`
2. `vona/src/suite/a-training/modules/training-student/src/.metadata/index.ts`
3. `vona/src/suite/a-training/modules/training-student/src/controller/student.ts`
4. `vona/src/suite/a-training/modules/training-student/src/service/student.ts`
5. `vona/src/suite/a-training/modules/training-student/src/model/student.ts`
6. `vona/src/suite/a-training/modules/training-student/src/entity/student.tsx`

### What each file clarifies

- `index.ts` shows the module export surface and tells you that generated metadata is part of the public reading path
- `.metadata/index.ts` shows the generated registration surface for entity, model, service, controller, DTO, API path, and scope wiring
- `controller/student.ts` shows the resource-facing HTTP layer through `@Controller('student')`, `@Resource()`, and CRUD methods delegating to `this.scope.service.student`
- `service/student.ts` shows the orchestration layer delegating to `this.scope.model.student`
- `model/student.ts` shows the compact model binding from `@Model(...)` to `EntityStudent`
- `entity/student.tsx` shows the entity fields plus OpenAPI and Zova render metadata that drive the broader contract loop

### When to continue into DTOs

If your next question becomes one of these:

- what is the request/response DTO shape for this resource?
- where do the select/view/create/update transport contracts live?

then continue into the module DTO files referenced from `.metadata/index.ts`.

If your next question is instead about generated registration, onion names, or API path typing, return to `.metadata/index.ts` before reading deeper.

If the next question becomes specifically about explicit DTOs, inferred DTO helpers, or how DTO choices surface in generated metadata, continue with [DTO Infer and Generation](/backend/dto-infer-generation).

If the next question becomes specifically about how those controller, DTO, and entity surfaces become emitted backend contract, continue with [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map).

## 3. A compact reading strategy

When in doubt, use this order:

1. read the concept guide first
2. open the smallest source entrypoint that matches your question
3. read the generated metadata surface early when the topic spans multiple backend layers
4. only then descend into controller, service, model, or entity details

That order usually gets you to the answer faster than starting from the deepest backend runtime file first.

## Where to read next

- If you now want a proof-oriented layer-by-layer backend validation workflow, continue with [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook).
- If something already looks wrong and you want symptom-first diagnosis, continue with [Backend Source Reading Debug Checklist](/backend/backend-source-reading-debug-checklist).

## Final takeaway

The fastest way to read Vona accurately is not to memorize every file under `vona/`.

It is to recognize which question you are asking first:

- CLI and startup entry question
- resource and module wiring question
- DTO and generated-metadata question

Then start from the smallest public source surface that matches that question and only descend into deeper files as needed.
