# Config

Vona loads config files based on multi-dimensional variables, providing a more flexible configuration mechanism and supporting more complex business scenarios.

## meta & config files

Vona loads config files from the `src/backend/config/config` directory and supports file loading based on `meta` conditions:

```txt
config.ts                # loaded in all cases
config.[meta].ts         # only loaded in specified condition
config.local.ts           # loaded in all cases, ignored by git
config.[meta].local.ts    # only loaded in specified condition, ignored by git
```

- `[meta]` can be `any combination` of the following two variables

| Name   | Description                                                        |
| ------ | ------------------------------------------------------------------ |
| mode   | 'test' \|'dev' \| 'prod'                                           |
| flavor | 'normal' \|'play' \|'docker' \| 'ci' \| keyof VonaMetaFlavorExtend |

## npm scripts

Corresponding to the multidimensional variables, the correspondence between the commands and the scripts are as follows:

```bash
$ npm run test
$ npm run dev
$ npm run build
$ npm run build:docker
```

```json
"scripts": {
  "test": "vona :bin:test --flavor=normal",
  "dev": "vona :bin:dev --flavor=normal",
  "build": "vona :bin:build --flavor=normal",
  "build:docker": "vona :bin:build --flavor=docker",
}
```

### For example

Execute `npm run dev` on the command line, then the corresponding meta variable values are:

| Name   | Value    |
| ------ | -------- |
| mode   | 'dev'    |
| flavor | 'normal' |

The system will automatically load the configuration in the following files and merge them:

```txt
config.ts
config.normal.ts
config.normal.dev.ts
config.local.ts
config.normal.local.ts
config.normal.dev.local.ts
```

## Support Asynchronous Loading

The config files support asynchronous loading.

```typescript
export default async function (app: VonaApplication) {
  const config: VonaConfigOptional = {};

  // async load remote config
  ...

  return config;
}
```

## Obtaining global config

The global config object can be obtained directly through `this.app.config` in any bean instance.

```typescript
this.app.config.server.globalPrefix;
this.app.config.database.defaultClient;
```

## Obtaining instance config

The instance config object can be obtained directly through `this.ctx.config` in any bean instance.

```typescript
this.ctx.config.server.serve.protocol;
this.ctx.config.server.serve.host;
```

## Obtaining module config

Modules can individually provide their own `config` configuration, which can be obtained through the `Scope` instance. See: [Config](../../essentials/scope/config.md)

```typescript
this.scope.config.title;
this.$scope.homeIndex.config.title;
```

## Override module config

You can use `project-level` config to override `module-level` config, see: [Config](../../essentials/scope/config.md)

`src/backend/config/config/config.ts`

```typescript
// modules
config.modules = {
  'home-index': {
    title: 'Hello World!!',
  },
};
```
