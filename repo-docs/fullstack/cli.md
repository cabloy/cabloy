# Fullstack CLI

This guide explains the shared CLI workflow for Cabloy in the monorepo.

Use this page to understand the cross-stack mental model first, then go deeper into the backend, frontend, and reference pages as needed.

## Why the fullstack CLI matters

Cabloy treats many common tasks as framework workflows rather than ad hoc manual steps.

That matters across the full stack because:

- Vona and Zova already expose framework-aware generators and tooling
- the monorepo already exposes shared root scripts for development and verification
- backend and frontend work stay more consistent when contributors start from the existing command surface instead of inventing manual scaffolding

A practical default is: inspect the CLI first, run the matching workflow if it already exists, then make only the minimal follow-up edits the task actually needs.

## Shared repo entrypoints

In this repository, the two main CLI entrypoints are:

```bash
npm run vona
npm run zova
```

Use them as the shared terminal-first entrypoints for framework-aware workflows.

At the same time, the repo root also exposes shared scripts for broader development tasks such as dev, build, test, and typecheck.

Use this distinction consistently:

- use the CLI when you are discovering commands, generating framework resources, running framework-specific tooling, or inspecting workflow families
- use root scripts when you are running broader repository workflows such as development, builds, or verification

For the broader Reference landing page, see [Reference Introduction](/reference/introduction). For the compact root-script lookup surface, see [Repo Scripts](/reference/repo-scripts).

## Shared discovery pattern

Vona and Zova follow the same discovery model.

### 1. List command groups and commands

```bash
npm run vona :
npm run zova :
```

### 2. Narrow to a command family

```bash
npm run vona :create
npm run zova :create
```

### 3. Inspect help for one command

```bash
npm run vona :create:bean --help
npm run zova :create:component --help
```

This discovery pattern should be the default contributor workflow before creating files by hand.

## How to choose the right surface

A practical rule is:

- start with `npm run vona` when the task is backend-oriented
- start with `npm run zova` when the task is frontend-oriented
- start with root scripts when the task is about repo-wide development, build, or verification

In practice, that usually means:

- **Vona CLI** for backend generation and backend-specific tooling
- **Zova CLI** for frontend generation, refactors, and frontend-specific tooling
- **Root scripts** for broader runtime and verification flows

For side-specific depth, see:

- [Backend CLI](/backend/cli)
- [Frontend CLI](/frontend/cli)
- [CLI Reference](/reference/cli-reference)

## Scripts, CLI, and VS Code extensions

Use these three surfaces for different jobs:

| Surface            | Best for                                                           | Typical examples                                                                         |
| ------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Root scripts       | Repo-wide development, build, and verification workflows           | `npm run dev`, `npm run build`, `npm run test`                                           |
| CLI                | Framework-aware generation, refactors, initialization, and tooling | `npm run vona :create`, `npm run zova :refactor`, `npm run zova :openapi`                |
| VS Code extensions | In-editor discovery of the same framework workflow families        | Explorer right-click menus for `Create`, `Init`, `Refactor`, `Tools`, and related groups |

## CLI and VS Code extensions

The CLI is the authoritative workflow surface.

The VS Code extensions are the editor-side discovery layer for those same workflows.

A practical rule is:

- use the CLI when you want explicit, scriptable, reproducible execution
- use VS Code menus when you want faster in-editor discovery of the same workflow families

For the editor-side counterpart, see [VS Code Extensions](/fullstack/vscode-extensions).

## Recommended workflow rule

Before creating or refactoring framework-managed files by hand:

1. inspect the relevant CLI family
2. run the matching generator, initializer, refactor, or tooling workflow
3. inspect the generated or transformed result
4. apply only the minimal manual follow-up edits that are still necessary

This keeps fullstack work aligned with Cabloy conventions and reduces avoidable manual scaffolding.
