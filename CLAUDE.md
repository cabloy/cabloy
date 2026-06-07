# Cabloy Monorepo Guidance

## Repository identity

This repository is **Cabloy Basic**, identified by the root marker file:

- `__CABLOY_BASIC__`

A sibling repository named `cabloy-start` is a separate source repository and is identified by:

- `__CABLOY_START__`

Always detect the active edition before making UI-sensitive assumptions, choosing frontend examples, or recommending module-specific workflows.

## Monorepo layout

- `package.json` is the primary shared workflow entrypoint.
- `vona/` contains the backend framework, backend modules, and the Vona CLI.
- `zova/` contains the frontend framework, frontend modules, and the Zova CLI.
- `cabloy-docs/` contains the unified public documentation.
- `.docs-internal/` contains internal engineering notes and ADRs.
- `.claude/` contains Claude commands, skills, and settings.

## Preferred workflow

Before inventing a custom implementation path:

1. check the root `package.json`
2. detect the edition marker
3. inspect the relevant CLI entrypoint:
   - `npm run vona`
   - `npm run zova`
4. use existing command families before writing framework scaffolding manually
5. verify the result with targeted checks or shared root scripts

## Documentation boundary

- Put user-facing and agent-facing guidance in `cabloy-docs/`.
- Put maintainer rationale, architecture notes, and ADRs in `.docs-internal/`.
- Do not mix internal rationale into public how-to pages unless a trimmed user-facing explanation is genuinely needed.

## AI development rules

- Prefer CLI-backed workflows over manual scaffolding whenever Vona or Zova already provides a generator, refactor, metadata, or verification command.
- Treat legacy docs as input material, not as unquestioned truth. When docs conflict with source code, prefer current source code.
- For frontend work, assume Cabloy Basic and Cabloy Start may diverge in UI library, frontend flavors, module availability, and generated outputs.
- Reuse existing repo terminology: Cabloy, Vona, Zova, suite, module, bean, SSR, SPA, Web, Admin.
- For backend base-class placement, use the A / B1 / B2 rule from `cabloy-docs/ai/class-placement-rule.md`.
- Pure helper bases belong in `src/lib`; subclass-only bases should be evaluated case by case and often belong in `src/lib`.
- Runtime-anchor bases that still require container-managed or selector/class-token behavior but should not be global beans should prefer `src/service` with `@Service()`.
- Service-scene runtime-anchor bases that should not register in `IBeanRecordGeneral` should prefer the `src/service/*_.ts` form.

## Verification expectations

- For docs changes: run the docs build and verify links/navigation where practical.
- For code-generation or workflow guidance changes: verify that the referenced scripts and command families still exist.
- For code changes: prefer the narrowest meaningful verification first, then use shared root scripts when broader confidence is needed.
