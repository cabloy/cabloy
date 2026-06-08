# Fullstack Vona + Zova Integration

This guide explains the current monorepo-native workflow for integrating Vona and Zova.

## Why the workflow looks different in the monorepo

Earlier standalone-repo workflows often described integrating Zova by cloning a separate repository and copying its built output into Vona manually.

That is not the preferred Cabloy workflow.

In the current monorepo:

- Vona and Zova already live in the same source tree
- the root repository already exposes shared scripts for both sides
- edition differences should be handled explicitly rather than through ad hoc path replacement

## Core integration model

Cabloy uses a frontend-backend separation architecture:

- Vona provides the backend runtime
- Zova provides the frontend application
- generated or built frontend output is consumed by the backend-side fullstack flow
- type sharing is coordinated through OpenAPI, generated SDKs, and frontend-generated route/component typing

## Cabloy Basic

In Cabloy Basic, the root repository already exposes these shared entrypoints:

```bash
npm run dev
npm run dev:zova:admin
npm run dev:zova:web
npm run build
npm run build:zova
```

The relevant Zova flavors in this repository include:

- `cabloyBasicAdmin`
- `cabloyBasicWeb`

The frontend-side REST/type build flows include:

```bash
cd zova && npm run build:rest:cabloyBasicAdmin
cd zova && npm run build:rest:cabloyBasicWeb
```

## Cabloy Start

Cabloy Start is the private commercial edition. It lives in a licensed sibling repository rather than a subdirectory here, but the same integration idea applies.

Its root script surface uses Start-specific flavors such as:

- `cabloyStartAdmin`
- `cabloyStartWeb`

Because Start differs in UI layer, module composition, SSR site baselines, and project assets, do not reuse Basic integration examples without first confirming:

1. the `__CABLOY_START__` marker
2. the Start repo’s `package.json`
3. the exact Zova flavor names and generated output paths used there

## Recommended integration workflow

### 1. Detect the edition

- `__CABLOY_BASIC__` → use Basic examples from this repo
- `__CABLOY_START__` → verify the sibling Start repo scripts before using examples

### 2. Start from root scripts

Use the root `package.json` as the first workflow surface.

### 3. Use Zova build and REST generation deliberately

For frontend builds and type generation, inspect the relevant Zova flavor scripts instead of hardcoding copy paths or ad hoc integration steps.

### 4. Verify both sides together

For meaningful fullstack changes, verify:

- backend dev/build/test flow
- frontend dev/build/type generation flow
- the edition-specific flavor you actually targeted
