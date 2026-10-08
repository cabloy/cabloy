# Cabloy

[![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cabloy/cabloy/blob/main/LICENSE)
[![npm version](https://img.shields.io/npm/v/cabloy.svg?style=flat-square&label=cabloy)](https://www.npmjs.com/package/cabloy)
[![npm downloads](https://img.shields.io/npm/dm/cabloy?color=orange&label=downloads)](https://www.npmjs.com/package/cabloy)
[![Docs](https://img.shields.io/badge/docs-cabloy-4f46e5.svg?style=flat-square)](https://cabloy.com)
[![Demo](https://img.shields.io/badge/demo-cabloy.com-059669.svg?style=flat-square)](https://cabloy.com/demo)

Cabloy is a Node.js fullstack framework for AI vibe coding, with AI Spec-Driven Development guiding work from confirmed specs to verifiable delivery.

Cabloy Basic and Cabloy Start are complete editions built on this shared architecture; see [Editions Overview](https://cabloy.com/editions/overview) for their differences.

[Documentation](https://cabloy.com) · [npm](https://www.npmjs.com/package/cabloy) · [Demo](https://cabloy.com/demo) · [GitHub](https://github.com/cabloy/cabloy)

## Fullstack Principles

Cabloy connects Vona and Zova in two ways:

1. **Integrated SSR.** Zova builds the frontend and SSR artifacts. In Vona integrated SSR, Vona consumes those artifacts to render the page, and Zova hydrates it in the browser.

2. **Bidirectional contract flow.** Vona's OpenAPI contracts generate Zova SDKs and schema-aware helpers. Zova's generated metadata and types for routes, components, and icons feed back into Vona's tooling and type hints.

Learn more about [Vona + Zova Integration](https://cabloy.com/fullstack/vona-zova-integration) and the [Contract Loop](https://cabloy.com/fullstack/contract-loop-playbook).

## Get Started

Create a new Cabloy Basic project:

```bash
npm create cabloy
```

For Cabloy Start, clone the [Cabloy Start repository](https://github.com/cabloy/cabloy-start) and run `npm run init` from its root. See the [Fullstack Quickstart](https://cabloy.com/fullstack/quickstart) for prerequisites and development commands.

## AI Spec-Driven Development

See the [AI Spec-Driven Development](https://cabloy.com/ai/ai-spec-driven-development).

## Demonstrations(Videos)

### 1. Can an Admin Site Use SSR? CabloyJS in Three Practical Demos (Duration: 1:16)

[![CabloyJS Admin SSR video](./repo-docs/assets/img/cabloy-admin-ssr-cover-en.png)](https://youtu.be/786IQhRdr1I)

### 2. A First: Second-Level Tabs for Admin Multitasking (Duration: 1:50)

[![CabloyJS Admin Tabs video](./repo-docs/assets/img/cabloy-admin-tabs-cover-en.png)](https://youtu.be/L6DxD-JfztQ)

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
