---
title: 'Next.js Integrated Full Stack and Cabloy’s Bidirectional Contract Loop'
titleZh: Next.js 的一体化全栈，与 Cabloy 的双向契约闭环
titleEn: 'Next.js Integrated Full Stack and Cabloy’s Bidirectional Contract Loop'
subtitle: Next.js and Cabloy both support full-stack delivery, but they place the runtime center, contract boundary, and cross-stack collaboration in different places.
summary: Next.js organizes Server Components, Client Components, Server Functions, and Route Handlers around a React App Router application. Cabloy keeps Vona and Zova as separate but coordinated framework layers, then moves verifiable contracts through explicit forward and reverse chains. This article helps technical decision makers choose based on system boundaries and collaboration needs rather than framework labels.
tags:
  - Next.js
  - React
  - Cabloy
  - Vona
  - Zova
  - API Contracts
  - Fullstack Architecture
slug: nextjs-integrated-fullstack-cabloy-contract-loop
cover: ./cover-en-v1.png
date: 2026-08-17
---

# Next.js Integrated Full Stack and Cabloy’s Bidirectional Contract Loop

> Full stack does not have to mean erasing the frontend-backend boundary. It can also mean retaining distinct boundaries and moving contracts across them through verifiable handoffs.

A Node.js full-stack team often reaches a practical fork: should the React web application be the main center for organizing server and client capabilities, or should a dedicated backend and frontend retain separate runtimes and ownership while generated contracts coordinate them?

This is not primarily a React-versus-Vue choice, nor a monolith-versus-microservices choice. It is a question of **where runtime responsibility lives, who owns contract truth, how a change propagates, and how a team proves that downstream consumers remain current.**

Next.js and Cabloy can both deliver full-stack applications, but they optimize different collaboration models. **Next.js organizes server and client capabilities around a React/App Router application. Cabloy keeps Vona and Zova as separate but coordinated framework layers, with explicit forward and reverse contract handoffs between them.** This is a comparison of default architectural centers and collaboration mechanisms—not a claim that either approach wins for every project.

## Next.js: integrated full stack around React and the App Router

Next.js describes itself as a React framework for building full-stack web applications. In the App Router, pages and layouts are [Server Components by default](https://nextjs.org/docs/app/getting-started/server-and-client-components). The `"use client"` directive establishes a client-module boundary for interactive state, event handlers, and browser APIs. These are parts of one React application tree, not two unrelated applications.

Next.js also puts several server-facing capabilities inside that application model:

- **Server Components** can fetch on the server and reduce client-side JavaScript;
- **Server Functions / Server Actions** let UI invoke server-side operations through framework mechanisms, especially for mutations;
- **Route Handlers** provide HTTP endpoints based on Web `Request` and `Response` APIs in the `app` directory;
- Route Handlers can act as a web-facing boundary for aggregation, proxying, webhooks, or API concerns.

So it is inaccurate to call Next.js “frontend only.” A more precise statement is that it locates server capabilities inside the organizational model of a React web application and its App Router. Its [Backend for Frontend guide](https://nextjs.org/docs/app/guides/backend-for-frontend) also draws an important boundary: those backend capabilities serve BFF use cases, but **are not a full replacement for every broader backend need**. That is not a judgment about capability; it reminds teams to design data, identity, authorization, background work, cross-consumer APIs, and infrastructure around their own system boundaries.

```text
Next.js App Router

Server Components ──┐
Server Functions ───┼── server capabilities of a React web app ──▶ Client Components / browser
Route Handlers ────┘
```

This model is especially direct when the React application is the primary delivery and architectural center: rendering, routes, page data, interactive mutations, and web-facing endpoints can be organized through closely related conventions.

## Shared TypeScript is valuable—but does not automatically become a runtime contract

Reusing TypeScript declarations in one Next.js project, monorepo, or shared package is valuable. It can align compile-time request and response descriptions, improve editor-assisted refactoring, and make common domain utilities natural to share. Typed Server Functions can also offer a strong developer experience to supported callers inside the project.

But “shared TypeScript types” needs a clear boundary. TypeScript annotations do not remain as JavaScript runtime objects; they are erased during compilation, as explained in the TypeScript handbook’s [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

A shared declaration therefore does not automatically provide:

- runtime validation for incoming JSON, form data, URL parameters, or database results;
- an API description that independent processes, versions, or other languages can consume;
- OpenAPI, an SDK, or another generated handoff;
- serialization compatibility across a Server/Client boundary;
- authorization or confidentiality boundaries.

> Shared TypeScript can remove compile-time duplication. By itself, however, it is not an API contract that is runtime-validated, process-portable, language-neutral, or independently versioned.

This is not a Next.js limitation or flaw. A Next.js application can deliberately add runtime schemas, OpenAPI, RPC, validation libraries, and code generation where they fit. The point is simply that such capabilities are architectural layers a team chooses and maintains; they do not appear merely because two modules import the same interface.

Type compatibility also does not replace a transport constraint. Values passed from a Server Component to a Client Component must satisfy React’s supported serialization model. A TypeScript type alone cannot prove that a runtime value may cross that boundary. The [Server and Client Components documentation](https://nextjs.org/docs/app/getting-started/server-and-client-components) explains the boundary.

## Cabloy: retain Vona/Zova boundaries and coordinate them through a contract loop

Cabloy starts from a different model. It uses a [frontend-backend separation architecture](/fullstack/vona-zova-integration):

- **Vona** provides the backend runtime and backend contract capabilities;
- **Zova** provides frontend application capabilities;
- they belong to one full-stack system and monorepo workflow, but not to a shared runtime container;
- contracts, metadata, generated artifacts, build outputs, and synchronization steps are the collaboration material—not raw source execution across the two sides.

```text
Vona and Zova are separate but coordinated framework layers.
They collaborate through contracts, metadata, generated artifacts, build output, and verification.
```

Cabloy calls this bidirectional collaboration a [contract loop](/fullstack/contract-loop-playbook). It is not magic in which saving an arbitrary file teaches the other side everything. It is a model that names the contract source, the generated handoff, and the verification performed by each consumer. Two directional chains are central to it.

## The forward chain: backend contracts reach frontend consumers

When truth for an API request/response, DTO, entity field, validation rule, or OpenAPI metadata belongs on the Vona side, use the **forward chain**:

```text
Vona Controller / DTO / Entity / validation
  → Swagger / OpenAPI
  → Zova generated SDK / schema-aware helpers
  → frontend API, thin Model facades, page consumers
```

Vona emits Swagger/OpenAPI from Controller request and return contracts, DTO/Entity fields, validation, and API metadata. Zova consumes that output to generate SDK or schema-aware frontend material. Frontend code can add business semantics over it, but usually as thin Model facades rather than as a second handwritten request/response contract. See [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk) for the full bridge.

The chain is not complete just because backend code changed. Completion means:

1. backend source truth is correct;
2. emitted OpenAPI demonstrably reflects the intent;
3. the affected generated frontend consumers are refreshed;
4. frontend consumers and UI behavior are verified.

For this reason, when a backend contract changes, the preferred order is: **prove the OpenAPI output first, then regenerate frontend consumers; do not patch generated frontend types first to conceal an upstream change.**

## The reverse chain: frontend-owned structural resources reach backend consumers

Cabloy’s distinction is not only that a backend can generate a frontend SDK. Some facts naturally belong to the frontend: routes, components, icons, custom form-field/table-cell renderers, and related metadata. When backend metadata, tooling, type surfaces, or SSR/integration paths must see those resource identities, use the **reverse chain**:

```text
Zova route / component / icon / renderer / metadata
  → generated metadata or relevant flavor build output
  → npm run deps:vona
  → Vona metadata, tooling, type, or SSR/integration consumers
```

In a typical Cabloy Basic path, after frontend source truth changes, generate metadata when applicable, build the affected Zova flavor, run `npm run deps:vona`, and verify that Vona-side consumers resolve the refreshed handoff. [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend) documents the exact bridge and its boundaries.

Three common misconceptions are worth correcting:

| Misconception                                                               | More accurate model                                                                                                                         |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Saving a frontend component automatically makes it available to the backend | Frontend source truth must pass through metadata/generation, build, and synchronization before backend consumers see the generated handoff. |
| A reverse chain means the backend executes a frontend component             | A backend contract or metadata can select a frontend resource identity; its renderer implementation and execution remain in Zova.           |
| REST output alone completes reverse synchronization                         | When the SSR bundle and REST output need to move together, the relevant Zova build and `deps:vona` remain part of the complete handoff.     |

If generated output already contains the expected resource or type but a consumer remains stale, distinguish **local dependency drift** from a source-code problem rather than blindly modifying both sides. Naming that diagnostic branch is one practical benefit of the contract loop.

## Different full-stack centers, different collaboration defaults

The table compares typical architectural centers and default collaboration models, not capability limits. Both ecosystems can combine additional tools, external services, and organizational patterns.

| Decision dimension                     | Next.js: App Router center                                                                          | Cabloy: Vona/Zova contract-loop center                                                    |
| -------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Architecture center                    | One React web application integrating server and client capabilities                                | Separate but coordinated backend and frontend framework layers                            |
| Primary full-stack interaction         | Server/Client Components, Server Functions, and Route Handlers                                      | Explicit contracts and generated handoffs between Vona and Zova                           |
| Backend role                           | Server capabilities and BFF endpoints inside the web app; can also work with other backend services | Dedicated Vona runtime for business services, data, and contracts                         |
| Compile-time type collaboration        | Shared declarations can be reused in a project or package                                           | Backend-emitted contracts drive SDK/schema-consumer generation                            |
| Runtime / portable API contract        | Teams choose a runtime-schema, OpenAPI, RPC, or codegen approach when needed                        | Vona OpenAPI is an explicit forward-chain handoff                                         |
| Frontend-to-backend structural handoff | Defined by project-specific tools and conventions                                                   | An explicit Zova → build/sync → Vona reverse chain for supported metadata/resources       |
| Definition of a completed change       | Defined by the team’s validation, test, and release workflow                                        | Source truth, generation/build/sync, and consumer verification all complete the loop      |
| A direct fit when                      | React and web delivery are the architectural center                                                 | A dedicated backend, long-lived modules, and explicit cross-stack coordination are needed |

## Choose the collaboration model before choosing the slogan

Consider Next.js first when:

- React is an intentional frontend center and the App Router rendering/interaction model is the main organizing model;
- the primary delivery target is a web application and a Route Handler BFF boundary is sufficient for web-facing integration;
- the team prefers to choose runtime API contracts, backend infrastructure, and cross-service coordination independently;
- colocating page behavior, server data access, and mutations makes the current system simpler.

Consider Cabloy first when:

- the system needs a dedicated backend layer with ownership explicitly held by Vona;
- multiple long-lived modules, Admin/Web delivery, SSR, and business infrastructure need stable collaboration conventions;
- backend-generated API contracts and frontend-owned structural resources both need controlled, verifiable cross-boundary handoffs;
- the team treats generation, builds, synchronization, and verification as part of completing a change rather than relying on implicit assumptions.

Both choices have costs. Next.js does not decide runtime validation, API boundaries, authorization, data-layer choices, or long-term contract evolution for a team; as a system grows, those decisions still need governance. Cabloy is not a lighter shortcut: developers need to learn Vona/Zova boundaries, suite/module ownership, contract sources, generated artifacts, flavor builds, and synchronization. For a small, well-bounded React web application, the full contract loop may not be economical.

## Two small experiments

Rather than debating frameworks first, let the team run one small experiment in each model:

1. **Next.js experiment:** Build an interactive page with a Server Component, Client Component, Server Function/Action, and Route Handler. Record where runtime validation happens, who owns external API request/response contracts, and when a BFF is appropriate instead of direct use of a downstream service.
2. **Cabloy experiment:** In Cabloy Basic, trace one Resource from a Vona Controller/DTO/validation change through OpenAPI to a Zova SDK/schema consumer. Then trace one frontend renderer or metadata resource through generation, the relevant flavor build, and `deps:vona` to a Vona-visible handoff. Start with the [Fullstack Tutorials](/fullstack/tutorials-overview).

## Conclusion

The decision is not which framework is “more full stack.” Next.js is strong at integrating server and client capability around a React application. Cabloy is strong at preserving dedicated Vona and Zova boundaries while making cross-boundary collaboration a bidirectional contract loop with a source of truth, a generated handoff, and verification.

For a technical decision maker, the real question is: **should the center of full-stack collaboration be the React web application runtime, or a contract loop that is generated, synchronized, and verified across dedicated framework layers?** Answer that first, then select the tools; it is usually more durable than beginning with “which framework is newer” or “which is more powerful.”

## Further reading and sources

### Official Next.js and TypeScript documentation

- [Next.js: Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Next.js: Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers)
- [Next.js: Mutating Data with Server Functions and Actions](https://nextjs.org/docs/app/getting-started/mutating-data)
- [Next.js: Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [TypeScript: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

### Cabloy architecture and contract loop

- [Vona + Zova Integration](/fullstack/vona-zova-integration)
- [Contract Loop Playbook](/fullstack/contract-loop-playbook)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)
