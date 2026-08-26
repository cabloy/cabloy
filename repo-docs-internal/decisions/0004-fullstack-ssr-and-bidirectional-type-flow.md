# ADR 0004: Preserve Fullstack SSR and Bidirectional Type-Flow Principles

## Status

Accepted.

## Background

Cabloy’s public fullstack documentation needs a durable explanation for how Vona and Zova work together as one framework system.

Two principles recur across the current source and docs surface:

1. frontend build output participates directly in the backend-side SSR flow
2. type information flows in both directions between backend and frontend

These principles are easy to blur because older standalone-repo descriptions, current monorepo workflows, public tutorials, and internal rationale do not serve the same purpose.

## Problem

Without an explicit decision record, future contributors are likely to simplify this area in ways that weaken the framework model.

The most common failure modes are:

1. document SSR as a frontend-only concern and forget that backend rendering depends on frontend build artifacts
2. document type sharing as backend-to-frontend only and hide the reverse metadata path
3. explain the model through one historical copy/build mechanic instead of the durable framework contract
4. push maintainer rationale into public docs without enough trimming for user-facing documentation

If those mistakes accumulate, Cabloy starts to read like loosely coordinated backend and frontend projects rather than one connected fullstack system.

## Decision

Preserve the Cabloy fullstack model through two explicit boundaries.

### Boundary 1: frontend build output is part of the backend-side SSR contract

Treat frontend build output and SSR-related artifacts as part of the backend-side SSR flow rather than as an optional downstream byproduct.

In practice, this means:

- Zova owns frontend application authoring
- Vona owns backend runtime behavior
- backend rendering and frontend hydration are documented as one coordinated path
- legacy explanations about placing a frontend bundle into the backend may be used as historical context, but should not be mistaken for the full durable contract or one required mechanic

### Boundary 2: the type-flow contract is bidirectional

Treat fullstack type sharing as a two-way contract loop rather than a one-way backend export.

In practice, this means:

- Vona emits Swagger/OpenAPI contract metadata that Zova can consume for SDK generation and related schema-aware tooling
- Zova generates structural metadata and typing surfaces that can improve backend-side tooling, integration logic, and type hints
- docs and skills should keep both directions visible instead of emphasizing only the backend-to-frontend path

## Why this decision was chosen

### 1. It matches the framework contract better than historical workflow descriptions

Older standalone-repo descriptions are useful references, but they overemphasize specific mechanics such as copying built output.

The durable framework rule is broader:

- frontend build output participates in backend-side SSR
- the exact workflow surface may evolve with the monorepo

### 2. It preserves Cabloy as one connected fullstack system

The goal is not only repository convenience.

The goal is to keep backend runtime, frontend delivery, generated contracts, and generated metadata aligned closely enough that contributors and AI systems can reason from current source truth instead of hand-maintained memory.

### 3. It keeps the contract loop explicit in both directions

The backend OpenAPI -> frontend SDK path is visible and easy to explain.

The frontend metadata -> backend tooling path is easier to forget.

Making the bidirectional rule explicit reduces the chance that docs, skills, or future tooling silently collapse the model into a one-way contract story.

### 4. It keeps public and internal documentation roles separate

Public docs should explain the model in the smallest form that helps users and AI workflows.

Internal records should preserve the rationale, failure modes, and boundaries that maintainers need.

This ADR exists so that public docs do not need to carry all of the internal reasoning.

## Alternatives considered

### Alternative A: keep this only as a public-doc wording choice

Rejected because:

- the issue is not only wording
- the repo needs a durable maintainer-level record of the framework boundaries
- docs, skills, and future workflow guidance all depend on the same decision

### Alternative B: keep this only as an architecture note

Rejected because:

- the topic is a durable framework-level decision, not only a subsystem explanation
- future contributors benefit from a formal accepted record alongside the architecture notes
- the decision has explicit consequences for public docs, internal docs, and AI guidance

### Alternative C: describe only current monorepo mechanics and omit the boundary language

Rejected because:

- current mechanics can change while the contract remains the same
- overfitting docs to one implementation path makes later maintenance noisier
- the repo needs a stable explanation that survives script and packaging evolution

## Consequences

### Benefits

- fullstack docs can explain the common principle once, then branch into detailed pages
- internal rationale remains durable without leaking too much detail into user-facing docs
- docs and AI assets are less likely to collapse the model into one-way type sharing
- future workflow changes can be evaluated against stable boundaries rather than against one historical mechanic

### Trade-off

This ADR adds one more durable concept that contributors must preserve when touching docs, skills, or cross-stack workflow guidance.

That trade-off is acceptable because the fullstack model is one of the framework’s core differentiators.

## Guidance for future work

When editing fullstack docs, skills, or workflow guidance, preserve these rules:

1. describe SSR as one coordinated backend/frontend path
2. keep backend OpenAPI -> frontend SDK explicit
3. keep frontend metadata -> backend tooling explicit
4. avoid reducing the model to one generated artifact or one historical copy path
5. keep public explanations concise and move maintainer rationale into internal docs when needed

## Related records

- `repo-docs-internal/architecture/ai-enablement.md`
- `repo-docs/fullstack/introduction.md`
- `repo-docs/fullstack/vona-zova-integration.md`
- `repo-docs/fullstack/openapi-to-sdk.md`
- `repo-docs/fullstack/frontend-metadata-to-backend.md`
