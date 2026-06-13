# Frontend CLI

This guide explains how to use the Zova CLI in the Cabloy monorepo.

## Why the CLI matters

Zova provides a large number of CLI commands for generating code skeletons and running frontend workflows.

For AI-assisted development, the CLI should be the default starting point whenever a generator or refactor command already exists.

## Example

Create a `component` named `test` in module `demo-student`:

```bash
npm run zova :create:component test -- --module=demo-student
```

## Command discovery pattern

Zova commands follow a consistent discovery model.

### 1. List all command groups and commands

```bash
npm run zova :
```

### 2. List commands for a specific group

```bash
npm run zova :create
```

### 3. Inspect help for one command

```bash
npm run zova :create:component --help
```

## High-value command families

From the current source tree, the most useful Zova command families for day-to-day development are:

- `bin:*`
- `create:*`
- `init:*`
- `refactor:*`
- `tools:*`
- `openapi:*`

Typical use cases include:

- scaffold suites, modules, pages, components, mocks, and beans
- initialize frontend config, locale, constants, assets, and typing helpers
- run focused refactors such as page query, page params, component props, generic component updates, and related migrations
- generate OpenAPI-related output
- refresh metadata and dependency-related output

## VS Code menus and the CLI

In practice, Zova workflows can be reached from two surfaces:

- VS Code menus for discovery and ergonomics
- the CLI for explicit, scriptable command execution

A practical rule is:

- use menus when you want to discover the available workflow quickly in the editor
- use the CLI when you want reproducible automation, explicit command history, or terminal-first documentation

These are not competing workflow systems. They are two entrypoints to the same underlying Zova command families.

## Bean boilerplate variants

Some frontend bean scenes also expose named boilerplate variants.

A practical rule is:

- the default scene template comes from the scene metadata `boilerplate`
- a named variant such as `--boilerplate=commandRow` maps to a metadata key such as `boilerplateCommandRow`
- supported variants are scene-defined, so do not assume every scene exposes them

For the current cross-stack lookup table, see [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates).

## Practical workflow rule

When creating or refactoring frontend code, inspect `npm run zova :` or the relevant command family first, prefer the matching generator or refactor command, inspect the generated or transformed output, and only then make minimal follow-up edits.

This keeps frontend work aligned with Zova conventions and avoids avoidable manual scaffolding.
