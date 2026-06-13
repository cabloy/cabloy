# Backend Bean Scene Authoring

This guide explains the **advanced** Vona workflow for creating a **new backend bean scene**.

This is not the same as creating one more bean inside an existing scene such as `service`, `model`, or `dto`.

For ordinary bean creation inside an existing scene, use the existing CLI workflow documented in [Backend CLI](/backend/cli) and the scene-specific guides. This page is for framework extension work where you need to define a new scene contract.

## When you need this guide

Use this guide when you need to extend the backend bean system itself, for example:

- define a new decorator such as `@Something()`
- teach `:create:bean` how to scaffold that scene
- add new scene-level metadata behavior
- decide whether the scene should appear in module scope resources
- decide whether the scene should contribute to the general bean registry

If you only need a new service or model bean, you do **not** need this page.

## Mental model

For most scene-based backend beans, the scene is the middle layer inside the bean identity:

- bean identifier: `{module}.{scene}.{bean}`
- onion name: `{module}:{bean}`
- scene name: the operational family such as `service`, `model`, `entity`, `dto`, or `startup`

A practical exception is the built-in global `bean` scene, whose generated global shorthand entries use the plain bean name rather than the full `module.scene.bean` pattern.

The scene is not only a naming convention. It controls several framework behaviors:

- which decorator marks the class
- where the CLI places generated files
- whether the scene contributes to scope resources
- whether the scene contributes to general bean typing
- whether scene-specific metadata generation runs

## The smallest built-in pattern

The simplest built-in scene is a thin decorator wrapper over `createBeanDecorator(...)`.

Representative pattern:

```typescript
import { createBeanDecorator } from 'vona';

export function Service(): ClassDecorator {
  return createBeanDecorator('service');
}
```

That pattern is the first authoring surface of a new scene: give the scene a stable framework name.

Some scenes use richer decorator forms with options or scene-specific post-registration behavior. A good example is `Model()`, which is implemented outside the base bean module and passes scene options through the decorator contract.

## The backend authoring surfaces

A new backend bean scene usually touches five surfaces.

### 1. Decorator surface

Define the scene decorator and export it from the owning module.

Representative built-in patterns include:

```typescript
export function Bean(): ClassDecorator {
  return createBeanDecorator('bean');
}

export function Scope(): ClassDecorator {
  return createBeanDecorator('scope');
}
```

A scene-specific decorator can live in the base bean module or in a more specialized module. For example, `Model()` is implemented in the ORM module rather than the base bean module.

### 2. Scene typing surface

Add the scene to the declaration-merging type registry.

Representative pattern:

```typescript
declare module 'vona' {
  export interface IBeanSceneRecord {
    service: never;
  }
}
```

This tells the framework and generated typings that the scene exists.

Some scenes also extend a scene-specific record in their owning module. For example, the built-in service scene contributes to `IServiceRecord` and then maps that into the broader onion surface.

### 3. Onion metadata surface

Register the scene in the owning module `package.json` under `vonaModule.onions`.

Representative built-in pattern:

```json
{
  "service": {
    "sceneIsolate": true,
    "scopeResource": true,
    "beanGeneral": true,
    "optionsGlobalInterfaceFrom": "vona-module-a-bean",
    "boilerplate": "service/boilerplate"
  }
}
```

This metadata is one of the main contracts for `:create:bean` and metadata generation.

### 4. CLI boilerplate surface

Provide the scaffold template used by `npm run vona :create:bean sceneName beanName -- --module=...`.

Representative built-in boilerplate:

```typescript
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

@Bean()
export class Bean<%=argv.beanNameCapitalize%> extends BeanBase {}
```

The important point is not the exact class body. The important point is that the scene owns a template and the CLI resolves it through the onion metadata.

### 5. Metadata generation surface

Add custom metadata generation only when the scene needs output beyond the default scene scan.

Representative built-in pattern:

```typescript
export default async function (options) {
  const { sceneName, globFiles } = options;
  // ...build declaration-merging content...
}
```

For example, the built-in `bean` scene adds `IBeanRecordGlobal` output through a custom metadata generator.

## How `vonaModule.onions` drives scene behavior

When adding a scene, the most important design step is deciding the scene flags.

### `sceneIsolate`

Use this when the scene should live in its own top-level folder rather than being mixed into `src/bean`.

Representative example:

- `service` uses `sceneIsolate: true`
- generated files live under `src/service/`

A non-isolated scene normally stays in `src/bean` using the `{scene}.{bean}` naming pattern.

### `scopeResource`

Use this when the scene should appear as a module scope resource such as `this.scope.service.student`.

If this flag is enabled, metadata generation will create module-scope typing such as:

```typescript
export interface IModuleService {
  student: ServiceStudent;
}
```

Scenes without scope-resource behavior should not set this flag just for convenience.

### `beanGeneral`

Use this when the scene should contribute to the general bean registry.

Representative generated output:

```typescript
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'demo-student.service.student': ServiceStudent;
  }
}
```

This matters for container-oriented lookup and the broader typed bean surface.

### `boilerplate`

Use this to tell the CLI which template should be used when a bean of the scene is created.

### Multiple boilerplate variants

A backend scene can expose more than one named template.

A practical rule is:

- `boilerplate` provides the default template
- `--boilerplate=web` maps to `boilerplateWeb`
- more generally, `--boilerplate=name` maps to `boilerplateName`

This is useful when one scene needs multiple scaffold shapes for distinct runtime targets or authoring paths.

Representative built-in examples include `ssrMenu` and `ssrMenuGroup`, which expose both the default template and a `web` variant in module metadata.

### `metadataCustom`

Use this only when the scene needs additional generated output that is not covered by the standard metadata passes.

A good rule is:

- start without custom metadata if the default scene wiring is enough
- add `metadataCustom` only when the scene has a real extra output contract

## Authoring flow for a new backend scene

A practical Vona scene-authoring workflow is:

1. choose the owning module for the scene
2. add the scene decorator
3. export it from the module `src/lib/index.ts`
4. add the scene declaration-merging type and export it from `src/types/index.ts`
5. add the scene under `vonaModule.onions`
6. create the scene boilerplate for `:create:bean`
7. add custom metadata generation if the scene needs extra emitted typings
8. run bean creation in a representative module
9. inspect the generated `.metadata/index.ts` output
10. only then write any additional scene-specific docs or business examples

## What generated output should prove

A new scene is usually correct only if the generated metadata proves the intended contract.

Depending on scene flags, inspect for output such as:

- declaration merging for the scene itself
- `IBeanRecordGeneral`
- module scope-resource interfaces such as `IModuleService`
- bean instance helpers such as `$beanFullName` and `$onionName`
- scope-class integration for module resource access

Representative generated service output includes:

```typescript
export interface ServiceStudent {
  get $beanFullName(): 'demo-student.service.student';
  get $onionName(): 'demo-student:student';
}
```

and:

```typescript
export interface IModuleService {
  student: ServiceStudent;
}
```

If the generated metadata does not match the scene design, fix the scene contract first rather than patching the generated output manually.

## A useful split: adding a scene vs adding a bean

Keep these two tasks separate.

### Add a bean inside an existing scene

Example:

```bash
npm run vona :create:bean service student -- --module=demo-student
```

This uses an already-defined scene.

### Add a new scene

This requires framework extension work:

- new decorator
- new scene type registration
- new onion metadata entry
- new boilerplate
- optional metadata generation

That is why this topic belongs in an advanced guide.

## Design rules for new scenes

Before adding a scene, ask these questions.

### Should the scene be isolated?

Choose an isolated scene when the scene deserves its own first-class folder and operational identity, similar to `service`.

Choose a non-isolated scene when the scene is better modeled as a bean-family variant under `src/bean`.

### Should the scene appear in module scope?

Enable scope-resource generation only when the scene should behave like a normal module resource family.

If the scene is mainly metadata, infrastructure glue, or a special registry surface, scope exposure may be the wrong contract.

### Should the scene be part of the general bean registry?

Enable `beanGeneral` only when typed global/general bean lookup is part of the intended developer surface.

### Does the scene need custom metadata?

Do not add custom generation only because it is available. Add it when the scene needs a real emitted surface beyond the default metadata pipeline.

## Relationship to existing guides

Read this guide together with:

- [Backend Foundation](/backend/foundation)
- [Backend CLI](/backend/cli)
- [Service Guide](/backend/service-guide)
- [Model Guide](/backend/model-guide)
- [Entity Guide](/backend/entity-guide)
- [Backend Startup Guide](/backend/startup-guide)

Use the basic guides for normal bean creation. Use this page only when extending the scene system itself.

## Verification checklist

When authoring or documenting a new backend scene, verify in this order:

1. confirm the CLI command shape still exists:

   ```bash
   npm run vona :create:bean --help
   ```

2. confirm the scene decorator, scene typing, and `vonaModule.onions` entry agree
3. create a test bean in a representative module
4. inspect the generated source placement
5. inspect `src/.metadata/index.ts` in that module
6. confirm scope resources and general bean output match the design
7. run the narrowest meaningful type or docs verification for the change

For repo-wide docs verification, also run:

```bash
npm run docs:build
```
