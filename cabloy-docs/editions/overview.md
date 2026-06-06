# Editions Overview

Cabloy currently needs to support two related but distinct repositories:

- **Cabloy Basic**
- **Cabloy Start**

They share the same core architectural direction, but they are not interchangeable.

## Shared core

Both editions use the Cabloy fullstack model built around:

- Vona as the backend framework
- Zova as the frontend framework
- root-level `npm run vona` and `npm run zova` entrypoints
- CLI-backed workflows for generation, refactoring, metadata, and verification

## Why the editions differ

The editions exist to support different product and distribution goals.

### Cabloy Basic

- public repository
- baseline fullstack reference implementation
- current default examples in this public monorepo

### Cabloy Start

- sibling private repository
- created from `npm create cabloy`
- uses a different UI strategy centered on Vuetify
- contains different Vona/Zova modules and value-add project structure

## Documentation rule

Write shared explanations once. Only split or annotate when a workflow changes because of:

- UI library assumptions
- frontend flavor names
- different modules or assets
- private-value product boundaries
- edition-specific scripts or generated outputs
