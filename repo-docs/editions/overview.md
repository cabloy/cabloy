# Cabloy Editions

Cabloy is available through two complete project baselines: Cabloy Basic and Cabloy Start. Both use the same Cabloy fullstack direction—Vona for the backend framework and runtime layer, Zova for the frontend framework and application layer—but intentionally provide different default application baselines.

## At a glance

| Edition      | Repository                                                               | License                                                         | Default path                                  | UI layer               |
| ------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------- | ---------------------- |
| Cabloy Basic | [github.com/cabloy/cabloy](https://github.com/cabloy/cabloy)             | [MIT](https://github.com/cabloy/cabloy/blob/main/LICENSE)       | `npm create cabloy`                           | DaisyUI + Tailwind CSS |
| Cabloy Start | [github.com/cabloy/cabloy-start](https://github.com/cabloy/cabloy-start) | [MIT](https://github.com/cabloy/cabloy-start/blob/main/LICENSE) | Clone the repository, then run `npm run init` | Vuetify                |

Both editions share Vona + Zova, suite-based modular delivery, CLI-first workflows, bidirectional type synchronization, and coordinated SSR application delivery. Their UI layer, frontend flavors, suites and modules, SSR site baselines, project assets, generated outputs, root scripts, and onboarding paths can differ.

## Comparison

**Legend:** ✅ Included in the default edition baseline · — Not included in the default edition baseline

### Included core capabilities

| Capability           | Description                                                                       | Cabloy Basic | Cabloy Start |
| -------------------- | --------------------------------------------------------------------------------- | ------------ | ------------ |
| Master–detail forms  | Supports nested master–detail forms, including multiple levels of detail records. | ✅           | ✅           |
| Image uploads        | Supports local storage and Cloudflare storage backends.                           | ✅           | ✅           |
| File uploads         | Supports local storage and Cloudflare storage backends.                           | ✅           | ✅           |
| Payment integrations | Demonstrates simulated payments, PayPal, and Stripe integrations.                 | ✅           | ✅           |
| Markdown editor      | Includes image uploads and syntax highlighting.                                   | ✅           | ✅           |

### Included demonstration suites

| Suite                       | What it demonstrates                                                                                                                       | Cabloy Basic | Cabloy Start |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------ | ------------ |
| Student Training Management | Master–detail forms, nested detail records, image uploads, and file uploads. Cabloy Start additionally demonstrates data-scope-based RBAC. | ✅           | ✅           |
| E-commerce                  | A complete Admin site, Web site, personal center, payment flows, Markdown editing, and related capabilities.                               | ✅           | —            |
| System Management           | User management, role management, department management, RBAC authorization, and menu authorization.                                       | —            | ✅           |

Included demonstration suites give AI vibe coding agents high-quality, project-native code examples. They improve development efficiency while reducing token use. For production deployments, set `PROJECT_DISABLED_SUITES` to a comma-separated list of unneeded suite names to disable them; see the [Environment and Config Guide](https://cabloy.com/frontend/environment-config-guide#built-in-env-variables).

> “Not included” means that the suite is not part of the default edition baseline. It does not limit what can be built with Cabloy.

## Choosing an edition

Choose **Cabloy Basic** when you want the public framework and reference edition, the default `npm create cabloy` path, and the examples and workflows provided by this repository.

Choose **Cabloy Start** when you want the public MIT-licensed sibling repository and its business-system-oriented baseline with Start-specific assets, SSR sites, and a Vuetify UI layer.

This is a choice of default baseline, not a general capability limit. Both editions follow the same Cabloy fullstack architecture.

## Cabloy Basic

Cabloy Basic is the public framework and reference edition. Projects created with `npm create cabloy` follow the Basic route, and the public examples and root scripts in this repository use it as their default baseline.

Use the [Fullstack Quickstart](/fullstack/quickstart) to create a new Basic project. When working in this repository, verify its current scripts before choosing a flavor or implementation workflow.

## Cabloy Start

Cabloy Start is a public MIT-licensed edition maintained in its own repository. Clone [github.com/cabloy/cabloy-start](https://github.com/cabloy/cabloy-start), then run `npm run init` in that checkout.

Start has its own frontend flavors, suite and module composition, SSR site baselines, project assets, scripts, and generated outputs. Inspect the active Start repository before naming or relying on any of those edition-specific surfaces.

## Working in an existing checkout

Detect the active edition before making UI-sensitive, flavor-sensitive, module-sensitive, SSR-sensitive, or asset-sensitive assumptions:

| Repository-root markers | Result                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Only `__CABLOY_BASIC__` | Cabloy Basic                                                                                                              |
| Only `__CABLOY_START__` | Cabloy Start                                                                                                              |
| Both markers            | Invalid or ambiguous checkout; stop before making edition-specific assumptions.                                           |
| Neither marker          | Inspect the owning `package.json` and nearby repository structure, then ask before making an edition-specific assumption. |

## For AI Development

AI-assisted work benefits from edition awareness whenever it depends on the UI library, frontend flavors, module availability, SSR sites, project assets, generated-output locations, or root scripts.

Before recommending an implementation path:

1. detect the active edition from the repository marker
2. verify the relevant current scripts or CLI entry points
3. branch guidance only where the editions genuinely diverge

Keep shared Cabloy and contract-loop guidance shared. Do not project Basic-specific examples, flavors, UI assumptions, or `npm create cabloy` onboarding onto a Start checkout, or the reverse.

For the shared architecture and delivery model, see [Fullstack Introduction](/fullstack/introduction) and [AI Development Introduction](/ai/introduction). For front-end command selection, see [Frontend Scripts](/frontend/scripts).
