# Fullstack Introduction

Cabloy is a Node.js fullstack framework for AI vibe coding, with AI Spec-Driven Development guiding work from confirmed specs to verifiable delivery.

## Shared architecture

Vona provides the backend framework and runtime. Zova provides the frontend framework and application layer. Suites and modules organize capabilities across Admin, Web, SSR, and SPA applications. Root scripts and CLI workflows connect these layers within each edition repository.

Cabloy Basic and Cabloy Start are complete, separate project baselines built on this architecture. They share the Vona + Zova engineering model but can differ in UI layer, frontend flavors, modules, SSR sites, and project assets. See [Editions Overview](/editions/overview) before choosing edition-specific commands or UI conventions.

## How Vona and Zova connect

### Vona integrated SSR

Zova builds the frontend application and SSR artifacts. In Vona integrated SSR, Vona consumes those artifacts to render the page, and the frontend hydrates it in the browser.

Zova standalone SSR is a separate development-server entry point for frontend work. Opening it directly does not verify the Vona integration path. See [Vona + Zova Integration](/fullstack/vona-zova-integration) and [SSR Overview](/frontend/ssr-overview) for the two layers in more detail.

### Bidirectional contract loop

Type information moves in both directions, with a different source of truth on each side:

- **Backend to frontend:** Vona emits OpenAPI contracts that Zova uses to generate SDKs and schema-aware helpers.
- **Frontend to backend:** Zova generates metadata and types for routes, components, and icons that backend tooling and type hints can consume.

The [Contract Loop Playbook](/fullstack/contract-loop-playbook) explains the generation, handoff, and verification steps for each direction, including recovery when generated output or local dependencies are stale.

## How spec-driven delivery fits

[AI Spec-Driven Development](/ai/ai-spec-driven-development) uses Traceable Spec Delivery to carry confirmed product intent into bounded work and verifiable evidence. The contract loop keeps Vona and Zova consumers aligned when that work changes a fullstack contract. Contract synchronization alone does not establish product approval or complete acceptance.

For schema-driven UI decisions, the [Semantic Presentation Contract](/fullstack/semantic-presentation-contract) connects the approved audience and task to the appropriate renderer without changing security or ownership authority.

## Technology layers

- **Backend:** Vona uses Koa, Knex, Redis, and database drivers.
- **Frontend:** Zova uses Vue, Vite, Quasar tooling, and TanStack libraries. Quasar is part of the engineering toolchain, not the edition UI component library.
- **Edition UI:** Cabloy Basic uses DaisyUI + Tailwind CSS; Cabloy Start uses Vuetify.

For exact versions, inspect `vona/package.json` and `zova/package.json` in the active edition checkout.

## Continue reading

- **Explore the framework's origins:** [CabloyJS Development History](/fullstack/development-history).
- **Start a project:** [choose an edition](/editions/overview#choosing-an-edition), then follow the [Fullstack Quickstart](/fullstack/quickstart).
- **Build a feature:** use the [Fullstack Tutorials](/fullstack/tutorials-overview) and [Fullstack CLI](/fullstack/cli).
- **Work with AI agents:** start with the [AI Development Introduction](/ai/introduction) for repository guidance and skills.
