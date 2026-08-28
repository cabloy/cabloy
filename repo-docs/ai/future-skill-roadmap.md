# Future Skill Roadmap

This page turns the current documentation work into a practical roadmap for future Cabloy skills.

## Why a roadmap helps

The docs now describe a large portion of the Cabloy backend, frontend, fullstack, and edition-aware workflow surface.

A roadmap helps convert that documented knowledge into a focused set of high-value skills rather than a random collection of prompts.

## What already exists

Current root skills include:

- `cabloy-workflow`
- `cabloy-domain-planning`
- `cabloy-contract-loop`
- `cabloy-resource-field-update`
- `cabloy-module-removal`

Their current roles are:

- `cabloy-workflow` → broad workflow selection, edition detection, CLI-first routing, and verification framing
- `cabloy-domain-planning` → suite-first naming proposals, providerId confirmation, module-boundary suggestions, and scaffold handoff for new business domains
- `cabloy-contract-loop` → backend/frontend contract regeneration, reverse-chain handling, and drift diagnosis
- `cabloy-resource-field-update` → existing backend resource-field changes with `fileVersion` and renderer-aware follow-up
- `cabloy-module-removal` → backend/frontend/fullstack module deletion order, generated-runtime cleanup, and verification

This is now a stronger foundation skill set, but it still leaves several useful workflow families for future specialization.

## Recommended next skill families

### 1. Backend scaffold skill

Purpose:

- scaffold Vona controller/service/model/entity/dto/CRUD threads
- choose between bean creation and CRUD generation
- verify migration/test implications

Primary dependencies:

- Vona `create:*`
- Vona `tools:*`
- backend docs in `repo-docs/backend/`

### 2. Frontend scaffold skill

Purpose:

- scaffold Zova pages/components/API/models
- branch correctly between Basic and Start
- use create/refactor commands before manual edits

Primary dependencies:

- Zova `create:*`
- Zova `refactor:*`
- frontend docs in `repo-docs/frontend/`

### 3. Fullstack contract loop skill

Purpose:

- detect backend contract changes
- regenerate OpenAPI/SDK-related output
- verify backend/frontend contract alignment

Primary dependencies:

- Vona OpenAPI and validation docs
- Zova OpenAPI SDK and server-data docs
- fullstack collaboration docs

### 4. Resource field update skill

Purpose:

- handle updates to fields on existing backend resources
- force the right `fileVersion` decision for new persisted fields
- branch correctly between shared renderer reuse and custom renderer demo follow-up
- verify entity, locale, migration, test, metadata, build, and dependency-sync implications

Primary dependencies:

- Vona entity / migration / DTO workflow knowledge
- Zova metadata/build flows when renderer follow-up is involved
- [Existing Resource Field Update](/backend/resource-field-update)

### 5. Metadata refresh skill

Purpose:

- detect when route/component/icon or related changes require metadata regeneration
- run the right metadata flow
- verify generated artifacts belong to the active edition

Primary dependencies:

- Zova `tools:*`
- CLI-to-skill mapping
- edition detection docs

### 6. Distributed backend workflow skill

Purpose:

- route tasks into queue / schedule / broadcast / redlock / worker logic
- help choose the right distributed abstraction
- verify mode/flavor and transaction/cache implications

Primary dependencies:

- backend distributed docs
- Redis / queue / schedule / worker / broadcast / redlock pages

## What should stay in docs rather than becoming a skill

Not every good doc topic should become a skill.

Keep something in docs only when:

- it is mostly conceptual
- it has no procedural branching worth automating
- it primarily teaches architecture rather than driving action

Examples:

- high-level architecture foundations
- broad conceptual comparisons
- maintainership rationale

## Skill design rules for future Cabloy skills

Future skills should generally:

1. detect edition first when relevant
2. classify backend/frontend/fullstack/docs/distributed layer
3. prefer CLI/refactor/generator paths
4. read docs only where the explanation adds value
5. verify the result using the smallest correct command set

## Why this roadmap matters for AI workflows

The purpose of the roadmap is not to create many skills.

The purpose is to create a small number of high-leverage skills that directly reuse the knowledge system now being built in:

- `repo-docs/`
- `CLAUDE.md`
- an established internal-documentation home, when present
- `.claude/skills/`
- the Vona and Zova CLIs

That is how Cabloy gets long-term value from the documentation work.
