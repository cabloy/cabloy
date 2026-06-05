# Repo Guidance for Agents

When an AI agent works in Cabloy, it should navigate the repo with deliberate layers of trust.

## 1. Start from the root

Check the root repository signals first:

- `package.json`
- edition marker files such as `__CABLOY_BASIC__` or `__CABLOY_START__`
- `.docs-internal/README.md`
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

- use `cabloy-docs/` to explain how people and agents should work
- use `.docs-internal/` to explain why maintainers designed the repo a certain way

## 4. Treat edition detection as mandatory for UI-sensitive work

Edition detection is especially important when the work touches:

- page creation
- component generation
- UI library usage
- frontend flavor scripts
- edition-specific modules or assets

## 5. Verify before claiming success

Whenever a workflow recommendation is made, verify it against current scripts or command definitions before presenting it as guidance.
