# Frontend Bean Scene Authoring

This guide explains the **advanced** Zova workflow for creating a **new frontend bean scene**.

This is not the same as creating one more bean inside an existing scene such as `api`, `model`, `service`, `controller`, or `render`.

For ordinary bean creation inside an existing scene, use the existing CLI workflow documented in [Frontend CLI](/frontend/cli) and the scene-specific frontend guides. This page is for framework extension work where you need to define a new scene contract.

## When you need this guide

Use this guide when you need to extend the frontend bean system itself, for example:

- define a new decorator such as `@Something()`
- teach `:create:bean` how to scaffold that scene
- add new scene-level metadata behavior
- decide the scene’s container scope
- decide whether the scene should be isolated under its own folder

If you only need a new `api`, `model`, or `service` bean, you do **not** need this page.

## Mental model

In Zova, a bean scene is not only a naming family. It also helps define runtime resolution behavior.

A frontend scene usually determines:

- which decorator marks the class
- which container scope the scene uses
- whether generated files go to `src/bean` or `src/<scene>/`
- whether generated bean typing lands in a general or local record surface
- whether scene-specific metadata generation runs

This is why frontend scene authoring must explain both **scene name** and **container scope** together.

## The smallest built-in patterns

Representative built-in patterns are thin wrappers over `createBeanDecorator(...)`.

Examples:

```typescript
export function Bean(): ClassDecorator {
  return createBeanDecorator('bean', 'ctx');
}

export function Service(): ClassDecorator {
  return createBeanDecorator('service', 'ctx');
}

export function Tool(): ClassDecorator {
  return createBeanDecorator('tool', 'app');
}
```

Some scenes also carry decorator options:

```typescript
export function Model<T extends IDecoratorModelOptions>(options?: T): ClassDecorator {
  return createBeanDecorator('model', 'ctx', true, options);
}
```

This shows the first scene-authoring contract clearly:

- give the scene a stable scene name
- choose the container scope deliberately
- optionally support decorator options

## The frontend authoring surfaces

A new frontend bean scene usually touches five surfaces.

### 1. Decorator surface

Define the scene decorator and export it from the owning module.

Representative built-in decorators include:

- `@Bean()` -> `ctx`
- `@Service()` -> `ctx`
- `@Tool()` -> `app`
- `@Data()` -> `new`
- `@Api()` -> `app`
- `@Model()` -> `ctx`

This container choice is part of the scene contract, not only an implementation detail.

### 2. Scene typing surface

Register the scene through declaration merging.

Representative pattern:

```typescript
declare module 'zova' {
  export interface IBeanSceneRecord {
    api: never;
  }
}
```

Some scenes also extend module-specific type surfaces. For example, model contributes to `ConfigOnions` and to a service-like onion options surface in its owning module.

### 3. Onion metadata surface

Register the scene in `package.json` under `zovaModule.onions`.

Representative built-in pattern:

```json
{
  "service": {
    "sceneIsolate": true,
    "beanGeneral": true,
    "optionsNone": false,
    "optionsGlobalInterfaceFrom": "zova-module-a-bean",
    "boilerplate": "service/boilerplate"
  }
}
```

This metadata is one of the main contracts for both bean creation and metadata generation.

### 4. CLI boilerplate and placement surface

The frontend `:create:bean` flow is scene-meta driven.

The command surface is:

```bash
npm run zova :create:bean sceneName beanName -- --module=...
```

The generator reads scene metadata and decides where the file lives:

- isolated scene -> `src/<scene>/`
- non-isolated scene -> `src/bean/`

The public Zova CLI help currently exposes `--module` for this command, while boilerplate selection itself comes from scene metadata.

That means placement and scaffolding are part of scene definition, not later manual preferences.

Representative built-in boilerplate:

```typescript
import { BeanBase } from 'zova';
import { Bean } from 'zova-module-a-bean';

@Bean()
export class Bean<%=argv.beanNameCapitalize%> extends BeanBase {
  protected async __init__() {}
}
```

### 5. Metadata generation surface

Frontend metadata generation is broader than simple file scaffolding.

The metadata flow scans frontend bean files and can generate:

- scene onion output
- scope resources
- bean typing in general or local record surfaces
- scene-specific custom metadata
- package and index side effects

That is why a new scene should be validated against generated `.metadata/index.ts`, not only against the decorator source.

## How `zovaModule.onions` drives scene behavior

When authoring a scene, the most important design step is deciding the scene flags.

### `sceneIsolate`

Use this when the scene should live in its own first-class folder such as `src/service/`.

If the flag is false, the generator normally places files under `src/bean/` using the `{scene}.{bean}` naming pattern.

### `beanGeneral`

Use this when the scene’s generated bean records should land in `IBeanRecordGeneral` rather than `IBeanRecordLocal`.

A practical distinction is:

- `beanGeneral: true` -> generated bean records go to `IBeanRecordGeneral`
- `beanGeneral: false` -> generated bean records still exist, but they go to `IBeanRecordLocal`

### `optionsNone`

Use this to describe whether the scene decorator has no options payload.

If the scene decorator accepts structured options, this should align with the real decorator shape.

### `optionsGlobalInterfaceName` and `optionsGlobalInterfaceFrom`

Use these when the scene needs a shared interface contract for decorator options.

This is especially useful when the scene’s options must be visible beyond one local file.

### `boilerplate`

Use this to tell the CLI which template should be used when a bean of the scene is created.

### Multiple boilerplate variants

A frontend scene can also expose more than one named template.

A practical rule is:

- `boilerplate` provides the default template
- `--boilerplate=commandRow` maps to `boilerplateCommandRow`
- more generally, `--boilerplate=name` maps to `boilerplateName`

This is useful when one scene needs multiple scaffold shapes for distinct frontend authoring paths.

Representative built-in examples include the `command` scene, which exposes `commandBulk`, `commandRow`, and `commandDetailsRow` variants, and the `tableCell` scene, which exposes `tableActionRow` and `detailsActionRow` variants in module metadata.

For the built-in command scene’s runtime model, helper bases, metadata flow, and source-reading path, see [Command Scene Authoring](/frontend/command-scene-authoring).

### `metadataCustom`

Use this only when the scene needs additional generated output beyond the standard metadata passes.

A good rule is:

- start with the default metadata flow
- add custom metadata only when the scene has a real emitted contract that the default passes cannot express

## Container-scope design is part of scene design

In Zova, the container scope is a core architectural decision.

Representative built-in scopes include:

- `sys`: system-level singleton-style behavior
- `app`: app-scoped shared behavior
- `ctx`: component-instance or local-context behavior
- `new`: fresh-instance behavior

Examples from built-in scenes:

- `@Sys()` -> `sys`
- `@Bean()` -> `ctx`
- `@Service()` -> `ctx`
- `@Tool()` -> `app`
- `@Data()` -> `new`
- `@Api()` -> `app`
- `@Model()` -> `ctx`

When adding a new scene, do not choose the scope cosmetically. The chosen scope affects how developers will resolve, share, and reason about that bean family.

## Authoring flow for a new frontend scene

A practical Zova scene-authoring workflow is:

1. choose the owning module for the scene
2. decide the scene’s container scope
3. add the scene decorator
4. export it from the module `src/lib/index.ts`
5. add the scene declaration-merging type and export it from `src/types/index.ts`
6. add the scene under `zovaModule.onions`
7. create the scene boilerplate for `:create:bean`
8. add custom metadata generation if the scene needs extra emitted output
9. run bean creation in a representative module
10. inspect generated `.metadata/index.ts` and file placement
11. only then write any additional scene-specific docs or business examples

## What generated output should prove

A new scene is usually correct only if generated metadata proves the intended contract.

Depending on scene flags, inspect for output such as:

- scene registration in generated metadata
- scope resource output
- bean typing in the intended general or local record surface
- package/index export side effects
- correct placement under `src/bean` or `src/<scene>/`

A useful point from the current source is that metadata generation does more than emit one file. It also updates package and index surfaces so the module stays coherent.

If the generated metadata or placement does not match the intended design, fix the scene contract first rather than patching generated output manually.

## A useful split: adding a scene vs adding a bean

Keep these two tasks separate.

### Add a bean inside an existing scene

Example:

```bash
npm run zova :create:bean model menu -- --module=training-student
```

This uses an already-defined scene.

### Add a new scene

This requires framework extension work:

- new decorator
- new scene type registration
- new container-scope decision
- new onion metadata entry
- new boilerplate
- optional metadata generation

That is why this topic belongs in an advanced guide.

## Design rules for new scenes

Before adding a scene, ask these questions.

### Which container should own the scene?

This is the most important frontend-specific question.

Choose the scope based on the real sharing and lifecycle contract:

- `sys` for system-wide singleton behavior
- `app` for app-shared behavior
- `ctx` for local or component-context behavior
- `new` for fresh-instance behavior

### Should the scene be isolated?

Choose an isolated scene when it deserves a first-class folder and operational identity.

Choose a non-isolated scene when it is better modeled as a bean-family variant under `src/bean`.

### Should the scene use the general bean record surface?

Enable `beanGeneral` only when the scene should publish its generated bean records through `IBeanRecordGeneral` instead of the local record surface.

### Does the scene need custom metadata?

Do not add custom metadata only because some built-in scenes do. Add it when the scene needs real emitted structures beyond the default metadata flow.

## Relationship to existing guides

Read this guide together with:

- [IoC and Beans](/frontend/ioc-and-beans)
- [Frontend CLI](/frontend/cli)
- [API Guide](/frontend/api-guide)
- [Model Architecture](/frontend/model-architecture)
- [Model State Guide](/frontend/model-state-guide)
- [Page Guide](/frontend/page-guide)

Use the basic guides for normal bean creation. Use this page only when extending the scene system itself.

## Verification checklist

When authoring or documenting a new frontend scene, verify in this order:

1. confirm the CLI command shape still exists:

   ```bash
   npm run zova :create:bean --help
   ```

2. confirm the scene decorator, scene typing, container scope, and `zovaModule.onions` entry agree
3. create a test bean in a representative module
4. inspect whether the generated file goes to `src/bean/` or `src/<scene>/`
5. inspect `src/.metadata/index.ts` in that module
6. confirm scope-resource, typing, and package/index output match the design
7. run the narrowest meaningful type or docs verification for the change

For repo-wide docs verification, also run:

```bash
npm run docs:build
```
