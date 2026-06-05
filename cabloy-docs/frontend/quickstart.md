# Frontend Quickstart

This page migrates the highest-value ideas from the legacy Zova quickstart into the monorepo docs.

## When to use this page

Use this page when you want to understand the frontend side of Cabloy quickly:

- what Zova is responsible for
- how frontend development starts from the monorepo root
- how editions affect UI assumptions
- how legacy project-template guidance maps into the current Cabloy structure

## Monorepo-first start

In Cabloy, begin from the root repository scripts whenever possible.

### Install and initialize

```bash
npm run init
```

### Start frontend development for Cabloy Basic

```bash
npm run dev:zova:admin
npm run dev:zova:web
```

These root wrappers currently map to the Basic flavors:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

### Build frontend output for Cabloy Basic

```bash
npm run build:zova
```

## UI library context

Legacy Zova docs emphasized standalone project templates such as:

- `quasar`
- `vuetify`
- `empty`

That historical explanation is still useful, but in the Cabloy monorepo the more important question is usually:

- am I working in **Cabloy Basic**?
- or am I working in **Cabloy Start**?

### Cabloy Basic

Current public examples in this repository align with a DaisyUI + TailwindCSS oriented frontend story.

### Cabloy Start

The sibling private `cabloy-start` repository uses Vuetify-oriented frontend modules and different flavor names.

Always confirm the active edition before giving page-level or component-level advice.

## Recommended next pages

- [Frontend CLI](/frontend/cli)
- [Frontend Scripts](/frontend/scripts)
- [Frontend Design Principles](/frontend/design-principles)
