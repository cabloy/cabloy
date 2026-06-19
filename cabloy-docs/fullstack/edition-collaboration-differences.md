# Edition Differences in Fullstack Collaboration

This page makes the Basic/Start differences in the collaboration loop explicit.

## Why this page matters

Most Cabloy architecture can be explained once.

But the fullstack collaboration path becomes confusing if docs or AI systems silently reuse Cabloy Basic assumptions inside Cabloy Start workflows.

This page exists to keep those differences visible.

## Shared collaboration model

Both editions share the same broad collaboration loop:

- Vona provides backend runtime and OpenAPI-facing contract output
- Zova provides frontend application structure and generated metadata
- root scripts and CLI commands coordinate build, generation, and verification

## Where the editions diverge

The most important differences show up in:

- frontend UI layer assumptions
- frontend flavor names
- frontend module composition
- admin/web SSR site baselines
- edition-specific private value-add content and project assets in Cabloy Start
- potentially different generated output paths or integration details

## Cabloy Basic

In the current public monorepo, Basic examples commonly align with:

- DaisyUI + TailwindCSS oriented frontend assumptions
- Basic-specific Zova flavors such as `cabloyBasicAdmin` and `cabloyBasicWeb`

## Cabloy Start

In the sibling private repo, Start examples commonly align with:

- Vuetify-oriented frontend assumptions
- Start-specific Zova flavors such as `cabloyStartAdmin` and `cabloyStartWeb`

## Safe documentation and AI rule

When documenting or automating a fullstack collaboration flow:

1. explain the shared model once
2. detect the active edition
3. branch only where the workflow actually diverges
4. verify flavor names and generated output paths in the active repo

## Practical implications for edition-aware workflow decisions

This rule prevents a common failure mode:

- the model understands the shared architecture correctly
- but gives the wrong operational example because it assumes the wrong edition

That is exactly the kind of mistake good fullstack docs should prevent.

## Where to read next

- If you want the shared bidirectional model first, continue with [Contract Loop Playbook](/fullstack/contract-loop-playbook).
- If your current task is the forward contract bridge, continue with [Backend OpenAPI to Frontend SDK](/fullstack/openapi-to-sdk).
- If your current task is the reverse metadata/resource bridge, continue with [Frontend Metadata Back to Backend](/fullstack/frontend-metadata-to-backend).
