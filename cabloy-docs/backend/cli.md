# Backend CLI

This page migrates the core Vona CLI usage guidance into the unified docs site.

## Why the CLI matters

Vona provides a large number of CLI commands for generating code skeletons and running backend workflows.

For AI-assisted development, the CLI is especially important because it encodes framework conventions directly. If a command already exists, use it before writing backend scaffolding manually.

## Example

Create a `service` bean named `student` in module `demo-student`:

```bash
npm run vona :create:bean service student -- --module=demo-student
```

## Command discovery pattern

Vona commands follow a consistent discovery model.

### 1. List all command groups and commands

```bash
npm run vona :
```

### 2. List commands for a specific group

```bash
npm run vona :create
```

### 3. Inspect help for one command

```bash
npm run vona :create:bean --help
```

## High-value command families

From the current source tree, the most useful Vona command families for day-to-day development are:

- `bin:*`
- `create:*`
- `init:*`
- `tools:*`

Typical use cases include:

- scaffold suites, modules, beans, and tests
- initialize config, locale, constants, assets, types, and related module-scope resources
- generate CRUD-oriented resources
- refresh metadata and dependency-related output
- run build, dev, test, typecheck, playground, and database reset flows

## Guidance for AI workflows

When an agent is about to create backend code:

1. inspect `npm run vona :` or the relevant command family
2. prefer the matching generator or initializer
3. inspect the generated output
4. only then make minimal follow-up edits

This reduces token use and keeps the implementation aligned with Vona conventions.
