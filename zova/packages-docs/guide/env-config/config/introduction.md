# Config

Zova loads config files based on multi-dimensional variables, providing a more flexible configuration mechanism and supporting more complex business scenarios.

## meta & config files

Zova loads config files from the `src/front/config/config` directory. File loading based on `meta` conditions is also supported:

```txt
config.ts                # loaded in all cases
config.[meta].ts         # only loaded in specified condition
config.local.ts           # loaded in all cases, ignored by git
config.[meta].local.ts    # only loaded in specified condition, ignored by git
```

- `[meta]` can be `any combination` of the following three variables

| Name    | Description                   |
| ------- | ----------------------------- |
| mode    | 'development' \| 'production' |
| appMode | 'spa' \| 'ssr'                |
| flavor  | 'web' \| 'admin'              |

## npm scripts

Corresponding to the multidimensional variables, the correspondence between the commands and the scripts are as follows:

```bash
$ npm run dev:ssr:admin
$ npm run build:ssr:admin
```

```json
"scripts": {
  "dev": "npm run dev:ssr:admin",
  "build": "npm run build:ssr:admin",
  "preview": "npm run preview:ssr",
  "dev:ssr:admin": "npm run prerun && quasar dev --mode ssr --flavor admin",
  "build:ssr:admin": "npm run prerun && quasar build --mode ssr --flavor admin",
  "preview:ssr": "concurrently \"node ./dist-mock/index.js\" \"node ./dist/ssr/index.js\"",
},
```

### For example

Execute `npm run dev` on the command line, then the corresponding meta variable values are:

| Name    | Value         |
| ------- | ------------- |
| mode    | 'development' |
| appMode | 'ssr'         |
| flavor  | 'admin'       |

The system will automatically load the configuration in the following files and merge them:

```txt
config.ts
config.ssr.ts
config.ssr.admin.ts
config.ssr.admin.development.ts
config.local.ts
config.ssr.local.ts
config.ssr.admin.local.ts
config.ssr.admin.development.local.ts
```

## Support Asynchronous Loading

The config files support asynchronous loading.

```typescript
export default async function (_sys: ZovaSys) {
  const config: ZovaConfigOptional = {};

  // async load remote config
  ...

  return config;
}
```

## Obtaining global config

The global config object can be obtained directly through `this.sys.config` in any bean instance.

```typescript
this.sys.config.api.baseURL;
this.sys.config.api.prefix;
```

## Obtaining module config

Modules can individually provide their own `config` configuration, which can be obtained through the `Scope` instance. See: [Config](../../essentials/scope/config.md)

## Override module config

You can use `project-level` config to override `module-level` config, see: [Config](../../essentials/scope/config.md)
