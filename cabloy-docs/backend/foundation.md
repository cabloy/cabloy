# Backend Foundation

This page migrates the most important architectural ideas from the legacy Vona introduction into the new unified docs site.

## What Vona is in Cabloy

Vona is the backend half of the Cabloy fullstack architecture.

It is designed for building `SSR`, `SPA`, `Web`, and `Admin` experiences in one broader system while keeping frontend and backend concerns separated enough to evolve independently.

## Fullstack mechanism

The core fullstack pattern remains the same:

- Zova provides the frontend framework
- Vona provides the backend framework
- the backend and frontend cooperate through generated artifacts, runtime integration, and shared conventions

Important integration channels include:

- backend-generated Swagger/OpenAPI metadata for frontend SDK generation
- frontend-generated route, icon, and component types that can feed backend-side usage and tooling
- shared monorepo scripts that make both sides visible to humans and AI systems

## Why Vona matters for AI development

The legacy Vona introduction emphasized productivity, DTO generation, CRUD dynamic rendering, multi-tenancy, and broad infrastructure support. In the new monorepo docs, the most important translation is this:

Vona is not only a backend framework. It is a framework whose backend conventions already encode a large amount of fullstack knowledge that AI should reuse instead of re-deriving manually.

That is why the docs, skills, and rules in this repo prefer:

- `npm run vona`
- CLI-driven generation
- source-truth route and module inspection
- verification against current scripts and code

## High-value backend capabilities

From the legacy introduction, the most important enduring Vona capabilities include:

- modular architecture for suites and modules
- IOC container and dependency lookup
- AOP support across controller, internal, and external aspects
- DTO inference and generation
- CRUD-oriented workflows
- multi-tenancy
- multi-database and multi-datasource support
- transaction support
- caching, including two-layer cache
- playground support for quick verification

## Relationship to Cabloy Basic and Cabloy Start

Most of these backend concepts are shared across both editions.

The differences usually appear at the integration boundary, for example:

- which frontend modules consume the backend output
- which Zova flavors are paired with the backend
- which edition-specific assets or routes are present

So the rule is:

- explain the backend capability once
- annotate edition-specific integration points only where they actually diverge
