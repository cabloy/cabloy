# Bean Scene Boilerplate Variants

This page is the fast lookup surface for backend Vona and frontend Zova bean scenes that expose more than one CLI scaffold template.

Use it when you need to answer questions such as:

- does this bean scene support `--boilerplate=...`
- which variant names are currently defined
- where is the source module metadata for that scene

## Shared rule

Vona and Zova follow the same practical lookup rule for bean-scene boilerplate variants:

- `boilerplate` provides the default template
- `--boilerplate=web` maps to `boilerplateWeb`
- more generally, `--boilerplate=name` maps to `boilerplateName`

That means the available variants are scene-defined metadata, not a universal list shared by every scene.

A practical contributor rule is:

1. use the default template unless you know the scene exposes a named variant
2. check this page first for current built-in examples
3. if needed, verify the owning module `package.json` metadata before assuming a variant exists

## Backend Vona

### Current built-in scenes with variants

| Scene          | Default metadata key | Named variant keys  | Example command                                                                               | Source module          |
| -------------- | -------------------- | ------------------- | --------------------------------------------------------------------------------------------- | ---------------------- |
| `filter`       | `boilerplate`        | `boilerplateGlobal` | `npm run vona :create:bean filter log -- --module=demo-student --boilerplate=global`          | `vona-module-a-aspect` |
| `pipe`         | `boilerplate`        | `boilerplateGlobal` | `npm run vona :create:bean pipe log -- --module=demo-student --boilerplate=global`            | `vona-module-a-aspect` |
| `interceptor`  | `boilerplate`        | `boilerplateGlobal` | `npm run vona :create:bean interceptor log -- --module=demo-student --boilerplate=global`     | `vona-module-a-aspect` |
| `guard`        | `boilerplate`        | `boilerplateGlobal` | `npm run vona :create:bean guard auth -- --module=demo-student --boilerplate=global`          | `vona-module-a-aspect` |
| `middleware`   | `boilerplate`        | `boilerplateGlobal` | `npm run vona :create:bean middleware trace -- --module=demo-student --boilerplate=global`    | `vona-module-a-aspect` |
| `ssrMenu`      | `boilerplate`        | `boilerplateWeb`    | `npm run vona :create:bean ssrMenu menuTest -- --module=demo-student --boilerplate=web`       | `vona-module-a-ssr`    |
| `ssrMenuGroup` | `boilerplate`        | `boilerplateWeb`    | `npm run vona :create:bean ssrMenuGroup groupTest -- --module=demo-student --boilerplate=web` | `vona-module-a-ssr`    |

These backend entries come from the current `vonaModule.onions` metadata in `a-aspect` and `a-ssr`.

## Frontend Zova

### Current built-in scenes with variants

| Scene       | Default metadata key | Named variant keys                                | Example command pattern                                                                          | Source module           |
| ----------- | -------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------- |
| `command`   | `boilerplate`        | `boilerplateCommandBulk`, `boilerplateCommandRow` | `npm run zova :create:bean command test -- --module=demo-student --boilerplate=commandRow`       | `zova-module-a-command` |
| `tableCell` | `boilerplate`        | `boilerplateTableActionRow`                       | `npm run zova :create:bean tableCell test -- --module=demo-student --boilerplate=tableActionRow` | `zova-module-a-table`   |

These frontend entries come from the current `zovaModule.onions` metadata in `a-command` and `a-table`.

For the built-in command scene’s runtime model and helper-base patterns, see [Command Scene Authoring](/frontend/command-scene-authoring).

## Guidance for AI-assisted development

Do not assume every bean scene supports named variants.

For reliable AI-assisted workflow selection:

1. choose `npm run vona` for backend bean scenes and `npm run zova` for frontend bean scenes
2. check whether the current scene is listed on this page
3. if it is not listed, verify the owning module metadata before recommending `--boilerplate=...`
4. treat this page as a current built-in lookup surface, not as a promise that all future scenes will follow the same naming set

## Related guides

Use this page together with:

- [Backend CLI](/backend/cli)
- [Frontend CLI](/frontend/cli)
- [Backend Bean Scene Authoring](/backend/bean-scene-authoring)
- [Frontend Bean Scene Authoring](/frontend/bean-scene-authoring)
- [CLI Reference](/reference/cli-reference)
