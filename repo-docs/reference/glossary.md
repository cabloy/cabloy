# Glossary

## Cabloy

The coordinated Node.js fullstack system that combines backend and frontend workflows.

## Vona

Cabloy's backend framework and runtime layer.

## Zova

Cabloy's frontend framework and application layer.

## Cabloy Basic

The public reference and community edition baseline for the shared Cabloy architecture, created with `npm create cabloy`.

## Cabloy Start

The public MIT-licensed business-system edition baseline for the shared Cabloy architecture, maintained in a sibling repository and initialized with `npm run init` after cloning.

Vona and Zova describe architectural layers; Cabloy Basic and Cabloy Start describe complete edition baselines built with those layers.

## Edition detection

The process of identifying whether the current repo is Cabloy Basic or Cabloy Start before choosing a workflow, example, or skill branch.

## Vona integrated SSR

The SSR path owned by the Vona server: Vona accepts the HTTP request, selects the SSR site, and dispatches the built Zova SSR runtime before returning the response. In the Cabloy Basic default environment, this is reached through Vona's `SERVER_LISTEN_PORT` at `7102`.

## Zova standalone SSR

The SSR path served directly by the Zova development server, used for frontend page, route, and hydration iteration. In the Cabloy Basic default environment, this uses `DEV_SERVER_PORT` `9000`. It does not by itself prove Vona site matching, artifact handoff, or integrated SSR acceptance.

A Zova standalone SSR server is a runtime entry mode, not the same thing as an independently deployable SSR Site/flavor. The latter describes an application boundary and its deployment identity.

## CLI-first

The practice of using existing Vona and Zova command families before attempting manual scaffolding or refactor work.

## AI Spec-Driven Development

Cabloy's AI-assisted approach for moving from confirmed product intent to verifiable delivery evidence. It is the public entry point for [Traceable Spec Delivery](/ai/ai-spec-driven-development), not a claim of unconstrained or autonomous delivery.

## Traceable Spec Delivery

Cabloy's repository-native method for tracing `PRD → SRS → WBS → ATP → Evidence`. It keeps authority at the owning record and delivers bounded increments with evidence-backed status. See [AI Spec-Driven Development](/ai/ai-spec-driven-development).

## Evidence-gated delivery

The status discipline in which `implementation-complete` and `verified` remain distinct: `verified` requires retained, linked, redacted observed evidence for the applicable WBS checks and ATPs. See [AI Spec-Driven Development](/ai/ai-spec-driven-development).

## Contract Loop

Cabloy's bidirectional Vona↔Zova model for synchronizing contract sources, generated handoffs, and consumers through forward and reverse chains. It is complementary to, not a substitute for, Traceable Spec Delivery. See [Contract Loop Playbook](/fullstack/contract-loop-playbook).

## Semantic Presentation Contract

The design boundary that translates a confirmed audience, task, scene, information area, and operation DTO contract into presentation metadata and renderer choices without redefining API, persistence, validation, authorization, state ownership, or SSR privacy. See [Semantic Presentation Contract](/fullstack/semantic-presentation-contract).

## Read next

Use the glossary together with:

- [Fullstack Introduction](/fullstack/introduction)
- [Backend (Vona)](/backend/introduction)
- [Frontend (Zova)](/frontend/introduction)
- [Editions Overview](/editions/overview)
- [Package Map](/reference/package-map)
