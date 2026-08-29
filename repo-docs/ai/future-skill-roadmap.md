# Future Skill Roadmap

This page turns the current documentation work into a practical roadmap for future Cabloy skills.

## Why a roadmap helps

The docs now describe a large portion of the Cabloy backend, frontend, fullstack, and edition-aware workflow surface.

A roadmap helps convert that documented knowledge into a focused set of high-value skills rather than a random collection of prompts.

## What already exists

Current root skills include:

- `cabloy-workflow`
- `cabloy-domain-planning`
- `cabloy-spec-generation`
- `cabloy-spec-execution`
- `cabloy-backend-scaffold`
- `cabloy-frontend-scaffold`
- `cabloy-contract-loop`
- `cabloy-resource-field-update`
- `cabloy-module-removal`
- `cabloy-master-detail`
- `cabloy-worktree-environment`
- `cabloy-zova-source-reading`

Their current roles are:

- `cabloy-workflow` → broad workflow selection, edition detection, CLI-first routing, and verification framing
- `cabloy-domain-planning` → suite-first naming proposals, providerId confirmation, module-boundary suggestions, and scaffold handoff for new business domains
- `cabloy-spec-generation` → repository-native suite planning authority, traceability, confirmation, and derived planning views
- `cabloy-spec-execution` → one approved WBS increment through readiness gates, specialist routing, evidence, and derived status
- `cabloy-backend-scaffold` → Vona implementation routing and CLI-backed backend scaffolding
- `cabloy-frontend-scaffold` → Zova implementation routing and CLI-backed frontend scaffolding
- `cabloy-contract-loop` → backend/frontend contract regeneration, reverse-chain handling, and drift diagnosis
- `cabloy-resource-field-update` → existing backend resource-field changes with `fileVersion` and renderer-aware follow-up
- `cabloy-module-removal` → backend/frontend/fullstack module deletion order, generated-runtime cleanup, and verification
- `cabloy-master-detail` → coordinated master-detail resource workflow
- `cabloy-worktree-environment` → confirmed worktree-local environment tuple setup for intentional parallel work
- `cabloy-zova-source-reading` → Zova-first source reading and Vue comparison workflow

This is now a stronger foundation skill set, but it still leaves several useful workflow families for future specialization.

## Recommended next skill families

The backend scaffold, frontend scaffold, contract-loop, resource-field-update, and metadata-refresh workflow families already have implemented specialist coverage. Future work should refine those skills only when a new repository-wide branch or stable verification need emerges.

### 1. Distributed backend workflow skill

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
- `repo-docs-internal/`
- `.claude/skills/`
- the Vona and Zova CLIs

That is how Cabloy gets long-term value from the documentation work.
