# VS Code Extensions

Cabloy provides two official VS Code extensions so you can discover and run framework workflows directly from the editor.

These extensions surface Vona and Zova CLI capabilities through Explorer right-click menus. They make common workflows easier to discover and reduce the mental burden of remembering command names, while still keeping the CLI as the authoritative workflow surface.

## Official extensions

- [Vona - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.vona-vscode)
- [Zova - Official](https://marketplace.visualstudio.com/items?itemName=cabloy.zova-vscode)

## Why the extensions matter

In Cabloy, many common tasks are already modeled as framework workflows instead of ad hoc manual edits.

Typical examples include:

- creating suites and modules
- generating backend or frontend skeletons
- initializing config, locale, constants, assets, and related support files
- refreshing metadata or other generated output
- running focused refactor workflows when the framework already provides one

The VS Code extensions make those workflows easier to discover inside the editor.

## Shared interaction model

The two extensions follow the same basic model:

- open a Cabloy workspace in VS Code
- right-click the relevant folder or file in the Explorer
- choose the matching Vona or Zova menu group
- run the workflow from the menu instead of typing the full command first

This keeps editor-side discovery aligned with CLI execution.

## Shared menu groups

Both extensions organize their workflows around the same top-level menu vocabulary:

- `Create`
- `Aspect`
- `Bean`
- `Meta`
- `Init`
- `Refactor`
- `Tools`

This shared structure helps you move between backend and frontend work without learning two unrelated menu systems.

## Menus and CLI are two entrypoints to the same workflow

A practical rule is:

- use VS Code menus when you want fast discovery and editor ergonomics
- use the CLI when you want explicit, scriptable, reproducible execution

In this repository, the shared CLI entrypoints are:

```bash
npm run vona
npm run zova
```

To inspect the available command families directly, start with:

```bash
npm run vona :
npm run zova :
```

These are not competing workflow systems. They are two entrypoints to the same underlying framework workflows.

## What Vona emphasizes

The Vona extension is backend-oriented.

Its menus focus on workflows such as:

- backend code generation for suites, modules, DTOs, entities, models, services, controllers, and tests
- backend aspect and bean creation
- metadata and initialization workflows
- backend runtime-oriented capabilities such as SSR, socket, queue, schedule, cache, auth, and related infrastructure beans
- tooling workflows such as metadata generation and CRUD generation

This makes the extension especially useful when you are working inside the backend framework tree and want to stay aligned with Vona conventions.

## What Zova emphasizes

The Zova extension is frontend-oriented.

Its menus focus on workflows such as:

- frontend generation for suites, modules, pages, components, APIs, models, services, and mocks
- page- and component-oriented bean workflows
- initialization workflows for frontend config, assets, locale, icons, and support files
- focused refactors for pages and components
- OpenAPI-related tooling and metadata generation

This makes the extension especially useful when you are building or evolving frontend structure and want to reuse the framework’s existing generators and refactors.

## One important difference

Although both extensions expose the same top-level menu vocabulary, their workflow depth is not identical.

In practice:

- Zova provides substantial refactor coverage for page and component workflows
- Vona keeps the same overall menu shape, but its current value is concentrated more heavily in backend generation, bean, meta, init, and tooling workflows

So when you are reshaping frontend structure, the Zova extension is more likely to surface direct refactor actions.

## Recommended workflow rule

Before creating files by hand, first check whether Vona or Zova already provides the generator, initializer, metadata task, or refactor you need.

A good default workflow is:

1. discover the workflow from the VS Code menu or the CLI command list
2. run the matching framework command
3. inspect the generated or transformed result
4. apply only the minimal follow-up edits that are still necessary

This keeps fullstack work aligned with Cabloy conventions and reduces avoidable manual scaffolding.
