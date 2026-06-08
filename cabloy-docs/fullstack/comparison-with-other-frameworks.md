# Comparison with Other Frameworks

This page shows how **Cabloy** differs from several common framework choices, so readers can quickly see where Cabloy stands out as a Node.js fullstack framework system and which strengths come from the fullstack system as a whole versus the backend layer provided by **Vona**.

## What is being compared

Cabloy is a **Node.js fullstack framework system**.

That means the comparison is not only about a backend runtime or only about a frontend stack. It is about how **Vona** on the backend and **Zova** on the frontend stay aligned through shared conventions, shared scripts, SSR-aware delivery modes, and cross-stack generation workflows.

For the broader Cabloy model, start with these pages:

- [Fullstack Introduction](/fullstack/introduction)
- [Vona + Zova Integration](/fullstack/vona-zova-integration)
- [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk)
- [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend)

## Comparison lens

The sections below use the same comparison lens each time:

- **System center** — what the framework treats as the main architectural center
- **Backend model** — how much backend structure and infrastructure the framework provides by default
- **Frontend and admin model** — how the UI side is expected to evolve
- **Cross-stack workflow** — how backend/frontend contracts and generation workflows stay aligned
- **Best fit** — the kind of team or project the framework fits most naturally

## Cabloy vs Next.js

| Perspective              | Cabloy                                                                                         | Next.js                                                                |
| ------------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| System center            | One framework system with Vona on the backend and Zova on the frontend                         | Frontend-centric fullstack framework                                   |
| Backend model            | Dedicated backend framework with its own runtime, contracts, infrastructure, and CLI workflows | Backend capabilities are typically centered around the web app runtime |
| Frontend and admin model | Shared conventions across SSR, SPA, Web, and Admin applications                                | Strong fit for React-based web application delivery                    |
| Cross-stack workflow     | Explicit backend OpenAPI output, frontend SDK generation, and frontend metadata feedback loops | Usually chosen per project or ecosystem tooling                        |
| Best fit                 | Teams that want a coordinated fullstack system with a stronger dedicated backend layer         | Teams that want a React-centered fullstack web application path        |

Cabloy and Next.js both target fullstack application development, but they organize the stack differently.

Cabloy keeps the backend and frontend as **separate but coordinated framework layers**. That makes it a strong fit when a team wants one framework system with a dedicated backend layer and a dedicated frontend layer, without stitching together unrelated tools by hand.

Representative Cabloy strengths in this comparison include:

- a clear backend/frontend collaboration model rather than a single frontend-centered runtime
- explicit contract workflows from backend OpenAPI output to frontend SDK generation
- frontend-generated metadata that can flow back into backend-side tooling
- shared delivery conventions for SSR, SPA, Web, and Admin applications

If your main goal is a React-centered fullstack web app, Next.js may feel more direct. If your main goal is a **coordinated fullstack framework system** with a stronger backend layer and explicit cross-stack workflows, Cabloy is the better fit.

## Cabloy vs NestJS

| Perspective              | Cabloy                                                                                                | NestJS                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| System center            | Fullstack system                                                                                      | Backend framework                                                                       |
| Backend model            | Vona provides backend runtime, contracts, infrastructure, and CLI workflows                           | NestJS focuses on backend application structure                                         |
| Frontend and admin model | Frontend collaboration is built into the broader Cabloy system through Zova and shared docs/workflows | Usually paired with a separate frontend choice                                          |
| Cross-stack workflow     | Backend contracts can feed frontend SDK generation inside the same framework system                   | Typically assembled from separate backend and frontend tooling choices                  |
| Best fit                 | Teams that want backend strength inside a shared fullstack system                                     | Teams that want a backend-first framework and will choose the frontend stack separately |

The most important difference here is **scope**.

NestJS is primarily a backend framework. Cabloy is a **fullstack framework system**. So this comparison is not only “backend versus backend.” It is also “backend-first framework” versus “backend + frontend framework system with a shared collaboration model.”

Within Cabloy, the backend-specific capabilities come from **Vona**. That is where backend-oriented strengths such as these belong:

- unified validation and OpenAPI-oriented schema workflows
- DTO inference and generation workflows
- built-in multi-tenant, multi-database, and multi-datasource capabilities
- broader infrastructure features such as queues, broadcast, schedule, and redlock
- AOP-oriented backend programming capabilities

If a team only needs a backend framework and wants to choose the frontend stack separately, NestJS remains a natural option. If a team wants those backend capabilities to live inside a **shared fullstack system** with Zova, SSR-aware delivery modes, and contract-loop workflows, Cabloy is the better fit.

## Cabloy vs Django Admin

| Perspective              | Cabloy                                                                                                                    | Django Admin                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| System center            | Typed Node.js fullstack framework system                                                                                  | Python server-centered admin framework experience                                        |
| Backend model            | Dedicated backend runtime and infrastructure through Vona                                                                 | Django backend conventions centered on the admin stack                                   |
| Frontend and admin model | Modern frontend layer through Zova with SSR, SPA, Web, and Admin delivery modes                                           | Admin experience is centered on server-rendered templates and built-in admin conventions |
| Cross-stack workflow     | Backend and frontend stay aligned through generated contracts, metadata, and shared workflows                             | The default model is more tightly centered on the server-side admin stack                |
| Best fit                 | Teams that want rapid admin development in Node.js without giving up typed frontend flexibility and richer UI interaction | Teams that want a fast server-centered admin path in the Python ecosystem                |

This comparison is worth keeping even though the language ecosystems are different.

In the Python ecosystem, **Django Admin** has long been one of the strongest choices for rapidly building CRUD-oriented admin systems. In the Node.js ecosystem, there has historically been no equally established framework that combines rapid admin development, full backend infrastructure, and a modern fullstack architecture in the same way.

Cabloy is designed to fill that gap in the Node.js ecosystem.

That is why this comparison matters: it is not only comparing features, but also explaining Cabloy’s **ecosystem role**. For teams that want Django-Admin-like development speed for admin systems but want to stay in Node.js, Cabloy aims to provide that missing fullstack option.

At the same time, Cabloy does not stop at reproducing the server-centered admin model. With Vona on the backend and Zova on the frontend, Cabloy gives teams:

- a typed modern frontend layer instead of relying only on server-rendered templates
- richer interaction patterns for Admin and Web applications
- a smoother path for deeper customization as business systems become more complex
- a development experience that stays closer to modern Node.js fullstack workflows

So although Django Admin remains a benchmark for rapid admin development, Cabloy aims to offer a stronger long-term fit for teams that want both **rapid CRUD-oriented admin delivery** and a more modern fullstack development and interaction model inside Node.js.

For Cabloy’s frontend/runtime side of this comparison, see:

- [Frontend SSR Overview](/frontend/ssr-overview)
- [Editions Overview](/editions/overview)

## How to read these comparisons

These comparisons are most useful when your decision depends on questions like:

- do you want one coordinated framework system instead of stitching backend and frontend frameworks together?
- do you need a stronger dedicated backend layer inside a fullstack architecture?
- do you want explicit contract-loop workflows between backend and frontend?
- do you need shared conventions across SSR, SPA, Web, and Admin delivery modes?
- do you want Django-Admin-like rapid admin development inside the Node.js ecosystem, but with a more modern frontend and interaction model?

If those questions matter, Cabloy’s value is not just one isolated feature. It is the way **Vona**, **Zova**, shared scripts, and cross-stack workflows stay aligned as one framework system.
