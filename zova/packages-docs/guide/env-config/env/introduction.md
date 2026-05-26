# Env

Zova loads environment files based on multi-dimensional variables, providing a more flexible configuration mechanism and supporting more complex business scenarios.

## meta & .env files

Zova uses [dotenv](https://github.com/motdotla/dotenv) to load environment variables from the following files in the directory `env`:

```txt
.env                # loaded in all cases
.env.[meta]         # only loaded in specified condition
.env.local           # loaded in all cases, ignored by git
.env.[meta].local    # only loaded in specified condition, ignored by git
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
| flavor  | 'admin'       |
| appMode | 'ssr'         |

The system will automatically load the environment variables in the following files and merge them:

```txt
.env
.env.ssr
.env.ssr.admin
.env.ssr.admin.development
.env.local
.env.ssr.local
.env.ssr.admin.local
.env.ssr.admin.development.local
```

## Tree-shaking

ZovaJS only supports tree-shaking during builds for the following environment variables:

| Name          | Description                               |
| ------------- | ----------------------------------------- |
| META_MODE     | Runtime Environment                       |
| META_APP_MODE | App Mode                                  |
| META_FLAVOR   | Flavor                                    |
| NODE_ENV      | = process.env.META_MODE                   |
| DEV           | = process.env.META_MODE === 'development' |
| PROD          | = process.env.META_MODE === 'production'  |
| SSR           | = process.env.META_APP_MODE === 'ssr'     |
| CLIENT        | Check if Client                           |
| SERVER        | Check if Server                           |

For example:

```typescript
if (process.env.DEV) {
  console.log('for development');
}
```

During builds, this is automatically converted to:

```typescript
if (false) {
  console.log('for development');
}
```

Since the condition is false, tree-shaking is performed.

## Obtaining Environment Variables

### 1. process.env

For environment variables that support tree-shaking, use `process.env`

```typescript
process.env.META_MODE;
process.env.META_APP_MODE;
process.env.META_FLAVOR;
process.env.NODE_ENV;
process.env.DEV;
process.env.PROD;
process.env.SSR;
process.env.CLIENT;
process.env.SERVER;
```

- `process.env.NODE_ENV`: For compatibility with the Node.js ecosystem only; `process.env.META_MODE` is preferred

### 2. sys.env

For environment variables that don't support tree-shaking, use `sys.env` to obtain them.

```typescript
this.sys.env.APP_NAME;
this.sys.env.APP_TITLE;
this.sys.env.APP_PUBLIC_PATH;
```

## Built-in env variables

ZovaJS provides several built-in env variables:

### Meta

| Name          | Description |
| ------------- | ----------- |
| META_MODE     | Mode        |
| META_APP_MODE | App Mode    |
| META_FLAVOR   | Flavor      |

### App

| Name               | Description                                                                    |
| ------------------ | ------------------------------------------------------------------------------ |
| APP_NAME           | App Name                                                                       |
| APP_TITLE          | App Title                                                                      |
| APP_DESCRIPTION    | App Description                                                                |
| APP_VERSION        | App Version                                                                    |
| APP_PUBLIC_PATH    | [Vite: Public Base Path](https://vitejs.dev/guide/build.html#public-base-path) |
| APP_LOCALE_DEFAULT | Default Locale                                                                 |

### Router

| Name        | Description                                                                              |
| ----------- | ---------------------------------------------------------------------------------------- |
| ROUTER_MODE | [Vue Router: History Modes](https://router.vuejs.org/guide/essentials/history-mode.html) |

### Dev Server

| Name                | Description                                                                                    |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| DEV_SERVER_HOSTNAME | Dev server host [Vite: server.host](https://vitejs.dev/config/server-options.html#server-host) |
| DEV_SERVER_PORT     | Dev server port                                                                                |

### Project

| Name                     | Description              |
| ------------------------ | ------------------------ |
| PROJECT_DISABLED_MODULES | List of disabled modules |
| PROJECT_DISABLED_SUITES  | List of disabled suites  |

### Build

| Name            | Description                         |
| --------------- | ----------------------------------- |
| BUILD_OUTDIR    | Specify the output directory        |
| BUILD_MINIFY    | Whether to enable minify            |
| BUILD_SOURCEMAP | Whether to generate sourcemap       |
| BUILD_ANALYZE   | Whether to display the analyze info |

### API

| Name         | Description           |
| ------------ | --------------------- |
| API_BASE_URL |                       |
| API_PREFIX   |                       |
| API_JWT      | Whether to enable JWT |

### Proxy

| Name               | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| PROXY_API_ENABLED  | Whether to enable proxy: [Vite: server.proxy](https://vitejs.dev/config/server-options.html#server-proxy) |
| PROXY_API_BASE_URL | proxy target                                                                                              |
| PROXY_API_PREFIX   | proxy key                                                                                                 |

### SSR

See: [SSR](../../techniques/ssr/env.md)

### Mock

See: [Mock](../../techniques/mock/introduction.md)

## Dynamic environment variables

The following are the environment variables set according to the runtime environment:

| Name   | Description    |
| ------ | -------------- |
| SSR    | If SSR mode    |
| DEV    | If Development |
| PROD   | If Production  |
| CLIENT | If Client      |
| SERVER | If Server      |
