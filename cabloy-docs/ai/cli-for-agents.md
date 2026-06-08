# CLI for Agents

The Vona and Zova CLIs are the highest-leverage automation surface in this repository.

## Why CLI-first matters

Using the CLI reduces both token use and framework drift.

Instead of asking the model to infer every generated file or naming convention, the skill or agent can:

1. discover the relevant command family
2. execute the command
3. inspect the output
4. apply only the smallest necessary follow-up edits

## Existing command families

### Vona

Vona already exposes command families such as:

- `bin:*`
- `create:*`
- `init:*`
- `tools:*`

Typical use cases:

- create suite/module/bean/test resources
- initialize config, locale, constants, assets, or types
- generate CRUD-related artifacts
- refresh metadata and dependency wiring
- run build, dev, test, typecheck, play, or database reset flows

### Zova

Zova already exposes command families such as:

- `bin:*`
- `create:*`
- `init:*`
- `refactor:*`
- `tools:*`
- `openapi:*`

Typical use cases:

- create suite/module/page/component/mock/bean resources
- initialize app/system assets and typing helpers
- run focused refactors for page and component patterns
- generate OpenAPI-related outputs
- refresh metadata and dependency wiring

## Edition-aware CLI usage

The command families are shared, but examples and generated targets may differ between Cabloy Basic and Cabloy Start because the editions can diverge in UI layer, frontend flavors, suites/modules, SSR site baselines, and project assets. Detect the edition before recommending a frontend-specific example.
