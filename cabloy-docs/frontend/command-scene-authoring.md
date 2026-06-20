# Command Scene Authoring

This guide explains how the built-in Zova `command` scene works and how to read or author command beans accurately.

Use this page when you need to answer questions such as:

- what is a Zova command bean
- when should logic live in a command bean
- how does `$performCommand(...)` resolve and execute a command
- which built-in command boilerplates already exist
- which source files should I read first to understand command behavior

This page is about the **existing** `command` scene. If you need to create a brand-new frontend bean scene instead, use [Frontend Bean Scene Authoring](/frontend/bean-scene-authoring).

## What the command scene is

In Zova, `command` is a frontend bean scene for **named command beans** that can be invoked through an onion name.

A command bean is useful when you want:

- a reusable action with a stable command name
- scene-aware logic that depends on `renderContext`
- behavior that can be triggered indirectly rather than by calling one concrete class directly
- a typed command contract that can be extended through generated metadata

A good mental model is:

- the **command scene** defines the runtime contract
- each **command bean** implements one named action
- the framework resolves the command bean from the onion name and then calls its `execute(...)` method

This is a Zova bean-scene-based action mechanism, not a generic Vue helper pattern.

## When a command bean fits well

A command bean is a good fit when the action needs one or more of these properties:

- a stable command identity such as `basic-commands:create`
- access to host-driven context such as `app`, `ctx`, `$host`, or scene-specific render information
- a reusable action surface shared across modules or UI authoring paths
- an action that should stay thin and composable instead of being buried directly inside one page or component controller

Typical examples from the current source tree include:

- page-level resource creation commands
- table-row commands that need `resource` and `id`
- form-field commands that update field state from an event
- small sync commands such as debug or logging helpers

If the behavior is only private page logic with no command identity and no reuse pressure, it may belong in the page or component controller instead.

## Public authoring surface

The public authoring surface is intentionally small.

### `@Command()`

The scene decorator is defined in:

```text
zova/src/suite-vendor/a-zova/modules/a-command/src/lib/command.ts
```

Representative source:

```typescript
export function Command<T extends IDecoratorCommandOptions>(
  options?: PowerPartial<T>,
): ClassDecorator {
  return createBeanDecorator('command', 'sys', true, options);
}
```

That confirms three important facts:

- the scene name is `command`
- command beans use the `sys` container scope
- the decorator supports options

So a command bean is a Zova system-scoped bean scene with onion options, not a one-off helper class.

### `ICommandExecute`

The main runtime contract is defined in:

```text
zova/src/suite-vendor/a-zova/modules/a-command/src/types/command.ts
```

Representative shape:

```typescript
export interface ICommandExecute {
  execute(
    options: IDecoratorCommandOptions,
    renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ): any | Promise<any>;
}
```

In practice, a command bean usually:

1. receives typed options
2. reads `renderContext` when scene-specific behavior matters
3. performs the action
4. returns `next(...)` to continue the command pipeline or pass the result forward

### Minimal command bean pattern

The default command boilerplate currently generates this shape:

```typescript
import type { IJsxRenderContextBase } from 'zova-module-a-openapi';

import { BeanBase } from 'zova';
import {
  Command,
  type ICommandExecute,
  type ICommandOptionsBase,
  type NextCommandExecute,
} from 'zova-module-a-command';

export type TypeCommandExampleResult = unknown;

export interface ICommandOptionsExample extends ICommandOptionsBase<TypeCommandExampleResult> {}

@Command<ICommandOptionsExample>()
export class CommandExample extends BeanBase implements ICommandExecute {
  execute(
    _options: ICommandOptionsExample,
    _renderContext: IJsxRenderContextBase,
    next: NextCommandExecute,
  ) {
    return next();
  }
}
```

That is the thinnest useful command-bean shape.

## Runtime invocation path

The runtime path is easiest to understand in this order:

1. `command.ts`
2. `monkey.ts`
3. `performCommand.ts`
4. downstream command beans and generated metadata

### `$performCommand(...)` is injected by monkey wiring

Read:

```text
zova/src/suite-vendor/a-zova/modules/a-command/src/monkey.ts
```

`Monkey` injects `$performCommand(...)` onto bean instances during `beanInit(...)`.

A key source-confirmed detail is that the injected method synthesizes a default render context from the host bean:

- `app`
- `ctx`
- `$host`

That means command execution naturally carries the invoking bean context even when the caller only passes partial render information.

### A practical `$performCommand(...)` call shape

Because `$performCommand(...)` is injected onto bean instances, the most natural calling style is from another bean such as a page or component controller.

A representative call shape looks like this:

```typescript
await this.$performCommand('basic-commands:create', {
  resource: 'training-student:student',
  replace: false,
});
```

A row-oriented example looks like this:

```typescript
await this.$performCommand('basic-commands:delete', {
  resource: 'training-student:student',
  id: row.id,
});
```

The important point is not the exact calling location. The important point is that the caller invokes a **command onion name**, passes typed options, and lets the command scene resolve the real bean instance and execution path.

When scene-sensitive behavior matters, the caller can also pass explicit `renderContext` or a custom `next(...)` handler. If not, the injected helper already supplies the host-driven defaults.

### Onion name resolves to the command bean

Read:

```text
zova/src/suite-vendor/a-zova/modules/a-command/src/lib/performCommand.ts
```

The core dispatch path is:

1. resolve `beanFullName` from `commandName` with `beanFullNameFromOnionName(commandName, 'command')`
2. try synchronous lookup first with `sys.bean._getBeanSyncOnly(...)`
3. if not available, fall back to async lookup with `sys.bean._getBean(...)`
4. merge decorator/onion options and call-time options through `deepExtend(...)`
5. execute the command bean through `beanInstance.execute(props, renderContext, next)`

This shows that command invocation is not a string-to-function shortcut. It is a bean-container resolution flow with command-specific typing and option merging.

### Why `next(...)` matters

`performCommand.ts` also shows that a missing `next` gets a default identity-style function.

So `next(...)` is part of the stable command contract even for simple commands:

- simple commands can just call `next()`
- commands that produce a value can pass that value to `next(res)`
- callers can supply a custom `next` to wrap or transform the result

## Built-in helper base classes

The command scene includes two helper bases for common render-context patterns.

### `BeanCommandBulkBase`

Read:

```text
zova/src/suite-vendor/a-zova/modules/a-command/src/lib/beanCommandBulkBase.ts
```

This base resolves `resource` from:

- explicit `options.resource`
- or page-scene `$celScope.resource`

If neither exists, it throws.

This makes it the right base when the command is bulk-like or page-resource-oriented and only needs a resource identity.

The `commandBulk` boilerplate reflects this shape.

### `BeanCommandRowBase`

Read:

```text
zova/src/suite-vendor/a-zova/modules/a-command/src/lib/beanCommandRowBase.ts
```

This base resolves:

- `resource`
- `id`

from either explicit options or `tableCell` render context.

If either value is missing, it throws.

This makes it the right base when the command is row-oriented and needs the current table row identity.

The `commandRow` boilerplate reflects this shape.

## Typing and metadata registration

The command scene becomes truly useful because the typing surface and generated metadata cooperate.

### Core typing surface

Read:

```text
zova/src/suite-vendor/a-zova/modules/a-command/src/types/command.ts
```

Important pieces:

- `ICommandRecord`
  - the extensible registry of command names to command option types
- `SymbolCommandResult`
  - the result-type carrier used in the command option contract
- `IDecoratorCommandOptions`
  - the base decorator options shape
- `ICommandOptionsBase`, `ICommandBulkOptionsBase`, `ICommandRowOptionsBase`
  - shared option contracts for common command patterns
- `TypeCommandOptions<K>`
  - typed command reference shape
- `ICommandExecute`
  - runtime execution contract

The same file also declaration-merges the command scene into Zova surfaces such as:

- `SysOnion`
- `ConfigOnions`
- `IBeanSceneRecord`

That confirms `command` is a first-class Zova bean scene.

### Generated metadata proves the real command names

A representative generated metadata file is:

```text
zova/src/suite/cabloy-basic/modules/basic-commands/src/.metadata/index.ts
```

From current source, this file augments `zova-module-a-command` by extending `ICommandRecord` with names such as:

- `basic-commands:create`
- `basic-commands:delete`
- `basic-commands:setValue`

It also records the related bean full names such as:

- `basic-commands.command.create`
- `basic-commands.command.delete`
- `basic-commands.command.setValue`

This is why the command scene should be read through both the source bean and the generated metadata surface.

## CLI scaffolding and boilerplate variants

The command scene is also defined by module metadata in:

```text
zova/src/suite-vendor/a-zova/modules/a-command/package.json
```

The `zovaModule.onions.command` metadata confirms:

- `beanGeneral: true`
- `optionsGlobalInterfaceName: IDecoratorCommandOptions`
- default `boilerplate`
- `boilerplateCommandBulk`
- `boilerplateCommandRow`

The CLI command shape is currently exposed by:

```text
zova/packages-cli/cli-set-front/src/lib/command/create.bean.ts
```

CLI help usage:

```bash
npm run zova :create:bean sceneName beanName -- [--module=] [--boilerplate=]
```

### Default command boilerplate

Use the default template when the command bean does not need `BeanCommandBulkBase` or `BeanCommandRowBase`:

```bash
npm run zova :create:bean command test -- --module=training-student
```

### `commandBulk` boilerplate

Use the bulk variant when the command should resolve `resource` through `BeanCommandBulkBase`:

```bash
npm run zova :create:bean command test -- --module=training-student --boilerplate=commandBulk
```

### `commandRow` boilerplate

Use the row variant when the command should resolve `resource` and `id` through `BeanCommandRowBase`:

```bash
npm run zova :create:bean command test -- --module=training-student --boilerplate=commandRow
```

For the cross-scene lookup table, also see [Bean Scene Boilerplate Variants](/reference/bean-scene-boilerplates).

## Representative built-in examples

Use the following examples when you need to understand how the command scene is used in real modules.

### `basic-commands:create`

Read:

```text
zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.create.tsx
```

Why it matters:

- extends `BeanCommandBulkBase`
- derives `resource` from options or page context
- routes through the host router to the resource-create page

This is the clearest bulk-command specimen.

### `basic-commands:delete`

Read:

```text
zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.delete.tsx
```

Why it matters:

- extends `BeanCommandRowBase`
- derives `resource` and `id`
- resolves a resource model bean and performs a mutation

This is the clearest row-command specimen.

### `basic-commands:setValue`

Read:

```text
zova/src/suite/cabloy-basic/modules/basic-commands/src/bean/command.setValue.tsx
```

Why it matters:

- extends plain `BeanBase`, not a bulk/row helper base
- checks `renderContext.$scene === 'formField'`
- uses field-scene data and event data to update form state

This is the clearest example that command beans can be scene-sensitive without fitting the resource-row patterns.

### `basic-commandssync:log`

Read:

```text
zova/src/suite/cabloy-basic/modules/basic-commandssync/src/bean/command.log.tsx
```

Why it matters:

- small synchronous command
- also uses `@Preload()`
- demonstrates that command beans can stay very small when the command contract is the important part

## A practical source-reading order

When you need to understand Zova Command quickly, use this order:

1. this guide
2. `zova/src/suite-vendor/a-zova/modules/a-command/src/lib/command.ts`
3. `zova/src/suite-vendor/a-zova/modules/a-command/src/monkey.ts`
4. `zova/src/suite-vendor/a-zova/modules/a-command/src/lib/performCommand.ts`
5. `zova/src/suite-vendor/a-zova/modules/a-command/src/types/command.ts`
6. one representative downstream metadata file such as `basic-commands/src/.metadata/index.ts`
7. one or more concrete command beans such as `command.create.tsx`, `command.delete.tsx`, `command.setValue.tsx`, or `command.log.tsx`

That path moves from public scene surface to runtime wiring to real consumer code without flattening the architecture into generic Vue terminology too early.

## Design guidance

When authoring command beans, prefer these rules:

- keep the command bean focused on one named action
- use `BeanCommandBulkBase` or `BeanCommandRowBase` only when the render-context pattern matches
- prefer explicit command identity over hidden page-local behavior when the action is meant to be reused
- keep business logic thin when it naturally belongs in a model, service, or other bean
- treat `renderContext` as part of the command contract, not as an afterthought

A command bean should usually coordinate an action cleanly, not become a dumping ground for unrelated page behavior.

## Relationship to other guides

Read this together with:

- [Frontend CLI](/frontend/cli)
- [IoC and Beans](/frontend/ioc-and-beans)
- [Frontend Bean Scene Authoring](/frontend/bean-scene-authoring)
- [Zova Source Reading Map](/frontend/zova-source-reading-map)

Use this page to understand the built-in command scene itself. Use the bean-scene authoring page when you need to design a new scene contract, not when you only need to author command beans inside the existing `command` scene.

## Verification checklist

When documenting or reviewing command-scene behavior, verify in this order:

1. confirm the CLI help still matches the documented command shape:

   ```bash
   npm run zova :create:bean --help
   ```

2. confirm these source files still match the explanation:
   - `a-command/src/lib/command.ts`
   - `a-command/src/monkey.ts`
   - `a-command/src/lib/performCommand.ts`
   - `a-command/src/lib/beanCommandBulkBase.ts`
   - `a-command/src/lib/beanCommandRowBase.ts`
   - `a-command/src/types/command.ts`
3. inspect a generated downstream `.metadata/index.ts` file to confirm current command names and bean full names
4. confirm the example command beans still demonstrate the described scene patterns
5. run the docs build for repo-level docs verification:

   ```bash
   npm run docs:build
   ```
