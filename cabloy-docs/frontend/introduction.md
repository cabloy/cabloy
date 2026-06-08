# Frontend (Zova)

This page is the frontend hub for Cabloy users, contributors, and AI vibe coding workflows that need the frontend side of the framework.

Zova is the frontend half of Cabloy’s one-framework-system fullstack architecture.

## What Zova is responsible for

- page and component architecture
- SSR, SPA, Web, and Admin rendering flows
- data access patterns such as `$fetch`, `$api`, and generated SDKs
- UI library integration
- route, icon, and component type generation
- frontend-side refactors and code generation through the Zova CLI

## How to approach frontend work

For contributor and automation workflows in this repository, prefer this order:

1. inspect the root `package.json` and `npm run zova` entrypoint
2. inspect Zova CLI command families such as `create:*`, `init:*`, `refactor:*`, `tools:*`, and `openapi:*`
3. inspect the active edition before assuming a UI stack
4. document shared concepts once, then isolate edition-specific notes where the module set or UI library differs

## Edition impact

Frontend work is where Cabloy Basic and Cabloy Start differ most clearly.

- **Shared frontend engineering layer**: both editions follow the same Zova-centered frontend direction, with Vue, Vite, Quasar tooling, and related libraries.
- **Cabloy Basic UI layer**: current public docs and examples align with DaisyUI + Tailwind CSS.
- **Cabloy Start UI layer**: the private commercial edition aligns with Vuetify and ships different frontend modules, SSR site baselines, and project assets.

Because of this, automation and docs should always detect the active edition before recommending page-level, component-level, or UI-library-specific work.
