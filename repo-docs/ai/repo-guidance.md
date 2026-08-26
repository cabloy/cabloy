# Repo Guidance for Agents

When an AI agent works in Cabloy, it should navigate the repo with deliberate layers of trust.

## 1. Start from the root

Check the root repository signals first:

- `package.json`
- edition marker files such as `__CABLOY_BASIC__` or `__CABLOY_START__`
- `repo-docs-internal/README.md`
- root `.claude/` assets

These files tell the agent which repo it is in, which scripts are canonical, and where public versus internal documentation belongs.

## 2. Prefer framework entrypoints over scattered examples

For backend workflows:

- start from `npm run vona`
- inspect Vona CLI command families

For frontend workflows:

- start from `npm run zova`
- inspect Zova CLI command families

This is more reliable than copying old file structures from examples without understanding the command surface that created them.

## 3. Use docs and internal notes for different purposes

- use `repo-docs/` to explain how people and agents should work
- use `repo-docs-internal/` to explain why maintainers designed the repo a certain way

## 4. Treat edition detection as mandatory for UI-sensitive work

Edition detection is especially important when the work touches:

- page creation
- component generation
- UI-layer usage
- frontend flavor scripts
- edition-specific suites, modules, SSR site baselines, or project assets

## 5. Use the right lookup surface before searching broadly

For backend lookup work, choose the surface before choosing the files:

- if code references `this.bean.xxx`, `ctx.bean.xxx`, or `app.bean.xxx`, start from `IBeanRecordGlobal` and module `src/.metadata/index.ts`
- if code references a full bean name, inspect `IBeanRecordGeneral`
- if the target is a runtime-anchor or selector/class-token service, inspect `src/service` and service metadata
- if the target is only a helper or superclass chain, inspect `src/lib`

This reduces wasted search and keeps bean lookup aligned with class placement.

## 6. Verify before claiming success

Whenever a workflow recommendation is made, verify it against current scripts or command definitions before presenting it as guidance.
