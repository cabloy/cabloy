# Cabloy

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cabloy/cabloy/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/cabloy.svg?style=flat-square&label=cabloy)](https://www.npmjs.com/package/cabloy)
[![npm downloads](https://img.shields.io/npm/dm/cabloy?color=orange&label=downloads)](https://www.npmjs.com/package/cabloy)
[![Docs](https://img.shields.io/badge/docs-cabloy-4f46e5.svg?style=flat-square)](https://cabloy.com)
[![Demo](https://img.shields.io/badge/demo-cabloy.com-059669.svg?style=flat-square)](https://cabloy.com)

Cabloy is a Node.js fullstack framework for AI vibe coding, with AI Spec-Driven Development for traceable, evidence-backed delivery.

**One fullstack system for AI vibe coding—bidirectional type sync, CLI-first workflows, docs, skills, and traceable delivery from product intent to verifiable evidence.**

Instead of stitching separate backend and frontend stacks together, Cabloy keeps their contracts, tooling, and guidance connected in one repository. [AI Spec-Driven Development](https://cabloy.com/ai/ai-spec-driven-development) provides the disciplined path from confirmed Specs to evidence-backed delivery; its precise engineering method is Traceable Spec Delivery. Vona is its backend framework and runtime layer, and Zova is its frontend framework and application layer. Cabloy Basic and Cabloy Start are related, complete edition baselines built on that shared architecture; see [Editions Overview](https://cabloy.com/editions/overview) for their deliberate differences.

[Documentation](https://cabloy.com) · [npm](https://www.npmjs.com/package/cabloy) · [Web Demo](https://cabloy.com) · [Admin Demo](https://cabloy.com/admin) · [GitHub](https://github.com/cabloy/cabloy)

## Fullstack Principles

Cabloy’s fullstack model is built around two core principles:

1. **Frontend build output participates directly in backend SSR**
   - Zova owns the frontend application source
   - the generated frontend bundle and SSR-related artifacts are consumed by the Vona-side SSR flow
   - backend rendering and frontend hydration stay on one coordinated delivery path

2. **Type information flows in both directions**
   - **Backend -> Frontend**: Vona emits Swagger/OpenAPI contracts that Zova can use to generate SDKs and related schema-aware helpers
   - **Frontend -> Backend**: Zova generates structural metadata and typing surfaces such as routes, components, and icons that can improve backend-side tooling and type hints

For the complete explanation, see [Fullstack Introduction](https://cabloy.com/fullstack/introduction), [Vona + Zova Integration](https://cabloy.com/fullstack/vona-zova-integration), [Backend OpenAPI to Frontend SDK](https://cabloy.com/fullstack/openapi-to-sdk), and [Frontend Metadata Back to Backend](https://cabloy.com/fullstack/frontend-metadata-to-backend).

## Get Started

See the [Fullstack Quickstart](https://cabloy.com/fullstack/quickstart).

## AI Spec-Driven Development

See the [AI Spec-Driven Development](https://cabloy.com/ai/ai-spec-driven-development).

## Editions

Cabloy is available through two complete project baselines, each maintained in its own repository:

- **[Cabloy Basic](https://github.com/cabloy/cabloy)** — the public framework and reference edition, licensed under [MIT](https://github.com/cabloy/cabloy/blob/main/LICENSE), with a DaisyUI + Tailwind CSS UI layer and an e-commerce-oriented demonstration suite.
- **[Cabloy Start](https://github.com/cabloy/cabloy-start)** — a public starter edition, licensed under [MIT](https://github.com/cabloy/cabloy-start/blob/main/LICENSE), with a Vuetify UI layer and built-in system-management and authorization demonstrations.

Both editions share Cabloy’s Vona + Zova architecture, CLI-first workflows, bidirectional type synchronization, and AI Spec-Driven Development model. They differ primarily in their default UI layer, included demonstration suites, and out-of-the-box application baseline.

For fuller guidance on choosing an edition and working in an existing checkout, see [Cabloy Editions](https://cabloy.com/editions/overview).

**Legend:** ✅ Included in the default edition baseline · — Not included in the default edition baseline

### Default UI Layer

| Area       | Cabloy Basic           | Cabloy Start |
| ---------- | ---------------------- | ------------ |
| UI library | DaisyUI + Tailwind CSS | Vuetify      |

### Included Core Capabilities

| Capability           | Description                                                                       | Cabloy Basic | Cabloy Start |
| -------------------- | --------------------------------------------------------------------------------- | ------------ | ------------ |
| Master–detail forms  | Supports nested master–detail forms, including multiple levels of detail records. | ✅           | ✅           |
| Image uploads        | Supports local storage and Cloudflare storage backends.                           | ✅           | ✅           |
| File uploads         | Supports local storage and Cloudflare storage backends.                           | ✅           | ✅           |
| Payment integrations | Demonstrates simulated payments, PayPal, and Stripe integrations.                 | ✅           | ✅           |
| Markdown editor      | Includes image uploads and syntax highlighting.                                   | ✅           | ✅           |

### Included Demonstration Suites

| Suite                       | What it demonstrates                                                                                                                       | Cabloy Basic | Cabloy Start |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------ |
| Student Training Management | Master–detail forms, nested detail records, image uploads, and file uploads. Cabloy Start additionally demonstrates data-scope-based RBAC. | ✅           | ✅           |
| E-commerce                  | A complete Admin site, Web site, personal center, payment flows, Markdown editing, and related capabilities.                               | ✅           | —            |
| System Management           | User management, role management, department management, RBAC authorization, and menu authorization.                                       | —            | ✅           |

Included demonstration suites give AI vibe coding agents high-quality, project-native code examples. They improve development efficiency while reducing token use. For production deployments, set `PROJECT_DISABLED_SUITES` to a comma-separated list of unneeded suite names to disable them; see the [Environment and Config Guide](https://cabloy.com/frontend/environment-config-guide#built-in-env-variables).

> “Not included” means that the suite is not part of the default edition baseline. It does not limit what can be built with Cabloy.

## Highlights

- **One fullstack system** — build backend and frontend together instead of assembling separate stacks
- **Bidirectional type sync** — use the contract loop to keep backend contracts and frontend metadata aligned in both directions
- **CLI-first workflows** — use explicit commands for scaffolding, generation, refactors, and verification
- **Docs and skills** — give people and AI agents reusable, source-grounded guidance for the current repository
- **AI Spec-Driven Development** — use Traceable Spec Delivery to connect product intent, contracts, bounded work, acceptance procedures, and verifiable evidence
- **Vona + Zova** — use aligned backend and frontend layers for code sharing and cross-stack consistency
- **Modular delivery** — organize capabilities as suites and modules, then deliver SSR, SPA, Web, and Admin applications with shared conventions

## Technology Stack

### General

| Package    | Version  |
| ---------- | -------- |
| TypeScript | `^5.9.3` |
| Zod        | `^4.3.6` |

### Backend (Vona)

| Package                          | Version   |
| -------------------------------- | --------- |
| Koa                              | `^3.2.0`  |
| Knex                             | `^3.2.9`  |
| Redis Client (`ioredis`)         | `^5.10.1` |
| SQLite Driver (`better-sqlite3`) | `^12.9.0` |

### Frontend (Zova)

| Package        | Version     |
| -------------- | ----------- |
| Vue            | `^3.5.32`   |
| Vite           | `^8.0.14`   |
| Quasar         | `^2.19.3`   |
| TanStack Query | `^5.100.10` |
| TanStack Form  | `^1.32.0`   |
| TanStack Table | `^8.21.3`   |

### Shared Frontend Engineering Layer

- Vue
- Vite
- Quasar tooling such as `quasar dev` and `quasar build`
- TanStack libraries where applicable

Quasar is used here for engineering tooling rather than as the edition UI component library.

### Edition-specific UI Layer

- **Cabloy Basic**: DaisyUI + Tailwind CSS
- **Cabloy Start**: Vuetify

## Contributing

Contributions to the Cabloy framework, docs, and tooling are welcome.

Use the root [package.json](https://github.com/cabloy/cabloy/blob/main/package.json) as the shared workflow entrypoint:

```bash
npm run init
npm run dev
npm run tsc
npm run test
npm run build
```

For more details, see:

- [Cabloy Editions](https://cabloy.com/editions/overview)
- [Repo Scripts](https://cabloy.com/reference/repo-scripts)
- [Package Map](https://cabloy.com/reference/package-map)
- [AI Development Introduction](https://cabloy.com/ai/introduction)

Contribution guidelines:

- prefer CLI-backed workflows with `npm run vona` and `npm run zova`
- put user-facing and agent-facing guidance in [cabloy.com](https://cabloy.com)
- put maintainer rationale, architecture notes, and engineering ADRs in [repo-docs-internal/](https://github.com/cabloy/cabloy/tree/main/repo-docs-internal)
- put product and business specifications, delivery plans, and suite-local ADRs in [repo-specs/](https://github.com/cabloy/cabloy/tree/main/repo-specs)
- verify framework changes with the narrowest meaningful checks first, then shared root scripts when broader confidence is needed

To report bugs or propose changes, use [GitHub Issues](https://github.com/cabloy/cabloy/issues) or open a pull request in [github.com/cabloy/cabloy](https://github.com/cabloy/cabloy).

## Community

- [GitHub Issues](https://github.com/cabloy/cabloy/issues)
- [X / Twitter](https://x.com/zhennann2024)
- [Bilibili](https://space.bilibili.com/454737998)

## License

[MIT](https://github.com/cabloy/cabloy/blob/main/LICENSE)
