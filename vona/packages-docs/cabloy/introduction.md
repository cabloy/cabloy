# CabloyJS

CabloyJS is not a standalone framework, but rather provides a set of out-of-the-box advanced feature modules in the form of `Vona/Zova suites` to accelerate fullstack project development.

## 1. Vona Suite: vona-suite-a-cabloy (MIT)

This suite includes the following modules:

| Name           | Description                   |
| -------------- | ----------------------------- |
| a-ssr          | SSR adaptation layer          |
| a-datasharding | Sharding                      |
| a-datasource   | Dynamic datasource            |
| a-socket       | Web Socket                    |
| a-status       | Server-side status management |

## 2. Zova Suite: zova-suite-a-cabloy (MIT)

This suite includes the following modules:

| Name          | Description                                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| rest-actions  | Actions for Zova JSX. Includes: alert/confirm/copy/create/delete/edit/setValue/view                                                                        |
| rest-resource | Universal component supporting CRUD rendering. Includes: list page, entry page, providing best practices for `Tanstack Table/Tanstack Form/Tanstack Query` |

## 3. Project Templates {#templates}

CabloyJS provides two project templates for different UI libraries.

| Template Name                                   | UI Library            | Description                                   | Demo                                                             |
| ----------------------------------------------- | --------------------- | --------------------------------------------- | ---------------------------------------------------------------- |
| [cabloy-basic](../cabloy-basic/introduction.md) | Daisyui + Tailwindcss | Provides out-of-the-box `Admin`               |                                                                  |
| [cabloy-start](../cabloy-start/introduction.md) | VuetifyJS             | Provides out-of-the-box `Website` and `Admin` | [Website](https://cabloy.com), [Admin](https://cabloy.com/admin) |

## Template Comparison

|                                                                  | cabloy-basic                                                                           | cabloy-start                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------- |
| Fullstack Capabilities                                           | Provides out-of-the-box `Admin`. Website capabilities can be added by self-development | Provides out-of-the-box `Website` and `Admin` |
| UI Library                                                       | Daisyui + Tailwindcss                                                                  | VuetifyJS                                     |
| Dynamic Form/Table Rendering                                     | Provides UI components based on Daisyui                                                | Provides UI components based on VuetifyJS     |
| Admin SSR Support                                                | ✅                                                                                     | ✅                                            |
| Dual-layer Tabs Navigation                                       | ✅                                                                                     | ✅                                            |
| Best Practices for `Tanstack Table/Tanstack Form/Tanstack Query` | ✅                                                                                     | ✅                                            |

## Development History

### 1. 2016: V1-V4

CabloyJS development started in 2016. CabloyJS was initially a fullstack NodeJS framework based on JavaScript, and has evolved through major versions including V1, V2, V3, and V4, continuously improving its architecture.

- Some say: `CabloyJS is a textbook-like framework`
- Others suggest: `If CabloyJS supported TypeScript and adopted a frontend/backend separation architecture, it would bring a brand new fullstack development experience`

### 2. 2023: V5 Development

In 2023, after thorough evaluation and verification, CabloyJS V5 underwent a complete redesign adopting a completely new architectural philosophy. Developed in TypeScript with a frontend/backend separation architecture, it spawned two underlying frameworks:

- **ZovaJS**: An intuitive frontend framework = Vue3 Reactivity + React TSX + Angular IOC
- **VonaJS**: A fullstack framework supporting building `SSR/SPA/Website/Admin Dashboard` in a single codebase, with built-in frontend/backend type sharing capabilities

### 3. 2026: V5 Release

On 2026-04-13, ZovaJS V5 and VonaJS V5 were officially released. CabloyJS V5, building on the new underlying frameworks, continues to provide more advanced capabilities, further enhancing development experience and efficiency, practicing the vision and mission of being a `textbook-like framework`

## License

MIT License.

Copyright (c) 2016-present, Vona/Zova/Cabloy.
