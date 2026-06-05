# Future Skill Roadmap

This page turns the current documentation work into a practical roadmap for future Cabloy skills.

## Why a roadmap helps

The docs now describe a large portion of the Cabloy backend, frontend, fullstack, and edition-aware workflow surface.

A roadmap helps convert that documented knowledge into a focused set of high-value skills rather than a random collection of prompts.

## What already exists

Current root skill:

- `cabloy-workflow`

Its current role is broad workflow selection:

- detect Basic vs Start
- classify backend/frontend/fullstack/docs work
- prefer CLI-first behavior
- suggest verification

This is a strong foundation skill, but it is intentionally general.

## Recommended next skill families

### 1. Backend scaffold skill

Purpose:

- scaffold Vona controller/service/model/entity/dto/CRUD threads
- choose between bean creation and CRUD generation
- verify migration/test implications

Primary dependencies:

- Vona `create:*`
- Vona `tools:*`
- backend docs in `cabloy-docs/backend/`

### 2. Frontend scaffold skill

Purpose:

- scaffold Zova pages/components/API/models
- branch correctly between Basic and Start
- use create/refactor commands before manual edits

Primary dependencies:

- Zova `create:*`
- Zova `refactor:*`
- frontend docs in `cabloy-docs/frontend/`

### 3. Fullstack contract loop skill

Purpose:

- detect backend contract changes
- regenerate OpenAPI/SDK-related output
- verify backend/frontend contract alignment

Primary dependencies:

- Vona OpenAPI and validation docs
- Zova OpenAPI SDK and server-data docs
- fullstack collaboration docs

### 4. Metadata refresh skill

Purpose:

- detect when route/component/icon or related changes require metadata regeneration
- run the right metadata flow
- verify generated artifacts belong to the active edition

Primary dependencies:

- Zova `tools:*`
- CLI-to-skill mapping
- edition detection docs

### 5. Distributed backend workflow skill

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

- `cabloy-docs/`
- `CLAUDE.md`
- `.docs-internal/`
- `.claude/skills/`
- the Vona and Zova CLIs

That is how Cabloy gets long-term value from the documentation work.
