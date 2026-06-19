# Backend Source Reading Roadmap

This page is a lightweight roadmap for reading the Cabloy Basic backend source.

Use it when your question is not yet “which exact source file should I open next?” but:

- where should I start reading Vona backend source?
- which backend topic cluster matches my question?
- should I begin with a concept guide or a source-reading map?

## Why this page exists

The backend docs already explain the main Vona concepts well:

- backend architecture
- CLI and scripts
- controller / service / model / entity responsibilities
- runtime and distributed infrastructure

That is good for conceptual understanding, but it still leaves a common follow-up question:

> which backend page should I read next before I start opening framework or module source files?

This page solves that problem.

It is a chooser, not another backend runtime deep dive.

## How to use this page

Use this rule of thumb:

- if you are new to the topic, start with the **concept guide** first
- if you already know the concept and want the shortest path into source, go to the **source-reading map**
- if you only need one backend specimen, choose the smallest topic cluster below and stop as soon as you have enough context

## Architecture spine: start here first

If you need the shortest path into the backend mental model, start with these pages:

- [Backend (Vona)](/backend/introduction)
- [Backend Foundation](/backend/foundation)
- [Backend Essentials](/backend/backend-essentials)
- [Backend CLI](/backend/cli)
- [Backend Directory Structure](/reference/backend-directory-structure)

A practical reading order is:

1. Backend (Vona)
2. Backend Foundation
3. Backend Essentials
4. Backend CLI
5. Backend Directory Structure

Then move to [Vona Source Reading Map](/backend/vona-source-reading-map) when you want the shortest file-order path into current source.

If your next question becomes “how do I prove or diagnose the backend source-reading path itself?”, continue with [Backend Source Reading Verify Playbook](/backend/backend-source-reading-verify-playbook) and [Backend Source Reading Debug Checklist](/backend/backend-source-reading-debug-checklist).

## Topic cluster: startup and CLI entry

Start here when your question is about:

- root backend entrypoints
- `npm run vona`
- CLI command families
- backend build or play entry surfaces

### Concept pages first

- [Backend (Vona)](/backend/introduction)
- [Backend CLI](/backend/cli)
- [Backend Scripts](/backend/scripts)
- [Backend Directory Structure](/reference/backend-directory-structure)

### Best next step

- if the question is “which root script enters the backend CLI?” -> read [Backend CLI](/backend/cli)
- if the question is “which scripts drive normal backend dev/build/start/test workflows?” -> read [Backend Scripts](/backend/scripts)
- if the question is “which source files should I open first?” -> read [Vona Source Reading Map](/backend/vona-source-reading-map)

## Topic cluster: resource and module CRUD chain

Start here when your question is about:

- how one backend module is wired
- how controller, service, model, and entity responsibilities separate
- where generated metadata and API path registration live

### Concept pages first

- [Controller Guide](/backend/controller-guide)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [Backend Directory Structure](/reference/backend-directory-structure)

### Best next step

- if the question is “what does each backend layer own?” -> read the concept guides above first
- if the question is “which concrete source files should I read in order?” -> read [Vona Source Reading Map](/backend/vona-source-reading-map)
- if the question becomes “how should I choose between explicit DTOs, inferred DTOs, and wrapped DTO helpers?” -> read [DTO Infer and Generation](/backend/dto-infer-generation)
- if the question becomes “how do controller, DTO, and entity metadata become emitted OpenAPI contract?” -> read [Backend Contract Emission Specimen](/backend/backend-contract-emission-specimen), then [Backend Contract Emission Source Reading Map](/backend/backend-contract-emission-source-reading-map)
- if the question becomes “what was actually emitted on the output side?” -> continue with [Backend Contract Emission Output Inspection](/backend/backend-contract-emission-output-inspection)

## What this roadmap intentionally does not cover yet

This first backend source-reading roadmap is intentionally narrow.

It does **not** try to become the new entry page for every backend subsystem such as:

- workers
- queues
- websockets
- auth
- cache
- distributed runtime internals

Those topics already have their own concept docs. This roadmap is only the first navigation layer for common source-reading tasks.

## Final rule

When in doubt:

1. start with the backend concept guide that matches your question
2. use this roadmap to choose the right cluster
3. only then move to [Vona Source Reading Map](/backend/vona-source-reading-map)

This roadmap is the chooser.

The detailed file-order reading path belongs to the source-reading map.
